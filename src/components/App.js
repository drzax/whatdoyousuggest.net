import styles from './App.css';
import { Component } from 'preact';
import d from 'debug';
import debounce from 'debounce';
import classNames from 'classnames/bind';
import { route } from 'preact-router';
import LocationSelector from './LocationSelector';
import { CubeGrid } from 'better-react-spinkit';
import WordTree from './WordTree';

const cx = classNames.bind(styles);
const debug = d('wdys:App');
const url2input = str => decodeURIComponent(str).replace(/\+/g, ' ');
const input2url = str =>
	str
		.split(' ')
		.map(encodeURIComponent)
		.join('+');
const sanitiseTerm = str =>
	str
		.toLowerCase()
		.replace(/[.,\\/#!$%\\^&\\*;:{}=\-_`~()\\?]/g, '')
		.replace(/\+/g, ' ');
export default class App extends Component {
	handleInput = ev => {
		let input = ev.target.value;
		let term = sanitiseTerm(input);
		debug('handleInput', { ev, input, term });
		this.setState({ input });

		route(`/${input2url(term)}`);
	};

	handleLocationChange = location => {
		debug('location', location);
		localStorage.location = location.code;
		this.updateChart(this.state.term, location.code);
	};

	currentRequest = null;

	updateChart = (term, location = 'us') => {
		if (!term || term.length === 0) {
			return this.setState({ data: null, loading: false });
		}

		if (term === this.state.term && location === this.state.location) {
			return this.setState({ location });
		}

		this.setState({ loading: true, term, location });
		this.fetchit(term, location);
	};

	fetchit = debounce((term, location) => {
		let replacer = new RegExp(`(^|\\B)${term}\\B`);
		let url = `/.netlify/functions/query?q=${encodeURIComponent(
			term
		)}&gl=${location}`;

		this.currentRequest = url;
		fetch(url)
			.then(res => res.json())
			.then(data => data.map(phrase => phrase.replace(replacer, term + ' ⇢ ')))
			.then(data => {
				if (this.currentRequest === url) {
					debug('Data loaded; refreshing chart', { data });
					this.setState({ data, loading: false });
				}
				else {
					debug('Stale data', { data });
				}
			});
	}, 200);

	componentWillMount() {
		debug('componentWillMount', this.props);
		let term = sanitiseTerm(this.props.term);
		this.setState({ input: url2input(term) });
		this.updateChart(term, (typeof window !== 'undefined') ? localStorage.location : undefined);
	}

	componentDidMount() {
		this.queryInput.focus();
	}

	componentWillReceiveProps(newProps) {
		debug('componentWillReceiveProps', { newProps });
		this.updateChart(sanitiseTerm(newProps.term), (typeof window !== 'undefined') ? localStorage.location : undefined);
	}

	render(props, { data, term, loading, input, location }) {
		debug('render', { data, term, loading, input, location });
		return (
			<div className={cx('container')}>
				<h1 className={cx('title')}>WDYS?</h1>
				<div className={cx('inputContainer')}>
					<input
						className={cx('input', {
							chartVisible: loading || data
						})}
						type="text"
						placeholder="Suggest this ..."
						onInput={this.handleInput}
						value={input}
						ref={node => (this.queryInput = node)}
					/>
				</div>
				<div className={cx('chart')}>
					{loading ? (
						<CubeGrid className={cx('loader')} size={100} />
					) : (
						<WordTree data={data} term={term} />
					)}
				</div>
				<div className={cx('attribution')}>
					<p>
						{'A resurrected experiment by '}
						<a href="https://twitter.com/drzax">
							drzax
						</a> (<a href="https://github.com/drzax/whatdoyousuggest.net">
							code
						</a>{' '}
						| <a href="https://elvery.net/drzax/tag/wdys">explanation</a>).
					</p>
				</div>
				<div className={cx('options')}>
					<LocationSelector
						className={cx('locationSelector')}
						value={location}
						default="US"
						handleLocationChange={this.handleLocationChange}
					/>
				</div>
			</div>
		);
	}
}
