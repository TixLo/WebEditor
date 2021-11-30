var editorOpen = function() {
    this._initUI();
    this._registryEvt();
    this._draw();
}

var editorTurnOnPreview = function() {
    this.cfg.preview = true;
    this._draw();
}

var editorTurnOffPreview = function() {
    this.cfg.preview = false;
    this._draw();
}

