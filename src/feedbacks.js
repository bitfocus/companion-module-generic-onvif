const { combineRgb } = require('@companion-module/base')

module.exports = {
	initFeedbacks: function () {
		let self = this

		let feedbacks = {}

		const foregroundColor = combineRgb(255, 255, 255) // White
		const backgroundColorRed = combineRgb(255, 0, 0) // Red

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

		self.setFeedbackDefinitions(feedbacks)
	},
}
