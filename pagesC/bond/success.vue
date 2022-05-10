<template>
    <view class='container'>
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <heads :title='title' returnFlag="true"></heads>
        <view class="con" v-if="!str">
            <img :src="gouhei"/>
            <view class="vtitle">退还保证金申请提交成功</view>
            <view class="sub">系统将在48小时内自动退还至您的个人账户</view>
        </view>
        <view class="con" v-else>
            <img :src="gouhei"/>
            <view class="vtitle">支付结果</view>
        </view>
        <button class="gohome" @tap="reshop">进入店铺</button>
        <button class="gouser" @tap="goUser">返回至个人中心</button>
    </view>
</template>

<script>
    import Heads from '../../components/header.vue'
    
    export default {
        data () {
            return {
                gouhei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/gouhei.png',
                str:false,
                title:''
            }
        },
        components: {
            Heads
        },
        onLoad (option) {
            this.str = option.str
        },
        onShow () {
           if(this.str){
               this.title = '支付结果'
           }else{
               this.title = '退取保证金'
           }
        },
        methods: {
            goUser(){
                uni.switchTab({
                    url: '/pages/tabBar/my'
                })
            },
            reshop(){
                uni.navigateTo({
                    url: '/pagesA/myStore/myStore'
                })
            }
		}	
    }
</script>

<style lang="less" scoped>
    .con{
        height: 70vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        img{
            width:100rpx;
            height: 100rpx;
            margin-bottom: 20rpx;
        }
        .vtitle{
            font-size:30rpx;
            color:#020202;
        }
        .sub{
            font-size:24rpx;
            color:#888888;
            margin-top:8rpx;
        }
    }
    .gohome{
        color: #FEFEFE;
        margin:30rpx;
        background-color: #014343;
        font-size: 30rpx;
        height: 90rpx;
    }
    .gouser{
        color: #014343;
        margin:0 30rpx;
        height: 90rpx;
        border: 2rpx solid #014343;
        background-color: #ffffff;
        font-size: 30rpx;
    }
</style>
