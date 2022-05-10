<template>
    <view class='container'>
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <heads title='保证金管理'></heads>
        <view class="top">
            <view class="text-top">保证金：<text>￥{{money.toFixed(2)}}</text></view>
            <view class="text-bottom">交纳时间：{{payDate}} <view class="text-btn" @tap="tui()">退还保证金</view></view>
        </view>
        <view class="explain">
            <text class="text">保证金说明</text>
            <view class="explainHtml" v-html="margin_description"></view>
        </view>
    </view>
</template>

<script>
    import Heads from '../../components/header.vue'
    export default {
        data () {
            return {
                money:0,
                margin_description:'',
                payDate:''
            }
        },
        components: {
            Heads
        },
        computed: {
            
        },
        onLoad (option) {
            // this._axios()
        },
        onShow () {
            this.isLogin(()=>{
                this._axios()
            })
        },
        methods: {
            tui(){
                uni.showModal({
                    title: '退还保证金',
                    content: '如若退还，店铺将无法进行正常操作，是否退还保证金',
                	confirmText: this.language.showModal.confirm,
                	cancelText: this.language.showModal.cancel,
                    success:(e)=>{
                        if(e.confirm){
                            var data = {
                                module: 'mch',
                                action: 'promise',
                                app: 'returnPromisePrice',
                                mch_id:uni.getStorageSync('mch_id')
                            }
                            this.$req.post({data}).then(res => {
                                if (res.code == 200) {
                                   uni.navigateTo({
                                       url: '/pagesC/bond/success'
                                   });
                                }else if(res.code == 203){
                                    uni.showModal({
                                        title: '',
                                        content: res.message,
                                    	confirmText: '知道了',
                                        showCancel:false,
                                        success() {
                                            uni.navigateTo({
                                                url:'/pages/login/login'
                                            })
                                        }
                                    })
                                }else{
                                    uni.showModal({
                                        title: '',
                                        content: res.message,
                                    	confirmText: '知道了',
                                        showCancel:false
                                    })
                                }
                            })
                        }else{
                            return
                        }
                    }
                })
            },
			_axios() {
			    var me = this
			    var data = {
			        module: 'mch',
			        action: 'promise',
			        app: 'promiseManage',
			        mch_id:uni.getStorageSync('mch_id')
			    }
			    this.$req.post({data}).then(res => {
			        if (res.code == 200) {
			            this.money=res.data.promisePrice*1
                        this.payDate = res.data.payDate
			            this.margin_description=res.data.promiseText
			        }else{
			            uni.showToast({
			                title:res.message,
			                duration: 1000,
			                icon: 'none'
			            })
			        }
			    })
			}
        },
    }
</script>

<style lang="less" scoped>
    .container{
        min-height: 100vh;
        background-color: #F6F6F6;
        .top{
            background-color: #ffffff;
            padding:40rpx 30rpx;
            .text-top{
                font-size:30rpx;
                color:#333333;
                text{
                    color: #FF7D00;
                }
                margin-bottom: 20rpx;
            }
            .text-bottom{
                color: #999999;
                font-size: 24rpx;
                .text-btn{
                    float: right;
                    padding: 8rpx 13rpx;
                    border:1px solid #BBBBBB;
                    margin-top:-16rpx;
                }
            }
        }
        .explain{
            background-color: #ffffff;
            padding:30rpx;
            margin:10rpx 0;
            .text{
                font-size: 30rpx;
                color: #333333;
                .explainHtml{
                    font-size: 28rpx;
                    color: #888888;
                }
            }
        }
    }
</style>
