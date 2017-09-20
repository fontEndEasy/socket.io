/**
 * @file order detail.js
 * @description 订单详细信息
 * @author seeed-int 2016-1-5
 */

var getOrderDetail = function() {

    //定义变量
    var order_sn = parseInt(getQuery('sn')),    //产品sn号
        $order_detail = $('#order-detail'),
        order_detail_apiURL = apiRoot+'index.php?r=bazaar/user/user-order/order-detail',
        order_detail_param = 'order_sn='+order_sn,
        order_pay_states    = parseInt(getQuery('paystate'));
    
    
    //console.log(isNaN(order_sn));
    
    //判断状态，如果没有sn号，返回订单首页
    isOnline(function(json){
        //console.log(json);
        if(json.errorcode == 0){
            //login check
            if(!json.data.is_online){
                location.href = 'login.html';
            }else if(isNaN(order_sn)){
                //format check
                location.href = 'my_account.html#order';
            }else{
                //all checked
                doGetOrderDetail();
            }
        }
    });
    
    //doGetOrderDetail();
    
    function doGetOrderDetail(){
    
        //往页面加载打印js插件
        $('body').append('<script src="../js/plugin/jquery.jqprint.js"</script>');

        //加载loading菊花
        $order_detail.creatLoadingState({
            'id':'js-loading',
            'text':'Loading data, just one sec.',
            'bgc':'#fff'
        });

        startAjax(order_detail_apiURL, order_detail_param, function(json){
            //console.log(json);
            if(json.errorcode == 0){
                //读取成功，渲染模板
                setTemplate(json.data);     

                //删除loading
                $('#js-loading').remove();
                $('#order-detail').fadeIn(200);

                //添加事件
                addEvent();
            }
        });

        //渲染页面
        function setTemplate(data) {
            var _detail_info    = '',
                _detail_list    = '',
                _detail_tracking = '',      //物流详细数据
                _detail_total   = '',
                _print          = '',
                order_sn        = data.info.order_sn;
                

            //订单成功提示语
            if(data.info.pay_status){
                //带有成功提示
                if(order_pay_states){
                    $('.js-c-mail').text(data.info.customer_email);
                    $('.order-result').removeClass('hide');
                    _print = 'hide';
                    //$('.btn-print').addClass('hide');
                }
            }
            if (data.info.shipping_info == null) {
                data.info.shipping_info = '';
            }
            _detail_info = 
                '<h1 class="title">ORDER DETAIL</h1>'+
                '<a href="" title="" class="js-print c-9b f12 btn-print underline abs '+_print+'">Print</a>'+
                '<table class="info-card order-info f12 c-9b">'+
                    '<tr class="bg-f6 lh40">'+
                        '<th>Order Number<span class="val pl10">'+data.info.order_sn+'</span></th>'+
                        '<th>Place Date<span class="val pl10">'+data.info.create_time+'</span></th>'+
                    '</tr>'+
                    '<tr>'+
                        '<td><div>DELIVERY ADDRESS</div><div class="val"><p>'+data.info.customer_name+'</p><p>'+data.info.customer_address+' '+data.info.customer_city+' '+data.info.customer_country+'</p><p>Phone '+data.info.customer_telephone+'</p></div></td>'+
                        '<td><div>BILLING ADDRESS</div><div class="val"><p>'+data.info.billing_name+'</p><p>'+data.info.billing_address+'</p><p>Phone '+data.info.billing_phone+'</p></div></td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td><div>SHIPPING MEDTHOD </div><div class="val">'+data.info.shipping_info+'<a href="#" class="js-show-track inline-block ml20 c-9b">Show Track</a></div></td>'+
                        //edit by pc @2016-04-06 
                        '<td><div>ORDER STATUS</div><div class="val">'+data.info.order_status+'</div></td>'
                        //'<td><div>PAYMENT MEDTHOD</div><div class="val">Card Number: *********8655</div></td>'+
                    '</tr>'+
//                    '<tr>'+
                        //'<td><div>ORDER STATUS</div><div class="val">'+data.info.order_status+'</div></td>'+
                        //'<td><div>TRACKING NUMBER</div><a href="" class="f-os-sb c-0d underline">   9200112233445566778899</a></td>'+
//                    '</tr>'+
                    //物流轨迹行
                    /*'<tr>'+
                        '<td><div>ppppp</div></td>'
                    '</tr>'+*/
                '</table>';

            _detail_list += 
                '<table class="comfirm-list w100p mt50">'+
                    '<tr class="f12 c-9b bottom-line"><td>Your Items</td><td>Item</td><td>Unit Price</td><td>Quantity</td></tr>';

            $(data.list).each(function(){
                _detail_list += 
                    '<tr class="detail">'+
                        '<td class="img"><img src="'+$.formatImgURl(this.products_image)+'" alt="'+this.product_name+'" class="img"></td>'+
                        '<td><div class="name">'+this.product_name+'</div><div class="type f12 c-7b">'+this.product_model+'</div></td>'+
                        '<td><span>$'+this.final_price+'</span></td>'+
                        '<td><span>'+this.quantity+'</span></td>'+
                    '</tr>'
            });

            _detail_list += '</table>';
                
//            console.log(data.info.product_total);
//            console.log(data.info.shipping_fee );
            
            
            
            
            //对应的物流信息 start edit by pc @2016-04-06
            var shipping_arr  = data.info.shipping_sn,
                _track_detail_html = '';
            

            //读出所有物流轨迹
            for(var i in shipping_arr){
                if(shipping_arr[i] != ''){
                    //console.log(shipping_arr[i]);  
                    
                       var _track_step_html = '';   //临时存储物流步骤


                    //创建物流追踪html
                    getTrackingData(order_sn, shipping_arr[i], function(json){
//                    $.get('track.json',function(json){
                        //console.log(json);
                        
                        //获取物流轨迹成功
                        if(json.errorcode == 0){
                            var tracking_length = (json.data.details).length;
                            //组织物流步骤
                            $(json.data.details).each(function(e){
                                var _ico = '<div class="step-ico"><i class="fa fa-circle f12"></i><i class="block"></i></div>';
;
                                if(e == tracking_length-1 ){
                                    _ico = '<div class="step-ico"><i class="fa fa-circle f12"></i></div>';
                                }
                                _track_step_html += 
                                    '<li>'+_ico+
                                        '<span class="time">'+this.ftime+'</span><span>'+this.context+'</span>'+
                                    '</li>'
                            });
                            
                            //插入对应的节点
                            _detail_tracking = 
                                '<div class="tracking-detail-box clear">'+
                                    '<div class="clear text bg-f6">'+
                                        '<div class="fr c-9b">TRACKING NUMBER:<span class="ml10 inline-block">'+json.data.nu+'</span></div>'+
                                        '<div class="fl c-9b">SHIPPING METHOD:<span class="ml10 inline-block">UPS</span></div>'+
                                    '</div>'+
                                    '<div class=track-detail><p>Already Sign</p>'+
                                        '<ul class="tracking-step c-9d">'+
                                            _track_step_html+
                                        '</ul>'+
                                    '</div>'+
                                '</div>';
//                            $track_box.append(_track_detail_html);
                            
                            $('.js-tracking-block').append(_detail_tracking);
                            
                        }
                    });
                }
            }
            
//            

            //对应字段
            var _sub_total  = isNaN(data.info.product_total)?'<div class="clear"><span class="fl">Subtotal:</span><span class="fr">$'+parseFloat(data.info.product_total)+'</span></div>':'';
            var _shipping_fee = isNaN(data.info.shipping_fee)?'<div class="clear"><span class="fl">Shipping:</span><span class="fr">$'+parseFloat(data.info.shipping_fee)+'</span></div>':'';
            
            _detail_total = 
                '<div class="clear">'+
                    '<div class="total-price f12 c-7b fr">'+
                        _sub_total+_shipping_fee+
                        /*'<div class="clear"><span class="fl">Discount:</span><span class="fr c-d0">-$2.2</span></div>'+*/
                        '<div class="clear c-4a f-os-b"><span class="fl mr5">Order Total:</span><span class="fr">$'+parseFloat(data.info.order_total).toFixed(2)+'</span></div>'+
                        '</div>'+
                    '</div>';
//                '<a href="" title="" class="underline fr c-9b f12 mt50">Request Exchange/Refund</a>';

            //console.log(_detail_list + _detail_total);

//            $order_detail.detach().append(_detail_info+_detail_list+_detail_total);        
//            $('#account').append($order_detail);
            
            $order_detail.detach().prepend(_detail_info).append(_detail_list+_detail_total);
            $('#account').append($order_detail);
            
            //如果是来查看物详细物流链接，展开
            if(window.location.hash == '#track'){
                $('.js-tracking-block').show();
            }

        }

        //添加事件
        function addEvent(){
            //打印
            $('#account').on('click', '.js-print', function(){
                $('#order-detail').jqprint({
                    debug: true
                });
                return false;
            });
            
            //显示物流信息
            $('#order-detail').on('click', '.js-show-track', function(){
                //$('.js-tracking-block').fadeIn(100);
                var $track_block = $('.js-tracking-block');
                if($track_block.is(':visible')){
                    $track_block.hide();
                }else{
                    $track_block.fadeIn(100);
                }
                
                return false;
            });
        }
    
    }
}