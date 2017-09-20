/**
 * @file cart.js
 * @description 购物车 逻辑
 * @author seeed-int 2015-12-16
 */

//var apiRoot = 'http://192.168.1.40/seeed-cc';
//var apiRoot = '';

var cart = function() {  
    
    $('title').text('Cart:seeed Shop,Boost ideas,Extend the Reach');
    
    var $cart_list = $('.cart-list'),       //获取购物车列表jq容器
        $outstock  = $('.js-outstock-box'), //缺货列表容器
        outstock_flag = 0,       //缺货状态
        product_data = {};       // 产品属性全局赋值
    
    //checkout按钮检查
    $('.js-cart-checkout').on('click', function(){
        
        var $this = $(this);
        
        //清空购物车
//        $cart_list.hide().empty();

        
        //创建loading状态
        $this.creatLoadingState({
            'removeclass': 'js-cart-checkout',
            'id':'checking',
            'text':'CHECKING'
        });
        

        //验证是否在线
        isOnline(function(json){
            if(json.errorcode == 0){
                if(json.data.is_online){
                    
                    //已登录
                    
                    //重新加载购物车，刷新当前库存
                    createCartDetail(function(){
                        //console.log('完成');
                        
//                        //console.log('原先的缺货数是：'+$outstock.attr('data-state'));
//                        //console.log('现在的缺货数是：'+ $outstock.find('.detail').length);
                       
                        //处理超出库存商品
                        if($('.js-enough')){
                            //删除加载状态并显示checkout按钮
                            $('#checking').remove();
                            $this.show();
                            //更新变更数量的商品
                            updataChangeQuantity();
                        }

                        //判断是否有js-enough，没有则进入
                        if(!$cart_list.find('.js-enough').length){
                            var new_outstock_count = $outstock.find('.detail').length;      //新的缺货数量
                            
//                            //console.log('旧的缺货数量：'+outstock_flag);
//                            //console.log('新的缺货数量：'+new_outstock_count);
                            
                            //判断完有没有库存不足的，再判断有没有瞬间缺货的
                            if( new_outstock_count > outstock_flag ){
                                outstock_flag = new_outstock_count;
                                return false;
                            }
                            
                            //console.log($cart_list.find('.js-enough').length);
                            location.href = 'order.html';
                        }
                    });
                }else{
                    //必须登录
                    recoveryLocation(window.location.href);
                    location.href = 'login.html';
                }
            }
        });
        return false;
    });
    
    //加载菊花
    $cart_list.creatLoadingState({
        'id': 'js-loading',
        'class':'c-9b',
        'bgc': '#fff',
        'text': 'Loading data, just one sec.'
    });
    //渲染购物车商品
    createCartDetail(function(){
        outstock_flag = $outstock.find('.detail').length;
//        $outstock.attr('data-state',outstock_flag);

    });
    //删除商品
    deleteItem('.js-remove');
    //浮动
    $(window).scroll(function() {
        var srcoll_top    = $(window).scrollTop(),
            view_height   = $(document).height()-$(window).height(),
            $preview = $('.preview');
        if(srcoll_top > 60){
            $preview.addClass('fixed-block');
        }
        if( srcoll_top < 60 ){
            $preview.removeClass('fixed-block');
        }
    });
    
    //渲染购物车数据
    function createCartDetail(callback){
        getCartData(function(json){
            //加载数据
            setTemplate(json);
            //添加事件
            upadateQuantity();
            if(callback) callback();
        });
    }
    

    function setTemplate(json){

        //console.log(json)
        //如果没有购物车数据
        if(!json.data){
            $('#js-loading').remove();
            $('.cart-detail').append('<div class="c-9b">YOUR CART IS EMPTY,FIND SOMETHING INTERTESING IN SEEED!<p><a href="'+baseURL+'">Go Shopping</a></p></div>');
            return false;
        }

        //渲染购物车
        var _list_item = '';
        $(json.data.products).each(function(){
            var _is_outstock        = '',       //是否缺货
                real_quantity       = 0,        //实际可给出库存
                _quantity_tips      = '',       //用户下单数超过库存时提示字段
                _quanity_flag       = '',       //库存状态订单
                is_fusion           = this.product_attributes.length,
                _fusion_html        = '',       //fusion订单字符串
                _fusion_bom_html    = '',       //bom订单
                _cart_item_name     = '';       //显示名字字符串
            //判断是否没库存商品
            if(this.stocks == 0) { _is_outstock = 'is-out';}
            
//            //console.log(this.stocks);
//            //console.log(this.quantity);
            
            //如果用户下单数超过库存，则给出提示
            if(this.quantity > this.stocks){
                real_quantity = this.stocks;
                //库存不足文案
                _quantity_tips = '<div class="stock-warning f12">Sorry, just '+this.stocks+' in stock</div>';
                //插入库存状态flag
                _quanity_flag = '<input type="hidden" class="js-enough" value="1">';
            }else{
                real_quantity = this.quantity;
            }

            //判断是否fusion订单，加载订单列表 edit by pc@2015-05-11
            if(is_fusion){
                _fusion_html = '<ul class="order-fusion-list">';
                $(this.product_attributes).each(function(){
                    _fusion_html += '<li>'+this.attr_name+' - '+this.attr_value+'</li>'
                });
                _fusion_html += '</ul>';
                //console.log(_fusion_html);
                
                //edit by pc @2016-05-17
                if(this.product_bom.length){
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
                    $(this.product_bom).each(function(){
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
                
                _cart_item_name = 
//                    '<div class="rel info">'+
                        '<a href="item_detail.html?p_id='+this.product_id+'" title="'+this.product_name+'">'+
                        '<div class="name">'+this.product_name+'</div>'+
                        '</a>'+_fusion_html+_fusion_bom_html+
                        '<a href="" class="js-remove f12 c-9b" data-id="'+this.id+'">Remove Item</a>';
//                    '</div>';
            }else{
                //组织非商品订单
                _cart_item_name = 
                '<div class="rel info">'+
                    '<a href="item_detail.html?p_id='+this.product_id+'" title="'+this.product_name+'">'+
                    '<div class="name">'+this.product_name+'</div>'+
                    '</a>'+
                    '<div class="type f12 c-7b">One Size</div>'+
                    '<div class="abs item-act">'+
                        '<a href="" class="js-remove f12 c-9b" data-id="'+this.id+'">Remove Item</a>'+
                    '</div>'+
                '</div>'+_fusion_html;
            }
            
            //组织非fusion商品名字
            
            
            //edit by pc @2016-05-11 显示购物车原价与优惠价
            var _price = '',
                final_price = $.formatFloatTo2(this.final_price),
                price       = $.formatFloatTo2(this.products_price);
            if(final_price == price){
                //价格一样，不显示优惠价
                _price = '<div class="j-now-price">$'+final_price+'</div>';
            }else{
                //价格不一样，显示优惠价
                _price = '$'+final_price+'<div class="c-9c remove-line">$'+price+'</div>'
            }
            
            
            _list_item +=
                '<tr class="detail '+_is_outstock+'">'+
                    '<td class="img"><a href="item_detail.html?p_id='+this.product_id+'" title="'+this.product_name+'"><img src="'+imageRoot+this.product_thumb+'" alt="'+this.product_name+'" class="img"></a></td>'+
                    '<td>'+_cart_item_name+
                    '</td>'+
                    '<td class="price">'+_price+'</td>'+
                    '<td><div class="edit-num rel" data-id="'+this.id+'">'+
                        '<a href="#" class="js-less js-edit-num">-</a>'+
                        '<input type="text" class="tc quantity-num" value="'+real_quantity+'" data-ps="'+this.stocks+'">'+
                        '<a href="#" class="js-plus js-edit-num">+</a>'+_quantity_tips+_quanity_flag+   
                    '</div></td>'+
                '</tr>';
        });
        //console.log(_list_item);
        //删除加载状态，显示数据
        $('#js-loading').remove();
        
        $cart_list.empty().detach().append(_list_item);
        $('.cart-detail').prepend($cart_list);
        
        /*加载 bom hover效果*/
        $('.j-bom').hover(function(){
            $(this).find('.j-bom-list').fadeIn(100);
        }, function(){
            $(this).find('.j-bom-list').fadeOut(100);
            
        });
        
        
        //将没库存的商品往下排
        /* is_out判断 */
        if($('.is-out').length){
            //console.log('有没库存商品');
            var $outstock_list = $('.js-outstock-list');
            $outstock_list.empty();
            $('.is-out').each(function(){
                var $temp = $(this).remove();
                $outstock_list.append($temp);
            });
            $outstock_list.find('.edit-num').each(function(){
                $(this).parent().css('width','126px');
                $(this).empty().append('<span class="c-9b">out of stock</span>');
            });
           $outstock.removeClass('hide');
        }

        //显示购物车列表
        $cart_list.fadeIn(200);
//        $('.comfirm-list').removeClass('hide');
//        $cart_list.removeClass('hide');
        //$('.preview').removeClass('hide');

        //渲染价格
        var total_length = $cart_list.find('.detail').length;
        updateTotal(json);
        $('.cart__summary').show();
        
        if(!$cart_list.find('.detail').length){
            $cart_list.empty().append('<div class="c-9b">YOUR CART IS EMPTY, FIND SOMETHING INTERTESING IN SEEED!<p><a href="//bazaar.seeedstudio.com/">Go Shopping</a></p></div>');
            //$('.preview').find('.btn-save').off('click').attr('href', 'javascript:void(0);').addClass('btn-disable'); 
            //无可购买商品 隐藏购物车
            $('.preview').hide();
        }
        
        //如果有库存更新提示，则更新库存数量
        if($('.js-enough')){
            updataChangeQuantity();
        }
        
    }
    
    function updateTotal(json){
        $('.total-item').text(json.data.cartNumber);
        $('.price-sub').text('$'+$.formatFloatTo2(json.data.subTotal));
        $('.price-total').text('$'+$.formatFloatTo2(json.data.total));
        
        //更新优惠价格
        if(json.data.discount){
            $('.j-dis-price').find('.price-dis').text('-$'+$.formatFloatTo2(json.data.discount)).end().removeClass('hide');
        }else{
            $('.j-dis-price').addClass('hide');
        }
        
        //更新折扣
        
        
    }


    /*增加或减少数量*/
    function upadateQuantity() {

        $('.js-edit-num').on('click', function(){
            var $this   = $(this),
                $parent = $this.parent(),
                $qty_input = $parent.find('.quantity-num'),
                qty_num = parseInt($qty_input.val()),
                //库存字段
                stock   = parseInt($qty_input.attr('data-ps')),
                cart_id = $parent.attr('data-id');

            //add
            if($this.hasClass('js-plus')){
//                //console.log(qty_num);
//                //console.log(stock);
                
                //去掉减号的灰色状态
                $parent.find('.js-less').removeClass('c-9b');
                
                if(qty_num >= stock){ 
                    //或者提示无法再添加
                    //stockJudge(qty_num, stock, $parent);
                    return false;
                }else{
                    $qty_input.val(++qty_num);
                    if(qty_num == stock) { $this.addClass('c-9b');}
                    
                    ajaxQuantity(cart_id, qty_num, function(json){
                        updateTotal(json);
                        //edit by pc @2016-05-07 更新商品新价格（阶梯价）
                        //console.log(json);
                        //比较并更新价格
                        updatePriceFormat($this, json);
                     
                    });
                }
                    
                stockJudge(qty_num, stock, $parent);
                
                //return false;
            }

            //less
            if($this.hasClass('js-less')){
                if(qty_num == 1) return false;
                $parent.find('.js-plus').removeClass('c-9b');
                $qty_input.val(--qty_num);
                if(qty_num == 1) { $this.addClass('c-9b');}
                stockJudge(qty_num, stock, $parent);
                ajaxQuantity(cart_id, qty_num, function(json){
                    //更新
                    updateTotal(json);
                    updatePriceFormat($this, json);
                });
            }
            return false;
        });

        //失去焦点
        $('.quantity-num').on('blur keyup', function(even){
            //只能输入数字
            $.onlyNumber(this);
            
            var $this   = $(this),
                $parent = $this.parent(),
                qty_num = parseInt($this.val()),
                cart_id = $parent.attr('data-id'),
                stock   = parseInt($this.attr('data-ps')),
                $qty_input  = $this.parent();
            
            //console.log('库存是：'+stock+' '+'购买数量是：'+qty_num);
            
            if(even.type == 'blur') {
                
                //如果为空，则默认为1
                if($this.val() == '') { $this.val(1);}
                
                //如果数字大于库存，则更新为最大库存并更新到数据库
                if($this.val() > stock){
                     $this.val(stock);
                }
                
                //数据判断&提交
                stockJudge(qty_num, stock, $parent);
                ajaxQuantity(cart_id, $this.val(), function(json){
                    updateTotal(json);
                    updatePriceFormat($this, json);
                });
//                //console.log('这是blur');
            }
            
            if(even.type == 'keyup'){
                //不能粘贴0
                if(qty_num == 0) { $this.val(1);}
                //输入的数字大于库存 则改为最大库存数
                if($this.val() > stock){
                     $this.val(stock);
                     stockJudge(qty_num, stock, $parent);
                }
//                stockJudge(qty_num, stock, $parent);
//                ajaxQuantity(cart_id, $this.val());
            }
            
            return false;
        });

        
    }
    
    
    //加减更新价格显示
    function updatePriceFormat(target, data){
        var old_price   = $.formatFloatTo2(data.data.products_price),
            final_price  = data.data.finalPrice,
            $price      = target.closest('.detail').find('.price');
        if(final_price == old_price){
            //价格一样
            $price.empty().text('$'+final_price);
        }else{
            //价格不一样
            $price.empty().append('$'+final_price+'<div class="c-9c remove-line">$'+old_price+'</div>');
        }
        
    }
    
    //更新单品购物车数量
    function ajaxQuantity(card_id, qty_num, callback) {
        var updateURL   = apiRoot+'index.php?r=bazaar/cart/default/update',
            updateParam = "id="+card_id+'&qty='+qty_num;
        //console.log(updateParam);
        startAjax(updateURL, updateParam, function(json){
            //console.log(json);
            callback(json);
        });
    }
    
    //库存比对
    function stockJudge(qty, stock, target){
        if(qty >= stock){
            if(!$(target).find('.warning').length){
//                $(target).append('<div class="warning f12">not enough items in stock</div>');
                $(target).find('.quantity-num').val(stock);
                //隐藏系统自带库存警告
                if($(target).find('.stock-warning')){
                    $(target).find('.stock-warning').hide();
                }
                $(target).append('<div class="warning f12">only '+stock+' in stock</div>');
                return false;
            }
            //console.log('超出了');
        }else{
            $(target).find('.warning').remove();
        }
    }
    
    //更新库存不对的商品
    function updataChangeQuantity(){
        $('.js-enough').each(function(e){
            var $parent = $(this).parent(),
                cart_id = $parent.attr('data-id'),
                num = $parent.find('.quantity-num').val();
            //更新修正后的库存
            ajaxQuantity(cart_id, num);
        });
    }

    /*删除一个商品*/
    function deleteItem(btn_delete) {

        var $cart   = $('#cart'),
            deleteURL   = apiRoot+'index.php?r=bazaar/cart/default/delete',
            deleteParam;

        $cart.createConfirmPot({
            'id':'remove-item',
            'title':'Romoving this Item?',
            'text': '',
            'confirm': true,
            'cancel': true
        });

        $('.cart-detail').on('click', btn_delete, function(){

            var $this   = $(this),
                cart_id = $this.attr('data-id');

            openPotLayer('#remove-item');
            
            //改造成通用方法
            
            $cart.on('click', '.js-com', function(){
                deleteParam = 'id='+cart_id;
                startAjax(deleteURL, deleteParam, function(json){
                //console.log(json);
                if(json.errorcode == 0){
                    $('#remove-item').hide();
                   //删除行 
                    $this.closest('.detail').remove();

                    //如果购物车为空，提示购物车为空
                    if(!$cart_list.find('.detail').length){
                        $cart_list.empty().append('<div class="c-9b">YOUR CART IS EMPTY, FIND SOMETHING INTERTESING IN SEEED!<p><a href="//bazaar.seeedstudio.com/">Go Shopping</a></p></div>');
                        //$('.preview').find('.btn-save').off('click').attr('href', 'javascript:void(0);').addClass('btn-disable');
                        $('.preview').hide();
                    }
                    
                    //如果缺货栏为0，隐藏缺货栏
                    if($outstock.find('.detail').length == 0) {
                        $outstock.hide();
                    }
                    
                    
                    //更新总价格
                    $('.price-sub').text('$'+$.formatFloatTo2(json.data.subTotal));
                    $('.price-total').text('$'+$.formatFloatTo2(json.data.subTotal));
                    //更新商品总量
                    var total_length = $cart_list.find('.detail').length;
                    $('.total-item').text(json.data.cartNumber);
                    
                    $('html').removeClass('ofh');
                    
                    addHeaderCart();
                }
                });
                
                return false;
            });

            return false;
        });
        
        
        //如果在该页面登录，记录路径
        $('body').on('click', '.js-login', function(){
            recoveryLocation('cart_detail.html');
            return true;
        });

        /*return false;

        $('.cart-detail').on('click', btn_delete, function(){
            //弹出框确定是否删除

            var $this   = $(this),
                cart_id = $this.attr('data-id');


            deleteParam = 'id='+cart_id;
            //console.log(deleteParam);
            startAjax(deleteURL, deleteParam, function(json){
                //console.log(json);
                if(json.errorcode == 0){
                   //删除行 
                    $this.parent().parent().parent().parent()
            //                        .addClass('fadeOutLeft animated');
                    .slideUp(200);
                }

            });
            return false;
        });*/

        /*$(btn_delete).on('click', function(){

        });*/



    }
//    }

    //reset窗口高度
    //610暂时根据元素高度计算得出
    var cart_min_height = $(window).height()-610;
    $('.cart-detail').css('min-height',cart_min_height+'px');
    
}