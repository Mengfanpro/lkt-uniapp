<template>
    <div class='container' :style="'background-image:url('+kill_bg+')'">
        <div style='position: relative;'>
            <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
            <heads :title='language.seckill.seckill.title' navWhite='true' ishead_w="1" :returnR="6"></heads>

            <!-- #ifndef MP -->
            <div class="seckill_disc" @tap='_toGradeUse(true)'>
                <image :src="seckill_rule" class='seckill_rule'></image>
                <p>{{language.seckill.seckill.title2}}</p>
            </div>
            <!-- #endif -->
        </div>
        <!-- #ifdef MP -->
        <div class="seckill_disc1">
            <image :src="seckill_rule" class='seckill_rule' @tap='_toGradeUse(true)'></image>
            <p @tap='_toGradeUse(true)'>{{language.seckill.seckill.title2}}</p>
        </div>
        <!-- #endif -->
        <scroll-view scroll-x="true" :scroll-into-view="scroll_index" scroll-with-animation="true">
            <ul class='title_list1' :style="'width:'+(20*t_list.length || 100)+'vw'" v-if="t_list.length < 4">

                <li :id="'scroll_' + index" @tap='_change(index,item)' :class="{'active':index == t_index}"
                    v-for='(item,index) in t_list' :key='index'>
                    <span class="mainTitle">{{item.name}}</span>
                    <span class="subtitle" :class="{'active':index !== t_index}">{{ item.title ? item.title : '' }}</span>
                    <span class="hr" v-show="index == t_index"></span>
                </li>

            </ul>
            <ul class='title_list' :style="'width:'+(20*t_list.length || 100)+'vw'" v-else>
            
                <li :id="'scroll_' + index" @tap='_change(index,item)' :class="{'active':index == t_index}"
                    v-for='(item,index) in t_list' :key='index'>
                    <span class="mainTitle">{{item.name}}</span>
                    <span class="subtitle" :class="{'active':index !== t_index}">{{ item.title ? item.title : '' }}</span>
                    <span class="hr" v-show="item.id == id"></span>
                </li>
            
            </ul>
        </scroll-view>

        <view class="content-ul">
            <!-- <view class="content-ul-li content-ul-li-head p-s d-f a-c j-sb">
                <text>
                    {{ type === 0? language.seckill.seckill.type[0]: type === 1? language.seckill.seckill.type[1]: type === 2?language.seckill.seckill.type[2]: language.seckill.seckill.type[0] }}
                </text>
                <view class="time-box">
                    <text>
                        {{ type === 0? '': type === 1? language.seckill.seckill.type[3]: type === 2?language.seckill.seckill.type[4]: language.seckill.seckill.Panic[2] }}
                    </text>

                    <template v-if="type !== 0">
                        <text>{{ time.hours || '00'}}:</text>
                        <text>{{ time.minutes || '00'}}:</text>
                        <text>{{ time.seconds || '00'}}</text>
                    </template>

                </view>
            </view> -->

            <template v-if="!list.length">
                <view class="content-ul-li ul-li-empty d-f a-c j-c fd-c">
                    <!-- <image :src="empty_bg"></image>
                    <img :src="empty_bg"> -->
                    <image src="../../static/img/emptybg.png"></image>
                    <view>
                        {{language.seckill.seckill.Tips[0]}}
                    </view>
                </view>
            </template>
            <template v-else>
                <view class="content-ul-li item d-f a-c" v-for="(item,index) in list" :key="index" @tap="_go_details(item)">
                    <view class="nullTips" v-if="item.secStockNum == 0 && item.secStatus == 5" >{{language.seckill.seckill.type[5]}}</view>
                    <view class="nullTips" v-if="item.secStatus == 3">{{language.seckill.seckill.Panic[2]}}</view>
                    <image class="item-img" :src="item.imgUrl || ''"></image>
                    <view class="countdown" v-if="item.secStatus !== 3 && item.secStockNum !== 0" :class="[ item.secStatus == 4 ?  'active' : 'actives' ]">
                        <span v-if="item.secStatus == 2">距结束</span>
                        {{item.djs}}
                        <span v-if="item.secStatus == 4">后开抢</span>
                    </view>
                    <view class="item-body">
                        <view class="item-body-title ">
                            {{ item.goodsName || item.pro_id }}
                        </view>
                        <view class="item-body-limited" v-if="item.secStatus==4" style="font-size: 14px;color: rgb(151, 160, 180);" >
                            限量：<text style="color: #FF7D00;">{{item.secMaxStockNum}}</text>件
                        </view>
                        <view v-else class="item-body-progress">
                            <!-- style="font-size: 14px;color: rgb(151, 160, 180);"限量：<text style="color: red;">118</text>件 -->
                            <text class="item-progress">
                                <text class="item-progress-text" :style="item.progress"></text>
                                <text class="item-progress-title">{{ item.per }}%</text>
                            </text>
                            <text class="item-num">
                                <text v-if="item.secStockNum>0">{{language.seckill.seckill.Robbed}}<text class="red">{{ item.secMaxStockNum - item.secStockNum }}</text>{{language.seckill.seckill.piece}}</text>
                                <text v-else style="color: #999;">{{language.seckill.seckill.type[5]}}</text>
                            </text>
                        </view>
                        

                        <view class="d-f j-sb a-c">
                            <view class="">

                                <view class="a-money">
                                    ￥{{ item.secPrice.toFixed(2) || 0 }}
                                </view>

                                <view class="b-money">
                                    ￥{{ item.goodsPrice.toFixed(2) || 0 }}
                                </view>

                            </view>

                            <view class="o-btn d-f j-c a-c" v-if="item.secStatus === 2 && item.secStockNum != 0">
                                {{language.seckill.seckill.Panic[3]}}
                            </view>
                            <view class="o-btn d-f j-c a-c end" v-if="item.secStockNum == 0 && item.secStatus==5">
                                {{language.seckill.seckill.Panic[3]}}
                            </view>
                            <view class="o-btn d-f j-c a-c jg" v-if="item.secStatus === 3">
                                {{language.seckill.seckill.Panic[2]}}
                            </view>

                            <view class="o-btn d-f j-c a-c jg" v-if="item.secStatus === 4">
                                {{language.seckill.seckill.Panic[1]}}
                            </view>

                        </view>
                    </view>
                </view>
            </template>
        </view>

        <!-- 规则 -->
        <ruleModal v-model="isShow" @click="_toGradeUse" :title="language.seckill.seckill.title2" :details="content"/>
    </div>
