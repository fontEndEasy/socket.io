 /**
 * @file login_and_register.js
 * @description 登录&注册 功能js
 * @author seeed-int date 2015-12-18
 */
//var apiRoot = 'http://192.168.1.40/seeed-cc';
//var apiRoot = '';

//var login = function() {
//    var $email       = $('#email'),     //$邮箱
//        $password    = $('#password'),  //$密码
//        $email_wrong = $email.next(),
//        $psw_wrong   = $password.next(),
//        email,                         //email账号
//        password,                      //密码
//        email_check  = 0,              //邮箱状态
//        psw_check    = 0;              //密码状态 
//    
//    //得到焦点时隐藏错误信息
//    $email.on('focus', function(){ $email_wrong.addClass('hide')});
//    $password.on('focus', function(){ $psw_wrong.addClass('hide')});
//    
//    //邮箱判断
//    $email.on('blur', function(){
//        email = $email.val(),
//        reg   = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//        if(!email){
//            $email_wrong.removeClass('hide')
//                .text('Please enter your email')
//                .addClass('animated shake');
//        }else if(!reg.test(email)){
//            $email_wrong.removeClass('hide')
//                .text('Email wrong').addClass('animated shake');
//        }else {
//            email_check = 1;
//        }
//    });
//    
//    //密码判断
//    $password.on('blur', function(){
//        password = $password.val();
//        if(!password) { 
//            $psw_wrong.removeClass('hide').addClass('animated shake');
//        }else {
//            psw_check = 1;
//        }
//    });
//    
//    /*执行登录*/
//    $('.js-login').on('click', function(){
//        if(!email_check){
//            $email.blur();
//            return false;
//        }
//        if(!psw_check) {
//            $password.blur();
//            return false;
//        }
//        if(email_check == 1 && psw_check == 1){
//            //login
//            var apiURL = apiRoot + 'index.php?r=admin/user/users/login',
//                param  = 'password='+ password +'&email=' + email + '&source=1';
//            startAjax(apiURL, param, function(json){
//                console.log(json);
//                var errorcode = json.errorcode,
//                    msg       = json.msgs;
//                if(errorcode == 0) {
//                    //登录成功
//                    location.href = "login.html";
//                }
//                if(errorcode == 3){
//                    if(msg == "email_error"){
//                        $email_wrong.removeClass('hide')
//                            .text('Email not does not exist')
//                            .addClass('animated shake');
//                        return false;
//                    }
//                    if(msg == "psw_error"){
//                        $psw_wrong.removeClass('hide').addClass('animated shake');
//                        return false;
//                    }
//                }
//            });
//        }
//        return false;
//    });
//    
//}
//
//var register = function(){
//    var $email       = $('#email'),     //$邮箱
//        $password    = $('#password'),  //$密码
//        $re_password = $('#re-password'),//重复密码
//        $email_wrong = $email.next(),
//        $psw_wrong   = $password.next(),
//        $re_psw_wrong   = $re_password.next(),
//        email,                         //email账号
//        password,                      //密码
//        re_password,                   //重复密码
//        email_check  = 0,              //邮箱状态
//        psw_check    = 0;              //密码状态
//    
//    
//    //得到焦点时隐藏错误信息
//    $email.on('focus', function(){ $email_wrong.addClass('hide')});
//    $re_password.on('focus', function(){ $re_psw_wrong.addClass('hide')});
//    $password.on('focus', function(){ $psw_wrong.addClass('hide')});
//    
//    $email.on('blur', function(){
//        email = $email.val(),
//        reg   = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//        if(!email){
//            $email_wrong.removeClass('hide')
//                .text('Please enter your email')
//                .addClass('animated shake');
//        }else if(!reg.test(email)){
//            $email_wrong.removeClass('hide')
//                .text('Email wrong').addClass('animated shake');
//        }else {
//            email_check = 1;
//        }
//    });
//    
//    $password.on('blur', function(){
//        password = $password.val();
//        if(!password) { 
//            $psw_wrong.removeClass('hide').addClass('animated shake');
//        }
//    });
//    
//    $re_password.on('blur', function(){
//        re_password = $re_password.val();
//        if(!password) { 
//            $re_psw_wrong.removeClass('hide').addClass('animated shake');
//        }else if( re_password != password ){
//            $re_psw_wrong.text('Inconsistent password').removeClass('hide').addClass('animated shake');
//        }else {
//            psw_check = 1;
//        }
//    });
//    
//    
//    //执行注册
//    $('.js-register').on('click', function(){
//        if(!email_check){
//            $email.blur();
//            return false;
//        }
//        if(!psw_check) {
//            $re_psw_wrong.blur();
//            return false;
//        }
//        
//        if(email_check == 1 && psw_check == 1){
//            //register
//            var apiURL = apiRoot + 'index.php?r=admin/user/users/register',
//                param  = 'password='+ password +'&email=' + email + '&source=1';
//            startAjax(apiURL, param, function(json){
//                console.log(json);
//                var errorcode = json.errorcode,
//                    msg       = json.msgs;
//                if(errorcode == 0) {
//                    alert('注册成功！');
//                    location.href = 'login.html';
//                }
//                if(errorcode == 3){
//                    if(msg == "email_exist!"){
//                        $email_wrong.removeClass('hide')
//                            .text('Email already existst')
//                            .addClass('animated shake');
//                        return false;
//                    }
//                    if(msg == "psw_error"){
//                        $psw_wrong.removeClass('hide').addClass('animated shake');
//                        return false;
//                    }
//                }
//            });
//        }
//        
//    });
//}


