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
            <label>{1}</label>
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
