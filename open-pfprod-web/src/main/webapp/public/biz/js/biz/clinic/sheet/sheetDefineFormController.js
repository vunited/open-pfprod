layui.config({
    base: basePath + '/public/layui/build/js/'
}).use(['form', 'layer', 'jquery', 'common'], function () {
    var $ = layui.$,
        form = layui.form,
        common = layui.common;

    form.verify({
        commonLength: function (value) {
            if (value.length > 64) {
                return '长度不能超过64个字';
            }
        },
        descript: function (value) {
            if (value && value.length > 255) {
                return '长度不能超过255个字';
            }
        },
        // 页签嵌入，则嵌入代码必填
        script: function (value) {
            if ($('#sdEvaAsse').val() == '21' && !value) {
                return '请输入嵌入代码';
            }
        },
        score: [/^(\-|\+?)\d+(\.\d+)?$/, '得分必须是数字']
    });

    //监听提交
    form.on('submit(addPartDefine)', function (data) {
        if (!data.field.fgActive) {
            data.field.fgActive = '0';
        }
        data.field.fgGroup = data.field.fgGroup ? '1' : '0';
        var url = basePath + '/pf/r/clinic/sheet/';
        if (formType == 'add') {
            url += 'add';
        } else if (formType == 'edit') {
            url += 'edit';
        }
        return common.commonParentFormPost(url, data.field, formType, 'sheetDefineTableId', '保存');
    });
});