/*
 * ver 2.0
 */
var UserStatusExecution = {
    
    //登录
    login: function(){
        
        $('title').text('login in:seeed Shop,Boost ideas,Extend the Reach');
        
        isOnline(function(json){
            //console.log(json);
            if(!json.errorcode){
                //已经登录，跳转至个人中心
                if(json.data.is_online){
                    location.href = 'my_account.html?isonline=1';
                }else{
                    doLogin();
                }
            }
        });
        
        function doLogin(){
            var $email       = $('#email'),     //$邮箱
                $password    = $('#password'),  //$密码
                $email_wrong = $email.next(),
                $psw_wrong   = $password.next(),
                email,                         //email账号
                password,                      //密码
                email_check,                   //邮箱状态
                psw_check;                     //密码状态 

            //得到焦点时隐藏错误信息
            $email.on('focus', function(){ $email_wrong.addClass('hide')});
            $password.on('focus', function(){ $psw_wrong.addClass('hide')});
            
            $('body').on('focusout focusin','.input',function(event){
                var $this = $(this);
                if(event.type == 'focusout'){
                    $this.css('border-color','#f1f1f1');
                }
                if(event.type == 'focusin'){
                    $this.css('border-color','#4a4a4a');
                }
            });
            
            //邮箱判断
            $email.on('blur', function(){
                //email_check = 0;
                email = $email.val();
                var reg   = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/;
                if(!email){
                    $email_wrong.removeClass('hide')
                        .text('Please enter e-mail address')
                        .addClass('animated shake');
                }else if(!reg.test(email)){
                    $email_wrong.removeClass('hide')
                        .text('Invalid email address. Please correct and try again').addClass('animated shake');
                }else {
                    email_check = 1;
                }

                //console.log('email_check:'+email_check);
            });

            //密码判断
            $password.on('blur', function(){
                psw_check = 0;
                password = $password.val();
                if(!password) { 
                    $psw_wrong.removeClass('hide').addClass('animated shake');
                }else {
                    psw_check = 1;
                }

                //console.log('psw_check:'+psw_check);
            });

            //自动填写邮箱
            $email.val($.cookie('nick'));

            /*执行登录*/
            $('.js-login').on('click', function(){

                //console.log(email_check+','+psw_check)
                $email.trigger('blur');
                $password.trigger('blur');
                if(!email_check){
                    return false;
                }
                if(!psw_check) {
                    return false;
                }
                //记住密码
                if($('.js-remember-me').is(':checked')){
                    if($email.val()){
                        //7天内记录cookie
                        $.cookie('nick', $email.val(), { expires:7});
                    }
                }
                if(email_check == 1 && psw_check == 1){
                    //login
                    var apiURL = apiRoot + 'index.php?r=admin/user/users/login',
                        param  = 'password='+ password +'&email=' + email + '&source=1';
                    startAjax(apiURL, param, function(json){
                        //console.log(json);
                        var errorcode = json.errorcode,
                            msg       = json.msgs;
                        if(errorcode == 0) {
                            //登录成功
                            
                            //判断是否存在loaURL
                            if($.cookie('recoURL')){
                                var temp_url = $.cookie('recoURL');
                                $.cookie('recoURL','',{expirse:-1});
                                //console.log(temp_url);
                                location.href = temp_url;
                                //console.log($.cookie('recoURL'));
                            }else{
                                location.href = 'index.html';
                            }
                            
                        }
                        if(errorcode == 3){
                            if(msg == "email_error"){
                                $email_wrong.removeClass('hide')
                                    .text('Account does not exist')
                                    .addClass('animated shake');
                                return false;
                            }
                            if(msg == "psw_error"){
                                $psw_wrong.removeClass('hide').addClass('animated shake');
                                return false;
                            }
                        }
                    });
                }
                return false;
            });

            //监听enter
            $('.input').on('keyup', function(event){
                if(event.keyCode == 13){
                    $('.js-login').trigger('click');
                    //$(this).trigger('focus');
                }
            });

            //记住密码
            $('.js-remember-me').on('click', function(){
                email   = $email.val();
                if($('.js-remember-me').is(':checked')){
                    $.cookie('nick', email);
                }else {
                    $.cookie('nick','',{ expires: -1 });
                }
            });
        }
        
    },
    
    
    //注册
    register: function(){
        
        $('title').text('Register：:seeed Shop,Boost ideas,Extend the Reach');
        
        var $email       = $('#email'),     //$邮箱
            $password    = $('#password'),  //$密码
            $re_password = $('#re-password'),//重复密码
            $email_wrong = $email.next(),
            $psw_wrong   = $password.next(),
            $re_psw_wrong   = $re_password.next(),
            email,                         //email账号
            password,                      //密码
            re_password,                   //重复密码
            email_check,                   //邮箱状态
            psw_check;                     //密码状态
    
    
        //得到焦点时隐藏错误信息
        $email.on('focus', function(){ $email_wrong.addClass('hide')});
        $re_password.on('focus', function(){ $re_psw_wrong.addClass('hide')});
        $password.on('focus', function(){ $psw_wrong.addClass('hide')});
        
        

        $email.on('blur', function(){
            email_check = 0;
            email = $email.val(),
            reg   = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/;
            if(!email){
                $email_wrong.removeClass('hide')
                    .text('Please enter e-mail address')
                    .addClass('animated shake');
            }else if(!reg.test(email)){
                $email_wrong.removeClass('hide')
                    .text('Invalid email address. Please correct and try again').addClass('animated shake');
            }else {
                email_check = 1;
            }
        });

        $password.on('blur', function(){
            password = $password.val();
            if(!password) { 
                $psw_wrong.removeClass('hide').addClass('animated shake');
            }
            //密码不能少于6个字符
            if(password.length<6){
                $psw_wrong.text('6 Charactors Mininum').removeClass('hide').addClass('animated shake');
            }
        });

        $re_password.on('blur', function(){
            psw_check = 0;
            re_password = $re_password.val();
            if(!password) { 
                $re_psw_wrong.removeClass('hide').addClass('animated shake');
            }else if( re_password != password ){
                $re_psw_wrong.text("Passwords doesn't match").removeClass('hide').addClass('animated shake');
            }else if(password.length<6){
                $psw_wrong.text('At least 6 charactors').removeClass('hide').addClass('animated shake');
            }else {
                psw_check = 1;
            }
        });


        //执行注册
        $('.js-register').on('click', function(){
            
            $email.blur();
            $password.blur();
            $re_password.blur();
            
            if(!email_check){
                $email.blur();
                return false;
            }
            /*if(!psw_check) {
                $re_password.blur();
                return false;
            }*/
            
            //console.log('邮件状态是：'+email_check+'---密码状态是：'+psw_check)
            
            if(email_check == 1 && psw_check == 1){
                //register
                var apiURL = apiRoot + 'index.php?r=admin/user/users/register',
                    param  = 'password='+ password +'&email=' + email + '&source=1';
                startAjax(apiURL, param, function(json){
                    //console.log(json);
                    var errorcode = json.errorcode,
                        msg       = json.msgs;
                    if(errorcode == 0) {
                        //alert('注册成功！');
                        //location.href = 'login.html';
                        if($.cookie('recoURL')){
                            var temp_url = $.cookie('recoURL');
                            $.cookie('recoURL','',{expirse:-1});
                            //console.log(temp_url);
                            location.href = temp_url;
                            //console.log($.cookie('recoURL'));
                        }else{
                            location.href = 'index.html';
                        }
                    }
                    if(errorcode == 3){
                        if(msg == "email_exist!"){
                            $email_wrong.removeClass('hide')
                                .text('Email address already in use')
                                .addClass('animated shake');
                            return false;
                        }
                        if(msg == "psw_error"){
                            $psw_wrong.removeClass('hide').addClass('animated shake');
                            return false;
                        }
                    }
                });
            }
            return false;
        });
        
        //监听enter
        $('.input').on('keyup', function(event){
            if(event.keyCode == 13){
                $('.js-register').trigger('click');
                //$(this).trigger('focus');
            }
        });
        
        $('body').on('focusout focusin','.input',function(event){
            var $this = $(this);
            if(event.type == 'focusout'){
                $this.css('border-color','#f1f1f1');
            }
            if(event.type == 'focusin'){
                $this.css('border-color','#4a4a4a');
            }
        });
    },
    
    //找回密码
    findPassword: function() {
        
        var $find_psw   = $('.find-psw'),
            $set_psw    = $('.set-new-psw'),
            $psw        = $('#password'),
            $re_psw     = $('#re-password'),
            $psw_wrong  = $psw.next(),
            get_mail,
            get_key,
            find_psw_apiURL = apiRoot+'index.php?r=admin/user/users/forget-password',
            reset_psw_apiURL= apiRoot+'index.php?r=admin/user/users/password-find',
            _send_email_success_html    = '<h1 class="f-dp-m f20">FIND PASSWORD</h1><p>E-mail has sent</p>',  //邮件发送成功提示
            _reset_psw_success_html     = '<h1 class="f-dp-m f20">SET NEW PASSWORD</h1><p>Reset Password succesfully.</p>';
        
        //非空判断
        $.checkMail('blur', '#email');
//        $.checkNotNull('blur','#password');
        
        $psw.on('focus', function(){ $psw_wrong.addClass('hide')});
        $re_psw.on('focus', function(){ $re_psw.next().addClass('hide')});
        
        $psw.on('blur', function(){
            password = $psw.val();
            //console.log(password);
            if(password == '') { 
                $psw_wrong.removeClass('hide').addClass('animated shake');
//                return false;
            }
            if(password.length<6){
            //密码不能少于6个字符
                $psw_wrong.text('At least 6 charactors').removeClass('hide').addClass('animated shake');
            }
        });
        
        $re_psw.on('blur', function(){
//            $re_psw.parent().find('.warning').remove();
            var password    = $psw.val(),
                re_password = $re_psw.val();
            if(re_password ==''){
//                $re_psw.parent().append('<div class="warning tr abs hide">Can not be empty</div>');
                $re_psw.next().text('Can not be empty').removeClass('hide').addClass('animated shake');   
            }else if( re_password != password ){
//                $re_psw.parent().append("<div class='warning tr abs hide'>Passwords doesn't match</div>");
                $re_psw.next().text("Passwords don't match").removeClass('hide').addClass('animated shake');
            }
        });
        
        //发送邮件
        $('.js-find-psw').on('click', function(){
            
            var $parent = $(this).parent();
            
            $parent.find('.input').blur();
            if($parent.find('.warning').length) { return false;}
            
            var $this = $(this),
                emial = $('#email').val(),
                warning_lenght = $('.find-psw').find('warning').length,
                find_psw_param = 'email='+emial;
            
            if(!warning_lenght){
                //加载菊花
                $this.creatLoadingState({
                    'id':'js-loading',
                    'bgc':'#09694f',
                    // 'text':'SENDING EMIAL',
                    'text':''
                });
                
                startAjax(find_psw_apiURL, find_psw_param, function(json){
                    //成功
                    $this.parent().find('.warning').remove();
                    if(json.errorcode == 0){
                        $('#js-loading').remove();
                        //显示邮件发送成功
                        $('.find-psw').empty().append(_send_email_success_html);
                    }
                    if(json.errorcode == 3){
                        $('#js-loading').remove();
                        $this.show();
                        $('.js-find-box').append('<div class="warning tr abs hide">Email has not registered</div>');
                        $('.js-find-box').find('.warning').removeClass('hide').addClass('animated shake');
                    }
                    //邮箱还没注册
                    /*if(json.errorcode == 4) {
                        $('#js-loading').remove();
                        $this.show();
                        $this.parent().append('<div class="warning tr abs hide">Email not does not exist</div>');
                        $this.next().removeClass('hide').addClass('animated shake');
                    }*/
                });
            }
            return false;
        });
        
        //重置密码
        if(window.location.hash){
            if( window.location.hash = 'resetpsw'){
                $find_psw.hide();
                $set_psw.show();
                //获取URL里的值，必须要判断
                get_mail = getQuery('email');
                get_key  = getQuery('key');
                //console.log(get_mail+'-'+get_key);
            }
        }
        
        $('.js-reset-psw').on('click', function(){
            //ajax loading
            
            $('.set-new-psw').find('.input').blur();
            var $this           = $(this),
                warning_length  = $set_psw.find('.hide').length,
                new_password    = $psw.val();
            
            //console.log(warning_length);
            if(warning_length == 2){
                
                $this.creatLoadingState({
                    'bgc':'#09694f',
                    'text':'RESETTING'
                });
                
                var reset_psw_param = 'email='+get_mail+'&key='+get_key+'&password='+new_password; 
                startAjax(reset_psw_apiURL, reset_psw_param, function(json){
                    //console.log(json);
                    //成功
                    if(json.errorcode == 0) {
                        $('#js-loading').remove();                        
                        $set_psw.hide().empty().append(_reset_psw_success_html);
                        //加上返回登录页倒计时
                        //console.log('加上登录页倒计时');
                        $set_psw.append('<p>Please login after <span class="js-second mr5">2</span>s.</p>');
                        $set_psw.show();
                        var second = 2;
                        setInterval(function(){
                            if(second == 0){
                                location.href = 'login.html';
                            }
                            $('.js-second').text(second);
                            --second;
                        },1000);
                    }
                    
                    //重置失败
                    if(json.errorcode == 6) {
                        $('#js-loading').remove();
                        $this.show();
                        $this.parent().append('<div class="warning tr abs hide">Reset failed. Please try again.</div>');
                        $this.next().removeClass('hide').addClass('animated shake');
                    }
                });
            }
            return false;
        });
        
        $('body').on('focusout focusin','.input',function(event){
            var $this = $(this);
            if(event.type == 'focusout'){
                $this.css('border-color','#f1f1f1');
            }
            if(event.type == 'focusin'){
                $this.css('border-color','#4a4a4a');
            }
        });
        
    }  
}
    

