import { Component } from 'preact';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { codes as isoCountryCodes } from 'iso-country-codes';

const modifiedCountryNames = {
	US: 'United States of America',
	GB: 'United Kingdom',
	RU: 'Russia'
};

const g20 = [
	'AR',
	'AU',
	'BR',
	'CA',
	'CN',
	'FR',
	'DE',
	'IN',
	'ID',
	'IT',
	'JP',
	'MX',
	'RU',
	'SA',
	'ZA',
	'KR',
	'TR',
	'GB',
	'US'
];

const countryData = isoCountryCodes
	.map(d => ({
		name: modifiedCountryNames[d.alpha2] || d.name,
		code: d.alpha2
	}))
	.filter(d => g20.indexOf(d.code) > -1);

export default class LocationSelector extends Component {
	countryDataByCode = code => {
		let defaultCode = this.props.default || 'US';
		return (
			countryData.find(d => d.code === code) ||
			countryData.find(d => d.code === defaultCode)
		);
	};

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

	render({ className, value }) {
		let current = this.countryDataByCode(value);
		return (
			<div className={className}>
				<FlatButton
					label={current ? current.code : countryData[0].code}
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
						maxHeight={250}
						onChange={this.handleSelection}
						value={current}
						children={countryData.map(option => (
							<MenuItem primaryText={option.name} value={option} />
						))}
					/>
				</Popover>
			</div>
		);
	}
}
