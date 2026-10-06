import { InstanceStatus } from '@companion-module/base'
import onvif from 'onvif'
import { clampSpeed, percentToVelocity, sanitizePresetToken } from './utils.js'

const { Cam } = onvif

export function initConnection() {
	let self = this

	clearInterval(self.pollingInterval)
	clearTimeout(self.reconnectTimeout)

	self.imagingSupported = false
	self.imagingErrorLogged = false

	if (self.config.port == undefined) {
		self.config.port = 80
	}

	if (
		self.config.host &&
		self.config.host !== '' &&
		self.config.username &&
		self.config.username !== '' &&
		self.config.password &&
		self.config.password !== ''
	) {
		self.DEVICE = new Cam(
			{
				hostname: self.config.host,
				username: self.config.username,
				password: self.config.password,
				path: self.config.path,
				port: self.config.port,
			},
			function (err) {
				if (err) {
					self.updateStatus(InstanceStatus.ConnectionFailure, 'Error connecting. See log for details.')
					self.log('error', 'Error connecting to ' + self.config.host + ': ' + String(err))
					self.log(
						'error',
						'Check your ONVIF device configuration. The authentication mode should be set to "digest/wsse".',
					)
					const interval = self.config.reconnectInterval ?? 30
					if (interval === 0) return
					self.log('info', `Retrying connection in ${interval} seconds...`)
					self.reconnectTimeout = setTimeout(() => self.initConnection(), interval * 1000)
					return
				}

				self.updateStatus(InstanceStatus.Ok)

				self.getDeviceInformation()
				self.getSystemDateAndTime()
				self.getServices()
				self.getServiceCapabilities()
				self.getStatus()
				self.getNodes()
				self.getPresets()

				self.getImagingSettings()
				self.getFocusMoveOptions()
				self.startPolling()
			},
		)
	} else {
		self.updateStatus(InstanceStatus.BadConfig, 'IP, username and password are required')
	}
}

export function getDeviceInformation() {
	let self = this

	self.DEVICE.getDeviceInformation((err, info) => {
		if (err) {
			self.log('error', 'Error getting device information: ' + String(err))
			return
		}

		self.DATA.deviceInformation = info
		self.checkVariables()
	})
}

export function getSystemDateAndTime() {
	let self = this

	self.DEVICE.getSystemDateAndTime((err, dt) => {
		if (err) {
			self.log('error', 'Error getting system date and time: ' + String(err))
			return
		}

		self.DATA.systemDateAndTime = dt
		self.checkVariables()
	})
}

export function getServices() {
	let self = this

	self.DEVICE.getServices((err, services) => {
		if (err) {
			self.log('error', 'Error getting services: ' + String(err))
			return
		}

		self.DATA.services = services
	})
}

export function getServiceCapabilities() {
	let self = this

	self.DEVICE.getServiceCapabilities((err, capabilities) => {
		if (err) {
			self.log('error', 'Error getting service capabilities: ' + String(err))
			return
		}

		self.DATA.serviceCapabilities = capabilities
	})
}

export function getStatus() {
	let self = this

	self.DEVICE.getStatus((err, status) => {
		if (err) {
			//self.log('error', 'Error getting status: ' + String(err))
			return
		}

		self.DATA.status = status
		self.checkFeedbacks('isMoving', 'isZooming')
		self.checkVariables()
	})
}

export function getNodes() {
	let self = this

	self.DEVICE.getNodes((err, nodes) => {
		if (err) {
			//self.log('error', 'Error getting nodes: ' + String(err))
			return
		}

		self.DATA.nodes = nodes
	})
}

