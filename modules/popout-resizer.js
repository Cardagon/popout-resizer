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
  static appStates = new WeakMap();

  static applicationV2Rendered(app, html) {
    PopoutResizer.handleRenderedApp(app, html);
  }

  static handleRenderedApp(app, html) {
    PopoutResizer.popoutResizerSettings ??= {};
    if (!PopoutResizer.isSupportedApp(app)) return;

    const shell = PopoutResizer.getShell(app, html);
    if (!shell) return;

    const state = PopoutResizer.getAppState(app);
    PopoutResizer.ensureSingleResizeHandle(shell);
    PopoutResizer.scheduleResizeHandleCleanup(app, shell);

    const appKey = PopoutResizer.getStorageKey(app);
    const isNewShell = state.shell !== shell;
    if (isNewShell) {
      state.shell = shell;
      state.resizer = new ResizablePopout(app, shell, appKey);
    }

    PopoutResizer.ensurePositionListener(app, state);
    const resizeData = PopoutResizer.popoutResizerSettings[appKey];

    if (resizeData && PopoutResizer.rememberSize) {
      PopoutResizer.queuePositionRestore(app, state, resizeData, {
        scrollToTurn: PopoutResizer.isCombatTracker(app, appKey),
      });
    } else if (isNewShell) {
      PopoutResizer.queuePositionRestore(app, state, {
        width: Math.max(PopoutResizer.defaultWidth, MINIMUM_SIZE),
        height: Math.max(PopoutResizer.defaultHeight, MINIMUM_SIZE),
      });
    }
  }

  static isSupportedApp(app) {
    return (
      app instanceof foundry.applications.sidebar.AbstractSidebarTab &&
      app.isPopout
    );
  }

  static getShell(app, html) {
    const appElement =
      PopoutResizer.getFirstElement(app?.element) ??
      PopoutResizer.getFirstElement(app?._element);

    if (appElement) return appElement.closest?.(".app, .application") ?? appElement;

    const fromHtml = PopoutResizer.getFirstElement(html);
    return fromHtml?.closest?.(".app, .application") ?? fromHtml;
  }

  static getAppState(app) {
    let state = PopoutResizer.appStates.get(app);
    if (state) return state;

    state = {
      shell: null,
      resizer: null,
      positionListenerAttached: false,
      pendingPosition: null,
      applyingPosition: false,
      flushScheduled: false,
      cleanupScheduled: false,
    };
    PopoutResizer.appStates.set(app, state);
    return state;
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

  static ensureSingleResizeHandle(element) {
    const handles = element.querySelectorAll(".window-resizable-handle");
    if (handles.length <= 1) return;

    for (const handle of Array.from(handles).slice(1)) {
      handle.remove();
    }
  }

  static scheduleResizeHandleCleanup(app, element) {
    if (!app || !element) return;

    const state = PopoutResizer.getAppState(app);
    if (state.cleanupScheduled) return;

    const elementWindow = element.ownerDocument?.defaultView ?? globalThis;
    const scheduleFrame =
      elementWindow.requestAnimationFrame?.bind(elementWindow) ??
      ((callback) => elementWindow.setTimeout(callback, 0));

    state.cleanupScheduled = true;
    scheduleFrame(() => {
      state.cleanupScheduled = false;
      if (!element.isConnected) return;
      PopoutResizer.ensureSingleResizeHandle(element);
    });
  }

  static ensurePositionListener(app, state) {
    if (!app || state.positionListenerAttached) return;

    app.addEventListener("position", () => {
      PopoutResizer.flushPendingPosition(app, state);
    });

    state.positionListenerAttached = true;
  }

  static queuePositionRestore(app, state, resizeData, options = {}) {
    if (!app || !state || !resizeData) return;

    state.pendingPosition = {
      resizeData,
      scrollToTurn: options.scrollToTurn === true,
    };
    PopoutResizer.schedulePendingPositionFlush(app, state);
  }

  static schedulePendingPositionFlush(app, state) {
    if (!app || !state || state.flushScheduled) return;

    const appWindow = state.shell?.ownerDocument?.defaultView ?? globalThis;
    const scheduleFrame =
      appWindow.requestAnimationFrame?.bind(appWindow) ??
      ((callback) => appWindow.setTimeout(callback, 0));

    state.flushScheduled = true;
    scheduleFrame(() => {
      state.flushScheduled = false;
      PopoutResizer.flushPendingPosition(app, state);
    });
  }

  static flushPendingPosition(app, state = PopoutResizer.getAppState(app)) {
    if (!app || !state || state.applyingPosition) return;

    const pending = state.pendingPosition;
    if (!pending) return;

    state.pendingPosition = null;
    state.applyingPosition = true;

    try {
      PopoutResizer.applyResizeData(app, pending.resizeData);
      if (pending.scrollToTurn) app.scrollToTurn?.();
    } finally {
      state.applyingPosition = false;
    }
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
