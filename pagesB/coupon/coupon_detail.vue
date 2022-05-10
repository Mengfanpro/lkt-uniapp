<template>
    <div ref="cart" class="cart_f">
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <heads :title="language.coupon.title"></heads>
        <!-- 请求加载数据 -->
        <div class="load" v-if="load">
            <div>
                <img :src="loadGif" />
                <p>{{language.coupon.Loading}}</p>
            </div>
        </div>

        <!-- 渲染数据 -->
        <div class="order_detail" v-else>
            <!-- 显示地址 -->
            <div class="address_one" @tap="_uni_navigateTo('/pages/address/receivingAddress?state_manage=1&addre_id=' + address.id)" v-if="adds_f">
                <div class="address_one_data">
                    <span class="address_one_name">{{ address.name }}</span>
                    <span class="bold">{{ address.tel }}</span>
                    <p>{{ address.address_xq }}</p>
                </div>
                <img class="arrow" :src="jiantou" />
            </div>
            <!--没有地址-->
            <div class="address_two" @tap="_uni_navigateTo('/pages/address/addAddress?state_addre=1&addNum=0')" v-if="!adds_f">
                <span>+</span>
                <span>{{language.coupon.add_address}}</span>
            </div>
            <!--灰色间隔-->
            <div class="hr"></div>
            <!-- 商品列表 -->
            <ul>
                <li class="goods">
                    <img :src="jp_imgurl" />
                    <div class="goods_right">
                        <p>{{ jp_name }}</p>
                        <div class="goods_bottom">
                            <p>
                                <span class="font_22">￥</span>
                                {{ jp_total }}{{language.coupon.element}}
                            </p>
                            <div class="format both">
                                <p>{{language.coupon.Specifications}}：{{ pro.size }}</p>
                                <p>x{{ pro.num }}</p>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <!-- 运费，合计信息 -->
            <li class="order_coupon">
                <span>{{language.coupon.freight}}</span>
                <span v-if="freightt == 0">{{language.coupon.free_shipping}}</span>
                <span v-else>￥{{ freightt }}</span>
            </li>
            <li class="order_coupon">
                <span></span>
                <span class="bold font_30">
                    {{language.coupon.total}}：
                    <font class="bold font_30 color_FF0">￥{{ price2 }}</font>
                </span>
            </li>
            <!--支付方式-->
            <ul style="">
                <li class="pay" v-if="price2 > 0">
                    <div class="w_100">
                        <!-- 余额支付开始 -->
                        <div class="pay_yue">
                            <div>
                                <div>
                                    <p class="w_400">
                                        <font class="yue_money">{{language.coupon.Balance[0]}}</font>
                                        <span :class="user_money > 0 ? 'btn1' : 'btn2'">({{language.coupon.Balance[1]}}￥{{ user_money }})</span>
                                    </p>
                                </div>
                            </div>
                            <switch id="isyue" v-if="user_money > 0" @change="switchChange" color="#4CD864" />
                        </div>
                        <div v-if="useWallte" class="deco">
                            <div class="deco_title">{{language.coupon.Balance[2]}}</div>
                            <div class="deco_data">
                                <input class="ipt" :value="value" type="digit" @focus="_hide()" @blur="_show()" @input="replaceInput" :placeholder="language.coupon.placeholder" />
                            </div>
                        </div>
                        <!-- 余额支付结束 -->
                    </div>
                </li>
                <li class="hr"></li>
                <div v-if="needpay > 0">
                    <li class="order_coupon">
                        <span class="yue_money">{{language.coupon.need_pay}}</span>
                        <span>￥{{ needpay }}</span>
                    </li>

                    <!-- 微信支付 -->
                    <!-- #ifndef MP-ALIPAY -->
                    <li class="pay" @tap="chooseWay('wxPay')">
                        <div class="w_100">
                            <div class="pay_yue">
                                <div>
                                    <img class="pay_img" :src="pay_w" alt="" />
                                    <div class="ml_30"><p class="w_400">{{language.coupon.payment[0]}}</p></div>
                                </div>
                                <img class="quan_img" :src="wxPayStatue ? quan_hei : quan_hui" />
                            </div>
                        </div>
                    </li>
                    <!-- #endif -->
                    <!-- #ifdef  APP-PLUS || MP-ALIPAY -->
                    <!-- 支付宝支付 -->
                    <li class="pay" @tap="chooseWay('aliPay')">
                        <div class="w_100">
                            <div class="pay_yue">
                                <div>
                                    <img class="pay_img" :src="pay_z" alt="" />
                                    <div class="ml_30"><p class="w_400">{{language.coupon.payment[1]}}</p></div>
                                </div>
                                <img class="quan_img" :src="aliPayStatue ? quan_hei : quan_hui" />
                            </div>
                        </div>
                    </li>
                    <!-- #endif -->
                </div>
            </ul>
            <div class="foot" id="foot" :class="ishide == 1 ? 'hide' : ''">
                <div>
                    <p class="foot_price">{{language.coupon.Balance[3]}}：￥{{ price2 }}</p>
                </div>
                <p @tap="_pay_style()">{{ price2 > 0 ? language.coupon.start_payment[0] : language.coupon.start_payment[1] }}</p>
            </div>
            <!-- 高度屏幕小的时候解决选择不到微信支付的问题 -->
            <div class="bottom_height"></div>
            <!--余额支付密码框-->
            <div class="payment_pass" v-if="pay_display">
                <div class="payment_c">
                    <p>{{language.coupon.pay_pass}}</p>
                    <div class="xian_d">
                        <!-- #ifdef MP-WEIXIN -->
                        <input class="_yueInput1" @input="_yueInput" type="number" password="true" :maxlength="digits.length" v-model="msg" />
                        <!-- #endif -->
                        <!-- #ifndef MP-WEIXIN -->
                        <input class="_yueInput2" @input="_yueInput" type="number" password="true" :maxlength="digits.length" v-model="msg" />
                        <!-- #endif -->
                        <ul class="pwd-wrap" @tap="focust">
                            <li v-for="(item, key) in digits" :key="key">
                                <span v-if="msgLength > key" class="spanm"><input class="masd" type="number" v-model="key" pattern="\d*" /></span>
                            </li>
                        </ul>
                        <div class="forgetPW" @tap="forgetPW()">{{language.coupon.forget_pass}}？</div>
                    </div>
                    <div class="payment_tt">
                        <div class="cancel" @tap="_cancel">{{language.coupon.cancel}}</div>
                        <div class="confirm" @tap="_confirm">{{language.coupon.confirm}}</div>
                    </div>
                </div>
            </div>

            <!--没有设置支付密码提示框-->
            <div class="payment_pass" v-if="password_display">
                <div class="payment_c">
                    <div class="payment_ww">{{language.coupon.Tips[0]}}</div>
                    <div class="payment_tt payment_boo" @tap="_password_status">{{language.coupon.set_up}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapMutations} from 'vuex';

    export default {
    data() {
        return {
            title: '确认订单信息',
            
            returnR: 2, //放回页面标识
            load: true, //true：正在加载  false：已经加载完成
            head: true, //头部切换
            address: '', //地址
            address_id: '', //地址id
            adds_f: '', //地址状态
            bind_id: '', //竞拍商品id
            coupon_id: '', //优惠券id
            firstFlag: true, //
            pro: '', //竞拍商品数据
            jp_name: '', //竞拍标题
            jp_imgurl: '', //竞拍图
            jp_total: '', //竞拍商品价格
            jp_zong: '', //竞拍总价
            price1: this.jp_total - 0 + this.freight, //订单付款总价--计算后的价格
            price2: '', //订单付款总价--计算后并格式化的价格
            totla: '',
            freightt: '', //运费
            freight: '',
            name: '',
            channel: '',
            erroTime: 0,
            enterless: true,
            user_money: '', //用户余额
            useWallte: false, //使用钱包
            value: '', //输入框中使用的余额
            value2: '',
            cpId: '',
            needpay: '', //还需支付钱
            ishide: 0, //是否隐藏底部支付栏 1隐藏 0不隐藏
            pay_display: false, //支付密码框显示
            digits: ['', '', '', '', '', ''], //input框位数控制,这里可以配置多少个“输入框”
            msg: '',
            msgLength: 0, //余额支付，密码输入框长度
            password_display: false, //前往设置支付密码提示框
            guanbiImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/close2x.png',
            pay_y: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/yuezhifu2x.png',
            pay_z: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/zhifubaozhifu2x.png',
            pay_w: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/weixinzhifu2x.png',
            pay_b: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/lALPBb.png',
            quan_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/xuanzehui2x.png',
            quan_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/xuanzehei2x.png',
            zfb: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/zhifubaozhifu2x.png',
            wx: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/weixinzhifu2x.png',
            yezf: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/yuezhifu2x.png',
            back1: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/back2x.png',
            loadGif: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/5-121204193R7.gif',
            jiantou: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jiantou2x.png',
            storeImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/store.png',
            code: '',
            pay: [
                {
                    imgUrl: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/yuezhifu2x.png',
                    name: '钱包余额'
                },
                {
                    imgUrl: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/weixinzhifu2x.png',
                    name: '微信支付'
                },
                {
                    imgUrl: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/zhifubaozhifu2x.png',
                    name: '支付宝'
                }
            ], //支付方式
            pay_index: -1,
            pay_style: '', //支付方式
            content: '是否抵扣余额？',
            showPayWay1: false,
            showPayWay: false,
            focus: true,
            aliPayStatue: false,
            wxPayStatue: false,
            fastTap: true,
            can_pay: true,
            oldheight: '',
            makeOrd: false, //是否成功创建订单
            sNo: '',
            order_list: '',
            or_id: '',
            order_id: '',
            cart_id: '',
            h5_content: '',
            grade_rate: 1 //会员等级折扣
        };
    },
    onLoad(option) {
        this.order_list1 = uni.getStorageSync('order_list');
        this.level = uni.getStorageSync('level');

        this.isLogin(()=>{})
        //回调一步
        this.returnR = 2;
        this.cpId = option.product;
        this.$store.state.address_id = this.$store.state.address_id_def;

        // #ifndef MP-ALIPAY
        uni.onWindowResize(res => {
            if (this.oldheight == '') {
                this.oldheight = res.size.windowHeight;
                this._hide();
            } else {
                if (Number(this.oldheight) < Number(res.size.windowHeight)) {
                    this.oldheight = res.size.windowHeight;
                    this._show();
                } else if (Number(this.oldheight) == Number(res.size.windowHeight)) {
                    this._show();
                } else {
                    this._hide();
                }
            }
        });
        // #endif

        if (!this.cpId) {
            this.cpId = '';
        }
        if (option.canshu) {
            uni.setStorageSync('canshu', option.canshu);
        }
        this.order_no = option.order_no;
        this.orde_id = this.$store.state.order_id;
        this.cart_id = this.$store.state.cart_id;
        if (option.cart_id) {
            this.cart_id = option.cart_id;
            this.$store.state.cart_id = this.cart_id;
        }

        // #ifdef H5
        var storage = window.localStorage;
        if (storage['cart_id'] != null && storage['cart_id'] != '') {
            this.cart_id = storage['cart_id'];
        }
        // #endif
        this.$store.state.address_id = this.$store.state.address_id_def;
        this.bind_id = this.$store.state.bindding_num;

        

        // #ifndef H5
        this._axios();
        // #endif
        uni.getProvider({
            service: 'payment',
            success: e => {
                console.log('payment success', e);
                this.providerList = e.provider.map(value => {
                    switch (value) {
                        case 'alipay':
                            return {
                                name: '支付宝',
                                id: value,
                                loading: false
                            };
                        case 'wxpay':
                            return {
                                name: '微信',
                                id: value,
                                loading: false
                            };
                    }
                });
            }
        });
    },
    onShow() {
        this.orde_id = this.$store.state.order_id;
        this.cart_id = this.$store.state.cart_id;
        // #ifdef H5
        var storage = window.localStorage;
        // #endif

        this.address_id = this.$store.state.address_id;
        this.bind_id = this.$store.state.bindding_num;
        this.firstFlag = true; //不允许反复支付

        
        var lkt_address_id_def = uni.getStorageSync('lkt_address_id_def');

        // #ifdef H5
        var storage = window.localStorage;
        if (!this.address_id) {
            this.address_id = storage['address_id'];
        }
        if (!this.bind_id) {
            this.bind_id = storage['bindding_num'];
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
            storage.removeItem('bargain');
            storage.removeItem('bargain_id');
            storage.removeItem('order_no');
            storage.removeItem('product');
            // this.toUrl();
        }
        this._axios();
        // #endif

        if (lkt_address_id_def) {
            this.adds_f = true;
        } else if (this.$store.state.address_id_def == '' || this.$store.state.address_id_def == undefined) {
            this.adds_f = false;
        } else {
            this.adds_f = true;
        }

        // #ifndef H5
        this.$nextTick(() => {
            this._axios();
        });
        //#endif
    },
    methods: {
        _yueInput(e) {
            if (e.detail.value.length == 6) {
                // 100毫秒延迟，保证msg的值已经变了
                setTimeout(() => {
                    this._confirm();
                }, 100);
            }
        },
        changeLoginStatus() {
            this._axios();
        },
        _hide() {
            this.ishide = 1;
        },
        _show() {
            this.ishide = 0;
            if (this.value.length == 0) {
                this.value = 0;
            }
        },
        _back() {
            uni.switchTab({
                url: '/pages/tabBar/home'
            });
        },
        replaceInput(event) {
            this.value = Math.abs(event.detail.value);
            this._usyue();
        },
        _usyue: function() {
            let needpay = parseFloat(this.jp_total * this.grade_rate + this.freight - this.value).toFixed(2);
            if (needpay > 0) {
                this.needpay = needpay;
            } else {
                this.needpay = 0;
            }
        },
        payThree() {
            if (this.useWallte) {
                if (this.wxPayStatue) {
                    this.pay_wx();
                } else {
                    uni.showToast({
                        title: this.language.coupon.Tips[1],
                        duration: 1000,
                        icon: 'none'
                    });
                    this.firstFlag = true;
                }
            } else {
                if (this.wxPayStatue || this.aliPayStatue) {
                    var data = {
                        module: 'app',
                        action: 'order',
                        app: 'payment',
                        
                        address_id: this.address_id,
                        grade_l: this.level,
                        product: this.order_list1
                    };
                    if (this.cpId) {
                        data.product = this.cpId;
                        cart_id: '';
                    }

                    if (this.wxPayStatue) {
                        // #ifdef MP-WEIXIN
                        data.pay_type = 'mini_wechat';
                        // #endif
                        //#ifdef APP-PLUS
                        data.pay_type = 'app_wechat';
                        // #endif
                        //#ifdef H5
                        data.pay_type = 'jsapi_wechat';
                        // #endif
                    } else if (this.aliPayStatue) {
                        data.pay_type = 'aliPay';
                    }

                    this.$req
                        .post({ data })
                        .then(res => {
                            uni.hideLoading();
                            let { status, data } = res1;
                            this.order_list = JSON.stringify(data);
                            if (status == 0) {
                                uni.showToast({
                                    title: res1.err,
                                    duration: 1500,
                                    icon: 'none'
                                });
                                return;
                            }

                            if (status == 1) {
                                this.sNo = data.sNo;
                                this.price1 = data.total;
                                this.order_id = data.order_id;
                                if (this.wxPayStatue) {
                                    this.pay_wx('wx');
                                } else if (this.aliPayStatue) {
                                    this.pay_wx('ali');
                                }
                            }
                        })
                        .catch(error => {
                            uni.hideLoading();
                            this.firstFlag = true;
                            uni.showToast({
                                title: this.language.coupon.Tips[2],
                                duration: 1500,
                                icon: 'none'
                            });
                            setTimeout(function() {
                                uni.navigateBack({
                                    delta: 1
                                });
                            }, 1500);
                        });
                } else {
                    uni.showToast({
                        title: this.language.coupon.Tips[1],
                        duration: 1000,
                        icon: 'none'
                    });
                    this.firstFlag = true;
                }
            }
        },
        _showPayWay() {
            this.showPayWay1 = true;
            setTimeout(() => {
                this.showPayWay = false;
                this.showPayWay1 = false;
            }, 500);
        },
        forgetPW() {
            uni.navigateTo({
                url: '/pagesB/setUp/paymentPassword'
            });
        },
        chooseWay(way) {
            //微信支付
            if (way == 'wxPay') {
                if (!this.wxPayStatue) {
                    this.wxPayStatue = true;
                    this.aliPayStatue = false;
                } else {
                    this.wxPayStatue = false;
                }
            }
            //支付宝支付
            else if (way == 'aliPay') {
                if (!this.aliPayStatue) {
                    this.wxPayStatue = false;
                    this.aliPayStatue = true;
                } else {
                    this.aliPayStatue = false;
                }
            }
        },
        switchChange(e) {
            if (Number(this.user_money) <= 0) {
                return;
            }

            // #ifdef MP-BAIDU
            this.useWallte = e.detail.checked;
            // #endif

            // #ifndef MP-BAIDU
            this.useWallte = e.detail.value;
            // #endif

            if (!this.useWallte) {
                this.value2 = this.value;
                this.value = '';
                this.needpay = '';
            } else {
                if (this.price2 >= Number(this.user_money)) {
                    this.value = this.user_money;
                    this.needpay = parseFloat(this.price2 - Number(this.user_money)).toFixed(2);
                    console.log('支付总价大于用户余额');
                } else {
                    this.value = this.jp_total * this.grade_rate - 0 + this.freight;
                    let heji = this.jp_total * this.grade_rate - 0 + this.freight;

                    this.price2 = heji;
                    this.needpay = 0;
                    if (this.value === '') {
                        this.value = this.value2;
                    }
                    if (heji - this.value > 0) {
                        this.needpay = heji - this.value;
                    }
                }
            }
        },
        _uni_navigateTo(url) {
            uni.navigateTo({
                url
            });
        },
        getOrderInfo(type) {
            let data = {
                
                order_list: this.order_list,
                title: '',
                module: 'app',
                action: 'pay',
                type: 'app_wechat',
                type_: 'KJ',
                total: this.price1,
                bargain_order_no: this.order_no
            };

            data.title = this.jp_name;

            // #ifdef H5
            if (type == 'wx') {
                data.type = 'jsapi_wechat';
                data.code = this.code;
            } else if (type == 'ali') {
                data.type = 'alipay_mobile';
            }
            // #endif

            // #ifndef H5
            if (type == 'wx') {
                data.type = 'app_wechat';
            } else if (type == 'ali') {
                data.type = 'alipay';
            }
            // #endif

            return new Promise(res => {
                uni.request({
                    url: uni.getStorageSync('url'),
                    data,
                    success: result => {
                        if (result.statusCode == 200) {
                            res(result);
                            if (type == 'wx') {
                                //微信支付
                            } else if (type == 'ali') {
                                //支付宝支付
                                this.h5_content = result.data;
                            }
                        } else if (result.data.code != undefined && result.data.code != 200) {
                            uni.showToast({
                                title: result.data.message,
                                duration: 1500,
                                icon: 'none'
                            });
                        }
                    },
                    fail: e => {
                        res(e);
                    }
                });
            });
        },
        weixinPay() {
            this.loading = true;
            uni.login({
                provider: 'weixin',
                success: e => {
                    var data = {
                        code: e.code,
                        order_list: this.order_list,
                        title: this.jp_name,
                        type: 'mini_wechat',
                        
                        total: this.price1,
                        module: 'app',
                        action: 'pay'
                    };
                    
                    this.$req.post({data}).then(res => {
                        uni.hideLoading();
                        if (res.statusCode !== 200) {
                            this.weixinPayFailCallBack();
                            return;
                        } else if (res.statusCode == 200) {
                            let paymentData = res.data;
                            uni.requestPayment({
                                provider: 'wxpay',
                                timeStamp: paymentData.timeStamp,
                                nonceStr: paymentData.nonceStr,
                                package: paymentData.package,
                                signType: 'MD5',
                                paySign: paymentData.paySign,
                                success: res => {
                                    uni.showToast({
                                        title: this.language.coupon.Tips[3],
                                        duration: 1000,
                                        icon: 'none'
                                    });
                                    setTimeout(() => {
                                        this.$store.state.payRes = this.order_list;
                                        uni.redirectTo({
                                            url: '/pages/pay/payResult'
                                        });
                                        this.pay_display = false;
                                    }, 1000);
                                },
                                fail: res => {
                                    this.weixinPayFailCallBack();
                                }
                            });
                        } else {
                            this.weixinPayFailCallBack();
                        }
                    }).catch(()=>{
                        this.weixinPayFailCallBack();
                    })
                },
                fail: e => {
                    this.weixinPayFailCallBack();
                }
            });
        },
        weixinPayFailCallBack() {
            this.loading = false;
            uni.hideLoading();
            uni.showModal({
                title: this.language.coupon.Tips[5],
                content: this.language.coupon.Tips[4],
				confirmText: this.language.showModal.confirm,
				cancelText: this.language.showModal.cancel,
                success: res => {
                    this.firstFlag = true;
                    if (res.confirm) {
                        uni.redirectTo({
                            url: '/pages/order/myOrder'
                        });
                    } else if (res.cancel) {
                        uni.switchTab({
                            url: '/pages/tabBar/home'
                        });
                    }
                }
            });
        },
        ///支付失败
        _payFail() {
            uni.showModal({
                title: this.language.coupon.Tips[5],
                content: this.language.coupon.Tips[4],
				confirmText: this.language.showModal.confirm,
				cancelText: this.language.showModal.cancel,
                success: res => {
                    this.firstFlag = true;
                    // #ifdef H5
                    var url = uni.getStorageSync('h5_url') + 'pages/order/myOrder?status=1';
                    if (res.cancel) {
                        url = uni.getStorageSync('h5_url') + 'pages/tabBar/home';
                    }
                    location.href = url;
                    if (res.confirm) {
                        uni.redirectTo({
                            url: '/pages/order/myOrder'
                        });
                    } else if (res.cancel) {
                        uni.switchTab({
                            url: '/pages/tabBar/home'
                        });
                    }
                    // #endif
                    // #ifndef H5
                    this.$store.state.payRes = this.order_list;
                    if (res.confirm) {
                        uni.redirectTo({
                            url: '/pages/order/myOrder'
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
        async pay_wx(type) {
            if (!type) {
                return;
            }
            let orderInfo = await this.getOrderInfo(type);
            var providerStr = '';
            if (type == 'wx') {
                providerStr = 'wxpay';
            } else if (type == 'ali') {
                providerStr = 'alipay';
            }

            if (orderInfo.statusCode !== 200) {
                this._payFail();
            }
            var str = JSON.stringify(orderInfo.data);
            uni.hideLoading();
            // #ifdef H5
            if (type == 'ali') {
                var url = uni.getStorageSync('endurl') + 'order/' + this.sNo + '_alipay.html';
                window.location.href = url;
            } else if (type == 'wx') {
                var paymentData = orderInfo.data;

                function onBridgeReady() {
                    WeixinJSBridge.invoke(
                        'getBrandWCPayRequest',
                        {
                            appId: paymentData.appid, //公众号名称，由商户传入
                            timeStamp: paymentData.timeStamp, //时间戳，自1970年以来的秒数
                            nonceStr: paymentData.nonceStr, //随机串
                            package: paymentData.package,
                            signType: paymentData.signType, //微信签名方式：
                            paySign: paymentData.paySign //微信签名
                        },
                        res => {
                            this.firstFlag = true;
                            this.code == '';
                            var url = window.location.href;
                            var preUrl = url.split('#')[0];
                            var succUrl = preUrl.concat('#/pages/pay/payResult');
                            //支付成功
                            if (res.err_msg == 'get_brand_wcpay_request:ok') {
                                this.$store.state.payRes = this.order_list;
                                var price = this.price1;
                                // #ifdef H5
                                var price = Number(this.price1) + Number(this.value);
                                // #endif
                                var sno = this.sNo;
                                return false;
                                window.location.href = uni.getStorageSync('h5_url') + 'pages/pay/payResult?payment_money=' + price + '&sNo=' + sno;
                            } else {
                                //支付失败
                                this._payFail();
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

                uni.requestPayment({
                    provider: 'wxpay',
                    timeStamp: paymentData.timeStamp,
                    nonceStr: paymentData.nonceStr,
                    package: paymentData.package,
                    signType: 'MD5',
                    paySign: paymentData.paySign,
                    success: res => {
                        uni.showToast({
                            title: this.language.coupon.Tips[3],
                            duration: 1000,
                            icon: 'none'
                        });
                        setTimeout(() => {
                            this.$store.state.payRes = this.order_list;
                            uni.redirectTo({
                                url: '/pages/pay/payResult'
                            });
                            this.pay_display = false;
                        }, 1000);
                    },
                    fail: res => {
                        this._payFail();
                    },
                    complete: () => {
                        this.loading = false;
                        uni.hideLoading();
                    }
                });
            }
            // #endif

            // #ifndef H5
            uni.requestPayment({
                provider: providerStr,
                orderInfo: orderInfo.data, //订单数据
                success: res => {
                    uni.showToast({
                        title: this.language.coupon.Tips[3],
                        duration: 1000,
                        icon: 'none'
                    });
                    setTimeout(() => {
                        this.$store.state.payRes = this.order_list;
                        uni.redirectTo({
                            url: '/pages/pay/payResult'
                        });
                        this.pay_display = true;
                    }, 1000);
                },
                fail: err => {
                    var str = JSON.stringify(err);
                    this._payFail();
                }
            });
            // #endif
        },
        focust() {
            this.focus = true;
        },

        ...mapMutations({
            order_id: 'SET_ORDER_ID',
            status: 'SET_STATUS',
            h_content: 'SET_H_CONTENT'
        }),
        //是否已经选择支付方式
        _gotPayType() {
            if (!this.useWallte && !this.wxPayStatue && !this.aliPayStatue) {
                uni.showToast({
                    title: this.language.coupon.Tips[1],
                    duration: 1000,
                    icon: 'none'
                });
                this.firstFlag = false;
            } else {
                this.firstFlag = true;
            }
        },

        //立即支付
        _pay_style() {
            if (!this.adds_f) {
                uni.showToast({
                    icon: 'none',
                    title: this.language.coupon.Tips[6]
                });
                return;
            }
            if (this.price2 == 0) {
                var data = {
                    module: 'app',
                    action: 'order',
                    app: 'payment',
                    
                    address_id: this.address_id,
                    grade_l: this.level,
                    product: this.order_list1
                };

                this.$req.post({ data }).then(res => {
                    uni.redirectTo({
                        url: '/pages/pay/payResult?payment_money=' + this.price2 + '&sNo=' + res.data.sNo
                    });
                });

                return;
            }

            if (this.value == 0 && this.useWallte) {
                this.useWallte = false;
            }
            if (this.can_pay) {
                this.can_pay = false;
                setTimeout(() => {
                    this.can_pay = true;
                }, 1500);
            } else {
                return false;
            }
            this._gotPayType();
            if (this.firstFlag) {
                this.firstFlag = false;
                if (!this.value) {
                    this.value = 0;
                }

                this.price1 = this.jp_total * this.grade_rate - 0 + this.freight;

                this.price1 = this.price1.toFixed(2);
                // 提交订单
                if (this.adds_f) {
                    if (this.useWallte) {
                        //钱包支付

                        if (this.password_status == 0) {
                            uni.showModal({
                                title: this.language.coupon.Tips[5],
                                content: this.language.coupon.Tips[7],
								confirmText: this.language.showModal.confirm,
								cancelText: this.language.showModal.cancel,
                                showCancel: true,
                                success: resM => {
                                    this.firstFlag = true;
                                    if (resM.confirm) {
                                        uni.navigateTo({
                                            url: '/pages/setUp/payment'
                                        });
                                    }
                                }
                            });
                        } else {
                            let heji = Number(this.jp_total) * Number(this.grade_rate) - 0 + Number(this.freight);
                            if (Number(this.needpay) != 0 || heji > this.value) {
                                if (this.wxPayStatue || this.aliPayStatue) {
                                } else {
                                    uni.showToast({
                                        title: this.language.coupon.Tips[8],
                                        icon: 'none',
                                        duration: 1500
                                    });
                                    return false;
                                }
                            }

                            var data = {
                                module: 'app',
                                action: 'order',
                                app: 'payment',
                                
                                address_id: this.address_id,
                                grade_l: this.level,
                                product: this.order_list1
                            };
                            if (this.wxPayStatue) {
                                // #ifdef MP-WEIXIN
                                data.pay_type = 'mini_wechat';
                                // #endif
                                //#ifdef APP-PLUS
                                data.pay_type = 'app_wechat';
                                // #endif
                                //#ifdef H5
                                data.pay_type = 'jsapi_wechat';
                                // #endif
                            } else if (this.aliPayStatue) {
                                data.pay_type = 'aliPay';
                            }

                            this.$req.post({ data }).then(res1 => {
                                if (res1.code == 404) {
                                    uni.hideLoading();
                                    return;
                                }
                                let { status, data } = res1;
                                if (status == 1) {
                                    //创建成功
                                    this.makeOrd = true;
                                    this.sNo = res1.data.sNo;
                                    this.order_list = JSON.stringify(data);
                                } else {
                                    this.firstFlag = true;
                                    uni.hideLoading();
                                    uni.showToast({
                                        title: this.language.coupon.Tips[9],
                                        duration: 1500,
                                        icon: 'none'
                                    });
                                }
                            });

                            if (this.price1 > 0) {
                                //其他方式抵扣

                                let heji = Number(this.jp_total) * Number(this.grade_rate) - 0 + Number(this.freight);
                                if (Number(this.needpay) != 0 || heji > this.value) {
                                    if (this.wxPayStatue || this.aliPayStatue) {
                                        this.pay_display = true;
                                    } else {
                                        this.firstFlag = true;
                                        uni.showToast({
                                            title: this.language.coupon.Tips[8],
                                            icon: 'none',
                                            duration: 1500
                                        });
                                        return false;
                                    }
                                    // #ifdef MP-WEIXIN
                                    this.pay_display = true;
                                    // #endif
                                } else {
                                    this.pay_display = true;
                                }
                            } else {
                                //余额支付
                                this.pay_display = true;
                            }
                        }
                    } else {
                        //支付宝或微信支付--创建订单
                        uni.showLoading({
                            title: this.language.coupon.Tips[10],
                            mask: true
                        });
                        // #ifdef MP-WEIXIN

                        var data = {
                            module: 'app',
                            action: 'order',
                            app: 'payment',
                            
                            address_id: this.address_id,
                            grade_l: this.level,
                            product: this.order_list1
                        };
                        if (this.cpId) {
                            data.product = this.cpId;
                            cart_id: '';
                        }
                        data.pay_type = 'mini_wechat';

                        this.$req
                            .post({ data })
                            .then(res1 => {
                                let { status, data } = res1;
                                this.order_list = JSON.stringify(data);

                                if (status == 1) {
                                    this.weixinPay();
                                } else {
                                    this.firstFlag = true;
                                    uni.showToast({
                                        title: this.language.coupon.Tips[2],
                                        duration: 1500,
                                        icon: 'none'
                                    });
                                    setTimeout(function() {
                                        uni.navigateBack({
                                            delta: 1
                                        });
                                    }, 1500);
                                }
                            })
                            .catch(error => {
                                this.firstFlag = true;
                                uni.showToast({
                                    title: this.language.coupon.Tips[2],
                                    duration: 1500,
                                    icon: 'none'
                                });
                                setTimeout(function() {
                                    uni.navigateBack({
                                        delta: 1
                                    });
                                }, 1500);
                            });
                        // #endif
                        // #ifndef MP-WEIXIN
                        this.payThree();
                        // #endif
                    }
                } else {
                    uni.showToast({
                        title: this.language.coupon.Tips[6],
                        duration: 1000,
                        icon: 'none'
                    });
                }
            }
        },
        toUrl() {
            //将改页面的数据存入缓存
            // #ifdef H5
            var storage = window.localStorage;
            storage['bindding_num'] = this.bind_id;
            storage['address_id'] = this.address_id;
            // #endif
            var locationUrl = window.location.href;
            var data = {
                type: 'jsapi_wechat',
                
                app: 'get_config',
                module: 'app',
                action: 'order',
                url: locationUrl
            };

            this.$req.post({ data }).then(res => {
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
                    window.location.href = url;
                }
            });
        },
        //支付密码框确认
        _confirm(payNum) {
            if (!this.fastTap) {
                return;
            }
            this.fastTap = false;

            if (this.enterless) {
                uni.showLoading({
                    title: this.language.showLoading.paying1,
                    mask: true
                });
                if (this.msg.length == 6) {
                    var data = {
                        module: 'app',
                        action: 'user',
                        app: 'payment_password',
                        
                        password: this.msg,
                        endTime: ''
                    };

                    this.$req
                        .post({ data })
                        .then(res => {
                            let { code, message, data: {enterless} } = res;
                            if (code == 200) {
                                this.pay_display = false;
                                this.fastTap = true;
                                this._payAxios();
                            } else if (enterless) {
                                uni.hideLoading();
                                this.msg = '';
                                uni.showToast({
                                    title: this.language.coupon.Tips[11],
                                    duration: 1000,
                                    icon: 'none'
                                });
                                this.enterless = enterless;
                                this.fastTap = true;
                            } else if (!enterless) {
                                uni.hideLoading();
                                uni.showToast({
                                    title: this.language.coupon.Tips[12],
                                    duration: 1000,
                                    icon: 'none'
                                });
                                this.pay_display = false;
                                this.enterless = false;
                                this.fastTap = true;
                            }
                        })
                        .catch(error => {
                            uni.hideLoading();
                            uni.showToast({
                                title: this.language.coupon.Tips[13],
                                duration: 1000,
                                icon: 'none'
                            });
                            this.pay_display = false;
                            this.fastTap = true;
                        });
                } else {
                    uni.hideLoading();
                    this.fastTap = true;
                    uni.showToast({
                        title: this.language.coupon.Tips[14],
                        duration: 1000,
                        icon: 'none'
                    });
                }
            } else {
                this.fastTap = true;
                uni.showToast({
                    title: this.language.coupon.Tips[12],
                    duration: 1000,
                    icon: 'none'
                });
                this.pay_display = false;
            }
        },
        //支付密码框取消
        _cancel() {
            this.pay_display = false;
            this.msg = '';
            this.firstFlag = true;
            uni.showModal({
                title: this.language.coupon.Tips[5],
                content: this.language.coupon.Tips[4],
				confirmText: this.language.showModal.confirm,
				cancelText: this.language.showModal.cancel,
                success: function(res) {
                    if (res.confirm) {
                        uni.redirectTo({
                            url: '/pages/order/myOrder'
                        });
                    } else if (res.cancel) {
                        uni.switchTab({
                            url: '/pages/tabBar/home'
                        });
                    }
                }
            });
        },
        //余额支付请求
        _payAxios(type) {
            if (!this.fastTap) {
                return;
            }
            this.fastTap = false;
            var data = {
                module: 'app',
                action: 'pay',
                app: 'wallet_pay',
                m: 'wallet_pay',
                type: 'wallet_pay',
                
                address_id: this.address_id ? this.address_id : this.addre_id,
                order_list: this.order_list
            };
            data.payment_money = this.value;

            this.$req
                .post({ data })
                .then(res => {
                    this.fastTap = true;
                    let { code, message } = res;
                    if (code == 200) {
                        if (Number(this.price1) > 0) {
                            // #ifdef MP-WEIXIN
                            this.weixinPay();
                            // #endif
                            //#ifndef MP-WEIXIN
                            if (this.wxPayStatue) {
                                this.pay_wx('wx');
                            } else if (this.aliPayStatue) {
                                this.pay_wx('ali');
                            }
                            // #endif
                        } else {
                            uni.hideLoading();
                            var dat_id = this.order_id ? this.order_id : this.or_id;
                            uni.showToast({
                                title: this.language.coupon.Tips[3],
                                duration: 1000,
                                icon: 'none'
                            });
                            var price = this.price1;

                            var price = Number(this.price1) + Number(this.value);

                            var sno = this.sNo;

                            setTimeout(() => {
                                this.$store.state.payRes = this.order_list;
                                uni.redirectTo({
                                    url: '/pages/pay/payResult?payment_money=' + price + '&sNo=' + sno
                                });

                                this.pay_display = false;
                            }, 1000);
                        }
                    } else if (code == 112) {
                        uni.hideLoading();
                        this.pay_display = false;
                        this.msg = '';
                        this.firstFlag = true;
                        uni.showModal({
                            title: this.language.coupon.Tips[5],
                            content: this.language.coupon.Tips[15],
							confirmText: this.language.showModal.confirm,
							cancelText: this.language.showModal.cancel,
                            showCancel: false,
                            success: function(res) {
                                if (res.confirm) {
                                    uni.redirectTo({
                                        url: '/pages/order/myOrder'
                                    });
                                }
                            }
                        });
                    } else {
                        uni.hideLoading();
                        this.pay_display = false;
                        this.msg = '';
                        uni.showModal({
                            title: this.language.coupon.Tips[5],
                            content: this.language.coupon.Tips[16],
							confirmText: this.language.showModal.confirm,
							cancelText: this.language.showModal.cancel,
                            showCancel: false,
                            success: res => {
                                this.firstFlag = true;
                                if (res.confirm) {
                                    uni.switchTab({
                                        url: '/pages/tabBar/home'
                                    });
                                }
                            }
                        });
                    }
                })
                .catch(error => {
                    this.fastTap = true;
                });
        },
        //跳设置支付密码页面
        _password_status() {
            uni.navigateTo({
                url: '/pagesB/setUp/payment'
            });
            this.password_display = false;
        },
        _axios() {
            var data = {
                module: 'app',
                action: 'order',
                auction_id: this.bind_id,
                grade_l: this.level,
                
                address_id: this.address_id && this.address_id !== 'undefined' ? this.address_id : '',
                app: 'Settlement',
                product: this.order_list1
            };
            this.$req.get({ data }).then(res => {
                this.load = false;
                let {
                    addemt,
                    address,
                    coupon_id,
                    freight,
                    name,
                    password_status,
                    products,
                    products_total,
                    total,
                    user_money,
                    enterless,
                    is_distribution,
                    discount,
                    grade_rate
                } = res.data;
                this.address = address;
                res = res.data
                this.freightt = parseFloat(freight).toFixed(2);
                this.freight = freight;
                if (res.products[0] && res.products[0].list[0]) {
                    this.jp_imgurl = res.products[0].list[0].img;
                    this.jp_name = res.products[0].list[0].product_title;

                    let pro = {};
                    pro.size = res.products[0].list[0].size;
                    pro.num = res.products[0].list[0].num;
                    this.pro = pro;
                }
                this.jp_total = res.products_total;
                this.price1 = this.totla - 0 + this.freight;
                this.grade_rate = grade_rate;
                this.user_money = user_money;
                this.addre_id = address.id;
                this.$store.state.address_id_def = address.id;
                this.password_status = password_status;

                if (this.user_money > this.price1) {
                    this.pay_index = 0;
                    this.pay_style = 1;
                } else {
                    this.pay_index = 1;
                    this.pay_style = 2;
                }
                if (this.address) {
                    if (this.address.length != 0) {
                        this.adds_f = true;
                    } else {
                        this.adds_f = false;
                    }
                }
            });
        },
        changeValue(newValue, oldValue) {
            this.$nextTick(() => {
                this.price1 = this.jp_total * this.grade_rate - 0 + this.freight;
                this.price2 = this.price1.toFixed(2);
                let should_pay = this.jp_total * this.grade_rate - 0 + this.freight;
                if (Number(this.value) >= should_pay) {
                    //输入金额大于商品金额
                    if (should_pay <= this.user_money) {
                        if (should_pay > 0) {
                            this.value = should_pay;
                        }
                    } else {
                        this.value = this.user_money;
                    }
                    if (Number(this.value) > should_pay && should_pay > 0) {
                        uni.showToast({
                            title: this.language.coupon.Tips[17],
                            icon: 'none',
                            duration: 1500
                        });
                    }
                    // 补充：当使用余额大于合计金额时，将还需支付置为0 Number(0).toFixed(2)
                } else if (Number(this.value) < should_pay) {
                    //输入金额小于商品金额
                    if (Number(this.value) > this.user_money) {
                        this.value = this.user_money;
                        uni.showToast({
                            title: this.language.coupon.Tips[17],
                            icon: 'none',
                            duration: 1500
                        });
                    }
                }

                if (Math.abs(newValue - oldValue) == 0) {
                    var x = String(newValue).indexOf('.') + 1;
                    var y = String(newValue).length - x;
                    if (y > 2 && x != 0) {
                        this.value = Number(newValue).toFixed(2);
                    }
                } else if (Math.abs(newValue - oldValue) < 0.009999999999) {
                    this.value = Number(this.value).toFixed(2);
                }
            });
        },
        ...mapMutations({
            order_id: 'SET_ORDER_ID',
            address_id: 'SET_ADDRESS_ID',
            bindding_num: 'SET_BINDDING_NUM',
            bind_status: 'SET_BIND_STATUS',
            bind_promise: 'SET_BIND_PPOMISE',
            head_id: 'SET_HEAD_ID'
        })
    },
    watch: {
        address_id() {
            this._axios();
        },
        msg(curVal) {
            this.msgLength = curVal.length;
        },
        page: {
            handler: function(newValue, oldValue) {
                if (oldValue == 0 && newValue == 1) {
                    //第一次进入页面，自动获得焦点，这里可优化。
                    this.timer = setTimeout(() => {}, 500);
                }
            },
            deep: true
        },
        freight: function() {
            this.price1 = this.jp_total * this.grade_rate - 0 + this.freight;
            this.price2 = this.price1.toFixed(2);

            if (this.useWallte) {
                if (parseFloat(this.user_money) > parseFloat(this.price2)) {
                    this.value = this.price2;
                }
            }
            let should_pay = this.jp_total * this.grade_rate - 0 + this.freight;
            //当交易金额小于等于0时,终止交易
            if (should_pay < 0) {
                uni.showToast({
                    title: this.language.coupon.Tips[18],
                    icon: 'none',
                    duration: 1500
                });
                uni.navigateBack({
                    delta: 1
                });
            }
            this.needpay = this.price2 - 0 - this.value;
        },
        coupon_name: function(newValue, oldValue) {
            this.changeValue(newValue, oldValue);
        },
        value: function(newValue, oldValue) {
            this.changeValue(newValue, oldValue);
        },
        price1: function(newValue, oldValue) {
            this.$nextTick(() => {
                this.price1 = this.jp_total * this.grade_rate - 0 + this.freight - this.value;
                this.price1 = Number(this.price1).toFixed(2);

                this.needpay = this.price1;
            });
        }
    }
};
</script>

<style scoped lang="less">
@import url('../../static/css/bidding/bidding_order.less');
</style>
