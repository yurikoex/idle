import React from 'react'
import ReactDOM from 'react-dom'
import { Button } from '@material-ui/core'

import registerServiceWorker from './registerServiceWorker'
import {
	version as config,
	defaultState,
	getReset,
	levelCost,
	increaseCost
} from './Config'
import './styles.css'
import Ticker from './Ticker'
import Upgrade from './Upgrade'
import Background from './Backgrounds'
import AddToHomescreen from './AddToHomescreen'
import Research from './Research'

const updateState = ({ cost, updatedTypes, state }) => ({
	...state,
	multiplier: updatedTypes.reduce(
		(m, t) => m + t.count * t.multiplier * t.level,
		0
	),
	amount: state.amount - cost,
	types: updatedTypes
})

class GameManager extends React.PureComponent {
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

		this.deferredPrompt = null
	}
	componentDidMount() {
		this.startLoop()
		window.matchMedia('(display-mode: standalone)').matches
			? void 0
			: window.addEventListener('beforeinstallprompt', e => {
					e.preventDefault()
					this.deferredPrompt = e
					this.setState(state => ({ ...state, showInstall: true }))
				})
		this.updateWindowDimensions(this)()
		window.addEventListener('resize', this.updateWindowDimensions(this))
	}

	componentWillUnmount() {
		this.stopLoop()
		window.removeEventListener('resize', this.updateWindowDimensions(this))
	}

	startLoop() {
		if (!this._frameId) {
			this._frameId = window.requestAnimationFrame(this.loop(this))
		}
	}

	hideInstall() {
		this.setState(state => ({ ...state, showInstall: false }))
	}

	install() {
		this.deferredPrompt.prompt()
	}

	adjustments(state) {
		// return 0
		const bonus = state.types.reduce(
			(multiplier, type) =>
				type.preferredLocation === state.resetName
					? multiplier + 0.001 * type.count
					: multiplier,
			0.001
		)

		const hinderance = state.types.reduce(
			(multiplier, type) =>
				type.hinderanceLocation === state.resetName
					? multiplier + 0.001 * type.count
					: multiplier,
			0.001
		)
		return bonus - hinderance
	}

	loop(scope) {
		return () => {
			scope.setState(state => {
				const now = new Date().getTime()
				// console.log(now - state.lastTick)
				const msSinceLastTick = now - state.lastTick
				const newAmount =
					state.amount + 1 * (state.multiplier + this.adjustments(state))

				// const x = Math.ceil(msSinceLastTick / 16.33)
				const adjustedNewAmount =
					msSinceLastTick > 32
						? newAmount +
							Math.ceil(msSinceLastTick / 16.33) *
								(1 * (state.multiplier + this.adjustments(state)))
						: newAmount

				const newState = {
					...state,
					lastTick: new Date().getTime(),
					amount: adjustedNewAmount,
					maxAmount: state.maxAmount < newAmount ? newAmount : state.maxAmount,
					research: state.research.map(r => {
						// console.log(r);
						// console.log(
						//   100 +
						//     (r.startTime + r.time < new Date().getTime()
						//       ? 100
						//       : (new Date().getTime() - (r.startTime + r.time)) *
						//         100 /
						//         r.time)
						// );
						return !r.completed && r.started
							? {
									...r,
									value:
										100 +
										(r.startTime + r.time < new Date().getTime()
											? 100
											: (new Date().getTime() - (r.startTime + r.time)) *
												100 /
												r.time),
									valueBuffer:
										100 +
										(r.startTime + r.time < new Date().getTime()
											? 100
											: (new Date().getTime() - (r.startTime + r.time)) *
												100 /
												r.time),
									completed: r.startTime + r.time < new Date().getTime()
								}
							: r
					})
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
		// console.log('increase')
		this.setState(state => {
			const cost = increaseCost({ state, type })
			const updatedTypes = state.types.map(
				t => (t.name === type.name ? { ...t, count: t.count + 1 } : t)
			)
			return updateState({ cost, updatedTypes, state })
		})
		window.ga('send', 'event', 'increase', type.name, type.count)
		window.ga('set', 'increase', type.count.toString())
	}

	max(type) {
		const clear = setInterval(() => {
			const currentType = this.state.types.find(t => t.name === type.name)
			!this.canBuy(currentType)
				? this.increase(currentType)
				: clearInterval(clear)
		}, 100)
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
		// console.log(this.state.amount)
		return this.state.amount - increaseCost({ state: this.state, type }) <= 0
	}

	canLevel(type) {
		return this.state.amount - levelCost({ state: this.state, type }) <= 0
	}

	canReset() {
		return this.state.amount - this.state.resetCost <= 0
	}

	canResearch(research) {
		const r = this.state.research.find(i => i.name === research.name)
		// console.log(r.started)
		return r.started || this.state.amount - r.cost < 0
	}

	startResearch(research) {
		this.setState(state => ({
			...state,
			amount: state.amount - research.cost,
			research: state.research.map(
				r =>
					r.name === research.name
						? {
								...r,
								started: true,
								startTime: new Date().getTime(),
								valueBuffer: 0
							}
						: r
			)
		}))
	}

	reset(level = 0) {
		console.log(level)
		this.setState(
			defaultState(level, level !== 0 ? this.state.amount / 1000 : void 0)
		)
	}

	updateWindowDimensions(scope) {
		return () =>
			scope.setState(state => ({
				...state,
				width: window.innerWidth,
				height: window.innerHeight
			}))
	}

	shouldShow(tab) {
		return this.state.width >= 600
			? 'show'
			: this.state.currentTab === tab ? 'show' : 'hidden'
	}

	toggle() {
		this.setState(state => ({
			...state,
			currentTab: state.currentTab === 0 ? 1 : 0
		}))
	}

	// https://ondras.github.io/primitive.js/
	render() {
		return (
			<div className="App">
				<Background resetName={this.state.resetName} />
				{this.state.showInstall ? (
					<AddToHomescreen
						install={() => this.install()}
						hideInstall={() => this.hideInstall()}
					/>
				) : null}
				<div className="header">
					<div className="reset">{this.state.actionVerb}</div>
					<Ticker
						amount={this.state.amount}
						resourceType={this.state.resourceType}
						actionVerb={this.state.actionVerb}
						multiplier={this.state.multiplier}
					/>
				</div>
				<div className="tab-container">
					<div className={`container-wrapper ${this.shouldShow(0)}`}>
						<Upgrade
							canBuy={type => this.canBuy(type)}
							canLevel={type => this.canLevel(type)}
							level={type => this.level(type)}
							increase={type => this.increase(type)}
							max={type => this.max(type)}
							state={this.state}
							toggle={() => this.toggle()}
						/>
					</div>

					<div className={`container-wrapper ${this.shouldShow(1)}`}>
						<Research
							toggle={() => this.toggle()}
							canResearch={research => this.canResearch(research)}
							startResearch={research => this.startResearch(research)}
							availableResearch={this.state.research}
						/>
					</div>
				</div>
				{this.state.resetCost < this.state.maxAmount ? (
					<Button
						variant="outlined"
						className="resetWorld"
						disabled={this.canReset()}
						onClick={() => this.reset(this.state.resetLevel + 1)}
					>
						move to {getReset(this.state.resetLevel + 1).resetName}(<strong>
							reset
						</strong>)
					</Button>
				) : null}

				<div className="debug">
					<Button
						style={{ height: 1 }}
						size="small"
						variant="text"
						onClick={() => this.reset()}
					>
						<span className="resetText">reset</span>
					</Button>{' '}
					<Button
						style={{ height: 1 }}
						size="small"
						variant="text"
						onClick={() => this.toggle()}
					>
						<span className="resetText">toggle</span>
					</Button>
					<span>r:{this.state.multiplier}</span>
					<span>t:{this.state.amount}</span>
				</div>
			</div>
		)
	}
}

const rootElement = document.getElementById('root')
ReactDOM.render(<GameManager />, rootElement)

registerServiceWorker()
