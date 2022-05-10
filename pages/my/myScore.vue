<template>
    <div class="yh-myscore">

        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>

        <!-- #ifndef MP -->
        <heads v-if="!load" :title='language.myScore.title'></heads>
        <!-- #endif -->

        <toload v-if="!load" :load="load"></toload>
        <div v-else class="yh-halfWidth2">
            <div class="topBox" :style="{backgroundImage: 'url('+ sign_bg +')'}">
                <!-- #ifndef MP -->
                <heads :title='language.myScore.title' :bgColor='[{item: "transparent"},{item: "transparent"}]'></heads>
                <!-- #endif -->
                
                <div class="score_head" :style="{backgroundImage: 'url('+ sign_bg +')'}">
                    <div class='scoreData'>
                        <div class='scoreNum'>{{scoreNum | 0}}</div>
                        
                        <div class="yh-kyjf">{{language.myScore.availableIntegral}}</div>
                        <view class="scoreData-btn" @click="jmpNav()" style="margin: 0 auto;"
                            v-if="signPlugin?true:false"
                        >
                            {{language.myScore.signIn}}
                        </view>
                    </div>
                    <div class='useExp' @tap='_toGradeUse(true)'>
                        <img :src="useExp" alt="">
                        <span>{{language.myScore.instructions}}</span>
                    </div>
                </div>
                <div style="height: 350rpx;"></div>
            </div>
        
            <div class='scoreRecode' >
        
                <div class='recodeTop'>
                    <div @tap='topChange(0)' ><span :class='{active: topStatus==0}'>{{language.myScore.allDetail}}</span><span v-if='topStatus==0' class='border1'></span></div>
                    <div @tap='topChange(1)' ><span :class='{active: topStatus==1}'>{{language.myScore.gainDetail}}</span><span v-if='topStatus==1' class='border1'></span></div>
                    <div @tap='topChange(2)' ><span :class='{active: topStatus==2}'>{{language.myScore.useDetail}}</span><span v-if='topStatus==2' class='border1'></span></div>
                </div>
        
                <div class='recodeDiv'>
                    <div v-if='topStatus==0'>
                        <div v-for='(item,index) in list1' :key='index' class='recodeDetail'>
                            <div>
                                <div class='recodeTitle'>
                                    <span>{{item.name}}</span>
                                </div>
                                <div class='recodeTime'>{{item.sign_time}}</div>
                            </div>
                            <div>
                                <div class='recodeScore'>
                                    <span v-if='item.status'>+{{item.sign_score}}</span>
                                    <span v-else class="yh-sign_score">-{{item.sign_score}}</span>
                                </div>
                            </div>
                        </div>
                        <uni-load-more v-if='list1.length>5' :loadingType="loadingType0"></uni-load-more>
                    </div>
        
                    <div v-else-if='topStatus==1'>
                        <div v-for='(item,index) in list2' :key='index' class='recodeDetail'>
                            <div>
                                <div class='recodeTitle'>
                                    <span>{{item.name}}</span>
                                </div>
                                <div class='recodeTime'>{{item.sign_time}}</div>
                            </div>
                            <div>
                                <div class='recodeScore'>
                                    <span>+{{item.sign_score}}</span>
                                </div>
                            </div>
                        </div>
                        <uni-load-more v-if='list2.length>5' :loadingType="loadingType1"></uni-load-more>
                    </div>
        
                    <div v-else-if='topStatus==2'>
                        <div v-for='(item,index) in list3' :key='index' class='recodeDetail'>
                            <div>
                                <div class='recodeTitle'>
                                    <span>{{item.name}}</span>
                                </div>
                                <div class='recodeTime'>{{item.sign_time}}</div>
                            </div>
                            <div>
                                <div class='recodeScore'>
                                    <span class="yh-sign_score">-{{item.sign_score}}</span>
                                </div>
                            </div>
                        </div>
                        <uni-load-more v-if='list3.length>5' :loadingType="loadingType2"></uni-load-more>
                    </div>
        
                </div>
            </div>
        </div>    
        
        <ruleModal v-model="isShow" @click="_toGradeUse" :title="language.myScore.rulesTitle" :details="content" :btn="language.ruleModal.btn"/>
    </div>
</template>

