<template>
    <div class="share">
        <lktauthorize ref="lktAuthorizeComp"></lktauthorize>

        <!-- 海报保存弹窗 -->
        <div class="mask" v-if="saveEWM">
            <div class="shareEwm">
                <img style="width: 80rpx;height: 80rpx;-webkit-touch-callout: default;" v-if="!ewmImg" :src="load_img"></img>
                
                <img v-else :src="ewmImg" style="-webkit-touch-callout:default;" class="imgEwm"/>

                <img :src="close" class="close" @tap="_closeAllMask"/>

                <view class="saveEWMBtn" @tap="_downEWM()">
                    <!-- #ifdef H5 -->
                    {{ language.goods.goodsDet.hold_picture }}
                    <!-- #endif -->
                    <!-- #ifndef H5 -->
                    <img :src="saves" class="saves"/>
                    {{ language.goods.goodsDet.Save_picture }}
                    <!-- #endif -->
                </view>
            </div>
        </div>

        <!-- 分享弹框 -->
        <div class="mask" v-if="shareMask && !saveEWM" @tap="_closeAllMask">
            <!-- 邀请链接的弹框 -->
            <div class="shareMask" @tap.stop>
                <!-- 分享至 -->
                <div class="shareMaskTitle">{{ language.goods.goodsDet.Share_with }}</div>

                <!-- #ifdef MP-WEIXIN -->
                <div class="sharepyq">
                    <div class="shareIcon">
                        <button class="share_btn" open-type="share">
                            <img :src="wx_img"/>
                            <!-- 微信好友 -->
                            <p class="p">{{ language.goods.goodsDet.Wechat_friends }}</p>
                        </button>
                    </div>
                    <div class="shareIcon" @tap="showSaveEWM('wx')">
                        <img :src="erm_img"/>
                        <!-- 二维码分享 -->
                        <p>{{ language.goods.goodsDet.QR }}</p>
                    </div>
                    <div class="clearfix"></div>
                </div>
                <!-- #endif -->
                <div class="shareEnd" @tap="closeShareMask()">{{language.goods.goodsDet.cancel}}</div>

            </div>
        </div>

        <!-- 分享弹框 -->
        <div class="mask" v-if="shareH5Mask && !saveEWM" @tap="_closeAllMask">
            <!-- 邀请链接的弹框 -->
            <div class="shareMask" @tap.stop>

                <div class="sharepyq">
                    <div class="shareIcon" @tap="copyLink">
                        <img class="h5-img" :src="copy_link"/>
                        <!-- 二维码分享 -->
                        <p>{{ language.goods.goodsDet.Copy_link }}</p>
                    </div>
                    <div class="shareIcon" @tap="showSaveEWM('wx')">
                        <img class="h5-img" :src="erm_img"/>
                        <!-- 二维码分享 -->
                        <p>{{ language.goods.goodsDet.QR }}</p>
                    </div>
                    <div class="clearfix"></div>
                </div>
            </div>
        </div>

        <!-- 分享弹框 -->
        <div class="mask" @tap="_shareDiv" v-if="shareDiv">
            <div class="allCenter allCenter-safe-area-inset-bottom">
                <!-- 兼容头条小程序 -->
                <!-- #ifdef MP-TOUTIAO -->
                <div @tap="_invite(shareWay[2].name)">
                    <div><img :src="shareWay[2].imgUrl" alt="" style="width: 80rpx;height: 80rpx;" /></div>

                    <span style="font-size: 24rpx;color: #666666;">{{ language.toasts.goodsDetailed.shareWay[2] }}</span>
                </div>
                <!-- #endif -->

                <!-- #ifndef MP-TOUTIAO -->
                <div v-for="(item, index1) in shareWay" :key="index1" @tap="_invite(item.name)">
                    <div><img :src="item.imgUrl" alt="" style="width: 80rpx;height: 80rpx;" /></div>

                    <span style="font-size: 24rpx;color: #666666;">{{ language.toasts.goodsDetailed.shareWay[index1] }}</span>
                </div>
                <!-- #endif -->
            </div>
        </div>
    </div>
</template>

