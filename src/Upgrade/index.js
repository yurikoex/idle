import React from 'react'
import { Button, Icon, Chip, Avatar } from '@material-ui/core'

import formatter from '../ResourceFormatter'

export default ({
	type,
	canBuy,
	canLevel,
	level,
	increase,
	resourceType,
	levelCost,
	increaseCost,
	state
}) => (
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
					Recruit
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
					label={Math.floor(increaseCost)}
				/>
			</div>
			<div className="chipContainer">
				<Chip
					avatar={
						<Avatar>
							<Icon>supervisor_account</Icon>
						</Avatar>
					}
					label={type.count}
				/>
			</div>
			<div className="chipContainer">
				<Chip
					avatar={
						<Avatar>
							<Icon>plus_one</Icon>
						</Avatar>
					}
					label={type.level}
				/>
			</div>
			<div className="chipContainer">
				<Chip
					avatar={
						<Avatar>
							<Icon>arrow_upward</Icon>
						</Avatar>
					}
					label={Math.floor(levelCost)}
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
				{resourceType} per minute
			</span>
		</div>
	</div>
)
