 /**
 * @file main.js
 * @description 大促js
 * @author PC date 2016-02-20
 */


/*浮动效果*/
function floatPup(target, px, time){
    var $tar = $(target),
        old_top = $tar.css('top').replace('px',''),       //原本top值
        new_top = old_top*1+px*1;                     //浮动变top值
//    console.log('old_top:'+old_top+',new_top:'+new_top)

    setInterval(function(){
        var now_top = parseInt($tar.css('top').replace('px',''));
        
//        console.log('目前高度是：'+now_top);
//        console.log('原本高度是：'+old_top);
        
        if(now_top > old_top){
            $tar.css('top', old_top+'px');
        }else{
            $tar.css('top', new_top+'px');
        }
    }, time);
}

/*fixed chrome bgleft*/
function fixedChromeBgLeft(target){
    var bro = navigator.userAgent;
    if(bro.indexOf('AppleWebKit') > -1){
        //console.log('这是webkit浏览器');
        resetWebkitBgLeft();
        $(window).resize(function(){
            resetWebkitBgLeft();
        });
    }
    function resetWebkitBgLeft() {
        //解决1px偏移问题
        var w_width = $(window).width();
        if(w_width%2 == 1){
            $(target).css('left',-1);
        }else{
            $(target).css('left',0);
        }
    }
}

/*添加sns分享到页面*/
function addSnsShare(share_txt, share_url, share_title){
    var share_content = '<meta property="og:description" content="'+share_txt+'" />',
        share_url     = '<meta property="og:url" content="'+share_url+'" />',
        share_title   = '<meta property="og:title" content="'+share_title+'" />',
        share_img     = '<meta property="og:image" content="http://bazaar.seeed.cc/img/logo.png" />';
    $('head').append(share_content+share_url+share_title+share_img);
    $('body').append('<script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-56cd296a7dd8c33d"></script>');
    
}

/*重置sns位置*/
function resetSnsPosiiton(){
    var w_width = $(window).width(),
        right    = (w_width-1200)/2;
    $('.sns-share').css('right', right);
}

