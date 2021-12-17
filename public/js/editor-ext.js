var _fieldTypes = $.fn.DataTable.ext.editorFields;

_fieldTypes.color = {
    _addOptions: function ( conf, opts, append ) {
        var jqInput = conf._input;

        if ( ! append ) {
            jqInput.empty();
        }
        else {
            offset = $('input', jqInput).length;
        }

        var buttonStyle = `
            <style>
                .{0}-button {
                    background-color: transparent;
                    color: white;
                    border: none;
                    font-size: 26px;
                    padding: 0px;
                    margin: 0px;
                    line-height: 20px;
                }
            </style>
        `.format(conf.id);
        jqInput.append(buttonStyle);

        var html = `
            <span class='indicator {0}-colorPickSelector'> </span>
            <label>{1}</label
        `.format(conf.id, conf.label);
        jqInput.append(html);
    },
    create: function ( conf) {
        conf._input = $('<div />');
        _fieldTypes.color._addOptions( conf, conf.options || conf.ipOpts );
                
        if (this.conf == null) {
            this.conf = {};
        }
        this.conf[conf.name] = conf;
        return conf._input;
    },
    
    get: function ( conf ) {
        return $('.' + conf.id + '-colorPickSelector').css('color');
    },
    set: function ( conf, val ) {
    },
    enable: function ( conf ) {
        conf._enabled = true;
        $(conf._input).removeClass( 'disabled' );
    },
    disable: function ( conf ) {
        conf._enabled = false;
        $(conf._input).addClass( 'disabled' );
    },
    opened: function(conf) {
        $('.' + conf.id + '-colorPickSelector').colorPick({
            initialColor: conf.def,
            onChange: function(color) {
                if (conf.change != null) {
                    conf.change(conf.name, color);
                }
            }
        });  
    },
    closed: function(conf) {
        $('#colorPick').hide()
    }
};

_fieldTypes.radioicon = {
	_setFocus: function(conf, val) {
		$('.' + conf.id.replace(/\./g,'\\.')).each(function(){
			if (val == $(this).data('value')) {
				$(this).addClass('focus-button');
				$(this).removeClass('non-focus-button');
			}
			else {
				$(this).prop('checked', false);
				$(this).addClass('non-focus-button');
				$(this).removeClass('focus-button');
			}
		});
	},
	_addOptions: function ( conf, opts, append ) {
		var jqInput = conf._input;

		if ( ! append ) {
			jqInput.empty();
		}
		else {
			offset = $('input', jqInput).length;
		}

		var bgColor = 'white';
		var focusColor = 'black';
		var iconColor = '';
		if (conf.darkMode == true) {
			bgColor = 'transparent';
			iconColor = 'white-text';
			focusColor = 'white';
		}
		var buttonStyle = `
			<style>
			.focus-button {
			    min-width: 70px;
			    font-size: 14px;
                color: white;
			    border: 1px solid white; 
			    background-color: transparent; 
			}
			.non-focus-button { 
                min-width: 70px;
			    font-size: 14px;
                color: white;
			    border: none; 
			    background-color: transparent; 
			}
			.grid-radio-image { 
			    padding: 10px; 
			    width: auto;
			}
			</style>
		`.format(bgColor, focusColor);
		jqInput.append(buttonStyle);

		if ( opts ) {
			var html = '';
			html += '<div class="container">';
			html += '<div class="row">';
			opts.forEach(function(item){
				if (item.hidden == true)
					return;
				html += `
                    <div class="grid-radio-image">
						<button type="button" class="inputButton non-focus-button {0} {4}" data-value="{1}">
							{2}<br><h3><i class="far fa fa-2x {3} {4}"></i></h3>
						</button>
                    </div>
					`.format(conf.id, item.value, item.label, item.icon, iconColor);
			});
			html += '</div>';
			html += '</div>';
			jqInput.append(html);
		}
	},
    create: function ( conf) {
        conf._input = $('<div />');
		_fieldTypes.radioicon._addOptions( conf, conf.options || conf.ipOpts );

 		$('button.inputButton', conf._input).click( function () {
			_fieldTypes.radioicon._setFocus(conf, $(this).data('value'));
			if (conf.change != null) {
			    conf.change(conf.name, $(this).data('value'));
			}
            return false;
        } );
		
        return conf._input;
    },
    get: function ( conf ) {
		var val = ''; 
        $('.' + conf.id.replace(/\./g,'\\.')).each(function(){
			if ($(this).hasClass('focus-button')) {
				val = $(this).data('value');
			}
		});
		return val;
    },
    set: function ( conf, val ) {
		_fieldTypes.radioicon._setFocus(conf, val);
    },
    enable: function ( conf ) {
        conf._enabled = true;
        $(conf._input).removeClass( 'disabled' );
    },
    disable: function ( conf ) {
        conf._enabled = false;
        $(conf._input).addClass( 'disabled' );
    }
};

