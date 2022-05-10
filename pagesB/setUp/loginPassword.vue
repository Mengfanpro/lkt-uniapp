a<template>
    <div class="box">
        <heads v-if="status" :title="language.setup2.loginPass.title"></heads>
        <heads v-else :title="language.setup2.loginPass.title2"></heads>

        <toload :load="load">
            <ul class="setup-ul yh-setup-ul">
                <li><input type="number" disabled="true" style="font-size: 28rpx;" v-model="user_phone" readonly /></li>

                <li class="last">
                    <input placeholder-style="color:#b8b8b8;font-size: 28rpx;" class="input" type="number" :placeholder="language.setup2.loginPass.code_placeHolder" v-model="codeone" />

                    <div class="color yh-color" v-if="display" @tap="_verif">{{language.setup2.loginPass.obtain}}</div>

                    <div class="active yh-color" v-if="!display">
                        <span ref="time" class="yh-time">{{ count }}S</span>
                        {{language.setup2.loginPass.again}}
                    </div>
                </li>

                <li><input placeholder-style="color:#b8b8b8;font-size: 28rpx;" type="password" :placeholder="language.setup2.loginPass.pass_placeHolder" v-model="passone" /></li>

                <li><input placeholder-style="color:#b8b8b8;font-size: 28rpx;" type="password" :placeholder="language.setup2.loginPass.new_password" v-model="passtwo" /></li>

                <li id="setupButtomWrap" class="yh-setupButtomWrap">
                    <div class="yh-setup-buttom" :class="codeone.length>5 && passone.length>5 && passtwo.length > 5 ? 'setup-buttom':'setup-buttom1'" @tap="_sub">{{language.setup2.loginPass.confirm}}</div>

                    <!-- #ifdef MP-WEIXIN -->
                    <div v-if="isset" class="setup-buttom yh-isset" @tap="_back">{{language.setup2.loginPass.Back}}</div>
                    <!-- #endif -->
                </li>
            </ul>
        </toload>
    </div>
</template>

<script>
    import { _timeCommon } from '@/static/js/setUp/setUp.js'
