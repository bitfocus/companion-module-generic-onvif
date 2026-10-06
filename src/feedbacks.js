import { combineRgb } from '@companion-module/base'
import { presetOption } from './utils.js'

export function initFeedbacks() {
	let self = this

	let feedbacks = {}

	const foregroundColor = combineRgb(255, 255, 255) // White
	const backgroundColorRed = combineRgb(255, 0, 0) // Red
	const backgroundColorGreen = combineRgb(0, 204, 0) // Green

	feedbacks.isMoving = {
		type: 'boolean',
		name: 'Camera is Moving (Pan/Tilt)',
		description: 'Indicate if Camera is Moving',
		defaultStyle: {
			color: foregroundColor,
			bgcolor: backgroundColorRed,
		},
		options: [
			{
				type: 'dropdown',
				label: 'State',
				id: 'state',
				default: 'MOVING',
				choices: [
					{ id: 'MOVING', label: 'Moving' },
					{ id: 'IDLE', label: 'Idle' },
				],
			},
		],
		callback: function (feedback) {
			let opt = feedback.options

			if (self.DATA?.status?.moveStatus?.panTilt === opt.state) {
				return true
			}
			return false
		},
	}

	feedbacks.isZooming = {
		type: 'boolean',
		name: 'Camera is Zooming',
		description: 'Indicate if Camera is Zooming',
		defaultStyle: {
			color: foregroundColor,
			bgcolor: backgroundColorRed,
		},
		options: [
			{
				type: 'dropdown',
				label: 'State',
				id: 'state',
				default: 'MOVING',
				choices: [
					{ id: 'MOVING', label: 'Moving' },
					{ id: 'IDLE', label: 'Idle' },
				],
			},
		],
		callback: function (feedback) {
			let opt = feedback.options

			if (self.DATA?.status?.moveStatus?.zoom === opt.state) {
				return true
			}
			return false
		},
	}

	feedbacks.presetActive = {
		type: 'boolean',
		name: 'Preset was Last Recalled',
		description:
			'Indicate if the selected preset was the last one recalled. This is cleared when the camera is moved by another action.',
		defaultStyle: {
			color: foregroundColor,
			bgcolor: backgroundColorGreen,
		},
		options: [presetOption(self.CHOICES_PRESETS)],
		callback: function (feedback) {
			let opt = feedback.options

			if (self.DATA.lastPreset === undefined) {
				return false
			}
			return String(self.DATA.lastPreset) === self.resolvePresetToken(opt.preset)
		},
	}

	feedbacks.speed = {
		type: 'boolean',
		name: 'Speed Matches Value',
		description: 'Indicate if the pan/tilt or zoom speed used by the presets matches a value',
		defaultStyle: {
			color: foregroundColor,
			bgcolor: backgroundColorGreen,
		},
		options: [
			{
				type: 'dropdown',
				label: 'Speed',
				id: 'axis',
				default: 'panTilt',
				choices: [
					{ id: 'panTilt', label: 'Pan/Tilt' },
					{ id: 'zoom', label: 'Zoom' },
				],
				disableAutoExpression: true,
			},
			{
				type: 'number',
				label: 'Value (%)',
				id: 'value',
				default: 50,
				min: 1,
				max: 100,
				clampValues: true,
			},
		],
		callback: function (feedback) {
			let opt = feedback.options

			return self.SPEED[opt.axis] === Number(opt.value)
		},
	}

	feedbacks.focusMode = {
		type: 'boolean',
		name: 'Focus Mode',
		description: 'Indicate if the camera is in the selected focus mode',
		defaultStyle: {
			color: foregroundColor,
			bgcolor: backgroundColorGreen,
		},
		options: [
			{
				type: 'dropdown',
				label: 'Mode',
				id: 'mode',
				default: 'AUTO',
				choices: [
					{ id: 'AUTO', label: 'Auto' },
					{ id: 'MANUAL', label: 'Manual' },
				],
			},
		],
		callback: function (feedback) {
			return self.DATA?.imagingSettings?.focus?.autoFocusMode === feedback.options.mode
		},
	}

	feedbacks.exposureMode = {
		type: 'boolean',
		name: 'Exposure Mode',
		description: 'Indicate if the camera is in the selected exposure mode',
		defaultStyle: {
			color: foregroundColor,
			bgcolor: backgroundColorGreen,
		},
		options: [
			{
				type: 'dropdown',
				label: 'Mode',
				id: 'mode',
				default: 'AUTO',
				choices: [
					{ id: 'AUTO', label: 'Auto' },
					{ id: 'MANUAL', label: 'Manual' },
				],
			},
		],
		callback: function (feedback) {
			return self.DATA?.imagingSettings?.exposure?.mode === feedback.options.mode
		},
	}

	feedbacks.irCutFilter = {
		type: 'boolean',
		name: 'IR Cut Filter',
		description: 'Indicate if the IR cut filter is in the selected state',
		defaultStyle: {
			color: foregroundColor,
			bgcolor: backgroundColorGreen,
		},
		options: [
			{
				type: 'dropdown',
				label: 'State',
				id: 'state',
				default: 'AUTO',
				choices: [
					{ id: 'AUTO', label: 'Auto' },
					{ id: 'ON', label: 'On' },
					{ id: 'OFF', label: 'Off' },
				],
			},
		],
		callback: function (feedback) {
			return self.DATA?.imagingSettings?.irCutFilter === feedback.options.state
		},
	}

	self.setFeedbackDefinitions(feedbacks)
}
