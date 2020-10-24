/**
 * Tool: i18next-parser
 * Translation script generator configuration
 * @link https://github.com/i18next/i18next-parser#options
 */
module.exports = {
	locales: ['en', 'es', 'fr', 'it', 'kr', 'ru', 'sv', 'ua', 'vi', 'zh-tw'],
	output: 'App/localization/namespaces/$LOCALE@$NAMESPACE.json',
	input: ['App/Screens/**/*.tsx', 'App/components/**/*.tsx'],
	defaultNamespace: 'components',
	verbose: true,
	sort: true,
};
