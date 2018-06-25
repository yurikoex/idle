import React from 'react'
import ReactDOM from 'react-dom'

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
	...state,
	multiplier: updatedTypes.reduce(
		(m, t) => m + t.count * t.multiplier * t.level,
		0
	),
	amount: state.amount - cost,
	types: updatedTypes
})

const increaseCost = ({ state, type }) =>
	type.level * type.cost * type.count * state.increaseCostMultiplier + type.cost

const levelCost = ({ state, type }) =>
	type.cost * type.level * state.levelCostMultiplier

const defaultState = () => ({
	lastTick: new Date().getTime(),
	levelCostMultiplier: 1000,
	increaseCostMultiplier: 1.5,
	isDebug: window.location.hostname.indexOf('codesandbox' !== -1),
	amount: 10,
	maxAmount: 0,
	multiplier: 0,
	resourceType: 'cans of food',
	types: [
		{ ...typeBase, name: 'Wastelander' },
		{
			...typeBase,
			name: 'Wounded Warrior',
			cost: 10,
			multiplier: 0.01
		},
		{
			...typeBase,
			name: 'Mutatoe',
			cost: 100,
			multiplier: 0.1
		}
	]
})
class App extends React.PureComponent {
	constructor(props) {
		super(props)
		const ls = window.localStorage.getItem('state')
		ls ? (this.state = JSON.parse(ls)) : (this.state = defaultState())
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
			scope.setState(state => {
				const newAmount = state.amount + 1 * state.multiplier
				const newState = {
					...state,
					amount: newAmount,
					maxAmount: state.maxAmount < newAmount ? newAmount : state.maxAmount
				}

				window.localStorage.setItem('state', JSON.stringify(newState))
				return newState
			})
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
			const cost = increaseCost({ state, type })
			const updatedTypes = state.types.map(
				t => (t.name === type.name ? { ...t, count: t.count + 1 } : t)
			)
			return updateState({ cost, updatedTypes, state })
		})
	}

	level(type) {
		this.setState(state => {
			const cost = levelCost({ state, type })
			const updatedTypes = state.types.map(
				t => (t.name === type.name ? { ...t, level: t.level + 1 } : t)
			)
			return updateState({ cost, updatedTypes, state })
		})
	}

	canBuy(type) {
		return this.state.amount - increaseCost({ state: this.state, type }) <= 0
	}

	canLevel(type) {
		return this.state.amount - levelCost({ state: this.state, type }) <= 0
	}

	reset() {
		this.setState(defaultState())
	}

	render() {
		return (
			<div className="App">
				<Ticker
					amount={this.state.amount}
					resourceType={this.state.resourceType}
				/>
				<div className="type-container">
					{this.state.types
						.filter(t => t.cost < this.state.maxAmount)
						.map(type => (
							<Upgrade
								type={type}
								canBuy={type => this.canBuy(type)}
								canLevel={type => this.canLevel(type)}
								level={type => this.level(type)}
								increase={type => this.increase(type)}
								resourceType={this.state.resourceType}
								increaseCost={increaseCost({ state: this.state, type })}
								levelCost={levelCost({ state: this.state, type })}
							/>
						))}
				</div>
				{this.state.isDebug ? (
					<div className="debug">
						<button onClick={() => this.reset()}>reset</button>
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
