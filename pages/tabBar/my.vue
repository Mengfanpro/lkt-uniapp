<template>
    <view class="container">
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        
        <view class="container_top">
            <!-- #ifndef MP-ALIPAY -->
            <view :style="{ height: halfWidth }">
                <view class="topHeight" :style="{ height: halfWidth }"></view>
            </view>
            <!-- #endif -->
            
            <!-- #ifdef MP -->
            <view style="height: 88rpx;"></view>
            <!-- #endif -->
            
            <image :src="my_set" lazy-load="true" @tap="_navigateTo1('/pagesB/setUp/setUp')"></image>
        </view>
        
        <view class="card">
            <image v-if="access_id1" @tap="_navigateTo1('/pages/my/myInfo')" :src="user.headimgurl" mode=""></image>
            <image v-else :src="unLogin" @tap="_navigateTo1('/pages/my/myInfo')" mode=""></image>
            <view class="card_center">
                <view class="card_username" v-if="access_id1">{{user.user_name}}</view>
                <view class="card_username" v-else>{{language.my.loginPrompt}}</view>
                <view v-if="access_id1 && user.mobile" class="card_vip" style="marginTop: 40rpx'">
                 <!--   {{user.grade}} -->
                  <!--  <image :src="level==0?vip_icon0:level==1?vip_icon1:level==2?vip_icon2:vip_icon3"></image> -->
                </view>
                <!-- #ifdef MP-ALIPAY -->
                <button v-if="!access_id1" class="card_btn card_btn1" open-type="getAuthorize" @tap="onGetAuthorize" size="mini" type="primary" scope='userInfo'>{{language.my.authorization}}</button>
                <!-- #endif -->
                <!-- #ifdef MP-BAIDU -->
                <button v-if="!access_id1" class="card_btn card_btn1" open-type="getUserInfo" @tap="bdAuth" size="mini" type="primary">{{language.my.authorization}}</button>
                <!-- #endif -->
                <!-- #ifdef MP-TOUTIAO -->
                <button v-if="!access_id1" class="card_btn card_btn1" open-type="getUserInfo" @tap="ttAuth" size="mini" type="primary">{{language.my.authorization}}</button>
                <!-- #endif -->
                <!-- #ifdef MP-WEIXIN -->
                <button v-if="!access_id1" class="card_btn card_btn1" open-type="getUserInfo" @tap="bindGetUserInfo" type="primary" size="mini">{{language.my.authorization}}</button>
                <!-- #endif -->
                <!-- #ifndef MP -->
                <view class="card_btn card_btn1" v-else @tap="_navigateTo('/pages/login/login?landing_code=1')">{{language.my.toLogin}}</view>
                <!-- #endif -->
              <!--  <text v-if="access_id1 && user.grade!='普通会员' && user.mobile" class="card_time">{{user.grade_end}} {{language.my.endTime}}</text> -->
                <!-- #ifdef MP-WEIXIN -->
                <button v-if="access_id1 && !user.mobile"  class="card_btn card_btn1" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" type="primary" size="mini">{{language.my.bingd_phone}}</button>
                <!-- #endif -->
                
                
            </view>
            <view v-if="access_id1" class="bank-card" @click="_navigateTo('/pagesB/myWallet/bankCard')">
                <image :src="bankCardImg"></image>
                <text>{{language.my.bankcards}}</text>
            </view>
            
            <!-- <view v-if="plugin.sign == 1" class="card_btn" @tap="_navigateTo1('/pagesA/shop/sign')">{{language.my.signIn}}</view> -->
            
        </view>
        
        <view class="card_bottom">
            <view v-if="coupon == 1" @tap="_navigateTo1('/pagesB/coupon/mycoupon')" >
                <view>{{access_id1&&user.coupon_num?user.coupon_num:0}}</view>
                <text>{{language.my.couponNum}}</text>
            </view>
            <view @tap="_navigateTo1('/pages/my/myScore?signPlugin='+sign)">
                <view>{{access_id1&&user.score?user.score:0}}</view>
                <text>{{language.my.integralNum}}</text>
            </view>
            <view v-if="QB == 0" @tap="_navigateTo1('/pagesB/myWallet/myWallet')" >
                <view>
                    <text>￥</text>
                    {{access_id1&&user.money?user.money:'0.00'}}
                </view>
                <text>{{language.my.remainingNum}}</text>
            </view>
            <view @tap="_navigateTo1('/pages/message/systemMesage')">
                <view class="relative" style="top: -6rpx;">
                    <image :src="xiaoxi" mode=""></image>
                    <view class="xxnum" v-if="access_id1&&user.xxnum>0">{{ user.xxnum > 99 ? '99+' : user.xxnum }}</view>
                </view>
                <text>{{language.my.messageNum}}</text>
            </view>
        </view>
        
     <!--   <view class="relative"> -->
         <!--   <image class="my_VIPbg" :src="my_VIPbg" lazy-load="true"></image>
            <image class="my_VIPwz" :src="languageType=='en'?my_VIPwz1:my_VIPwz" lazy-load="true" mode="aspectFit"></image>
            
            <view class="my_VIP_view" @tap="openVip">
                {{language.my.openVip_left}}<view style="margin: 0 6rpx;">6</view>{{language.my.openVip_right}}
                <image :src="my_VIPjt"></image>
            </view> -->
    <!--    </view> -->
        
        
        <view class="content">
            
            <view class="order">
                <view class="order_top">
                    {{language.my.myOrder}}
                    <view @tap="_order(0)">
                        {{language.my.seeOrder}}
                        <image :src="jiantou"></image>
                    </view>
                </view>
                
                <view class="order_bottom">
                    <view @tap="_order(1)">
                        <view>
                            <image :src="my_dfk" mode="widthFix"></image>
                            <view v-if="access_id1&&orderNum.dfk_num>0" class="order_bottom_icon">{{orderNum.dfk_num}}</view>
                        </view>
                        <text>{{language.my.dfk_order}}</text>
                    </view>
                    <view @tap="_order(2)">
                        <view>
                            <image :src="my_dfh" mode="widthFix"></image>
                            <view v-if="access_id1&&orderNum.dfh_num>0" class="order_bottom_icon">{{orderNum.dfh_num}}</view>
                        </view>
                        <text>{{language.my.dfh_order}}</text>
                    </view>
                    <view @tap="_order(3)">
                        <view>
                            <image :src="my_dsh" mode="widthFix"></image>
                            <view v-if="access_id1&&orderNum.dsh_num>0" class="order_bottom_icon">{{orderNum.dsh_num}}</view>
                        </view>
                        <text>{{language.my.dsh_order}}</text>
                    </view>
                    <view @tap="_order(4)">
                        <view>
                            <image :src="my_dpj" mode="widthFix"></image>
                            <view v-if="access_id1&&orderNum.dpj_num>0" class="order_bottom_icon">{{orderNum.dpj_num}}</view>
                        </view>
                        <text>{{language.my.dpj_order}}</text>
                    </view>
                    <view @tap="_navigateTo1('/pagesA/afterSale/afterSale')">
                        <view>
                            <image :src="my_tk" mode="widthFix"></image>
                            <view v-if="access_id1&&orderNum.th_num>0" class="order_bottom_icon">{{orderNum.th_num}}</view>
                        </view>
                        <text>{{language.my.th_order}}</text>
                    </view>
                </view>
            </view>
            
            <view class="listBox" v-if="show_plug || plugin.mch == 1 || plugin.PT == 1 || plugin.MS == 1 || plugin.KJ == 1 || plugin.JP == 1 || plugin.JF == 1 || plugin.FX == 1">
                <view v-if="plugin.mch == 1" @tap="_navigateTo1('/pagesA/myStore/myStore')">
                    <image class="list_left" :src="my_mch" mode="widthFix"></image>
                    <text>{{language.my.my_store}}</text>
                    <image class="jiantou" :src="jiantou"></image>
                </view>
                <!-- #ifndef MP-ALIPAY -->
                <!-- <view v-if="plugin.PT == 1" @tap="_navigateTo1('/pagesA/group/groupOrder')">
                    <image class="list_left" :src="my_group" mode="widthFix"></image>
                    <text>{{language.my.my_group}}</text>
                    <image class="jiantou" :src="jiantou"></image>
                </view> -->
                <!-- #endif -->
                <view v-if="plugin.MS == 1" @tap="_navigateTo1('/pagesB/seckill/seckill_my')">
                    <image class="list_left" :src="my_seckill" mode="widthFix"></image>
                    <text>{{language.my.my_seckill}}</text>
                    <image class="jiantou" :src="jiantou"></image>
                </view>
              <!-- -->
                <view v-if="plugin.JF == 1" @tap="_navigateTo1('/pagesB/integral/exchange')">
                    <image class="list_left" :src="my_dh" mode="widthFix"></image>
                    <text>{{language.my.my_exchange}}</text>
                    <image class="jiantou" :src="jiantou"></image>
                </view>
                <view v-if="plugin.FX == 1" @tap="_navigateTo1('/pagesA/distribution/distribution_center')">
                    <image class="list_left" :src="my_fx" mode="widthFix"></image>
                    <text>{{language.my.my_distribution}}</text>
                    <image class="jiantou" :src="jiantou"></image>
                </view>
            </view>
            
            <view class="listBox">
                <view @tap="_navigateTo1('/pages/collection/collection')">
                    <image class="list_left" :src="my_sc" mode="widthFix"></image>
                    <text>{{language.my.my_collection}}</text>
                    <image class="jiantou" :src="jiantou"></image>
                </view>
                <view @tap="_navigateTo1('/pages/address/receivingAddress?state_manage=2')">
                    <image class="list_left" :src="my_sh" mode="widthFix"></image>
                    <text>{{language.my.address}}</text>
                    <image class="jiantou" :src="jiantou"></image>
                </view>
                <!-- #ifndef MP-TOUTIAO -->
                <view @tap="toKeFu">
                    <!-- #ifdef MP-WEIXIN -->
                    <button class="button_kefu" open-type="contact" type="default" />
                    <!-- #endif -->
                    <!-- #ifdef MP-BAIDU -->
                    <button class="button_kefu" open-type="contact" bindcontact="contactCB"></button>
                    <!-- #endif -->
                    <image class="list_left" :src="my_kefu" mode="widthFix"></image>
                    <text>{{language.my.service}}</text>
                    <image class="jiantou" :src="jiantou"></image>
                </view>
                <!-- #endif -->
                <view @tap="_navigateTo('/pages/my/aboutMe')">
                    <image class="list_left" :src="my_abouts" mode="widthFix"></image>
                    <text>{{language.my.aboutUs}}</text>
                    <image class="jiantou" :src="jiantou"></image>
                </view>
                
               <!-- <view style="position: relative;">
                    <image class="list_left" :src="languageImg" mode="widthFix"></image>
                    <text>{{language.my.languages}}</text>
                    <image class="jiantou" :src="jiantou"></image>
                    <picker :range="language.my.langList" @change="changeLang" :value="lang_value" style="position: absolute;left: 0;right: 0;bottom: 0;top: 0;">
                        <view style="position: absolute;left: 0;right: 0;bottom: 0;top: 0;opacity: 0;">请选择语言</view>
                    </picker>
                </view> -->
            </view>
            
        </view>                     
        

        <maskM :content="maskContent" :display="display" @mask_value="onHandle"></maskM>
    </view>
