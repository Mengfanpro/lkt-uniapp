<template>
    <div class="box">
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <heads :title="language.recharge.title"></heads>
        <div class="recharge_ts">{{language.recharge.prompt}}</div>
        <div class="recharge_money">
            <span class="span">{{language.recharge.money}}</span>
            <input placeholder-style="color: #b8b8b8;font-size:28rpx" type="digit" min="0.01" maxlength="9" :value="price" :placeholder="rechargeTitle" @blur="_money" @input="_checkValue" />
        </div>
        <ul class="choose_ul">
            <li class="pay">{{language.recharge.paymentStyle}}</li>

            <!-- #ifdef APP-PLUS -->
            <li class="pay" @tap="_pay(0)" v-if="open_alipay">
                <div class="pay_div">
                    <img class="pay_img" :src="pay_zhifub" />
                    <p>{{language.recharge.alipay}}</p>
                </div>
                <img class="quan_img" :src="pay_index == 0 ? quan_hei : quan_hui" />
            </li>

            <li class="pay" @tap="_pay(1)" v-if="open_wxpay">
                <div class="pay_div">
                    <img class="pay_img" :src="pay_weix" />
                    <p>{{language.recharge.weChat}}</p>
                </div>
                <img class="quan_img" :src="pay_index == 1 ? quan_hei : quan_hui" />
            </li>
            <!-- #endif -->

            <!-- #ifdef MP-WEIXIN || H5-->
            <li class="pay" @tap="_pay(3)" v-if="open_wxpay == true">
                <div class="pay_div">
                    <img class="pay_img" :src="pay[1].img" />
                    <p>{{language.recharge.weChat}}</p>
                </div>
                <img class="quan_img" :src="quan_hei" />
            </li>
            <!-- #endif -->

            <!-- #ifdef MP-ALIPAY || MP-TOUTIAO -->
            <li class="pay" @tap="_pay(0)" v-if="open_alipay">
                <div class="pay_div">
                    <img class="pay_img" :src="pay[0].img" />
                    <p>{{language.recharge.alipay}}</p>
                </div>
                <img class="quan_img" :src="quan_hei" />
            </li>
            <!-- #endif -->

            <!-- #ifdef MP-BAIDU -->
            <li class="pay" @tap="_pay(2)" v-if="payment.baidu_pay == 1">
                <div class="pay_div">
                    <img class="pay_img" :src="pay_bd" />
                    <p>{{language.recharge.baiduPay}}</p>
                </div>
                <img class="quan_img" :src="quan_hei" />
            </li>
            <!-- #endif -->
        </ul>
        <div :class="price > 0 ? 'setup-buttom':'setup-buttom1'" @tap="pay1()">{{language.recharge.btn}}</div>
    </div>
</template>

