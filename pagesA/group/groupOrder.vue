<template>
    <div>

        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>

        <div>
            <div class='position_head'>
                <heads :title='language.groupOrder.title'></heads>
                <!--   导航栏      -->
                <div style='height: 94rpx;'>
                    <ul class='order_header'>
                        <li class='header_li' :class="{header_border:status_id==index}" v-for='(item,index) in language.groupOrder.header'
                            :key='item.id'
                            @tap="_header_index(index)">{{item}}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!--   订单列表     -->

        <toload :load="load">
            <!-- 微信小程序 -->
            <!-- #ifdef MP-WEIXIN -->
            <div class="yh-order" v-if='order.length'>

                <ul class='order_goods' v-for='(item,index) in order' :key="index">
                    <img class='img_zt' :src="item.status==12?img_cg:img_sb"
                         v-if='item.status==12||item.status==11||item.status==10'>
                    <li class='order_one'>
                        <!-- <p style='color: #999999;'>订单号：{{item.sNo}}</p> -->

                        <p @tap='_goStore(item.shop_id)' class='shopName'>
                            <img :src="storeImg">{{item.shop_name}}
                            <img :src="jiantou" class="yh-jiantouimg">
                        </p>
                        <p class="red"
                               v-text="item.status==7 ? language.groupOrder.Failed:'' || item.status==0 ? language.groupOrder.obligation:(item.status==1?language.groupOrder.dfh_order:(item.status==2?language.groupOrder.yfh_order:(item.status==3?language.groupOrder.dpj_order:(item.status==9?language.groupOrder.spelling:(item.status == 11 && !item.refund?language.groupOrder.refunding:(item.status==10?language.groupOrder.noRefund:(item.status==11?language.groupOrder.refunded:(item.status==6?language.groupOrder.closed:(item.status==12?language.groupOrder.complete:(item.status==5?language.groupOrder.complete:''))))))))))"></p>
                        
                        <!-- <p class="red" v-if="item.sale_type==0"
                           v-text="item.status==7 ? language.groupOrder.Failed:'' || item.status==0 ? language.groupOrder.obligation:(item.status==1?language.groupOrder.dfh_order:(item.status==2?language.groupOrder.yfh_order:(item.status==3?language.groupOrder.dpj_order:(item.status==9?language.groupOrder.spelling:(item.status == 11 && !item.refund?language.groupOrder.refunding:(item.status==10?language.groupOrder.noRefund:(item.status==11?language.groupOrder.refunded:(item.status==6?language.groupOrder.closed:(item.status==12?language.groupOrder.complete:(item.status==5?language.groupOrder.complete:''))))))))))"></p>
                        <p class="red" v-else="item.status==1">{{language.groupOrder.sale_button[0]}}</p>
                        <p class="red" v-else="item.status==2">{{language.groupOrder.sale_button[1]}}</p>
                        <p class="red" v-else="item.status==3">{{language.groupOrder.sale_button[2]}}</p> -->
                        
                    </li>

                    <li class='order_two' v-for='(orders,index1) in item.list' :key="index1"
                        @tap="_navigateTo(item.status,item.id,item.sNo,item.otype,item.can_open)">
                        <img :src="orders.imgurl"/>
                        <div style="margin-right: 40rpx;width: 58%;">
                            <p class='order_p_name' style="height: 80rpx;">{{orders.p_name}}</p>
                            <p class='color_one'>{{orders.size}}</p>
                        </div>
                        <div>
                            <p>￥{{orders.p_price}}</p>
                            <p class='color_two'>x{{orders.num}}</p>
                            <div class='retreat' v-if="orders.r_status==4||orders.r_status==6&&orders.re_type!=0"
                                :rich-text="orders.r_status==4?language.groupOrder.returnOf:(orders.r_status==6&&orders.re_type!=0?language.groupOrder.returnComplete:'')"></div>
                        </div>
                    </li>
                    <li class='order_last'>
                        <div>
                            <span>{{language.groupOrder.together}}{{item.sum}}{{language.groupOrder.items}}</span>
                            <span class='order_all'>{{language.groupOrder.Total}}<span>￥{{item.z_price}}</span></span>
                        </div>
                        <div class='last_right'>
                            
                            <!-- <div
                                @tap='_buttonLeft($event,item.id,item.sNo,order.attribute_id,order.p_id,index,item.status,item.delivery_status)'
                                v-text="item.status==0? leftText[0]:(item.status==2||item.status==3||item.status==5?leftText[1]:(item.status==7||item.status==6||item.status==11||item.status==12?leftText[2]:(item.status==9||item.status==10||item.status==1?leftText[4]:'')))"></div>
                            <div v-if='item.status!=10&&item.status!=0&&item.status!=6&&item.status!=7&&item.status!=12'
                                 @tap='_buttonRight($event,item.id,item.sNo,order.attribute_id,order.p_id,index,item.status,item.delivery_status,item.list)'
                                 :class='(item.status==1||item.status==9||item.status==11)&&item.delivery_status==1?"a1":""'>
                                {{item.status==1?rightText[1]:(item.status==2?rightText[2]:(item.status==3?rightText[3]:(item.status==4?rightText[4]:(item.status==5?rightText[5]:(item.status==9?rightText[8]:(item.status==11?rightText[7]:''))))))}}
                            </div> -->
                            
                            
                            <!-- 拼团成功 left -->
                             <div v-if="item.status==1" @tap='_buttonLeft($event,item.id,item.sNo,order.attribute_id,order.p_id,index,item.status,item.delivery_status)'>
                                 <!-- 拼团详情 -->{{language.groupOrder.leftText[4]}}
                             </div>
                             <div v-else-if="item.status==0" @tap='_buttonLeft($event,item.id,item.sNo,order.attribute_id,order.p_id,index,item.status,item.delivery_status)'>
                                <!-- 取消订单 -->{{language.groupOrder.leftText[0]}}
                             </div>
                             
                             <div v-else-if="item.status==9" @tap='_buttonLeft($event,item.id,item.sNo,order.attribute_id,order.p_id,index,item.status,item.delivery_status)'>
                                 <!-- 拼团详情 -->{{language.groupOrder.leftText[4]}}
                             </div>
                             
                             <div v-else-if="item.status==11" @tap='_buttonLeft($event,item.id,item.sNo,order.attribute_id,order.p_id,index,item.status,item.delivery_status)'>
                                 <!-- 删除订单 -->{{language.groupOrder.leftText[2]}}
                             </div>
                             
                             <div v-else-if="item.status==7" @tap='_buttonLeft($event,item.id,item.sNo,order.attribute_id,order.p_id,index,item.status,item.delivery_status)'>
                                 <!-- 删除订单 -->{{language.groupOrder.leftText[2]}}
                             </div>
                             
                             
                             <!-- 拼团成功 right -->
                             
                             <div v-if="item.status==1" @tap='_buttonRight($event,item.id,item.sNo,order.attribute_id,order.p_id,index,item.status,item.delivery_status,item.list)'>
                                 <!-- 查看订单 -->{{language.group_end.checkOrder}}
                             </div>
                             
                            <!-- <div v-if="item.status==9" :data-clipboard-text='shareHref' id="copyy" @tap='copy(item.sNo,item.activity_no)'>
                                 邀请好友
                             </div> -->
                             
                             <div v-else-if="item.status==11" @tap='_buttonRight($event,item.id,item.sNo,order.attribute_id,order.p_id,index,item.status,item.delivery_status,item.list)'>
                                 <!-- 拼团详情 -->{{language.groupOrder.leftText[4]}}
                             </div>
                             <div v-else-if="item.status==7" @tap='_buttonRight($event,item.id,item.sNo,order.attribute_id,order.p_id,index,item.status,item.delivery_status,item.list)'>
                                 <!-- 再次购买 -->{{language.groupOrder.rightText[6]}}
                             </div>
                             
                             <div @tap="navTo('/pages/order/order_payment?order_id=' + item.id + '&showPay=true&ordertype='+item.otype+'&is_pt=1')" v-if="item.status == 0">
                                 {{rightText[0]}}<!-- 立即付款 -->
                             </div>
                            
                        </div>
                    </li>
                    <li class="yh-line"></li>
                </ul>
                <uni-load-more v-if='order.length>10' :loadingType="loadingType"></uni-load-more>
            </div>
            <!-- #endif -->

            <!-- #ifndef MP-WEIXIN -->
            <div class="yh-order" v-if='order.length'>

                <ul class='order_goods' v-for='(item,index) in order' :key="index">
                    <img class='img_zt' :src="item.status==12?img_cg:img_sb"
                         v-if='item.status==12||item.status==11||item.status==10'>
                    <li class='order_one'>
                        <!-- <p style='color: #999999;'>订单号：{{item.sNo}}</p> -->
                        <p @tap='_goStore(item.shop_id)' class='shopName'>
                            <img :src="storeImg">{{item.shop_name}}
                            <img :src="jiantou" class="yh-jiantouimg">
                        </p>
                        <p class="red"
                           v-text="item.status==7 ? language.groupOrder.Failed:'' || item.status==0 ? language.groupOrder.obligation:(item.status==1?language.groupOrder.dfh_order:(item.status==2?language.groupOrder.yfh_order:(item.status==3?language.groupOrder.dpj_order:(item.status==9?language.groupOrder.spelling:(item.status == 11 && !item.refund?language.groupOrder.refunding:(item.status==10?language.groupOrder.noRefund:(item.status==11?language.groupOrder.refunded:(item.status==6?language.groupOrder.closed:(item.status==12?language.groupOrder.complete:(item.status==5?language.groupOrder.complete:''))))))))))"></p>
                    </li>
                    <view style="border-top: 1px solid #E6E6E6;"></view>
                    <li class='order_two' v-for='(orders,index1) in item.list' :key="index1"
                        @tap="_navigateTo(item.status,item.id,item.sNo,item.otype,item.can_open)">
                        <img :src="orders.imgurl"/>
                        <div style="margin-right: 40rpx;width: 58%;">
                            <p class='order_p_name' style="height: 80rpx;">{{orders.p_name}}</p>
                            <p class='color_one'>{{orders.size}}</p>
                        </div>
                        <div>
                            <p>￥{{orders.p_price}}</p>
                            <p class='color_two'>x{{orders.num}}</p>
                            <div class='retreat' v-if="orders.r_status==4||orders.r_status==6&&orders.re_type!=0"
                                 :rich-text="orders.r_status==4?language.groupOrder.returnOf:(orders.r_status==6&&orders.re_type!=0?language.groupOrder.returnComplete:'')"></div>
                            <!--<div class='retreat' v-if="orders.r_status==1">申请售后</div>-->
                        </div>
                    </li>
                    <view style="border-top: 2upx solid #E6E6E6;margin-left: 30rpx;"></view>
                    <li class='order_last'>
                        <div>
                            <span>{{language.groupOrder.together}}{{item.sum}}{{language.groupOrder.items}}</span>
                            <span class='order_all'>{{language.groupOrder.Total}}<span>￥{{item.z_price}}</span></span>
                        </div>
                        <div class='last_right'>

                            <!-- 拼团成功 left -->
                            <div v-if="item.status==1" @tap='_buttonLeft($event,item.id,item.sNo,order.attribute_id,order.p_id,index,item.status,item.delivery_status, item.a_type)'>
                                <!-- 拼团详情 -->{{language.groupOrder.leftText[4]}}
                            </div>
                            <div v-else-if="item.status==0" @tap='_buttonLeft($event,item.id,item.sNo,order.attribute_id,order.p_id,index,item.status,item.delivery_status, item.a_type)'>
                               <!-- 取消订单 -->{{language.groupOrder.leftText[0]}}
                            </div>
                            
                            <div v-else-if="item.status==9" @tap='_buttonLeft($event,item.id,item.sNo,order.attribute_id,order.p_id,index,item.status,item.delivery_status, item.a_type)'>
                                <!-- 拼团详情 -->{{language.groupOrder.leftText[4]}}
                            </div>
                            
                            <div v-else-if="item.status==11" @tap='_buttonLeft($event,item.id,item.sNo,order.attribute_id,order.p_id,index,item.status,item.delivery_status, item.a_type)'>
                                <!-- 删除订单 -->{{language.groupOrder.leftText[2]}}
                            </div>
                            
                            <div v-else-if="item.status==7" @tap='_buttonLeft($event,item.id,item.sNo,order.attribute_id,order.p_id,index,item.status,item.delivery_status, item.a_type)'>
                                <!-- 删除订单 -->{{language.groupOrder.leftText[2]}}
                            </div>
                            
                            
                            <!-- 拼团成功 right -->
                            
                            <div v-if="item.status==1" @tap='_buttonRight($event,item.id,item.sNo,order.attribute_id,order.p_id,index,item.status,item.delivery_status,item.list, item.a_type)'>
                                <!-- 查看订单 -->{{language.group_end.checkOrder}}
                            </div>
                            
                           <!-- <div v-if="item.status==9" :data-clipboard-text='shareHref' id="copyy" @tap='copy(item.sNo,item.activity_no)'>
                                邀请好友
                            </div> -->
                            
                            <div v-else-if="item.status==11" @tap='_buttonRight($event,item.id,item.sNo,order.attribute_id,order.p_id,index,item.status,item.delivery_status,item.list, item.a_type)'>
                                <!-- 拼团详情 -->{{language.groupOrder.leftText[4]}}
                            </div>
                            <div v-else-if="item.status==7" @tap='_buttonRight($event,item.id,item.sNo,order.attribute_id,order.p_id,index,item.status,item.delivery_status,item.list, item.a_type)'>
                                <!-- 再次购买 -->{{language.groupOrder.rightText[6]}}
                            </div>
                            
                            <div @tap="navTo('/pages/order/order_payment?order_id=' + item.id + '&showPay=true&ordertype='+item.otype+'&is_pt=1')" v-if="item.status == 0">
                                {{rightText[0]}}<!-- 立即付款 -->
                            </div>
                            
                        </div>
                    </li>
                    <li class="yh-line"></li>
                </ul>
                <uni-load-more v-if='order.length>10' :loadingType="loadingType"></uni-load-more>
            </div>
            <!-- #endif -->
            
            
            
            
            <div v-else>
                <div class='noFindDiv'>
                    <div>
                        <img class='noFindImg' :src="noOrder"/>
                    </div>
                    <span class='noFindText'>{{language.groupOrder.noOrder}}</span>
                    <div @tap="toUrl('/pagesA/group/group')" class="yh-toHome">
                        <span class='goHome'>{{language.groupOrder.goHome}}</span>
                    </div>
                </div>
            </div>
            
            
            
            <div class="mask yh-mask" v-if="shareMask" @tap="_closeAllMask">
                <div class="shareMask yh-shareMask" v-if="saveEWM" @tap.stop>
            
                    <img :src="guan_img" class='cha yh-cha' @tap="closeShareMask()">
            
                    <div class="right yh-right">
                        <image :src="ewmImg" class="yh-ewmImg" mode="aspectFit" />
                    </div>
            
                    <div class="clearfix"></div>
            
                    <button type="button" class="saveEWMBtn yh-saveEWMBtn-q" @tap="_downEWM()">
                        {{language.group_end.saveImg}}
                    </button>
                </div>
            
                <div class="allCenter yh-allCenter" v-else="saveEWM" @tap.stop>
                    <!-- <div style="width: 58%;margin: 0 auto;display: flex;"> -->
            
                    <!-- #ifdef APP-PLUS-->
                    <div class="shareIcon" @tap="_showPerson()">
                        <img :src="wx_img"/>
                        <p>{{language.group_end.weChat}}</p>
                    </div>
                    
            
                    <div class="shareIcon" @tap="showSaveEWM('app')">
                        <img :src="wx_ewmfxt"/>
                        <p>{{language.group_end.qrCode}}</p>
                    </div>
                    <!-- #endif -->
            
                    <!-- #ifdef MP-WEIXIN -->
                    <div class="shareIcon yh-shareIcon">
                        <button class="share_btn" open-type="share">
                            <img :src="wx_img"/>
                            <p style='margin-top: -38rpx;margin-bottom: 0 !important;'>{{language.group_end.weChatFriends}}</p>
                        </button>
                    </div>
                    <div class="shareIcon" @tap="showSaveEWM('wx')">
                        <img :src="wx_ewmfxt"/>
                        <p style="margin-bottom: 0 !important;">{{language.group_end.qrCode}}</p>
                    </div>
                    <!-- #endif -->
            
                    <!-- #ifdef MP-ALIPAY -->
                    <div class="shareIcon yh-shareIcon">
                        <button class="share_btn" open-type="share" style="border: none;">
                            <img :src="wx_img"/>
                            <p style='margin-top: -56rpx;'>{{language.group_end.weChatFriends}}</p>
                        </button>
                    </div>
                    <div class="shareIcon" @tap="showSaveEWM('ali')">
                        <img :src="wx_ewmfxt"/>
                        <p style="margin-bottom: 0;">{{language.group_end.qrCode}}</p>
                    </div>
                    <!-- #endif -->
                    <div class="clearfix"></div>
                    <!-- </div> -->
                </div>
            </div>
            
            
        </toload>
        
    </div>
