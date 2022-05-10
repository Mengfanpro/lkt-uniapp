<template>
    <div class="container" :style="{background:order.length==0?'#ffffff':''}">
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <div class="position_head">
            <heads :title="language.order.myorder.title" returnR="7"></heads>

            <div class="allgoods_s home_navigation">
                <div class="home_input">
                    <img class="searchImg" :src="serchimg" alt="" />
                    <input type="text" v-model="sreach_value" style="padding-right: 2rpx;" :placeholder="language.order.myorder.order_placeholder" placeholder-style="color:#999999;font-size:26upx" name="sourch" />
                    <image v-show="sreach_value.length > 0" @click="cleardata" class="cancel" :src="sc_icon" mode=""></image>
                </div>

                <div class="searchTextC" style="font-size: 28rpx;padding-left: 20rpx;" @tap="_seart()">{{language.order.myorder.search}}</div>
            </div>

            <!--   导航栏      -->
            <ul class="order_header">
                <li class="header_li" :class="{ header_border: status_id == index }" v-for="(item, index) in header" :key="item.id" @tap="_header_index(index)">{{ item }}</li>
            </ul>
        </div>

        <!--  订单列表   -->
        <div  v-if="load">
            <div class="skeleton">
                <div class="orderlist">
                    <div class="orderlist-line"></div>

                    <ul class="order_goods orderlist-head" style="padding-right: 15px;" v-for="(item, index) of 4" :key="index">
                        <!-- 订单头部 -->
                        <li class="dd-boxa"  style="height: 20px;margin-top: 10px;margin-bottom: 10px;">
                            <!-- 订单头部显示订单号 -->
                            <p  class="shopName skeleton-rect" style="width: 100px;margin-left: 28rpx;">
                                <img :src="storeImg" />
                                {{language.order.myorder.shop_name}}
                                <img class="dd-boxa-img" :src="jiantou" />
                            </p>

                            <p class="red">xxx</p>
                        </li>

                        <li class="order_two" style="display: flex;justify-content: flex-start">
                            <div class="left skeleton-rect" style="width: 60px;height: 60px;margin-right: 10px;">

                            </div>
                            <div class="right">
                                <div class="skeleton-rect" style="width: 250px;height: 22px;margin-bottom: 16px;">22</div>
                                <div class="skeleton-rect" style="width: 250px;height: 22px;">22</div>

                            </div>
                        </li>

                        <li class="skeleton-rect" style="height: 51px;width: 95%;margin-left: 28rpx;"></li>
                    </ul>
                </div>


            </div>
        </div>

        <div v-else>
            <div class="orderlist" v-if="order.length > 0">
                <div class="orderlist-line"></div>

                <ul class="order_goods orderlist-head" v-for="(item, index) in order" :key="index">
                    <!-- 订单头部 -->
                    <li class="order_one dd-boxa" v-if="!item.ismch">
                        <!-- 订单头部显示订单号 -->
                        <p v-if="!item.shop_name">{{ item.sNo }}</p>

                        <p v-else @tap.stop="_goStore(item.shop_id)" class="shopName">
                            <img :src="storeImg" />
                            {{ item.ismch ? '' : item.shop_name }}
                            <img class="dd-boxa-img" :src="jiantou" />
                        </p>

                        <p class="red" v-if="item.codetext">{{ item.codetext }}</p>
                        <p class="red" v-else>{{
                            item.status == 0
                            ? '待付款'
                            : item.status == 1
                            ? '待发货'
                            : item.status == 2
                            ? '待收货'
                            : item.status == 3 || item.status == 5 || item.status == 8
                            ? '交易成功'
                            : item.status == 7 || item.status == 6
                            ? '交易关闭'
                            : item.status == 4
                            ? cancelGoods
                            : item.status == 12
                            ? '订单完成'
                            : item.status == 10 || item.status == 11
                            ? '拼团失败'
                            : item.status == 9
                            ? '拼团中'
                            : ''
                            }}</p>
                    </li>

                    <!-- 订单商品详情 -->
                    <li
                        class="order_two"
                        :style="{ padding: item.ismch ? '0 0' : '' }"
                        v-for="(orders, index1) in item.list"
                        :key="index1"
                        @tap="_navigateTo(item.status, item.id, item.otype, item)"
                    >
                        <!-- 商品详情头部 -->
                        <div class="order_one dd-boxb ismch"
                             :style="{borderTop: index1==0?'none':'1px solid #eee',marginTop: index1==0?'0':'10px'}"
                             v-if="item.ismch && orders.shop_name">
                            <p v-if="!item.ismch" >{{ item.shop_name }}</p>

                            <p v-else @tap.stop="_goStore(orders.shop_id)" style="color: #666"   class="shopName">
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
                                <span v-if="item.otype == 'pt' ||  item.otype == 'PP'" class="ptCrl">{{language.order.orderSearch.Button[0]}}</span>
                                <span v-else-if="item.otype == 'KJ'" class="ptCrl commodity-type-kj">{{language.order.orderSearch.Button[1]}}</span>
                                <span v-else-if="item.otype == 'JP'" class="ptCrl commodity-type-jp">{{language.order.orderSearch.Button[2]}}</span>
                                <span v-else-if="item.otype == 'FX'" class="ptCrl commodity-type-px">{{language.order.orderSearch.Button[3]}}</span>
                                <span v-else-if="item.otype == 'integral'" class="ptCrl commodity-type-integral">{{language.order.orderSearch.Button[4]}}</span>
                                <span v-else-if="item.otype == 'MS' ||  item.otype == 'PM'" class="ptCrl commodity-type-ms">{{language.order.orderSearch.Button[5]}}</span>

                                {{ orders.p_name }}
                            </p>

                            <p class="color_one">{{ orders.size }}</p>
                        </div>

                        <!-- 订单商品右 -->
                        <div class="commodity-price">
                            <!-- 商品价格积分 -->
                            <p v-if="orders.p_price > 0">
                                <view v-if="item.otype == 'KJ'">￥{{ item.spz_price.toFixed(2) || orders.p_price.toFixed(2) }}</view>
                                <view v-if="item.otype == 'JP'">￥{{ (item.jp&&item.jp.jp_price).toFixed(2) || orders.p_price.toFixed(2) }}</view>
                                <view v-if="item.otype != 'JP' && item.otype != 'KJ' && item.otype != 'integral'">￥{{ orders.p_price.toFixed(2) }}</view>

                                <span class="commodity-price-integral" v-if="orders.integral > 0">
                                    ￥{{ orders.p_price.toFixed(2) }}+
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
                            <template v-if="item.shop_id != 0">
                                <div class="retreat" style="color: #FF8800;" v-if="(orders.r_status == 4 || orders.r_status == 6) && orders.re_type != 0">
                                    {{ orders.re_type == 1 || orders.re_type == 2 ? '退款' : '退换' }}{{ orders.r_status == 4 ? '中' : '成功' }}
                                </div>
                                
                                <div class="retreat commodity-price-btn" v-if="orders.comments_type == 1 && item.otype != 'integral'" @click.stop="comment(orders)">{{language.order.order.button[2]}}</div>
                                
                                <div class="retreat commodity-price-btn" v-if="orders.comments_type == 2 && item.otype != 'integral'" @click.stop="comment(orders)">{{language.order.myorder.add_evaluation}}</div>
                            </template>
                        </div>

                        <!-- TODO: -->
                        <div style="height: 20rpx;width: 100%;" v-if="item.subtraction_list.product_title && item.list.length - 1 == index1"></div>

                        <img v-if="item.subtraction_list.product_title && item.list.length - 1 == index1" :src="item.subtraction_list.imgurl" />

                        <div style="width: 400rpx;" v-if="item.subtraction_list.product_title && item.list.length - 1 == index1">
                            <p class="order_p_name" style="height: 80rpx;">
                                <span style="color: red;">【赠品】</span>

                                {{ item.subtraction_list.product_title }}
                            </p>

                            <p class="color_one"></p>
                        </div>

                        <div style="flex:1;padding-right: 30rpx;" v-if="item.subtraction_list.product_title && item.list.length - 1 == index1">
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
                            <span v-if="item.subtraction_list.num" class="color_666">{{language.order.myorder.common}}{{ item.sum - 0 + item.subtraction_list.num }}{{language.order.myorder.piece}}</span>
                            <span v-else class="color_666">{{language.order.myorder.common}}{{ item.sum }}{{language.order.myorder.piece}}</span>

                            <!-- 积分 -->
                            <span class="commodity-footer-price-integral order_integral" v-if="item.otype == 'integral'">
                                {{language.order.myorder.total}}：
                                <span v-if="item.z_price > 0">￥{{ item.z_price + '+ ' }}</span>
                                <span class="integral">
                                    <img class="integral-img" :src="integral_hong" />
                                    {{ ' ' + item.allow }}
                                </span>
                            </span>

                            <!-- 普通商品 -->
                            <span class="order_all commodity-footer-price-pt" v-else-if="item.otype != 'pt'">
                                {{language.order.myorder.total}}：
                                <span>￥{{ item.z_price.toFixed(2) }}</span>
                            </span>

                            <!-- 拼团 -->
                            <span class="order_all commodity-footer-price-pt" v-else>
                                {{language.order.myorder.total}}：
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
                            :isOrderDel="item.isOrderDel"
                            @refresh="refresh"
                        />

                    </li>
                    <li style="background-color: #F4F4F4;height: 20rpx;width: 100%;margin: 0;border: none;"></li>
                </ul>

                <uni-load-more v-if="order.length > 10" :loadingType="loadingType"></uni-load-more>
            </div>

            <div v-if="order.length < 1 && !load" style="height: 100vh;position: absolute;top: 0;width: 100%;display: flex;align-items: center;">
                <div class="noFindDiv" style="width: 100%;padding-top: 378rpx;height: 100%;">
                    <div><img class="noFindImg" :src="noOrder" /></div>
                    <span class="noFindText">{{language.order.myorder.no_order}}</span>
                    <div @tap="_toHome()" style="display: flex;align-items: center; justify-content: center;margin-top: 60rpx;"><span class="goHome">{{language.order.myorder.go_shopping}}</span></div>
                </div>
            </div>
        </div>

        <tqm />

        <delModel v-model="isDelModel" :nocancel="true" :content="language.order.myorder.Tips[0]" @on-click="onModeOk"></delModel>
        <skeleton :animation="true" :loading="load" bgColor="#FFF"></skeleton>
    </div>