</template>

<script>
    function InitTime(endtime){
        var dd,hh,mm,ss = null;
        var time = parseInt(endtime) - new Date().getTime();
        if(time<=0){
            return '结束'
        }else{
            dd = Math.floor(time / 60 / 60 / 24);
            hh = Math.floor((time / 60 / 60) % 24);
            mm = Math.floor((time / 60) % 60);
            ss = Math.floor(time  % 60);
            var str = dd+"天"+hh+"小时"+mm+"分"+ss+"秒";
            return str;
        }
    }
    import ruleModal from '@/components/ruleModal.vue'
    import htmlParser from '@/common/html-parser.js'
    import { getTimeDiff } from '@/common/util.js'
    import {
        mapMutations
    } from 'vuex'

    export default {
        data () {
            return {
                title: '限时秒杀',
                
                t_list: [],
                type: 0,
                // #ifdef H5
                kill_bg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/kill_bg.png',
                // #endif
                // #ifndef H5
                kill_bg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/seckillBg1.png',
                // #endif
                seckill_rule: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/seckill_rule.png',
                empty_bg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/emptybg.png',
                t_index: 0,
                page: 1,
                list: [],
                id: '', //已选中时间段的id
                navType: 0, //列表类型 0 已结束 1 进行中 2即将开始
                scroll_index: 'scroll_0',
                isShow: false,
                content: '',
                rule: '',
                time: {
                    hours: '00',
                    minutes: '00',
                    seconds: '00'
                }
            }
        },
        onLoad () {
            let me = this
            
            // me._axios(me.id)
            clearInterval(this.Intervalid)
            me._axiosRule()
            me._axiosLabel()
        },
        onShow() {
            this.isLogin(()=>{
        		// this._axiosLabel();
        	})
        },
        components: {
            ruleModal
        },
        onUnload () {
            clearInterval(this.Intervalid)
        },
        
        mounted() {
            setInterval( ()=> {
                for (let key in this.list) {
                    var aaa = parseInt(this.list[key]["remainingTime"] );
                    var bbb = new Date().getTime();
                    var rightTime = aaa - parseInt(bbb)
                    if (rightTime > 0) {
                        var d = Math.floor(rightTime/1000/60/60/24)
                        var h = Math.floor((rightTime / 1000 / 60 / 60) % 24)
                        var m = Math.floor((rightTime / 1000 / 60) % 60)
                        var s = Math.floor((rightTime / 1000) % 60)
                    }
                    if(parseInt(d)>0){
                        h = 24*d + parseInt(h)
                    }
                    if(parseInt(h)<10){
                        h="0"+h;
                    }
                    if(parseInt(m)<10){
                        m="0"+m;
                    }
                    if(parseInt(s)<10){
                        s="0"+s;
                    }
                    var times = h + ":" + m + ":" + s
                    this.$set(this.list[key],'djs',times);
                }
            }, 1000);
        },
        
        methods: {
            ...mapMutations({
                setseckilldata: 'setseckilldata',
            }),
            timeFun (endtime, item) {
                let result = getTimeDiff(endtime)

                this.time.hours = result.hours
                this.time.minutes = result.minutes

                if (result.seconds.toString().indexOf('-') !== -1) {
                    if (item.type === 1 || item.type === 2) {
                        this._axios()
                        return
                    }

                }
                this.time.seconds = result.seconds
            },
            /**
             * 倒计时
             * */
            setCountDown: function (item) {
                clearInterval(this.Intervalid)

                let year = new Date().getFullYear()
                let month = new Date().getMonth() + 1
                let dates = new Date().getDate()
                let endtime = ''

                if (item.type == 2) {
                    endtime = `${year}-${month}-${dates} ${item.starttime}`
                } else {
                    endtime = `${year}-${month}-${dates} ${item.endtime}`
                }

                this.timeFun(endtime, item)

                this.Intervalid = setInterval(() => {

                    this.timeFun(endtime, item)

                }, 1000)

            },
            
            async _axios2 (id) {
                var me = this
                var data = {

                    module: 'app',
                    action: 'pthd_seckill',
                    m: 'seckillhome',
                    page: me.page,
                    id
                }
                
                let res = await this.$req.post({data})
                if (typeof (res) === 'string') {
                    return {
                        code: 200,
                        msg: '',
                        data: {
                            list: [],
                            rule: '',
                            time_list: [],
                        }
                    };
                }
                res = res.data
                if (res.list && res.list.length) {
                    res.list.map(item => item.b_type = 1)
                    return {
                        list: res.list,
                        time_list: res.time_list,
                        rule: res.rule,
                        code: res.code
                    };
                } else {
                    return {
                        list: [],
                        time_list: res.time_list,
                        rule: res.rule,
                        code: res.code
                    };
                }
            },
            async _axiosRule() {
                var data = {
                    module: 'plugin',
                    action: 'sec',
                    app: 'getSecondsRule'
                }
                let res = await this.$req.post({data})
                console.log(res.data.rule)
                this.content = res.data.rule
                
            },
            
            async _axiosLabel() {
                var data = {
                    module: 'plugin',
                    action: 'sec',
                    app: 'secondsLabelList'
                }
                let res = await this.$req.post({data})
                this.t_list = res.data.list
                this.id = res.data.list[0].id
                this._axiosGoods(this.id)
            },
            
            async _axiosGoods(id) {
                let m = this
                var data = {
                    module: 'plugin',
                    action: 'sec',
                    app: 'index',
                    id: id
                }
                let res = await this.$req.post({data})
                console.log(res)
                m.list = res.data.list
                if (m.list.length) {
                    for (let i in m.list) {
                        m.list[i].progress = m._progress(m.list[i])
    
                        let result = 100 - parseInt((m.list[i].secMaxStockNum - m.list[i].secStockNum) / m.list[i].secMaxStockNum * 100)
                        // let result = parseInt((m.list[i].secMaxStockNum - m.list[i].secStockNum) / m.list[i].secMaxStockNum * 100)
                        if(m.list[i].secStockNum == 0) {
                            m.list[i].per = 100
                        } else {
                            m.list[i].per = result
                        }
                    }
                }
            },
            
            // _axios (id) {

            //     var me = this
            //     var data = {
                    
            //         module: 'app',
            //         action: 'seckill',
            //         m: 'seckillhome',
            //         page: me.page,
            //         id
            //     }

            //     this.$req.post({
            //         data
            //     }).then(async res => {
            //         if (typeof (res) === 'string') {
            //             res = {
                            
            //                 code: 200,
            //                 msg: '',
            //                 data: {
            //                     list: [],
            //                     rule: '',
            //                     time_list: [],
            //                 }
            //             }
            //         }
                    
                    
            //         if (res.code == 200) {
            //             let {
            //                 list,
            //                 rule,
            //                 time_list,
            //                 msg
            //             } = res.data

            //             // this.content = rule
            //             let res2 = await this._axios2(id)
            //             list = list.concat(res2.list)
            //             if (!rule) {
            //                 rule = res2.rule
            //             }
                    
            //             if (!time_list.length) {
            //                 time_list = res2.time_list;
            //             }
                        
            //             this.list = list
            //             this.rule = rule

            //             if (list.length) {
            //                 for (let i in list) {
            //                     list[i].progress = me._progress(list[i])

            //                     let result = 100 - parseInt((list[i].max_num - list[i].num) / list[i].max_num * 100)
            //                     // let result = parseInt((list[i].max_num - list[i].num) / list[i].max_num * 100)

            //                     list[i].per = result
            //                 }
            //             }
            //             if (!id) {
            //                 this.t_list = time_list

            //                 for (let i = 0; i < me.t_list.length; i++) {
            //                     // 如果找到了开抢中的哪一列
            //                     if (me.t_list[i].type == 1) {

            //                         setTimeout(() => {
            //                             me._change(i, me.t_list[i])
            //                         }, 100)
            //                         return
            //                     }
            //                 }

            //                 // 如果没有进行中的活动
            //                 me._change(0, me.t_list[0])
            //             }

            //             return
            //         }

            //         uni.showToast({
            //             title: res.message || msg,
            //             duration: 1500,
            //             icon: 'none'
            //         })
            //     })
            // },
            // 查看秒杀商品
            _go_details (item) {
                // if (item.secStockNum <= 0) {
                //     uni.showToast({
                //         title: this.language.seckill.seckill.Tips[1],
                //         icon: 'none'
                //     })
                //     return false
                // }
                let types = null
                if(item.secStatus == 2) {
                    types = 1
                } else if(item.secStatus == 4) {
                    types = 2
                }  else if(item.secStatus == 5) {
                    types = 3
                } else {
                    types = 0
                }
                this.setseckilldata(item)

                let url = '/pagesB/seckill/seckill_detail?pro_id=' + item.goodsId + '&navType=' + types + '&id=' + item.secGoodsId + '&type=MS'
                if (item.b_type == 1) {
                    url += '&b_type=1'
                }
                
                uni.redirectTo({
                    url: url
                })
            },
            // 选择时段
            _change (index, item) {
                var me = this

                me.t_index = index

                if (item.type == 1) {
                    me.navType = 0
                } else if (item.type == 2) {
                    me.navType = 1
                }

                me.setCountDown(item)
                me.type = item.type

                me.id = item.id
                // me._axios(me.id)

                // me.scroll_index = 'scroll_' + index
                
                me._axiosGoods(item.id)
            },
            // 提醒
            _remind (item) {
                item.setremind = item.setremind == 1 ? 0 : 1
                
                let action = 'seckill'
                if (item.b_type == 1) {
                    action = 'pthd_seckill';
                }
                
                var data = {
                    
                    module: 'app',
                    action: action,
                    m: 'setremind',
                    activity_id: item.activity_id,
                    pro_id: item.pro_id,
                    time_id: item.time_id,
                    type: item.setremind
                }
                this.$req.post({data}).then(res => {
                    if (res.code != 200) {
                        item.setremind = item.setremind == 1 ? 0 : 1
                    }
                    uni.showToast({
                        title: res.message,
                        duration: 1500,
                        icon: 'none'
                    })
                })
            },
            // 剩余时间，距结束的时间
            _remain_time (item, type) {

                // item.lefttime 距结束的时间  item.totaltime 总持续时间
                var timeStr = '' //转换后的时间字符串
                var secondTime = item.lefttime //剩余时间的秒数
                var minuteTime = '0' //剩余时间的分钟数
                var hourTime = '0' //剩余时间的小时数
                //如果秒数大于60，将秒数转换成整数

                if (secondTime > 60) {
                    //获取分钟，除以60取整数，得到整数分钟
                    minuteTime = parseInt(secondTime / 60)

                    //获取秒数，秒数取佘，得到整数秒数
                    secondTime = parseInt(secondTime % 60)

                    //如果分钟大于60，将分钟转换成小时
                    if (minuteTime > 60) {
                        //获取小时，获取分钟除以60，得到整数小时
                        hourTime = parseInt(minuteTime / 60)

                        //获取小时后取佘的分，获取分钟除以60取佘的分
                        minuteTime = parseInt(minuteTime % 60)

                    }
                }
                if (type == 1) {

                    return hourTime < 10 ? ('0' + hourTime) : hourTime

                } else if (type == 2) {

                    return minuteTime < 10 ? ('0' + minuteTime) : minuteTime
                } else if (type == 3) {

                    return secondTime < 10 ? ('0' + secondTime) : secondTime
                }
            },
            _progress (item) {
                let result = 100 - parseInt((item.secMaxStockNum - item.secStockNum) / item.secMaxStockNum * 100)
                // let result = parseInt((item.secMaxStockNum - item.secStockNum) / item.secMaxStockNum * 100)
                // let result = parseInt((item.max_num - item.num) / item.max_num * 100)
                // 剩余数量进度条
                if(item.secStockNum == 0) {
                    return `width:${100}%`
                } else {
                    return `width:${result}%`
                }
            },
            _setTime () {
                var me = this
                // 清除定时器，以免有多个定时器存在
                clearTimeout(me.settime)
                me.settime = setTimeout(() => {
                    // 给每一项秒杀定时
                    for (let i = 0; i < me.list.length; i++) {

                        if (me.list[i].lefttime > 0) {
                            me.list[i].lefttime--
                            me.list[i].count_hour = me._remain_time(me.list[i], 1)
                            me.list[i].count_min = me._remain_time(me.list[i], 2)
                            me.list[i].count_s = me._remain_time(me.list[i], 3)
                            me.list[i].progress = me._progress(me.list[i])
                        }

                        if (me.list[i].lefttime == 0) {
                            // me._axios(me.id)
                        }
                    }
                    me._setTime()
                }, 1000)
            },
            _toGradeUse (is) {
                var me = this
                if (is) {
                    if(me.rule==''){
                        // this.content = ''
                    }else{
                        this.content = htmlParser(me.rule)
                    }
                    
                    this.isShow = !this.isShow
                } else {
                    this.isShow = !this.isShow
                }
            },
        }
    }
</script>

<style scoped lang="less">
    @import url("../../static/css/seckill/seckill.less");
</style>
