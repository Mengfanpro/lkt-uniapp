<template>
    <div class="container">
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <div class="head_div">
            <heads :title="language.store.title" :returnFlag="is_share"></heads>
        </div>
        <div class="relative" v-if="!load">
            <div class="storeTop">
                <div class="storeTop_title">
                    <div class="storeTopLeft">
                        <img :src="shop_logo" />
                        <div class="storeTopLeftText">
                            <div class="storeName">
                                {{ shop_name }}
                                <span class="is_open" v-if="is_open == 2">{{language.store.Closed}}</span>

                                <div class="collectionBtn" @tap="_collStore()">
                                    <img :src="collection_status == 0?mch_sc:mch_sch" alt="">
                                </div>


                                <div class="shareBtn" @tap="_share()">
                                    <!-- #ifdef MP-WEIXIN -->
                                    <button id="copyshare" :data-clipboard-text="shareHref" class="gz"
                                        @tap="showShareMask(shop_id)"></button>
                                    <!-- #endif -->
                                    <img :src="mch_fx" alt="">
                                </div>
                            </div>
                            <div class="storeSellNum">
                                {{ quantity_on_sale ? quantity_on_sale : 0 }}
                                {{language.store.sale}} |
                                {{language.store.Sold}}{{ quantity_sold ? quantity_sold : 0 }}{{language.store.piece}} |
                                {{ collection_num ? collection_num : 0 }}{{language.store.people}}
                            </div>
                        </div>
                    </div>
                    <!-- <div class="storeTopRight">
                        <div class="center" @tap="_collStore()">
                            <div v-if="collection_status == 0" class="collectionBtn">
                                <img class="img" :src="scImg" />
                                收藏
                            </div>
                            <div v-else-if="collection_status == 1" class="collectionBtn1">已收藏</div>
                        </div>
                        <div>{{ collection_num ? collection_num : 0 }}人收藏</div>
                    </div> -->
                </div>

                <div class="storeTop_bottom" v-if="shop_list.length>0">
                    <div class="addressBox">
                        <img :src="mch_dz">
                        {{address}}（{{distance || 0}}km）
                    </div>

                    <div class="seeStore"
                        @tap="_toAllGoods('/pagesA/myStore/storeList?isStore=true&shop_id='+shop_id,'navigate')">
                        {{language.store.Store_information}}
                        <img :src="blueRight" alt="">
                    </div>
                </div>
            </div>

            <ul class="coupon_ul" v-if="coupon_list.length>0">
                <li v-for="item,index of coupon_list" :key="index"
                    :style="{backgroundImage: 'url('+(item.point!='已抢光'?mch_coupon_bg:mch_coupon_bgh)+')'}">
                    <img class="coupon_icon" v-if="item.point!='立即领取'&&item.point!='已抢光'" :src="mch_coupon_ylq" alt="">
                    <img class="coupon_icon" v-else-if="item.point=='已抢光'" :src="mch_coupon_yqg" alt="">
                    <div>
                        <p v-if="item.activity_type==2">￥<span>{{item.money}}</span></p>
                        <p v-else-if="item.activity_type==3"><span>{{item.discount}}</span>{{language.store.fracture}}
                        </p>
                        <span>{{item.limit}}</span>
                    </div>
                    <p v-if="item.point=='立即领取'" @tap="clickCouponBtn(item)">
                        <span v-if="languageType == 'en'"
                            style="transform: rotate(90deg); display: block; min-width: 42px; max-width: 42px; overflow: hidden;">{{language.store.receive}}</span>
                        <template v-else>{{language.store.receive}}</template>
                    </p>
                    <p v-else @tap="clickCouponBtn(item)">
                        <span v-if="languageType == 'en'"
                            style="transform: rotate(90deg); display: block; min-width: 42px; max-width: 42px; overflow: hidden;">{{item.point=='可用商品'?language.store.toUse:language.store.qiangguang}}</span>
                        <template v-else>{{item.point=='可用商品'?'去使用':item.point}}</template>
                    </p>
                </li>
                <li style="width: 1px;min-width: 1px;border: 0;background-color: transparent;"></li>
            </ul>

            <div class="topThreeBar">
                <div :class="{ active: tabThree == 1 }" @tap="changeTab(1)">
                    {{language.store.changeTab[0]}}
                    <p class="hen" v-if="tabThree == 1"></p>
                </div>
                <div :class="{ active: tabThree == 2 }" @tap="changeTab(2)">
                    {{language.store.changeTab[1]}}
                    <p class="hen" v-if="tabThree == 2"></p>
                </div>
                <!-- 预售商品 -->
                <div :class="{ active: tabThree == 4 }" @tap="changeTab(4)">
                    {{language.store.changeTab[2]}}
                    <p class="hen" v-if="tabThree == 4 && isPreSell"></p>
                </div>

                <div :class="{ active: tabThree == 3}" @tap="changeTab(3)">
                    {{language.store.changeTab[3]}}
                    <p class="hen" v-if="tabThree == 3"></p>
                </div>
            </div>
            <!-- 轮播图 -->
            <swiper v-if="banner && banner.length>0" class="swiperBox" :indicator-dots="true" :autoplay="true"
                :interval="3000" :duration="1000">
                <swiper-item v-for="(item,index) in banner" :key="index">
                    <image class="swiper-image" :src="item.image" @tap='_toAllGoods(item.url,item.type,item.parameter)'>
                    </image>
                </swiper-item>
            </swiper>
            <!-- 直播入口 -->
            <!-- #ifdef MP-WEIXIN -->
            <div class="liveIndex" v-if="showLive">
                <img :src="liveImg" alt="" />
                <view>
                    <view>{{ liveTitle }}</view>
                    <view class="tag" v-if="liveStatus">
                        <img :src="live" alt="" />
                        <text> {{language.store.live_broadcast}}</text>
                    </view>
                    <view class="retag tag" v-else>
                        <img :src="replay" alt="" />
                        <text>{{language.store.playback}}</text>
                    </view>
                    <navigator open-type="navigate" :url="liveUrl">{{language.store.Watch_now}}</navigator>
                </view>
            </div>
            <!-- #endif -->
            <ul class="goods_ul" v-if="tabThree == 1">
                <li class="goods_like" v-for="(item, index) in list" :key="index" @tap="_goods(item.id)">

                    <div class="goods_like_img relative">
                        <image lazy-load :src="item.imgurl" style="width: 100%;height: 100%;" />

                        <div v-if="item.status == 3" class="dowmPro">
                            {{language.store.shelf}}
                        </div>

                        <div v-else-if="item.num == 0" class="dowmPro">
                            {{language.shoppingCart.soldOut}}
                        </div>
                    </div>

                    <p class="overtitle">{{ item.product_title }}</p>
                    <!-- <p class="overflowText">{{ item.subtitle }}</p> -->
                    <div class="goods_mun">
                        <div class="allgoods_price">
                            <span class='red'>￥{{item.vip_yprice}}</span>
                        </div>
                        <img v-if="is_open == 1" @tap.stop="shopping_j(item.id)" class="img" :src="shopImg" />
                        <img v-else class="img" :src="shopImgGray" />
                    </div>
                </li>
            </ul>
            <!-- 普通商品 -->
            <ul class="goods_ul" v-if="tabThree == 2">
                <li class="goods_like" v-for="(item, index) in list" :key="index" @tap="_goods(item.id)">
                    <div class="goods_like_img relative" style="margin: 0 auto 10rpx">
                        <image lazy-load :src="item.imgurl" style="width: 100%;height: 100%;" />

                        <div v-if="item.status == 3" class="dowmPro">
                            {{language.store.shelf}}
                        </div>

                        <div v-else-if="item.num == 0" class="dowmPro">
                            {{language.shoppingCart.soldOut}}
                        </div>
                    </div>
                    <p class="overtitle">{{ item.product_title }}</p>
                    <!-- <p class="overflowText">{{ item.subtitle }}</p> -->
                    <div class="goods_mun">
                        <div class="allgoods_price">
                            <span class='red'>￥{{item.vip_yprice}}</span>
                        </div>

                        <img v-if="is_open == 1" @tap.stop="shopping_j(item.id)" class="img" :src="shopImg" />
                        <img v-else class="img" :src="shopImgGray" />
                    </div>
                </li>
            </ul>
            <!-- 预售商品 -->
            <ul class="goods_ul" v-if="tabThree == 4">
                <li class="goods_like" v-for="(item, index) in pro_list" :key="index" @tap="_goods3(item.id)">
                    <div class="goods_like_img relative" style="margin: 0 auto 10rpx">
                        <image lazy-load :src="item.imgurl" style="width: 100%;height: 100%;" />
                    </div>
                    <p class="overtitle"><span
                            class="preSale_tag">{{language.goods.goods.presale}}</span>{{ item.product_title }}</p>
                    <div class="goods_mun5">
                        <div class="tag" v-if="item.s_type">
                            <!-- v-if="item.s_type==',1,' -->
                            <span class="hot"> 热销</span>
                            <span class="new"> 新品</span>
                            <span class="com"> 推荐</span>
                        </div>
                        <!-- 价格 -->
                        <div class="price2">
                            <p>￥{{Number(item.price).toFixed(2)}}</p>
                        </div>
                        <p class="price3" v-if="item.deposit">
                            {{language.goods.goods.deposit}} <text> ￥{{Number(item.deposit).toFixed(2)}}</text>
                        </p>

                    </div>
                </li>
            </ul>

            <div v-if="tabThree == 3">
                <ul>
                    <li @tap="toGoods(item.pname, item.cid)" v-for="(item, index) in list" :key="index"
                        class="proClass">
                        {{ item.pname }}
                        <img :src="jiantou" alt="" />
                    </li>
                </ul>
            </div>
            <div class="mask" @tap="_shareDiv" v-if="shareDiv">
                <div class="allCenter">
                    <div v-for="(item, index1) in shareWay" :key="index1" @tap="_invite(item.name)">
                        <div><img :src="item.imgUrl" class="img" /></div>
                        <span class="span">{{ language.toasts.goodsDetailed.shareWay[index1] }}</span>
                    </div>
                </div>
            </div>
            <div class="mask" v-if="saveEWM && saves">
                <div class="shareEwm">
                    <img :src="ewmImg" class="imgEwm" />
                    <img :src="close" class="close" @tap="_closeAllMask" />
                    <view class="saveEWMBtn" @tap="_downEWM()">
                        <!-- #ifdef H5 -->
                        {{ language.goods.goodsDet.hold_picture }}
                        <!-- #endif -->
                        <!-- #ifndef H5 -->
                        <img :src="saves" class="saves" />
                        {{ language.goods.goodsDet.Save_picture }}
                        <!-- #endif -->

                    </view>
                </div>
            </div>
            <div class="nodata" v-if="list.length < 1">
                <image :src="noPro" mode=""></image>
                <p v-if="tabThree == 1">{{language.goods.goodsDet.zwtjsp}}</p>
                <p v-if="tabThree == 2">{{language.goods.goodsDet.zwsp}}</p>
                <p v-if="tabThree == 3">{{language.goods.goodsDet.zwspfl}}</p>
            </div>
            <!-- 分享弹框 -->
            <div class="mask" @tap="_closeAllMask" v-if="shareMask">
                <div class="shareMask" @tap.stop>
                    <div class="shareMaskTitle">{{language.store.Share_with}}</div>
                    <div class="sharepyq">
                        <div class="shareIcon">
                            <button class="share_btn" open-type="share">
                                <img :src="wx_img" />
                                <p class="p">{{language.store.Wechat_friends}}</p>
                            </button>
                        </div>
                        <div class="shareIcon" @tap="showSaveEWM('wx')">
                            <img :src="erm_img" />
                            <p>{{language.store.QR}}</p>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                    <div class="shareEnd" @tap="closeShareMask()">{{language.store.cancel}}</div>
                </div>
            </div>
            <!-- 分享弹框 -->
            <div class="mask" @tap="_closeAllMask" v-if="shareH5Mask">
                <!-- 邀请链接的弹框 -->
                <div class="shareMask" @tap.stop>

                    <div class="sharepyq">
                        <div class="shareIcon" @tap="copyLink" v-clipboard:copy="shareHref" id="copyshare"
                            :data-clipboard-text="shareHref">
                            <img class="h5-img" :src="copy_link" />
                            <!-- 二维码分享 -->
                            <p>{{ language.goods.goodsDet.Copy_link }}</p>
                        </div>
                        <div class="shareIcon" @tap="showSaveEWM('wx')">
                            <img class="h5-img" :src="erm_img" />
                            <!-- 二维码分享 -->
                            <p>{{ language.goods.goodsDet.QR }}</p>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                </div>
            </div>
        </div>

        <skus ref="attrModal" @confirm="_confirm"></skus>
    </div>
