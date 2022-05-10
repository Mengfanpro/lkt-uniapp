<template>
    <view class='container'>
        <lktauthorize ref="lktAuthorizeComp" ></lktauthorize>
        <heads title='交纳保证金'></heads>
        <paymodel @cancel="wallet_pay_cancel" @success="check_pay_password" v-model="pay_display"/>
        <view class="con" v-if="show==1">
            <view class="top">
                <text class="name">保证金</text>
                <text class="Nth" v-if="margin">
                  ￥{{Number(margin).toFixed(2)}}
                </text>
            </view>
             <button style="margin-top: 100rpx;" type="default" @tap="tagShow">交纳保证金</button>
             <text class="explain">保证金说明</text>
             <view class="vHtml" v-html="margin_description"></view>
        </view>
        <view class="con" style="background-color: #ffffff;" v-if="show==2">
            
            <choose-pay
                :aliPayStatue="aliPayStatue"
                :baidupayStatue="baidupayStatue"
                :open_alipay="open_alipay"
                :open_baidu="open_baidu"
                :open_wallet="open_wallet"
                :open_wxpay="open_wxpay"
                :user_money="user_money"
                :useWallet="useWallet"
                :wxPayStatue="wxPayStatue"
                @chooseWay="chooseWay($event)"
            />
            <submit-order
                :ishide="ishide"
                :total="margin"
                :rate="total_discount"
                @submit="order_pay2()"
            />
        </view>
    </view>
</template>

<script>
    import Heads from '../../components/header.vue'
    import mixinsPay from '../../mixins/pay'
    import mixinsOrder from '../../mixins/order'
    import choosePay from '@/components/choose-pay.vue'
    import submitOrder from '@/components/order/submit-order.vue'
    import paymodel from '@/components/paymodel.vue'
    
    export default {
        data () {
            return {
                show:1,
                margin:'',
                margin_description:'',
                ishide:0,
                total_discount:'0',
                user_money:'0',
                // aliPayStatue:true,
                open_alipay:false,
                open_baidu:false,
                open_wallet:false,
                open_wxpay:false,
                useWallet:false,
                commodity_type:'1',
                payTitle:'保证金',
                onpage:true,
				bondStatus:true, //控制取消支付的彈框
                // wxPayStatue:true,
                // baidupayStatue:true
                payResult: ''
            }
        },
        mixins: [mixinsPay,mixinsOrder],
        components: {
            Heads,
            paymodel,
            choosePay,
            submitOrder
        },
        computed: {
            
        },
        onLoad (option) {
            this.getCode()
            this.checkCode()
        },
        onShow () {
        },
        watch: {
        },
        mounted() {
          this._axios()  
        },
        methods: {
            tagShow() {
              this.show = 2  
            },
            goto(url) {
                uni.navigateTo({
                    url:url
                })
            },
            _axios () {
                var me = this
                var data = {
                    module: 'mch',
                    action: 'promise',
                    app: 'index',
                    // mch_id:uni.getStorageSync('mch_id')
                }
                this.$req.post({data}).then(res => {
                    if (res.code == 200) {
                        console.log(res)
                        this.margin=res.data.promisePrice*1
                        this.margin_description=res.data.promiseText
                        this.user_money=res.data.userMoney*1
                        this.payment = res.data.payment
                        this.password_status = res.data.isSetPayment
                        this.total = this.margin
                        this.show_pay_way()
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
        show_pay_way () {
            // #ifdef H5
            if (Number.parseInt(this.payment.jsapi_wechat) || Number.parseInt(this.payment.H5_wechat)) {
                this.open_wxpay = true
            }
            if (Number.parseInt(this.payment.alipay_mobile)) {
                //非微信浏览器
                if (!this.is_wx()) {
                    this.open_alipay = true
                }
            }
            // #endif
        
            // #ifdef MP-WEIXIN
            if (Number.parseInt(this.payment.mini_wechat)) {
                this.open_wxpay = true
            }
            // #endif
        
            // #ifdef APP-PLUS
            if (Number.parseInt(this.payment.app_wechat)) {
                this.open_wxpay = true
            }
            if (Number.parseInt(this.payment.alipay)) {
                this.open_alipay = true
            }
            if (Number.parseInt(this.payment.baidu_pay)) {
                this.open_baidu = true
            }
            // #endif
        
            // #ifdef MP-BAIDU
            if (Number.parseInt(this.payment.baidu_pay)) {
                this.open_baidu = true
            }
            // #endif
        
            // #ifdef MP-ALIPAY
            if (Number.parseInt(this.payment.alipay_minipay)) {
                this.open_alipay = true
            }
            // #endif
        
            // #ifdef MP-TOUTIAO
            if (Number.parseInt(this.payment.tt_alipay)) {
                this.open_alipay = true
            }
            // #endif
        
            
            if (Number.parseInt(this.payment.wallet_pay)) {
                this.chooseWay('balance')
                this.open_wallet = true
                this.useWallet = true
            }
        },
    }
</script>

<style lang="less" scoped>
    .container{background-color: #F6F6F6;min-height: 100vh;}
    .top{
        height: 304rpx;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: #ffffff;
        .name{
            font-size: 34rpx;
            color: #333333;
            margin-bottom: 20rpx;
        }
        .Nth{
            font-size: 40rpx;
            color: #FF7D00;
        }
    }
    button{
        width: 690rpx;
        height: 90rpx;
        background: #014343;
        opacity: 1;
        border-radius: 8rpx;
        color: #ffffff;
        font-size: 30rpx;
    }
    .explain{
        line-height: 100rpx;
        color: #333333;
        font-size: 30rpx;
        padding:0 30rpx;
    }
    .vHtml{
        padding:0 30rpx;
        color: #888888;
        font-size: 28rpx;
    }
</style>
