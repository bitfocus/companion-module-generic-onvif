const { combineRgb } = require('@companion-module/base')
const ICONS = require('./icons')

module.exports = {
	initPresets: function () {
		let self = this

		let presets = {}

		presets.cameraName = {
			category: 'System',
			type: 'button',
			name: 'Camera Name',
			style: {
				text: '$(onvif:cameraName)',
				size: '14',
				color: '16777215',
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [],
			feedbacks: [],
		}

		presets.panTiltUp = {
			category: 'Pan/Tilt',
			type: 'button',
			name: 'UP',
			style: {
				style: 'png',
				text: '',
				png64: ICONS.UP,
				pngalignment: 'center:center',
				size: '18',
				color: '16777215',
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: 'panTiltUp',
							options: {
								velocity: 0.5,
							},
						},
					],
					up: [
						{
							actionId: 'panTiltStop',
							options: {},
						},
					],
				},
			],
			feedbacks: [],
		}

		presets.panTiltDown = {
			category: 'Pan/Tilt',
			type: 'button',
			name: 'DOWN',
			style: {
				style: 'png',
				text: '',
				png64: ICONS.DOWN,
				pngalignment: 'center:center',
				size: '18',
				color: '16777215',
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: 'panTiltDown',
							options: {
								velocity: -0.5,
							},
						},
					],
					up: [
						{
							actionId: 'panTiltStop',
							options: {},
						},
					],
				},
			],
			feedbacks: [],
		}

		presets.panTiltLeft = {
			category: 'Pan/Tilt',
			type: 'button',
			name: 'LEFT',
			style: {
				style: 'png',
				text: '',
				png64: ICONS.LEFT,
				pngalignment: 'center:center',
				size: '18',
				color: '16777215',
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: 'panTiltLeft',
							options: {
								velocity: -0.5,
							},
						},
					],
					up: [
						{
							actionId: 'panTiltStop',
							options: {},
						},
					],
				},
			],
			feedbacks: [],
		}

		presets.panTiltRight = {
			category: 'Pan/Tilt',
			type: 'button',
			name: 'RIGHT',
			style: {
				style: 'png',
				text: '',
				png64: ICONS.RIGHT,
				pngalignment: 'center:center',
				size: '18',
				color: '16777215',
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: 'panTiltRight',
							options: {
								velocity: 0.5,
							},
						},
					],
					up: [
						{
							actionId: 'panTiltStop',
							options: {},
						},
					],
				},
			],
			feedbacks: [],
		}

		presets.panTiltUpLeft = {
			category: 'Pan/Tilt',
			type: 'button',
			name: 'UP LEFT',
			style: {
				style: 'png',
				text: '',
				png64: ICONS.UP_LEFT,
				pngalignment: 'center:center',
				size: '18',
				color: '16777215',
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: 'panTiltUpLeft',
							options: {
								velocity_pan: -0.5,
								velocity_tilt: 0.5,
							},
						},
					],
					up: [
						{
							actionId: 'panTiltStop',
							options: {},
						},
					],
				},
			],
			feedbacks: [],
		}

		presets.panTiltUpRight = {
			category: 'Pan/Tilt',
			type: 'button',
			name: 'UP RIGHT',
			style: {
				style: 'png',
				text: '',
				png64: ICONS.UP_RIGHT,
				pngalignment: 'center:center',
				size: '18',
				color: '16777215',
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: 'panTiltUpRight',
							options: {
								velocity_pan: 0.5,
								velocity_tilt: 0.5,
							},
						},
					],
					up: [
						{
							actionId: 'panTiltStop',
							options: {},
						},
					],
				},
			],
			feedbacks: [],
		}

		presets.panTiltDownLeft = {
			category: 'Pan/Tilt',
			type: 'button',
			name: 'DOWN LEFT',
			style: {
				style: 'png',
				text: '',
				png64: ICONS.DOWN_LEFT,
				pngalignment: 'center:center',
				size: '18',
				color: '16777215',
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: 'panTiltDownLeft',
							options: {
								velocity_pan: -0.5,
								velocity_tilt: -0.5,
							},
						},
					],
					up: [
						{
							actionId: 'panTiltStop',
							options: {},
						},
					],
				},
			],
			feedbacks: [],
		}

		presets.panTiltDownRight = {
			category: 'Pan/Tilt',
			type: 'button',
			name: 'DOWN RIGHT',
			style: {
				style: 'png',
				text: '',
				png64: ICONS.DOWN_RIGHT,
				pngalignment: 'center:center',
				size: '18',
				color: '16777215',
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: 'panTiltDownRight',
							options: {
								velocity_pan: 0.5,
								velocity_tilt: -0.5,
							},
						},
					],
					up: [
						{
							actionId: 'panTiltStop',
							options: {},
						},
					],
				},
			],
			feedbacks: [],
		}

		presets.panTiltHome = {
			category: 'Pan/Tilt',
			type: 'button',
			name: 'Home',
			style: {
				text: 'HOME',
				size: '18',
				color: '16777215',
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: 'gotoHomePosition',
							options: {
								pan: 0.5,
								tilt: 0.5,
								zoom: 0.5,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		self.setPresetDefinitions(presets)
	},
}
