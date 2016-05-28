 /**
 * @file public_module.js
 * @description 通用模块
 * @author seeed-int 2015-11-29
 */


/*全局基础路径*/
var baseURL     = '//'+window.location.host,
    apiRoot     = baseURL+'/seeed-cc/api/',
    imageRoot   = baseURL+'/';

// add ingrone content.
// 数据路径

/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
;(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try { 
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write

		if (value !== undefined && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setTime(+t + days * 864e+5);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {};

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];

		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');

			if (key && key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) === undefined) {
			return false;
		}

		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

}));


/**
 * ajax快速调用
 *
 * ajax_post封装
 *
 * @param    {string}  url     请求地址
 * @param    {data}    data    请求参数
 * @param    {function}  callback  回调
 * @returns  void
 *
 * @date     2014-11-29
 * @author   PC<pengcheng.kong@seeed.cc>
 */
function startAjax(url, data, callback) {
    $.ajax({
        type: 'post',
        url: url,
        data: data,
        dataType: 'json',
        success:function(json){
            if(callback) callback(json);
        },
        error:function(XMLHttpRequest, textStatus){
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
}


/**
 * 获取url参数值
 *
 * 获取url参数字段的值
 *
 * @param    {string}  name  参数名称
 * @returns  {string}  value
 *
 * @date     2014-11-29
 * @author   PC<pengcheng.kong@seeed.cc>
 */
function getQuery(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null){
          return unescape(r[2]);
     }else { return null;}
}


/**
 * 选项卡切换
 *
 * 选项卡点击切换操作
 *
 * @param  {string} trigger_element 触发元素
 * @param  {string} target_element  目标元素
 * @param  {string} on_class        高亮样式
 * @returns void 
 *
 * @date     2014-11-29
 * @author   PC<pengcheng.kong@seeed.cc>
 */
function switchTab(trigger_element, target_element, on_class) {
    $(trigger_element).on('click',function(){
        var $this = $(this),
            index = $this.index();
        $this.addClass(on_class).siblings(trigger_element).removeClass(on_class);
        $(target_element).eq(index).show().siblings(target_element).hide();
    });
}

/**
 * 幻灯片轮播
 *
 * 基于swiper2插件实现的轮播效果
 *
 * @param    {string}  target  使用目标
 * @param    {string}  prve    上一张
 * @param    {string}  next    下一张
 * @param    {string}  pagination   标示条
 * @param    {string}  time    切换时间
 * @returns  void
 *
 * @date     2014-11-29
 * @author   PC<pengcheng.kong@seeed.cc>
 */
function createCarousel(target, prve, next, pagination, time) {
    var mySwiper = new Swiper(target, {
        autoplay: time,
        pagination: pagination,
        loop: true,
        grabCursor: true,
        paginationClickable: true,
        speed: 2000
      })
    $(prve).on('click', function(e){
        e.preventDefault();
        mySwiper.swipePrev();
    });
    $(next).on('click', function(e){
        e.preventDefault();
        mySwiper.swipeNext();
    });
}

/**
 * elementBorderToggle
 *
 * 元素聚焦与失焦的边框颜色切换
 *
 * @param    {string} target 目标元素
 * @param    {string} focus_color  fouus色
 * @param    {string} focus_color  blur色
 * @returns  void
 *
 * @date     2015-12-12
 * @author   PC<pengcheng.kong@seeed.cc>
 */
function elementBorderToggle(target, focus_color, blur_color){
    //console.log('执行了');
    $(target).on('body', 'focus', function(){
        $(this).css('border-color', focus_color);
    });
    $(target).on('body', 'blur', function(){
        $(this).css('border-color', blur_color);
    });
} 

/**
 * getDate
 *
 * 获取日期加载框
 *
 * @param    {string} target      目标元素，必须是id，或者id的子元素类( '#id' or '#id .class')
 * @param    {boolen} full_time   是否显示时间（可空）
 * @param    {num}    later_days  多少天内可选（可空）
 * @returns  void
 *
 * @date     2015-12-15
 * @author   PC<pengcheng.kong@seeed.cc>
 *
 * 插件位置 js: /web/seeed/js/plugin/laydate/laydate.js
 *        css: /web/seeed/js/plugin/laydate/skins/molv/laydate.css
 */
function getDate(target,full_time,later_days){
    if(full_time) {
        laydate({
            elem: target,
            istoday: true,
            istime: true,
            format: 'YYYY-MM-DD hh:mm:ss',
            min: laydate.now()
        });
    }
    if(later_days) {
        laydate({
            elem: target,
            istoday: true,
            istime: true,
            format: 'YYYY-MM-DD hh:mm:ss',
            min: laydate.now(),
            max: laydate.now(+later_days)
        });
    }
    laydate({
        elem: target,
        istoday: true,
        min: laydate.now()
    });
}

/**
 * increaseBrightness
 *
 * 对颜色进行百分比处理
 *
 * @param    {string} hex       原始颜色（十六进制）
 * @param    {boolen} percent   百分比
 * @param    {string} hex       处理后的颜色
 * @returns  void
 *
 * @date     2015-12-15
 * @author   PC<pengcheng.kong@seeed.cc>
 *
 */
function increaseBrightness(hex, percent){
    // strip the leading # if it's there
    hex = hex.replace(/^\s*#|\s*$/g, '');

    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if(hex.length == 3){
        hex = hex.replace(/(.)/g, '$1$1');
    }

    var r = parseInt(hex.substr(0, 2), 16),
        g = parseInt(hex.substr(2, 2), 16),
        b = parseInt(hex.substr(4, 2), 16);

    return '#' +
       ((0|(1<<8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
       ((0|(1<<8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
       ((0|(1<<8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
}

/**
 * changeRGB
 *
 * 将RGB颜色转化为十六进制
 *
 * @param    {string} rgb  原始RGB颜色
 * @returns  {string} 十六进制颜色
 */
function changeRGB(rgb){
    var rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);  
    function hex(x) {  
      return ("0"+parseInt(x).toString(16)).slice(-2);  
    }  
    rgb = "#"+hex(rgb[1])+hex(rgb[2])+hex(rgb[3]); 
    return rgb;
}

/**
 * getArea
 *
 * 获取地区信息
 *
 * @param    {string} area_type 获取地区类型(continent/country/province)
 * @param    {int}    area_id   获取地区id
 * @returns  {string} 十六进制颜色
 *
 * @date     2015-12-24
 * @author   PC<pengcheng.kong@seeed.cc>
 */
function getArea(area_type, area_id, callback) {
    
    var apiURL,     //数据接口
        param;      //数据参数
    
    //获取洲下的国家
    if(area_type == 'country') {
        apiURL = apiRoot+'index.php?r=admin/common/country/get-country',
        param  = 'continent='+area_id;
    }
    
    if(area_type == 'province') {
        apiURL = apiRoot+ 'index.php?r=admin/common/country/get-region',
        param = 'country='+area_id;
    }
    
    startAjax(apiURL, param, function(data){
        callback(data);
    });
    
    
}

/**
 * potlayer 弹出框操作
 *
 * 操作弹出框
 *
 * @param    {string} 
 * @param    {int}    
 * @returns  {string} 
 *
 * @date     2015-12-25
 * @author   PC<pengcheng.kong@seeed.cc>
 */
function openPotLayer(open_target, btn_close) {
    
    //console.log('执行了');
    
    $('html').addClass('ofh');
    $(open_target).fadeIn(100);
    
    $('body').on('click', '.btn-close-potlayer', function(){
        $('html').removeClass('ofh')
        $(this).parent().parent().fadeOut(100);
        return false;
    });
    
    return false; 
}

/**
 * openPotlayer 新建弹出框
 *
 * 指定父元素下新建一个弹出窗
 *
 * defaults默认参数：
 * @param  {string} id      弹出框id
 * @param  {string} title   弹出框标题
 * @param  {string} text    弹出框文本
 * 即可生成对话框，默认监听取消按钮，确认按钮事件需自定义
 *
 * 若只显示单按钮，在class添加 js-single-btn 即可
 *
 * @date     2015-12-27
 * @author   PC<pengcheng.kong@seeed.cc>
 */
$.fn.createConfirmPot = function(option) {
    
    var defaults = {                    //设置默认参数
        'id':'confirm-potlayer',
        'title':'Confirm',
        'class':'',
        'text': '',
        'confirm': true,
        'cancel': true
    };
    
    var setting = $.extend({}, defaults, option),   //设置参数
        _text_html = setting.text == ''?'': '<p class="text c-10">'+setting.text+'</p>',
        _confirm   = setting.confirm ? '<a href="#" class="btn btn-confirm js-com fr">CONFIRM</a>':'',
        _cancel    = setting.cancel ? '<a href="#" class="btn btn-default mr20 js-confrim-cancel fl">CANCEL</a>':'',
        _confirm_potlayer_html = 
        '<div class="potlayer '+setting.class+'" id="'+setting.id+'">'+
            '<div class="potlayer__confirm tc clear">'+
                '<div class="title c-10">'+setting.title+'</div>'+_text_html+_cancel+_confirm+
            '</div>'+
        '</div>';
    
    //委托body监听确认框取消按钮事件
    $('body').on('click', '.js-confrim-cancel', function(){
        $(this).parent().parent().hide(); 
        $('html').removeClass('ofh');
        return false;
    });
    
    return this.append(_confirm_potlayer_html);
}

/**
 * ajaxLoading ajax loading样式
 *
 * ajax提交后的loading样式
 *
 * defaults默认参数：
 * @param  {string} id      弹出框id
 * @param  {string} title   弹出框标题
 * @param  {string} text    弹出框文本
 * 即可生成对话框，默认监听取消按钮，确认按钮事件需自定义
 *
 * @date     2016-01-04
 * @author   PC<pengcheng.kong@seeed.cc>
 */
$.fn.creatLoadingState = function(option) {
    var defaults = { 
        //设置默认参数
        'bgc':'#09694f',
        'removeclass':'js-add-cart',
        'text':'ADDING'
    };
    var setting = $.extend({}, defaults, option);
    
    var loading_clone =   $(this).clone()
            .css('background-color',setting.bgc)
            .attr('href','javascript:void(0);').attr('id', setting.id)
            .addClass(setting.class)
            .removeClass(setting.removeclass)
            .html('<i class="fa fa-spinner fa-spin mr10"></i>'+setting.text);
    $(this).hide().parent().append(loading_clone);
    return;
}

/**
 * getCartData 获取购物车数据
 *
 * @param  {function} callback  回调
 *
 * @date     2016-01-09
 * @author   PC<pengcheng.kong@seeed.cc>
 */
function getCartData(callback){
    var apiURL  = apiRoot+'index.php?r=bazaar/cart/default/index',
        param   = 'guid=1';
    startAjax(apiURL, param, function(json){
        callback(json);
    });
}

/**
 * updateCartNum 更新购物车数量
 *
 * @param  {string} target 更新目标
 *
 * @date     2016-01-09
 * @author   PC<pengcheng.kong@seeed.cc>
 */
function updateCartNum(target) {
    getCartData(function(json){
        if(json.errorcode == 0){
            if(!json.data){
                $(target).text(0);
            }else{
                //更新为购物车总数量
                var sum_count = 0;
                $(json.data.products).each(function(){
                    sum_count += parseInt(this.quantity);
                });
                $(target).text(sum_count);
            }
        }
        
        
    });
}

/**
 * logout 退出登录
 *
 * @param   {function}  callback 回调
 *
 * @date     2015-12-28
 * @author   PC<pengcheng.kong@seeed.cc>
 */
function logout(type, callback){
    
    var logout_apiURL   = apiRoot+'index.php?r=admin/user/users/logout';
    
    if( type == "confirm"){
        $('body').createConfirmPot({
            'id':'logout',
            'title':'Are you sure to Log out?'
        });
        $('#logout').on('click', '.js-com', function(){
            doLogout();
            return;
        });
    }
    
    if(type == 'normal'){
        doLogout();
    }
    
    function doLogout(){
    
        startAjax(logout_apiURL, '', function(json){
            //console.log(json);
            if(!json.errorcode){
                //console.log('登出成功');
                //默认跳回首页
                if(callback) { 
                    callback();
                }else {
                    location.href = 'login.html';
                }
            }
        });
    }
}

/**
 * 判断用户是否在线
 *
 * @param   {function}  callback 回调
 *
 * @date     2015-12-28
 * @author   PC<pengcheng.kong@seeed.cc>
 */
function isOnline(callback) {
    var apiURL = apiRoot+'index.php?r=admin/user/users/is-login';
    startAjax(apiURL, '', function(json){
        if(callback){callback(json);}
    });
}

/**
 * jquery 扩展
 *
 * @date     2015-12-29
 * @author   PC<pengcheng.kong@seeed.cc>
 */
$.extend({
    
    /*
     * checkNotNull 非空判断
     *
     * @param   {string}  event  触发事件
     * @param   {string}  target 判断目标
     */
    checkNotNull: function(event, target){
        var $target = $(target);
        $target.on(event, function(){
            var $this = $(this);
            $this.parent().find('.warning').remove();
            if($.trim($target.val()) == ''){
                $this.parent().append('<div class="warning tr abs hide">Can not be empty</div>');
                $this.next().removeClass('hide').addClass('animated shake');
            }else{
                $this.next().remove();
            }
        });
    },
    
    checkMail: function(event, target){
        var reg   = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        $(target).on(event, function(){
            var $this = $(this),
                target_val = $this.val();
            $this.parent().find('.warning').remove();
            if(!reg.test(target_val)){
                $this.parent().append('<div class="warning tr abs hide">Email wrong</div>');
                $this.next().removeClass('hide').addClass('animated shake');
            }else{
                $this.next().remove();
            }
        });
    },
    
    /*
     * onlyNumber 只能输入数值
     *
     * @param   {string} 触发目标
     * return   value    处理值
     */
    onlyNumber: function(target){
        return target.value = target.value.replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g, "$1");
    },
    
    
    /*btnLoading: function(target){
        var btn_loading =   $(target).clone()
            .css('background-color','#09694f')
            .attr('href','javascript:void(0);')
            .addClass('js-loading')
            .html('<i class="fa fa-spinner fa-spin mr10"></i>SENDDING EMAIL');
        $(target).hide().parent().append(btn_loading);
        
    }*/
    
    /*
     * formatFloatTo2 将数字处理为小数点后两位
     *
     * @param   {string} 数值
     * return   value    处理值
     */
    formatFloatTo2:function(float_num){
        return parseFloat(float_num).toFixed(2);
    },
    
    /*
     * formatImgURl 重新处理电商的图片路径
     * 电商因历史原因存在两种图片路径，旧产品会以upload开头，新产品以products开头
     *
     * @param   {string} 图片路径
     * return   value    处理值
     */
    formatImgURl: function(imgURL) {
        if(imgURL.indexOf('upload')!= -1 ){
            var _image_url = imageRoot+imgURL;
            return _image_url;
        }else if(imgURL.indexOf('images')!= -1 ){
            var _image_url = imageRoot+imgURL;
            return _image_url;
        }else{
            var _image_url = imageRoot+'images/'+imgURL;
            return _image_url;
        }
    }
    
    
});


function createEditer(target_id) {
    //往页面里插入需要的资源
    var _css = '<link rel="stylesheet" href="'+apiRoot+'/web/seeed/js/plugin/umeditor/themes/default/css/umeditor.min.css">',
        _script = 
            '<script src="'+baseURL+'/web/seeed/js/plugin/umeditor/umeditor.min.js"></script>'+
            '<script src="'+baseURL+'/web/seeed/js/plugin/umeditor/umeditor.config.js"></script>'+
            '<script src="'+baseURL+'/web/seeed/js/plugin/umeditor/lang/zh-cn/zh-cn.js"></script>';   
    $('head').append(_css);
    $('body').append(_script);
    
    //初始化编辑器
    var ue = UM.getEditor(target_id,{
        //配置工具栏
        initialFrameWidth: 800,     //初始化宽度
        initialFrameHeight: 400,    //初始化高度
        //toolbars :[],     //配置保存项
        retainOnlyLabelPasted: true,
        pasteplain: true,   //默认是否只用纯文本粘贴
    });
}

/**
 * globalSearch 全局搜索
 *
 *
 * @date     2016-01-17
 * @author   PC<pengcheng.kong@seeed.cc>
 */
function globalSearch(){
    var $nav    = $('.main-nav'),
        $user   = $nav.find('.user-act'),
        $search = $nav.find('.search-act'),
        $search_result  = $nav.find('.search-result');
        
    $('body').on('click', '.js-search', function(){
        
        $user.hide();
        $search.show();
        $('.hader-layer').remove();
        $('#g-search').trigger('focus');
        
        //往body里添加遮罩层
        var _header_layer = '<div class="hader-layer abs hide"></div>';
        $('body').addClass('ofh').append(_header_layer);
        $('.hader-layer').width($(document).width());
        $('.hader-layer').height($(document).height());
        $('.hader-layer').fadeIn(100);
        
        return false;
    });
    
    $('body').on('click', '.js-close-search', function(){
        
        $search.hide();
        
        $('.hader-layer').fadeOut(100);
        
        $('body').removeClass('ofh');
        
        $user.show();
        //$search_result.empty();
        return false;
    });
    
    $('body').on('click', '.hader-layer', function(){
        $('.js-close-search').trigger('click');
    });
    
}

/**
 * getCartData 获取购物车数据
 *
 *
 * @param {function} callback 回调
 *
 * @date     2016-01-18
 * @author   PC<pengcheng.kong@seeed.cc>
 */
function getCartData(callback){
    var api = apiRoot+'index.php?r=bazaar/cart/default/index',
        param = '';
    startAjax(api, param, function(json){
        callback(json);
    });
}

/**
 * getNavBarData 获取次级导航的数据
 *
 *
 * @param {function} callback 回调
 *
 * @date     2016-01-18
 * @author   PC<pengcheng.kong@seeed.cc>
 */
function getNavBarData(callback){
    var api = apiRoot+'index.php?r=bazaar/products/navbar/get-navbar',
        param = 'view=index&position=shop';
    startAjax(api, param, function(json){
        callback(json);
    });
}


function getAreaData(callback){
    var api = apiRoot+'index.php?r=admin/common/country/get-country',
        param = '';
    startAjax(api, param, function(json){
        callback(json);
    });
}


function getRegionData(con_id, callback){
    var api     = apiRoot+'index.php?r=admin/common/country/get-region',
        param   = 'country='+con_id;
    startAjax(api, param, function(json){
        callback(json);
    });
}


/* 
 * 执行搜索
 * return void
 */
function doSearch() { 
    var limit           = 5,    //显示长度
        hot_word_apiURL = apiRoot+'index.php?r=bazaar/search/default/get-suggested-words',
        hot_word_param  = 'limit='+limit,
        search_apiURL   = apiRoot+'index.php?r=bazaar/search/default/get-products-name',
        search_param    = '',
        _word_html      = '',
        _result_html    = '',
        search_timer,
        t_word;
    
    
    //获取热词
    startAjax(hot_word_apiURL, hot_word_param, function(json){
        //console.log(json);
        if(json.errorcode == 0){
            $(json.data).each(function(e){
                if(e>4) { return false;}
                _word_html += '<li><a href="item_list.html?keywords='+this+'" target="_self">'+this+'</a></li>';
            });
            $('.search-result').hide().append(_word_html);
        }
    });
    
    //获取key对应的搜索结果
    $('body').on('focusin','#g-search', function(){

        //获取输入返回热词
        var $this   = $(this),
            $s_result  = $('.search-result');
        //if(search_timer){ return false;}
        
        //清空现有关键词
        $this.val('');

        //2秒执行一次搜索
        search_timer = setInterval(function(){
                t_word  = $.trim($this.val());
            var search_param = 'keyword='+t_word+'&limit='+limit,
                _result_html = '';
            
           /* $s_result.creatLoadingState({
                'id':'js-searching',
                'text':'In search',
                'bgc':'#fff'
            });*/
            if(t_word == ''){ return false;}
            startAjax(search_apiURL, search_param, function(json){
                //console.log(json);
                //匹配到下拉菜单里
                if(json.errorcode == 0){
                    $(json.data).each(function(){
                        _result_html += '<a href="item_detail.html?p_id='+this.products_id+'" target="_self">'+this.products_name+'</a>';
                    });
                    //$('#js-searching').remove();
                    $s_result.empty().append(_result_html).show();
                }
                //无搜索结果
                if(json.errorcode == 3){
                    //$('#js-searching').remove();
                    $s_result.empty().append('<div class="no-resule pl30">No search results</div>');
                }

            });
        },2000);

        /*startAjax(search_apiURL, search_param, function(json){
            console.log(json);
        });*/
            
        });
    
    //清除关键字轮询
    $('body').on('focusout', '#g-search', function(){
        clearInterval(search_timer);
    });
    
    $('body').on('keydown', '#g-search',function(e){
        //console.log(e.keyCode);
        var search_word = $.trim($(this).val());
        if(e.keyCode==13){
            location.href = 'item_list.html?keywords='+search_word;
        }
    });
    
    
    $('body').on('click', '.js-btn-search', function(){
        var search_word = $.trim($("#g-search").val());
        location.href = 'item_list.html?keywords='+search_word;
    });

}


/* 
 * 返回顶部
 * @param {string} show_target, 滚动出现目标（可为空
 * @param {string} to_top, 返回顶部按钮
 * @param {number} speed, 滚动速度
 */
function backToTop(speed) {
    
    //添加html到文档里
    var _top_ico = '<a href="#" class="back-to-top" title="Back to top"><i class="fa fa-angle-up"></i></a>';
    $('#footer').after(_top_ico);
    
//    var s_width = $(window).width(),
//        base_width = 1200;
//    if(s_width > base_width) {
//        var fixed_right = parseInt((s_width-base_width)/2);
//        //console.log('右侧距离是：'+fixed_right);
//        $('.back-to-top').css('right',(fixed_right-100)+'px');      
//    }
    
    var $top = $('.back-to-top');
    if ( $top != "") {
        $(window).scroll(function () {
            if ($(this).scrollTop() != 0) {
                $top.show();
            } else {
                $top.fadeOut(200);
            }
        });
    }
    $top.click(function() {
        $("body,html").animate({scrollTop: 0}, speed);
        return false;
    });
}

/* 
 * 配合添加地址方法方法增加地址
 * @param {string} target 接入数据目标
 * @param {function} callback, 回调，可选
 */
function getAreaOption(target, callback){
    //console.log('执行了');
    var _contury_html = '';
    //拿到数据
    getAreaData(function(json){
        if(json.errorcode == 0){
            $(json.data).each(function(){
                _contury_html += '<option value="'+this.countries_id+'">'+this.countries_name+'</option>'
            });
            $(target).find('.js-coun').hide().empty().append(_contury_html).show();
            if(callback) callback();
        }
    });

    //变换地址信息
    $(target).on('change', '.js-coun', function(){
        var $this           = $(this),
            t_id            = $this.val(),
            _state_html     = '';
        
        getRegionData(t_id,function(json){
            
            if(json.errorcode == 0){
                _state_html = '<div class="label f12"><i class="c-d0 mr5">*</i>State/Province</div><select class="input sm-input select js-state">';
                $(json.data).each(function(){
                    _state_html += '<option value="'+this.zone_id+'">'+this.zone_name+'</option>';
                });
                _state_html += '</select>';
            }
            if(json.errorcode == 3){
                _state_html = '<div class="label f12"><i class="c-d0 mr5">*</i>State/Province</div><input type="text" class="input  sm-input js-state">';
            }

            //console.log(_state_html);
            
            
            $('.js-state-box').hide().empty().append(_state_html).show();
            
            var $state = $this.parent().next().find('.js-state');
            //$state.addClass('js-new-state');
            
            //添加非空判断
            $state.on('blur', function(){
                var $this = $(this);
                $this.parent().find('.warning').remove();
                if($.trim($state.val()) == ''){
                    $this.parent().append('<div class="warning tr abs hide">Can not be empty</div>');
                    $this.next().removeClass('hide').addClass('animated shake');
                }else{
                    $this.next().remove();
                }
            });
            
            
        });
    });
    
    if(callback) { callback();}
    
}

/* 
 * 将地址存储到服务器
 * @param {string} target 接入数据目标
 * @param {function} callback, 回调，可选
 */
function saveAddressToService(target, callback) {
    
    //console.log('输出了存储地址到服务');
    
    //获取数据
    var $pot = $(target),
        first_name  = $pot.find('.js-fn').val(),       
        last_name   = $pot.find('.js-ln').val(),
        company     = $pot.find('.js-com').val(),
        country     = $pot.find('.js-coun').val(),
        province    = $pot.find('.js-state').val(),
        city        = $pot.find('.js-city').val(),
        street      = $pot.find('.js-add').val(),
        postcode    = $pot.find('.js-code').val(),
        phone       = $pot.find('.js-phone').val();

   //请求参数
    var add_apiURL = apiRoot+'index.php?r=admin/user/user-address/add-user-address',
        add_param  = 'source=1&first_name='+first_name+'&last_name='+last_name+
                    '&company='+company+'&country='+country+'&province='+province+
                    '&city='+city+'&street='+street+'&postcode='+postcode+'&phone='+phone;

    //console.log('网址是：'+add_apiURL+'参数是：'+ add_param);

    startAjax(add_apiURL, add_param, function(json){
        
        $pot.find('.input').val('');
        
        //寻找标志位，如果是从结算页面添加新地址，则执行后续操作
        if($('.is_address_flag').val()){
            //alert('可以做也');
            $('#add-new-address').remove();
            $('#aderess-book').removeClass('hide');
        }
        
        if(callback) { callback(json)};
        
    });
}

/**
 * recoveryLocation 跳转会登录页
 *
 * 记录用户登录前的url，登录后跳转回上一个停留页面
 *
 * @param    {string} page  当前停留页面
 * @returns  void
 *
 * @date     2016-03-28
 * @author   PC<pengcheng.kong@seeed.cc>
 *
 */
function recoveryLocation(page){
    
    console.log('执行路径记录');
    
    var url;
    if(!page){
        url = window.location.href;
    }else{
        url = page;
    }
    $.cookie('recoURL', url);  
}

/**
 * removeItemOfCart 删除用户购物车里的商品
 *
 * 删除用户购物车单个商品的数据
 *
 * @param    {int} itme_id  商品id
 * @param    {function} callback  回调函数
 * @returns  void
 *
 * @date     2016-03-31
 * @author   PC<pengcheng.kong@seeed.cc>
 *
 */
function removeItemOfCart(item_id, callback){
    var api     = apiRoot+'index.php?r=bazaar/cart/default/delete',
        param   = 'id='+item_id;
    startAjax(api, param, function(json){
        if(callback) { callback(json);}
    });
}

/**
 * doLogout 登出用户
 *
 * 登出
 *
 * @returns  void
 *
 * @date     2016-03-31
 * @author   PC<pengcheng.kong@seeed.cc>
 *
 */
function doLogout(callback){
    var logout_apiURL   = apiRoot+'index.php?r=admin/user/users/logout';
    startAjax(logout_apiURL, '', function(json){
        //console.log(json);
        if(!json.errorcode){
            //console.log('登出成功');
            //默认跳回首页
            if(callback) { 
                callback();
            }
        }
    });
}

/**
 * getTrackingData 获取快递信息
 *
 * 根据运单号获取快递100信息
 *
 * @param   {int} order_sn     订单号
 * @param   {int} shipping_sn  物流运单号
 * @param   {function}  callback 回调
 *
 * @date     2016-04-05
 * @author   PC<pengcheng.kong@seeed.cc>
 *
 */
function getTrackingData(order_sn, shipping_sn, callback){
    var api     = apiRoot+'index.php?r=bazaar/user/user-order/get-order-logistics',
        param   = 'order_sn='+order_sn+'&shipping_sn='+shipping_sn;
    startAjax(api, param, function(json){
        callback(json);
    });
}

/* 
 * 添加头部购物车数据菜单
 */
function addHeaderCart(){
    //console.log('开始加载头部购物车数据');
    getCartData(function(json){
        console.log(json);
        //请求成功
        if(json.errorcode == 0){

            var $header_cart_detail = $('.js-hc-detail'),
                $user_list  = $('.js-user-list'),
                _cart_data = '';
            //如果购物车不为空
            if(json.data){
                //更新购物车数量
                var sum_count = 0;
                $(json.data.products).each(function(){
                    sum_count += parseInt(this.quantity);
                });
                $('.js-cart-count').text(sum_count);
                //更新商品总数
                $('.js-item-count').text(json.data.cartNumber);
                //更新总价格
                $('.js-hc-total').text('$'+json.data.total);
                //组织购物车数据
                $(json.data.products).each(function(){
                    _cart_data += '<li><a href="'+baseURL+'/item_detail.html?p_id='+this.product_id+'" title="'+this.product_name+'"><img src="'+imageRoot+this.product_thumb+'" class="img fl"><div class="link fl">'+this.product_name+'</div></a><div class=fr><div class="mb5">$'+$.formatFloatTo2(this.final_price)+'</div><a href="#" class="js-hc-remove c-9b" data-id="'+this.id+'">Remove</a></div>';
                });
            }else{
                $header_cart_detail.find('.total-bar').empty().text('YOUR CART IS EMPTY');
            }
            $('.js-hc-list').empty().append(_cart_data);
            //恢复显示
            if($('.js-hc-list').find('li').length != 0){
                $('.total-bar').show();
                $('.empty-bar').hide();
            }
            //hover 显示购物车
            $('.js-hc').hover(function(){
                $header_cart_detail.show();
            },function(){
                $header_cart_detail.hide();     
            });
            //显示账户导航
            $('.user-detail').hover(function(){
                $user_list.show();
            }, function(){
                $user_list.hide();
            });
            //删除header购物车商品
            $('.js-hc-list').on('click', '.js-hc-remove', function(){
                var $this = $(this),
                    this_id = $this.attr('data-id');
                
                //判断购物车里是否还有商品
                
                removeItemOfCart(this_id, function(json){
                    console.log(json);
                    $this.parent().parent().remove();
//                    $('.js-hc-total').text(json.data.subTotal);
                    updateCartNum('.js-cart-count');
                    
                    //如果没有商品，更新为空
                    if(!$('.js-hc-list').find('li').length){
                        $('.total-bar').hide();
                        if(!$('.empty-bar').length){
                            $('.js-hc-detail').append('<div class="empty-bar">YOUR CART IS EMPTY</div>');
                        }else{
                            $('.empty-bar').show();
                        }
                    }
                });
                return false;
            });
            $('.js-hc-logout').on('click', function(){
                doLogout(function(){
                    //alert('登出成功');
                    location.reload();
                });
            });
        }
    });

}