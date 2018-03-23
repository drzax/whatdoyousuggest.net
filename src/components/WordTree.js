import styles from './WordTree.css';
import { Chart } from 'react-google-charts';
import classNames from 'classnames/bind';
import d from 'debug';
import leven from 'leven';
const cx = classNames.bind(styles);
const debug = d('wdys:WordTree');

export default function WordTree({ data, term }) {
	debug('render', { data, term });

	if (!data) {
		return null;
	}

	if (data.length === 0) {
		return (
			<p className={cx('noSuggestions')}>
				{'Tragically, there are no suggestions for this search.'}
			</p>
		);
	}

	let chartData = [['Phrases']].concat(data.map(d => [d]));
	// TODO: Guard against word not being in tree by doing string distance on all words and choosing closest
	let chartTerm = term
		.trim()
		.split(' ')
		.pop();
	let words = data
		.reduce((acc, d) => acc.concat(d.split(' ')), [])
		.filter((d, i, arr) => arr.indexOf(d) === i);
	if (words.indexOf(chartTerm) === -1) {
		chartTerm = words
			.map(d => ({ word: d, dist: leven(d, term) }))
			.sort((a, b) => b.dist - a.dist)
			.pop().word;
	}

	debug('chartData', { chartData, chartTerm });

	return (
		<Chart
			chartType="WordTree"
			data={chartData}
			options={{
				wordtree: {
					format: 'implicit',
					type: 'double',
					word: chartTerm
				}
			}}
			width="100%"
			height="400px"
			loader={<span style="display:none;" />}
		/>
	);
}
