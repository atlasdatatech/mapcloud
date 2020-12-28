$(function() {
    var localreset = localStorage.getItem("resetpw_time");
    var dis = false;
    if(localreset) {
        dis = (new Date().getTime() - new Date(Number(localreset)).getTime()) <= 216000000;
    }
    if(dis) {
        $("#at-res-error").text("重置链接已发到您的邮箱中，1小时内请不要重复发送链接");
        $(".at-sumbit").addClass("disabled").attr("disabled",true);
    } else {
        $(".at-sumbit").removeClass("disabled").removeAttr("disabled");
        localStorage.removeItem("resetpw_time");
    }
    $.validator.setDefaults({
        onkeyup: null,
        success: function(label){
            label.text('').addClass('valid');
        },
        submitHandler: function(form) {
            if(dis) {
                $("#at-res-error").text("重置链接已发到您的邮箱中，1小时内请不要重复发送链接");
                $(".at-sumbit").addClass("disabled").attr("disabled",true);
            } else {
                $(".at-sumbit").removeClass("disabled").removeAttr("disabled");
                localStorage.removeItem("resetpw_time");
            }
            var email = $.trim($("#email").val());
            $.ajax({
                url: ATCONFIG.host + "sign/reset/",
                type: 'POST',
                headers: {
                    Accept: "application/json; charset=utf-8"
                },
                data: {email:email},
                success: function(res) {
                    if(res && res.code === 200) {
                        $("#at-res-error").text("重置链接已发到您的邮箱中，请您查收邮件");
                        localStorage.setItem("resetpw_time", new Date().getTime());
                        $(".at-sumbit").addClass("disabled").attr("disabled",true);
                    } else {
                        $("#at-res-error").text(res.msg);
                        if(!dis) {
                            setTimeout(function() {
                                $("#at-res-error").text("");
                            }, 10000);
                        }
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
            email:{
                required: true,
                email: true,
            },
        },
        messages:{
            email: {
                required: "邮箱不能为空",
                email: '请输入正确的Email',
            },
        }
    });
})