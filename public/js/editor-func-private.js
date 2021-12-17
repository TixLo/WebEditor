//
// other functions
//
var _disableFocus = function() {
    // remove all focus class
    $('.editor-row').removeClass('editor-row-non-focus');
    $('.editor-row').removeClass('editor-row-focus');
    
    // append non-focus class for all row
    $('.editor-row').addClass('editor-row-non-focus');
       
    // remove all focus class
    $('.editor-col').removeClass('editor-col-non-focus');
    $('.editor-col').removeClass('editor-col-focus');
    
    // append non-focus class for all row
    $('.editor-col').addClass('editor-col-non-focus');
    $('.editor-ui-col').remove();

    gEditor.focus.colId = null;
    gEditor.focus.rowId = null;
}

var _drawFocusRow = function() {
    var rowId = gEditor.focus.rowId;
    var row = $($.find('[data-row-id=' + rowId + ']'));
    if (row == null)
        return;
    // remove all focus class
    $('.editor-row').removeClass('editor-row-non-focus');
    $('.editor-row').removeClass('editor-row-focus');
    
    // append non-focus class for all row
    $('.editor-row').addClass('editor-row-non-focus');
    
    // remove non-focus and append focus for selected row
    row.children('.editor-row').removeClass('editor-row-non-focus');
    row.children('.editor-row').addClass('editor-row-focus');
    
    var colId = gEditor.focus.colId;
    if (colId == null)
        return;
        
    var col = $($.find('[data-col-id=' + colId + ']'));
    if (col == null)
        return;
        
    // remove all focus class
    row.find('.editor-col').removeClass('editor-col-non-focus');
    row.find('.editor-col').removeClass('editor-col-focus');
    
    // append non-focus class for all row
    row.find('.editor-col').addClass('editor-col-non-focus');
    
    // remove non-focus and append focus for selected row
    col.removeClass('editor-col-non-focus');
    col.addClass('editor-col-focus');
    
    $('.editor-ui-col').remove();
    var colCfg = gEditor._getCol(rowId, colId);
    col.append(Template.colButtonHtml(rowId, colCfg,
        (colCfg.seq == 1) ? true : false,
        (colCfg.seq == gEditor.cfg.cols[rowId].length) ? true: false
        ));
}

var _switchRow = function(row, up) {
    for (var i=0 ; i<gEditor.cfg.rows.length ; i++) {
        if (gEditor.cfg.rows[i].id == row.id) {
            if (up) {
                gEditor.cfg.rows[i-1].seq += 1;
                gEditor.cfg.rows[i].seq -= 1;
                gEditor.cfg.rows.swap(i, i-1);
            }
            else {
                gEditor.cfg.rows[i].seq += 1;
                gEditor.cfg.rows[i+1].seq -= 1;
                gEditor.cfg.rows.swap(i, i+1);
            }
            break;
        }
    }
    
    gEditor._draw();
}

var _switchCol = function(rowId, col, up) {
    for (var i=0 ; i<gEditor.cfg.cols[rowId].length ; i++) {
        if (gEditor.cfg.cols[rowId][i].id == col.id) {
            if (up) {
                gEditor.cfg.cols[rowId][i-1].seq += 1;
                gEditor.cfg.cols[rowId][i].seq -= 1;
                gEditor.cfg.cols[rowId].swap(i, i-1);
            }
            else {
                gEditor.cfg.cols[rowId][i].seq += 1;
                gEditor.cfg.cols[rowId][i+1].seq -= 1;
                gEditor.cfg.cols[rowId].swap(i, i+1);
            }
            break;
        }
    }
    
    gEditor._draw();
}


var _editorGetRow = function(rowId) {
    if (gEditor.cfg.rows == null)
        return null;
        
    for (var i=0 ; i<gEditor.cfg.rows.length ; i++) {
        if (gEditor.cfg.rows[i].id == rowId)
            return gEditor.cfg.rows[i];
    }
    return null;
}

var _editorGetRowIdx = function(rowId) {
    if (gEditor.cfg.rows == null)
        return null;
        
    for (var i=0 ; i<gEditor.cfg.rows.length ; i++) {
        if (gEditor.cfg.rows[i].id == rowId)
            return i;
    }
    return null;
}

