import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import { Button, Paper, Icon, Chip, Avatar } from '@material-ui/core'

export default ({ type, canBuy, canLevel, level, increase, resourceType }) => (
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
					label={type.cost}
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
					label={type.level * type.cost * 10}
				/>
				<span>
					{Math.floor(type.multiplier * 60 * 60)} {resourceType} per minute
				</span>
			</div>
		</Paper>
	</div>
)
