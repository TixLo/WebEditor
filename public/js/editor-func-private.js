//
// other functions
//
var _drawFocusRow = function(rowId) {
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
}

var _switchRow = function(row, up) {
    for (var i=0 ; i<this.cfg.rows.length ; i++) {
        if (this.cfg.rows[i].id == row.id) {
            if (up) {
                this.cfg.rows[i-1].seq += 1;
                this.cfg.rows[i].seq -= 1;
                this.cfg.rows.swap(i, i-1);
            }
            else {
                this.cfg.rows[i].seq += 1;
                this.cfg.rows[i+1].seq -= 1;
                this.cfg.rows.swap(i, i+1);
            }
            break;
        }
    }
    
    gEditor._draw();
}

var _editorGetRow = function(rowId) {
    if (this.cfg.rows == null)
        return null;
        
    for (var i=0 ; i<this.cfg.rows.length ; i++) {
        if (this.cfg.rows[i].id == rowId)
            return this.cfg.rows[i];
    }
    return null;
}

var _editorGetRowIdx = function(rowId) {
    if (this.cfg.rows == null)
        return null;
        
    for (var i=0 ; i<this.cfg.rows.length ; i++) {
        if (this.cfg.rows[i].id == rowId)
            return i;
    }
    return null;
}


//
// UI
//
var _editorInitUI = function() {
    $('main').append(Template.settingPanelHtml());
}

var _editorDraw = function() {
    var _this = this;
    
    // clean editor
    this.editor.empty();
    
    // append editor style
    this.editor.append(Template.editorStyle());
    this.editor.append(Template.editorRowStyle());
    
    var seq = 0;
    // insert the first empty row
    this.editor.append(Template.rowEmptyHtml(seq));
    
    // traverse all rows and colso
    if (this.cfg.rows != null) {
        this.cfg.rows.forEach(function(row){
            var colsHtml = '';
            if (_this.cfg.cols != null) {
                var cols = _this.cfg.cols[row.id];
                if (cols != undefined) {
                    for (var i=0 ; i<cols.length ; i++) {
                        var col = cols[i];
                        colsHtml += Template.colHtml(col, row.id);
                    } // for (var i=0...)
                } // if (cols != undefined)
            }
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
    
    // registry focus event
    $('.editor-row').on('click', function(){
        if (_this.cfg.preview)
            return;
        var rowId = $(this).parent().data('rowId');
        _this.focus.rowId = rowId;
        _drawFocusRow(_this.focus.rowId);
    });
    
    // draw focus row if needed
    if (this.focus.rowId != null) {
        _drawFocusRow(this.focus.rowId);
    }
    
    // check preview mode
    if (this.cfg.preview) {
        $('.editor-ui').remove();
        $('.editor-row-style').remove();
    }
}

//
// Editor
//
var _editorPrepareCfg = function(title, action) {
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
            console.log(action);
            console.log(data);
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
            console.log(name + ':' + data);
            _this.cfg.rows[idx][name] = data;
            _this._draw();
        },
        closed: function() {
            if (_submitted)
                return;
            Object.assign(_this.cfg.rows[idx], origRow);
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

var _editorMoveUp = function(rowId) {
    var row = this._getRow(rowId);
    if (row == null)
        return;
    _switchRow(row, true);
}

var _editorMoveDown = function(rowId) {
    var row = this._getRow(rowId);
    if (row == null)
        return;

    _switchRow(row, false);
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
