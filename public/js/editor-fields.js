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
        fields.push({
            type: 'input',
            label: '文字',
            name: 'text',
            defValue: (row.text != undefined) ? row.text : ''
        });
        return fields;
    }
}