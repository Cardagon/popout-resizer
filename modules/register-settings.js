import { PopoutResizer } from './popout-resizer.js';

export function registerSettings() {

    /* Default Popout Width */
    game.settings.register('popout-resizer', 'defaultWidth', {
        name: 'Default Popout Width (Pixels)',
        hint: 'Default width of the popouts',
        scope: 'client',
        config: true,
        type: Number,
        default: 300,
        onChange: value => {
            PopoutResizer.defaultWidth = value;
        }
    });

    /* Default Popout Height */
    game.settings.register('popout-resizer', 'defaultHeight', {
        name: 'Default Popout Height (Pixels)',
        hint: 'Default height of the popouts',
        scope: 'client',
        config: true,
        type: Number,
        default: 400,
        onChange: value => {
            PopoutResizer.defaultHeight = value;
        }
    });
    
    /* Enable/Disable Saving Popout Size and Position */
    game.settings.register('popout-resizer', 'rememberSize', {
        name: 'Remember size and position?',
        hint: 'Saves latest re-size and position of pop outs',
        scope: 'client',
        config: true,
        type: Boolean,
        default: true,
        onChange: value => {
            PopoutResizer.rememberSize = value;
        }
    });

    /* Saved Popout Sizes and Positions */
    game.settings.register('popout-resizer', 'popout-resizer-settings', {
        scope: 'client',
        config: false,
        type: Object,
        default: new Object(),
        onChange: value => {
            PopoutResizer.rememberSize = value;
        }
    });

}

export function initializeSettings() {
    PopoutResizer.defaultWidth = game.settings.get('popout-resizer', 'defaultWidth');
    PopoutResizer.defaultHeight = game.settings.get('popout-resizer', 'defaultHeight');
    
    PopoutResizer.rememberSize = game.settings.get('popout-resizer', 'rememberSize');

    PopoutResizer.popoutResizerSettings = game.settings.get('popout-resizer', 'popout-resizer-settings');
}