 /**
 * @file base_module.js
 * @description 提供网站整体基础资源
 * 公共head文件在 addBaseHead() _head 字段定义
 * 公共header资源： header.html
 * 公共footer资源： footer.html
 * 公共脚本在 addScript() _script 字段定义
 *
 * @author seeed-int date 2015-12-12
 */
;(function(){
    
    /*base head*/
    addBaseHead();
    
    $(function(){
        
        $('#header').load('../view/common/header.html',function(){
            
            //显示用户名
            /*var cookie_name = $.cookie('nick');
            if(cookie_name){
                $('.head-account').attr('href', 'my_account.html');
            }*/
            
            //组织导航菜单数据
            createNav();
            
            //首页导航栏特殊操作
            if($('#index').length){
                //console.log('这是首页');
                var $nav_list = $('.js-nav').find('.js-nav-list').clone();
                $('.js-banner-box').append($nav_list);
                $('.js-banner-box').find('.js-nav-list').css('top',0).show();
            }
            
            
            
            //浮动搜索栏
            fixedSearchBar();
            
            
            //全局搜索
            //globalSearch();
            
            //高亮一级导航
            $('.user-act').find('a').eq(0).addClass('active');
            
            //search操作
            $('#g-search').on('click', function(event){
                
                $('.search-result').slideDown(100);
                
//                if(event.type == 'blur'){
//                    console.log('hey');
//                    $('.search-result').hide();
//                }
            });
            
            /*$('.search-bar').on('mouseout', function(){
                $(this).find('.search-result').hide();
            });*/

            //更新购物车数量
            //updateCartNum('.js-cart-count');
            
            //判断是否在线
            isOnline(function(json){
                //console.log(json);
                if(json.errorcode==0){
                    if(json.data.is_online){
                        //在线
                        
                        //有firstname则显示firstnam
                        var user_name = json.data.firstname == '' ? 'Seeeder' : json.data.firstname;
//                        var user_name = '';
//                        if(json.data.firstname != ''){
//                            user_name = json.data.firstname;
//                        }
                        //更新url
                        var _user_state = 
                            '<div class="user-detail fl mr20 rel"><a href=my_account.html class="online user-avatar rel"><i class="user-ico ico rel mr5"></i>Hi,<span class=user-nick>'+user_name+'</span><div class="white-taps abs"></div></a><ul class="user-list js-user-list abs"><li><a href="'+baseURL+'/my_account.html#order" class="js-acc-li" data-type="order">Order History</a><li><a href="'+baseURL+'/my_account.html#address" class="js-acc-li" data-type="address">Address Book</a><li><a href="'+baseURL+'/my_account.html#personal" class="js-acc-li" data-type="personal">Personal Detail</a><li><a href="#" class=js-hc-logout>Log out</a></ul></div><div class="header-cart fl js-hc rel"><a href="'+baseURL+'/cart_detail.html" class="header-cart-btn rel"><i class="btn-cart ico"></i><span class="js-cart-count cart-count rel"></span><div class="white-taps abs"></div></a><div class="header-cart-detail abs js-hc-detail"><ul class="header-cart-list js-hc-list"><li><img src=../img/default_pic.png class="img fl"><a href="" class="link fl" title="">Grove - Starter Kit for Arduino</a><div class=fr><div class=price>$29</div><a href="#" class="js-remove c-9b" data-id="">Remove</a></div></ul><div class=total-bar><span class="mr5 js-item-count"></span>Items<span class="ml10 mr5">Total</span><span class="mr20 js-hc-total"></span><a href=cart_detail.html>View Detail</a></div></div></div>';
                        
                        //更新个人中心
                        $('.js-user-bar').empty()
                            .append(_user_state);
                    }else{
                        var _user_login = '<div class="fl header-login"><a href="'+baseURL+'/login.html" class=js-login>Login</a>|<a href="'+baseURL+'/register.html" class=js-reg>Sign up</a></div><div class="header-cart fl js-hc rel"><a href="'+baseURL+'/cart_detail.html" class="header-cart-btn rel"><i class="btn-cart ico"></i><span class="js-cart-count cart-count rel"></span><div class="white-taps abs"></div></a><div class="header-cart-detail abs js-hc-detail"><ul class="header-cart-list js-hc-list"></ul><div class=total-bar><span class="mr5 js-item-count"></span>Items<span class="ml10 mr5">Total</span><span class="mr20 js-hc-total"></span><a href=cart_detail.html>View Detail</a></div></div></div>';
                        $('.js-user-bar').empty().append(_user_login);
                    }
                    
                    //加载头部购物车
                    addHeaderCart();
                }
            });
            
            //为所有注册操作添加url记录
            $('body').on('click', '.js-reg', function(){
                recoveryLocation(window.location.href);
                return true;
            });
            
            //导航高亮样式
            $('.user-act').on('click', '.item', function(){
                $(this).addClass('active').siblings('.item').removeClass('active');
            });
            
            //edit by wps @2016-05-17 添加顶级导航下拉菜单 start
            // 鼠标移动到含有下拉菜单的li标签上时
            $('.user-act .nav_hov').hover(function() {
                $(this).addClass('user-snav');
                $(this).find('ul.subnav').stop().show();
                $(this).find('.white').show();
            }, function() {
                $(this).removeClass('user-snav');
                $(this).find('ul.subnav').stop().hide();
            }); 


        });
        
        //关闭搜索
        $(document).on('mouseup', function(e){
            var $con = $('.search-result');
            if(!$con.is(e.target) && $con.has(e.target).length === 0){
                $con.hide();
              }
        });
        
        $('#footer').load('../view/common/footer.html');
        
        /*add script*/
        //addScript();
        
        //菜单操作
        navAction();
        
        //add body padding-top
        //$('body').addClass('header-top');
        
        //isOnline, set account link
        
        
        //update cart num
        //updateCartNum();
        
        

        //全局高亮输入框样式
        $('body').on('focusout focusin','.input',function(event){
            var $this = $(this);
            if(event.type == 'focusout'){
                $this.css('border-color','#f1f1f1');
            }
            if(event.type == 'focusin'){
                $this.css('border-color','#4a4a4a');
            }
        });
        
        //执行搜索
        doSearch();
        
        /*add GA*/
        addGaCode();
        
        //接入返回顶部按钮
        backToTop(1000);

    })
    
    /**
     * baseHead
     *
     * html页面头部
     *
     * @param    void
     * @returns  void
     *
     * @date     2014-12-12
     * @author   PC<pengcheng.kong@seeed.cc>
     */
    function addBaseHead() {
        var _head = 
            '<meta charset="utf-8">'+
            '<meta http-equiv="X-UA-Compatible content="IE=edge,chrome=1">'+
            '<meta name="viewport content="width=device-width, intial-scale=1.0, minimun-scale=1.0, maxmun-scale=1.0, user-scalable=1.0">'+
            '<title>Seeed Studio Bazaar, Boost ideas, Extend the Reach</title>'+
            '<meta name="keywords" content="Arduino, Raspberry Pi, 3D Printers，Seeed distributor, Open hardware">'+
            '<meta name="description" content="Electronic modules for makers to DIY projects. Fusion PCB, Laser-cutting, 3D printing & drop shipping services for makers in prototyping & production at Seeedstudio.com.">'+
            '<link rel="shortcut icon" href="favicon.ico">'+
            '<link rel="stylesheet" href="../css/lib/reset.css">'+
            '<link rel="stylesheet" href="../fonts/font-awesome-4.5.0/css/font-awesome.min.css">'+
            '<link rel="stylesheet" href="../css/lib/public.css">'+
            '<link rel="stylesheet" href="../css/main.css">'+
            '<link rel="stylesheet" href="../css/animate.css">'+
            '<!--[if lt IE9]><script src="../js/plugin/html5shiv.js"></script><![endif]-->';
        var $cmodules = '<script src="../js/lib/public_module.js"></script>';
        $( "head" ).append( $cmodules );
        $("head").prepend(_head);
    }
    
    /**
     * addScript
     *
     * 加载通用脚本
     *
     * @param    void
     * @returns  void
     *
     * @date     2015-12-12
     * @author   PC<pengcheng.kong@seeed.cc>
     */
    //function addScript() {
    //    var _script = '';
    //    $(_script).insertAfter('#footer');
    //}
    
    /**
     * addGaCode
     *
     * 加载GA统计代码
     *
     * @param    void
     * @returns  void
     *
     * @date     2016-03-20
     * @author   PC<pengcheng.kong@seeed.cc>
     */
    function addGaCode(){
        $.get('../view/common/gacode.html', function(data){
           $('head').append(data); 
        });
//        $('body').prepend(_ga);
    }
    
    /*
     * 创建nav菜单
     */
    function createNav(){
        
        var _nav =  '',
            _child_link = [],         //子链接数组
            _child_rels = [],        //子商品图数组
            nav_li_count = 0,
            _nav_is_hide = '',
            _nav_btn_more = '';

        var api = apiRoot+'index.php?r=bazaar/adv/adv/optionations',
            param = 'type=index_view';

        startAjax(api, param, function(json){
            //console.log(json);
            if(json.errorcode == 0){
                
                nav_li_count = json.data.length;
                
                $(json.data).each(function(e){
                    
                    _child_link[e] = '';    //必须先将下标的数据初始化，否则会出现undefined
                    
                    //组织子链接
                    $(this.child).each(function(){
                        _child_link[e] += '<a href="item_list.html?category='+this.categories_id+'" class="cate-link" target="_blank">'+this.categories_description+'</a>';
                    });

                    //处理方法2
//                    var _link_temp = '';
//                    for( i in this.child){
//                        _link_temp += '<a href="item_list.html?category="'+this.child[i].categories_id+' class="">'+this.child[i].categories_name+'</a>';
//                    }
//                    _child_link[e] = _link_temp;
                    
                    
                    //组织子图，等待数据
                    $(this.rels).each(function(){
                        _child_rels[e] += '<a href="" class="item"><img src="../img/index_data/top_picks/top3.jpg" alt=""></a>';
                    });
                    
                    //处理超出li
                    if(e >9){
                        _nav_is_hide = 'hide';
                        _nav_btn_more = '<a class="btn-more tc js-nav-more" data-state="0">More <i class="fa fa-angle-down"></i></a>';
                    }
                    if (this.detail.operations_url == null) {
                        this.detail.operations_url = '#';
                    }
                    _nav += 
                        '<li class="js-nav-li '+_nav_is_hide+'">'+
                            '<a href="'+this.detail.operations_url+'" class="item" target="_self"><i class="sn-ico sn-01"></i>'+this.detail.operations_name+'<i class="fa fa-angle-right"></i></a>'+
                            '<div class="nav-item-content abs js-nav-item clear f14">'+
                                '<div class="fl nav-child-link">'+_child_link[e]+
//                                    '<a href="" class="">Seeed</a>'+
                                '</div>'+
                                '<div class="fl nav-child-rels">'+/*_child_rels[e]+*/
//                                    '<a href="" class="item"><img src="../img/index_data/top_picks/top3.jpg" alt=""></a>'+
                                '</div>'+
                            '</div>'+
                        '</li>';
                });
                
                _nav += _nav_btn_more; 
                //console.log(_child_link);
                //console.log(_child_rels);
                
                //console.log(_nav);
                // $('.js-nav-list').empty().append(_nav);
                $('.js-nav-list').append(_nav);
                
                $('.js-nav-list').on('click', '.js-nav-more', function(){
                    var $this = $(this),
                        $parent = $this.parent(),
                        this_state = $this.attr('data-state');
                    if(this_state == 0){
                        //展开
                        $this.find('.fa').removeClass('fa-angle-down').addClass('fa-angle-up');
                        $this.attr('data-state',1);
                        $parent.find('li').each(function(e){
                            //设置右侧子菜单高度
                            if(e>9){
                                $(this).find('.js-nav-item').css('margin-top', 160);
                                $(this).slideDown(200);
                            }
                            if(e>14){
                                $(this).find('.js-nav-item').css('margin-top', 420);
                                $(this).slideDown(200);
                            }
                            
                        });
                        
                    }
                    if(this_state == 1){
                        //关闭
                        $this.find('.fa').addClass('fa-angle-down').removeClass('fa-angle-up');
                        $this.attr('data-state',0);
                        $parent.find('li').each(function(e){
                            if(e>9){
                                $(this).slideUp(200);
                            }
                        });
                    }
                    
                    return false;
                });
                //处理超出长度
//                if(nav_li_count > 10){
//                    alert('超出了');
//                    $('.js-nav-li').each(function(e){
//                        var $this = $(this);
//                        if(e>10){
//                            $this.hide();
//                        }
//                    });
//                }
           
                //如果是首页，执行高度判断，超出banner高度后，实现nav hover功能
                if($('#index').length){
                    var $nav_list = $('.js-nav').find('.js-nav-list').remove(),
                        nav_height = $('.main-nav').height(),
                        shop_nav_height = $('.js-shop-nav').height(),
                        banner_height = $('.js-banner-box').height(),
                        total_height = nav_height*1+shop_nav_height*1+banner_height*1;
                    $(window).scroll(function(){
                        var scroll_top = $(window).scrollTop();
                        if(scroll_top > total_height){
                            $('.js-nav').append($nav_list);
                        }else{
                            $('.js-nav').find('.js-nav-list').remove();
                        }
                    });
                }
            }
        });
    }
    
    /*
     * 菜单操作
     */
    function navAction(){
        //显示菜单
        $('body').on('mouseover mouseout', '.js-nav', function(event){
            var $nav = $(this),
                $list = $nav.find('.js-nav-list'); 
                if(event.type == 'mouseover'){
                    $list.show();
                }
                if(event.type == 'mouseout'){
                    $list.hide();
                }
            });

        //显示子菜单
        $('body').on('mouseover mouseout', '.js-nav-li', function(event){
            var $this = $(this),
                $nav_content = $this.find('.js-nav-item');
            if(event.type == 'mouseover'){
                $this.addClass('on');
                $nav_content.show();
            }
            if(event.type == 'mouseout'){
                $this.removeClass('on');
                $nav_content.hide();
            }

            /*if(event.type == 'click'){
                return false;
            }*/
        });

        //显示子菜单
        $('body').on('click', '.nav-child-link', function(event){
            if(event.type == 'click'){
                //return false;
            }
        });
    }
    
    /*
     * 置顶搜索栏
     */
    function fixedSearchBar() {
        var $window = $(window),
            $shop_nav = $('.js-shop-nav'),
            shop_nav_top = $shop_nav.offset().top;
        //console.log(shop_nav_top);
        //计算右边距
        var window_width = $(window).width(),
            user_bar_fixed_right = 0;
        //console.log(window_width);
        if(window_width > 1200){
            user_bar_fixed_right = (window_width-1200)/2;
        }
        
        $window.scroll(function(){
            //fixed nav bar
            var scroll_top = $window.scrollTop();
            if(shop_nav_top < scroll_top){
                $('.js-banner-box').css('margin-top',41);
                $shop_nav.hide().addClass('js-nav-fixed').show();
                //fixed用户状态栏
                $('.js-user-bar').addClass('user-fixed').css('right',user_bar_fixed_right);
                
            }else{
                $('.js-banner-box').css('margin-top',0);
                $shop_nav.removeClass('js-nav-fixed');
                $('.js-user-bar').removeClass('user-fixed').css('right',0);
            }
            
        });
    }
    

    
    
})()