<script>
    import ruleModal from '@/components/ruleModal.vue'
    import htmlParser from '@/common/html-parser.js'

    export default {
        data () {
            return {
                loadingType0: 0,
                loadingType1: 0,
                loadingType2: 0,
                topStatus: 0,
                title: '我的积分',
                
                load: false,
                scoreNum: '',
                list1: [],
                list2: [],
                list3: [],
                page0: 1,
                page1: 1,
                page2: 1,
                myScoreimg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/integralback.png',// 积分背景
                useExp: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/sign_rule.png',
                loadGif: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/loading.gif',
                sign_bg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/sign_bg.png',
                isShow: false,
                content: '',
                signPlugin: 0,//签到插件是否开启
            }
        },
        onLoad(option) {
            this.signPlugin = parseInt(option.signPlugin)
        },
        onShow () {
            try {
                var me = this
                this.isLogin(()=>{
                	
                	me._axios()
                })
            } catch (e) {
                
            }
        },
        watch:{
            topStatus() {
                this.page0 = 1
                this.page1 = 1
                this.page2 = 1
                this.loadingType0 = 0
                this.loadingType1 = 0
                this.loadingType2 = 0
                if(this.topStatus == 1) {
                    this._axios1()
                } else if(this.topStatus == 2) {
                    this._axios2()
                } else {
                    this._axios()
                }
            }
        },
        methods: {
            /**
             * 跳转签到
             * @description
             * */
            jmpNav () {
                uni.navigateTo({
                    url: '/pagesA/shop/sign'
                })
            },
            /**
             *
             * */
            changeLoginStatus () {
                this._axios()
            },
            /**
             *
             * */
            _toGradeUse (is) {
                if (is) {
                    let data = {
                        module: 'app',
                        action: 'sign',
                        app: 'Instructions',
                        
                    }
                    this.$req.post({data}).then(res => {
                        if (res.code == 200) {
                            console.log(res)
                            // this.content = htmlParser(res.Instructions)
                            this.content = res.data.text
                            this.isShow = !this.isShow
                        } else {
                            uni.showToast({
                                title: res.message,
                                duration: 1500,
                                icon: 'none'
                            })
                        }
                    })
                } else {
                    this.isShow = !this.isShow
                }

            },
            /**
             *
             * */
            topChange (num) {
                this.topStatus = num
                uni.pageScrollTo({ scrollTop: 0, duration: 10 })
            },
            /**
             *
             * */
            _axios () {
                var me = this
                let data = {
                    
                    module: 'app',
                    action: 'sign',
                    app: 'integral',
                    type: this.topStatus == 0 ? '' : this.topStatus,
                    pageNo: this.page0,
                    pageSize: 10
                }
                this.$req.post({data}).then(res => {
                    if (res.code == 200) {
                        me.scoreNum = res.data.score || 0
                        me.list1 = res.data.whole || []
                        me.list2 = res.data.sign || []
                        me.list3 = res.data.consumption || []
                    } else {
                        uni.showToast({
                            title: res.message,
                            duration: 1500,
                            icon: 'none'
                        })
                    }
                    me.load = true
                })
            },
            
            _axios1() {
                var me = this
                let data = {
                    
                    module: 'app',
                    action: 'sign',
                    app: 'integral',
                    type: 1,
                    pageNo: this.page1,
                    pageSize: 10
                }
                this.$req.post({data}).then(res => {
                    if (res.code == 200) {
                        me.list2 = res.data.list || []
                    } else {
                        uni.showToast({
                            title: res.message,
                            duration: 1500,
                            icon: 'none'
                        })
                    }
                    me.load = true
                })
            },
            
            _axios2() {
                var me = this
                let data = {
                    
                    module: 'app',
                    action: 'sign',
                    app: 'integral',
                    type: 2,
                    pageNo: this.page2,
                    pageSize: 10
                }
                this.$req.post({data}).then(res => {
                    if (res.code == 200) {
                        me.list3 = res.data.list || []
                    } else {
                        uni.showToast({
                            title: res.message,
                            duration: 1500,
                            icon: 'none'
                        })
                    }
                    me.load = true
                })
            }
        },
        computed: {
            halfWidth1: function () {
                var gru = uni.getStorageSync('data_height') ? uni.getStorageSync('data_height') : this.$store.state.data_height
                var heigh = parseInt(gru)
                var he = 0
                // #ifdef MP
                he = 350
                // #endif
                // #ifdef APP-PLUS
                he = 350
                // #endif
                // #ifdef H5
                he = 350
                // #endif
                return uni.upx2px(he) + 'px'
            },
            halfWidth2: function () {
                var gru = uni.getStorageSync('data_height') ? uni.getStorageSync('data_height') : this.$store.state.data_height
                var heigh = parseInt(gru)
                var he = heigh * 2
                // #ifdef MP
                he = 0
                // #endif
                // #ifdef APP-PLUS
                he = heigh * 2
                // #endif
                // #ifdef H5
                // he=heigh*2+44
                he = 0
                // #endif
                return uni.upx2px(he) + 'px'
            }
        },
        onReachBottom: function () {
            var me = this
            if (this.topStatus == 0) {
                if (this.loadingType0 != 0) {
                    return
                }
                this.loadingType0 = 1
                me.page0 += 1
                var data = {
                    module: 'app',
                    action: 'sign',
                    app: 'load_integral',
                    
                    type: '',
                    pageNo: this.page0,
                    pageSize: 10
                }
                this.$req.post({data}).then(res => {
                    let list = res.data.whole || []
                    if (list.length > 0) {
                        me.list1 = me.list1.concat(list)
                        me.loadingType0 = 0
                    } else {
                        me.loadingType0 = 2
                    }
                })
            } else if (this.topStatus == 1) {
                if (this.loadingType1 != 0) {
                    return
                }
                this.loadingType1 = 1
                this.page1 ++
                var data = {
                    module: 'app',
                    action: 'sign',
                    app: 'load_integral',
                    
                    type: 1,
                    pageNo: this.page1,
                    pageSize: 10
                }
                this.$req.post({data}).then(res => {
                    let list = res.data.list || []
                    me.page0 += 1
                    if (list.length > 0) {
                        me.list2 = me.list2.concat(list)
                        me.loadingType1 = 0
                    } else {
                        me.loadingType1 = 2
                    }
                })
            } else if (this.topStatus == 2) {
                if (this.loadingType2 != 0) {
                    return
                }
                this.loadingType2 = 1
                this.page2 ++
                var data = {
                    module: 'app',
                    action: 'sign',
                    app: 'load_integral',
                    
                    type: 2,
                    pageNo: this.page2,
                    pageSize: 10
                }
                
                this.$req.post({data}).then(res => {
                    let list = res.data.list || []
                    me.page0 += 1
                    if (list.length > 0) {
                        me.list3 = me.list3.concat(list)
                        me.loadingType2 = 0
                    } else {
                        me.loadingType2 = 2
                    }
                })
                
            }

        },
        components: {
            ruleModal
        },
    }
</script>

<style lang="less" scoped>
    @import url("../../static/css/my/myScore.less");
</style>