_fieldTypes.fontType = {
	_onUpdateType: function(conf, val) {
		if (conf.change != null)
			conf.change(conf.name, val);
	},
	_toggle: function(conf, val) {
		var types = _fieldTypes.fontType.get(conf).split(',');
		if (types.includes(val)) {
			$('.' + conf.id + '-' + val + '-btn').data('enable', false);
			$('.' + conf.id + '-' + val + '-btn').removeClass('btn-info');
		}
		else {
			$('.' + conf.id + '-' + val + '-btn').data('enable', true);
			$('.' + conf.id + '-' + val + '-btn').addClass('btn-info');
		}
	},
	_addOptions: function ( conf, opts, append ) {
		var jqInput = conf._input;

		if ( ! append ) {
			jqInput.empty();
		}
		else {
			offset = $('input', jqInput).length;
		}

		var html = `
			<div class="{0}-fontType">
				<button type="button" class="{0}-bold-btn" data-enabled=false>
					<i class="bi bi-type-bold"></i>
				</button>
				<button type="button" class="{0}-italic-btn" data-enabled=false>
					<i class="bi bi-type-italic"></i>
				</button>
				<button type="button" class="{0}-underline-btn" data-enabled=false>
					<i class="bi bi-type-underline"></i>
				</button>
	        </div>
		`.format(conf.id);
		jqInput.append(html);
	},
    create: function ( conf) {
        conf._input = $('<div />');
		_fieldTypes.fontType._addOptions( conf, conf.options || conf.ipOpts );
		
		$('button.' + conf.id + '-bold-btn', conf._input).click( function () {
			_fieldTypes.fontType._toggle(conf, 'bold');
			_fieldTypes.fontType._onUpdateType(conf, _fieldTypes.fontType.get(conf));
		});
		$('button.' + conf.id + '-italic-btn', conf._input).click( function () {
			_fieldTypes.fontType._toggle(conf, 'italic');
			_fieldTypes.fontType._onUpdateType(conf, _fieldTypes.fontType.get(conf));
		});
		$('button.' + conf.id + '-underline-btn', conf._input).click( function () {
			_fieldTypes.fontType._toggle(conf, 'underline');
			_fieldTypes.fontType._onUpdateType(conf, _fieldTypes.fontType.get(conf));
		});
		
		if (this.conf == null) {
            this.conf = {};
        }
		this.conf[conf.name] = conf;
        return conf._input;
    },
    get: function ( conf ) {
		var types = [];
		if ($('.' + conf.id + '-bold-btn').data('enable'))
			types.push('bold');
		if ($('.' + conf.id + '-italic-btn').data('enable'))
			types.push('italic');
		if ($('.' + conf.id + '-underline-btn').data('enable'))
			types.push('underline');
			return types.join();
    },
    set: function ( conf, val ) {
		var types = val.split(',');		
			
		$('.' + conf.id + '-bold-btn').data('enable', false);
		$('.' + conf.id + '-bold-btn').removeClass('btn-info');
		
		$('.' + conf.id + '-italic-btn').data('enable', false);
		$('.' + conf.id + '-italic-btn').removeClass('btn-info');
		
		$('.' + conf.id + '-underline-btn').data('enable', false);
		$('.' + conf.id + '-underline-btn').removeClass('btn-info');
		
		types.forEach(function(t){
			$('.' + conf.id + '-' + t + '-btn').data('enable', true);
			$('.' + conf.id + '-' + t + '-btn').addClass('btn-info');
		});
    },
    enable: function ( conf ) {
        conf._enabled = true;
        $(conf._input).removeClass( 'disabled' );
    },
    disable: function ( conf ) {
        conf._enabled = false;
        $(conf._input).addClass( 'disabled' );
    },
    opened: function(conf) {
        _fieldTypes.fontType.set(conf, conf.def);
    }
};

