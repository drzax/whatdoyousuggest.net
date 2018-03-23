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
	// TODO: maybe use the regex specified here to split the words / phrases https://developers.google.com/chart/interactive/docs/gallery/wordtree#tokenizing-sentences
	let words = data
		.reduce((acc, d) => acc.concat(d.split(' ')), [])
		.filter((d, i, arr) => arr.indexOf(d) === i);

	if (words.indexOf(chartTerm) === -1) {
		chartTerm = words
			.map(d => ({ word: d, dist: leven(d, term) }))
			.sort((a, b) => b.dist - a.dist)
			.pop().word;
	}

	let firstWords = data
		.map(d => d.split(' '))
		.filter(d => d.indexOf(chartTerm) > -1 && d[0] !== chartTerm);

	debug('words', { words, firstWords });
	debug('chartData', { chartData, chartTerm });

	return (
		<div className={cx(firstWords.length > 0 ? 'double' : 'suffix')}>
			<Chart
				chartType="WordTree"
				data={chartData}
				options={{
					wordtree: {
						format: 'implicit',
						type: firstWords.length > 0 ? 'double' : 'suffix',
						word: chartTerm
					}
				}}
				width="100%"
				height="400px"
				loader={<span style="display:none;" />}
			/>
		</div>
	);
}
