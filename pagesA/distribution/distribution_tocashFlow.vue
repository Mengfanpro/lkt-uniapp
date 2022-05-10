<!-- 模板页面 -->
<template>
    <div>
        <heads :title="language.distribution_tocashFlow.title"></heads>

        <view class="content">

            <view class="c_top">
                <view>{{language.distribution_tocashFlow.accumulative}}</view>
                <view>+{{total||0}} {{language.distribution_tocashFlow.yuan}}</view>
            </view>

            <view class="c_nav">
                <!--   导航栏      -->
                <ul class='order_header'>
                    <li class='header_li' :class="{header_border:status_id==index}" v-for='(item,index) in language.distribution_tocashFlow.header'
                        :key='item.id' @tap="_header_index(index)">{{item}}
                    </li>
                </ul>
            </view>

            <!-- 有记录的情况 -->
            <view class="c_content" v-if='hasFlag'>
                <!-- <view class="today">
                    {{today}}（今天）
                </view> -->
                <view class="c_b_item" v-for="(item,index) in order" @tap="_goXQ(item.id)" :key="index">
                    <view class="item_flex">
                        <view class="sty1">{{language.distribution_tocashFlow.withdrawal}}</view>
                        <view class="sty2">-{{item.money}}</view>
                    </view>
                    <view class="item_flex">
                        <view class="sty3">{{item.add_date}}</view>
                        <view class="sty4">{{statusStr[item.status]}}</view>
                    </view>
                </view>

                <uni-load-more v-if='order.length>10' :loadingType="loadingType"></uni-load-more>
                <!-- <view class="noMore">没有更多了</view> -->
            </view>
            <!-- 没有记录的情况 -->
            <div class='empty_play' v-if='!hasFlag&&!load'>
                <img :src="emptyImg"/>
                <p class="yh-emp">{{language.distribution_tocashFlow.noFlow}}</p>
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
                loadImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/5-121204193R7.gif',
                back1: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/back2x.png',
                head: true, 						// 头部切换
                
                order: [], 							// 订单数据
                bindding_id: '', 				// 订单状态
                load: true,
                header: ['全部', '待审核', '审核通过', '审核失败'],
                status_id: '', 					// 状态
                today: '0000-00-00',
                statusStr: ['审核中', '审核成功', '审核失败'],
                hasFlag: '',
                page: 1,
                total: 0, 							// 预计佣金
                loadingType: 0,
                emptyImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/' + 'fx_tixNo.png',
                title: '提现明细',
            }
        },
        onReachBottom () {
            if (this.loadingType != 0) {
                return
            }
            this.loadingType = 1
            this.page ++;
            this._axios()
        },
        onLoad () {
            this._axios()
            this._getToday()

        },
        computed: {
            halfWidth: function () {
                var gru = uni.getStorageSync('data_height') ? uni.getStorageSync('data_height') : this.$store.state.data_height
                var heigh = parseInt(gru)
                var he = heigh * 2
                return uni.upx2px(he) + 'px'
            },
        },

        onShow () {
            this.bindding_id = this.$store.state.bindding_num
            this.statusStr = this.language.distribution_tocashFlow.statusStr
            // this._axios()
        },

        methods: {
            ...mapMutations({}),
            /**
             *
             * */
            _goXQ (id) {
                this.page = 1
                uni.navigateTo({
                    url: './distribution_result?txId=' + id
                })
            },
            /**
             *
             * */
            _header_index (index) {
                this.status_id = index
                this.page = 1
                this.order = [];
                this._axios()
            },
            /**
             *
             * */
            _getToday () {
                var myDate = new Date()
                this.today = myDate.getFullYear() + '-' + (parseInt(myDate.getMonth()) + 1) + '-' + myDate.getDate()
            },
            /**
             *
             * */
            _axios () {
                let data = {
                    module: 'app',
                    action: 'commcenter',
                    app: 'cash_list',
                    page: this.page,
                    status: this.status_id == 0 ? '' : this.status_id == 1 ? 0 : this.status_id == 2 ? 1 : 2
                }
                this.$req.post({data}).then(res => {
                    let {
                        data: {
                            list,
                            total
                        },
                        code
                    } = res;
                    
                    this.load = false
                    if (code == 200) {
                        this.hasFlag = true
                        this.order = this.order.concat(list)
                        this.total = total
                        if (list.length) {
                            this.loadingType = 0
                        } else {
                            this.loadingType = 2 
                        }
                    } else {
                        this.hasFlag = false
                        this.loadingType = 2
                    }
                })
            },
        }
    }
</script>

<style scoped lang="less">
    @import url("../../static/css/distribution/distribution_tocashFlow.less");
</style>