/*公共加载*/
$(function(){
    
    /*添加社交分享*/
    resetSnsPosiiton();
    $(window).resize(function(){
        resetSnsPosiiton();
    });
    var share_txt = 'Up to $100 OFF for Arduino, ESP8266, Raspberry Pi and more hot sellers for this Spring Sale. See more at '+window.location,
        share_url = window.location,
        share_title = $('title').text();
    addSnsShare(share_txt, share_url, share_title);
    
    /*透明化fixed bar*/
    $(window).scroll(function(){
        //console.log($(window).scrollTop());
        var scroll_top = $(window).scrollTop();
        if(scroll_top == 0){
            $('.header').css('opacity',1);
        }else{
            $('.header').css('opacity',0.9);
        }
    });
    
    /*添加faq*/
    
    // if($('.fusion-page').val() == 1){
    //     $.get('fusion-faq.html', function(result){
    //         $('body').append(result);
    //         showFaq();
    //         resetFaqPositon('.js-faq-content');
    //     });
        
    // }else{
    //     $.get('faq.html', function(result){
    //         $('body').append(result);
    //         showFaq();
    //         resetFaqPositon('.js-faq-content');
    //     });
    // }
    
    /*添加feedback*/
    $.get('feedback.html', function(result){
        $('body').append(result);
    });
    
    /*lazyload*/
    $('body').append('<script src="js/jquery.lazyload.min.js"></script>');
    $('.item-img').lazyload({
        effect : "fadeIn",
        placeholder: 'img/loading.gif',
        threshold: 200
    });

    
    /*重设窗口位置*/
    //resetFaqPositon('.coupon-alert');
    
//    $('body').append('');
//    复制代码
    
    
    //copyCode();
    
    $('.product-list').empty().load('list.html');
    
    //复制插件，完成复制功能
//    $('body').append('<script src="js/zclip/jquery.zclip.min.js"></script>');
    $('.coupon-alert').remove();
    var str = '<div class="coupon-alert fixed hidden"><a href="#" class="abs btn-close-alert js-clost-alert"></a><div class="coupon-dis abs clear"><p>1.Copy coupon code and paste to redeem the code while checking out your orders</p><p>2.Coupon codes: <span class="b">$5</span> : <span class="b c-b5">5seeedisback</span> ; <span class="b">$20</span> : <span class="b c-b5">20seeedisback</span> , <span class="b">$50</span> : <span class="b c-b5">50seeedisback</span> ;  <span class="b">$100 </span> : <span class="b c-b5">100seeedisback</span></p><p>3.Usage: $5 off on each order ; $20 off orders over $150; $50 off orders over $250 ;  $100 off orders over $350</p><p>4.The coupons are eligible for all bazaar items, excluding items of flash deals, clearance, OPL and special items</p><p>5.Expiration date: 3/31 11:59:59, 2016 EST</p><p>6.Each coupon can only be used for one order per one time</p><p>7.Coupon codes can not be used in conjunction with each other.</p><div class="js-copy-code al-c-code f22 mt20 b"></div><div class="js-copy-this btn-copy f22 mt10 cup">COPY CODE</div></div></div>';
    //<div class="js-copy-this btn-copy f22 mt10 cup">COPY CODE</div>
    $('body').append(str);


    /*加载复制插件*/
    $('body').append('<script src="js/zclip/jquery.zclip.min.js"></script>');
        $('.js-c-code').on('click', function(){
        var this_code = $(this).find('.code').text();
            copyCode(this_code);
        });
        
        $(".js-copy-this").zclip({
            path: "js/zclip/ZeroClipboard.swf",
            copy: function(){
//            return $(this).find('.code').text();  
            return $(this).parent().find('.js-copy-code').text();
            },
            beforeCopy:function(){/* 按住鼠标时的操作 */
                $(this).css("color","orange").text('COPIED');
                setTimeout(function(){
                    $('.coupon-alert').removeClass('showout').addClass('hidden');
                    $('.js-copy-this').css('color','#a0c93c').text('COPY CODE');
                },1000);
            },
            afterCopy:function(){}
        });
    
    
        $(".js-event").zclip({
            path: "js/zclip/ZeroClipboard.swf",     //引入swf路径
            copy: function(){
                //return 要复制的文本
                return $(this).parent().find('.js-copy').text();
            },
            beforeCopy:function(){/* 按住鼠标时的操作 */
                //完成copy之后的动作（如提示）
                //eg
                $(this).css("color","orange").text('COPIED');
            },
            afterCopy:function(){
                
            }
        });
    
    
        
        /*关闭优惠码弹出窗*/
        $('body').on('click', '.js-clost-alert', function(){
            $(this).parent().removeClass('showout').addClass('hidden');
            return false;
        });
})

/*
 * 大促 预热页面
 */
var salePreheat = function(){
    //执行气球动画
    floatPup('.js-b-1', 10, 1000);
    setTimeout(function(){ floatPup('.js-b-2', 10, 1000);},100);
    setTimeout(function(){ floatPup('.js-b-3', 10, 1000);},200);
    setTimeout(function(){ floatPup('.js-b-4', 10, 1000);},150);
    setTimeout(function(){ floatPup('.js-b-5', 10, 1000);},10);
    setTimeout(function(){ floatPup('.js-b-6', 10, 1000);},150);
    
    //重置faq位置
    resetFaqPositon('.js-faq-content');
    showPic();
    $(window).resize(function(){ 
        showPic();
    });
    
    function showPic(){
        if($(window).width() > 1878){
            $('.js-b-4').removeClass('hide');
        }
    }

    //针对webkkit背景居中进行hack
    fixedChromeBgLeft('.banner');

}

/*
 * fusion 大促页
 */
var fusion = function(){
    fixedChromeBgLeft('.f-banner');
}

/*
 * 主会场 main
 */