export function getPresets() {
	let self = this

	self.DEVICE.getPresets((err, presets) => {
		if (err) {
			//self.log('error', 'Error getting presets: ' + String(err))
			return
		}

		self.DATA.presets = presets

		//build choices_presets array with key/value pairs
		//save copy of current array to compare for changes
		let tempChoices = self.CHOICES_PRESETS
		self.CHOICES_PRESETS = []
		for (let key in presets) {
			self.CHOICES_PRESETS.push({ id: presets[key], label: key })
		}

		// If no presets are found, add a default option
		if (self.CHOICES_PRESETS.length === 0) {
			self.CHOICES_PRESETS.push({ id: 0, label: '(no presets loaded)' })
		}

		//rebuild dropdowns, variables and presets, but only if the presets have changed
		if (JSON.stringify(tempChoices) !== JSON.stringify(self.CHOICES_PRESETS)) {
			self.initActions()
			self.initFeedbacks()
			self.initVariables()
			self.initPresets()
			self.checkFeedbacks('presetActive')
			self.checkVariables()
		}
	})
}

/**
 * Whether presets have been loaded from the camera (rather than the placeholder choice)
 */
export function hasCameraPresets() {
	return this.CHOICES_PRESETS.length > 0 && this.CHOICES_PRESETS[0].id !== 0
}

/**
 * Resolve a preset option value to a camera preset token.
 * Accepts either the token itself, or the sanitized form of it that is used in variable names and presets.
 */
export function resolvePresetToken(value) {
	let self = this

	const token = String(value ?? '').trim()
	if (self.CHOICES_PRESETS.find((choice) => String(choice.id) === token)) return token

	const match = self.CHOICES_PRESETS.find((choice) => sanitizePresetToken(choice.id) === token)
	return match ? String(match.id) : token
}

/**
 * Get the name of a camera preset from its token
 */
export function getPresetName(token) {
	let self = this

	const choice = self.CHOICES_PRESETS.find((choice) => String(choice.id) === String(token))
	return choice && self.hasCameraPresets() ? choice.label : ''
}

export function setLastPreset(token) {
	let self = this

	if (self.DATA.lastPreset === token) return

	self.DATA.lastPreset = token
	self.checkFeedbacks('presetActive')
	self.checkVariables()
}

export function getImagingSettings() {
	let self = this

	if (!self.DEVICE) return

	self.DEVICE.getImagingSettings((err, settings) => {
		if (err) {
			// Not every device supports the imaging service, so only report this once
			if (!self.imagingErrorLogged) {
				self.log('error', 'Error getting imaging settings: ' + String(err))
				self.imagingErrorLogged = true
			}
			return
		}

		self.imagingSupported = true
		self.imagingErrorLogged = false
		self.DATA.imagingSettings = settings ?? {}
		self.checkFeedbacks('focusMode', 'exposureMode', 'irCutFilter')
		self.checkVariables()
	})
}

export function getFocusMoveOptions() {
	let self = this

	self.DEVICE.imagingGetMoveOptions((err, options) => {
		if (err) {
			// Focus moves are optional, fall back to the default speed range
			return
		}

		self.DATA.focusMoveOptions = options ?? {}
	})
}

export function startPolling() {
	let self = this

	if (self.config.polling) {
		self.pollingInterval = setInterval(() => {
			self.getStatus()
			self.getPresets()
			if (self.imagingSupported) {
				self.getImagingSettings()
			}
		}, self.config.interval)
	}
}

//PTZ Functions
export function relativeMove(options) {
	let self = this

	if (self.DEVICE) {
		self.setLastPreset(undefined)
		self.DEVICE.relativeMove(options, (err) => {
			if (err) self.log('error', 'Error moving camera: ' + String(err))
		})
	}
}

export function absoluteMove(options) {
	let self = this

	if (self.DEVICE) {
		self.setLastPreset(undefined)
		self.DEVICE.absoluteMove(options, (err) => {
			if (err) self.log('error', 'Error moving camera: ' + String(err))
		})
	}
}

export function continuousMove(options) {
	let self = this

	if (self.DEVICE) {
		self.setLastPreset(undefined)
		self.DEVICE.continuousMove(options, (err) => {
			if (err) self.log('error', 'Error moving camera: ' + String(err))
		})
	}
}

