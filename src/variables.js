module.exports = {
	initVariables: function () {
		let self = this

		let variables = []

		//Device Information
		variables.push({ variableId: 'manufacturer', name: 'Manufacturer' })
		variables.push({ variableId: 'model', name: 'Model' })
		variables.push({ variableId: 'firmwareVersion', name: 'Firmware Version' })
		variables.push({ variableId: 'serialNumber', name: 'Serial Number' })
		variables.push({ variableId: 'hardwareId', name: 'Hardware ID' })

		//Status Information
		variables.push({ variableId: 'ptzPosition_x', name: 'PTZ Position X (Pan)' })
		variables.push({ variableId: 'ptzPosition_y', name: 'PTZ Position Y (Tilt)' })
		variables.push({ variableId: 'ptzPosition_zoom', name: 'PTZ Position Zoom' })
		variables.push({ variableId: 'movestatus_pantilt', name: 'Move Status Pan/Tilt' })
		variables.push({ variableId: 'movestatus_zoom', name: 'Move Status Zoom' })
		variables.push({ variableId: 'error_state', name: 'Error State' })
		variables.push({ variableId: 'utc_time', name: 'UTC Time' })

		//Preset Information
		if (self.CHOICES_PRESETS.length > 0 && self.CHOICES_PRESETS[0].id !== 0) {
			//only add presets if they exist
			for (let i = 0; i < self.CHOICES_PRESETS.length; i++) {
				variables.push({ variableId: `preset_${i + 1}`, name: `Preset ${i + 1} Name` })
			}
		}

		self.setVariableDefinitions(variables)
	},

	checkVariables: function () {
		let self = this

		try {
			let variableValues = {}

			variableValues.manufacturer = self.DATA?.deviceInformation?.manufacturer || ''
			variableValues.model = self.DATA?.deviceInformation?.model || ''
			variableValues.firmwareVersion = self.DATA?.deviceInformation?.firmwareVersion || ''
			variableValues.serialNumber = self.DATA?.deviceInformation?.serialNumber || ''
			variableValues.hardwareId = self.DATA?.deviceInformation?.hardwareId || ''

			variableValues.ptzPosition_x = self.DATA?.status?.position?.x || ''
			variableValues.ptzPosition_y = self.DATA?.status?.position?.y || ''
			variableValues.ptzPosition_z = self.DATA?.status?.position?.zoom || ''
			variableValues.movestatus_pantilt = self.DATA?.status?.moveStatus?.panTilt || ''
			variableValues.movestatus_zoom = self.DATA?.status?.moveStatus?.zoom || ''
			variableValues.error_state = self.DATA?.status?.error || ''
			variableValues.utc_time = self.DATA?.status?.utcTime || ''

			if (self.CHOICES_PRESETS.length > 0 && self.CHOICES_PRESETS[0].id !== 0) {
				//only add presets if they exist
				for (let i = 0; i < self.CHOICES_PRESETS.length; i++) {
					variableValues[`preset_${i + 1}`] = self.CHOICES_PRESETS[i].label || ''
				}
			}

			self.setVariableValues(variableValues)
		} catch (error) {
			self.log('error', 'Error parsing Variables from Device: ' + String(error))
			console.log(error)
		}
	},
}
