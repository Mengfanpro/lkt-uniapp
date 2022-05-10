<template>
    <toload :load="load">
        <view class="fxRanking">
            <div class="top-height">

            </div>
            <div class="top" :style="{backgroundImage: 'url('+ bg +')', height: topHeight}">
                <fx-header title="分销排行">

                </fx-header>
                <div class="tabs">
                    <div class="tabs-item" :class="{active: active === 0}" @click="changeTabs(0)">
                        <div class="date">{{language.fxRanking.jr}}</div>
                        <div class="line" v-if="active === 0"></div>
                    </div>
                    <div class="tabs-item" :class="{active: active === 1}" @click="changeTabs(1)">
                        <div class="date">{{language.fxRanking.bz}}</div>
                        <div class="line" v-if="active === 1"></div>
                    </div>
                    <div class="tabs-item" :class="{active: active === 2}" @click="changeTabs(2)">
                        <div class="date">{{language.fxRanking.by}}</div>
                        <div class="line" v-if="active === 2"></div>
                    </div>
                    <div class="tabs-item" :class="{active: active === 3}" @click="changeTabs(3)">
                        <div class="date">{{language.fxRanking.bn}}</div>
                        <div class="line" v-if="active === 3"></div>
                    </div>
                </div>
                <div class="statistical">
                    <p>{{language.fxRanking.wdpm}}：{{ orderNo }}</p>
                    <p>{{language.fxRanking.wdyj}}：{{ commission }}</p>
                </div>
                <div class="user1">
                    <div>
                        <img class="hg" :src="hg" alt="">
                        <img class="avatar" :src="user1.headimgurl" alt="">
                        <div class="rankging">1</div>
                        <p class="user-name">{{user1.user_name}}</p>
                        <p class="num">{{ user1.commission }}</p>
                    </div>

                </div>
                <div class="user2">
                    <div>
                        <!--                    <img class="hg" :src="hg" alt="">-->
                        <img class="avatar" :src="user2.headimgurl" alt="">
                        <div class="rankging">2</div>
                        <p class="user-name">{{user2.user_name}}</p>
                        <p class="num">{{ user2.commission }}</p>
                    </div>
                </div>
                <div class="user3">
                    <div>
                        <!--                    <img class="hg" :src="hg" alt="">-->
                        <img class="avatar" :src="user3.headimgurl" alt="">
                        <div class="rankging">3</div>
                        <p class="user-name">{{user3.user_name}}</p>
                        <p class="num">{{ user3.commission }}</p>
                    </div>
                </div>
            </div>

            <div class="list">
                <div class="list-item" v-for="(item, index) of list2" :key="index">
                    <div class="left">
                        {{item.key}}
                    </div>
                    <div class="content">
                        <div class="left">
                            <image :src="item.headimgurl"></image>
                            <text class="name">
                                {{item.user_name}}
                            </text>
                        </div>
                        <div class="num">
                            {{item.commission}}
                        </div>
                    </div>
                    <div class="right">

                    </div>
                </div>
            </div>

        </view>
    </toload>
</template>

<script>
import FxHeader from './components/FxHeader'

export default {
    name: "fxRanking",
    data() {
        return {
            active: 0,
            bg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/fx-paihang.png',
            hg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/fx-hg.png',
            unLogin: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/unLogin.png',
            user1: {
                user_name: '暂无',
                headimgurl: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/unLogin.png',
                commission: '0.00'
            },
            user2: {
                user_name: '暂无',
                headimgurl: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/unLogin.png',
                commission: '0.00'
            },
            user3: {
                user_name: '暂无',
                headimgurl: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/unLogin.png',
                commission: '0.00'
            },
            list2: [],
            orderNo: '',
            commission: '0.00',
            load: false
        }
    },
    components: {
        FxHeader
    },
    onLoad() {
        this._axios()
    },
    computed: {
        topHeight () {
            var gru = uni.getStorageSync('data_height') ? uni.getStorageSync('data_height') : this.$store.state.data_height
            // #ifdef MP-TOUTIAO
            // const info = uni.getSystemInfoSync()
            // if(info.platform != 'ios'){
            // 	gru=0
            // }
            // #endif
            let height = 0
            // #ifndef MP-ALIPAY
            var heigh = parseInt(gru) + uni.upx2px(750)
            height = heigh && heigh > 0 ? heigh : uni.upx2px(750)
            // #endif

            // #ifdef MP
            heigh += 375
            // #endif


            return height + 'px'
        }
    },
    methods: {
        _axios () {
            let data = {
                module: 'app',
                action: 'commcenter',
                app: 'getRanking',
                type: this.active + 1
            }
            this.$req.post({data}).then(res => {
                try {
                    let {
                        data: {
                            orderNo,
                            commission,
                            ranking
                        }
                    } = res;
                    
                    
                    this.orderNo = orderNo
                    this.commission = commission
                    
                    if (ranking && ranking.length) {
                        let list = ranking;
                        
                        
                        if (list.length >= 3) {
                            this.user1 = Object.assign(this.user1, list.shift());
                            this.user2 = Object.assign(this.user2, list.shift());
                            this.user3 = Object.assign(this.user3, list.shift());


                            
                            for (let i = 0; i < list.length; i ++) {
                                let item = list[i]
                                item.key = i + 4
                                this.list2.push(item)
                            }
                            
                        } else if (list.length >=2) {
                            this.user1 = Object.assign(this.user1, list.shift());
                            this.user2 = Object.assign(this.user2, list.shift());
    
                        } else if (list.length >= 1) {
                            this.user1 = Object.assign(this.user1, list.shift());
                        } else {
                            this.user1 = Object.assign({});
                            this.user2 = Object.assign({});
                            this.user3 = Object.assign({});
                        }
                        
                        
                    }
                    this.load = true
                    
                } catch (e) {
                    
                    console.log(e);
                    this.load = true
                }
            })  
        },

        changeTabs(active) {
            this.active = active
            this.list2 = [];
            this.user1 = Object.assign({
                user_name: '暂无',
                headimgurl: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/unLogin.png',
                commission: '0.00'
            });
            this.user2 = Object.assign({
                user_name: '暂无',
                headimgurl: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/unLogin.png',
                commission: '0.00'
            });
            this.user3 = Object.assign({
                user_name: '暂无',
                headimgurl: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/unLogin.png',
                commission: '0.00'
            });
            this._axios()
        }
    }
}
</script>

<style lang="less" scoped>
@import url('../../static/css/home/fxRanking.less');
</style>
