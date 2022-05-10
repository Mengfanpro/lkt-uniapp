<template>
    <div class="cart_f pages-pay-orderDetailsr" ref='cart'>
        <heads :title='language.bidding_order.title' :returnR='returnR'></heads>

        <paymodel @cancel="wallet_pay_cancel" @success="check_pay_password" v-model="pay_display"/>
        <mock :load="load"></mock>

        <div class="order_detail" v-if="load">
            <choose-address
                :shop_address="shop_list"
                :shop_id="shop_id"
                :shop_status="shop_status === 1"
                v-model="address"
                :address_status="adds_f"
                :is_express="is_express"
                @change="sChange"
            />

            <!--灰色间隔-->
            <div class="yh-line"></div>
            <!--商品列表-->
            <ul>
                <li class='goods'>
                    <img :src="jp_imgurl"/>
                    <div class='goods_right'>
                        <p>{{jp_name}}</p>
                        <div class='goods_bottom'>
                            <p v-if="is_grade" style="font-weight: normal;">
                                    {{language.pay.orderDetailsr.vip_price}}￥<span style="font-weight: bold;">{{membership_price}}</span>
                                    <span style="font-size: 22rpx;color: #999999;text-decoration: line-through;margin-left: 8rpx;">￥{{products_total}}</span>
                                </p>
                            <p v-else>
                                <span class="yh-goods_bottom-span">￥</span>{{products_total}}
                            </p>
                        </div>
                    </div>
                </li>
            </ul>
            
            <!--运费、优惠券、合计信息-->
            <ul>
                <li class='order_coupon' v-if="grade_rate!=1">
                    <span>{{language.bidding_order.vipDiscount}}</span>
                    <span>{{grade_rate*10}} {{language.bidding_order.fold}}</span>
                </li>
                <li class='order_coupon' v-if="is_distribution==1 && discount!=1">
                    <span>{{language.bidding_order.distributionDiscount}}</span>
                    <span>{{discount*10}} {{language.bidding_order.fold}}</span>
                </li>
                <li class='order_coupon'>
                    <span>{{language.pay.orderDetailsr.freight}}</span>
                    <span v-if="freightt==0">{{language.pay.orderDetailsr.Free_mail}}</span>
                    <span v-else>￥{{freightt}}</span>
                </li>
                <li class='order_coupon'>
                    <span>{{language.bidding_order.orderRemarks}}</span>
                    <span class="yh-order_coupon-spana"><input :placeholder="language.bidding_order.orderRemarks_placeholder" placeholder-style="color:#b8b8b8" type="text"
                                                               v-model="remarks"></span>
                </li>
                <li class='order_coupon' style="flex-direction: column;align-items: flex-end;padding: 24rpx 30rpx;">
                            <span class="yh-order_coupon-spanb" >
                                    {{language.bidding_order.subtotal}}：<span class="yh-order_coupon-fonta">￥{{ sub_total}}</span>
                            </span>
                    <span class="vip_rate" v-if="total_discount">{{language.bidding_order.discount}}：￥{{total_discount}}</span>
                </li>
            </ul>

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
                :ishide="ishide"
                :total="total"
                :rate="total_discount"
                @submit="order_pay()"
            />
        </div>

        <!-- 高度屏幕小的时候解决选择不到微信支付的问题 -->
        <div class="yh-wx-pay">
        </div>
    </div>
</template>

