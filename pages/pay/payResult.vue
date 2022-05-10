<template>
    <div>

        <heads :title='language.pay.payResult.title' :returnR='returnR' :shopping="true"></heads>
        <div v-if='showTitle' class='pay_result'>
            <img :src="xuanze"/>
            <span>{{language.pay.payResult.pay_success}}</span>
            <p>{{language.pay.payResult.Tips}}</p>
        </div>
        <!--灰色间隔-->
        <div class="yh-line"></div>
        <div>
            <ul>
                <li>
                    <span class="yh-spans">{{language.pay.payResult.Order_number}}：</span>
                    <span>{{data1.sNo||sNo}}</span>
                </li>
                <li style="display: flex;">
                    <span class="yh-spans">{{language.pay.payResult.Payment_amount}}：</span>
                    <span v-if="is_jifen" class="yh-is_jifen">
						<text v-if="data1.total > 0">￥{{data1.total}}+</text>
						<img :src="integral_img" class="yh-integral_img">{{data1.total_score}}
					</span>
                    <span v-else>￥{{data1.total||payment_money}}</span>
                </li>
            </ul>
            <div class='go_shopping yh-go_shopping' @tap="_home()">{{language.pay.payResult.Continue_shopping}}</div>
            <div v-if=' order_id || sNo ' class='go_shopping go_order' @tap="_order()">{{language.pay.payResult.View_order}}</div>
        </div>
    </div>
</template>

<script>
    import heads from '../../components/header.vue'
    import { mapMutations } from 'vuex'

    export default {
        data () {
            return {
                payment_money: '',
                title: '支付结果',
                sNo: '',
                order_id: '',
                data1: '',
                returnR: '6',
                showTitle:true,
                flag: true,
                is_jifen: false,
                is_ms: false,
                xuanze: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/xuanzehei2x.png',
                bback: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/bback.png',
                back: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/back2x.png',
                integral_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/integral_hei.png',
            }
        },
        onLoad (option) {
            // #ifdef H5
            window.addEventListener(
              'popstate',
              e => {
                //回调函数中实现需要的功能
                //alert("我监听到了浏览器的返回按钮事件啦");
                this._home ()  
              },
              false
            );
            // #endif
            this.is_ms = option.is_ms
            if (option.payment_money) {
                this.payment_money = option.payment_money
                this.sNo = option.sNo
                let me = this;
                if(option.isH5){
                    this.showTitle = false;
                    uni.showActionSheet({
                        itemList: ["已完成支付,查看订单", "支付遇到问题"],
                        success: function (res) {
                            if(res == 0 ){
                                uni.redirectTo({
                                    url: '/pages/order/myOrder?status=1&mweb=1'
                                })
                            }else{
                                uni.redirectTo({
                                    url: '/pages/order/myOrder?status=0&mweb=1'
                                })
                            }
                        },
                        fail: function (res) {
                            uni.redirectTo({
                                url: '/pages/order/myOrder?status=0&mweb=1'
                            })
                        }
                    });
                }
            } else if (option.is_jifen) {
                this.is_jifen = option.is_jifen
                this.data1 = JSON.parse(uni.getStorageSync('payRes'))
                this.order_id = this.data1.order_id
            } else {
                this.data1 = JSON.parse(uni.getStorageSync('payRes'))
                this.data1.total = this.data1.total.toFixed(2)
                this.order_id = this.data1.order_id
            }
        },
        components: {
            heads
        },
        methods: {
            ...mapMutations({
                status: 'SET_STATUS',
            }),
            /**
             *
             * */
            _home () {
                if(this.is_ms) {
                   uni.navigateTo({
                       url: '/pagesB/seckill/seckill'
                   })
                   location.reload()
                } else if (this.is_jifen) {
                    uni.navigateTo({
                        url: '/pagesB/integral/integral'
                    })
                    location.reload()
                } else {
                    uni.switchTab({
                        url: '../tabBar/home'
                    })
                    location.reload()
                }
            },
            /**
             *
             * */
            _back () {
                uni.switchTab({
                    url: '../tabBar/home'
                })
                location.reload()
            },
            /**
             * @description 查看订单
             * */
            _order () {
                this.status(2)
                if(this.is_ms || this.data1.sNo.substring(0,2) == 'MS') {
                   uni.navigateTo({
                       url: '/pagesB/seckill/seckill_my'
                   })
                   location.reload()
                }  else if (this.is_jifen || this.data1.sNo.substring(0,2) == 'IN') {
                    uni.navigateTo({
                        url: '/pagesB/integral/exchange'
                    })
                    location.reload()
                } else {
                    uni.navigateTo({
                        url: '../order/myOrder'
                    })
                    location.reload()
                }
            }
        },

    }
</script>

<style lang="less" scoped>
    @import url("../../static/css/pay/payResult.less");
</style>
