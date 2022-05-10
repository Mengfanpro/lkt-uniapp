<template>
    <view class="container">
        <heads :title="language.mycoupon.title"></heads>
        <!-- 导航栏 -->
        <view class="nav">
            <view :class="active == index ? 'active' : ''" v-for="(item, index) in language.mycoupon.tabBar" :key="index" @tap="navTo(index)">{{ item }}</view>
        </view>
        <div class="skeleton" v-if="!load">
            <div class="content">
                <div class="coupon" style="height: 248rpx;" v-for="item of 3" :key="item">
                    <div class=" coupon_top" style="height: 186rpx;">
                        <div class="coupon_top_left">
                            <view>
                                <span class="coupon_name skeleton-rect" style="width: 100px;">xx</span>
                            </view>
                            <span class="skeleton-rect">xx {{language.mycoupon.endTime}}</span>
                        </div>
                    </div>
                    <view class="coupon_bottom skeleton-rect">
                        2
                    </view>
                </div>
            </div>
            
        </div>
        
        <template v-if="load">
            <scroll-view v-if="list.length > 0" class="content" scroll-y="true">
                <view :class="active == 0 ? 'coupon' : 'coupon1'" v-for="(item, index) in list" :key="index" :style="item.activity_type == 5 && active == 0 ? bg_color1 : ''">
                    <image v-if="(item.activity_type == 4 || item.activity_type == 5) && active == 0" class="vip_img" :src="vip_img"></image>
                    <view
                        class="coupon_top"
                        :class="item.activity_type == 5 && active == 0 ? 'coupon_top1' : active == 1 || active == 2 ? 'coupon_top2' : ''"
                        :style="item.activity_type == 5 && active == 0 ? 'border-color:#B0E1FF;' : ''"
                    >
                        <view class="coupon_top_left">
                            <view>
                                <span class="coupon_name">{{ item.name ? item.name : item.product_title }}</span>
                                <span v-if="active == 0" class="coupon_top_icon" :style="item.activity_type == 5 ? 'border-color:#3398FF;color:#3398FF' : ''">
                                    {{
                                        item.activity_type == 1
                                            ? language.mycoupon.activity_type[0]
                                            : item.activity_type == 2
                                            ? language.mycoupon.activity_type[1]
                                            : item.activity_type == 3
                                            ? language.mycoupon.activity_type[2]
                                            : item.activity_type == 4
                                            ? language.mycoupon.activity_type[3]
                                            : item.activity_type == 5
                                            ? language.mycoupon.activity_type[4]
                                            : ''
                                    }}
                                </span>
                            </view>
                            <span>{{ item.expiry_time }} {{language.mycoupon.endTime}}</span>
                        </view>
                        <!--  免邮 -->
                        <view v-if="item.activity_type == 1" class="coupon_top_right" :class="active == 1 || active == 2?'hei':''" :style="active == 0 ? bg_img1 : active == 1 ? bg_img2 : bg_img3">
                            <view>
                                <text class="coupon_top_right_data">{{language.mycoupon.coupon_mail}}</text>
                            </view>
                            <span>{{ item.limit }}</span>
                        </view>
                        <!--  满减 -->
                        <view v-if="item.activity_type == 2" class="coupon_top_right" :class="active == 1 || active == 2?'hei':''" :style="active == 0 ? bg_img1 : active == 1 ? bg_img2 : bg_img3">
                            <view>
                                ￥
                                <text class="coupon_top_right_data">{{ item.money }}</text>
                            </view>
                            <span>{{ item.limit }}</span>
                        </view>
                        <!-- 折扣 -->
                        <view v-else-if="item.activity_type == 3" class="coupon_top_right" :class="active == 1 || active == 2?'hei':''" :style="active == 0 ? bg_img1 : active == 1 ? bg_img2 : bg_img3">
                            <view>
                                <text class="coupon_top_right_data">{{ item.discount }}</text>
                                {{language.mycoupon.coupon_discount}}
                            </view>
                            <span>{{ item.limit }}</span>
                        </view>
                        <!-- 会员赠送券 -->
                        <view v-else-if="item.activity_type == 4" class="coupon_top_right" :class="active == 1 || active == 2?'hei':''" :style="active == 0 ? bg_img1 : active == 1 ? bg_img2 : bg_img3">
                            <view v-if="item.money == 0">
                                <text class="coupon_top_right_data">{{ item.discount }}</text>
                                {{language.mycoupon.coupon_discount}}
                            </view>
                            <view v-else>
                                ￥
                                <text class="coupon_top_right_data">{{ item.money }}</text>
                            </view>
                            <span>{{ item.limit }}</span>
                        </view>
                        <!-- 兑换 -->
                        <view
                            v-else-if="item.activity_type == 5"
                            class="coupon_top_right"
                            :style="active == 0 ? bg_img1 + 'border-color:#B0E1FF;' : active == 1 ? bg_img4 : bg_img3"
                        >
                            <image class="duihuan_img" :src="item.imgurl"></image>
                        </view>
                    </view>
                    <view class="coupon_bottom">
                        <view class="coupon_bottom_left" @tap="discTap(index)">
                            <view class="coupon_bottom_l">
                                {{language.mycoupon.instructions}}
                                <image class="coupon_bottom_img" v-if="item.discFlag" :src="discFlagtop"></image>
                                <image v-else class="coupon_bottom_img" :src="discFlagbottom"></image>
                            </view>
                        </view>
                        <view v-if="active == 0" class="coupon_bottom_right" @tap="to_detail(item)">{{language.mycoupon.toUse}}</view>
                        <view v-else-if="active == 1" class="coupon_bottom_right pastDue">{{language.mycoupon.beUse}}</view>
                        <view v-else-if="active == 2" class="coupon_bottom_right pastDue">{{language.mycoupon.expired}}</view>
                        <view v-if="item.discFlag" class="coupon_bottom_b">
                            <text v-if="item.activity_type == 5" class="font_22">
                                {{language.mycoupon.instructionsText[0]}}
                                <br />
                                {{language.mycoupon.instructionsText[1]}}{{ item.valid }}{{language.mycoupon.instructionsText[2]}}
                            </text>
                            <text v-else class="font_22">{{ item.Instructions }}</text>
                        </view>
                    </view>
                </view>
            </scroll-view>
            <view v-else class="no-bargain">
                <img :src="nobargainImg" />
                <p>{{language.mycoupon.noCoupon}}</p>
            </view>
        </template>
        <button v-if="loop" class="coupon_btn" @tap="toCoupon">{{language.mycoupon.bottomBtn}}</button>
        <skeleton  :animation="true" :loading="!load"  bgColor="#FFF"></skeleton>
    </view>
