<template>
    <div>
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <heads :title='language.bidding_my.title'></heads>
        <toload :load="load">
            <!--   订单列表     -->
            <div class="yh-ddlist">
                <div class="list_height"></div>
                <ul class="list_ul" v-for='(item,index) in order' :key="index">
                    <li v-if="order.length&&load" @tap="nav_click(item.id,item.mark,item.is_promise)"
                        :class="status_id==1?'list_li2':''">
                        
                        <div>
                            <div class="li-top" v-if="item.mark != 1">
                                <div class="left">
                                    <text v-if='(item.mark == 3 || item.mark == 4) && item.is_buy == 0'>
                                        {{item.endtime}} {{language.bidding_my.end}}
                                    </text>

                                    <text v-if='(item.mark == 4) && item.is_buy == 1'>
                                        {{item.endtime}} {{language.bidding_my.end}}
                                    </text>

                                    <text v-if='item.mark != 3 && item.mark != 4'>
                                        {{item.endtime}} {{language.bidding_my.end}}
                                    </text>
                                    
                                </div>
                                <div class="right">
                                    <text v-if='(item.mark == 4) && item.is_buy == 0'>
                                        {{ language.bidding_my.success }}
                                    </text>

                                    <text v-if='(item.mark == 3) && !item.trade_no'>
                                        {{ language.bidding_my.success }}
                                    </text>
                                    
                                    

                                    <text v-if='(item.mark == 4) && item.is_buy == 1'>
                                        {{ language.bidding_my.success }}
                                    </text>
                                    
                                    <text v-if='item.mark == 2'>
                                        {{ language.bidding_my.fail }}
                                    </text>

                                    <text v-if='item.mark == 5'>
                                        {{ language.bidding_my.auction }}
                                    </text>
                                    <text v-if='(item.mark == 3) && item.trade_no'>
                                        {{ language.bidding_my.auction }}
                                    </text>
                                </div>
                            </div>
                            <div class="li-top li-top-mark1" v-if="item.mark == 1">
                                <div class="left">
                                    <div class="left">
                                        {{language.bidding_my.jujieshu}}
                                    </div>
                                    <div class="right">
                                        {{ item.secondsFormart }}
                                    </div>
                                </div>
                            </div>
                            <img class="list_imgurl" :src="item.imgurl"/>
                            <div class="list_content">
                                <div class="list_title list_break2" style="margin-bottom: 0;" v-if="(item.mark == 4 && item.is_buy == 0) || item.mark == 5">{{item.title}}</div>
                                <div class="list_title list_break2" v-else>{{item.title}}</div>
                                
                                
                                <div class="tishi" v-if="item.mark == 4 && item.is_buy == 0" style="font-size: 24rpx;font-weight: 500;color: #B07F34">{{ language.bidding_my.tishi1 }}</div>
                                <div class="tishi" v-if="item.mark == 5" style="font-size: 24rpx;font-weight: 500;color: #B07F34">{{ language.bidding_my.tishi2 }}</div>
                                <div class="tishi" v-if="item.mark == 3 && item.trade_no" style="font-size: 24rpx;font-weight: 500;color: #B07F34">{{ language.bidding_my.tishi3 }}</div>
                                
                                
                                <div class="list_up list_break1">{{language.bidding_my.startingPrice}}<span>¥{{item.price}}</span>{{language.bidding_my.offer}} {{item.pepole}} {{language.bidding_my.people}}</div>
                                <div class="list_number list_break1">{{language.bidding_my.bidBy}} ¥{{item.add_price}} {{language.bidding_my.time}}</div>
                            </div>
                            <!-- mark（1-继续竞拍 2-已结束，不是得主  3.已结束，是得主未付款 4.已结束，是得主已付款） -->
                            <div class="list_bottom" v-if="item.mark != 5 && item.mark != 2">
