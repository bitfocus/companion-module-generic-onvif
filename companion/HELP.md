# Generic ONVIF

This module controls cameras and other devices that support the ONVIF protocol.

Requires Companion 4.3 or newer.

## Configuration

- **IP / Port**: The address of the device. The port is usually 80.
- **Username / Password**: The ONVIF user on the device. The authentication mode on the device should be set to "digest/wsse".
- **ONVIF Device Path**: The default (`/onvif/device_service`) works for most devices.
- **Polling**: How often to request the PTZ status, presets and imaging settings from the device.
- **Reconnect Interval**: How long to wait before reconnecting after a failed connection. Set to 0 to disable.

## Using variables and expressions

Every action and feedback option can be switched into expression mode, so values such as speeds, presets and imaging levels can come from variables. For example, a Pan Left action could use `$(custom:camera_speed)` as its speed.

Speeds for the Pan/Tilt, Zoom, Focus and Go to Home actions are percentages from 1 to 100. Values outside this range are clamped.

The module also keeps its own Pan/Tilt and Zoom speeds, available as the `pt_speed` and `zoom_speed` variables. The Pan/Tilt, Zoom and Home presets use these, and they can be changed with the **Set Pan/Tilt Speed** and **Set Zoom Speed** actions (or the Speed presets). To use them in your own buttons, set the speed option to an expression such as `$(onvif:pt_speed)`, replacing `onvif` with the label of your connection.

## Actions

It is recommended to use the presets as much as possible as there are a lot of actions, variables, and feedbacks that work together.

### PTZ Functions

- Pan Left/Right
- Tilt Up/Down
- Pan/Tilt Up Left, Up Right, Down Left, Down Right
- Pan/Tilt Stop
- Zoom In/Out
- Zoom Stop
- Set Pan/Tilt Speed / Set Zoom Speed
    - Set, increase or decrease the speed used by the presets
- Relative Move
    - Moves the camera relative to the current PTZ position
    - Specify Individual Pan, Tilt, and Zoom values along with Pan, Tilt, and Zoom Speeds
- Absolute Move
    - Moves the camera to an absolute PTZ position
    - Specify Individual Pan, Tilt, and Zoom values along with Pan, Tilt, and Zoom Speeds
- Continuous Move
    - Moves the camera continuously until stopped
    - Specify Pan, Tilt, and Zoom Velocity
    - Specify Timeout - max amount of continous time allowed
- Stop Move
    - Stop Pan/Tilt
    - Stop Zoom
- Go to Home Position
    - Specify Pan, Tilt, and Zoom Speeds
- Set Home Position
- Recall Preset
    - Optionally specify a speed, or leave at 0 to use the speed configured on the camera
- Set Preset
    - Saves the current position to a preset. Leave the name blank to keep the current name of the preset.
- Clear Preset Save Status
    - Clears the Preset Save Status feedback. The Recall/Save Preset button runs this when it is released after saving.

### Imaging Functions

- Brightness
- Color Saturation
- Contrast
- Sharpness
- Exposure
    - Mode (Auto/Manual)
    - Exposure Time
    - Gain
- Exposure Mode (Auto/Manual/Toggle)
- Focus
    - Mode (Auto/Manual)
    - Near Limit
- Focus Mode (Auto/Manual/Toggle)
- Focus Near/Far/Stop
    - Most cameras need to be in manual focus mode for these to work
- Set Focus Position
    - Move the focus to a specific position, within the range given by the `focus_position_min` and `focus_position_max` variables
    - Not every camera supports this. Use the **Focus Move Supported** feedback to check, or see if the range variables have a value
    - Most cameras need to be in manual focus mode for this to work
- IR Cut Filter

## Feedbacks

- Camera is Moving (Pan/Tilt)
- Camera is Zooming
- Preset was Last Recalled
    - Cleared when the camera is moved by another action
- Camera is at Preset
    - If the camera reports the position stored in each preset and polling is enabled, this compares it to the current position, so it also notices when the camera is moved by something other than Companion. A recalled preset also counts while the camera is still moving to it
    - Otherwise this is the same as Preset was Last Recalled
    - Increase the Position Tolerance if the camera stops slightly off the stored position
- Preset Save Status (Saving/Saved/Failed)
    - Shown until the Clear Preset Save Status action runs, or for 10 seconds
- Speed Matches Value
- Focus Mode
- Focus Move Supported
    - Whether the camera reports support for setting a focus position (absolute), or for Focus Near/Far (continuous)
- Exposure Mode
- IR Cut Filter

## Variables

- Error State
- Firmware Version
- Hardware ID
- Manufacturer
- Model
- Serial Number
- Move Status (Pan/Tilt)
- Move Status (Zoom)
- PTZ Position X/Y/Zoom
- UTC Time
- Pan/Tilt Speed and Zoom Speed (`pt_speed`, `zoom_speed`)
- Brightness, Color Saturation, Contrast, Sharpness
- Exposure Mode, Focus Mode, IR Cut Filter
- Focus Position and Move Status (`focus_position`, `focus_move_status`)
- Focus Position Minimum/Maximum (`focus_position_min`, `focus_position_max`)
    - Empty when the camera does not support setting a focus position
- Number of Presets (`preset_count`)
- Last Recalled Preset token and name (`last_preset`, `last_preset_name`)
- Preset Names
    - By position in the list: `preset_1`, `preset_2`, ...
    - By preset token: `preset_name_<token>`, eg `preset_name_1`. Any characters in the token which are not allowed in a variable name are replaced with `_`.

## Presets

- **Pan/Tilt**: Up/Down/Left/Right/Up Left/Up Right/Down Left/Down Right, Home, Stop and Set Home (hold for 2 seconds)
- **Zoom**: Zoom In/Out
- **Speed**: Increase/decrease/reset the Pan/Tilt and Zoom speeds, a version for rotary encoders, and buttons for common speeds
- **Camera Presets**: Generated from the presets stored on the camera
    - Recall/Save buttons recall the preset when pressed, or save the current position to it when held for 2 seconds
        - The preset is recalled when the button is released, so that a long press doesn't recall it first
        - Green when the camera is at the preset (see the Camera is at Preset feedback)
        - After saving, the button shows SAVED in green, or SAVE FAILED in red, until it is released
    - Recall buttons show the name of the preset on the camera, and are highlighted when that preset was the last one recalled
    - Save buttons store the current position to the preset when held for 2 seconds, and show SAVED until they are released
    - To point a button at a different preset, change its `preset` local variable
- **Focus**: Focus Near/Far, Auto Focus, Manual Focus, and the Focus Position (green when the camera supports the Set Focus Position action)
- **Exposure**: Auto Exposure, Manual Exposure
- **Status**: Camera model, moving indicator and PTZ position
