import { MODULE_ID } from "./constants.js";

const MINIMUM_SIZE = 200;

/**
 * Static class that handles sidebar popout render hooks.
 */
export class PopoutResizer {
  static defaultWidth = 300;
  static defaultHeight = 400;
  static rememberSize = false;
  static popoutResizerSettings = {};
  static handledApps = new WeakSet();

  static sidebarTabRendered(app, html) {
    PopoutResizer.handleRenderedApp(app, html, true);
  }

  static applicationV2Rendered(app, html) {
    PopoutResizer.handleRenderedApp(app, html);
  }

  static handleRenderedApp(app, html, allowLegacySidebar = false) {
    const element = PopoutResizer.getElement(app, html);
    if (
      !app ||
      !element ||
      !PopoutResizer.isSidebarPopout(app, element, allowLegacySidebar)
    )
      return;

    PopoutResizer.popoutResizerSettings ??= {};

    const appKey = PopoutResizer.getStorageKey(app);
    const alreadyHandled =
      PopoutResizer.handledApps.has(app) ||
      element.dataset.popoutResizerHandled === "true";

    if (!alreadyHandled) {
      new ResizablePopout(app, element, appKey);
      PopoutResizer.handledApps.add(app);
      element.dataset.popoutResizerHandled = "true";
    }

    const resizeData = PopoutResizer.popoutResizerSettings[appKey];

    if (resizeData && (alreadyHandled || PopoutResizer.rememberSize)) {
      PopoutResizer.applyResizeData(app, resizeData);
      if (PopoutResizer.isCombatTracker(app, appKey)) app.scrollToTurn?.();
    } else if (!alreadyHandled) {
      app.setPosition?.({
        width: Math.max(PopoutResizer.defaultWidth, MINIMUM_SIZE),
        height: Math.max(PopoutResizer.defaultHeight, MINIMUM_SIZE),
      });
    }
  }

  static getElement(app, html) {
    const fromHtml = PopoutResizer.getFirstElement(html);

    if (fromHtml) return fromHtml.closest?.(".app, .application") ?? fromHtml;

    const appElement =
      PopoutResizer.getFirstElement(app?.element) ??
      PopoutResizer.getFirstElement(app?._element);

    return appElement?.closest?.(".app, .application") ?? appElement;
  }

  static getFirstElement(value) {
    if (!value) return null;
    if (PopoutResizer.isHTMLElement(value)) return value;

    const first = value[0];
    if (PopoutResizer.isHTMLElement(first)) return first;

    return null;
  }

  static isHTMLElement(value) {
    const HTMLElementCtor = value?.ownerDocument?.defaultView?.HTMLElement;
    return Boolean(HTMLElementCtor && value instanceof HTMLElementCtor);
  }

  static isSidebarPopout(app, element, allowLegacySidebar = false) {
    if (element?.classList?.contains("sidebar-popout")) return true;
    if (element?.closest?.(".sidebar-popout")) return true;

    return Boolean(
      allowLegacySidebar && app?.options?.popOut && (app.tabName || app.id),
    );
  }

  static getStorageKey(app) {
    return String(
      app.tabName ||
        app.id ||
        app.options?.id ||
        app.title ||
        app.constructor?.name,
    );
  }

  static isCombatTracker(app, appKey) {
    return app.tabName === "combat" || appKey.toLowerCase().includes("combat");
  }

  static applyResizeData(app, resizeData) {
    const position = {};

    for (const property of ["left", "top", "width", "height"]) {
      const rawValue = resizeData[property];
      if (rawValue === null || rawValue === undefined) continue;

      const value = Number(rawValue);
      if (Number.isFinite(value)) position[property] = value;
    }

    if (Object.keys(position).length) app.setPosition?.(position);
  }

  static saveResizeData(appKey, resizeData) {
    PopoutResizer.popoutResizerSettings = {
      ...(PopoutResizer.popoutResizerSettings ?? {}),
      [appKey]: resizeData,
    };

    const save = game.settings.set(
      MODULE_ID,
      "popout-resizer-settings",
      PopoutResizer.popoutResizerSettings,
    );

    save?.catch?.((error) => {
      console.warn("Popout Resizer | Failed to save popout size", error);
    });
  }
}

/**
 * Wrapper class for resizable popouts.
 */
class ResizablePopout {
  constructor(app, element, appKey) {
    this.app = app;
    this.element = element;
    this.appKey = appKey;
    this._onDragMouseUp = this._onDragMouseUp.bind(this);
    this._onResizeMouseUp = this._onResizeMouseUp.bind(this);

    const header = element.querySelector("header.window-header, header");
    if (header) {
      header.addEventListener(
        "pointerdown",
        (event) => this._onDragMouseDown(event),
        false,
      );

      const DraggableClass =
        foundry?.applications?.ux?.Draggable ?? globalThis.Draggable;
      if (DraggableClass) {
        this.dragHandler = new DraggableClass(app, element, header, true);
      }
    }

    this.handle = element.querySelector(".window-resizable-handle");
    if (this.handle) {
      this.handle.addEventListener(
        "pointerdown",
        (event) => this._onResizeMouseDown(event),
        false,
      );
    } else {
      console.warn(
        game.i18n.format("POPOUTRESIZER.NoResizeHandlerError", {
          appId: this.app.id,
        }),
      );
    }

    if (this.app.options) this.app.options.height = null;
  }

  _onDragMouseDown(event) {
    const eventWindow = event.view ?? window;
    eventWindow.addEventListener("pointerup", this._onDragMouseUp, {
      once: true,
    });
  }

  _onDragMouseUp() {
    this._saveCurrentPosition();
  }

  _onResizeMouseDown(event) {
    const eventWindow = event.view ?? window;
    eventWindow.addEventListener("pointerup", this._onResizeMouseUp, {
      once: true,
    });
  }

  _onResizeMouseUp() {
    this._saveCurrentPosition();
  }

  _saveCurrentPosition() {
    const position = this.app.position ?? {};
    const resizeData = {
      width: position.width,
      height: position.height,
      top: position.top,
      left: position.left,
    };

    PopoutResizer.saveResizeData(this.appKey, resizeData);
  }
}
