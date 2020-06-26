import * as PopoutSetings from './modules/register-settings.js';
import * as PopoutResizer from './modules/popout-resizer.js';

Hooks.on("init", async () => {
    // Hook into all render sidebar tabs this will fire for every sidebar tab
    Hooks.on("renderSidebarTab", PopoutResizer.PopoutResizer.sidebarTabRendered);

    // Handle combat tracker for PF2E
    if(game.system.id === 'pf2e') {
        Hooks.on('renderCombatTracker', PopoutResizer.PopoutResizer.sidebarTabRendered);
    }

    PopoutSetings.registerSettings();
    PopoutSetings.initializeSettings();
});