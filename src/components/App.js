import styles from './App.css';
import { Component } from 'preact';
import { Chart } from 'react-google-charts';
import d from 'debug';
import debounce from 'debounce';
import { CubeGrid } from 'better-react-spinkit';
import classNames from 'classnames/bind';
import { route } from 'preact-router';

const cx = classNames.bind(styles);

const debug = d('wdys');

export default class App extends Component {
	handleInput = ev => {
		let input = ev.target.value;
		this.setState({ input });
		route(
			`/${input
				.split(' ')
				.map(encodeURIComponent)
				.join('+')}`
		);
		let word = input
			.trim()
			.toLowerCase()
			.replace(/[.,\\/#!$%\\^&\\*;:{}=\-_`~()\\?]/g, '');
		if (word !== this.state.word) {
			this.fetchData.clear();
			if (word === '') {
				this.setState({ loading: false, data: null });
			}
			else {
				this.setState({ loading: true });
				this.fetchData(word);
			}
		}
	};

	fetchData = word => {
		let replacer = new RegExp(`(^|\\B)${word}\\B`);

		fetch(
			`https://us-central1-whatdoyousugges.cloudfunctions.net/suggestions/?q=${encodeURIComponent(
				word
			)}`
		)
			.then(res => res.json())
			.then(data => data.map(phrase => phrase.replace(replacer, word + ' ⇢ ')))
			.then(data => this.setState({ data, word, loading: false }));
	};
	constructor() {
		super();
		this.fetchData = debounce(this.fetchData, 1500);
	}

	componentWillMount() {
		let { word } = this.props;
		word = word.replace(/\+/g, ' ');
		if (word) {
			this.setState({ input: word, loading: true });
			this.fetchData(word);
		}
	}

	render(props, { data, word, loading, input }) {
		debug(['Phrases'].concat(data), word);
		return (
			<div className={cx('container')}>
				<div>
					<h1 className={cx('title')}>WDYS</h1>
					<input
						className={cx('input', { chartVisible: loading || data })}
						type="text"
						placeholder="Suggest this ..."
						onKeyup={this.handleInput}
						value={input}
					/>
				</div>
				<div>
					{loading && <CubeGrid className={cx('loader')} size={100} />}
					{!loading && data && data.length === 0 ? (
						<p className={cx('noSuggestions')}>
							{'Tragically, there are no suggestions for this search.'}
						</p>
					) : null}
					{!loading && data && data.length ? (
						<Chart
							chartType="WordTree"
							data={[['Phrases']].concat(data.map(d => [d]))}
							options={{
								wordtree: {
									format: 'implicit',
									type: 'double',
									word: word.split(' ').pop()
								}
							}}
							width="100%"
							height="400px"
							loader={<span style="display:none;" />}
						/>
					) : null}
				</div>
				<p className={cx('attribution')}>
					{'A resurected project by '}
					<a href="https://twitter.com/drzax">
						drzax
					</a> (<a href="https://github.com/drzax/whatdoyousuggest.net">
						code
					</a>{' '}
					|{' '}
					<a href="https://elvery.net/drzax/tag/google-suggest">
						explanation
					</a>).
				</p>
			</div>
		);
	}
}
