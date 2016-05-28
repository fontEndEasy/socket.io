/**
 * @file mu_account.js
 * @description 个人中心 逻辑js
 * @author seeed-int 2015-12-25
 */



//获取所有地址
function getAllAddress() {
    var get_add_apiURL = apiRoot+'index.php?r=admin/user/user-address/user-address-list',
        get_add_param  = 'source=1&type=1';
    startAjax(get_add_apiURL, get_add_param, function(json){
        //console.log(json);
        //成功
        if(json.errorcode == 0){
            //地址数量
            address_count = json.data.length;   //地址数量

            var _add_book_html = '',            //地址簿str
                _default_add;                   //是否默认
            $(json.data).each(function(){

                _default_add = this.is_default == 1 ? '<span class="default-address">Default shipping address</span>':'<a href="#" class="js-set-def-add underline">SET AS DEFAULT SHIPPING ADDRESS</a>';

                _add_book_html +=
                    '<div class="com-option mb20" data-id="'+this.id+'">'+
                        '<div class="f-os-b ml20">'+
                            '<i class="select-address fa fa-circle-o"></i>'+
                            '<span class="name"><span class="js-fn">'+this.first_name+'</span> <span class="js-ln">'+this.last_name+'</span></span>'+
                    '</div>'+
                    '<div class="pl25 f14">'+
                        '<div class="detail"><span class="js-add">'+this.street+'</span>,<span class="js-city">'+this.city+'</span>,<span class="js-state">'+this.province+'</span></div><div><span class="js-coun">'+this.country+'</span>, <span class="js-code">'+this.postcode+'</span></div>'+
                    '<div class="phone">Phone <span class="js-phone">'+this.phone+'</span></div>'+
                    '</div>'+
                        '<div class="clear act f12 pl25" data-id="'+this.id+'">'+_default_add+
                            /*'<span class="">'+_default_add+'</span>'+*/
                            '<a href="#" class="js-remove-add fr mr10">REMOVE</a>'+
                            '<a href="#" class="js-edit-add fr mr50">EDIT</a>'+
                        '</div><input type="hidden" class="js-company" value="'+this.company+'">'+
                    '</div>';
            });
            /*_add_book_html += '<div class="tc bar f12 mb20"><a href="#" class="mr5 underline js-all-address">SHOW ALL SAVED ADDRESSES</a></div>';*/

            //console.log(_add_book_html);

            //渲染模板
            $('.address-list').hide().empty().append(_add_book_html).show();
            if($('#billing-id')){
                $('#billing-id').find('.billing-list').hide().empty().append(_add_book_html).show();
            }
            //隐藏多处地址
            //hideMoreAddress();

        }
    });
}
        
//添加新地址
function addNewAddress(max_add_number) {
    var address_count;
    $('#aderess-book').createConfirmPot({
        'id':'much-address',
        'class': 'js-single-btn',   //单按钮控制类
        'title': 'Your address book is full. Please delete an unneeded address before saving a new one',
        'confirm': false,
    });

    var _add_address_pot = '<section class="potlayer" id="add-new-address"><div class="potlayer__body address-box css-new-potlayer rel "><a href="" class="btn-close-potlayer"><i class="fa fa-close"></i></a><div class="content pt50 css-new-content"><h1 class="f20 f-dp-m">ADD ADDRESS</h1><div class="com-group-input fl mr30"><div class="label f12"><i class="c-d0 mr5">*</i>First Name</div><input type="text" class="input js-fn css-new-input"></div><div class="com-group-input fl"><div class="label f12"><i class="c-d0 mr5">*</i>Last Name</div><input type="text" class="input js-ln css-new-input"></div><div class="com-group-input fl"><div class="label f12">Company(Optional)</div><input type="text" class="input js-com css-new-input css-cpm-input"></div><div class="com-group-input"><div class="label f12"><i class="c-d0 mr5">*</i>Street Address</div><input type="text" class="input lg-input js-add css-new-input"></div><div class="com-group-input mr30"><div class="label f12"><i class="c-d0 mr5">*</i>Country</div><select name="" id="" class="js-coun select input com-select css-new-input"></select></div><div class="com-group-input mr30 js-state-box"><div class="label f12"><i class="c-d0 mr5">*</i>State/Province</div><input type="text" class="input  sm-input js-state css-new-input"></div><div class="com-group-input"><div class="label f12"><i class="c-d0 mr5">*</i>City</div><input type="text" class="input sm-input js-city css-new-input"></div><div class="com-group-input mr30"><div class="label f12"><i class="c-d0 mr5">*</i>Postcode</div><input type="text" class="input js-code css-new-input"></div><div class="com-group-input"><div class="label f12"><i class="c-d0 mr5">*</i>Phone</div><input type="text" class="input js-phone css-new-input"></div><a href="" title="" class="fr btn-confirm mt40 js-save-new-add js-save-add">SAVE</a></div></div></section>';
    $('body').append(_add_address_pot);
    getAreaOption('#add-new-address');
    $('.js-new-add').on('click', function(){
        
        address_count = $('.address-list').find('.com-option').length;
        //超过一定数量提示
        //console.log('地址长度是：'+address_count+' '+'最大地址长度是：'+max_add_number)
        if(address_count+1 > max_add_number) {
            openPotLayer('#much-address');
            return false;
        }
        //打开窗口
        openPotLayer('#add-new-address', '.btn-close-potlayer');
        return false;
    });
    
    //委托
    $('body').on('click', '.js-save-new-add', function(){
        
        var $this = $(this),
            $parent = $this.parent().parent().parent();

        $parent.find('.input').blur();

        if($parent.find('.warning').length) {
            return false;
        }

        $this.creatLoadingState({
            'id':'js-adding',
            'text': 'ADDING ADDRESS',
            'bgc': '#09694f',
            'removeclass':'js-save-new-add'
        });
        
        saveAddressToService('#add-new-address', function(json){
            if(json.errorcode == 0) {
                $('#js-adding').remove();
                $this.show();
                $('.btn-close-potlayer').trigger('click');
                //保存到现有的最顶端显示
                getAllAddress();
            }
            if(json.errorcode == 3){
                alert('添加失败');
            }
        });
        return false;
    });
}