<script>
    import heads from '../../components/header.vue';
    import mixinsOrder from '../../mixins/order'
    
    export default {
        data() {
            return {
                open_alipay: false,
                open_wxpay: false,
                title: '充值',
                pay_y: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/yuezhifu2x.png',
                pay_b: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/lALPBb.png',
                quan_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/xuanzehui2x.png',
                quan_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/xuanzehei2x.png',
                pay_bd: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/baiduzhifu2x.png',
                pay_zhifub: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/zhifubaozhifu2x.png',
                pay_weix: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/weixinzhifu2x.png',
            pay: [
                { img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/zhifubaozhifu2x.png', name: '支付宝' },
                { img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/weixinzhifu2x.png', name: '微信支付' }
                ], //支付方式
                pay_index: -1,
                pay_style: '', //支付方式
                price: '',
                enterPay: false,
            
                fastTap: true,
                pay_provider: '',
                aliPayStatue: false,
                wxPayStatue: false,
                order_list: '',
                code: '',
                firstFlag: true,
                value_inp: '',
                min_amount: '', //最小充值金额
                rechargeTitle: '',
                back1: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/back2x.png',
                payment: {}
            };
        },
        mounted() {
            this.isLogin(() => {
                this._pay(1);
                // #ifdef H5
                this._pay(1);
                // #endif
                // #ifdef MP-BAIDU
                this._pay(2);
                // #endif
                this._axios();
            })
        },
        onShow() {
            // #ifdef H5
            let iswx = this.is_wx();
            if(!iswx){
                return;
            }
            var a = window.location.href;

            if (a.split('?').length > 1) {
                var str = a.split('?')[1];
                var arr = str.split('&');
                for (var i in arr) {
                    if (typeof arr[i] == 'String' || typeof arr[i] == 'string') {
                        if (arr[i].substring(0, 4) == 'code') {
                            str = arr[i].substring(5);
                            this.code = str;
                        }
                    }
                }
            }

            if (this.code == '') {
                this.toUrl();
            }
            // #endif
        },
        watch: {
            price: function(newValue, oldValue) {
                this.$nextTick(() => {
                    if (newValue > 0.01) {
                        if (Math.abs(newValue - oldValue) == 0) {
                            this.enterPay = true;
                            let num = Number(newValue);
                            if (isNaN(num)) {
                                this.price = '0';
                            } else {
                                this.price = num;
                            }
                        } else if (Math.abs(newValue - oldValue) < 0.01) {
                            this.enterPay = true;
                            let num = Number(newValue).toFixed(2);
                            if (isNaN(num)) {
                                this.price = '0';
                            } else {
                                this.price = num;
                            }
                        } else {
                            this.enterPay = true;
                            let num = Number(newValue);
                            if (isNaN(num)) {
                                this.price = '0';
                            } else {
                                this.price = num;
                            }
                        }
                    } else {
                        // 不可以提交
                        this.enterPay = false;
                    }
                });
            }
        },
        methods: {
            is_wx () {
                let en = window.navigator.userAgent.toLowerCase()
                // 匹配en中是否含有MicroMessenger字符串
                return en.match(/MicroMessenger/i) == 'micromessenger'
            },
            /**
             * 支付方式显示判断
             * */
            isPayShow: function() {
                // #ifdef H5
                let iswx = this.is_wx();
                    
                if(iswx){
                    if (this.payment.jsapi_wechat == 1) {
                        this.open_wxpay = true;
                    }
                }else{
                    if (this.payment.H5_wechat == 1) {
                        this.open_wxpay = true;
                    }
                }
                
                // #endif

                // #ifdef MP-WEIXIN
                if (this.payment.mini_wechat == 1) {
                    this.open_wxpay = true;
                }
                // #endif

                // #ifdef APP-PLUS
                if (this.payment.app_wechat == 1) {
                    this.open_wxpay = true;
                }
                if (this.payment.alipay == 1) {
                    this.open_alipay = true;
                }
                // #endif

                // #ifdef MP-ALIPAY
                if (this.payment.alipay_minipay == 1) {
                    this.open_alipay = true;
                }
                // #endif

                // #ifdef MP-TOUTIAO
                if (this.payment.tt_alipay == 1) {
                    this.open_alipay = true;
                }
                // #endif
            },
            changeLoginStatus() {
                this._axios();
            },
            _back() {
                uni.navigateBack({
                    delta: 1
                });
            },
            _axios() {
                var data = {
                    module: 'app',
                    action: 'recharge',
                    app: 'index',
                
                };

                this.$req.post({
                    data
                }).then(res => {
                    let {
                        data: {
                            min_cz,
                            payment
                        }
                    } = res;
                    if (res.code == 200) {
                        this.min_amount = min_cz;
                        this.payment = payment;

                        this.rechargeTitle = this.language.recharge.money_placeholder + ' ' + this.min_amount;

                        this.isPayShow();
                    }
                });
            },
            _money(e) {
                this.price = Number(e.detail.value);
                var monrys = Number(this.min_amount);
                if (this.price < monrys) {
                    this.price = '';
                    uni.showToast({
                        title: `${this.language.recharge.toasts[0]} ${monrys} ${this.language.recharge.toasts[1]}`,
                        duration: 1500,
                        icon: 'none'
                    });
                }
                this.fastTap = true;
            },
            toUrl() {
                var locationUrl = window.location.href;
                var data = {
                    type: 'jsapi_wechat',
                    app: 'get_config',
                    module: 'app',
                    action: 'order',
                    url: locationUrl
                };

                this.$req.post({
                    data
                }).then(res => {
                    if (res.code == 200) {
                        var myappid = res.data.config.appid;
                        this.myappid = myappid;
                        var myUrl = res.data.url;
                        
                        
                        var url =
                            'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
                            myappid +
                            '&redirect_uri=' +
                            myUrl +
                            '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect';
                        console.log("地址："+url);
                        window.location.href = url;
                    } else {
                        uni.showToast({
                            title: res.message,
                            duration: 1500,
                            icon: 'none'
                        });
                    }
                });
            },
            _checkValue(e) {
                this.price = Number(e.detail.value);
                var monrys = Number(this.min_amount);
                if (this.price < monrys) {
                    this.fastTap = false;
                } else {
                    this.fastTap = true;
                }
            },
            pay1() {
                //是否可虚拟支付
                let flag = this.LaiKeTuiCommon.ttIOSCantVisualpay();
                if (!flag) {
                    return;
                }

                if (!this.fastTap) {
                    return;
                }
                this.fastTap = false;
                this.firstFlag = false;
                //是否输入了金额
                if (this.price == '') {
                    uni.showToast({
                        title: this.language.recharge.toasts[2],
                        duration: 1000,
                        icon: 'none'
                    });
                    this.fastTap = true;
                    this.firstFlag = true;
                    return;
                }

                uni.showLoading({
                    title: this.language.showLoading.axiospaying,
                    mask: true
                });
                // #ifdef MP-WEIXIN
                this.weixinPay();
                // #endif
                // #ifndef MP-ALIPAY || MP-WEIXIN || MP-TOUTIAO
                this.pay_wx();
                // #endif
                // #ifdef MP-ALIPAY
                this.alipay_minipay();
                // #endif
                // #ifdef MP-TOUTIAO
                this.tt_pay();
                // #endif
                // #ifdef MP-BAIDU
                this.baidu_pay();
                // #endif
            },
            //百度小程序支付
            baidu_pay() {
                // #ifdef MP-BAIDU
                this.getOrderInfo('baidu_pay').then(orderInfo => {
                    uni.hideLoading();
                    this.laikepay.baidu_pay(this, orderInfo);
                });
                // #endif
            },

            //头条小程序支付
            tt_pay() {
                // #ifdef MP-TOUTIAO
                this.getOrderInfo('tt_alipay').then(orderInfo => {
                    uni.hideLoading();
                    this.laikepay.tt_pay(this, orderInfo);
                });
                // #endif
            },

            getOrderInfo(pay_type) {
                if (!pay_type) {
                    uni.showToast({
                        title: this.language.recharge.toasts[3],
                        duration: 1000,
                        icon: 'none'
                    });
                    this.firstFlag = true;
                    return;
                }

                let time = new Date().getTime();
                let data = {
                    access_id: this.access_id,
                    order_list: this.order_list,
                    sNo: this.getCZNo(),
                    title: '充值',
                    module: 'app',
                    action: 'pay',
                    type: pay_type,
                    total: this.price
                };

                uni.hideLoading();

                // #ifdef H5
                data.code = this.code;
                // #endif

                let p = this.LaiKeTuiCommon.getMPAliAuthCode();
                return p.then(authcode => {
                    if (authcode) {
                        // #ifdef MP-ALIPAY
                        data.alimp_authcode = authcode;
                        // #endif
                        // #ifdef MP-TOUTIAO
                        data.tt_authcode = authcode;
                        // #endif
                    }
                    return new Promise((laikeOK, fail) => {
                        console.log(uni.getStorageSync('url'));
                        console.log(JSON.stringify(data, null, 4));
                        uni.request({
                            url: uni.getStorageSync('url'),
                            data,
                            success: result => {
                                console.log(result);
                                if (result.statusCode == 200) {
                                    // #ifndef MP-ALIPAY
                                    laikeOK(result.data);
                                    // #endif
                                    // #ifdef MP-ALIPAY
                                    let tno = result.data;
                                    laikeOK(tno.substr(1, tno.length));
                                    // #endif
                                }
                            },
                            fail: e => {
                                console.log(e);
                                // #ifdef MP-ALIPAY
                                let tno = e.data;
                                if (tno.length > 28) {
                                    laikeOK(tno.substr(tno.indexOf('s') + 1, tno.length -
                                        4));
                                } else {
                                    this._payFail();
                                }
                                // #endif
                            }
                        });
                    });
                });
            },

            //获取充值订单号
            getCZNo() {
                let time = new Date().getTime();
                return (
                    'CZ' +
                    time +
                    Math.floor(Math.random() * 10) +
                    Math.floor(Math.random() * 10) +
                    Math.floor(Math.random() * 10) +
                    Math.floor(Math.random() * 10) +
                    Math.floor(Math.random() * 10) +
                    Math.floor(Math.random() * 10)
                );
            },
            //支付宝小程序支付
            alipay_minipay() {
                // #ifdef MP-ALIPAY
                this.getOrderInfo('alipay_minipay').then(trade_no => {
                    my.tradePay({
                        tradeNO: trade_no,
                        success: res => {
                            if (res.resultCode == 9000) {
                                uni.showToast({
                                    title: this.language.recharge.toasts[4],
                                    icon: 'none'
                                });
                                this.rechargeSuccess('alipay');
                            } else if (res.resultCode == 6001) {
                                setTimeout(() => {
                                    this._payFail();
                                }, 1000);
                            }
                        },
                        fail: res => {
                            uni.showToast({
                                title: res.memo,
                                icon: 'none'
                            });
                            setTimeout(() => {
                                this._payFail();
                            }, 1000);
                        }
                    });
                });
                // #endif
            },
            rechargeSuccess(paytype) {
                setTimeout(() => {
                    uni.redirectTo({
                        url: 'rechargeSuccess?mylei=1&money=' + this.price + '&_type=' + paytype
                    });
                }, 1000);
            },
            //微信小程序充值
            weixinPay() {
                var me = this;
                this.loading = true;
                uni.login({
                    provider: 'weixin',
                    success: e => {
                        var pay_type = 'mini_wechat';
                        let data = {
                            code: e.code,
                            access_id: me.access_id,
                            sNo: me.getCZNo(),
                            title: '充值',
                            module: 'app',
                            action: 'pay',
                            type: pay_type,
                            total: me.price
                        };
                        uni.request({
                            url: uni.getStorageSync('url'),
                            data,
                            success: res => {
                                if (res.statusCode !== 200) {
                                    uni.showModal({
                                        title: me.language.recharge.hint,
                                        content: me.language.recharge.modalTips[0],
                                        confirmText: me.language.showModal.confirm,
                                        cancelText: me.language.showModal.cancel,
                                        success: function(res) {
                                            me.fastTap = true;
                                        }
                                    });
                                } else if (res.statusCode == 200) {
                                    let paymentData = res.data.data;
                                    console.log(paymentData);
                                    uni.requestPayment({
                                        provider: 'wxpay',
                                        timeStamp: paymentData.timeStamp,
                                        nonceStr: paymentData.nonceStr,
                                        package: paymentData.package,
                                        signType: 'MD5',
                                        paySign: paymentData.paySign,
                                        success: res => {
                                            uni.showToast({
                                                title: me.language.recharge
                                                    .toasts[5],
                                                duration: 1000,
                                                icon: 'none'
                                            });
                                            setTimeout(function() {
                                                uni.redirectTo({
                                                    url: 'rechargeSuccess?mylei=1&type=wx&_type=wx&money=' +
                                                        me.price
                                                });
                                            }, 1000);
                                            uni.hideLoading();
                                        },
                                        fail: res => {
                                            console.log(res)
                                            uni.showModal({
                                                title: me.language.recharge
                                                    .hint,
                                                content: me.language
                                                    .recharge.modalTips[0],
                                                confirmText: me.language
                                                    .showModal.confirm,
                                                cancelText: me.language
                                                    .showModal.cancel,
                                                success: function(res) {
                                                    me.fastTap = true;
                                                }
                                            });
                                            uni.hideLoading();
                                        }
                                    });
                                } else {
                                    uni.showModal({
                                        title: me.language.recharge.hint,
                                        content: me.language.recharge.modalTips[0],
                                        confirmText: me.language.showModal.confirm,
                                        cancelText: me.language.showModal.cancel,
                                        success: function(res) {
                                            me.fastTap = true;
                                        }
                                    });
                                    uni.hideLoading();
                                }
                            },
                            fail: e => {
                                this.loading = false;
                                uni.showModal({
                                    title: me.language.recharge.hint,
                                    content: me.language.recharge.modalTips[0],
                                    confirmText: me.language.showModal.confirm,
                                    cancelText: me.language.showModal.cancel,
                                    success: function(res) {
                                        me.fastTap = true;
                                    }
                                });
                                uni.hideLoading();
                            }
                        });
                    },
                    fail: e => {
                        this.loading = false;
                        uni.showModal({
                            title: me.language.recharge.hint,
                            content: me.language.recharge.modalTips[0],
                            confirmText: me.language.showModal.confirm,
                            cancelText: me.language.showModal.cancel,
                            success: function(res) {
                                me.fastTap = true;
                            }
                        });
                        uni.hideLoading();
                    }
                });
            },
            ///支付失败
            _payFail() {
                uni.showModal({
                    title: this.language.recharge.hint,
                    content: this.language.recharge.modalTips[1],
                    confirmText: this.language.showModal.confirm,
                    cancelText: this.language.showModal.cancel,
                    success: res => {
                        this.firstFlag = true;
                        // #ifdef H5
                        var url = uni.getStorageSync('h5_url') + 'pagesB/myWallet/myWallet';
                        if (res.cancel) {
                            url = uni.getStorageSync('h5_url') + 'pages/tabBar/home';
                        }
                        setTimeout(function() {
                            window.location.href = url;
                        }, 1000);

                        // #endif
                        // #ifndef H5
                        this.$store.state.payRes = this.order_list;
                        if (res.confirm) {
                            uni.redirectTo({
                                url: './myWallet'
                            });
                        } else if (res.cancel) {
                            uni.switchTab({
                                url: '/pages/tabBar/home'
                            });
                        }
                        // #endif
                    }
                });
            },

            async pay_wx() {
                // debugger
                let me = this;
                var pay_type = 'app_wechat';
                var store_type = 1;
                var providerStr = '';

                if (me.pay_provider == 'alipay') {
                    providerStr = 'alipay';
                    pay_type = 'alipay';
                } else {
                    providerStr = 'wxpay';
                    //#ifdef APP-PLUS
                    pay_type = 'app_wechat';
                    // #endif
                    //#ifdef H5
                    let iswx = this.is_wx();
                    if(iswx){
                        pay_type = 'jsapi_wechat';
                    } else {
                        pay_type = 'H5_wechat';
                    }
                    // #endif
                    store_type = 2;
                }
                let orderInfo = await me.getOrderInfo(pay_type);
                

                if (orderInfo.code != 200) {
                    me._payFail();
                    return;
                }

                uni.hideLoading();
                // #ifdef H5
                if (pay_type == 'alipay') {
                    var url = uni.getStorageSync('endurl') + 'order/' + me.sNo + '_alipay.html';
                    window.location.href = url;
                } else if (pay_type == 'jsapi_wechat') {
                    var paymentData = orderInfo.data;

                    function onBridgeReady() {
                        WeixinJSBridge.invoke(
                            'getBrandWCPayRequest', {
                                appId: paymentData.appid, //公众号名称，由商户传入
                                timeStamp: paymentData.timeStamp, //时间戳，自1970年以来的秒数
                                nonceStr: paymentData.nonceStr, //随机串
                                package: paymentData.package,
                                signType: paymentData.signType, //微信签名方式：
                                paySign: paymentData.paySign //微信签名
                            },
                            function(res) {
                                me.firstFlag = true;
                                me.code == '';
                                var url = window.location.href;
                                var preUrl = url.split('#')[0];
                                var succUrl = preUrl.concat('#/pages/pay/payResult');
                                //支付成功
                                if (res.err_msg == 'get_brand_wcpay_request:ok') {
                                    me.$store.state.payRes = me.order_list;
                                    var price = me.price1;
                                    var sno = me.sNo;
                                    window.location.href = uni.getStorageSync('h5_url') +
                                        'pagesB/myWallet/myWallet';
                                } else {
                                    //支付失败
                                    me._payFail();
                                }
                            }
                        );
                    }

                    if (typeof WeixinJSBridge != 'undefined') {
                        onBridgeReady(paymentData);
                    } else {
                        if (typeof WeixinJSBridge == 'undefined') {
                            if (document.addEventListener) {
                                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                            } else if (document.attachEvent) {
                                document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                            }
                        }
                    }
                }
                // #endif

                // #ifndef H5 || MP-BAIDU
                console.log(orderInfo.data);
                uni.requestPayment({
                    provider: providerStr,
                    orderInfo: orderInfo.data, //订单数据
                    success: function(res) {
                        uni.showToast({
                            title: me.language.recharge.toasts[5],
                            duration: 1000,
                            icon: 'none'
                        });

                        var url = 'rechargeSuccess?mylei=1&money=' + me.price;
                        if ('alipay' == providerStr) {
                            url = url + '&_type=alipay';
                        } else if ('wxpay' == providerStr) {
                            url = url + '&_type=wx';
                        }

                        setTimeout(function() {
                            uni.redirectTo({
                                url: url
                            });
                        }, 1000);
                        me.fastTap = true;
                    },
                    fail: function(err) {
                        uni.showModal({
                            title: me.language.recharge.hint,
                            content: me.language.recharge.modalTips[0],
                            confirmText: me.language.showModal.confirm,
                            cancelText: me.language.showModal.cancel,
                            success: function(res) {}
                        });
                        me.fastTap = true;
                    }
                });
                // #endif
            },

            //支付方式选择
            _pay(index) {
                this.pay_index = index;
                this.pay_style = index + 1;

                if (index == 0) {
                    this.pay_provider = 'alipay';
                } else if (index == 1) {
                    this.pay_provider = 'app_wechat';
                } else if (index == 3) {
                    this.pay_provider = 'H5_wechat';
                } else if (index == 2) {
                    this.pay_provider = 'baidu_pay';
                }
            }
        },
        components: {
            heads
        }
    };
</script>

<style scoped lang="less">
    @import '../../static/css/myWallet/recharge.less';
</style>
