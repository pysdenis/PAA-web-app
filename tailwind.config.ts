
export default {
	content: [
		"./src/**/*.{html,js,svelte,ts}"
	],
	theme: {
		extend: {
		}
	},
	darkMode: 'class',
	plugins: [
		require('@tailwindcss/forms')
	]
};
