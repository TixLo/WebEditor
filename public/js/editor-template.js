var Template = {
    editorStyle: function() {
        // for editor mode only
        var style = `
            <style class='editor-style'>
                #editor {border: 1px dashed black;}
                .editor-clipboard-btn {position: fixed;top: 55px;left: 50%;}
            </style>
        `;
        //        @media (min-width: 768px) {}
        //        @media (min-width: 1200px) {.container-fluid{max-width: 960px !important;}}
        //        @media (min-width: 1400px) {.container-fluid{max-width: 1200px !important;}}
        return style;
    },
    editorRowStyle: function() {
        // for editor mode only
        var style = `
            <style class='editor-row-style'>
                .editor-row {}
                .editor-row-add-hr {color: #000;opacity:0.8;position:relative;bottom:20px;}
                .editor-row-add {position:relative;top:12px;cursor: pointer;color: #000;}
                .editor-row-non-focus { position: relative; border: 1px solid black;min-height: 80px; }
                .editor-row-focus { position: relative; border: 2px solid blue;min-height: 80px; }
                .editor-row-btn {}
                .editor-row-btn-edit{position:absolute; top:0px;left:-32px;width:26px; z-index: 1040;border: 1px solid black !important; padding: 0px;}
                .editor-row-btn-del{position:absolute; top:28px;left:-32px;width:26px; z-index: 1040;border: 1px solid black !important; padding: 0px;}
                .editor-row-btn-eye{position:absolute; top:56px;left:-32px;width:26px; z-index: 1040;border: 1px solid black !important; padding: 0px;background-color: transparent !important;border: none !important;cursor:default!important;}
                .editor-row-btn-up{position:absolute; top:-28px;left:-32px;width:26px; z-index: 1040;border: 1px solid black !important; padding: 0px;}
                .editor-row-btn-down{position:absolute; top:84px;left:-32px;width:26px; z-index: 1040;border: 1px solid black !important; padding: 0px;}
                .editor-row-btn-eye-color{color: #DB0000 !important;}
            </style>
        `;
        return style;
    },
    editorColStyle: function() {
        // for editor mode only
        var style = `
            <style class='editor-col-style'>
                .editor-col {position: relative;}
                .editor-col-add {position:relative;top:12px;cursor: pointer;color: #000;}
                .editor-col-non-focus {border: 1px dashed black;min-height: 60px;}
                .editor-col-focus {border: 2px solid black;min-height: 60px;}
                .editor-col-btn {}
                .editor-col-btn-edit{position:absolute; top:-30px;left:0px;width:26px; z-index: 1040;border: 1px solid black !important; padding: 0px;}
                .editor-col-btn-del{position:absolute; top:-30px;left:30px;width:26px; z-index: 1040;border: 1px solid black !important; padding: 0px;}
                .editor-col-btn-eye{position:absolute; top:0px;left:0px;width:26px; z-index: 1040;border: 1px solid black !important; padding: 0px;background-color: transparent !important;border: none !important;cursor:default!important;}
                .editor-col-btn-eye-color{color: #DB0000 !important;}
                .editor-col-btn-up{position:absolute; top:-30px;left:60px;width:26px; z-index: 1040;border: 1px solid black !important; padding: 0px;}
                .editor-col-btn-down{position:absolute; top:-30px;left:90px;width:26px; z-index: 1040;border: 1px solid black !important; padding: 0px;}
                
            </style>
        `;
        return style;
    },
    settingPanelHtml: function() {
		var html = `
            <div id="setting-panel" class="editor-ui">
	            <div class="containerx smooth-scroll" style="position:relative">
	                <a class="btn btn-primary editor-setting-btn">設定 <i class="bi bi-gear"></i></a>
	            </div>
    	    </div>
        `;
		return html;
	},
	copyToClipboardButton: function() {
		var html = `
            <div id='clipboard-button' class='editor-ui'>
	            <div>
	                <a class='btn btn-primary editor-clipboard-btn'
	                   onclick='gEditor.export()'
	                >複製HTML原始碼<i class='bi bi-clipboard'></i></a>
	            </div>
    	    </div>
        `;
		return html;
	},
	colStyle: function(c, rowId){
        var style = `
			<style class="col-style-{0}">
				{1}
			</style>
		`.format(c.id, Category[c.category].style(c));
		return style;
	},
	colHtml: function(c, rowId){
	    var dataAttrs = '';
	    var colClass = '';
	    var eyeHtml = '';
        if (!gEditor.cfg.preview) {
            dataAttrs = `
                data-col-id={0}
                data-col-hidden={1}
                data-col-fluid={2}
                data-col-seq={3}
                data-row-id={4}
            `.format(c.id, c.hidden, c.fluid, c.seq, rowId);
            
            colClass += 'editor-col ';
            colClass += 'editor-col-non-focus ';
            
            if (c.hidden) {
               eyeHtml = `
                    <button type="button" 
                        class="editor-col-btn-edit-{0} btn btn-sm btn-primary editor-row-btn editor-col-btn-eye"
                        ><i class="bi bi-eye-slash editor-col-btn-eye-color"></i>
                    </button>
                `.format(c.id);
            }
        }
        
        var html = `
			<div class="col-md-{1} {3}" {4}>
				{2}
				{5}
			</div>
		`.format(c.id, c.col, Category[c.category].html(c), 
		        colClass, dataAttrs, eyeHtml);
		return html;
	},
	colButtonHtml: function(rowId, c, isTop, isButtom) {
        var topBtnHtml = '';
        if (!isTop) {
           topBtnHtml = `
                <button type="button" 
                    class="editor-col-btn-edit-{1} btn btn-sm btn-info editor-col-btn editor-col-btn-up"
                    onclick="gEditor._colMoveUp({0},{1})" href="javascript:void(0);"><i class="bi bi-arrow-up-square"></i>
                </button>
            `.format(rowId, c.id);
        }
        var buttomBtnHtml = '';
        if (!isButtom) {
           buttomBtnHtml = `
                <button type="button" 
                    class="editor-col-btn-edit-{1} btn btn-sm btn-info editor-col-btn editor-col-btn-down"
                    onclick="gEditor._colMoveDown({0},{1})" href="javascript:void(0);"><i class="bi bi-arrow-down-square"></i>
                </button>
            `.format(rowId, c.id);
        }
	    var html = `
	        <div class="editor-ui editor-ui-col">
                <button type="button" 
                    class="editor-col-btn-edit-{1} btn btn-sm btn-primary editor-col-btn editor-col-btn-edit"
                    onclick="gEditor._colEdit({0},{1})" href="javascript:void(0);"><i class="bi bi-pencil-square"></i>
                </button>
                <button type="button" 
                    class="editor-col-btn-edit-{1} btn btn-sm btn-primary editor-col-btn editor-col-btn-del"
                    onclick="gEditor._colDel({0},{1})" href="javascript:void(0);"><i class="bi bi-trash"></i>
                </button>
                {2} {3}
            </div>
	    `.format(rowId, c.id, topBtnHtml, buttomBtnHtml);
	    return html;
	},
	rowHtml: function(r, colsHtml) {
        if (colsHtml == null)
            colsHtml = '';

		var container = '';
		if (!r.fluid) {
			container = 'container';
		}
		else {
			container = 'container-fluid';
		}
		
        var dataAttrs = '';
        var rowClass = '';
        if (!gEditor.cfg.preview) {
            dataAttrs = `
                data-row-id={0}
                data-row-hidden={1}
                data-row-fluid={2}
                data-row-seq={3}
            `.format(r.id, r.hidden, r.fluid, r.seq);
            
            rowClass += 'editor-row ';
            rowClass += 'editor-row-non-focus ';
        }
        
        var rowStyles = '';
        if (r.bgColor != null) {
            rowStyles += 'background-color: ' + r.bgColor + ';';
        }
        if (r.fontColor != null) {
            rowStyles += 'color: ' + r.fontColor + ';';
        }
 
        var html = `
            <row {1}>
                <div class='{2} {3}' style='{4}'>
                    <div class='row' style='min-height: 5px;'>
                        {0}
                    </div>
                </div>
            </row>
        `.format(colsHtml, dataAttrs, container, rowClass, rowStyles);
        return html;
    },
	rowEmptyHtml: function(seq) {
		var html = `
			<div class="editor-ui ">
				<div class="container">
			    	<div class="row text-center">
			        	<div class="col-md-12">
			        		<h4><a onclick="gEditor._rowAdd({0})"><i class="bi-plus-circle editor-row-add"></i></a><h4>
			        		<hr class='editor-row-add-hr'>
						</div>	    		            
			        </div>
			    </div>
			</div>
		`.format(seq);
		return html;
	},
	rowButtonHtml: function(r, isTop, isButtom) {
        var eyeHtml = '';
        if (r.hidden) {
           eyeHtml = `
                <button type="button" 
                    class="editor-row-btn-edit-{0} btn btn-sm btn-primary editor-row-btn editor-row-btn-eye"
                    ><i class="bi bi-eye-slash editor-row-btn-eye-color"></i>
                </button>
            `.format(r.id);
        }
        var topBtnHtml = '';
        if (!isTop) {
           topBtnHtml = `
                <button type="button" 
                    class="editor-row-btn-edit-{0} btn btn-sm btn-info editor-row-btn editor-row-btn-up"
                    onclick="gEditor._rowMoveUp({0})"><i class="bi bi-arrow-up-square"></i>
                </button>
            `.format(r.id);
        }
        var buttomBtnHtml = '';
        if (!isButtom) {
           buttomBtnHtml = `
                <button type="button" 
                    class="editor-row-btn-edit-{0} btn btn-sm btn-info editor-row-btn editor-row-btn-down"
                    onclick="gEditor._rowMoveDown({0})"><i class="bi bi-arrow-down-square"></i>
                </button>
            `.format(r.id);
        }
	    var html = `
            <div class="editor-ui">
                <button type="button" 
                    class="editor-row-btn-edit-{0} btn btn-sm btn-primary editor-row-btn editor-row-btn-edit"
                    onclick="gEditor._rowEdit({0})"><i class="bi bi-pencil-square"></i>
                </button>
                <button type="button" 
                    class="editor-row-btn-edit-{0} btn btn-sm btn-primary editor-row-btn editor-row-btn-del"
                    onclick="gEditor._rowDel({0})"><i class="bi bi-trash"></i>
                </button>
                {1} {2} {3}
            </div>
	    `.format(r.id, eyeHtml, topBtnHtml, buttomBtnHtml);
	    return html;
	},
    colEmptyHtml: function(seq, rowId) {
		var html = `
            <div class="editor-ui col-md-12 text-center">
			    <h4><a onclick="gEditor._colAdd({0}, {1})"><i class="bi-plus-square editor-col-add"></i></a><h4>
			    <hr class='editor-row-add-hr'>
            </div>
		`.format(seq, rowId);
		return html;
	},
};
