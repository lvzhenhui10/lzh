$(function () {
    var layer = layui.layer;
    var form = layui.form;

    initArtCateList();

    //获取文章分类的列表
    function initArtCateList() {
        //发起ajax请求
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr)
            },
        });
    };

    //为添加类别按钮绑定点击事件
    //预先保存弹出层的索引，方便关闭
    var indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章类别',
            content: $('#dialog-add').html()
        });
    });

    //通过代理的形式，为form-add 表单绑定 submit 事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        //发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                };
                initArtCateList();
                layer.msg('新增分类成功！');
                //根据索引，关闭对应的弹出层
                layer.close(indexAdd);
            },
        });
    });

    //通过事件委托的形式为编辑按钮注册点击事件
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function () {
        //弹出一个修改文章分类信息的模态框
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });

        //在模态框弹出之后，根据id 的值发起请求获取文章分类的数据，并填充到表单中
        var id = $(this).attr('data-id');
        //发起ajax请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            },
        });
    });

    //通过事件委托的方式为 form-edit 注册提交事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        //发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！');
                };
                layer.msg('更新分类数据成功！');
                //根据索引，关闭对应的弹出层
                layer.close(indexEdit);
                //调用 initArtCateList 方法，更新数据
                initArtCateList();
            },
        });
    });

    //通过事件委托的形式为删除按钮绑定点击事件
    //并且给删除按钮绑定 btn-delete 类名，添加 data-id 自定义属性
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        //提示用户是否要删除
        layer.confirm('确定删除？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //发起ajax请求
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！')
                    };
                    layer.msg('删除文章分类成功！');
                    //重新获取文章分类列表，刷新页面
                    initArtCateList();
                },
            });
            layer.close(index);
        });
    });
});