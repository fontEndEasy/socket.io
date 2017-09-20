/**
 * @file item_detail.js
 * @description 商品详情 逻辑方法
 * @author seeed-int 2015-12-16
 * edit by Alice 2016-04-06
 */
var getItemDetail = function(){
    
    var p_id;           //定义基础p_id
    
    //参数判断
    if(getQuery('p_id')){
        p_id = getQuery('p_id');
        if(isNaN(p_id)){
            location.href = 'index.html';
            return false;
        }
        if(p_id==835||p_id==1511){
            location.href = 'fusion_pcb.html';
        }
    }else{
        location.href = 'index.html';
        return false;
    }
    
    //定义产品基本属性            
    var products_name,                  //产品名称
        products_description,           //产品描述
        products_image,                 //产品图片
        products_price,                 //产品价格
        predict_shipment_date,          //发货日期
        predict_quantity,               //产品数量
        products_quantity_order_max,    //商品最大购买数
        products_quantity_order_min,    //商品最小购买数
        product_stock;                  //商品状态
        
    //请求基础数据
    var apiURL  = apiRoot + 'index.php?r=admin/products/product/get-product-attributes',     //请求api
        breadcrumb_apiURL = apiRoot + 'index.php?r=admin/products/product/get-product-cates',
        param   = 'products_id='+p_id;  //请求参数,
    

    //获取面包屑导航
    creatBreadcrumb(breadcrumb_apiURL, param);
    
    //请求该商品基本数据
    startAjax(apiURL, param, function(json){
        
        if(json.errorcode == 0){
            
            //赋值基本属性
            products_name               = json.data.products_name,
            products_description        = json.data.products_description,
            products_price              = parseFloat(json.data.products_price),
            predict_shipment_date       = json.data.predict_shipment_date,
            products_quantity_order_max = json.data.products_quantity_order_max,
            products_quantity_order_min = json.data.products_quantity_order_min,
            product_stock               = json.data.product_stock,
            products_image              = baseURL+'/'+json.data.products_image;
            
            //组织SEO三要素
            $("title").html(json.data.products_name);
            $("meta[name='keywords']").attr('content', json.data.keywords);
            $("meta[name='description']").attr('content', json.data.description);
            
            //填到模板
            setTemplate(json.data);
            
            /*
             * 绑定事件
             * 必须在dom全部请求完成后执行
             */
            addDomEvent();
            //添加到购物车
            //addToBag('.js-add-cart', p_id);
            buyNow('.js-buy-now', p_id);
            
            // 添加seo统计代码
            AddFacebookCode(json.data);
        }else {
            //处理出错情况
            //alert('没数据，提示并跳回首页');
            location.href = 'index.html';
        }
        if(json.errorcode == 2) { alert('错误，并接上后续处理');}
    });
   
    /*
     * 获取面包屑
     */
    function creatBreadcrumb(url, data, callback){
        startAjax(url, data, function(json){
            if(!json.errorcode){
                var length = json.data.length,  //获取面包屑长度
                    _breadcrumb = '';           //面包屑 html
                $(json.data).each(function(e){
                    //最后一个不加斜线
                    e*1 + 1 == length ? _breadcrumb += '<span href="javacript:void(0);" title="'+this.name+'" class="bread-a" style="text-decoration:none;">'+this.name+'</span>':_breadcrumb += '<a href="item_list.html?category='+this.id+'" title="'+this.name+'" class="bread-a">'+this.name+'</a><span class="line">/</span>';
                });
                $('#breadcrumb').empty().append(_breadcrumb).show();
                //有回调则回调
                if(callback) callback();
            }
        });
    }
    
    
    /*
     * 填数据
     */
    function setTemplate(data) {
        
        //定义公共变量
        var isladder     = '',          //是否有阶梯价，默认0 没有
            _ladder_html = '',          //阶梯价字符串
            _style_html  = '',          //是否有style
            _need_html   = '',          //推荐html
            _side_html   = '',          //侧边栏html
            _btn         = '',          //按钮html
            $info        = $('.info'),
            $description = $('.description');
            
        
        //1.判断是否为阶梯价，是按照阶梯价组织html，否，按照单一价组织html
        getLadderData(p_id, function(json){
            //console.log(json);
           if(json.errorcode ==0){
               $(json.data).each(function(e){
                   //最后一个不添加下划线
                   var _b_line = e== (json.data.length-1)*1?'':'bottom-line';
                  _ladder_html += 
                      '<li class="clear '+_b_line+'">'+
                          '<span class="num">$'+this.ladder_price+'</span><span class="f11 ml5">/each</span>'+
                          '<span class="fr"><span class="pcs">'+this.ladder_start_count+'</span>pcs</span>'+
                      '</li>';
               });
               $info.addClass('stair-price');
               $('.stair-price-list').append(_ladder_html).removeClass('hide');
           }
            
            //无阶梯价
            if(json.errorcode == 3){
                isladder = '';
            }
            
            
            //显示基础信息
            addBaseInfo();
            _side_html = $info.html();
            //console.log(_side_html)
            //添加字符串到快捷操作
            $('.quick-bar').append(_side_html).find('.btn').css('display','block').end()
                .find('.js-add-cart').removeClass('ml20').addClass('mt10').end()
                .find('.btn-default').addClass('mt10').end()
                .find('.j-pre-date').remove()
                .find('.stock').remove().end();
                /*.show();*/
            $('.quick-bar').find('.sku').parent().remove();
            $info.show();
        });
        
        //2. 判断是否有style
        getProductStyleData(p_id, function(json){
            var selected = '';
            if(json.errorcode == 0){
                $(json.data).each(function(){
                    selected = this.product_id == p_id?'selected':'';
                    _style_html += '<option value="'+this.product_id+'" '+selected+'>'+this.value+'</option>'
                });
                //console.log(_style_html);
                $('.js-style').append(_style_html);
                $('.option-view-style').removeClass('hide');
            }
        });
        
        //2.组织基础内容
        function addBaseInfo(){
            
            //判断是否有优惠价
            var discount_p  = data.discount_price,
                price       = data.products_price,
                _price      = '';
//            console.log('优惠价是：'+discount_p);
//            console.log('原价是：'+price);
            if( discount_p == price ){
//                console.log('没有优惠价');
                _price = '<span class="price fl">$'+$.formatFloatTo2(price)+'</span>';
            }else{
//                console.log('有优惠价');
                _price = '<span class="price fl mr10">$'+$.formatFloatTo2(discount_p)+'</span><span class="old-price f16">$'+$.formatFloatTo2(price)+'</span>';
            }
            
//            console.log(_price);
            
            var _base_info_html = 
                '<h1 class="title">'+data.products_name+'</h1>'+
//                    '<div>by<a href="" class="f-dp-m f16 c-0d ml5">SeeedStudio</a>'+
                    '<div>'+
                        '<span class="sku f12">SKU '+data.products_model+'</span>'+
                    '</div>'+
                    '<div class="price-view f-dp-m clear rel">'+_price+
//                        '<span class="price fl mr10">$'+parseFloat(data.products_price)+'</span><span class="old-price f16">$89.0</span>'+
                        /*'<div class="sale-tips rel fl ml10">Save: 30%<i class="l-arr f16 fa fa-caret-left abs"></i></div>'+*/
                    '</div>';
            
            //组织按钮
            //backorder 补售
            if(product_stock == 'backorder'){
                //邮件通知
                $('.js-stock-text').text();
            }
            
            //perorder  预售
            if(product_stock == 'preorder'){
                _btn = '<a href="#" class="btn btn-confirm js-add-cart">ADD TO CART</a>';
                $('.js-stock-text').addClass('hide');
                $('.out-stock').append('<div class="f-os-sb j-pre-date" style="margin-top:35px;">Planned Shipment Date: '+data.product_stock_data.predict_shipment_date+'</div>').show();
                //添加角标
                $('.j-big-img').append('<div class="tab tab-per"></div>');
            }
            
            //backorder 补售
            if(product_stock == 'backorder'){
                 _btn = '<a href="#" class="btn btn-confirm js-add-cart">ADD TO CART</a>';
                $('.js-stock-text').addClass('hide');
                $('.out-stock').append('<div class="f-os-sb j-pre-date" style="margin-top:35px;">Planned Shipment Date:'+data.product_stock_data.predict_shipment_date+'</div>').show();
                //添加角标
                $('.j-big-img').append('<div class="tab tab-back"></div>');
                
            }
            //没货
            if(product_stock == 'outstock'){
                _btn = '';
                //not enough items in stock
                $('.js-stock-text').text('OUT OF STOCK').css('margin-left',0);
                $('.js-quantity').parent().addClass('hide');
                //缺货隐藏侧边栏
                $('.quick-bar').remove();
            }
            
            //in stock 正常销售
            if(product_stock == 'instock'){
                //将buy it now 暂时替换成js-add-cart
                 _btn = '<div class="inline-block buy_btn"><a href="#" class="btn btn-default js-add-cart">BUY IT NOW</a></div><div class="inline-block buy_btn"><a href="#" class="btn btn-confirm js-add-cart ml20">ADD TO CART</a></div>';
                $('.js-stock-text').text('');
            }
            
            //取得主图
            $info.hide().append(_btn).prepend(_base_info_html);
        }
        
        /*组织正文内容*/
        $description.find('.des-con').hide().append(data.products_description).show();
        
        //组织侧边栏-商品推荐

        getRelationProductData(p_id, function(json){
           //成功
            console.log(json);
            if(!json.errorcode){
                //console.log('加载推荐商品完成');
                $(json.data).each(function(){
                    _need_html += 
                        '<div class="item clear">'+
                            '<div class="fl">'+
                                '<a href="item_detail.html?p_id='+this.products_id+'" class="link">'+this.products_name+'</a>'+
                                '<span class="price">$'+parseFloat(this.products_price)+'</span>'+
                            '</div>'+
                            '<a href="#" class="btn btn-confirm fr js-include" data-id="'+this.products_id+'">INCLUDE</a>'+
                            '<div class="recommend-detail clear hide">'+
                                '<img src="'+imageRoot+products_image+'" alt="" class="fl img mr10">'+
                            '<div class="fr box">'+
                                '<div class="dis"></div>'+
                            '<a href="item_detail.html?p_id='+this.products_id+'" target="_blank" class="btn btn-confirm">VIEW DETAIL</a>'+
                                '</div>'+
                            '</div>'+
                        '</div>';
                });
                //console.log(_need_html);
                $('.recommend').append(_need_html).removeClass('hide');
            }
        });
        
        //3.组织幻灯片
        getProductImage(p_id, function(json){
            /*
             * 三个尺寸分辨率图
             * min 82x82
             * mid 640x480
             * min 880x660
             * 在原图后加上_82x82.jpg 即可显示对应的分辨率
             */
            //console.log(json);
            var _img_list = '<li><img src="'+products_image+'" class="item"></li>';
            $(json.data).each(function(e){
                
                //暂时最多加载5张  
                if(e==5){ return false;}
                
                _img_list += 
                    '<li><img src="" data-src="'+this.src+'" data-ext="'+this.ext+'" class="item"></li>';
            });
            $('.big-img').hide().attr('src', products_image).attr('data-big', products_image).fadeIn(200);
            $('.thumb').hide().empty().append(_img_list).find('.item').each(function(e){
                if(e>0){
                    var $this    = $(this),
                        data_src = $this.attr('data-src'),
                        data_ext = $this.attr('data-ext');
                    $this.attr('src', baseURL+data_src+'_82x82'+data_ext);
                } 
            });
            $('.thumb').fadeIn(200);
            
            //hover显示大图
            $('.thumb ').on('mouseover', '.item', function(){
                var $this    = $(this),
                    $big     = $('.big-img'),
                    index    = $this.parent().index(),
                    data_src = $this.attr('data-src'),
                    data_ext = $this.attr('data-ext');
                if(index == 0){
                    $big.attr('src',products_image).attr('data-big',products_image);
                }else{
                    $big.attr('src', imageRoot+data_src+'_640x480'+data_ext).attr('data-big',imageRoot+data_src+'_880x660'+data_ext);  
                }
                //当前缩略图高亮
                $this.addClass('hover').parent().siblings().find('.item').removeClass('hover');
            });
            
            
            /*//点击全屏显示大图
            $('.big-img').on('click', function(){
                var $this   = $(this),
                    big_src = $this.attr('')
                alert($(this).attr('data-big'));
            });*/
            
        });
    }
    
    //获取阶梯价数据
    function getLadderData(p_id, callback) {
        var isladder_api = apiRoot+'index.php?r=bazaar/products/product/get-ladder',
            param        = 'role=11&product_id='+p_id;
        startAjax(isladder_api, param, function(json){
            callback(json);
        });
    }
    //获取商品style
    function getProductStyleData(p_id, callback) {
        var getstyle_api = apiRoot+'index.php?r=bazaar/products/products-attr-products/get-rel',
            param        = 'product_id='+p_id;
        startAjax(getstyle_api, param, function(json){
            callback(json);    
        })
    }
    //获取商品所有图片
    function getProductImage(p_id, callback) {
        var getimg_api = apiRoot+'index.php?r=admin/products/product/get-product-images',
            param      = 'products_id='+p_id;
        startAjax(getimg_api, param, function(json){
            callback(json);
        });
    }
    //获取商品关联的商品
    function getRelationProductData(p_id, callback) {
        var api     = apiRoot+'index.php?r=bazaar/products/products-choice-products/get-rel',
            param   = 'product_id='+p_id;
        startAjax(api, param, function(json){
            callback(json);
        });
    }
    //添加商品到购物车
    function addDataToCart(p_id, qty, callback) {
        var apiURL = apiRoot+'index.php?r=bazaar/cart/default/add',
            param  = 'pid='+p_id+'&qty='+qty; 
        startAjax(apiURL, param, function(json){
            callback(json);
        });
    }   
    /*绑定事件*/
    function addDomEvent(){
        //窗口滚动
        $(window).scroll(function(){
            var srcoll_top    = $(window).scrollTop(),
                window_height = $(window).height(),
                $target       = $('.quick-bar'),
                footer_height = $('#footer').height(),
                view_height   = $(document).height()-$(window).height()-footer_height,
                bottom_height = srcoll_top - view_height;
            if(srcoll_top > 490){
                $target.addClass('quick-bar-fixed').fadeIn(200);
            }
            if( srcoll_top < 490 ){
                $target.removeClass('quick-bar-fixed').fadeOut(200);
            }
            
            /*if( srcoll_top >= view_height){
                $target.removeClass('quick-bar-fixed')
                  .addClass('quick-bar-abs').css('top',1000+'px');
            }
            if( bottom_height < 250){
             $target.removeClass('absolute-block').addClass('fixed-block');  
            }*/
        });
        
        //判断非空
        $.checkNotNull('blur', '.js-quantity');
        //只能输入数字
        $('.js-quantity').on('keyup',function(){
            this.value = this.value.replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g, "$1");
            var num = $(this).val();
            $('.quick-bar').find('.js-quantity').val(num);
        });
        //快捷栏的数字锁定
        $('.side').on('keyup', '.js-quantity', function(){
            this.value = this.value.replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g, "$1");
            var num = $(this).val();
            $('.info').find('.js-quantity').val(num);
        });
        
        //幻灯片效果
        $('.thumb-list__box').find('.item').on('mouseover', function(){
            var $this = $(this),
                img_url = $this.attr('src');
            $('.big-img').attr('src', img_url);
        });
        
        /*货币切换*/
        /*$('.currency-switch').on('mouseover', function() {
            $(this).find('.fa').removeClass('.fa-angle-down').addClass('fa-angle-up');
            $('.currency-list').slideDown(100);
        });
        $('.currency-list').on('mouseleave', function(){
            $('.currency-switch').find('.fa').removeClass('.fa-angle-up').addClass('fa-angle-down');
            $(this).slideUp(100);
        });*/
        
        /*hover显示介绍*/
        $('.recommend').on('mouseover mouseleave', '.item', function(e){
            var $this   = $(this),
                $detail = $this.find('.recommend-detail');
            if(e.type == 'mouseover'){
                $detail.fadeIn(200);
            }
            if(e.type == 'mouseleave'){
                $detail.hide();
            }
        });
        
        $('.recommend').on('mouseleave', function(){
            var $this = $(this);
            $this.find('.recommend-detail').hide();
        });
        
        /*添加推荐到购物车*/
        $('.recommend').on('click', '.js-include', function(){
            var $this   = $(this),
                this_id      = $this.attr('data-id');
            //加载loading状态
            $this.creatLoadingState({
                'id':'',
                'text':'',
                'removeclass':'js-include',
                'bgc':'#09694f'
            });
            
            //添加到购物车的操作
            addDataToCart(this_id,1,function(json){
                console.log(json);
                //成功
                if(json.errorcode == 0){
                    $this.next().next().text('ADDED');
                    $this.remove();
                    return false; 
                }
                //库存满了
                if(json.errorcode == 1){
                    /*$this.next().next().text('');
                    $this.remove();
                    return false;*/ 
                }
            });
            
        });
        
        
        /*change style*/
        $('.item-attr').on('change', '.js-style', function(){
            var $this = $(this),
                t_id  = $this.val();
            if(t_id != p_id){
                location.href = 'item_detail.html?p_id='+t_id;
            }
        });
        
        /*添加到购物车*/
        $('body').on('click', '.js-add-cart', function(){
            
            var $this = $(this),
                $qty  = $this.parent().parent().find('.js-quantity'),
                predict_quantity = $qty.val();
            
            
            
            //return false;
            
            if(predict_quantity == 0) {
                $qty.parent().find('.warning').remove().end()
                    .append('<div class="warning animated shake">pick a number</div>');
                return false;
            }else{
                
                $this.creatLoadingState({
                    'id':'js-adding',
                    'text':'ADDING',
                    'bgc':'#09694f'
                });
                
                addDataToCart(p_id, predict_quantity, function(json){
                    //console.log(json);
                    //添加成功
                    if(json.errorcode == 0) {
                        //$('#js-adding').remove();
                        $this.addClass('inline-block');
                        //跳转到购物车
                        location.href = 'cart_detail.html';
                    }
                    
                    if(json.errorcode == 1){
                        //处理库存不足
                        $this.show();
                        $this.parent().css('position','relative').append('<span class="abs f12 j-tips c-e2" style="left:20px; top:50px;">Sorry, Inventory shortage</span>');
                        $('#js-adding').remove();
                        setTimeout(function(){
                            $this.parent().find('.j-tips').remove();
                        }, 2000);
                    }
                    
                });
            }
            
            return false;
        });
        
        /*立即购买*/
        $('body').on('click', '.js-buy-now', function(){
            var $this = $(this),
                $qty  = $this.parent().find('.js-quantity'),
                predict_quantity = $qty.val();
            
            $this.creatLoadingState({
                'id':'js-buying',
                'text':'BUYYING',
                'bgc':'#fff',
                'removeclass':'js-buy-now'
            });
            
            if(predict_quantity == 0) {
                $qty.parent().find('.warning').remove().end()
                    .append('<div class="warning animated shake">Can not be zero</div>');
                return false;
            }else{
                
                addDataToCart(p_id, u_id, predict_quantity, function(json){
                    console.log(json);
                    //添加成功
                    if(json.errorcode == 0) {
                        console.log(json.data.cartId)
                        
                        //location.href = 'cart_detail.html';
                    }else {
                        //处理错误情况
                    }
                });
            }
            return false;
        });
        
        /*非登录状态下，点击登录记录当前路径*/
        $('body').on('click', '.js-login', function(){
            recoveryLocation();
        });
        
        //查看大图
        imageShow();
        
    }

    /*立即购买*/
    function buyNow(btn, products_id) {
        $(btn).on('click', function(){
            alert('结算模块完成后，会跳转至结算，请期待');
        });
    }
    
    /*
     * image-show
     * 查看大图，待添加上左右切换按钮
     */
    function imageShow(){
        
        var $image  = $('.image-show');
        $image.width($(document).width());
        $image.height($(document).height());
        
        /*查看大图*/
        $('.big-img').on('click', function(){
            var $this   = $(this),
                big_src = $this.attr('data-big');
            //如果有大图
            if(big_src != ''){
                $image.find('img').attr('src', big_src);
                //新建layer
                $image.fadeIn(200);

            }
        });
        
        //点击隐藏图片
        $('body').on('click', '.image-show', function(){
            $image.hide();
        });

    }   
};
//end-time
    function Endtime(){
     $(".timeover").each(function(){
      var lxfday=$(this).attr("lxfday");
      var endtime = new Date($(this).attr("endtime")).getTime();
      var nowtime = new Date().getTime();
      var youtime = endtime-nowtime;
      var seconds = youtime/1000;
      var minutes = Math.floor(seconds/60);
      var hours = Math.floor(minutes/60);
      var days = Math.floor(hours/24);
      var CDay= days ;
      var CHour= hours % 24;
      var CMinute= minutes % 60;
      var CSecond= Math.floor(seconds%60);
      if(endtime<=nowtime){
        $(this).html("已过期")
        }else{
        if($(this).attr("lxfday")=="no"){
        $(this).html("<i>This price end in:</i><span>"+CHour+"</span>:<span>"+CMinute+"</span>:<span>"+CSecond+"</span>");
        //输出没有天数的数据
        }else{
        $(this).html("<i>This price end in:</i><span>"+days+"</span><em>day</em><span>"+CHour+"</span><em>:</em><span>"+CMinute+"</span><em>:</em><span>"+CSecond+"</span><em></em>");
        //输出有天数的数据
        }
       }
     });
       setTimeout("Endtime()",1000);
     };

     Endtime();
         
    
    /**
     * 在获取服务端数据后执行该代码
     * 添加ga代码 与  facebook 代码
     * @returns {undefined}
     */
    function AddFacebookCode(product_data){
        fbq('init', '1080959988628815');  
        // 添加facebook代码开始
        fbq('track', 'ViewContent', {
            'content_name': product_data.products_name,
            'content_category': product_data.master_categories_id,
            'content_ids': product_data.products_id,
            'value': product_data.products_price,
            'product_catalog_id': '938382529614001',
            'content_type': 'product',
            'currency': 'USD'
        }); 
        // 添加facebook代码结束

        // 添加购物车
        $('.js-add-cart').click(function(){
            fbq('track', 'AddToCart', {
                'content_name': product_data.products_name,
                'content_category': product_data.master_categories_id,
                'content_ids': product_data.products_id,
                'value': product_data.products_price,
                'product_catalog_id': '938382529614001',
                'content_type': 'product',
                'currency': 'USD'
            }); 
        });
    }