function main(){
    
    setTimeout(function(){ floatPup('.js-b-1', 10, 1000);},100);
    setTimeout(function(){ floatPup('.js-b-2', 10, 1000);},200);
    setTimeout(function(){ floatPup('.js-b-3', 10, 1000);},150);
    setTimeout(function(){ floatPup('.js-b-4', 10, 1000);},10);
    setTimeout(function(){ floatPup('.js-b-5', 10, 1000);},150);

    $('#flash-deal').find('.item-detail').each(function(e){
        var $this = $(this);
        if((e+1)%4 == 0){
            $this.css('margin',0);
        }
    });
    
    /*$('#off50').find('.item-detail').each(function(e){
        var $this = $(this);
        if((e+1)%4 == 0){
            $this.css('margin',0);
        }
    });*/
    
    
    
    fixedChromeBgLeft('.m-banner');
    
    /*判断库存*/
    isSoldOut('#flash-deal');
    isSoldOut('#50off');

    $(window).scroll(function(){
        var s_top = $(window).scrollTop();
        if(s_top > 300) {
            $('.m-nav').fadeIn(200);
        }else{
            $('.m-nav').fadeOut(200);
        }
    });
    
    $('body').on('click', '.js-nav', function(){
        var type = $(this).attr('data-type'),
            type_top = $('#'+type).offset().top-100;
        $("body").animate({scrollTop: type_top}, 500);
        return false;
    });
    
    $(window).scroll(function(){
        var s_top = $(window).scrollTop();
        if(s_top > 300) {
            $('.f-nav').fadeIn(200);
        }else{
            $('.f-nav').fadeOut(200);
        }
    });
    
    resetNavPo();
    $(window).resize(function(){
        resetNavPo();
    });
    
    
    
    //获取周闪购数据
    /*$.get('flash.json', function(json){
        var str = '';
        console.log(json);
        $(json).each(function(){
            str += '<div class="item-detail sku-'+this.sku+' rel"><a href="'+this.href+'" title="'+this.name+'"><div class="item-off mico abs"><div class="txt b">'+Math.round(this.discount*100)+'%OFF</div></div><div class="item-img-box"><img data-original="http://www.seeedstudio.com/depot/images/'+this.products_image+'" class=item-img></div><div class="item-info c-4e clear"><div class="title fl f18">'+this.products_name+'</div><div class="price b fr"><div class=discount>$'+this.sale_price+'</div><div>$'+this.flash_price+'</div></div></div><div class="tc item-buy-now" data-id="'+this.sku+'">BUY NOW<i class="mico ico-cart"></i></div></a></div>';
        });
        console.log(str);
    });*/
//                
//                //获取热销数据
//    $.get('hot.json', function(json){
//        console.log(json);
//        var str2 = '',
//            style= '';
//        $(json).each(function(e){
//            if((e+1)%4 == 0){
//                style = 'style="margin:0;"';
//            }else{
//                style = '';
//            }
//            str2 += '<div class="item-detail sku-'+this.sku+' rel" '+style+'><a href="'+this.href+'" title="'+this.name+'"><div class="item-off mico abs"><div class="item-off mico b"></div></div><div class="item-img-box"><img data-original="http://www.seeedstudio.com/depot/images/'+this.products_image+'" class=item-img></div><div class="item-info c-4e clear"><div class="title fl f18">'+this.products_name+'</div><div class="price b fr"><div>$'+parseFloat(this.product_price).toFixed(2)+'</div></div></div><div class="tc item-buy-now" data-id="'+this.sku+'">BUY NOW<i class="mico ico-cart"></i></div></a></div>';
//        });
//        console.log(str2);
//    });
}


/*显示faq*/
function showFaq(){
    //显示faq
    $('body').on('click', '.js-faq', function(){
        $('.js-faq-content').fadeIn(200);
        return false;
    });
    
    //关闭faq
    $('body').on('click', '.js-close', function(){
        $('.js-faq-content').fadeOut(200);
        return false;
    });
    
    //切换 tab
    $('.js-tab').on('click', 'a', function(){
        var $this = $(this),
            index = $(this).index();
        $this.addClass('selected').siblings().removeClass('selected');
        $('.js-tab-box').eq(index).fadeIn(100).siblings('.js-tab-box').hide();
        return false;
    });
    
}

