//
// common
//
var _hex2rgb = function(hex, opacity) {
    var h = hex.replace('#', '');
    h = h.match(new RegExp('(.{' + h.length / 3 + '})', 'g'));

    for (var i = 0; i < h.length; i++)
        h[i] = parseInt(h[i].length == 1 ? h[i] + h[i] : h[i], 16);

    if (typeof opacity != 'undefined') h.push(opacity);

    return 'rgba(' + h.join(',') + ')';
}

var _rgb2rgba = function(rgb, opacity) {
    if (rgb.indexOf('#') >= 0) {
        return _hex2rgb(rgb, opacity);
    }
    
    var rgba = rgb.replace('rgb(', 'rgba(');
    rgba = rgba.substring(0, rgba.length - 1) + ',' + opacity + ')';
    return rgba;
}

var _fontSizeOpts = function(){
    var data = [];
    data.push({label: '特小', value: '14'});
    data.push({label: '小', value: '20'});
    data.push({label: '中', value: '26'});
    data.push({label: '大', value: '32'});
    data.push({label: '特大', value: '38'});
    return data;
};
            
var Category = {
    //
    // common
    //
    getCategories: function() {
        return [
            { "label": "空欄位", "value": "empty", "icon": "bi-square"},
            { "label": "文字", "value": "label", "icon": "bi-fonts"},
            { "label": "輸入框", "value": "input", "icon": "bi-input-cursor-text"},
            { "label": "分隔線", "value": "hrline", "icon": "bi-dash-lg"},
            { "label": "按鈕", "value": "button", "icon": "bi-stop-btn"},
            { "label": "文字區塊", "value": "textarea", "icon": "bi-card-text"},
            { "label": "程式碼", "value": "code", "icon": "bi-code-slash"},
            { "label": "折線圖", "value": "lineChart", "icon": "bi-graph-up"},
            { "label": "長條圖", "value": "barChart", "icon": "bi-bar-chart-line"},
            { "label": "圓餅圖", "value": "pieChart", "icon": "bi-pie-chart"},
            { "label": "表格", "value": "table", "icon": "bi-table"},
        ];
    },
    getCategoryDesc: function(cate) {
        var categories = Category.getCategories();
        for (var i=0 ; i<categories.length ; i++) {
            if (cate == categories[i].value)
                return categories[i].label;
        }
        return '';
    },
    //
    // categories
    //
    empty: {
        default: {  
        },
        html: function(c){
            var html = `
            `.format();
            return html;
        },
        js: function(c) {
            return null;
        },
        initJs: function(c) {
            return null;
        },
        style: function(c) {
            var style = `
            `.format();
            return style;
        },
        fields: function(c, fields) {
            return fields;
        },
        options: function(c, opts) {
            return opts;
        },
        validate: function(c) {
            return null;
        }
    },
    label: {
        default: {
            fontColor: '#000',
            text: '',
            type: '',
            align: 'left',
            size: '26',
        },
        html: function(c){
            var uStart = '';
            var uEnd = '';
            if (c.type != null) {
                var types = c.type.split(',');
                uStart = (types.includes('underline')) ? '<u>' : '';
                uEnd = (types.includes('underline')) ? '</u>' : '';
            }
            
            var html = `
                <label class='label-{0}'>{2} {1} {3} <label>
            `.format(c.id, c.text, uStart, uEnd);
            return html;
        },
        js: function(c) {
            return null;
        },
        initJs: function(c) {
            return null;
        },
        style: function(c) {
            var bold = '';
            var italic = '';
            if (c.type != null) {
                var types = c.type.split(',');
                bold = (types.includes('bold'))? 'font-weight: bold;' : '' ;
                italic = (types.includes('italic'))? 'font-style: italic;' : '' ;
            }
            
            var style = `
                .label-{0} {
                    width: 100%;
                    color: {1};
                    {2} {3}
                    text-align: {4};
                    font-size: {5}px;
                }
            `.format(c.id, c.fontColor, bold, italic, 
                    (c.align != undefined) ? c.align : Category.label.default.align,
                    (c.size != undefined) ? c.size : Category.label.default.size
                );
            return style;
        },
        fields: function(c, fields) {
            fields.push({
                type: 'input',
                label: '文字顏色',
                name: 'text',
                defValue: (c.text != undefined) ? c.text : Category.label.default.text
            });
            fields.push({
                type: 'color',
                label: '文字顏色',
                name: 'fontColor',
                defValue: (c.fontColor != undefined) ? c.fontColor : Category.label.default.fontColor
            });
            fields.push({
                type: 'fontType',
                label: '文字樣式',
                name: 'type',
                defValue: (c.type != undefined) ? c.type : Category.label.default.type
            });
            fields.push({
                type: 'fontAlign',
                label: '文字對齊',
                name: 'align',
                defValue: (c.align != undefined) ? c.align : Category.label.default.align
            });
            fields.push({
                type: 'select',
                label: '文字大小',
                name: 'size',
                defValue: (c.size != undefined) ? c.size : Category.label.default.size
            });
            return fields;
        },
        options: function(c, opts) {
            opts.size = _fontSizeOpts();
            return opts;
        },
        validate: function(c) {
            return null;
        }
    },
    code: {
        default: {
            html: ''
        },
        html: function(c){
            var html = `
                <div class=''>
                    {0}
                </div>
            `.format((c.html != undefined) ? c.html : Category.code.default.html);
            return html;
        },
        js: function(c) {
            return null;
        },
        initJs: function(c) {
            return null;
        },
        style: function(c) {
            var style = `
                .text {}
            `.format();
            return style;
        },
        fields: function(c, fields) {
            fields.push({
                type: 'textarea',
                label: 'HTML程式碼',
                name: 'html',
                defValue: (c.html != undefined) ? c.html : Category.code.default.html
            });
            return fields;
        },
        options: function(c, opts) {
            return opts;
        },
        validate: function(c) {
            return null;
        }
    },
    input: {
        default: {
            label: '',
            fontColor: '#000',
            size: '26',
            align: 'center',
            name: '',
        },
        html: function(c){
            var html = `
                <div class='input-field-{0}'>
                    <label class='input-label-{0}' for='input-{0}'>{1}</label>
                    <input type='text' class='input-{0}' name='input-{0}' id='input-{2}'>
                </div>
            `.format(c.id,
                (c.label != undefined) ? c.label : Category.input.default.label,
                (c.name != undefined) ? c.name : Category.input.default.name,
                );
            return html;
        },
        js: function(c) {
            return null;
        },
        initJs: function(c) {
            return null;
        },
        style: function(c) {
            var style = `
                .input-field-{0} {
                    width: auto;
                    text-align: {3};
                    display: block;
                    vertical-align: middle;
                    left: 0px;
                }
                .input-label-{0} {
                    color: {1};
                    font-size: {2}px;
                }
                .input-{0} {
                }
            `.format(c.id, c.fontColor,
                    (c.size != undefined) ? c.size : Category.input.default.size,
                    (c.align != undefined) ? c.align : Category.input.default.align
                );
            return style;
        },
        fields: function(c, fields) {
            fields.push({
                type: 'input',
                label: '名稱',
                name: 'name',
                fieldInfo: '用於 javascript 控制使用',
                defValue: (c.name != undefined) ? c.name : Category.input.default.name
            });
            fields.push({
                type: 'input',
                label: '標籤',
                name: 'label',
                defValue: (c.label != undefined) ? c.label : Category.input.default.label
            });
            fields.push({
                type: 'color',
                label: '文字顏色',
                name: 'fontColor',
                defValue: (c.fontColor != undefined) ? c.fontColor : Category.input.default.fontColor
            });
            fields.push({
                type: 'select',
                label: '文字大小',
                name: 'size',
                defValue: (c.size != undefined) ? c.size : Category.input.default.size
            });
            fields.push({
                type: 'fontAlign',
                label: '對齊',
                name: 'align',
                defValue: (c.align != undefined) ? c.align : Category.input.default.align
            });
            return fields;
        },
        options: function(c, opts) {
            opts.size = _fontSizeOpts();
            return opts;
        },
        validate: function(c) {
            if (c.name == null || c.name.length == 0)
                return '名稱欄位不能為空';
            return null;
        }
    },
    hrline: {
        default: {
            color: '#000000'
        },
        html: function(c){
            var html = `
                <hr class='hrline-{0}'>
            `.format(c.id);
            return html;
        },
        js: function(c) {
            return null;
        },
        initJs: function(c) {
            return null;
        },
        style: function(c) {
            var style = `
                .hrline-{0} {
                    color: {1};
                    opacity: 1;
                }
            `.format(c.id, c.color);
            return style;
        },
        fields: function(c, fields) {
            fields.push({
                type: 'color',
                label: '顏色',
                name: 'color',
                defValue: (c.color!= undefined) ? c.color: Category.hrline.default.color
            });
            return fields;
        },
        options: function(c, opts) {
            return opts;
        },
        validate: function(c) {
            return null;
        }
    },
    button: {
        default: {
            bgColor: '#FFFFFF',
            fontColor: '#000000',
            align: 'center',
            text: '',
            name: '',
        },
        html: function(c){
            var html = `
                <div class='button-field-{0}'>
                    <button type='button' class='button-{0}'>{1}</button>
                </div>
            `.format(c.id, c.text);
            return html;
        },
        js: function(c) {
            var html = `
                $('.button-{0}').on('click', function(){
                    
                }
                );
            `.format(c.id);
            return html;
        },
        initJs: function(c) {
            return null;
        },
        style: function(c) {
            var style = `
                .button-field-{0} {
                    width: auto;
                    text-align: {3};
                    display: block;
                    vertical-align: middle;
                    left: 0px;
                }
                .button-{0} {
                    border-radius: 6px;
                    color: {1};
                    background-color: {2};
                    font-size: {4}px;
                }
            `.format(c.id, c.fontColor, c.bgColor, c.align, c.size);
            return style;
        },
        fields: function(c, fields) {
            fields.push({
                type: 'input',
                label: '名稱',
                name: 'name',
                fieldInfo: '用於 javascript 控制使用',
                defValue: (c.name != undefined) ? c.name : Category.button.default.name
            });
            fields.push({
                type: 'input',
                label: '按鈕文字',
                name: 'text',
                fieldInfo: '顯示於按鈕上的文字',
                defValue: (c.text != undefined) ? c.text : Category.button.default.text
            });
            fields.push({
                type: 'color',
                label: '背景顏色',
                name: 'bgColor',
                defValue: (c.bgColor!= undefined) ? c.bgColor: Category.button.default.bgColor
            });
            fields.push({
                type: 'color',
                label: '文字顏色',
                name: 'fontColor',
                defValue: (c.fontColor!= undefined) ? c.fontColor: Category.button.default.fontColor
            });
            fields.push({
                type: 'select',
                label: '文字大小',
                name: 'size',
                defValue: (c.size != undefined) ? c.size : Category.button.default.size
            });
            fields.push({
                type: 'fontAlign',
                label: '對齊',
                name: 'align',
                defValue: (c.align != undefined) ? c.align : Category.button.default.align
            });
            return fields;
        },
        options: function(c, opts) {
            opts.size = _fontSizeOpts();
            return opts;
        },
        validate: function(c) {
            if (c.name == null || c.name.length == 0)
                return '名稱欄位不能為空';
            if (c.text == null || c.text.length == 0)
                return '按鈕文字欄位不能為空';
            return null;
        }
    },
    textarea: {
        default: {  
            bgColor: '#FFFFFF',
            fontColor: '#000000',
            size: '26',
            align: 'center',
            textAlign: 'left',
            areaRow: '3',
            areaCol: '10',
            text: '',
        },
        html: function(c){
            var html = `
                <div class='textarea-field-{0}'>
                    <textarea class='textarea-{0}' rows={1} cols={2}>{3}</textarea>
                </div>
            `.format(c.id, c.areaRow, c.areaCol, c.text);
            return html;
        },
        js: function(c) {
            return null;
        },
        initJs: function(c) {
            return null;
        },
        style: function(c) {
            var align = 'start';
            if (c.textAlign == 'center')
                align = 'center';
            else if (c.textAlign == 'right')
                align = 'end';
                
            var style = `
                .textarea-field-{0} {
                    text-align: {5};
                }
                .textarea-{0} {
                    color: {1};
                    background-color: {2};
                    font-size: {3}px;
                    text-align: {4};
                }
            `.format(c.id, c.fontColor, c.bgColor, c.size, align, c.align);
            return style;
        },
        fields: function(c, fields) {
            fields.push({
                type: 'fontAlign',
                label: '對齊',
                name: 'align',
                defValue: (c.align != undefined) ? c.align : Category.textarea.default.align
            });
            fields.push({
                type: 'color',
                label: '背景顏色',
                name: 'bgColor',
                defValue: (c.bgColor!= undefined) ? c.bgColor: Category.textarea.default.bgColor
            });
            fields.push({
                type: 'color',
                label: '文字顏色',
                name: 'fontColor',
                defValue: (c.fontColor!= undefined) ? c.fontColor: Category.textarea.default.fontColor
            });
            fields.push({
                type: 'select',
                label: '文字大小',
                name: 'size',
                defValue: (c.size != undefined) ? c.size : Category.textarea.default.size
            });
            fields.push({
                type: 'fontAlign',
                label: '文字對齊',
                name: 'textAlign',
                defValue: (c.textAlign != undefined) ? c.textAlign : Category.textarea.default.textAlign
            });
            fields.push({
                type: 'input',
                label: '行',
                name: 'areaRow',
                defValue: (c.areaRow != undefined) ? c.areaRow : Category.textarea.default.areaRow
            });
            fields.push({
                type: 'input',
                label: '列',
                name: 'areaCol',
                defValue: (c.areaCol != undefined) ? c.areaCol : Category.textarea.default.areaCol
            });
            fields.push({
                type: 'textarea',
                label: '內容',
                name: 'text',
                defValue: (c.text != undefined) ? c.text : Category.textarea.default.text
            });
            return fields;
        },
        options: function(c, opts) {
            opts.size = _fontSizeOpts();
            return opts;
        },
        validate: function(c) {
            
            return null;
        }
    },
    lineChart: {
        default: {
            name: '',
            label: '',
            height: '200',
            color: '#000000',
            fill: false,
            line: true,
            lineWidth: '1',
            spanGaps: true,
            maxValue: '',
            minValue: '',
            yLabel: '',
            xLabel: '',
            title: '',
        },
        html: function(c){
            var html = `
                <div class='line-chart-field-{0}'>
                    <canvas id='line-chart-{1}'></canvas>
                </div>
            `.format(c.id, c.name);
            return html;
        },
        js: function(c) {
            var minOpt = '';
            if (c.minValue.length > 0)
                minOpt = 'min: ' + c.minValue + ',';
            var maxOpt = '';
            if (c.maxValue.length > 0)
                maxOpt = 'max: ' + c.maxValue + ',';
            var title = '';
            if (c.title.length > 0)
                title = `
                    title: {
                        display: true,
                        text: '{0}'
                    }
                `.format(c.title);
                
            var js = `
                //
                // lineChartInit_{1} - start
                //
                var lineChartInit_{1}_labels = ['A', 'B', 'C'];
                var lineChartInit_{1}_data = [1,3,2];
                var lineChartInit_{1} = function() {
                    var ctx = $('#line-chart-{1}');
                    var myChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: lineChartInit_{1}_labels,
                            datasets: [
                                {
                                    label: '{2}',
                                    data: lineChartInit_{1}_data,
                                    fill: {4},
                                    borderColor: '{3}',
                                    backgroundColor: '{3}',
                                    showLine: {5},
                                    borderWidth: {6},
                                    spanGaps: {7},
                                    tension: 0,
                                }
                            ]
                        }
                        ,
                        options: {
                            animation: {
                                duration: 0
                            }
                            ,
                            maintainAspectRatio: false,
                            scales: {
                                xAxes: [{
                                    display: true,
                                    scaleLabel: {
                                        display: true,
                                        labelString: '{9}'
                                    }
                                }
                                ],
                                yAxes: [{
                                    display: true,
                                    ticks: {
                                        {10}
                                        {11}
                                    }
                                    ,
                                    scaleLabel: {
                                        display: true,
                                        labelString: '{8}'
                                    }
                                }
                                ]
                            }
                            ,
                            {12}
                        }
                    }
                    );
                }
                // lineChartInit_{1} - end
                
            `.format(c.id, c.name, c.label, c.color, 
                     c.fill, c.line, c.lineWidth, c.spanGaps,
                     c.yLabel, c.xLabel, minOpt, maxOpt,
                     title);
            return js;
        },
        initJs: function(c) {
            var js = `
                lineChartInit_{0}();
            `.format(c.name);
            return js;
        },
        style: function(c) {
            var style = `
                .line-chart-field-{0} {
                    
                }
                #line-chart-{1} {
                    width: 100% !important;
                    height: {2}px !important;
                }
            `.format(c.id, c.name, c.height);
            return style;
        },
        fields: function(c, fields) {
            fields.push({
                type: 'input',
                label: '名稱',
                name: 'name',
                fieldInfo: '用於 javascript 控制使用',
                defValue: (c.name != undefined) ? c.name : Category.lineChart.default.name
            });
            fields.push({
                type: 'input',
                label: '折線圖標題',
                name: 'title',
                defValue: (c.title != undefined) ? c.title : Category.lineChart.default.title
            });
            fields.push({
                type: 'input',
                label: '折線圖標籤',
                name: 'label',
                defValue: (c.label != undefined) ? c.label : Category.lineChart.default.label
            });
            fields.push({
                type: 'input',
                label: '折線圖高度',
                name: 'height',
                fieldInfo: '單位 px',
                defValue: (c.height != undefined) ? c.height : Category.lineChart.default.height
            });
            fields.push({
                type: 'color',
                label: '折線圖顏色',
                name: 'color',
                defValue: (c.color != undefined) ? c.color : Category.lineChart.default.color
            });
            fields.push({
                type: 'checkbox',
                label: '折線圖填滿',
                name: 'fill',
                defValue: (c.fill != undefined) ? c.fill : Category.lineChart.default.fill
            });
            fields.push({
                type: 'checkbox',
                label: '折線圖直線',
                name: 'line',
                defValue: (c.line != undefined) ? c.line : Category.lineChart.default.line
            });
            fields.push({
                type: 'checkbox',
                label: 'spanGaps',
                name: 'spanGaps',
                fieldInfo: 'false: 數據為空值時, 不繪製直線',
                defValue: (c.spanGaps != undefined) ? c.spanGaps : Category.lineChart.default.spanGaps
            });
            fields.push({
                type: 'input',
                label: '直線寬度',
                name: 'lineWidth',
                fieldInfo: '單位 px',
                defValue: (c.lineWidth != undefined) ? c.lineWidth : Category.lineChart.default.lineWidth
            });
            fields.push({
                type: 'input',
                label: 'Y軸標籤',
                name: 'yLabel',
                defValue: (c.yLabel != undefined) ? c.yLabel : Category.lineChart.default.yLabel
            });
            fields.push({
                type: 'input',
                label: 'Y軸最大值',
                name: 'maxValue',
                defValue: (c.maxValue != undefined) ? c.maxValue : Category.lineChart.default.maxValue
            });
            fields.push({
                type: 'input',
                label: 'Y軸最小值',
                name: 'minValue',
                defValue: (c.minValue != undefined) ? c.minValue : Category.lineChart.default.minValue
            });
            fields.push({
                type: 'input',
                label: 'X軸標籤',
                name: 'xLabel',
                defValue: (c.xLabel != undefined) ? c.xLabel : Category.lineChart.default.xLabel
            });
            return fields;
        },
        options: function(c, opts) {
            return opts;
        },
        validate: function(c) {
            if (c.name == null || c.name.length == 0)
                return '名稱欄位不能為空';
            if (c.height == null || c.height.length == 0)
                return '折線圖高度欄位不能為空';
            if (c.lineWidth == null || c.lineWidth.length == 0)
                return '直線寬度欄位不能為空';
            return null;
        }
    },
    barChart: {
        default: {
            name: '',
            label: '',
            height: '200',
            color: '#000000',
            maxValue: '',
            minValue: '',
            yLabel: '',
            xLabel: '',
            title: '',
        },
        html: function(c){
            var html = `
                <div class='bar-chart-field-{0}'>
                    <canvas id='bar-chart-{1}'></canvas>
                </div>
            `.format(c.id, c.name);
            return html;
        },
        js: function(c) {
            var minOpt = '';
            if (c.minValue.length > 0)
                minOpt = 'min: ' + c.minValue + ',';
            var maxOpt = '';
            if (c.maxValue.length > 0)
                maxOpt = 'max: ' + c.maxValue + ',';
            var title = '';
            if (c.title.length > 0)
                title = `
                    title: {
                        display: true,
                        text: '{0}'
                    }
                `.format(c.title);
                
            var js = `
                //
                // barChartInit_{1} start
                //
                var barChartInit_{1}_labels = ['A', 'B', 'C'];
                var barChartInit_{1}_data = [1,3,2];
                var barChartInit_{1} = function() {
                    var ctx = $('#bar-chart-{1}');
                    var myChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: barChartInit_{1}_labels,
                            datasets: [
                                {
                                    borderWidth: 1,
                                    label: '{2}',
                                    data: barChartInit_{1}_data,
                                    borderColor: '{9}',
                                    backgroundColor: '{3}',
                                }
                            ]
                        }
                        ,
                        options: {
                            animation: {
                                duration: 0
                            }
                            ,
                            maintainAspectRatio: false,
                            scales: {
                                xAxes: [{
                                    display: true,
                                    scaleLabel: {
                                        display: true,
                                        labelString: '{5}'
                                    }
                                }
                                ],
                                yAxes: [{
                                    display: true,
                                    ticks: {
                                        {6}
                                        {7}
                                    }
                                    ,
                                    scaleLabel: {
                                        display: true,
                                        labelString: '{4}'
                                    }
                                }
                                ]
                            }
                            ,
                            {8}
                        }
                    }
                    );
                }
                // barChartInit_{1} end
                
            `.format(c.id, c.name, c.label, _rgb2rgba(c.color, 0.4), 
                     c.yLabel, c.xLabel, minOpt, maxOpt,
                     title, c.color);
            return js;
        },
        initJs: function(c) {
            var js = `
                barChartInit_{0}();
            `.format(c.name);
            return js;
        },
        style: function(c) {
            var style = `
                .bar-chart-field-{0} {
                    
                }
                #bar-chart-{1} {
                    width: 100% !important;
                    height: {2}px !important;
                }
            `.format(c.id, c.name, c.height);
            return style;
        },
        fields: function(c, fields) {
            fields.push({
                type: 'input',
                label: '名稱',
                name: 'name',
                fieldInfo: '用於 javascript 控制使用',
                defValue: (c.name != undefined) ? c.name : Category.barChart.default.name
            });
            fields.push({
                type: 'input',
                label: '長條圖標題',
                name: 'title',
                defValue: (c.title != undefined) ? c.title : Category.barChart.default.title
            });
            fields.push({
                type: 'input',
                label: '長條圖標籤',
                name: 'label',
                defValue: (c.label != undefined) ? c.label : Category.barChart.default.label
            });
            fields.push({
                type: 'input',
                label: '長條圖高度',
                name: 'height',
                fieldInfo: '單位 px',
                defValue: (c.height != undefined) ? c.height : Category.barChart.default.height
            });
            fields.push({
                type: 'color',
                label: '長條圖顏色',
                name: 'color',
                defValue: (c.color != undefined) ? c.color : Category.barChart.default.color
            });
            fields.push({
                type: 'input',
                label: 'Y軸標籤',
                name: 'yLabel',
                defValue: (c.yLabel != undefined) ? c.yLabel : Category.barChart.default.yLabel
            });
            fields.push({
                type: 'input',
                label: 'Y軸最大值',
                name: 'maxValue',
                defValue: (c.maxValue != undefined) ? c.maxValue : Category.barChart.default.maxValue
            });
            fields.push({
                type: 'input',
                label: 'Y軸最小值',
                name: 'minValue',
                defValue: (c.minValue != undefined) ? c.minValue : Category.barChart.default.minValue
            });
            fields.push({
                type: 'input',
                label: 'X軸標籤',
                name: 'xLabel',
                defValue: (c.xLabel != undefined) ? c.xLabel : Category.barChart.default.xLabel
            });
            return fields;
        },
        options: function(c, opts) {
            return opts;
        },
        validate: function(c) {
            if (c.name == null || c.name.length == 0)
                return '名稱欄位不能為空';
            if (c.height == null || c.height.length == 0)
                return '折線圖高度欄位不能為空';
            return null;
        }
    },
    pieChart: {
        default: {
            name: '',
            height: '200',
            title: '',
            labelColor: '#000',
            showLabel: true,
        },
        html: function(c){
            var html = `
                <div class='pie-chart-field-{0}'>
                    <canvas id='pie-chart-{1}'></canvas>
                </div>
            `.format(c.id, c.name);
            return html;
        },
        js: function(c) {
            var pieColors = 
                `"#FF3030","#996400","#949400","#009900","#009999","#0000C2","#7600CC","#A800A8"`;
            var title = '';
            if (c.title.length > 0)
                title = `
                    title: {
                        display: true,
                        text: '{0}'
                    }
                `.format(c.title);
                
            var formatter = '';
            if (c.showLabel) {
                formatter = `
                    formatter: (value, ctx) => {
                        var d = null;
                        for (const [key, value] of Object.entries(ctx.dataset._meta)) {
                            d = value;
                        }
                        if (d == null)
                            return '';
                        let sum = d.total;
                        let percentage = (value * 100 / sum).toFixed(2) + "%";
                        return percentage;
                    },     
                `.format();
            }
            else {
                formatter = `
                    formatter: (value, ctx) => {
                        return value;
                    },     
                `.format();
            }
            var js = `
                //
                // pieChartInit_{1} start
                //
                var pieChartInit_{1}_labels = ['A', 'B', 'C'];
                var pieChartInit_{1}_data = [1,3,2];
                var pieChartInit_{1} = function() {
                    var ctx = $('#pie-chart-{1}');
                    var myChart = new Chart(ctx, {
                        type: 'pie',
                        data: {
                            labels: pieChartInit_{1}_labels,
                            datasets: [
                                {
                                    data: pieChartInit_{1}_data,
                                    backgroundColor: [{2}],
                                }
                            ]
                        }
                        ,
                        options: {
                            animation: {
                                duration: 0
                            }
                            ,
                            maintainAspectRatio: false,
                            tooltips: {
                                enabled: false
                            }
                            ,
                            plugins: {
                                datalabels: {
                                    {4}
                                    color: '{5}',
                                }
                            }
                            ,
                            {3}
                        }
                    }
                    );
                }
                // pieChartInit_{1} end
                
            `.format(c.id, c.name, pieColors, title, formatter, c.labelColor);
            return js;
        },
        initJs: function(c) {
            var js = `
                pieChartInit_{0}();
            `.format(c.name);
            return js;
        },
        style: function(c) {
            var style = `
                .pie-chart-field-{0} {
                    
                }
                #pie-chart-{1} {
                    width: 100% !important;
                    height: {2}px !important;
                }
            `.format(c.id, c.name, c.height);
            return style;
        },
        fields: function(c, fields) {
            fields.push({
                type: 'input',
                label: '名稱',
                name: 'name',
                fieldInfo: '用於 javascript 控制使用',
                defValue: (c.name != undefined) ? c.name : Category.pieChart.default.name
            });
            fields.push({
                type: 'input',
                label: '圓餅圖標題',
                name: 'title',
                defValue: (c.title != undefined) ? c.title : Category.pieChart.default.title
            });
            fields.push({
                type: 'input',
                label: '圓餅圖高度',
                name: 'height',
                fieldInfo: '單位 px',
                defValue: (c.height != undefined) ? c.height : Category.pieChart.default.height
            });
            fields.push({
                type: 'checkbox',
                label: '顯示百分比',
                name: 'showLabel',
                defValue: (c.showLabel != undefined) ? c.showLabel : Category.pieChart.default.showLabel
            });
            fields.push({
                type: 'color',
                label: '標籤顏色',
                name: 'labelColor',
                defValue: (c.labelColor != undefined) ? c.labelColor : Category.pieChart.default.labelColor
            });
            return fields;
        },
        options: function(c, opts) {
            return opts;
        },
        validate: function(c) {
            if (c.name == null || c.name.length == 0)
                return '名稱欄位不能為空';
            if (c.height == null || c.height.length == 0)
                return '折線圖高度欄位不能為空';
            return null;
        }
    },
    table: {
        default: {
            data: 1,
            pageLength: 10,
            paging: true,
            ording: true,
            searching: true,
            border: false,
            thBgColor: '#FFFFFF',
            thFontColor: '#000000',
        },
        html: function(c){
            var html = `
            <div class='table-field-{0}'>
                <table id='table-{0}' class='display' style='width:100%'></table>
            </div>
            `.format(c.id);
            return html;
        },
        js: function(c) {
            var columnDefs = '';
            for (var i=0 ; i<c.data.num ; i++) {
                columnDefs += `
                        {title: '{0}', targets: {1} },
                `.format(c.data.inputs[i].label, i);
            }
            var columns = '';
            for (var i=0 ; i<c.data.num ; i++) {
                columns  += `
                        { data : '{0}' },
                `.format(c.data.inputs[i].name);
            }
            
            var js = `
                //
                // updateDataTable_{0} start
                //            
                var updateDataTable_{0} = function(items) {
                    $('#table-{0}').DataTable({
                        paging: {4},
                        info: {4},
                        destroy : true,
                        data : items,
                        pageLength: {3},
                        ordering : {5},
                        searching: {6},
                        columnDefs : [ 
                        	{1}
                        ],
                        columns : [
                            {2}
                        ]
                    }
                    );
                }
                // updateDataTable_{0} end
                
            `.format(c.id, columnDefs, columns, c.pageLength, c.paging, c.ording, c.searching);      
            return js;
        },
        initJs: function(c) {
            var js = `
                var items_{0} = [
            `.format(c.id);
            
            js += '{'
            for (var i=0 ; i<c.data.num ; i++) {
                js += c.data.inputs[i].name + ': 0,';
            }
            js += '},'
            
            js += `
                ];
                updateDataTable_{0}(items_{0});
            `.format(c.id);
            return js;
        },
        style: function(c) {
            var border = '';
            if (c.border)
                border = 'border: 1px solid black;';
                
            var style = `
            .table-field-{0} {
                padding: 6px;
                {3}
            }
            #table-{0} th {
                background-color: {1};
                color: {2};
            }
            `.format(c.id, c.thBgColor, c.thFontColor, border);
            return style;
        },
        export: function(c) {
            $('.table-field-' + c.id).empty();
            $('.table-field-' + c.id).append(
                `<table id='table-{0}' class='display' style='width:100%'></table>`.format(c.id)
            );
        },
        fields: function(c, fields) {
            fields.push({
                type: 'checkbox',
                label: '表格邊框',
                name: 'border',
                defValue: (c.border != undefined) ? c.border: Category.table.default.border
            });
            fields.push({
                type: 'input',
                label: '',
                name: 'pageLength',
                defValue: (c.pageLength!= undefined) ? c.pageLength: Category.table.default.pageLength
            });
            fields.push({
                type: 'checkbox',
                label: '翻頁',
                name: 'paging',
                defValue: (c.paging!= undefined) ? c.paging: Category.table.default.paging
            });
            fields.push({
                type: 'checkbox',
                label: '排序',
                name: 'ording',
                defValue: (c.ording!= undefined) ? c.ording : Category.table.default.ording
            });
            fields.push({
                type: 'checkbox',
                label: '搜尋',
                name: 'searching',
                defValue: (c.searching!= undefined) ? c.searching: Category.table.default.searching
            });
            fields.push({
                type: 'color',
                label: '標頭背景顏色',
                name: 'thBgColor',
                defValue: (c.thBgColor != undefined) ? c.thBgColor : Category.table.default.thBgColor
            });
            fields.push({
                type: 'color',
                label: '標頭文字顏色',
                name: 'thFontColor',
                defValue: (c.thFontColor != undefined) ? c.thFontColor : Category.table.default.thFontColor
            });
            fields.push({
                type: 'dynamicInput',
                label: '資料數目',
                name: 'data',
                defValue: (c.data != undefined) ? c.data : Category.table.default.data
            });
            return fields;
        },
        options: function(c, opts) {
            return opts;
        },
        validate: function(c) {
            if (c.data == null)
                return '資料數目欄位不能為空';
            for (var i=0 ; i<c.data.num ; i++) {
                if (c.data.inputs[i].label == null || c.data.inputs[i].label.length == 0)
                    return '標題(' + (i + 1) + ')欄位不能為空';
                if (c.data.inputs[i].name == null || c.data.inputs[i].name.length == 0)
                    return '名稱(' + (i + 1) + ')欄位不能為空';
            }
            return null;
        }
    },
}