export const typeBase = {
	name: 'GIVE ME A NAME',
	count: 0,
	max: 15,
	multiplier: 0.001,
	cost: 1,
	level: 1,
	desc: '',
	preq: []
}

export const increaseCost = ({ state, type }) =>
	type.level * type.cost * type.count * state.increaseCostMultiplier + type.cost

export const levelCost = ({ state, type }) =>
	type.cost * type.level * state.levelCostMultiplier

export const resetValue = [
	{
		resetLevel: 0,
		resetCost: 100,
		resetName: 'Wastelands',
		resourceType: 'Water',
		actionVerb: 'Dying in Wastelands'
	},
	{
		resetLevel: 1,
		resetCost: 1000,
		resetName: 'Tent City',
		resourceType: 'Scraps',
		preq: ['Basic Survival'],
		actionVerb: 'Gathering in the Tent City'
	},
	{
		resetLevel: 2,
		resetCost: 10000,
		resetName: 'Abandoned Building',
		resourceType: 'Cans of food',
		actionVerb: 'Rebuilding from an Abandoned Bulding'
	},
	{
		resetLevel: 3,
		resetCost: 100000,
		resetName: 'Gated Neighborhood',
		resourceType: 'Bullets',
		actionVerb: 'Fortifying a Gated Neighborhood'
	},
	{
		resetLevel: 4,
		resetCost: 1000000,
		resetName: 'Military Base',
		resourceType: 'Gold',
		actionVerb: 'Getting armed at a Military Base'
	},
	{
		resetLevel: 5,
		resetCost: 10000000,
		resetName: 'New World City',
		resourceType: 'Cash',
		actionVerb: 'Rebuilding society at New World City'
	},
	{
		resetLevel: 6,
		resetCost: 100000000,
		resetName: 'Metropolis',
		resourceType: 'eBits',
		actionVerb: 'Advancing in a Metropolis'
	},
	{
		resetLevel: 7,
		resetCost: 1000000000,
		resetName: 'Space Station Alpha',
		resourceType: 'Galaxy Creds',
		actionVerb: 'Using alien tech in Space Station Alpha'
	},
	{
		resetLevel: 8,
		resetCost: 10000000000,
		resetName: 'Ethereal Plane',
		resourceType: 'Chi',
		actionVerb: 'Humanities transends to Ethereal Plane'
	}
]

export const getReset = (level = 0) => {
	return resetValue[level]
}

export const version = { version: 2 }

export const researchBase = {
	completed: false,
	started: false,
	startTime: null,
	valueBuffer: 100,
	value: 0
}
export const research = [
	{
		...researchBase,
		name: 'Basic Survival',
		time: 1000 * 60,
		cost: 10,
		desc: 'Nobody lives long in the wastelands without basic survival skills.'
	},
	{
		...researchBase,
		name: 'Veterans Association',
		time: 1000 * 60 * 5,
		cost: 100,
		preq: ['Basic Survival'],
		desc:
			"Wounded Warriors need some type of hope for the future. Let's tell him what they want to hear."
	},
	{
		...researchBase,
		name: 'Putrige Bait',
		time: 1000 * 60 * 60,
		cost: 1000,
		preq: ['Wounded Warrior'],
		desc:
			'Send the warriors to the wastelands to lure in the freaks with thier combat traps.'
	}
]

export const types = [
	{
		...typeBase,
		name: 'Wastelander',
		desc:
			'Lost to the world, wandering the wastelands searching for what little essence of humanity still exists.',
		preferredLocation: 'Wastelands',
		bonusDesc:
			'Wastelanders prefer their meaningless lifestyles within the Wastelands'
	},
	{
		...typeBase,
		name: 'Wounded Warrior',
		cost: 10,
		multiplier: 0.01,
		preq: ['Veterans Association', 'Wastelander'],
		desc:
			'Death tried to take these soldiers yet their survival instincts avail.',
		preferredLocation: 'Military Base',
		bonusDesc:
			'Walking the grounds of the base remind them of their former glory.'
	},
	{
		...typeBase,
		name: 'Mutatoe',
		cost: 100,
		multiplier: 0.1,
		preq: ['Wounded Warrior', 'Putrige Bait'],
		desc: 'Ravaged by the radiated potatoes, these mutant toes know pain.',
		preferredLocation: 'Abandoned Building',
		bonusDesc:
			'The others lock the mutants in the basement only fueling their rage!'
	},
	{
		...typeBase,
		name: 'Elite',
		cost: 1000,
		multiplier: 1,
		desc: 'The apocalypse is a breeze for these highly skilled survivalists.'
	},
	{
		...typeBase,
		name: 'Heroe',
		cost: 10000,
		multiplier: 10,
		desc: 'True leaders of the new world.'
	}
]

export const defaultState = (level = 0, amount = 10) => ({
	...getReset(level),
	...version,
	currentTab: 0,
	showInstall: false,
	lastTick: new Date().getTime(),
	levelCostMultiplier: 1000,
	increaseCostMultiplier: 1.5,
	isDebug: true, //window.location.hostname.indexOf('codesandbox') !== -1,
	amount: amount > 10 ? amount : 10,
	maxAmount: 0,
	multiplier: 0,
	types,
	research
})
