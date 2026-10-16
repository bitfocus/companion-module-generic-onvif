import { generateEslintConfig } from '@companion-module/tools/eslint/config.mjs'

const baseConfig = await generateEslintConfig({})

export default [
	...baseConfig,
	{
		// The module source is ESM ("type": "module" in package.json)
		files: ['src/**/*.js'],
		languageOptions: {
			sourceType: 'module',
		},
	},
]
