 $(function(){
    //是否登录
    isOnline(function(json){
        if(json.data.is_online){
            $('body').show();
            doCreditCardPay();
            addGaCode(); 
        }else{
            window.location.href = 'login.html';
        }
    });
     
     //添加GA统计
    function addGaCode(){
        $.get('../view/common/gacode.html', function(data){
           $('head').append(data); 
        });
    }

    //支付逻辑
    function doCreditCardPay(){
        var query = getQuery('scount'),
            total = getQuery('total');
        var action = $('#braintree-form').attr('action');

        var loading_clock = setInterval(function(){
            if($('#braintree').children().length != 0){
                //console.log('加载完成');
                $('.l-loading').hide();
                $('#braintree-form').fadeIn(100);
                clearInterval(loading_clock);
            }
        }, 500);

        $('#braintree-form').attr('action', action+'&scount='+query+'&total='+total);

        //组织token
        var token_api = '//'+window.location.host+'/api/index.php?r=bazaar/payment/braintree/get-client-token';
        startAjax(token_api, '', function(json){
//                console.log(json);
            if(json.errorcode == 0){
                var token = json.data.clientToken;
                braintree.setup(token, "dropin", {
                  container: "braintree",

                    /* Kount */
                    dataCollector: {
                        kount: {
                            environment: 'production',
                            merchantId: '601570',
                            /*environment:'sandbox'*/
                        }
                    },
                    onReady: function (braintreeInstance) {
                        var form = document.getElementById('braintree');
                        var deviceDataInput = form['device_data'];

                        if (deviceDataInput == null) {
                            deviceDataInput = document.createElement('input');
                            deviceDataInput.name = 'device_data';
                            deviceDataInput.hidden = true;
                            form.appendChild(deviceDataInput);
                        }

                        deviceDataInput.value = braintreeInstance.deviceData;
                    }
                    /* ... */

                });
            }
        });
    }

})