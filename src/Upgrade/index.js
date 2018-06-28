import React from 'react'
import { Button, Icon, Chip, Avatar } from '@material-ui/core'
import Swipeable from 'react-swipeable'

import { increaseCost, levelCost } from '../Config'
import formatter from '../ResourceFormatter'

export default ({ canBuy, canLevel, level, increase, max, state, toggle }) => (
	<Swipeable onSwipedRight={() => toggle()}>
		<div className="upgrades-container">
			{state.types.filter(t => t.cost < state.maxAmount).map(type => (
				<div className="upgrade-container">
					<div className="upgradeRow">
						<span className="type-name">{type.name}s </span>
						<div>
							<Button
								size="small"
								variant="flat"
								color="primary"
								disabled={canBuy(type)}
								onClick={() => increase(type)}
							>
								add
							</Button>
							<Button
								size="small"
								variant="flat"
								color="primary"
								disabled={canBuy(type)}
								onClick={() => max(type)}
							>
								max
							</Button>
							<Button
								size="small"
								variant="flat"
								color="secondary"
								disabled={canLevel(type)}
								onClick={() => level(type)}
							>
								level up
							</Button>
						</div>
					</div>
					<div className="upgradeRow">
						<div className="chipContainer">
							<Chip
								avatar={
									<Avatar>
										<Icon>attach_money</Icon>
									</Avatar>
								}
								label={formatter(increaseCost({ state: state, type }))}
							/>
						</div>
						<div className="chipContainer">
							<Chip
								avatar={
									<Avatar>
										<Icon>supervisor_account</Icon>
									</Avatar>
								}
								label={formatter(type.count)}
							/>
						</div>
						<div className="chipContainer">
							<Chip
								avatar={
									<Avatar>
										<Icon>plus_one</Icon>
									</Avatar>
								}
								label={formatter(type.level)}
							/>
						</div>
						<div className="chipContainer">
							<Chip
								avatar={
									<Avatar>
										<Icon>arrow_upward</Icon>
									</Avatar>
								}
								label={formatter(levelCost({ state: state, type }))}
							/>
						</div>
					</div>
					<div className="upgradeRow">
						<span className="desc">{type.desc}</span>
					</div>
					{state.resetName === type.preferredLocation ? (
						<div className="upgradeRow">
							<span className="bonus">{type.bonusDesc}</span>
						</div>
					) : null}
					{state.resetName === type.hinderanceLocation ? (
						<div className="upgradeRow">
							<span className="hinderance">{type.hinderanceDesc}</span>
						</div>
					) : null}
					<div className="upgradeRow">
						<span>
							{formatter(type.level * type.count * type.multiplier * 60 * 60)}{' '}
							{state.resourceType} per minute
						</span>
					</div>
				</div>
			))}
		</div>
	</Swipeable>
)