_fieldTypes.fontAlign = {
	_onUpdateType: function(conf, val) {
		if (conf.change != null)
			conf.change(conf.name, val);
	},
	_setFocus: function(conf, val) {
		$('.' + conf.id + '-align-left-btn').data('enable', false);
		$('.' + conf.id + '-align-left-btn').removeClass('btn-info');
		
		$('.' + conf.id + '-align-center-btn').data('enable', false);
		$('.' + conf.id + '-align-center-btn').removeClass('btn-info');
		
		$('.' + conf.id + '-align-right-btn').data('enable', false);
		$('.' + conf.id + '-align-right-btn').removeClass('btn-info');	
		
		$('.' + conf.id + '-align-' + val + '-btn').data('enable', true);
		$('.' + conf.id + '-align-' + val + '-btn').addClass('btn-info');	
	},
	_addOptions: function ( conf, opts, append ) {
		var jqInput = conf._input;

		if ( ! append ) {
			jqInput.empty();
		}
		else {
			offset = $('input', jqInput).length;
		}

		var html = `
			<div class="{0}-fontType">
				<button type="button" class="{0}-align-left-btn" data-enabled=false>
					<i class="bi bi-align-start"></i>
				</button>
				<button type="button" class="{0}-align-center-btn" data-enabled=false>
					<i class="bi bi-align-center"></i>
				</button>
				<button type="button" class="{0}-align-right-btn" data-enabled=false>
					<i class="bi bi-align-end"></i>
				</button>
	        </div>
		`.format(conf.id);
		jqInput.append(html);
	},
    create: function ( conf) {
        conf._input = $('<div />');
		_fieldTypes.fontAlign._addOptions( conf, conf.options || conf.ipOpts );
		
		$('button.' + conf.id + '-align-left-btn', conf._input).click( function () {
			_fieldTypes.fontAlign._setFocus(conf, 'left');
			_fieldTypes.fontAlign._onUpdateType(conf, 'left');
		});
		$('button.' + conf.id + '-align-center-btn', conf._input).click( function () {
			_fieldTypes.fontAlign._setFocus(conf, 'center');
			_fieldTypes.fontAlign._onUpdateType(conf, 'center');
		});
		$('button.' + conf.id + '-align-right-btn', conf._input).click( function () {
			_fieldTypes.fontAlign._setFocus(conf, 'right');
			_fieldTypes.fontAlign._onUpdateType(conf, 'right');
		});
		
		if (this.conf == null) {
            this.conf = {};
        }
		this.conf[conf.name] = conf;
        return conf._input;
    },
    get: function ( conf ) {
		if ($('.' + conf.id + '-align-left-btn').data('enable'))
			return 'left';
		if ($('.' + conf.id + '-align-center-btn').data('enable'))
			return 'center';
		if ($('.' + conf.id + '-align-right-btn').data('enable'))
			return 'right';
		return '';
			
    },
    set: function ( conf, val ) {
		_fieldTypes.fontAlign._setFocus(conf, val);
    },
    enable: function ( conf ) {
        conf._enabled = true;
        $(conf._input).removeClass( 'disabled' );
    },
    disable: function ( conf ) {
        conf._enabled = false;
        $(conf._input).addClass( 'disabled' );
    },
    opened: function(conf) {
        _fieldTypes.fontAlign.set(conf, conf.def);
    }
};

_fieldTypes.filePick = {
	_addOptions: function ( conf, opts, append ) {
		var jqInput = conf._input;

		if ( ! append ) {
			jqInput.empty();
		}
		else {
			offset = $('input', jqInput).length;
		}

		var html = `
			<div class='filePick-field-{0}'>
                <input type='file' style='width:80px;'
                       onchange='_fieldTypes.filePick._onChooseFile(event, _fieldTypes.filePick._onFileLoad.bind(this, "{1}"), "filePick-label-{0}")'/>
                <label id='filePick-label-{0}'></label>
            </div>
		`.format(conf.id, conf.name);
		jqInput.append(html);
	},
    create: function ( conf) {
        conf._input = $('<div />');
		_fieldTypes.filePick._addOptions( conf, conf.options || conf.ipOpts );
		if (this.conf == null) {
            this.conf = {};
        }
		this.conf[conf.name] = conf;
        return conf._input;
    },
    get: function ( conf ) {
		return '';
			
    },
    set: function ( conf, val ) {
		
    },
    enable: function ( conf ) {
        conf._enabled = true;
        $(conf._input).removeClass( 'disabled' );
    },
    disable: function ( conf ) {
        conf._enabled = false;
        $(conf._input).addClass( 'disabled' );
    },
    opened: function(conf) {
        document.getElementById('input-file-' + conf.id).addEventListener("change", function(event) {
            console.log(event.target.files);
        }, false);
    },
    _onChooseFile: function(event, onLoadFileHandler, filePickId) {
        if (typeof window.FileReader !== 'function')
            throw ("The file API isn't supported on this browser.");
        let input = event.target;
        if (!input)
            throw ("The browser does not properly implement the event object");
        if (!input.files)
            throw ("This browser does not support the `files` property of the file input.");
        if (!input.files[0])
            return undefined;
        let file = input.files[0];
        $('#' + filePickId).text(file.name);
        
        let fr = new FileReader();
        fr.onload = onLoadFileHandler;
        fr.readAsText(file);
    },
    _onFileLoad: function(name, event) {
        for (const [key, value] of Object.entries(gEditor.editorController.editor.conf)) {
            if (value['name'] != name)
                continue;
            value.contentCb(event.target.result);
        }
    }
};

