<template>
    <div class="cart_f pages-pay-orderDetailsr" ref='cart'>
        <heads :title=' language.pay.orderDetailsr.title' :returnR='returnR'></heads>

        <paymodel @cancel="wallet_pay_cancel" @success="check_pay_password" v-model="pay_display"/>
        <mock :load="load"></mock>

        <div class="order_detail" v-if="load">
            <choose-address
                :shop_address="shop_list"
                :shop_id="shop_id"
                :shop_status="false"
                v-model="address"
                :address_status="adds_f"
                :is_express="is_express"
                @change="sChange"
                is_way="is_way"
            />

            <!--灰色间隔-->
            <div class="yh-line"></div>
            <!--商品列表-->
            <div>
                <ul :key='indexs' v-for='(items,indexs) in pro'>
                    <li class='storeLi' v-if='items.shop_id'>
                        <img :src="storeImg" class="yh-storeLi-imga">
                        {{items.shop_name}}
                        <!-- <img :src="jiantou" class="yh-jiantou-img"> -->
                    </li>
                    <li :key='index' class='goods' v-for="(item,index) in items.list">
                        <img :src="item.img"/>
                        <div class='goods_right'>
                            <p>{{item.product_title}}</p>
                            <span class="size">{{item.color?item.color:''}}{{item.name?item.name:''}}{{item.size?item.size:''}}</span>
                            <div class='goods_bottom'>
                                <p v-if="is_grade" style="font-weight: normal;">
                                    {{language.pay.orderDetailsr.vip_price}}￥<span style="font-weight: bold;">{{membership_price.toFixed(2)}}</span>
                                    <span style="font-size: 22rpx;color: #999999;text-decoration: line-through;margin-left: 8rpx;">￥{{products_total.toFixed(2)}}</span>
                                    <span style="text-decoration: line-through; color: #999; margin-left: 5px;">￥{{ item.yprice }}</span>
                                </p>
                                <p v-else>
                                    <span class="yh-goods_bottom-span">￥</span>{{pro[0].list[0].secPrice.toFixed(2)}}
                                    <span style="text-decoration: line-through; color: #999; margin-left: 5px;">￥{{ pro[0].list[0].attrPrice }}</span>
                                </p>

                                <div class='format'>
                                    <!-- <p class="yh-format-p" style="max-width: 140px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                        {{item.color?item.color:''}}{{item.name?item.name:''}}{{item.size?item.size:''}}</p> -->
                                    <p class="yh-format-pa" style="margin-right: 0;color: #020202;">x{{item.num}}</p>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>            

            <!--运费、优惠券、合计信息-->
            <ul >
                <li class='order_coupon' v-if="!bargain && coupon_status && is_distribution!=1">
                    <span>{{language.pay.orderDetailsr.Discount[2]}}</span>
                    <div @tap="coupon()">
                        <span>{{coupon_name? coupon_name : '已优惠：'+ coupon_money +'元' }}</span>
                        <img :src="jiantou" class='arrow' style='margin-left: 20rpx;'/>
                    </div>
                </li>
                <li class='order_coupon'
                    v-if="!bargain && isDistribution==false && is_distribution!=1 && is_subtraction == 1 && ((reduce_money == 0 && reduce_name != '')||(reduce_money > 0 && reduce_name == ''))">
                    <span>{{language.pay.orderDetailsr.Discount[3]}}</span>
                    <span v-if="reduce_money == 0 && reduce_name != ''">{{reduce_name}}</span>
                    <span v-else>{{reduce_money}}</span>
                </li>
                <li class='order_coupon' v-if="grade_rate!=1">
                    <span>{{language.pay.orderDetailsr.Discount[4]}}</span>
                    <span>{{grade_rate*10}}{{language.pay.orderDetailsr.fracture}}</span>
                </li>
                <li class='order_coupon' v-if="is_distribution==1 && discount!=1">
                    <span>{{language.pay.orderDetailsr.Discount[5]}}</span>
                    <span>{{discount*10}}{{language.pay.orderDetailsr.fracture}}</span>
                </li>
                <li class='order_coupon'>
                    <span>{{language.pay.orderDetailsr.freight}}</span>
                    <span v-if="freightt==0">{{language.pay.orderDetailsr.Free_mail}}</span>
                    <span v-else>￥{{freightt}}</span>
                </li>
                <li class='order_coupon'>
                    <span>{{language.pay.orderDetailsr.Order_notes}}</span>
                    <span class="yh-order_coupon-spana"><input :placeholder="language.pay.orderDetailsr.remark" placeholder-style="color:#b8b8b8" type="text"
                                                               v-model="remarks"></span>
                </li>
                <li class='order_coupon' style="flex-direction: column;align-items: flex-end;padding: 24rpx 30rpx;">
                            <span class="yh-order_coupon-spanb" >
                                    {{language.bidding_order.subtotal}}：<span class="yh-order_coupon-fonta">￥{{ sub_total}}</span>
                            </span>
                    <span class="vip_rate" v-if="grade_rate_amount">{{language.bidding_order.discount}}：￥{{grade_rate_amount}}</span>
                </li>
            </ul>

            <!--灰色间隔-->
            <div class="yh-line"></div>
            
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
                :rate="grade_rate_amount"
                @submit="order_pay()"
            />
        </div>

        <!-- 高度屏幕小的时候解决选择不到微信支付的问题 -->
        <div class="yh-wx-pay">
        </div>

        <!--  优惠券    -->
        <div class='copon_div' v-if="use_coupon">
            <ul class='coupon_ul'>
                <li :key='index' @tap="coupon_use(index,item.id,item.coupon_status)"
                    class='coupon_sue'
                    v-for="(item,index) in coupon_list">
                    <span v-if="item.activity_type == 1" v-text="item.name?item.name:''+':免邮'"></span>
                    <span v-else
                          v-text="item.name&&item.name=='不使用优惠券'?'不使用优惠券':item.name+':优惠'+item.money+'元'+item.coupon_name"></span>
                    <img :src="item.id==coupon_id?quan_hei:quan_hui" class="yh-img-s"/>
                </li>
            </ul>
            <div @tap="closeCoupon" class="copou_close">{{language.pay.orderDetailsr.close}}</div>
        </div>
    </div>
