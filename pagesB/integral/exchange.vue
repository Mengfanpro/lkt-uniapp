<template>
    <view class='page_container' :style="{background:!list.length?'#ffffff':''}">
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <heads :title='language.integral.exchange.title' :returnR="8"></heads>

        <!--   导航栏      -->
        <ul class="order_header">
            <li class="header_li" :class="current==index?'header_border':''" 
                v-for="(item, index) in header" :key="item.id" 
                @tap="_header_index(index)"
            >
                {{ item }}
                <span class="bottom-hr" v-if="current===index"></span>
            </li>
        </ul>
        
        <toload :load="load">
            <view v-if='list.length>0' class='page_content'>
                <view v-for="(item,index) in list" :key='index'>
                    <view class='list_top' @tap='_goStore(item.shop_id)' v-if="item.list.length">
                        <image class='list_logo' :src="storeImg"></image>
                        {{item.shop_name}}
                        <image class='list_back' :src="jiantou"></image>
                        <text class='stutas'>{{item.status == 0?language.seckill.seckill_my.status[0]:item.status == 1?language.seckill.seckill_my.status[1]:item.status == 2?language.seckill.seckill_my.status[2]:item.status == 3?language.seckill.seckill_my.status[3]:item.status == 5?language.seckill.seckill_my.status[5]:item.status == 7?language.seckill.seckill_my.status[4]:''}}
                        </text>
                          
                    </view>
                    <view class='list_center' @tap="_goorder(item.id)" v-if="item.list.length">
                        <image class='list_img' :src="item.list[0].imgurl"></image>
                        <view class='list_content'>
                            <text>{{item.list[0].p_name}}</text>
                            <text class='size'>{{item.list[0].size}}</text>
                        </view>
                        <view class='money'>
                            <text style="margin-top: 3px;">￥{{item.list[0].p_price.toFixed(2)}}</text>
                            <p class="yh-money">
                                <span>+</span>
                                <img :src="integral_hei" class="yh-integral">
                            
                                <span class="integrals">{{item.list[0].after_discount}}</span>
                            </p>
                            <text class='size guige'>x{{item.sum}}</text>
                            <div class="retreat commodity-price-btn" v-if="order_type == 'evaluete' && item.list[0].comments_type == 1" @click.stop="comment(item.list[0])">{{language.order.order.button[2]}}</div>
                            <div class="retreat commodity-price-btn" v-if="order_type == 'evaluete' && item.list[0].comments_type == 2" @click.stop="comment(item.list[0])">{{language.order.order.button[3]}}</div>
                        </view>
                    </view>
                    <view class='list_bottom' v-if="item.list.length">
                        <view class='list_bottom_money'>
                            <span class='size bold'>{{language.seckill.seckill_my.common}}{{item.sum}}{{language.seckill.seckill_my.piece}}</span>
                            <view>
                                <span class='bold'>{{language.seckill.seckill_my.total}}：</span>
                                <span class='red bold'>￥{{item.z_price.toFixed(2)}}</span>
                                <span class='red bold'>+</span>
                                <img :src="integral_hong" class="yh-integral_hong">
                                <span class='red bold' style="margin-left: 4px;">{{ item.allow }}</span>
                            </view>
                        </view>
                        <view class='btn_box'>
