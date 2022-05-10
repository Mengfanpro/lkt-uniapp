<template>
    <view class="container">
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <heads :title="language.freight_rules.title"></heads>
        
        <view class="container_row">
            <view class="container_row_left">{{language.freight_rules.freight}}</view>
            <input v-model="freight" type="number" :placeholder="language.freight_rules.freightPlacehold" placeholder-style="color:#b8b8b8" min="0">
        </view>
        
        <view class="container_row">
            <view class="container_row_left">{{language.freight_rules.choose}}</view>
            <input @tap="toSheng" :value="freight_sheng.name" type="text" :placeholder="language.freight_rules.choosePlacehold" placeholder-style="color:#b8b8b8" disabled>
            <image @tap="toSheng" :src="jiantou"></image>
        </view>
        
        
        <view class="container_bottomBtn" @tap="saveOk">{{language.freight_rules.save}}</view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            title: '添加模板',
            jiantou: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jiantou.png',

            freight: '',
            freight_sheng: {}
        };
    },
    onShow() {
        if(uni.getStorageSync('freight_sheng')){
            this.freight_sheng = uni.getStorageSync('freight_sheng')
            uni.removeStorageSync('freight_sheng')
        }
    },
    methods: {
        changeLoginStatus(){},
        toSheng(){
            let url = '/pagesA/myStore/freight_sheng?'
            
            if(this.freight_sheng.id){
                url += '&freight_id='+this.freight_sheng.id
            }
            
            uni.navigateTo({
                url
            })
        },
        saveOk(){
            if(!this.freight){
                uni.showToast({
                    title: this.language.freight_rules.freightPlacehold,
                    icon: 'none'
                })
                return
            }
            if(!this.freight_sheng.id){
                uni.showToast({
                    title: this.language.freight_rules.choosePlacehold,
                    icon: 'none'
                })
                return
            }
            uni.setStorageSync('freight_rules',{
                freight: this.freight,
                freight_sheng: this.freight_sheng
            })
            uni.navigateBack({
                delta: 1
            })
        }
    }
};
</script>

<style scoped lang="less">
    .container{
        min-height: 100vh;
        
        &_row{
            display: flex;
            align-items: center;
            margin-left: 30rpx;
            padding-right: 30rpx;
            height:90rpx;
            border-bottom: 1px solid #EDEDED;
            
            &_left{
                font-size: 28rpx;
                color: #010101;
                width: 170rpx;
            }
            
            input{
                flex: 1;
                font-size: 28rpx;
            }
            
            image{
                width: 15rpx;
                height: 27rpx;
                margin-left: 20rpx;
            }
        }
        
        &_bottomBtn{
			.solidBtn();
            display: flex;
            align-items: center;
            justify-content: center;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height:98rpx;
            font-size: 30rpx;
        }
    }
</style>
