<template>
    <div>
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <heads :title="language.setup2.payment.title"></heads>
        <ul class="setup-ul yh-setup-ul">
            <li><input type="number" v-model="user_phone" disabled="true" /></li>

            <li class="last">
                <input
                    placeholder-style="color: #b8b8b8;font-size:28rpx"
                    class="input"
                    :class="{ marginleft: display }"
                    type="number"
                    :placeholder="language.setup2.payment.code_placeHolder"
                    v-model="codeone"
                    style="flex: 1;"
                />

                <div class="color yh-color" v-if="display" @tap="_verif()">{{language.setup2.payment.obtain}}</div>

                <div class="active yh-color" v-if="!display">
                    <span ref="time" class="yh-time">{{ count }}S{{language.setup2.payment.again}}</span>
                </div>
            </li>

            <li><input placeholder-style="color:#b8b8b8;font-size:28rpx" type="password" maxlength="6" :placeholder="language.setup2.payment.pay_pass" v-model="onepay" @blur="_blur(1)" /></li>
            <li><input placeholder-style="color:#b8b8b8;font-size:28rpx" type="password" maxlength="6" :placeholder="language.setup2.payment.confirm_pass" v-model="twopay" @blur="_blur(2)" /></li>
            <li class="yh-setupButtomWrap"><div class="setup-buttom yh-setup-buttom" :class="(codeone.length == 6 && onepay.length == 6 && twopay.length == 6) ? '':'action'" @tap="_sub">{{language.setup2.payment.confirm}}</div></li>
        </ul>
    </div>
</template>

<script>
import { telephone } from '../../common/landing.js';
import { _timeCommon } from '@/static/js/setUp/setUp.js';


export default {
    data() {
        return {
            title: '设置支付密码',
            display: true,
            count: '',
            timer: null,
            code: '',
            onepay: '', // 第一次支付密码
            twopay: '', // 第二次支付密码
            codeone: '', // 验证码
            user_phone: '', // 旧手机号
            
            guan: false,
            guan_word: '',
            fastTap: true
        };
    },
    mounted(option) {
        this.isLogin(()=>{
			
			this.user_phone = uni.getStorageSync('user_phone') ? uni.getStorageSync('user_phone') : this.$store.state.user_phone;
			// #ifdef MP-WEIXIN
			if (!this.user_phone) {
			    uni.showToast({
			        title: this.language.setup2.payment.Tips[0],
			        duration: 1000,
			        icon: 'none'
			    });
			    uni.navigateTo({
			        url: 'changePhone'
			    });
			    return;
			}
			// #endif
		})
    },
    methods: {
        /**
         *
         * */
        changeLoginStatus() {
            
        },
        /**
         * 验证码发送1分钟倒计时
         * */
        _verif() {
            var data = {
                module: 'app',
                action: 'user',
                app: 'secret_key',
                phone: this.user_phone,
                message_type: 0, // 短信类型 0.验证码 1.短信通知
                message_type1: 5 // 短信类别 5.修改支付密码
            };
            // if (this.user_phone) {
            //     if (!this.fastTap) {
            //         return;
            //     }
            //     this.fastTap = false;

            //     this.$req
            //         .post({ data })
            //         .then(res => {
            //             this.fastTap = true;
            //             let { code, message } = res;
            //             if (code != 200) {
            //                 uni.showToast({
            //                     title: message,
            //                     duration: 1000,
            //                     icon: 'none'
            //                 });
            //             } else {
            //                 _timeCommon(this);
            //                 const TIME_F = 60;
            //                 let count_f = TIME_F;
            //                 let timer_f = setInterval(() => {
            //                     if (count_f > 0 && count_f <= TIME_F) {
            //                         count_f--;
            //                     } else {
            //                         clearInterval(timer_f);
            //                         timer_f = null;
            //                         this.code = '';
            //                     }
            //                 }, 1000);
            //             }
            //         })
            //         .catch(error => {
            //             this.fastTap = true;
            //         });
            // } else {
            //     uni.showToast({
            //         title: this.language.setup2.payment.Tips[1],
            //         duration: 1000,
            //         icon: 'none'
            //     });
            // }
            if (!this.fastTap) {
                return;
            }
            this.fastTap = false;
            
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
                        const TIME_F = 60;
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
        _blur(type) {
            var val = this.onepay;
            if (type == 2) {
                val = this.twopay;
            }
            var numReg = /^[0-9]+$/;
            var numRe = new RegExp(numReg);
            if (val.length != 6) {
                uni.showToast({
                    title: this.language.setup2.payment.pay_pass,
                    duration: 1500,
                    icon: 'none'
                });
                return false;
            }
            if (!numRe.test(val)) {
                if (type == 1) {
                    this.onepay = '';
                } else if (type == 2) {
                    this.twopay = '';
                }
                uni.showToast({
                    title: this.language.setup2.payment.Tips[2],
                    duration: 1500,
                    icon: 'none'
                });
                return false;
            }
        },
        /**
         *
         * */
        _sub() {
            var numReg = /^[0-9]+$/;
            var numRe = new RegExp(numReg);
            if (!numRe.test(this.onepay) || !numRe.test(this.twopay)) {
                uni.showToast({
                    title: this.language.setup2.payment.Tips[2],
                    duration: 1500,
                    icon: 'none'
                });
                return false;
            }
            if (!this.fastTap) {
                return;
            }
            this.fastTap = false;

            if (this.onepay != '' && this.onepay != this.twopay) {
                uni.showToast({
                    title: this.language.setup2.payment.Tips[3],
                    duration: 1000,
                    icon: 'none',
                    success: res => {
                        this.fastTap = true;
                    }
                });
            } else if (this.onepay.length != 6 && this.onepay.length != 6) {
                uni.showToast({
                    title: this.language.setup2.payment.Tips[4],
                    duration: 1000,
                    icon: 'none',
                    success: res => {
                        this.fastTap = true;
                    }
                });
            } else if (this.onepay != '' && this.onepay === this.twopay) {
                var data = {
                    module: 'app',
                    action: 'user',
                    app: 'set_payment_password',
                    phone: this.user_phone,
                    password: this.twopay,
                    keyCode: this.codeone
                };

                this.$req
                    .post({ data })
                    .then(res => {
                        let { code, message } = res;

                        if (code == 200) {
                            uni.showToast({
                                title: this.language.setup2.payment.Tips[5],
                                duration: 1500,
                                icon: 'none'
                            });
                            setTimeout(() => {
                                this.fastTap = true;
                                uni.navigateBack({
                                    delta: 1
                                });
                            }, 1500);
                        } else {
                            uni.showToast({
                                title: message,
                                duration: 1000,
                                icon: 'none',
                                success: res => {
                                    this.fastTap = true;
                                }
                            });
                        }
                    })
                    .catch(error => {
                        this.fastTap = true;
                    });
            } else {
                this.fastTap = true;
            }
        }
    }
};
</script>

<style scoped lang="less">
@import url('../../static/css/setUp/payment.less');
</style>
