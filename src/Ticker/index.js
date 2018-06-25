import React from 'react'
import { Icon } from '@material-ui/core'
const formatter = amount => Math.floor(amount)
export default ({ amount, resourceType }) => (
	<div className="ticker">
		{formatter(amount)} {resourceType}
		<Icon />
	</div>
)
