 /**
 * @file fusion_pcb.js
 * @description fusion 
 * edit by Alice 2016-04-26
 */

 var common_token = '';

	//最终路径
var getItemDetail = function(){
var apiURL = apiRoot+'index.php?r=bazaar/fusion/default/get-token'; 
    var param ='';
    startAjax(apiURL, param, function(json){
	//if(json.errorcode=='0'){
	common_token = json.data.token;


    var p_id=835;         //定义基础p_id 
 
    //参数判断
    //请求基础数据
    var apiURL  = apiRoot +'index.php?r=bazaar/fusion/default/get-product-option',     //请求api
    // breadcrumb_apiURL = apiRoot + 'index.php?r=admin/products/product/get-product-cates',
    param   = 'product='+p_id;  //请求参数,
    var _input_list = '';
    var _output_list='';
    var _oprice ='';
    var current_fs, next_fs, previous_fs; //过渡元素
    var left, opacity, scale; //过渡属性
    var animating; //过渡动画


  //   $('body').on('click', '.j-pcba', function(){
		// createWebUpload_t(c_all_url, 'file', '.upload_box_pcba','.upload_pcba', function(json){
		//   }); 
  //   });

    //请求该表单基本数据
    startAjax(apiURL, param, function(json){
    	
        if(json.errorcode == 0){
          // var json = json.data.options;
          var json_price = json.data.options_price,
	          json_option = json.data.options,
	          totalPrices = json.data.price;  
              console.log(json_option);
        for( var i in json_option){
            //遍历option
    	var _option = '',
    	   _optionr = '',
    	     _cdata = '',
    	        sel = '';
           _default = json_option[i].default;
    	   $(json_option[i].values).each(function(){
           if(this[1]==_default){
    		_option += '<option value="'+this[1]+'" selected>'+this[1]+'</option>';
    	    _optionr +='<i class="show">'+this[1]+'</i>';
    	     

    	   }else{
    	   	// if(parseFloat(this[2])==0){
    	   	// 	_cdata='';
    	   	// }
    	   	// else{
    	   	// 	_cdata='(+$'+parseFloat(this[2])+')';
    	   	// }
    		 _option += '<option value="'+this[1]+'">'+this[1]+_cdata+'</option>';
    		 _optionr +='<i class="hide">'+_cdata+'</i>';
    		
    	   }

        	});

            if(json_option[i].name!='File'){
            	//leftlist
           
            	_input_list +='<div class="form-group " id="OptionsBox-'+i+'">'+
                            '<label class="col-sm-3 control-label" for="PcbAttribName-111" id="PcbAttribName-111">'+
                                '<s class="c">*</s>'+json_option[i].name+
                            '</label>'+
                            '<div class="fusinput">'+
                            // onchange="OptionChange('+i+')"
                                '<select class="form-control PcbAttrib" name="PcbAttrib" id="PcbAttrib-'+i+'" data-id="'+i+'">'
                                +_option+
                                '</select>'+
                            '</div>'+
                        '</div>';
              //rightlist

              _output_list += '<div class="PcbAttribPriceList-'+i+'">'+
                                '<span class="c9">'+json_option[i].name+
                                '</span><span class="pull-right PcbAttribPriceCost-'+i+'" data-id="'+i+'" >'+_oprice+
                                '</span><span class="pcb_right PcbAttribPriceVal-'+i+'" data-id="'+i+'">'+_optionr+'</span>'
                                +'</div>';   

            }else{

                 var _upload='',_upload_t='';
                _upload='<span class=" filebtn" name="'+i+'">'+
                        '<input id="PcbAttrib-'+i+'" data-id="'+i+'" type="hidden" value="" name="'+i+'" class="PcbAttrib'+i+'">'
                        '</span>';
            
            }

         
        }
            
        $('.form-horizontal').empty().append(_input_list);
        $('.upload_box').append(_upload);
        // $('.upload_pcba').append(_upload);
        $('.PcbServicePriceBox').append(_output_list);
        $('.TotalPrices').append(totalPrices);
        $('.PcbServicePrice').append(totalPrices);
        // console.log(_input_list);
  
        }
        else if(json.errorcode == 2) {

        	alert('错误，并接上后续处理');
        }
        else {
            //处理出错情况
            alert('没数据，提示并跳回首页');
            // location.href = 'index.html';
        }
     
    });

	 //点击数据下拉
	 $('body').on('click', '.table-bordered div.js-has-more',function(){
    if($(this).children('i').hasClass('fa-chevron-down')){
     $(this).children('i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
	   // $(this).parent().parent().next("tr.has-more").slideToggle();
     $(this).parent().parent().next("tr.has-more").slideUp();
      }else{
     $(this).children('i').addClass('fa-chevron-down');
     $(this).parent().parent().next("tr.has-more").slideDown();
      }
	 });
 
 // $('.table-bordered div.js-has-more').click(function(){
 
 // })

  //PCB文件上传
  createWebUpload('file', '.upload_box','.upload', function(json){});
  createWebUpload_t('file', '.upload_box_pcba','.upload_pcba', function(json){}); 

 //选项改变调用数据
 $('body').on('change','.PcbAttrib',function(){
 //屏蔽点击 
         $('.js-add-cart').attr('disabled','disabled');
 	       var param  = new Object();
 	       var pcbtext=$(this).children('option:selected').text();
 	       var id=$(this).attr('data-id');

 	       $(".PcbAttribPriceVal-"+id ).text(pcbtext);
 	        // $("#PcbAttribPriceCost-"+id ).text(pcbtext);
           $(".PcbAttrib").each(function(){
	            var optionId = $(this).attr('id').replace(/[^0-9]/ig,"");
	            param['options['+optionId+']'] = $(this).val();
           });
            param['options[36]']=$('.PcbAttrib36').val();
            param['product'] = $("input[name='product']").val();

			   getProductPrice(p_id,param,function(json){ 
        
                       // console.log(json)
                if(json.data.code != "undefined"){
                $(".PcbAttrib").each(function(){
                    $(this).removeClass("fusion_hover");
                    	$('.help-block').hide();
                });

                     console.log(json);
                if(json.data.code=="000"){
                    //开启屏蔽点击
                    $('.js-add-cart').removeAttr('disabled');
                    $('.TotalPrices').html(Number(json.data.price).toFixed(2));
                    $('.PcbServicePrice').html(Number(json.data.price).toFixed(2));
                     var _opoprice=json.data.options_price;	 
                   
                    for(var p in _opoprice){
                    	if(parseFloat(_opoprice[p])==0){
                    		var _oprice="";
                    	$(".PcbAttribPriceCost-"+p).text(_oprice);
                      
                    	}else{
                    		var _oprice='$'+parseFloat(Number(_opoprice[p]).toFixed(2));
                    	$(".PcbAttribPriceCost-"+p).text(_oprice);	
                    	}
                     $('.fusion_next').unbind();
                      $('.js-add-cart').unbind();
                    }

                      

                }else if(json.data.code=="014"){
                
                    $('#PcbAttrib-'+json.data.option).addClass("fusion_hover");
                    $('#OptionsBox-'+json.data.option).append('<div class="help-block">'+json.data.msg+'</div');
                    $('.fusion_next').bind('click',function(){
                    $('#PcbAttrib-'+json.data.option).addClass('blink');
                     return false;
                   	    	
                    });
                      $('.js-add-cart').bind('click',function(){
                     $('#PcbAttrib-'+json.data.option).addClass('blink');
                     return false;
                   	    	
                    });

                   	   
                 
                   }
            }
            else{
                alert(json.data.msg);
            }
			   });
			});
   /*pcb添加到购物车*/
        $('body').on('click', '.js-add-cart', function(){
 	       var param  = new Object();
           $(".PcbAttrib").each(function(){
	            var optionId = $(this).attr('data-id');
	            param['attr['+optionId+']'] = $(this).val();
           });
           param['attr[36]']=$('.PcbAttrib36').val();
           console.log(param);
           param['pid'] = $("input[name='product']").val();
           param['qty'] = 1;       
           //上传文件状态
          
           if($('.upload_box').hasClass('fbtn_success')&&param['attr[36]']!=''){

            var $this = $(this),
                // p_id  =$this.val(),
                $qty  = $('#PcbAttrib-113'),
                predict_quantity = $qty.val();
               

            if(predict_quantity == 0) {
                // $qty.parent().find('.warning').remove().end()
                //     .append('<div class="warning animated shake">pick a number</div>');
                $(".fpcb_error ").addClass("blink");
                return false;
            }else
                
                $this.creatLoadingState({
                    'id':'js-adding',
                    'text':'ADDING',
                    'bgc':'#09694f'
                });
              
               //加入购物车
                addDataToCart(param, function(json){
                    // console.log(json);
                    //添加成功
                        var $skind= $('.skind li:selected'),
                        skind =$skind.val($(this).text());
                    if(json.errorcode == 0) {
                        $('#js-adding').remove();
                        $this.addClass('inline-block');
                               //跳转到购物车
                                console.log(json);
                                location.href = 'cart_detail.html';
                        
                    }else {
                         //库存判断
                        //处理错误情况
                        $('.item-attr .info .btn').text('Stocks not enough');
                         return false;

                    }
                });
            

           }
           else{
               
                $('.webuploader-pick').html('<span class="blink">Please upload the file</span>')
                $("html,body").stop(true).animate({ scrollTop: 0 }, 400);

           	    return false;
           }
          
             return false;
          
        });

/*pcba添加到购物车*/
$('body').on('click', '.js-add-cartpcba', function(){
       var param  = new Object();
       $(".PcbAttrib").each(function(){
            var optionId = $(this).attr('id').replace(/[^0-9]/ig,"");
            param['attr['+optionId+']'] = $(this).val();
       });
       var _pcb_v = $('.PcbAttrib36').val();
       var _pcb36 =_pcb_v.replace(/.*(\/|\\)/, "");
       param['attr[36]']=_pcb_v;
       param['attr[125]']=$("#PcbaAttrib-125").val();
       param['pid'] = $("input[name='product_pcba']").val();
       param['qty'] = 1;
       param['bom_key'] = common_token;
       // param['product'] = $("input[name='product_pcba']").val();
       //pcb数量判断
       var count = $('#PcbAttrib-113').find("option:selected").val();
       var _pcbaqty = $("#PcbaAttrib-125").val();
  
       if(parseFloat(_pcbaqty)>parseFloat(count)){
        $('.fpcb_error').text('Cannot exceed the maximum value of Qty. PCB').show();
         return false;
       }
       // console.log(''+$('.js_cid_check').length);

 if($(".js_cid_check:checked").length ==0&&$(".check_def:checked").length == 0){
    $('.theme-popover').slideDown();
               $(".overlay").show();
               $('.fpcba_close').click(function(){
               $('.theme-popover').slideUp();
               $(".overlay").hide();
                 });
      return false;
} 

  var null_status = 1;

       $('.js_cid_check').each(function(){
            var $this = $(this),
                $check = $this.parent().parent(),     //input所在tr
                $table = $check.next(); 
            var id = $this.attr('data-id');                  //表格所在的tr
            var mpn = $this.parent().siblings().find('.js_opl_mpn'+id).attr('value');
             console.log(mpn);

            if($this.is(':checked')){

              if(!$table.find('.hjs-use').length) {
               $('.theme-popover').slideDown();
               $('.theme-popover h4').text("Please comfirm the "+mpn);
               $(".overlay").show();
               $('.fpcba_close').click(function(){
               $('.theme-popover').slideUp();
               $(".overlay").hide();
               });   
               // alert('还有东西没选');
               null_status = 0;
               return false;

              }
          }


       });

       // alert('可以添加到购物车');
       if(null_status){
          
      
 // alert('可以添加到购物车');

       // return false;

      //添加到购物车

       //上传文件状态
      
       if($('.upload_box_pcba').hasClass('fbtn_success')){
         
        var $this = $(this),
            // p_id  =$this.val(),
            $qty  = $('.js-qty'),
            predict_quantity = $qty.val();
         
         // 输入数量
         if($('.fpcb_error').is(":visible")){//输入数量
              $('.fpcb_error').addClass('blink');
              $("html,body").stop(true).animate({ scrollTop: 0 }, 400);
              return false;
         }
        // pcba数量判断
        if(predict_quantity == 0) {
            // $qty.parent().find('.warning').remove().end()
            //     .append('<div class="warning animated shake">pick a number</div>');
            $('.fpcb_error ').addClass('blink');
            return false;
        }else{
           
            $this.creatLoadingState({
                'id':'js-adding',
                'text':'ADDING',
                'bgc':'#09694f'
            });
         
           //加入购物车
            addDataToCart(param, function(json){
                // console.log(json);
                //添加成功
                    var $skind= $('.skind li:selected'),
                    skind =$skind.val($(this).text());
                if(json.errorcode == 0) {
                    $('#js-adding').remove();
                    $this.addClass('inline-block');
                           //跳转到购物车
                            console.log(json);
                            location.href = 'cart_detail.html';
                    
                }else {
                     //库存判断
                    //处理错误情况
                    $('.item-attr .info .btn').text('Stocks not enough');
                     return false

                }
            });
        }
          }
       }
       // else{
            
       //      $('.webuploader-pick').html('<span class="blink">Please upload the file</span>');
       //      $("html,body").stop(true).animate({ scrollTop: 0 }, 400);

       // 	    return false;
       // }
      
         return false;        


          
});

 
    //获取价格
    function getProductPrice(p_id,param, callback) {
   
        var isladder_api = apiRoot+'index.php?r=bazaar/fusion/default/get-product-price';//,
        startAjax(isladder_api, param, function(json){
            callback(json);
        });
    }
 
    //添加商品到购物车
    function addDataToCart(param, callback) {
        var apiURL = apiRoot+'index.php?r=bazaar/cart/default/add'; 
        startAjax(apiURL, param, function(json){
            callback(json);
        });
    } 
     //pcba表单数据获取
    function getPcbatableData(param, callback) {
        var apiURL = apiRoot+'index.php?r=bazaar/fusion/default/get-bom-price'; 
        startAjax(apiURL, param, function(json){
            callback(json);
        });
    } 
    //物料选择接口
    function getmaterialData(param, callback) {
        var apiURL = apiRoot+'index.php?r=bazaar/fusion/default/component-select'; 
        startAjax(apiURL, param, function(json){
            callback(json);
        });
    } 
    //获取bom价格
    function getBomPriceData(param, callback) {
        var  _bomlist='',
             _bompricelist='',
             _bomtotal='',
             _bom_tr='',
             _bom_li ='',
             _more_item='',
             _more_des=''
             _noitems='',
             pcbCost='',
             _noli='',
             _check='',
             _more_wrap='',
             _bomprice='';
       	var _pcba_qty = $('.js-qty').val();
        var _pcbqty =$('#PcbAttrib-113').find("option:selected").val();
        var apiURL = apiRoot+'index.php?r=bazaar/fusion/default/get-bom-price'; 
        var param  = new Object();
        param['pcba_qty'] = _pcba_qty;
        param['token'] = common_token;
        startAjax(apiURL, param, function(json){
       
          if(json.errorcode==0){
              //数量判断

             //开启屏蔽点击事件
                  $('.js-add-cartpcba').removeAttr('disabled');
                  $('.js-add-cartpcba').removeClass('default-button');
                  $('.webuploader-pick i').removeClass('fa-spinner');
                  $('.css_for_warn i').removeClass('fa-spinner');
                  $('#StencilAttribPriceList-146').empty().html('<i>Setup cost including tooling cost, material shipping cost, tax, wastage, backup material during production.</i>').show();
          	     _bomlist=json.data.list;
                 _bomtotal=json.data.priceList;
                 _noitems= json.data.noItem;
                //数量提示
                // if(_pcba_qty>0&&_pcba_qty<_pcbqty){
                // 	      $(".PcbaAttribPriceVal-125").text(num);
                //         $("span[name='opl_qty']").text(num);
                //         $('.fpcb_error').hide(200);
                // }
                // else{
                //         $('.fpcb_error').show(200);
                //         return false;
                // } 
                //warning
                 _noli='';
                 _bom_tr = '';
                 _more_wrap='';
                 if(_noitems!='')
                 {
	                 for(var i in _noitems){
	                 	_noli +='<b class="label label-default">'+_noitems[i].mpn+'</b>';
	                 }
                     $('.pcba-warning').show();
                 }else{
                   $('.pcba-warning').hide();
                 }
                _more_wrap='';
                 //表单数据
                 for(var b in _bomlist){
                    if(_bomlist[b].use ==''){
                       _more_item ='';
                       
                     $(_bomlist[b].results.items).each(function(){
                     	console.log(_bomlist[b].results);
                       
                 	   _more_item +='<tr class="warning">'+
                               '<td name="opl_id" data-id="'+b+'" data-cid="'+this.id+'">'+this.mpn+'</td>'+
                               '<td id="opl_description_text"><span name="opl_des'+i+'" class="word-width-180" data-id="'+b+'" data-des="'+this.description+'">'+
                               this.description+'</span></td>'+
                               '<td class="opl_unit_price" name="opl_unit_price">$'+this.unit_price+'</td>'+
                               '<td class="opl_amount_price" name="opl_amount_price">$'+Number(this.unit_price*_bomlist[b].query.qty*_pcba_qty).toFixed(4)+'</td>'+
                               '<td><input name="opl_mpn" type="hidden" value="16SVPC39M">'+
                               '<span class="btn btn-xs js-use" id="btn_'+this.id+'" data-id="'+b+'" data-cid="'+this.id+'" data-mpn="'+this.mpn+'"  data-amount="'+Number(this.unit_price*_bomlist[b].query.qty*_pcba_qty).toFixed(4)+'" data-state="0">use</span></td></tr>';

                               _check='<input type="checkbox" class="js_cid_check js_check'+b+' _check" value="'+this.id+'" data-id="'+b+'" name="oplItem"  data-token="'+common_token+'" data-mpn="'+this.mpn+'">';
                               _more_des ='<div data-id="'+b+'" name="opl_des" class="opl_des"></div><div class="js-has-more pointer"><i id="MoveListShow0" class="fa fa-chevron-down" data-id="'+b+'" ></i></div>';
                               _bomprice ='<th class="opl_unit_price" name="opl_price" data-id="'+b+'">$0</th>'+
                               '<th class="opl_amount" name="opl_amount_price" data-id="'+b+'">$0</th>';
                           });
                          
                        }else{
                         	    _check='<input type="checkbox" class="check_def" id="oplItem'+_bomlist[b].results.id+'" data-id="'+_bomlist[b]+'" disabled="" checked="true" data-cid="'+this.id+'" data-token="'+common_token+'" data-mpn="'+this.mpn+'">'
                             	_more_item ='';
                             	_more_des =_bomlist[b].results.description;
                             	_bomprice ='<th name="opl_unit_price_text">'+parseFloat(_bomlist[b].results.unit_price)+'</th>'+
                            '<th name="opl_amount_price">'+Number(_bomlist[b].results.unit_price*_bomlist[b].query.qty*_pcba_qty).toFixed(4)+'</th>';

                             }
                       
                      if(_bomlist[b].use==''){
                     
                      _more_wrap ='<tr class="has-more warning" id="more_opl_list'+b+'" style="overflow: hidden; display: table-row;">'+
                               '<td colspan="7"><div class="table-responsive">'+
                               '<table class="table table-hover table-condensed inner-tab" width="100%">'+
                               '<tbody><tr class="success bort0">'+
                               '<th>Part</th>'+
                               '<th>Description</th>'+
                               '<th>Unit Price</th>'+
                               '<th>Amount</th>'+
                               '<th>Actions</th>'+
                               '</tr>'+_more_item+'</tbody></table>'+
                               '</div></td></tr>';
                      }else{
                        _more_wrap = '';
                      }

                      _bom_tr +='<tr>'+
                            '<th>'+_check+'</th>'+
                            '<th><span name="opl_parts" class="word-width-100" data-id="'+b+'" value="'+_bomlist[b].query.id+'">'+_bomlist[b].query.designator+'</span></th>'+
                            '<th><b name="opl_mpn" class="js_opl_mpn'+b+'" data-id="'+b+'" value="'+_bomlist[b].query.mpn+'">'+_bomlist[b].query.mpn+'</b></th>'+
                            '<th>'+_more_des+'</th>'+
                            '<th><span>'+_bomlist[b].query.qty+'</span> × <span name="opl_qty" data-id="'+b+'">'+_pcba_qty+'</span></th>'+
                             _bomprice+
                            '</tr>'+_more_wrap;
                    }
                 //表单总计          
               
                   $(".PcbaServicePrice").text(_bomtotal.componentsCost);
                   $(".PcbaAssemblyPrice").text(_bomtotal.assemblyCost);
                   $(".PcbaSetupPrice").text(_bomtotal.setupCost);
                
                    pcbCost=parseFloat($('.PcbServicePrice').text());
                    $('.pcba_price').text(Number(_bomtotal.totalCost+pcbCost).toFixed(2));
                    $('.table-bordered tbody').empty().append(_bom_tr);
                    $('.pcba_cart').after().before(_bom_li);
                    $('.pcba-warning span').empty().append(_noli);
                    
         
     
              }
              if(json.errorcode == 7){
               $('.upload_box_pcba .webuploader-pick').empty().html('<i class="fa fa-cloud-upload"></i>File type is not correct');
               $('.webuploader-pick i').removeClass('fa-spinner');
               $('.upload_box_pcba').removeClass('fbtn_success').addClass('fbtn_error');
               console.log(222);
               }
               else{
                     // $this.creatLoadingState({
                     //      'id':'js-adding',
                     //      'text':'ADDING',
                     //      'bgc':'#09694f'
                     //  });

             
        }
            
       });
    } 
    //pcb文件上传
    function createWebUpload(type, target, list, callback){
     	 var upload_file_api = apiRoot+'index.php?r=bazaar/fusion/default/file-upload';
     	  //文件上传
        if(type == 'file'){ 
        console.log(); 
        var file_uploader = WebUploader.create({
            // 选完文件后，是否自动上传。
            auto: true,
            // swf文件路径
            swf: baseURL+'/js/plugin/webupload/Uploader.swf',
            // 文件接收服务端。
            server: upload_file_api,
            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: target,
            // 只允许选择图片文件。
            multiple: false,
            //上传文件大小
            fileSingleSizeLimit : 5242880,
            //避免重复上传
            duplicate :true
   
           
        });
        // file_uploader.GetData(1024*1024)*10;

         
         //当文件进来时
        file_uploader.on( 'uploadStart', function( file ) {
              var _file_val= file.name;
              console.log(file.name);
  	    var fileExt=(/[.]/.exec(_file_val))?/[^.]+$/.exec(_file_val.toLowerCase()):'';
  	    // $('#attrib-36-0').val().split('.').pop().toLowerCase()
  	    if(fileExt =='rar' || fileExt =='zip'){

            //隐藏save按钮
            // $(list).find('.js-save-att').hide();
            // $('.upload_box').addClass('fbtn_success');
             $('.upload_box .webuploader-pick').html('<i class="fa fa-cloud-upload"></i>'+file.name+'&nbsp;&nbsp;Waiting for upload...');
            console.log('开始是上传文件了');
        }else{
             $('.upload_box .webuploader-pick').html('<i class="fa fa-cloud-upload"></i>'+file.name+'&nbsp;&nbsp;File type is not correct');
	         $('.upload_box').addClass('fbtn_error');
             	return false;  
           
           }
   
        });
  
        //文件上传成功
        file_uploader.on( 'uploadSuccess', function( file, response) {
             console.log('成功上传文件'); 
             // var token='&token='+response.data.files_number;
             // upload_file_pcba=apiRoot+'index.php?r=bazaar/fusion/default/get-bom-price'+token;
             //  console.log(upload_url);
        	 var _file_val= file.name;
  	       var fileExt=(/[.]/.exec(_file_val))?/[^.]+$/.exec(_file_val.toLowerCase()):'';
  	    if(fileExt =='rar' || fileExt =='zip'){
  	    	$('.upload_box .webuploader-pick').html('<i class="fa fa-cloud-upload"></i>'+file.name+'&nbsp;&nbsp;Upload Successful');
            $('.upload_box').addClass('fbtn_success');
            //写入到列表
            // $(list).find('.js-title').attr('data-up-src', response._raw);
            var _pcbfile = $('#PcbAttrib-36').val(response.data.files_number+'_'+response.data.files_name);
            // var _pcbafile= $('#product_pcba').val(response.data.files_number);

  
           }else{
            $('.upload_box .webuploader-pick').html('<i class="fa fa-cloud-upload"></i>'+file.name+'&nbsp;&nbsp;File type is not correct');
	        $('.upload_box').removeClass('fbtn_success');
             	return false;  
           
           }
        
        });

         //文件上传失败
        file_uploader.on( 'uploadError', function( file ) {
        	console.log('上传失败');
        	 var _file_val=file.name;
  	         var fileExt=(/[.]/.exec(_file_val))?/[^.]+$/.exec(_file_val.toLowerCase()):'';
  	         if(fileExt !='rar' || fileExt !='zip'){
             $('.upload_box .webuploader-pick').html('<i class="fa fa-cloud-upload"></i>'+file.name+'&nbsp;&nbsp;Upload Error');
             $('.upload_box').addClass('fbtn_error');
             return false;
         }

        });

     
        //文件上传完成
        file_uploader.on( 'uploadComplete', function( file ) {
//            $( '#'+file.id ).find('.progress').fadeOut();
//            $( '#'+file.id );
            $(list).find('.js-save-att').show();
        });

       }
     }
   //pcba_url路径
    $('body').on('click','.upload_pcba', function(){
            // var _pcba_qty = $('.js-qty').val();
            //     _qty_param = '&pcba_qty='+_pcba_qty;
            //  final_url = bom_upload_url+_qty_param+'&token='+common_token;
             //console.log(final_url)

	  });
   
    //PCBA 文件上传 
   //获取token

  function createWebUpload_t(type,target, list,callback){
			

  	    var param='&token='+common_token; 
        var upload_file_pcba = apiRoot+'index.php?r=bazaar/fusion/default/bom-upload'+param;
        
     	// upload_file_pcba= apiRoot+'index.php?r=bazaar/fusion/default/get-bom-price'+param+per_token;
     	  //文件上传
        if(type == 'file'){ 
        var file_uploadert = WebUploader.create({
            // 选完文件后，是否自动上传。
            auto: true,
            // swf文件路径
            swf: baseURL+'/js/plugin/webupload/Uploader.swf',
            // 文件接收服务端。
            // server: c_all_url,
            server: upload_file_pcba,
            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: target,
            // 只允许选择图片文件。
            multiple: false,
            //避免重复上传
            duplicate :true

        });
          
        
         //当文件进来时fileQueued 
        file_uploadert.on( 'uploadStart', function( file ) {
    
        // console.log(upload_file_pcba);
        var _file_val=file.name;
  	    var fileExt=(/[.]/.exec(_file_val))?/[^.]+$/.exec(_file_val.toLowerCase()):'';
  	    // $('#attrib-36-0').val().split('.').pop().toLowerCase()

  	    if(fileExt =='csv'){
       
            $('.upload_box_pcba .webuploader-pick').html('<i class="fa fa-cloud-upload"></i>'+file.name+'&nbsp;&nbsp;Waiting for upload...');
            console.log('开始是上传文件了');
          }
         else{
         	$('.upload_box_pcba .webuploader-pick').html('<i class="fa fa-cloud-upload"></i>'+file.name+'&nbsp;&nbsp;File type is not correct');
         	$('.upload_box_pcba').removeClass('fbtn_success').addClass('fbtn_error');
         	return false;
         }
        });
         
       
        //文件上传成功
        file_uploadert.on( 'uploadSuccess', function( file, response) {
        
        console.log('上传成功');
        var _file_val=file.name;
  	    var fileExt=(/[.]/.exec(_file_val))?/[^.]+$/.exec(_file_val.toLowerCase()):'';
  	    // $('#attrib-36-0').val().split('.').pop().toLowerCase()
        //请求pcba基本数据
       // console.log(response);
        var _inner=$("table-bordered tbody tr").length;
        if(response.errorcode == 0||response.errorcode == 7){
            $('.js-add-cartpcba').attr('disabled','disabled');
            $('.js-add-cartpcba').addClass('default-button');
           getBomPriceData();

        }
     
  	    if(fileExt =='csv'){		
  	    	$('.upload_box_pcba .webuploader-pick').html('<i class="fa fa-cloud-upload"></i>'+file.name+'&nbsp;&nbsp;Upload Successful'+'<i class="fa fa-spinner fa-spin mr10"></i>');
            $('.upload_box_pcba').removeClass('fbtn_error').addClass('fbtn_success');
            //写入到列表
            $(list).find('.js-title').attr('data-up-src', response._raw);
             // $('.upload_box_pcba')
            // $('.upload_box_pcba').append('<i class="fa fa-spinner fa-pulse"></i>');
            // $('.upload_box_pcba').html('<i class="fa fa-spinner fa-spin mr10"></i>');
		    } 
         
        else{
          $('.upload_box_pcba .webuploader').html('<i class="fa fa-cloud-upload"></i>'+file.name+'&nbsp;&nbsp;File type is not correct');
	        $('.upload_box_pcba').removeClass('fbtn_success').addClass('fbtn_error');
             	return false;  
           
           }

        });
            
        //文件上传失败
        file_uploadert.on( 'uploadError', function( file ) {

        	console.log('上传失败');
        	 var _file_val=file.name;
  	         var fileExt=(/[.]/.exec(_file_val))?/[^.]+$/.exec(_file_val.toLowerCase()):'';
  	         if(fileExt!='rar'||'zip'){
             $('.upload_box_pcba .webuploader').html('<i class="fa fa-cloud-upload"></i>'+file.name+'&nbsp;&nbsp;Upload Error');
             $('.upload_box_pcba').removeClass('fbtn_success').addClass('fbtn_error');
             return false;
         }

        });

    
        //文件上传完成
        file_uploadert.on( 'uploadComplete', function( file ) {
//            $( '#'+file.id ).find('.progress').fadeOut();
//            $( '#'+file.id );
            $(list).find('.js-save-att').show();
        });
       }
     }
 

//点击选中check
$('body').on('click','.js-use',function(){
	// alert($(this).parent().parent().parent());
	
	var _data=$(this).attr('data-id');
  var _opl_amout_pri =$(this).attr('data-amount'); 
	$(this).addClass('hjs-use').parents(".inner-tab").find("span:eq(_data)").removeClass("hjs-use");

	var c_id = $(this).attr('data-cid');
	var token=common_token;
	// var token='1IxYLeI8';
	var mpn=$("b[name='opl_mpn']").eq(_data).attr('value');
	var param='c_id='+c_id+'&token='+token+'&mpn='+mpn;
   
 	// if($("input[type='checkbox']").attr('data-id')==_data){
       // $(this).attr('checked','checked');
      $('input:checkbox').eq(_data).prop("checked",'true');
        
	// }
    
	getmaterialData(param,function(json){
   
    if(json.errorcode==0){
	var _bomtotal = json.data.priceList;
	var _opl_mpn = json.data.component.mpn;
	var _opl_des = json.data.component.description;
	var _opl_qty = json.data.component.waste_qty;
	var _opl_pri = json.data.component.unit_price;
 
     $("b[name='opl_mpn']").eq(_data).empty().append(_opl_mpn);
     $("div[name='opl_des']").eq(_data).empty().append(_opl_des);
     $("th[name='opl_qty']").eq(_data).empty().append(_opl_qty);
     $("th[name='opl_price']").eq(_data).empty().append('$'+_opl_pri);
     $("th[name='opl_amount_price']").eq(_data).empty().append('$'+_opl_amout_pri);
     $("#more_opl_list"+_data).hide();
     console.log(json);


      //表单总计更新
      $(".PcbaServicePrice").text(_bomtotal.componentsCost);
      $(".PcbaAssemblyPrice").text(_bomtotal.assemblyCost);
      $(".PcbaSetupPrice").text(_bomtotal.setupCost);
      var pcbCost=parseFloat($('.PcbServicePrice').text());
     $('.pcba_price').text(Number(_bomtotal.totalCost+pcbCost).toFixed(2));
    }
    else{
     
        $this.creatLoadingState({
                    'id':'js-adding',
                    'text':'ADDING',
                    'bgc':'#09694f'
                });
    
    }
     });
    
}); 

//check
$('body').on('click','._check', function(){

            // var c_id = $(this).attr('data-cid');
            var id = $(this).attr('data-id');
            // var c_id = $("span[name=js-use]").eq(id).attr('data-cid');
            var c_id = $(this).parent().parent().next().find('.js-use').attr('data-cid');
            var token = $(this).attr('data-token');
            var mpn= $(".js_opl_mpn"+id).attr('value');
            var _opl_amount =$(this).parent().parent().next().find(".opl_amount_price").text();

            if($(this).prop('checked')==true){
            var param='c_id='+c_id+'&token='+token+'&mpn='+mpn;
           
                if($(this).parent().parent().next().find('.js-use').length==1){
                    $(this).parent().parent().next().find('.js-use').addClass('hjs-use');
                
                    getmaterialData(param,function(json){
                
                      var _bomtotal = json.data.priceList;
                      var _opl_mpn = json.data.component.mpn;
                      var _opl_des = json.data.component.description;
                      var _opl_qty = json.data.component.waste_qty;
                      var _opl_pri = json.data.component.unit_price;
                       $("b[name='opl_mpn']").eq(id).empty().append(_opl_mpn);
                       $("div[name='opl_des']").eq(id).empty().append(_opl_des);
                       $("th[name='opl_qty']").eq(id).empty().append(_opl_qty);
                       $("th[name='opl_price']").eq(id).empty().append('$'+_opl_pri);
                       $("th[name='opl_amount_price']").eq(id).empty().append('$'+_opl_amount);
                       $("#more_opl_list"+id).hide();
                      });



                }

            }else{
              // var c_id = $("input[name='oplItem']").eq(_data).attr('value','');
              //  console.log("no checked");
              var param='c_id=""&token='+token+'&mpn='+mpn;
            }
            
            getmaterialData(param,function(json){
                var _bomtotal = json.data.priceList; 
                  console.log(json);
                //表单总计更新
                $(".PcbaServicePrice").text(_bomtotal.componentsCost);
                $(".PcbaAssemblyPrice").text(_bomtotal.assemblyCost);
                $(".PcbaSetupPrice").text(_bomtotal.setupCost);
                var pcbCost=parseFloat($('.PcbServicePrice').text());
                $('.pcba_price').text(Number(_bomtotal.totalCost+pcbCost).toFixed(2));
            });
             
            

});


 var globalTimeout = null;
 $('.js-qty').on('keyup',function(event){

            var Objt = $(this);
            if (globalTimeout != null) {
                clearTimeout(globalTimeout);
            }
            globalTimeout = setTimeout(function() {
                globalTimeout = null; 
                numberCheck(Objt);

            }, 1000); 
  }); 

/**
 * 验证有效数字值
 */

function numberCheck(Obj){
    var tmpVal=Obj.val().replace(/\D|^0/g,''); 
    Obj.val(tmpVal);
    tmpVal = parseInt(tmpVal);
    var max = 100,
        min = 2;
 
    //更新价格信息
  
    // $("span[name='opl_qty']").text(tmpVal);   
    var pcbQty = $('#PcbAttrib-113').find("option:selected").text();
    if (tmpVal > parseInt(pcbQty)) {
        Obj.val(pcbQty);
        $(".PcbaAttribPriceVal-125").text(pcbQty);  
       $(".fpcb_error").html('Not enough PCB to be assembled,<a class="fusion_pre">please go back to add more PCB.</a>').show(200);

    }else{
        $(".fpcb_error").hide();
    }
    tmpVal=Obj.val();
    if(tmpVal>0 && tmpVal!="" && !isNaN(tmpVal)){
      $(".PcbaAttribPriceVal-125").text(tmpVal);
           $('.js-add-cartpcba').attr('disabled','disabled');
            $('.js-add-cartpcba').addClass('default-button');
            $('.css_for_warn i').addClass('fa-spinner');
      getBomPriceData();
    }
       if (tmpVal=="" || isNaN(tmpVal)) {
        $(".fpcb_error").html('Not enough PCB to be assembled,<a class="fusion_pre">please go back to add more PCB.</a>').show(200);
    }else{
       $(".fpcb_error").hide();
    }
    if (tmpVal < min) {
        Obj.val(min);
        $(".PcbaAttribPriceVal-125").text(min);
    }
    if(tmpVal> 100){
          Obj.val('100');
          $('.PcbaAttribPriceVal-125').val(100);
          $(".fpcb_error").html('If you need more than 100pcs, please send us your Gerber file, BOM, and requirement for an offline quote').show(200);
        }
    if (tmpVal > max) {
        Obj.val(max);
        $(".PcbaAttribPriceVal-125").text(max);
        $(".fpcb_error").html('If you need more than 100pcs, please send us your Gerber file, BOM, and requirement<a href="mailto:propagate@seeed.cc"> for an offline quote</a>').show(200);
        }
    else{
       $(".fpcb_error").hide();
    }
}

 
 //fusion time
$('body').on('click','.fusion_next',function(){
    //默认数量
    // var pcba_js_qty = $('.js-qty').val();
    // $('.PcbaAttribPriceVal-125').text(pcba_js_qty);  
		//pcb上传判断           
		if($('.upload_box').hasClass('fbtn_success')){
		 
		if(animating) return false;
		animating = true;
		// current_fs = $(this).parent();
		// next_fs = $(this).parent().next();
		current_fs=$('.fusion_fst')
		next_fs=$('.fusin_sec')

		next_fs.show(); 
		//hide the current fieldset with style
		current_fs.animate({opacity: 0}, {
			step: function(now, mx) {
				//as the opacity of current_fs reduces to 0 - stored in "now"
				//1. scale current_fs down to 80%
				scale = 1 - (1 - now) * 0.2;
				//2. bring next_fs from the right(50%)
				top = (now * 50)+"%";
				//3. increase opacity of next_fs to 1 as it moves in
				opacity = 1 - now;
				current_fs.css({'transform': 'scale('+scale+')'});
				next_fs.css({'top': left, 'opacity': opacity});
			}, 
			duration: 50, 
			complete: function(){
				current_fs.hide();
				animating = false;
			}, 
			//this comes from the custom easing plugin
			easing: 'easeInOutElastic'
		});
	  }else{
	  	   $('.webuploader-pick').html('<span class="blink">Please upload the file</span>');
	       $("html,body").stop(true).animate({ scrollTop: 0 }, 400);
	       return false;
	  }
	 
});

$('body').on('click','.fusion_pre',function(){
	     // $('.upload_box_pcba .webuploader-container').
		if(animating) return false;
		animating = true;
		
		// current_fs = $(this).parent();
		// previous_fs = $(this).parent().prev();
		current_fs=$('.fusin_sec')
		previous_fs=$('.fusion_fst')
		
		//de-activate current step on progressbar
		$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
		
		//show the previous fieldset
		previous_fs.show(); 
		//hide the current fieldset with style
		current_fs.animate({opacity: 0}, {
			step: function(now, mx) {
				//as the opacity of current_fs reduces to 0 - stored in "now"
				//1. scale previous_fs from 80% to 100%
				scale = 0.8 + (1 - now) * 0.2;
				//2. take current_fs to the right(50%) - from 0%
				top = ((1-now) * 50)+"%";
				//3. increase opacity of previous_fs to 1 as it moves in
				opacity = 1 - now;
				current_fs.css({'top': left});
				previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
			}, 
			duration: 800, 
			complete: function(){
				current_fs.hide();
				animating = false;
			}, 
			//this comes from the custom easing plugin
			easing: 'easeInOutElastic'
		});
	});
  });
};
