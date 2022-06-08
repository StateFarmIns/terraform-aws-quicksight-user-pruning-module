/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
	packageManager: 'yarn',
	reporters: ['html', 'clear-text', 'progress'],
	testRunner: 'jest',
	coverageAnalysis: 'perTest',
	thresholds: { high: 97, low: 94, break: 90 },
	checkers: ['typescript'],
	tsconfigFile: 'tsconfig.json',
	timeoutMS: 15000,
	ignoreStatic: true
}
