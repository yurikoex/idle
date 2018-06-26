import React from 'react'
import { Icon } from '@material-ui/core'
import formatter from '../ResourceFormatter'

export default ({ amount, resourceType, multiplier }) => (
	<div className="ticker">
		<div className="total">{formatter(amount)}</div>
		<span className="resourceInfo">
			<span className="resourceName">{resourceType}</span>
			<span className="resourceTotals">
				{formatter(multiplier * 60 * 60)} {resourceType} per minute
			</span>
		</span>
	</div>
)
