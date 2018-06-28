import React from 'react'
import Swipeable from 'react-swipeable'

export default ({ toggle, availableResearch = [] }) => (
	<Swipeable onSwipedLeft={() => toggle()}>
		<div className="research-container">
			{availableResearch.map(research => (
				<div className="research">
					<div className="upgradeRow">
						<span className="type-name">Research: {research.name}</span>
					</div>
					<div className="upgradeRow">
						<span className="desc">{research.desc}</span>
					</div>
				</div>
			))}
		</div>
	</Swipeable>
)
