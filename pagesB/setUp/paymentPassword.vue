<template>
    <div class="box">
        <heads :title="language.setup2.paymentPass.title"></heads>
        <toload :load="load">
            <ul class="setup-ul yh-setup-ul">
                <li><input type="number" style="font-size: 28rpx;" v-model="user_phone" disabled="true" /></li>

                <li class="last">
                    <input placeholder-style="color: #b8b8b8;font-size: 28rpx;" class="input" :class="{ marginleft: display }" type="number" :placeholder="language.setup2.payment.code_placeHolder" v-model="codeone" />

                    <div class="color yh-color" v-if="display" @tap="_verif()">{{language.setup2.paymentPass.obtain}}</div>

                    <div class="active yh-color" v-if="!display">
                        <span ref="time" class="yh-time" style="font-size: 28rpx;color: #666;">{{ count }}S{{language.setup2.paymentPass.again}}</span>
                    </div>
                </li>

                <li>
                    <input placeholder-style="color: #b8b8b8;font-size: 28rpx;" class="input yh-input" type="number" size="6" :placeholder="language.setup2.paymentPass.pay_pass" v-model="newpassword" />
                    <img :src="del" v-if="newpassword.length" @tap="_empty(1)" />
                </li>

                <li class="set_l">
                    <input placeholder-style="color: #b8b8b8;font-size: 28rpx;" class="input yh-input" type="number" size="6" :placeholder="language.setup2.paymentPass.confirm_pass" v-model="againpassword" />
                    <img :src="del" v-if="againpassword.length" @tap="_empty(2)" />
                </li>

                <li id="setupButtomWrap" class="yh-setupButtomWrap"><div class="yh-setup-buttom" :class="codeone.length > 5 && newpassword.length > 5 && againpassword.length > 5 ? 'setup-buttom' : 'setup-buttom1'" @tap="_sub">{{language.setup2.paymentPass.confirm}}</div></li>
            </ul>
        </toload>
    </div>
</template>

<script>
import { _timeCommon } from '@/static/js/setUp/setUp.js';
export default {
    data() {
        return {
            del: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/delete2x.png',
            load: false,
            title: '修改支付密码',
            oldpassword: '',
            input_oldpassword: '',
            newpassword: '',
            againpassword: '',
            
            codeone: '', // 验证码
            user_phone: '',
            count: '',
            display: true,
            rez: '', // 新密码是否满足正则匹配
            timer: null,
            fastTap: true
        };
    },
    mounted() {
        this.user_phone = uni.getStorageSync('user_phone') ? uni.getStorageSync('user_phone') : this.$store.state.user_phone;
        this.load = true;
        // #ifdef MP-WEIXIN
        if (!this.user_phone) {
            uni.showToast({
                title: this.language.setup2.paymentPass.Tips[0],
                duration: 1000,
                icon: 'none'
            });
            uni.navigateTo({
                url: 'changePhone'
            });
            return;
        }
        // #endif
    },
    watch: {
        /**
         *
         * */
        newpassword(newValue, oldValue) {
            this.$nextTick(() => {
                if (newValue.toString().length > 6) {
                    this.newpassword = oldValue;
                }
            });
        },
        /**
         *
         * */
        againpassword(newValue, oldValue) {
            this.$nextTick(() => {
                if (newValue.toString().length > 6) {
                    this.againpassword = oldValue;
                }
            });
        }
    },
    methods: {
        /**
         *
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
                message_type1: 5 // 短信类别 5.修改支付密码
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
                    } else {
                       _timeCommon(this);
                        const TIME_F = 300;
                        let count_f = TIME_F;
                        let timer_f = setInterval(() => {
                            if (count_f > 0 && count_f <= TIME_F) {
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
         *
         * */
        _empty(type) {
            if (type == 0) {
                this.input_oldpassword = '';
            } else if (type == 1) {
                this.newpassword = '';
            } else if (type == 2) {
                this.againpassword = '';
            }
        },
        /**
         *
         * */
        _newpassword() {
            var re = /^\d{6}$/;
            if (this.newpassword != '') {
                this.rez = re.test(this.newpassword);
                if (this.rez == true) {
                    return;
                } else {
                    this.newpassword = '';
                    uni.showToast({
                        title: this.language.setup2.paymentPass.Tips[1],
                        duration: 1000,
                        icon: 'none'
                    });
                }
            }
        },
        /**
         *
         * */
        _againpassword() {
            if (this.againpassword != '') {
                if (this.newpassword == this.againpassword) {
                    return;
                } else {
                    uni.showToast({
                        title: this.language.setup2.paymentPass.Tips[2],
                        duration: 1000,
                        icon: 'none'
                    });
                }
            }
        },
        /**
         *
         * */
        _sub() {
            var re = /^\d{6}$/;
            if (this.newpassword != '') {
                this.rez = re.test(this.newpassword);
            }

            if (!this.fastTap) {
                return;
            }
            this.fastTap = false;
            if (this.newpassword == '' || this.againpassword == '' || this.codeone.length != 6) {
                uni.showToast({
                    title: this.language.setup2.paymentPass.Tips[3],
                    duration: 1000,
                    icon: 'none',
                    success: res => {
                        this.fastTap = true;
                    }
                });
            } else if (!this.rez) {
                uni.showToast({
                    title: this.language.setup2.paymentPass.Tips[1],
                    duration: 1000,
                    icon: 'none',
                    success: res => {
                        this.fastTap = true;
                    }
                });
            } else if (this.againpassword != '' && this.newpassword != this.againpassword) {
                uni.showToast({
                    title: this.language.setup2.paymentPass.Tips[2],
                    duration: 1000,
                    icon: 'none',
                    success: res => {
                        this.fastTap = true;
                    }
                });
            } else if (this.codeone.length != 6) {
                uni.showToast({
                    title: this.language.setup2.paymentPass.Tips[4],
                    duration: 1000,
                    icon: 'none',
                    success: res => {
                        this.fastTap = true;
                    }
                });
            } else if (this.newpassword != '' && this.newpassword == this.againpassword && this.codeone.length == 6) {
                //发送请求
                let data = {
                    module: 'app',
                    action: 'user',
                    app: 'modify_payment_password',
                    x_password: this.newpassword,
                    phoneNum: this.user_phone,
                    keyCode: this.codeone
                };

                this.$req
                    .post({ data })
                    .then(res => {
                        this.fastTap = true;
                        let { code, message } = res;
                        if (code == 200) {
                            uni.showToast({
                                title:this.language.setup2.paymentPass.Tips[5],
                                duration: 1500,
                                icon: 'none',
                                success: res => {
                                    this.fastTap = true;
                                }
                            });
                            setTimeout(() => {
                                uni.navigateBack({
                                    url: '/pagesB/setUp/setUp'
                                });
                            }, 1500);
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
                    title: this.language.setup2.paymentPass.Tips[3],
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
@import url('../../static/css/setUp/paymentPassword.less');
</style>
