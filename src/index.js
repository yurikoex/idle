import React from 'react'
import ReactDOM from 'react-dom'

import './styles.scss'
import Ticker from './Ticker'

const typeBase = {
	name: 'GIVE ME A NAME',
	count: 0,
	max: 15,
	multiplier: 0.001,
	cost: 1
}

class App extends React.PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			amount: 1,
			multiplier: 0.001,
			types: [{ ...typeBase, name: 'Wastelander' }]
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
			console.log(state)
			return {
				...state,
				multiplier: state.multiplier + 0.000001,
				amount: state.amount - type.cost,
				types: state.types.map(
					t => (t.name === type.name ? { ...t, count: t.count + 1 } : t)
				)
			}
		})
	}

	canBuy(type) {
		return this.state.amount - type.cost <= 0
	}

	render() {
		return (
			<div className="App">
				<Ticker amount={this.state.amount} />
				{this.state.types.map(type => (
					<div className="upgrade">
						<span>
							Count: {type.count} {type.name}s{' '}
						</span>
						<button
							disabled={this.canBuy(type)}
							onClick={() => this.increase(type)}
						>
							Recruit Wastelander
						</button>
					</div>
				))}
				<div className="debug">{this.state.amount}</div>
			</div>
		)
	}
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