var _editorGetCol = function(rowId, colId) {
    if (gEditor.cfg.cols == null || gEditor.cfg.cols[rowId] == null)
        return null;
        
    for (var i=0 ; i<gEditor.cfg.cols[rowId].length ; i++) {
        if (colId == gEditor.cfg.cols[rowId][i].id)
            return gEditor.cfg.cols[rowId][i];
    }
    return null;
}

var _editorGetColIdx = function(rowId, colId) {
    if (gEditor.cfg.cols == null || gEditor.cfg.cols[rowId] == null)
        return null;
        
    for (var i=0 ; i<gEditor.cfg.cols[rowId].length ; i++) {
        if (colId == gEditor.cfg.cols[rowId][i].id)
            return i;
    }
    return null;
}

//
// UI
//
var _editorInitUI = function() {
    //$('main').append(Template.settingPanelHtml());
}

var _editorDraw = function() {
    var _this = this;
    
    // clean editor
    this.editor.empty();
    
    // append editor style
    this.editor.append(Template.editorStyle());
    this.editor.append(Template.editorRowStyle());
    this.editor.append(Template.editorColStyle());
    
    var seq = 0;
    // insert the first empty row
    this.editor.append(Template.rowEmptyHtml(seq));
    
    var colJs = '';
    var colInitJs = '';
    // traverse all rows and colso
    if (this.cfg.rows != null) {
        this.cfg.rows.forEach(function(row){
            if (row.hidden && _this.cfg.preview)
                return;
            var colSeq = 0;
            var colsHtml = '';
            var colsStyle = '';
            
            // insert the first empty col
            colsHtml += Template.colEmptyHtml(colSeq, row.id);

            if (_this.cfg.cols != null) {                
                var cols = _this.cfg.cols[row.id];
                var totalCols = 0;
                if (cols != undefined) {
                    for (var i=0 ; i<cols.length ; i++) {
                        var col = cols[i];
                        if (col.hidden && _this.cfg.preview)
                            continue;
                        colsHtml += Template.colHtml(col, row.id);
                        colsStyle += Template.colStyle(col, row.id);
                        
                        var js = Category[col.category].js(col);
                        if (js != null) {
                            colJs += js;
                        }
                        
                        js = Category[col.category].initJs(col);
                        if (js != null) {
                            colInitJs += js + '\n';
                        }
                        
                        if (i != cols.length - 1) {
                            totalCols += col.col;
                            if (totalCols + cols[i + 1].col > 12) {
                                // insert the first empty col
                                colsHtml += Template.colEmptyHtml(col.seq + 1, row.id);
                                totalCols = 0;
                            }
                        }
                        
                        colSeq += 1;
                    } // for (var i=0...)
                    
                    // insert the last empty col
                    colsHtml += Template.colEmptyHtml(colSeq + 1, row.id);
                } // if (cols != undefined)
            }
            _this.editor.append(colsStyle);
            _this.editor.append(Template.rowHtml(row, colsHtml));
            // append row's editing buttons
            var obj = $('[data-row-id=' + row.id + ']');
            obj.children('.editor-row').append(
                Template.rowButtonHtml(row,
                    (seq == 0) ? true : false,
                    (seq == _this.cfg.rows.length - 1) ? true : false)
                );
            
            seq += 1;
            // insert empty row
            _this.editor.append(Template.rowEmptyHtml(seq));
        });
    }
    _this.editor.append('<script>' + colJs + '</script>');
    _this.editor.append(`
        <script>
        $( document ).ready(function() {
            {0}
        }
        );
        </script>
    `.format(colInitJs));

    // registry focus event
    $('.editor-col').on('click', function(event){
        if (_this.cfg.preview)
            return;
        _this.focus.colId = $(this).data('colId');
        _this.focus.rowId = $(this).data('rowId');
        _drawFocusRow();
        if (gMenu != null)
            gMenu.hideAllSubMenu();
        event.preventDefault();
    });
    
    // registry focus event
    $('.editor-row').on('click', function(){
        if (_this.cfg.preview)
            return;
        _this.focus.colId = null;
        _this.focus.rowId = $(this).parent().data('rowId');
        if (gMenu != null)
            gMenu.hideAllSubMenu();
        _drawFocusRow();
    });
    
    // draw focus row if needed
    if (this.focus.rowId != null) {
        _drawFocusRow();
    }
    
    // check preview mode
    if (this.cfg.preview) {
        $('.editor-ui').remove();
        $('.editor-row-style').remove();
        $('.editor-row').removeClass('editor-row-non-focus');
        $('.editor-row').removeClass('editor-row-focus');
        $('.editor-col').removeClass('editor-col-non-focus');
        $('.editor-col').removeClass('editor-col-focus');
        
        //$('main').append(Template.copyToClipboardButton());
    }
    else {
        $('#clipboard-button').remove();
    }
}