export function stop(options) {
	let self = this

	if (self.DEVICE) {
		if (!options?.panTilt && !options?.zoom) return

		// ONVIF stops an axis when its flag is omitted, so explicitly send 'false' for any axis that should keep moving
		let stopOptions = {
			panTilt: options.panTilt ? 'true' : 'false',
			zoom: options.zoom ? 'true' : 'false',
		}

		self.DEVICE.stop(stopOptions, (err) => {
			if (!err) return

			if (options.panTilt && options.zoom) {
				self.log('error', 'Error stopping camera: ' + String(err))
				return
			}

			// Some devices reject a stop for a single axis, so make sure the camera doesn't keep moving
			self.log('warn', 'Error stopping camera, stopping all movement instead: ' + String(err))
			self.DEVICE.stop({}, (err) => {
				if (err) self.log('error', 'Error stopping camera: ' + String(err))
			})
		})
	}
}

export function gotoHomePosition(options) {
	let self = this

	if (self.DEVICE) {
		self.setLastPreset(undefined)
		self.DEVICE.gotoHomePosition(options, (err) => {
			if (err) {
				self.log('error', 'Error going to home position: ' + String(err))
				return
			}
		})
	}
}

export function setHomePosition() {
	let self = this

	if (self.DEVICE) {
		self.DEVICE.setHomePosition({}, (err) => {
			if (err) {
				self.log('error', 'Error setting home position: ' + String(err))
				return
			}

			self.log('info', 'Home position set')
		})
	}
}

export function gotoPreset(options) {
	let self = this

	if (self.DEVICE) {
		self.DEVICE.gotoPreset(options, (err) => {
			if (err) {
				self.log('error', 'Error going to preset: ' + String(err))
				return
			}

			self.setLastPreset(options.preset)
		})
	}
}

export function setPreset(options) {
	let self = this

	if (self.DEVICE) {
		self.DEVICE.setPreset(options, (err) => {
			if (err) {
				self.log('error', 'Error setting preset: ' + String(err))
				return
			}

			self.log('info', `Preset "${options.presetName}" saved`)

			self.getPresets()
		})
	}
}

/**
 * Update the pan/tilt or zoom speed used by the presets
 * @param {'panTilt' | 'zoom'} axis
 * @param {'set' | 'increase' | 'decrease'} mode
 * @param {number} value The speed to set, or the amount to increase/decrease by
 */
export function setSpeed(axis, mode, value) {
	let self = this

	let speed = self.SPEED[axis]
	if (mode === 'increase') {
		speed += Number(value)
	} else if (mode === 'decrease') {
		speed -= Number(value)
	} else {
		speed = Number(value)
	}

	self.SPEED[axis] = clampSpeed(speed)
	self.checkFeedbacks('speed')
	self.checkVariables()
}

//Imaging Functions
export function setImaging(options) {
	let self = this

	if (self.DEVICE) {
		self.DEVICE.setImagingSettings(options, (err) => {
			if (err) {
				self.log('error', 'Error setting imaging settings: ' + String(err))
				return
			}

			// Refresh the settings so that feedbacks and variables reflect the change
			self.getImagingSettings()
		})
	}
}

/**
 * Start a continuous focus move
 * @param {number} direction -1 for near, 1 for far
 * @param {number} speed Speed percentage (1-100)
 */
export function focusMove(direction, speed) {
	let self = this

	if (self.DEVICE) {
		// Scale to the speed range reported by the camera, as this varies between devices
		const maxSpeed = Math.abs(Number(self.DATA.focusMoveOptions?.continuous?.speed?.max)) || 1

		self.DEVICE.imagingMove({ continuous: { speed: direction * percentToVelocity(speed) * maxSpeed } }, (err) => {
			if (err) self.log('error', 'Error moving focus: ' + String(err))
		})
	}
}

export function focusStop() {
	let self = this

	if (self.DEVICE) {
		self.DEVICE.imagingStop({}, (err) => {
			if (err) self.log('error', 'Error stopping focus: ' + String(err))
		})
	}
}

//Other Functions
export function systemReboot() {
	let self = this

	if (self.DEVICE) {
		self.DEVICE.systemReboot((err) => {
			if (err) {
				self.log('error', 'Error rebooting system: ' + String(err))
				return
			}
		})
	}
}