//删除地址
function removeAddress() {

    var add_id;     //要删除的地址id

    $('body').createConfirmPot({
        'id': 'confirm-remove-add',
        'title': 'Removing this Address？'
    });

 
    //调用删除确定框
    $('body').on('click', '.js-remove-add', function(){
        var $this   = $(this),
            $parent = $this.parent().parent();

        add_id  = $this.parent().attr('data-id');

        openPotLayer('#confirm-remove-add');

        //确定删除
        $('#confirm-remove-add').one('click', '.js-com', function(){
            var apiURL  = apiRoot+'index.php?r=admin/user/user-address/delete-user-address',
                param   = 'source=1&address_id='+add_id;
            //console.log(param);
            startAjax(apiURL, param, function(json){
                //console.log(json)
                if(json.errorcode == 0){
                    $('#confirm-remove-add').hide();
                    $parent.slideUp(200);
                    $parent.delay(210).remove();
                    $('html').removeClass('ofh');
                }
            });
            return false;
        });

        //取消删除
        $('#confirm-remove-add').on('click', '.js-cancel', function(){
            $('#confirm-remove-add').hide();
            return false;   
        })

        return false;
    });
}

//编辑地址
function editAddress() {
    var add_id;     //要编辑的地址id
    
    //弹出修改窗口
    $('body').on('click', '.js-edit-add', function(){
        
        var $this   = $(this),
            $parent = $this.parent().parent(),
            $edit_add = $('#edit-address');

        add_id  = $this.parent().attr('data-id');   //拿到id
        
        var first_name  = $parent.find('.js-fn').text(),       
            last_name   = $parent.find('.js-ln').text(),
            company     = $parent.find('.js-company').val(),
            country     = $parent.find('.js-coun').text(),
            province    = $parent.find('.js-state').text(),
            city        = $parent.find('.js-city').text(),
            street      = $parent.find('.js-add').text(),
            postcode    = $parent.find('.js-code').text(),
            phone       = $parent.find('.js-phone').text();
            
            //console.log('公司是：'+company)
        
        //console.log(first_name+'-'+last_name+'-'+country+'-'+province+'-'+city+'-'+street+'-'+postcode+'-'+phone);

        if($edit_add.length) { $edit_add.remove();}

        var _edit_add_html = 
            '<section class="potlayer" id="edit-address">'+
                '<div class="potlayer__body address-box rel css-new-potlayer">'+
                    '<a href="" class="btn-close-potlayer"><i class="fa fa-close"></i></a>'+
                    '<div class="content pt50 ">'+
                    '<h1 class="f20 f-dp-m">EDIT ADDRESS</h1>'+
                    '<div class="com-group-input fl mr30">'+
                    '<div class="label f12">First Name</div><input type="text" class="input js-fn" value="'+first_name+'"></div>'+
                    '<div class="com-group-input fl"><div class="label f12">Last Name</div><input type="text" class="input js-ln" value="'+last_name+'"></div>'+
                    '<div class="com-group-input fl"><div class="label f12">Company(Optional)</div><input type="text" class="input js-com" value="'+company+'"></div>'+
                    '<div class="com-group-input"><div class="label f12">Street Address</div><input type="text" class="input lg-input js-add" value="'+street+'"></div>'+
                    '<div class="com-group-input mr30"><div class="label f12"><i class="c-d0 mr5">*</i>Country</div><select name="" id="" class="js-coun select input com-select""></select></div>'+
                    '<div class="com-group-input mr30 js-state-box"><div class="label f12"><i class="c-d0 mr5">*</i>State/Province</div><input type="text" class="input  sm-input js-state" value="'+province+'"></div>'+
                    '<div class="com-group-input"><div class="label f12">City</div><input type="text" class="input sm-input js-city" value="'+city+'"></div>'+
                    '<div class="com-group-input mr30"><div class="label f12">Postcode</div><input type="text" class="input js-code" value="'+postcode+'"></div>'+
                    '<div class="com-group-input"><div class="label f12">Phone</div><input type="text" class="input js-phone" value="'+phone+'"></div>'+
                    '<a href="" title="" class="fr btn-confirm mt40 js-save-edit-add">SAVE</a></div></div></section>';

        $('#aderess-book').append(_edit_add_html);
        getAreaOption('#edit-address',function(){
            //更新为用户所选地址
            $('#edit-address .js-coun').find('option').each(function(){
                var $this = $(this);
                if($this.text() == country){
                    $this.attr('selected', 'selected');
                    //return false;
                }
            });
        });
        openPotLayer('#edit-address', '.btn-close-potlayer');
        
        //添加地址表单验证
        $.checkNotNull('blur','#edit-address .js-fn');
        $.checkNotNull('blur','#edit-address .js-ln');
        $.checkNotNull('blur','#edit-address .js-add');
        $.checkNotNull('blur','#edit-address .js-city');
//        $.checkNotNull('blur','#edit-address .js-code');
        $.checkNotNull('blur','#edit-address .js-state');
        $.checkNotNull('blur','#edit-address .js-phone');
//        $('#edit-address .js-code, #edit-address .js-phone').on('keyup', function(){
        $('#edit-address .js-phone').on('keyup', function(){
            $.onlyNumber(this);
        });
        
        return false;
    });

    //保存修改，委托aderess-book添加事件
    $('#aderess-book').on('click', '.js-save-edit-add', function(){
        
        var $this       = $(this),
            $parent     = $this.parent().parent(),
            $pot        = $('#edit-address'),
            first_name  = $pot.find('.js-fn').val(),       
            last_name   = $pot.find('.js-ln').val(),
            company     = $pot.find('.js-com').val(),
            country     = $pot.find('.js-coun').val(),
            province    = $pot.find('.js-state').val(),
            city        = $pot.find('.js-city').val(),
            street      = $pot.find('.js-add').val(),
            postcode    = $pot.find('.js-code').val(),
            phone       = $pot.find('.js-phone').val(),
            apiURL      = apiRoot + 'index.php?r=admin/user/user-address/edit-user-address',
            param       = 'source=1&address_id='+add_id+'&first_name='+first_name+'&last_name='+last_name+
                            '&company='+company+'&country='+country+'&province='+province+
                            '&city='+city+'&street='+street+'&postcode='+postcode+'&phone='+phone;
        
        //验证是否有没填项
        $parent.find('.input').blur();
        if($parent.find('.warning').length){ return false;}
        
        $this.creatLoadingState({
            'id':'js-editing',
            'text': 'EDITING ADDRESS',
            'bgc': '#09694f',
            'removeclass':'js-save-edit-add'
        });
        
        startAjax(apiURL, param, function(json){
            //console.log(json);
            $('#js-editing').remove();
            $this.show();
            if(json.errorcode == 0){
                //修改成功
                //$('#edit-address').find('.btn-close-potlayer').click();
                $('#edit-address').fadeOut();
                setTimeout(function(){
                    $('#edit-address').remove();
                },2000);
                $('html').removeClass('ofh');
                getAllAddress();
            }
        })

        return false;
    });

}

