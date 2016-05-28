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