</template>

<script>
    import {
        mapMutations
    } from 'vuex'
    import wxParse from '../../components/mpvue-wxparse/src/wxParse.vue'
    export default {
        data () {
            return {
                title: '我的拼团',
                fastTap: true,
                img_cg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/ass_success.png',
                img_sb: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/ass_fail.png',
                noOrder: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/noOrder.png',
                loadImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/loading.gif',
                emptyImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/empyimg92x.png',
                back1: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/back2x.png',
                bback: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/bback.png',
                search2x: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/search2x.png',
                jiantou: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jiantou2x.png',
                storeImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/store.png',
                head: true, //头部切换
                header: ['全部', '待付款', '拼团中', '拼团成功', '拼团失败'],
                header_copy: ['all', 'notpay', 'grouping', 'success', 'fail'],
                rightText: ['立即付款', '提醒发货', '确认收货', '立即评价', '退货', '追加评价', '再次购买', '拼团详情', '邀请好友'],
                leftText: ['取消订单', '查看物流', '删除订单', '查看详情', '拼团详情'],
                
                order: '', //订单数据 
                status_id: '', //订单状态
                dis_play: '', //
                sreach_value: '', //搜索框的值
                page: 1, //加载页面
                allLoaded: false,
                autoFill: false, //若为真，loadmore 会自动检测并撑满其容器
                bottomStatus: '',
                bottomPullText: '上拉加载更多...',
                bottomDropText: '释放更新...',
                loading: false,
                load: true,
                stau_num: null,
                timer: null,
                count: '',
                flag: true,
                loadingType: 0,
                value: '',
                shareHref:'',
                isClick: true, //防止连续点击
                order_type: 'all', //订单类型
                pay: [{
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
                ],
                shareMask: false,
                saveEWM: false,
                overflow: 'scroll',
                guan_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/guanbi2x.png',
                wx_ewmfxt: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/ewmShare.png',
                wx_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/wechat.png',
                erm_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/ewmShare.png',
                wx_person: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/fdc.png',
                ewmImg: '',
                groupmsg: {},
            }
        },
        onReachBottom () {

            var me = this

            if (this.loadingType != 0) {
                return
            }

            this.loadingType = 1
            me.page += 1

            let data = {
                module: 'app',
                
                action: 'groupbuy',
                m: 'grouporder',
                order_type: this.order_type,
                page: this.page
            }

            this.$req.post({data}).then(res => {
                if (res.code == 404) {
                    me.isLogin(()=>{})
                }

                let {
                    order
                } = res.data

                if (order.length > 0) {
                    me.order = me.order.concat(order)
                    if (order.length < 10) {
                        me.loadingType = 2
                    } else {
                        me.loadingType = 0
                    }
                }
            })
        },
        onLoad (options) {
            this.status_id = this.$store.state.status
            this.order_type = this.header_copy[this.status_id]
            if(this.order_type==undefined){
                this.order_type = 'all'
            }
            if (options.isPay) {
                this.status_id = 1
            }

        },
        beforeDestroy () {
            clearInterval(this.timer)
        },
        onShow () {
            let me = this
            this.load = false
            this.status_id = this.$store.state.status
            this.order_type = this.header_copy[this.status_id]

            this.leftText = this.language.groupOrder.leftText
            this.rightText = this.language.groupOrder.rightText
            if(this.order_type==undefined){
                this.order_type = 'all'
            }
            if (!me.access_id) {
                me.load = true
            } else {
                me.page = 1
                me.loadingType = 0
                me._axios()
            }

            this.flag = true
        },
        methods: {
            toUrl(url){
                uni.navigateTo({
                    url
                })
            },
            ...mapMutations({
                cart_id: 'SET_CART_ID',
                order_id: 'SET_ORDER_ID',
                address_id: 'SET_ADDRESS_ID',
                status: 'SET_STATUS'
            }),
            /**
             *
             * */
            changeLoginStatus () {
                this._axios()
            },
            copy(sNo,activity_no){
                var me = this
                console.log('__________activity_no')
                // #ifdef H5
                this.shareHref = uni.getStorageSync('h5_url') + 'pagesA/group/group_end?sNo=' + sNo + '&activity_no=' + activity_no + '&friend=true&isfx=true&cc=1' + '&isfx=true&fatherId=' + uni.getStorageSync('user_id')
                // #endif
                
                this.isLogin(()=>{
                	// #ifdef H5
                	var Clipboard = require('../../common/clipboard.js')
                	var clipboard = new Clipboard('#copyy')
                	clipboard.on('success', function (e) {
                	    uni.showToast({
                	        title: me.language.group_end.copyOk,
                	        duration: 1000,
                	        icon: 'none'
                	    })
                	})
                	clipboard.on('error', function (e) {
                	    uni.showToast({
                	        title: me.language.group_end.copyFail,
                	        duration: 1000,
                	        icon: 'none'
                	    })
                	    document.querySelector('.copy')
                	})
                	// #endif
                	// -sel H5
                	// #ifndef H5
                	me.shareMask = true
                	// #endif
                })
            },
            _closeAllMask () {
                this.shareMask = false
                this.saveEWM = false
                this.overflow = 'scroll'
            },
            closeShareMask () {
                this.saveEWM = false
                this.shareMask = false
                this.overflow = 'scroll'
            },
            _downEWM () {
                let me = this
                console.log('需要保存到本地的图片地址：' + me.ewmImg_url)
                uni.downloadFile({
                    url: me.ewmImg_url,
                    success: function (sres) {
                        console.log(sres.tempFilePath)
                        // #ifdef MP-ALIPAY
                        my.saveImage({
                            url: sres.tempFilePath,
                            success: () => {
                                uni.showToast({
                                    title: me.language.group_end.saveImgOk,
                                    duration: 1500,
                                    icon: 'none'
                                })
                            },
                        })
                        return false
                        // #endif
                        uni.saveImageToPhotosAlbum({
                            filePath: sres.tempFilePath,
                            success: function () {
                                uni.showToast({
                                    title: me.language.group_end.saveImgOk,
                                    duration: 1500,
                                    icon: 'none'
                                })
                            },
                            fail: function () {
                                uni.showToast({
                                    title: me.language.group_end.saveImgFail,
                                    duration: 1500,
                                    icon: 'none'
                                })
                            },
                        })
                    },
                    fail: function () {
                        uni.showToast({
                            title: me.language.group_end.saveImgFail,
                            duration: 1500,
                            icon: 'none'
                        })
                    },
                })
            },
            /**
             * 分享给微信好友
             * */
            _showPerson () {
            
                let me = this
                let groupmsg = me.groupmsg
                uni.share({
                    provider: 'weixin',
                    scene: 'WXSceneSession',
                    type: 0,
                    href: uni.getStorageSync('h5_url') + 'pagesA/group/group_end?sNo=' + me.sNo +
                        '&activity_no=' + me.activity_no + '&friend=true&isfx=true&cc=3',
                    title: groupmsg.p_name,
                    summary: '',
                    imageUrl: groupmsg.img,
                    success: function (res) {
                        console.log('success:' + JSON.stringify(res))
                    },
                    fail: function (err) {
                        console.log('fail:' + JSON.stringify(err))
                    }
                })
            },
            showSaveEWM (string) {
                var me = this
                var data = {
                    module: 'app',
                    action: 'getcode',
                    m: 'share',
                    proId: this.groupmsg.ptgoods_id,
                    type: 'pt_end',
                    sNo: me.sNo,
                    activity_no: me.activity_no || me.groupmsg.activity_no,
                    friend: 'true',
                    
                }
                this.$req.post({data}).then(res => {
                    if (res.code == 200) {
                        me.ewmImg = uni.getStorageSync('endurl') + res.data.imgUrl
            
                        me.ewmImg_url = uni.getStorageSync('endurl') + res.data.imgUrl
                        console.log('me.ewmImg_url')
                        console.log(me.ewmImg_url)
                        me.saveEWM = true
                        me.shareMask = true
            
                        console.log('err4')
            
                    } else if (res.code == 404) {
                        this.isLogin(()=>{})
                    } else {
                        uni.showToast({
                            title: res.message,
                            duration: 1500,
                            icon: 'none'
                        })
                        console.log('err6')
            
                    }
                })
            
            },
            /**
             *
             * */
            _navigateTo (status, id,sNo) {
                //
                if(status!=1){
                    return
                }
                if (status == 0) {
                    var path = '/pages/order/order?showPay=true&order_id=' + id + '&group=1' + '&status=' + status
                }else if(status==1){
                    var path = '/pages/order/orderSearch?sreach_value=' + sNo
                }else{
                    var path = '/pages/order/order?order_id=' + id + '&group=1' + '&status=' + status
                }
                uni.navigateTo({
                    url: path,
                    success: function () {
                        console.log(1.1)
                    }
                })
                this.loadingType = 0
                this.page = 1
                this.flag = false

            },
            /**
             *
             * */
            _after (e, id, content) {
                var order_details_id = []
                order_details_id.push(id)
                let value = e.target.innerText
                if (value == '申请售后') {
                    uni.navigateTo({
                        url: '/pagesA/returnGoods/returnGoods?order_details_id' + this.order_details_id + '&order_anking=1'
                    })
                } else if (value == '退货拒绝') {
                    console.log(content)
                    this.display_t = true
                    this.rr_content = content
                }
            },
            /**
             * 头部切换
             * */
            _head () {
                this.head = !this.head
            },
            /**
             *
             * */
            _header_index (index) {
                this.page = 1
                if (index == 1) {
                    this.status(1)
                    this.order_type = 'notpay'
                } else if (index == 2) {
                    this.status(2)
                    this.order_type = 'grouping'
                } else if (index == 3) {
                    this.status(3)
                    this.order_type = 'success'
                } else if (index == 4) {
                    this.status(4)
                    this.order_type = 'fail'
                } else if (index == 0) {
                    this.status(0)
                    this.order_type = 'all'
                }

                this.status_id = this.$store.state.status
                this._axios()
            },
            
            async _axios2 () {
                var data = {
                    module: 'app',
                    action: 'pthd_groupbuy',
                    m: 'grouporder',
                    order_type: this.order_type,
                    page: this.page,
                }
                let res = await this.$req.post({data})
                res = res.data
                try {
                    if (res.order && res.order.length) {
                        res.order.map(item => item.a_type = 1)
                        return  res.order;
                    } else {
                        return []
                    }
                } catch (e) {
                    console.error(e);
                    return [];
                }
                
            },
            
            /**
             * 点击时，实行的事件
             * */
            _axios () {
                var me = this
                var data = {
                    module: 'app',
                    action: 'groupbuy',
                    m: 'grouporder',
                    order_type: this.order_type,
                    page: this.page,
                }
                
                if (this.access_id) {
                    this.$req.post({data}).then(async res => {
                        if (typeof (res) === 'string') {
                            res = {
                                data: {
                                    order: [],
                                },
                                code: 200
                            }
                        }
                        
                        if (res.code == 404) {
                            me.isLogin(()=>{})
                        }
                        setTimeout(function () {
                            me.load = true
                        }, 300)

                        let {
                            order
                        } = res.data
                        
                        let newOrder = await me._axios2();
                        if (!order) {
                            order = [];
                        }
                        me.order = order.concat(newOrder)
                        console.log(res)

                        if (order.length < 10) {
                            me.allLoaded = true
                        } else {
                            me.allLoaded = false
                        }
                    })
                }
            },
            /**
             * 点击取消订单
             * */
            _buttonLeft (event, order_id, sNo, attribute_id, p_id, index, status, sum, a_type) {
                return function () {
                    if (!this.isClick) {
                        return
                    }
                    this.isClick = false
                    setTimeout(() => {
                        var me = this
                        //orde_id订单id  attribute_id商品属性id  p_id商品id  
                        var otype = sNo.substr(0, 2)
                        let action = 'groupbuy';
                        if (a_type == 1) {
                            action = 'pthd_groupbuy';
                        }
                        
                        var data = {
                            module: 'app',
                            action: action,
                            order_id: order_id,
                            access_id: this.access_id
                        }
                        
                        if (status == 0) {
                            //data.app = 'removeGroupOrder'
                            data.m = 'removeGroupOrder'
                            uni.request({
                                data,
                                url: uni.getStorageSync('url'),
                                header: {
                                    'content-type': 'application/x-www-form-urlencoded'
                                },
                                method: 'POST',
                                success: function (res) {

                                    if (res.data.code == 404) {
                                        me.$refs.lktAuthorizeComp.handleAfterAuth(me, '../../pages/login/login?landing_code=1')
                                    }
                                    let {
                                        data: {
                                            code,
                                            message
                                        }
                                    } = res
                                    if (code == 200) {
                                        me._axios()
                                        uni.showToast({
                                            title: me.language.groupOrder.cancelOk,
                                            duration: 1000,
                                            icon: 'none'
                                        })

                                    } else if (code == 202) {
                                        uni.showToast({
                                            title: me.language.groupOrder.hasDelivered,
                                            duration: 1000,
                                            icon: 'none'
                                        })
                                        me._axios()
                                    } else {
                                        uni.showToast({
                                            title: me.language.groupOrder.networkBusy,
                                            duration: 1000,
                                            icon: 'none'
                                        })
                                    }
                                }
                            })
                        } else if (status == 2 || status == 3 || status == 5) {
                            let data = {
                                module: 'app',
                                action: 'order',
                                app: 'logistics',
                                id: sNo,
                                access_id: this.access_id,
                                o_source: 1,
                                type: '',
                            }

                            if (this.source == 1) {
                                data.type = 'pond'
                            }
                            uni.request({
                                url: uni.getStorageSync('url'),
                                header: {
                                    'content-type': 'application/x-www-form-urlencoded'
                                },
                                data,
                                method: 'POST',
                                success: (res) => {
                                    uni.hideLoading()
                                    if (res.data.code == 200) {
                                        let data = res.data.data.res
                                        if (data.length > 1) {
                                            uni.navigateTo({
                                                url: '../../pagesB/expressage/expressage?sNo=' + sNo,
                                            })
                                        } else {
                                            uni.navigateTo({
                                                url: '../../pages/expressage/expressage?list=' + JSON.stringify(data[0]) + '&sNo=' + sNo,
                                            })
                                        }
                                    } else {
                                        uni.showToast({
                                            title: res.data.message,
                                            duration: 1500,
                                            icon: 'none'
                                        })
                                    }
                                },
                                fail: (e) => {
                                    uni.showToast({
                                        title: me.language.groupOrder.loadFail,
                                        duration: 2000,
                                        icon: 'none'
                                    })
                                }
                            })
                        } else if (status == 4 || (status == 1 && otype != 'PT' && otype != 'PP')) {
                            let url = ''
                            if(a_type==1){
                                url =  '../../pages/order?order_id=' + order_id + '&group=1&a_type=1'
                            }else{
                                url = '../../pages/order?order_id=' + order_id + '&group=1'
                            }
                            uni.navigateTo({
                                url:url
                            })
                            
                        } else if (status == 9 || status == 10 || (status == 1 && (otype == 'PT' || otype == 'PP'))) {
                            if (otype == 'PP') {
                                var path = '../group/group_end?sNo=' + sNo + '&returnR=1&status='+status +'&a_type=1'
                                uni.navigateTo({
                                    url: path
                                })    
                            } else {
                                var path = '../group/group_end?sNo=' + sNo + '&returnR=1&status='+status
                                uni.navigateTo({
                                    url: path
                                })
                            }
                            
                            
                        } else if (status == 12 || status == 7 || status == 6 || status == 11) {
                            /*发送请求*/

                            //data.app = 'del_order'
                            data.m = 'del_order'

                            data.app = 'del_order'

                            // data.app = 'del_order'
                            data.m = 'del_order'

                            uni.request({
                                data,
                                url: uni.getStorageSync('url'),
                                header: {
                                    'content-type': 'application/x-www-form-urlencoded'
                                },
                                method: 'POST',
                                success: function (res) {
                                    if (res.data.code == 404) {
                                        me.$refs.lktAuthorizeComp.handleAfterAuth(me, '../../pages/login/login?landing_code=1')
                                    }
                                    let {
                                        data: {
                                            code,
                                            message
                                        }
                                    } = res
                                    if (code == 200) {
                                        uni.showToast({
                                            title: me.language.groupOrder.delOk,
                                            duration: 1000,
                                            icon: 'none'
                                        })
                                        let index = me.order.findIndex(item=>item.sNo == sNo)
                                        me.order.splice(index,1)
                                        // me._axios()
                                    } else {
                                        uni.showToast({
                                            title: message,
                                            duration: 1000,
                                            icon: 'none'
                                        })
                                    }
                                }
                            })
                        }
                        this.isClick = true
                    }, 100)
                }.call(this)
            },
            /**
             *
             * */
            _goStore (shop_id) {
                uni.navigateTo({
                    url: '/pagesA/store/store?shop_id=' + shop_id
                })
            },
            /**
             *
             * */
            _buttonRight (event, orde_id, sNo, attribute_id, p_id, index, status, sum, list, a_type) {
                var me = this
                var otype = sNo.substr(0, 2)
                //orde_id订单id  attribute_id商品属性id  p_id商品id  
                if (status == 6 || status == 12) {
                    //跳转订单详情支付页
                    var data = {
                        module: 'app',
                        action: 'order ',
                        app: 'buy_again',
                        id: orde_id,
                        
                    }
                    this.$req.post({data}).then(res => {
                        if (res.code == 404) {
                            this.isLogin(()=>{})
                        }
                        let {
                            data: {
                                cart_id
                            },
                            code
                        } = res
                        if (code == 200) {
                            me.cart_id(cart_id)
                            me.order_id('')
                            me.address_id('')
                            uni.navigateTo({
                                url: '/pages/pay/orderDetailsr'
                            })
                        } else if (code == 105) {
                            uni.showToast({
                                title: me.language.groupOrder.noStockTips,
                                duration: 2000,
                                icon: 'none'
                            })
                        }
                    })
                } else if(status==7){
                    if (otype == 'PP') {
                        uni.reLaunch({
                            url: '/pagesA/group/group?a_type=1'
                        })    
                    } else {
                        uni.reLaunch({
                            url: '/pagesA/group/group'
                        })
                    }
                    
                }else if (status == 0) {
                    me.order_id(orde_id)
                    me.address_id('')
                    var path = '/pages/order/order?order_id=' + orde_id + '&group=1'
                    if (otype != 'PT') {
                        path = path + '&showPay=true'
                    }
                    
                    if (otype == 'PP') {
                        path != '&a_type=1'
                    }
                    
                    uni.navigateTo({
                        url: path
                    })
                } else if (status == 1) { //提醒发货     查看订单
                    console.log(index);
                    uni.navigateTo({
                        url: '/pages/order/orderSearch?sreach_value=' + sNo
                    });
                    //请求接口
                    // console.log(this.fastTap)
                    // if (!this.fastTap) {
                    //     return
                    // }
                    // this.fastTap = false
                    // if (sum == 0) {
                    //     var data = {
                    //         module: 'app',
                    //         sNo: sNo,
                    //         m: 'delivery_delivery',
                    //         action:'groupbuy'
                    //     }
                    //     this.$req.post({data}).then(res => {
                    //         me.fastTap = true
                    //         if (res.code == 404) {
                    //             this.isLogin(()=>{})
                    //         }
                    //         if (res.code == 200) {
                    //             uni.showToast({
                    //                 title: me.language.groupOrder.hasRemind,
                    //                 duration: 1000,
                    //                 icon: 'none'
                    //             })
                    //             me._axios()
                    //         }
                    //     })
                    // } else {
                    //     me.fastTap = true
                    // }

                } else if (status == 4) {
                    //跳转订单详情
                    
                    if (otype == 'PP') {
                        uni.navigateTo({
                            url: '/pages/order?order_id=' + orde_id + '&group=1&a_type=1'
                        })    
                    } else {
                        uni.navigateTo({
                            url: '/pages/order?order_id=' + orde_id + '&group=1'
                        })
                    }
                    
                    
                } else if (status == 3) {
                    //评价页面
                    console.log(list[0].id)
                    uni.navigateTo({
                        url: '/pages/evaluate/evaluating?order_details_id=' + list[0].id + '&num=all'
                    })
                } else if (status == 5) {
                    //追加评价页面
                    uni.navigateTo({
                        url: '/pages/evaluate/evaluating?order_details_id=' + list[0].id + '&add=true&num=all'
                    })
                } else if (status == 9 || status == 10 || status == 11) {
                    if (otype == 'PP') {
                        //参团页面
                        var path = '../group/group_end?sNo=' + sNo + '&returnR=1&a_type=1'
                        uni.navigateTo({
                            url: path
                        })    
                    } else {
                        //参团页面
                        var path = '../group/group_end?sNo=' + sNo + '&returnR=1'
                        uni.navigateTo({
                            url: path
                        })
                    }
                    
                    
                } else if (status == 2) {
                    var data = {
                        module: 'app',
                        action: 'order',
                        app: 'ok_Order',
                        order_id: orde_id,
                        
                    }
                    this.$req.post({data}).then(res => {
                        if (res.code == 404) {
                            this.isLogin(()=>{})
                        }
                        let {
                            code
                        } = res
                        if (code == 200) {
                            uni.showToast({
                                title: me.language.groupOrder.receivedOk,
                                duration: 1000,
                                icon: 'none'
                            })
                            me._axios()
                        } else {
                            uni.showToast({
                                title: me.language.groupOrder.receivedFail,
                                duration: 1000,
                                icon: 'none'
                            })
                        }
                    })
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    @import url("../../static/css/group/groupOrder.less");
</style>
