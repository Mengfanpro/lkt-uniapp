<!-- 提现的三种结果：审核失败，提现成功，审核中 -->
<template>
    <div>
        <heads :title="language.distribution_result.title" :return-r="order.status ==2 ? '0' : '10' " > </heads>
        <toload :load="load">
            <!-- 提现审核失败 -->
            <view class="content" v-if="order[0].status==2">
                <img class='fail_icon' :src="result3"/>
                <view class="">
                    {{language.distribution_result.failText}}
                </view>
                <view class="content_v2">
                    {{language.distribution_result.failReason}}
                </view>
                <view class="content_v3">
                    {{order[0].refuse}}
                </view>
            </view>

            <!-- 提现审核成功 -->
            <view class="content" v-else-if="order[0].status==1">
                <img class='fail_icon' :src="result2"/>
                <view class="">
                    {{language.distribution_result.successText}}
                </view>
                <view class="cg_desc">
                    {{language.distribution_result.successText1}}
                </view>
                <view class="cg_items">
                    <view class="cg_item">
                        <view>{{language.distribution_result.cashCard}}</view>
                        <view>{{order[0].bank_name}} {{language.distribution_result.tail}} ({{order[0].last}})</view>
                    </view>
                    <view class="cg_item">
                        <view>{{language.distribution_result.amount}}</view>
                        <view>￥{{totalPrice}}</view>
                    </view>
                </view>
                <view class="cg_btn" @tap="goCenter()">
                    {{language.distribution_result.complete}}
                </view>
            </view>

            <!-- 提现审核中 -->
            <view class="content" v-else-if="order[0].status==0">
                <img class='fail_icon' :src="result1"/>
                <view class="">
                    {{language.distribution_result.auditText}}
                </view>
                <view class="cg_desc">
                    {{language.distribution_result.auditing}}
                </view>
                <view class="cg_items">
                    <view class="cg_item">
                        <view>{{language.distribution_result.cashCard}}</view>
                        <view>{{order[0].bank_name}} {{language.distribution_result.tail}} ({{order[0].last}})</view>
                    </view>
                    <view class="cg_item">
                        <view>{{language.distribution_result.amount}}</view>
                        <view>￥{{totalPrice}}</view>
                    </view>
                </view>
                <view class="cg_btn" @tap="goCenter()">
                    {{language.distribution_result.complete}}
                </view>
            </view>
        </toload>
        
        
    </div>
</template>

<script>
    import {
        mapMutations
    } from 'vuex'

    export default {
        data () {
            return {
                fastTap: true,
                head: true, 							// 头部切换
                
                order: '', 								// 订单数据 
                load: true,
                title: '提现',
                txId: '',
                totalPrice: 0,
                result1: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/' + 'fx_status0.png',
                result2: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/' + 'fx_status1.png',
                result3: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/' + 'fx_status2.png',
                loadImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/5-121204193R7.gif',
                emptyImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/empyimg92x.png',
                back1: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/back2x.png',
                fail: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/fx_fail.png',
            }
        },
        onLoad (options) {
            this.txId = options.txId
            this._axios()
        },
        methods: {
            ...mapMutations({}),
            /**
             *
             * */
            goCenter () {
                uni.navigateTo({
                    url: './distribution_center'
                })
            },
            /**
             *
             * */
            _axios () {
                var data = {
                    module: 'app',
                    action: 'commcenter',
                    app: 'cash_detail',
                    
                    id: this.txId
                }
                this.$req.post({data}).then(res => {
                    
                    this.load = true
                    this.totalPrice = res.data.res[0].money

                    // res.data.res.money = parseInt(res.data.res.money)+parseInt(res.data.res.s_charge)
                    this.order = res.data.res
                })
                
            }
        }
    }
</script>

<style scoped lang="less">
    @import url("../../static/css/distribution/distribution_result.less");
</style>