//
// Editor
//
var _editorPrepareCfg = function(title, action) {
    if (gMenu != null)
        gMenu.hideAllSubMenu();
    var ajax = {};
    if (action == 'edit')
        ajax.edit = '';
    else if (action == 'remove')
        ajax.remove = '';
    else if (action == 'create')
        ajax.create = '';
        
    var config = {
        title: title,
        ajax: ajax
    };
    return config;
}

//
// row
//
var _editorAddRow = function(seq) {
    var _this = this;
    var config = this._prepareCfg('新增', 'create');
    config.fields = Fields.rowFields({seq: seq});
    config.cb = {
        submit: function(action, data) {
            var newRow = Object.assign({}, data);
            newRow.seq = seq;
            newRow.id = new Date().getTime();
            
            if (_this.cfg.rows == null) {
                _this.cfg.rows = [];
            }
            _this.cfg.rows.insert(seq, newRow);
            
            for (var i=0 ; i<_this.cfg.rows.length ; i++) {
                _this.cfg.rows[i].seq = i + 1;
            }
            _this._draw();
        }
    };
    this.editorController.open(config);
    _disableFocus();
}

var _editorEditRow = function(rowId) {
    var _this = this;
    var row = this._getRow(rowId);
    var idx = this._getRowIdx(rowId);
    if (row == null)
        return;

    var _submitted = false;
    var origRow = Object.assign({}, row);
    var config = this._prepareCfg('編輯', 'edit');
    config.fields = Fields.rowFields(row);
    config.cb = {
        submit: function(action, data) {
            Object.assign(_this.cfg.rows[idx], data);
            _this._draw();
            _submitted = true;
        },
        change: function(name, data) {

            _this.cfg.rows[idx][name] = data;
            _this._draw();
        },
        closed: function() {
            if (_submitted)
                return;
            Object.assign(_this.cfg.rows[idx], origRow);
            _this._draw();
        }
    };
    this.editorController.open(config);
}

var _editorDelRow = function(rowId) {
    var _this = this;
    var row = this._getRow(rowId);
    if (row == null)
        return;

    var config = this._prepareCfg('刪除', 'remove');
    config.fields = [];
    config.message = '確定要刪除?';
    config.cb = {
        submit: function(action, data) {
            var idx = _this._getRowIdx(rowId);
            _this.cfg.rows.del(idx);
            
            for (var i=0 ; i<_this.cfg.rows.length ; i++) {
                _this.cfg.rows[i].seq = i + 1;
            }
            _this._draw();
        }
    };
    this.editorController.open(config);
}

var _editorMoveUpRow = function(rowId) {
    var row = this._getRow(rowId);
    if (row == null)
        return;
    _switchRow(row, true);
}

var _editorMoveDownRow = function(rowId) {
    var row = this._getRow(rowId);
    if (row == null)
        return;

    _switchRow(row, false);
}

