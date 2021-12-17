//
// WebEditor
//
$.EditorController = function() {
    this.id = 0;
    this.state = 'closed';
}

$.EditorController.prototype = {
    open: function(cfg) {
        if (this.state == 'opened') {
            return;
        }
        this.cfg = cfg;
        this.editor = this.newEditor();
        if (this.id > 0)
            this.editor.edit(this.id);
        else
            this.editor.create();
        
        this.editor.buttons(this.buttons());
        
        if (cfg.title != null)
            this.editor.title(cfg.title);
            
        if (cfg.message != null)
            this.editor.message(cfg.message);
    },
    newEditor: function() {
        var _this = this;
        return new $.fn.dataTable.Editor( {
            ajax: this.cfg.ajax,
            idSrc: this.id,
            fields: this.fields(),
        })
        .on('opened', function(){
            if (_this.cfg.cb != null && _this.cfg.cb.opened != null)
                _this.cfg.cb.opened();
            
            _this.state = 'opened';
           
            if (_this.cfg.fields == null)
                return;
                
            _this.cfg.fields.forEach(function(f){
                // registry change event
                if (_this.cfg.cb.change != null) {
                    var selector = f.getSelector();
                    if (selector != null) {
                        var _f = f;
                        selector.on('change', function(){
                            if (_f.name == 'col')
                                _this.cfg.cb.change(_f.name, parseInt(f.getSelectorVal()));
                            else
                                _this.cfg.cb.change(_f.name, f.getSelectorVal());
                        });
                    }
                }
                
                // opened event for special types
                if (f.type == 'color' || 
                    f.type == 'fontType' ||
                    f.type == 'fontAlign' ||
                    f.type == 'folderPick' ||
                    f.type == 'dynamicInput') {
                    _fieldTypes[f.type].opened(_this.editor.conf[f.name]);
                }
            });              
        })
        .on('preSubmit', function(event, data, action) {
            var ret = false;
            if (_this.cfg.cb != null && _this.cfg.cb.submit != null) {
                var submitData = null;
                for (const [key, value] of Object.entries(data.data)) {
                    submitData = value;
                }
                
                if (submitData != null) {
                    for (const [key, value] of Object.entries(submitData)) {
                        var cfgField = _this._getCfgField(key);
                        if (cfgField == null)
                            continue;
                        if (cfgField.type == 'checkbox') {
                            submitData[key] = (value == '1') ? true : false ;
                        }
                        else if (cfgField.name == 'col') {
                            submitData[key] = parseInt(value);
                        }
                    }                    
                }
                
                ret = _this.cfg.cb.submit(action, submitData);
            }
            if (ret != false)
                _this.editor.close();
            return false;
        })
        .on('closed', function(event, data, action) {
            _this.state = 'closed';
            
            // opened event for special types
            if (_this.cfg.fields != null) {
                _this.cfg.fields.forEach(function(f){
                    if (f.type == 'color')
                        _fieldTypes.color.closed(_this.editor.conf[f.name]);
                });                
            }
            
            if (_this.cfg.cb != null && _this.cfg.cb.closed != null)
                setTimeout(function(){
                    _this.cfg.cb.closed();
                },100);
        })
        ;
    },
    buttons: function() {
        var data = [];
        var _this = this;
        if (this.cfg.ajax.create != undefined) {
            data.push({
                text: '新增', 
                className:'btn-primary', 
                action: function () { 
                    _this.editor.submit();
                }
            });
        }
        if (this.cfg.ajax.edit != undefined) {
            data.push({
                text: '套用', 
                className:'btn-primary', 
                action: function () { 
                    _this.editor.submit();
                }
            });
        }
        if (this.cfg.ajax.remove != undefined) {
            data.push({
                text: '刪除', 
                className:'btn-danger', 
                action: function () { 
                    _this.editor.submit();
                }
            });
        }
        return data;
    },
    fields: function() {
        var _this = this;
        var fields = [];
        if (this.cfg.fields == null)
            return fields;
        this.cfg.fields.forEach(function(f){
            f.getSelector = function() { return null; }
			f.getSelectorVal = function() { return null; }
			var name = f.name.replace(/\./g,'-');
            var item = null;
            if (f.name == null || f.type == null)
                return;
                
            if (f.type == 'checkbox') {
                item = {
                    label: (f.label != null) ? f.label : '',
                    name: f.name,
                    type: 'checkbox',
                    def: (f.defValue != null) ? f.defValue : false,
                    options:[{ 
                        label: f.label, 
                        value: 1,
                        attr: {'class':'editor-checkbox-label'} 
                    }],
                    separator: ' ',
        			unselectedValue: 0,
                    labelInfo: (f.labelInfo != null) ? f.labelInfo : '',
                    fieldInfo: (f.fieldInfo != null) ? f.fieldInfo : '',
                }; 
                
                f.getSelector = function() { return $('#DTE_Field_' + name + '_0');}
				f.getSelectorVal = function() { return $('#DTE_Field_' + name + '_0').prop('checked');}               
            }
            else if (f.type == 'input') {
                item = {
                    label: (f.label != null) ? f.label : '',
                    name: f.name,
                    def: (f.defValue != null) ? f.defValue : false,
                    attr: {
	                    placeholder: (f.placeholder != null) ? f.placeholder : '',
                    },
                    labelInfo: (f.labelInfo != null) ? f.labelInfo : '',
                    fieldInfo: (f.fieldInfo != null) ? f.fieldInfo : '',
                };
                
                f.getSelector = function() { return $('#DTE_Field_' + name);}
				f.getSelectorVal = function() { return $('#DTE_Field_' + name).val();}
            }
            else if (f.type == 'color') {
                item = {
                    type: 'color',
                    label: (f.label != null) ? f.label : '',
                    name: f.name,
                    def: (f.defValue != null) ? f.defValue : false,
                    change: function(name, color) {
                        if (_this.cfg.cb.change != null) {
                            _this.cfg.cb.change(name, color);
                        }
                    }
                };
            }
            else if (f.type == 'radioicon') {
                item = {
                    type: 'radioicon',
                    label: (f.label != null) ? f.label : '',
                    name: f.name,
                    def: (f.defValue != null) ? f.defValue : false,
                    options: _this.cfg.options[f.name],
                    change: function(name, value) {
                        if (_this.cfg.cb.change != null) {
                            _this.cfg.cb.change(name, value);
                        }
                    }
                };
            }
            else if (f.type == 'select') {
                item = {
                    type: 'select',
                    label: (f.label != null) ? f.label : '',
                    name: f.name,
                    def: (f.defValue != null) ? f.defValue : '',
                    options: _this.cfg.options[f.name],
                };
                f.getSelector = function() { return $('#DTE_Field_' + name);}
				f.getSelectorVal = function() { return $('#DTE_Field_' + name).val();}
            }
            else if (f.type == 'textarea') {
                item = {
                    type: 'textarea',
                    label: (f.label != null) ? f.label : '',
                    name: f.name,
                    def: (f.defValue != null) ? f.defValue : '',
                };
            }
            else if (f.type == 'fontType') {
                item = {
                    type: 'fontType',
                    label: (f.label != null) ? f.label : '',
                    name: f.name,
                    def: (f.defValue != null) ? f.defValue : '',
                    change: function(name, value) {
                        if (_this.cfg.cb.change != null) {
                            _this.cfg.cb.change(name, value);
                        }
                    }
                };
            }
            else if (f.type == 'fontAlign') {
                item = {
                    type: 'fontAlign',
                    label: (f.label != null) ? f.label : '',
                    name: f.name,
                    def: (f.defValue != null) ? f.defValue : '',
                    change: function(name, value) {
                        if (_this.cfg.cb.change != null) {
                            _this.cfg.cb.change(name, value);
                        }
                    }
                };
            }
            else if (f.type == 'filePick') {
                item = {
                    type: 'filePick',
                    label: (f.label != null) ? f.label : '',
                    name: f.name,
                    def: (f.defValue != null) ? f.defValue : '',
                    contentCb: function(data) {
                        if (_this.cfg.cb.content != null) {
                            _this.cfg.cb.content(data);
                        }
                    }
                };
            }
            else if (f.type == 'dynamicInput') {
                item = {
                    type: 'dynamicInput',
                    label: (f.label != null) ? f.label : '',
                    name: f.name,
                    def: (f.defValue != null) ? f.defValue : '',
                };
            }
            
            if (item != null)
                fields.push(item);
        });
        return fields;
    },
    _getCfgField: function(key) {
        if (this.cfg.fields == null)
            return null;
            
        for (var i=0 ; i<this.cfg.fields.length ; i++) {
            if (this.cfg.fields[i].name == key)
                return this.cfg.fields[i];
        }
        return null;
    }
}

//
// hack Editor
//
var Editor = $.fn.DataTable.Editor;
Editor.prototype._animate = function ( target, style, time, callback ) {
    target.css( style );

    if ( typeof time === 'function' ) {
        time.call( target );
    }
        else if ( callback ) {
        callback.call( target );
    } 
}
