import { encodeRuleName, findRuleByDottedName } from 'Engine/rules'
import { apply, concat, has, partition, pick, pipe } from 'ramda'
import React, { useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import ItemCard from './ItemCard'
import Worker from 'worker-loader!./Search.worker.js'
import Input from './SearchInput'

const worker = new Worker()

export default ({ rules }) => {
	const [input, setInput] = useState('')
	let exposedRules = rules.filter(rule => rule?.exposé === 'oui')

	const [results, setResults] = useState(exposedRules)

	console.log(exposedRules)

	useEffect(() => {
		worker.postMessage({
			rules: exposedRules.map(
				pick(['title', 'espace', 'description', 'name', 'dottedName'])
			)
		})

		worker.onmessage = ({ data: results }) => setResults(results)
	}, [exposedRules])

	let filteredRules = pipe(partition(has('formule')), apply(concat))(results)

	return (
		<div>
			<Input
				{...{
					input,
					placeholder: 'Autre chose',
					onChange: e => {
						let input = e.target.value
						setInput(input)
						if (input.length > 2) worker.postMessage({ input })
					}
				}}
			/>
			<section style={{ marginTop: '2rem' }}>
				{filteredRules.length ? (
					input && <h2 css="font-size: 100%;">Résultats :</h2>
				) : (
					<p>Rien trouvé {emoji('😶')}</p>
				)}
				{filteredRules && (
					<ul css="display: flex; flex-wrap: wrap; justify-content: space-evenly;     ">
						{filteredRules.map(({ dottedName }) => {
							let rule = findRuleByDottedName(exposedRules, dottedName)
							return (
								<li css="list-style-type: none" key={rule.dottedName}>
									<Link
										to={
											'/journée/simulateur/' + encodeRuleName(rule.dottedName)
										}
										css={`
											text-decoration: none !important;
											:hover {
												opacity: 1 !important;
											}
										`}
									>
										<ItemCard {...rule} />
									</Link>
								</li>
							)
						})}
					</ul>
				)}
			</section>
		</div>
	)
}