<!--                            <button @tap="_goorder(item.id)">查看详情</button>-->
<!--                            <button @tap="_goorder(item.id)" v-if="item.status == 0" class='btn_back'>立即付款</button>-->
                            <template v-if="item.status == 0">
                                <button @tap.stop="cancel(item.id,item.list[0].p_id)">{{language.seckill.seckill_my.button[0]}}</button>
                                <button @tap.stop="pay(item.id)"  class='btn_back'>{{language.seckill.seckill_my.button[1]}}</button>
                            </template>
                            <template v-else-if="item.status == 1">
                                <button v-if="item.delivery_status == 0" @tap.stop="_txfh(item.id)" class="btn_back">{{language.seckill.seckill_my.button[2]}}</button>
                                <button v-else-if="item.delivery_status == 1" style="background: rgb(169, 169, 169);color: #fff; border: none;">{{language.seckill.seckill_my.button[2]}}</button>
                            </template>
                            <template v-else-if="item.status == 2 && item.self_lifting != 1">
                                <button @tap.stop="toExp(item.sNo)">{{language.seckill.seckill_my.button[3]}}</button>
                                <button @tap.stop="goods_true(item.id)"  class='btn_back'>{{language.seckill.seckill_my.button[4]}}</button>
                                <!-- 确认收货 -->
                            </template>
                            <template v-else-if="item.status == 2 && item.self_lifting == 1">
                                <button @tap.stop="onCktqmClick(item)"  class='btn_back'>{{language.order.myorder.Extraction[1]}}</button>
                            </template>
                            <template v-else-if="item.status == 3">
                                <button @tap.stop="_goorder(item.id)">{{language.seckill.seckill_my.button[5]}}</button>
                                <button @tap.stop="evaluate(item.list[0].id)" class='btn_back'>{{language.seckill.seckill_my.button[6]}}</button>
                            </template>
                            <template v-else-if="item.status == 5 && item.self_lifting != 1">
                                <button @tap.stop="_delOrder(item.id)">{{language.seckill.seckill_my.button[7]}}</button>
                                <button @tap.stop="onCkwlClick(item.sNo)">查看物流</button>
                            </template>
                            <template v-else-if="item.status == 5 && item.self_lifting == 1">
                                <button @tap.stop="onCktqmClick(item)"  class='btn_back'>{{language.order.myorder.Extraction[0]}}</button>
                            </template>
                            <template v-else-if="item.status == 7">
                                <button @tap.stop="_delOrder(item.id)">{{language.seckill.seckill_my.button[7]}}</button>
                            </template>
                            
                        </view>
                    </view>
                </view>
                <uni-load-more v-if='moreFlag' :loadingType="loadingType"></uni-load-more>
            </view>    
        </toload>

        <tqm />
        <div v-if="!list.length" class='noFindDiv'>
            <div>
                <img class='noFindImg' :src="noOrder"/>
            </div>
            <span class='noFindText'>{{language.seckill.seckill_my.Tips[0]}}</span>
            <div @tap="_toHome()" class='goHomeBox'>
                <span class='goHome'>{{language.seckill.seckill_my.go_shoping}}</span>
            </div>
        </div>
    </view>
