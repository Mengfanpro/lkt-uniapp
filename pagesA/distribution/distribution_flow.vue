<!-- 佣金明细列表 -->
<template>
    <div style="min-height: 100vh;background: #f6f6f6;padding-bottom: 20rpx;">
        <heads :title="language.distribution_flow.title"></heads>
        <view class="content">
            <!-- 有记录的时候 -->
            <view class="c_bottom">
                <view class="c_b_item" v-for="(item,index) in order">
                    <div class="top">
                        <div class="left">
                            +{{item.money}}
                        </div>
                        <div class="right grey" v-if="item.status == 0">
                            {{ language.distribution_flow.wff }}
                        </div>
                        <div class="right" v-else>
                            {{ language.distribution_flow.yff }}
                        </div>
                    </div>
                    <div class="line"></div>
                    <div class="bottom">
                        <p class="form">{{ language.distribution_flow.ddly }}：{{item.from_user}}</p>
                        <p>{{ language.distribution_flow.ddje }}：{{ item.z_price }}</p>
                        <p>{{ language.distribution_flow.ddbh }}：{{ item.sNo }}</p>
                        <p>
                            {{ language.distribution_flow.xdsj }}：{{ item.add_date | dateFormat }}
                        </p>
                    </div>
<!--                    <view class="item_flex">-->
<!--                        <view class="sty1">{{item.from_user}}</view>-->
<!--                        <view class="sty2">+{{item.money}}</view>-->
<!--                    </view>-->
<!--                    <view class="item_flex">-->
<!--                        <view class="sty3">{{item.add_date}}</view>-->
<!--                        <view class="sty4">{{language.distribution_flow.status}} {{item.status}}</view>-->
<!--                    </view>-->
                </view>
                <uni-load-more v-if='order.length>10 && showLoad' :loadingType="loadingType"></uni-load-more>
                <p v-if="!showLoad" class="showLoad">没有更多啦</p>
            </view>

            <!-- 没有记录的时候 -->
            <div class='empty_play' v-if='!hasFlag&&!load'>
                <img :src="emptyImg"/>
                <p>{{language.distribution_flow.noFlow}}</p>
            </div>
        </view>
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
                head: true, 								// 头部切换
                
                order: '', 									// 订单数据 
                load: true,
                hasFlag: '', 								// 是否有佣金明细
                total: 0,
                page: 1,
                loadingType: 0,
                emptyImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/' + 'fx_nodata1.png',
                loadImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/5-121204193R7.gif',
                back1: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/back2x.png',
                showLoad: true
            }
        },
        onReachBottom() {
            var me = this
            if (this.loadingType != 0) {
                return
            }
            this.loadingType = 1
            this.page += 1
            let data = {
                module: 'app',
                action: 'commcenter',
                app: 'comm_list',
                page: this.page
            }

            if (this.order.length > 0) {
                this.$req.post({data}).then(res => {
                    let data = res.data.list;
                    console.log(res)
                    if(data.length == 0) {
                        me.showLoad = false
                    }
                    if (res.code == 200) {
                        me.order = me.order.concat(data)
                        me.loadingType = 0
                    } else {
                        me.loadingType = 2
                    }
                })
                
            }
        },
        onLoad () {
            this._axios()
        },
        methods: {
            ...mapMutations({}),
            /**
             * 获取数据
             * */
            _axios () {

                let data = {
                    module: 'app',
                    action: 'commcenter',
                    app: 'comm_list',
                    page: this.page
                }

                this.$req.post({ data }).then(res => {
                    let {
                        data: {
                            list,
                            total
                        },
                        code
                    } = res
                    this.load = false

                    if (code == 103) {

                        if (this.page > 0) {
                            this.hasFlag = true
                        } else {
                            this.hasFlag = false
                        }

                    } else if (code == 200) {

                        
                        this.order = list
                        this.hasFlag = this.order.length ? true : false 
                        
                        this.total = total
                        this.page = 1
                    }
                })
            }
        }
    }
</script>

<style scoped lang="less">
    @import url("../../static/css/distribution/distribution_flow.less");
</style>
