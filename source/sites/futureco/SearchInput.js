import React from 'react'
import emoji from 'react-easy-emoji'

export default ({ placeholder, onChange, input }) => (
	<div
		css={`
			display: flex;
			align-items: flex-end;
			justify-content: center;
		`}
	>
		<input
			css={`
				display: inline-block;
				width: 80%;
				border: 1px solid rgba(41, 117, 209, 0.12);
				font-size: 200%;
				border-radius: 1rem;
				padding: 0 0.6rem;
			`}
			placeholder={placeholder}
			type="search"
			value={input}
			onChange={onChange}
		/>
		<span
			css={`
				margin-left: 1em;
				img {
					width: 1.6em !important;
					height: 1.6em !important;
				}
			`}
		>
			{emoji('🔍')}
		</span>
	</div>
)
