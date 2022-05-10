<template>
    <div>
        <!-- #ifndef MP -->
        <heads :title='language.seckill.payResult.title' :returnR='returnR'></heads>
        <!-- #endif -->
        <div class='pay_result'>
            <img :src="xuanze"/>
            <span>{{language.seckill.payResult.title}}</span>
            <p>{{language.seckill.payResult.Tips}}！</p>
        </div>
        <!--灰色间隔-->
        <div class='hr'></div>
        <div>
            <ul>
                <li>
                    <span class='color_666'>{{language.seckill.payResult.Order_number}}：</span>
                    <span>{{data1.sNo||sNo}}</span>
                </li>
                <li>
                    <span class='color_666'>{{language.seckill.payResult.Payment_amount}}：</span>
                    <span v-if="is_jifen" class='flex_center'>
						<font v-if='data1.total>0'>￥{{data1.total}}+</font>
						<img :src="integral_img" class='int_img'>{{data1.total_score}}
					</span>
                    <span v-else>￥{{data1.total||payment_money}}</span>
                </li>
            </ul>
            <div class='go_shopping go_home' @tap="navToHome()">{{language.seckill.payResult.shopping}}</div>
            <div class='go_shopping chakan' @tap="_order">{{language.seckill.payResult.View_order}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                payment_money: '',
                title: '付款成功',
                sNo: '',
                order_id: '',
                data1: '',
                xuanze: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/xuanzehei2x.png',
                returnR: 99,
                flag: true,
                bback: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/bback.png',
                back: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/back2x.png',
                is_jifen: false,
                integral_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/integral_hei.png',
            }
        },
        onLoad () {
            this.data1 = JSON.parse(uni.getStorageSync('payRes'))
            this.data1.total = this.data1.total.toFixed(2)
        },
        methods: {
            _order () {
                var path = '../../pages/order/order?order_id=' + this.data1.order_id + '&showPay=true'
                // #ifdef H5
                console.log('h5')
                path = '../../pages/order/order?order_id=' + this.data1.order_id + '&showPay=true&_store=h5'
                // #endif
                uni.redirectTo({
                    url: path
                })
            }
        },

    }
</script>

<style lang="less" scoped>
    @import url("../../static/css/pay/payResult.less");
    /* 上面试公共CSS,下面是私有css*/
    .hr {
        width: 100%;
        height: 20rpx;
        background-color: #F4F4F4;
    }

    .color_666 {
        color: #666666;
    }

    .flex_center {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .int_img {
        height: 24rpx;
        width: 24rpx;
        margin-right: 6rpx;
        margin-bottom: 6rpx;
    }

    .go_home {
        color: #fff;
        border-radius: 8rpx;
    }

    .chakan {
        border-radius: 8rpx;
        margin-top: 0;
        background: transparent;
        color: #242424;
        border: 1px solid #242424;
    }
</style>
