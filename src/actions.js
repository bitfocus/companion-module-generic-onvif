module.exports = {
	initActions: function () {
		let self = this

		let actions = {}

		//PTZ Functions
		actions.panTiltLeft = {
			name: 'Pan Left',
			options: [
				{
					type: 'dropdown',
					label: 'Pan Velocity',
					id: 'velocity',
					default: -0.5,
					choices: [
						{ id: -0.1, label: 'Speed 1' },
						{ id: -0.2, label: 'Speed 2' },
						{ id: -0.3, label: 'Speed 3' },
						{ id: -0.4, label: 'Speed 4' },
						{ id: -0.5, label: 'Speed 5' },
						{ id: -0.6, label: 'Speed 6' },
						{ id: -0.7, label: 'Speed 7' },
						{ id: -0.8, label: 'Speed 8' },
						{ id: -0.9, label: 'Speed 9' },
						{ id: -1, label: 'Speed 10' },
					],
				},
			],
			callback: async function (action) {
				let opt = action.options

				let options = {
					x: opt.velocity,
				}

				self.continuousMove(options)
			},
		}

		actions.panTiltRight = {
			name: 'Pan Right',
			options: [
				{
					type: 'dropdown',
					label: 'Pan Velocity',
					id: 'velocity',
					default: 0.5,
					choices: [
						{ id: 0.1, label: 'Speed 1' },
						{ id: 0.2, label: 'Speed 2' },
						{ id: 0.3, label: 'Speed 3' },
						{ id: 0.4, label: 'Speed 4' },
						{ id: 0.5, label: 'Speed 5' },
						{ id: 0.6, label: 'Speed 6' },
						{ id: 0.7, label: 'Speed 7' },
						{ id: 0.8, label: 'Speed 8' },
						{ id: 0.9, label: 'Speed 9' },
						{ id: 1, label: 'Speed 10' },
					],
				},
			],
			callback: async function (action) {
				let opt = action.options

				let options = {
					x: opt.velocity,
				}

				self.continuousMove(options)
			},
		}

		actions.panTiltUp = {
			name: 'Tilt Up',
			options: [
				{
					type: 'dropdown',
					label: 'Tilt Velocity',
					id: 'velocity',
					default: 0.5,
					choices: [
						{ id: 0.1, label: 'Speed 1' },
						{ id: 0.2, label: 'Speed 2' },
						{ id: 0.3, label: 'Speed 3' },
						{ id: 0.4, label: 'Speed 4' },
						{ id: 0.5, label: 'Speed 5' },
						{ id: 0.6, label: 'Speed 6' },
						{ id: 0.7, label: 'Speed 7' },
						{ id: 0.8, label: 'Speed 8' },
						{ id: 0.9, label: 'Speed 9' },
						{ id: 1, label: 'Speed 10' },
					],
				},
			],
			callback: async function (action) {
				let opt = action.options

				let options = {
					y: opt.velocity,
				}

				self.continuousMove(options)
			},
		}

		actions.panTiltDown = {
			name: 'Tilt Down',
			options: [
				{
					type: 'dropdown',
					label: 'Tilt Velocity',
					id: 'velocity',
					default: -0.5,
					choices: [
						{ id: -0.1, label: 'Speed 1' },
						{ id: -0.2, label: 'Speed 2' },
						{ id: -0.3, label: 'Speed 3' },
						{ id: -0.4, label: 'Speed 4' },
						{ id: -0.5, label: 'Speed 5' },
						{ id: -0.6, label: 'Speed 6' },
						{ id: -0.7, label: 'Speed 7' },
						{ id: -0.8, label: 'Speed 8' },
						{ id: -0.9, label: 'Speed 9' },
						{ id: -1, label: 'Speed 10' },
					],
				},
			],
			callback: async function (action) {
				let opt = action.options

				let options = {
					y: opt.velocity,
				}

				self.continuousMove(options)
			},
		}

		actions.panTiltUpLeft = {
			name: 'Pan/Tilt Up Left',
			options: [
				{
					type: 'dropdown',
					label: 'Pan Velocity',
					id: 'velocity_pan',
					default: -0.5,
					choices: [
						{ id: -0.1, label: 'Speed 1' },
						{ id: -0.2, label: 'Speed 2' },
						{ id: -0.3, label: 'Speed 3' },
						{ id: -0.4, label: 'Speed 4' },
						{ id: -0.5, label: 'Speed 5' },
						{ id: -0.6, label: 'Speed 6' },
						{ id: -0.7, label: 'Speed 7' },
						{ id: -0.8, label: 'Speed 8' },
						{ id: -0.9, label: 'Speed 9' },
						{ id: -1, label: 'Speed 10' },
					],
				},
				{
					type: 'dropdown',
					label: 'Tilt Velocity',
					id: 'velocity_tilt',
					default: 0.5,
					choices: [
						{ id: 0.1, label: 'Speed 1' },
						{ id: 0.2, label: 'Speed 2' },
						{ id: 0.3, label: 'Speed 3' },
						{ id: 0.4, label: 'Speed 4' },
						{ id: 0.5, label: 'Speed 5' },
						{ id: 0.6, label: 'Speed 6' },
						{ id: 0.7, label: 'Speed 7' },
						{ id: 0.8, label: 'Speed 8' },
						{ id: 0.9, label: 'Speed 9' },
						{ id: 1, label: 'Speed 10' },
					],
				},
			],
			callback: async function (action) {
				let opt = action.options

				let options = {
					x: opt.velocity_pan,
					y: opt.velocity_tilt,
				}

				self.continuousMove(options)
			},
		}

		actions.panTiltUpRight = {
			name: 'Pan/Tilt Up Right',
			options: [
				{
					type: 'dropdown',
					label: 'Pan Velocity',
					id: 'velocity_pan',
					default: 0.5,
					choices: [
						{ id: 0.1, label: 'Speed 1' },
						{ id: 0.2, label: 'Speed 2' },
						{ id: 0.3, label: 'Speed 3' },
						{ id: 0.4, label: 'Speed 4' },
						{ id: 0.5, label: 'Speed 5' },
						{ id: 0.6, label: 'Speed 6' },
						{ id: 0.7, label: 'Speed 7' },
						{ id: 0.8, label: 'Speed 8' },
						{ id: 0.9, label: 'Speed 9' },
						{ id: 1, label: 'Speed 10' },
					],
				},
				{
					type: 'dropdown',
					label: 'Tilt Velocity',
					id: 'velocity_tilt',
					default: 0.5,
					choices: [
						{ id: 0.1, label: 'Speed 1' },
						{ id: 0.2, label: 'Speed 2' },
						{ id: 0.3, label: 'Speed 3' },
						{ id: 0.4, label: 'Speed 4' },
						{ id: 0.5, label: 'Speed 5' },
						{ id: 0.6, label: 'Speed 6' },
						{ id: 0.7, label: 'Speed 7' },
						{ id: 0.8, label: 'Speed 8' },
						{ id: 0.9, label: 'Speed 9' },
						{ id: 1, label: 'Speed 10' },
					],
				},
			],
			callback: async function (action) {
				let opt = action.options

				let options = {
					x: opt.velocity_pan,
					y: opt.velocity_tilt,
				}

				self.continuousMove(options)
			},
		}

		actions.panTiltDownLeft = {
			name: 'Pan/Tilt Down Left',
			options: [
				{
					type: 'dropdown',
					label: 'Pan Velocity',
					id: 'velocity_pan',
					default: -0.5,
					choices: [
						{ id: -0.1, label: 'Speed 1' },
						{ id: -0.2, label: 'Speed 2' },
						{ id: -0.3, label: 'Speed 3' },
						{ id: -0.4, label: 'Speed 4' },
						{ id: -0.5, label: 'Speed 5' },
						{ id: -0.6, label: 'Speed 6' },
						{ id: -0.7, label: 'Speed 7' },
						{ id: -0.8, label: 'Speed 8' },
						{ id: -0.9, label: 'Speed 9' },
						{ id: -1, label: 'Speed 10' },
					],
				},
				{
					type: 'dropdown',
					label: 'Tilt Velocity',
					id: 'velocity_tilt',
					default: -0.5,
					choices: [
						{ id: -0.1, label: 'Speed 1' },
						{ id: -0.2, label: 'Speed 2' },
						{ id: -0.3, label: 'Speed 3' },
						{ id: -0.4, label: 'Speed 4' },
						{ id: -0.5, label: 'Speed 5' },
						{ id: -0.6, label: 'Speed 6' },
						{ id: -0.7, label: 'Speed 7' },
						{ id: -0.8, label: 'Speed 8' },
						{ id: -0.9, label: 'Speed 9' },
						{ id: -1, label: 'Speed 10' },
					],
				},
			],
			callback: async function (action) {
				let opt = action.options

				let options = {
					x: opt.velocity_pan,
					y: opt.velocity_tilt,
				}

				self.continuousMove(options)
			},
		}

		actions.panTiltDownRight = {
			name: 'Pan/Tilt Down Right',
			options: [
				{
					type: 'dropdown',
					label: 'Pan Velocity',
					id: 'velocity_pan',
					default: 0.5,
					choices: [
						{ id: 0.1, label: 'Speed 1' },
						{ id: 0.2, label: 'Speed 2' },
						{ id: 0.3, label: 'Speed 3' },
						{ id: 0.4, label: 'Speed 4' },
						{ id: 0.5, label: 'Speed 5' },
						{ id: 0.6, label: 'Speed 6' },
						{ id: 0.7, label: 'Speed 7' },
						{ id: 0.8, label: 'Speed 8' },
						{ id: 0.9, label: 'Speed 9' },
						{ id: 1, label: 'Speed 10' },
					],
				},
				{
					type: 'dropdown',
					label: 'Tilt Velocity',
					id: 'velocity_tilt',
					default: -0.5,
					choices: [
						{ id: -0.1, label: 'Speed 1' },
						{ id: -0.2, label: 'Speed 2' },
						{ id: -0.3, label: 'Speed 3' },
						{ id: -0.4, label: 'Speed 4' },
						{ id: -0.5, label: 'Speed 5' },
						{ id: -0.6, label: 'Speed 6' },
						{ id: -0.7, label: 'Speed 7' },
						{ id: -0.8, label: 'Speed 8' },
						{ id: -0.9, label: 'Speed 9' },
						{ id: -1, label: 'Speed 10' },
					],
				},
			],
			callback: async function (action) {
				let opt = action.options

				let options = {
					x: opt.velocity_pan,
					y: opt.velocity_tilt,
				}

				self.continuousMove(options)
			},
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
			options: [
				{
					type: 'dropdown',
					label: 'Zoom Velocity',
					id: 'velocity',
					default: 0.5,
					choices: [
						{ id: 0.1, label: 'Speed 1' },
						{ id: 0.2, label: 'Speed 2' },
						{ id: 0.3, label: 'Speed 3' },
						{ id: 0.4, label: 'Speed 4' },
						{ id: 0.5, label: 'Speed 5' },
						{ id: 0.6, label: 'Speed 6' },
						{ id: 0.7, label: 'Speed 7' },
						{ id: 0.8, label: 'Speed 8' },
						{ id: 0.9, label: 'Speed 9' },
						{ id: 1, label: 'Speed 10' },
					],
				},
			],
			callback: async function (action) {
				let opt = action.options

				let options = {
					zoom: opt.velocity,
				}

				self.continuousMove(options)
			},
		}

		actions.zoomOut = {
			name: 'Zoom Out',
			options: [
				{
					type: 'dropdown',
					label: 'Zoom Velocity',
					id: 'velocity',
					default: -0.5,
					choices: [
						{ id: -0.1, label: 'Speed 1' },
						{ id: -0.2, label: 'Speed 2' },
						{ id: -0.3, label: 'Speed 3' },
						{ id: -0.4, label: 'Speed 4' },
						{ id: -0.5, label: 'Speed 5' },
						{ id: -0.6, label: 'Speed 6' },
						{ id: -0.7, label: 'Speed 7' },
						{ id: -0.8, label: 'Speed 8' },
						{ id: -0.9, label: 'Speed 9' },
						{ id: -1, label: 'Speed 10' },
					],
				},
			],
			callback: async function (action) {
				let opt = action.options

				let options = {
					zoom: opt.velocity,
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
					required: true,
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
					required: true,
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
					required: true,
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
					required: true,
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
					required: true,
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
					required: true,
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
					required: true,
				},
				{
					type: 'number',
					label: 'Pan Speed',
					id: 'speed_pan',
					default: 1,
					min: 0,
					max: 1,
					step: 0.1,
					required: true,
				},
				{
					type: 'number',
					label: 'Tilt',
					id: 'tilt',
					default: 0.1,
					min: -1,
					max: 1,
					required: true,
				},
				{
					type: 'number',
					label: 'Tilt Speed',
					id: 'speed_tilt',
					default: 1,
					min: 0,
					max: 1,
					step: 0.1,
					required: true,
				},
				{
					type: 'number',
					label: 'Zoom',
					id: 'zoom',
					default: 0.1,
					min: -1,
					max: 1,
					required: true,
				},
				{
					type: 'number',
					label: 'Zoom Speed',
					id: 'speed_zoom',
					default: 1,
					min: 0,
					max: 1,
					step: 0.1,
					required: true,
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
					required: true,
				},
				{
					type: 'number',
					label: 'Tilt Velocity',
					id: 'tilt',
					default: 0,
					min: -1,
					max: 1,
					required: true,
				},
				{
					type: 'number',
					label: 'Zoom Velocity',
					id: 'zoom',
					default: 0,
					min: -1,
					max: 1,
					required: true,
				},
				{
					type: 'number',
					label: 'Timeout (in seconds)',
					id: 'timeout',
					default: 1,
					min: 1,
					max: 600,
					required: true,
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
					label: 'Stop Pan/Tile',
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
				{
					type: 'dropdown',
					label: 'Pan Speed',
					id: 'pan',
					default: 0.5,
					choices: [
						{ id: 0.1, label: 'Speed 1' },
						{ id: 0.2, label: 'Speed 2' },
						{ id: 0.3, label: 'Speed 3' },
						{ id: 0.4, label: 'Speed 4' },
						{ id: 0.5, label: 'Speed 5' },
						{ id: 0.6, label: 'Speed 6' },
						{ id: 0.7, label: 'Speed 7' },
						{ id: 0.8, label: 'Speed 8' },
						{ id: 0.9, label: 'Speed 9' },
						{ id: 1, label: 'Speed 10' },
					],
				},
				{
					type: 'dropdown',
					label: 'Tilt Speed',
					id: 'tilt',
					default: 0.5,
					choices: [
						{ id: 0.1, label: 'Speed 1' },
						{ id: 0.2, label: 'Speed 2' },
						{ id: 0.3, label: 'Speed 3' },
						{ id: 0.4, label: 'Speed 4' },
						{ id: 0.5, label: 'Speed 5' },
						{ id: 0.6, label: 'Speed 6' },
						{ id: 0.7, label: 'Speed 7' },
						{ id: 0.8, label: 'Speed 8' },
						{ id: 0.9, label: 'Speed 9' },
						{ id: 1, label: 'Speed 10' },
					],
				},
				{
					type: 'dropdown',
					label: 'Zoom Speed',
					id: 'zoom',
					default: 0.5,
					choices: [
						{ id: 0.1, label: 'Speed 1' },
						{ id: 0.2, label: 'Speed 2' },
						{ id: 0.3, label: 'Speed 3' },
						{ id: 0.4, label: 'Speed 4' },
						{ id: 0.5, label: 'Speed 5' },
						{ id: 0.6, label: 'Speed 6' },
						{ id: 0.7, label: 'Speed 7' },
						{ id: 0.8, label: 'Speed 8' },
						{ id: 0.9, label: 'Speed 9' },
						{ id: 1, label: 'Speed 10' },
					],
				},
			],
			callback: async function (action) {
				let opt = action.options

				let options = {
					speed: {
						x: opt.pan,
						y: opt.tilt,
						zoom: opt.zoom,
					},
				}

				console.log(options)

				self.gotoHomePosition(options)
			},
		}

		actions.setHomePosition = {
			name: 'Set Home Position',
			callback: async function () {
				self.setHomePosition()
			},
		}

		actions.recallPreset = {
			name: 'Recall Preset',
			options: [
				{
					type: 'dropdown',
					label: 'Preset',
					id: 'preset',
					default: self.CHOICES_PRESETS[0].id,
					choices: self.CHOICES_PRESETS,
				},
			],
			callback: async function (action) {
				let opt = action.options

				let options = {
					preset: opt.preset,
				}

				self.gotoPreset(options)
			},
		}
		;(actions.setPreset = {
			name: 'Set Preset',
			options: [
				{
					type: 'dropdown',
					label: 'Preset',
					id: 'preset',
					default: self.CHOICES_PRESETS[0].id,
					choices: self.CHOICES_PRESETS,
				},
				{
					type: 'textinput',
					label: 'Preset Name',
					id: 'presetName',
					default: '',
					required: true,
				},
			],
			callback: async function (action) {
				let opt = action.options

				let options = {
					presetToken: opt.preset,
					presetName: opt.presetName,
				}

				self.setPreset(options)
			},
		}),
			//Imaging Functions

			(actions.setBrightness = {
				name: 'Set Brightness',
				options: [
					{
						type: 'number',
						label: 'Brightness',
						id: 'brightness',
						default: 50,
						min: 0,
						max: 100,
						required: true,
					},
				],
				callback: async function (action) {
					let opt = action.options

					let options = {
						brightness: opt.brightness,
					}

					self.setImaging(options)
				},
			})

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
					required: true,
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
					required: true,
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
					required: true,
				},
				{
					type: 'number',
					label: 'Gain',
					id: 'gain',
					default: 0,
					min: 0,
					max: 100,
					required: true,
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
					required: true,
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
			callback: async function () {
				self.systemReboot()
			},
		}*/

		self.setActionDefinitions(actions)
	},
}
