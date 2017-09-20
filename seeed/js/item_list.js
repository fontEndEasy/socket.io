 /**
 * @file item_list.js
 * @description 分类页功能
 * @author seeed-int date 2015-12-23
 */
/* Add new tips */
var itemList = function() {
    
    $('title').text('Seeed Shop,Boost ideas,Extend the Reach');
    
    //定义变量
    var keywords        = getQuery('keywords'),
        item_category   = getQuery('category'),     //分类名称
        item_num,                                   //一次获取数量
        offset  = 0,                                //查询次数
        orderBy = 1,                                //产品排序，可选参数
        _page_html      = '',                       //分页数据
        list_param,                                 //获取数据参数
        select_arr  = new Array(),                  //存放筛选条件数组
        list_apiURL = apiRoot+'index.php?r=admin/products/product/category-product',
        _is_keyword = '';
    
    select_arr.push(item_category);
    
    var addToBag_apiURL = apiRoot+'index.php?r=bazaar/cart/add';
    
    item_num = 12;       //一次获取12个
    
    /*判断是否为搜索结果 start */
    //console.log('关键字是：'+keywords);
    if(keywords){
        _is_keyword = '&keywords='+keywords;
    }
    /*判断是否为搜索结果 end */
    
    //组织可选参数
    getSubCategory(item_category, function(json){
        console.log(json);
        var _sub = '';
        //成功
        if(json.errorcode == 0){
            
            //if(json.data.length == 0){ }
            
            $(json.data).each(function(){
                _sub += '<li data-id="'+this.categories_id+'"><i class="fa fa-square-o mr5"></i>'+this.categories_name+'</li>';
            });
            //console.log(_sub)
            $('.choice-list').append(_sub).parent().removeClass('hide');
        }
        /*if(json.errorcode == 3){
            $('.choice-list').parent().hide();
        }*/
    });
    
    //展开比价
    $('.js-s-price').on('click', function(){
        var $price_block = $(this).parent().find('.price-block');
        if($price_block.is(':visible')){
            $price_block.slideUp(200);
        }else{
            $price_block.slideDown(200);
        }
    });
    
    //获取内容
    list_param = 'category='+select_arr+'&num='+item_num;
    getItemList(list_apiURL,list_param, orderBy,_is_keyword);
    
    addDomEvent();
    
    /*
     * 分类页banner 暂时隐藏
     */
    /*
    getBannerData(function(json){
        //console.log('分类页banner');
        console.log(json);
        var _banner_html = '';
        $(json.data).each(function(){
            _banner_html += '<div class="swiper-slide"><a href="'+this.banner_url+'" title="'+this.banner_name+'" target="_blank"><img src="'+baseURL+this.banner_photo[0]+'"></a></div>';
        });
        $('.swiper-wrapper').hide().append(_banner_html).show();
        //执行轮播
        createCarousel('#carousel-box', '.arr-left', '.arr-right', '.pagination', 3000);
        //console.log('执行完轮播');
    });
    
    function getBannerData(callback){
        var api = apiRoot+'index.php?r=admin/adv/adv-banner/get-adv-banner',
            param = 'showType=category-banner';
        startAjax(api, param, function(json){
            callback(json);
        });
    }
    */
    
    /*拿到该页面的banner*/
    /*function getBanner(){
        var api = apiRoot+'index.php?r=admin/adv/adv-banner/get-cate-adv-banner',
            param = 'banner_show=category-banner';
        startAjax(api, param, function(json){
            console.log(json)
        });
    }*/

    /**
     * 获取列表数据
     *
     * 根据参数获取列表数据
     *
     * @param    {string}   URL          api连接
     * @param    {string}   param        基础参数
     * @param    {int}      orderBy      排序条件
     * @param    {function} callback     回调
     * @returns  void
     *
     * @date     2014-11-29
     * @author   PC<pengcheng.kong@seeed.cc>
     */
    function getItemList(URL, param, orderBy, keyword, callback) {
        
        var _item_list_html = '',           
            $content_box    = $('.content-box');
            param           = param+'&orderBy='+orderBy+keyword;
        
        
        //加载菊花
        $content_box.creatLoadingState({
            'id':'js-loading',
//            'text':'LOADDING CONTENT',
            'text':'',      //不要文案
            'bgc':'#fff'
        });
        
        //显示页面
        $('.item-list').show();
        
        $('.paging').remove();
        
        startAjax(URL, param, function(json){     
            console.log(json);
            if(json.errorcode == 0){
                
                //如果是搜索结果，则显示
                if(keywords){
                    //显示搜索结果
                    $('.search-count').find('.js-result-count').text(json.data.count).end().find('.js-keyword').text(keywords).end().removeClass('hide');
                }
                
                //组织内容

                ga('create', ' UA-77925723-1');
                ga('require', 'ec');
                $(json.data.products).each(function(index){
                    
                    /*
                     * @params target: Analytics the balance of product
                     * @params ga directive : (adImpression)
                     * @params ga arguments : (product_id, product_name, categories_id, index)
                    */

                    ga('ec:addImpression', {
                      'id': this.products_id,                   // Product details are provided in an impressionFieldObject.
                      'name': this.products_name,
                      'category': this.categories_id,
                      'list': 'Search Results',
                      'position': index                     // 'position' indicates the product position in the list.
                    });
                    
                    //组织图片路径
                    var _image_url = '';
                    if(this.products_image.indexOf('upload')!= -1 ){
                        _image_url = imageRoot+this.products_image;
                    }else{
                        _image_url = imageRoot+'images/'+this.products_image;
                    }
                    
                    //判断组织库存按钮
                    var _have = this.warehouse == 0 ? '<a href="#" class="btn btn-disable" data-id="'+this.products_id+'">OUT OF STOCK</a>':'<a href="#" class="btn btn-add-basket js-add-basket" data-id="'+this.products_id+'">ADD TO CART</a>';  
                    _item_list_html += 
                        '<div href="" pid="' + this.products_id + '" pname="' + this.products_name + '" pcate="' + this.categories_id + '" class="item">'+
                            '<a href="item_detail.html?p_id='+this.products_id+'" title="'+this.products_name+'">'+
                                '<img src="'+_image_url+'" alt="'+this.products_name+'" class="item-img">'+
                                '<div class="item-name">'+(this.products_name).toUpperCase()+'</div>'+
                            '</a>'+
                            '<div class="item-price">$'+parseFloat(this.products_price)+'</div>'+_have+
                        '</div>';
                });
                
                ga('send', 'pageview');    
                //组织分页导航
                





                //如果没分页，则不显示
                
                if(json.data.pagination.length != 0){
                    _page_html = 
                        '<div class="mt20 mb20 fr paging f-os-l f12 hide clear">'+
                            '<a href="#" class="page-item" data-src="'+json.data.first+'"><i class="fa fa-angle-left"></i><i class="fa fa-angle-left"></i></a>'+
                            '<span class="page-prev cup fl"><i class="fa fa-angle-left"></i></span>';
                    console.log(json);   
                    //添加页码
                    $(json.data.displayPage).each(function(e){
                        //console.log(e);
    //                    var selected = json.data.active+1==this ? 'page-on':''; '+selected+'
                        _page_html += '<a href="#" class="page-item js-page">'+this+'</a>'
                    }); 
                     _page_html += 
                         '<span class="page-next cup fl"><i class="fa fa-angle-right"></i></span>'+
                            '<a href="#" class="page-item" data-src="'+json.data.last+'"><i class="fa fa-angle-right"></i><i class="fa fa-angle-right"></i></a>'+
                         '</div>';
                    $('.item-list__contnet').append(_page_html);

                    $('.paging').find('.js-page').each(function(){
                        var $this = $(this),
                            page  = $this.text();
                        if(page-1 == json.data.active){
                            $this.addClass('page-on');
                        }
                    });

                    //分页添加链接
                    var page_data = json.data.pagination;
                    for(var i in page_data){
                        $('.paging').find('.js-page').eq(i).attr('data-src','category='+select_arr+'&'+page_data[i]);
                    }
                    $('.paging').removeClass('hide');
                }
                
                //渲染数据到页面
                $content_box.hide().empty().append(_item_list_html);

                
                
                //$('.item-list__contnet').append(_page_html);
                
                //删除loading状态
                //setTimeout(function(){
                    $('#js-loading').remove();
                    $content_box.fadeIn(200);
                //},300);


                /*
                 * @params target: Analytics and Binding the click action of user. 
                 * @params name: onProduct : arguments(id);
                 * @params ga directive : (addProduct, setAction);
                 * @params ga arguments : (product_id, product_name, categories_id, index) 
                */
                $content_box.find('.item').each(function(index) {
                    $(this).on('click', function() {
                        var pid = $(this).attr('pid'),
                            pname = $(this).attr('pname'),
                            pcate = $(this).attr('pcate');

                            ga('ec:addProduct', {
                                'id': pid,
                                'name': pname,
                                'category': pcate,
                                'position': index
                            });
                            ga('ec:setAction', 'click', {list: 'Search Results'});

                          // Send click with an event, then send user to product page.
                            ga('send', 'event', 'UX', 'click', 'Results', {
                              hitCallback: function() {
                                document.location = 'item_detail.html?p_id=' + pid
                              }
                            });
                            return !ga.loaded;
                    });

                });
                
                //组织SEO三要素
                $("title").html(json.data.title);
                $("meta[name='keywords']").attr('content', json.data.keywords);
                $("meta[name='description']").attr('content', json.data.description);
                
                //回调
                if(callback) callback();
                
            }else {
                //处理出错情况
                //alert('没数据，提示并跳回首页');
                $('#js-loading').remove();
                $content_box.append('<div>No data now   </div>').show();
            }
            
            if(json.errorcode == 2) { alert('错误，并接上后续处理');}
        });
    }
  
    /*获取产品子分类*/
    function getSubCategory(category, callback){
        var api     = apiRoot+'index.php?r=admin/products/products-categories/sub-category',
            param   = 'category='+category;
        startAjax(api,param,function(json){
            callback(json);
        });
    }


    


    /*添加事件*/
    function addDomEvent(){
        
        //验证以及判断
        $('.js-min-value, .js-max-value').on('keyup blur focusin', function(event){
            $.onlyNumber(this);
            if(event.type == 'focusin'){
                $(this).parent().find('.warning').addClass('hide');
            }
        });
        $('.js-min-value').on('keyup blur', function(){
            
            var $this = $(this),
                t_val = $this.val(),
                max_val = $('.js-max-value').val();
            if(t_val==''&&max_val==''){
                $('.js-price-apply').addClass('not-apply');
            }else{
                $('.js-price-apply').removeClass('not-apply');
            }
            
        });
        $('.js-max-value').on('keyup blur', function(){
            var $this = $(this),
                t_val = $this.val(),
                min_val = $('.js-min-value').val();
            if(t_val==''&&min_val==''){
                $('.js-price-apply').addClass('not-apply');
            }else{
                $('.js-price-apply').removeClass('not-apply');
            }
        });
        
        //添加到购物袋
        $('.content-box').on('click', '.js-add-basket', function(){
           var $this = $(this),
               $parent = $this.parent(),
               p_id  = $this.attr('data-id'),
               param = "pid="+p_id+"&qty=1",
               add_apiURL = apiRoot+'index.php?r=bazaar/cart/default/add';
            
            //加载菊花
            $this.creatLoadingState({
                'id':'js-loading',
                'removeclass':'js-add-basket', 
            });
            
            startAjax(add_apiURL, param, function(data){
                //添加固定adding时间
//                setTimeout(function(){
//                },300);
                $parent.find('#js-loading').remove();
                $this.show();
                
                //console.log(data);
                if(data.errorcode == 0){
                    $parent.find('.js-add-scc').remove();
                    $parent.append('<span class="f12 abs js-add-scc">This Item has been added to your cart.</span>');
                    setTimeout(function(){
                        $parent.find('.js-add-scc').fadeOut(500);
                    },5000);
//                    updateCartNum('.js-cart-count');
                    addHeaderCart();
                }
            });
            return false;
        });
        
        //筛选
        $('.choice-list').on('click', 'li', function(){
            var $this   = $(this),
                t_id;
            
            //重置默认数组参数
            select_arr = [];
            
            if($this.hasClass('checked')){
                $this.removeClass('checked')
                    .find('.fa').removeClass('fa-check-square-o').addClass('fa-square-o');
            }else{
                $this.addClass('checked')
                    .find('.fa').removeClass('fa-square-o').addClass('fa-check-square-o');
            }
            
            //组织数组参数
            var checked_length = $('.choice-list').find('.checked').length;
            if(checked_length){
                $('.choice-list').find('li').each(function(){
                    if($(this).hasClass('checked')){
                        select_arr.push($(this).attr('data-id'));
                    }
                });
            }else{
                select_arr.push(item_category);
            }
            
            list_param = 'category='+select_arr+'&num='+item_num;
            getItemList(list_apiURL, list_param, orderBy,_is_keyword);
                     
        });
        
        //clear清空
        $('.js-clear').on('click', function(){
            $('.choice-list').find('li').each(function(){
                
                if($(this).hasClass('checked')){
                    $(this).removeClass('checked')
                        .find('.fa').removeClass('fa-check-square-o').addClass('fa-square-o');
                }
            });
            select_arr = [];
            list_param = 'category='+select_arr+'&num='+item_num;
            getItemList(list_apiURL, list_param, orderBy,_is_keyword);
            return false;
        });
        
        //筛选价格区间
        $('.js-price-apply').on('click', function(){
            
            var $this   =   $(this),
                $parent =   $this.parent(),
                $warning = $parent.find('.warning'),
                min_num =   $parent.find('.js-min-value').val(),
                max_num =   $parent.find('.js-max-value').val();
            
            //如果均为空，不可点
            if(min_num==''&&max_num==''){ return false;}

            if( max_num < min_num){
                $warning.text('Invalid price range, please try again').removeClass('hide').addClass('animated shake');
                return false;
            }
            
            /*获取价格筛选数据*/
            list_param = 'category='+item_category+'&num='+item_num+'&start='+min_num+'&end='+max_num;
            getItemList(list_apiURL,list_param, orderBy, _is_keyword);
            
            return false;
        });
        
        //分页操作
        $('.item-list').on('click', '.page-item', function(){
            var $this       = $(this),
                page_param  = $this.attr('data-src');
            
            console.log(page_param);
            
            if($this.hasClass('page-on')){ return false;} 
            //console.log(page_api);
            list_param = page_param;
            //返回顶部
            $('.back-to-top').click();
            getItemList(list_apiURL, list_param, orderBy, _is_keyword);
            return false;
        });
        
        //上下页操作
        $('.item-list__contnet').on('click', '.page-prev', function(){
            $(this).parent().find('.page-on').prev().click();
        });
        
        $('.item-list').on('click', '.page-next', function(){
            $(this).parent().find('.page-on').next().click();
        });
        
        //排序
        $('.item-list').on('change', '.js-order-by', function(){
            var $this   = $(this),
                by_id    = $this.val();
            orderBy = by_id;
            //获取内容;
            getItemList(list_apiURL,list_param, orderBy,_is_keyword);
        });
        
        $('body').on('focusout focusin','.com-input',function(event){
            var $this = $(this);
            if(event.type == 'focusout'){
                $this.css('border-color','#f1f1f1');
            }
            if(event.type == 'focusin'){
                $this.css('border-color','#4a4a4a');
            }
        });
        
        //登录记录路径
        $('body').on('click', '.js-login', function(){
            //console.log(window.location.href);
            recoveryLocation(window.location.href);
            return true;
        });
        
    }                     
}