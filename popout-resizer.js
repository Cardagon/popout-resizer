/**
 * Static class that handles the sidebar tab rendered hook
 */
class PopoutResizer {
    static sidebarTabRendered(obj, html, data) {

        // Only handle this event if the obj in question is a popout
        if(obj.options.popOut){

            // Get existing size data
            let resizeData = obj.resizeData;

            var resizablePopout = new ResizablePopout(obj, html);
            if(resizeData) {
                resizablePopout.app.position.height = resizeData.height;
                resizablePopout.app.position.width = resizeData.width;
                resizablePopout.app.element[0].style.height = resizeData.height + 'px';
                resizablePopout.app.element[0].style.width = resizeData.width + 'px';
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
        this.dragHandler = new Draggable(app, html, header, true);
        
        this.handle = this.html.find('.window-resizable-handle')[0];
        if(this.handle) {
            this.handle.addEventListener('mousedown', e => this._onResizeMouseDown(e), false);
        } else {
            console.error('Resize handler does not exist on popout for app: ' + this.app.id);
        }
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
            height: this.app.position.height
        };

        this.app.resizeData = resizeData;
    }
}

Hooks.once("init", async () => {
    // Hook into all render sidebar tabs this will fire for every sidebar tab
    Hooks.on("renderSidebarTab", PopoutResizer.sidebarTabRendered);

    // Handle combat tracker for PF2E
    if(game.system.id === 'pf2e') {
        Hooks.on('renderCombatTracker', PopoutResizer.sidebarTabRendered);
    }
});