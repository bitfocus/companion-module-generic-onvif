import { combineRgb } from '@companion-module/base'
import ICONS from './icons.js'
import { sanitizePresetToken } from './utils.js'

const WHITE = combineRgb(255, 255, 255)
const BLACK = combineRgb(0, 0, 0)
const GREEN = combineRgb(0, 204, 0)
const RED = combineRgb(255, 0, 0)
const DARK_RED = combineRgb(102, 0, 0)

// Companion replaces the 'onvif' prefix with the label of the connection when a preset is used
const PT_SPEED = { isExpression: true, value: '$(onvif:pt_speed)' }
const ZOOM_SPEED = { isExpression: true, value: '$(onvif:zoom_speed)' }

// How long a button must be held before a destructive action (such as saving a preset) runs
const HOLD_DURATION = 2000

function textStyle(text, size = '14', bgcolor = BLACK) {
	return {
		text: text,
		size: size,
		color: WHITE,
		bgcolor: bgcolor,
	}
}

function iconStyle(png64) {
	return {
		text: '',
		png64: png64,
		pngalignment: 'center:center',
		size: '18',
		color: WHITE,
		bgcolor: BLACK,
	}
}

/**
 * A button that runs an action while held, and another action when released
 */
function holdPreset(name, style, downAction, upAction) {
	return {
		type: 'simple',
		name: name,
		style: style,
		steps: [
			{
				down: [downAction],
				up: [upAction],
			},
		],
		feedbacks: [],
	}
}

/**
 * A button that only runs an action once it has been held for HOLD_DURATION
 */
function longPressPreset(name, style, action) {
	return {
		type: 'simple',
		name: name,
		style: style,
		steps: [
			{
				down: [],
				up: [],
				[HOLD_DURATION]: {
					options: { runWhileHeld: true },
					actions: [action],
				},
			},
		],
		feedbacks: [],
	}
}

