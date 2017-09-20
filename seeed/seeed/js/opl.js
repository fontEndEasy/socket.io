 /**
 * @file opl.js
 * @description OPL功能
 * @author seeed-int date 2016-03-17
 */
var opl = function(){
    
    //需要字段
    var opl_data   = '',     //opl数据
        _list_html = '',    //选项列表
        _opl_html  = '',    //分类商品列表
        _all_opl_html = '', //所有商品列表
        $opl_list  = $('.js-opl-content-list'),
        $opl_filter = $('.js-opl-list'),
        current_id  = 'all',    //当前显示id，默认all
        filter_list_height;     //选项高度
        
    
    /*
     * 渲染模板
     */
    getOPLDtaa(function(json){
//    $.get('opl.json', function(json){
        
        //请求数据成功
        if(json.errorcode == 0){
            opl_data = json.data;
            console.log(json);

            //渲染OPL数据
            creatOPL();
        }
        
        //请求数据失败
        if(json.errorcode == 3){
            //失败处理
        }
        
    });
    
    //渲染数据
    function creatOPL(){
        //console.log(opl_data);
        _list_html = '<li data-type="all" class="on">ALL</li>';
        _all_opl_html += 
                    '<table class="table opl-list" id="all">'+
                        '<tr class="title">'+
                            '<th class="o-item">Item</th>'+
                            '<th class="o-sku">Seeed SKU</th>'+
                            '<th class="o-part">Mfr. Part#</th>'+
                            '<th class="o-pack">Package</th>'+
                            '<th class="o-price">Price/set</th>'+
                            '<th class="o-qu">Quantity</th>'+
                            '<th></th>'+
                        '</tr>'+
                        '<tr class="search-bar">'+
                            '<td><input type="text" class="js-s-item"></td>'+
                            '<td><input type="text" class="js-s-sku"></td>'+
                            '<td><input type="text" class="js-s-part"></td>'+
                            '<td><input type="text" class="js-s-pack"></td>'+
                            '<td></td><td></td><td></td>'+
                        '</tr>';
        
        $(opl_data).each(function(){
            
            if(this.count != 0){
                //组织选项
                var this_id = (this.name).replace(' ','-'); //将空格用-代替
                _list_html += '<li data-type="'+this_id+'">'+this.name+'</li>';
                
                
                //组织表格
                _opl_html += 
                    '<table class="table opl-list" id="'+this_id+'">'+
                        '<tr class="title">'+
                            '<th class="o-item">Item</th>'+
                            '<th class="o-sku">Seeed SKU</th>'+
                            '<th class="o-part">Mfr. Part#</th>'+
                            '<th class="o-pack">Package</th>'+
                            '<th class="o-price">Price/set</th>'+
                            '<th class="o-qu">Quantity</th>'+
                            '<th></th>'+
                        '</tr>'+
                        '<tr class="search-bar">'+
                            '<td><input type="text" class="js-s-item"></td>'+
                            '<td><input type="text" class="js-s-sku"></td>'+
                            '<td><input type="text" class="js-s-part"></td>'+
                            '<td><input type="text" class="js-s-pack"></td>'+
                            '<td></td><td></td><td></td>'+
                        '</tr>';
                
                $(this.data).each(function(){
                
                    var _stock_state = this.product_stock_data == 0?'<span class="c-9b">OUT STOCK</span>':'<input type="text" class="js-quan s-input tc" value="1"><a href="#" class="js-add-opl btn-confirm btn-add-opl" data-id="'+this.products_id+'">ADD TO CART</a>',
                        _check  = this.product_stock_data == 0 ? '':'<i class="fa fa-square-o"></i><input type="checkbox" class="hide js-select-this">';
                    _opl_html += 
                        '<tr>'+
                            '<td class="clear">'+
                                '<img src="http://www.seeedstudio.com'+this.products_image+'" alt="" class="thumb fl mr10">'+
                                '<div class="fl info">'+
                                    '<a href="" class="name">'+this.products_name+'</a>'+
                                    '<div class="explain">by Heling Electronic</div>'+
                                    '<a href="'+this.opl_datasheet+'" class="pdf-link">Data Sheet</a>'+
                                '</div>'+
                            '</td>'+
                            '<td>'+this.products_model+'</td>'+
                            '<td>'+this.mpn+'</td>'+
                            '<td>'+this.opl_package+'</td>'+
                            '<td>$'+this.products_price*this.products_unit+'/Set</br>'+this.products_unit+' Pieces/Set</td>'+
                            '<td class="rel" data-stock="'+this.product_stock_data+'">'+_stock_state+
                            '</td>'+
                            '<td class="js-checkbox cup f16">'+_check+'</td>'+
                        '</tr>';
                    
                    //组织all字段
                    _all_opl_html += 
                        '<tr>'+
                            '<td class="clear">'+
                                '<img src="http://www.seeedstudio.com'+this.products_image+'" alt="" class="thumb fl mr10">'+
                                '<div class="fl info">'+
                                    '<a href="" class="name">'+this.products_name+'</a>'+
                                    '<div class="explain">by Heling Electronic</div>'+
                                    '<a href="'+this.opl_datasheet+'" class="pdf-link">Data Sheet</a>'+
                                '</div>'+
                            '</td>'+
                            '<td>'+this.products_model+'</td>'+
                            '<td>'+this.mpn+'</td>'+
                            '<td>'+this.opl_package+'</td>'+
                            '<td>$'+this.products_price*this.products_unit+'/Set</br>'+this.products_unit+' Pieces/Set</td>'+
                            '<td class="rel" data-stock="'+this.product_stock_data+'">'+_stock_state+
                            '</td>'+
                            '<td  class="js-checkbox cup f16">'+_check+'</td>'+
                        '</tr>';
                    
                });
                
                //得到分类opl商品字段
                _opl_html += '</table>';
            }
        });
        
        //得到all opl商品字段
        _all_opl_html += '</table>';
        
        //删除加载菊花
        //分别插入html
        $opl_list.append(_all_opl_html).append(_opl_html);
        //启用延时加载
        
        //显示左边数据-显示all选项
        $opl_filter.append(_list_html);
        filter_list_height = $opl_filter.height();
        
        //显示all选项
        $('#all').show();
        $('.js-opl-total').removeClass('hide');
        
        
    }
    
    /*
     * 业务
     */
    
    //非空判断
    $opl_list.on('keyup', '.js-quan', function(){
        var $this = $(this);
        if($this.val() == ''){ $this.val(1);}
        $.onlyNumber(this);
    });
    
    //切换选项
    $('.js-opl-list').on('click', 'li', function(){
        var $this = $(this),
            list_index = $this.index(),
            this_type = $this.attr('data-type');
        $this.addClass('on').siblings().removeClass('on');
        //$opl_list.find('.opl-list').eq(list_index).fadeIn(100).siblings('.opl-list').hide();
        //使用id的方式，提升速度
        $('.opl-list').hide();
        $('#'+this_type).fadeIn(100);
        current_id = this_type;     //更新当前id
        console.log(current_id);
        
        //切换的时候将all select取消
        $('.js-add-select-all').prop('checked', false);

    });
    
    //添加到购物车
    $opl_list.on('click', '.js-add-opl', function(){
        var $this = $(this),
            $this_td = $this.parent(),
            p_id  = $this.attr('data-id'),
            p_count  = $this.parent().find('.js-quan').val();
        
        console.log('OPL产品id是：'+p_id+'，数量是：'+p_count);
        
        $this.creatLoadingState({
            //设置默认参数
            'id':'js-adding-opl',
            'bgc':'#09694f',
            'removeclass':'js-add-opl',
            'text':'ADDING'
        });
        
        //添加到购物车
        var param = "pid="+p_id+"&qty="+p_count,
            add_apiURL = apiRoot+'index.php?r=bazaar/cart/default/add';
        
        startAjax(add_apiURL, param, function(json){
            console.log(json);
            //添加成功
            if(json.errorcode == 0){
                
                $this_td.find('#js-adding-opl').remove();
                //$this.show().text('ADDED');
                $this.show();
                $this_td.find('.js-add-scc').remove();
                $this_td.append('<span class="f12 c-9b js-add-scc abs" style="right:32px;">ADDED</span>');
                setTimeout(function(){
                    //$this.text('ADD TO CART');
                    $this_td.find('.js-add-scc').fadeOut(200);
                },3000);
            }
            //库存不足
            if(json.errorcode ==1){
                $this_td.find('#js-adding-opl').remove();
                $this.show();
            }
        });
        
        return false;
    });
    
    //checkbox选中
    $opl_list.on('click', '.js-checkbox', function(){
        var $this = $(this),
            $checkbox = $this.find('.js-select-this');
        if($checkbox.is(':checked')){
            $checkbox.prop('checked', false);
            $this.find('.fa').addClass('fa-square-o').removeClass('fa-check-square-o');
            //console.log('没选中');
        }else{
            $checkbox.prop('checked', true);
            //console.log('选中的');
            //更新图标
            $this.find('.fa').removeClass('fa-square-o').addClass('fa-check-square-o');
            //更新数值
            var pid = $this.prev().find('.js-quan').val(),
                pqty = $this.prev().find('.js-add-opl').attr('data-id');
            //console.log(pid+'-'+pqty);
            $this.attr('data-pid',pid);
            $this.attr('data-pqty',pqty);           
        }
    });
    
    //选中当前列表所有商品
    $('.js-add-select-all').on('click', function(){
        var $this = $(this);
         if($this.is(':checked')){
             //console.log('选中的');
             //将当前列表所有选项选中
             $('#'+current_id).find('.js-select-this').each(function(){
                 var $this = $(this),
                     $this_parent = $this.parent();
                 if($this.prop('checked') == false){
                     $this.prop('checked', true);
                     $this.parent().find('.fa').removeClass('fa-square-o').addClass('fa-check-square-o');
                     //$this.parent().click();
                     var pid = $this_parent.prev().find('.js-quan').val(),
                         pqty = $this_parent.prev().find('.js-add-opl').attr('data-id');
                         $this_parent.attr('data-pid',pid);
                         $this_parent.attr('data-pqty',pqty); 
                 }
             });
        }else{
            //console.log('没选中');
            //全部设置为灭选中
            $('#'+current_id).find('.js-select-this').each(function(){
                 var $this = $(this);
                 $this.prop('checked', false);
                 $this.parent().find('.fa').addClass('fa-square-o').removeClass('fa-check-square-o');
             });
        }
    });
    
    //添加当天所有选中的商品到购物车
    $('.js-add-select').on('click', function(){
        
        var $this = $(this),
            $this_list = $('#'+current_id),
            is_selected = false;        //是否有选中的产品
        
        $this_list.find('.js-select-this').each(function(){
            //遍历checkbox
            var $this = $(this),
                $parent = $this.parent();
            if($this.prop('checked') == true){
                
                
                console.log($parent.attr('data-pid'));
                console.log($parent.attr('data-pqty'));
                
                //更新flag
                is_selected = true;
                
                //取值后，取消选中状态
                $this.prop('checked', false);
            }
        });
        
        //这里需要一个添加多个到购物车的方法
        
        if(!is_selected){
            $this.next().addClass('shake').show();
            //2秒后消失
            setTimeout(function(){
                $this.next().removeClass('shake').fadeOut(300);
            },2000);
            return false;
        }
        
        $this.creatLoadingState({
            //设置默认参数
            'id':'js-adding-all',
            'bgc':'#09694f',
            'removeclass':'js-add-select',
            'text':'ADDING'
        });
        
        //成功后显示批量添加成功
        
        return false;
    });
    
    
    /*
     * 获取opl数据
     */
    function getOPLDtaa(callback){
        var apiURL = apiRoot+'index.php?r=bazaar/products/product-opl/list';
        startAjax(apiURL, '', function(json){
            callback(json);
        });
    }
}
