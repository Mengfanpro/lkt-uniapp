<template>
    <view>
        <div class='relative'>
            <heads :title='language.vipClub.title' :returnR='returnR'></heads>
            <!-- #ifndef MP -->
            <div id='copyshare' v-if='share_s==1' @tap="vipshare" :style="'top: '+top+'px'"
                 :data-clipboard-text='shareHref'>{{language.vipClub.Member_sharing}}
            </div>
            <!-- #endif -->
        </div>

        <!-- #ifdef MP -->

        <!-- #ifdef MP-ALIPAY || MP-TOUTIAO || MP-BAIDU -->
        <button class='vip_share_box' open-type="share">
            <div class='div'>{{language.vipClub.Member_sharing}}</div>
        </button>
        <!-- #endif -->

        <!-- #ifndef MP-ALIPAY || MP-TOUTIAO || MP-BAIDU -->
        <div class='vip_share_box' v-if='share_s==1'>
            <span class='div' @tap="vipshare">{{language.vipClub.Member_sharing}}</span>
        </div>
        <!-- #endif -->

        <!-- #endif -->
        <div class='all' v-for='(item, i) in userVipMsg' :key='i'>
            <div>
                <!-- 会员卡面 -->
                <div class='vip-card' :style="'height:'+TT_height">
                    <image :src="item.imgurl" id='vip-card-img' :style="'height:'+TT_height"></image>
                    <div>
                        <image :src="item.headimgurl" class='vip-card-headimg'></image>
                        <div class='vip-msg'>
							<span class='name'>
								<span class="user_name_style"
                                      :style="'color:'+item.font_color">{{item.user_name}}</span>
								<div class='tag vip-level' :style="'color:'+ item.font_color">
									<img class='img' :src="item.imgurl_s">
									<span>{{item.grade}}</span>
								</div>
							</span>
                            <div class='pay_btn_box'>
                                <span v-if='vip_up==1' class='tag pay-tag' @tap="toVip(3)">{{language.vipClub.upgrade}}</span>
                            </div>
                        </div>
                    </div>
                    <span class='tag-xf' @tap="toVip(2)">{{language.vipClub.renew}}</span>
                    <span class='time' :style="'color:'+item.date_color">{{item.grade}}{{language.vipClub.Valid}}{{item.grade_end}}</span>
                </div>
                <!-- 权益 -->
                <span class='desc-title'>{{language.vipClub.interests}}</span>

                <div class='up-title' @tap='_toGradeUse'>{{language.vipClub.rules}}</div>
                <div class='desc'>
                    <div class='desc-item'>
                        <div class='desc-img rate'>{{item.rate}}</div>
                        <span>{{item.rate}}{{language.vipClub.fracture}}</span>
                    </div>
                    <div class='desc-item' v-for='(item, id) in vipRights' :key='id'>
                        <div class='desc-img'><img :src="item.image" alt=""></div>
                        <span>{{item.name}}</span>
                    </div>
                </div>
                <!-- 会员商品 -->
                <span class='good-title'>{{language.vipClub.Member_Specials}}</span>
                <div class='good'>
                    <div class='good-item' v-for='(item, num) in product' :key='num'>
                        <image class="good-img" :src="item.imgurl" mode="widthFix" @tap="_goods(item.id)"></image>
                        <div class='good-msg'>
							<span class='good-name'>
								<span class='span'>{{language.vipClub.member}}</span>
								{{item.product_title}}
							</span>
                            <span class='good-price'>{{language.vipClub.member_price}} ¥{{Number(item.price).toFixed(2)}}</span>
                            <span class='yj-price'>{{language.vipClub.original}} ¥{{Number(item.yprice).toFixed(2)}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="mask" @touchmove.stop v-if="shareMask && saveEWM">
            <div class="shareEwm" v-if="saveEWM">
                <img :src="ewmImg" class="imgEwm">
                <img :src="close" class="close" @tap="_closeAllMask">
                <view class="saveEWMBtn">


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
        <div class="mask" @tap="_closeAllMask" v-if="shareH5Mask">
            <!-- 邀请链接的弹框 -->
            <div class="shareMask" @tap.stop>

                <div class="sharepyq">
                    <div class="shareIcon" @tap="copyLink">
                        <img class="h5-img" :src="copy_link"/>
                        <!-- 二维码分享 -->
                        <p>{{ language.goods.goodsDet.Copy_link }}</p>
                    </div>
                    <div class="shareIcon" @tap="showSaveEWM()">
                        <img class="h5-img" :src="erm_img"/>
                        <!-- 二维码分享 -->
                        <p>{{ language.goods.goodsDet.QR }}</p>
                    </div>
                    <div class="clearfix"></div>
                </div>
            </div>
        </div>
        
        <!-- 会员分享蒙版 -->
        <div v-if='shareFlag' class='vipshare' @tap="shareStop" @touchmove.stop.prevent='stopmove'>
            <div>
                <!-- #ifdef MP-WEIXIN -->
                <div class='relative'>
                    <img :src="wechatimg">
                    <p style='margin-top: -26rpx;'>{{language.vipClub.Wechat_friends}}</p>
                    <button class="share_btn" open-type="share">{{language.vipClub.share}}</button>
                </div>
                <!-- #endif -->

                <!-- #ifdef APP-PLUS -->
                <div @tap.stop='_shareApp(2)'>
                    <img :src="wechatimg">
                    <p>{{language.vipClub.WeChat}}</p>
                </div>
                <div @tap.stop='_shareApp(1)'>
                    <img :src="pyq_img">
                    <p>{{language.vipClub.Wechat_Moments}}</p>
                </div>
                <!-- #endif -->

                <div @tap.stop='_shareApp(3)'>
                    <img :src="ewmShareimg">
                    <p>{{language.vipClub.QR}}</p>
                </div>

            </div>
        </div>
        <ruleModal v-model="isShow" @click="_toGradeUse" :title="language.vipClub.rules" :details="rule"/>
    </view>
</template>

<script>
    import ruleModal from '@/components/ruleModal.vue'
    import wxParse from '../../components/mpvue-wxparse/src/wxParse.vue'
    import '../../common/clipboard.js'
    import {copyText} from "@/common/util";

    export default {
        data () {
            return {
                returnR: "7",
                title: 'VIP会员中心', //页面标题
                userVipMsg: [],
                share_img: '',
                rule: '',
                product: [],
                shareFlag: false, //会员分享控制
                top: '0',  //设备顶部状态栏高度
                share_s: 0,
                shareMask: false,
                vip_up: 1,  //1、可以升级
                gz_height: '',
                user_id: '',
                shareHref: '',  //分享链接
                isShow: false,
                shareH5Mask: false,
                saveEWM: false,
                close: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/close_bb.png',
                ewmImg: '', //二维码图片
                TT_height: '',
                pyq_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/wepyq.png',
                wechatimg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/wechat.png',
                copy_link: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/copy_link.png',
                ewmShareimg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/ewmShare.png',
                erm_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/ewmShare.png',
                saves: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/save.png',

                // 以下为各会员权益，测试版
                vipRights: [
                    {
                        name: '闪电退货', //权益名称
                        image: uni.getStorageSync('endurl') + 'images/icon1/vip/sdth.jpg', //权益图标
                    }, {
                        name: '活动专属', //权益名称
                        image: uni.getStorageSync('endurl') + 'images/icon1/vip/hdzs.jpg', //权益图标
                    }, {
                        name: '快速发货', //权益名称
                        image: uni.getStorageSync('endurl') + 'images/icon1/vip/sdth.jpg', //权益图标
                    }, {
                        name: '其他优惠', //权益名称
                        image: uni.getStorageSync('endurl') + 'images/icon1/vip/hdzs.jpg', //权益图标
                    }
                ]
            }
        },
        components: {
            wxParse,
            ruleModal
        },
        //转发
        onShareAppMessage: function (res) {

            let data = {
                isfx: 1,
                tui_id: this.user_id,
            }

            let share = '/pagesA/vip/vip?data=' + JSON.stringify(data)

            console.log('share是', share)
            if (res.from === 'button') {
                console.log('--------------button---------------')
            }

            return {
                title: this.language.vipClub.Member_sharing1,
                path: share,
                imageUrl: this.share_img,
                // bgImgUrl:this.userVipMsg[0].imgurl,
                success: function (res) {
                    console.log('成功', res)
                }
            }
        },
        onLoad (option) {
            if(option.toBack){
                this.returnR = 0
            }
            //#ifdef MP
            let data = {
                isfx: 1,
                tui_id: this.user_id,
            }
            // #endif
            //微信小程序中自定义标题
            //#ifdef MP-WEIXIN
            uni.setNavigationBarTitle({
                title: this.title
            })
            // #endif
            // #ifdef APP-PLUS
            var that = this
            uni.getSystemInfo({
                success (res) {
                    that.top = res.statusBarHeight
                }
            })
            // #endif

            this.gz_height = uni.upx2px(150) + 'px'
            // 适配头条小程序
            this.TT_height = uni.upx2px(300) + 'px'
        },
        onShow () {
            
             this._axios()
             this.vipRights = [
                    {
                        name: this.language.vip.vipRights[2], //权益名称
                        image: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/vip/sdth.png', //权益图标
                    }, {
                        name:this.language.vip.vipRights[3],//权益名称
                     image: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/vip/hdzs.png', //权益图标
                    }, {
                        name: this.language.vip.vipRights[4],//权益名称
                        image: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/vip/sdth.png', //权益图标
                    }, {
                        name: this.language.vip.vipRights[5], //权益名称
                        image: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/vip/hdzs.png', //权益图标
                    }
                ]
        },
        methods: {
            showSaveEWM () {
                let data = {

                    module: 'app',
                    action: 'recharge',
                    app: 'share',
                    //来源
                    type: 2
                }
                let me = this;
                this.$req.post({data}).then(res => {
                    if (res.code == 200) {
                         // this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL +
                        me.ewmImg = res.data.imgUrl
                        me.saveEWM = true
                        me.shareMask = true
                        me.shareH5Mask = false
                    }
                })
            },
            _navigateTo (url) {
                uni.navigateTo({
                    url: url,
                })
            },
            /*   跳转商品详情页    */
            _goods (id) {
                uni.navigateTo({
                    url: '../../pages/goods/goodsDetailed?pro_id=' + id
                })
            },
            _axios () {
                var me = this
                var data = {
                    module: 'app',
                    action: 'recharge',
                    app: 'grade_center'
                }
                this.$req.post({data}).then(res => {
                    if (res.code == 404) {
                        me.access_id1 = false
                    } else if (res.code == 200) {
                        res = res.data
                        me.userVipMsg = res.data
                        me.share_img = res.share_img

                        me.userVipMsg[0].grade_end = me.userVipMsg[0].grade_end.substring(0, 11)
                        me.userVipMsg[0].rate = Number(me.userVipMsg[0].rate).toFixed(1)
                        me.rule = res.rule
                        me.product = res.product
                        me.share_s = res.share
                        me.vip_up = res.up
                        me.user_id = res.data[0].user_id
                    }
                })
            },
            // 进入vip支付页面
            toVip (flag) {
                uni.setStorageSync('edit_flag', flag)
                uni.setStorageSync('edit_grade', this.userVipMsg[0].grade)
                this._navigateTo('/pagesA/vip/vip?toBack=1')
            },
            // 会员分享,控制蒙版打开
            vipshare () {

                // #ifdef H5
                let data = {
                    isfx: 1,
                    tui_id: this.user_id
                }
                let me = this
                me.shareHref = uni.getStorageSync('h5_url') + 'pagesA/vip/vip?data=' + encodeURIComponent(JSON.stringify(data))  + '&isfx=true&fatherId=' + uni.getStorageSync('user_id');
                this.shareH5Mask = true
                // #endif

                // #ifndef H5
                this.shareFlag = true
                // #endif
            },
            // 查看更多
            _gzgd () {
                if (this.gz_height != 'auto') {
                    this.gz_height = 'auto'
                } else {
                    this.gz_height = uni.upx2px(150) + 'px'
                }
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
             *
             * */
            _closeAllMask () {
                this.shareH5Mask = false;
                this.shareMask = false
                this.saveEWM = false
            },
            // 关闭会员分享蒙版
            shareStop () {
                this.shareFlag = false
            },
            // 分享方法
            _shareApp (type) {
                if (type == 3) {
                    uni.navigateTo({
                        url: '/pagesB/vip/vip_share'
                    })
                    return
                }
                var me = this
                var scene = ''
                if (type == 1) {
                    //App分享到 微信朋友圈
                    scene = 'WXSenceTimeline'
                } else if (type == 2) {
                    //App分享到 微信好友
                    scene = 'WXSceneSession'
                }
                let data = {
                    isfx: 1,
                    tui_id: this.user_id
                }
                var url = uni.getStorageSync('h5_url') + 'pagesA/vip/vip?data=' + encodeURIComponent(JSON.stringify(data))  + '&isfx=true&fatherId=' + uni.getStorageSync('user_id');
                uni.share({
                    provider: 'weixin',
                    scene,
                    type: 0,
                    href: url,
                    title: this.language.vipClub.shareTitle,
                    summary: this.language.vipClub.shareSummary,
                    imageUrl: me.userVipMsg[0].headimgurl,
                    success: function (res) {
                        console.log('success:' + JSON.stringify(res))
                    },
                    fail: function (err) {
                        console.log('fail:' + JSON.stringify(err))
                    }
                })
            },
            _toGradeUse () {
                this.isShow = !this.isShow
            },
        }
    }
</script>

<style scoped lang="less">
    @import url("../../static/css/vip/vipClub.less");
</style>
