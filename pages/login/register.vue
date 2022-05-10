<template>
    <div style='display: flex;flex-direction: column;min-height: 100vh;'>
        <div class="content">
            <div class="data_h " :style="{height: halfWidth}">
                <div class="data_h_h" :style="{height: halfWidth}"></div>
            </div>
            <!--注册页面-->
            <div :style="{position:'relative',top:baiduHeadTop + 'px'}">

                <div class="head">
                    <img class='head_close' :src="guanbi" @tap="_banck"/>
                    <div @tap="_landing_q()" style="font-size: 30rpx;">
                        {{language.register.topRight}}
                    </div>
                </div>

                <div class='loginType'>
                    {{language.register.title}}
                </div>

                <div class='login'>
                    <!-- 账号 -->
                    <div class='login_inpu'>
                        <input placeholder-style="color:#b8b8b8" type="text" :placeholder="language.register.zhanghao_placeHolder"
                               @input="_regIdIpt" v-model="regId" @focus="_close_empty(1)" @blur="blurReg"/>
                        <img :src="del" v-if="regId.length" @tap="_empty(1)"/>
                    </div>

                    <!-- 密码 -->
                    <div class='login_inpu'>
                        <input placeholder-style="color:#b8b8b8" type="text" :password="regPWStatus1"
                               @input="_regPW1Ipt" :placeholder="language.register.mima1_placeHolder" v-model="passone"
                               @focus="_close_empty(2)" @blur="_passone"/>
                        <img :src="regPWStatus1?pwHide:pwShow" class="login-inpu-img" @tap="pwStatus(2)"/>
                    </div>

                    <!-- 再次输入密码 -->
                    <div class='login_inpu'>
                        <input placeholder-style="color:#b8b8b8" type="text" :password="regPWStatus2"
                               @input='_regPW2Ipt' :placeholder="language.register.mima2_placeHolder" v-model="passtwo" @focus="_close_empty(3)"
                               @blur="_passtwo_t"/>
                        <img :src="regPWStatus2?pwHide:pwShow" class="login-inpu-img" @tap="pwStatus(3)"/>
                    </div>

                    <!-- 手机号 -->
                    <div class='login_inpu'>
                        <input placeholder-style="color:#b8b8b8" type="number" :placeholder="language.register.tel_placeHolder"
                               @input="_regPhoneIpt" v-model="phone" @focus="_close_empty(1)"
                               @blur="_telephone(phone,3)" maxlength="11"/>
                    </div>

                    <!-- 验证码 -->
                    <div class='login_inpu regCode'>
                        <input class='flex1' placeholder-style="color:#b8b8b8" type="number" :placeholder="language.register.code_placeHolder"
                               @input="_regCodeIpt" v-model="phone_code" maxlength="6"/>
                    </div>
                        <p class='login_p login-inpu-p' @tap="_phone_code(2)"
                           :class="{color:61>count&&count>0||count===0}">{{time_code}}</p>

                </div>

                <div style='padding: 12rpx 40rpx;'>
                    <div class='button1 button-top' v-if='regBtnStatus' @tap='_register'>{{language.register.btn}}</div>
                    <div class='button1 button-top button-opacity' v-else>{{language.register.btn}}</div>
                </div>

            </div>
        </div>
        <!-- 协议 -->
        <div class='agreement'>{{language.register.bottomIcon}}
            <span style="text-decoration:underline;color: #999;" @tap="_navigateTo('agreement')">《{{Agreement}}》</span>
            <span style="text-decoration:none">和</span>
            <span style="text-decoration:underline;color: #999;" @tap="_navigateTo('privacy')">《{{Agreement2}}》</span>
        </div>
    </div>
</template>

