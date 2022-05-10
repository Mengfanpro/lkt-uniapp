<template>
    <div>
        <heads :title="title"></heads>

        <toload :load="load">
            <ul class="setup-ul yh-setup-ul">
                <li><input placeholder-style="color: #b8b8b8;font-size:28rpx" type="number" :placeholder="language.setup2.changePhone.phone_placeholder" v-model="newphone" @input="_changeStep" /></li>

                <li class="last">
                    <input placeholder-style="color: #b8b8b8;font-size:28rpx" class="input" type="number" :placeholder="language.setup2.changePhone.code_placeHolder" v-model="codeone" @input="_changeStep" />

                    <div class="color yh-color" style="" v-if="display" @tap="_verif">{{language.setup2.changePhone.obtain}}</div>

                    <div class="active yh-color" v-if="!display">
                        <span ref="time" class="yh-time">{{ count }}s</span>
                        {{language.setup2.changePhone.again}}
                    </div>
                </li>

                <li id="setupButtomWrap" class="yh-setupButtomWrap"><div class="setup-buttom yh-isSure" :class="{ sure: isSure }" @tap="_sub">{{language.setup2.changePhone.confirm}}</div></li>
            </ul>
        </toload>
    </div>
</template>

<script>
import { telephone } from '../../common/landing.js';
import { _timeCommon } from '@/static/js/setUp/setUp.js'

export default {
    data() {
        return {
            title: '修改手机号码',
            display: true,
            count: '',
            timer: null,
            code: '',
            newphone: '',
            passtwo: '',
            codeone: '', // 验证码
            oldphone: '', // 旧手机号
            phone_next: '', // 新手机号码输入正确返回值
            fastTap: true,
            isSure: false,
            load: false,
            verifyPhone: false,
        };
    },
    onLoad(option) {
		this.setLang();
		
        this.oldphone = uni.getStorageSync('user_phone') ? uni.getStorageSync('user_phone') : this.$store.state.user_phone;

        
        let needRegister = uni.getStorageSync('needRegister');
        let LoingByHand = uni.getStorageSync('LoingByHand');

        let authFlag = !LoingByHand && needRegister == this.LaiKeTuiCommon.LKT_NRL_TYPE.NRL;
		
		this.title = this.language.setup2.changePhone.title;

        if (authFlag) {
            this.title = this.language.setup2.changePhone.title1;
            //#ifdef MP-WEIXIN
            uni.setNavigationBarTitle({
                title: this.title
            });
            // #endif
        }
        if(option.withdrawalNoPhone){
            this.title = this.language.setup2.changePhone.title1;
        }
        if(option.verifyPhone){
            this.title = this.language.setup2.changePhone.title2;
            this.verifyPhone = true;
            this.newphone = option.mobile
        }
        this.ceshi = option
        
        this.load = true;
    },
    methods: {
        /**
         *
         * */
        _changeStep(e) {
            if (e.detail.value.length == 11 && this.codeone.length == 6) {
                this.isSure = true;
            } else if (e.detail.value.length == 6 && this.newphone.length == 11) {
                this.isSure = true;
            } else {
                this.isSure = false;
            }
        },
        /**
         * 手机号码验证
         * */
        _telephone() {
            if (this.oldphone != this.newphone) {
                this.phone_next = telephone(this.newphone);
            } else {
                uni.showToast({
                    title: this.language.setup2.changePhone.Tips[0],
                    duration: 1000,
                    icon: 'none'
                });
            }
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
                phone: this.newphone,
                message_type: 0, // 短信类型 0.验证码 1.短信通知
                message_type1: 3 // 短信类别 3.修改手机号
            };

            if (this.newphone) {
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
                                if (count_f > 0) {
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
            } else {
                this.fastTap = true;
                uni.showToast({
                    title: this.language.setup2.changePhone.Tips[1],
                    duration: 1000,
                    icon: 'none'
                });
            }
        },
        /**
         *
         * */
        _sub() {
            if (!this.fastTap) {
                return;
            }
            this.fastTap = false;
            if (this.codeone == '' || this.newphone == '') {
                uni.showToast({
                    title: this.language.setup2.changePhone.Tips[2],
                    icon: 'none',
                    success: res => {
                        this.fastTap = true;
                    }
                });
            } else if (this.codeone.length != 6) {
                uni.showToast({
                    title: this.language.setup2.changePhone.Tips[3],
                    icon: 'none',
                    success: res => {
                        this.fastTap = true;
                    }
                });
            } else if (this.oldphone != this.newphone) {
                this.fastTap = true;
                this.phone_next = telephone(this.newphone);
            } else if (this.oldphone == this.newphone) {
                uni.showToast({
                    title: this.language.setup2.changePhone.Tips[4],
                    icon: 'none',
                    success: res => {
                        this.fastTap = true;
                    }
                });
            }

            if (this.codeone.length == 6 && this.newphone != '' && this.oldphone != this.newphone && this.phone_next == 1) {
                //发送请求
                
                if (this.verifyPhone) {
                    var data = {
                        module: 'app',
                        action: 'user',
                        app: 'synchronizeAccount',
                        mobile: this.newphone,
                        keyCode: this.codeone
                    };
                    
                    this.$req.post({data}).then(res => {
                        this.fastTap = true;
                        uni.showToast({
                            title: res.message,
                            icon: 'none'
                        })
                        if (res.code == 200) {
                            setTimeout(() => {
                                uni.switchTab({
                                    url:'/pages/tabBar/my'
                                })
                                
                               // this.navBack()
                            }, 1000)   
                        }
                    })
                    
                } else {
                    var data = {
                        module: 'app',
                        action: 'user',
                        app: 'update_phone',
                        y_phone: this.oldphone,
                        x_phone: this.newphone,
                        keyCode: this.codeone
                    };

                    this.$req
                        .post({ data })
                        .then(res => {
                            this.fastTap = true;
                            let { code, message } = res;
                            if (code == 200) {
                                uni.showToast({
                                    title: this.language.setup2.changePhone.Tips[5],
                                    duration: 1000,
                                    icon: 'none'
                                });

                                uni.setStorageSync('user_phone', this.newphone);
                                this.$store.state.user_phone = this.newphone;
                                setTimeout(() => {
                                    if(this.oldphone == ''){
                                        uni.redirectTo({
                                            url: '/pagesB/setUp/payment'
                                        })
                                    }else{
                                        uni.navigateBack({
                                            delta: 1
                                        })
                                    }
                                }, 1000);
                            } else {
                                uni.showToast({
                                    title: message,
                                    icon: 'none'
                                });
                            }
                        })
                        .catch(error => {
                            this.fastTap = true;
                        });
                }
                
                
                
            } else {
                this.fastTap = true;
            }
        }
    }
};
</script>

<style scoped lang="less">
@import url('../../static/css/setUp/changePhone.less');
</style>
