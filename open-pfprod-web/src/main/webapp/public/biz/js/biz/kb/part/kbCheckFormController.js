layui.config({
    base: basePath + '/public/layui/build/js/'
}).extend({
    ckplayer: 'ckplayer/ckplayer'
    , Magnifier: 'js/Magnifier'
    , Event: 'js/Event'
    , formSelects: 'formSelects-v4'
}).use(['table', 'form', 'upload', 'jquery', 'element', 'tableSelect', 'formSelects', 'common'], function () {
    var $ = layui.$
        , table = layui.table
        , form = layui.form
        , upload = layui.upload
        , common = layui.common
        , element = layui.element
        , tableSelect = layui.tableSelect
        , formSelects = layui.formSelects;

    init();

    function init() {
        if (tagFlag == '1') {
            // 查询idMedCase
            var medData = {
                idMedicalrec: idMedicalrec,
                idTag: idTag
            }
            $.ajax({
                url: basePath + '/pf/r/case/history/select/med/tag',
                type: 'post',
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(medData),
                success: function (data) {
                    layer.closeAll('loading');
                    if (data.code != 0) {
                        common.errorMsg(data.msg);
                        return false;
                    } else {
                        if (data.data) {
                            idMedCase = data.data.idMedCase;
                        }
                        loadInfo()
                        return true;
                    }
                },
                error: function () {
                    layer.closeAll('loading');
                    common.errorMsg("查询失败");
                    return false;
                }
            });
        } else {
            loadInfo();
        }
    };

    function loadPic() {
        if (!idMedCase) {
            return;
        }
        var selectUrl = basePath + '/pf/r/kb/part/check/pic/select';
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
                    form.val("uploadFormFilter", data.data);
                    return true;
                }
            },
            error: function () {
                layer.closeAll('loading');
                common.errorMsg("查询失败");
                return false;
            }
        });
    }

    var formIdArr = new Array('searchAnswer', 'desBody', 'sdBody', 'cdCheck', 'idResult', 'desResult', 'fgReason', 'fgBack', 'desExpert', 'test3');

    var initFormData = {};
    tableSelect.render({
        elem: '#searchAnswer',
        checkedKey: 'idBody',
        searchKey: 'keywords',
        searchPlaceholder: '检查分类和部位描述',
        table: {
            url: basePath + '/pf/p/kb/part/check/search',
            cols: [[
                {type: 'radio'},
                {field: 'idBodyText', title: '检查分类'},
                {field: 'desBody', minWidth: 250, title: '部位描述'},
            ]]
            , limits: [10, 20, 50]
            , page: true
        },
        done: function (elem, data) {
            initFormData = data.data[0];
            var checkList = data.data[0].checkList;
            $("#idResult").empty();
            for (var i = 0; i < checkList.length; i++) {
                $('#idResult').append("<option value='" + checkList[i].idResult + "'>" + checkList[i].desResult + "</option>");
            }
            // 结果值唯一，直接填充
            if (checkList.length == 1) {
                fillResult(checkList[0]);
            } else if (checkList.length > 1) {
                form.val("checkFormFilter", data.data[0]);
            }
            form.render();
        }
    });

    function fillResult(data) {
        $.extend(true, data, initFormData);
        $('#reset').click();
        $("#checkForm").autofill(data);
        form.render();
    }

    //监听工具条
    form.on('select(idBodySelectFilter)', function (data) {
        var selectedIndex = $("#idResult").get(0).selectedIndex;
        if (initFormData.checkList) {
            fillResult(initFormData.checkList[selectedIndex]);
            form.render();
        }
    });

    function loadInfo() {
        loadPic();
        //执行渲染
        table.render({
            elem: '#partCheckTable' //指定原始表格元素选择器（推荐id选择器）
            , id: 'partCheckTableId'
            , height: '600' //容器高度
            //, toolbar: '#toolbarCheck'
            //, defaultToolbar: []
            , cols: [[
                {type: 'radio'},
                {field: 'desBody', minWidth: 140, title: '部位描述'},
                {field: 'desResult', minWidth: 110, title: '检查结果'},
                {fixed: 'right', title: '操作', minWidth: 110, align: 'left', toolbar: '#partCheckBar'}
            ]] //设置表头
            , url: basePath + '/pf/p/kb/part/check/list'
            , where: {
                idMedCase: idMedCase
            }
            , limit: 15
            , page: {//支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
                layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'] //自定义分页布局
                //,curr: 5 //设定初始在第 5 页
                , groups: 1 //只显示 1 个连续页码
                , first: false //不显示首页
                , last: false //不显示尾页
                , limits: [15, 30, 50, 100]
            }
        });
    }

    //监听提交
    form.on('submit(queryFilter)', function (data) {
        reloadTable(data.field.keyword)
    });

    $('#keyword').bind('keypress', function (event) {
        if (event.keyCode == "13") {
            reloadTable($('#keyword').val())
            return false;
        }
    });

    function reloadTable(keyword) {
        table.reload('partCheckTableId', {
            where: {
                idMedCase: idMedCase,
                keyword: keyword
            }
            , height: '600'
        });
    }

    form.verify({
        desAnswer: function (value) {
            if (value.length > 255) {
                return '长度不能超过255个字';
            }
        },
        desBody: function (value) {
            if (value.length > 255) {
                return '长度不能超过255个字';
            }
        }
    });


    // 文件上传
    var timer;
    upload.render({
        elem: '#test3'
        , url: basePath + '/upload'
        , field: 'file'
        , accept: 'file' //普通文件
        //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
        , before: function (obj) {
            $('#path').hide();
            $('#uploadProgress').show();
            //模拟loading
            timer = setInterval(function () {
                $.ajax({
                    type: "POST",
                    contentType: false,
                    async: false,
                    cache: false,
                    url: basePath + '/selectUploadPercent',
                    dataType: "json",
                    success: function (data) {
                        var per = data.percent + "%";
                        element.progress('demo', per);
                    }, error: function (data) {
                        alert("ajax异常！！！");
                    }
                });
            }, 1000);
        }
        , done: function (res) {
            $('#path').show();
            $('#uploadProgress').hide();
            clearInterval(timer);
            clearPercent();
            if (res.code != '0') {
                layer.tips(res.msg, '#test3', {
                    tips: [1, '#FF5722'],
                    time: 5000
                });
                return;
            }
            $('#path').val(res.data.path);
            $('#idMedia').val(res.data.idMedia);
        }
        , error: function () {
            $('#path').show();
            $('#uploadProgress').hide();
            clearInterval(timer);
            clearPercent();
        }
    });

    upload.render({
        elem: '#frontPicUp'
        , url: basePath + '/upload'
        , field: 'file'
        , accept: 'images' //普通文件
        , exts: 'jpg|png|bmp|jpeg'
        , before: function (obj) {
            layer.msg('正在上传图片', {icon: 16, shade: 0.01});
        }
        , done: function (res) {
            if (res.code != '0') {
                layer.tips(res.msg, '#frontPicUp', {
                    tips: [1, '#FF5722'],
                    time: 5000
                });
                return;
            }
            $('#frontPath').val(res.data.path);
            $('#idMedia').val(res.data.idMedia);
            var dataPic = {};
            dataPic.idMedCase = idMedCase;
            dataPic.idMediaFront = res.data.idMedia;
            dataPic.frontPath = res.data.path
            dataPic.tagFlag = tagFlag;
            if (tagFlag == '1') {
                dataPic.caseName = caseName;
                dataPic.idMedicalrec = idMedicalrec;
                dataPic.idTag = idTag;
            }
            common.commonPost(basePath + '/pf/r/kb/part/check/pic/save', dataPic, '上传', '', loadPage);
            layer.closeAll('loading');
        }
        , error: function () {
            layer.closeAll('loading');
        }
    });

    function loadPage() {
        if (!idMedCase) {
            window.location.reload();
        }
    }

    upload.render({
        elem: '#backPicUp'
        , url: basePath + '/upload'
        , field: 'file'
        , accept: 'images' //普通文件
        , exts: 'jpg|png|bmp|jpeg'
        , before: function (obj) {
            layer.msg('正在上传图片', {icon: 16, shade: 0.01});
        }
        , done: function (res) {
            if (res.code != '0') {
                layer.tips(res.msg, '#backPicUp', {
                    tips: [1, '#FF5722'],
                    time: 5000
                });
                return;
            }
            $('#backPath').val(res.data.path);
            $('#idMedia').val(res.data.idMedia);
            var dataPic = {};
            dataPic.idMedCase = idMedCase;
            dataPic.idMediaBack = res.data.idMedia;
            dataPic.backPath = res.data.path
            dataPic.tagFlag = tagFlag;
            if (tagFlag == '1') {
                dataPic.caseName = caseName;
                dataPic.idMedicalrec = idMedicalrec;
                dataPic.idTag = idTag;
            }
            common.commonPost(basePath + '/pf/r/kb/part/check/pic/save', dataPic, '上传', '', loadPage);
            layer.closeAll('loading');
        }
        , error: function () {
            layer.closeAll('loading');
        }
    });

    //清除进度数据
    function clearPercent() {
        $.ajax({
            type: "POST",
            contentType: false,
            async: false,
            cache: false,
            url: basePath + '/clearUploadPercent',
            dataType: "json",
            success: function (data) {
                element.progress('demo', 0);
            },
        });
    };

    //相册层
    $('#preview').on('click', function () {
        var path = $('#path').val();
        if (!path) {
            layer.tips("您还未上传文件", '#preview', {tips: 1});
            return false;
        }
        var sdType = $('#sdType').val();
        if (sdType == '1') {
            common.openSinglePhoto(path);
        } else if (sdType == '2') {
            common.openAudio(path.substring(0, path.lastIndexOf(".")));
        } else if (sdType == '3') {
            common.openTopVideo(basePath + '/video/form?path=' + path, 890, 504);
        } else {
            layer.tips("该文件类型暂不支持预览", '#preview', {tips: 1});
        }
        return false;
    });

    $('#add').on('click', function () {
        $("#idResult").empty();
        setFormStatus('1', formIdArr);
        $('#reset').click();
        $('#save').click();
    });

    $('#save').on('click', function () {
        if (!$('#idMedCaseList').val()) {
            layer.tips('请先在左侧选中一行记录，若无，请先添加', '#save', {tips: 1});
            return false;
        }
    })

    form.on('submit(saveCheck)', function (data) {
        data.field.fgReason = data.field.fgReason ? '1' : '0';
        data.field.fgBack = data.field.fgBack ? '1' : '0';
        data.field.fgShow = data.field.fgShow ? '1' : '0';
        data.field.idMedCase = idMedCase;
        if (!data.field.fgCarried) {
            data.field.fgCarried = '0';
        }
        common.commonPost(basePath + '/pf/r/kb/part/check/save', data.field, '保存', '', _callBack);
        return false;
    });

    var _callBack = function (data) {
        _tableReload();
        $('#idMedCaseList').val(data.data);
    }

    //监听工具条
    table.on('tool(partCheckTableFilter)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') {
            _delCheck(data);
        } else if (obj.event === 'reset') {
            _resetCheck(obj);
        } else if (obj.event === 'edit') {
            _editCheck(obj);
        }
    });

    var _resetCheck = function (obj) {
        var url = basePath + '/pf/r/kb/part/check/reset';
        layer.confirm('真的要将部位描述：【' + obj.data.desBody + '】恢复默认么？', {
            title: '部位描述恢复默认提示',
            resize: false,
            btn: ['确定', '取消'],
            btnAlign: 'c',
            icon: 3
        }, function (index) {
            common.commonPost(url, obj.data, '', '', resetCallback);
            layer.closeAll(index);
        })
    };

    function resetCallback(data) {
        fillForm(data.data);
        common.sucChildMsg("已恢复至默认数据");
        _tableReload();
    };

    var _editCheck = function (obj) {
        /*var checkStatus = table.checkStatus('partCheckTableId')
            , data = checkStatus.data;
        if (data.length == 0) {
            common.toastTop("请先选中当前行");
            return;
        }
        if (obj.data.idMedCaseList != data[0].idMedCaseList) {
            common.toastTop("请先点击单选按钮选中当前行");
            return;
        }*/
        var url = basePath + '/pf/r/kb/part/check/custom';
        var reqData = new Array();
        reqData.push(obj.data.idMedCaseList);
        var data = {};
        data.list = reqData;
        data.status = '1';

        common.commonPost(url, data);
        obj.update({
            fgCarried: data.status
        });
        setFormStatus(data.status, formIdArr);
        $('#fgCarried').val(data.status);
        form.render();
    };

    var _delCheck = function (currentData) {
        var url = basePath + '/pf/r/kb/part/check/del';
        var reqData = new Array();
        var name = '【' + currentData.desBody + '】';
        reqData.push(currentData.idMedCaseList);
        var data = {};
        data.list = reqData;
        data.status = '1';

        layer.confirm('真的要删除项目：' + name + '么？', {
            title: '删除项目提示',
            resize: false,
            btn: ['确定', '取消'],
            btnAlign: 'c',
            icon: 3
        }, function (index) {
            common.commonPost(url, data, '删除', '', _tableReload);
            layer.closeAll(index);
            $('#reset').click();
        })
    };

    var _tableReload = function () {
        table.reload('partCheckTableId', {
            where: {
                idMedCase: idMedCase
            }
            , height: '600'
        });
    };

    /*table.on('radio(partCheckTableFilter)', function (obj) {
        fillForm(obj.data);
    });*/

    //单击行选中radio
    table.on('row(partCheckTableFilter)', function (obj) {
        obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');//选中行样式
        obj.tr.find('input[lay-type="layTableRadio"]').prop("checked", true);
        form.render('radio');
        fillForm(obj.data);
    });


    function fillForm(data) {
        $('#reset').click();

        $("#idResult").empty();
        $('#idResult').append("<option value='" + data.idResult + "'>" + data.desResult + "</option>");

        $("#checkForm").autofill(data);
        formSelects.value('cdCheckSelect', [data.cdCheck]);
        setFormStatus(data.fgCarried, formIdArr);
        form.render();
    };


    var selectArr = [];
    $.ajax({
        url: basePath + '/pf/r/check/question/classify/tree',
        type: 'post',
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            var selectData = data.data;
            selectArr = toTree(selectData);
            formSelects.data('cdCheckSelect', 'local', {
                arr: selectArr
                //, linkage: true
            });
            return true;
        },
        error: function () {
            return false;
        }
    });

    formSelects.filter('cdCheckSelect', function (id, inputVal, val, isDisabled) {
        if (
            //PY.fullPY(val.name).toLowerCase().indexOf(inputVal) != -1 ||    //拼音全拼是否包含
            PY.fullPY(val.name, true).indexOf(inputVal) != -1 ||            //拼音简拼是否包含
            val.name.indexOf(inputVal) != -1                                //文本是否包含
        ) {
            return false;
        }
        return true;
    });

    function toTree(data) {
        // 删除 所有 children,以防止多次调用
        data.forEach(function (item) {
            delete item.children;
        });

        // 将数据存储为 以 id 为 KEY 的 map 索引数据列
        var map = {};
        data.forEach(function (item) {
            item.value = item.id;
            item.expand = false;
            map[item.id] = item;

        });
        var val = [];
        data.forEach(function (item) {
            // 以当前遍历项，的pid,去map对象中找到索引的id
            var parent = map[item.pId];
            // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
            if (parent) {
                (parent.children || (parent.children = [])).push(item);
            } else {
                //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
                val.push(item);
            }
        });
        return val;
    };

    $('#bachAddCheckAnswer').on('click', function () {
        common.openParent('体格检查选择',
            basePath + '/pf/p/kb/part/define/check/bach/add/page?idMedCase='
            + idMedCase + '&tagFlag=' + tagFlag + '&idTag=' + idTag
            + '&idMedicalrec=' + idMedicalrec + '&caseName=' + caseName,
            800, 480);
    });

    $('#allAddCheckAnswer').on('click', function () {
        var y = $(this).offset().top;
        var x = $(this).offset().left;
        addAll(x, y);
    });

    function addAll(x, y) {
        layer.confirm('确定要全部引入么？', {
            title: '提示',
            offset: [y + 'px', x + 'px'],
            resize: false,
            btn: ['确定', '取消'],
            btnAlign: 'c',
            icon: 3
        }, function (index) {
            var url = basePath + '/pf/r/kb/part/check/bach/add';
            var bizData = {
                extId: idMedCase,
                extType: '1', // 全部引入
                tagFlag: tagFlag,
                idMedCase: idMedCase,
                idMedicalrec: idMedicalrec,
                idTag: idTag,
                caseName: caseName
            }
            layer.msg('正在执行，请稍后...', {icon: 16, shade: 0.01});
            common.commonPost(url, bizData, '全部引入', null, successAddAllCallback, false);
        })
    }

    function successAddAllCallback() {
        layer.closeAll('loading');
        window.location.reload();
    }

    function setFormStatus(status, arr) {
        if (status == '0') {
            $.each(arr, function (index, value) {
                $('#' + value).addClass("layui-disabled");
                $('#' + value).attr("disabled", "true");
                formSelects.disabled('cdCheckSelect');
            });
        } else {
            $.each(arr, function (index, value) {
                $('#' + value).removeClass("layui-disabled");
                $('#' + value).removeAttr("disabled", "true");
                formSelects.undisabled('cdCheckSelect');
            });
        }
    };

    $(document).ready(function () {
        if (previewFlag == '1') {
            var formBtnArr = new Array('sdBody', 'frontPicUp', 'backPicUp', 'save');
            common.setFormStatus('0', formBtnArr);
            setFormStatus('0', formIdArr);
            layui.form.render('select');
        }
    });

});