//设置默认地址
function setDetaultAddress(){

    var add_id;     //地址id
    //设置默认地址弹出框
    $('#aderess-book').createConfirmPot({
        'id':'set-detault-add',
        'title':'Confirm set to the default address?',
    });
    //设置默认地址按钮事件
    $('#aderess-book').on('click', '.js-set-def-add', function(){
        add_id  = $(this).parent().attr('data-id');     //获取地址的id
        openPotLayer('#set-detault-add');
        return false;
    });
    //确定设置地址事件
    $('#set-detault-add').on('click', '.js-com', function(){
        apiURL  = apiRoot+'index.php?r=admin/user/user-address/default-user-address',
        param   = 'source=1&address_id='+add_id;
        startAjax(apiURL, param, function(json){
            if(json.errorcode == 0){
                $('.address-list').hide().empty();
                getAllAddress();
                $('.js-confrim-cancel').trigger('click');
            }
        });
  
    });
    /*//取消设置默认地址
    $('#set-detault-add').on('click', '.js-cancel', function(){
        $('#set-detault-add').hide(); 
        $('html').removeClass('ofh');
        return;
    });*/
}

function payWay(order_total, order_sn){
                
    var _pay_way = '<section class="potlayer" id="pay-way"><div class="potlayer__confirm tc clear" style="overflow:visible;"><a href="" class="btn-close-potlayer" style="right: -15px;top: -15px;"><i class="fa fa-close"></i></a><div><div class="title c-10">Choose the Payment.</div><a href=' + baseURL + '/view/pay_page.html?total=' + order_total + '&scount=' + order_sn + ' class="btn btn-default mr20 js-pay-fild fl pay_way_click" target="_blank"><i class="fa fa-credit-card mr5"></i>Credit Card</a><a href="' + baseURL + '/api/index.php?r=bazaar/payment/paypal/index&order_sn='+order_sn+'" class="btn btn-default fr pay_way_click" target="_blank"><i class="fa fa-paypal mr5"></i>Paypal</a></div></div></section>';
    $('body').append(_pay_way);
                
    openPotLayer('#pay-way');
    
    // 关闭弹框 打开确认是否支付成功代码
    $('.pay_way_click').click(function(){
        $('.potlayer').hide();
        $('body').append('<section class="potlayer" id="confirm-pay-result"><div class="potlayer__confirm tc clear"><div class="title c-10">Payment Success?</div><a href="my_account.html?paystate=0" class="btn btn-default mr20 js-pay-fild fl" target="_self">FAIL</a><a href="order_detail.html?paystate=1&sn=' + order_sn + '" class="btn btn-confirm js-pay-done fr" target="_self">SUCCESS</a></div></section>');
        $('#confirm-pay-result').show();
        
    });
    
    $('.js-pay-done').click(function(){
                            
        // 添加Facebook代码开始
        fbq('init', '1080959988628815');
        fbq('track', 'Purchase', {
            'content_ids': order_sn,
            'value': order_total,
            'product_catalog_id': '938382529614001',
            'content_type': 'product',
            'currency': 'USD'
        }); 
        // 添加Facebook代码结束
                            
    });
    
}

