<template>
    <div class="container">
        <heads :title="language.storeMyCli.title"></heads>
        <div class="load" v-if="load">
            <div>
                <img :src="loadGif" />
                <p>{{language.toload.loading}}</p>
            </div>
        </div>
        <div v-else>
            <div v-if="list1.length > 0">
                <div class="date">
                    {{ time1 }}
                    <span>{{language.storeMyCli.today}}</span>
                </div>
                <div v-for="(item, index) in list1" :key="index" class="today_list">
                    <div class="border_bottom">
                        <div class="dateList">
                            <div class="dateListLeft">
                                <img :src="item[0].headimgurl" alt="" />
                                <span>{{ item[0].zhanghao }}</span>
                                <span>{{ item[0].event }}</span>
                            </div>
                            <div class="dateListLeft">
                                <span class="mr_72">{{ item[0].add_time }}</span>
                                <span class="expand" v-if="item.length > 1" @tap="showMore1(item, index)">
                                    <img class="jiantou" :src="jiantou" :style="'transform: rotate(' + item[0].transform + 'deg)'" />
                                </span>
                            </div>
                        </div>
                        <template v-if="item[0].status">
                            <div v-for="(items, indexs) in item" :key="indexs">
                                <div v-if="indexs != 0" class="dateListExpand">
                                    <div class="dateListLeft">
                                        <span>{{ items.zhanghao }}</span>
                                        <span>{{ items.event }}</span>
                                    </div>
                                    <div class="dateListLeft">
                                        <span class="mr_72">{{ items.add_time }}</span>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
            <div v-if="list2.length > 0">
                <div class="date">
                    {{ time2 }}
                    <span>{{language.storeMyCli.yesterday}}</span>
                </div>
                <div v-for="(item, index) in list2" :key="index">
                    <div class="dateList">
                        <div class="dateListLeft">
                            <img :src="item[0].headimgurl" alt="" />
                            <span>{{ item[0].zhanghao }}</span>
                            <span>{{ item[0].event }}</span>
                        </div>
                        <div class="dateListLeft">
                            <span class="mr_72">{{ item[0].add_time }}</span>
                            <span class="expand" v-if="item.length > 1" @tap="showMore2(index)">
                                <img class="jiantou" :src="jiantou" :style="'transform: rotate(' + item[0].transform + 'deg)'" />
                            </span>
                        </div>
                    </div>
                    <template v-if="item[0].status">
                        <div v-for="(items, indexs) in item" :key="indexs">
                            <div v-if="indexs != 0" class="dateListExpand">
                                <div class="dateListLeft">
                                    <span>{{ items.zhanghao }}</span>
                                    <span>{{ items.event }}</span>
                                </div>
                                <div class="dateListLeft">
                                    <span class="mr_72">{{ items.add_time }}</span>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
            <div v-if="list3.length > 0">
                <div class="date">
                    {{ time3 }}
                    <span>{{language.storeMyCli.beforeYesterday}}</span>
                </div>
                <div v-for="(item, index) in list3" :key="index">
                    <div class="dateList">
                        <div class="dateListLeft">
                            <img :src="item[0].headimgurl" alt="" />
                            <span>{{ item[0].zhanghao }}</span>
                            <span>{{ item[0].event }}</span>
                        </div>
                        <div class="dateListLeft">
                            <span class="mr_72">{{ item[0].add_time }}</span>
                            <span class="expand" v-if="item.length > 1" @tap="showMore3(index)">
                                <img class="jiantou" :src="jiantou" :style="'transform: rotate(' + item[0].transform + 'deg)'" />
                            </span>
                        </div>
                    </div>
                    <template v-if="item[0].status">
                        <div v-for="(items, indexs) in item" :key="indexs">
                            <div v-if="indexs != 0" class="dateListExpand">
                                <div class="dateListLeft">
                                    <span>{{ items.zhanghao }}</span>
                                    <span>{{ items.event }}</span>
                                </div>
                                <div class="dateListLeft">
                                    <span class="mr_72">{{ items.add_time }}</span>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
            <div v-if="list4.length > 0">
                <div class="date">
                    {{ time4 }}
                    <span>{{language.storeMyCli.earlier}}</span>
                </div>
                <div v-for="(item, index) in list4" :key="index">
                    <div class="dateList">
                        <div class="dateListLeft">
                            <img :src="item[0].headimgurl" alt="" />
                            <span>{{ item[0].zhanghao }}</span>
                            <span>{{ item[0].event }}</span>
                        </div>
                        <div class="dateListLeft">
                            <span class="mr_72">{{ item[0].add_time }}</span>
                            <span class="expand" v-if="item.length > 1" @tap="showMore4(index)">
                                <img class="jiantou" :src="jiantou" :style="'transform: rotate(' + item[0].transform + 'deg)'" />
                            </span>
                        </div>
                    </div>
                    <template v-if="item[0].status">
                        <div v-for="(items, indexs) in item" :key="indexs">
                            <div v-if="indexs != 0" class="dateListExpand">
                                <div class="dateListLeft">
                                    <span>{{ items.zhanghao }}</span>
                                    <span>{{ items.event }}</span>
                                </div>
                                <div class="dateListLeft">
                                    <span class="mr_72">{{ items.add_time }}</span>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
            <uni-load-more v-if="listNum > 11" :loadingType="loadingType"></uni-load-more>
            <div class="wsj_box" v-if="list1.length == 0 && list2.length == 0 && list3.length == 0 && list4.length == 0">
                <img class="wsj_img" :src="wushuju" />
                <div>{{language.storeMyCli.noList}}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loadGif: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/loading.gif',
            jiantou: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jianX.png',
            textImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/yhqBg.png',
            title: '我的客户',
            
            load: true,
            shop_id: '',
            list1: [], //今天
            list2: [], //昨天
            list3: [], //前天
            list4: [], //更早
            time1: '',
            time2: '',
            time3: '',
            time4: '',
            wushuju: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/wukehu.png',

            page: 0,
            listNum: 0,
            loadingType: 0
        };
    },
    onLoad(option) {
        
        this.shop_id = uni.getStorageSync('shop_id') ? uni.getStorageSync('shop_id') : this.$store.state.shop_id;
        this._axios();
    },
    onReachBottom: function() {
        if (this.loadingType != 0) {
            return;
        }
        this.loadingType = 1;
        this.page++;
        this._axios();
    },
    methods: {
        showMore1(item, index) {
            if (this.list1[index][0].status) {
                this.list1[index][0].status = false;
                this.list1[index][0].transform = 0;
            } else {
                this.list1[index][0].status = true;
                this.list1[index][0].transform = 180;
            }
        },
        showMore2(index) {
            if (this.list2[index][0].status) {
                this.list2[index][0].status = false;
                this.list2[index][0].transform = 0;
            } else {
                this.list2[index][0].status = true;
                this.list2[index][0].transform = 180;
            }
        },
        showMore3(index) {
            if (this.list3[index][0].status) {
                this.list3[index][0].status = false;
                this.list3[index][0].transform = 0;
            } else {
                this.list3[index][0].status = true;
                this.list3[index][0].transform = 180;
            }
        },
        showMore4(index) {
            if (this.list4[index][0].status) {
                this.list4[index][0].status = false;
                this.list4[index][0].transform = 0;
            } else {
                this.list4[index][0].status = true;
                this.list4[index][0].transform = 180;
            }
        },
        _axios() {
            this.$req
                .post({
                    data: {
                        module: 'app',
                        action: 'mch',
                        m: 'shop_customer',
                        
                        shop_id: this.shop_id,
                        page: this.page
                    }
                })
                .then(res => {
                    let { code, data, message } = res;
                    this.load = false;
                    if (code == 200) {
                        this.listNum += Number(data.num);
                        if (Number(data.num) > 9) {
                            this.loadingType = 0;
                        } else {
                            this.loadingType = 2;
                        }
                        
                        if(Array.isArray(data.list)){
                            return
                        }
                        
                        if (data.list.list1.res && data.list.list1.res.length > 0) {
                            let list1 = data.list.list1.res;
                            for (let i = 0; i < list1.length; i++) {
                                list1[i][0].transform = 0;
                            }
                            this.list1 = list1;
                            this.time1 = data.list.list1.time;
                        }
                        
                        if(Array.isArray(data.list.list2)){
                            return
                        }
                        
                        if (data.list.list2.res && data.list.list2.res.length > 0) {
                            let list2 = data.list.list2.res;
                            for (let i = 0; i < list2.length; i++) {
                                list2[i][0].transform = 0;
                            }
                            this.list2 = list2;
                            this.time2 = data.list.list2.time;
                        }
                        
                        if(Array.isArray(data.list.list3)){
                            return
                        }
                        
                        if (data.list.list3.res && data.list.list3.res.length > 0) {
                            let list3 = data.list.list3.res;
                            for (let i = 0; i < list3.length; i++) {
                                list3[i][0].transform = 0;
                            }
                            this.list3 = list3;
                            this.time3 = data.list.list3.time;
                        }
                        
                        if(Array.isArray(data.list.list3)){
                            return
                        }
                        
                        if (data.list.list4.res && data.list.list4.res.length > 0) {
                            let list4 = data.list.list4.res;
                            for (let i = 0; i < list4.length; i++) {
                                list4[i][0].transform = 0;
                            }
                            this.list4 = data.list.list4.res;
                            this.time4 = data.list.list4.time;
                        }
                    } else {
                        if(message){
                            uni.showToast({
                                title: message,
                                duration: 1500,
                                icon: 'none'
                            });
                        }
                       
                    }
                });
        }
    },
    computed: {
        now: function() {
            var year = new Date().getFullYear();
            var month = new Date().getMonth() + 1;
            var date = new Date().getDate();
            var date1 = year + '-' + month + '-' + date;
            return date1;
        }
    }
};
</script>

<style scoped lang="less">
@import url('../../static/css/myStore/myCli.less');
</style>
