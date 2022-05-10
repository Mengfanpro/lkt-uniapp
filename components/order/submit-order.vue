<template>
    <view class="submit-order">
        <div :class='ishide==1?"hide":""' class='foot'>
            <div>
                <p class="yh-pay-ye">{{language.submitOrder.total}}<span>￥{{total.toFixed(2)}}</span></p>
                <span v-if="rate!='0' && rate!=0" class="pay-rate">{{language.submitOrder.rate}} ￥{{rate.toFixed(2)}}</span>
            </div>
            <p @tap="$emit('submit')">{{language.submitOrder.submit}}</p>
        </div>
    </view>
</template>


<script>
    /**
     * submit-order 订单提交组件
     */
    export default {
        name: 'submit-order',
        props: {
            ishide: {
                default: 0,
                type: Number
            },
            total: {
                default: 0,
                type: [Number, String]
            },
            rate: {
                default: 0,
                type: [Number, String]
            },
        },
        created(){
            this.setLang();
        }
    }
</script>

<style lang="less" scoped>
    .foot {
        height: 108rpx;
        width: 100%;
        font-size: 30rpx;
        color: #020202;
        border-top: 1px solid #eee;
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 20;
        background-color: #fff;
        padding-left: 30rpx;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;

        &.hide {
            display: none;
        }

        .yh-pay-ye {
            .size(30rpx);
            color: #020202;
            
            span{
                color: @priceColor;
                font-weight: bold;
            }
        }
        
        .pay-rate{
            .size(22rpx);
            color: @priceColor;
            margin-top: 13rpx;
        }
        
        >div{
            display: flex;
            flex-direction: column;
        }

        > p {
			.solidBtn();
            .center();
            width: 240rpx;
            height: 100%;
            margin-left: 30rpx;
        }
    }
</style>
