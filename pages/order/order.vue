<template>
    <div class="order">
        <heads :title="language.order.order.title" :returnR="returnR" :types="types" :order_type="order_type"></heads>
        <toload v-if="load"></toload>
        <div v-else style="position: relative;">
            <div class="order_zt" :style="order.status != 2 ? 'height:156upx' : ''" style="flex-direction: column;justify-content: center;">
                <p
                    v-text="
                        order.status == 0
                            ? language.order.order.state[0]
                            : order.status == 1
                            ? language.order.order.state[1]
                            : order.status == 2
                            ? language.order.order.state[2]
                            : order.status == 3 || order.status == 5 || order.status == 8
                            ? language.order.order.state[3]
                            : order.status == 7 || order.status == 6
                            ? language.order.order.state[4]
                            : order.status == 4
                            ? cancelGoods
                            : order.status == 12
                            ? language.order.order.state[5]
                            : order.status == 10 || order.status == 11
                            ? language.order.order.state[6]
                            : order.status == 9
                            ? language.order.order.state[7]
                            : ''
                    "
                ></p>
                <!-- <p>等待发货</p> -->
                <div class="order_wl" v-if="order_wl && order.status == 2">
                    <div>
                        <div v-if="logistics.length">
                            <p class="order_puls" v-if="logistics.length == 1 && logistics[0].list.length >= 1">{{language.order.order.logistics[0]}}: {{ logistics[0].list[0].context }}</p>
                            <p class="order_puls" v-if="logistics.length > 1">{{language.order.order.logistics[1]}}{{ logistics.length }}{{language.order.order.logistics[2]}}</p>
                            <p class="order_time">{{ logistics[0].deliver_time }}</p>
                        </div>
                        <p class="order_p" v-if="!logistics">{{language.order.order.logistics[3]}}</p>
                    </div>
                </div>
                <div class="order_p" v-else>
                    <p
                        v-text="
                            order.status == 4 && cancelGoods != '审核中' && cancelGoods != '审核通过' && cancelGoods != '退货完成' && cancelGoods != '已退款'
                                ? language.order.order.Reasons+'：' + cancelGoodsReason
                                : order.status == 6 && order.list && order.list[0].re_type == 0 && order.hand_del == 1
                                ? language.order.order.order_cancel
                                : order.status == 6 && order.list && order.list[0].re_type == 0 && order.hand_del == 0
                                ? language.order.order.Order_timeout
                                :order.status == 1
                                ? '等待发货'
                                : ''
                        "
                    ></p>
                </div>
               <p class="order_p" v-if="order_zt && order.status == 0">{{ order_zt }}</p>
                <image class="orderbg" :src="order.status == 2 ? orderbg_dsh : orderbg_qt" mode="aspectFit"></image>
            </div>
            <div class="address_one">
                <span class="address_one_a">{{ order.name }}</span>
                <span class="address_one_b">{{ order.mobile }}</span>
                <p>{{ `${order.omsg.sheng}${order.omsg.shi}${order.omsg.xian}${order.address}` }}</p>
            </div>

            <ul class="order_goods">
                <li class="order_goods_lis lis_one" v-for="items,indexs of order.stores">
                    <div class="order_one" @click="_goStore(items.shop_id)">
                        <img :src="storeImg" />
                        {{ items.shop_name }}
                        <img class="dd-boxa-img" :src="jiantou" />
                    </div>

                    <template v-for="(item, index) of order.list">
                        <template v-if="item.shop_id == items.shop_id">
                            <div class="order_two" :key="index">
                                <img :src="item.imgurl" />
                                <div class="order_two_a" @tap="_goods(item.p_id,item.recycle,item.pluginId)">
                                    <p class="order_p_name">{{ item.p_name }}</p>
                                    <p class="color_one">{{ item.size }}</p>
                                </div>
                                <div>
                                    <p v-if="order.status == 0 && (order.otype == 'pt' || order.otype == 'PP')  ">￥{{ Number(order.product_total2).toFixed(2) }}</p>
                                    <p v-else-if="order.otype == 'KJ'">￥{{ Number(order.omsg.spz_price).toFixed(2) }}</p>
                                    <p v-else-if="order.otype == 'JP'">￥{{ Number(order.jp.jp_price).toFixed(2) }}</p>
                                    <p v-else-if="order.otype == 'IN'" style="width: 200rpx;">
                                        <span v-if="item.p_price > 0">￥{{ Number(item.p_price).toFixed(2) }}+</span>
                                        <img :src="integral_hei" class="integral_hei integral-img" style="padding-top: 4rpx;" />
                                        {{ order.list[0].after_discount }}
                                    </p>
                                    <p v-else>￥{{ Number(item.p_price).toFixed(2) }}</p>
                                    <p class="color_two">x{{ item.num }}</p>
                                    <div class="btn">
                                        <div
                                            class="retreat sqtk"
                                            v-if="item.refundAmtBtn && item.refundAmtBtn && item.r_status !== 5 && item.r_status !== 0"
                                            @tap="_after($event, item.id, item.r_content, item.r_status)"
                                        >
                                            {{language.order.order.button[0]}}
                                        </div>
                                        <!-- <div class="retreat" v-if="item.s_type == 1" @click="navTo('/pagesA/afterSale/afterDetail?order_id=' + item.id + '&id=' + item.returnId + '&pid=' + item.p_id)">
                                            {{language.order.order.button[4]}}
                                        </div> -->
                                        <div class="order_goods_adiv">
                                            <div class="retreat" v-if="item.refundShowBtn" @click="navTo('/pagesA/afterSale/afterDetail?order_id=' + item.id + '&id=' + item.returnId + '&pid=' + item.p_id)">
                                                {{language.order.order.button[4]}}
                                            </div>
                                            <!-- <div
                                                class="retreat order_goods_adiv_b"
                                                v-if="(item.r_status !== 1 && item.r_status !== 2) && item.s_type != 1 && status !== 0 && (item.r_status != 7 && order.otype != 'IN'&& order.otype != 'MS' && order.otype != 'VI' && user_can_after && item.s_type == 0 && order.self_lifting == 0)"
                                                @tap="_after($event, item.id, item.r_content, item.r_status, item.comments_type)"
                                            >
                                                {{language.order.order.button[1]}}
                                            </div> -->
                                            <div
                                                class="retreat order_goods_adiv_b hhh"
                                                v-if="item.refund && item.r_status == 5"
                                                @tap="_after($event, item.id, item.r_content, item.r_status, item.comments_type)"
                                            >
                                                {{language.order.order.button[1]}}
                                            </div>
                                            <div class="retreat after-finish" v-if="item.s_type != 1 && (item.r_status == 7 && order.status != 7)">
                                                {{language.order.order.button[5]}}
                                            </div>
                                            <div class="retreat" v-if="item.comments_type == 1 && !kanjia && order.otype != 'JP' && item.r_status != 7" @tap="comment(item.id, item.comments_type)">{{language.order.order.button[2]}}</div>
                                            <div class="retreat" v-if="item.comments_type == 2 && !kanjia && order.otype != 'JP' && item.r_status != 7" @tap="comment(item.id, item.comments_type)">{{language.order.order.button[3]}}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="complete complete_b" :key="index+'com'" v-if="item.r_status == 4 && item.r_type == 2 && display_t">
                                <div class="complete_qiandao">
                                    <img class="complete_img" :src="guanbi" @tap="_onafter" />
                                    <p>{{language.order.order.Reasons}}：{{ rr_content }}</p>
                                </div>
                            </div>
                            <div class="" :key="index+'com_1'"></div>
                        </template>
                    </template>
                    <div class="subtraction_list"  v-if="subtraction_list">
                        <div class="order_two" >
                            <img :src="subtraction_list.imgurl" />
                            <div class="order_two_a" >
                                <span style="color: red;">【{{language.order.order.gift}}】</span>
                                {{ subtraction_list.product_title }}
                            </div>
                            <div>
                                <p>￥0.00</p>
                                <p class="color_two">x{{ subtraction_list.num }}</p>
                            </div>
                        </div>
                        <div class=""></div>
                    </div>
                </li>
                <li class="order_last">
                    <div class="order_color">
                        <p>{{language.order.order.total}}</p>
                        <p v-if="order.status == 0 && (order.otype == 'pt' || order.otype == 'PP')">￥{{ Number(order.product_total2).toFixed(2) }}</p>
                        <p v-else-if="order.otype == 'IN'" class="order_color_a">
                            <span v-if="order.product_total > 0">￥{{ order.product_total.toFixed(2) + ' + ' }}</span>
                            <img :src="integral_hui" class="order_color_a_b integral-img" />
                            {{ order.allow }}
                        </p>
                        <p v-else-if="order.otype == 'KJ'">￥{{ Number(order.omsg.spz_price).toFixed(2) }}</p>
                        <p v-else-if="order.otype == 'JP'">￥{{ Number(order.jp.jp_price).toFixed(2) }}</p>
                        <p v-else>￥{{ Number(order.product_total).toFixed(2) }}</p>
                    </div>
                    <template v-if="otype == 'GM' || otype == '' || otype == 'VI'">
                        <div
                            class="order_color"
                            v-if="order.coupon_price>0"
                        >
                            <p>{{language.order.order.Discount[0]}}</p>
                            <p>
                                ￥{{ Number(order.coupon_price).toFixed(2) }}
                            </p>
                        </div>
                        <div
                            v-if="order.discount_type"
                            class="order_color"
                        >
                            <p>{{order.discount_type}}{{language.order.order.Discount[1]}}</p>
                            <p>
                                ￥{{ Number(order.preferential_amount).toFixed(2) }}
                            </p>
                        </div>
                       <!-- <div
                            v-if="order.grade_rate != 1 && order.grade_rate != '1.00' "
                            class="order_color"
                        >
                            <p>{{language.order.order.Discount[2]}}</p>
                            <p>
                                ￥{{ Number(order.grade_rate_amount).toFixed(2) }}
                            </p>
                        </div> -->
                    </template>
                    <template v-else>
                        <div
                            class="order_color"
                            v-if="
                                is_distribution != 1 &&
                                    order.comm_discount == 1 &&
                                    otype != 'JP' &&
                                    otype != 'KJ' &&
                                    otype != 'pt' &&
                                    otype != 'pp' &&
                                    otype != 'MS' &&
                                    otype != 'PM' &&
                                    otype != 'vipzs' &&
                                    otype != 'VIP'
                            "
                        >
                            <p>{{language.order.order.Discount[3]}}</p>
                            <p>
                                ￥{{ Number(order.coupon_price).toFixed(2) }}
                                <span v-if="isDiscount">{{ order.coupon_name }}</span>
                            </p>
                        </div>
                        <div class="order_color" v-if="order.comm_discount < 1 && order.comm_discount > 0 && otype != 'MS'">
                            <p>{{language.order.order.Discount[4]}}</p>
                            <p>{{ order.comm_discount * 10 }}{{language.order.order.fracture}}</p>
                        </div>
                        <div class="order_color" v-if="order.grade_rate < 1 && order.grade_rate > 0 && otype != 'vipzs' && otype != 'VIP' && otype != 'MS'">
                            <p>{{language.order.order.Discount[5]}}</p>
                            <p>{{ order.grade_rate * 10 }}{{language.order.order.fracture}}</p>
                        </div>
                        <div
                            class="order_color"
                            v-if="
                                is_distribution != 1 &&
                                    order.comm_discount == 1 &&
                                    otype != 'KJ' &&
                                    otype != 'JP' &&
                                    otype != 'pt' &&
                                    otype != 'pp' &&
                                    otype != 'MS' &&
                                    otype != 'PM' &&
                                    otype != 'vipzs' &&
                                    otype != 'VIP'
                            "
                        >
                            <p>{{language.order.order.Discount[6]}}</p>
                            <p>{{ order.coupon_activity_name }}</p>
                        </div>
                    </template>
                    <div class="order_color" v-if="otype != 'VI'">
                        <p>{{language.order.order.freight}}</p>
                        <p>￥{{ Number(order.z_freight).toFixed(2) }}</p>
                    </div>
                    <div class="order_color" v-if="order.remarks">
                        <p>{{language.order.order.Order_notes}}</p>
                        <p class="order_color_b">{{ order.remarks }}</p>
                    </div>
                    <div>
                        <p class="margin-top-zj mt_0">{{language.order.order.order_total}}</p>
                        <p class="margin-top-zj mt_0" v-if="order.otype != 'IN'">￥{{ Number(order.z_price).toFixed(2) }}</p>
                        <p class="margin-top-zj margin-top-flex mt_0" v-else>
                            <span v-if="order.z_price > 0">￥{{ order.z_price.toFixed(2) }}+</span>
                            <img :src="integral_hei" class="integral_hei integral-img" />
                            {{ order.allow }}
                        </p>
                    </div>
                </li>
                <li class="order_pay_li mt_0"></li>
                <li class="order_pay">
                    <p>{{language.order.order.Actual_payment}}</p>
                    <p class="z_price_bold" v-if="order.otype != 'IN'">￥{{ Number(order.z_price).toFixed(2) }}</p>
                    <p class="z_price_color" v-else>
                        <span v-if="order.z_price > 0">￥{{ order.z_price.toFixed(2) }}+</span>
                        <img :src="integral_hong" class="integral_hei integral-img" />
                        {{ order.allow }}
                    </p>
                </li>
                <li class="order_pay_li_a"></li>
            </ul>
            <div class="order_xx">
                <div>
                    <p>{{language.order.order.order_number}}：{{ order.sNo }} </p>
                    <input id="order_no" disabled="disabled" class="order_no_opacity" type="hidden" v-model="message" />
                    <p>{{language.order.order.Order_time}}：{{ order.add_time }}</p>
                </div>
                <div class="order_border" type="button" @tap="onCopy()">{{language.order.order.copy}}</div>
            </div>
            <div class="order_foot-wrap" style="height: 98rpx;">
                <div class="order_foot">
                    <btns
                        :status="status"
                        :isExtract="isExtract"
                        :self_lifting="self_lifting"
                        :sale_type="sale_type"
                        :delivery_status="delivery_status"
                        :orde_id="orde_id"
                        :otype="otype"
                        :sNo="sNo"
                        :goodsNum="order.list.length"
                        form="order"
                        @refresh="_axios"
                    />
                </div>
            </div>
            
            <tqm></tqm>
        </div>
    </div>
