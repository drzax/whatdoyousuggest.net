import styles from './App.css';
import { Component } from 'preact';
import d from 'debug';
import debounce from 'debounce';
import classNames from 'classnames/bind';
import { route } from 'preact-router';
import LocationSelector from './LocationSelector';
import { CubeGrid } from 'better-react-spinkit';
import WordTree from './WordTree';
import { codes as isoCountryCodes } from 'iso-country-codes';

const modifiedCountryNames = {
	US: 'United States of America',
	GB: 'United Kingdom'
};
const countriesToDisplay = ['AU', 'US', 'GB', 'DK', 'AR', 'NZ'];
const countryData = isoCountryCodes
	.map(d => ({
		name: modifiedCountryNames[d.alpha2] || d.name,
		code: d.alpha2
	}))
	.filter(d => countriesToDisplay.indexOf(d.code) > -1);
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
const getUserCountryCode = () =>
	fetch('http://freegeoip.net/json/')
		.then(res => res.json())
		.then(json => json.country_code);
const countryDataByCode = code => countryData.find(d => d.code === code);

const debouncedFetch = debounce(fetch, 200);

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
		this.updateChart(this.state.term, location);
	};

	currentRequest = null;

	updateChart = (term, location) => {
		if (!term || term.length === 0) {
			return this.setState({ data: null, loading: false });
		}

		if (term === this.state.term && location === this.state.location) {
			return;
		}

		this.setState({ loading: true, term, location });

		this.fetchit(term, location);
	};

	fetchit = debounce((term, location) => {
		let replacer = new RegExp(`(^|\\B)${term}\\B`);
		let url = `https://us-central1-whatdoyousugges.cloudfunctions.net/suggestions/?q=${encodeURIComponent(
			term
		)}&gl=${location.code}`;

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

	async componentWillMount() {
		// document.title = 'WDYS?';
		debug('componentWillMount', this.props);
		let term = sanitiseTerm(this.props.term);
		let input = url2input(term);
		let location =
			countryDataByCode(
				localStorage.location || (await getUserCountryCode())
			) || countryDataByCode('AU');
		this.setState({ input });
		this.updateChart(term, location);
	}

	componentWillReceiveProps(newProps) {
		debug('componentWillReceiveProps', { newProps });
		this.updateChart(
			sanitiseTerm(newProps.term),
			countryDataByCode(localStorage.location)
		);
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
						{'A resurected experiment by '}
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
						options={countryData}
						handleLocationChange={this.handleLocationChange}
					/>
				</div>
			</div>
		);
	}
}
