<template>
    <div style="min-height: 100vh">
        <!-- #ifndef MP -->

        <!-- #ifdef APP -->
        <div style="height: 89rpx;width: 100%;"></div>
        <!-- #endif -->
        
        
        
        <div class="yh-ifndefMP">
            <div class='position_head'>
                <heads :title="language.bidding_record.title" v-if='head'></heads>
                <!--   导航栏      -->
                <ul class='bid_header' v-if='order.length&&!load'>
                    <li class="outer_li">
                        <div class="user_name_long">{{language.bidding_record.user}}</div>
                        <div style="margin-left: -10upx!important;">{{language.bidding_record.state}}</div>
                        <div class="time">{{language.bidding_record.time}}</div>
                        <div class="price" style="padding-right: 10rpx;width: 18%;text-align: center;">{{language.bidding_record.bidPrice}}</div>
                    </li>
                </ul>
            </div>
        </div>
        <div style="height: 172rpx;width: 100%;"></div>
        <!-- #endif -->

        <!-- #ifdef MP -->
        <div style="height: 89rpx;width: 100%;"></div>
        <div class="yh-ifdefMP" :style="{top:halfWidth}">
			<!-- #ifndef MP -->
			<div class='position_head' :style="{top:halfWidth}">
			<!-- #endif -->
            <!-- #ifdef MP -->
            <div class='position_head'>
            <!-- #endif -->
                <!--   导航栏      -->
                <ul class='bid_header' v-if='order.length&&!load'>
                    <li class="outer_li">
                        <div class="user_name_long">{{language.bidding_record.user}}</div>
                        <div style="margin-left: -10upx!important;">{{language.bidding_record.state}}</div>
                        <div class="time">{{language.bidding_record.time}}</div>
                        <div  style="padding-right: 10rpx;width: 18%;text-align: center;">{{language.bidding_record.bidPrice}}</div>
                    </li>
                </ul>
            </div>
        </div>
        <!-- #endif -->

        <!--列表 -->
        <ul class='bid_header bid_top' v-if='order.length&&!load'>
            <li class="outer_li" v-for='(item,index) in order' :key="index">
                <div class="user_name_long">{{item.user_name}}</div>
                <div v-if="index == 0">{{language.bidding_record.leading}}</div>
                <div v-else>{{language.bidding_record.out}}</div>
                <div>{{item.add_time}}</div>
                <div style="width: 18%;text-align: center;">{{item.price}}</div>
            </li>
        </ul>

        <div class='empty_play' v-if='!order.length&&!load'>
            <img :src="emptyImg"/>
            <p>{{language.bidding_record.noRecord}}</p>
            <!-- <p class='empty_p'>可以去看看有那些想买的</p>
            <div @tap="_toHome()">去商城逛逛</div> -->
        </div>
        <div class='load' v-if='load' style="height: 60vh;">
            <div>
                <img :src="loadImg"/>
                <p>{{language.bidding_record.load}}…</p>
            </div>
        </div>

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
                emptyImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/empyimg92x.png',
                back1: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/back2x.png',
                head: true, //头部切换
                
                order: '', //订单数据 
                bindding_id: '', //订单状态
                load: true,
            }
        },
        onLoad (option) {
            this.bindding_id = option.bindding_id

            uni.setNavigationBarTitle({
                title: this.language.bidding_record.title
            })
            
            this._axios()
        },

        methods: {
            /**
             * @description 获取请求
             * */
            async _axios () {
                let data = {
                    module: 'app',
                    action: 'auction',
                    m: 'record',
                    id: this.bindding_id,
                }

                this.$req.post({data}).then(res => {
                    let {
                        data: {
                            res: list
                        }
                    } = res;
                    this.load = false
                    if (list.length > 0) {
                        for (let i in list) {
                            if (i === 0) {
                                list[i].grade = '领先'
                            } else {
                                list[i].grade = '出局'
                            }
                        }
                    }
                    this.order = list
                })
                

                

            },
            /**
             * 返回
             * */
            _back () {
                this.flag = false
                uni.navigateBack({
                    delta: 1
                })
            }
        }
    }
</script>

<style scoped lang="less">
    @import url("../../static/css/bidding/bidding_record.less");
</style>