</template>

<script>
    import skus from '../../components/skus.vue';
    import {
        LaiKeTuiInvite,
        LaiKeTuiShopEWM
    } from '../../static/js/goods/goodsDetailed.js';
    import {
        mapMutations,
        mapState
    } from 'vuex';
    import {
        copyText
    } from "@/common/util";
    // #ifdef H5
    // #endif
    export default {
        data() {
            return {
                load: true,
                shop_list: [], //线下门店
                store_bottom_flag: false,
                isPreSell:false,
                tabThree: 1,
                saves: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/save.png',
                share_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + '/images/icon/share.png',
                back2: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/back2x.png',
                disc: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/2222x.png',
                jiantou: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jiantou2x.png',
                blueRight: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/blueRight.png',
                title_index: 0,
                wx_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/wechat.png',
                erm_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/ewmShare.png',
                scImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/sc2x.png',
                close: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/close_bb.png',
                live: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/live.png',
                replay: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/replay.png',
                mch_coupon_bg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/mch_coupon_bg.png',
                mch_coupon_bgh: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/mch_coupon_bgh.png',
                mch_coupon_ylq: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/mch_coupon_ylq.png',
                mch_coupon_yqg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/mch_coupon_yqg.png',
                mch_fx: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/mch_fx.png',
                mch_dz: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/mch_dz.png',
                mch_sc: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/mch_sc.png',
                mch_sch: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/mch_schh.png',
                shopImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/allgoods_shopImg.png',
                shopImgGray: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/shopping_cart_gray.png',
                copy_link: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/copy_link.png',
                noPro: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/noPro.png',
                title: '店铺主页',
                collStatus: true,
                fastTap: true,
                shop_id: 1,
                list: '',
                proList: '',
                page: 1,
                loadingType: 0,
                shop_name: '',
                shop_logo: '',
                collection_num: '',
                collection_status: '',
                quantity_on_sale: '',
                quantity_sold: '',
                shareHref: '', //分享的链接
                shareHref2: '', //转发的链接
                shareContent: '一起来用来客推吧！', //分享的内容
                sharehrefTitle: '一起来用来客推吧!', //分享的链接的标题
                shareImg: '', //分享的图片
                allPro: '',
                shareDiv: false,
                shareMask: false,
                saveEWM: false,
                ewmImg: '',
                is_share: false,
                shareWay: [
                    // #ifndef MP-WEIXIN
                    {
                        name: '微信',
                        imgUrl: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/wechat.png'
                    },
                    {
                        name: '朋友圈',
                        imgUrl: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/fdc.png'
                    },
                    {
                        name: '二维码分享',
                        imgUrl: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/ewmShare.png'
                    }
                    // #endif
                ],
                storeTop_content_img: 'https://xiaochengxu.laiketui.com/V3/images/icon1/storeBottom.png',
                liveImg: '',
                liveTitle: '',
                showLive: false,
                liveUrl: '',
                liveStatus: false,
                liveGoods: [], //直播商品
                is_open: 0,
                shareH5Mask: false,
                coupon_list: [],
                haveSkuBean: '',
                num: '',
                numb: '',
                banner: [],

                distance: '',
                address: '',
                shop_address_id: '',
                pro_list: [],
                is_open: 1
            };
        },
        components: {
            skus
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
                            url: `/pagesA/store/store?${res.data.parameter}`
                        });
                    }
                });
                return
            }
            // #endif
            this.shop_id = option.shop_id;
            this.is_share = option.is_share;
            if (option.is_share) {
                uni.setStorageSync('fatherId', option.fatherId);
            }

            var url = uni.getStorageSync('h5_url');
            this.shareHref = url + 'pagesA/store/store?is_share=true&shop_id=' + this.shop_id + '&isfx=true&fatherId=' +
                uni.getStorageSync('user_id');
            this.shareHref2 = '/pagesA/store/store?is_share=true&shop_id=' + this.shop_id + '&isfx=true&fatherId=' + uni
                .getStorageSync('user_id');
        },

        // 补充onShow,从登录页面回来后刷新登录状态
        onShow() {
            if (uni.getStorageSync('shop_address_id')) {
                this.shop_address_id = uni.getStorageSync('shop_address_id')
                uni.removeStorageSync('shop_address_id')
            }

            this.getCoupon()
            this.axios();
            this.loadingType = 0;
            this.page = 1;
        },
        computed: {
            width1: function() {
                var width;
                width = this.list.length * 150;
                return uni.upx2px(width) + 'px';
            },
            ...mapState({
                _cart_num: 'cart_num'
            })
        },
        onShareAppMessage: function(res) {
            this.shareMask = false;

            return {
                title: this.sharehrefTitle,
                path: this.shareHref2,
                imageUrl: this.shareImg,
                bgImgUrl: this.shareImg,
                success: function(res) {
                    console.log('成功', res);
                }
            };
        },
        onReachBottom: function() {
            // tabThree 1推荐 2全部商品 3商品分类 
            if (this.loadingType != 0) {
                return;
            }
            this.loadingType = 1;
            if (this.tabThree != 3) {
                var data = {
                    module: 'app',
                    action: 'mch',
                    m: 'store_homepage_load',
                    pagesize: 10,
                    page: this.page + 1,

                    shop_id: this.shop_id,
                    type: this.tabThree
                };
                if (this.list.length > 0) {
                    this.$req.post({
                        data
                    }).then(res => {
                        let {
                            code,
                            data,
                            message
                        } = res;
                        this.page += 1;
                        if (data.list.length > 0) {

                            if (this.tabThree == 1 || this.tabThree == 2) {
                                data.list.filter(item => {
                                    item.vip_price = Number(item.vip_price).toFixed(2)
                                    item.vip_yprice = Number(item.vip_yprice).toFixed(2)
                                })
                            }

                            this.list = this.list.concat(data.list);
                            this.loadingType = 0;
                        } else {
                            this.loadingType = 2;
                        }
                    });
                }
            }
        },
        methods: {
            _toAllGoods(url, type, parameter) {

                if (url) {
                    if (type == 'navigate') {
                        uni.navigateTo({
                            url,
                        })
                        this.page = 1
                        this.loadingType = 0
                    } else if (type == 'switchTab') {
                        this.page = 1
                        this.loadingType = 0
                        uni.switchTab({
                            url
                        })
                    }
                }

            },
            _confirm(sku) {
                Object.assign(this.$data, sku)
                console.log(this.haveSkuBean)

                if (!this.fastTap) {
                    return
                }
                this.fastTap = false
                if (Boolean(this.haveSkuBean)) {
                    if (this.num == 0) {
                        uni.showToast({
                            title: this.language.store.Tips[0],
                            duration: 1000,
                            icon: 'none'
                        })
                        this.fastTap = true
                    } else if (this.num != 0) {
                        this._shopping()
                    }
                } else {
                    if (this.num == 0) {
                        uni.showToast({
                            title: this.language.store.Tips[0],
                            duration: 1000,
                            icon: 'none'
                        })
                        this.fastTap = true
                    } else {
                        uni.showToast({
                            title: this.language.store.Tips[1],
                            duration: 1000,
                            icon: 'none'
                        })
                        this.fastTap = true
                    }
                }
            },
            // 点击确定购买之后，如果库存不为零。则运行
            _shopping(id) {
                if (this.haveSkuBean) {
                    var data = {
                        module: 'app',
                        action: 'product',
                        app: 'add_cart',
                        pro_id: this.proid,
                        attribute_id: this.haveSkuBean.cid,
                        num: this.numb,
                        type: 'addcart'
                    }

                    this.$req
                        .post({
                            data
                        })
                        .then(res => {
                            let {
                                code,
                                data,
                                message
                            } = res
                            if (code == 200) {
                                uni.showToast({
                                    title: this.language.store.Tips[2],
                                    icon: 'none'
                                })

                                this.$store.state.access_id = data.access_id

                                this.haveSkuBean = ''
                                this.$refs.attrModal._mask_f()
                                this.fastTap = true

                                this.cart_num(this.numb + this._cart_num)
                            } else {
                                uni.showToast({
                                    title: message,
                                    icon: 'none'
                                })
                                this.fastTap = true
                            }
                        })
                        .catch(error => {
                            this.fastTap = true
                        })
                } else {

                    this.fastTap = true
                }
            },
            // 为你推荐商品右下角的小购物车图标
            shopping_j(id) {
                if (!this.fastTap) {
                    return
                }
                this.fastTap = false
                this.proid = id
                var data = {
                    module: 'app',
                    action: 'product',
                    app: 'index',
                    pro_id: id
                }

                this.$req
                    .post({
                        data
                    })
                    .then(res => {
                        this.fastTap = true
                        let {
                            data: {
                                collection_id,
                                pro,
                                comments,
                                attrList,
                                skuBeanList,
                                attribute_list,
                                qj_price,
                                type
                            }
                        } = res

                        this.$refs.attrModal.imgurl = pro.img_arr[0]
                        this.$refs.attrModal.num = pro.num
                        this.$refs.attrModal.price = qj_price
                        this.$refs.attrModal.skuBeanList = attribute_list
                        this.$refs.attrModal.initData()
                        this.$refs.attrModal._mask_display()
                    })
                    .catch(error => {
                        this.fastTap = true
                    })
            },
            clickCouponBtn(item) {
                if (item.point == '立即领取') {
                    this.isLogin(() => {
                        if (!this.fastTap) {
                            return;
                        }
                        this.fastTap = false;

                        let data = {
                            module: 'app',
                            action: 'coupon',
                            app: 'receive',
                            id: item.id
                        };

                        this.$req.post({
                            data
                        }).then(res => {
                            let {
                                code,
                                message
                            } = res;
                            if (code == 200) {
                                uni.showToast({
                                    title: this.language.store.Tips[3],
                                    duration: 1500,
                                    icon: 'none'
                                });
                                setTimeout(() => {
                                    this.getCoupon();
                                }, 1500);
                            } else {
                                uni.showToast({
                                    title: message,
                                    duration: 1500,
                                    icon: 'none'
                                });
                                this.fastTap = true
                            }
                        });
                    })
                }
            },
            async getLiveRoomImg(id) {
                let data = {
                    module: 'app',
                    action: 'liveBroadcast',
                    app: 'getLiveList',
                    start: this.start,
                    limit: this.limit
                };
                let res = await this.$req.post({
                    data
                });

                if (res.code == 200) {
                    let tempList = res.data.list.room_info.filter(item => {
                        if (item.roomid == id) {
                            this.liveImg = item.cover_img;
                            this.liveTitle = item.name;
                            if (item.live_status == 101) {
                                this.showLive = true;
                                this.liveStatus = true;
                                this.liveUrl =
                                    `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}`;
                            } else if (item.live_status == 103) {
                                this.liveStatus = false;
                                this.showLive = true;
                                this.liveUrl =
                                    `../../pages/liveReplay/liveReplay?roomID=${item.roomid}&title=${item.name}&img=${item.cover_img}`;
                                this.liveGoods = item.goods;
                                this.replayGoods(item.goods);
                            } else {
                                this.showLive = false;
                            }
                        }
                    });
                }
            },
            _downEWM() {
                // #ifdef H5
                return false
                // #endif
                let me = this;
                uni.downloadFile({
                    url: this.ewmImg,
                    success(res) {
                        let filePath = res.tempFilePath;
                        uni.saveImageToPhotosAlbum({
                            filePath: filePath,
                            success() {
                                uni.showToast({
                                    title: me.language.store.Tips[4],
                                    duration: 1500,
                                    icon: 'none'
                                });
                                me.shareMask = false;
                                me.saveEWM = false;
                            },
                            fail: function() {
                                uni.showToast({
                                    title: me.language.store.Tips[5],
                                    duration: 1500,
                                    icon: 'none'
                                });
                            }
                        });
                    },
                    fail: function() {
                        uni.showToast({
                            title: me.language.store.Tips[5],
                            duration: 1500,
                            icon: 'none'
                        });
                    }
                });
            },
            _closeAllMask() {
                this.shareH5Mask = false
                this.shareMask = false;
                this.saveEWM = false;
            },
            _shareDiv() {
                this.shareDiv = false;
            },
            _invite(type) {
                this.is_shop = true;
                LaiKeTuiInvite(type, this);
            },
            showSaveEWM(string) {
                this.shareH5Mask = false;
                this.shareMask = false;
                LaiKeTuiShopEWM(string, this);
            },
            _share() {
                // #ifndef MP
                this.isLogin(() => {
                    // #ifdef H5
                    setTimeout(() => {
                        this.shareH5Mask = true;
                    }, 300)
                    // #endif
                    // #ifndef H5
                    // #ifndef MP-WEIXIN
                    this.shareDiv = true;
                    // #endif
                    // #endif
                })
                // #endif
            },
            copyLink() {
                copyText('', this.shareHref);
                uni.showToast({
                    title: this.language.goods.goodsDet.copy_success,
                    duration: 1500,
                    icon: 'none'
                });
                this.shareH5Mask = false;
            },
            _back() {
                uni.navigateBack({
                    delta: 1
                });
            },
            changeLoginStatus() {
                this.axios();
            },
            toGoods(name, cid) {
                uni.navigateTo({
                    url: '/pages/goods/goods?cid=' + cid + '&name=' + name + '&shop_id=' + this.shop_id
                });
            },
            changeTab(num) {
                this.tabThree = num;
                this.page = 1;
                this.loadingType = 0;
                this.axios();
                if (num == 4 ) {
                    this.preSale1()
                    
                }
            },
            _discover(id) {
                this.$store.state.pro_id = id;
                uni.navigateTo({
                    url: '/pages/collection/discover?pro_id=' + id
                });
            },
            // 详情
            _goods(id) {
                this.$store.state.pro_id = id;
                uni.navigateTo({
                    url: '/pages/goods/goodsDetailed?toback=true&pro_id=' + id + '&mch_id=' + this.shop_id
                });
            },
            showShareMask(shop) {
                this.is_shop = true;
                this.shop_id = shop;
                this.sharehrefTitle = this.shop_list.shop_name;
                this.shareImg = this.shop_list.shop_logo;
                this.shareContent = this.shop_list.shop_name;
                var url = uni.getStorageSync('url');
                url = url.split('index')[0];
                this.shareHref = url + 'H5/#/pagesA/store/store?is_share=true&shop_id=' + shop +
                    '&isfx=true&fatherId=' + uni.getStorageSync('user_id');
                this.shareHref2 = '/pagesA/store/store?is_share=true&shop_id=' + shop + '&isfx=true&fatherId=' + uni
                    .getStorageSync('user_id');
                this.isLogin(() => {
                    this.shareMask = true;
                })
            },
            closeShareMask() {
                this.shareMask = false;
                this.overflow = 'scroll';
            },
            _goods3(id) {
                this.$store.state.pro_id = id;
                // uni.navigateTo({
                //     url: '/pages/preSale/goodsDetailed?toback=true&pro_id=' + id + '&mch_id=' + this.shop_id
                // });
                uni.navigateTo({
                    // url: '/pagesC/preSale/goodsDetailed?toback=true&pro_id=' + id
                      url: '/pagesC/webView/preSale?id=' + id
                });
            },
            _collStore() {
                if (!this.fastTap) {
                    return;
                }
                this.fastTap = false;

                this.LaiKeTuiCommon.lktDelaySetVal(this);
                this.isLogin(() => {
                    var data = {
                        module: 'app',
                        action: 'mch',
                        m: 'collection_shop',
                        shop_id: this.shop_id
                    };
                    this.collection_status = this.collection_status == 0 ? 1 : 0;
                    this.$req
                        .post({
                            data
                        })
                        .then(res => {
                            uni.showToast({
                                title: res.message,
                                duration: 1500,
                                icon: 'none'
                            });
                            if (res.code == 200) {
                                setTimeout(() => {
                                    this.fastTap = true;
                                    this.axios();
                                    this.title_index = 0;
                                    this.proList = this.allPro[0];
                                }, 1500);
                            }
                        })
                        .catch(error => {
                            this.fastTap = true;
                        });
                })
            },
            getCoupon() {
                let data = {
                    module: 'app',
                    action: 'coupon',
                    app: 'mch_coupon',
                    shop_id: this.shop_id,
                }
                this.$req.post({
                    data
                }).then(res => {
                    if (res.code == 200) {
                        if (res.data.list && res.data.list.length > 0) {
                            res.data.list.filter(item => {
                                item.money = Number(item.money)
                                item.discount = Number(item.discount)
                            })
                        }
                        this.coupon_list = res.data.list

                        this.fastTap = true
                    }
                })
            },
            // 预售商品
            preSale1() {
                let data = {
                    // cid: this.cid,
                    module: 'app',
                    action: 'preSellGoods',
                    app: 'getGoodsList',
                    type: '1',
                    // title: this.searchtxt? this.searchtxt:'',          
                };
                this.$req.post({
                    data
                }).then(res => {
                    if (res.code == 200) {
                        this.pro_list = res.data.goodsList
                        console.log(this.pro_list, "预售数据")
                    }
                })
            },

            axios() {
                uni.showLoading({
                    title: this.language.showLoading.loading,
                    mask: true
                });

                let longitude = uni.getStorageSync('longitude')
                let latitude = uni.getStorageSync('latitude')

                this.$req
                    .post({
                        data: {
                            module: 'app',
                            action: 'mch',
                            m: 'store_homepage',
                            shop_id: this.shop_id,
                            shop_list_id: this.shop_address_id,
                            type: this.tabThree,
                            longitude,
                            latitude,
                        }
                    })
                    .then(res => {
                        this.load = false;
                        uni.hideLoading();
                        if (res.code == 200) {
                            let {
                                data: data1
                            } = res;
                            if (this.tabThree == 1 || this.tabThree == 2) {
                                data1.list.filter(item => {
                                    item.vip_price = Number(item.vip_price).toFixed(2)
                                    item.vip_yprice = Number(item.vip_yprice).toFixed(2)
                                })
                            }
                            // this.isPreSell=
                            console.log(data1,"shuju1879987879879")
                            this.is_open = data1.is_open
                            this.list = data1.list;
                            this.shop_name = data1.shop_name;
                            this.shop_logo = data1.shop_logo;
                            this.is_open = data1.is_open;
                            this.collection_num = data1.collection_num;
                            this.collection_status = data1.collection_status;
                            this.quantity_on_sale = data1.quantity_on_sale;
                            this.quantity_sold = data1.quantity_sold;
                            this.banner = data1.banner
                            data1.distance = (Number(data1.distance) / 1000).toFixed(1)
                            this.distance = data1.distance
                            this.address = data1.sheng + data1.shi + data1.xian + data1.address

                            this.sharehrefTitle = this.shop_name;
                            this.shareImg = this.shop_logo;
                            this.shareContent = this.shop_name;

                            // 线下门店
                            this.shop_list = res.data.shop_list;
                            // #ifdef MP-WEIXIN
                            this.getLiveRoomImg(data1.roomid);
                            // #endif

                        } else {
                            // uni.showToast({
                            //     title: res.message,
                            //     duration: 1500,
                            //     icon: 'none'
                            // });
                        }
                    })
                    .catch(error => {
                        this.load = false;
                        uni.hideLoading();
                    });
            },
            storeTop_content_show() {
                this.store_bottom_flag = !this.store_bottom_flag;
                if (this.store_bottom_flag) {
                    this.storeTop_content_img = this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/storeTop.png';
                } else {
                    this.storeTop_content_img = this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL +
                        'images/icon1/storeBottom.png';
                }
            },
            ...mapMutations({
                replayGoods: 'SET_REPLAY_GOODS',
                cart_num: 'SET_CART_NUM'
            })
        }
    };
</script>

<style lang="less" scoped>
    @import url('../../static/css/store/store.less');
</style>