<!--                                <span>{{item.mark==1?language.bidding_my.ongoing:(item.mark==2?language.bidding_my.finished:(item.mark==3?language.bidding_my.obligation:(item.mark==4?language.bidding_my.done:(item.mark==5?language.bidding_my.finished:''))))}}</span>-->
<!--                                <img class='list_time' :src="timeIcon"/>-->
<!--                                <span class="list_nt" v-if='(item.mark == 3 || item.mark == 4) && item.is_buy == 0'>{{item.invalid_time}} {{language.bidding_my.agoOrder}}</span>-->
                                
                                
<!--                                <span class="list_nt"-->
<!--                                      v-if='item.mark == 4 && item.is_buy == 0'>{{item.endtime}} {{language.bidding_my.cutOff}}</span>-->
                                
                                
<!--                                <span class="list_nt"-->
<!--                                      v-if='item.mark == 4 && item.is_buy == 1'>{{item.endtime}} {{language.bidding_my.cutOff}}</span>-->
<!--                                <span class="list_nt" v-if='item.mark != 3 && item.mark != 4'>{{item.endtime}} {{language.bidding_my.cutOff}}</span>-->


                                <!-- 待付款和我的订单阻止冒泡 -->
                                <div v-if="item.mark==3||item.mark==4" class="list_status"
                                     :class="{noBtn: item.mark==2||item.mark ==5}"
                                     @click.stop="nav_click_sm(item.id,item.mark,item.is_promise, item.trade_no)">
                                    {{(item.mark==1?language.bidding_my.continueAuction:(item.mark==2?language.bidding_my.finished:(item.mark==3?language.bidding_my.myOrder:(item.mark==4?language.bidding_my.myOrder:(item.mark==5?language.bidding_my.finished:'')))))}}
                                </div>

                                <div v-if="item.mark != 3 && item.mark != 4 && item.mark != 5 && item.mark != 2" class="list_status"
                                     :class="{noBtn: item.mark==2||item.mark ==5, Continue : item.mark == 1}">
                                    {{(item.mark==1?language.bidding_my.continueAuction:(item.mark==2?language.bidding_my.finished:(item.mark==3?language.bidding_my.myOrder:(item.mark==4?language.bidding_my.myOrder:(item.mark==5?language.bidding_my.finished:'')))))}}
                                </div>
                            </div>
                        </div>

                        <div class="list_height"></div>
                    </li>
                </ul>
            </div>

            <div class='empty_play' v-if='!order.length && load'>
                <img :src="emptyImg"/>
                <p>{{language.bidding_my.noOrderText}}</p>
                <p class='empty_p'>{{language.bidding_my.noOrderText1}}</p>
                <div class="empty_btn" @tap="navToHome()">{{language.bidding_my.goHome}}</div>
            </div>
        </toload>
    </div>
</template>

