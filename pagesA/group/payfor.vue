<template>
    <div ref='cart' class="cart_f">
        <heads :title='language.groupPayfor.title'></heads>

        <paymodel @cancel="wallet_pay_cancel_pt" @success="check_pay_password" v-model="pay_display"/>

        <toload :load="load">
            <div class="order_detail">
                <choose-address
                    :shop_address="[]"
                    v-model="address"
                    :address_status="adds_f == 1"
                    :is_express="is_express"
                />
            </div>
            
            <div class="marginb">
                <!--灰色间隔-->
                <div class="yh-line"></div>
                <!--商品列表-->
                <ul>
                    <li class='storeLi' @click="navTo('/pagesA/store/store?shop_id=' + mch_id)">
                        <img :src="storeimg" class="yh-storeLi-imga">
                        {{mch_name}}
                        <img :src="jiantou" class="yh-jiantou-img">
                    </li>
                    <li class='goods'>

                        <img :src="pro.image"/>
                        <div class='goods_right'>
                            <p>{{pro.pro_name}}</p>
                            <p style="color: #9D9D9D;margin-top: auto;">{{pro.size}}</p>
                            <div class='goods_bottom'>
                                <p class="goods_huiyuan">
                                    <span v-if="is_grade">{{language.groupPayfor.vipPrice}}{{huiyuan}}</span>
                                    <span style="font-size: 22rpx;" :style="is_grade ? 'text-decoration:line-through;color:#9D9D9D':'' ">
                                        ￥{{products_total}}
                                        <!-- {{language.groupPayfor.yuan}} -->
                                    </span>
                                </p>
                                <div class='format' style="clear: both;">
                                    
                                    <p>x{{num}}</p>
                                    <p class="grouppeo" :style="{width: languageType=='en'?'112rpx':''}">{{groupman}}{{language.groupPayfor.peopleGroup}}</p>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>

                <ul>
					<li style="border-top: 1px solid #eee;margin-left: 20px;"></li>
                    <li class='order_coupon' v-if="grade_rate != 1">
                        <span>{{language.groupPayfor.vipDiscount}}</span>
                        <span>{{grade_rate*10}} {{language.groupPayfor.fold}}</span>
                    </li>
                    <li class='order_coupon'>
                        <span>{{language.groupPayfor.freight}}</span>
                        <span v-if="freightt==0">{{language.groupPayfor.freeShipping}}</span>
                        <span v-else>￥{{freightt}}</span>
                    </li>
                    <li class="order_coupon">
                        <span></span>
					<span class="yh-order_coupon-spanb yh-discount">
						
						<span>
							{{language.groupPayfor.Total}}<font class="yh-order_coupon-fonta">￥{{ total }}</font>
						</span>
                        <span style="color: #FF7D00;font-size: 14px;" v-if="is_grade">{{language.groupPayfor.vipDiscount1}}¥{{membership_price}}</span>
					</span>
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
                    :rate="membership_price"
                    @submit="order_pay()"
                />

                <!-- 高度屏幕小的时候解决选择不到微信支付的问题 -->
                <div class="yh-wx-pay">
                </div>
                
            </div>
        </toload>


        


    </div>
</template>

