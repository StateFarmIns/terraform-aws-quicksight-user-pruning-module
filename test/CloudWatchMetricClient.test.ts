import { CloudWatchClient, MetricDatum, PutMetricDataCommand } from '@aws-sdk/client-cloudwatch'
import { mockClient } from 'aws-sdk-client-mock'
import { CloudWatchMetricClient } from '../src/CloudWatchMetricClient'

const cloudWatchMetricClient: CloudWatchMetricClient = new CloudWatchMetricClient()
const cloudWatchMock = mockClient(CloudWatchClient)

process.env.AWS_LAMBDA_FUNCTION_NAME = 'MyFunctionName'

afterEach(() => {
	cloudWatchMetricClient['metricData'] = []
	cloudWatchMock.reset()
})

describe('CloudWatchMetricClient', () => {
	describe('successful when', () => {
		it('queues a metric for publishing', () => {
			const metricDatum: MetricDatum = { MetricName: 'UsersDeleted', Value: 100 }
			cloudWatchMetricClient.queueMetric(metricDatum)
			expect(cloudWatchMetricClient['metricData']).toStrictEqual([metricDatum])
		})

		it('queues multiple metrics for publishing', () => {
			const metricDatum: MetricDatum = { MetricName: 'UsersDeleted', Value: 100 }
			cloudWatchMetricClient.queueMetric(metricDatum)

			const metricDatumTwo: MetricDatum = { MetricName: 'PriorUsers', Value: 200 }
			cloudWatchMetricClient.queueMetric(metricDatumTwo)

			expect(cloudWatchMetricClient['metricData']).toStrictEqual([metricDatum, metricDatumTwo])
		})

		it('emits a single metric', async () => {
			const metricDatum: MetricDatum = { MetricName: 'UsersDeleted', Value: 100 }
			cloudWatchMetricClient.queueMetric(metricDatum)

			cloudWatchMock.on(PutMetricDataCommand).resolves({})

			await cloudWatchMetricClient.emitQueuedMetrics()

			expect(cloudWatchMock.calls()).toHaveLength(1)
			expect(cloudWatchMock.call(0).args[0].input).toStrictEqual({ Namespace: process.env.AWS_LAMBDA_FUNCTION_NAME, MetricData: [metricDatum] })
		})

		it('emits multiple metrics', async () => {
			const metricDatum: MetricDatum = { MetricName: 'UsersDeleted', Value: 100 }
			cloudWatchMetricClient.queueMetric(metricDatum)

			const metricDatumTwo: MetricDatum = { MetricName: 'PriorUsers', Value: 200 }
			cloudWatchMetricClient.queueMetric(metricDatumTwo)

			cloudWatchMock.on(PutMetricDataCommand).resolves({})

			await cloudWatchMetricClient.emitQueuedMetrics()

			expect(cloudWatchMock.calls()).toHaveLength(1)
			expect(cloudWatchMock.call(0).args[0].input).toStrictEqual({ Namespace: process.env.AWS_LAMBDA_FUNCTION_NAME, MetricData: [metricDatum, metricDatumTwo] })
		})
	})

	describe('fails when', () => {
		// Intentionally we don't handle errors in the Lambda, so just checking to make sure that it bubbles up the exception
		it('receives a cloudwatch client error', async () => {
			const error: Error = { name: 'MyError', message: 'Oh no!' }
			cloudWatchMock.on(PutMetricDataCommand).rejects(error)

			await expect(cloudWatchMetricClient.emitQueuedMetrics()).rejects.toThrow(error)
		})
	})
})