//个人中心主要逻辑
var myAccount = function() {
    
    
    isOnline(function(json){
        //console.log(json);
        if(json.errorcode == 0){
            //不在线，跳转至登录页面
            if(!json.data.is_online){
                location.href = 'login.html';
            }else{
                //在线，执行操作
                $('body').removeClass('hide');
                doAccountLogic();
            }
        }
    });
    
    function doAccountLogic(){  

        //定义变量
        var u_id = 1,           //用户id
            module,             //对应功能模块
            _contury_html = ''; //国家字段

        //点击事件
        switchBlock();

        //按顺序加载
        $.when(getOrder()).then(function(){
            getAddress();
            getPersonal();
            getPayment();
        });


        //URL hash路由取值
        if(window.location.hash){
            module = window.location.hash;
            //console.log('现在的module是：'+module);
            //默认订单
            if(!module) { 
                module = '#order';
            };
        }
        //URL hash 模拟操作
        switch(module){
            case '#order':
                $('.js-order').trigger('click');
                break;
            case '#address':
                $('.js-address').trigger('click');
                break;
            case '#payment':
                $('.js-payment').trigger('click');
                break;
            case '#personal':
                $('.js-personal').trigger('click');
                break;
        }

        /*切换选项*/
        function switchBlock() {
            $('.account-nav').find('li').on('click', function(){
                var $this = $(this),
                    index = $this.index();
                $this.addClass('selected').siblings('.account-nav li').removeClass('selected');
                if(index != 4) {
                    $('.account-block').eq(index).fadeIn(200).siblings('.account-block').hide();
                }
                
                //如果点击的是个人资料，重置显示，因为屏蔽付款方式，所以是index是2
                if(index == 2){
                    $('.show-detail').fadeIn(200);
                    $('.edit-detail').hide();
                }
                
                return false;
            });
        }

        
        /*获取我的订单数据*/
        function getOrderData(page_size, callback){
            //取出所有订单
            var order_apiURL = apiRoot+'index.php?r=admin/user/user-order/order-list',     //订单请求api
                order_param = 'pageSize='+page_size;
            startAjax(order_apiURL, order_param, function(json){
                callback(json);
            });
        }
        
        
        /*
         * 我的订单
         */
        function getOrder() {
            
            //取出所有订单
            var /*page_size = 100,                                                                  //每次获取条数
                order_apiURL = apiRoot+'index.php?r=admin/user/user-order/order-list',     //订单请求api
                order_param = 'pageSize='+page_size,                                            //订单*/
                order_detail_apiURL = apiRoot+'index.php?r=bazaar/user/user-order/order-detail',
                order_detail_param,                                                             //订单详细内容参数
                _order_list_html = '';                                                          //订单列表字段



            /*startAjax(order_apiURL, order_param, function(json){
                console.log('开始加载我的订单');
                console.log(json);
                if(json.errorcode == 0){
                    //设置模板
                    setTemplate(json.data);
                }
            });*/
            
            getOrderData(100,function(json){
                if(json.errorcode == 0){
                    //设置模板
                    setTemplate(json.data);
                    //console.log(json);
                }
            });

            //在#history-order上委托事件
            addEvent();

//            console.log('get order done');
            
            //填充订单模板
            function setTemplate(data){
                
//                console.log(data);
                
                //遍历填充模板
                $(data).each(function(e){
                    
                    var _child_order_html = '',
                        _child_order_text = '',
                        _payment_html     = '',
                        _order_state      = '<div class="item ship-state fr c-10 f-os-sb">'+this.order_status+'</div>',
                        has_child_order_state = 'js-no-child-order',    //是否有子订单状态标示，默认没有
                        _child_order_pay_btn = '',
                        _order_pay_status     = '';
                    
//                    var _child_order_html = '<div class="child_order_box">';
                    
                    //console.log(_order_state);
                    
                    //判断该订单是否有拆单
                    //判断是否为拆单
                    if(this.childOrder.length != 0){
                        
                        _order_state = '';
                        
                        has_child_order_state = '';     //有子订单，去掉标示
                        
                        var child_order_arr = [];     //子产品订单数组
                        
                        //检查子订单的付款状态
                        //console.log('订单的付款状态是：'+this.pay_status);
                        if(this.pay_status == 0){
                            _child_order_pay_btn = '<a href="javascript:payWay('+ this.order_total + ', ' + this.order_sn + ');" class="order-pay js-pay-again btn-confirm order-pay-small" title="" target="_blank">PAY</a>';
                        }
                        
                        
                        //拆单提示文本
                        _child_order_text = '<div class="fl child-order-text">Because some items in your order in different warehouses, so we had to split the order.</div>';
                        
                        _child_order_html = '<div class="child-order-box">';
                        
                        //有拆单，处理拆单数据
                        $(this.childOrder).each(function(e){
                            var _this_order_detial = '';
                            
                            //组织子订单数据
                            $(this.orderProduct).each(function(){
                                
                                //组织fusion订单
                                
                                //处理fusion订单
                                var is_fusion           = this.orderProductAttr.length,
                                    _fusion_html        = '',       //fusion订单字符串
                                    _fusion_bom_html    = '';
                                //判断是否fusion订单，加载订单列表 edit by pc@2015-05-11
                                if(is_fusion){
                                    _fusion_html = '<ul class="order-fusion-list mt10">';
                                    $(this.orderProductAttr).each(function(){
                                        _fusion_html += '<li>'+this.attr_name+' - '+this.attr_value+'</li>'
                                    });
                                    _fusion_html += '</ul>';
                                    
                                    if(this.orderProductBom.length){
                                        console.log('bom订单');
                                        _fusion_bom_html = 
                                            '<div class="pcb-bom rel j-bom">'+
                                               '<a href="javascript:void(0);" class="f14">Components <i class="fa fa-angle-down ml5"></i></a>'+
                                                '<table class="bom-list f12 j-bom-list">'+
                                                    '<tr>'+
                                                        '<th style="width:40%;">MPN</th>'+
                                                        '<th style="width:10%;">Parts</th>'+
                                                        '<th style="width:20%;">Until Price</th>'+
                                                        '<th style="width:20%;">Handing Fee</th>'+
                                                        '<th>Qty</th>'+
                                                    '</tr>';
                                        $(this.orderProductBom).each(function(){
                                            _fusion_bom_html += 
                                                '<tr>'+
                                                    '<td>'+this.mpn+'</td>'+
                                                    '<td>'+this.designator+'</td>'+
                                                    '<td>'+this.unit_price+'</td>'+
                                                    '<td>'+this.assembly_price+'</td>'+
                                                    '<td>'+this.qty+'</td>'+
                                                '</tr>';

                                        });

                                        _fusion_bom_html += '</table></div>';
                                    }

                                   }
                        //edit by peishan 2016-05-20  
                             if(this.order_product_status ==0){  
                                    var _order_upload ='';                         
                                        _order_upload = $('.re_upload_box').html();
                                    }else{
                                        _order_upload ='';
                                    }   
                        
                        _this_order_detial +=  
                            '<tr class="item bottom-line">'+
                                '<td class="img"><img src="'+$.formatImgURl(this.products_image)+'" alt=""></td>'+
//                                        '<td class="img"><img src="'+this.products_image+'" alt=""></td>'+
                                '<td class="name"><div class="f14 c-10 lh16 text"><a href="item_detail.html?p_id='+this.product_id+'" title="'+this.product_name+'" target="_blank">'+this.product_name+'</a></div>'+_fusion_html+_fusion_bom_html+'</td>'+
                                '<td class="qty"><span class="f-os-sb c-10 ml40">'+this.quantity+'</span></td>'+
                                '<td class="total">$'+$.formatFloatTo2(this.final_price)+'</td>'+
                                '<td class="re_upload" data-id="'+this.id+'">'+_order_upload+
                                '<input type="hidden" class="child-order-num" data-id="'+this.id+'" value=" " /></td>'+
                            '</tr>';

                        
                      
                    });
                    
                            //将子订单数据赋值
                            child_order_arr[e] = _this_order_detial;
                            
                            //console.log(child_order_arr[e]);

                            //<div class="ship-state fr c-10 f-os-sb">'+this.order_status+'</div>
                            _child_order_html += 
                                '<div class="order-info clear rel"><div class=item>Sub Order<a href=order_detail.html?sn='+this.order_sn+' title="" class="underline val">'+this.order_sn+'</a></div><div class=item>Order Date<span class=val>'+this.create_time+'</span></div><div class=item>Total<span class=val>'+$.formatFloatTo2(this.order_total)+'</span></div><div class="item ship-state fr c-10 f-os-sb">'+this.order_status+'</div></div>'+
                                '<div class="child-order-detail clear"><table class="order-table fl css-new-order">'+child_order_arr[e]+'</table>'+
                                //屏蔽track按钮
//                                '<div class="fr mr20"><div class="rel js-track"><a class="order-state btn-confirm" title="">TRACK</a><div class="js-track-box track-box-list"></div></div></div>'+
                                '</div>';
                        });
                        
                        _child_order_html += '</div>';
                        //console.log(_child_order_html);
                    }
                    
                    //设置运输方式字段
                    
                    
                    //如果状态是拆单并且付款完，显示已经完成
                    if(this.order_status == 'Split'){
                        _order_pay_status = '<div class="item">Order status <span class="val">Split</span></div>';
                    }
                    
                    //edit by pc @2016-05-15 如果订单是取消状态，则不现实pay按钮
                    if(this.order_status == 'Canceled'){
                        _child_order_pay_btn = '';
                    }
                    
//                    console.log(this.order_status);
                    
                    //设置付款方式字段
                    if(this.pay_id == 1) { _payment_html = 'PayPal';}
                    if(this.pay_id == 2) { _payment_html = 'Credit Card';}
                    
                    //设置运单号
                    var _shipping_sn_count = '';
                    $(this.shipping_sn).each(function(){
                        _shipping_sn_count += this+',';
                    });
                    //console.log(_shipping_sn_count);
                    //console.log(_child_order_pay_btn);
                    
                    
                    console.log(this.order_status);
                    
                    
                    

                    _order_list_html += 
                        '<div class="order-item '+has_child_order_state+'" data-order-sn="'+this.order_sn+'"  data-order-total="'+ this.order_total +'"   data-shipping-sn="'+_shipping_sn_count+'">'+
                        '<div class="order-info clear rel">'+
                        '<div class="item">Order<a href="order_detail.html?sn='+this.order_sn+'" title="" class="underline val">'+this.order_sn+'</a></div>'+
                        '<div class="item">Order Date<span class="val">'+this.create_time+'</span></div>'+
                        '<div class="item">Total<span class="val">$'+$.formatFloatTo2(this.order_total)+'</span></div>'+_order_pay_status+
//                        '<div class="item">Payment#<span class="val">'+_payment_html+'</span></div>'+
                        _order_state+
                        _child_order_pay_btn+
                        _child_order_text+
                        //运单状态
//                        '<div class="js-toggle fr btn-toggle"><i class="fa fa-angle-down"></i></div>'+
                        '</div>'+_child_order_html+
                        '</div>';
                    
                    
                });
                //console.log(_order_list_html);
                //插入文档
                var $order_list = $('.order-list'),
                    $order_his  = $('#order-history');
                $order_list.detach().append(_order_list_html);
                $order_his.append($order_list);

                //批量获取订单详情
                $('.js-no-child-order').each(function(e){
                    getOrderDetail($(this));
                });
            }

            //获取订单的详细内容
            function getOrderDetail(obj){    
                var $this       = obj,
                    order_sn    = $this.attr('data-order-sn'),
                    order_total = $this.attr('data-order-total'),  // 订单总金额
            
                    _btn_pay    = '';
                order_detail_param  = 'order_sn='+order_sn;
                var _order_detail_html = '<div class="order-box clear"><table class="order-table fl f12 css-new-order">';
                startAjax(order_detail_apiURL, order_detail_param, function(json){
//                    console.log(json);
                    //console.log(json.data.info.pay_status);
                    //判断订单是否支付
                    
                    if(!json.data.info.pay_status){
                        //处理订单未支付情况
                        //console.log('未支付');
//                        _bt÷n_pay = '<a href="'+baseURL+'/api/index.php?r=bazaar/payment/paypal/index&order_sn='+order_sn+'" class="order-pay js-pay-again btn-confirm" title="" target="_blank">PAY</a></div>';
                        _btn_pay = '<a href="javascript:payWay('+ order_total + ', ' + order_sn + ');" class="order-pay js-pay-again btn-confirm" title="" target="_blank" style="margin-right:22px;">PAY</a></div>';

                        $this.find('.ship-state').addClass('c-d0');
                    }
                    
                    if(json.errorcode == 0){
                        //成功请求
                        $(json.data.list).each(function(){
                            
                            //处理fusion订单
                            var is_fusion           = this.orderProductAttr.length,
                                _fusion_html        = '',       //fusion订单字符串
                                _fusion_bom_html    = '';
                            
                            //判断是否fusion订单，加载订单列表 edit by pc@2015-05-11
                            if(is_fusion){
                                _fusion_html = '<ul class="order-fusion-list mt10">';
                                $(this.orderProductAttr).each(function(){
                                    _fusion_html += '<li>'+this.attr_name+' - '+this.attr_value+'</li>'
                                });
                                _fusion_html += '</ul>';
                                
                                if(this.orderProductBom.length){
                                    console.log('bom订单');
                                    _fusion_bom_html = 
                                        '<div class="pcb-bom rel j-bom">'+
                                           '<a href="javascript:void(0);" class="f14">Components <i class="fa fa-angle-down ml5"></i></a>'+
                                            '<table class="bom-list f12 j-bom-list">'+
                                                '<tr>'+
                                                    '<th style="width:40%;">MPN</th>'+
                                                    '<th style="width:10%;">Parts</th>'+
                                                    '<th style="width:20%;">Until Price</th>'+
                                                    '<th style="width:20%;">Handing Fee</th>'+
                                                    '<th>Qty</th>'+
                                                '</tr>';
                                    $(this.orderProductBom).each(function(){
                                        _fusion_bom_html += 
                                            '<tr>'+
                                                '<td>'+this.mpn+'</td>'+
                                                '<td>'+this.designator+'</td>'+
                                                '<td>'+this.unit_price+'</td>'+
                                                '<td>'+this.assembly_price+'</td>'+
                                                '<td>'+this.qty+'</td>'+
                                            '</tr>';
                                    });

                                    _fusion_bom_html += '</table></div>';
                                }
                                  
                                                
                                
                            }
                               if(this.order_product_status ==0){  
                                    var _order_upload ='';                         
                                        _order_upload = $('.re_upload_box').html();
                                    }else{
                                        _order_upload ='';
                                    }  
                            
                            _order_detail_html += 
                                '<tr class="item bottom-line">'+
                                    '<td class="img"><img src="'+$.formatImgURl(this.products_image)+'" alt=""></td>'+
//                                    '<td class="img"><img src="'+this.products_image+'" alt=""></td>'+
                                    '<td class="name"><div class="f14 c-10 lh16 text"><a href="item_detail.html?p_id='+this.product_id+'" title="'+this.product_name+'" target="_blank">'+this.product_name+'</a></div>'+_fusion_html+_fusion_bom_html+'</td>'+
                                    '<td class="qty"><span class="f-os-sb c-10 ml40">'+this.quantity+'</span></td>'+
                                    '<td class="total">$'+$.formatFloatTo2(this.final_price)+'</td>'+
                                    '<td class="re_upload" data-id="'+this.id+'">'+_order_upload+
                                    '<input type="hidden" class="child-order-num" data-id="'+this.id+'" value=" " /></td>'+
                                '</tr>';
                        });
                        //打开track
                       // _order_detail_html += '<div class="fr"><div class="rel js-track"><a class="order-state btn-confirm" title="">TRACK</a><div class="js-track-box track-box-list"></div></div>'+_btn_pay+'</div></div>';
                        // 屏蔽track按钮
                        _order_detail_html += '<div class="fr">'+_btn_pay+'</div></div>';
                        $this.append(_order_detail_html);
                        $('.j-bom').hover(function(){
                            $(this).find('.j-bom-list').fadeIn(100);
                        }, function(){
                            $(this).find('.j-bom-list').fadeOut(100);

                        });
                        
                        
                        //获取该订单物流轨迹详情
                        createTrackingDetail($this);
                        
                        //订单为取消状态时，不出现pay和track
                        if(json.data.info.order_status == 'Canceled') {
                            $this.find('.js-track').remove();
                            $this.find('.js-pay-again').remove();
                        }
                        
                    }
                });
            }
            

            function addEvent() {
                //订单展开收缩事件
                $('#order-history').on('click', '.js-toggle', function(){
                    var $this   = $(this),
                        $parent = $this.parent().parent(),
                        $list   = $parent.find('.order-box');

                    if($list.is(':visible')){
                        $this.find('.fa').removeClass('fa-angle-up').addClass('fa-angle-down');
                        $list.slideUp(200);
                    }else {
                        $this.find('.fa').removeClass('fa-angle-down').addClass('fa-angle-up');
                        $list.slideDown(200);
                    }
                });
                
                //hover物流轨迹
                $('.order-list').on('mouseover mouseout', '.js-track', function(event){
                    var $track_list = $(this).find('.js-track-box');
                    if(event.type == 'mouseover'){
                        $track_list.show();
                    }
                    if(event.type == 'mouseout'){
                        $track_list.hide();
                    }
                });
            }
            
            //创建物流轨迹html
            //@param {jQuery obj} target
            function createTrackingDetail(target){
                var $this = target,
                    $track_box = $this.find('.js-track-box'),
                    order_sn = $this.attr('data-order-sn'),
                    shipping_sn = $this.attr('data-shipping-sn');

                    var shipping_arr = shipping_sn.split(',');
//                    console.log(shipping_arr);

                    //读出所有物流轨迹
                    for(var i in shipping_arr){
                        if(shipping_arr[i] != ''){
//                            console.log(shipping_arr[i]);  
                            var _track_detail_html = '';
                            
                            //创建物流追踪html
                            getTrackingData(order_sn, shipping_arr[i], function(json){
//                            $.get('track.json',function(json){
                                console.log('物流数据是：');
                                console.log(json);
                                
                                //获取物流轨迹成功
                                if(json.errorcode == 0){
                                    //插入对应的节点
                                    _track_detail_html = 
                                        '<div class="track-box f14 clear">'+
                                            '<div class="clear pl20 pr20"><div class=fl>Tracking Number:<span>'+json.data.nu+'</span></div><div class=fr>Shipping method:<span>UPS</span></div></div>'+
                                            '<div class=track-detail><p>'+json.data.details[0].ftime+'</p><p>'+json.data.details[0].context+'</p></div>'+
                                            '<a href="order_detail.html?sn='+order_sn+'#track" class="fr mr20">View all</a>'+
                                        '</div>';
                                    
                                    $track_box.append(_track_detail_html);
                                }
                            });
                        }
                    }
            }
        }

        /*
         *地址簿
         */
        function getAddress () {

            //总共多少个地址
            var address_count,      //地址数量
                max_add_number = 10; //最多保存地址个数

            getAllAddress();
            addNewAddress(max_add_number);
            removeAddress();
            editAddress();
            setDetaultAddress();

            //隐藏多出地址
            function hideMoreAddress(){
                var $add_list   = $('.address-list');

                if(address_count >5){
                    $('.js-all-address').show();
                }
            }

            console.log('get address done');
        }

        /*
         *信用卡信息
         */
        function getPayment() {

            var $payment = $('#payment-method'),
                card_id,                            //卡的id
                $card_row;                          //卡对象

            $payment.createConfirmPot({
                'id':'remove-payment',
                'title':'Removing this Payment Card?'
            });
            $('#remove-payment').on('click', '.js-com',function(){
                var apiURL  = apiRoot+'',
                    param   = '';
                //startAjax();
                //console.log(card_id);
                $card_row.remove();
                return false;
            });

            //删除信用卡
            $payment.on('click', '.js-remove-card', function(){
                var $this   = $(this),
                    $card_row = $this.parent().parent();
                //card_id = $this.attr('data-id');
                openPotLayer('#remove-payment');
                return false;
            });
        }

        /*
         *个人资料
         */
        function getPersonal() {

            //修改按钮
            var $personal    = $('#personal-detail'),
                $show_detail = $('.show-detail'),
                $edit_detail = $('.edit-detail'),
                $new_mail,
                $re_new_mail,
                $old_mail,
                personal_apiURL     = apiRoot+'index.php?r=admin/user/users/user-message',
                editpersonal_apiURL = apiRoot+'index.php?r=admin/user/users/modify-attr',
                param = 'source=1',
                //定义用到变量
                new_email,          //新邮箱
                re_new_email,       //确认新邮箱
                is_change_mail = 0;

            updatePassword(); 
    
            addUserInfo();
            
            //加载现有数据
            function addUserInfo(){
                startAjax(personal_apiURL, param, function(json){
                    //console.log(json);
                    //请求成功
                    if(json.errorcode == 0){
                        var _detail_html = 
                            '<p><span class="tag">First Name</span>'+json.data.firstname+'</p>'+
                            '<p><span class="tag">Last Name</span>'+json.data.lastname+'</p>'+
                            '<p><span class="tag">Email Address</span>'+json.data.email+'</p>';

                        $('.detail-info').empty().append(_detail_html);

                        //$show_detail.hide().prepend(_detail_html).show();
                        $edit_detail.find('.js-fn').val(json.data.firstname);
                        $edit_detail.find('.js-ln').val(json.data.lastname);
                        $edit_detail.find('.js-email').val(json.data.email);
                    }
                    //session过期
                    if(json.errorcode == 3){
                        //sessionOutHandle();
                    }
                });
            }
            
            

            //显示编辑资料
            $personal.on('click', '.js-edit-detail', function(){
                $show_detail.hide();
                $edit_detail.fadeIn(200);
                return false;
            });

            //非空判断
            $.checkNotNull('blur', $edit_detail.find('.js-fn'));
            $.checkNotNull('blur', $edit_detail.find('.js-ln'));
            
            $.checkMail('blur', $edit_detail.find('.js-new-email'));
            $.checkMail('blur', $edit_detail.find('.js-old-mail'));
            
            //重新填写邮件
            $old_mail = $edit_detail.find('.js-old-mail').parent();
            $edit_detail.find('.js-new-email').on('keyup',function(){
                if($.trim($(this).val()) != ''){
                    $old_mail.fadeIn(200);
                    is_change_mail = 1;
                }else{
                    //$(this).parent().find('.warning').remove();
                    $old_mail.fadeOut(200);
                    is_change_mail = 0;
                }
            });

            

            //保存资料确认框
//            $personal.createConfirmPot({
//                'id':'save-success',
//                'title':'SAVE SUCCESS',
//                'class': 'js-single-btn',
//                'text':' ',
//                'cancel':false
//            });
//            $('#save-success').on('click', '.js-com', function(){
//               if(is_change_mail){
//                   logout('normal'); 
//               }else{
//                   $('#save-success').hide();
//                   $('html').removeClass('ofh');
//               }
//            });


            //保存新资料
            $('.js-save-edit').on('click', function(){
                
                var $this = $(this);
                
                //获取当前新值
                $new_mail    = $edit_detail.find('.js-new-email'),
                $re_new_mail = $edit_detail.find('.js-re-mail'),
                new_mail    = $.trim($new_mail.val()),
                //re_new_mail = $.trim($re_new_mail.val());
                old_mail    = $.trim($('.js-old-mail').val());
                
                
                $edit_detail.find('.js-fn').blur();
                $edit_detail.find('.js-ln').blur();
                /*if(is_change_mail){
                    $edit_detail.find('.js-new-email').blur();
                    $edit_detail.find('.js-old-mail').blur();
                }*/
                
                if($edit_detail.find('.warning').length != 0) { return false;}
                
                //判断是否有输入新邮箱
                if(is_change_mail){
                    if($edit_detail.find('.js-old-mail').val() == ''){
                        $edit_detail.find('.js-old-mail').blur();
                        return false;
                    }
                    var reset_mail_apiURL  = apiRoot+'index.php?r=admin/user/users/modify-email',
                        reset_mail_param   = 'email='+old_mail+'&new_email='+new_mail;
                    startAjax(reset_mail_apiURL, reset_mail_param, function(json){
                        //
                        if(json.errorcode == 2){
                            
                        }
                    });
                }
                
                //获取对应的值
                firstname   = $edit_detail.find('.js-fn').val(),             
                lastname    = $edit_detail.find('.js-ln').val();

                param += '&firstname='+firstname+'&lastname='+lastname;

                startAjax(editpersonal_apiURL, param, function(json){
                    //console.log(json);
                    if(is_change_mail){ 
                        $('#save-success').find('.text').text('Succesfully Changed Login Email Address. Please login again.');
                    }
                    //openPotLayer('#save-success');
                    
                    $this.text('SAVED').css('background','#09694f');
                    setTimeout(function(){
                       //更新到显示
                        addUserInfo();
                        $edit_detail.hide();
                        $show_detail.fadeIn(200); 
                        $this.text('SAVE').css('background','#0d926e');
                    },1000)
                    
                    
                    
                    
                });
                return false;

            });

            //弹出框确认事件

            //修改密码
            function updatePassword() {
                var $this,
                    $update_psw = $('#update-psw'),
                    $old_psw    = $update_psw.find('.js-old-psw'),
                    $new_psw    = $update_psw.find('.js-new-psw'),
                    $new_re_psw = $update_psw.find('.js-re-psw'),
                    old_password,                                   //旧密码
                    new_password,                                   //新密码
                    re_new_password,                                //确认新密码
                    update_psw_apiURL   = apiRoot+'index.php?r=admin/user/users/modify-passwd',
                    update_psw_param,
                    is_update_psw = 0;

                //非空盘算
                $.checkNotNull('blur', $old_psw);
                $.checkNotNull('blur', $new_psw);
                $new_re_psw.on('blur', function(){
                    var $this = $(this),
                        new_password = $new_psw.val(),
                        re_new_password = $this.val();
                    if( re_new_password == ''){
                        $this.parent().append('<div class="warning tr abs hide">Can not be empty</div>');
                        $this.next().removeClass('hide').addClass('animated shake');
                    }else if(re_new_password != new_password ){
                        $this.parent().append('<div class="warning tr abs hide">Passwords inconsistency</div>');
                        $this.next().removeClass('hide').addClass('animated shake');
                    }else{
                        $this.next().remove();
                    }
                });

                //弹出密码修改
                $('.js-update-psw').on('click', function(){
                    openPotLayer('#update-psw');
                    return false;
                });

                //保存修改密码
                $('body').on('click', '.js-confrim-update-psw', function(){
                    var $this = $(this);
                    
                    old_password    = $old_psw.val(),
                    new_password    = $new_psw.val();
                    var warning = $update_psw.find('.warning').length;
                    if(!warning){
                        
                        //加载菊花
                        $this.creatLoadingState({
                            'id':'js-del-psw',
                            'removeclass':'js-confrim-update-psw',
                            'text':'CHANGEING',
                            'bgc':'#09694f'
                        });
                        
                        update_psw_param = 'source=1&password='+old_password+'&newPassword='+new_password;
                        startAjax(update_psw_apiURL, update_psw_param, function(json){
                            //console.log(json);
                            if(json.errorcode == 0){
                                logout('normal',function(){
                                    location.href = baseURL+'/login.html';
                                });
                            }
                            if(json.errorcode == 1){
                                //旧密码错误状态
                                $old_psw.parent().append('<div class="warning tr abs hide">Old password error</div>');
                                $old_psw.next().removeClass('hide').addClass('animated shake');
                                $('#js-del-psw').remove();
                                $this.show();
                            }
                            if(json.errorcode == 2) {
                                //密码一致
                                $new_psw.parent().append('<div class="warning tr abs hide">new password same as old password</div>');
                                $new_psw.next().removeClass('hide').addClass('animated shake');
                            }
                        });
                    }
                    return false;
                });
            }

            console.log('get detail done');
        }

        /*
         * 登出
         */
        logout('confirm');
        $('.js-logout').on('click', function(){
            openPotLayer('#logout'); return;
        });



        /*
         * 处理添加国家信息
         */

        //console.log('开始获取国家信息');

        $.checkNotNull('blur','#add-new-address .js-fn');
        $.checkNotNull('blur','#add-new-address .js-ln');
        $.checkNotNull('blur','#add-new-address .js-add');
        $.checkNotNull('blur','#add-new-address .js-city');
//        $.checkNotNull('blur','#add-new-address .js-code');
        $.checkNotNull('blur','#add-new-address .js-state');
        $.checkNotNull('blur','#add-new-address .js-phone');
//        $('#add-new-address .js-code, #add-new-address .js-phone').on('keyup', function(){
        $('#add-new-address .js-phone').on('keyup', function(){
            $.onlyNumber(this);
        });

        getAreaOption('#add-new-address');
        
        //修正个人中心导航栏访问路径
        $('body').on('click', '.js-acc-li', function(){
            var type = $(this).attr('data-type');
            $('.js-'+type).click();
            return false;
        });
        
        //edit by peishan 2016-05-20
//重新上传文件
        

        $('body').on('click', '.re_upload_item', function(){
            reupload_fusion_id = 0;
              var $this   = $(this);
        var order_product_id = '';
         order_product_id = $this.parent().attr('data-id');
         reupload_fusion_id = $this.parent().attr('data-id');
           
           $('.theme-popover').show();
               $(".overlay").show();

               console.log(reupload_fusion_id);

               $('.upload_con').attr('data-target-id', reupload_fusion_id);

  //          //确定上传
  //            $('.upload_con').click(function(){
  //               // console.log(order_product_id+files_number);
  //               files_number = $('.child-order-num').val();
  //               console.log(files_number);
  //               console.log(reupload_fusion_id);
  //               // return false;

  //               var apiURL  = apiRoot+'index.php?r=bazaar/user/user-order/upload-pcb-file',
  //                   param   = 'order_product_id='+order_product_id+'&files_number='+files_number;
  //               //console.log(param);
  //               startAjax(apiURL, param, function(json){
  //                   //console.log(json)
  //                   if(json.errorcode == 0){
  //                    $this.html('Re-uploaded');
  //                    $('.webuploader-pick').html('<i class="fa fa-cloud-upload"></i>Re-upload');
  //                    $this.removeClass('re_upload_item');
  //                   }
  //               });
  //               $('.theme-popover').hide();
  //                  $(".overlay").hide();
  //               return false;
  //           });
  // //取消删除
  //       $('.reupload_warning').on('click', '.upload_close', function(){
  //              $('.theme-popover').hide();
  //              $(".overlay").hide();
  //           return false;   
  //       })


         });

   //确定上传
             $('.upload_con').click(function(){
                // console.log(order_product_id+files_number);
                var files_number = $('.child-order-num').val();
                var from_id      = $(this).attr('data-target-id');


                var apiURL  = apiRoot+'index.php?r=bazaar/user/user-order/upload-pcb-file',
                    param   = 'order_product_id='+from_id+'&files_number='+files_number;
                //console.log(param);
                startAjax(apiURL, param, function(json){
                    //console.log(json)
                    if(json.errorcode == 0){
                     $('.re_upload_item').html('Re-uploaded');

                     $('.webuploader-pick').html('<i class="fa fa-cloud-upload"></i>Re-upload');
                     // $this.removeClass('re_upload_item');
                    }
                    
                });
                $('.theme-popover').hide();
                   $(".overlay").hide();
                return false;
            });
  //取消删除
        $('.reupload_warning').on('click', '.upload_close', function(){
               $('.theme-popover').hide();
               $(".overlay").hide();
            return false;   
        })

           
        createWebUpload('file', '.re_upload_item','.re_upload_box', function(json){});
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
             $('.re_upload_box .webuploader-pick').html('<i class="fa fa-cloud-upload"></i>'+file.name+'&nbsp;&nbsp;Uploading...');
            console.log('开始是上传文件了');
        }else{
             $('.re_upload_box .webuploader-pick').html('<i class="fa fa-cloud-upload"></i>'+file.name+'&nbsp;&nbsp;File type is not correct');
             $('.re_upload_box').addClass('fbtn_error');
                return false;  
           
           }
   
        });
  
        //文件上传成功
        file_uploader.on( 'uploadSuccess', function( file, response) {
             console.log('成功上传文件'); 
         
           var _file_val= file.name;
           var fileExt=(/[.]/.exec(_file_val))?/[^.]+$/.exec(_file_val.toLowerCase()):'';
        if(fileExt =='rar' || fileExt =='zip'){
            $('.re_upload_box .webuploader-pick').html('<i class="fa fa-cloud-upload"></i>'+file.name+'&nbsp;&nbsp;Upload Successful');
            $('.re_upload_box').addClass('fbtn_success');
            //写入到列表
       
            var _pcbfile = $('.child-order-num').val(response.data.files_number);
           

  
           }else{
            $('.re_upload_box .webuploader-pick').html('<i class="fa fa-cloud-upload"></i>'+file.name+'&nbsp;&nbsp;File type is not correct');
            $('.re_upload_box').removeClass('fbtn_success');
                return false;  
           
           }
        
        });

         //文件上传失败
        file_uploader.on( 'uploadError', function( file ) {
            console.log('上传失败');
             var _file_val=file.name;
             var fileExt=(/[.]/.exec(_file_val))?/[^.]+$/.exec(_file_val.toLowerCase()):'';
             if(fileExt !='rar' || fileExt !='zip'){
             $('.re_upload_box .webuploader-pick').html('<i class="fa fa-cloud-upload"></i>'+file.name+'&nbsp;&nbsp;Upload Error');
             $('.re_upload_box').addClass('fbtn_error');
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
        /*
        //获取国家信息
        getAreaData(function(json){
            if(json.errorcode == 0){
                $(json.data.countries).each(function(){
                    _contury_html += '<option value="'+this.countries_id+'">'+this.countries_name+'</option>'
                });
                $('#add-new-address').find('.js-coun').hide().empty().append(_contury_html).show();
            }
        });
        //变换国家信息
        $('#add-new-address').on('change', '.js-coun', function(){

            var $this           = $(this),
                t_id            = $this.val(),
                _state_html     = '';

            //console.log(t_id);

            getRegionData(t_id,function(json){
                console.log(json)
                //有数据，组织选项
                if(json.errorcode == 0){
                    _state_html = '<div class="label f12"><i class="c-d0 mr5">*</i>State/Province</div><select class="input sm-input select js-state">';
                    $(json.data.regions).each(function(){
                        _state_html += '<option value="'+this.zone_id+'">'+this.zone_name+'</option>';
                    });
                    _state_html += '</select>';
                }
                if(json.errorcode == 3){
                    _state_html = '<div class="label f12"><i class="c-d0 mr5">*</i>State/Province</div><input type="text" class="input  sm-input js-state">';
                }

                console.log(_state_html);

                $('.js-state-box').hide().empty().append(_state_html).show();
            });
        });
        */
    }
}