<script>

    import paymodel from '@/components/paymodel.vue'
    import mixinsOrder from '../../mixins/order'
    import mixinCoupon from '../../mixins/coupon'
    import choosePay from '@/components/choose-pay.vue'
    import chooseAddress from '@/components/order/choose-address.vue'
    import submitOrder from '@/components/order/submit-order.vue'
    import wxParse from '@/components/mpvue-wxparse/src/wxParse'
    import { later } from '@/common/util'

    export default {
        data () {
            return {
                groupman: '', //拼团人数
                activity_no: '', //拼团活动号
                jiantou: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jiantou2x.png',
                storeimg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/store.png',
                pro: '',
                load: false,
                ishide: 0,
                num: 1,
                mch_id: 0,
                mch_name: '',
                a_type: '',
                groupres: null,
                ptcode: '',
                payTitle: '',
                is_plugin: false, // 是否是插件商品
                is_grade: false, //是否是会员
                total_discount: 0, //会员优惠金额
                grade_rate_amount: 0, //会员优惠总金额
                cs:false
            }
        },
        mixins: [ mixinsOrder, mixinCoupon],
        beforeDestroy () {
            
            this.$store.state.order_id = ''
        },
        onLoad (option) {
            this.getCode()
            this.cpId = option.product
            if (!this.cpId) {
                this.cpId = ''
            }
            
            if (option.a_type) {
                this.a_type = 1;
            }
            
            if(option.canshu){
                this.cs = option.canshu
            }
            
            this.returnR = option.returnR
            this.product = JSON.parse(this.cpId)
            console.log('this.cpId', this.cpId)
            // #ifdef H5
            let storage = window.localStorage
            if (storage['product']) {
                console.log('product', storage['product'])
                this.product = JSON.parse(storage['product']);
                this.product = '';
            }
            // #endif  
            this.checkCode()
        },
        watch: {
            products_total () {
                this.total = ((this.products_total - this.coupon_money - this.reduce_money) * this.discount * this.grade_rate + this.freight).toFixed(2)
            }  
        },
        onShow () {
            this.orde_id = this.$store.state.order_id
            this.cart_id = this.$store.state.cart_id
            this.address_id = this.$store.state.address_id
            if (!this.address_id) {
                this.address_id = this.$store.state.address_id_def
            }
            
            this._axios()
        },
        computed: {
            huiyuan () {
                var num = this.products_total * this.grade_rate
                return this.formatDecimal(num,2)
            },
            membership_price () {
                var num = Math.round((parseFloat(this.products_total) - parseFloat(this.huiyuan))*100)/100
                 
                return this.formatDecimal(num,2)
               // return Number(this.products_total) -  Number(this.huiyuan)
            }
        },
        methods: {
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
                    orde_id: this.order_id,
                    sNo: this.sNo,
                    pro_id: this.product.pid,
                    man_num: this.product.groupnum, //拼团人数
                    grade_rate: this.grade_rate, //会员折扣
                    payment_money: this.total,
                    activity_no: this.product.activity_no, //活动编号

                }


                if (this.product.frompage == 'cantuan') {
                    postData.ptcode = this.product.ptcode
                }

                let { status, err, code } = await this.$req.post({ data: postData })
                uni.hideLoading()
                if (status === 0 || code === 0) {
                    uni.showToast({
                        title: err,
                        duration: 1000,
                        icon: 'none'
                    })
                    return false;
                }

                uni.showToast({
                    title: this.language.groupPayfor.payOk,
                    duration: 1000,
                    icon: 'none'
                })
                
                await later(1000)

                if (this.product.frompage == 'cantuan') {
                    
                    
                    // #ifndef MP-WEIXIN
                    let url = '/pagesA/group/group_end?sNo=' + this.sNo + '&activity_no=' + this.product.activity_no + '&returnR=2&otype=cantuan&cc=2'
                    if (this.a_type == 1) {
                        url += '&a_type=1'
                    }
                    uni.redirectTo({
                        url: url
                    })
                    // #endif
                    // #ifdef MP-WEIXIN
                    let url2 = '/pagesA/group/group_end?sNo=' + this.sNo + '&activity_no=' + this.product.activity_no + '&returnR=2&otype=cantuan&cc=3'
                    if (this.a_type == 1) {
                        url2 += '&a_type=1'
                    }
                    
                    uni.navigateBack({
                        url: url2
                    })
                    // #endif

                } else {
                    let url3 = '/pagesA/group/group_end?sNo=' + this.sNo + '&activity_no=' + this.product.activity_no + '&returnR=1&cc=4'
                    if (this.a_type == 1) {
                        url3 += '&a_type=1'
                    }
                    
                    uni.redirectTo({
                        url: url3
                    })
                }
                
            },
            /**
             * 取得请求支付所需的 pay_order_info
             * @returns {Promise<void>}
             * @private
             */
            async _getPayOrderInfo () {
                let action = 'groupbuy';
                if (this.a_type == 1) {
                    action = 'pthd_groupbuy';
                }
                if(typeof(this.product.platform_activities_id)=='undefined'){
                    this.product.platform_activities_id="";
                }
                let postData = {
                    module: 'app',
                    action: action,
                    m: 'createOrder',
                    pro_id: this.product.pid,
                    num: this.product.num, //购买数量
                    man_num: this.product.groupnum, //拼团人数
                    activity_no: this.product.activity_no, //活动编号
                    platform_activities_id: this.product.platform_activities_id,
                    frompage: this.product.frompage, //开团还是参团
                    sizeid: this.product.cid, //商品规格id
                    address_id: this.address_id,//地址id 
                    type: 'PT',
                    //java版本不合并 product 参数
                    product:JSON.stringify(this.product),
                }
                if (this.product.frompage === 'cantuan') {
                    postData.ptcode = this.product.ptcode
                } else {
                    postData.ptcode = ''
                }
                
                let { pay_type } = this.getPayTypeAndStoreType()
                postData.pay_type = pay_type
                let res = await this.$req.post({ data: postData })
                let {
                    order,
                    order_id,
                    total,
                    code,
                    msg
                } = res.data
                if (code == 500) {
                    uni.showToast({
                        title: msg,
                        duration: 1500,
                        icon: 'none'
                    })
                    return Promise.reject()
                }
                this.sNo = order
                this.order_id = order_id
                this.order_pay_info = JSON.stringify({
                    order_id: order_id,
                    sNo: order,
                    total: total
                })  
            },
            /**
             * 点击立即支付按钮触发
             * @returns {Promise<boolean>}
             */
            async order_pay () {
                if (!this.address_id) {
                    return uni.showToast({
                        title: this.language.groupPayfor.setAddsTips,
                        icon: 'none'
                    })
                }
                if (this.fastTap) return false
                this.fastTap = true
                this._checkSelectPayWay()

                if (Number(this.pro.have) >= Number(this.groupres.groupnum)) {
                    uni.showToast({
                        title: this.language.groupPayfor.goupTips1 + this.groupres.groupnum + this.language.groupPayfor.goupTips2,
                        duration: 1000,
                        icon: 'none'
                    })
                    return false
                }
                

                // #ifdef MP-WEIXIN
                uni.showLoading({
                    title: this.language.showLoading.waiting
                })
                wx.requestSubscribeMessage({
                    tmplIds: this.tmplIds,
                    complete:async () => {
                        uni.hideLoading()
                        if (this.useWallet) {
                            if (this.password_status == 0) {
                                uni.showModal({
                                    title: this.language.showModal.hint,
                                    content: this.language.showModal.mima,
									confirmText: this.language.showModal.confirm,
									cancelText: this.language.showModal.cancel,
                                    showCancel: true,
                                    success: (resM) =>  {
                                        this.fastTap = true
                                        if (resM.confirm) {
                                            uni.navigateTo({
                                                url: '/pagesB/setUp/payment'
                                            })
                                        }
                                    }
                                })
                                return false;
                            }
                            
                            if (!this.sNo) {
                                await this._getPayOrderInfo()
                            }
                            this._orderUseWalletPay()
                        } else {
                            uni.showLoading({
                                title: this.language.showLoading.axiospaying,
                                mask: true,
                            })
                            await this._getPayOrderInfo()
                            this._notUserWalletPay()
                        }
                    }
                })
                // #endif

                // #ifndef MP-WEIXIN
                if (this.useWallet) {
                    if (this.password_status == 0) {
                        uni.showModal({
                            title: this.language.showModal.hint,
                            content: this.language.showModal.mima,
							confirmText: this.language.showModal.confirm,
							cancelText: this.language.showModal.cancel,
                            showCancel: true,
                            success: (resM) =>  {
                                this.fastTap = true
                                if (resM.confirm) {
                                    uni.navigateTo({
                                        url: '/pagesB/setUp/payment'
                                    })
                                }
                            }
                        })
                        return false;
                    }
                    
                    if (!this.sNo) {
                        await this._getPayOrderInfo()
                    }
                    this._orderUseWalletPay()
                } else {
                    uni.showLoading({
                        title: this.language.showLoading.axiospaying,
                        mask: true,
                    })
                    await this._getPayOrderInfo()
                    this._notUserWalletPay()
                }
                // #endif

            },
            _axios () {
                let action = 'groupbuy';
                if (this.a_type == 1) {
                    action = 'pthd_groupbuy';
                }
                var data = {
                    module: 'app',
                    action: action,
                    m: 'payfor',
                    address_id: this.address_id,
                    price: this.total,
                    //java版本不合并 product 参数
                    product:this.cpId,
                    type:'PT',
                }
                var product = JSON.parse(this.cpId)
                data = Object.assign(data, product) //合并

                this.$req.post({data}).then(res => {

                    res = res.data
                    // 报错库存不足的时候 status = 1, 其他的时候会返回 code 不等于 200 的值
                    if (res.status == 0 || (res.hasOwnProperty('code') && res.code != 200) ) {
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
                    
                    let {grade_rate,products_total} = res
                    this.adds_f = res.is_add
                    this.address = res.buymsg

                    if (this.address && this.address.id) {
                        this.address_id = this.address.id
                    }
                    
                    this.groupres = res.groupres
                    this.mch_name = res.mch_data.name
                    this.mch_id = res.mch_data.id
                    this.payment = res.payment
                    this.pro = res.proattr
                    this.payTitle = this.pro.pro_name
                    console.log('this.pro')
                    console.log(this.pro)
                    if (this.$store.state.address_id_def == '') {
                        console.log('默认赋值')
                        this.$store.state.address_id_def = res.buymsg.id
                    }

                    this.grade_rate = res.grade_rate
                    this.user_money = Number.parseFloat(res.money)
                    this.user_name = res.user_name
                    this.product = product
                    this.num = product.num
                    // this.price = product.price
                    this.price = (product.price*product.num).toFixed(2)
                    this.groupman = product.groupnum
                    this.password_status = res.password_status
                    this.products_total = this.price
                    
                    this.is_grade = (grade_rate>0&&grade_rate<1)?true:false
                    
                    // 运费赋值留到最后，计算价格是放在运费的监听函数里
                    this.freightt = parseFloat(res.yunfei).toFixed(2)
                    this.freight = res.yunfei
                    this.load = true
                    this.show_pay_way()
                })
            },
            formatDecimal(num, decimal) {
                num = num.toString()
                let index = num.indexOf('.')
                if (index !== -1) {
                    num = num.substring(0, decimal + index + 1)
                } else {
                    num = num.substring(0)
                }
                return parseFloat(num).toFixed(decimal)
            }
        },
        components: {
            wxParse,
            paymodel,
            choosePay,
            chooseAddress,
            submitOrder
        }
    }
</script>

<style  lang="less" scoped>
    @import url("../../static/css/pay/orderDetailsr.less");
    .grouppeo {
        width: 90rpx;
        height: 30rpx;
        border: 2rpx #030303 solid;
        color: #333;
        margin-left: 20rpx;
        text-align: center;
        line-height: 130%;
        border-radius: 8rpx;
        font-size: 13px;
        font-weight: 400 !important;
    }
    .yh-discount{
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }
    .goods_huiyuan{
        display: flex;
        align-items: center;
    }
    .goods_huiyuan span:nth-child(1){
        font-size: 26rpx;
        font-weight: bold;
    }
    
</style>
