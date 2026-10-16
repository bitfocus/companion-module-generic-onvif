import { sanitizePresetToken } from './utils.js'

export function initVariables() {
	let self = this

	let variables = {}

	//Device Information
	variables.manufacturer = { name: 'Manufacturer' }
	variables.model = { name: 'Model' }
	variables.firmwareVersion = { name: 'Firmware Version' }
	variables.serialNumber = { name: 'Serial Number' }
	variables.hardwareId = { name: 'Hardware ID' }

	//Status Information
	variables.ptzPosition_x = { name: 'PTZ Position X (Pan)' }
	variables.ptzPosition_y = { name: 'PTZ Position Y (Tilt)' }
	variables.ptzPosition_zoom = { name: 'PTZ Position Zoom' }
	variables.movestatus_pantilt = { name: 'Move Status Pan/Tilt' }
	variables.movestatus_zoom = { name: 'Move Status Zoom' }
	variables.error_state = { name: 'Error State' }
	variables.utc_time = { name: 'UTC Time' }

	//Speed Information
	variables.pt_speed = { name: 'Pan/Tilt Speed (%) used by presets' }
	variables.zoom_speed = { name: 'Zoom Speed (%) used by presets' }

	//Imaging Information
	variables.brightness = { name: 'Brightness' }
	variables.color_saturation = { name: 'Color Saturation' }
	variables.contrast = { name: 'Contrast' }
	variables.sharpness = { name: 'Sharpness' }
	variables.exposure_mode = { name: 'Exposure Mode' }
	variables.focus_mode = { name: 'Focus Mode' }
	variables.focus_position = { name: 'Focus Position' }
	variables.focus_position_min = { name: 'Focus Position Minimum (empty if setting a focus position is unsupported)' }
	variables.focus_position_max = { name: 'Focus Position Maximum (empty if setting a focus position is unsupported)' }
	variables.focus_move_status = { name: 'Move Status Focus' }
	variables.ir_cut_filter = { name: 'IR Cut Filter' }

	//Preset Information
	variables.preset_count = { name: 'Number of Presets' }
	variables.last_preset = { name: 'Last Recalled Preset Token' }
	variables.last_preset_name = { name: 'Last Recalled Preset Name' }

	if (self.hasCameraPresets()) {
		//only add presets if they exist
		for (let i = 0; i < self.CHOICES_PRESETS.length; i++) {
			variables[`preset_${i + 1}`] = { name: `Preset ${i + 1} Name` }
		}

		for (const choice of self.CHOICES_PRESETS) {
			variables[`preset_name_${sanitizePresetToken(choice.id)}`] = { name: `Preset Name (token ${choice.id})` }
		}
	}

	self.setVariableDefinitions(variables)
}

export function checkVariables() {
	let self = this

	try {
		let variableValues = {}

		variableValues.manufacturer = self.DATA?.deviceInformation?.manufacturer || ''
		variableValues.model = self.DATA?.deviceInformation?.model || ''
		variableValues.firmwareVersion = self.DATA?.deviceInformation?.firmwareVersion || ''
		variableValues.serialNumber = self.DATA?.deviceInformation?.serialNumber || ''
		variableValues.hardwareId = self.DATA?.deviceInformation?.hardwareId || ''

		variableValues.ptzPosition_x = self.DATA?.status?.position?.x ?? ''
		variableValues.ptzPosition_y = self.DATA?.status?.position?.y ?? ''
		variableValues.ptzPosition_zoom = self.DATA?.status?.position?.zoom ?? ''
		variableValues.movestatus_pantilt = self.DATA?.status?.moveStatus?.panTilt || ''
		variableValues.movestatus_zoom = self.DATA?.status?.moveStatus?.zoom || ''
		variableValues.error_state = self.DATA?.status?.error || ''
		variableValues.utc_time = self.DATA?.status?.utcTime || ''

		variableValues.pt_speed = self.SPEED.panTilt
		variableValues.zoom_speed = self.SPEED.zoom

		let imaging = self.DATA?.imagingSettings
		variableValues.brightness = imaging?.brightness ?? ''
		variableValues.color_saturation = imaging?.colorSaturation ?? ''
		variableValues.contrast = imaging?.contrast ?? ''
		variableValues.sharpness = imaging?.sharpness ?? ''
		variableValues.exposure_mode = imaging?.exposure?.mode || ''
		variableValues.focus_mode = imaging?.focus?.autoFocusMode || ''

		let focusRange = self.getFocusPositionRange()
		variableValues.focus_position = self.DATA?.focusStatus?.position ?? ''
		variableValues.focus_position_min = focusRange?.min ?? ''
		variableValues.focus_position_max = focusRange?.max ?? ''
		variableValues.focus_move_status = self.DATA?.focusStatus?.moveStatus || ''
		variableValues.ir_cut_filter = imaging?.irCutFilter || ''

		variableValues.preset_count = self.hasCameraPresets() ? self.CHOICES_PRESETS.length : 0
		variableValues.last_preset = self.DATA?.lastPreset ?? ''
		variableValues.last_preset_name = self.getPresetName(self.DATA?.lastPreset)

		if (self.hasCameraPresets()) {
			//only add presets if they exist
			for (let i = 0; i < self.CHOICES_PRESETS.length; i++) {
				variableValues[`preset_${i + 1}`] = self.CHOICES_PRESETS[i].label || ''
			}

			for (const choice of self.CHOICES_PRESETS) {
				variableValues[`preset_name_${sanitizePresetToken(choice.id)}`] = choice.label || ''
			}
		}

		self.setVariableValues(variableValues)
	} catch (error) {
		self.log('error', 'Error parsing Variables from Device: ' + String(error))
	}
}