function speedPresets(presets, prefix, actionId, axis, label, variable) {
	presets[`${prefix}Down`] = {
		type: 'simple',
		name: `${label} Speed Down`,
		style: textStyle(`${label}\\nSPEED -`),
		steps: [{ down: [{ actionId: actionId, options: { mode: 'decrease', speed: 50, step: 10 } }], up: [] }],
		feedbacks: [],
	}

	presets[`${prefix}Display`] = {
		type: 'simple',
		name: `${label} Speed (press to reset)`,
		style: textStyle(`${label}\\nSPEED\\n$(onvif:${variable})%`),
		steps: [{ down: [{ actionId: actionId, options: { mode: 'set', speed: 50, step: 10 } }], up: [] }],
		feedbacks: [],
	}

	presets[`${prefix}Up`] = {
		type: 'simple',
		name: `${label} Speed Up`,
		style: textStyle(`${label}\\nSPEED +`),
		steps: [{ down: [{ actionId: actionId, options: { mode: 'increase', speed: 50, step: 10 } }], up: [] }],
		feedbacks: [],
	}

	presets[`${prefix}Knob`] = {
		type: 'simple',
		name: `${label} Speed (rotary encoder)`,
		style: textStyle(`${label}\\nSPEED\\n$(onvif:${variable})%`),
		steps: [
			{
				down: [{ actionId: actionId, options: { mode: 'set', speed: 50, step: 5 } }],
				up: [],
				rotate_left: [{ actionId: actionId, options: { mode: 'decrease', speed: 50, step: 5 } }],
				rotate_right: [{ actionId: actionId, options: { mode: 'increase', speed: 50, step: 5 } }],
			},
		],
		feedbacks: [],
	}

	// Template used to generate a button for each of the common speeds
	presets[`${prefix}Set`] = {
		type: 'simple',
		name: `Set ${label} Speed`,
		style: textStyle(`${label}\\n$(local:speed)%`),
		steps: [
			{
				down: [
					{
						actionId: actionId,
						options: { mode: 'set', speed: { isExpression: true, value: '$(local:speed)' }, step: 10 },
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'speed',
				options: { axis: axis, value: { isExpression: true, value: '$(local:speed)' } },
				style: { color: WHITE, bgcolor: GREEN },
			},
		],
		localVariables: [{ variableType: 'simple', variableName: 'speed', startupValue: 50 }],
	}
}

export function initPresets() {
	let self = this

	let presets = {}
	let structure = []

	// Pan/Tilt
	const directions = [
		['panTiltUpLeft', 'Up Left', ICONS.UP_LEFT, { speed_pan: PT_SPEED, speed_tilt: PT_SPEED }],
		['panTiltUp', 'Up', ICONS.UP, { speed: PT_SPEED }],
		['panTiltUpRight', 'Up Right', ICONS.UP_RIGHT, { speed_pan: PT_SPEED, speed_tilt: PT_SPEED }],
		['panTiltLeft', 'Left', ICONS.LEFT, { speed: PT_SPEED }],
		['panTiltRight', 'Right', ICONS.RIGHT, { speed: PT_SPEED }],
		['panTiltDownLeft', 'Down Left', ICONS.DOWN_LEFT, { speed_pan: PT_SPEED, speed_tilt: PT_SPEED }],
		['panTiltDown', 'Down', ICONS.DOWN, { speed: PT_SPEED }],
		['panTiltDownRight', 'Down Right', ICONS.DOWN_RIGHT, { speed_pan: PT_SPEED, speed_tilt: PT_SPEED }],
	]

	for (const [actionId, name, icon, options] of directions) {
		presets[actionId] = holdPreset(
			name.toUpperCase(),
			iconStyle(icon),
			{ actionId: actionId, options: options },
			{ actionId: 'panTiltStop', options: {} },
		)
	}

	presets.panTiltHome = {
		type: 'simple',
		name: 'Home',
		style: textStyle('HOME', '18'),
		steps: [
			{
				down: [
					{
						actionId: 'gotoHomePosition',
						options: { speed_pan: PT_SPEED, speed_tilt: PT_SPEED, speed_zoom: ZOOM_SPEED },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets.panTiltSetHome = longPressPreset(
		'Set Home (hold to save)',
		textStyle('SET\\nHOME\\n(hold)', '14', DARK_RED),
		{
			actionId: 'setHomePosition',
			options: {},
		},
	)

	presets.panTiltStop = {
		type: 'simple',
		name: 'Stop',
		style: textStyle('STOP', '18'),
		steps: [{ down: [{ actionId: 'stop', options: { panTilt: true, zoom: true } }], up: [] }],
		feedbacks: [],
	}

	structure.push({
		id: 'pan-tilt',
		name: 'Pan/Tilt',
		description:
			'Hold to move the camera. The speed follows the pt_speed variable, which is adjusted by the Speed presets.',
		definitions: [
			{
				id: 'directions',
				type: 'simple',
				name: 'Directions',
				presets: [
					'panTiltUpLeft',
					'panTiltUp',
					'panTiltUpRight',
					'panTiltLeft',
					'panTiltHome',
					'panTiltRight',
					'panTiltDownLeft',
					'panTiltDown',
					'panTiltDownRight',
				],
			},
			{
				id: 'home-stop',
				type: 'simple',
				name: 'Home & Stop',
				presets: ['panTiltStop', 'panTiltSetHome'],
			},
		],
	})

	// Zoom
	presets.zoomIn = holdPreset(
		'Zoom In',
		textStyle('ZOOM\\nIN', '18'),
		{ actionId: 'zoomIn', options: { speed: ZOOM_SPEED } },
		{ actionId: 'zoomStop', options: {} },
	)

	presets.zoomOut = holdPreset(
		'Zoom Out',
		textStyle('ZOOM\\nOUT', '18'),
		{ actionId: 'zoomOut', options: { speed: ZOOM_SPEED } },
		{ actionId: 'zoomStop', options: {} },
	)

	structure.push({
		id: 'zoom',
		name: 'Zoom',
		description:
			'Hold to zoom the camera. The speed follows the zoom_speed variable, which is adjusted by the Speed presets.',
		definitions: ['zoomIn', 'zoomOut'],
	})

	// Speed
	speedPresets(presets, 'ptSpeed', 'setPanTiltSpeed', 'panTilt', 'P/T', 'pt_speed')
	speedPresets(presets, 'zoomSpeed', 'setZoomSpeed', 'zoom', 'ZOOM', 'zoom_speed')

	const commonSpeeds = [10, 25, 50, 75, 100]

	structure.push({
		id: 'speed',
		name: 'Speed',
		description:
			'Adjust the speed used by the Pan/Tilt and Zoom presets. Any action speed can also be set from a variable or expression.',
		definitions: [
			{
				id: 'pt-speed',
				type: 'simple',
				name: 'Pan/Tilt Speed',
				presets: ['ptSpeedDown', 'ptSpeedDisplay', 'ptSpeedUp', 'ptSpeedKnob'],
			},
			{
				id: 'pt-speed-set',
				type: 'template',
				name: 'Pan/Tilt Speed Presets',
				presetId: 'ptSpeedSet',
				templateVariableName: 'speed',
				templateValues: commonSpeeds.map((speed) => ({ name: `Pan/Tilt Speed ${speed}%`, value: speed })),
			},
			{
				id: 'zoom-speed',
				type: 'simple',
				name: 'Zoom Speed',
				presets: ['zoomSpeedDown', 'zoomSpeedDisplay', 'zoomSpeedUp', 'zoomSpeedKnob'],
			},
			{
				id: 'zoom-speed-set',
				type: 'template',
				name: 'Zoom Speed Presets',
				presetId: 'zoomSpeedSet',
				templateVariableName: 'speed',
				templateValues: commonSpeeds.map((speed) => ({ name: `Zoom Speed ${speed}%`, value: speed })),
			},
		],
	})

	// Camera Presets
	presets.cameraPresetLast = {
		type: 'simple',
		name: 'Last Recalled Preset',
		style: textStyle('LAST\\n$(onvif:last_preset_name)', 'auto'),
		steps: [],
		feedbacks: [],
	}

	let cameraPresetDefinitions = [
		{
			id: 'last',
			type: 'simple',
			name: 'Status',
			presets: ['cameraPresetLast'],
		},
	]

	if (self.hasCameraPresets()) {
		const firstPreset = sanitizePresetToken(self.CHOICES_PRESETS[0].id)
		const presetExpression = { isExpression: true, value: '$(local:preset)' }
		// The button text follows the name of the preset on the camera, so renaming a preset updates the buttons
		const presetName = '$(onvif:preset_name_$(local:preset))'

		presets.cameraPresetRecall = {
			type: 'simple',
			name: 'Recall Preset',
			style: textStyle(presetName, 'auto'),
			steps: [
				{
					down: [{ actionId: 'recallPreset', options: { preset: presetExpression, speed: 0 } }],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'presetActive',
					options: { preset: presetExpression },
					style: { color: WHITE, bgcolor: GREEN },
				},
			],
			localVariables: [{ variableType: 'simple', variableName: 'preset', startupValue: firstPreset }],
		}

		const saveAction = { actionId: 'setPreset', options: { preset: presetExpression, presetName: '' } }
		// Companion runs the longest release group that the press exceeded, and skips it if it already ran while held.
		// So a group just after the save only runs when the button is released after saving, which clears the saved state.
		const clearSaveStatus = [{ actionId: 'clearPresetSaveStatus', options: { preset: presetExpression } }]
		const saveFeedbacks = [
			{
				feedbackId: 'presetSaveStatus',
				options: { preset: presetExpression, state: 'saved' },
				style: { text: `SAVED\\n${presetName}`, color: WHITE, bgcolor: GREEN },
			},
			{
				feedbackId: 'presetSaveStatus',
				options: { preset: presetExpression, state: 'failed' },
				style: { text: 'SAVE\\nFAILED', color: WHITE, bgcolor: RED },
			},
		]

		presets.cameraPresetRecallSave = {
			type: 'simple',
			name: 'Recall/Save Preset',
			style: textStyle(presetName, 'auto'),
			steps: [
				{
					down: [],
					up: [{ actionId: 'recallPreset', options: { preset: presetExpression, speed: 0 } }],
					[HOLD_DURATION]: { options: { runWhileHeld: true }, actions: [saveAction] },
					[HOLD_DURATION + 1]: clearSaveStatus,
				},
			],
			feedbacks: [
				{
					feedbackId: 'cameraAtPreset',
					options: { preset: presetExpression, tolerance: 0.01 },
					style: { color: WHITE, bgcolor: GREEN },
				},
				...saveFeedbacks,
			],
			localVariables: [{ variableType: 'simple', variableName: 'preset', startupValue: firstPreset }],
		}

		presets.cameraPresetSave = longPressPreset(
			'Save Preset (hold to save)',
			textStyle(`SAVE\\n${presetName}`, 'auto', DARK_RED),
			saveAction,
		)
		presets.cameraPresetSave.steps[0][HOLD_DURATION + 1] = clearSaveStatus
		presets.cameraPresetSave.feedbacks = saveFeedbacks
		presets.cameraPresetSave.localVariables = [
			{ variableType: 'simple', variableName: 'preset', startupValue: firstPreset },
		]

		cameraPresetDefinitions.unshift(
			{
				id: 'recall-save',
				type: 'template',
				name: 'Recall/Save Preset',
				description:
					'Press to recall the preset, or hold for 2 seconds to save the current camera position to it. The button turns green when the camera is at the preset, and shows SAVED until it is released after saving.',
				presetId: 'cameraPresetRecallSave',
				templateVariableName: 'preset',
				templateValues: self.CHOICES_PRESETS.map((choice) => ({
					name: `Recall/Save ${choice.label}`,
					value: sanitizePresetToken(choice.id),
				})),
			},
			{
				id: 'recall',
				type: 'template',
				name: 'Recall Preset',
				description: 'Change the "preset" local variable on a button to recall a different preset',
				presetId: 'cameraPresetRecall',
				templateVariableName: 'preset',
				templateValues: self.CHOICES_PRESETS.map((choice) => ({
					name: `Recall ${choice.label}`,
					value: sanitizePresetToken(choice.id),
				})),
			},
			{
				id: 'save',
				type: 'template',
				name: 'Save Preset',
				description: 'Hold the button for 2 seconds to save the current camera position to the preset',
				presetId: 'cameraPresetSave',
				templateVariableName: 'preset',
				templateValues: self.CHOICES_PRESETS.map((choice) => ({
					name: `Save ${choice.label}`,
					value: sanitizePresetToken(choice.id),
				})),
			},
		)
	}

	structure.push({
		id: 'camera-presets',
		name: 'Camera Presets',
		description: self.hasCameraPresets()
			? 'Generated from the presets stored on the camera.'
			: 'No presets have been loaded from the camera yet.',
		definitions: cameraPresetDefinitions,
	})

	// Focus
	presets.focusNear = holdPreset(
		'Focus Near',
		textStyle('FOCUS\\nNEAR'),
		{ actionId: 'focusNear', options: { speed: 50 } },
		{ actionId: 'focusStop', options: {} },
	)

	presets.focusFar = holdPreset(
		'Focus Far',
		textStyle('FOCUS\\nFAR'),
		{ actionId: 'focusFar', options: { speed: 50 } },
		{ actionId: 'focusStop', options: {} },
	)

	for (const [id, mode, text] of [
		['focusAuto', 'AUTO', 'AUTO\\nFOCUS'],
		['focusManual', 'MANUAL', 'MANUAL\\nFOCUS'],
	]) {
		presets[id] = {
			type: 'simple',
			name: `${mode === 'AUTO' ? 'Auto' : 'Manual'} Focus`,
			style: textStyle(text),
			steps: [{ down: [{ actionId: 'setFocusMode', options: { mode: mode } }], up: [] }],
			feedbacks: [{ feedbackId: 'focusMode', options: { mode: mode }, style: { color: WHITE, bgcolor: GREEN } }],
		}
	}

	presets.focusPosition = {
		type: 'simple',
		name: 'Focus Position',
		style: textStyle('FOCUS\\n$(onvif:focus_position)', 'auto'),
		steps: [],
		feedbacks: [
			{
				feedbackId: 'focusMoveSupported',
				options: { type: 'absolute' },
				style: { color: WHITE, bgcolor: GREEN },
			},
		],
	}

	structure.push({
		id: 'focus',
		name: 'Focus',
		description:
			'Hold Focus Near/Far to adjust the focus. Most cameras need to be in manual focus mode for this. Focus Position is green when the camera supports the Set Focus Position action.',
		definitions: ['focusNear', 'focusFar', 'focusAuto', 'focusManual', 'focusPosition'],
	})

	// Exposure
	for (const [id, mode, text] of [
		['exposureAuto', 'AUTO', 'AUTO\\nEXPOSURE'],
		['exposureManual', 'MANUAL', 'MANUAL\\nEXPOSURE'],
	]) {
		presets[id] = {
			type: 'simple',
			name: `${mode === 'AUTO' ? 'Auto' : 'Manual'} Exposure`,
			style: textStyle(text),
			steps: [{ down: [{ actionId: 'setExposureMode', options: { mode: mode } }], up: [] }],
			feedbacks: [
				{ feedbackId: 'exposureMode', options: { mode: mode }, style: { color: WHITE, bgcolor: GREEN } },
			],
		}
	}

	structure.push({
		id: 'exposure',
		name: 'Exposure',
		definitions: ['exposureAuto', 'exposureManual'],
	})

	// Status
	presets.cameraName = {
		type: 'simple',
		name: 'Camera Model',
		style: textStyle('$(onvif:manufacturer)\\n$(onvif:model)', 'auto'),
		steps: [],
		feedbacks: [],
	}

	presets.moveStatus = {
		type: 'simple',
		name: 'Moving Indicator',
		style: textStyle('P/T\\n$(onvif:movestatus_pantilt)\\nZOOM\\n$(onvif:movestatus_zoom)', 'auto'),
		steps: [],
		feedbacks: [
			{ feedbackId: 'isMoving', options: { state: 'MOVING' }, style: { color: WHITE, bgcolor: RED } },
			{ feedbackId: 'isZooming', options: { state: 'MOVING' }, style: { color: WHITE, bgcolor: RED } },
		],
	}

	presets.position = {
		type: 'simple',
		name: 'PTZ Position',
		style: textStyle(
			'X: $(onvif:ptzPosition_x)\\nY: $(onvif:ptzPosition_y)\\nZ: $(onvif:ptzPosition_zoom)',
			'auto',
		),
		steps: [],
		feedbacks: [],
	}

	structure.push({
		id: 'status',
		name: 'Status',
		definitions: ['cameraName', 'moveStatus', 'position'],
	})

	self.setPresetDefinitions(structure, presets)
}