<script>
    import wxParse from '../../components/mpvue-wxparse/src/wxParse.vue'
    import paymodel from '@/components/paymodel.vue'
    import mixinsOrder from '../../mixins/order'
    import choosePay from '@/components/choose-pay.vue'
    import chooseAddress from '@/components/order/choose-address.vue'
    import submitOrder from '@/components/order/submit-order.vue'
    import mock from '@/components/skeleton/orderDetailsrMock'

    export default {
        data () {
            return {
                payment: '',
                isDistribution: false, //是否是分销商品？true是，false不是
                jiantou: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jiantou2x.png',
                load: false,
                returnR: 0,
                cpId: '',
                title: '确认订单信息',
                is_subtraction: 1,
                reduce_name: '',
                pro: [], //购买商品列表
                storeImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/store.png',
                quan_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/xuanzehei2x.png',
                quan_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/xuanzehui2x.png',
                ishide: 0,//是否隐藏底部支付栏 1隐藏 0不隐藏
                sNo: '',
                name: '',
                is_distribution: 0,
                cart_id: '',
                firstFlag: true,
                tmplIds: ['2KrrJchj92YRKhZZ0SSHz76dmrT0cLBJ2Wfe0', 'ncs3u3Bmmi0jW7EXAik4KQvxF3JxbaulWNwbLXDto', 'CZAPo_TqOOeC5K7XYvBeB_LXmyXKIhXkZROArNZDwQ8'],//微信订阅消息模板
                pay_name: 'jp',

                couponList: [], // 平台优惠券
                couponList1: [], // 平台优惠券
                couponIndex: -1,
                mchCouponIndex: [],

                canshu: true,
                is_plugin: false, // 是否是插件商品
                is_grade: false, //是否是会员
                total_discount: 0, //会员优惠总金额
                grade_rate_amount: 0, //会员折扣减去的金额
                
            }
        },
        mixins: [ mixinsOrder],
        onLoad (option) {
            this.getCode()
            this.canshu = uni.getStorageSync('canshu')
            this.$store.state.address_id = this.$store.state.address_id_def
            this.cpId = option.product


            this.returnR = option.returnR

            if (option.buy_again == true || option.buy_again == 'true') {
                this.buy_again = true
            }
            
            // #ifdef H5 
            let storage = window.localStorage

            if (!this.$store.state.bindding_num) {
                this.$store.state.bindding_num = storage['bindding_num']
                this.$store.state.pay_lx = 'jp'

            }


            if (!this.$store.state.address_id) {
                this.$store.state.address_id = storage['address_id']
            }

            // #endif

            if (this.cpId) {
                uni.setStorageSync('goodsInfo', this.cpId)
            }

            if (option.canshu) {
                uni.setStorageSync('canshu', option.canshu)
            }

            if (option.isDistribution == 1 && option.isDistribution != 'false') {
                this.isDistribution = true
            }
            
            this.order_no = option.order_no

            // #ifdef H5 
            //解决获取code后价格变为普通商品价格的问题
            
            // #endif



            this.pay_name = this.$store.state.pay_lx
            this.bind_id = this.$store.state.bindding_num
            this.checkCode()
            this._axios()
        },
        computed: {
            sub_total () {
                return (Number.parseFloat(this.freight) +  Number.parseFloat(this.products_total)).toFixed(2)
            },
            membership_price () {
                let sub_total = Number.parseFloat(this.freight) +  Number.parseFloat(this.products_total)
                return (sub_total -  this.grade_rate_amount -  Number.parseFloat(this.freight)).toFixed(2)
            }
        },
        onShow () {
            // 每次进入页面接受自提选择的页面
            if (this.hc_address_id != this.$store.state.address_id) {
                this.hc_address_id = this.address_id = this.$store.state.address_id
            }

            if (uni.getStorageSync('store_choose')) {
                uni.removeStorageSync('store_choose')
            }

            this.shop_address_id = uni.getStorageSync('shop_address_id')
            this._axios('onshow')

            // #ifdef MP-WEIXIN
            this.LaiKeTuiCommon.getWXTmplIds(this)
            // #endif
            this.fastTap = false;
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
            
            sChange (is_express) {
                this.is_express = is_express;
                if (is_express) {
                    this.shop_list = {
                        id: 0
                    }
                    this._axios('onshow')
                } else {
                    this.freight = this.freightt = 0
                    for (let i  = 0; i < this.pro.length; i ++) {
                        this.pro[i].shop_subtotal = this.pro[i].shop_subtotal - this.pro[i].freight_price
                        this.pro[i].freight_price = 0
                    }
                }

            },

            _axios(type = '') {
                let product = uni.getStorageSync('goodsInfo')
                let data = null;
                data = {
                    module: 'app',
                    action: 'order',
                    auction_id: this.bind_id,
                    product_type: 'JP',
                    app: 'Settlement',
                    coupon_id: this.coupon_id?this.coupon_id:'0',
                    address_id: this.address_id,
                }
                if (this.cpId) {
                    data.product = product || this.cpId;
                    data.cart_id = ''
                }

                if (!this.is_express) {
                    data.shop_address_id = this.shop_address_id
                }
                this.$req.post({data}).then(res => {
                    res = Object.assign(res, res.data)
                    
                    this.canshu = false
                    // 报错库存不足的时候 status = 1, 其他的时候会返回 code 不等于 200 的值
                    if (res.status === 0 || (res.hasOwnProperty('code') && res.code !== 200) ) {
                        this.load = true
                        uni.showToast({
                            title: res.msg,
                            duration: 1500,
                            icon: 'none'
                        });
                        setTimeout(() => {
                            this.navBack()
                        }, 1500)

                        return false
                    }

                    let {
                        address,
                        coupon_id,
                        payment,
                        freight,
                        password_status,
                        products,
                        products_total,
                        total,
                        user_money,
                        enterless,
                        time_id,
                        is_distribution,
                        discount,
                        grade_rate,
                        grade_rate_amount
                    } = res;

                    

                    this.total = Number.parseFloat(total).toFixed(2)
                    
                    this.time_id = time_id
                    this.payment = payment
                    if (products && products.length > 0) {
                        // 竞拍商品请求数据
                        this.pro = products[0]
                        this.jp_imgurl = res.imgurl
                        this.payTitle = this.jp_name = res.a_title
                        this.total = res.products_total

                    }

                    this.user_money = Number.parseFloat(user_money)


                    this.password_status = password_status

                    // 处理收货地址的逻辑
                    this.handleOrderAddress(address, res.shop_list, res.shop_status)
                    
                    if (type !== 'onshow') {
                        this.coupon_id = coupon_id
                    } else {
                        if (uni.getStorageSync('chooseAddress')) {
                            this.address = uni.getStorageSync('chooseAddress')
                        }
                    }


                    this.enterless = enterless
                    this.is_distribution = is_distribution
                    this.discount = discount ? discount : 1
                    // this.grade_rate = grade_rate ? grade_rate : 1
                    this.is_grade = (grade_rate>0&&grade_rate<1)?true:false
                    if (!this.is_grade) {
                        this.grade_rate_amount = 0;
                    } else {
                        this.grade_rate_amount = grade_rate_amount
                        if (grade_rate_amount == 0) {
                            this.is_grade = false;
                        }
                    }
                    this.total_discount = this.grade_rate_amount
                    this.total = Number.parseFloat(total)
                    this.reduce_name = res.reduce_name
                    this.is_subtraction = res.is_subtraction
                    this.products_total = products_total

                    // 运费赋值留到最后，计算价格是放在运费的监听函数里
                    this.freightt = parseFloat(freight).toFixed(2)
                    this.freight = freight

                    this.show_pay_way()


                    uni.setStorageSync('cart_id', this.cart_id)
                    this.load = true


                }).catch(e => {
                    console.log(e);
                    this.load = true
                })

            }
        },
        components: {
            wxParse,
            paymodel,
            choosePay,
            chooseAddress,
            submitOrder,
            mock
        }
    }
</script>

<style lang="less" scoped>
    @import url("../../static/css/pay/orderDetailsr.less");
</style>
