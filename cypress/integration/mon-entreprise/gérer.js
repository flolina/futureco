
describe('Manage page test', function () {
	const fr = Cypress.env('language') === 'fr'
	beforeEach(() => {
		cy.visit(fr ? '/gérer' : '/manage')
	})
	it('should not crash', function () {
		cy.contains(
			fr ? 'Gérer mon activité' : 'Manage my business'
		)
	})
	it('should allow to retrieve company and show link corresponding to the legal status', function () {
		cy.get('button.cta').click()
		cy.get('input').first().type('menoz')
		cy.contains('834364291').click()
		cy.contains('assimilé-salarié').click()
		cy.location().should((loc) => {
			expect(loc.pathname).to.match(fr ? /assimil%C3%A9-salari%C3%A9$/ : /assimile-salarie$/)
		})
	})
	it('should allow auto entrepreneur to access the corresponding income simulator', function () {
		cy.get('button.cta').click()
		cy.get('input').first().type('gwenael girod')
		cy.contains('MONSIEUR').click()
		// ask if auto-entrepreneur
		cy.contains(fr ? 'Êtes-vous auto-entrepreneur ?' : 'Are you auto-entrepreneur?')
		cy.contains(fr ? 'Oui' : 'Yes').click()
		cy.contains(fr ? 'simulateur auto-entrepreneur' : 'simulator for auto-entrepreneur').click()
		cy.location().should((loc) => {
			expect(loc.pathname).to.match(/auto-entrepreneur$/)
		})
	})
})