</template>
<script>
    import tqm from "@/pages/order/components/tqm";
    export default {
        data () {
            return {
                title: '我的兑换',
                
                jiantou: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jiantou2x.png',
                storeImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/store.png',
                list: [],  //我的秒杀商品列表
                page: 1,//页码
                noOrder: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/noOrder.png',
                load: false,
                loadImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/5-121204193R7.gif',
                loadingType: 0,
                moreFlag: false,
                header: ['全部', '待付款', '待发货', '待收货', '待评价'],
                current: 0,
                order_type: '', //全部'' 付款payment 发货send 收货receipt 评价evaluete
                fastTap: true,
                
                integral_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/integral_hei.png',
                integral_hong: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/integral.png',
            }
        },
        mounted () {
            this.isLogin(()=>{
				this._axios()
			})
        },
        onLoad (option) {
          console.log(option.order_type)
          if(option.order_type) {
              this.order_type = option.order_type
              this.current = this.getCurrent(this.order_type)
          }
        },
		onShow() {
			this.isLogin(()=>{
				this._axios()
			})
		},
        components: {tqm},
        onReady() {
            var that = this.language.order.myorder
            this.header = [that.whole,that.to_paid,that.to_delivered,that.to_Receiving,that.to_evaluated]
        },
        methods: {
            getCurrent(value) {
                switch (value) {
                    case 'payment':
                        return 1
                        break
                    case 'send':
                        return 2
                        break
                    case 'receipt':
                        return 3
                        break
                    case 'evaluete':
                        return 4
                        break
                    default:
                        return 0
                }
            },
            comment(orders) {
                console.log(orders)
                let { id, comments_type } = orders;
                console.log(comments_type)
                if (comments_type == 1) {
                    uni.navigateTo({
                        url: '/pages/evaluate/evaluating?order_details_id=' + id + '&num=all'
                    });
                } else {
                    uni.navigateTo({
                        url: '/pages/evaluate/evaluating?order_details_id=' + id + '&add=true&num=all'
                    });
                }
            },
            // 查看提取码
            onCktqmClick (item) {
                let data = {
                    module: 'app',
                    app: 'see_extraction_code',
                    action: 'order',
                    order_id: item.id,
            
                };
                this.$req.post({data}).then(res => {
                    uni.$emit('receiving_check_show')
                    let { code, data, message } = res;
            
                    if (code === 200) {
                        uni.$emit('receiving_check_emit', data)
                    } else {
                        uni.showToast({
                            title: message,
                            duration: 1500,
                            icon: 'none'
                        });
                    }
                }).catch(error=>{
                    
                });
            },
            //确认收货
            goods_true(id){
                uni.showModal({
                    title: this.language.order.myorder.prompt2,
                    content: this.language.order.myorder.Tips2,
					confirmText: this.language.order.myorder.confirm,
					cancelText: this.language.order.myorder.cancel,
                    success: res => {
                        if (res.confirm) {
                            let data = {
                                module: 'app',
                                action: 'order',
                                app: 'ok_Order',
                                order_id: id,
                            };
                            this.$req.post({data}).then(res => {
                                let { code, message } = res;
                                if (code === 200) {
                                    uni.showToast({
                                        title: this.language.order.orderSearch.Tips2[4],
                                        duration: 1000,
                                        icon: 'none'
                                    });
                                    
                                    this._axios()
                                } else {
                                    uni.showToast({
                                        title: res.message,
                                        duration: 1500,
                                        icon: 'none'
                                    });
                                }
                                this._axios()
                            });
                        } else if (res.cancel) {
                           
                        }
                    }
                });
            },
            // 查看物流
            onCkwlClick (sNo) {
                let data = {
                    module: 'app',
                    action: 'order',
                    app: 'logistics',
                    id: sNo,
                    o_source: 1,
                    type: ''
                };
            
                // if (this.source == 1) {
                //     data.type = 'pond';
                // }
            
                this.$req.post({ data }).then(res => {
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
            },
			changeLoginStatus(){
				this._axios()
			},
            //立即付款
            pay(id){
                var path = '/pages/order/order_payment?order_id=' + id + '&showPay=true' + '&type=IN';
                // #ifdef H5
                path = '/pages/order/order_payment?order_id=' + id + '&showPay=true&_store=h5' + '&type=IN';
                // #endif
                uni.navigateTo({
                    url: path
                });
            },
            
            //取消订单
            async cancel(id,jf_id){
                let data = {
                    'module':'app',
                    'action': 'order',
                    'app': 'removeOrder',
                    'order_id': id,
                    jifen_id: jf_id
                }
                let res = await this.$req.post({data})
                if(res.code==200){
                    uni.showToast({
                        title: this.language.seckill.seckill_my.Tips[1],
                        icon: 'none',
                    })
                    let index = this.list.findIndex(item=>item.id == id)
                    this.list.splice(index,1)
                }else {
                    uni.showToast({
                        title: this.language.seckill.seckill_my.Tips[2],
                        icon: 'none',
                    })
                }
            },
            //删除订单
            _delOrder(id) {
                var data = {
                    module: 'app',
                    action: 'order',
                    order_id: id,
                    app: 'del_order'
                };
                this.$req.post({ data }).then(res => {
                    let { code, message } = res;
                    if (code == 200) {
                        uni.showToast({
                            title: this.language.seckill.seckill_my.Tips[3],
                            duration: 1000,
                            icon: 'none'
                        });
                        let index = this.list.findIndex(item=>item.id == id)
                        this.list.splice(index,1)
                    } else {
                        uni.showToast({
                            title: message,
                            duration: 1000,
                            icon: 'none'
                        });
                    }
                });
            },
            //提醒发货
            _txfh(id) { 
                if (!this.fastTap) {
                    return
                }
                this.fastTap = false
                var data = {
                    module: 'app',
                    order_id: id,
                    app: 'delivery_delivery',
                    action: 'order'
                }
                this.$req.post({data}).then(res=>{
                    if (res.code == 200) {
                        this.fastTap = true
                        uni.showToast({
                            title: this.language.seckill.seckill_my.Tips[4],
                            duration: 1000,
                            icon: 'none'
                        })
                        this._axios()
                    } else {
                        uni.showToast({
                            title: res.message,
                            duration: 1500,
                            icon: 'none'
                        })
                    }
                })
            },
            //立即评价
            evaluate(id){
                uni.navigateTo({
                    url: '/pages/evaluate/evaluating?order_details_id=' + id + '&num=all'
                });
            },
            //确认收货
            ok(id){
                var data = {
                    module: 'app',
                    action: 'order',
                    app: 'ok_Order',
                    order_id: id,
                }
                this.$req.post({data}).then(res=>{
                    if (res.code == 200) {
                        uni.showToast({
                            title: this.language.seckill.seckill_my.Tips[5],
                            duration: 1500,
                            icon: 'none'
                        })
                        setTimeout(function() {
                            this._axios()
                        }, 1500)
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
             * 导航栏切换
             */
            _header_index(index) {
                this.isLogin(()=>{
                    this.page = 1;
                    this.current = index;
                    switch (index) {
                        case 0:
                            this.order_type = '';
                            break;
                        case 1:
                            this.order_type = 'payment';
                            break;
                        case 2:
                            this.order_type = 'send';
                            break;
                        case 3:
                            this.order_type = 'receipt';
                            break;
                        case 4:
                            this.order_type = 'evaluete';
                            break;
                    }
                    this._axios();
                })
            },
            //封装一个数组排序方法
            compare(key, desc) {
                //key:  用于排序的数组的key值
                //desc： 布尔值，为true是升序排序，false是降序排序
                return function(a, b) {
                    let  value1 = a[key];
                    let  value2 = b[key];
                    if (desc == true) {
                        // 升序排列
                        return value1 - value2;
                    } else {
                        // 降序排列
                        return value2 - value1;
                    }
                };
            },
            // async _axios2 () {
            //     var me = this
            //     var data = {
            //         module: 'app',
            //         action: 'pthd_seckill',
            //         m: 'seckillorder',
            //         page: me.page,
            //         order_type: me.order_type
            //     }
            //     try {
            //         let res = await this.$req.post({data})
            //         res = res.data;
            //         console.log(res)
            //         if (res.order && res.order.length) {
            //             res.order.map(item => item.b_type = 1)
            //             return res.order;
            //         } else {
            //             return [];
            //         }
            //     } catch (e) {
            //         console.log(e);
            //         return [];
            //     }
            // },
            _axios () {
                var me = this
                var data = {
                    page: this.page,
                    pageSize: 10,
                    module: 'app',
                    action: 'order',
                    app: 'index',
                    order_type: 'IN',
                    queryOrderType: me.order_type
                }
                this.$req.post({data}).then(async res => {
                    console.log(res)
                    if (typeof (res) === 'string') {
                        res = {
                            data: {
                                order: [],
                            },
                            code: 200
                        }
                    } else if (!res.data.order.length){
                        res = {
                            data:{
                                order: [],
                                code: 200
                            }
                        }
                    }
                    
                    // let newList = await this._axios2();
                    me.load = true
                    
                    // let list = res.data.order.concat(newList)
                    let list = res.data.order
                    list = list.map(item => {
                        let timestamp = Date.parse(new Date(item.add_time));
                        timestamp = timestamp / 1000;
                        return {
                            ...item,
                            timestamp: timestamp
                        }
                    })
                    list.sort(this.compare('timestamp',false));
                    console.log(list);

                    me.list = list;
                    me.page = 1
                    console.log(res);
                    if (res.data.order.length >= 10) {
                        me.moreFlag = true
                    }
                })
            },
            
            
            _goStore (shop_id) {
                uni.navigateTo({
                    url: '/pagesA/store/store?shop_id=' + shop_id
                })
            },
            _goorder (order_id) {
                uni.navigateTo({
                    url: '/pages/order/order?order_id=' + order_id + '&returnR=11' + '&types=IN' + '&order_type=' + this.order_type
                })
                return false
            },
            _toHome () {
                uni.navigateTo({
                    url: '/pagesB/integral/integral'
                })
            },
            toExp(sNo){
                this.fastTap = true;
                let data = {
                    module: 'app',
                    action: 'order',
                    app: 'logistics',
                    id: sNo,
                    type: '',
                    o_source: 1,
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
                            console.log(data)
                            if (data.list.length > 1) {
                                uni.navigateTo({
                                    url: '/pagesB/expressage/expressage?sNo=' + sNo
                                });
                            } else {
                                uni.navigateTo({
                                    url: '/pages/expressage/expressage?list=' + JSON.stringify(data.list[0]) + '&sNo=' + sNo
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
                            title: this.language.seckill.seckill_my.Tips[6],
                            duration: 2000,
                            icon: 'none'
                        });
                    });
            },
            async getOnReachBottomPTHDData () {
                var data = {
                    module: 'app',
                    action: 'pthd_seckill',
                    m: 'seckillorder',

                    page: me.page,
                }
                
                let res = await this.$req.post({data});
                res = res.data
                if (res.order && res.order.length) {
                    res.order.map(item => item.b_type = 1)
                    return res.order;
                } else {
                    return []
                }
            }
        },
        onReachBottom () {
            var me = this
            if (this.loadingType != 0) {
                return
            }
            this.loadingType = 1
            me.page += 1
            var data = {
                page: this.page,
                pageSize: 10,
                module: 'app',
                action: 'order',
                app: 'index',
                order_type: 'IN',
                queryOrderType: me.order_type
            }
            this.$req.post({data}).then(async res => {
                console.log(res)
                res = res.data
                if (res.order.length > 0) {
                    // let newList = await this.getOnReachBottomPTHDData();
                    // let order = res.order.concat(newList);
                    me.list = me.list.concat(res.order)
                    me.loadingType = 0
                } else {
                    me.loadingType = 2
                }
            })
        }
    }
</script>

<style lang="less">
@import url('../../static/css/integral/exchange.less');
</style>
