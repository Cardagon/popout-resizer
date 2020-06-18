class PopoutResizer {
    static sidebarTabRendered(obj, html, data) {
        if(obj.options.popOut){
            const header = html.find('header')[0];
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

class ResizablePopout {
    constructor(app, html) {
        this.app = app;
        this.html = html;

        const header = html.find('header')[0];
        this.dragHandler = new Draggable(app, html, header, true);
        
        this.handle = this.html.find('.window-resizable-handle')[0];

        this.handle.addEventListener('mousedown', e => this._onResizeMouseDown(e), false);
    }

    _onResizeMouseDown(event) {
        window.addEventListener('mouseup', e => this._onResizeMouseUp(e), false);
    }

    _onResizeMouseUp(event) {
        window.removeEventListener('mouseup', e => this._onResizeMouseUp(e), false);

        let resizeData = {
            width: this.app.position.width,
            height: this.app.position.height
        };

        this.app.resizeData = resizeData;
    }
}

Hooks.on("renderSidebarTab", PopoutResizer.sidebarTabRendered);