/*重设faq窗口大小*/
function resetFaqPositon(target){
    var window_width = $(window).width(),
        $faq = $(target),
        faq_width = parseFloat($faq.width());

    if( window_width > faq_width ){
        var left = parseFloat((window_width-faq_width)/2);
        //console.log(left)
        $faq.css('left', left);
    }
    if( window_width <= 1200 ){
        var left = parseFloat((1200-faq_width)/2);
        $faq.css('left', left);
    }
    
    //针对1280*800(13'MBP)调整窗口位置
    var window_height = $(window).height();
    if(window_height <= 800){
//        console.log(window_height);
        $('.js-faq').css('top',450);
        $('.js-faq-content').addClass('small-faq-content');
        $('.js-faq-content').find('.js-small-box').addClass('small-content-box');
    }
    
    $(window).resize(function(){ 
        resetFaqPositon('.js-faq-content');
    });
    
}

//判断是否sold out
function isSoldOut(target){
    var sku_str = '';
    $(target).find('.item-detail').each(function(){
        var $this = $(this);
        sku_str += $this.find('.item-buy-now').attr('data-id')+',';
    });
    //console.log(sku_str);
    $.get('../index.php?main_page=AjaxModule&controller=Cart&action=getProduct&sku='+sku_str, function(result){
        var json = $.parseJSON(result);
        $(json).each(function(){
//            console.log(this.sku)
//            console.log(this.inStock);
            //判断是否
            if(!this.inStock){
                $('.sku-'+this.sku).addClass('js-sold-out')
                .append('<div class="sold-out-img abs b">SOLD OUT</div>');
            }
        });
    });
}

/*分会场*/
function fpage(){
    $('.f-nav').load('f_nav.html');
    $(window).scroll(function(){
        var s_top = $(window).scrollTop();
        //console.log(s_top);
        if(s_top > 300) {
            $('.f-nav').fadeIn(200);
        }else{
            $('.f-nav').fadeOut(200);
        }
    });
    resetNavPo();
    $(window).resize(function(){
        resetNavPo();
    });
    
    /*判断库存*/
    isSoldOut('.item-list');
    
    $('.js-c-code').on('click',function(){
        var this_code = $(this).find('.code').text();
        copyCode(this_code);
    });
}
/*bramble导航*/
function fpage1(){
    $('.f-nav .js-nav_c').load('fb_nav.html');
    $(window).scroll(function(){
        var s_top = $(window).scrollTop();
        //console.log(s_top);
        if(s_top > 300) {
            $('.f-nav').fadeIn(200);
        }else{
            $('.f-nav').fadeOut(200);
        }
    });
    resetNavPo();
    $(window).resize(function(){
        resetNavPo();
    });
    
    /*判断库存*/
    isSoldOut('.item-list');
    
    $('.js-c-code').on('click',function(){
        var this_code = $(this).find('.code').text();
        copyCode(this_code);
    });
}

function resetNavPo(){
    var window_w = $(window).width(),
        nav_w    = 120,
        side_w = (window_w-1200)/2;

//    console.log('side_w='+side_w)
//    console.log('nav_w='+nav_w)

    if(side_w <= nav_w){
        $('.f-nav').css('right',-83);
        $('.f-nav').hover(function(){
            $('.f-nav').animate({'right':0},200);
        },function(){
            $('.f-nav').animate({'right':-83},200);
        });
    }else{
        $('.f-nav').css('right',230);
    }
}

function copyCode(code){
    $('.coupon-alert').find('.js-copy-code').text(code);
    //resetFaqPositon('.coupon-alert');
    var window_w = $(window).width(),
        left     = (window_w-580)/2;
    $('.coupon-alert').css('left',left).removeClass('hidden').addClass('showout');

}









