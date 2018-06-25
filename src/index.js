import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import { Button } from '@material-ui/core'
import { version as config, defaultState, getReset } from './Config'
import './styles.css'
import Ticker from './Ticker'
import Upgrade from './Upgrade'
import Background from './Backgrounds'

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

	adjustments(state) {
		// return 0
		const bonus =
			0.001 *
			state.types.filter(type => type.preferredLocation === state.resetName)
				.length

		const hinderance =
			0.001 *
			state.types.filter(type => type.hinderanceLocation === state.resetName)
				.length

		return bonus - hinderance
	}

	loop(scope) {
		return () => {
			scope.setState(state => {
				const newAmount =
					state.amount + 1 * state.multiplier * this.adjustments(state)
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
	// https://ondras.github.io/primitive.js/
	render() {
		return (
			<div className="App">
				<Background resetName={this.state.resetName} />
				<div className="reset">{this.state.resetName}</div>
				<Ticker
					amount={this.state.amount}
					resourceType={this.state.resourceType}
					actionVerb={this.state.actionVerb}
					multiplier={this.state.multiplier}
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
								state={this.state}
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
