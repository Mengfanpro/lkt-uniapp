<template>
    <view class="order_payment">
        <heads :isMs="type" :title="language.order.order_pay.title"></heads>

        <paymodel @cancel="wallet_pay_cancel" @success="check_pay_password" v-model="pay_display"/>

        <choose-pay
            :aliPayStatue="aliPayStatue"
            :baidupayStatue="baidupayStatue"
            :open_alipay="open_alipay"
            :open_baidu="open_baidu"
            :open_wallet="open_wallet"
            :open_wxpay="open_wxpay"
            :useWallet="useWallet"
            :user_money="user_money"
            :wxPayStatue="wxPayStatue"
            @chooseWay="chooseWay($event)"
        />

        <submit-order
            :ishide="0"
            :total="total"
            @submit="order_pay()"
        />
    </view>
</template>
<script>
    import paymodel from '@/components/paymodel.vue'
    import choosePay from '@/components/choose-pay.vue'
    import submitOrder from '@/components/order/submit-order.vue'
    import mixinsPay from '../../mixins/pay'
    import mixinsOrder from '../../mixins/order'
    import { later } from '@/common/util'

    export default {
        data () {
            return {
                tmplIds: ['2KrrJchj92YRKhZZ0SSHz76dmrT0cLBJ2Wfe0', 'ncs3u3Bmmi0jW7EXAik4KQvxF3JxbaulWNwbLXDto', 'CZAPo_TqOOeC5K7XYvBeB_LXmyXKIhXkZROArNZDwQ8'],//微信订阅消息模板
                ordertype: '',
                return_r:5,
                type: '',
                
                types: ''
            }
        },
        mixins: [mixinsPay, mixinsOrder],
        components: { paymodel, choosePay, submitOrder },
        onLoad (option) {
            this.type = option.type
            if(option.type == 'MS' || option.ordertype == 'MS') {
                this.types = 'MS'
            }
            if(option.type == 'IN' || option.ordertype == 'IN') {
                this.types = 'IN'
            }
            uni.setStorageSync('order_payment',JSON.stringify(option))
            this.ordertype = option.ordertype
            console.log(option);
            
            this.getCode()
            this.order_id = option.order_id
            if (option.showPay) {
                this.showPay = true
            }
            if(option.is_pt){
                this.return_r = ''
            }
            this.checkCode()
            this._axios()
        },
        onShow() {
            this._axios()
            
        },
        onUnload () {
            // #ifdef H5
            if (location.hostname === 'localhost') return false;
            setTimeout(() => {

                let state = window.location.href.replace(/\?code=.*?\//, '#/')
                console.log(state);
                history.replaceState(null, null, state)
            }, 300)
            // #endif
            
        },
        methods: {
            /**
             * 支付失败
             * @private
             */
            _pay_fail () {
                uni.showModal({
                    title: this.language.showModal.hint,
                    content: this.language.showModal.payFail,
                    confirmText: this.language.showModal.confirm,
                    cancelText: this.language.showModal.cancel,
                    success: res => {
                        this.fastTap = false
                        if (res.confirm) {
                            this.status(1);
                            let url = '/pages/order/myOrder?status=1'
                            if(this.types == 'MS') {
                                url = '/pagesB/seckill/seckill_my?order_type=payment'
                            }
                            if(this.types == 'IN') {
                                url = '/pagesB/integral/exchange?order_type=payment'
                            }
                            if (this.ordertype === 'PT') {
                                url = '/pagesA/group/groupOrder?status=1'
                            }

                            if (this.ordertype === 'PP') {
                                url = '/pagesA/group/groupOrder?status=1&a_type=1'
                            }
                            
                            uni.redirectTo({
                                url
                            })
                        } else if (res.cancel) {
                            uni.switchTab({
                                url: '/pages/tabBar/home'
                            })
                        }
                    }
                })
            },
            /**
             * 点击立即支付按钮触发
             * @returns {Promise<boolean>}
             */
            async order_pay () {
                if (this.fastTap) return false
                this.fastTap = true
                
                if (this.showPay) {
                    try {
                        await this._check_order_status();
                    } catch(e) {
                        uni.showToast({
                            title: e,
                            icon: 'none'
                        })
                        this.fastTap = false
                        return false;
                    }
                }
                
                this._checkSelectPayWay()

                // #ifdef MP-WEIXIN
                uni.showLoading({
                    title: this.language.order.order_pay.Tips[0]
                })
                wx.requestSubscribeMessage({
                    tmplIds: this.tmplIds,
                    complete:async () => {
                        uni.hideLoading()
                        if (this.useWallet) {
                            if (!this.sNo) {
                                await this._getPayOrderInfo()
                            }
                            this._orderUseWalletPay()
                        } else {
                            uni.showLoading({
                                title: this.language.order.order_pay.Tips[1],
                                mask: true,
                            })
                            this._notUserWalletPay()
                        }
                    }
                })
                // #endif
                // #ifndef MP-WEIXIN
                if (this.useWallet) {
                    if (!this.sNo) {
                        await this._getPayOrderInfo()
                    }
                    this._orderUseWalletPay()
                } else {
                    uni.showLoading({
                        title: this.language.order.order_pay.Tips[1],
                        mask: true,
                    })
                    this._notUserWalletPay()
                }
                // #endif

            },
            /**
             * 取得调用支付的所需订单信息
             * @param pay_type
             * @returns {Promise<*>}
             */
            async getPaymentData () {
                let data = {
                    module: 'app',
                    action: 'pay',
                    total: this.total,
                    sNo: this.sNo,
                    title: this.payTitle
                }

                let { type, code, store_type } = await this.getOrderInfoExt()
                data.type = type
                data.code = code
                data.store_type = store_type

                let auth_code = await this.LaiKeTuiCommon.getMPAliAuthCode()
                if (auth_code) {
                    // #ifdef MP-ALIPAY
                    data.alimp_authcode = auth_code
                    // #endif
                    // #ifdef MP-TOUTIAO
                    data.tt_authcode = auth_code
                    // #endif
                }

                return await this.$req.post({ data })
            },
            /**
             * 余额支付
             * @returns {Promise<void>}
             * @private
             */
            async _wallet_pay () {
                let postData = {
                    module: 'app',
                    action: 'pay',
                    app: 'wallet_pay',
                    m: 'wallet_pay',
                    type: 'wallet_pay',
                    order_id: this.order_id,
                    sNo: this.sNo,
                    parameter: 'order',
                    payment_money: this.total
                }
                let res = await this.$req.post({ data: postData })
                let { code } = res
                uni.hideLoading()
                if (code === 0) {
                    uni.showToast({
                        title: res.err,
                        duration: 1000,
                        icon: 'none'
                    })
                    return false;
                }

                uni.showToast({
                    title: this.language.order.order_pay.Tips[2],
                    duration: 1000,
                    icon: 'none'
                })
                await later(1000)
                uni.setStorageSync('payRes', this.order_pay_info)
                uni.redirectTo({
                    url: '/pages/pay/payResult'
                })
            },
            _axios () {
                if (uni.getStorageSync('order_payment')) {
                    let info = JSON.parse(uni.getStorageSync('order_payment'))
                    this.order_id = info.order_id
                    this.ordertype = info.ordertype
                    if (info.showPay) {
                        this.showPay = true
                    }
                }
                
                let action = 'order'
                if (this.ordertype === 'PT') {
                    action = 'groupbuy' 
                } else if (this.ordertype === 'KJ') {
                    action = 'bargain'
                } else if (this.ordertype === 'PP') {
                    action = 'pthd_groupbuy'
                }
                let data = {
                    order_id: this.order_id,
                    module: 'app',
                    action,
                    app: 'order_details',
                    m: 'order_details' // 兼容普通订单和插件订单写法
                }
                
                
                this.$req.post({ data }).then(res => {
                    let {
                        data: {
                            z_price: total,
                            payment,
                            user_money,
                            sNo,
                            list,
                            id
                        }
                    } = res
                    this.total = total.toFixed(2)
                    this.total = parseFloat(this.total)
                    this.payment = payment
                    this.user_money = Number.parseFloat(user_money)
                    this.sNo = sNo
                    this.payTitle = list[0].p_name
                    
                    this.order_pay_info = JSON.stringify({
                        order_id: id,
                        total,
                        sNo
                    })
                    
                    this.show_pay_way()
                    if(this.type == 'IN' || this.ordertype == 'IN') {
                        this.open_wxpay = false
                        this.open_alipay = false
                    }
                })
            }
        }
    }
</script>
<style lang="less" scoped>

</style>
