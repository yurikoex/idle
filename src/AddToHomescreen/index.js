import React from 'react'

import { Button } from '@material-ui/core'

export default ({ hideInstall, install }) => (
	<div className="install">
		<div className="modal">
			<span className="modalText">Add to Homescreen?</span>
			<div className="modalButtons">
				<Button
					variant="contained"
					color="secondary"
					onClick={() => hideInstall()}
				>
					cancel
				</Button>
				<Button variant="contained" color="primary" onClick={() => install()}>
					install
				</Button>
			</div>
		</div>
	</div>
)
