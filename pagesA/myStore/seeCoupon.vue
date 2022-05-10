<template>
    <view class="container" :style="noRecord && list.length == 0?'background: #ffffff':''">
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <heads :title="language.seeCoupon.title"></heads>
        
        <view class="list" v-for="item,index of list" :key="index">
            <image :src="item.headimgurl"></image>
            <view>
                <view>{{item.user_name}}</view>
                <text>{{item.add_time}}</text>
            </view>
            <text>{{language.seeCoupon.receive}}{{item.receive}}{{language.seeCoupon.Zhang}}</text>
        </view>
        
        <view v-if="noRecord && list.length == 0" class="noRecord">
            <image :src="noRecord"></image>
            <text>{{language.seeCoupon.noRecord}}</text>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            title: '领取记录',
            id: '',
            page: 1,
            list: [],
            
            noRecord: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/noRecord.png',
            
            isLoad: false
        };
    },
    onLoad(option) {
        this.id = option.id
    },
    onShow() {
        this.isLogin(()=>{})
        
        this.page = 1
        this.axios()
    },
    methods: {
		changeLoginStatus(){
			this.page = 1
			this.axios()
		},
        axios(){
            let data = {
                module:'app',
                action:'coupon',
                app:'see_coupon',
                mch_id: uni.getStorageSync('shop_id'), // 店铺id
                id: this.id,
                page: this.page
            }
            
            this.$req.post({data}).then(res=>{
                this.isLoad = true
                
                if(this.page == 1){
                    this.list = []
                }
                this.list.push(...res.data.list)
            })
            
        },
    },
};
</script>

<style lang="less">
@import url('../../static/css/myStore/seeCoupon.less');
</style>
