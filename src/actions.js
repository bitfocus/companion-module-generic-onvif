import { percentToVelocity, presetOption, speedOption } from './utils.js'

// Direction multipliers for each of the pan/tilt actions
const PAN_TILT_DIRECTIONS = {
	panTiltLeft: { name: 'Pan Left', x: -1, y: 0 },
	panTiltRight: { name: 'Pan Right', x: 1, y: 0 },
	panTiltUp: { name: 'Tilt Up', x: 0, y: 1 },
	panTiltDown: { name: 'Tilt Down', x: 0, y: -1 },
	panTiltUpLeft: { name: 'Pan/Tilt Up Left', x: -1, y: 1 },
	panTiltUpRight: { name: 'Pan/Tilt Up Right', x: 1, y: 1 },
	panTiltDownLeft: { name: 'Pan/Tilt Down Left', x: -1, y: -1 },
	panTiltDownRight: { name: 'Pan/Tilt Down Right', x: 1, y: -1 },
}

const SPEED_MODE_CHOICES = [
	{ id: 'set', label: 'Set to' },
	{ id: 'increase', label: 'Increase by' },
	{ id: 'decrease', label: 'Decrease by' },
]

export function initActions() {
	let self = this

	let actions = {}

	//PTZ Functions
	for (const [actionId, direction] of Object.entries(PAN_TILT_DIRECTIONS)) {
		const isDiagonal = direction.x !== 0 && direction.y !== 0

		actions[actionId] = {
			name: direction.name,
			options: isDiagonal
				? [speedOption('speed_pan', 'Pan Speed (%)'), speedOption('speed_tilt', 'Tilt Speed (%)')]
				: [speedOption('speed', direction.x !== 0 ? 'Pan Speed (%)' : 'Tilt Speed (%)')],
			callback: async function (action) {
				let opt = action.options

				let options = {
					x: direction.x * percentToVelocity(isDiagonal ? opt.speed_pan : opt.speed),
					y: direction.y * percentToVelocity(isDiagonal ? opt.speed_tilt : opt.speed),
				}

				self.continuousMove(options)
			},
		}
	}

	actions.panTiltStop = {
		name: 'Pan/Tilt Stop',
		options: [],
		callback: async function () {
			let options = {
				panTilt: true,
			}

			self.stop(options)
		},
	}

	actions.zoomIn = {
		name: 'Zoom In',
		options: [speedOption('speed', 'Zoom Speed (%)')],
		callback: async function (action) {
			let options = {
				zoom: percentToVelocity(action.options.speed),
			}

			self.continuousMove(options)
		},
	}

	actions.zoomOut = {
		name: 'Zoom Out',
		options: [speedOption('speed', 'Zoom Speed (%)')],
		callback: async function (action) {
			let options = {
				zoom: -percentToVelocity(action.options.speed),
			}

			self.continuousMove(options)
		},
	}

	actions.zoomStop = {
		name: 'Zoom Stop',
		options: [],
		callback: async function () {
			let options = {
				zoom: true,
			}

			self.stop(options)
		},
	}

	actions.setPanTiltSpeed = {
		name: 'Set Pan/Tilt Speed',
		description: 'Change the pan/tilt speed stored in the pt_speed variable, which is used by the presets',
		options: speedModeOptions(),
		callback: async function (action) {
			let opt = action.options

			self.setSpeed('panTilt', opt.mode, opt.mode === 'set' ? opt.speed : opt.step)
		},
	}

	actions.setZoomSpeed = {
		name: 'Set Zoom Speed',
		description: 'Change the zoom speed stored in the zoom_speed variable, which is used by the presets',
		options: speedModeOptions(),
		callback: async function (action) {
			let opt = action.options

			self.setSpeed('zoom', opt.mode, opt.mode === 'set' ? opt.speed : opt.step)
		},
	}

	actions.relativeMove = {
		name: 'Advanced - Relative Move from Current Position',
		options: [
			{
				type: 'number',
				label: 'Pan',
				id: 'pan',
				default: 0.1,
				min: -1,
				max: 1,
				step: 0.1,
				tooltip:
					'The amount to move the camera left or right. Negative values move left, positive values move right. A value of 0 stops movement.',
			},
			{
				type: 'number',
				label: 'Pan Speed',
				id: 'speed_pan',
				default: 1,
				min: 0,
				max: 1,
				step: 0.1,
				tooltip: 'The speed at which to move the camera left or right. A value of 0 stops movement.',
			},
			{
				type: 'number',
				label: 'Tilt',
				id: 'tilt',
				default: 0.1,
				min: -1,
				max: 1,
				step: 0.1,
				tooltip:
					'The amount to move the camera up or down. Negative values move down, positive values move up. A value of 0 stops movement.',
			},
			{
				type: 'number',
				label: 'Tilt Speed',
				id: 'speed_tilt',
				default: 1,
				min: 0,
				max: 1,
				step: 0.1,
				tooltip: 'The speed at which to move the camera up or down. A value of 0 stops movement.',
			},
			{
				type: 'number',
				label: 'Zoom',
				id: 'zoom',
				default: 0.1,
				min: -1,
				max: 1,
				step: 0.1,
				tooltip:
					'The amount to zoom the camera in or out. Negative values zoom out, positive values zoom in. A value of 0 stops movement.',
			},
			{
				type: 'number',
				label: 'Zoom Speed',
				id: 'speed_zoom',
				default: 1,
				min: 0,
				max: 1,
				step: 0.1,
				tooltip: 'The speed at which to zoom the camera in or out. A value of 0 stops movement.',
			},
		],
		callback: async function (action) {
			let opt = action.options

			let options = {
				x: opt.pan,
				y: opt.tilt,
				zoom: opt.zoom,
				speed: {
					x: opt.speed_pan,
					y: opt.speed_tilt,
					zoom: opt.speed_zoom,
				},
			}

			self.relativeMove(options)
		},
	}

	actions.absoluteMove = {
		name: 'Advanced - Absolute Move to Position',
		options: [
			{
				type: 'number',
				label: 'Pan',
				id: 'pan',
				default: 0.1,
				min: -1,
				max: 1,
			},
			{
				type: 'number',
				label: 'Pan Speed',
				id: 'speed_pan',
				default: 1,
				min: 0,
				max: 1,
				step: 0.1,
			},
			{
				type: 'number',
				label: 'Tilt',
				id: 'tilt',
				default: 0.1,
				min: -1,
				max: 1,
			},
			{
				type: 'number',
				label: 'Tilt Speed',
				id: 'speed_tilt',
				default: 1,
				min: 0,
				max: 1,
				step: 0.1,
			},
			{
				type: 'number',
				label: 'Zoom',
				id: 'zoom',
				default: 0.1,
				min: -1,
				max: 1,
			},
			{
				type: 'number',
				label: 'Zoom Speed',
				id: 'speed_zoom',
				default: 1,
				min: 0,
				max: 1,
				step: 0.1,
			},
		],
		callback: async function (action) {
			let opt = action.options

			let options = {
				x: opt.pan,
				y: opt.tilt,
				zoom: opt.zoom,
				speed: {
					x: opt.speed_pan,
					y: opt.speed_tilt,
					zoom: opt.speed_zoom,
				},
			}

			self.absoluteMove(options)
		},
	}

	actions.continuousMove = {
		name: 'Advanced - Continuous Move',
		options: [
			{
				type: 'number',
				label: 'Pan Velocity',
				id: 'pan',
				default: 0,
				min: -1,
				max: 1,
			},
			{
				type: 'number',
				label: 'Tilt Velocity',
				id: 'tilt',
				default: 0,
				min: -1,
				max: 1,
			},
			{
				type: 'number',
				label: 'Zoom Velocity',
				id: 'zoom',
				default: 0,
				min: -1,
				max: 1,
			},
			{
				type: 'number',
				label: 'Timeout (in seconds)',
				id: 'timeout',
				default: 1,
				min: 1,
				max: 600,
			},
		],
		callback: async function (action) {
			let opt = action.options

			let options = {
				x: opt.pan,
				y: opt.tilt,
				zoom: opt.zoom,
				timeout: opt.timeout * 1000,
			}

			self.continuousMove(options)
		},
	}

	actions.stop = {
		name: 'Stop PTZ Move',
		options: [
			{
				type: 'checkbox',
				label: 'Stop Pan/Tilt',
				id: 'panTilt',
				default: true,
			},
			{
				type: 'checkbox',
				label: 'Stop Zoom',
				id: 'zoom',
				default: true,
			},
		],
		callback: async function (action) {
			let opt = action.options

			let options = {
				panTilt: opt.panTilt,
				zoom: opt.zoom,
			}

			self.stop(options)
		},
	}

	actions.gotoHomePosition = {
		name: 'Go to Home Position',
		options: [
			speedOption('speed_pan', 'Pan Speed (%)'),
			speedOption('speed_tilt', 'Tilt Speed (%)'),
			speedOption('speed_zoom', 'Zoom Speed (%)'),
		],
		callback: async function (action) {
			let opt = action.options

			let options = {
				speed: {
					x: percentToVelocity(opt.speed_pan),
					y: percentToVelocity(opt.speed_tilt),
					zoom: percentToVelocity(opt.speed_zoom),
				},
			}

			self.gotoHomePosition(options)
		},
	}

	actions.setHomePosition = {
		name: 'Set Home Position',
		options: [],
		callback: async function () {
			self.setHomePosition()
		},
	}

	actions.recallPreset = {
		name: 'Recall Preset',
		options: [
			presetOption(self.CHOICES_PRESETS),
			{
				type: 'number',
				label: 'Speed (%)',
				id: 'speed',
				default: 0,
				min: 0,
				max: 100,
				step: 1,
				clampValues: true,
				tooltip: 'Set to 0 to use the default speed configured on the camera',
			},
		],
		callback: async function (action) {
			let opt = action.options

			let options = {
				preset: self.resolvePresetToken(opt.preset),
			}

			if (Number(opt.speed) > 0) {
				const speed = percentToVelocity(opt.speed)
				options.speed = { x: speed, y: speed, zoom: speed }
			}

			self.gotoPreset(options)
		},
	}

	actions.setPreset = {
		name: 'Set Preset',
		description: 'Save the current camera position to a preset',
		options: [
			presetOption(self.CHOICES_PRESETS),
			{
				type: 'textinput',
				label: 'Preset Name',
				id: 'presetName',
				default: '',
				useVariables: true,
				tooltip: 'Leave blank to keep the current name of the preset',
			},
		],
		callback: async function (action) {
			let opt = action.options

			let presetToken = self.resolvePresetToken(opt.preset)
			let presetName = String(opt.presetName ?? '').trim()
			if (presetName === '') {
				presetName = self.getPresetName(presetToken) || `Preset ${presetToken}`
			}

			let options = {
				presetToken: presetToken,
				presetName: presetName,
			}

			self.setPreset(options)
		},
	}

	//Imaging Functions

	actions.setBrightness = {
		name: 'Set Brightness',
		options: [
			{
				type: 'number',
				label: 'Brightness',
				id: 'brightness',
				default: 50,
				min: 0,
				max: 100,
			},
		],
		callback: async function (action) {
			let opt = action.options

			let options = {
				brightness: opt.brightness,
			}

			self.setImaging(options)
		},
	}

	actions.setColorSaturation = {
		name: 'Set Color Saturation',
		options: [
			{
				type: 'number',
				label: 'Color Saturation',
				id: 'colorSaturation',
				default: 50,
				min: 0,
				max: 100,
			},
		],
		callback: async function (action) {
			let opt = action.options

			let options = {
				colorSaturation: opt.colorSaturation,
			}

			self.setImaging(options)
		},
	}

	actions.setContrast = {
		name: 'Set Contrast',
		options: [
			{
				type: 'number',
				label: 'Contrast',
				id: 'contrast',
				default: 50,
				min: 0,
				max: 100,
			},
		],
		callback: async function (action) {
			let opt = action.options

			let options = {
				contrast: opt.contrast,
			}

			self.setImaging(options)
		},
	}

	actions.setSharpness = {
		name: 'Set Sharpness',
		options: [
			{
				type: 'number',
				label: 'Sharpness',
				id: 'sharpness',
				default: 50,
				min: 0,
				max: 100,
			},
		],
		callback: async function (action) {
			let opt = action.options

			let options = {
				sharpness: opt.sharpness,
			}

			self.setImaging(options)
		},
	}

	actions.setExposure = {
		name: 'Set Exposure',
		options: [
			{
				type: 'dropdown',
				label: 'Exposure Mode',
				id: 'exposureMode',
				default: 'AUTO',
				choices: [
					{ id: 'AUTO', label: 'Auto' },
					{ id: 'MANUAL', label: 'Manual' },
				],
			},
			{
				type: 'number',
				label: 'Exposure Time (ms)',
				id: 'exposureTime',
				default: 33,
				min: 33,
				max: 40000,
			},
			{
				type: 'number',
				label: 'Gain',
				id: 'gain',
				default: 0,
				min: 0,
				max: 100,
			},
		],
		callback: async function (action) {
			let opt = action.options

			let options = {
				exposure: {
					mode: opt.exposureMode,
					minExposureTime: opt.exposureTime,
					maxExposureTime: 40000,
					minGain: 0,
					maxGain: 100,
				},
			}

			self.setImaging(options)
		},
	}

	actions.setExposureMode = {
		name: 'Set Exposure Mode',
		description: 'Change only the exposure mode, leaving the other exposure settings unchanged',
		options: [modeOption('Exposure Mode')],
		callback: async function (action) {
			let mode = action.options.mode
			if (mode === 'TOGGLE') {
				mode = self.DATA?.imagingSettings?.exposure?.mode === 'AUTO' ? 'MANUAL' : 'AUTO'
			}

			self.setImaging({ exposure: { mode: mode } })
		},
	}

	actions.setFocus = {
		name: 'Set Focus',
		options: [
			{
				type: 'dropdown',
				label: 'Auto Focus Mode',
				id: 'autoFocusMode',
				default: 'AUTO',
				choices: [
					{ id: 'AUTO', label: 'Auto' },
					{ id: 'MANUAL', label: 'Manual' },
				],
			},
			{
				type: 'number',
				label: 'Near Limit',
				id: 'nearLimit',
				default: 150,
				min: 0,
				max: 1000,
			},
		],
		callback: async function (action) {
			let opt = action.options

			let options = {
				focus: {
					autoFocusMode: opt.autoFocusMode,
					nearLimit: opt.nearLimit,
				},
			}

			self.setImaging(options)
		},
	}

	actions.setFocusMode = {
		name: 'Set Focus Mode',
		description: 'Change only the focus mode, leaving the other focus settings unchanged',
		options: [modeOption('Focus Mode')],
		callback: async function (action) {
			let mode = action.options.mode
			if (mode === 'TOGGLE') {
				mode = self.DATA?.imagingSettings?.focus?.autoFocusMode === 'AUTO' ? 'MANUAL' : 'AUTO'
			}

			self.setImaging({ focus: { autoFocusMode: mode } })
		},
	}

	actions.focusNear = {
		name: 'Focus Near',
		description: 'Start moving the focus nearer. Most cameras require manual focus mode for this to work.',
		options: [speedOption('speed', 'Focus Speed (%)')],
		callback: async function (action) {
			self.focusMove(-1, action.options.speed)
		},
	}

	actions.focusFar = {
		name: 'Focus Far',
		description: 'Start moving the focus further away. Most cameras require manual focus mode for this to work.',
		options: [speedOption('speed', 'Focus Speed (%)')],
		callback: async function (action) {
			self.focusMove(1, action.options.speed)
		},
	}

	actions.focusStop = {
		name: 'Focus Stop',
		options: [],
		callback: async function () {
			self.focusStop()
		},
	}

	actions.setIrCutFilter = {
		name: 'Set IR Cut Filter',
		options: [
			{
				type: 'dropdown',
				label: 'IR Cut Filter',
				id: 'irCutFilter',
				default: 'AUTO',
				choices: [
					{ id: 'AUTO', label: 'Auto' },
					{ id: 'ON', label: 'On' },
					{ id: 'OFF', label: 'Off' },
				],
			},
		],
		callback: async function (action) {
			let opt = action.options

			let options = {
				irCutFilter: opt.irCutFilter,
			}

			self.setImaging(options)
		},
	}

	//Other Functions

	/*actions.systemReboot = {
		name: 'Reboot System',
		options: [],
		callback: async function () {
			self.systemReboot()
		},
	}*/

	self.setActionDefinitions(actions)
}

function speedModeOptions() {
	return [
		{
			type: 'dropdown',
			label: 'Mode',
			id: 'mode',
			default: 'set',
			choices: SPEED_MODE_CHOICES,
			disableAutoExpression: true,
		},
		{
			...speedOption('speed', 'Speed (%)'),
			isVisibleExpression: `$(options:mode) == 'set'`,
		},
		{
			type: 'number',
			label: 'Step (%)',
			id: 'step',
			default: 10,
			min: 1,
			max: 100,
			step: 1,
			clampValues: true,
			isVisibleExpression: `$(options:mode) != 'set'`,
		},
	]
}

function modeOption(label) {
	return {
		type: 'dropdown',
		label: label,
		id: 'mode',
		default: 'AUTO',
		choices: [
			{ id: 'AUTO', label: 'Auto' },
			{ id: 'MANUAL', label: 'Manual' },
			{ id: 'TOGGLE', label: 'Toggle' },
		],
		disableAutoExpression: true,
	}
}
