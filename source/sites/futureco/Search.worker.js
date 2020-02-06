import Fuse from 'fuse.js'

let searchWeights = [
	{
		name: 'name',
		weight: 0.3
	},
	{
		name: 'title',
		weight: 0.3
	},
	{
		name: 'dottedName',
		weight: 0.2
	},
	{
		name: 'description',
		weight: 0.2
	}
]

let fuse = null
onmessage = function(event) {
	if (event.data.rules)
		fuse = new Fuse(event.data.rules, {
			keys: searchWeights,
			threshold: 0.2
		})

	if (event.data.input) {
		let results = fuse.search(event.data.input)
		postMessage(results)
	}
}
