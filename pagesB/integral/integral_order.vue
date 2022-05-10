<template>
    <div class="cart_f" ref='cart'>
        <heads :title="language.integral.integral_order.title"></heads>

        <paymodel @cancel="wallet_pay_cancel" @success="check_pay_password" v-model="pay_display"/>
        
        <toload :load="load">
            <!-- 渲染数据 -->
            <div class="order_detail">

                <choose-address
                    :shop_id="shop_id"
                    :shop_address="shop_list"
                    :address_status="adds_f"
                    :shop_status="shop_status"
                    :is_express="is_express"
                    v-model="address"
                />

                <!--灰色间隔-->
                <div class="yh-line"></div>
                <!--商品列表-->

                <div>
                    <ul>

                        <li class='storeLi yh-storeLi' v-if='pro.mch_id > 0'>

                            <img :src="storeImg" class="yh-storeImg">
                            {{ pro.shop_name }}
                            <!-- <img :src="jiantou" class="yh-jiantou"> -->
                        </li>

                        <li class='goods'>

                            <img :src="pro.imgurl"/>

                            <div class='goods_right'>

                                <p>{{ pro.product_title }}</p>
                                <p class="size">{{ pro.size }}</p>
                                <div class='goods_bottom'>
                                    <p class="yh-money" v-if='pro.money>0'>
                                        <span class="yh-money-span">￥</span>

                                        {{ Number(pro.money).toFixed(2) }}+

                                        <img :src="integral_hei" class="yh-integral">

                                        {{pro.integral}}
                                    </p>

                                    <p v-else><img :src="integral_hei" class="yh-integral">{{ pro.integral }}</p>

                                    <div class='format yh-format'>
                                        <p class="yh-format-p1">x{{ pro.num }}</p>
                                        <!-- <p class="yh-format-p2">x{{ pro.num }}</p> -->
                                    </div>

                                </div>
                            </div>
                        </li>
                        <div class="yh-line"></div>
                    </ul>
                </div>
                <!--运费、优惠券、合计信息-->
                <ul>

                    <!-- <li class='order_coupon' v-if='pro.money > 0'> -->
                    <li class='order_coupon'>
                        <span>{{language.integral.integral_order.Commodity_amount}}<text class="yh-integral-color">（{{language.integral.integral_order.balance}}￥{{user_money | 0}}）</text></span>
                        <span>￥{{ Number(money).toFixed(2) }}</span>
                    </li>

                    <li class='order_coupon'>
                        <view class="yh-integral_hui">
                            {{language.integral.integral_order.Total_points}}
                            <view class="yh-integral_hui yh-integral-color">
                                （{{language.integral.integral_order.points}}
                                <img :src="integral_hui" class="yh-user_score">
                                {{user_score}}）
                            </view>
                        </view>

                        <view class="yh-integral_hui">
                            <img :src="integral_hei" class="yh-user_score">
                            {{integrals}}
                        </view>

                    </li>

                    <li class='order_coupon'>
                        <span>{{language.integral.integral_order.freight}}</span>
                        <span v-if="freightt == 0">{{language.integral.integral_order.Free_mail}}</span>
                        <span v-else>￥{{ Number(freightt).toFixed(2) }}</span>
                    </li>

                    <li class='order_coupon' style="border-bottom: none"> 

                        <span class="yh-heji">{{language.integral.integral_order.total}}：</span>

                        <span>
						
						<view class="yh-integral_hui yh-freightt" v-if="pro.money > 0 || freightt > 0">
							￥{{ Number(total).toFixed(2) }}+
							<img :src="integral_hong" class="yh-integral_hong">
							{{ integrals }}
						</view>
						
						<text class="yh-font" v-else>
							<img :src="integral_hong" class="yh-integral_hongs">
							{{ integrals }}
						</text>
					</span>

                    </li>
                </ul>
                <!-- <choose-pay
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
                /> -->
                <div class='foot safe-area-inset-bottom'>
                    <span @tap="order_pay()" class="gopay">{{language.integral.integral_order.Confirm_exchange}}</span>
                </div>
            </div>
        </toload>
    </div>