//
// col
//
var _editorAddCatetory = function(editor, col, rowId) {
    if (col.category == null)
        return;
    var config = editor._prepareCfg('新增[' + Category.getCategoryDesc(col.category) + ']', 'create');
    config.fields = Fields.colFields(col);
    config.options = Fields.colOptions(col);
    config.cb = {
        submit: function(action, data) {
            if (editor.cfg.cols == null) {
                editor.cfg.cols = {};
            }
            if (editor.cfg.cols[rowId] == null) {
                editor.cfg.cols[rowId] = [];
            }
            
            var newCol = {
                id: new Date().getTime(),
                seq: col.seq,
                category: col.category,
            };
            newCol = Object.assign(newCol, data);
            
            // validate
            var errMsg = Category[col.category].validate(newCol);
            if (errMsg != null) {
                gEditor.editorController.editor.error(errMsg);
                return false;
            }
            
            // insert col to proper position
            var i=0;
            for ( ; i<editor.cfg.cols[rowId].length ; i++) {
                if (editor.cfg.cols[rowId][i].seq >= col.seq)
                    break;
            }
            editor.cfg.cols[rowId].insert(i, newCol);
            
            // refill seq
            for (i=0 ; i<editor.cfg.cols[rowId].length ; i++) {
                editor.cfg.cols[rowId][i].seq = i + 1;
            }
            
            editor._draw();
        }
    };
    editor.editorController.open(config);
}

var _editorAddCol = function(seq, rowId) {
    var _this = this;
    var _category = null;
    var col = {seq: seq};
    var config = this._prepareCfg('選擇類別', 'create');
    config.fields = Fields.colFields(col);
    config.options = Fields.colOptions(col);
    config.cb = {
        submit: function(action, data) {
            _category = data.category;
        },
        closed: function() {
            col.category = _category;
            _editorAddCatetory(_this, col, rowId);
        }
    };
    this.editorController.open(config);
    _disableFocus();
}

var _editorEditCol = function(rowId, colId) {
    var _this = this;
    var col = this._getCol(rowId, colId);
    var idx = this._getColIdx(rowId, colId);
    if (col == null)
        return;

    var _submitted = false;
    var origCol = Object.assign({}, col);
    var config = this._prepareCfg('編輯', 'edit');
    config.fields = Fields.colFields(col);
    config.options = Fields.colOptions(col);
    config.cb = {
        submit: function(action, data) {
            // validate
            var errMsg = Category[col.category].validate(data);
            if (errMsg != null) {
                gEditor.editorController.editor.error(errMsg);
                return false;
            }
            
            Object.assign(_this.cfg.cols[rowId][idx], data);
            _this._draw();
            _submitted = true;
        },
        change: function(name, data) {
            _this.cfg.cols[rowId][idx][name] = data;
            _this._draw();
        },
        closed: function() {
            if (_submitted)
                return;
            Object.assign(_this.cfg.cols[rowId][idx], origCol);
            _this._draw();
        }
    };
    this.editorController.open(config);
}

var _editorDelCol = function(rowId, colId) {
    var _this = this;
    var col = this._getCol(rowId, colId);
    var idx = this._getColIdx(rowId, colId);
    if (col == null)
        return;

    var config = this._prepareCfg('刪除', 'remove');
    config.fields = [];
    config.message = '確定要刪除?';
    config.cb = {
        submit: function(action, data) {
            _this.cfg.cols[rowId].del(idx);
            
            for (var i=0 ; i<_this.cfg.cols[rowId].length ; i++) {
                _this.cfg.cols[rowId][i].seq = i + 1;
            }
            _this._draw();
        }
    };
    this.editorController.open(config);
}

var _editorMoveUpCol = function(rowId, colId) {
    var col = gEditor._getCol(rowId, colId);
    var idx = gEditor._getColIdx(rowId, colId);
    if (col == null)
        return;
    _switchCol(rowId, col, true);
}

var _editorMoveDownCol = function(rowId, colId) {
    var col = gEditor._getCol(rowId, colId);
    var idx = gEditor._getColIdx(rowId, colId);
    if (col == null)
        return;
    _switchCol(rowId, col, false);
}

//
// Events
//
var _editorRegistryEvt = function() { 
    var _this = this;
    $('.editor-setting-btn').on('click', function(){
        if (gMenu != null) {
            gMenu.hideAllSubMenu();
        }
        var config = _this._prepareCfg('編輯', 'edit');
        _this.editorController.open(config);
    });
}