</template>

<script>
    import { mapMutations, mapState } from 'vuex';
    import maskM from "@/components/maskM";
    export default {
        data() {
            return {
                title: '个人中心',
                access_id: '',
                access_id1: false,
                isClick: false, //防止因为频繁点击导致的页面跳转出错
                vip_modal_flag: false,
                bg_vip: 'background-image: url(' + this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/vip_modal.png)',
                rate: '',
                vip_check: false,
                vip_check_img1: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/vip_checked.png',
                vip_check_img2: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/vip_nocheck.png',
                close_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/vip_close.png',
                my_set: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/my_set.png',
                my_vipIBg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/my_vipIBg.png',
                vip_icon0: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/vip_icon0.png',
                vip_icon1: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/vip_icon1.png',
                vip_icon2: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/vip_icon2.png',
                vip_icon3: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/vip_icon3.png',
                xiaoxi: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/xiaoxi.png',
                xiaoxi_h: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/xiaoxi_h.png',
                my_VIPbg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/my_VIPbg.png',
                my_VIPwz: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/my_VIPwz.png',
                my_VIPwz1: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/my_VIPwz1.png',
                my_VIPjt: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/my_VIPjt.png',
                jiantou: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jiantou.png',
                my_dfh: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/my_dfh.png',
                my_dfk: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/my_dfk.png',
                my_dpj: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/my_dpj.png',
                my_dsh: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/my_dsh.png',
                my_tk: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/my_tk.png',
                my_abouts: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/my_abouts.png',
                bankCardImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/bank-card.png',
                my_bargain: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/my_bargain.png',
                my_seckill: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/my_seckill.png',
                my_bidding: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/my_bidding.png',
                my_dh: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/my_dh.png',
                my_fx: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/my_fx.png',
                my_group: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/my_group.png',
                my_kefu: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/my_kefu.png',
                my_mch: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/my_mch.png',
                my_sc: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/my_sc.png',
                my_sh: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/my_sh.png',
                unLogin: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/unLogin.png',
                languageImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/language.png',
                display: false,
                level: 0,
                user: {},
                sign: 0,
                plugin: {},
                orderNum: {},
                synchronize_type: 0,
                lang_value: 0,
                mobile: '',
                coupon:0,
                QB: 0,
                
                show_plug: true
            };
        },
        onLoad(option) {
            // #ifdef MP-WEIXIN
            if(option.scene) {
                console.log(option.scene)
                let data = {
                    m: 'getCodeParameter',
                    action: 'getcode',
                    module: 'app',
                    key: option.scene
                };
                
                this.$req.post({ data }).then(res => {
                    console.log(res)
                    if(!res.data.parameter) {
                        uni.showToast({
                            title: '分享链接已失效',
                            icon: 'none'
                        });
                        uni.switchTab({
                            url: '/pages/tabBar/home'
                        });
                    } else {
                        uni.redirectTo({
                            url: `/pages/tabBar/home?${res.data.parameter}`
                        });
                    }
                });
                return
            }
            // #endif
			this.getCart();
            this.$store.state.frompage = 'my';
            
            if(uni.getStorageSync('language') == 'en'){
                this.lang_value = 1
            }
        },
		computed:{
			...mapState({
			    _cart_num: 'cart_num'
			}),
            maskContent () {
                return `是否同步${this.user.mobile}的 账号信息`;
            },
		},
        components: {maskM},
        onShow() {
			this.getCart();
            this._axios();
			
            // #ifndef MP
            this.LaiKeTuiCommon.getUrlFirst(this._axios);
            // #endif
            this.isClick = false;
            // #ifdef MP-WEIXIN
            this.LaiketuiWeixinAuth.laiketui_mp_weixin_checkauth(this, this._axios);
            // #endif
            // #ifdef MP-ALIPAY
            this.LaiketuiAliAuth.laiketui_mp_alipay_check(null, this, this._axios);
            // #endif
            // #ifdef MP-TOUTIAO
            this.LaiketuiTTAuth.laiketui_mp_tt_check(null, this, this._axios);
            // #endif
            // #ifdef MP-BAIDU
            this.LaiketuiBDAuth.laiketui_mp_baidu_check(null, this, this._axios);
            // #endif
        },
        onTabItemTap(e) {
            this.LaiKeTuiCommon.closeMPAuthWin(this);
        },
        onUnload() {
            uni.removeStorageSync('isfx');
        },
        methods: {
            onHandle (value) {
                if (value === '取消') {
                    this.display = false;
                } else {
                    this.display = false;
                    this.navTo('/pagesB/setUp/changePhone?withdrawalNoPhone=1')
                }
            },
            async getPhoneNumber (e) {
                
                if (!e.detail.encryptedData) {
                    return false;
                }
                
                let session_key = uni.getStorageSync('userinfo').session_key
                
                let {
                    data:phoneNumber
                } = await this.$req.post({
                    data: {
                        session_key: session_key,
                        encryptedData: e.detail.encryptedData,
                        iv: e.detail.iv,
                        app: 'getWxInfo',
                        action: 'login',
                        module: 'app'
                    }
                });
                let mobile_bind = phoneNumber.phoneNumber;
                // 会员首页判断是否有账户需要同步 synchronize_type 0否1是
                console.log(this.user);
                if (this.synchronize_type == 1) {
                    uni.navigateTo({
                        url: `/pagesB/setUp/changePhone?verifyPhone=1&mobile=${mobile_bind}`
                    })
                    return false;
                }

                let data = {
                    action: 'user',
                    module: 'app',
                    app: 'bind_phone',
                    y_phone: '',
                    x_phone: mobile_bind,
                }
                let {
                    code,
                    message
                } = await this.$req.post({data})
                if (code == 200) {
                    uni.showToast({
                        title: message,
                        icon: 'none'
                    })
                    this.user.mobile = mobile_bind
                    uni.setStorageSync('phoneNumbers',mobile_bind);
                    this.user = Object.assign({}, this.user)
                    this._axios();
                } else {
                    uni.showToast({
                        title: message,
                        icon: 'none'
                    })
                }
            },
            changeLang(e){
                let oldlang = uni.getStorageSync('language')
                if(e.detail.value == 0){
                    uni.removeStorageSync('language')
                }else if(e.detail.value == 1){
                    uni.setStorageSync('language', 'en')
                }
                this.setLang();
                
                this.lang_value = e.detail.value
				
				let data = {
					module: 'app',
					action:'index',
					app:'select_language',
				}
				this.$req.post({data}).then(res=>{
                    let { code, message } = res
                    
                    uni.showToast({
                        title: message,
                        icon: 'none'
                    })
                    
                    if(code != 200){
                        if(oldlang == 'en'){
                            uni.setStorageSync('language', 'en')
                        }else{
                            uni.removeStorageSync('language')
                        }
                        this.setLang();
                    }
                })
            },
			getCart(){
			    var data = {
			        module: 'app',
			        action: 'cart',
			        app: 'index',
			        cart_id: '',
			        page: 1
			    }
			    
			    this.$req.post({ data }).then(res => {
			        let { code,
			        data: {
			            data, list, mch_list, login_status, grade
			        }
			        , message } = res
			        
			        if (code == 200) {
			    		if (data && data.length) {
			    		    var allnum = 0
			    		    for (var i = 0; i < data.length; i++) {
			    		        allnum += Number(data[i].num)
			    		    }
			    		    this.cart_num(allnum)
			    		} else if (data.length == 0) {
			    		    this.cart_num(0)
			    		}
			    		//添加，移除tabbar购物车小点提醒
			    		if (this._cart_num) {
			    		    var cart_num_str = String(this._cart_num)
			    		
			    		    // #ifdef MP-WEIXIN
			    		    uni.setTabBarBadge({
			    		        index: 2,
			    		        text: cart_num_str
			    		    })
			    		    // #endif
			    		
			    		    // #ifndef MP-WEIXIN
			    		    uni.setTabBarBadge({
			    		        index: 2,
			    		        text: cart_num_str
			    		    })
			    		    // #endif
			    		
			    		} else {
			    		    // #ifdef MP-WEIXIN
			    		    uni.removeTabBarBadge({
			    		        index: 2
			    		    })
			    		    // #endif
			    		
			    		    // #ifndef MP-WEIXIN
			    		    uni.removeTabBarBadge({
			    		        index: 2
			    		    })
			    		    // #endif
			    		}
			        } else {
			            // #ifdef MP-WEIXIN
			            uni.removeTabBarBadge({
			                index: 2
			            })
			            // #endif
			                        		
			            // #ifndef MP-WEIXIN
			            uni.removeTabBarBadge({
			                index: 2
			            })
			            // #endif
			        }
			    })
			},
            //微信授权
            bindGetUserInfo (res) {
                
                this.LaiketuiWeixinAuth.laiketui_mp_weixin_auth(res, this)
            },
            
            //头条授权
            ttAuth (res) {
                this.LaiketuiTTAuth.laiketui_mp_tt_userInfo(this)
            },
            
            //百度授权
            bdAuth (res) {
                this.LaiketuiBDAuth.laiketui_mp_baidu_userInfo(this)
            },
            
            //支付宝授权
            onGetAuthorize (res) {
                this.LaiketuiAliAuth.laiketui_mp_alipay_userInfo(res, this)
            },
            toKeFu(){
                // #ifndef MP-WEIXIN ||  MP-TOUTIAO || MP-BAIDU
                this._navigateTo1('/pages/message/service')
                // #endif
            },
            _order(status) {
                this.isLogin(()=>{
                    this.status(status);
                    uni.navigateTo({
                        url: '/pages/order/myOrder?status=' + status
                    });
                })
            },
            openVip(){
                this.isLogin(()=>{
                    if(this.user.grade!='普通会员'){
                        this._navigateTo('/pagesA/vipClub/vipClub')
                    }else{
                        this.toVip(1);
                    }
                })
                
            },
          
            // 进入vip支付页面
            toVip(flag) {
                uni.setStorageSync('edit_flag', flag);
                uni.setStorageSync('edit_grade', this.user.grade);
                this._navigateTo('/pagesA/vip/vip');
            },          
        
            changeLoginStatus() {
                this._axios();
            },
            _navigateTo(url) {
                uni.navigateTo({
                    url: url
                });
            },
            _navigateTo1(url) {
                if (this.isClick == false) {
                    this.isClick = true;
                    this.isLogin(()=>{
                        if(url.includes('/pagesA/shop/sign')){
                            this.$req.post({
                                data: {
                                    module: 'app',
                                    action: 'sign',
                                    app: 'sign',
                                }
                            }).then(res=>{
                                if(res.code == 200){
                                    uni.navigateTo({
                                        url: url
                                    });
                                }else{
                                    uni.showToast({
                                        title: res.message,
                                        icon: 'none'
                                    })
                                }
                            })
                            return
                        }
                        
                        uni.navigateTo({
                            url: url
                        });
                    })
                    setTimeout(() => {
                        this.isClick = false;
                    }, 2000);
                }
            },
            _axios() {
                var data = {
                    module: 'app',
                    action: 'user',
                    app: 'index',
                    mobile: uni.getStorageSync('phoneNumbers') ? uni.getStorageSync('phoneNumbers') : ''
                };

                this.$req.post({data}).then(res=>{
                    this.plugin = res.data.plugin
                    if(res.data.data == undefined){
                        this.access_id1 = false
                        return
                    }else{
                        if (res.code == 200) {
                               let {
                                   data: {
                                       data: {
                                           level,
                                           grade,
                                           user,
                                           grade_end,
                                           xxnum,
                               
                                           dfh_num,
                                           dfk_num,
                                           dpj_num,
                                           dsh_num,
                                           th,
                                           synchronize_type,
                                           remind,
                                           rate,
                                       },
                                       plugin    
                                   },
                                   
                                } = res;
                              
                                this.level = level
                                user.grade = grade
                                user.grade_end = grade_end
                                user.xxnum = xxnum
                                this.user = user;
                                
                                this.coupon = plugin.coupon;
                                this.QB = plugin.QB
                                this.sign = plugin.sign;
                                if(plugin.sign == undefined){
                                    this.sign = 0
                                }
                                this.mch = plugin.mch;
                                this.synchronize_type = synchronize_type
                                
                                this.orderNum = {
                                    th_num: th,
                                    dfk_num: dfk_num,
                                    dfh_num: dfh_num,
                                    dsh_num: dsh_num,
                                    dpj_num: dpj_num
                                }
                            // this.th_num = th;
                            // this.dfk_num = dfk_num;
                            // this.dfh_num = dfh_num;
                            // this.dsh_num = dsh_num;
                            // this.dpj_num = dpj_num;
                            this.$store.state.user_phone = user.mobile;
                            uni.setStorage({
                                key: 'user_phone',
                                data: user.mobile
                            });
                            
                            this.access_id1 = true;
                            this.rate = rate;
                            
                            
                            if (uni.getStorageSync('vip_model_close_time')) {
                                let now = new Date();
                                if (now.getTime() < uni.getStorageSync('vip_model_close_time')) {
                                    this.vip_modal_flag = false;
                                } else {
                                    this.vip_modal_flag = remind ? true : false;
                                    uni.removeStorageSync('vip_model_close_time')
                                }
                            } else {
                                this.vip_modal_flag = remind ? true : false;    
                            }
                            
                            
                            // if (this.vip_modal_flag) {
                            //     uni.hideTabBar();
                            // } else {
                            //     uni.showTabBar();
                            // }
                            uni.showTabBar();
                            
                            this.plugin = plugin
                            
                            this.load = true
                            let that = this
                        	var pphone = uni.getStorageSync('phoneNumbers')
                        	if(synchronize_type == 1) {
                                var data = {
                                    module: 'app',
                                    action: 'user',
                                    app: 'synchronizeAccount',
                                    mobile: pphone,
                                };
                                
                                this.$req.post({data}).then(res => {
                                    if (res.code == 200) {
                                        uni.showModal({
                                        	content:'已同步' + pphone + '的 \n 账号信息',
                                            showCancel: false,
                        					confirmText: this.language.order.myorder.confirm,
                        					cancelText: this.language.order.myorder.cancel,
                                        	success(res) {
                                        		if(res.confirm) {
                                                    
                                        		}
                                        	}
                                        })
                                    }
                                })
                        		
                        	}
                            if(pphone) {
                                setTimeout(() => {
                                    uni.removeStorage({
                                        key:'phoneNumbers'
                                    })
                                },10000)
                            }
                            
                        	
                        }else{
                            this.access_id1 = false;
                            this.plugin = res.data.plugin
                        
                            this.load = true
                        }
                    }
                })

            },
            
            ...mapMutations({
                status: 'SET_STATUS',
				cart_num: 'SET_CART_NUM'
            })
        }
    };
</script>

<style scoped lang="less">
    @import url('../../static/css/tabBar/my.less');
</style>
