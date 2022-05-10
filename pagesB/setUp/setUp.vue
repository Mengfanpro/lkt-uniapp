<template>
    <div class="box">
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <heads :title="language.setUp.title"></heads>

        <div class="load" v-if="load">
            <div>
                <img :src="loadImg" />
                <p>加载中……</p>
            </div>
        </div>
        <div v-else>
            <ul class="setup-ul">
                <li @tap="_uni_navigateTo('changePhone')">
                    <text>{{ bindPhone }}</text>
                    <image class="arrow" :src="jiantou" />
                </li>
                <li v-if="havePass1 && !lktauthflag" @tap="_uni_navigateTo('loginPassword')">
                    <text>{{language.setUp.changePswd}}</text>
                    <image class="arrow" :src="jiantou" />
                </li>

                <li v-else-if="!lktauthflag" @tap="_uni_navigateTo('loginPassword')">
                    <text>{{language.setUp.bindPswd}}</text>
                    <image class="arrow" :src="jiantou" />
                </li>

                <li v-if="havePass && showSetPayPswdFlag" @tap="laikeNavigateTo('changePaypswd', 'paymentPassword')">
                    <text>{{language.setUp.changePaypswd}}</text>
                    <image class="arrow" :src="jiantou" />
                </li>
                <li v-else-if="!havePass && showSetPayPswdFlag" @tap="laikeNavigateTo('setPaypswd', 'payment')">
                    <text>{{language.setUp.bindPaypswd}}</text>
                    <image class="arrow" :src="jiantou" />
                </li>

                <!-- #ifdef MP -->
                <!-- <li v-if="lktauthflag" @tap="quit">
                    <text>使用账号登录</text>
                    <image class="arrow" :src="jiantou" />
                </li> -->
                <!-- #endif -->
            </ul>
            <div class="button margin" v-if="!lktauthflag" @tap="quit">{{language.setUp.bottomBtn}}</div>
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
    data() {
        return {
            jiantou: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jiantou2x.png',
            name: '',
            id: '',
            user_id: '', // 授权id
            size: '',
            number_s: '',
            havePass: false,
            havePass1: false,
            lktauthflag: false, // 是否为授权登录
            bindPhone: '修改手机号',
            showSetPayPswdFlag: true, // 显示修改支付密码和设置密码

            load: true,
            loadImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/loading.gif'
        };
    },
    mounted() {
        this.load = true;
        this.bindPhone = this.language.setUp.changePhone

        
        this.isLogin(()=>{
			this._axios();
			
			let needRegister = uni.getStorageSync('needRegister');
			let LoingByHand = uni.getStorageSync('LoingByHand');
			
			this.lktauthflag = !LoingByHand && needRegister == this.LaiKeTuiCommon.LKT_NRL_TYPE.NRL;
			if (this.lktauthflag) {
			    this.bindPhone = this.language.setUp.bindPhone;
			}
		})
    },
    methods: {
        ...mapMutations({
            
        }),
        /**
         *
         * */
        changeLoginStatus() {
            let needRegister = uni.getStorageSync('needRegister');
            let LoingByHand = uni.getStorageSync('LoingByHand');
            
            this.lktauthflag = !LoingByHand && needRegister == this.LaiKeTuiCommon.LKT_NRL_TYPE.NRL;
            if (this.lktauthflag) {
                this.bindPhone = '绑定手机号';
            }
            this._axios();
        },
        /**
         *
         * */
        laikeNavigateTo(type, url) {
            let needRegister = uni.getStorageSync('needRegister');
            let LoingByHand = uni.getStorageSync('LoingByHand');
            this.lktauthflag = !LoingByHand && needRegister == this.LaiKeTuiCommon.LKT_NRL_TYPE.NRL;
            let phone = uni.getStorageSync('user_phone') ? uni.getStorageSync('user_phone') : this.$store.state.user_phone;
            if (this.lktauthflag && !phone) {
                uni.showToast({
                    title: this.language.setUp.noBind,
                    duration: 1000,
                    icon: 'none'
                });
                return;
            }
            uni.navigateTo({
                url: url + '?havePass=' + this.havePass1
            });
        },
        /**
         *
         * */
        _axios() {
            let data = {
                module: 'app',
                action: 'user',
                app: 'set'
            };

            this.$req.post({data}).then(res => {
                let needRegister = uni.getStorageSync('needRegister');
                let LoingByHand = uni.getStorageSync('LoingByHand');
                let {
                    data: {
                        password_status,
                        mima_status
                    }
                } = res
                if (res.code == 200) {
                    if (password_status == 1) {
                        this.havePass = true;
                    } else if (password_status == 0) {
                        this.havePass = false;
                    }
                    if (mima_status == 1) {
                        this.havePass1 = true;
                    } else if (mima_status == 0) {
                        this.havePass1 = false;
                    }

                    this.lktauthflag = !LoingByHand && needRegister == this.LaiKeTuiCommon.LKT_NRL_TYPE.NRL;
                    this.load = false;
                }
            });
        },
        /**
         *
         * */
        _uni_navigateTo(url) {
            uni.navigateTo({
                url: url + '?havePass=' + this.havePass1
            });
        },
        /**
         *
         * */
        quit() {
            uni.removeStorage({
                key: 'history'
            });

            uni.removeStorage({
                key: 'user_phone'
            });

            uni.removeStorage({
                key: 'hotStatu'
            });

            this.$store.state.cart = [];
            this.$store.state.cart_id = [];
            this.$store.state.nCart = [];
            this.$store.state.shouquan = false;

            uni.removeStorageSync('userinfo');
            uni.removeStorageSync('laiketuiAccessId');

            uni.removeStorageSync('online');
            uni.removeStorageSync('LoingByHand');

            let data = {
                module: 'app',
                action: 'login',
                app: 'quit',
                
            };

            this.$req
                .post({
                    data
                })
                .then(res => {
                    this.$store.state.access_id = '';
                    uni.setStorageSync('isHomeShow',1)

                    uni.removeStorage({
                        key: 'access_id'
                    });

                    uni.navigateTo({
                        url: '/pages/login/login?toHome=true&quit=true'
                    });
                });
        }
    }
};
</script>

<style lang="less" scoped>
@import url('../../static/css/setUp/setUp.less');
</style>
