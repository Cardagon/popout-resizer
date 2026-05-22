import { MODULE_ID } from "./constants.js";
import { PopoutResizer } from "./popout-resizer.js";

export function registerSettings() {
  game.settings.register(MODULE_ID, "defaultWidth", {
    name: game.i18n.localize("POPOUTRESIZER.DefaultWidth.Name"),
    hint: game.i18n.localize("POPOUTRESIZER.DefaultWidth.Hint"),
    scope: "client",
    config: true,
    type: Number,
    default: 300,
    onChange: (value) => {
      PopoutResizer.defaultWidth = value;
    },
  });

  game.settings.register(MODULE_ID, "defaultHeight", {
    name: game.i18n.localize("POPOUTRESIZER.DefaultHeight.Name"),
    hint: game.i18n.localize("POPOUTRESIZER.DefaultHeight.Hint"),
    scope: "client",
    config: true,
    type: Number,
    default: 400,
    onChange: (value) => {
      PopoutResizer.defaultHeight = value;
    },
  });

  game.settings.register(MODULE_ID, "rememberSize", {
    name: game.i18n.localize("POPOUTRESIZER.RememberSize.Name"),
    hint: game.i18n.localize("POPOUTRESIZER.RememberSize.Hint"),
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    onChange: (value) => {
      PopoutResizer.rememberSize = value;
    },
  });

  game.settings.register(MODULE_ID, "popout-resizer-settings", {
    scope: "client",
    config: false,
    type: Object,
    default: {},
    onChange: (value) => {
      PopoutResizer.popoutResizerSettings = value ?? {};
    },
  });
}

export function initializeSettings() {
  PopoutResizer.defaultWidth = game.settings.get(MODULE_ID, "defaultWidth");
  PopoutResizer.defaultHeight = game.settings.get(MODULE_ID, "defaultHeight");
  PopoutResizer.rememberSize = game.settings.get(MODULE_ID, "rememberSize");
  PopoutResizer.popoutResizerSettings =
    game.settings.get(MODULE_ID, "popout-resizer-settings") ?? {};
}
