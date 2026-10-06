// Options which used to hold an ONVIF velocity/speed (from a dropdown of -1 to 1), mapped to their new percentage (1-100) option
const SPEED_OPTION_RENAMES = {
	panTiltLeft: { velocity: 'speed' },
	panTiltRight: { velocity: 'speed' },
	panTiltUp: { velocity: 'speed' },
	panTiltDown: { velocity: 'speed' },
	panTiltUpLeft: { velocity_pan: 'speed_pan', velocity_tilt: 'speed_tilt' },
	panTiltUpRight: { velocity_pan: 'speed_pan', velocity_tilt: 'speed_tilt' },
	panTiltDownLeft: { velocity_pan: 'speed_pan', velocity_tilt: 'speed_tilt' },
	panTiltDownRight: { velocity_pan: 'speed_pan', velocity_tilt: 'speed_tilt' },
	zoomIn: { velocity: 'speed' },
	zoomOut: { velocity: 'speed' },
	gotoHomePosition: { pan: 'speed_pan', tilt: 'speed_tilt', zoom: 'speed_zoom' },
}

/**
 * Convert a stored velocity (eg -0.5) into a percentage speed (eg 50)
 */
function velocityToPercent(option) {
	if (option?.isExpression) {
		return { isExpression: true, value: `round(abs(${option.value}) * 100)` }
	}

	const value = Number(option?.value)
	if (option === undefined || isNaN(value)) {
		return { isExpression: false, value: 50 }
	}

	return { isExpression: false, value: Math.min(Math.max(Math.round(Math.abs(value) * 100), 1), 100) }
}

/**
 * Speeds are now percentages in number fields, so that they can be set from variables/expressions
 */
function convertSpeedsToPercent(_context, props) {
	let result = {
		updatedConfig: null,
		updatedActions: [],
		updatedFeedbacks: [],
	}

	for (const action of props.actions) {
		const renames = SPEED_OPTION_RENAMES[action.actionId]
		if (renames) {
			for (const [oldId, newId] of Object.entries(renames)) {
				action.options[newId] = velocityToPercent(action.options[oldId])
				delete action.options[oldId]
			}
			result.updatedActions.push(action)
		} else if (action.actionId === 'recallPreset' && action.options.speed === undefined) {
			// New option, 0 uses the speed configured on the camera
			action.options.speed = { isExpression: false, value: 0 }
			result.updatedActions.push(action)
		}
	}

	return result
}

export const UpgradeScripts = [
	function (_context, _props) {
		return {
			updatedConfig: null,
			updatedActions: [],
			updatedFeedbacks: [],
		}
	},
	convertSpeedsToPercent,
]
