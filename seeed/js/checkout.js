 /**
 * @file checkout.js
 * @description ver2结算功能 
 * @author seeed-int date 2016-03-11
 */

var checkout = function() {
    
    isOnline(function(json){
        
        //console.log(json);
        
        if(json.errorcode == 0){
            if(json.data.is_online){
                $('body').removeClass('hide');
                doCheckout();
            }else{
                //写进url
                recoveryLocation();
                location.href = 'login.html';
            }
        }
    });

    
    function doCheckout(){
        
        //定义变量，初始化以应用值
        var address_id          = 0,             //收货地址id
            billing_address_id  = 0,             //账单地址id
            payment_id          = 0,             //支付id
            shipping_id         = 0,             //物流方式id
            address_count       = 0,             //地址数量
    //        default_address_id  = 0,
            _address            = '',            //收获地址字段
            _billing            = '',            //账单地址字段
            _payment            = '',            //支付方式字段
            _shipping           = '',            //快递方式字段
            _cart               = '',            //购物列表字段
            _confirm_box        = '',            //确认盒子html
            subtotal,                            //总价
            total,                               //最终价
            items,                               //购物车商品数量   
            order_sn,                            //结算生成订单号
            credit_card_state   = 0,             //是否添加过信用卡
            temp_shipping_price = 0,             //上次选中运费价格
            final_checkout_price = 0;            //最终价格
        
        /*
         * ver2 业务
         */
        
        /*
         * 全局业务 start
         */
        
        //加载GA
        $.get('../view/common/gacode.html', function(data){
           $('head').append(data); 
        });
        
        /*高亮com-option*/
        $('.address-list').on('click', '.com-option', function(){
            var $this = $(this),
                $parent = $this.parent();
//            $parent.addClass('select-on').siblings().removeClass('select-on').hide();
            $parent.addClass('select-on').siblings().removeClass('select-on');
        });
        
        //赋值收货地址id
        $('.shipping-address').on('click', '.com-option', function(){
            address_id = $(this).attr('data-id');
            //console.log('收货地址id是：'+address_id);
            //模拟more操作
            $(this).parent().parent().parent()
                .find('.js-more').attr('data-flag',1)
                .find('.fa').removeClass('fa-angle-up').addClass('fa-angle-down');
            
            //根据address_id更新快递方式
            setShippingAddress(address_id);

            /*edit by pc @2016-05-11 更新旧价格问题*/
            /*1.记录运费；2.清空运费；3.快递状态置为0*/
            $('.price-del').text(0);
            //获取现在价格
            var now_price = $('.j-final-total').text();
            $('.price-total').text('$'+$.formatFloatTo2(now_price.split('$')[1]-temp_shipping_price));
            temp_shipping_price = 0;
            //是否选择物流置为0
            shipping_id = 0;
            
        });
        
        //赋值账单地址id
        $('.billing-address').on('click', '.com-option', function(){
            billing_address_id = $(this).attr('data-id');
            //console.log('账单地址id是：'+billing_address_id);
            $(this).parent().parent().parent()
                .find('.js-more').attr('data-flag',1)
                .find('.fa').removeClass('fa-angle-up').addClass('fa-angle-down');
        });
        
        //赋值快递id
        $('.shipping-list').on('click', '.com-option', function(){
            shipping_id = $(this).attr('data-id');
            $(this).addClass('select-on').siblings().removeClass('select-on');
            updateShippingPrice(shipping_id);
            //只要点击 就可以点击支付 2016-03-25 wangyafei
            //$('.js-pay-disabled').addClass('js-pay').removeClass('js-pay-disabled');
        });
        
        //赋值支付方式id
        $('.payment-list-2').on('click', '.com-option', function(){
            var $this = $(this),
                payment_type = $this.attr('data-type');
            $this.addClass('select-on').siblings().removeClass('select-on');
            payment_id = $this.attr('data-id');
            
            //console.log(payment_id)
                
            //paypal
            if(payment_type == 'paypal'){
                //console.log('paypal');
                //$('.credit-card-list').slideUp(100);
                $('.js-credit-card-list').hide();
            }
            //creditcard
            if(payment_type == 'creditcard'){
                //$('.credit-card-list').slideDown(100);
                if(credit_card_state){
                    $('.js-credit-card-list').show();
                    return false;
                }
//                openPotLayer('#add-credit-card','.btn-close-potlayer');
            }
        });
        
        //保存信用卡
        $('.js-save-credit-card').on('click', function(){
            var $credit_card_pot = $('#add-credit-card');
            
            $credit_card_pot.find('.input').blur();
            if(!$credit_card_pot.find('.warning').length){
                //保存成功
                credit_card_state = 1;      //设置为添加过信用卡
                //console.log('可以保存信用卡了');
                //组织数据到list
                var card_num = $credit_card_pot.find('.js-cre-num').val(),
                    card_name = $credit_card_pot.find('.js-cre-name').val(),
                    card_mouth = $credit_card_pot.find('.js-cre-month').val(),
                    card_year = $credit_card_pot.find('.js-cre-year').val(),
                    _card_str = '<div class="com-option rel"><span class=card-num><img src="" class=card-type-img>**** **** **** '+card_num.slice(-4)+'</span><span class=card-name>'+card_name+'</span><span class=card-date>'+card_mouth+'/'+card_year+'</span><i class="fa fa-check checked-ico abs"></i></div>';
                
                //console.log(_card_str);
                $credit_card_pot.find('.btn-close-potlayer').click();
                $('.js-credit-card-list').append(_card_str).show().find('.com-option').addClass('select-on');
                
            }
            return false;
        });
        
        //billing address是否与shipping address 一致
        $('body').on('click', '.js-set-ba', function(){
            var $this   = $(this),
                flag    = $this.attr('data-flag');
            
            if(flag==1){
                //展开地址簿，让用户选择地址
                $('.js-ba-box').find('')
                //$('.js-ba-box').find('.js-more').click();
                //将flag设置为0
                $this.attr('data-flag',0);
                $this.find('.fa').removeClass('fa-check-square-o').addClass('fa-square-o');
                $('.js-ba-box').slideDown(100).removeClass('hide');
            }
            
            if(flag == 0){
                $('.js-ba-box').find('.js-more').click();
                billing_address_id = shipping_id;
                $this.attr('data-flag',1);
                $this.find('.fa').removeClass('fa-square-o').addClass('fa-check-square-o');
                $('.js-ba-box').slideUp(100);
                //console.log('将账单地址与收货地址设定一致');
            }
            
            return false;
        });
        
        //地区物流为空时添加地址
        $('body').on('click', '.js-no-shipping', function(){
            $('.js-add-new-add').click();
            return false;
        });
        
        //设置默认地址
        $('body').on('click', '.js-set-defaul-add', function(event){
            event.preventDefault();
            var $this = $(this),
                address_id = $this.parent().parent().find('.com-option').attr('data-id');
            setDefaultAddress(address_id, function(json){
                //console.log(json);
                setAddressList();
            });
            return false;
        });
        
        //more选项
        $('.js-more').on('click', function(){
            var $this   = $(this),
                flag    = $this.attr('data-flag');
            if(flag==1){
                //展开地址簿，让用户选择地址
                //将flag设置为0
                $this.attr('data-flag',0);
                $this.find('.fa').removeClass('fa-angle-down').addClass('fa-angle-up');
                $(this).parent().parent().find('.js-option').show();
            }
            if(flag==0){
                $this.attr('data-flag',1);
                $this.find('.fa').removeClass('fa-angle-up').addClass('fa-angle-down');
                $this.parent().parent().find('.select-on').siblings('.js-option').hide();
            }
            
            return false;
        });
        
        //添加新地址
        $('.js-add-new-add').on('click', function(){
            //清空现有数据
            $('#add-new-address').find('.input').val('');
            //打开窗口
            openPotLayer('#add-new-address', '.btn-close-potlayer');
            return false;
        });
        
        //修改地址
        $('body').on('click', '.js-edit-add', function(e){
            //event.stopPropagation();
            //e.stopPropagation();
            e.preventDefault();
            
            //原因：窗口保存后消失了
            
            var $this = $(this),
                $address = $this.parent().parent().find('.com-option'),
                address_id = $address.attr('data-id'),
                $edit_address = $('#edit-address');
            //调出窗口，加载数据到 edit address
            $edit_address.attr('data-id',$address.attr('data-id'));     //将要修改的id添加到修改窗口
            $edit_address.find('.js-fn').val($address.attr('data-fn'));
            $edit_address.find('.js-ln').val($address.attr('data-ln'));
            $edit_address.find('.js-com').val($address.attr('data-com'));
            $edit_address.find('.js-add').val($address.attr('data-add'));
            $edit_address.find('.js-city').val($address.attr('data-city'));
            $edit_address.find('.js-code').val($address.attr('data-code'));
            $edit_address.find('.js-phone').val($address.attr('data-phone'));
            //遍历匹配国家选项
            //更新为用户所选地址
            $edit_address.find('.js-coun').find('option').each(function(){
                var $this = $(this);
                if($this.text() == $address.attr('data-coun')){
                    $this.attr('selected', 'selected');
                    //return false;
                }
            });
            //更新默认操作
            //$edit_address.find('.js-coun').change();
            //更新state地址
            $edit_address.find('.js-state').val($address.attr('data-state'));
            openPotLayer('#edit-address', '.btn-close-potlayer');
            return false;
        });
        
        //edit by pc @2016-05-15 添加优惠券功能
        $('.j-use-coupon').on('click', function(){
            
            var $this = $(this),
                $parent = $this.parent(),
                coupon_code = $parent.find('.j-coupon-num').val(),
                $tips   = $parent.find('.j-tips');
            
            // console.log('优惠码是：'+coupon_code);
            
            //空判断
            if(coupon_code == ''){
                $tips.text('Please enter your coupon code or gift card').show().addClass('animated shake');
            }
                
            
            var api     = apiRoot + 'index.php?r=bazaar/checkout/default/coupons-verify',
                param   = 'coupon_code='+coupon_code; 
            startAjax(api, param, function(json){
                //console.log(json);
                
                //优惠券成功
                if(json.errorcode == 0){
                    //更新价格
                    updateTotal(json);
                    $tips.hide().removeClass('animated shake');
                    // $parent.find('.j-coupon-num').val('');
                    $tips.text('Coupon use success').show();
                    setTimeout(function(){
                        $tips.fadeOut(200);
                    }, 2000);
                }
                
                //优惠券错误（过期/不存在）
                if(json.errorcode != 0){
                    $tips.text('Please check your coupon code or gift card').show().addClass('animated shake');
                }
            });
            
            return false;
        });
        
        
        //最终支付
        $('body').on('click', '.js-pay', function(){
            
            //如果billing address 与 shipping address 一样，则赋值
            if($('.js-set-ba').attr('data-flag') == 1) { 
                billing_address_id = address_id;
            }
            
            //输出选项信息
//            console.log('shipping id是：'+address_id);
//            console.log('billing id是：'+billing_address_id);
//            console.log('shipping id是：'+shipping_id);
//            console.log('payment id是：'+payment_id);
            
            
            //判断有没有值
            if(!address_id){
                warningFlash('#address-id');
                return false;
            }
            if(!billing_address_id){
                warningFlash('#address-id');
                return false;
            }
            if(!shipping_id){
                warningFlash('#shipping-id');
                return false;
            }
            if(!payment_id){
                warningFlash('#payment-id');
                return false;
            }
            
            //return false;
            
            //默认paypal
            var apiURL  = apiRoot+'index.php?r=bazaar/checkout/default/checkout',
                param   = 'guid=1&address_id='+address_id+
                          '&billing_address_id='+billing_address_id+
                          '&payment_id='+payment_id+
                          '&shipping_id='+shipping_id;

            //插入浮层
            $('body').append('<section class="potlayer" id="confirm-pay-result"><div class="potlayer__confirm tc clear f20"><i class="fa fa-spinner fa-spin mr10"></i> PAYING</div></section>');
            $('#confirm-pay-result').show();

            var $this = $(this);
            
            //加载菊花
            $this.creatLoadingState({
                'id':'js-paying',
                'removeclass':'js-pay',
                'text':'PAYING'
            });
            
            //同步ajax并建立新窗口
            $.ajax({
                type: "post",
                url: apiURL,
                data: param,
                dataType: "json",
                async: false,
                cache: false,
                success: function (json) {
                    $('#js-paying').remove();
                    $this.show();

                    if (json.errorcode == 0) {
                        //console.log(json);
                        //更新订单号
                        order_sn = json.data.order_sn;

//                        $('.comfirmation-order').remove();

                        //删除背景并加载确认按钮
//                        $('.comfirmation-order').remove();
//                        $('body').append('<section class="potlayer" id="confirm-pay-result"><div class="potlayer__confirm tc clear"><i class="fa fa-spinner fa-spin mr10"></i> PAYING</div></section>');
//                        $('#confirm-pay-result').show();
//                        
                        $('.js-pay-done').click(function(){
                            
                            // 添加Facebook代码开始
                            fbq('init', '1080959988628815');
                            fbq('track', 'Purchase', {
                                'content_ids': order_sn,
                                'value': final_checkout_price,
                                'product_catalog_id': '938382529614001',
                                'content_type': 'product',
                                'currency': 'USD'
                            }); 
                            // 添加Facebook代码结束

                        });


                        //PayPal支付方式
                        if (payment_id == 1) {
                            var href = apiRoot + json.data.url,
                                set = "height=800, width=1000, top=50, left=50, scrollbars=yes, resizable=no, location=no";
//                            window.open(href, 'paypal', set, true);
//                            console.log(href);
                            window.location.href = href;
                            
                        }

                        //信用卡支付方
                        if (payment_id == 2) {
                            //console.log('信用卡支付方式');
                            var href = '//'+window.location.host+'/view/pay_page.html?total='+final_checkout_price+'&scount='+order_sn,
                                set = "height=800, width=1000, top=50, left=50, scrollbars=yes, resizable=no, location=no";
//                                window.open(href, 'Credit Card', set, true);
//                            console.log(href);
                            window.location.href = href;
                            
                        }
                        
                    }
                }
            });
            
            return false;
        });
        
        
        /*全局业务 end*/
        setAddressList();
        setCartList();
        //创建窗口，以及对应的操作
        createAddAddressForm();
        //信用卡字段判断
        creditCardCheck();
        
        //新手引导
        newUserGuide();
        
        //读取地址
        function setAddressList(callback){
            getAdressData(function(json){
                //console.log(json);
                //有地址数据
                if(json.errorcode == 0){
                    var _add_book_html = '',            //地址簿str
                        _default_add;  
                    
                    //如果地址为一个，隐藏更多按钮
                    //console.log('地址个数是：'+json.data.length);
                    if(json.data.length != 1){
                        //隐藏更多按钮
                        $('.shipping-address').find('.js-more').removeClass('hide');
                        $('.js-ba-box').find('.js-more').removeClass('hide');
                    }
                    
                    //组织html模板
                    $(json.data).each(function(){
                        //是否默认地址
                        _default_add = this.is_default == 1 ? '<span class="default-address js-default-add mr10">Default shipping address</span>':'<a href="#" class="mr20 js-set-defaul-add">Set default address</a>';
                        
                        _add_book_html += '<div class="rel js-option mb10"><div class="fr hover-act">'+_default_add+'<a href="#" class=js-edit-add>Edit</a></div><div class="com-option" data-id="'+this.id+'" data-fn="'+this.first_name+'" data-ln="'+this.last_name+'" data-com="'+this.company+'" data-add="'+this.street+'" data-coun="'+this.country+'" data-state="'+this.province+'" data-city="'+this.city+'" data-code="'+this.postcode+'" data-phone="'+this.phone+'"><div class=clear><span class=name>'+this.first_name+' '+this.last_name+'</span><span class="phone pl25 f14">'+this.phone+'</span></div><div class=detail>'+this.street+', '+this.city+'/'+this.postcode+', '+this.province+', '+this.country+'</div><i class="fa fa-check checked-ico abs"></i></div></div>';
                        
                        //edit by pc @2016-03-29 包裹操作
//                        _add_book_html += '<div class="com-option" data-id="'+this.id+'" data-fn="'+this.first_name+'" data-ln="'+this.last_name+'" data-com="'+this.company+'" data-add="'+this.street+'" data-coun="'+this.country+'" data-state="'+this.province+'" data-city="'+this.city+'" data-code="'+this.postcode+'" data-phone="'+this.phone+'"><div class=clear><span class=name>'+this.first_name+' '+this.last_name+'</span><span class="phone pl25 f14">'+this.phone+'</span></div><div class=detail>'+this.street+', '+this.city+'/'+this.postcode+', '+this.province+', '+this.country+'</div><div class="fr hover-act">'+_default_add+'<a href="#" class=js-edit-add>Edit</a></div><i class="fa fa-check checked-ico abs"></i></div>';
                    });
                    //填充模板
                    $('.address-list').hide().empty().append(_add_book_html).show();
                    
                    //默认将default address 设置为 shipping address
                    //console.log($('.shipping-address').find('.js-default-add').parent().parent().length)
                    $('.shipping-address').find('.js-default-add').parent().parent().find('.com-option').click();
                    $('.billing-address').find('.js-default-add').parent().parent().find('.com-option').click();
                    
                    //如果有回调，则执行
                    if(callback){ callback();}
                }
                
                //没地址数据
                if(json.errorcode == 3){
                    //加载新手引导
                    $('#new-user-guide').show();
                }
            });
        }
        
        //读取购物车数据
        function setCartList(){
            var _cart = '';     //购物车数据模板
            getCartData(function(json){
                //console.log(json);
                
                //判断是否拆单
//                if(json.data.ordersNum !=1){
//                    //console.log('这是拆单订单');
//                    //处理拆单反馈
//                }
                
                //有数据
                if(json.errorcode == 0){
                    subtotal = $.formatFloatTo2(json.data.subTotal);
                    total    = $.formatFloatTo2(json.data.total);
                    items    = json.data.cartNumber;
                    discount = $.formatFloatTo2(json.data.discount);

                    $('.price-sub').text('$'+subtotal);
                    $('.price-total').text('$'+total);
                    console.log(discount);
                    if(json.data.discount){
                        $('.j-price-dis').find('.price-dis').text('-$'+discount)
                            .end().removeClass('hide');
                    }
                    $('.js-total-count').text(items);

                    $(json.data.products).each(function(){
                        _cart += 
                            '<div class="item clear">'+
                                '<img src="'+$.formatImgURl(this.product_thumb)+'" class="img mr30 fl" alt="'+this.product_name+'">'+
                                '<div class="info fl">'+
                                    '<a href="item_detail.html?p_id='+this.product_id+'" target="_blank" class="dis-block">'+this.product_name+'</a>'+
                                    //暂时没有输出对应的型号字段，先屏蔽
                                    //'<span class="c-9e f12">Size one</span>'+
                                '</div>'+
                                '<div class="quantity fl">Qty.<span>'+this.quantity+'</span></div>'+
                                '<div class="price fl">$'+$.formatFloatTo2(this.final_price)+'</div>'+
                            '</div>';
                    });
                    //console.log(_cart);
                    $('.review-list').hide().append(_cart).show();
                }
            });
        }
        
        //读取运输方式
        function setShippingList(callback){
            getShippingData(function(json){
                //console.log(json);
                //有数据
                if(json.errorcode == 0){
                    _shipping = '';     //清空shipping
                    $(json.data).each(function(){
                        _shipping += 
                        '<div class="com-option rel" data-id="'+this.shipping_id+'">'+
                            '<span class="price ml10">$'+$.formatFloatTo2(this.shipping_fee)+'</span>'+
                            '<span class=time>'+this.shipping_remark+'</span>'+     //shipping_remarkshi是天数描述
                            '<span class="shipping c-9e">'+
                            '<img src="'+baseURL+this.shipping_thumb+'" class=shipping-ico>'+this.shipping_name+' '+this.shipping_description+'</span>'+
                        '<i class="fa fa-check checked-ico abs"></i>'+
                        '</div>';
                    });
                    $('#shipping-id').find('.shipping-list').hide().empty().append(_shipping).show();
                }
                //没有快递
                if(json.errorcode == 3){
                    $('#shipping-id').find('.shipping-list').hide().empty().append('<p style="line-height:30px;">Sorry, your country does not support express delivery，please check your address or </br><a href="#" class="underline js-no-shipping">add a new address</a></p>').show();
                }
                
                if(callback) callback();
                
            });
        }
        
        //设置用户地区
        function setShippingAddress(add_id){
            var api = apiRoot+'index.php?r=admin/user/user-address/set-ship-address',
                param = 'address_id='+add_id;
            startAjax(api, param, function(json){
                //console.log(json);
                //更新成功
                if(json.errorcode == 0){
                    setShippingList();
                }
            });
        }
    
        //更新运费
        function updateShippingPrice(shipping_id){
            //console.log(shipping_id);
            var api = apiRoot+'index.php?r=bazaar/checkout/default/shipping_set',
                param = 'shipping_id='+shipping_id;
            startAjax(api, param, function(json){
//                console.log(json);
                var del_fee = $.formatFloatTo2(json.data.shippingFee),
                    sub_total = $.formatFloatTo2(json.data.subTotal),
                    discount  = $.formatFloatTo2(json.data.discount),
                    total = $.formatFloatTo2(json.data.total);
                $('.price-del').text('$'+del_fee);
                $('.price-sub').text('$'+sub_total);
                if(discount){
                    $('.j-price-dis').find('.price-dis').text('-$'+discount)
                        .end().removeClass('hide');
                }
                $('.price-total').text('$'+total);
                
                //复制当前选中运费
                temp_shipping_price = json.data.shippingFee;
                
                //赋值最终运费
                final_checkout_price = json.data.total;
//                console.log('最终价格是：'+ final_checkout_price);
                
            });
            
        }
        
        /* 创建添加地址的窗口
         * 如果type为new，则为创建窗口，如果type为obj，则为修改地址窗口
         * 窗口包含国家数据 非空判断，存储功能
         */
        function createAddAddressForm(){
            //新加地址窗口
            appendAddressForm('body', 'add-new-address', function(){
                
                //保存新增地址
                $('#add-new-address').on('click', '.js-save-add', function(){
        
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
                            //重新加载地址列表
                            setAddressList(function(){
                                //展开列表让用户选择
                                
                                $('.shipping-address').find('.js-option:last').find('.com-option').click();
                                $('.my-address-2').find('.js-more').click();
                            });
                            
                        }
                        if(json.errorcode == 3){
                            alert('添加失败');
                        }
                    });
                    return false;
                });
            });
            
            appendAddressForm('body', 'edit-address', function(){
                
                var $edit_address = $('#edit-address');
                
                //更改标题
                $edit_address.find('h1').text('EDIT ADDRESS');
                
                //保存编辑地址
                $edit_address.on('click', '.js-save-add', function(){
                    
                    var $this   = $(this),
                    first_name  = $edit_address.find('.js-fn').val(),
                    add_id      = $edit_address.attr('data-id'),
                    last_name   = $edit_address.find('.js-ln').val(),
                    company     = $edit_address.find('.js-com').val(),
                    country     = $edit_address.find('.js-coun').val(),
                    province    = $edit_address.find('.js-state').val(),
                    city        = $edit_address.find('.js-city').val(),
                    street      = $edit_address.find('.js-add').val(),
                    postcode    = $edit_address.find('.js-code').val(),
                    phone       = $edit_address.find('.js-phone').val(),
                    apiURL = apiRoot + 'index.php?r=admin/user/user-address/edit-user-address',
                    param = 'source=1&address_id='+add_id+'&first_name='+first_name+'&last_name='+last_name+
                                    '&company='+company+'&country='+country+'&province='+province+
                                    '&city='+city+'&street='+street+'&postcode='+postcode+'&phone='+phone;
              
                    //验证是否有没填项
                    $edit_address.find('.input').blur();
                    if($edit_address.find('.warning').length){ return false;}

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
//                            setTimeout(function(){
//                                $('#edit-address').hide();
//                            },2000);
                            $('html').removeClass('ofh');
                            setAddressList();
                        }
                    });
                    
                    return false;
                });
            })
        }
        
        //组件：实现针对某个节点插入新增窗口，并执行回调
        function appendAddressForm(insert_target, form_id, callback){
            
            //读取窗口模板并创建功能
            var _address_window = '<section class="potlayer" id="'+form_id+'"><div class="potlayer__body address-box css-new-potlayer rel"><a href="" class="btn-close-potlayer"><i class="fa fa-close"></i></a><div class="content pt50 css-new-content"><h1 class="f20 f-dp-m">ADD ADDRESS</h1><div class="com-group-input fl mr30"><div class="label f12"><i class="c-d0 mr5">*</i>First Name</div><input type="text" class="input js-fn css-new-input"></div><div class="com-group-input fl"><div class="label f12"><i class="c-d0 mr5">*</i>Last Name</div><input type="text" class="input js-ln css-new-input "></div><div class="com-group-input fl"><div class="label f12">Company(Optional)</div><input type="text" class="input js-com css-new-input css-cpm-input"></div><div class="com-group-input"><div class="label f12"><i class="c-d0 mr5">*</i>Street Address</div><input type="text" class="input lg-input js-add css-new-input"></div><div class="com-group-input mr30"><div class="label f12"><i class="c-d0 mr5">*</i>Country</div><select name="" id="" class="js-coun select input com-select css-new-input"></select></div><div class="com-group-input mr30 js-state-box "><div class="label f12"><i class="c-d0 mr5">*</i>State/Province</div><input type="text" class="input  sm-input js-state css-new-input"></div><div class="com-group-input"><div class="label f12"><i class="c-d0 mr5">*</i>City</div><input type="text" class="input sm-input js-city css-new-input"></div><div class="com-group-input mr30"><div class="label f12"><i class="c-d0 mr5">*</i>Postcode</div><input type="text" class="input js-code css-new-input"></div><div class="com-group-input"><div class="label f12"><i class="c-d0 mr5">*</i>Phone</div><input type="text" class="input js-phone css-new-input"></div><a href="" title="" class="fr btn-confirm mt40 js-save-add">SAVE</a></div></div></section>';
                
            //插入到文档
            $(insert_target).append(_address_window);

            //引入国家与地区
            getAreaOption('#'+form_id);

            //引入非空判断
            $.checkNotNull('blur','#'+form_id+' .js-fn');
            $.checkNotNull('blur','#'+form_id+' .js-ln');
            $.checkNotNull('blur','#'+form_id+' .js-add');
            $.checkNotNull('blur','#'+form_id+' .js-city');
            $.checkNotNull('blur','#'+form_id+' .js-code');
            $.checkNotNull('blur','#'+form_id+' .js-state');
            $.checkNotNull('blur','#'+form_id+' .js-phone');
            $.checkNotNull('blur','#'+form_id+' .js-code');
//            $('#'+form_id+' .js-code, #'+form_id+' .js-phone').on('keyup', function(){
//                $.onlyNumber(this);
//            });
            $('#'+form_id+' .js-phone').on('keyup', function(){
                $.onlyNumber(this);
            });
            
            //特殊判断
//            $('body').on('blur', '.js-new-state', function(){
//                var $this = $(this);
//                $this.parent().find('.warning').remove();
//                if($.trim($this.val()) == ''){
//                    $this.parent().append('<div class="warning tr abs hide">Can not be empty</div>');
//                    $this.next().removeClass('hide').addClass('animated shake');
//                }else{
//                    $this.next().remove();
//                }
//            });

            //执行回调
            if(callback){
                callback();
            }
        }
        
        //信用卡非空检查
        function creditCardCheck(){
            $.checkNotNull('blur','.credit-card-form .js-cre-name');
            $.checkNotNull('blur','.credit-card-form .js-cre-cvv');
            $.checkNotNull('blur','.credit-card-form .js-cre-num');
            $('.credit-card-form .js-cre-num, .credit-card-form .js-cre-cvv').on('keyup', function(){
                $.onlyNumber(this);
            });
        }
        
        //新手引导
        function newUserGuide(){
            
            //jq对象
            var $new_guide = $('#new-user-guide'),
                $step_1 = $new_guide.find('.box-step-1'),
                $step_2 = $new_guide.find('.box-step-2'),
                $step_3 = $new_guide.find('.box-step-3'),
                $address_box = $('.guide-box').find('.content'),
                billing_address_state = 0;      //账单地址是否与收货地址一致
            
            //引入国家与地区
            getAreaOption('.guide-box .content'/*, function(){
                //重新加载地区非空判断
                console.log('重新加载非空判断');
                $.checkNotNull('blur', '.js-guide-shipping-address .js-state');
                $.checkNotNull('blur', '.js-guide-billing-address .js-state');
            }*/);

            //引入非空判断
            function formatCheck(target){
                $.checkNotNull('blur',target+' .js-fn');
                $.checkNotNull('blur',target+' .js-ln');
                $.checkNotNull('blur',target+' .js-add');
                $.checkNotNull('blur',target+' .js-city');
                $.checkNotNull('blur',target+' .js-code');
                $.checkNotNull('blur',target+' .js-state');
                $.checkNotNull('blur',target+' .js-phone');
                // $(target+' .js-code').on('keyup', function(){
                //     $.onlyNumber(this);
                // });
                // $(target+' .js-phone').on('keyup', function(){
                //     $.onlyNumber(this);
                // });
            }
            formatCheck('.box-step-1 .content');
            formatCheck('.box-step-2 .content');
            
            //取消账单地址与收货地址一致
            $new_guide.on('click', '.js-set-ba-giude', function(){
                var $this = $(this),
                    flag  = $this.attr('data-flag');
                if(flag == 1){
                    $this.attr('data-flag',0);
                    $this.find('.fa').removeClass('fa-check-square-o').addClass('fa-square-o');
                }
                if(flag == 0){
                    $this.attr('data-flag',1);
                    $this.find('.fa').removeClass('fa-square-o').addClass('fa-check-square-o');
                }
                return false;
            });
            
            //下一步操作
            $new_guide.on("click", '.js-next', function(){
                var $this   = $(this),
                    step    = $this.attr('data-step');
                //console.log(step);
                
                //第一步
                if(step == 1){
                    
                    //console.log('点击了第一步');
                    
                    //blur
                    $step_1.find('.input').blur();
                    
                    //通过验证后
                    if($step_1.find('.warning').length == 0){
                        
                        //如果是勾选了账单
                        if($('.js-set-ba-giude').attr('data-flag')==0){
                            $step_2.find('.address-list').hide();
                            $('.js-new-add-guide').attr('data-state',1).hide();
                            $('.js-back-add-book').show();
                            $step_2.find('.js-guide-billing-address').show();
                        }
                        
                        var $content = $step_1.find('.content'),
                            _is_same = '';
                        
                        //如果账单地址和收货地址一样
                        if($('.js-set-ba-giude').attr('data-flag')==1){
                            $step_2.find('.address-list').show();
                            $('.js-new-add-guide').attr('data-state',0).show();
                            $('.js-back-add-book').hide();
                            $step_2.find('.js-guide-billing-address').hide();
                            _is_same = 'select-on';
                        }
                        
                        //取出该地址的值
                        var _new_address = '<div class="js-option rel"><div class="com-option '+_is_same+'"><div class=clear><span class=name>'+$content.find('.js-fn').val()+' '+$content.find('.js-ln').val()+'</span><span class="phone pl25 f14">'+$content.find('.js-phone').val()+'</span></div><div class=detail>'+$content.find('.js-add').val()+', '+$content.find('.js-city').val()+'/'+$content.find('.js-code').val()+', '+$content.find('.js-state:selected').text()+', '+$content.find('.js-coun').val()+'</div><i class="fa fa-check checked-ico abs"></i></div></div>';
                        
                        //console.log(_new_address);
                        
                        //插入到step-2
                        $step_2.find('.address-list').empty().append(_new_address);
                        $step_1.hide();
                        $step_2.fadeIn(100);
                        
                        $('.nav').find('.step-2').addClass('on');
                        
                        
                    }
                    
                    //根据国家更新快递选项
                    var the_country_id = $('.box-step-1').find('.js-coun').val(),
                        _ng_shipping_list = '';
                    //console.log(the_country_id);
                    getShippingDataByCountryId(the_country_id,function(json){
                        //console.log(json);
                        //组织地址数据
                        $(json.data).each(function(){
                            _ng_shipping_list += '<div class="com-option rel css-new-option" data-id="'+this.l_id+'">'+
                                                 '<span class="price ml10">'+this.price+'</span><span class=time>'+this.time+'</span>'+
                                                 '<span class="shipping c-9e"><img src="'+baseURL+this.l_image+'" class=shipping-ico>'+this.l_name+'</span>'+
                                                 '<i class="fa fa-check checked-ico abs"></i></div>'
                        });
                        
                        $('.box-step-3').find('.shipping-list').empty().append(_ng_shipping_list);
                        
                    });
                    
                }
                
                //第二步
                if(step == 2){
                    //判断账单地址是否与和收货地址一样
                    billing_address_state = $('.js-new-add-guide').attr('data-state');
                    //console.log(billing_address_state);
                    if(billing_address_state == 0){
                        //一致
                        //alert('与账单地址一致');
                        $step_2.hide();
                        $step_3.fadeIn(100);
                    }
                    if(billing_address_state == 1){
                        //不一致
                        //alert('与账单地址不一致');
                        //存储新地址信息
                        $step_2.find('.content').find('.input').blur();
                        if($step_2.find('.content').find('.warning').length == 0){
                            $step_2.hide();
                            $step_3.fadeIn(100);
                            $('.nav').find('.step-3').addClass('on');
                        }
                    }
                }
                
                //第三步
                if(step == 3){
                    
                    //最终保存
                    //return false;
                    
                    //传输地址并显示到checkout页面
                    
                    //0是一致，1是不一致
                    //console.log(billing_address_state);
                    
                    $this.creatLoadingState({
                        'id':'js-ng-adding',
                        'text': 'ADDING ADDRESS',
                        'bgc': '#09694f',
                        'removeclass':'js-save-new-add'
                    });
                    
                    //如果账单地址不一致，则保存
                    if(billing_address_state == 1){
                        saveAddressToService('.js-guide-billing-address', function(json){
                            //console.log(json);
                            if(json.errorcode == 0) {
                               //干活
                                console.log('保存账单地址 done');
                                setAddressList();
                                $('#js-ng-adding').remove();
                                $new_guide.hide();
                                //执行默认选项操作
                                //$('.js-more').click();
                            }
                            if(json.errorcode == 3){
                                //alert('添加失败');
                            }
                        });
                    }
                    
                    //保存收货地址
                    saveAddressToService('.js-guide-shipping-address', function(json){
                        if(json.errorcode == 0) {
                            console.log('保存收货地址 done');
                            //执行成功后的操作
                            setAddressList();
                            if(billing_address_state == 1){
                                //console.log('账单地址也要显示');
                                
                                //
                                $('.js-set-ba').click();
                            }
                            $('#js-ng-adding').remove();
                            $new_guide.hide();
                            //执行默认选项操作
                            //$('.js-more').click();
                        }
                        if(json.errorcode == 3){
                            alert('添加失败');
                        }
                    }); 
                }
                 
                return false;
            });
            
            //上一步操作
            $new_guide.on('click', '.btn-back', function(){
                var $this = $(this),
                    step  = $this.attr('data-step');
                
                //第二步返回
                if(step == 2){
                    $('.nav').find('.step-2').removeClass('on');
                    $step_2.hide();
                    $step_1.fadeIn(100);
                }
                
                //第三步返回
                if(step == 3){
                    $('.nav').find('.step-3').removeClass('on');
                    $step_3.hide();
                    $step_2.fadeIn(100);
                }
                
            });
            
            //添加新地址操作
            $new_guide.on('click', '.js-new-add-guide', function(){
                var $this = $(this);
                    $this.parent().find('.address-list').hide().end().find('.content').show();
                //将新增状态置为0
                $this.attr('data-state',1);
                $('.js-back-add-book').show();
                $this.hide();
                return false;
            });
            
            //.js-back-add-book 状态为0时，收货账单一致，状态为1时，账单为新
            
            //返回地址簿操作
            $new_guide.on('click', '.js-back-add-book', function(){
                var $this = $(this);
                $this.hide();
                $('.js-new-add-guide').attr('data-state',0).show();
                $step_2.find('.content').hide();
                $step_2.find('.address-list').show();
                return false;
            });
            
            //设置地址
//            setShippingList(function(){
//                $step_3.find('.shipping-list').find('.com-option').eq(0).addClass('select-on');
//            });
        }
        
        /* Model
         * 获取json数据
         */
        //获取用户地址数据
        function getAdressData(callback){
            var get_add_apiURL = apiRoot+'index.php?r=admin/user/user-address/user-address-list',
                get_add_param  = 'source=1&type=1';
                startAjax(get_add_apiURL, get_add_param, function(json){
                    callback(json);
                });
        }
        //获取购物车数据 getCartData(); //public_moudle.js已有
        
        //获取默认运输方式数据
        function getShippingData(callback){
            var api  = apiRoot+'index.php?r=bazaar/checkout/default/shipping_list',
                param = 'guid=1';
            startAjax(api, param, function(json){
                callback(json);
            });
        }
        
        //设置默认地址
        function setDefaultAddress(address_id, callback){
            var api = apiRoot+'index.php?r=admin/user/user-address/default-user-address',
                param = 'source=1&address_id='+address_id;
            startAjax(api, param, function(json){
                callback(json);
            });
        }

        //判断并警告
        function warningFlash(obj){
            var $obj = $(obj),
                top_px   = $obj.offset().top;
            $('body').animate({ scrollTop: top_px}, 500);
            $obj.addClass('animated flash warning-border');
            setTimeout(function(){
//                $obj.removeClass('animated flash warning-border');
                $obj.removeClass('animated flash warning-border');
            }, 1000);
        }
            
        
        //根据国家id获取对应的物流快递
        function getShippingDataByCountryId(country_id, callback){
            var api = apiRoot+'index.php?r=admin/common/country/get-logistics',
                param = 'country='+country_id;
            startAjax(api, param, function(json){
                //console.log(json);
                if(callback) { callback(json);}
            });
        }
            
        //更新运费
        function updateTotal(json){
            
            console.log(json);
            
            $('.js-total-count').text(json.data.cartNumber);
            $('.price-sub').text('$'+$.formatFloatTo2(json.data.subTotal));
            $('.price-total').text('$'+$.formatFloatTo2(json.data.total));

            //更新优惠价格
            if(json.data.discount){
                $('.j-price-dis').find('.price-dis').text('-$'+$.formatFloatTo2(json.data.discount)).end().removeClass('hide');
            }else{
                $('.j-price-dis').addClass('hide');
            }

            //更新折扣


        }
        
        
    }
    
}
                              
                              
                              
                              
                              
                              
                              
                              