</template>

<script>

export default {
    data() {
        return {
            title: '优惠券',
            active: 0,
            list: [],
            discArray: [],
            loop: true,
            nobargainImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + '/images/icon1/noCoupon.png',
            bg_color1: 'border-color:#B0E1FF;background: linear-gradient(to top, #F7FCFF 0%, #F2FAFF 100%);',
            vip_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/coupon/vip.png',
            discFlagtop: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/coupon/top.png',
            discFlagbottom: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/coupon/bottom.png',
            load: false
        };
    },
    computed: {
        bg_img1() {
            let width = uni.upx2px(138);
            return `background: url(${this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL}images/icon1/coupon_bg1.png) no-repeat top right/${width}px ${width}px;`;
        },
        bg_img2() {
            let width = uni.upx2px(88);
            return `background: url(${this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL}images/icon1/beenuse.png) no-repeat top right/${width}px ${width}px;border-color:rgb(221, 221, 221)`;
        },
        bg_img3() {
            let width = uni.upx2px(88);
            return `background: url(${
                this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL
            }images/icon1/coupon_time.png) no-repeat top right/${width}px ${width}px;border-color:rgb(221, 221, 221)`;
        },
        bg_img4() {
            let width = uni.upx2px(88);
            return `border-color:#DDDDDD;background: url(${this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL}images/icon1/beenuse.png) no-repeat top right/${width}px ${width}px;`;
        }
    },
    onLoad(option) {
        if (option.loop) {
            this.loop = false;
        }
        
        for (let i = 0; i < this.list.length; i++) {
            this.discArray.push(false);
        }
    },
    onShow() {
        this._axios();
    },
    methods: {
        // 导航切换
        navTo(e) {
            this.list = [];
            this.active = e;
            this.load = false;
            this._axios();
        },
        // 使用说明
        discTap(e) {
            this.$set(this.list[e], 'discFlag', !this.list[e].discFlag);
        },
        // 立即使用优惠券
        to_detail(item) {
            console.log(item)
            if (item.activity_type == '5') {
                uni.setStorageSync('order_list', item.order_list);
                uni.setStorageSync('level', item.level);
                uni.navigateTo({
                    url: 'coupon_detail'
                });
            } else {
                if(item.mch_id!=0){
                    uni.navigateTo({
                        url: '/pagesA/store/store?shop_id='+item.mch_id
                    })
                }else if (item.skip_type === 2) {
                    if (!item.url) {
                        uni.switchTab({
                            url: '/pages/tabBar/home'
                        });
                        return false;
                    }
                    uni.navigateTo({
                        url: item.url
                    });
                } else {
                    if (!item.url) {
                        uni.switchTab({
                            url: '/pages/tabBar/home'
                        });
                        return false;
                    }
                    uni.switchTab({
                        url: item.url
                    });
                }
            }
        },
        _axios() {
            let data = {
                module: 'app',
                action: 'coupon',
                app: 'mycoupon',
                type: this.active
            };
            
            this.$req.post({data}).then(res=>{
                this.load = true;
                uni.hideLoading();
                if (res.code == 200) {
                    this.list = res.data.list;
                }
            })
            
        },
        // 去领券中心
        toCoupon() {
            uni.navigateTo({
                url: '/pagesA/shop/coupon?loop=false'
            });
        }
    }
};
</script>

<style scoped lang="less">
@import url('../../static/css/coupon/coupon.less');
</style>
