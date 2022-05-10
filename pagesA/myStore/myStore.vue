<template>
    <div class="container myStore">
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <heads :title="language.myStore.title" :returnR="returnR"></heads>
        <div v-if="!load">
            <div class="checkDiv" v-if="haveStore == 1">
                <div class="noFindDiv">
                    <div style="noFindImgDiv"><img class="noFindImg" :src="checkImg" /></div>
                    <div class="checkDivData">{{language.myStore.inReview}}</div>
                    <span class="noFindText font_24">{{language.myStore.inReviewDisc}}</span>
                    <div class="goOn"></div>
                </div>
            </div>
            <div class="checkDiv" v-else-if="haveStore == 2">
                <div class="myStoreBox" :style="style">
                    <div class="myStoreTop">
                        <div>
                            <image class="img" :src="info.logo" mode="aspectFill"></image>
                        </div>
                        <div>
                            <p class="infoName">{{ info.name }}</p>
                            <p class="infoShop">{{language.myStore.synopsis}} {{ info.shop_information }}</p>
                        </div>
                        <div v-if="mch_status == 1" class="btnDiv" @tap="QRcode">
                            <img :src="mystore_qr" alt="">
                            {{language.myStore.sweepCode}}
                        </div>
                    </div>
                    <div class="myStoreDataDiv">
                        <div @tap="_navigateTo('../myStore/myOrder?status=all')">
                            <p class="dataBlack">{{ info.order_num }}</p>
                            <p class="dataGray">{{language.myStore.todayOrder}}</p>
                        </div>
                        <div @tap="_navigateTo('../myStore/myOrder?status=dfh')">
                            <p class="dataBlack">{{ info.order_num1 }}</p>
                            <p class="dataGray">{{language.myStore.noDeliveryOrder}}</p>
                        </div>
                        <div @tap="_navigateTo('../myStore/myOrder?status=sh')">
                            <p class="dataBlack">{{ info.order_num2 }}</p>
                            <p class="dataGray">{{language.myStore.afterSales}}</p>
                        </div>
                        <div @tap="_navigateTo('../myStore/myCli')">
                            <p class="dataBlack">{{ info.visitor_num }}</p>
                            <p class="dataGray">{{language.myStore.visitors}}</p>
                        </div>
                        <div @tap="_navigateTo('../myStore/myOrder?status=all')">
                            <p class="dataBlack">{{ info.income }}</p>
                            <p class="dataGray">{{language.myStore.newIncome}}</p>
                        </div>
                        <div @tap="_navigateTo('../myStore/myCha')">
                            <p class="dataBlack">{{ info.account_money }}</p>
                            <p class="dataGray">{{language.myStore.balance}}</p>
                        </div>
                    </div>
                    <div class="myStoreSetupDiv">
						<div @tap="_navigateTo('/pagesA/myStore/choose_shopping?up1='+_up1+'&up2='+_up2)" v-if="_up1 && zx">
							<img :src="myzx" alt="">
							<p class='setupBlack'>{{language.myStore.optional}}</p>
						</div>
                        <div @tap="_navigateTo('../myStore/uploadPro')" v-if="_up2">
                            <img :src="ULPro" alt="" />
                            <p class="setupBlack">{{language.myStore.shelves}}</p>
                        </div>
                        <div @tap="_navigateTo('../myStore/myPro?up1='+_up1+'&up2='+_up2)">
                            <img :src="myPro" alt="" />
                            <p class="setupBlack">{{language.myStore.myPro}}</p>
                        </div>
                        <div @tap="_navigateTo('../myStore/myOrder')">
                            <img :src="myOrder" alt="" style="width: 50rpx;"/>
                            <p class="setupBlack">{{language.myStore.myOrder}}</p>
                        </div>
                        <div @tap="_navigateTo('/pagesA/myStore/coupon')" v-if="coupon_status">
                            <img :src="mch_coupon_i" alt="" />
                            <p class="setupBlack">{{language.myStore.coupons}}</p>
                        </div>
                        <div @tap="_navigateTo('../myStore/myCha')">
                            <img :src="myCha" alt="" />
                            <p class="setupBlack">{{language.myStore.withdrawal}}</p>
                        </div>
                        <div @tap="_navigateTo('/pagesB/myWallet/bankCard?type=store')">
                            <img :src="myCard" alt="" />
                            <p class="setupBlack">{{language.myStore.yhkgl}}</p>
                        </div>
