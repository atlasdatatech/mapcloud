$(function() {
    if(!LOCATION_PARAMS.token || !LOCATION_PARAMS.user) {
        location.href = './login.html';
        return;
    }
    $.validator.setDefaults({
        onkeyup: null,
        success: function(label){
            label.text('').addClass('valid');
        },
        submitHandler: function(form) {
            var repeatpwd = $.trim($("#repeatpwd").val());
            var pwd = $.trim($("#pwd").val());
            if(repeatpwd !== pwd) {
                $("#at-res-error").text('密码不一致，请重新输入');
                return;
            }
            var user = LOCATION_PARAMS.user;
            var token = LOCATION_PARAMS.token;
            $.ajax({
                url: ATCONFIG.host + "sign/reset/" + user + "/" + token + "/",
                type: 'POST',
                headers: {
                    Accept: "application/json; charset=utf-8"
                },
                data: {confirm:repeatpwd, password:pwd},
                success: function(res) {
                    if(res && res.code === 200 && res.data) {
                        $("#at-res-error").text('密码重置成功，即将前往登录页面...');
                        setTimeout(function() {
                            location.href = './login.html';
                        }, 2000);
                    } else {
                        $("#at-res-error").text('密码重置错误，请联系技术支持：' + res.msg);
                        // setTimeout(function() {
                        //     $("#at-res-error").text("");
                        // }, 10000);
                    }
                },
                failure: function(error) {
                    $("#at-res-error").text("网络异常，服务器连接超时，请稍后重试");
                    setTimeout(function() {
                        $("#at-res-error").text("");
                    }, 10000);
                }
            })
        },
        onfocusin: function( element ) {
            $("#at-res-error").text("");
            this.lastActive = element;
            this.addWrapper(this.errorsFor(element)).hide();
            var tip = $(element).attr('tip');
            if(tip && $(element).parent().children(".tip").length === 0){
                $(element).parent().next().text(tip);
            }
            $(element).addClass('highlight');
            if ( this.settings.focusCleanup ) {
                if ( this.settings.unhighlight ) {
                    this.settings.unhighlight.call( this, element, this.settings.errorClass, this.settings.validClass );
                }
                this.hideThese( this.errorsFor( element ) );
            }
        },
        onfocusout: function( element ) {
            $(element).parent().children(".tip").remove();
            $(element).removeClass('highlight');
            this.element( element );
        }
    });
    $("#form").validate({
        rules: {
            pwd:{
                required: true,
                minlength: 4,
                maxlength: 20
            },
            repeatpwd:{
                required: true,
                equalTo: "#pwd" ,
            },
        },
        messages:{
            pwd:{
                required: "密码不能为空",
                minlength: "密码长度不能少于6个字符",
                maxlength: "密码长度不能超过20个字符"
            },
            repeatpwd:{
                required: "确认密码不能为空",
                equalTo: "两次输入的密码不一致",
            },
        }
    });
})