export default {
    data() {
        return {
            load: false,
            title: '修改登录密码',
            title1: '设置登录密码',
            status: true,
            display: true,
            count: '',
            timer: null,
            code: '',
            name: '',
            passone: '',
            passtwo: '',
            codeone: '', // 验证码
            user_phone: '',
            rez: '', // 新密码是否满足正则匹配
            fastTap: true,
            isset: false,
            back1: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/back2x.png'
        };
    },
    onLoad(res) {
        this.user_phone = uni.getStorageSync('user_phone') ? uni.getStorageSync('user_phone') : this.$store.state.user_phone;
        
        
        this.status = res.havePass == 'true';

        // #ifdef MP-WEIXIN
        var pages = getCurrentPages();
        var beforePage = pages[pages.length - 2];
        if (!beforePage) {
            this.isset = true;
        }
        // #endif
        this.load = true;
    },
    methods: {
        /**
         *
         * */
        _back() {
            uni.switchTab({
                url: '/pages/tabBar/my'
            });
        },
        /**
         * 验证码发送1分钟倒计时
         * */
        _verif() {
            if (!this.fastTap) {
                return;
            }
            this.fastTap = false;
            var data = {
                module: 'app',
                action: 'user',
                app: 'secret_key',
                phone: this.user_phone,
                message_type: 0, // 短信类型 0.验证码 1.短信通知
                message_type1: 4 // 短信类别 4.修改登录密码
            };

            this.$req
                .post({ data })
                .then(res => {
                    this.fastTap = true;
                    let { code, message } = res;
                    if (code != 200) {
                        uni.showToast({
                            title: message,
                            duration: 1000,
                            icon: 'none'
                        });
                    } else if (code == 200) {
                        // 倒计时数秒方法
                        _timeCommon(this);
                        const TIME_F = 300;
                        let count_f = TIME_F;
                        let timer_f = setInterval(() => {
                            if (count_f > 0 ) {
                                count_f--;
                            } else {
                                clearInterval(timer_f);
                                timer_f = null;
                                this.code = '';
                            }
                        }, 1000);
                    }
                })
                .catch(error => {
                    this.fastTap = true;
                });
        },
        /**
         * 第一次密码输入
         * */
        _passone() {
            var re = /^[a-z0-9]{6,15}$/i;
            if (this.passone != '') {
                var rez = re.test(this.passone);
                if (rez == true) {
                    this.allok = true;
                } else {
                    uni.showToast({
                        title: this.language.setup2.loginPass.Tips[0],
                        duration: 1000,
                        icon: 'none'
                    });
                    this.allok = false;
                    return false;
                }
            }
        },
        /**
         * 确认密码
         * */
        _passtwo() {
            if (this.passone != '' && this.passtwo != '') {
                if (this.passone == this.passtwo && this.passtwo != '') {
                    this.allok = true;
                } else {
                    uni.showToast({
                        title: this.language.setup2.loginPass.Tips[1],
                        duration: 1000,
                        icon: 'none'
                    });
                    this.allok = false;
                    return false;
                }
            }
        },
        /**
         *
         * */
        _sub() {
            var re = /^[a-z0-9]{6,15}$/i;
            if (this.passone != '') {
                this.rez = re.test(this.passone);
            }
            if (!this.fastTap) {
                return;
            }
            this.fastTap = false;
            if (this.passone == '' || this.passtwo == '' || this.codeone.length != 6) {
                uni.showToast({
                    title: this.language.setup2.loginPass.Tips[2],
                    duration: 1000,
                    icon: 'none',
                    success: res => {
                        this.fastTap = true;
                    }
                });
            } else if (!this.rez) {
                uni.showToast({
                    title: this.language.setup2.loginPass.Tips[3],
                    duration: 1000,
                    icon: 'none',
                    success: res => {
                        this.fastTap = true;
                    }
                });
            } else if (this.passtwo != '' && this.passone != this.passtwo) {
                uni.showToast({
                    title: this.language.setup2.loginPass.Tips[4],
                    duration: 1000,
                    icon: 'none',
                    success: res => {
                        this.fastTap = true;
                    }
                });
            } else if (this.codeone.length != 6) {
                uni.showToast({
                    title: this.language.setup2.loginPass.Tips[5],
                    duration: 1000,
                    icon: 'none',
                    success: res => {
                        this.fastTap = true;
                    }
                });
            } else if (this.passone != '' && this.passone == this.passtwo && this.codeone.length == 6) {
                // 发送请求
                if (this.status) {
                    var data = {
                        module: 'app',
                        action: 'user',
                        app: 'updatepassword',
                        
                        password: this.passtwo,
                        phone: this.user_phone,
                        keyCode: this.codeone
                    };
                } else {
                    var data = {
                        module: 'app',
                        action: 'user',
                        app: 'set_password',
                        password: this.passtwo,
                        phone: this.user_phone,
                        keyCode: this.codeone
                    };
                }

                this.$req.post({ data }).then(res => {
                        this.fastTap = true;
                        let { code, message } = res;
                        if (code == 200) {
                            uni.showToast({
                                title: this.language.setup2.loginPass.Tips[6],
                                duration: 1500,
                                icon: 'none',
                                success: res => {
                                    this.fastTap = true;
                                }
                            });
                            setTimeout(()=> {
                                uni.switchTab({
                                    url: '/pages/tabBar/my'
                                })
                            }, 1000);
                        } else {
                            uni.showToast({
                                title: message,
                                duration: 1000,
                                icon: 'none'
                            });
                        }
                    })
                    .catch(error => {
                        this.fastTap = true;
                    });
            } else {
                uni.showToast({
                    title: this.language.setup2.loginPass.Tips[2],
                    duration: 1000,
                    icon: 'none',
                    success: res => {
                        this.fastTap = true;
                    }
                });
            }
        }
    }
};
</script>

<style scoped lang="less">
@import url('../../static/css/setUp/loginPassword.less');
</style>
