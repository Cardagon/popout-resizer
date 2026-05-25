import * as PopoutSettings from "./modules/register-settings.js";
import * as PopoutResizer from "./modules/popout-resizer.js";

Hooks.once("init", () => {
  PopoutSettings.registerSettings();
  PopoutSettings.initializeSettings();

  Hooks.on(
    "renderApplicationV2",
    PopoutResizer.PopoutResizer.applicationV2Rendered,
  );

  if (game.system?.id === "pf2e") {
    Hooks.on(
      "renderCombatTracker",
      PopoutResizer.PopoutResizer.applicationV2Rendered,
    );
  }
});
