<template>
    <div>
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <!-- #ifndef MP -->
        <heads :title="language.order.orderSearch.title"></heads>
        <!-- #endif -->
        <div class="load" v-if="load">
            <div>
                <img :src="loadImg" />
                <p>{{language.order.orderSearch.loading}}</p>
            </div>
        </div>
        <div v-else>
            <div class="orderlist" v-if="order.length > 0">
                <div class="orderlist-line"></div>

                <ul class="order_goods orderlist-head" v-for="(item, index) in order" :key="index">
                    <!-- 订单头部 -->
                    <li class="order_one dd-boxa" v-if="!item.ismch">
                        <!-- 订单头部显示订单号 -->
                        <p v-if="!item.shop_name">{{ item.shop_name }}</p>

                        <p v-else @tap.stop="_goStore(item.shop_id)" class="shopName">
                            <img :src="storeImg" />
                            {{ item.ismch ? '' : item.shop_name }}
                            <img class="dd-boxa-img" :src="jiantou" />
                        </p>

                        <p class="red" v-if="item.codetext">{{ item.codetext }}</p>
                        <p class="red" v-else>{{
                            item.status == 0
                            ? language.order.orderSearch.state[0]
                            : item.status == 1
                            ? language.order.orderSearch.state[1]
                            : item.status == 2
                            ? language.order.orderSearch.state[2]
                            : item.status == 3 || item.status == 5 || item.status == 8
                            ? language.order.orderSearch.state[3]
                            : item.status == 7 || item.status == 6
                            ? language.order.orderSearch.state[4]
                            : item.status == 4
                            ? cancelGoods
                            : item.status == 12
                            ? language.order.orderSearch.state[5]
                            : item.status == 10 || item.status == 11
                            ? language.order.orderSearch.state[6]
                            : item.status == 9
                            ? language.order.orderSearch.state[7]
                            : ''
                            }}</p>
                    </li>

                    <!-- 订单商品详情 -->
                    <li
                        class="order_two"
                        :style="{ padding: item.ismch ? '10upx 0' : '' }"
                        v-for="(orders, index1) in item.list"
                        :key="index1"
                        @tap="_navigateTo(item.status, item.id, item.otype)"
                    >
                        <!-- 商品详情头部 -->
                        <div class="order_one dd-boxb" v-if="item.ismch && orders.shop_name">
                            <p v-if="!item.ismch">{{ item.shop_name }}</p>

                            <p v-else @tap.stop="_goStore(orders.shop_id)" class="shopName">
                                <img :src="storeImg" />

                                {{ orders.shop_name }}

                                <img class="dd-boxb-img" :src="jiantou" />
                            </p>

                            <p class="red" v-if="index1 === 0">{{ item.codetext }}</p>
                        </div>

                        <!-- 订单商品图 -->
                        <img :src="orders.imgurl" />

                        <!-- 订单商品标题 -->
                        <div style="width: 400rpx;">
                            <!-- TODO：微信小程序不支持动态css -->

                            <p class="order_p_name commodity-title">
                                <span v-if="item.otype == 'pt' || item.otype == 'PP'" class="ptCrl">{{language.order.orderSearch.Button[0]}}</span>
                                <span v-else-if="item.otype == 'KJ'" class="ptCrl commodity-type-kj">{{language.order.orderSearch.Button[1]}}</span>
                                <span v-else-if="item.otype == 'JP'" class="ptCrl commodity-type-jp">{{language.order.orderSearch.Button[2]}}</span>
                                <span v-else-if="item.otype == 'FX'" class="ptCrl commodity-type-px">{{language.order.orderSearch.Button[3]}}</span>
                                <span v-else-if="item.otype == 'integral'" class="ptCrl commodity-type-integral">{{language.order.orderSearch.Button[4]}}</span>
                                <span v-else-if="item.otype == 'MS' || item.otype == 'PM'" class="ptCrl commodity-type-ms">{{language.order.orderSearch.Button[5]}}</span>

                                {{ orders.p_name }}
                            </p>

                            <p class="color_one">{{ orders.size }}</p>
                        </div>

                        <!-- 订单商品右 -->
                        <div class="commodity-price">
                            <!-- 商品价格积分 -->
                            <p v-if="orders.p_price > 0">
                                <view v-if="item.otype == 'KJ'">￥{{ item.spz_price }}</view>
                                <view v-if="item.otype == 'JP'">￥{{ item.jp.jp_price }}</view>
                                <view v-if="item.otype != 'JP' && item.otype != 'KJ' && item.otype != 'integral'">￥{{ orders.p_price }}</view>

                                <span class="commodity-price-integral" v-if="orders.integral > 0">
                                    ￥{{ orders.p_price }}+
                                    <img class="commodity-price-img" :src="integral_hei" />
                                    {{ orders.integral }}
                                </span>
                            </p>
                            <p v-else>
                                <span class="commodity-price-integral" v-if="orders.integral > 0">
                                    <img class="commodity-price-img" :src="integral_hei" />
                                    {{ orders.integral }}
                                </span>
                            </p>
                            <!-- 购买数量 -->
                            <p class="color_two">x{{ orders.num }}</p>
                            
                            <!-- 订单右边的按钮 -->
                            <!-- 退款换货 -->
                            <div class="retreat" style="color: #FF8800;" v-if="(orders.r_status == 4 || orders.r_status == 6) && orders.re_type != 0">
                                {{ orders.re_type == 1 || orders.re_type == 2 ? '退款' : '退换' }}{{ orders.r_status == 4 ? '中' : '成功' }}
                            </div>

                            <div class="retreat commodity-price-btn" v-if="orders.comments_type == 1 && item.otype != 'integral'" @click.stop="comment(orders)">{{language.order.order.button[2]}}</div>

                            <div class="retreat commodity-price-btn" v-if="orders.comments_type == 2 && item.otype != 'integral'" @click.stop="comment(orders)">{{language.order.myorder.add_evaluation}}</div>
                        </div>

                        <!-- TODO: -->
                        <div style="height: 20rpx;width: 100%;" v-if="item.subtraction_list.product_title && item.list.length - 1 == index1"></div>

                        <img v-if="item.subtraction_list.product_title && item.list.length - 1 == index1" :src="item.subtraction_list.imgurl" />

                        <div style="width: 400rpx;" v-if="item.subtraction_list.product_title && item.list.length - 1 == index1">
                            <p class="order_p_name" style="height: 80rpx;">
                                <span style="color: red;">【{{language.order.orderSearch.gift}}】</span>

                                {{ item.subtraction_list.product_title }}
                            </p>

                            <p class="color_one"></p>
                        </div>

                        <div style="flex:1;" v-if="item.subtraction_list.product_title && item.list.length - 1 == index1">
                            <p>￥0.00</p>
                            <p class="color_two">x{{ item.subtraction_list.num }}</p>

                            <!-- 退款换货 -->
                            <div class="retreat" style="color: #FF8800;" v-if="(orders.r_status == 4 || orders.r_status == 6) && orders.re_type != 0">
                                {{ orders.re_type == 1 || orders.re_type == 2 ? '退款' : '退换' }} {{ orders.r_status == 4 ? '中' : '成功' }}
                            </div>

                        </div>
                    </li>

                    <!-- 商品底部 -->
                    <li class="order_last commodity-footer">
                        <!-- 左价格 -->
                        <div class="commodity-footer-price">
                            <span v-if="item.subtraction_list.num" class="color_666">{{language.order.orderSearch.common}}{{ item.sum - 0 + item.subtraction_list.num }}{{language.order.orderSearch.piece}}</span>
                            <span v-else class="color_666">{{language.order.orderSearch.common}}{{ item.sum }}{{language.order.orderSearch.piece}}</span>

                            <!-- 积分 -->
                            <span class="commodity-footer-price-integral order_integral" v-if="item.otype == 'integral'">
                                {{language.order.orderSearch.total}}：
                                <span v-if="item.z_price > 0">￥{{ item.z_price + '+ ' }}</span>
                                <span class="integral">
                                    <img class="integral-img" :src="integral_hong" />
                                    {{ ' ' + item.allow }}
                                </span>
                            </span>

                            <!-- 普通商品 -->
                            <span class="order_all commodity-footer-price-pt" v-else-if="item.otype != 'pt'">
                                {{language.order.orderSearch.total}}：
                                <span>￥{{ item.z_price }}</span>
                            </span>

                            <!-- 拼团 -->
                            <span class="order_all commodity-footer-price-pt" v-else>
                                {{language.order.orderSearch.total}}：
                                <span>￥{{ item.status == 0 ? item.pt_price : item.z_price }}</span>
                            </span>
                        </div>

                        <btns
                            v-if="item.shop_id != 0"
                            :status="item.status"
                            :isExtract="item.isExtract"
                            :self_lifting="item.self_lifting"
                            :sale_type="item.sale_type"
                            :delivery_status="item.delivery_status"
                            :orde_id="item.id"
                            :otype="item.otype"
                            :sNo="item.sNo"
                            @refresh="_axios"
                        />
                    </li>
                    <li style="background-color: #F4F4F4;height: 20rpx;width: 100%;margin: 0;border: none;"></li>
                </ul>

                <uni-load-more v-if="order.length > 10" :loadingType="loadingType"></uni-load-more>
            </div>

            <div v-else style="height: 100vh;position: absolute;top: 0;width: 100%;display: flex;align-items: center;">
                <div class="noFindDiv" style="width: 100%;padding-top: 378rpx;height: 100%;">
                    <div><img class="noFindImg" :src="noOrder" /></div>
                    <span class="noFindText">{{language.order.orderSearch.Tips}}</span>
                    <div @tap="_toHome()" style="display: flex;align-items: center; justify-content: center;margin-top: 60rpx;"><span class="goHome">{{language.order.orderSearch.Go_shopping}}</span></div>
                </div>
            </div>
        </div>


        <!-- 确认收货弹窗 -->
        <div v-if="alertTips" class="order_mask" @touchmove.stop.prevent>
            <div style="width: 70%;height: 340rpx;left: 15%;top: 30%;position: fixed;background: #FFFFFF;border-radius: 40rpx;">
                <div style="height: 75%;text-align: center;font-size: 15px;padding: 100upx 60rpx;display: flex; align-items: center;">{{language.order.myorder.Tips2}}</div>
                <div style="display: flex;border-top: 1px #e6e6e6 solid;font-size: 18px;text-align: center;height: 25%;">
                    <span @tap="_selTips(false)" style="width: 50%;padding: 20rpx;border-right: 1px #e6e6e6 solid;color: #9D9D9D;">{{language.order.myorder.cancel}}</span>
                    <span @tap="_selTips(true)" style="width: 50%;padding: 20rpx;">{{language.order.myorder.confirm}}</span>
                </div>
            </div>
        </div>
        
        <!-- 提取码弹出框 -->
        <div v-if="receiving_shop.flag" class="receiving_modal" @tap="receiving_stop">
            <div @tap.stop>
                <!-- 已完成 -->
                <img class="receiving_finish" v-if="receiving_check.status == 3" :src="finish2x" />
                <div class="receiving_content">
                    <div class="receiving_content_title">{{language.order.orderSearch.order_number}}: {{ receiving_check.sNo }}</div>
                    <div class="receiving_content_data" v-if="receiving_check.por_list.length == 1">
                        <div class="receiving_shop_img"><img :src="receiving_check.por_list[0].img" alt="" style="width:100%;height:100%;" /></div>
                        <div class="receiving_content_item">
                            <p>{{ receiving_check.por_list[0].product_title }}</p>
                            <div>
                                <p>
                                    <span class="receiving_rmb">￥</span>
                                    {{ receiving_check.por_list[0].p_price }}
                                </p>
                                <div class="receiving_size">
                                    <span class="receiving_size_item">{{ receiving_check.por_list[0].size }}</span>
                                    <span class="receiving_count">×{{ receiving_check.por_list[0].num }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <scroll-view scroll-x v-else>
                        <div class="receiving_content_data1" :style="'width:' + imgWidth">
                            <div class="receiving_shop_img" v-for="(item, index) in receiving_check.por_list" :key="index">
                                <p class="receiving_shop_num" v-if="item.num > 1">{{ item.num }}</p>
                                <img :src="item.img" alt="" style="width:100%;height:100%;" />
                            </div>
                        </div>
                    </scroll-view>
                    <div class="receiving_content_bottom">
                        {{language.order.orderSearch.common}}{{ receiving_check.num }}{{language.order.orderSearch.piece}}, {{language.order.orderSearch.total}}
                        <p class="red bold">￥{{ receiving_check.z_price }}</p>
                    </div>
                </div>
                <div class="receiving_img"><img :src="receiving_check.extraction_code_img" alt="" :style="receiving_check.status == 3 ? 'opacity: 0.4' : ''" /></div>
                <div class="receiving_code" :style="receiving_check.status == 3 ? 'opacity: 0.6' : ''">
                    <span class="receiving_name">{{language.order.orderSearch.code}}:</span>
                    <span class="receiving_code_data">{{ receiving_check.extraction_code }}</span>
                </div>
            </div>
        </div>

        <tqm />
    </div>
</template>

<script>
    import { mapMutations } from 'vuex';
    import PROCESS from "./DataProcess";
    import btns from "@/pages/order/components/btns";
    import tqm from "@/pages/order/components/tqm";

    export default {
        data() {
            return {
                receiving_check: {
                    por_list: []
                },
                receiving_shop: {
                    flag: false,
                    bottom: ''
                },
                loadImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/5-121204193R7.gif',
                emptyImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/empyimg92x.png',
                title: '搜索结果',
                can_del: true, //是否能删除订单
                fastTap: true,
                jiantou: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jiantou2x.png',
                storeImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/store.png',
                serchimg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/searchh.png',
                noOrder: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/noOrder.png',
                bback: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/bback.png',
                search2x: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/search2x.png',
                integral_hong: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/integral.png',
                integral_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/integral_hei.png',
                finish2x: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/finish2x.png',
                head: true, //头部切换
                header: ['全部', '待付款', '待发货', '待收货', '待评价'],
                rightText: ['立即付款', '提醒发货', '确认收货', '待评价', '退货', '追加评价', '再次购买', '拼团详情', '邀请好友'],
                leftText: ['取消订单', '查看物流', '删除订单', '查看详情', '拼团详情'],

                order: [], //订单数据
                status_id: '', //订单状态
                sreach_value: '', //搜索框的值
                page: 1, //加载页面
                allLoaded: false,
                loading: false,
                del_num: 0,
                load: true,
                timer: null,
                count: '',
                flag: true,
                loadingType: 0,
                value: '',
                alertTips: false,
                pay_name: 'MYORDER',
                shouhuoData: [],
                isDelModel: false
            };
        },
        components: {
            btns,
            tqm
        },
        computed: {
            imgWidth() {
                if (this.receiving_check.por_list) {
                    if (this.receiving_check.por_list.length > 1) {
                        let width = this.receiving_check.por_list.length * 150;
                        return uni.upx2px(width) + 'px';
                    }
                }
            }
        },
        onLoad(option) {
            this.receiving_shop.bottom = uni.upx2px(160);

            // #ifdef MP-WEIXIN
            wx.getSystemInfo({
                success: res => {
                    this.receiving_shop.bottom -= res.statusBarHeight;
                }
            });
            // #endif

            this.sreach_value = option.sreach_value;
            if (this.access_id) {
                this._axios();
            } else {
                this.load = false;
            }
        },
        onShow(option) {
            this.isLogin(()=>{

                if (this.access_id) {
                    this._axios();
                } else {
                    this.load = false;
                }
            })
        },
        methods: {
            // 关闭提取码弹框
            receiving_stop() {
                this.receiving_shop.flag = false;
            },
            /**
             * 查看提取码
             */
            _receiving(e) {
                let data = {
                    module: 'app',
                    app: 'see_extraction_code',
                    action: 'order',
                    order_id: e.id,

                };
                this.$req.post({data}).then(res => {
                    this.receiving_shop.flag = true;
                    this.fastTap = true;
                    let { code, data, message } = res;

                    if (code === 200) {
                        this.receiving_check = data;
                    } else {
                        uni.showToast({
                            title: message,
                            duration: 1500,
                            icon: 'none'
                        });
                    }
                });
            },
            _goStore(shop_id) {
                uni.navigateTo({
                    url: '/pagesA/store/store?shop_id=' + shop_id
                });
            },
            /**
             *
             * 设置请求数据选中项类型
             * '' 全部 || payment 代付款 || send 代发货 || receipt 待收货 || evaluete 待评价
             */
            getOrderType(data) {
                if (this.status_id == 0) {
                    data.queryOrderType = '';
                } else if (this.status_id == 1) {
                    data.queryOrderType = 'payment';
                } else if (this.status_id == 2) {
                    data.queryOrderType = 'send';
                } else if (this.status_id == 3) {
                    data.queryOrderType = 'receipt';
                } else if (this.status_id == 4) {
                    data.queryOrderType = 'evaluete';
                }
            },
            changeLoginStatus() {
                this._axios();
            },
            _navigateTo(status, id, otype) {
                if (status == 0) {
                    var path = '../order/order?order_id=' + id + '&showPay=true';
                    // #ifdef H5
                    path = '../order/order?order_id=' + id + '&showPay=true&_store=h5';
                    // #endif
                    uni.navigateTo({
                        url: path
                    });
                } else {
                    var path1 = 'order?order_id=' + id;
                    // #ifdef H5
                    path1 = 'order?order_id=' + id + '&showPay=true&_store=h5';
                    // #endif
                    uni.navigateTo({
                        url: path1
                    });
                }

                this.flag = false;
            },
            _uni_navigateTo(url) {
                uni.navigateTo({
                    url
                });
            },
            _toHome() {
                uni.switchTab({
                    url: '/pages/tabBar/home'
                });
            },
            /**
             *
             * 确定收货
             * @param type
             */
            _selTips(type) {
                if (type) {
                    let orde_id = this.shouhuoData['orde_id'];
                    let data = {
                        module: 'app',
                        action: 'order',
                        app: 'ok_Order',
                        order_id: orde_id,

                    };

                    this.$req
                        .post({
                            data
                        })
                        .then(res => {
                            let { code, message } = res;
                            if (code === 200) {
                                uni.showToast({
                                    title: this.language.order.orderSearch.Tips2[4],
                                    duration: 1000,
                                    icon: 'none'
                                });
                                this.alertTips = false;
                                setTimeout(() => {
                                    this._axios();
                                }, 1000);
                            } else {
                                uni.showToast({
                                    title: res.message,
                                    duration: 1500,
                                    icon: 'none'
                                });
                            }
                        });
                } else {
                    this.alertTips = false;
                }
            },
            /**
             *
             * 加载订单数据
             * */
            _axios() {
                let data = {
                    ordervalue: this.sreach_value,
                    module: 'app',
                    action: 'order',
                    app: 'index'
                };
                console.log(111);
                this.getOrderType(data);
                var that = this
                if (this.access_id) {
                    this.$req
                        .post({
                            data
                        })
                        .then(res => {
                            let { data: {order} } = res;

                            this.order = [];

                            setTimeout(() => {
                                this.load = false;
                            }, 300);

                            PROCESS(order,'',that);
                            if (Array.isArray(order)) {
                                order = order.map(item => {
                                    if (Array.isArray(item.subtraction_list) || !item.subtraction_list) {
                                        item.subtraction_list = {
                                            product_title: '',
                                            num: '',
                                            imgurl: ''
                                        }
                                    }
                                    return item
                                })
                            }



                            this.order.push(...order);

                            if (order.length < 10) {
                                this.allLoaded = true;
                            } else {
                                this.allLoaded = false;
                            }
                        })
                        .catch(err => {
                            console.log(err.message)
                            uni.showToast({
                                title: err.message,
                                duration: 1500,
                                icon: 'none'
                            });
                        });
                }
            },
            /**
             * 评价
             */
            comment(orders) {
                let { id: order_details_id, comments_type } = orders;
                if (comments_type == 1) {
                    uni.navigateTo({
                        url: '../evaluate/evaluating?order_details_id=' + order_details_id + '&num=all'
                    });
                } else {
                    uni.navigateTo({
                        url: '../evaluate/evaluating?order_details_id=' + order_details_id + '&add=true&num=all'
                    });
                }
            },
            /**
             * 验证订单是否关闭
             * @returns {Promise<void>}
             * @private
             */
            async _check_order_status (order_id, rightText, o_status) {
                let postData = {
                    module: 'app',
                    action: 'order',
                    app: 'order_details',
                    order_id
                }
                let {
                    data: {
                        status
                    }
                } = await this.$req.post({data: postData})
                status = Number.parseInt(status)
                o_status = Number.parseInt(o_status)
                if((status === 7 || status === 6) && status !== o_status) {
                    if (rightText == this.language.order.myorder.Buy_again) {
                        return  Promise.resolve()
                    }
                    return Promise.reject(this.language.order.myorder.order_gb)
                }
                return  Promise.resolve()
            },
            /**
             * 订单右下角左边按钮
             *
             */
            _buttonLeft(event, item, order, index) {
                let { id: order_id, sNo, status, delivery_status: sum } = item;
                let { attribute_id, p_id } = order;

                if (!this.can_del) {
                    return false;
                }
                this.can_del = false;

                setTimeout(() => {
                    this.can_del = true;
                }, 1500);

                this.fastTap = false;
                //orde_id订单id  attribute_id商品属性id  p_id商品id
                let otype = sNo.substr(0, 2);

                let data = {
                    module: 'app',
                    action: 'order',
                    order_id: order_id,

                };
                if (status == 0) {
                    uni.showModal({
                        title: this.language.order.myorder.prompt1,
                        content: this.language.order.myorder.sure1,
						confirmText: this.language.order.myorder.confirm,
						cancelText: this.language.order.myorder.cancel,
                        success: res => {
                            if (res.confirm) {
                                data.app = 'removeOrder';
                                this.$req
                                    .post({
                                        data
                                    })
                                    .then(res => {
                                        let { code, message } = res;

                                        if (code === 200) {
                                            uni.showToast({
                                                title: this.language.order.orderSearch.Tips2[0],
                                                duration: 1000,
                                                icon: 'none'
                                            });
                                        }
                                        this._axios();
                                    });
                            } else if (res.cancel) {
                                this.fastTap = true;
                            }
                        }
                    });


                } else if (status == 2 || status == 3 || status == 5) {
                    this.fastTap = true;
                    let data = {
                        module: 'app',
                        action: 'order',
                        app: 'logistics',
                        id: sNo,
                        o_source: 1,
                        type: ''
                    };

                    if (this.source == 1) {
                        data.type = 'pond';
                    }   

                    this.$req
                        .post({ data })
                        .then(res => {
                            uni.hideLoading();
                            if (res.code == 200) {
                                let data = res.data;
                                if (data.length > 1) {
                                    uni.navigateTo({
                                        url: '/pagesB/expressage/expressage?sNo=' + sNo
                                    });
                                } else {
                                    uni.navigateTo({
                                        url: '/pages/expressage/expressage?list=' + JSON.stringify(data[0]) + '&sNo=' + sNo
                                    });
                                }
                            } else {
                                uni.showToast({
                                    title: res.message,
                                    duration: 1500,
                                    icon: 'none'
                                });
                            }
                        })
                        .catch(error => {
                            uni.showToast({
                                title: this.language.order.orderSearch.Tips[2],
                                duration: 2000,
                                icon: 'none'
                            });
                        });
                } else if (status == 12 || status == 4 || (status == 1 &&  (otype != 'PT' && otype != 'PP' ))) {
                    this.fastTap = true;
                    uni.navigateTo({
                        url: '/pages/order/order?order_id=' + order_id
                    });
                } else if (status == 9 || status == 10 || (status == 1 && (otype == 'PT' || otype == 'PP'))) {
                    this.fastTap = true;
                    var path = '/pagesA/group/group_end?sNo=' + sNo + '&returnR=1';
                    if (otype == 'PP') {
                        path += '&a_type=1'
                    }
                    uni.navigateTo({
                        url: path
                    });
                } else if (status == 7 || status == 6 || status == 11 || status == 12) {
                    uni.showModal({
                        title: this.language.order.myorder.prompt,
                        content: this.language.order.myorder.sure,
						confirmText: this.language.order.myorder.confirm,
						cancelText: this.language.order.myorder.cancel,
                        success: res => {
                            if (res.confirm) {
                                /*发送请求*/
                                data.app = 'del_order';

                                this.$req.post({ data }).then(res => {
                                    let { code, message } = res;
                                    if (code == 200) {
                                        uni.showToast({
                                            title: this.language.order.myorder.delete_success,
                                            duration: 1000,
                                            icon: 'none'
                                        });
                                        this.order.splice(index, 1);
                                        this.del_num++;
                                        if (this.del_num >= 5) {
                                            //执行下拉加载数据操作
                                            this._rollBottom();
                                        }
                                    } else {
                                        uni.showToast({
                                            title: message,
                                            duration: 1000,
                                            icon: 'none'
                                        });
                                    }
                                    this.fastTap = true;
                                });
                            } else if (res.cancel) {
                                this.fastTap = true;
                            }
                        }
                    });


                }
            },
            /**
             * TODO:还不清楚是啥
             * @docs 提醒发货可以触发
             * */
            async _buttonRight(event, item, order, index, rightText) {
                let { id: orde_id, sNo, status, delivery_status: sum, list } = item;

                let { attribute_id, p_id } = order;
                try {
                    await this._check_order_status(orde_id, rightText, status);
                } catch(e) {
                    console.log(e);
                    uni.showToast({
                        title: e,
                        icon: 'none'
                    })
                    this._axios()
                    this.fastTap = false
                    return false;
                }

                var otype = sNo.substr(0, 2);
                //orde_id订单id  attribute_id商品属性id  p_id商品id
                if (status == 7 || status == 6 || status == 12) {


                    //跳转订单详情支付页
                    var data = {
                        module: 'app',
                        action: 'order ',
                        app: 'buy_again',
                        id: orde_id,

                    };




                    this.$req.post({ data }).then(res => {
                        let { data: {cart_id}, code, message } = res;
                        if (code == 200) {
                            this.cart_id(cart_id);
                            this.order_id('');
                            this.address_id('');
                            this.$store.state.cart_id = cart_id;
                            uni.navigateTo({
                                url: '/pages/pay/orderDetailsr?buy_again=true&cart_id=' + cart_id
                            });
                        } else {
                            uni.showToast({
                                title: message,
                                duration: 1500,
                                icon: 'none'
                            });
                        }
                    });
                } else if (status == 0) {
                    this.order_id(orde_id);
                    this.address_id('');

                    var path = '/pages/order/order_payment?order_id=' + orde_id + '&showPay=true&ordertype='+item.otype;

                    // #ifdef H5
                    path += '&_store=h5';
                    // #endif

                    uni.navigateTo({
                        url: path
                    });
                } else if (status == 1) {
                    //提醒发货
                    //请求接口
                    if (!this.fastTap) {
                        return;
                    }
                    this.fastTap = false;
                    if (sum == 0) {
                        var data = {
                            module: 'app',
                            order_id: orde_id,

                            app: 'delivery_delivery',
                            action: 'order'
                        };
                        this.$req.post({ data }).then(res => {
                            this.fastTap = true;
                            if (res.code == 200) {
                                uni.showToast({
                                    title: this.language.order.myorder.deliver_goods2,
                                    duration: 1000,
                                    icon: 'none'
                                });
                                this._axios();
                            } else {
                                uni.showToast({
                                    title: res.message,
                                    duration: 1500,
                                    icon: 'none'
                                });
                            }
                        });
                    } else {
                        this.fastTap = true;
                    }
                } else if (status == 4) {
                    //跳转订单详情
                    uni.navigateTo({
                        url: '/pages/order/order?order_id=' + orde_id
                    });
                } else if (status == 3) {
                    //评价页面
                    uni.navigateTo({
                        url: '/pages/evaluate/evaluating?order_details_id=' + orde_id + '&num=all'
                    });
                } else if (status == 5) {
                    //追加评价页面
                    uni.navigateTo({
                        url: '/pages/evaluate/evaluating?order_details_id=' + orde_id + '&add=true&num=all'
                    });
                } else if (status == 9 || status == 10 || status == 11) {
                    //参团页面
                    var path = '/pagesA/group/group_end?sNo=' + sNo;
                    uni.navigateTo({
                        url: path
                    });
                } else if (status == 2) {
                    this.shouhuoData['orde_id'] = orde_id;
                    this.alertTips = true;
                    return false;
                }
            },
            ...mapMutations({
                cart_id: 'SET_CART_ID',
                order_id: 'SET_ORDER_ID',
                address_id: 'SET_ADDRESS_ID'
            })
        }
    };
</script>

<style scoped lang="less">
    @import url('../../static/css/order/myOrder.less');
</style>
