import { Component } from 'preact';
import { tree } from 'd3-hierarchy';

export default class Tree extends Component {
	render(props, { width, height }) {
		return <svg width={width || 100} height={height || 100} />;
	}
}

class Node extends Component {
	render() {}
}

class Link extends Component {
	render() {}
}
