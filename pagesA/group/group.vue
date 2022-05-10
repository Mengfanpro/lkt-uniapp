<template>
    <div>
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>

        <heads :title='language.group.title'></heads>

        <view class="twins_box">
            <view class="twins">
                <view class="nav_twin" :class='{"nav_twin_hover": navActive}' @tap="changeNav(true,1)">
                    {{language.group.todayGroup}}
                    <view class="nav_line" v-if="navActive==true"></view>
                </view>

                <view class="nav_twin" :class='{"nav_twin_hover": !navActive}' @tap="changeNav(false,2)">
                    {{language.group.trailer}}
                    <view class="nav_line" v-if="navActive==false"></view>
                </view>
            </view>
        </view>

        <div class="skeleton">

            <div v-if='(list.length==0 || !list) && load'>

                <div class='noFindDiv yh-noFindDiv'>

                    <div>
                        <img class='noFindImg' :src="noFind"/>
                    </div>
                    <span class='noFindText'>{{language.group.noGroup}}</span>
                    <div @tap="navToHome()" class="yh-toHome">
                        <span class='goHome'>{{language.group.goHome}}</span>
                    </div>
                </div>
            </div>

            
            <div v-if="load">
                <!-- 今日拼团 -->
                <ul class="group" v-if="navActive==true">
                    <li @tap="_goods(item)" v-for='(item,index) in list' :key='index'>
                        <div class="gd_bq" v-if="item.product_status==2">{{language.group.gone}}</div>
                        <div class="gd_bq" v-if="item.product_status==3">{{language.group.finished}}</div>
                        <img :src="item.imgurl">

                        <div class="group_div">
                            <div class="group_title list_break2">{{item.pro_name}}</div>
                            <div class="group_num" style="color:#9B9B9B;">{{language.group.haveGroup}} {{item.sales_volume}} {{language.group.unit}}</div>
                            <div class="group_money list_break1">

							<span class="yh-pronum">
								{{ item.groupnum }} {{language.group.peopleGroup}}
								<span class="text-bold">
									￥{{ item.min_price }}
								</span>
							</span>

                            </div>
                            <div class="group_price list_break1"><span>{{language.group.single}} ￥{{item.market_price}}</span></div>
                            <div class="group_go" v-if="item.product_status==1">{{language.group.goGroup}}</div>
                            <div class="group_go gray_bg" v-else>{{language.group.goGroup}}</div>
                        </div>
                    </li>
                </ul>
                <!-- 拼团抢先知 -->
                <ul class="group" v-else>
                    <li @tap="_goods(item)" v-for='(item,index) in list' :key='index'>
                        <img :src="item.imgurl">
                        <div class="group_div">
                            <div class="group_title list_break2">{{item.pro_name}}</div>

                            <div class="group_num">
                                <text class="g_n_num">{{item.day?item.day:0}}</text>
                                <text class="g_n_dian" style="color: #999999;">{{language.group.days}}</text>
                                <text class="g_n_num">{{item.hour}}</text>

                                <text class="g_n_dian" style="color: #999999;">:</text>
                                <text class="g_n_num">{{item.mniuate}}</text>

                                <text class="g_n_dian" style="color: #999999;">:</text>
                                <text class="g_n_num">{{item.second}}</text>

                                <text decode="true">&nbsp;&nbsp;</text>
                                <text style="color: #999999;margin-left: 6rpx;"> {{language.group.begin}}</text>
                            </div>

                            <div class="group_money list_break1">
                                <span class="yh-min-man">{{item.min_man}} {{language.group.peopleGroup}}</span>
                                <span class="text-bold">￥{{item.min_price}}</span>
                            </div>

                            <div class="group_price list_break1"><span>{{language.group.single}} ￥{{item.market_price}}</span></div>
                            <div class="group_go gray_bg">{{language.group.goGroup}}</div>
                        </div>
                    </li>
                </ul>
            </div>
            <div v-else>
                <ul class="group" v-if="navActive" >
                    <li @tap="_goods(item)" v-for='(item,index) in list2' :key='index'>
                        <div class="gd_bq" v-if="item.product_status==2">{{language.group.gone}}</div>
                        <div class="gd_bq" v-if="item.product_status==3">{{language.group.finished}}</div>
                        <img class="skeleton-rect" :src="item.imgurl">

                        <div class="group_div">
                            <div class="group_title list_break2 skeleton-rect">{{item.pro_name}}</div>
                            <div class="group_num skeleton-rect" style="color:#9B9B9B;">{{language.group.haveGroup}} {{item.sum}} {{language.group.unit}}</div>
                            <div class="group_money list_break1">

							<span class="yh-pronum skeleton-rect">
								{{ item.min_man }} {{language.group.peopleGroup}}
								<span class="text-bold">
									￥{{ item.min_price }}
								</span>
							</span>

                            </div>
                            <div class="group_price list_break1"><span class="skeleton-rect">{{language.group.single}} ￥{{item.market_price}}</span></div>
                            <div class="group_go skeleton-rect" v-if="item.product_status==1">{{language.group.goGroup}}</div>
                            <div class="group_go gray_bg skeleton-rect" v-else>{{language.group.goGroup}}</div>
                        </div>
                    </li>
                </ul>
                <!-- 拼团抢先知 -->
                <ul class="group" v-else>
                    <li @tap="_goods(item)" v-for='(item,index) in list3' :key='index'>
                        <img class="skeleton-rect" :src="item.imgurl">
                        <div class="group_div">
                            <div class="group_title list_break2 skeleton-rect" style="height: 20px;">{{item.pro_name}}</div>

                            <div class="group_num skeleton-rect" style="height: 17px">
                                <text class="g_n_num ">{{item.day?item.day:0}}</text>
                                <text class="g_n_dian" style="color: #999999;">天</text>
                                <text class="g_n_num">{{item.hour}}</text>

                                <text class="g_n_dian" style="color: #999999;">:</text>
                                <text class="g_n_num">{{item.mniuate}}</text>

                                <text class="g_n_dian" style="color: #999999;">:</text>
                                <text class="g_n_num">{{item.second}}</text>

                                <text decode="true">&nbsp;&nbsp;</text>
                                <text style="color: #999999;margin-left: 6rpx;"> 后开抢</text>
                            </div>

                            
                            <div class="group_money list_break1">
                                <span class="yh-min-man skeleton-rect" style="height: 22px;">{{item.min_man}}人团</span>
                                <span class="text-bold skeleton-rect" style="height: 18px">￥{{item.min_price}}</span>
                            </div>

                            <div class="group_price list_break1"><span class="skeleton-rect">单买价￥{{item.market_price}}</span></div>
                            <div class="group_go gray_bg skeleton-rect">去开团</div>
                        </div>
                    </li>
                </ul>
            </div>
            
            
            <uni-load-more v-if='list.length>=10' :loadingType="loadingType2"></uni-load-more>
        </div>

        <div v-if="!load">
            <skeleton  :animation="true" :loading="navActive"  bgColor="#FFF"></skeleton>    
            <skeleton  :animation="true" :loading="!navActive"  bgColor="#FFF" ></skeleton>    
        </div>
        
    </div>
