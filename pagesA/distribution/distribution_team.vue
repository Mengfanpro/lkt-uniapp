<!-- 模板页面 -->
<template>
    <div>
        <heads :title="language.distribution_team.title"></heads>

        <view class="content">
            <!-- 第一个  开始 -->
            <view class="one" v-for='(item,index) in order' :key="index">
                <view class="item">
                    <view class="em">
                        <img class="my_header" :src='item.headimgurl'/>
                        <view class="my_name mz">
                            {{item.user_name}}
                        </view>
                    </view>
                    <view class="em">
                        <view class="my_grade">{{language.distribution_team.level}}{{item.levelname}}</view>
                    </view>
                    <view class="em xj" @tap="_lookDetail(item.user_id,index,item.openFlag)">
                        <view class="my_num">{{language.distribution_team.lower}}({{item.soncount}}人)</view>
                        <image class='rigth_jiantou' :src="item.src"/>
                    </view>
                </view>
                <view class="inner_content" v-if="item.openFlag">
                    <view class="inner_item" v-for='(item2,index2) in sonList' :key="index2">
                        <view class="mzz">{{item2.user_name}}</view>
                        <view>{{language.distribution_team.level}}{{item2.levelname}}</view>
                        <view class="xjj">{{language.distribution_team.lower}}({{item2.soncount}}人)</view>
                    </view>
                </view>
            </view>
            <!-- 第一个  结束 -->
            <uni-load-more v-if='order.length>13 && showLoad' :loadingType="loadingType"></uni-load-more>
            <p v-else class="showLoad">没有更多啦</p>
        </view>

        <div class='empty_play' v-if='!order.length&&!load'>
            <img :src="emptyImg"/>
            <p>{{language.distribution_team.noteam}}</p>
        </div>
        <div class='load yh-load' v-if='load'>
            <div>
                <img :src="loadImg"/>
                <p>{{language.distribution_team.load}}…</p>
            </div>
        </div>

    </div>
</template>

<script>
    import {
        mapMutations
    } from 'vuex'
    import {
        lkt_seedown
    } from '../../static/js/distribution/distribution_center.js'

    export default {
        data () {
            return {
                fastTap: true,
                loadImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/5-121204193R7.gif',
                emptyImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/empyimg92x.png',
                back1: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/back2x.png',
                bottom: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/fx_bottom.png',
                head: true, 								// 头部切换
                
                order: [], 									// 订单数据 
                load: true,
                top: '',
                sonList: [], 								// 下级的数组
                page: 1,
                loadingType: 0,
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
            var data = {
                module: 'app',
                action: 'commcenter',
                app: 'mygroup',
                page: this.page,
                pageSize: 20
            }
        
            if (this.order.length > 0) {
                console.log(data)
                this.$req.post({data}).then(res => {
                    let data = res.data.list;
                    console.log(res)
                    
                    if (res.code == 200) {
                        me.order = me.order.concat(data)
                        me.loadingType = 0
                    } else {
                        me.loadingType = 2
                    }
                    if(data.length == 0) {
                        this.showLoad = false
                    }
                })
                
            }
        },
        onLoad () {
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
        methods: {
            /**
             *
             * */
            ...mapMutations({}),
            /**
             *
             * */
            _lookDetail (userId, index, openFlag) {
                if (openFlag) {
                    this.order[index].src = this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/fx_bottom.png'
                    this.sonList = []
                } else {
                    this.order[index].src = this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/fx_top.png'
                    for (let i in this.order) {
                        this.order[i].openFlag = false
                    }
                    let data = {
                        module: 'app',
                        action: 'commcenter',
                        app: 'mygroup',
                        uid: userId
                    }
                    this.$req.post({data}).then(res => {
                        let {
                            data: {
                                list
                            }
                        } = res;
                        this.sonList = list
                    }).catch((err)=>{
                        console.log(err)
                    })
                }
                this.order[index].openFlag = !this.order[index].openFlag
            },
            /**
             *
             * */
            _axios () {
                var data = {
                    module: 'app',
                    action: 'commcenter',
                    app: 'mygroup',
                    page: this.page,
                    pageSize: 20
                }
                this.$req.post({data}).then(res => {
                    this.load = false
                    let {
                        data: {
                            list
                        }
                    } = res;
                    for (var i in list) {
                        list[i].openFlag == false
                        list[i].src = this.bottom
                    }
                    // if (list.length < 15) {
                    //     this.loadingType = 2
                    // } else {
                    //     this.loadingType = 0
                    // }
                    this.order = this.order.concat(list)
                })
            }
        }
    }
</script>

<style scoped lang="less">
    @import url("../../static/css/distribution/distribution_team.less");
</style>
