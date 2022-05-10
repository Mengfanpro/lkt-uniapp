<template>
    <div class="yh-page">

        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>

        <heads :title='topTabBar?language.bargain.title:language.bargain.myBargain' :returnR="doodsreturn"></heads>

        <div class="skeleton" v-if="!load">
            <!-- <div style='position: relative;'>
                <div class='brDiv' v-for='item of 3' :key="item">
                    <div class='leftBrDiv'><img class="skeleton-rect" src="" /></div>
                    <div class='rightBrDiv'>
                        <div class='proTitle skeleton-rect'>嘻嘻嘻嘻嘻嘻嘻嘻寻寻寻寻 </div>
                        <div class='proPrice'>
                            <span class='newPrice skeleton-rect'>¥99.99</span>
                            <span class='oldPrice skeleton-rect'>¥99.99</span>
                        </div>
                        <div class="group_num skeleton-rect" style="width: 100px;">
                            xx
                        </div>
                        <div class='brBtn skeleton-rect'>
                            <text>立即砍价</text>
                        </div>
                    </div>
                    <div class="spacer"></div>
                </div>
            </div> -->
        </div>
        <div v-else>
            <!-- 砍价部分 -->
            <div style='position: relative;' >
                <img v-if="brHeadImg && topTabBar" style="width: 100%;height: 160px;" :src="brHeadImg" class="yh-brHeadImg">
                <div v-if="brHeadImg" class="My_Bargin" @tap="toUrl('/pagesA/bargain/bargain')">我的砍价</div>
                <div class="" v-if="list.length!=0">
                <div v-if='topTabBar'>
                    <div class="spacer" v-if="!noBargain"></div>
                    <div class='brDiv' v-for='(item,index) in list' :key='index'
                         @tap='goGoods(item.goods_id,item.attr_id,item.status,item.order_no,item.leftTime,item.bargain_id,item.hasorder,item.sNo_id, item.isbegin)'>
                        <div class='leftBrDiv'><img :src="item.img"></div>
                        <div class='rightBrDiv'>
                            
                            <div class='proTitle'>{{item.title}}</div>
                            <div class='proPrice'>
                                <span class='newPrice'>¥{{item.min_price}}</span>
                                <span class='oldPrice'>¥{{item.price}}</span>
                            </div>
                            <div v-if="item.priceDown>0" class="yh-length">
                                <font color="#999">{{language.bargain.moneyArr[0]}}</font><span>{{item.priceDown}}</span><font color="#999">{{language.bargain.moneyArr[1]}}</font><span>{{item.priceleft}}</span><font color="#999">{{language.bargain.moneyArr[2]}}</font>
                            </div>
                            <div v-else-if='item.leftTime>0&&item.status==2' class='proPrice'>
                                {{language.bargain.lowest}}
                            </div>
                            <div v-else-if='item.status==-2' class='proPrice'>
                                <text v-if='item.original_price>0'>{{language.bargain.nolowest}}</text>
                                <text v-else>{{language.bargain.timeout}}</text>
                            </div>
                            
                            <div class="group_num">
                                <text class="g_n_num dayNum">{{item.day}}</text>
                                <text class="yh-day">{{language.bargain.days}}</text>
                                <text class="g_n_num">{{item.hour}}</text>
                                <span class="g_n_dian">:</span>
                                <text class="g_n_num">{{item.mniuate}}</text>
                                <span class="g_n_dian">:</span>
                                <text class="g_n_num yh-g-n-num">{{item.second}}</text>
                                <text style="color: #999;" v-if="item.leftTime>0&&item.status==2">{{language.bargain.overdue}}</text>
                                <text style="color: #999;" v-else>{{item.isbegin==0?language.bargain.startAfter:language.bargain.endAfter}}</text>
                            </div>
                            <div class='brBtn' v-if="item.isbegin && item.leftTime>0"
                                 @tap.stop='toBargainIng(item.goods_id,item.attr_id,item.status,item.order_no,item.bargain_id,item.hasorder,item.leftTime)'>
                                <text v-if="item.status==0">{{language.bargain.bargainBtn}}</text>
                                <text v-else-if="item.status==1">{{language.bargain.continueBtn}}</text>
                                <text v-else>{{language.bargain.continueBtn}}</text><!-- 查看详情 -->
                            </div>
                            <!-- isbegin : 1: 已开始 0: 未开始 -->
                            <div class='brBtn getGray' v-else-if="!item.isbegin">{{language.bargain.notBegun}}</div>
                            <div class='brBtn getGray' v-else-if="item.leftTime<0">{{language.bargain.hasEnded}}</div><!-- 已结束 -->
                        </div>
                        <div class="spacer"></div>
                    </div>
                    <div style="height: 100rpx;"></div>
                    <!-- <button class="btn-fixed" @tap="changeTabBar()">{{language.bargain.myBargain}}</button> -->
                </div>

                <div v-else class="mt-2">
                    <div class='brDiv' v-for='(item,index) in list' :key='index'
                         @tap='goGoods(item.goods_id,item.attr_id,item.status,item.order_no,item.leftTime,item.bargain_id,item.hasorder,item.sNo_id, item.isbegin)'>
                        <div class='leftBrDiv'><img :src="item.img" alt=""></div>
                        <div class='rightBrDiv'>
                            <div class='proTitle'>{{item.title}}</div>

                            <div v-if='item.status==1&&item.original_price>0' class='proPrice'>
                                <div>
                                    <span class='newPrice'>¥{{item.min_price}}</span>
                                    <span class='oldPrice' style='color: #999999;'>¥{{item.price}}</span>
                                </div>
                                <div class="yh-length">
                                    {{language.bargain.moneyArr[0]}}<span>{{item.success_money}}</span>{{language.bargain.moneyArr[1]}}<span>{{item.original_price}}</span>{{language.bargain.moneyArr[2]}}
                                </div>
                            </div>

                            <div v-else-if="item.leftTime>0&&item.status==2&&item.gopay==1" class='proPrice'>{{language.bargain.payment}}
                            </div>
                            <div v-else-if='item.leftTime>0&&item.status==2' class='proPrice'>
                                {{language.bargain.lowest}}
                            </div>

                            <!-- 砍价失败未砍至最低价 -->
                            <div v-else-if='item.status==-1' class='proPrice'>
                                <div>
                                    <span class='newPrice'>¥{{ item.min_price }}</span>
                                    <span class='oldPrice' style='color: #999999;'>¥{{item.price}}</span>
                                </div>
                                <text v-if='item.original_price>0'>{{language.bargain.nolowest}}</text>
                                <text v-else>{{language.bargain.timeout}}</text>
                            </div>


                            <div v-else class='proPrice'>
                                <text v-if='item.status==2&&!item.hasorder'>{{language.bargain.payment1}}</text>
                                <text v-else-if='item.gopay==1&&item.hasorder==1'>{{language.bargain.payment}}</text>
                                <text v-else-if='item.status==3'>{{language.bargain.account_paid}}</text>
                            </div>

                            <!-- 继续砍价倒计时 -->
                            <div class="group_num" v-if='item.leftTime > 0 && item.status ==1'>

								<span v-if='item.day'>
									<span class="g_n_num dayNum ">{{ item.day }}</span>
									<span style='margin: 0 5rpx;color: #020202;'>{{language.bargain.days}}</span>
								</span>

                                <text class="g_n_num">{{item.hour}}</text>
                                <span class="g_n_dian">:</span>
                                <text class="g_n_num">{{item.mniuate}}</text>
                                <span class="g_n_dian">:</span>
                                <text class="g_n_num" style='margin-right: 10rpx;'>{{item.second}}</text>


                                <text v-if="item.status==2" style='color: #999;'>{{language.bargain.cancelOrder}}</text>
                                <text v-else-if="item.status==1" style='color: #999;'>{{language.bargain.finish}}</text>
                                <text v-else style='color: #999;'></text>
                            </div>
                            <!-- 去付款倒计时 -->
                            <div class="group_num" v-else-if='item.status == 2 && !item.hasorder'>

								<span v-if='item.day'>
									<span class="g_n_num dayNum ">{{ item.day }}</span>
									<span style='margin: 0 5rpx;color: #020202;'>{{language.bargain.days}}</span>
								</span>

                                <text class="g_n_num">{{item.hour}}</text>
                                <span class="g_n_dian">:</span>
                                <text class="g_n_num">{{item.mniuate}}</text>
                                <span class="g_n_dian">:</span>
                                <text class="g_n_num" style='margin-right: 10rpx;'>{{item.second}}</text>


                                <text v-if="item.status==2" style='color: #999;'>{{language.bargain.cancelOrder}}</text>
                                <text v-else-if="item.status==1" style='color: #999;'>{{language.bargain.finish}}</text>
                                <text v-else style='color: #999;'></text>
                            </div>
                            <!-- 待付款倒计时 -->
                            <div class="group_num" v-else-if='item.gopay == 1 && item.hasorder == 1'>

								<span v-if='item.day'>
									<span class="g_n_num dayNum ">{{ item.day }}</span>
									<span style='margin: 0 5rpx;color: #020202;'>{{language.bargain.days}}</span>
								</span>

                                <text class="g_n_num">{{item.hour}}</text>
                                <span class="g_n_dian">:</span>
                                <text class="g_n_num">{{item.mniuate}}</text>
                                <span class="g_n_dian">:</span>
                                <text class="g_n_num" style='margin-right: 10rpx;'>{{item.second}}</text>


                                <text v-if="item.status==2" style='color: #999;'>{{language.bargain.cancelOrder}}</text>
                                <text v-else-if="item.status==1" style='color: #999;'>{{language.bargain.finish}}</text>
                                <text v-else style='color: #999;'></text>
                            </div>
                            <!-- 已结束倒计时 -->
                            <div class="group_num" v-else-if='item.leftTime <= 0'>

								<span v-if='item.day'>
									<span class="g_n_num dayNum g_n_nums">{{ item.day }}</span>
									<span style='margin: 0 5rpx;color: #020202;'>{{language.bargain.days}}</span>
								</span>

                                <text class="g_n_num g_n_nums">{{item.hour}}</text>
                                <span class="g_n_dian">:</span>
                                <text class="g_n_num g_n_nums">{{item.mniuate}}</text>
                                <span class="g_n_dian">:</span>
                                <text class="g_n_num g_n_nums" style='margin-right: 10rpx;'>{{item.second}}</text>


                                <text v-if="item.status==2" style='color: #999;'>{{language.bargain.cancelOrder}}</text>
                                <text v-else-if="item.status==1" style='color: #999;'>{{language.bargain.finish}}</text>
                                <text v-else style='color: #999;'></text>
                            </div>
                            <!-- 查看详情倒计时1 -->
                            <div class="group_num" v-else-if='item.status==2 || item.status==3 || item.status==-1'>

								<span v-if='item.day'>
									<span class="g_n_num dayNum g_n_nums">{{ item.day }}</span>
									<span style='margin: 0 5rpx;color: #020202;'>{{language.bargain.days}}</span>
								</span>

                                <text class="g_n_num g_n_nums">{{item.hour}}</text>
                                <span class="g_n_dian">:</span>
                                <text class="g_n_num g_n_nums">{{item.mniuate}}</text>
                                <span class="g_n_dian">:</span>
                                <text class="g_n_num g_n_nums" style='margin-right: 10rpx;'>{{item.second}}</text>


                                <text v-if="item.status==2" style='color: #999;'>{{language.bargain.cancelOrder}}</text>
                                <text v-else-if="item.status==1" style='color: #999;'>{{language.bargain.finish}}</text>
                                <text v-else style='color: #999;'></text>
                            </div>
                            <!-- 查看详情倒计时2 -->
                            <div class="group_num" v-else>

								<span v-if='item.day'>
									<span class="g_n_num dayNum g_n_nums">{{ item.day }}</span>
									<span style='margin: 0 5rpx;color: #020202;'>{{language.bargain.days}}</span>
								</span>

                                <text class="g_n_num g_n_nums">{{item.hour}}</text>
                                <span class="g_n_dian">:</span>
                                <text class="g_n_num g_n_nums">{{item.mniuate}}</text>
                                <span class="g_n_dian">:</span>
                                <text class="g_n_num g_n_nums" style='margin-right: 10rpx;'>{{item.second}}</text>


                                <text v-if="item.status==2" style='color: #999;'>{{language.bargain.cancelOrder}}</text>
                                <text v-else-if="item.status==1" style='color: #999;'>{{language.bargain.finish}}</text>
                                <text v-else style='color: #999;'></text>
                            </div>


                            <div class='brBtn' v-if='item.leftTime>0&&item.status==1'
                                 @tap.stop='contBr(item.goods_id,item.attr_id,item.status,item.order_no,item.bargain_id,item.isbegin)'>
                                {{language.bargain.continueBtn}}<!-- 继续砍价 -->
                            </div>
                            <div class='brBtn getGreen' v-else-if='item.status == 2 && !item.hasorder'
                                 @tap.stop='toPay(item.goods_id,item.attr_id,item.status,item.order_no,item.bargain_id,item.isbegin)'>
                                {{language.bargain.Bargaining_success}}<!-- 去付款 -->
                            </div>
                            <div class='brBtn' v-else-if='item.gopay == 1 && item.hasorder == 1'
                                 @tap.stop="navTo('/pages/order/order?order_id=' + item.sNo_id + '&showPay=true')">{{language.bargain.Bargaining_success}}
                            </div>

                            <!-- <div class='brBtn getGray' v-else-if='item.status==2'>已付款</div> -->
                            <div class='brBtn getGreen' v-else-if='item.status==-1'>{{language.bargain.Bargaining_failed}}</div><!-- 已结束 -->
                            <div class='brBtn getGreen' v-else-if='item.status==2 || item.status==3 || item.status==-1'
                                 @tap.stop='contBr(item.goods_id,item.attr_id,item.status,item.order_no,item.bargain_id,item.isbegin)'>
                                <div v-if="item.status==3">{{language.bargain.Bargaining_success}}</div>
                                <div v-if="item.status==-1">{{language.bargain.Bargaining_failed}}</div>
                            </div>
                            <div class='brBtn getGray' v-else>{{language.bargain.Bargaining_success}}</div><!-- 查看详情 -->
                        </div>
                        <div class="spacer"></div>
                    </div>

                </div>

                <!-- 如果没有商品的话显示 -->
                <div class='empty_play' v-if="noBargain&&!topTabBar">
                    <img :src="no_bargain"/>
                    <p class='empty_p'>{{language.bargain.no_bargainText}}</p>
                    <div class="empty_btn" @tap="toUrl('/pagesA/bargain/bargain?topTabBar=true&toBack=true')">{{language.bargain.no_bargainBtn}}</div>
                </div>
                </div>
                <div class="" v-else>
                    <div class='empty_play'>
                        <img :src="no_bargain"/>
                        <p class='empty_p'>{{language.bargain.no_bargainText2}}～</p>
                        
                    </div>
                </div>
            </div>
            
            <template v-if="!noBargain&&list.length>9">
                <uni-load-more v-if="uniLoadMore" :loadingType="loadingType"></uni-load-more>
            </template>


            <!-- #ifndef MP-ALIPAY -->
            <transition name="fade">
                <!-- #endif -->

                <view class="dialog" v-if="isShow">
                    <view class="dialog-box">
                        <view class="dialog-header">{{language.bargain.prompt}}</view>
                        <view class="dialog-content">
                            <p>{{dialogContent}}</p>
                        </view>
                        <view class="dialog-footer">
                            <view class="dialog-cancel" @tap="closeDialog">{{language.bargain.cancel}}</view>
                            <view class="dialog-confirm" @tap="clickConfirm">{{language.bargain.confirm}}</view>
                        </view>
                    </view>
                </view>

                <!-- #ifndef MP-ALIPAY -->
            </transition>
            <!-- #endif -->

        </div>
        <skeleton  :animation="true" :loading="!load"  bgColor="#FFF"></skeleton>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                doodsreturn: '0',
                timeid: 0,
                groupList: [],
                title: '热门砍价',
                loadGif: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + '/images/icon1/loading.gif',
                nobargainImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + '/images/icon1/noFind.png',
                no_bargain: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + '/images/icon1/bargainNo.png',
                brHeadImg: '',
                load: false,
                topTabBar: true,
                list: '',
                page1: 1,
                page2: 1,
                noBargain: false, //是否显示暂无砍价商品
                loadingType: 0,
                daodi: false,
                obj: {},
                isShow: false, //是否显示模态框
                dialogContent: '', //模态框内容正文
                uniLoadMore: false, //默认不显示上拉加载
                hasorder: 0 //是否是待付款 0|1(待付款)
            }
        },
        onLoad (option) {
            if (!option.topTabBar) {
                this.topTabBar = false

                uni.setNavigationBarTitle({
                    title: '我的砍价'
                })

                this.title = '我的砍价'
            } else {
                console.log('转发')
                this.doodsreturn = '6'
            }
            
            if(option.toBack){
                this.doodsreturn = '0'
            }
            
            // uni.showModal({
            //     title: '',
            //     content: '请先设置好收货地址，砍价商品将已默认收货地址为准',
            //     cancelText: '已设置好',
            //     cancelColor: '#999999',
            //     confirmText: '去设置',
            //     success: function (res) {
            //         if (res.confirm) {
            //             console.log('用户点击确定');
            //         } else if (res.cancel) {
            //             console.log('用户点击取消');
            //         }
            //     }
            // });
            
        },
        onShow () {
            
            this.page1 = 1
            this.page2 = 1
            
            this.LaiKeTuiCommon.getLKTApiUrl().then( () => {
                this.$nextTick(() => {
                    
                    this._axios()
                })
            })

        },
        methods: {
            toUrl(url){
                uni.navigateTo({
                    url
                })
            },
            /**
             *
             * */
            changeLoginStatus () {
                this._axios()
            },
            /**
             *
             * */
            toPay (id, attr_id, status, order_no, bargain_id) {
                var product = []
                product.push({
                    pid: id
                })
                product.push({
                    cid: attr_id
                })
                product.push({
                    num: 1
                })
                product.push({
                    bargain: true
                })
                product.push({
                    bargain_id: bargain_id
                })
                product.push({
                    order_no: order_no
                })
                product = JSON.stringify(product)

                //#ifdef H5
                var storage = window.localStorage
                storage.product = product
                storage.bargain = true
                storage.bargain_id = bargain_id
                storage.order_no = order_no
                uni.setStorageSync('bargain', true)
                // #endif

                uni.navigateTo({
                    url: '/pagesA/bargain/bargainDetailsr?product=' + product + '&bargain=true&bargain_id=' + bargain_id +
                        '&order_no=' + order_no
                })
            },
            /**
             *
             * */
            contBr (id, attr_id, status, order_no, bargain_id) {
                uni.navigateTo({
                    url: 'bargainIng?proId=' + id + '&attr_id=' + attr_id + '&brStatus=' + status + '&order_no=' + order_no +
                        '&bargain_id=' + bargain_id
                })
            },
            /**
             *
             * */
            goGoods (id, attr_id, status, order_no, leftTime, bargain_id, hasorder, sNo_id, isbegin) {
                this.$store.state.pro_id = id
                var bstatus = 3
                if (status == 0) {
                    bstatus = 4
                } else if (status == 1) {
                    bstatus = 0
                } else if (status == 2) {
                    bstatus = 1
                } else if (status == 3) {
                    bstatus = 2
                }
                console.log(leftTime);
                if (leftTime <= 0) {
                    bstatus = 3
                }
                console.log(hasorder);
                if (leftTime > 0 && status == 2 && hasorder) {
                    uni.navigateTo({
                        url: '../../pages/goods/goodsDetailed?bargain=true&isbegin=' + isbegin + '&pro_id=' + id + '&brStatus=' +
                            bstatus + '&attr_id=' +
                            attr_id + '&order_no=' + order_no + '&leftTime=' + leftTime + '&bargain_id=' + bargain_id + '&hasorder=' +
                            hasorder + '&sNo_id=' + sNo_id
                    })
                } else {
                    uni.navigateTo({
                        url: '../../pages/goods/goodsDetailed?bargain=true&pro_id=' + id + '&brStatus=' + bstatus + '&attr_id=' +
                            attr_id + '&order_no=' + order_no + '&leftTime=' + leftTime + '&bargain_id=' + bargain_id + '&isbegin=' +
                            isbegin
                    })
                }
            },
            /**
             *
             * */
            setTimeData () {

                if (this.groupList.length == 0) return false
                // if (!data) return false;
                // var groupList = data;

                for (var i = 0; i < this.groupList.length; i++) {

                    var tt = true

                    if (this.topTabBar) {

                        var t = --this.groupList[i].leftTime
                        if (this.groupList[i].leftTime < 0) {
                            tt = false
                        }

                    } else {

                        if (this.groupList[i].status == 2) {

                            var t = --this.groupList[i].canbuy
                            if (this.groupList[i].canbuy <= 0) {
                                tt = false
                            }

                        } else {

                            var t = --this.groupList[i].leftTime
                            if (this.groupList[i].leftTime <= 0 || this.groupList[i].status == 3 || this.groupList[i].status == -1) {
                                tt = false
                            }

                        }
                    }

                    if (!tt) {
                        this.groupList[i].hour = '00'
                        this.groupList[i].mniuate = '00'
                        this.groupList[i].second = '00'
                        this.groupList[i].day = '0'
                    } else {

                        var d = Math.floor(parseInt(t) / 86400)
                        var h = Math.floor((t / 3600) - (d * 24))
                        var m = Math.floor((t - h * 60 * 60 - d * 24 * 60 * 60) / 60)
                        var s = t % 60
                        if (h < 10) h = '0' + h
                        if (m < 10) m = '0' + m
                        if (s < 10) s = '0' + s
                        if (d == 0) d = '0'

                        this.groupList[i].hour = isNaN(h) ? '00' : h
                        this.groupList[i].mniuate = isNaN(h) ? '00' : m
                        this.groupList[i].second = isNaN(h) ? '00' : s
                        this.groupList[i].day = isNaN(h) ? '00' : d
                    }
                }
                if (this.timeid == 0) {
                    this.timeid = setInterval( () => {

                        for (var i = 0; i < this.groupList.length; i++) {
                            var tt = true
                            if (this.topTabBar) {
                                var t = --this.groupList[i].leftTime
                                if (this.groupList[i].leftTime < 0) {
                                    tt = false
                                }
                            } else {
                                if (this.groupList[i].status == 2) {
                                    var t = --this.groupList[i].canbuy
                                    if (this.groupList[i].canbuy <= 0) {
                                        tt = false
                                    }
                                } else {
                                    var t = --this.groupList[i].leftTime
                                    if (this.groupList[i].leftTime <= 0 || this.groupList[i].status == 3 || this.groupList[i].status == -1) {
                                        tt = false
                                    }
                                }
                            }
                            if (!tt) {
                                this.groupList[i].hour = '00'
                                this.groupList[i].mniuate = '00'
                                this.groupList[i].second = '00'
                                this.groupList[i].day = '0'
                            } else {
                                var d = Math.floor(parseInt(t) / 86400)
                                var h = Math.floor((t / 3600) - (d * 24))
                                var m = Math.floor((t - h * 60 * 60 - d * 24 * 60 * 60) / 60)
                                var s = t % 60
                                if (h < 10) h = '0' + h
                                if (m < 10) m = '0' + m
                                if (s < 10) s = '0' + s
                                if (d == 0) d = '0'
                                this.groupList[i].hour = h
                                this.groupList[i].mniuate = m
                                this.groupList[i].second = s
                                this.groupList[i].day = d
                            }
                        }
                    }, 1000)

                }

                setTimeout(function () {
                    this.list = this.groupList
                }, 0)
            },
            /**
             * 关闭弹窗
             * */
            closeDialog () {
                this.isShow = false
            },
            /**
             *
             * */
            clickConfirm () {
                this.closeDialog()
                uni.navigateTo({
                    url: 'bargainIng?proId=' + this.obj.proId + '&attr_id=' + this.obj.attr_id + '&brStatus=' + this.obj.brStatus +
                        '&bargain_id=' + this.obj.bargain_id + '&order_no=' + this.obj.order_no + '&hasorder=' + this.hasorder
                })
            },
            /**
             * 立即砍价
             * */
            toBargainIng (id, attr_id, status, order_no, bargain_id, hasorder, leftTime) {
                if (leftTime <= 0) {
                    return
                }

                let data = {
                    module: 'app',
                    action: 'login',
                    app: 'token',
                    
                }
                this.$req.post({data}).then((res) => {
                    if (res.code == 200 && res.data.login_status == 1) {
                        console.log(status + '---leftTime----' + leftTime)
                        if (status != 0 && leftTime > 0) {
                            let content = {
                                4: this.language.bargain.promptContent[0],
                                0: this.language.bargain.promptContent[1],
                                1: this.language.bargain.promptContent[2],
                                2: this.language.bargain.promptContent[3],
                                3: this.language.bargain.promptContent[4]
                            }
                            this.obj = {
                                proId: id,
                                attr_id: attr_id,
                                brStatus: status,
                                order_no: order_no,
                                bargain_id: bargain_id,
                                hasorder: hasorder
                            }
                            if (status < 0) {
                                if (status == -1) {
                                    this.dialogContent = content[0]
                                } else {
                                    this.dialogContent = content[4]
                                }
                            } else {
                                this.dialogContent = content[status]
                            }
                            this.isShow = true
                        } else if (status == 0) {
                            uni.navigateTo({
                                url: 'bargainIng?proId=' + id + '&attr_id=' + attr_id + '&brStatus=' + status + '&bargain_id=' +
                                    bargain_id + '&order_no=' + order_no
                            })
                        }
                    } else {
                        this.isLogin(()=>{})
                    }
                })

                
            },
            /**
             * 我的砍价
             * */
            changeTabBar () {
                this.navTo('/pagesA/bargain/bargain', true, this)
            },
            /**
             *
             * */
            _axios () {
                this.groupList = []
                this.loadingType = 0
                this.daodi = false

                let data = {
                    
                    module: 'app',
                    action: 'bargain',
                }

                if (this.topTabBar) {
                    data.m = 'bargainhome'
                    data.page = this.page1
                } else {
                    data.m = 'mybargain'
                    data.page = this.page2
                }

                this.$req.post({data}).then((res) => {
                    this.load = true
                    if (res.code == 200) {
                        res = res.data
                        console.log(res);
                        this.uniLoadMore = true
                        this.brHeadImg = res.img
                        this.list = res.list
                        console.log(this.list)
                        this.groupList.push(...res.list)

                        this.setTimeData()

                        this.noBargain = res.list.length ? false : true

                        if (res.list.length < 10) {
                            this.loadingType = 2
                            this.daodi = true
                        }

                    } else if (res.code == 404) {
                        this.topTabBar = true
                    } else {
                        this.list = []
                        uni.showToast({
                            title: res.message,
                            icon: 'none',
                            duration: 1500
                        })
                    }  
                })
            }
        },
        /**
         * 页面上拉触底事件的处理函数
         * */
        onReachBottom () {

            if (this.daodi) {
                return false
            }

            let data = {
                module: 'app',
                action: 'bargain',
            }

            if (this.topTabBar) {
                data.m = 'bargainhome'
                data.page = ++this.page1
            } else {
                data.m = 'mybargain'
                data.page = ++this.page2
            }

            this.loadingType = 1

            this.$req.post({
                data
            }).then(res => {

                if (res.code == 200) {
                    if (res.list.length) {

                        this.list = this.list.concat(res.list)
                        this.groupList.push(...res.list)
                        if (res.list.length < 10) {
                            this.loadingType = 2
                            if (this.topTabBar) {
                                this.page1 = 1
                            } else {
                                this.page2 = 1
                            }
                            this.daodi = true
                        }
                    } else {
                        this.loadingType = 2
                    }
                }

            })
        }
    }
</script>

<style lang="less" scoped>
    @import url("../../static/css/bargain/bargain.less");
</style>
