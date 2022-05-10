// 密码是否可见 1登录密码 2注册密码 3再次输入注册密码
export function lkt_pwStatus (type, me) {
    if (type == 1) {
        me.LoginPWStatus = !me.LoginPWStatus
    } else if (type == 2) {
        me.regPWStatus1 = !me.regPWStatus1
    } else if (type == 3) {
        me.regPWStatus2 = !me.regPWStatus2
    }
}

//手机号输入失焦 type2验证码登录输入手机号，3注册输入手机号
export function lkt_telephone (type, me) {
    if (type == 1) {
        me.passLoginCodePH = me.passLoginCodePH1
        me.account_f = false
    } else if (type == 2) {
        console.log('我输入了验证码登录手机号')
        me.codeLoginCodePH = me.codeLoginCodePH1
        me.pone_f = false
    } else if (type == 3) {
        console.log('我输入了注册手机号')
        me.phone_y = false
    }
}

//获取验证码 type1验证码登录 2注册
export function lkt_phone_code (type, me) {
    if (!me.fastTap) {
        return
    }
    me.fastTap = false
    console.log(111)
    console.log(me)
    if (me.phone) {
        if (me.one_code == 1 && !me.count) {
            me.old_phone = me.phone
            const TIME_COUNT = 60
            if(uni.getStorageSync('language') == 'en'){
                me.time_code = me.language.login.page2.countdown + ' ' + TIME_COUNT + `s`
            }else{
                me.time_code = TIME_COUNT + `s` + me.language.login.page2.countdown
            }
            
            if (!me.timer) {
                me.count = TIME_COUNT
                me.timer = setInterval(() => {
                    if (me.count > 0 && me.count <= TIME_COUNT) {
                        me.count--
                        if(uni.getStorageSync('language') == 'en'){
                            me.time_code = me.language.login.page2.countdown + ' ' + me.count + `s`
                        }else{
                            me.time_code = me.count + `s` + me.language.login.page2.countdown
                        }
                    } else {
                        clearInterval(me.timer)
                        me.time_code = me.language.login.page2.getCode
                        me.timer = null
                        me.count = ''
                    }
                }, 1000)
            }

            let data = {
                module: 'app',
                action: 'user',
                app: 'secret_key',
                phone: me.phone,
            }
            if (type == 1) {
                data.message_type = 0 // 短信类型 0.验证码 1.短信通知
                data.message_type1 = 1 // 短信类别 1.登录
            } else {
                data.message_type = 0 // 短信类型 0.验证码 1.短信通知
                data.message_type1 = 2 // 短信类别 2.注册
            }
            me.$req.post({data}).then(res => {
                var _code = {
                    200: me.language.toasts.login.fsOk,
                    220: me.language.toasts.login.fsFail,
                    219: me.language.toasts.login.no_config,
                }
                if (_code[res.code]) {
                    uni.showToast({
                        title: _code[res.code],
                        duration: 1500,
                        icon: 'none'
                    })
                }
                if (type == 1) {
                    me.phone_codeStatus1 = true
                    if (me.phone_code.length == 6 && me.phone.length == 11 && me.phone_codeStatus1 == true) {
                        me.codeLoginBtnStatus = true
                    } else {
                        me.codeLoginBtnStatus = false
                    }
                } else if (type == 2) {
                    me.phone_codeStatus2 = true
                    if (me.phone.length == 11 && me.phone_codeStatus2 && me.phone_code.length == 6 &&
                        me.passtwo.length > 5 && me.phone_code.length == 6 && me.passone.length == me.passtwo.length) {
                        me.regBtnStatus = true
                    } else {
                        me.regBtnStatus = false
                    }
                }

                me.fastTap = true
            })
        } else {
            me.fastTap = true
        }
    } else {
        uni.showToast({
            title: me.language.toasts.login.tel,
            duration: 1000,
            icon: 'none'
        })
        me.fastTap = true
    }
}
