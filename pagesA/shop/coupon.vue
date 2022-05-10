<template>
    <div class="container">
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <heads :title="language.shop.coupon.title"></heads>
        <div class="tabBox">
            <div>
                <div :class="{active: type==1}" @tap="changeTab(1)">{{language.shop.coupon.coupon[0]}}</div>
                <div :class="{active: type==2}" @tap="changeTab(2)">{{language.shop.coupon.coupon[1]}}</div>
            </div>
        </div>
        
        <div v-if="loopStatu" class="mycoupon_bottom" @tap="_mycoupon()"><span>{{language.shop.coupon.coupon[2]}}</span></div>
        <div class="skeleton" v-if="!load">
            <ul class="coupon_ul">
                <li class="coupon_li" v-for="item of 3" :key="item">
                    <img src="" alt="" class="bg_img skeleton-rect">
                </li>
                
            </ul>
        </div>
        <div v-if="list">
            <ul class="coupon_ul">
                <li class="coupon_li" v-for="(item, index) in list" :class="{ active_background: isNone[index] }" :key="index">
                    <img class="bg_img" :src="isNone[index] ? coupon_bg1 : coupon_bg" />
                    <img class="coupon_status" :src="isNone[index] ? coupon_no : coupon_on" v-if="item.point == '' || item.point == '去使用' || isNone[index]" />
                    <div class="coupon_li_data" @tap="_receive(index, item.id, item.point, item.url)">
                        <div class="coupon_left" :class="{ active_border: isNone[index] }">
                            <p class="coupon_p">{{ item.name }}</p>
                            <div class="coupon_price" :class="{ active_color: isNone[index] }">
                                <div class="coupon_price_div" v-if="item.activity_type == 2">
                                    <span class="coupon_price_span" :class="{ active_color: isNone[index] }">￥</span>
                                    <span class="coupon_price_money" :class="{ active_color: isNone[index] }">{{ item.money }}</span>
                                    <span class="coupon_t" :class="{ active_color: isNone[index] }">{{ item.limit }}</span>
                                </div>
                                <div class="coupon_price_div color_ff3" v-else-if="item.activity_type == 3">
                                    <span class="coupon_price_money" :class="{ active_color: isNone[index] }">
                                        {{ item.discount }}
                                        <span class="font_28" :class="{ active_color: isNone[index] }">{{language.shop.coupon.fold}}</span>
                                    </span>
                                    <span class="coupon_t" :class="{ active_color: isNone[index] }">{{ item.limit }}</span>
                                </div>
                                <div class="color_ff3" v-else-if="item.activity_type == 1">
                                    <span class="coupon_t ml_0" :class="{ active_color: isNone[index] }">{{ item.limit }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="coupon_right" v-if="item.point">
                            <button
                                type="button"
                                class="coupon_but"
                                :class="{ coupon_no: isNone[index], coupon_gous: item.point == '去使用', coupon_red: item.point == '立即领取' }"
                            >
                                <span ref="point">{{ item.point == '立即领取'?language.shop.coupon.points[0]:item.point == '已抢光'?language.shop.coupon.points[1]:item.point == '去使用'?language.shop.coupon.points[2]:'' }}</span>
                            </button>
                        </div>
                    </div>
                </li>
                
                <uni-load-more v-if="list&&list.length>8" :loadingType="loadingType"></uni-load-more>
            </ul>
            
        </div>
        <div v-if="list && list.length == 0" class="relative">
            <div class="noFindDiv">
                <div><img :src="noCoupon" class="noFindImg" alt="" /></div>
                <span class="noFindText">{{language.shop.coupon.coupon[3]}}~</span>
            </div>
        </div>
        <skeleton  :animation="true" :loading="!load"  bgColor="#FFF"></skeleton>
    </div>
</template>

<script>
export default {
    data() {
        return {
            returnR: '',
            back: '',
            title: '领券中心',
            load: false,
            list: false,
            receive_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/lingqu2x.png',
            noreceive_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/qiangguang2x.png',
            back_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/back2x.png',
            huiquan_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/huiquan2x.png',
            coupon_on: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/coupon/coupon_on.png',
            coupon_no: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/coupon_no.png',
            coupon_bg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/coupon_bg.png',
            coupon_bg1: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/coupon_bg1.png',
            fastTap: true,
            frompage: '',
            noCoupon: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/noCoupon.png',
            loopStatu: true,
            isNone: [] ,//是否是已抢光状态，true已抢光
            
            type: 1,
            page: 1,
            loadingType: 0
        };
    },
    onReachBottom() {
        if(this.loadingType!=0){
            return
        }
        this.loadingType = 1
        this.page++
        this._axios()
    },
    onLoad(option) {
        if (option.loop) {
            this.loopStatu = false;
        }
    },
    onShow() {
        this.$nextTick(() => {
            if (!this.list) {
                this.load = false
            }
            this.page = 1
            this._axios();
        });
    },
    methods: {
        changeTab(type){
            this.type = type
            this.page = 1
            this._axios()
        },
        // 检测登录后的回调
        changeLoginStatus() {
            this.page = 1
            this._axios();
        },
        // 去我的优惠券
        _mycoupon() {
            this.isLogin(()=>{
				uni.navigateTo({
				    url: '/pagesB/coupon/mycoupon?loop=false'
				});
			})
        },
        _axios() {
            let data = {
                module: 'app',
                action: 'coupon',
                app: 'index',
                page: this.page,
                type: this.type
            };

            this.$req.post({ data }).then(res => {
                if(res.code == 203){
                    uni.showToast({
                        title: this.language.shop.coupon.Tips[1],
                        icon: 'none',
                        duration: 1500
                    })
                    setTimeout(()=> {
                        uni.navigateTo({
                            url: '/pages/login/login?landing_code=coupon'
                        });
                    }, 1500);
                    return;
                }
                
                
                if((this.page == 1 && this.type == 1) || (this.page == 1 && this.type == 2)){
                    this.list = []
                    this.isNone = []
                }
                
                let { list } = res.data;
                
                list.filter(item=>{
                    item.limit = item.limit.replace('满','满￥')
                })
                
                this.list.push(...list);
                this.fastTap = true;
                if (list && list.length) {
                    let arr = [];
                    for (let i = 0; i < list.length; i++) {
                        arr.push(false);
                        if (list[i].point === '已抢光') {
                            arr[i] = true;
                        }
                    }
                    this.isNone.push(...arr);
                }
                this.load = true
                
                if(list && list.length>0){
                    this.loadingType = 0
                }else{
                    this.loadingType = 2
                }
            });
        },
        // 点击优惠券右边的按钮
        _receive(index, id, point, url) {
            if (point === '立即领取') {
                if (!this.fastTap) {
                    return;
                }
                this.fastTap = false;
                
                if (!this.access_id) {
                    uni.showToast({
                        title: this.language.shop.coupon.Tips[1],
                        icon: 'none',
                        duration: 1500
                    })
                    setTimeout(function() {
                        uni.navigateTo({
                            url: '/pages/login/login?landing_code=coupon'
                        });
                    }, 1500);
                    return;
                }
                let data = {
                    module: 'app',
                    action: 'coupon',
                    app: 'receive',
                    id: id
                };

                this.$req.post({ data }).then(res => {
                    let { code } = res;
                    if (code === 200) {
                        uni.showToast({
                            title: this.language.shop.coupon.Tips[0],
                            duration: 1500,
                            icon: 'none'
                        });
                        
                        setTimeout(() => {
                            this.page = 1
                            this._axios();
                        }, 1500);
                    } else if (code === 203) {
                        uni.showToast({
                            title: '请登录',
                            duration: 1500,
                            icon: 'none'
                        });
                        
                        setTimeout(function() {
                            uni.navigateTo({
                                url: '/pages/login/login?landing_code=coupon'
                            });
                        }, 1500);
                    } else {
                        setTimeout(() => {
                            this._axios()
                        }, 1500);
                    }
                });
            } else if (point === '去使用') {
                if (!this.fastTap) {
                    return;
                }
                this.fastTap = false;
                if (!url) {
                    url = '/pages/tabBar/home'
                }
				if(this.type == 2){
					uni.navigateTo({
					    url: '/pagesA/store/store?shop_id='+this.list[index].mch_id
					});
				}else if (url.indexOf('tabBar') > 0) {
                    uni.switchTab({
                        url: url
                    });
                } else {
                    uni.navigateTo({
                        url: url
                    });
                }
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import url('../../static/css/shop/coupon.less');
</style>
