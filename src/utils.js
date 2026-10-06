export const DEFAULT_SPEED = 50

/**
 * Clamp a speed percentage to the 1-100 range, falling back to the default speed if it is not a number
 */
export function clampSpeed(percent) {
	const value = Math.round(Number(percent))
	if (isNaN(value)) return DEFAULT_SPEED
	return Math.min(Math.max(value, 1), 100)
}

/**
 * Convert a speed percentage (1-100) into an ONVIF normalised velocity/speed (0.01-1)
 */
export function percentToVelocity(percent) {
	return clampSpeed(percent) / 100
}

/**
 * Camera preset tokens can contain characters that are not allowed in variable ids,
 * so replace anything unsupported to produce a stable key for each preset
 */
export function sanitizePresetToken(token) {
	return String(token).replace(/[^a-zA-Z0-9_.-]/g, '_')
}

/**
 * Number input for a speed percentage, which users can also drive from an expression/variable
 */
export function speedOption(id, label, defaultValue = DEFAULT_SPEED) {
	return {
		type: 'number',
		label: label,
		id: id,
		default: defaultValue,
		min: 1,
		max: 100,
		step: 1,
		range: true,
		clampValues: true,
		expressionDescription: 'Should result in a speed between 1 and 100 (%). Values outside this range are clamped.',
	}
}

/**
 * Dropdown of the presets stored on the camera.
 * Custom values are allowed so that saved actions keep working before the camera presets have loaded,
 * and so that expressions can provide a preset token directly.
 */
export function presetOption(choices) {
	return {
		type: 'dropdown',
		label: 'Preset',
		id: 'preset',
		default: choices[0].id,
		choices: choices,
		allowCustom: true,
		expressionDescription: 'Should result in the token of a preset stored on the camera.',
	}
}