<script>
    import Heads from '../../components/header.vue'
    import {mapMutations} from 'vuex'
    export default {
        data () {
            return {
                title: '我的竞拍',
                fastTap: true,
                loadImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/5-121204193R7.gif',
                emptyImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/noFind.png',
                back1: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/back2x.png',
                search2x: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/search@2x.png',
                timeIcon: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/timeIcon.png',
                list_n: false,
                head: true, //头部切换
                // header: ['即将开拍', '正在热拍', '我的竞拍'],
                header: ['即将开拍', '正在热拍'],
                
                order: '', //订单数据 
                status_id: '', //订单状态
                dis_play: '', //
                sreach_value: '', //搜索框的值
                page: 1, //加载页码
                load_next: true, //能否继续下拉 true:能 false:不能
                allLoaded: false,
                autoFill: false, //若为真，loadmore 会自动检测并撑满其容器
                bottomStatus: '',
                bottomPullText: '上拉加载更多...',
                bottomDropText: '释放更新...',
                loading: false,
                load: false,
                stau_num: null,
                timer: null,
                count: '',
                flag: true,
                loadingType: 0,
                value: '',
                clickFlag: false,
            }
        },
        components: {
            Heads
        },
        onLoad () {
            this.status_id = this.$store.state.head_id;
            this._axios()
        },
        computed: {
            halfWidth: function () {
                var gru = uni.getStorageSync('data_height') ? uni.getStorageSync('data_height') : this.$store.state.data_height
                var heigh = parseInt(gru)
                var he = heigh * 2

                // #ifdef MP-WEIXIN
                return '0px'
                // #endif

                // #ifndef MP-WEIXIN
                return uni.upx2px(he) + 'px'
                // #endif

            },
        },
        onReachBottom: function () {
            var me = this

            if (me.load_next) { //有可加载的商品
                me.page += 1
                var data = {
                    module: 'app',
                    action: 'auction',
                    m: 'index',
                    type: 'my',
                    page: this.page
                }
                this.$req.post({data}).then(res => {
                    if (res.code == 200) {
                        if (res.list.length > 0) {
                            me.order = me.order.concat(res.list)
                        } else {
                            me.load_next = false
                            uni.showToast({
                                title: me.language.loadMore.contentText.contentnomore,
                                duration: 1500,
                                icon: 'none'
                            })
                        }
                    }
                    uni.hideLoading()
                })
            }
        },
        methods: {
			changeLoginStatus(){
				this.page = 1;
				this._axios();
			},
            ...mapMutations({
                order_id: 'SET_ORDER_ID',
                address_id: 'SET_ADDRESS_ID',
                bindding_num: 'SET_BINDDING_NUM',
                bind_status: 'SET_BIND_STATUS',
                bind_promise: 'SET_BIND_PPOMISE',
                head_id: 'SET_HEAD_ID',
                pay_lx: 'SET_PAY_LX',
            }),
            /**
             * 跳转
             * */
            nav_click (id, stat, promise) {
                this.bindding_num(id)
                if (this.status_id == 0) {
                    this.bind_promise(0)
                    this.bind_status(0)
                } else if (this.status_id == 2) {
                    this.bind_promise(1)
                    this.bind_status(stat)
                } else if (this.status_id == 1) {
                    if (stat == 1) {
                        this.bind_promise(promise)
                    } else {
                        this.bind_promise(1)
                    }
                    this.bind_status(stat)
                }
                //经我的竞拍页面进入出价详情页
                uni.navigateTo({
                    url: 'bidding_detailed_Two?mark=' + stat + '&from_my=1',
                })
            },
            /**
             * 待付款和我的订单跳转处理
             * */
            nav_click_sm (id, stat, promise, trade_no=  '') {
                //一堆不知道操作设么的东西
                this.bindding_num(id)
                if (this.status_id == 0) {
                    this.bind_promise(0)
                    this.bind_status(0)
                } else if (this.status_id == 2) {
                    this.bind_promise(1)
                    this.bind_status(stat)
                } else if (this.status_id == 1) {
                    if (stat == 1) {
                        this.bind_promise(promise)
                    } else {
                        this.bind_promise(1)
                    }
                    this.bind_status(stat)
                }

                // if (stat == 3) {
                //     this.pay_lx('jp')
                //     uni.navigateTo({
                //         url: '/pagesA/bidding/bidding_order'
                //     })
                //     return false
                // } else 
                if (stat == 4 || stat == 3) {
                    uni.navigateTo({
                        url: '/pages/order/orderSearch?sreach_value=' + trade_no,
                    })
                }
            },
            /**
             * 初始加载函数
             * */
            async _axios () {
                let data = {
                    module: 'app',
                    action: 'auction',
                    m: 'index',
                    type: 'my',
                    page: this.page,
                }
                this.$req.post({data}).then(res => {
                    res = Object.assign(res, res.data)
                    if(res.res){
                        res.res = res.res.map(item => {
                            
                            // item.seconds = moment(item.invalid_time).diff(moment(), 'seconds') 
                            item.seconds = (new Date(item.endtime).valueOf() - new Date().valueOf() ) / 1000
                            item.secondsFormart = this.formatSecond(item.seconds);
                            return item;
                        })
                        this.order = res.res
                        this.allLoaded = res.res.length < 10;
                        this.handleTime();
                        this.load = true
                        console.log(this.order.length)
                    }else{
                        uni.navigateBack({
                            delta:1
                        })
                    }
                })
            },
            handleTime () {
                this.timer = setInterval(() => {
                    this.order = this.order.map(item => {
                        item.seconds = item.seconds - 1;
                        item.secondsFormart = this.formatSecond(item.seconds);
                        if (item.seconds === 0) {
                            this.page = 1
                            this._axios()
                        }
                        return item;
                    })
                    
                }, 1000)
            },
            formatSecond(result) {
                const t = Math.floor((result / 3600 / 24));
                const h = Math.floor((result / 3600) % 24);
                const m = Math.floor((result / 60) % 60);
                const s = Math.floor(result % 60);
                
                
                
                if (s < 10) {
                    result = '0' + s + "";    
                } else {
                    result = s + "";
                }
                
                
                if (m > 0) {
                    if (m < 10) {
                        result = '0' + m + ":" + result;    
                    } else {
                        result = m + ":" + result;
                    }
                    
                }
                if (h > 0) {
                    
                    if (h < 10) {
                        result = '0' + h + ":" + result;    
                    } else {
                        result = h + ":" + result;
                    }
                    
                    
                }
                
                if (t > 0) {
                    result = t + '天' + result
                }

                return result;
            }
            
        }
    }
</script>

<style scoped lang="less">
    @import url("../../static/css/bidding/bidding_my.less");
</style>
