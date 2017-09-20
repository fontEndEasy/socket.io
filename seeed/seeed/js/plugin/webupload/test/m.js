/**
 * Created by seeed on 2016/1/11.
 */
$(function(){
    $(".m_uploader").each(function(){
        var   vId=$(this).attr("id");
        fileUpLoad(vId);
    });

})
function fileUpLoad(id){
    console.log(id);
    var picker=$("#"+id).find(".m_upload_check_file").attr("id");

    var uploader = WebUploader.create({

        // swf文件路径
        swf: 'webupload/Uploader.swf',

        // 文件接收服务端。
        server: 'index.php?r=base/handle-member-pic',

        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: "#"+picker,

        // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
        resize: false
    });

    uploader.on( 'fileQueued', function( file ) {
         console.log("fileQue");
        $("#"+id).find('.m_upload_list').append( '<div id="' + file.id + '" class="item">' +
            '<h4 class="info">' + file.name + '</h4>' +
            '<p class="state">等待上传...</p>' +
            '</div>' );
           uploader.upload(file.id);
    });

    //文件上传进度
    // 文件上传过程中创建进度条实时显示。
    uploader.on( 'uploadProgress', function( file, percentage ) {
        var $li = $( '#'+file.id ),
            $percent = $li.find('.progress .progress-bar');

        // 避免重复创建
        if ( !$percent.length ) {
            $percent = $('<div class="progress progress-striped active">' +
                '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                '</div>' +
                '</div>').appendTo( $li ).find('.progress-bar');
        }

        $li.find('p.state').text('上传中');

        $percent.css( 'width', percentage * 100 + '%' );
    });

    //文件成功，失败处理
    uploader.on( 'uploadSuccess', function( file,response) {
        var base_img_url = '/seeed-cc/';
        $( '#'+file.id ).addClass('upload-state-done');
        $( '#'+file.id ).find('img').attr('src',base_img_url+response._raw);
        $("#"+id+" .upload_result").val(base_img_url+response._raw);
        $( '#'+file.id ).find('p.state').text('已上传');
    });
    uploader.on( 'uploadError', function( file ) {
        $( '#'+file.id ).find('p.state').text('上传出错');
    });

    uploader.on( 'uploadComplete', function( file ) {
        $( '#'+file.id ).find('.progress').fadeOut();
    });

}