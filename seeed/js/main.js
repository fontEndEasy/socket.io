 /**
 * @file file_name.js
 * @description 功能详细描述
 * @author name date 20xx-xx-xx
 */
 /* Add new tips. */
;(function(){
    /*
     * 全局启动加载
     */
    $(function(){
        /*加载基础结构*/
        loadBaseSources();
    })
    
    /**
     * loadBaseSources
     *
     * 加载html页面基础结构
     *
     * @param    void
     * @returns  void
     *
     * @date     2015-12-09
     * @author   PC<pengcheng.kong@seeed.cc>
     */
    function loadBaseSources() {
        $('head').load('../view/common/html_head.html', function(){
            loadHederAndFooter();
        });
    }
    
    /**
     * loadHederAndFooter 
     *
     * 加载头部脚部
     *
     * @param    void
     * @returns  void
     *
     * @date     2015-12-09
     * @author   PC<pengcheng.kong@seeed.cc>
     */
    function loadHederAndFooter() {
        
        var $header = $('#header').detach(),
            $footer = $('#footer').detach();
        
        $header.load('../view/common/header.html', function(){
            var $title = $('title');
            $title.text('this is seeed!');
            var seo_html = '<meta content="seo contetn">';
            $(seo_html).insertAfter($title);
        });
        $footer.load('../view/common/footer.html');
        $('body').hide().prepend($header).append($footer).show();
        
    }
    
    /*input 添加外边框色*/
    $('.com-input').on('focus', function(){
        $(this).css('border-color','#4a4a4a');
    });
    $('.com-input').on('blur', function(){
        $(this).css('border-color','#e0e0e0');
    });
   
    
})()

