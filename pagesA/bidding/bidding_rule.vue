<template>
    <div>
        <heads :title="language.bidding_rule.title"></heads>

        <div class='load' v-if='load'>
            <div>
                <img :src="loadImg"/>
                <p>{{language.bidding_rule.load}}…</p>
            </div>
        </div>
        <div class="rule_list">
            <rich-text class="richtext" :nodes="my_rule" style="font-size: 14px;" v-if='my_rule'></rich-text>
        </div>
    </div>
</template>

<script>
    import {
        mapMutations
    } from 'vuex'
    import htmlParser from '@/common/html-parser.js'

    export default {
        data () {
            return {
                fastTap: true,
                loadImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/5-121204193R7.gif',
                back1: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/back2x.png',
                jp_rule: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jp_rule.png',
                list_n: false,
                head: true, //头部切换	
                
                order: '', //订单数据 
                page: 1, //加载页面
                allLoaded: false,
                autoFill: false, //若为真，loadmore 会自动检测并撑满其容器
                bottomStatus: '',
                bottomPullText: '上拉加载更多...',
                bottomDropText: '释放更新...',
                loading: false,
                load: true,
                my_rule: '', //竞拍规则
            }
        },
        // 		
        onLoad () {
            this.status_id = this.$store.state.head_id
            
            console.log(this.access_id)
            this._axios()
        },
        computed: {
            halfWidth: function () {
                var gru = uni.getStorageSync('data_height') ? uni.getStorageSync('data_height') : this.$store.state.data_height
                var heigh = parseInt(gru)
                var he = heigh * 2
                return uni.upx2px(he) + 'px'
            },
        },
        components: {},

        onShow () {
            this.status_id = this.$store.state.head_id
            
            this._axios()
        },

        methods: {
            /**
             *
             * */
            _navigateTo (status, id) {
                if (status == 0) {
                    uni.navigateTo({
                        url: 'order?order_id=' + id + '&showPay=true',
                    })
                } else {
                    uni.navigateTo({
                        url: 'order?order_id=' + id,
                    })
                }
                this.flag = false
            },
            /**
             *
             * */
            _back () {
                this.flag = false
                uni.navigateBack({
                    delta: 1
                })
            },
            /**
             * 获取数据
             * */
            _axios () {

                var me = this
                var data = {
                    module: 'app',
                    action: 'auction',
                    m: 'rule',
                }

                this.$req.post({ data }).then(res => {
                    me.my_rule = htmlParser(res.data.my_rule)
                    me.load = false
                })
            },
            ...mapMutations({
                order_id: 'SET_ORDER_ID',
                address_id: 'SET_ADDRESS_ID',
                bindding_num: 'SET_BINDDING_NUM',
                bind_status: 'SET_BIND_STATUS',
                bind_promise: 'SET_BIND_PPOMISE',
                head_id: 'SET_HEAD_ID'
            })
        },
    }
</script>

<style scoped lang="less">
    @import url("../../static/css/bidding/bidding_rule.less");
</style>