</template>

<script>
    import wxParse from '../../components/mpvue-wxparse/src/wxParse.vue'
    import paymodel from '@/components/paymodel.vue'
    import mixinsOrder from '../../mixins/order'
    import mixinCoupon from '../../mixins/coupon'
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
                pay_name: '', //pt是普通订单过来的
                firstFlag: true,
                tmplIds: ['2KrrJchj92YRKhZZ0SSHz76dmrT0cLBJ2Wfe0', 'ncs3u3Bmmi0jW7EXAik4KQvxF3JxbaulWNwbLXDto', 'CZAPo_TqOOeC5K7XYvBeB_LXmyXKIhXkZROArNZDwQ8'],//微信订阅消息模板


                couponList: [], // 平台优惠券
                couponList1: [], // 平台优惠券
                couponIndex: -1,
                mchCouponIndex: [],
                b_type: 0,
                canshu: true,
                is_plugin: false, // 是否是插件商品
                is_grade: false, //是否是会员
                total_discount: 0, //会员优惠总金额
                grade_rate_amount: 0, //会员优惠总金额
                
                is_way: true,
				is_ms:true
                
            }
        },
        mixins: [ mixinsOrder, mixinCoupon],
        onLoad (option) {
            this.getCode()
            this.canshu = uni.getStorageSync('canshu')
            this.$store.state.address_id = this.$store.state.address_id_def
            this.cpId = option.product
            if (option.b_type) {
                this.b_type = 1;
            }

            this.returnR = option.returnR

            if (this.cpId && JSON.parse(this.cpId).findIndex(item => item.sec_id) === 3) {
                this.sec_id = JSON.parse(this.cpId)[3].sec_id
                this.seckill = true
                this.activity_id = this.$store.state.seckilldata.activity_id
                this.platform_activities_id = this.$store.state.seckilldata.platform_activities_id
            }

            if (option.buy_again == true || option.buy_again == 'true') {
                this.buy_again = true
            }
            this.order_id = this.$store.state.order_id
            this.cart_id = this.$store.state.cart_id
            if (Array.isArray(this.cart_id)) {
                this.cart_id = '';
            }

            if (this.cart_id) {
                console.log('cart_id', this.cart_id );
                uni.setStorageSync('cart_id', this.cart_id)
            }


            if (option.cart_id) {
                this.cart_id = option.cart_id
                this.$store.state.cart_id = this.cart_id
                uni.setStorageSync('cart_id', this.cart_id)
            }


            // #ifdef H5 
            let storage = window.localStorage
            if (storage['bargain']) {
                this.cpId = storage['product']
            }

            if (storage['bargain']) {
                this.bargain = storage['bargain'] ? storage['bargain'] : this.bargain
                this.bargain_id = storage['bargain_id'] ? storage['bargain_id'] : this.bargain_id
                this.order_no = storage['order_no'] ? storage['order_no'] : this.order_no
            }



            if (storage['cart_id'] != null && storage['cart_id'] !== '') {
                console.log('清理cart_id');
                this.cart_id = storage['cart_id']
                // storage['cart_id'] = ''
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

            this.bargain = option.bargain
            this.bargain_id = option.bargain_id
            this.order_no = option.order_no

            // #ifdef H5 
            //解决获取code后价格变为普通商品价格的问题


            if (option.product) {
                let kanjia = JSON.parse(option.product)
                if (kanjia[3]) {
                    this.bargain = kanjia[3] && kanjia[3].bargain ? kanjia[3].bargain : this.bargain
                    this.bargain_id = kanjia[4] && kanjia[4].bargain_id ? kanjia[4].bargain_id : this.bargain_id
                    this.order_no = kanjia[5] && kanjia[5].order_no ? kanjia[5].order_no : this.order_no
                }
            }
            // #endif



            this.pay_name = this.$store.state.pay_lx
            console.log('验证code');
            this.checkCode()
            this._axios()
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
            // this._axios('onshow')
            this._axios()

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
        computed: {
            sub_total () {
                return (Number.parseFloat(this.freight) +  Number.parseFloat(this.products_total)).toFixed(2)
            },
            membership_price () {
                let sub_total = Number.parseFloat(this.freight) +  Number.parseFloat(this.products_total)
                return (sub_total -  this.grade_rate_amount -  Number.parseFloat(this.freight)).toFixed(2) 
            }
        },
        methods: {
            mchCouponChange(e){
                let i = Number(e.currentTarget.dataset.id)

                this.mchCouponIndex.splice(i,1,e.detail.value)

                let coupon_id = []
                this.pro.filter((items,indexs)=>{
                    this.mchCouponIndex.filter((item,index)=>{

                        if(indexs == index){
                            if(item>=0){
                                coupon_id.push(items.coupon_list[item].coupon_id)
                            }else{
                                coupon_id.push('0')
                            }
                        }

                    })
                })
                if(this.couponIndex>=0){
                    coupon_id.push(this.couponList1[this.couponIndex].coupon_id)
                }else{
                    coupon_id.push('0')
                }

                this.coupon_id = coupon_id.join()

                this._axios()
            },
            bindCouponChange(e){
                this.couponIndex = e.detail.value

                // this.mchCouponIndex  店铺优惠券选中的下标 []
                // this.couponIndex  平台优惠券选中的下标
                // this.couponList  平台优惠券展示的数组['','','']
                // this.couponList1  平台优惠券的数据[{},{},{}]

                let coupon_id = []
                this.pro.filter((items,indexs)=>{
                    this.mchCouponIndex.filter((item,index)=>{

                        if(indexs == index){
                            if(item>=0){
                                coupon_id.push(items.coupon_list[item].coupon_id)
                            }else{
                                coupon_id.push('0')
                            }
                        }

                    })
                })
                if(this.couponIndex>=0){
                    coupon_id.push(this.couponList1[this.couponIndex].coupon_id)
                }else{
                    coupon_id.push('0')
                }
                this.coupon_id = coupon_id.join()

                this._axios()
            },
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
                console.log('++++++++++++++++++++++')
                let product = uni.getStorageSync('goodsInfo')
                
                let product_type = 'MS';
                if (this.b_type == 1) {
                    product_type = 'PM'
                }
                
                let data = {
                    module: 'app',
                    action: 'order',
                    app: 'Settlement',
                    product_type: product_type,
                    cart_id: this.cart_id,
                    address_id: this.address_id,
                    canshu: uni.getStorageSync('canshu'),
                    sec_id: this.sec_id,
                    coupon_id: this.coupon_id?this.coupon_id:'0',
                }
                if (this.cpId) {
                    data.product = product || this.cpId;
                    data.cart_id = ''
                }
                
                if (!this.is_express) {
                    data.shop_address_id = this.shop_address_id
                }
                this.$req.post({data}).then(res => {
                    res = Object.assign({}, res.data)
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
                        coupon_list,
                        total_discount,
                        grade_rate_amount
                    } = res;

                    this.total_discount = total_discount
                    this.grade_rate_amount = grade_rate_amount;

                    // 砍价商品请求的数据
                    let coupon_money = res.coupon_money || 0
                    let reduce_money = res.reduce_money || 0
                    this.coupon_money = coupon_money

                    this.total = Number.parseFloat(total).toFixed(2)

                    // 处理收货地址的逻辑
                    this.handleOrderAddress(address, res.shop_list, res.shop_status)


                    if(coupon_list&&coupon_list.length>0){
                        this.couponList1 = coupon_list
                        this.couponList = []
                        coupon_list.filter((item,index)=>{
                            this.couponList.push(item.coupon_name)

                            if(item.coupon_status){
                                this.couponIndex = index
                            }
                        })
                    }

                    this.time_id = time_id
                    this.payment = payment
                    if (products && products.length > 0) {
                        // 竞拍商品请求数据
                        this.pro = products
                        this.payTitle = products[0].list[0].product_title
                        this.is_plugin = !products[0].hasOwnProperty('shop_subtotal')

                    }

                    this.user_money = Number.parseFloat(user_money)
                    if (address) {
                        if (!this.$store.state.address_id_def) {
                            this.$store.state.address_id_def = address.id
                        }
                    }

                    this.password_status = password_status
                    if (type !== 'onshow') {
                        this.coupon_id = coupon_id
                    } else {
                        if (uni.getStorageSync('chooseAddress')) {
                            this.address = uni.getStorageSync('chooseAddress')
                        }
                    }


                    this.coupon_status = res.coupon_status
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
                    this.total = Number.parseFloat(total)
                    this.reduce_money = reduce_money
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
