 /**
 * @file index.js
 * @description 获取首页数据
 * @author seeed-int date 2016-01-18
 */

var loadIndex = function(){
    
    //变量
    
    var _item_html = '';
    
    //设置title
    $('title').text('Seeed Shop,Boost ideas,Extend the Reach');
    
    /*
     * 业务
     */

    //组织图片轮播数据
    getBannerData(function(json){
        //console.log(json);
        var banner_length = json.data.length,
            _banner_html = '';
        $(json.data).each(function(){
            _banner_html += '<div class="swiper-slide"><a href="'+this.banner_url+'" title="'+this.banner_name+'" target="_blank"><img src="'+baseURL+'/'+this.banner_photo[0]+'"></a></div>';
        });
        $('.swiper-wrapper').hide().append(_banner_html).show();
        //执行轮播，大于一张执行轮播方法
        if(banner_length > 1){
            $('.carousel').find('.arr').show();
            createCarousel('#carousel-index', '.carousel .arr-left', '.carousel .arr-right', '.pagination', 5000);
        }
        
    });           

    //组织广告位数据
    getBrandData(function(json){
        //console.log(json);
        if(json.errorcode == 0){
            //如无数据 则不显示
            
            //console.log(json.data);
            if(typeof(json.data) == 'undefined'){
                return false;
            }
            
            var _brand_html = '';
            $(json.data).each(function(){
                _brand_html += '<a href="'+this.brand_url+'" title="'+this.brand_name+'" target="_self" class="item"><img src="'+baseURL+'/'+this.brand_photo+'" alt=""></a>';
            });
            $('.brand-show').hide().empty().append(_brand_html).show();
        }
    });
    
    //组织商品数据
    getItemData(function(json){
        //console.log(json);
        //组织数据并接入页面
        if(json.errorcode == 0){
            $(json.data).each(function(){ _item_html += 
                    '<div class="item-block item-show clear">'+
                        '<div class=title>'+this.basic.item_name+'</div>'+
                            '<div class="block-outer item-4 clear">'+
                                '<div class="block-container clear">';
                $(this.product).each(function(e){
                    var _margin = '';
                    if( (e+1)%4 == 0){
                        //console.log(e);
                        _margin = 'style="margin-right:0;"';
                    }
                    _item_html += 
                            '<a href=item_detail.html?p_id='+this.product_detail.products_id+' class=item '+_margin+'>'+
                                '<div class="img-box">'+
                                    '<img src="'+baseURL+'/'+this.item_product_photo+'">'+
                                '</div>'+
                                '<div class=info>'+
                                    '<div class=name>'+this.item_product_name+'</div>'+
                                    '<div class=price>$'+$.formatFloatTo2(this.product_detail.products_price)+'</div>'+
                                '</div>'+
                            '</a>';
                });
                
                _item_html += '</div></div></div>';
            });
            
            $('.index-content').hide();
            $('.loading-block').remove();
            $('.js-banner-box').after(_item_html);
            $('.index-content').show();
        }

    });
    
//    switchImg('#top-picks','.item', 5, 300);
//    switchImg('#index-robo','.item', 5, 300);
//    switchImg('#index-wire','.item', 5, 300);
//    switchImg('#index-sp','.item', 3, 300);
    
    
    /*
     * Model获取数据
     */
    //获取图片轮播数据
    function getBannerData(callback){
        var api = apiRoot+'index.php?r=admin/adv/adv-banner/get-adv-banner',
            param = '';
        startAjax(api, param, function(json){
            callback(json);
        });
    }
    
    //获取广告牌数据 Brand数据
    function getBrandData(callback){
        var api     = apiRoot+'index.php?r=admin/adv/adv-brand/get-adv-brand',
            param   = '';
        startAjax(api, param, function(json){
            callback(json);
        });
    }
    
    //获取商品数据
    function getItemData(callback){
        var api = apiRoot+'index.php?r=admin/adv/adv-item/get-adv-item',
            param = 'itemNum=4&pageSize=12';
        startAjax(api, param, function(json){
            callback(json);
        });
    }
    
    /*
     * 图片切换插件
     */
    //图片切换问题
    function switchImg(container, target, count, speed){
        
        var $container  = $(container),
            $prev       = $container.find('.arr-left'),
            $next       = $container.find('.arr-right'),
            $target     = $container.find(target),
            $move_target= $container.find('.block-container'),      //移动目标
            block_length= $container.find(target).length,           //总共多少个图片
            t_width     = $target.width(),                          //单个图片长度
            roll        = Math.floor(block_length/count),           //总共可以滚动多少次
            flag        = 1;                                        //滚动第几次

        if($target.css('margin-right')){
            var mr_px = parseInt($target.css('margin-right')),
                pl_px = parseInt($target.css('padding-left')),
                pr_px = parseInt($target.css('padding-right'));  
            
            t_width = t_width+mr_px+pl_px+pr_px;
            
            //console.log('左边距是：'+mr_px+',左边距是：'+pl_px+',右内边距是：'+pr_px+',');
        }
        
        if(block_length == count) {
            $container.find('.arr').css('display','none');
            return false;
        }
        
        //console.log('单个长度是：'+t_width);
        //console.log('图片个数是：'+block_length+'，可以滚动：'+roll+'次'+'，单个图片长度是：'+t_width);
        
        //左点击
        $prev.on('click', function(){
            
            if($move_target.is(':animated')){
                return false;
            }
            
            if(flag == 1){
                $move_target.animate({'left': '0px'}, speed);
                return false;
            }else{
                --flag;
                var left = parseInt($move_target.css('left')),
                    move_px = left+count*t_width;
                //console.log('现在left的数值是：'+left+'，move_px是'+move_px);
                $move_target.animate({'left': move_px+'px'}, speed);
            }
            //console.log('flag是：'+flag);
            return false;
        });
        
        //右点击
        $next.on('click', function(){
            
            if($move_target.is(':animated')){
                return false;
            }
            
            if(flag >= roll){
                return false;
            }else{
                ++flag;
                
                var left = parseInt($move_target.css('left')/*.split('px')[0]*/),
                    move_px = left-(count*t_width);
                //console.log('现在left的数值是：'+left+'，move_px是'+move_px);
                $move_target.animate({'left': move_px+'px'}, speed);
            }
            return false;
        });
        
    }
    
 /* fusion start 
  *edit by Alice @2016-3-30
  */
 /*fusion 文字渐变*/
    // $('.js-set-fusion').hover(
    //     function(){
    //     $(this).find('.info').stop().animate({top:50,}, 500); 
    //     $(this).find('.c-fusion').css("display","block"); 
    //      },
    //      function(){ 
    //          $(this).find('.info').stop().animate({top:150},300); 
    //          $(this).find('.c-fusion').css("display","none");   
    //      });

/* fusion end*/
}