<!--                        <div @tap="_navigateTo('/pagesA/myStore/fight_manage')">-->
<!--                            <img :src="mystore_group" alt="" />-->
<!--                            <p class="setupBlack">{{language.myStore.spellGroup}}</p>-->
<!--                        </div>-->
<!--                        <div @tap="_navigateTo('/pagesA/myStore/MsIndex')">-->
<!--                            <img :src="mystore_skill" alt="" />-->
<!--                            <p class="setupBlack">{{language.myStore.seckill}}</p>-->
<!--                        </div>-->
                       <!-- <div v-if="pa_flag == 1" @tap="_navigateTo('/pagesA/myStore/platform_activities')">
                            <img :src="mystore_activity" alt="" />
                            <p class="setupBlack">{{language.myStore.activity}}</p>
                        </div> -->
                        <div @tap="_navigateTo('../myStore/myCli')">
                            <img :src="myCli" alt="" />
                            <p class="setupBlack">{{language.myStore.myCli}}</p>
                        </div>
						<div @tap="_navigateTo('../myStore/freight')">
						    <img :src="mch_freight" alt="" />
						    <p class="setupBlack">{{language.myStore.freight}}</p>
						</div>
                        <div @tap="_navigateTo('../myStore/storeSetup')">
                            <img :src="storeSet" alt="" />
                            <p class="setupBlack">{{language.myStore.storeSetup}}</p>
                        </div>
                        <div @tap="_navigateTo('../myStore/storeList?status_class=1')">
                            <img :src="storeSite" alt="" />
                            <p class="setupBlack">{{language.myStore.storeManag}}</p>
                        </div>
                       <!-- <div @tap="_navigateTo('../myStore/cashier')">
                            <img :src="mch_code" alt="" />
                            <p class="setupBlack">{{language.myStore.mch_code}}</p>
                        </div> -->
                        <div @tap="_navigateTo('/pagesC/bond/index')" v-if="isPromiseSwitch">
                            <img :src="ico_bond" alt="" />
                            <p class="setupBlack">{{language.myStore.bzjgl}}</p>
                        </div>
                        <p class="clear"></p>
                    </div>
                    <div class="support">
                        <div class="supportData">
                            <img class="img" :src="storeLogo" />
                            {{language.myStore.laike}}
                        </div>
                        <div>www.laiketui.com</div>
                    </div>
                </div>
            </div>
            <div class="relative" v-else-if="haveStore == 0">
                <div class="myStoreDiv">
                    <div class="myStoreImgDiv"><img class="img" :src="noStore" /></div>
                    <span class="noFindText">{{language.myStore.noStore}}</span>
                    <div class="toApplyDiv" @tap="_toApply()"><span class="toApply">{{language.myStore.apply}}</span></div>
                </div>
            </div>
            <div class="checkDiv1" v-else-if="haveStore == 3">
                <div class="noFindDiv">
                    <div><img class="noFindImg" :src="checkFalse" /></div>
                    <div class="checkDivData">{{language.myStore.Unapprove}}</div>
                    <span class="noFindText font_24">{{language.myStore.reason}} {{ reason }}</span>
                    <div class="goOn"><div class="toApply1" @tap="_toApply1">{{language.myStore.toApply}}</div></div>
                </div>
            </div>
        </div>
        <div class="load" v-else>
            <div>
                <img :src="loadGif" />
                <p>{{language.toload.load}}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            load: true,
            loadGif: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/5-121204193R7.gif',
            
            title: '我的店铺',
            fastTap: true,
            reason: '',
            noStore: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/noStore.png',
            checkImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/checkIng.png',
            haveStore: 3,
            pa_flag: 0,
            myCli: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/myCli.png',
            livePlayImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/hhhh2x.png',
            storeLogo: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/storeLogo.png',
            myPro: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/myPro.png',
            ULPro: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/ULPro.png',
            myOrder: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/myOrder.png',
            storeSet: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/storeSet.png',
            storeSite: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/storeSite.png',
            mch_code: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/mch/mch_code.png',
            checkFalse: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/checkFalse.png',
            myCha: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/myCha.png',
            myCard: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/yhkgl.png',
            mystore_skill: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/mchSeckill.png',
            mystore_activity: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/mchActivity.png',
            mystore_group: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/mchGroup.png',
            myzx:this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL+'images/icon1/commodity_up2x.png',
            mch_coupon_i:this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL+'images/icon1/mch_coupon_i.png',
            mch_freight:this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL+'images/icon1/mch_freight.png',
            mystore_qr:this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL+'images/icon1/mystore_qr.png',
            ico_bond:this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL+'images/icon1/ico_bond.png',

            info: '',
            returnR: 7,
            livePlayUrl: 'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=1',

            style: 'background-image: url(' + this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + '/images/icon1/mystore_bg.png);background-size: 100% auto;background-repeat: no-repeat;',
            
            _up1: '',
            _up2: '',
			mch_status: 0,  //是否有门店；1有门店
            coupon_status: false, // 是否开启了优惠券插件
            zx:false,
            is_margin:false,
            isPromiseSwitch:false,
        };
    },
  
    onShow() {
        this.isLogin(()=>{
			this._axios();
		})
    },
    methods: {
        changeLoginStatus() {
            this._axios();
        },
        _navigateTo(url) {
            if(this.is_margin || !this.isPromiseSwitch){
                uni.navigateTo({
                    url
                });
            }else{
				uni.showModal({
                    title: this.language.myStore.bzj_title,
                    content: this.language.myStore.bzj_content,
                	confirmText: this.language.showModal.confirm,
                	cancelText: this.language.showModal.cancel,
                    success:(e)=>{
                        if(e.confirm){
                            uni.navigateTo({
                                url: '/pagesC/bond/payText'
                            });
                        }else{
                            return
                        }
                    }
                })
            }
        },
        _toApply() {
            uni.navigateTo({
                url: '../myStore/applyStore'
            });
        },
        _toApply1() {
            uni.navigateTo({
                url: '../myStore/applyStore?goOn=true'
            });
        },
        f1(p1,p2){
        	for(var p in p2){
        		if(p2[p] == p1){
        			return true;
        		}
        	}
        	return false;
        },
        _axios() {
            this.livePlayUrl = 'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=1';

            this.$req
                .post({
                    data: {
                        
                        module: 'app',
                        action: 'mch',
                        m: 'index'
                    }
                })
                .then(res => {
                    setTimeout(() => {
                        this.load = false;
                    }, 200);
                    if (res.code == 200) {
						this.mch_status = res.data.mch_data.mch_status
                        this.commodity_setup=res.data.mch_data.commodity_setup
                        this.pa_flag = res.data.pa_flag;
                        this._up1 = this.f1(2,this.commodity_setup)
                        this._up2 = this.f1(1,this.commodity_setup)
                        this.zx = res.data.zx
                        this.is_margin=res.data.mch_data.isPromisePay
                        this.isPromiseSwitch = res.data.mch_data.isPromiseSwitch
                        uni.setStorageSync('_up1',this._up1)
                        uni.setStorageSync('_up2',this._up2)
                        
                        this.haveStore = res.data.status;
                        this.coupon_status = res.data.coupon_status
                        //直播间房号
                        let roomid = 1;
                        if (res.data.mch_data.roomid) {
                            roomid = res.data.mch_data.roomid;
                        }
                        this.reason = res.data.mch_data.review_result;
                        this.info = res.data.mch_data;
                        if (roomid == 0) {
                            roomid = 1;
                        }
                        this.livePlayUrl = 'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=';
                        this.livePlayUrl = this.livePlayUrl + roomid;
                        uni.setStorageSync('mch_id',res.data.mch_data.shop_id)
                        uni.setStorage({
                            key: 'shop_id',
                            data: res.data.mch_data.shop_id
                        });
                        this.$store.state.shop_id = res.data.mch_data.shop_id;
                    } else {
                        uni.showToast({
                            title: res.message,
                            duration: 1500,
                            icon: 'none'
                        });
                    }
                });
        },
        // 扫码核销
        QRcode() {
            this._navigateTo('../myStore/QRcode');
        }
    }
};
</script>

<style scoped lang="less">
@import url('../../static/css/myStore/myStore.less');
</style>
