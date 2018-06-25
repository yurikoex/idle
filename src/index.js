import React from 'react'
import ReactDOM from 'react-dom'
import { Button } from '@material-ui/core'
import config from './config'
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

const resetValue = [
	{
		resetLevel: 0,
		resetCost: 1000,
		resetName: 'Tent Camp',
		resourceType: 'Scraps'
	},
	{
		resetLevel: 1,
		resetCost: 10000,
		resetName: 'Abandon Building',
		resourceType: 'Cans of food'
	},
	{
		resetLevel: 2,
		resetCost: 100000,
		resetName: 'Gated Neighborhood',
		resourceType: 'Bullets'
	},
	{
		resetLevel: 3,
		resetCost: 1000000,
		resetName: 'Military Base',
		resourceType: 'Gold'
	},
	{
		resetLevel: 4,
		resetCost: 10000000,
		resetName: 'New World City',
		resourceType: 'Cash'
	},
	{
		resetLevel: 5,
		resetCost: 100000000,
		resetName: 'Metropolis',
		resourceType: 'eBits'
	},
	{
		resetLevel: 6,
		resetCost: 1000000000,
		resetName: 'Space Station Alpha',
		resourceType: 'Galaxy Creds'
	},
	{
		resetLevel: 7,
		resetCost: 10000000000,
		resetName: 'Ethereal Plane',
		resourceType: 'Chi'
	}
]

const getReset = (level = 0) => {
	return resetValue[level]
}
const defaultState = (level = 0) => ({
	...getReset(level),
	...config,
	lastTick: new Date().getTime(),
	levelCostMultiplier: 1000,
	increaseCostMultiplier: 1.5,
	isDebug: window.location.hostname.indexOf('codesandbox') !== -1,
	amount: 10,
	maxAmount: 0,
	multiplier: 0,
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
		},
		{
			...typeBase,
			name: 'Elite',
			cost: 1000,
			multiplier: 1
		},
		{
			...typeBase,
			name: 'Heroe',
			cost: 10000,
			multiplier: 10
		}
	]
})
class App extends React.PureComponent {
	constructor(props) {
		super(props)
		const ls = window.localStorage.getItem('state')
		if (ls) {
			const savedState = JSON.parse(ls)
			if (savedState.version === config.version)
				this.state = {
					...savedState,
					amount:
						savedState.amount +
						(new Date().getTime() - savedState.lastTick) / 1000
				}
			else this.state = defaultState(savedState.resetLevel)
		} else this.state = defaultState()
		console.log(this.state)
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
					lastTick: new Date().getTime(),
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

	canReset() {
		return this.state.amount - this.state.resetCost <= 0
	}

	reset(level = 0) {
		console.log(level)
		this.setState(defaultState(level))
	}

	render() {
		return (
			<div className="App">
				<div className="reset">{this.state.resetName}</div>
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
				{this.state.resetCost < this.state.maxAmount ? (
					<Button
						className="resetWorld"
						disabled={this.canReset()}
						onClick={() => this.reset(this.state.resetLevel + 1)}
					>
						move to {getReset(this.state.resetLevel + 1).resetName}(<strong>
							reset
						</strong>)
					</Button>
				) : null}
				{this.state.isDebug ? (
					<div className="debug">
						<button style={{ width: 50 }} onClick={() => this.reset()}>
							reset
						</button>

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
