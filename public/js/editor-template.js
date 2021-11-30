var Template = {
    editorStyle: function() {
        // for editor mode only
        var style = `
            <style class='editor-style'>
                #editor {margin-top:40px; border: 1px dashed black;}
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
                .editor-row {min-height: 80px;}
                .editor-row-add-hr {color: #000;opacity:0.8;position:relative;bottom:20px;}
                .editor-row-add {position:relative;top:15px;}
                .editor-row-add {cursor: pointer;}
                .editor-row-non-focus { position: relative; border: 1px solid black; }
                .editor-row-focus { position: relative; border: 2px solid blue; }
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
	colHtml: function(c, rowId){
        var html = `
			<div class="col-md-{1}">
				<div class="">
					hello
				</div>
			</div>
		`.format(c.id);
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
			<div class="editor-ui">
				<div class="container">
			    	<div class="row text-center">
			        	<div class="col-md-12">
			        		<h2><a onclick="gEditor._rowAdd({0})"><i class="bi-plus-circle fs-2x editor-row-add"></i></a></h2>
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
};
