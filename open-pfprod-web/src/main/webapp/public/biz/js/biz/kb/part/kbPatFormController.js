layui.config({
    base: basePath + '/public/layui/build/js/'
}).use(['form', 'jquery', 'common'], function () {
    var $ = layui.$,
        form = layui.form,
        common = layui.common;

    var selectUrl = basePath + '/pf/r/kb/part/pat/select';
    var bizData = {};
    bizData.idMedCase = idMedCase;
    layer.load(2);
    $.ajax({
        url: selectUrl,
        type: 'post',
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(bizData),
        success: function (data) {
            layer.closeAll('loading');
            if (data.code != 0) {
                common.errorMsg(data.msg);
                return false;
            } else {
                form.val("kbPartPatFilter", data.data);
                return true;
            }
        },
        error: function () {
            layer.closeAll('loading');
            common.errorMsg("查询失败");
            return false;
        }
    });


    form.verify({
        commonLength: function (value) {
            if (value.length > 64) {
                return '长度不能超过64个字';
            }
        },
        age: function (value) {
            if (!value.match(/^[1-9]\d*$/)) {
                return '年龄必须是正整数';
            }
            if (value > 200) {
                return '您输入的年龄有误';
            }
        }
    });

    form.on('submit(addKbPartPat)', function (data) {
        data.field.idMedCase = idMedCase;
        var url = basePath + '/pf/r/kb/part/pat/save';
        return common.commonPost(url, data.field, '保存');
    });


    form.on('submit(saveAsKbPartPat)', function (data) {
        data.field.idMedCase = idMedCase;
        var url = basePath + '/pf/r/kb/part/pat/save';
        return common.commonPost(url, data.field, '另存');
    });

});

