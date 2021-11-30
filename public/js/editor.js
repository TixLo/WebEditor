//
// WebEditor
//
$.WebEditor = function(editor) {
    this.editor = editor;
    this.editorController = new $.EditorController();
    
    this.cfg = window[editor.data('config')];
    this.focus = {}
}

$.WebEditor.prototype = {
    //
    // public functions
    //
    open: editorOpen,
    turnOnPreview: editorTurnOnPreview,
    turnOffPreview: editorTurnOffPreview,

    //
    // private functions
    //
    _initUI: _editorInitUI,
    _registryEvt: _editorRegistryEvt,
    _draw: _editorDraw,
    
    // editor
    _prepareCfg: _editorPrepareCfg,
    _getRow: _editorGetRow,
    _getRowIdx: _editorGetRowIdx,
    
    // row
    _rowAdd: _editorAddRow,
    _rowEdit: _editorEditRow,
    _rowDel: _editorDelRow,
    _rowMoveUp: _editorMoveUp,
    _rowMoveDown: _editorMoveDown,
    
    // col
}

//
// extension    
//
$.fn.extend({
    open: function() {
        $.find('[data-editor="editor"]').forEach(function(editor){
            gEditor = new $.WebEditor($(editor));
        });
        gEditor.open();
    }
});
