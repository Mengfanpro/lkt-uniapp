<template>
    <view class="container">
        <lktauthorize ref="lktAuthorizeComp"></lktauthorize>
        <heads :title="title"></heads>
        <view class="ul" v-for="(item, index) in list" :key="index">
            <view class="ul_top">{{index}}</view>
            <view class="li" v-for="(item1, index1) in item" :key="index1">
                <view class="li_left">
                    <view class="text">{{item1.sourceNickname}}</view>
                    <view class="time">{{item1.time}}</view>
                </view>
                <view class="li_right">
                    <view class="text">{{item1.money}}</view>
                    <view class="time" v-if="item1.status == 1">{{item1.text}}</view>
                    <view class="time" v-else style="color: #FF3D3D;">{{item1.text}}</view>
                </view>
            </view>
        </view>
        <uni-load-more v-if="list.length>9" :loadingType="loadingType"></uni-load-more>
    </view>
</template>

<script>
export default {
    data() {
        return {
            title: '收款记录',
            loadingType: 0,
            list:[],
            page:1,
            pagesize:10,
        };
    },
    onLoad(option) {
        this.shop_id = uni.getStorageSync('shop_id') ? uni.getStorageSync('shop_id') : this.$store.state.shop_id;
        this.axios()
    },
    onShow() {
        this.shop_id = uni.getStorageSync('shop_id') ? uni.getStorageSync('shop_id') : this.$store.state.shop_id;
    },
    onReachBottom() {
        if(this.loadingType != 0){return}
        this.loadingType = 1;
        this.page++;
        this.axios();
    },
    methods: {
        axios(){
            this.$req
                .post({
                    data: {
                        module: 'app',
                        action: 'mch',
                        m: 'collection_record',
                        shop_id: this.shop_id,
                        page:this.page,
                        pagesize:this.pagesize
                    }
                })
                .then(res => {
                    let { code, data, message } = res
                    this.loadFlag = true;
                    uni.hideLoading();
                    if (code == 200) {
                        if(this.page == 1){
                            this.list = []
                        }
                        if(data.list.length>0){
                            this.list.push(...data.list);
                            this.loadingType = 0
                        }else{
                            this.loadingType = 2
                        }
                    } else {
                        uni.showToast({
                            title: message,
                            duration: 1500,
                            icon: 'none'
                        });
                    }
                });
        }
    }
};
</script>

<style scoped lang="less">
@import url('../../static/css/myStore/gatheringRecord.less');
</style>
