/* @flow */
import { saveExistingCompanyDetails } from 'Actions/existingCompanyActions'
import { compose } from 'ramda'
import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
// $FlowFixMe
import ReactSelect from 'react-select'
// $FlowFixMe
import 'react-select/dist/react-select.css'
import './Find.css'
import { CompanyDetails as Company } from './YourCompany'
import type { RouterHistory } from 'react-router'

const goToNextStep = (history: RouterHistory) => {
	history.push('/social-security')
}

type State = {
	input: ?{ [string]: string }
}

type Props = {
	// $FlowFixMe
	onCompanyDetailsConfirmation: ({ [string]: string }) => void,
	history: RouterHistory
}

class Search extends React.Component<Props, State> {
	state = {
		input: null
	}
	handleChange = input => {
		this.setState({ input })
	}
	getOptions = (input: string) =>
		fetch(`https://sirene.entreprise.api.gouv.fr/v1/full_text/${input}`)
			.then(response => {
				if (response.ok) {
					return response.json().then(json => ({ options: json.etablissement }))
				}
			})
			.catch(function(error) {
				console.log(
					'Erreur dans la recherche de communes à partir du code postal',
					error
				) // eslint-disable-line no-console
			})

	render() {
		return (
			<div id="findYourCompany">
				<Helmet>
					<title>Find your company</title>
					<meta
						name="description"
						content="Find your existing company, and start simulate hiring cost customized to your situation"
					/>
				</Helmet>
				<h1 className="question__title">Find your company</h1>
				<p>
					<Link to="/company">I don&apos;t have a company yet</Link>
				</p>
				<p>
					{' '}
					Thanks to the SIREN database, the public informations of your company
					will be automatically available for the next steps.
				</p>
				{/* $FlowFixMe */}
				<ReactSelect.Async
					valueKey="id"
					labelKey="l1_normalisee"
					value={this.state.input}
					onChange={this.handleChange}
					optionRenderer={({ l1_normalisee, code_postal }) =>
						l1_normalisee + ` (${code_postal})`
					}
					placeholder="Type your company name"
					noResultsText="We didn't find any matching registered company."
					searchPromptText={null}
					loadingPlaceholder="Searching..."
					loadOptions={this.getOptions}
				/>
				{!!this.state.input && (
					<>
						<Company {...this.state.input} />
						<button
							onClick={() => {
								this.props.onCompanyDetailsConfirmation(this.state.input)
								goToNextStep(this.props.history)
							}}
							className="ui__ button">
							Confirm and simulate hiring costs
						</button>
					</>
				)}
			</div>
		)
	}
}

export default compose(
	withRouter,
	connect(
		null,
		{
			onCompanyDetailsConfirmation: saveExistingCompanyDetails
		}
	)
)(Search)
