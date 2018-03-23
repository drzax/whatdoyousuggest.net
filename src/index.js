import App from './components/App';
import Router from 'preact-router';
import MultiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default () => (
	<MultiThemeProvider>
		<Router>
			<App path="/:term?" />
		</Router>
	</MultiThemeProvider>
);
