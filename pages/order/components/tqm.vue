<template>
    <!-- 提取码弹出框 -->
    <div v-if="show" class="receiving_modal" @tap="receiving_stop">
        <div @tap.stop>
            <!-- 已完成 -->
            <img class="receiving_finish" v-if="receiving_check.status != 2" :src="finish2x" />
            <div class="receiving_content">
                <div class="receiving_content_title">{{language.order.order.order_number}}: {{ receiving_check.sNo }}</div>
                <div class="receiving_content_data" v-if="receiving_check.por_list.length == 1">
                    <div class="receiving_shop_img"><img :src="receiving_check.por_list[0].img" alt="" style="width:100%;height:100%;" /></div>
                    <div class="receiving_content_item">
                        <p>{{ receiving_check.por_list[0].product_title }}</p>
                        <div>
                            <p>
                                <span class="receiving_rmb">￥</span>
                                {{ receiving_check.por_list[0].p_price }}
                            </p>
                            <div class="receiving_size">
                                <span class="receiving_size_item">{{ receiving_check.por_list[0].size }}</span>
                                <span class="receiving_count">×{{ receiving_check.por_list[0].num }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <scroll-view scroll-x v-else>
                    <div class="receiving_content_data1" :style="'width:' + imgWidth">
                        <div class="receiving_shop_img" v-for="(item, index) in receiving_check.por_list" :key="index">
                            <p class="receiving_shop_num" v-if="item.num > 1">{{ item.num }}</p>
                            <img :src="item.img" alt="" style="width:100%;height:100%;" />
                        </div>
                    </div>
                </scroll-view>
                <div class="receiving_content_bottom">
                    {{language.order.order.common}}{{ receiving_check.num }}{{language.order.order.piece}}, {{language.order.order.total2}}
                    <p class="red bold">￥{{ receiving_check.z_price }}</p>
                </div>
            </div>
            <div class="receiving_img"><img :src="receiving_check.extraction_code_img" alt="" :style="receiving_check.status != 2 ? 'opacity: 0.4' : ''" /></div>
            <div class="receiving_code" :style="receiving_check.status != 2 ? 'opacity: 0.6' : ''">
                <span class="receiving_name">{{language.order.order.code}}:</span>
                <span class="receiving_code_data">{{ receiving_check.extraction_code }}</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "tqm",
        data () {
            return {
                finish2x: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/finish2x.png',
                receiving_check: {},
                show: false,
                
            }
        },
        computed: {
            imgWidth() {
                if (this.receiving_check.por_list) {
                    if (this.receiving_check.por_list.length > 1) {
                        let width = this.receiving_check.por_list.length * 150;
                        return uni.upx2px(width) + 'px';
                    }
                }
            }
        },
        created() {
            uni.$on('receiving_check_emit', (receiving_check) => {
                this.receiving_check = receiving_check
            })
            uni.$on('receiving_check_show', () => {
                this.show = true
            })
            uni.$on('receiving_check_close', () => {
                this.show = false
            })
        },
        methods: {
            receiving_stop () {
                uni.$emit('receiving_check_close')
                this.show = false;
            }
        }
    }
</script>

<style scoped lang="less">
    .receiving_modal {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: 999;
        font-family: PingFang-SC-Medium;
    }

    .receiving_modal > div {
        position: absolute;
        width: 690rpx;
        height: 962rpx;
        left: 30rpx;
        padding: 0 20rpx 0 22rpx;
        background: rgb(255, 255, 255);
        border-radius: 20rpx;
        top: 50%;
        margin-top: -481rpx;
    }

    .receiving_content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 300rpx;
    }

    .receiving_content::after {
        content: '';
        position: absolute;
        top: 300rpx;
        left: 0;
        right: 0;
        border-bottom: 1px solid #dddddd;
    }

    .receiving_content_title {
        font-size: 30rpx;
        line-height: 30rpx;
        color: #020202;
        padding-top: 36rpx;
    }

    .receiving_content_data {
        display: flex;
        align-items: center;
    }

    .receiving_content_data1 {
        display: flex;
        height: 150rpx;
        align-items: center;
    }

    .receiving_content_bottom {
        display: flex;
        align-items: center;
        font-size: 26rpx;
        line-height: 26rpx;
        color: #020202;
        padding-bottom: 28rpx;
    }

    .receiving_shop_img {
        width: 120rpx;
        height: 120rpx;
        border: 1px solid #e6e6e6;
    }

    .receiving_content_data1 .receiving_shop_img {
        position: relative;
        margin-right: 30rpx;
    }

    .receiving_content_data1 .receiving_shop_num {
        position: absolute;
        right: -12rpx;
        top: -15rpx;
        width: 30rpx;
        height: 30rpx;
        border-radius: 50%;
        border: 1px solid #ff3333;
        color: #ff3333;
        font-size: 22rpx;
        text-align: center;
        line-height: 30rpx;
    }

    .receiving_content_item {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-left: 22rpx;
        height: 120rpx;
    }

    .receiving_content_item > div {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .receiving_content_item > p {
        width: 492rpx;
        height: 61rpx;
        font-size: 24rpx;
        font-weight: 500;
        color: rgba(2, 2, 2, 1);
    }

    .receiving_content_item > div p {
        font-size: 26rpx;
        font-weight: bold;
        color: rgba(2, 2, 2, 1);
    }

    .receiving_size {
        display: flex;
        align-items: center;
    }

    .receiving_size_item {
        font-size: 20rpx;
        font-weight: 500;
        color: rgba(153, 153, 153, 1);
        margin-right: 22rpx;
        max-width: 352rpx;
        overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
    }

    .receiving_count {
        font-size: 24rpx;
        font-weight: 500;
        color: rgba(2, 2, 2, 1);
    }

    .receiving_img {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 380rpx;
        height: 380rpx;
        border: 1px solid rgba(220, 220, 220, 1);
        border-radius: 10rpx;
        margin: 60rpx 125rpx 100rpx 125rpx;
    }

    .receiving_img img {
        width: 332rpx;
        height: 332rpx;
    }

    .receiving_code {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 450rpx;
        height: 76rpx;
        background: rgba(238, 238, 238, 1);
        border-radius: 5rpx;
        margin: 0 auto;
    }

    .receiving_name {
        font-size: 26rpx;
        font-weight: 500;
        margin-right: 18rpx;
        color: #242424;
    }

    .receiving_code_data {
        font-size: 35rpx;
        font-weight: bold;
        color: rgba(82, 82, 82, 1);
        font-family: PingFang-SC-Bold;
    }

    .receiving_finish {
        position: absolute;
        top: 191rpx;
        right: 54rpx;
        width: 143rpx;
        height: 145rpx;
    }

    .receiving_rmb {
        font-size: 22rpx;
        font-weight: 500;
    }
</style>
