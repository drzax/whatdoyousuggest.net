import App from './components/App';
import Router from 'preact-router';

export default () => (
	<Router>
		<App path="/:word?" />
	</Router>
);
