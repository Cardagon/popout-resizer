Hooks.once("init", async () => {
    // Hook into all render sidebar tabs this will fire for every sidebar tab
    Hooks.on("renderSidebarTab", PopoutResizer.sidebarTabRendered);

    // Handle combat tracker for PF2E
    if(game.system.id === 'pf2e') {
        Hooks.on('renderCombatTracker', PopoutResizer.sidebarTabRendered);
    }

    registerSettings();
    initializeSettings();
});

/**
 * Static class that handles the sidebar tab rendered hook
 */
class PopoutResizer {

    static defaultWidth = 300;
    static defaultHeight = 400;
    static rememberSize = false;
    static popoutResizerSettings = null;

    static sidebarTabRendered(obj, html, data) {

        // Only handle this event if the obj in question is a popout
        if(obj.options.popOut){

            // Get existing size data
            let resizeData = PopoutResizer.popoutResizerSettings[obj.tabName];
            let resizeHandled = obj.resizeHandled;

            if(!resizeHandled){
                var resizablePopout = new ResizablePopout(obj, html);
            }

            if(resizeData && (resizeHandled || PopoutResizer.rememberSize)) {
                obj.setPosition({left: resizeData.left, top: resizeData.top, width: resizeData.width, height: resizeData.height});
            } else {
                obj.setPosition({width: PopoutResizer.defaultWidth, height: PopoutResizer.defaultHeight});
            }
        }
    }
}

/**
 * Wrapper class for resizable popout
 */
class ResizablePopout {
    constructor(app, html) {
        this.app = app;
        this.html = html;

        const header = html.find('header')[0];
        header.addEventListener('mousedown', e => this._onDragMouseDown(e), false);
        
        this.dragHandler = new Draggable(app, html, header, true);
        
        this.handle = this.html.find('.window-resizable-handle')[0];
        if(this.handle) {
            this.handle.addEventListener('mousedown', e => this._onResizeMouseDown(e), false);
        } else {
            console.error('Resize handler does not exist on popout for app: ' + this.app.id);
        }

        this.app.resizeHandled = true;
        this.app.options.height = null;
    }

    _onDragMouseDown(event) {
        window.addEventListener('mouseup', e => this._onDragMouseUp(e), false);
    }

    _onDragMouseUp(event) {
        window.removeEventListener('mouseup', e => this._onDragMouseUp(e), false);

        let resizeData = {
            width: this.app.position.width, 
            height: this.app.position.height, 
            top: this.app.position.top, 
            left: this.app.position.left
        };

        PopoutResizer.popoutResizerSettings[this.app.tabName] = resizeData;
        game.settings.set('popout-resizer', 'popout-resizer-settings', PopoutResizer.popoutResizerSettings);
    }

    // Begin capturing mouse up events to record new window size
    _onResizeMouseDown(event) {
        window.addEventListener('mouseup', e => this._onResizeMouseUp(e), false);
    }

    // On mouse up record window size as the resize event has ended
    _onResizeMouseUp(event) {
        window.removeEventListener('mouseup', e => this._onResizeMouseUp(e), false);

        let resizeData = {
            width: this.app.position.width, 
            height: this.app.position.height, 
            top: this.app.position.top, 
            left: this.app.position.left
        };

        PopoutResizer.popoutResizerSettings[this.app.tabName] = resizeData;
        game.settings.set('popout-resizer', 'popout-resizer-settings', PopoutResizer.popoutResizerSettings);
    }
}