</template>

<script>
    import chooseAddress from '@/components/order/choose-address.vue'
    import paymodel from '@/components/paymodel.vue'
    import choosePay from '@/components/choose-pay.vue'
    import wxParse from '../../components/mpvue-wxparse/src/wxParse.vue'
    import mixinsOrder from '../../mixins/order'
    export default {
        data () {
            return {
                payment: {
                  H5_wechat:1,
                  alipay:1,
                  alipay_minipay:1,
                  alipay_mobile:1,
                  app_wechat:1,
                  baidu_pay:0,
                  jsapi_wechat:1,
                  mini_wechat:1,
                  pc_alipay:1,
                  pc_wechat:1,
                  tt_alipay:1,
                  wallet_pay:1
  
                },
                load: false,
                pro: [],
                id: 0,
                user_score: 0,
                integral_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/integral_hui.png',
                integral_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/integral_hei.png',
                integral_hong: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/integral.png',
                storeImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/store.png',
                jiantou: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jiantou2x.png',
                
                cpId: '',
                integral: true,
                integrals: '',
                
                user_money: '',
                money: ''
            }
        },
        mixins: [mixinsOrder],
        components: {
            chooseAddress,
            paymodel,
            choosePay,
            wxParse,
        },
        onLoad (option) {
            console.log(option)
            console.log(option.product)
            this.id = option.id
            this.cpId = option.product
            this.address_id = this.$store.state.address_id_def
            if (this.cpId) {
                uni.setStorageSync('goodsInfo', this.cpId)
            }
            this.$store.state.address_id = this.$store.state.address_id_def
            // let storage = window.localStorage
            let storage = uni.getStorage()
            this.$store.state.address_id = this.$store.state.address_id_def
            
            if (!this.$store.state.address_id) {
                this.$store.state.address_id = storage['address_id']
            }
        },
        onShow () {
            this.getCode()
            this.address_id = this.$store.state.address_id_def
            this.shop_address_id = uni.getStorageSync('shop_address_id')
            this.checkCode()
            this._axios()
        },
        methods: {
            getIntegralWalletPayData(postData) {
                let product = uni.getStorageSync('goodsInfo')
                return {
                    ...postData,
                    product: product || this.cpId
                }
            },
            getIntegralPayOrderInfo() {
                let product = uni.getStorageSync('goodsInfo')
                // uni.showLoading({
                //     title: this.language.integral.integral_order.Tips[0]
                // })
                let data = {
                    module: 'app',
                    action: 'integral',
                    app: 'payment',
                    address_id: this.address_id ? this.address_id : this.addre_id,
                    jifen_id: this.id,
                    type: 'IN',
                    product: product || this.cpId,
                    
                }
                return data
            },
            sChange (is_express) {
                this.is_express = is_express;
                if (is_express) {
                    this._axios('onshow')
                } else {
                    this.freight = this.freightt = 0
                    this.shop_list = {
                        id: 0
                    }
                }


            },
            // _wallet_pay () {
            //     let product = uni.getStorageSync('goodsInfo')
            //     uni.showLoading({
            //         title: this.language.integral.integral_order.Tips[0]
            //     })
            //     let data = {
            //         module: 'app',
            //         action: 'integral',
            //         app: 'payment',
            //         address_id: this.address_id ? this.address_id : this.addre_id,
            //         jifen_id: this.id,
            //         type: 'IN',
            //         product: product || this.cpId,
                    
            //     }

            //     this.$req.post({data}).then(async res => {
            //         if (res.code == 200) {
            //             uni.showToast({
            //                 title: this.language.integral.integral_order.Tips[1],
            //                 icon: 'none'
            //             })
            //             setTimeout(() => {
            //                 uni.setStorageSync('payRes', res.data)
            //                 uni.redirectTo({
            //                     url: '/pages/pay/payResult?is_jifen=true'
            //                 })
            //             })
                        
            //         } else if (res.code == 110) {
            //             uni.showToast({
            //                 title: res.message,
            //                 duration: 1500,
            //                 icon: 'none'
            //             })
            //         } else {
            //             uni.showToast({
            //                 title: this.language.integral.integral_order.Tips[2],
            //                 duration: 1500,
            //                 icon: 'none'
            //             })
            //         }
            //     })
                
                
            // },
            // _pay_fail () {
                
            // },
            // order_pay () {
            //     if (!this.adds_f) {
            //         uni.showToast({
            //             title: this.language.integral.integral_order.Tips[3],
            //             icon: 'none'
            //         })
            //         return
            //     }

            //     if (Number.parseFloat(this.user_money) < Number.parseFloat(this.pro.money)) {
            //         uni.showToast({
            //             title: this.language.integral.integral_order.Tips[4],
            //             icon: 'none'
            //         })
            //         return
            //     }

            //     if (Number.parseFloat(this.user_score) < Number.parseFloat(this.pro.integral)) {
            //         uni.showToast({
            //             title: this.language.integral.integral_order.Tips[5],
            //             icon: 'none'
            //         })
            //         return
            //     }
                
            //     this.pay_display = true
            // },
            _axios () {
                let product = uni.getStorageSync('goodsInfo')
                let data = {
                    module: 'app',
                    action: 'integral',
                    app: 'integral_axios',

                    jifen_id: this.id,
                    address_id: this.address_id ? this.address_id : '',
                    type: 'IN',
                }
                if (this.cpId) {
                    data.product = product || this.cpId;
                }
                this.$req.post({data}).then(res => {
                    if (res.code != 200) {
                        this.load = true
                        uni.showToast({
                            title: this.language.integral.integral_order.Tips[6],
                            icon: 'none'
                        })
                        return
                    }
                    let {
                        data: {
                            address,
                            freight,
                            password_status,
                            products,
                            total,
                            user_money,
                            user_score,
                            enterless,
                            integral,
                            money
                        }
                    } = res
                    this.money = money
                    this.address = address
                    this.price = total
                    this.total = total
                    this.pro = products
                    this.integrals = integral
                    this.user_money = products.money
                    
                    this.pro.money = parseFloat(this.pro.money)
                    this.user_money = user_money
                    this.user_score = user_score
                    if(address) {
                        this.addre_id = address.id
                    }
                    if (!this.$store.state.address_id_def && address) {
                        this.$store.state.address_id_def = address.id
                    }
                    if(address) {
                        this.address_id = address.id
                    }
                    this.password_status = password_status
                    this.enterless = enterless
           
                    if (this.address) {
                        this.adds_f = this.address.length !== 0;
                    }
                    if (res.shop_status && res.shop_list) {
                        this.shop_status = res.shop_status
                        this.shop_list = res.shop_list
                        if (res.shop_list.length === 0) {
                            this.shop_address_id = ''
                            uni.setStorageSync('shop_address_id', '')
                        } else {
                            this.shop_address_id = res.shop_list.id
                            uni.setStorageSync('shop_address_id', res.shop_list.id)
                        }
                    }
                    console.log(this.show_pay_way)
                    this.show_pay_way()

                    this.freightt = Number.parseFloat(freight)
                    this.freight = freight
                    this.load = true
                })

            },
        }
    }
</script>


<style lang="less" scoped >
    @import url("../../static/css/pay/orderDetailsr.less");
    .foot {
        padding-left: 0;
        border: none;
        background: @titleBackground;
    }
    .yh-heji {
        font-size: 34rpx !important;
        font-weight: bold;
    }
    
    .order_detail {
        width: 100%;
        height: calc(100vh - 94px);
        overflow: hidden;
        overflow-y: auto;
        padding-bottom: 20px;
    }
    

</style>
