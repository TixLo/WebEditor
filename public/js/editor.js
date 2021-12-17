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
    loadSample: editorLoadSample,
    export: editorExport,
    exportCfg: editorExportCfg,
    importCfg: editorImportCfg,
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
    _getCol: _editorGetCol,
    _getColIdx: _editorGetColIdx,
    
    // row
    _rowAdd: _editorAddRow,
    _rowEdit: _editorEditRow,
    _rowDel: _editorDelRow,
    _rowMoveUp: _editorMoveUpRow,
    _rowMoveDown: _editorMoveDownRow,
    
    // col
    _colAdd: _editorAddCol,
    _colEdit: _editorEditCol,
    _colDel: _editorDelCol,
    _colMoveUp: _editorMoveUpCol,
    _colMoveDown: _editorMoveDownCol,
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
