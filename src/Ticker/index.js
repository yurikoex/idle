import React from 'react'
import { Icon } from '@material-ui/core'
import formatter from '../ResourceFormatter'

export default ({ amount, resourceType, multiplier }) => (
	<div className="ticker">
		<span>
			{formatter(amount)} {resourceType}({formatter(multiplier * 60 * 60)}{' '}
			{resourceType} per minute)
		</span>
		<Icon />
	</div>
)
