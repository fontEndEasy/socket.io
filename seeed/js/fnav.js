 /*tabs*/
var loadIndex=function(){
	$('.nav-tabs li').click(function(){
          $(this).addClass('active').siblings().removeClass('active');
          var index = $(this).index();
	$('.tab-content>div ').eq(index).show().addClass('active').siblings().removeClass('active').hide();
	});
    
//    //重置header链接
//    $('body').on('click', '.logo', function(){
//        location.href = baseURL+'/index.html';
//        return false;
//    });
//    //重置footer单页的个人中心连接
//    $('body').on('click', '.user-avatar',function(){
//        location.href = baseURL+'/my_account.html';
//        return false;
//    });
//    //重置header所有连接
    
}
//
$("#distributors_area").change(function(){
		var area = $("#distributors_area").val();
		if(area!='all'){
			$(".distributors_lists").hide();
			$("#distributors_"+area).show();
		}else{
			$(".distributors_lists").show();
		}
	});
