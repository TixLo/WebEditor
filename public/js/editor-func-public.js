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

var editorExport = function() {
    var switchEditMode = false;
    if (this.cfg.preview == false) {
        this.cfg.preview = true;
        this._draw();
        switchEditMode = true;
    }
    
    // 1. remove unnecessary styles
    $('.editor-style').remove();
    $('.editor-col-style').remove();
    this.cfg.rows.forEach(function(r){
        if (this.cfg.cols[r.id] == null)
            return;
            
        for (var i=0; i<this.cfg.cols[r.id].length ; i++) {
            var cate = this.cfg.cols[r.id][i].category;
            if (Category[cate].export != null) {
                Category[cate].export(this.cfg.cols[r.id][i]);
            }
        }
    });
    
    // 2. get html
    var html = this.editor.html();
    
    // 3. redraw
    this.cfg.preview = true;
    this._draw();
    
    // 4. append necessary html
    var head = `
        <head>
            <title>WebEditor Generate</title>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js" integrity="sha384-QJHtvGhmr9XOIpI6YVutG+2QOK9T+ZnN4kzFN1RtK3zEFEIsxhlmWl5/YESvpZ13" crossorigin="anonymous"></script>
            <script src='https://cdn.jsdelivr.net/npm/chart.js@2.8.0/dist/Chart.min.js'></script>
            <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@0.7.0"></script>            
            <script type="text/javascript" src="https://cdn.datatables.net/v/dt/jqc-1.12.4/dt-1.11.0/b-2.0.0/sl-1.3.3/datatables.min.js"></script>

            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous"></link>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css"></link>
            <link href="https://cdn.jsdelivr.net/npm/chart.js@2.8.0/dist/Chart.min.css" rel="stylesheet"></link>
            <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/dt/jqc-1.12.4/dt-1.11.0/b-2.0.0/sl-1.3.3/datatables.min.css"></link>
        </head>
    `;
    html = head + '<body>' + html + '</body>';
    
    // 5. formatted html code
    html = formatHTML(html);
    
    // 6. copy HTML code
    copyToClipboard(html);
    
    if (switchEditMode) {
        this.cfg.preview = false;
        this._draw();
    }
    
    // 7. show copied alert
    $('#alert-msg').text('已經將 HTML 原始碼複製到剪貼簿中');
    $("#success-alert").fadeTo(1000, 200).slideUp(200, function(){
        $("#success-alert").slideUp(200);        
    });
    return html;
}

function copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

function formatHTML(html) {
    var formattedHtml = '';
    var lines = [];
    html.split('\n').forEach(function(line){
        line = line.trim();
        line = line.replace(/   /g, '');
        line = line.replace(/\"/g, '\'');
        if (line.length == 0)
            return;
        
        var tags = line.split('><');
        if (tags.length > 1) {
            for (var i=0 ; i<tags.length ; i++) {
                if (i == 0)
                    lines.push(tags[i] + '>');
                else if (i == tags.length - 1)
                    lines.push('<' + tags[i]);
                else
                    lines.push('<' + tags[i] + '>');
            }    
        }
        else {
            lines.push(line);
        }
    });
    
    var indent = -1;
    var textarea = false;
    lines.forEach(function(line){
        var lastCh = line[line.length - 1];
        if (line.indexOf('<') == 0 && line.indexOf('</') != 0) {
            indent += 1;
        }
        else if (lastCh  == '}') {
            indent -= 1;
        }
        
        var spaces = '';
        for (var i=0 ; i<indent ; i++) {
            spaces = '  ' + spaces;
        }
        
        if (textarea == true) {
            formattedHtml += line + '\n';
        }
        else {
            formattedHtml += spaces + line + '\n';
        }
        
        if (line.indexOf('<textarea') >= 0) {
            textarea = true;
        }
        
        if (line.indexOf('</') >= 0) {
            indent -= 1;
            textarea = false;
        }
        else if (lastCh == '{') {     
            indent += 1;
        }
    });
    
    return formattedHtml;
}

var editorExportCfg = function() {
    gEditor.cfg.magic = 'WebEditor';
    copyToClipboard(JSON.stringify(gEditor.cfg));
    
    $('#alert-msg').text('已經將網頁設定檔複製到剪貼簿中');
    $("#success-alert").fadeTo(1000, 200).slideUp(200, function(){
        $("#success-alert").slideUp(200);        
    });
}

var _editorLoad = function(cfg) {
    function jsonEscape(str)  {
        return str.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
    }
    function jsonRecoverEscape(str)  {
        return str.replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\t/g, "\t");
    }
    var loadedCfg = JSON.parse(jsonEscape(cfg));
    if (loadedCfg.magic == null || loadedCfg.magic != 'WebEditor') {
        alert('不合法的設定檔');
        return;
    }
    gEditor.cfg = loadedCfg;
    
    if (gEditor.cfg.cols != null) {
        for (const [rowId, cols] of Object.entries(gEditor.cfg.cols)) {
            for (var i=0 ; i<cols.length ; i++) {
                if (cols[i].category == 'textarea') {
                    cols[i].text = jsonRecoverEscape(cols[i].text);
                }
                else if (cols[i].category == 'code') {
                    cols[i].html = jsonRecoverEscape(cols[i].html);
                }
            }
        }    
    }
    
    gEditor._draw();
}

var editorLoadSample = function() {
    var sampleCfg = `{"preview":false,"rows":[{"hidden":false,"fluid":false,"bgColor":"rgba(0, 0, 0, 0)","fontColor":"rgb(0, 0, 0)","seq":1,"id":1639531044847}],"cols":{"1639531044847":[{"id":1639531051899,"seq":1,"category":"label","hidden":false,"col":12,"text":"asdfasfdasf","fontColor":"rgb(0, 0, 0)","type":"","align":"left","size":"26"}]},"magic":"WebEditor"}`;
    _editorLoad(sampleCfg);
}
   
var editorImportCfg = function() {
    var _data = null;
    var config = gEditor._prepareCfg('開啟設定檔', 'edit');
    
    config.fields = [];
    config.fields.push({
        type: 'filePick',
        label: '選擇檔案',
        name: 'content',
        defValue: ''
    });

    config.cb = {
        submit: function(action, data) {
            if (_data != null) {
                _editorLoad(_data);
            }
        },
        content: function(data) {
            _data = data;
        }
    };
    gEditor.editorController.open(config);
}