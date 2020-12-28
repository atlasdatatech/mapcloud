$(function() {
    $.validator.setDefaults({
        onkeyup: null,
        success: function(label){
            label.text('').addClass('valid');
        },
        submitHandler: function(form) {
            var account = $.trim($("#account").val());
            var pwd = $.trim($("#pwd").val());
            $.ajax({
                url: ATCONFIG.host + "sign/in/",
                type: 'POST',
                headers: {
                    Accept: "application/json; charset=utf-8"
                },
                data: {name:account, password:pwd},
                success: function(res) {
                    if(res && res.code === 200 && res.data) {
                        var data = res.data;
                        localStorage.clear();
                        localStorage.setItem('token', data.jwt);
                        localStorage.setItem('Token', data.jwt);
                        localStorage.setItem('name', data.name);
                        localStorage.setItem('access_token', data.access_token);
                        location.href = './#/map/list';
                    } else {
                        $("#at-res-error").text(res.msg);
                        setTimeout(function() {
                            $("#at-res-error").text("");
                        }, 10000);
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
            account:{
                required: true,
                minlength: 4
            },
            pwd:{
                required: true,
                minlength: 4,
                maxlength: 20
            },
        },
        messages:{
            account:{
                required: "用户名不能为空",
                minlength: "用户名的最小长度为6"
            },
            pwd:{
                required: "密码不能为空",
                minlength: "密码长度不能少于6个字符",
                maxlength: "密码长度不能超过20个字符"
            },
        }
    });
})