<script>
import {copyText} from "@/common/util";
export default {
    props: {
        share: {
            type: Object,
            default: {},
            required: true
        },
        pro: {
            type: Object,
            default: () => {
                return {
                    
                }
            },
        },
        pro_id: {
            type:[String, Number],
            default: 0,
            required: true
        },
        type: {
            type: String, // JF, JP 
            default: '',
        },
        // 分销商品id
        fx_id: {
            type:[String, Number],
            default: 0,
        }
    },
    watch: {
        share () {
            // this.$data = Object.assign(this.$data, this.share)
            this.$set(this, 'is_shop', this.share.is_shop)
            this.$set(this, 'shop_id', this.share.shop_id)
            this.$set(this, 'sharehrefTitle', this.share.sharehrefTitle)
            this.$set(this, 'shareImg', this.share.shareImg)
            this.$set(this, 'ewmImg', this.share.ewmImg)
            this.$set(this, 'shareContent', this.share.shareContent)
            this.$set(this, 'shareHref', this.share.shareHref)
            this.$set(this, 'shareHref2', this.share.shareHref2)
            this.$set(this, 'shareMask', this.share.shareMask)
            this.$set(this, 'saveEWM', this.share.saveEWM)
            this.$set(this, 'isDistribution', this.share.isDistribution)
        }  
    },
    data() {
        return {
            is_shop: false, // 是否是店铺分享
            shop_id: 1, // 店铺分享id
            sharehrefTitle: '', // 分享标题
            shareImg: '', // 分享图片
            ewmImg: '', // 保存的海报
            shareContent: '', // 分享内容
            shareHref: '', // H5 分享地址
            shareHref2: '', // 小程序分享页面路径
            load_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/5-121204193R7.gif',
            saves: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/save.png',
            wx_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/wechat.png',
            erm_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/ewmShare.png',
            close:  this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/close_bb.png',
            erm_pyq_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/wepyq.png',
            copy_link: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/copy_link.png',
            shareDiv: false,
            isDistribution: false, // 是否是分销商品
            shareMask: false, // 微信小程序下的显示分享判断
            shareH5Mask: false, // H5下的显示分享判断
            saveEWM: false, // 显示海报
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
        }
    },
    methods: {
        /**
         * 关闭分享弹窗
         */
        closeShareMask() {
            this.shareMask = false;
        },
        _invite(type) {
            this.LaiKeTuiInvite(type, this);
        },
        // 关闭分享弹窗
        _shareDiv() {
            this.shareDiv = false;
        },
        // 显示分享弹窗
        showShareMask() {
            // #ifdef H5
            setTimeout(() => {
                this.shareH5Mask = true;
            }, 300)

            // #endif

            // #ifndef H5
            // #ifdef MP-WEIXIN
            this.shareMask = true;
            // #endif
            // #ifndef MP-WEIXIN
            // #ifndef MP-ALIPAY || MP-TOUTIAO || MP-BAIDU
            this.shareDiv = true;
            // #endif
            // #endif
            // #endif
        },
        // 关闭分享弹窗和海报弹窗
        _closeAllMask() {
            this.shareH5Mask = false;
            this.shareMask = false;
            
            this.saveEWM = false;
        },
        copyLink () {
            copyText('', this.shareHref);
            uni.showToast({
                title: this.language.goods.goodsDet.copy_success,
                duration: 1500,
                icon: 'none'
            });
            this.shareH5Mask = false;
        },
        /**
         * 显示分享海报
        */
        showSaveEWM(string) {
            if (this.is_shop) {
                this.LaiKeTuiShopEWM();
            } else {
                this.LaiKeTuiShowSaveEWM(string);
            }
        },
        /**
         * 显示店铺分享海报
         */
        LaiKeTuiShopEWM() {
            let data = {
                module: 'app',
                action: 'getcode',
                m: 'share_shop',
                shop_id: this.shop_id,
            }
            this.$req.post({data}).then(res => {
                if (res.code == 200) {
                    this.ewmImg = res.data.imgUrl
                    this.saveEWM = true
                } else {
                    uni.showToast({
                        title: res.msg,
                        duration: 1500,
                        icon: 'none'
                    })
                }
            })
        },
        /**
         * 显示商品分享海报
        */
        LaiKeTuiShowSaveEWM(string) {
            let me = this;
            // #ifdef APP-PLUS
            string = 'app'
            // #endif
            // #ifdef MP-ALIPAY
            string = 'ali'
            // #endif
            // #ifdef MP-WEIXIN
            string = 'wx'
            // #endif
            // #ifdef MP-TOUTIAO
            string = 'tt'
            // #endif
            var data = {
                module: 'app',
                action: 'getcode',
                m: 'share',
                proId: me.pro_id,
                href: me.shareHref,
                path: me.shareHref.replace(uni.getStorageSync('h5_url'), ''),
            }
            
            if (this.type === 'JF') {
                data.share_type = 2
            } else if (this.type === 'JP') {
                data.type = 'JP'
                data.bindding_id = this.$store.state.bindding_num
            } else if (this.isDistribution) {
                data.type = 'fx'
                data.fx_id = me.fx_id
            }
            
            
            me.$req.post({data}).then(res => {
                console.log(res);
                if (res.code == 200) {
                    me.ewmImg = res.data.imgUrl
                    me.saveEWM = true
                } else {
                    uni.showToast({
                        title: res.message,
                        duration: 1500,
                        icon: 'none'
                    })
                }
            })
        },
        /**
         * 邀请
         * @param type
         * @param me
         * @constructor
         */
        LaiKeTuiInvite(type, me) {
            if (type == '二维码分享') {
                me.showSaveEWM('app')
                return
            }
            if (type == '朋友圈') {
                uni.share({
                    provider: 'weixin',
                    scene: 'WXSenceTimeline',
                    type: 0,
                    href: me.shareHref,
                    title: me.sharehrefTitle,
                    summary: me.shareContent,
                    imageUrl: me.shareImg,
                    success: function(res) {
                        me.fastTap = true
                        uni.showToast({
                            title: me.language.toasts.goodsDetailed.shareOk,
                            icon: 'none'
                        })
                    },
                    fail: function(err) {
                        me.fastTap = true
                        uni.showToast({
                            title: me.language.toasts.goodsDetailed.shareFail,
                            icon: 'none'
                        })
                    }
                })
            } else if (type == '微信') {
                let shareType = 2;
                if (me.LaiKeTuiCommon.IS_SHARE_WECHAT_MINI_PROGRAM && !me.is_shop) {
                    shareType = 5
                }

                let shareContent = me.shareContent;
                if (me.is_shop) {
                    shareContent = `我在${me.sharehrefTitle}发现了一件不错的商品，快来看看吧。`;
                }

                if (shareType === 2) {
                    uni.share({
                        provider: 'weixin',
                        scene: 'WXSceneSession',
                        type: 0,
                        href: me.shareHref,
                        title: me.sharehrefTitle,
                        summary: shareContent,
                        imageUrl: me.shareImg,
                        success: function(res) {
                            me.fastTap = true
                            uni.showToast({
                                title: me.language.toasts.goodsDetailed.shareOk,
                                icon: 'none'
                            })
                        },
                        fail: function(err) {
                            me.fastTap = true
                            uni.showToast({
                                title: me.language.toasts.goodsDetailed.shareFail,
                                icon: 'none'
                            })
                        }
                    })
                } else {
                    uni.share({
                        provider: 'weixin',
                        scene: 'WXSceneSession',
                        type: 5,
                        imageUrl: me.ewmImg,
                        title: me.sharehrefTitle,
                        miniProgram: {
                            id: me.LaiKeTuiCommon.WECHAT_MINI_PROGRAM_ID,
                            path: me.shareHref2,
                            type: 0,
                            webUrl: me.shareHref
                        },
                        success: function(res) {
                            console.log(res);
                        },
                        fail: function(err) {
                            console.error(err);
                        }
                    });
                }
                
                
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
                                title: me.language.goods.goodsDet.Save_success,
                                duration: 1500,
                                icon: 'none'
                            });
                            me.shareMask = false;
                            me.saveEWM = false;
                        },
                        fail: function () {
                            uni.showToast({
                                title: me.language.goods.goodsDet.fail_success,
                                duration: 1500,
                                icon: 'none'
                            });
                        }
                    });
                },
                fail: function () {
                    uni.showToast({
                        title: me.language.goods.goodsDet.fail_success,
                        duration: 1500,
                        icon: 'none'
                    });
                }
            });
        },
    }
}
</script>

