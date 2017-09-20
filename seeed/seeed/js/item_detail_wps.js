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
        // console.log(json)
        if(json.errorcode == 0){
            //请求成功
            
            //赋值基本属性
            products_name               = json.data.products_name,
            products_description        = json.data.products_description,
            products_price              = parseFloat(json.data.products_price),
            predict_shipment_date       = json.data.predict_shipment_date,
            products_quantity_order_max = json.data.products_quantity_order_max,
            products_quantity_order_min = json.data.products_quantity_order_min,
            product_stock               = json.data.product_stock,
            products_image              = baseURL+json.data.products_image;
            products_ladder_price       = json.data.ladder_price;  
            products_model              = json.data.product_model; 
            
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
            $description = $('.description'),
         _shop_list_html = '',          //addwps 组合商品
            $comb_box    = $('.comb_box'),
       _base_skind_html  ='';
       _base_code_html   ='';
          
        //0.商品编码
                _base_code_html='SKU:'+data.products_model; 
                $('.infoCoding .sku').append(_base_code_html); 
             
        //1.判断是否为阶梯价，是按照阶梯价组织html，否，按照单一价组织html
        getLadderData(p_id, function(json){
            // console.log(json);
            if(json.errorcode ==0){
                $(json.data).each(function(){
                    //最后一个不添加下划线
                    // var _b_line = e== (json.data.length-1)*1?'':'bottom-line';
                    _ladder_html+= 
                       '<li>'+
                         
                           '<span class="num">$'+parseFloat(this.ladder_price)+'</span><span class="f11 ml5">/EACH</span>'+
                           '<span class="fr"><span class="pcs">'+this.ladder_start_count+'</span>PCS</span>'+
                       '</li>';
                });
                // $info.addClass('stair-price');
                $('.ladder_drop').append(_ladder_html);
                
            }
            
            //无阶梯价
            if(json.errorcode == 3){
                isladder = '';
                $('.ladder').hide();
            }
            
            
            //显示基础信息
            addBaseInfo();
            _side_html = $info.html();
            //console.log(_side_html)
            //添加字符串到快捷操作
            $('.quick-bar').append(_side_html).find('.btn').css('display','block').end()
                .find('.js-add-cart').removeClass('ml20').addClass('mt10').end()
                .find('.btn-default').addClass('mt10').end()
                .find('.stock').remove().end();
                /*.show();*/
            $info.show();
        });
        
        //2. 判断是否有style
        getProductStyleData(p_id, function(json){
            
            if(json.errorcode == 0){
                $(json.data).each(function(){
                    //商品类型
                    _base_skind_html+=
                      '<li data-id="'+this.product_id+'">'+this.value+'</li>';
                      
                });
                //console.log(_style_html);
                $('.js-style').append(_style_html);
                $('.option-view-style').removeClass('hide');
                $('.skind').append(_base_skind_html);
                $('.skind li:first').addClass('selected');
             
  
            }
            else{
                $('.pro_style').addClass('hide')
            }
        });
          //选择地区
          getAreaData(function(json){
            var selected = '';
            if(json.errorcode == 0){
                 $(json.data).each(function(){
                     selected = this.product_id == p_id?'selected':'';
                    _style_html += '<option value="'+this.countries_name+'" selected='+selected+'>'+this.countries_name+'</option>';

                 });
                  $('.js-style').append(_style_html);
            }
            else{
                  $('.pro_delivery').hide();
            }

          });
        //2.组织基础内容
        function addBaseInfo(){
            var _base_info_html = 
                '<h1 class="title">'+data.products_name+'</h1>'+
                        /*'<span class="sku f12 ml15">SKU '+data.sku+'</span>'+*/
                    // '</div>'+
                    '<div class="product_cell price-view clear rel ">'+
                        '<span class="price fl">PRICE:'+'</span><b><i>USD ▼</i>$'+parseFloat(data.products_price)+'<b><s>$'+parseFloat(data.products_price+data.discount_price)+'</s>'+
                        // '<div class="sale-tips rel fl ml10">Save: 30%<i class="l-arr f16 fa fa-caret-left abs"></i></div>'+
                    '</div>';
            
            //组织按钮
            //backorder 补售
            if(product_stock == 'backorder'){
                //邮件通知
                $('.js-stock-text').text();
            }
            
            //perorder  预售
            if(product_stock == 'preorder'){
                _btn = '<a href="#" class="btn btn-default js-add-cart">PER-ORDER</a><a href="#" class="btn btn-confirm js-add-cart ml20">ADD TO CART</a>';
                $('.js-stock-text').addClass('hide');
                
                $('.out-stock').append('<div class="c-9b ">OUT OF STOCK</div><div class="f-os-sb">will ship on '+data.product_stock_data.reach_date+'</div>').show();
            }
            
            //backorder 补售
            if(product_stock == 'backorder'){
                $('.js-stock-text').addClass('hide');
                _btn = '<a href="#" class="btn btn-default js-add-cart">BACKORDER</a><a href="#" class="btn btn-confirm js-add-cart ml20">ADD TO CART</a>';
                $('.out-stock').append('<div class="c-9b ">OUT OF STOCK</div><div class="f-os-sb">will ship on '+data.product_stock_data.reach_date+'</div>').show();
            }
            //没货
            if(product_stock == 'outstock'){
    //                _btn = '<a href="javascript:void(0);" class="btn btn-disbale ml20">OUT OF STOCK</a>';
                    //将buy it now 暂时替换成js-add-cart
                    //_btn = '<div class="inline-block"><a href="javascript:void(0);" class="btn btn-light">OUT OF STOCK</a></div>';
                _btn = '';
                //not enough items in stock
                $('.js-stock-text').text('OUT OF STOCK').css('margin-left',0);
                $('.pro_count').addClass('hide');
                $('.pro_delivery').addClass('hide');
            }
            
            //in stock 正常销售
            if(product_stock == 'instock'){
                //将buy it now 暂时替换成js-add-cart  <div class="inline-block buy_btn"><a href="#" class="btn btn-default js-add-cart">BUY IT NOW</a></div>
                 _btn = '<div class="buybox_btn"><div class="inline-block buy_btn"><a href="#" class="btn btn-confirm js-add-cart ml20 add_confirm">ADD TO CART</a></div></div>';
                $('.js-stock-text').text('');
                 
            }
                   
            
            
            //取得主图
            $info.hide().append(_btn).prepend(_base_info_html);
            
        };
        
        /*组织正文内容*/
        $description.find('.des-con').hide().append(data.products_description).show();//description
        $description.find('.cmit-con').hide().append('<p>No relevant information</p>');//commit
        $description.find('.blog-con').hide().append('<p>No relevant information</p>');//blog
        $description.find('.rec-con').hide().append('<p>No relevant information</p>')//recipe
        //组织侧边栏-商品推荐

        /*组织*/
        getRelationProductData(p_id, function(json){
           //成功
            // console.log(json);
            if(!json.errorcode){
                //console.log('加载推荐商品完成');
                $(json.data).each(function(){
                    _need_html += 
                        '<li><img src="'+this.products_image+'"><p class="f12">'
                        +this.products_name
                        +'<em>$'+this.products_price
                        +'</em></p>'+'</li>'
                });
                //console.log(_need_html);
                $('.same_list ul').append(_need_html);
            }
            else{
                $('.same_list').addClass('hide');
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
                    '<li><img src="" data-src="'+this.src+'" class="item"></li>';
            });
            $('.big-img').hide().attr('src', products_image).attr('data-big', products_image).fadeIn(200);
            $('.thumb').hide().empty().append(_img_list).find('.item').each(function(e){
                if(e>0){
                    var $this    = $(this),
                    data_src = $this.attr('data-src');
                    $this.attr('src', baseURL+data_src+'_82x82.jpg');
                } 
            });
            $('.thumb').fadeIn(200);
            
            //hover显示大图
            $('.thumb ').on('mouseover', '.item', function(){
                var $this    = $(this),
                    $big     = $('.big-img'),
                    index    = $this.parent().index(),
                    data_src = $this.attr('data-src');
                if(index == 0){
                    $big.attr('src',products_image).attr('data-big',products_image);
                }else{
                    $big.attr('src', baseURL+data_src+'_640x480.jpg').attr('data-big',baseURL+data_src+'_880x660.jpg');  
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
        //4.商品组合
            getRelationProductData(p_id,function(json){
        	if(!json.errorcode){
        	$(json.data).each(function(){
             _shop_list_html=
                                '<li class="item">'
                                +'<a href="'+this.products_id+'" title="" target="_blank" class="">'
                                +'<img src="'+this.products_image+'" alt="">'
                                +'<div class="name">'+this.products_name+'</div>'
                                +'<div class="price c-0d f12">$'+this.products_price+'</div>'
                                +'</a></li>';
        	});
        	     $('.lbbox').append(_shop_list_html);

        	 }
             else{
                $('.lb_com').addClass('hide');
             }
        });
            
        

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
    //获取商品库存
    function getProductStock(p_id,callback) {
        var apiURL = apiRoot+'index.php?r=admin/products/product/get-stock',
            param  = 'product_id='+p_id; 
        startAjax(apiURL, param, function(json){
            callback(json);
        });
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
        // $.checkNotNull('blur', '.js-quantity');
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
                // p_id  =$this.val(),
                $qty  = $('.js-quantity'),
                predict_quantity = $qty.val();
            

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
              
               //加入购物车
                addDataToCart(p_id, predict_quantity, function(json){
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
                        
                        // location.href = 'cart_detail.html';
                    }else {
                        //处理错误情况
                        alert(222)
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
        var movew = $(".thumb_small ul li:first").outerWidth()+10+'px';
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
        //点击向上一张滚动
        $('.sprev_btn').on('click',function(){
            $(".thumb_small ul li:first").stop(true).animate({"margin-left":-movew},1000,function(){
            $(this).css("margin-left",10+'px').appendTo($(".thumb_small ul"));   
            });
        });
        //点击向下一张滚动  
        $('.snext_btn').on('click',function(){
            $(".thumb_small ul li:last").prependTo($(".thumb_small ul"));
            $(".thumb_small ul li:first").css("margin-left",-movew).animate({"margin-left":10+'px'},1000,function(){
            });
        })


    };   
   
     /*
     * list tab1
     */
         $(".res-tab li").click(function(){
         $(this).addClass("on").siblings().removeClass("on"); 
         var index=$(this).index(); 
         $(".res-con > div").eq(index).show().siblings().hide(); 
         });

         $(".des_right h3 span").click(function(){
         $(this).addClass("on").siblings().removeClass("on"); 
         var index=$(this).index(); 
         $(".des-box > div").eq(index).show().siblings().hide(); 
         });
         
        //share show or hide
        $(".js-share").hover( 
        function(){ 
        $(this).find('i').show();
        },
        function(){
            $(this).find('i').hide();
        });
        // var _timeout;
        // $(".js-share").hover( 
        // function(){ 
        //       clearTimeout(_timeout);
        // $(this).find('i').show();
        // },
        // function(){
        //     _timeout=setTimeout(function(){
        //         // clearTimeout(_timeout);
        //     $(this).find('i').hide();
        // },500)
        //  });
    

        //阶梯价
        $('body').on('mouseover','.ladder',function(){
            // $(this).find('ul').toggle();
             $(this).find('ul').show();  
             
        });
        $('body').on('mouseout','.ladder',function(){
            // $(this).find('ul').toggle();
             $(this).find('ul').hide();  
             
        });


    /*
     * imgscroll
     */
       $(function(){
        var page=1;
        var i=3;
        var $p_Div=$(".scrollbox");
        var $picDiv=$(".res-simg");
        var picNum=$picDiv.children("ul").children("li").length;
        var page_count=Math.ceil(picNum/6);
        var $pDiv_w=$p_Div.width()+12;

    $(".right_btn").click(function(){
        if(page_count>page){
            $picDiv.animate({left:'-'+page*$pDiv_w+"px"},"normal");
            page++;
            $(".left_btn").css({'background':' url(../img/slider.png) -26px -204px'});
            if(page>=page_count){
                $(this).css({'background':' url(../img/slider.png) 0px -204px'});
            }else{
                $(this).css({'background':' url(../img/slider.png) 0px -204px'});
            }
        } 
          
    });
    
    $(".left_btn").click(function(){
        if(page>1){
            $picDiv.animate({left:"+="+$pDiv_w+'px'},"normal");
            page--;
            $(".right_btn").css({'background':' url(../img/slider.png) 0px -204px'});
            if(page<=1){
                $(this).css({'background':' url(../img/slider.png) -26px -204px'});    
            }else{
                $(this).css({'background':' url(../img/slider.png) -26px -204px'});
            }
        }
            
    });
        });

         //quantity add or sub
            $(function(){
            var qcount = $(".js-quantity");

            $(".pre_add").click(function(){    
                qcount.val(parseInt(qcount.val())+1)
                // if (parseInt(qcount.val())!=1){
                //     $('.pre_sub').attr('disabled',false);
                // }
                // setTotal();
            })  
            $(".pre_sub").click(function(){
                qcount.val(parseInt(qcount.val())-1);
                if (parseInt(qcount.val())<=1){
                    qcount.val(1);
                 
                }
                // setTotal();
            })
            // function setTotal(){
            //     $(".price").html((parseInt(qcount.val())*3.95).toFixed(2));//toFixed()是保留小数点的函数很实用哦
            // }  
            // setTotal();
        })
        //style selected
                $('body').on('click','.skind li',function(){
                $(this).addClass("selected").siblings().removeClass("selected");
                attrval=$(this).attr('data-id');
                apiRoot1 = baseURL;
                var apiURL= apiRoot + 'index.php?r=bazaar/products/products-attr-products/get-rel';
                //同步ajax
                $.ajax({
                type: "post",
                url: apiURL,
                data: 'product_id='+p_id,
                dataType: "json",
                success: function (json){
                    //库存跳转链接
                     if(!this.product_sort){
                     location.href=apiRoot1+'/item_detail_wps.html?p_id='+attrval;

                    }//库存不足
                     else if(this.product_sort == 1){
                        $('.theme-login').show();
                  
                    }//无库存
                     else if(this.product_stock == 0){
                 
                        $('.warning').show();
                    }else{
                        alert(111);
                    }
                    
                  }

                });
               
                
                 // location.href='http://www.sd.com/item_detail_wps.html?p_id='+attrval;
               
              });
       //store 弹框
        $('.theme-login').click(function(){
        $('.theme-popover-mask').fadeIn(100);
        $('.theme-popover').slideDown(200);
        $(".overlay").css("display","block");
        })
        $('.close').click(function(){
            $('.theme-popover-mask').fadeOut(100);
            $('.theme-popover').slideUp(200);
            $(".overlay").css("display","none");
        })


};
