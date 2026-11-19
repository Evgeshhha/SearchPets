import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
	palette: {
		primary: { main: '#3b6e1dc3' },
		secondary: { main: '#6fd1ba' },
		background: { default: '#faf7f2' },
	},
	shape: { borderRadius: 12 },
	typography: {
		fontFamily: 'Roboto, Arial, sans-serif',
		h4: { fontWeight: 700 },
	},
});