_fieldTypes.dynamicInput = {
	_addOptions: function ( conf, opts, append ) {
		var jqInput = conf._input;

		if ( ! append ) {
			jqInput.empty();
		}
		else {
			offset = $('input', jqInput).length;
		}
		
		var selectOpts = '';
		for (var i=0 ; i<20 ; i++) {
		    selectOpts += `<option value={0}>{0}</option>`.format(i + 1);
		}
		
		var styles = `
		    <style>
		        .DTE_Field_dynamicInput {
		            width: 60px;
		        }
		    </style>
		`.format(conf.id);
		jqInput.append(styles);

        var html = `
			<div class='dynamicInput-{0}'>
			    <div class='DTE_Field_Input'>
			    <div class='DTE_Field_InputControl'>
                <select id='DTE_Field_{0}_select'>
                    {1}
                </select>
                </div>
                </div>
                <div id='DTE_Field_{0}_inputs'>                    
                </div>
	        </div>
		`.format(conf.id, selectOpts);
		jqInput.append(html);
	},
    create: function ( conf) {
        conf._input = $('<div />');
		_fieldTypes.dynamicInput._addOptions( conf, conf.options || conf.ipOpts );
		if (this.conf == null) {
            this.conf = {};
        }
		this.conf[conf.name] = conf;
        return conf._input;
    },
    get: function ( conf ) {
        var data = {};
        data.num = parseInt($('#DTE_Field_' + conf.id + '_select').val());
        data.inputs = [];
        for (var i=1 ; i<=data.num ; i++) {
            data.inputs.push({
                label: $('#DTE_Field_' + conf.id + '_input_' + i + '_label').val(),
                name: $('#DTE_Field_' + conf.id + '_input_' + i + '_name').val(),
            });
        }

		return data;
			
    },
    set: function ( conf, val ) {
		
    },
    enable: function ( conf ) {
        conf._enabled = true;
        $(conf._input).removeClass( 'disabled' );
    },
    disable: function ( conf ) {
        conf._enabled = false;
        $(conf._input).addClass( 'disabled' );
    },
    opened: function(conf) {
        $('#DTE_Field_' + conf.id + '_select').on('change', function(){
            $('#DTE_Field_' + conf.id + '_inputs').empty();
            
            var html = '';
            for (var i=1 ; i<= $(this).val() ; i++) {
                var label = '';
                var name = '';
                if (conf.def.inputs != null && conf.def.inputs[i-1] != null) {
                    label = conf.def.inputs[i-1].label;
                    name = conf.def.inputs[i-1].name;
                }
                html += `
                    <div class='form-inline'>
                    <label>[{1}] 標題:</label>
                    <input id='DTE_Field_{0}_input_{1}_label' class='DTE_Field_dynamicInput' value='{2}'></input>
                    <label>名稱:</label>
                    <input id='DTE_Field_{0}_input_{1}_name'  class='DTE_Field_dynamicInput' value='{3}'></input>
                    </div>
                `.format(conf.id, i, label, name);
            }    
            
            $('#DTE_Field_' + conf.id + '_inputs').append(html);
        });
        
        if (conf.def.num != null) {
            $('#DTE_Field_' + conf.id + '_select').val(conf.def.num);
        }
        $('#DTE_Field_' + conf.id + '_select').trigger('change');
    }
};
