import React from 'react'

import { Button } from '@material-ui/core'

import LinearProgress from '@material-ui/core/LinearProgress'

import Swipeable from 'react-swipeable'

export default ({
	toggle,
	canResearch,
	startResearch,
	availableResearch = []
}) => (
	<Swipeable onSwipedLeft={() => toggle()}>
		<div className="research-container">
			{availableResearch.map(research => (
				<div className="research">
					<div className="upgradeRow">
						<span className="type-name">Research: {research.name}</span>

						<Button
							size="small"
							variant="flat"
							color="primary"
							disabled={canResearch(research)}
							onClick={() => startResearch(research)}
						>
							Research
						</Button>
					</div>
					<div className="upgradeRow">
						<span className="desc">{research.desc}</span>
					</div>

					<div>
						<LinearProgress
							variant="buffer"
							value={research.value}
							disabled={research.started}
							valueBuffer={research.valueBuffer}
						/>
					</div>
				</div>
			))}
		</div>
	</Swipeable>
)
