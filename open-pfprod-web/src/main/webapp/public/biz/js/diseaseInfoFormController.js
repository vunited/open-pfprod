
layui.config({
    base: basePath + '/public/layui/build/js/'
}).use(['form', 'layer', 'jquery', 'common'], function () {
    var $ = layui.$,
        form = layui.form,
        common = layui.common;

    form.verify({
        name: function (value) {
            if (value.length > 64) {
                return '疾病名称最多64个字';
            }
        },
        icd: function (value) {
            if (value.length > 64) {
                return 'ICD码最多64个字';
            }
        },
        pinyin: function (value) {
            if (value.length > 64) {
                return '拼音码最多64个字';
            }
        }
    });

    //监听提交
    form.on('submit(addDiseaseInfo)', function (data) {
        var url = basePath + '/pf/r/disease/info/';
        if (formType == 'add') {
            url += 'add';
        } else if (formType == 'edit') {
            url += 'edit';
        }
        return common.commonParentFormPost(url, data.field, formType, 'diseaseInfoTableId', '保存');
    });
});

