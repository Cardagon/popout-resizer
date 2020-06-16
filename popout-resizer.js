class PopoutResizer {
    static sidebarTabRendered(obj, html, data) {
        if(obj.options.popOut){
            const header = html.find('header')[0];
            new Draggable(obj, html, header, true);
        }
    }
}

Hooks.on("renderSidebarTab", PopoutResizer.sidebarTabRendered);