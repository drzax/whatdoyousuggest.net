import { Component } from 'preact';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

export default class LocationSelector extends Component {
	state = {
		open: false
	};

	handleSelection = (ev, val) => {
		this.handleRequestClose();
		this.props.handleLocationChange(val);
	};

	handleClick = event => {
		// This prevents ghost click.
		event.preventDefault();

		this.setState({
			open: true,
			anchorEl: event.currentTarget
		});
	};

	handleRequestClose = () => {
		this.setState({
			open: false
		});
	};

	render({ className, value, options }) {
		return (
			<div className={className}>
				<FlatButton
					label={value ? value.code : options[0].code}
					onClick={this.handleClick}
				/>
				<Popover
					open={this.state.open}
					anchorEl={this.state.anchorEl}
					anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
					targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}
					onRequestClose={this.handleRequestClose}
				>
					<Menu
						autoWidth
						onChange={this.handleSelection}
						value={value}
						children={options.map(option => (
							<MenuItem primaryText={option.name} value={option} />
						))}
					/>
				</Popover>
			</div>
		);
	}
}
