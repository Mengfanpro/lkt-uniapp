import pay from './pay'
import bargain from './bargain'
import seckill from './seckill'
import bidding from './bidding'


export default {
    mixins: [pay,bargain, seckill, bidding],
    data () {
        return {
            // 支付方式
            // 订单信息
            total: 0, // 订单总价, 计算方式， （商品总价 + 满减优惠 + 优惠券金额 ） * 分销折扣 * 等级折扣  + 运费
            products_total: 0, // 产品总价
            freight: 0, // 订单运费
            freightt: '0', // 订单运费显示的价格，是字符串类型
            coupon_money: 0, //优惠券金额
            reduce_money: 0, // 砍价金额
            discount: 1, // 分享折扣
            grade_rate: 1, // 会员等级折扣
            sNo: '', //订单编号

            // 用户相关信息
            user_money: 0, // 用户余额

            fastTap: false, // 防止重复点击

            buy_again: false,//是否为再次购买 true 是  false 否

            order_pay_info: null, // 订单json格式化后的订单信息 order_id, sNo,total

            order_type: 'type_',

            pay_name: '', // pt 普通商品,jp 竞拍商品
            
            // 地址
            is_express: true, // 地址是否快递
            shop_status: false,
            shop_address_id: '',
            shop_list: {
                address: '',
                id: 0,
                mobile: '',
                name: ''
            },
            address_id: '',
            hc_address_id: '',
            address: {
                name: ''
            },
            adds_f: false, //地址状态
            remarks: '',
            pwd:'',
            
            a_type:'',//是否平台活动管理
        }
    },
    computed: {
        shop_id () {
            if (Array.isArray(this.pro) && this.pro.length > 0) {
                return this.pro[0].shop_id
            } else {
                return 0;
            }
        }
    },
    beforeDestroy () {
        uni.removeStorageSync('goodsInfo')
        uni.removeStorageSync('bargain')
        // this.$store.state.cart_id = ''
        if (!this.bargain && this.pay_name !== 'jp') {
            
            if (this.sNo && this.order_id) {
                let order_list = JSON.stringify({
                    total: Number.parseFloat(this.total),
                    order_id: this.order_id,
                    sNo: this.sNo
                })
                console.log(this.returnR);
                let data = {
                    module: 'app',
                    // app: 'leave_Settlement',
                    // groupbuy,
                    action: 'order',
                    order_list: order_list,
                    price: this.total
                }
                if(this.a_type==1 && this.returnR==1){
                    data.action = 'pthd_groupbuy'
                    data.m = 'goGroupLeaveSettlement'
                }else if(this.returnR==1 && !this.cs){
                    data.action = 'groupbuy'
                    data.m = 'goGroupLeaveSettlement'
                }else{
                    data.app = 'leave_Settlement'
                }
                
                //离开界面的时候去生成订单
                this.$req.post({ data })

                if (this.buy_again) {
                    let data = {
                        module: 'app',
                        app: 'del_cart',
                        action: 'order',
                        cart_id: this.cart_id
                    }
                    this.$req.post({ data })
                }
            }
        }
        this.$store.state.order_id = ''
    },
    destroyed () {
        if (uni.getStorageSync('chooseAddress')) {
            uni.removeStorageSync('chooseAddress')
        }
    },
    watch: {
        address_id (n, o) {
            if (o) {
                this._axios('address')
            }
        }
    },
    methods: {
        getCode () {
            // #ifdef H5 
            // H5打开微信支付
            let a = window.location.href
            console.log('获取code')
            if (a.split('?').length > 1) {
                let str = a.split('?')[1]
                let arr = str.split('&')
                for (let i in arr) {
                    if (typeof arr[i] === 'string') {
                        if (arr[i].substring(0, 4) === 'code') {
                            str = arr[i].substring(5)
                            this.code = str
                        }
                    }
                }
            }
            // #endif  
        },
        checkCode() {
            // #ifdef H5
            if (this.code === '') {
                if (!this.is_wx()) {
                    console.log('不在微信浏览器里面不校验code')
                    return false;
                }
                let storage = window.localStorage
                storage.removeItem('bargain')
                storage.removeItem('bargain_id')
                storage.removeItem('order_no')
                storage.removeItem('product')
                uni.removeStorageSync('bargain');
                uni.removeStorageSync('commodity_type');
                this._toUrl()
            }else{
                this.commodity_type = uni.getStorageSync('commodity_type');
            }
            // #endif
        },
        is_wx () {
            let en = window.navigator.userAgent.toLowerCase()
            // 匹配en中是否含有MicroMessenger字符串
            return en.match(/MicroMessenger/i) == 'micromessenger'
        },
        /**
         * 点击立即支付按钮触发
         * @returns {Promise<boolean>}
         */
        async order_pay () {
            if (this.commodity_type != 1 && !this.address_id) {
                return uni.showToast({
                    title: this.language.toasts.order.setAdds,
                    icon: 'none'
                })
            }
            
            if (this.fastTap) return false
            this.fastTap = true

            this._checkSelectPayWay()

            // #ifdef MP-WEIXIN
            wx.requestSubscribeMessage({
                tmplIds: this.tmplIds,
                complete:async () => {
                    uni.showLoading({
                        title: this.language.showLoading.waiting
                    })
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
                                    this.fastTap = false
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
                        await this._notUserWalletPay()
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
                            this.fastTap = false
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
                // uni.showLoading({
                //     title: this.language.showLoading.axiospaying,
                //     mask: true,
                // })
                await this._getPayOrderInfo()
                await this._notUserWalletPay()
            }
            // #endif

        },
        async order_pay2 () {
            this._checkSelectPayWay()
            // #ifdef MP-WEIXIN
            wx.requestSubscribeMessage({
                tmplIds: this.tmplIds,
                complete:async () => {
                    uni.showLoading({
                        title: this.language.showLoading.waiting
                    })
                    uni.hideLoading()
                    uni.hideLoading()
                    console.log(this.useWallet)
                    if (this.useWallet) {
                        if (this.password_status == false) {
                            uni.showModal({
                                title: this.language.showModal.hint,
                                content: this.language.showModal.mima,
        						confirmText: this.language.showModal.confirm,
        						cancelText: this.language.showModal.cancel,
                                showCancel: true,
                                success: (resM) =>  {
                                    this.fastTap = false
                                    if (resM.confirm) {
                                        uni.navigateTo({
                                            url: '/pagesB/setUp/payment'
                                        })
                                    }
                                }
                            })
                            return false;
                        }
                        
                        if (this.pwd != '') {
                            await this._getPayOrderInfo2()
                        }
                        this._orderUseWalletPay()
                        
                    } else {
                        uni.showLoading({
                            title: this.language.showLoading.axiospaying,
                            mask: true,
                        })
                        await this._getPayOrderInfo2()
                        await this._notUserWalletPay()
                    }
                }
            })
            // #endif
        
            // #ifndef MP-WEIXIN
        	console.log(this.password_status,222)
            if (this.useWallet) {
                if (this.password_status == 0) {
                    
                    uni.showModal({
                        title: this.language.showModal.hint,
                        content: this.language.showModal.mima,
        				confirmText: this.language.showModal.confirm,
        				cancelText: this.language.showModal.cancel,
                        showCancel: true,
                        success: (resM) =>  {
                            this.fastTap = false
                            if (resM.confirm) {
                                uni.navigateTo({
                                    url: '/pagesB/setUp/payment'
                                })
                            }
                        }
                    })
                    return false;
                }
                
                if (this.pwd != '') {
                    await this._getPayOrderInfo2()
                }
                this._orderUseWalletPay()
            } else {
                uni.showLoading({
                    title: this.language.showLoading.axiospaying,
                    mask: true,
                })
                await this._getPayOrderInfo2()
                await this._notUserWalletPay()
            }
            // #endif
        
        },
        async _getPayOrderInfo2 () {
            let remarks = this.remarks
            if(typeof remarks != 'string'){
                if( remarks&& remarks !="" && remarks.length > 0 ){
                    remarks = JSON.stringify(remarks)
                }
                
            }
            console.log(89898989898)
            
            let postData = {
                module: 'mch',
                action: 'promise',
                app: 'payment',
                mch_id: uni.getStorageSync('mch_id'),
                money: this.margin,
                pwd: this.pay_password
            }
        
            if (this.buy_again) {
                postData.buy_type = 1;
            }
            
            if (this.bargain) {
                postData = this.getBargainPayOrderInfo()
            } else if (this.seckill) {
                postData = this.getSeckillPayOrderInfo()
            } else if (this.pay_name == 'jp') {
                postData = this.getJPPayOrderInfo()
            } else if (this.is_distribution == 1) {
                postData.type = 'FX'
            }
            uni.setStorageSync('payType',1)
            if (this.cpId) {
                postData.product = this.cpId
                postData.cart_id = ''
            }
        
            if (!this.is_express) {
                postData.shop_address_id = this.shop_address_id
            }
        
            let { pay_type } = this.getPayTypeAndStoreType()
            
            postData.payType = pay_type || 'wallet_pay'
            
            let {
                data,
                code,
                message,
                status
            } = await this.$req.post({ data: postData })
            
            if (code == 200) {
                console.log(data)
                // uni.showToast({
                //     title: message,
                //     duration: 1500,
                //     icon: 'none'
                // })
                this.sNo = data.orderNo;
                this.order_id = data.orderId;
                this.$store.state.order_id = data.orderNo;
                this.order_pay_info = JSON.stringify({ 
                    total:data.total,
                    sNo: data.orderNo,
                    order_id: data.orderId
                })
                setTimeout(()=>{
                    console.log(this.payResult)
                    if(this.payResult != '支付失败') {
                        uni.redirectTo({
                            url: '/pagesC/bond/success?str=true'
                        })
                    }
                },2000)
            }else if(code == 999){
                uni.showToast({
                    title: message,
                    duration: 1500,
                    icon: 'none'
                })
                 return Promise.reject()
            } else {
                uni.showToast({
                    title: message,
                    duration: 1500,
                    icon: 'none'
                })
                this.pay_display = false
                setTimeout(() => {
                    this.navBack()
                }, 1500)
                return Promise.reject()
            }
        },
        /**
         * 取得请求支付所需的 pay_order_info
         * @returns {Promise<void>}
         * @private
         */
        async _getPayOrderInfo () {
            let remarks = this.remarks
            
            if(typeof remarks != 'string'){
                if( remarks&& remarks !="" && remarks.length > 0 ){
                    remarks = JSON.stringify(remarks)
                }
                
            }
            
            let postData = {
                module: 'app',
                action: 'order',
                app: 'payment',
                cart_id: this.cart_id,
                address_id: this.address_id,
                coupon_id: this.coupon_id,
                remarks: remarks,
            }
            
            if(this.commodity_type == 1){
            	postData.type = 'VI';
            }

            if (this.buy_again) {
                postData.buy_type = 1;
            }
            
            if (this.bargain) {
                postData = this.getBargainPayOrderInfo()
            } else if (this.seckill) {
                postData = this.getSeckillPayOrderInfo()
            } else if (this.integral) {
                postData = this.getIntegralPayOrderInfo()
            } else if (this.pay_name == 'jp') {
                postData = this.getJPPayOrderInfo()
            } else if (this.is_distribution == 1) {
                postData.type = 'FX'
                console.log(uni.getStorageSync('fatherId'))
                if(uni.getStorageSync('fatherId')) {
                    postData.fatherId = uni.getStorageSync('fatherId')
                }
            }

            if (this.cpId) {
                postData.product = this.cpId
                postData.cart_id = ''
            }

            if (!this.is_express) {
                postData.shop_address_id = this.shop_address_id
            }

            let { pay_type } = this.getPayTypeAndStoreType()
            postData.pay_type = pay_type

            let {
                data,
                code,
                message,
                status
            } = await this.$req.post({ data: postData })
            if (code == 200 || status  == 1) {
                this.sNo = data.sNo;
                this.order_id = data.order_id;
                this.$store.state.order_id = data.order_id;
                this.order_pay_info = JSON.stringify({ ...data })
            } else {
                uni.showToast({
                    title: message,
                    duration: 1500,
                    icon: 'none'
                })
                this.pay_display = false
                setTimeout(() => {
                    this.navBack()
                }, 1500)
                return Promise.reject()
            }
        },
        async _notUserWalletPay () {
            if (this.wxPayStatue) {
                this.pay_type = 'wx'
            } else if (this.aliPayStatue) {
                this.pay_type = 'ali'
            } else if (this.baidupayStatue) {
                this.pay_type = 'baidu'
            }
            await this.clientTransferPay()
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
                remarks: this.remarks,
                sNo: this.sNo,
                title: this.payTitle,
                order_list: this.order_pay_info ? this.order_pay_info : ''
            }
            let { type, code, store_type } = await this.getOrderInfoExt()
            data.type = type
            data.payType = type
            data.code = code

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
         * 显示钱包余额支付的密码输入框
         * @returns {boolean}
         * @private
         */
        _orderUseWalletPay () {
            if (this.total > this.user_money) {
                uni.showToast({
                    title: this.payTitle && this.payTitle == '保证金' ? '余额不足以支付保证金' : this.language.toasts.order.moneyMin,
                    icon: 'none',
                    duration: 1500
                })
                this.fastTap = false
                return false
            }
            this.pay_display = true
        },
        /**
         * 检测
         * @private
         */
        _checkSelectPayWay () {
            if (!this.useWallet && !this.wxPayStatue && !this.aliPayStatue && !this.baidupayStatue) {
                uni.showToast({
                    title: this.language.toasts.order.choosePay,
                    duration: 1000,
                    icon: 'none'
                })
            }
            this.fastTap = false
        },
        /**
         * 微信JSAPI支付获取code值
         */
        _toUrl () {
            let locationUrl = window.location.href
            var storage = window.localStorage;
            storage['bindding_num'] = this.bind_id
            console.log('tourl时的bindding_num', this.bind_id)
            storage['address_id'] = this.address_id
            console.log('tourl时的cart_id', this.cart_id)
            // storage['cart_id'] = this.cart_id
            if(this.commodity_type){
                uni.setStorageSync('commodity_type',this.commodity_type)
            }
            
            // 拼团 
            storage['product'] = this.cpId
            
            let data = {
                type: 'jsapi_wechat',
                app: 'get_config',
                module: 'app',
                action: 'order',
                url: locationUrl
            }
            
            console.log(-9999)

            this.$req.post({data}).then(res => {
                if (res.code == 200) {
                    let myappid = res.data.config.appid
                    this.myappid = myappid
                    let myUrl = res.data.url
                    window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + myappid +
                        '&redirect_uri=' + myUrl +
                        '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'
                } else {
                    uni.showToast({
                        title: res.message,
                        duration: 1500,
                        icon: 'none'
                    })
                }
            })
        },
        /**
         * 页面显示时触发。由于加了微信地址获取，改成获取并新增以后再触发一次
         */
        show () {
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
        handleOrderAddress (address, shop_list, shop_status) {
            if (shop_status && shop_list) {
                this.shop_status = shop_status


                if (Array.isArray(shop_list)) {
                    this.shop_address_id = ''
                    uni.setStorageSync('shop_address_id', '')
                } else {
                    this.shop_list = shop_list
                    this.shop_address_id = shop_list.id
                    uni.setStorageSync('shop_address_id', shop_list.id)
                    console.log(this.shop_list);
                }
            }

            if (Array.isArray(address)) {
                address = {
                    name: ''
                }
                this.shop_status = false;
                this.shop_address = {
                    id: 0
                }
                this.address_status = false;
                this.shop_list = {
                    address: '',
                    id: 0,
                    mobile: '',
                    name: ''
                }
            }
            this.address = address

            if (this.address && this.address.id) {
                this.address_id = this.address.id
            } else {
                this.address_id = '';
            }

            if (this.address.name) {
                this.adds_f = this.address.length !== 0
            } else {
                this.adds_f = false;
            }
            if (this.address.name) {
                if (!this.$store.state.address_id_def) {
                    this.$store.state.address_id_def = address.id
                }
            }
        }
    },
}
