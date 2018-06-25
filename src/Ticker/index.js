import React from 'react'
import { Icon } from '@material-ui/core'

import formatter from '../ResourceFormatter'

export default ({ amount, resourceType }) => (
	<div className="ticker">
		{formatter(amount)} {resourceType}
		<Icon />
	</div>
)
