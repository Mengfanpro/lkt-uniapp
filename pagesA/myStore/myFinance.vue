<template>
    <div class="container">
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <heads :title="language.myFinance.title"></heads>
        <div class="relative container_content" style="padding-top: 88rpx;">
            <div class="topTabBar" :style="{top: topTabBarTop}">
                <div class="width_50" @tap="changeTabBar(2)">
                    <div :class="{ active: topTabBar == 2 }">{{ language.myFinance.tabList[2] }}</div>
                </div>
                <div class="width_50" @tap="changeTabBar(1)"><div :class="{ active: topTabBar == 1 }">{{language.myFinance.tabList[0]}}</div></div>
               <!-- <div class="width_50" @tap="changeTabBar(3)"><div :class="{ active: topTabBar == 3 }">{{language.myFinance.tabList[1]}}</div></div> -->

            </div>
<!--            <div style="height: 90rpx;" v-if="topTabBar == 1"></div>-->
            
            <div class="tixian" v-if="topTabBar==2">
                <view class="tabBox">
                    <view :class="{active: tabIndex == 0}" @tap="changeTab(0)">{{language.myFinance.tabList1[0]}}</view>
                    <view :class="{active: tabIndex == 1}" @tap="changeTab(1)">{{language.myFinance.tabList1[1]}}</view>
                    <view :class="{active: tabIndex == 2}" @tap="changeTab(2)">{{language.myFinance.tabList1[2]}}</view>
                    <view :class="{active: tabIndex == 3}" @tap="changeTab(3)">{{language.myFinance.tabList1[3]}}</view>
                </view>
                <view v-for="(item, index) in list" :key="index">
                    <view class="tixian_item" v-for="(items, indexs) in item.res" :key="indexs" @tap="toTixian(items.id)">
                        <view class="tixian_item_left">
                            <view>{{ items.type_name }}</view>
                            <text>{{ items.addtime }}</text>
                        </view>
                        <view class="tixian_item_center">
                            <view v-if="items.status == 2">{{ items.money }}</view>
                            <view v-else>-{{ items.money }}</view>
                            <text v-if="items.status == 0" style="color: red;">{{ language.myFinance.inReview }}</text>
                            <text v-if="items.status == 1">{{ language.myFinance.done }}</text>
                            <text v-if="items.status == 2">{{ language.myFinance.faidDisc }}</text>
                        </view>
                        <image class="jiantou" :src="jiantou" mode=""></image>
                    </view>
                </view>

                <uni-load-more v-if="list.length>8"  :loadingType="loadingType"></uni-load-more>

                <!--                <uni-load-more v-if="loadingType >= 5" :loadingType="loadingType"></uni-load-more>-->
                <div v-if="list.length == 0 && status" class="wsj_box">
                    <img class="wsj_img" :src="wushuju"/>
                    <div>{{ language.myFinance.noList }}</div>
                </div>
            </div>

            <template v-if="topTabBar==1">
                <div v-if="list.length > 0" style="flex: 1;">
                    <div class="orderList" v-for="(item, index) in list" :key="index">
                        <ul class="orderTitle">
                            <!--                            <li class="today_div">-->
                            <!--                                <div class="date">-->
                            <!--                                    {{ item.time }}-->
                            <!--                                    <span v-if="item.time == now">{{language.myFinance.today}}</span>-->
                            <!--                                </div>-->
                            <!--                            </li>-->

                            <li style="position: relative" v-for="(items, indexs) in item.res" :key="indexs">
                                <div class="list_group1">
                                    <span>{{ items.remake }}</span>


                                </div>

                                <div class="list_group2">
                                    <span>{{ items.addtime | dateFormat }}</span>
                                    <!--                                    <span class="yue_money" v-if="type != 3">{{language.myFinance.balance}} {{ items.account_money }}</span>-->
                                    <!--                                    <span class="yue_money" v-else>{{language.myFinance.integral}} {{ items.integral_money }}</span>-->
                                </div>

                                <template v-if="type != 3">
                                    <span class="bold" v-if="items.status == 1">+{{ items.price }}</span>
                                    <span class="bold" v-else-if="items.status == 2">-{{ items.price }}</span>
                                </template>
                            </li>
                        </ul>
                    </div>
                    <uni-load-more v-if="list.length>8" :loadingType="loadingType"></uni-load-more>
                </div>
                <div v-if="list.length == 0 && status" class="wsj_box">
                    <img class="wsj_img" :src="wushuju" />
                    <div>{{language.myFinance.noList}}</div>
                </div>
            </template>
            
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title: '账户明细',
            page: 1,
            topTabBar: 2,
            shop_id: '',
            type: 2,
            list: [],
            status: false,
            wushuju: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/wuzhangdan.png',
            jiantou: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jiantou2x.png',
            loadingType: 0,
            tabIndex: 0,  //提现明细tab

        };
    },
    
    onLoad(option) {
        this.setLang();
        uni.showLoading({
            title: this.language.toload.loading
        });
    },
    onShow () {
        this.shop_id = uni.getStorageSync('shop_id') ? uni.getStorageSync('shop_id') : this.$store.state.shop_id;
        this.list = [];
        this.page = 1;
        this._axios();
    },
    onReachBottom() {
        if (this.loadingType == 1 || this.loadingType == 2) {return false}
        this.loadingType = 1;
        this.page ++;
        this._axios()
    },
    methods: {
        toTixian(id){
            uni.navigateTo({
                url: './tixianDetail?id='+id
            })
        },
        changeLoginStatus() {
            this._axios();
        },
        changeTab(index){
            this.tabIndex = index
            this.list = [];
            this.page = 1;
            this._axios();
        },
        changeTabBar(num) {
            this.topTabBar = num;
            this.type = num;
            this.list = [];
            this.status = false;
            this.page = 1;
            this._axios();
        },
        
        _axios() {
            uni.showLoading({
                title: this.language.toload.loading,
                mask: true
            });
            this.$req
                .post({
                    data: {
                        shop_id: this.shop_id,
                        module: 'app',
                        action: 'mch',
                        m: 'Detail',
                        type: this.type,
                        tabIndex: this.tabIndex,
                        page: this.page
                    }
                })
                .then(res => {
                    uni.hideLoading();
                    if (res.code == 200) {
                        this.list = this.list.concat(res.data.list);

                        if (res.data.list.length > 0) {
                            this.loadingType = 0
                        } else {
                            this.loadingType = 2
                        }
                        
                        if (this.list.length == 0) {
                            this.status = true;
                        }
                    } else {
                        uni.showToast({
                            title: res.message,
                            duration: 1500,
                            icon: 'none'
                        });
                    }
                });
        }
    },
    computed: {
        now: function() {
            var year = new Date().getFullYear();
            var month = new Date().getMonth() + 1;
            var date = new Date().getDate();
            var date1 = year + '-' + month + '-' + date;
            return date1;
        },
        topTabBarTop () {
            var gru = uni.getStorageSync('data_height') ? uni.getStorageSync('data_height') : this.$store.state.data_height
            // #ifdef MP-TOUTIAO
            // const info = uni.getSystemInfoSync()
            // if(info.platform != 'ios'){
            // 	gru=0
            // }
            // #endif
            let height = 0
            // #ifndef MP-ALIPAY
            var heigh = parseInt(gru) + uni.upx2px(88)
            height = heigh && heigh > 0 ? heigh : uni.upx2px(88)
            // #endif

            // #ifdef MP
            heigh += 44
            // #endif

            
            return height + 'px'
        }
    }
};
</script>

<style lang="less">
@import url('../../static/css/myStore/myFinance.less');
</style>
