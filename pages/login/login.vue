<template>
    <div style='display: flex;flex-direction: column;min-height: 100vh;'>
        <div class="content">
            <!--登录页面-->
            <div class="data_h " :style="{height: halfLoginIosWidth}">
                <div class="data_h_h" :style="{height: halfLoginIosWidth}"></div>
            </div>

            <div :style="{position:'relative',top:baiduHeadTop + 'px'}">

                <div class="head">
<!--                    <img class='head_close' :src="guanbi" @tap="navBack()"/>-->
                    <img class='head_close' :src="guanbi" @tap="close()"/>
                    <div @tap="_register_q()" style="font-size: 30rpx;">
                        {{language.login.topRight}}
                    </div>
                </div>

                <!--密码登录-->
                <div class='login' v-if="landing">
                    <div class='loginType'>
                        {{language.login.page1.title}}
                    </div>

                    <div class='login_inpu'>
                        <input type="text" :placeholder="language.login.page1.zhanghao_placeHolder" v-model='account'
                               placeholder-style="color:#b8b8b8" @blur="_noNull(1)"/>
                               <!--  && account_f -->
                        <img :src="del" v-if="account.length" @tap="_empty(1)"/>
                    </div>

                    <div class='login_inpu'>
                        <input type="text" :password="LoginPWStatus" :placeholder="language.login.page1.mima_placeHolder" v-model='password'
                               placeholder-style="color:#b8b8b8"
                               @blur='_noNull(1)'/>
                        <img :src="LoginPWStatus?pwHide:pwShow"
                             style='height: 32rpx;width: 32rpx;right: 20rpx;bottom: 24rpx;' @tap="pwStatus(1)"/>
                    </div>

                    <p class='login_pass' v-if="landing"><span @tap='_navigateTo("retrievepassword")'>{{language.login.page1.forgot}}？</span></p>
                    <div class='button1' style='margin-top: 70rpx;' v-if='pwLoginBtnStatus' @tap="_landing">{{language.login.page1.topBtn}}</div>
                    <div class='button1' v-else style='opacity: 0.4;margin-top: 70rpx;'>{{language.login.page1.topBtn}}</div>
                    <div style='text-align: center;font-size: 28rpx;color: #999999;'>{{language.login.or}}</div>
                    <div class='button2' @tap="_phone">{{language.login.page1.bottomBtn}}</div>
                </div>

                <!--验证码登录-->
                <div class='login' v-if="!landing">

                    <div class='loginType'>
                        {{language.login.page2.title}}
                    </div>

                    <div class='login_inpu'>
                        <input type="number" :placeholder="language.login.page2.tel_placeHolder" v-model="phone" @focus="_pone_f"
                               @blur="_telephone(phone,2)"
                               placeholder-style="color:#b8b8b8" @input='_codeChangePhone' maxlength="11"/>
                               <!-- &&pone_f -->
                        <img :src="del" v-if="phone.length" @tap="_empty(3)"/>
                    </div>

                    <div class='login_inpu' style='margin-bottom: 100rpx;'>
                        <div class="codeBox">
                            <input type="number" @focus='_codeF()' @blur='_codeB()' :placeholder="language.login.page2.code_placeHolder"
                                   v-model="phone_code"
                                   placeholder-style="color:#b8b8b8" @input='_codeChangeCode' maxlength="6"
                                   style="margin-bottom: 0;border: 0;flex: 1;"
                                   />
                            <p class='login_p' @tap="_phone_code(1)"
                               :class="{color:60>count&&count>0||count===0}">{{time_code}}</p>
                        </div>
                    </div>

                    <div class='button1' style='margin-top: 70rpx;' v-if='codeLoginBtnStatus' @tap="_landing">{{language.login.page2.topBtn}}</div>
                    <div class='button1' v-else style='opacity: 0.4;margin-top: 70rpx;'>{{language.login.page2.topBtn}}</div>
                    <div style='text-align: center;font-size: 28rpx;color: #999999;'>{{language.login.or}}</div>
                    <div class='button2' @tap="_landing_passw">{{language.login.page2.bottomBtn}}</div>
                </div>
            </div>
        </div>
        <div class='agreement'>{{language.login.bottomIcon}}
            <span @tap="_navigateTo('agreement')" style="text-decoration:underline">《{{agreement1}}》</span>
            <span style="text-decoration:none">和</span>
            <span @tap="_navigateTo('privacy')" style="text-decoration:underline">《{{agreement2}}》</span>
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
                toHome: false,
                togoodsDetail: false,
                phone_codeStatus1: false,
                LoginPWStatus: true,
                pwLoginBtnStatus: false,
                codeLoginBtnStatus: false,
                fastTap: true,
                del: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/delete2x.png',
                guanbi: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/guanbi2x.png',
                pwHide: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/pwHide.png',
                pwShow: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/pwShow.png',
                passLoginCodePH: '请输入账号/手机号',
                passLoginCodePH1: '请输入账号/手机号',
                passLoginPWPH: '请输入密码',
                passLoginPWPH1: '请输入密码',
                codeLoginCodePH: '请输入手机号',
                codeLoginCodePH1: '请输入手机号',
                codeLoginPWPH: '请输入验证码',
                codeLoginPWPH1: '请输入验证码',
                account: '', //登录账号
                password: '', //登录密码
                landing: true, //切换密码登录和手机号码登录
                phone: '', //验证码登录手机号
                phone_code: '', //验证码
                one_code: '', //手机号码格式正确返回值
                time_code: '获取验证码',
                timer: null,
                count: '', //倒计时时间
                old_phone: '', //存储获取验证码时的手机号码
                landing_code: '',
                passone: '',
                passtwo: '',
                account_f: '',
                pone_f: '',
                provider: '',
                agreement1: '',
                agreement2:'',
                company: '',
                logo: '',
                src: false,
                fatherId: '',//父级id(分销商分享使用)
                baiduHeadTop: 0 // 百度小程序头部兼容
            }
        },
        onShow(){
            this.time_code = this.language.login.page2.getCode
        },
        watch:{
            phone(val){
                if(val.length == 11 && this.phone_code.length == 6){
                    this.codeLoginBtnStatus = true
                }
            },
            phone_code(val){
                if(val.length == 6 && this.phone.length == 11){
                    this.codeLoginBtnStatus = true
                }
            },
            password() {
                if(this.account !== '' && this.password !== '') {
                    this.pwLoginBtnStatus = true
                }
            }
        },
        onLoad (option) {
            uni.removeStorageSync('signFlag');
            // #ifdef MP-BAIDU
            // 百度小程序头部兼容
            uni.getSystemInfo({
                success: (res) => {
                    this.baiduHeadTop = res.navigationBarHeight
                }
            })
            // #endif
            let data = {
                module: 'app',
                action: 'login',
                app: 'index'
            }
            this.$req.post({data}).then(res => {
                this.agreement1 = res.data.Agreement
                this.agreement2 = res.data.Agreement_1
                this.logo = res.data.logo
                this.company = res.data.company  
            })

            // 获取服务供应商
            uni.getProvider({
                service: 'oauth',
                success: res => {
                    this.provider = res.provider
                }
            })

            if (option.landing_code) {
                this.togoodsDetail = option.landing_code
            }

            if (option.fatherId) {
                this.fatherId = option.fatherId
            }

            this.toHome = option.toHome;

            if (uni.getStorageSync('fatherId')) {
                this.fatherId = uni.getStorageSync('fatherId')
            }
            console.log('--------this.fatherId----------' + this.fatherId)
        },
        methods: {
            ...mapMutations({
                set_access_id: 'SET_ACCESS_ID',
                user_phone: 'SET_USER_PHONE'
            }),
            close(){
                const pages = getCurrentPages()
                console.log(pages)
                if(pages[pages.length-2].route == 'pagesB/setUp/setUp'){
                    uni.switchTab({
                        url: '../tabBar/my'
                    })
                    return;
                }
                this.navBack()
            },
            //to注册页面
            _register_q () {
                this.account = ''
                this.password = ''
                this.phone = ''
                this.phone_code = ''
                this.pwLoginBtnStatus = false
                this.codeLoginBtnStatus = false
                this.phone_codeStatus1 = false
                clearInterval(this.timer)
                this.time_code = this.language.login.page2.getCode
                this.timer = null
                this.count = ''

                if (this.fatherId) {
                    uni.navigateTo({
                        url: '/pages/login/register?fatherId=' + this.fatherId
                    })
                } else {
                    uni.navigateTo({
                        url: '/pages/login/register'
                    })
                }

            },
            //账号、密码输入框失焦 判断账号不为空
            _noNull (type) {
                var me = this

                function in_noNull () {
                    if (type == 1 && me.account && me.password) {
                        me.passLoginCodePH = me.passLoginCodePH1
                        me.one_code = 1
                        me.account_f = true
                        me.pwLoginBtnStatus = true
                    } else {
                        me.pwLoginBtnStatus = false
                    }
                }

                me.$nextTick(() => {
                    in_noNull()
                })
            },
            //叉，清空内容 1登录账号 3验证码登录手机号 245没用到
            _empty (val) {
                
                if (val == 1) {
                    this.account = ''
                    this.pwLoginBtnStatus = false
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
            // 密码是否可见 1登录密码 2注册密码 3再次输入注册密码
            pwStatus (type) {
                lkt_pwStatus(type, this)
            },
            //登录
            _landing () {
                var me = this
                if (this.landing) {
                    if (!this.account || !this.password) {
                        uni.showToast({
                            title: this.language.login.nopassword,
                            duration: 1000,
                            icon: 'none'
                        })
                    } else if (this.account && this.password) {
                        let data = {
                            module: 'app',
                            action: 'login',
                            app: 'login',
                            phone: this.account,
                            password: this.password,
                            access_id: this.$store.state.access_id,
                            clientid: uni.getStorageSync('cid')
                        }
                        
                        console.log('-------this.fatherId2----------' + this.fatherId)
                        if (this.fatherId != '') {
                            data.pid = this.fatherId//分销推荐人id
                        }
                        
                        this.$req.post({data}).then(res => {
                            
                            if (res.code == 200) {
                                let {
                                    access_id,
                                    wx_status,
                                    user_id,
                                    sellOrderNum
                                } = res.data                         
                                // 首页弹窗数据
                                uni.setStorageSync("myPopup",sellOrderNum) 
                                uni.setStorageSync("login_key",0)
                                me.$store.state.access_id = []

                                uni.showToast({
                                    title: this.language.login.loginSuc,
                                    duration: 1000,
                                    icon: 'none'
                                })
                                
                                uni.setStorageSync('isHomeShow',1)

                                me.set_access_id(access_id)
                                uni.setStorage({
                                    key: 'access_id',
                                    data: access_id,
                                    success: function () {

                                    }
                                })

                                uni.setStorage({
                                    key: 'user_id',
                                    data: user_id
                                })

                                //免注册登录下用账户或手机号登录
                                uni.setStorageSync('LoingByHand', true)
                                if (me.togoodsDetail) {

                                    if (getCurrentPages().length > 1) {
                                        setTimeout(function () {
                                            uni.navigateBack({
                                                delta: 1
                                            })
                                        }, 1000)
                                    } else {
                                        uni.switchTab({
                                            url: '../tabBar/my',
                                            success: function () {}
                                        })
                                    }

                                } else {

                                    setTimeout(function () {

                                        console.log(me.fatherId)

                                        uni.switchTab({
                                            url: '/pages/tabBar/my',
                                            success: function () {
                                                if (wx_status != 1) {
                                                    me.$store.state.shouquan = true
                                                }
                                            }
                                        })
                                    }, 1000)
                                }
                            } else {
                                uni.showToast({
                                    title: res.message,
                                    duration: 1000,
                                    icon: 'none'
                                })
                            }    
                        })
                        
                    }
                } else {
                    if (!this.old_phone) {
                        uni.showToast({
                            title: this.language.login.yzmTips,
                            duration: 1000,
                            icon: 'none'
                        })
                    } else if (!this.phone_code) {
                        uni.showToast({
                            title: this.language.login.yzmEmpty,
                            duration: 1000,
                            icon: 'none'
                        })
                    } else if (this.phone != this.old_phone) {
                        uni.showToast({
                            title: this.language.login.telTips,
                            duration: 1000,
                            icon: 'none'
                        })
                    } else if (this.phone_code.length != 6) {
                        uni.showToast({
                            title: this.language.login.yzmTips1,
                            duration: 1000,
                            icon: 'none'
                        })
                    } else if (this.phone_code.length == 6 && this.phone == this.old_phone) {
                        var data = {
                            module: 'app',
                            action: 'register',
                            app: 'login',
                            phone: this.phone,
                            access_id: this.$store.state.access_id,
                            keyCode: this.phone_code,
                            clientid: uni.getStorageSync('cid')
                        }
                        if (this.fatherId != '') {
                            data.pid = this.fatherId
                        }
                        
                        this.$req.post({data}).then(res => {
                            if (res.code == 200 && res.data && res.data.access_id) {
                                let {
                                    access_id,
                                    y_password,
                                    wx_status
                                } = res.data
                                
                                me.$store.state.access_id = []
                                uni.showToast({
                                    title: this.language.login.loginSuc,
                                    duration: 1000,
                                    icon: 'none'
                                })
                                
                                uni.setStorageSync('isHomeShow',1)
                                
                                me.set_access_id(access_id)
                                uni.setStorageSync('access_id', access_id)
                                uni.setStorageSync('user_phone', me.phone)
                                //免注册登录下用账户或手机号登录
                                uni.setStorageSync('LoingByHand', true)
                                if (y_password == 0) {
                                    uni.showModal({
                                        title: me.language.showModal.hint,
                                        content: me.language.showModal.nomima,
										confirmText: me.language.showModal.confirm,
										cancelText: me.language.showModal.cancel,
                                        success: function (res) {
                                            if (res.confirm) {
                                                setTimeout(function () {
                                                    uni.reLaunch({
                                                        url: '/pagesB/setUp/loginPassword',
                                                    })
                                                }, 1000)
                                            } else if (res.cancel) {
                                                setTimeout(function () {
                                                    uni.reLaunch({
                                                        url: '/pages/tabBar/my',
                                                        success: function () {
                                                            if (wx_status != 1) {
                                                                me.$store.state.shouquan = true
                                                            }
                                                        }
                                                    })
                                                }, 1000)
                                            }
                                        }
                                    })
                                } else {
                                    setTimeout(function () {
                                        uni.reLaunch({
                                            url: '/pages/tabBar/my',
                                            success: function () {
                                                if (wx_status != 1) {
                                                    me.$store.state.shouquan = true
                                                }
                                            }
                                        })
                                    }, 1000)
                                }
                            } else {
                                uni.showToast({
                                    title: res.message,
                                    icon: 'none'
                                })
                            }  
                        })
                    }
                }
            },
            // 验证码登录 手机号聚焦
            _pone_f () {
                this.codeLoginCodePH = ''
                this.pone_f = true
            },
            // 验证码登录 手机号输入
            _codeChangePhone: function (e) {
                if (e.target.value.length == 11 && this.phone.length == 11 && this.phone_codeStatus1) {
                    this.codeLoginBtnStatus = true
                } else {
                    this.codeLoginBtnStatus = false
                }
            },
            //手机号码正则验证 type2验证码登录输入手机号，3注册输入手机号
            _telephone (value, type) {
                this.one_code = telephone(value)
                lkt_telephone(type, this)
                
                if(this.phone_code){
                    this.codeLoginBtnStatus = true
                }
            },
            // 验证码登录 验证码聚焦
            _codeF () {
                this.codeLoginPWPH = ''
            },
            // 验证码登录 验证码输入
            _codeChangeCode: function (e) {
                if (e.target.value.length == 6 && this.phone.length == 11) {
                    this.codeLoginBtnStatus = true
                } else {
                    this.codeLoginBtnStatus = false
                }
            },
            // 验证码登录 验证码失焦
            _codeB () {
                this.codeLoginPWPH = this.codeLoginPWPH1
            },
            //获取验证码 type1验证码登录 2注册
            _phone_code (type) {
                console.log('====')
                lkt_phone_code(type, this)
            },
            //密码登录to验证码登录
            _phone () {
                this.landing = false
                this.codeLoginBtnStatus = false
                this.phone_codeStatus1 = false
                this.account = ''
                this.password = ''
            },
            //验证码登录to密码登录
            _landing_passw () {
                this.pwLoginBtnStatus = false
                this.landing = true
                this.phone = ''
                this.phone_code = ''
            },
            _navigateTo (url) {
                uni.navigateTo({
                    url
                })
            }
        },
        computed: {
            halfLoginIosWidth () {
                var gru = uni.getStorageSync('data_height') ? uni.getStorageSync('data_height') : this.$store.state.data_height
                var heigh = parseInt(gru)
                var he = heigh * 2
                // #ifdef MP-TOUTIAO
                const info = uni.getSystemInfoSync()
                if (info.platform != 'ios') {
                    he = 0
                }
                // #endif
                return uni.upx2px(he) + 'px'
            },
        },
    }
</script>

<style scoped lang="less">
    @import url("../../static/css/login/login.less");
</style>