</template>

<script>
    import {mapMutations} from 'vuex';
    import delModel from '@/components/delModel.vue';
    import PROCESS from './DataProcess.js';
    import btns from "@/pages/order/components/btns";
    import tqm from "@/pages/order/components/tqm";

    export default {
        data() {
            return {
                receiving_check: {
                    por_list: []
                },
                receiving_shop: false,
                can_del: true, //是否能删除订单
                fastTap: true,
                title: '我的订单',
                jiantou: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jiantou2x.png',
                storeImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/store.png',
                serchimg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/searchNew.png',
                noOrder: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/noOrder.png',
                bback: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/bback.png',
                search2x: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/search2x.png',
                integral_hong: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/integral.png',
                integral_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/integral_hei.png',
                sc_icon: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL+'images/icon1/delete2x.png',
                head: true, //头部切换
                header: ['全部', '待付款', '待发货', '待收货', '待评价'],

                order: [], //订单数据
                status_id: '', //订单状态
                sreach_value: '', //搜索框的值
                page: 1, //加载页面
                allLoaded: false,
                loading: false,
                load: true,
                timer: null,
                count: '',
                flag: true,
                loadingType: 0,
                value: '',
                pay_name: 'MYORDER',
                shouhuoData: [],
                isDelModel: false
            };
        },
        /**
         * 上拉触底事件处理
         * */
        onReachBottom() {
            if (this.loadingType != 0) {
                return;
            }
            this.loadingType = 1;
            this.page ++;
            this._axios()
        },
        /**
         * 监听页面加载
         * */
        onLoad(option) {
            this.setLang();
            var that = this.language.order.myorder;
            this.header = [that.whole,that.to_paid,that.to_delivered,that.to_Receiving,that.to_evaluated]
            if (option.status) {
                this.status_id = option.status
            }
        },
        watch: {
            value: function(newValue, oldValue) {
                this.changeValue();
            }
        },
        /**
         * 监听实例销毁之前
         * */
        beforeDestroy() {
            this.load = true;
            clearInterval(this.timer);
            this.order = [];
        },
        /**
         * 监听页面显示
         * */
        onShow() {
            this.load = true;
            this._axios();
            this.order = [];
            this.page = 1;
            this.loadingType = 0;
            this.flag = true;
            uni.reLaunch()
            console.log(getCurrentPages())
        },
        mounted() {
          // uni.reLaunch()  
        },
        components: {
            delModel,
            btns,
            tqm
        },
        methods: {
            ...mapMutations({
                cart_id: 'SET_CART_ID',
                order_id: 'SET_ORDER_ID',
                address_id: 'SET_ADDRESS_ID',
                status: 'SET_STATUS'
            }),
            cleardata(){
                 this.sreach_value = ''
            },
            onModeOk() {
                this.isDelModel = !this.isDelModel;
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
                //兼容java
                // data.queryOrderType=data.order_type;
            },
            changeLoginStatus() {
                this._axios();
            },
            _goStore(shop_id) {
                uni.navigateTo({
                    url: '/pagesA/store/store?shop_id=' + shop_id
                });
            },
            /**
             * 去逛逛
             */
            _toHome() {
                uni.switchTab({
                    url: '/pages/tabBar/home'
                });
            },
            /**
             *
             * 查看订单详情
             */
            _navigateTo(status, id, otype, item) {
                if(item.shop_id == 0){
                    return
                }
                
                let url = '/pages/order/order?order_id=' + id;

                if (status == 0) {
                    url += '&showPay=true';
                }

                // #ifdef H5
                url = '/pages/order/order?order_id=' + id;
                // #endif

                this.navTo(url)
                // uni.navigateTo({
                //     url
                // });

                this.flag = false;
            },
            /**
             * 导航栏切换
             */
            _header_index(index) {
                this.load = true;
                this.order = [];
                this.isLogin(()=>{
                    this.page = 1;
                    if (index == "1") {
                        this.status(1);
                        this.status_id = this.$store.state.status;
                    } else if (index == "2") {
                        this.status(2);
                        this.status_id = this.$store.state.status;
                    } else if (index == "3") {
                        this.status(3);
                        this.status_id = this.$store.state.status;
                    } else if (index == "4") {
                        this.status(4);
                        this.status_id = this.$store.state.status;
                    } else if (index == "0") {
                        this.status(0);
                        this.status_id = this.$store.state.status;
                    }
                    this._axios();
                })
            },
            refresh () {
                this.load = true
                this.order = [];
                this.page = 1;
                this.loadingType = 0;
                this._axios();
            },
            /**
             *
             * 加载订单数据
             * */
            _axios() {
                let data = {
                    page: this.page,
                    module: 'app',
                    action: 'order',
                    app: 'index'
                };
                this.getOrderType(data);

                if (this.access_id) {
                    this.$req.post({data}).then(res => {
                        let { data: {order} } = res;

                        PROCESS(order, data.order_type,this);

                        if (Array.isArray(order)) {
                            order = order.map(item => {
                                if (Array.isArray(item.subtraction_list )   || !item.subtraction_list) {
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
                        
                        setTimeout(() => {
                            this.load = false;
                        }, 1000);

                        if (order.length < 10) {
                            this.allLoaded = true;
                            this.loadingType = 2;
                        } else {
                            this.loadingType = 0;
                            this.allLoaded = false;
                        }
                    })
                    .catch(err => {
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
             * 搜索
             */
            _seart() {
                if (this.sreach_value === '') {
                    uni.showToast({
                        title: this.language.order.myorder.search_gjc,
                        duration: 1000,
                        icon: 'none'
                    });
                } else {
                    uni.navigateTo({
                        url: '/pages/order/orderSearch?sreach_value=' + this.sreach_value
                    });
                }
            },
            returnGoods(orders) {
                let str = '';
                if (orders.re_type == 1 || orders.re_type == 2) {
                    str = '退款';
                } else {
                    str = '退换';
                }
                if (orders.r_status == 4) {
                    str += '中';
                } else {
                    str += '成功';
                }

                return str;
            }
        }
    };
</script>

<style lang="less" scoped>
    @import url('../../static/css/order/myOrder.less');
</style>
