var Fields = {
    rowFields: function(row) {
        var fields = [];
        fields.push({
            type: 'checkbox',
            label: '隱藏',
            name: 'hidden',
            defValue: (row.hidden != undefined) ? row.hidden : false
        });
        fields.push({
            type: 'checkbox',
            label: '滿版',
            name: 'fluid',
            defValue: (row.fluid != undefined) ? row.fluid : false
        });
        fields.push({
            type: 'color',
            label: '背景顏色',
            name: 'bgColor',
            defValue: (row.bgColor != undefined) ? row.bgColor : 'transparent'
        });
        fields.push({
            type: 'color',
            label: '文字顏色',
            name: 'fontColor',
            defValue: (row.fontColor != undefined) ? row.fontColor : '#000'
        });
        return fields;
    },
    colFields: function(col) {
        var fields = [];    
        if (col.category == null) {
            // list all categories
            var categories = [
                { "label": "空欄位", "value": "empty", "icon": "bi-square"},
            ];
            fields.push({
                type: 'radioicon',
                label: '類型',
                name: 'category'
            });
        }
        else {
            // show category detail
            fields.push({
                type: 'checkbox',
                label: '隱藏',
                name: 'hidden',
                defValue: (col.hidden != undefined) ? col.hidden : false
            });
            fields.push({
                type: 'select',
                label: '寬度',
                name: 'col',
                defValue: (col.col!= undefined) ? col.col : 12
            });
            fields = Category[col.category].fields(col, fields);
        }
        return fields;
    },
    colOptions: function(col) {
        var opts = {};
        if (col.category == null) {
            // list all categories
            opts.category = Category.getCategories();
        }
        else {
            var cols = function(){
                var data = [];
                for (var i=1 ; i<=12 ; i++) {
                    data.push({label: i, value: i});
                }
                return data;
            };
            // show category detail
            opts.col = cols();
            opts = Category[col.category].options(col, opts);
        }
        return opts;
    }
}