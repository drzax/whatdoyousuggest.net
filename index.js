import './style';
import { Component } from 'preact';
import { Chart } from 'react-google-charts';
import d from 'debug';
import debounce from 'debounce';
import { CubeGrid } from 'better-react-spinkit';

const debug = d('wdys');

export default class App extends Component {
	handleInput = ev => {
		let word = ev.target.value;
		if (word !== this.state.word) {
			this.setState({ loading: true });
			this.fetchData.clear();
			this.fetchData(word);
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
		this.fetchData = debounce(this.fetchData, 2000);
	}

	componentDidMount() {}

	render(props, { data, word, loading }) {
		debug(['Phrases'].concat(data), word);
		return (
			<div>
				<input
					type="text"
					placeholder="Suggest this ..."
					onKeyup={this.handleInput}
				/>
				{loading && <CubeGrid />}
				{data ? (
					<Chart
						chartType="WordTree"
						data={[['Phrases']].concat(data.map(d => [d]))}
						options={{
							wordtree: { format: 'implicit', type: 'double', word }
						}}
						width="100%"
						height="400px"
					/>
				) : null}
			</div>
		);
	}
}
