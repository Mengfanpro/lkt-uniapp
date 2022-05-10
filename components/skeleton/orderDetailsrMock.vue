<template>
    <div>
        <div class="skeleton" v-if="!load">
            <div class="order_detail" style="height: 100vh;">
                <div style="height: 77px;" class="skeleton-rect"></div>

                <!--灰色间隔-->
                <div class="yh-line"></div>
                <!--商品列表-->
                <div >
                    <ul>
                        <li class='storeLi'>
                            <div style="height: 20px" class="skeleton-rect">
                                <img src="" class="yh-storeLi-imga">
                                <span class="">店铺名称</span>
                                <img src="" class="yh-jiantou-img">
                            </div>

                        </li>
                        <li  class='goods'>
                            <img class="skeleton-rect" src=""/>
                            <div class='goods_right'>
                                <p class="skeleton-rect">商品标题商品标题商品标题商品标题商品标题</p>
                                <div class='goods_bottom'>
                                    <p style="width: 60px;" class="skeleton-rect"><span class="yh-goods_bottom-span">￥</span>99.99</p>

                                    <div class='format skeleton-rect'>
                                        <p class="yh-format-p">
                                            规格：M 四字规格</p>
                                        <p class="yh-format-pa">x1</p>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <div class="yh-items"></div>
                    </ul>
                </div>

                <!--运费、优惠券、合计信息-->
                <ul>
                    <li class='order_coupon'>
                        <span class="skeleton-rect">运费</span>
                        <span class="skeleton-rect">￥5.00</span>
                    </li>
                    <li class='order_coupon'>
                        <span class="skeleton-rect">订单备注</span>
                        <span class="yh-order_coupon-spana"><input class="skeleton-rect" placeholder="选填，请先和商家协商一致" placeholder-style="color:#b8b8b8;font-size:28rpx; " type="text"
                        ></span>
                    </li>
                    <li class='order_coupon' >
                        <span></span>
                        <span class="yh-order_coupon-spanb skeleton-rect" >
						<!-- #ifndef MP-BAIDU || MP-ALIPAY -->
						合计：<font class="yh-order_coupon-fonta">￥74</font>
                            <!-- #endif -->
                            <!-- #ifdef MP-BAIDU || MP-ALIPAY-->
						合计：<span class="yh-order_coupon-fonta">￥74</span>
                            <!-- #endif -->
					</span>
                    </li>
                </ul>

                <div style="height: 157px;" class="skeleton-rect">

                </div>

                <div style="height: 49px;position: fixed;bottom: 0;width: 100%;display:flex;justify-content: space-between">
                    <div style="display:flex;justify-content:center;align-items:center;">
                        <p style="width: 110px;height: 21px;margin-left: 16px;" class="skeleton-rect">付款金额：￥74</p>
                    </div>
                    <div style="width: 120px;" class="skeleton-rect">立即支付</div>
                </div>
            </div>
        </div>
        <skeleton :animation="true" :loading="!load" bgColor="#FFF"></skeleton>
    </div>
    
</template>

<script>
    export default {
        props: {
            load: {
                type: Boolean
            }  
        },
        data () {
            return {
                
            }
        }
    }
</script>

<style lang="less" scoped>
    @import url("../../static/css/pay/orderDetailsr.less");
</style>
