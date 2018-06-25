import React from 'react'
import { Button, Paper, Icon, Chip, Avatar } from '@material-ui/core'

import formatter from '../ResourceFormatter'

export default ({
	type,
	canBuy,
	canLevel,
	level,
	increase,
	resourceType,
	levelCost,
	increaseCost
}) => (
	<div className="upgrade-container">
		<Paper>
			<div className="upgrade">
				<span className="type-name">{type.name}s </span>
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
			<div className="upgrade">
				<Chip
					avatar={
						<Avatar>
							<Icon>attach_money</Icon>
						</Avatar>
					}
					label={Math.floor(increaseCost)}
				/>
				<Chip
					avatar={
						<Avatar>
							<Icon>supervisor_account</Icon>
						</Avatar>
					}
					label={type.count}
				/>
				<Chip
					avatar={
						<Avatar>
							<Icon>trending_up</Icon>
						</Avatar>
					}
					label={type.level}
				/>
				<Chip
					avatar={
						<Avatar>
							<Icon>attach_money</Icon>
						</Avatar>
					}
					label={Math.floor(levelCost)}
				/>
			</div>
			<div className="upgrade">
				<span>
					{formatter(type.level * type.count * type.multiplier * 60 * 60)}{' '}
					{resourceType} per minute
				</span>
			</div>
		</Paper>
	</div>
)