<style scoped lang="less">
.mask {
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    //height: ;
    width: 100%;
    background-color: rgba(000, 000, 000, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999 !important;

    .shareMask {
        width: 100%;
        bottom: 0;
        max-height: 90%;
        background-color: #fff;
        position: absolute;
        /* #ifdef H5 */
        width: 630rpx;
        height: 192rpx;
        bottom: 64rpx;
        left: calc((100% - 630rpx) / 2);
        border-radius: 20rpx;
        box-sizing: border-box;
        /* #endif */

        .shareMaskTitle {
            height: 100rpx;
            line-height: 100rpx;
            font-size: 36rpx;
            text-align: center;
            color: #020202;
        }

        .sharepyq {
            width: 70%;
            margin: 0 auto;


            .shareIcon {
                width: 50%;
                float: left;
                text-align: center;
                
                &.width_33 {
                    width: 33%;
                }

                button {
                    /* #ifndef MP */
                    background: transparent;
                    border-radius: 0;
                    padding: 0;
                    margin: 0;
                    /* #endif */
                }

                button::after {
                    border: none;
                }

                .share_btn {
                    background: transparent;
                    padding: 0;
                    margin: 0;
                    border-radius: 0;
                    width: 230rpx;
                    height: 200rpx;
                }

                .share_btn::after {
                    border: none;
                }

                .share_btn .p {
                    margin-top: -26rpx;
                }

                img {
                    width: 80rpx;
                    height: 80rpx;
                    margin-bottom: 25rpx;
                    /* #ifdef H5 */
                    margin-top: 34rpx;
                    margin-bottom: 0;
                    /* #endif */
                }

                p {
                    height: 50rpx;
                    line-height: 50rpx;
                    font-size: 24rpx;
                    margin-bottom: 25rpx;
                    color: #666;
                    text-align: center;
                    /* #ifdef H5 */
                    margin-bottom: 16rpx;
                    /* #endif */
                }
            }
        }

        .shareEnd {
            text-align: center;
            font-size: 36rpx;
            height: 100rpx;
            line-height: 100rpx;
            border-top: 1px solid #eee;
        }
    }

    .allCenter {
        width: 630rpx;
        height: 187rpx;
        border-radius: 20rpx;
        background-color: #fff;
        margin: 0 auto;
        position: absolute;
        bottom: 60rpx;
        left: 60rpx;

        @supports (bottom: constant(safe-area-inset-bottom)) or (bottom: env(safe-area-inset-bottom)) {
            // 不知道为啥没有效果
            //bottom: calc(~"60rpx + constant(safe-area-inset-bottom)");
            //bottom: calc(~"60rpx + env(safe-area-inset-bottom)");
            bottom: 104rpx;
        }

        > div {
            width: 25%;
            text-align: center;
        }
        
        
    }

    .shareEwm {
        position: absolute;
        left: 10%;
        top: 15%;
        height: 964rpx;
        width: 600rpx;
        background-color: #fff;
        border-radius: 8px;
        overflow: hidden;

        display: flex;
        align-items: center;
        justify-content: center;
        
       
        
        .imgEwm {
            -webkit-touch-callout:default;
            width: 100%;
            /* #ifdef MP-TOUTIAO */
            height: 92%;
            /* #endif */
            /* #ifndef MP-TOUTIAO */
            height: 100%;
            /* #endif */
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }

        .close {
            width: 40rpx;
            height: 40rpx;
            position: absolute;
            top: 24rpx;
            right: 24rpx;
        }

        .saveEWMBtn {
            border-top: 1px solid #E6E6E6;
            width: 100%;
            height: 100rpx;
            font-size: 32rpx;
            background-color: #fff;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
            line-height: 100rpx;
            color: #000;
            position: absolute;
            bottom: 0;
            text-align: center;

            .saves {
                width: 26rpx;
                height: 26rpx;
                padding-right: 20rpx;
            }
        }
    }
}

</style>
