import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import { Button, Paper } from '@material-ui/core'

import './styles.css'
import Ticker from './Ticker'
import Upgrade from './Upgrade'
const typeBase = {
	name: 'GIVE ME A NAME',
	count: 0,
	max: 15,
	multiplier: 0.001,
	cost: 1,
	level: 1
}

const updateState = ({ cost, updatedTypes, state }) => ({
	multiplier: updatedTypes.reduce(
		(m, t) => m + t.count * t.multiplier * t.level,
		0
	),
	amount: state.amount - cost,
	types: updatedTypes
})

class App extends React.PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			isDebug: location.hostname.indexOf('codesandbox' !== -1),
			amount: 10,
			multiplier: 0,
			resourceType: 'cans of food',
			types: [
				{ ...typeBase, name: 'Wastelander' },
				{
					...typeBase,
					name: 'Wounded Warrior',
					cost: 10,
					multiplier: 0.01
				}
			]
		}
	}
	componentDidMount() {
		this.startLoop()
	}

	componentWillUnmount() {
		this.stopLoop()
	}

	startLoop() {
		if (!this._frameId) {
			this._frameId = window.requestAnimationFrame(this.loop(this))
		}
	}

	loop(scope) {
		return () => {
			scope.setState(state => ({
				...state,
				amount: state.amount + 1 * state.multiplier
			}))
			scope._frameId = window.requestAnimationFrame(scope.loop(scope))
		}
	}

	stopLoop() {
		window.cancelAnimationFrame(this._frameId)
		// Note: no need to worry if the loop has already been cancelled
		// cancelAnimationFrame() won't throw an error
	}

	increase(type) {
		this.setState(state => {
			const updatedTypes = state.types.map(
				t => (t.name === type.name ? { ...t, count: t.count + 1 } : t)
			)
			const updatedType = updatedTypes.find(t => t.name === type.name)
			const cost = updatedType.cost
			return {
				...state,
				...updateState({ cost, updatedTypes, state })
			}
		})
	}
	level(type) {
		this.setState(state => {
			const updatedTypes = state.types.map(
				t => (t.name === type.name ? { ...t, level: t.level + 1 } : t)
			)
			const updatedType = updatedTypes.find(t => t.name === type.name)
			const cost = type.cost * type.level * 10
			return {
				...state,
				...updateState({ cost, updatedTypes, state })
			}
		})
	}

	canBuy(type) {
		return this.state.amount - type.cost <= 0
	}

	canLevel(type) {
		return this.state.amount - type.cost * type.level * 10 <= 0
	}

	render() {
		return (
			<div className="App">
				<Ticker
					amount={this.state.amount}
					resourceType={this.state.resourceType}
				/>
				<div className="type-container">
					{this.state.types.map(type => (
						<Upgrade
							type={type}
							canBuy={type => this.canBuy(type)}
							canLevel={type => this.canLevel(type)}
							level={type => this.level(type)}
							increase={type => this.increase(type)}
							resourceType={this.state.resourceType}
						/>
					))}
				</div>
				{this.state.isDebug ? (
					<div className="debug">
						<span>r:{this.state.multiplier}</span>
						<span>t:{this.state.amount}</span>
					</div>
				) : null}
			</div>
		)
	}
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
