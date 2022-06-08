import { CloudWatchClient, MetricDatum, PutMetricDataCommand } from '@aws-sdk/client-cloudwatch'

export class CloudWatchMetricClient {
	private metricData: MetricDatum[] = []
	private cloudWatchClient = new CloudWatchClient({})

	// Normally we'd worry about max metric data per request but the max is currently 20 and we won't be publishing that many metrics
	public queueMetric(metricDatum: MetricDatum) {
		this.metricData.push(metricDatum)
	}

	public async emitQueuedMetrics() {
		const putMetricDataCommand = new PutMetricDataCommand({
			Namespace: process.env.AWS_LAMBDA_FUNCTION_NAME,
			MetricData: this.metricData,
		})

		// Stryker disable next-line all "I do not care about mutating console statements"
		console.debug(`Emitting metrics:\n${JSON.stringify(putMetricDataCommand.input, null, 2)}`)

		await this.cloudWatchClient.send(putMetricDataCommand)

		this.metricData = []
	}
}