// .eslintrc.js
module.exports = {
	plugins: [
		'@typescript-eslint',
		'@stylistic',
		'@stylistic/ts'
	],
	parser: '@typescript-eslint/parser',
	rules: {
		'@stylistic/ts/indent': ['error', 'tab'],
		'@stylistic/ts/quotes': ['warn', 'single'],
		'@stylistic/ts/semi': ['error', 'always'],
		'@stylistic/ts/block-spacing': ['error', 'always'],
		'@stylistic/ts/brace-style': ['error', '1tbs', { allowSingleLine: true }],
		'@stylistic/ts/no-extra-semi': 'error',
		'@stylistic/ts/comma-dangle': 'warn',
		'@stylistic/ts/lines-around-comment': ['error', { beforeBlockComment: true, beforeLineComment: true }],
		'@stylistic/ts/comma-spacing': ['error', { before: false, after: true }],

		// '@stylistic/ts/space-before-function-paren': ['error', 'never'],
		'@stylistic/ts/space-before-blocks': ['error', 'always'],
		'@stylistic/ts/type-annotation-spacing': ['error', { before: false, after: true }],
		'@stylistic/space-before-blocks': 'warn'
	}
};