</template>

<script>
    import {
        _after,
        _axios,
    } from '../../static/js/order/order.js';
    // #ifdef H5
    import {copyText} from '@/common/util.js';
    // #endif
    import {mapMutations} from 'vuex';
    import btns from "@/pages/order/components/btns";
    import tqm from "@/pages/order/components/tqm";

    export default {
        data() {
            return {
                returnR: '',
                types: '',
                password_status: '',
                integral_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/integral_hui.png',
                integral_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/integral_hei.png',
                integral_hong: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/integral.png',
                finish2x: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/finish2x.png',
                storeImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/store.png',
                guanbiImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/close2x.png',
                quan_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/xuanzehui2x.png',
                quan_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/xuanzehei2x.png',
                guanbi: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/qiandaoguanbi2x.png',
                jiantou: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jiantou2x.png',
                orderbg_dsh: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/orderbg_dsh.png',
                orderbg_qt: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/orderbg_qt.png',
                notWallte: false,
                useWallte: false,
                iscan: '',
                focus: true,
                a_type: '',
                msg: '',
                remarks: '', //订单备注
                frist_show: true,
                msgLength: 0,
                digits: ['', '', '', '', '', ''],
                pay_index: -1,
                can_pay: true,
                pay_style: '', //支付方式
                content: '是否抵扣余额？',
                enterless: true,
                z_price_: '', //最初默认总价
                title: '订单详情',
                orde_id: '', //订单ID
                showBtn: true,
                sale_type: '',
                delivery_status: '',
                self_lifting: '',
                order: '',
                order_wl: '', //物流信息显示状态
                order_zt: '', //
                time_c: '', //待付款倒计时，时间差
                time_D: '', //待付款倒计时，天
                time_H: '', //待付款倒计时，小时
                time_M: '', //待付款倒计时，分
                time_s: '', //待付款倒计时，秒
                message: '',
                stau_num: 0, //提醒发货
                orderInfo: [], //订单信息
                count: '',
                load: true,
                user_can_open: '', //是否能够继续开团
                user_can_can: '', //是否能够继续参团
                user_can_after: '', //是否申请售后
                logistics: [],
                display_t: false,
                rr_content: '',
                sNo: '',
                fastTap: true,
                otype: '', //订单类型
                endpay: '', //剩余支付
                pttype: '', //剩余支付
                // gstatus:'',
                ordermsg: '', //订单信息
                p_id: '', //产品id
                kanjia: false,
                firstFlag: true,
                head: true, //头部切换
                r_status_: '',
                status: '',
                isExtract: '',
                has_status: false,
                cancelGoods: '', //退货中的状态
                cancelGoodsReason: '', //退货原因
                flag: false,
                is_remove_order: false,
                is_distribution: 0,
                is_end: false, //拼团活动是否结束（true结束 false未结束）
                axios_times: 0,

                subtraction_list: null,
                p_sNo: 0,
                group: 0 ,// 是否是拼团订单,
                
                order_type: ''
            };
        },
        computed: {
            //是否显示折扣
            isDiscount: function() {
                if (this.order.coupon_name) {
                    if (this.order.coupon_name == '(0折)') {
                        return 0;
                    } else {
                        return 1;
                    }
                }
            }
        },
        components: {
            btns,
            tqm
        },
        onLoad(option) {
            console.log(option)

            this.order_type = option.order_type
            this.orde_id = option.order_id;
            this.group = option.group;
            if (option.a_type == 1) {
                this.a_type = 1;
            }
            if (option.returnR != undefined) {
                this.returnR = option.returnR;
                this.types = option.types
            }
     
            // #ifdef H5
            if (option.mweb == 1) {
                history.pushState(null, null, document.URL);
                window.addEventListener('popstate', function () {
                    history.pushState(null, null, document.URL);
                });
            }

            // #endif

           

            this.r_status_ = option.status;
            if (this.r_status_ != '') {
                this.has_status = true;
            }
        },
        onShow() {
            _axios(this);
        },
        beforeDestroy () {
            clearInterval(this.timer);
            clearInterval(this.setTime);
        },
        methods: {
            _axios () {
                _axios(this);    
            },
            _goStore(shop_id) {
                uni.navigateTo({
                    url: '/pagesA/store/store?shop_id=' + shop_id
                });
            },
            _navigateTo(url) {
                uni.navigateTo({
                    url
                });
            },
            ...mapMutations({
                cart_id: 'SET_CART_ID',
                order_id: 'SET_ORDER_ID',
                address_id: 'SET_ADDRESS_ID',
                pro_id: 'SET_PRO_ID'
            }),
            onCopy: function() {
                var me = this
                // #ifndef H5
                uni.setClipboardData({
                    data: this.message,
                    success: function(res) {
                        uni.showToast({
                            title: me.language.order.order.copy_success,
                            duration: 1500,
                            icon: 'none'
                        });
                    }
                });
                // #endif
                // #ifdef H5
                copyText('', this.message);
                // #endif
            },
            comment(order_details_id, comments_type) {
                if (comments_type == 1) {
                    uni.navigateTo({
                        url: '/pages/evaluate/evaluating?order_details_id=' + order_details_id + '&num=all'
                    });
                } else {
                    uni.navigateTo({
                        url: '/pages/evaluate/evaluating?order_details_id=' + order_details_id + '&add=true&num=all'
                    });
                }
            },
            _after(e, id, content, r_status, comments_type) {
                _after(e, id, content, r_status, this, comments_type);
            },
            _onafter() {
                this.display_t = false;
            },
            _goods(id,recycle,pluginId) {
                if(this.otype && (this.otype == 'MS' || this.otype == 'IN')) {
                    return
                }
				if(recycle == 1){
					uni.showToast({
						title: this.language.order.order.goodHasDel,
						icon: 'none'
					})
					return
				}
                if (this.order.otype == 'integral') {
                    uni.navigateTo({
                        url: '/pagesB/integral/integral_detail?pro_id=' + this.p_sNo
                    })
                    return
                }
                
                if (this.order.otype == 'MS') {
                    uni.navigateTo({
                        url: '/pagesB/seckill/seckill_detail?pro_id=' + this.order.list[0].p_id + '&navType=' + this.order.status + '&id=' + this.order.list[0].pluginId + '&type=MS'
                    })
                    return
                }

                if (this.order.otype == 'FX') {
                    uni.navigateTo({
                        url: '/pages/goods/goodsDetailed?pro_id=' + id + '&isDistribution=true&toback=true' + '&fx_id=' + pluginId
                    })
                    return
                }
                
                uni.navigateTo({
                    url: '/pages/goods/goodsDetailed?pro_id=' + id
                });
            }
        },
        watch: {
            time_c(newvalue, oldvalue) {
                if (newvalue == 0) {
                    _axios(me);
                }
            }
        }
    };
</script>

<style lang="less" scoped>
    @import url('../../static/css/order/order.less');
</style>
