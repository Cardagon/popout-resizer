import * as PopoutSetings from './modules/register-settings.js';
import * as PopoutResizer from './modules/popout-resizer.js';

Hooks.on("init", async () => {
    Hooks.on('renderApplicationV2', (app, html, data, flags) => {
        PopoutResizer.PopoutResizer.sidebarTabRendered(app, $(html), data);
    });

    PopoutSetings.registerSettings();
    PopoutSetings.initializeSettings();
});