import { InstanceBase, InstanceStatus } from '@companion-module/base'
import { UpgradeScripts } from './upgrades.js'

import * as config from './config.js'
import * as actions from './actions.js'
import * as feedbacks from './feedbacks.js'
import * as variables from './variables.js'
import * as presets from './presets.js'

import * as api from './api.js'
import { DEFAULT_SPEED } from './utils.js'

export { UpgradeScripts }

export default class onvifInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		// Assign the methods from the listed files to this class
		Object.assign(this, {
			...config,
			...actions,
			...feedbacks,
			...variables,
			...presets,
			...api,
		})

		this.DEVICE = null // The ONVIF device

		//global vars here

		this.DATA = {
			deviceInformation: {},
			systemDateAndTime: {},
			services: {},
			serviceCapabilities: {},
			status: {},
			presets: [],
			imagingSettings: {},
			focusMoveOptions: {},
			focusStatus: {},
			presetPositions: {},
			lastPreset: undefined,
		}

		// The progress of saving each preset, by preset token, used by the Preset Save Status feedback
		this.PRESET_SAVE = new Map()

		// The speeds (%) used by the presets, adjusted with the Set Pan/Tilt Speed and Set Zoom Speed actions
		this.SPEED = {
			panTilt: DEFAULT_SPEED,
			zoom: DEFAULT_SPEED,
		}

		this.CHOICES_PRESETS = [{ id: 0, label: '(no presets loaded)' }]
	}

	async destroy() {
		clearInterval(this.pollingInterval)
		clearTimeout(this.reconnectTimeout)
		for (const save of this.PRESET_SAVE.values()) clearTimeout(save.timeout)
	}

	async init(config) {
		await this.configUpdated(config)
	}

	async configUpdated(config) {
		this.updateStatus(InstanceStatus.Connecting)

		this.config = config

		this.initActions()
		this.initFeedbacks()
		this.initVariables()
		this.initPresets()

		this.initConnection()

		this.checkVariables()
		this.checkAllFeedbacks()
	}
}