<script>
    import {
        telephone
    } from '../../common/landing.js'
    import {
        mapMutations
    } from 'vuex'
    import {
        lkt_pwStatus,
        lkt_telephone,
        lkt_phone_code,
    } from '../../static/js/login/login.js'

    export default {
        data () {
            return {
                del: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/delete2x.png',
                guanbi: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/guanbi2x.png',
                regId: '',
                toHome: false,
                regPWStatus1: true,
                regPWStatus2: true,
                regBtnStatus: false,
                phone_codeStatus2: false,
                fastTap: true,
                passone: '',
                passtwo: '',
                phone_y: '',
                passone_y: '',
                passtwo_y: '',
                pwShow: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/pwShow.png',
                pwHide: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/pwHide.png',
                phone: '', //验证码登录手机号
                phone_code: '', //验证码
                one_code: '', //手机号码格式正确返回值
                time_code: '获取验证码',
                timer: null,
                count: '', //倒计时时间
                old_phone: '', //存储获取验证码时的手机号码
                flag: true, //返回
                fatherId: '',//父级id(分销商分享使用)
                baiduHeadTop: 0,// 百度小程序头部高度兼容
                Agreement: '',
                Agreement2:''
            }
        },
        onShow() {
            this.time_code = this.language.login.page2.getCode
        },
        onLoad (option) {

            // #ifdef MP-BAIDU
            // 百度小程序头部兼容
            uni.getSystemInfo({
                success: (res) => {
                    this.baiduHeadTop = res.navigationBarHeight
                }
            })
            // #endif

            if (option.fatherId) {
                this.fatherId = option.fatherId
            }
            if (uni.getStorageSync('fatherId')) {
                this.fatherId = uni.getStorageSync('fatherId')
            }
            let data = {
                module: 'app',
                action: 'login',
                app: 'index',
            }
            this.$req.post({ data }).then(res => {
                if (res.code == 200) {
                    this.Agreement = res.data.Agreement
                    this.Agreement2 = res.data.Agreement_1
                }
            })
        },
        methods: {
            // 返回
            _banck () {
                if (this.toHome) {
                    uni.switchTab({
                        url: '../tabBar/home'
                    })
                } else {
                    uni.navigateBack({
                        delta: 2
                    })
                }
            },
            // 到登录页面
            _landing_q () {
                this.regId = ''
                this.flag = false
                this.regBtnStatus = false
                this.phone_codeStatus2 = false
                this.phone = ''
                this.phone_code = ''
                this.passone = ''
                this.passtwo = ''
                clearInterval(this.timer)
                this.time_code = this.language.login.page2.getCode
                this.timer = null
                this.count = ''
                this.flag = true
                uni.navigateBack({
                    delta: 1
                })
            },
            // input聚焦
            _close_empty (type) {
                if (type == 1) {
                    this.phone_y = true
                } else if (type == 2) {
                    this.passone_y = true
                } else if (type == 3) {
                    this.passtwo_y = true
                }
            },
            // 叉，清空内容 1登录账号 3验证码登录手机号 245没用到
            _empty (val) {
                if (val == 1) {
                    this.regId = ''
                } else if (val == 2) {
                    this.password = ''
                } else if (val == 3) {
                    this.phone = ''
                } else if (val == 4) {
                    this.passone = ''
                } else if (val == 5) {
                    this.passtwo = ''
                }
            },
            // 账号输入
            _regIdIpt: function (e) {
                if (e.target.value.length > 5 && this.passone.length > 5 &&
                    this.passtwo.length > 5 && this.phone_code.length == 6 && this.passone.length == this.passtwo.length) {
                    this.regBtnStatus = true
                } else {
                    this.regBtnStatus = false
                }
            },
            // 账号失焦  账号正则，限定输入数字与字母组合
            blurReg: function (e) {
                let re = /^[a-z0-9]{6,15}$/i
                if (e.target.value != '') {
                    let rez = re.test(e.target.value)
                    if (rez == true) {

                    } else {
                        e.target.value = ''
                        uni.showToast({
                            title: this.language.register.zhanghaoTips,
                            duration: 2000,
                            icon: 'none'
                        })

                    }
                }
                this.regId = e.target.value
            },
            // 首次密码输入
            _regPW1Ipt: function (e) {
                if (this.regId.length > 5 && this.phone.length == 11 && e.target.value.length > 5 &&
                    this.passtwo.length > 5 && this.phone_code.length == 6) {
                    this.regBtnStatus = true
                } else {
                    this.regBtnStatus = false
                }
            },
            // 再次密码输入
            _regPW2Ipt: function (e) {
                if (this.regId.length > 5 && this.phone.length == 11 && this.passone.length > 5 && this.passtwo.length > 5 &&
                    e.target.value.length > 5 && this.phone_code.length == 6) {
                    this.regBtnStatus = true
                } else {
                    this.regBtnStatus = false
                }
            },
            // 密码失焦
            _passone () {
                this.passone_y = false
                var re = /^[a-z0-9]{6,15}$/i
                if (this.passone != '') {
                    var rez = re.test(this.passone)
                    if (rez == true) {

                    } else {
                        this.passone = ''
                        uni.showToast({
                            title: this.language.register.mimaTips1,
                            duration: 3000,
                            icon: 'none'
                        })
                    }
                }
            },
            // 两次密码输入是否一致
            _passtwo_t () {
                this.passtwo_y = false
                if (this.passone != this.passtwo) {
                    uni.showToast({
                        title: this.language.register.mimaTips2,
                        duration: 1000,
                        icon: 'none'
                    })
                }
            },
            // 密码是否可见 1登录密码 2注册密码 3再次输入注册密码
            pwStatus (type) {
                lkt_pwStatus(type, this)
            },
            // 手机号输入
            _regPhoneIpt: function (e) {
                if (e.target.value.length == 11 && this.passone.length > 5 &&
                    this.passtwo.length > 5 && this.phone_code.length == 6 && this.passone.length == this.passtwo.length) {
                    this.regBtnStatus = true
                } else {
                    this.regBtnStatus = false
                }
            },
            //手机号码正则验证 type2验证码登录输入手机号，3注册输入手机号
            _telephone (value, type) {
                this.one_code = telephone(value)
                lkt_telephone(type, this)
            },
            //获取验证码 type1验证码登录 2注册
            _phone_code (type) {
                lkt_phone_code(type, this)
            },
            // 验证码输入
            _regCodeIpt: function (e) {
                if (this.regId.length > 5 && this.phone.length == 11 && this.passone.length > 5 &&
                    this.passtwo.length > 5 && e.target.value.length == 6 && this.passone.length == this.passtwo.length) {
                    this.regBtnStatus = true
                } else {
                    this.regBtnStatus = false
                }
            },
            // 注册
            _register () {
                var me = this
                if (this.phone && this.one_code == 1 && this.passone == this.passtwo && this.passone) {
                    if (!this.fastTap) {
                        return
                    }
                    this.fastTap = false
                    let data = {
                        module: 'app',
                        action: 'login',
                        app: 'user_register',
                        phone: this.phone,
                        password: this.passone,
                        access_id: this.$store.state.access_id,
                        keyCode: this.phone_code,
                        userId: this.regId
                    }
                    if (this.fatherId != '') {
                        data.pid = this.fatherId
                    }
                    // 补充变量url，解决uni.request中url为undefined的问题
                    this.$req.post({data}).then(res => {
                        me.fastTap = true
                        
                        if (res.code == 200 && res.data && res.data.access_id) {
                            let {
                                access_id,
                                y_password,
                                wx_status
                            } = res.data
                            
                            uni.showToast({
                                title: this.language.register.registerOk,
                                duration: 1000,
                                icon: 'none'
                            })
                            uni.setStorageSync('LoingByHand', true)
                            me.set_access_id(access_id)
                            uni.setStorageSync('access_id', access_id)
                            setTimeout(function () {
                                uni.reLaunch({
                                    url: '../tabBar/my',
                                    success: function () {
                                        if (wx_status != 1) {
                                            me.$store.state.shouquan = true
                                        }
                                    }
                                })
                            }, 1000)
                        } else {
                            uni.showToast({
                                title: res.message,
                                icon: 'none'
                            })
                        }
                    }).catch(e => { me.fastTap = true })
                    
                } else if (this.one_code != 1) {
                    uni.showToast({
                        title: this.language.register.telTips,
                        duration: 1000,
                        icon: 'none'
                    })
                } else if (this.phone_code.length != 6) {
                    uni.showToast({
                        title: this.language.register.yzmTips,
                        duration: 1000,
                        icon: 'none'
                    })
                } else if (this.passone != this.passtwo && this.passone) {
                    uni.showToast({
                        title: this.language.register.mimaTips3,
                        duration: 1000,
                        icon: 'none'
                    })
                } else {
                    uni.showToast({
                        title: this.language.register.wanzhengTips,
                        duration: 1000,
                        icon: 'none'
                    })
                }
            },
            _navigateTo (url) {
                uni.navigateTo({
                    url
                })
            },
            ...mapMutations({
                set_access_id: 'SET_ACCESS_ID',
                user_phone: 'SET_USER_PHONE'
            })
        },
    }
</script>

<style scoped lang="less">
    @import url("../../static/css/login/register.less");
</style>