</template>

<script>
    import {
        _axios,
        setTimeData,
    } from '@/static/js/group/group'
    import { data1, data2 } from '@/mock/group/group'
    import {
        mapMutations
    } from 'vuex'

    export default {
        data () {
            return {
                returnR: '',
                back: '',
                title: '拼团',
                list: [],
                list2: data1,
                list3: data2,
                istips: false,
                page: 1, //分页码,
                navActive: true,
                navType: 1,
                head: true, //头部切换
                clickFlag: false,
                loadingType2: 0,
                noImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/icon-no.png',
                shopImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/shopping_l2x.png',
                noFind: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/noFind.png',
                back1: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/back2x.png',
                loadGif: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/loading.gif',
                load: false,
                timeI: '',
                empty: false
            }
        },
        onLoad () {
            this.list = [];
            this.load = false
            this.loadingType2 = 0
            this.page = 1
            this._axios()
        },
        onPullDownRefresh () {
            this.list = [];
            this.load = false
            this.loadingType2 = 0
            this.page = 1
            this._axios()
        },
        onShow () {
            
        },
        // 下拉加载
        onReachBottom () {
            this.page++
            this.loadingType2 = 1
            this._axios()
        },
        methods: {
            ...mapMutations({
                cindex: 'SET_CINDEX',
                data_height: 'SET_DATA_HEIGHT',
            }),
            /**
             *
             * */
            changeLoginStatus () {
                this._axios()
            },
            /**
             * 自定义页面跳转方法
             * */
            gotoHomePage () {
                var me = this
                if (me.clickFlag) {
                    return
                } else {
                    me.clickFlag = true
                }
                uni.switchTab({
                    url: '/pages/tabBar/home'
                })
            },
            /**
             *
             * */
            setTimeData (data) {
                var me = this
                setTimeData(data, me)
            },
            /**
             *
             * */
            _axios () {
                var me = this
                _axios(me)
            },
            /**
             * 跳转商品详情页
             * */
            _goods (item) {
                let url = '../group/groupDetailed?pro_id=' + item.product_id + '&activity_no=' + item.activity_no + '&platform_activities_id=' + item.platform_activities_id;
                if (item.a_type == 1) {
                    url += '&a_type=1'
                }
                uni.navigateTo({
                    url: url
                })
            },
            /**
             * 点击切换导航条
             * */
            changeNav (flag, type) {
                this.navActive = flag
                this.load = false
                this.list = []
                
                setTimeout(() => {
                    this.load = false
                    this.navType = type
                    this.loadingType2 = 1
                    this.page = 1
                    

                    this._axios()
                }, 50)
            }
        }
    }
</script>

<style lang="less">
    @import "../../static/css/group/group.less";
</style>
