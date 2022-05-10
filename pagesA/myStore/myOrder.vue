<template>
    <div class="container">
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <heads :title="language.storeMyOrder.title" :returnR="returnR"></heads>
        <div class="relative">
            <div class='home_navigation'>
                <div class='home_input'>
                    <img class='searchImg' :src="serchimg" alt="">
                    <input type="text" v-model="searchtxt" :placeholder="language.storeMyOrder.searchPlace" placeholder-style="color:#999999;font-size: 26upx" name="sourch"/>
                    <image v-show="searchtxt.length > 0" @click="searchtxt = ''" class="cancel" :src="sc_icon" mode=""></image>
                </div>
                <div class='search_btn' @tap='_search'>{{language.search2.search.search}}</div>
            </div>
            <div class="topTabBar">
                <div class="width_25" @tap="changeTabBar(1)"><div :class="{ active: topTabBar == 1 }">{{language.storeMyOrder.tabList[0]}}</div></div>
                <div class="width_25" @tap="changeTabBar(2)">
                    <div :class="{ active: topTabBar == 2 }">
                        {{language.storeMyOrder.tabList[1]}}
                        <span v-if="payment_num != 0" class="color_ff3">({{ payment_num>99?'99+':payment_num }})</span>
                    </div>
                </div>
                <div class="width_25" @tap="changeTabBar(3)">
                    <div :class="{ active: topTabBar == 3 }">
                        {{language.storeMyOrder.tabList[2]}}
                        <span v-if="send_num != 0" class="color_ff3">({{ send_num>99?'99+':send_num }})</span>
                    </div>
                </div>
                <div class="width_25" @tap="changeTabBar(4)">
                    <div :class="{ active: topTabBar == 4 }">
                        {{language.storeMyOrder.tabList[3]}}
                        <span v-if="return_num && return_num != 0" class="color_ff3">({{ return_num>99?'99+':return_num }})</span>
                    </div>
                </div>
            </div>
            <div v-if="list.length > 0">
                <div v-for="(item, index) in list" :key="index">
                    <div class="date">
                        {{ item.time }}
                        <span v-if="item.time == now">{{language.storeMyOrder.today}}</span>
                    </div>
                    <div class="orderList" v-for="(items, indexs) in item.res" :key="indexs">
                        <div class="orderTitle">
                            <div>{{language.storeMyOrder.orderNo}} {{ items.sNo }}</div>
                            <div v-if="order_type == 'return'">
                                {{items.list[0].prompt}}
                            </div>
                            <div v-else>
                                <span v-if="items.status == 0">{{language.storeMyOrder.obligation}}</span>
                                <span v-else-if="items.status == 1 && items.self_lifting == '0'">{{language.storeMyOrder.waitSend}}</span>
                                <span v-else-if="items.status == 2">{{language.storeMyOrder.waitReceiving}}</span>
                                <!-- <span v-else-if="items.status == 2 && items.self_lifting == '1'">{{language.storeMyOrder.waitSend}}</span> -->
                                <span v-else-if="items.status == 5">{{language.storeMyOrder.done}}</span>
                                <span v-else-if="items.status == 7">{{language.storeMyOrder.orderClosed}}</span>
                                <span v-else>
                                    <span v-if="items.list[0].r_type == 0">{{language.storeMyOrder.returnReview}}</span>
                                    <span v-else-if="items.list[0].r_type == 1 && items.list[0].re_type == 3">{{language.storeMyOrder.agreeReplacement}}</span>
                                    <span v-else-if="items.list[0].r_type == 1">{{language.storeMyOrder.agreeReturn}}</span>
                                    <span v-else-if="items.list[0].r_type == 2">{{language.storeMyOrder.refusedReturn}}</span>
                                    <span v-else-if="items.list[0].r_type == 3">{{language.storeMyOrder.receiveMerchant}}</span>
                                    <span v-else-if="items.list[0].r_type == 4">{{language.storeMyOrder.agreeRefund}}</span>
                                    <span v-else-if="items.list[0].r_type == 5">{{language.storeMyOrder.rejectReturn}}</span>
                                    <span v-else-if="items.list[0].r_type == 8">{{language.storeMyOrder.refusedRefund}}</span>
                                    <span v-else-if="items.list[0].r_type == 9">{{language.storeMyOrder.agreeAndRefund}}</span>
                                    <span v-else-if="items.list[0].r_type == 11">{{language.storeMyOrder.sendMerchandise}}</span>
                                    <span v-else-if="items.list[0].r_type == 12">{{language.storeMyOrder.afterComplete}}</span>
                                </span>
                            </div>
                        </div>
                        <div class="proList" v-for="(itemList, indexList) in items.list" :key="indexList">
                            <div class="proListUp ml_60" @tap="_changeDetail(items.sNo)" v-if="items.status == 1 && items.list.length > 1 && (items.fhRadios && fhRadios)">
                                <div class="fhRadios">
                                    <label class="radio" v-if="itemList.r_status == 1">
                                        <radio class="radio_color" value="1" @tap.stop="_changeFh(itemList.id, index, indexs, indexList)" :checked="itemList.status" />
                                    </label>
                                </div>
                                <div class="proListUpLeft"><img :src="itemList.imgurl" /></div>
                                <div class="proListUpRight">
                                    <div class="proTitle">
                                        <span v-if="itemList.otype == 'pt' || itemList.otype == 'PP'" class="ptCrl">{{language.storeMyOrder.pt}}</span>
                                        <span v-else-if="itemList.otype == 'KJ'" class="ptCrl KJ_color">{{language.storeMyOrder.kj}}</span>
                                        <span v-else-if="itemList.otype == 'JP'" class="ptCrl JP_color">{{language.storeMyOrder.jp}}</span>
                                        <span v-else-if="itemList.otype == 'FX'" class="ptCrl FX_color">{{language.storeMyOrder.fx}}</span>
                                        <span v-else-if="items.self_lifting == '1'" class="ptCrl ZT_color">{{language.storeMyOrder.zt}}</span>
                                        <span v-else-if="itemList.otype == 'MS' ||  itemList.otype == 'PM'" class="ptCrl MS_color">{{language.storeMyOrder.seckill}}</span>
                                        
                                        {{ itemList.p_name }}
                                    </div>
                                    <div class="proPro">{{ itemList.size }}</div>
                                </div>
                                <div class="proSellData">
                                    <div class="sellMoney">
                                        ￥{{ itemList.p_price.toFixed(2) }}
                                        <span v-if="items.allow > 0">
                                            +
                                            <img class="integral-img" :src="integral_hei" />
                                            {{ items.allow }}
                                        </span>
                                    </div>
                                    <div class="sellMoney mt_40">x{{ itemList.num }}</div>
                                </div>
                            </div>
                            <div v-else class="proListUp" @tap="_changeDetail(items.sNo)">
                                <div class="proListUpLeft"><img :src="itemList.imgurl" /></div>
                                <div class="proListUpRight">
                                    <div class="proTitle">
                                        <span v-if="itemList.otype == 'pt' || itemList.otype == 'PP'" class="ptCrl">{{language.storeMyOrder.pt}}</span>
                                        <span v-else-if="itemList.otype == 'KJ'" class="ptCrl KJ_color">{{language.storeMyOrder.kj}}</span>
                                        <span v-else-if="itemList.otype == 'JP'" class="ptCrl JP_color">{{language.storeMyOrder.jp}}</span>
                                        <span v-else-if="itemList.otype == 'FX'" class="ptCrl FX_color">{{language.storeMyOrder.fx}}</span>
                                        <span v-else-if="itemList.otype == 'MS' ||  itemList.otype == 'PM'" class="ptCrl MS_color">{{language.storeMyOrder.ms}}</span>
                                        {{ itemList.p_name }}
                                    </div>
                                    <div class="proPro">{{ itemList.size }}</div>
                                </div>
                                <div class="proSellData">
                                    <div class="sellMoney">
                                        ￥{{ itemList.p_price.toFixed(2) }}
                                        <span v-if="items.allow > 0">
                                            +
                                            <img class="integral-img" :src="integral_hei" />
                                            {{ items.allow }}
                                        </span>
                                    </div>
                                    <div class="sellMoney" style="margin-top: 10rpx;color: #999999;">x{{ itemList.num }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="proListDown ml_60" v-if="items.status == 1 && items.list.length > 1 && (items.fhRadios && fhRadios)">
                            <div class="fhRadios1">
                                <label class="radio"><radio class="radio_color" value="1" @tap="_changeFh1(index, indexs)" :checked="changeFh1" /></label>
                            </div>
                            <div class="font_28">
                                {{language.storeMyOrder.total}}
                                <span class="color_ff0">￥{{ items.z_price.toFixed(2) }}</span>
                                <span class="color_ff0" v-if="items.allow > 0">
                                    +
                                    <img class="integral-img" :src="integral_hong" />
                                    {{ items.allow }}
                                </span>
                            </div>
                            <div class="center"  v-if="order_type != 'return' && items.self_type != 2">
                                <div class="proBtn" @tap="th1(items.sNo)">{{language.storeMyOrder.editOrder}}</div>
                                <div class="proBtn" @tap="_showFhDiv(items.sNo, index, indexs)">{{language.storeMyOrder.delivery}}</div>
                            </div>
                        </div>
                        <div class="proListDown " v-else-if="order_type == 'return'">
                            <div class="returnLeft">
                                <!-- 1、退货退款 2、退款 3、换货 -->
                                <img :src="items.list[0].re_type==1?storeOrder_thtk:items.list[0].re_type==2?storeOrder_tk:storeOrder_th" alt="">
                                {{items.list[0].type}}
                            </div>
                            
                            <div class="center ml_10" v-if="items.self_lifting == '0'">
                                <div class="proBtn" @tap="toReturn(items.sNo, items.list[0].id)" v-if="items.list[0].r_type == 0 || items.list[0].r_type == 3">{{language.storeMyOrder.audit}}</div>
                               <div class="proBtn" v-else @tap="toReDetail(items.sNo, items.list[0].id)">{{language.afterSale.details}}</div>
                            </div>
                            
                        </div>
                        <div class="proListDown " v-else>
                            <div class="font_28">
                                {{language.storeMyOrder.total}}
                                <span class="color_ff0">￥{{ items.z_price.toFixed(2) }}</span>
                                <span class="color_ff0" v-if="items.allow > 0">
                                    +
                                    <img class="integral-img" :src="integral_hong" />
                                    {{ items.allow }}
                                </span>
                            </div>
                            <div class="center ml_10" v-if="items.self_lifting == '0'">
                                <div class="proBtn" @tap="_closeOrder(items.sNo)" v-if="items.status == 0">{{language.storeMyOrder.closeOrder}}</div>
                                <div class="proBtn" @tap="toReturn(items.sNo, items.list[0].id)" v-if="items.list[0].r_type == 0">{{language.storeMyOrder.audit}}</div>
                                <div class="proBtn" @tap="th1(items.sNo)" v-if="((items.status == 0 && !items.pay_time && items.order_status) || items.status == 1) && order_type != 'return'">{{language.storeMyOrder.editOrder}}</div>
                                <div
                                    class="proBtn"
                                    @tap="_showFhDiv1(items.list.length, items.sNo, items.list[0].id, index, indexs, items)"
                                    v-if="(items.status == 1 || ( items.list[0].r_type == 5)) && order_type != 'return'"
                                >
                                    {{language.storeMyOrder.delivery}}
                                </div>
                                <div class="proBtn" v-if="items.status == 2 || (items.list[0].r_type == 3)" @tap="_seeWL(items.sNo)">{{language.storeMyOrder.checkLogistics}}</div>
                                <div class="proBtn" @tap="returnM(items.sNo, items.list[0].id, items.list[0].re_type)" v-if="items.list[0].r_type == 3 && items.list[0].re_type != 3">
                                    {{language.storeMyOrder.refund}}
                                </div>
                                <div
                                    class="proBtn"
                                    @tap="_showFhDiv2(items.list.length, items.sNo, items.list[0].id, index, indexs)"
                                    v-if="items.list[0].r_type == 3 && items.list[0].re_type == 3"
                                >
                                    {{language.storeMyOrder.backSend}}
                                </div>
                                <div class="proBtn" @tap="refuse(items.sNo, items.list[0].id, items.list[0].r_type)" v-if="items.list[0].r_type == 3">{{language.storeMyOrder.refuse}}</div>
                            </div>
                            <div class="center ml_10" v-if="items.self_lifting == '1' && items.status == 0">
                                <!-- 自提 -->
                                <div class="proBtn" @tap="_closeOrder(items.sNo)">{{language.storeMyOrder.closeOrder}}</div>
                                <div class="proBtn" @tap="th1(items.sNo)">{{language.storeMyOrder.editOrder}}</div>
                            </div>
                            <div class="center ml_10" v-if="items.self_lifting == '1' && items.status == 2">
                                <!-- 自提 -->
                                <div class="proBtn" @tap="QRx(items.id)">{{language.storeMyOrder.verificationCode}}</div>
                                
                                <!-- #ifndef H5 -->
                                <div class="proBtn" @tap="QRs(items.id)">{{language.storeMyOrder.scanQRcode}}</div>
                                <!-- #endif -->
                            </div>
                        </div>
                        <div v-if="indexs + 1 != item.res.length" class="hr"></div>
                    </div>
                </div>
                
            </div>
            
            <uni-load-more v-if="listLength > 6" :loadingType="loadingType"></uni-load-more>

            <div v-else-if="nodata == 1" class="noFindDiv">
                <div><img class="noFindImg" :src="noOrder" /></div>
                <span class="noFindText">{{language.storeMyOrder.noOrder}}</span>
            </div>
            
        </div>
        <mpvue-picker
            v-if="show"
            :themeColor="themeColor"
            ref="mpvuePicker"
            :mode="mode"
            :deepLength="deepLength"
            :pickerValueDefault="pickerValueDefault"
            @onConfirm="onConfirm"
            :pickerValueArray="pickerValueArray"
        ></mpvue-picker>
        <div class="mask" v-if="fhDiv">
            <div class="fhDiv">
                <div class="fhDivTitle">
                    <span class="span">{{language.storeMyOrder.information}}</span>
                    <img class="img" @tap="_closeFhDiv()" :src="guanbi" />
                </div>
                <div class="formList">
                    <div class="leftText1"><span>{{language.storeMyOrder.courierName}}</span></div>
                    <div class="rightInput1" @tap="showSinglePicker()">
                        <input type="text" disabled="true" :placeholder-style="placeStyle" v-model="proClass" :placeholder="language.storeMyOrder.select_express" />
                        <div class="jiantouDiv"><img :src="jiantou" alt="" /></div>
                    </div>
                </div>
                <div class="formList">
                    <div class="leftText1"><span>{{language.storeMyOrder.courierNumner}}</span></div>
                    <div class="rightInput1"><input type="text" :placeholder-style="placeStyle" v-model="courier_num" :placeholder="language.storeMyOrder.courierNumner_placeholder" /></div>
                </div>
                <div class="fhSubmit" @tap="_send()">{{language.storeMyOrder.submit}}</div>
            </div>
        </div>
        <div class="mask" v-if="mask_display2">
            <div class="mask_cont">
                <p>{{language.storeMyOrder.refusalReasons}}</p>
                <input type="text" v-model="reason" :placeholder="language.storeMyOrder.refusalPlaceholder" :placeholder-style="placeStyle" />
                <div class="mask_button">
                    <div class="mask_button_left" @tap="_cancel(2)">{{language.storeMyOrder.cancel}}</div>
                    <div @tap="_confirm(2)">{{language.storeMyOrder.confirm}}</div>
                </div>
            </div>
        </div>
        <div class="mask" v-if="mask_display3">
            <div class="mask_cont">
                <p>{{language.storeMyOrder.refundSum}}</p>
                <input type="digit" v-model="refundM" @input="_checkMoney($event)" :placeholder="language.storeMyOrder.refundSum1" :placeholder-style="placeStyle" />
                <div class="mask_cont_div center">
                    <img :src="warnIng" class="img" />
                    <span>{{language.storeMyOrder.refundSumDisc1}} ￥{{ refundNum }} {{language.storeMyOrder.refundSumDisc2}}</span>
                </div>
                <div class="mask_button">
                    <div class="mask_button_left" @tap="_cancel(3)">{{language.storeMyOrder.cancel}}</div>
                    <div @tap="_confirm(3)">{{language.storeMyOrder.confirm}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import mpvuePicker from '../../components/mpvuePicker.vue';
    import {
        LaiKeTui_axios,
        LaiKeTui_changeTabBar,
        LaiKeTui_changeFh,
        LaiKeTui_changeFh1,
        LaiKeTui_showFhDiv,
        LaiKeTui_showFhDiv1,
        LaiKeTui_closeOrder,
        LaiKeTui_returnM,
        LaiKeTui_send,
        LaiKeTui_confirm
    } from '../../static/js/myStore/myOrder.js';

    export default {
        data() {
            return {
                warnIng: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/warnIng.png',
                refundNum: '',
                refundM: '',
                reason: '',
                mask_display1: false,
                mask_display2: false,
                mask_display3: false,
                noOrder: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/noOrder.png',
                loadingType: 0,
                express_id: '',
                title: '我的订单',
                access_id: '',
                topTabBar: 1,
                integral_hong: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/integral.png',
                integral_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/integral_hei.png',
                testImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/yhqBg.png',
                jiantou: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jiantou2x.png',
                guanbi: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/guanbi2x.png',
                storeOrder_th: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/storeOrder_th.png',
                storeOrder_thtk: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/storeOrder_thtk.png',
                storeOrder_tk: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/storeOrder_tk.png',
                serchimg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/searchNew.png',
                sc_icon: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL+'images/icon1/delete2x.png',
                
                changeFh: [],
                changeFh1: false,
                fhRadios: false,
                fhDiv: false,
                kuaidiList: '',
                themeColor: '#007AFF',
                mode: '',
                deepLength: 1,
                pickerValueDefault: [0],
                pickerValueArray: [],
                show: false,
                proClass: '',
                courier_num: '',
                shop_id: '',
                order_type: '',
                list: [],
                page: 1,
                sNo: '',
                fastTap: true,
                payment_num: '',
                return_num: '',
                send_num: '',
                status: '',
                orderList_id: [],
                nodata: 0, //1代表没有数据，-1有数据
                returnR: 9,
                re_type: 1,
                placeStyle: 'color:#b8b8b8;font-size:28upx',
                is_tui: true,
                r_type: 0,
                refund_re_type: 0,
                
                searchtxt: '',
                platform_activities_id: '',
            };
        },
        onLoad(option) {
            this.access_id = uni.getStorageSync('access_id') ? uni.getStorageSync('access_id') : this.$store.state.access_id;
            if (option.platform_activities_id) {
                this.platform_activities_id = option.platform_activities_id
            }
            this.isLogin(()=>{})
            this.status = option.status;
            if (this.status == 'all') {
                this.order_type = '';
                this.topTabBar = 1;
            } else if (this.status == 'dfk') {
                this.order_type = 'payment';
                this.topTabBar = 2;
            } else if (this.status == 'dfh') {
                this.order_type = 'send';
                this.topTabBar = 3;
            } else if (this.status == 'sh') {
                this.order_type = 'return';
                this.topTabBar = 4;
            }
        },
        onShow() {
            this.access_id = uni.getStorageSync('access_id') ? uni.getStorageSync('access_id') : this.$store.state.access_id;
            this.shop_id = uni.getStorageSync('shop_id') ? uni.getStorageSync('shop_id') : this.$store.state.shop_id;
            
            this.page = 1
            this.loadingType = 0
            this._axios();
        },
        methods: {
            _search(){
                this.page = 1
                this.loadingType = 0
                LaiKeTui_axios(this);
            },
            changeLoginStatus() {
                this.access_id = uni.getStorageSync('access_id');
                this._axios();
            },
            changeTabBar(num) {
                this.searchtxt = ''
                this.page = 1
                this.loadingType = 0
                LaiKeTui_changeTabBar(this, num);
            },
            _axios() {
                LaiKeTui_axios(this);
            },
            _changeDetail(id) {
                if(this.order_type == 'return'){
                    return
                }
                
                uni.navigateTo({
                    url: '/pagesA/myStore/order?order_id=' + id
                });
            },
            _changeFh(id, index, index1, index2) {
                LaiKeTui_changeFh(this, id, index, index1, index2);
            },
            _changeFh1(index, index1) {
                LaiKeTui_changeFh1(this, index, index1);
            },
            // 编辑订单
            th1(sNo) {
                uni.navigateTo({
                    url: '/pagesA/myStore/order?editor=1&order_id=' + sNo
                });
            },
            // 发货  单件商品
            _showFhDiv(sNo, index, index1) {
                LaiKeTui_showFhDiv(this, sNo, index, index1);
            },
            // 发货
            _showFhDiv1(length, sNo, id, index, indexs, items) {
                uni.navigateTo({
                    url: '/pagesA/myStore/shipments?id=' + items.sNo
                });
            },
            // 回寄
            _showFhDiv2(length, sNo, id, index, indexs) {
                this.re_type = 3;
                this.orderList_id = id;
                LaiKeTui_showFhDiv1(this, sNo, length, index, indexs);
            },
            // 关闭订单
            _closeOrder(sNo) {
                uni.showModal({
                    title: this.language.showModal.hint,
                    content: this.language.showModal.delOrder,
                    confirmText: this.language.showModal.confirm,
                    cancelText: this.language.showModal.cancel,
                    success: (e)=>{
                        if(e.confirm){
                            LaiKeTui_closeOrder(this, sNo);
                        }
                    }
                })
            },
            // 审核
            toReturn(sNo, order_details_id) {
                // uni.navigateTo({
                //     url: '/pagesA/myStore/storeRefund?sNo=' + sNo + '&order_details_id=' + order_details_id
                // });
                uni.navigateTo({
                    url: '/pagesA/myStore/returnDetail?type=audit&&sNo=' + sNo + '&order_details_id=' + order_details_id
                });
            },
            toReDetail(sNo, order_details_id){
                uni.navigateTo({
                    url: '/pagesA/myStore/returnDetail?sNo=' + sNo + '&order_details_id=' + order_details_id
                });
            },
            // 查看物流
            _seeWL(sNo) {
                let data = {
                    module: 'app',
                    action: 'order',
                    app: 'logistics',
                    id: sNo,
                    access_id: this.access_id,
                    type: '',
                    o_source: 1,
                };

                if (this.source == 1) {
                    data.type = 'pond';
                }

                this.$req.post({ data }).then(res => {
                    let { code, data, message } = res
                    uni.hideLoading();
                    if (code == 200) {
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
                            title: message,
                            duration: 1500,
                            icon: 'none'
                        });
                    }
                });
            },
            // 退款
            returnM(sNo, order_details_id, type) {
                //同意退款
                this.refund_re_type = type;
                LaiKeTui_returnM(this, sNo, order_details_id);
            },
            // 拒绝
            refuse(sNo, order_details_id, type) {
                //拒绝退货
                this.sNo = sNo;
                this.orderList_id = order_details_id;
                this.mask_display2 = true;
                this.r_type = type;
            },
            _closeFhDiv() {
                this.fhDiv = false;
                this.fhRadios = false;
            },
            showSinglePicker() {
                this.show = true;
                this.mode = 'selector';
                this.deepLength = 1;
                this.pickerValueDefault = [0];
                this.$refs.mpvuePicker.show();
            },
            // 物流提交
            _send() {
                LaiKeTui_send(this);
            },
            // 拒绝理由取消
            _cancel(type) {
                if (type == 1) {
                    this.mask_display1 = false;
                } else if (type == 2) {
                    this.mask_display2 = false;
                } else if (type == 3) {
                    this.mask_display3 = false;
                }
            },
            // 拒绝理由提交
            _confirm(type) {
                LaiKeTui_confirm(this, type);
            },
            // 请输入退款金额
            _checkMoney(e) {
                if (Number(e.target.value) > this.refundNum) {
                    uni.showToast({
                        title: this.language.storeMyOrder.maximumTips,
                        duration: 1500,
                        icon: 'none'
                    });
                    this.refundM = this.refundNum;
                }
            },
            // 选择快递公司
            onConfirm(e) {
                this.proClass = e.label;
                this.show = false;
                this.express_id = this.kuaidiList[e.index[0]].id;
            },
            th() {
                uni.navigateTo({
                    url: '/pagesA/myStore/storeRefund'
                });
            },
            // 跳转至手动输入验证码页面
            QRx(id) {
                uni.navigateTo({
                    url: '/pagesA/myStore/QRdraw?order_id=' + id
                });
            },
            // 自提扫码
            QRs(id) {
                // #ifndef H5
                uni.scanCode({
                    success: (rew) => {
                        if (!rew.result) {
                            return;
                        }
                        uni.showLoading({
                            title: this.language.toload.load
                        });
                        var data = {
                            module: 'app',
                            action: 'mch',
                            m: 'sweep_extraction_code',
                            access_id: this.access_id,
                            shop_id: this.shop_id,
                            order_id: id,
                            extraction_code: rew.result.join(',')[0]
                        };

                        this.$req.post({data}).then(res=>{
                            let { code, data, message } = res
                            uni.hideLoading();
                            if (code == 200) {
                                me.order_id = data.order_id;
                                me.p_price = data.p_price;
                                me.sNo = data.sNo;
                                uni.showToast({
                                    title: message,
                                    duration: 1500,
                                    icon: 'none'
                                });
                                // 成功后跳转 QRsuccess页面
                                uni.redirectTo({
                                    url: 'QRsuccess?p_price=' + me.p_price + '&sNo=' + me.sNo + '&order_id=' + me.order_id
                                });
                            } else {
                                uni.showToast({
                                    title: message,
                                    duration: 1500,
                                    icon: 'none'
                                });
                            }
                        })
                    }
                });
                // #endif
                // #ifdef H5
                uni.showToast({
                    icon: 'none',
                    title: this.language.storeMyOrder.noScan
                });
                // #endif
            }
        },
        onReachBottom: function() {
            if (this.loadingType != 0) {
                return;
            }
            this.loadingType = 1;
            
            this.page += 1;
            
            var data = {
                module: 'app',
                action: 'mch',
                m: 'my_order',
                access_id: this.access_id,
                shop_id: this.shop_id,
                order_type: this.order_type,
                page: this.page
            };

            this.$req.post({ data }).then(res => {
                let { code, data, message } = res;
                
                if (data.list.length > 0) {
                    
                    if (this.order_type == 'return') {
                        data.list.filter(items=>{
                            items.res.filter(item=>{
                                if(!Array.isArray(item[0].list)){
                                    item[0].list = [item[0].list]
                                }
                            })
                        })
                        
                        for (let i =0; i < data.list.length; i ++ ) {
                            for (let i1 =0; i1 < data.list[i].res.length; i1 ++ ) {
                                data.list[i].res[i1] = data.list[i].res[i1][0]
                            }
                        }
                        this.list.push(...data.list)
                    }else{
                        this.list = this.list.concat(data.list);
                    }
                    
                    this.loadingType = 0;
                } else {
                    this.loadingType = 2;
                }
            });
        },
        computed: {
            listLength(){
                let num = 0
                
                this.list.filter(items=>{
                    num += items.res.length
                })
                
                return num
            },
            now: function() {
                var year = new Date().getFullYear();
                var month = new Date().getMonth() + 1;
                var date = new Date().getDate();
                var date1 = year + '-' + month + '-' + date;
                return date1;
            }
        },
        components: {
            mpvuePicker
        }
    };
</script>

<style lang="less">
    @import url('../../static/css/myStore/myOrder.less');
</style>
