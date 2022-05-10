<template>
    <view class="container"
        :style="{backgroundColor: coupon_list.length == 0 && hasLoad?'':tabIndex == 1?'#F5F5F5':''}">
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <heads :title="language.storeCoupon.title"></heads>

        <view class="tabBox">
            <view class="tab">
                <view class="tab_item" :class="{active: tabIndex == 0}" @tap="changeTab(0)">
                    {{editsFlag?language.storeCoupon.edit:language.storeCoupon.issue}}{{language.storeCoupon.coupons}}
                </view>
                <view class="tab_item" :class="{active: tabIndex == 1}" @tap="changeTab(1)">
                    {{language.storeCoupon.issuedCoupon}}
                </view>
            </view>
        </view>

        <view class="addCoupon" v-if="tabIndex == 0">
            <view class="addCoupon_list">
                <view class="addCoupon_list_left">
                    <text>*</text>
                    {{language.storeCoupon.type}}
                </view>
                <picker class="addCoupon_list_ipt" @change="bindPickerChange" :value="activity_type<0?0:activity_type"
                    :range="type_list">
                    <view class="uni-input" v-if="activity_type>=0">{{type_list[activity_type]}}</view>
                    <view class="uni-input" v-else style="color: #b8b8b8;">{{language.storeCoupon.typePlaceholder}}</view>
                </picker>
                <image class="jiantou" :src="jiantou"></image>
            </view>
            <view class="addCoupon_list">
                <view class="addCoupon_list_left">
                    <text>*</text>
                    {{language.storeCoupon.name}}
                </view>
                <input :disabled="editsFlag" class="addCoupon_list_ipt" v-model="name" type="text"
                    :placeholder="language.storeCoupon.namePlaceholder" placeholder-style="color:#b8b8b8">
            </view>
            <view class="addCoupon_list">
                <view class="addCoupon_list_left">
                    <text>*</text>
                    {{language.storeCoupon.issueNumber}}
                </view>
                <input class="addCoupon_list_ipt" v-model="circulation" type="number"
                    :placeholder="language.storeCoupon.issueNumberPlaceholder" placeholder-style="color:#b8b8b8">
                {{language.storeCoupon.zhang}}
            </view>
            <view class="addCoupon_list" v-if="type_index[activity_type] == 2">
                <view class="addCoupon_list_left">
                    <text>*</text>
                    {{language.storeCoupon.faceValue}}
                </view>
                <input class="addCoupon_list_ipt" v-model="money" type="number"
                    :placeholder="language.storeCoupon.faceValuePlaceholder" placeholder-style="color:#b8b8b8">
                {{language.storeCoupon.yuan}}
            </view>
            <view class="addCoupon_list" v-if="type_index[activity_type] == 3">
                <view class="addCoupon_list_left">
                    <text>*</text>
                    {{language.storeCoupon.discountValue}}
                </view>
                <input class="addCoupon_list_ipt" v-model="discount" type="number"
                    :placeholder="language.storeCoupon.discountValuePlaceholder" placeholder-style="color:#b8b8b8">
                {{language.storeCoupon.discount}}
            </view>
            <view class="addCoupon_list">
                <view class="addCoupon_list_left">
                    <text>*</text>
                    {{language.storeCoupon.threshold}}
                </view>
                <input class="addCoupon_list_ipt" v-model="z_money" type="number"
                    :placeholder="language.storeCoupon.thresholdPlaceholder" placeholder-style="color:#b8b8b8">
                {{language.storeCoupon.yuan}}
            </view>
            <view class="addCoupon_list">
                <view class="addCoupon_list_left">
                    <text class="none">*</text>
                    {{language.storeCoupon.range}}
                </view>
                <view class="addCoupon_list_ipt">
                    <radio-group class="radioBox" @change="radioChange">
                        <label>
                            <radio class="scale8" :checked="type == 1" value="1" color="#014343" />
                            {{language.storeCoupon.all}}
                        </label>
                        <label>
                            <radio class="scale8" :checked="type == 2" value="2" color="#014343" />
                            {{language.storeCoupon.specifyPro}}
                        </label>
                        <label>
                            <radio class="scale8" :checked="type == 3" value="3" color="#014343" />
                            {{language.storeCoupon.specifyClass}}
                        </label>
                    </radio-group>
                </view>
            </view>

            <view class="addCoupon_list" v-if="type==2">
                <view class="addCoupon_list_left">
                    <text>*</text>
                    {{language.storeCoupon.chooseGoods}}
                </view>
                <input @click="toUrl('/pagesA/myStore/choosePro')" disabled :value="pro_listText"
                    class="addCoupon_list_ipt" type="text" :placeholder="language.storeCoupon.chooseGoodsPlaceholder" placeholder-style="color:#b8b8b8">
                <image class="jiantou" :src="jiantou"></image>
            </view>
            <view class="addCoupon_list" v-if="type==3">
                <view class="addCoupon_list_left">
                    <text>*</text>
                    {{language.storeCoupon.chooseClass}}
                </view>
                <input @click="toUrl('/pagesA/myStore/chooseClass')" disabled :value="munu_listText"
                    class="addCoupon_list_ipt" type="text" :placeholder="language.storeCoupon.chooseClassPlaceholder"
                    style="margin-right: 20rpx;" placeholder-style="color:#b8b8b8" />
                <image class="jiantou" :src="jiantou"></image>
            </view>

            <view class="addCoupon_list">
                <view class="addCoupon_list_left">
                    <text>*</text>
                    {{language.storeCoupon.startTime}}
                </view>
                <input @click="clickStarttime" v-model="start_time" disabled class="addCoupon_list_ipt" type="text"
                    :placeholder="language.storeCoupon.startTimePlaceholder" placeholder-style="color:#b8b8b8">
                <image class="jiantou" :src="jiantou"></image>
            </view>
            <view class="addCoupon_list">
                <view class="addCoupon_list_left">
                    <text>*</text>
                    {{language.storeCoupon.endTime}}
                </view>
                <input @click="clickEndtime" v-model="end_time" disabled class="addCoupon_list_ipt" type="text"
                    :placeholder="language.storeCoupon.endTimePlaceholder" placeholder-style="color:#b8b8b8">
                <image class="jiantou" :src="jiantou"></image>
            </view>

            <view class="addCoupon_list">
                <view class="addCoupon_list_left">
                    <text>*</text>
                    {{language.storeCoupon.limit}}
                </view>
                <input v-if="limit_type == 1" class="addCoupon_list_ipt" v-model="receive" type="number"
                    :placeholder="language.storeCoupon.limitPlaceholder" placeholder-style="color:#b8b8b8">
                <input v-else disabled class="addCoupon_list_ipt" v-model="receive" type="number"
                    :placeholder="language.storeCoupon.limitPlaceholder" placeholder-style="color:#b8b8b8">
                {{language.storeCoupon.zhang}}
            </view>
            <view class="addCoupon_list" style="border-bottom: 0;">
                <view class="addCoupon_list_left">
                    <text class="none">*</text>
                    {{language.storeCoupon.instructions}}
                </view>
                <input class="addCoupon_list_ipt" type="text" v-model="Instructions"
                    :placeholder="language.storeCoupon.instructionsPlaceholder" placeholder-style="color:#b8b8b8">
            </view>

            <view @tap="saveAdd" class="addCoupon_btn">{{language.storeCoupon.submit}}</view>
        </view>

        <view class="seeCoupon" v-else>
            <view class="seeCoupon_item" v-for="item,index of coupon_list" :key="index">
                <view class="seeCoupon_item_top" :style="{backgroundImage: 'url('+couponBg+')'}">
                    <view class="seeCoupon_item_top_left">
                        <view v-if="item.activity_type == '满减卷'">
                            <text>￥</text>{{item.money}}
                        </view>
                        <view v-if="item.activity_type == '折扣卷'">
                            {{item.discount}}<text>{{language.storeCoupon.discount}}</text>
                        </view>
                        <text v-if="item.z_money>0">{{language.storeCoupon.full}}￥{{item.z_money}}{{language.storeCoupon.use}}</text>
                        <text v-else>{{language.storeCoupon.noThreshold}}</text>
                    </view>
                    <view class="seeCoupon_item_top_right">
                        <view>{{item.name}}</view>
                        <text>{{item.start_time}}-{{item.end_time}}</text>
                    </view>

                    <view class="icon" v-if="item.status == 3">{{language.storeCoupon.expired}}</view>
                </view>
                <view class="seeCoupon_item_center">
                    <view>
                        {{language.storeCoupon.circulation}}
                        <text>{{item.circulation}}</text>
                    </view>
                    <view>
                        {{language.storeCoupon.remaining}}
                        <text>{{item.num}}</text>
                    </view>
                </view>
                <view class="seeCoupon_item_bottom">
                    <view @tap="delCoupon(item.id)">{{language.storeCoupon.del}}</view>
                    <view @tap="edits(item.id)">{{language.storeCoupon.editor}}</view>
                    <view @tap="toUrl('/pagesA/myStore/seeCoupon?id='+item.id)">{{language.storeCoupon.record}}</view>
                </view>
            </view>

            <view class="no-bargain" v-if="coupon_list.length == 0 && hasLoad">
                <img :src="noCoupon">
                <p>{{language.storeCoupon.noFx}}</p>
            </view>

            <uni-load-more v-if="coupon_list.length>8" :loadingType="loadingType"></uni-load-more>
        </view>


        <date ref="starttimePicker" :themeColor="themeColor" :urseTime="start_time" @onConfirm="onConfirm1"></date>
        <date ref="endtimePicker" :themeColor="themeColor" :urseTime="end_time" @onConfirm="onConfirm2"></date>

        <view class="mask" v-if="delFlag">
            <view class="delMask">
                <text>{{language.storeCoupon.confirmDel}}</text>
                <view>
                    <view @tap="delFlag = false">{{language.storeCoupon.cancel}}</view>
                    <view @tap="delOk">{{language.storeCoupon.confirm}}</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import date from '../../components/date-time-picker.vue'

    export default {
        data() {
            return {
                title: '优惠券',
                jiantou: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jiantou2x.png',
                couponBg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/couponBg.png',
                noCoupon: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/noCoupon.png',

                type_list: ['满减券', '折扣券'],
                type_index: [],
                activity_type: -1,
                name: '',
                circulation: '',
                money: '',
                discount: '',
                z_money: '',
                pro_list: '',
                pro_listText: '',
                munu_list: '', //选中分类的ID集合
                munu_listText: '', //选中分类展示在前端的名字集合
                start_time: '',
                end_time: '',
                receive: '',
                Instructions: '',

                type: 1,

                themeColor: '#007AFF',

                tabIndex: 0,
                limit_type: 0,
                page: 1,
                coupon_list: [],
                loadingType: 0,

                editsFlag: false,
                editsId: '',
                delFlag: false,
                delId: '',

                hasLoad: false,
            };
        },
        onUnload() {
            uni.removeStorageSync('chooseClass')
            uni.removeStorageSync('chooseClassText')
            uni.removeStorageSync('checkProList')
            uni.removeStorageSync('checkProListId')
        },
        onLoad() {
            uni.removeStorageSync('chooseClass')
            uni.removeStorageSync('chooseClassText')
            uni.removeStorageSync('checkProList')
            uni.removeStorageSync('checkProListId')
        },
        onReachBottom() {
            if (this.loadingType != 0) {
                return
            }
            this.loadingType = 1
            this.page++
            this.getList()
        },
        onShow() {
            // this.type_list = this.language.storeCoupon.type_list

            if (uni.getStorageSync('chooseClass')) {
                this.munu_list = uni.getStorageSync('chooseClass')
                this.munu_listText = uni.getStorageSync('chooseClassText')
            }

            if (uni.getStorageSync('checkProList')) {
                let pro_list = uni.getStorageSync('checkProList')
                let pro_listText = []

                this.pro_list = []

                pro_list.filter(item => {
                    pro_listText.push(item.product_title)
                    this.pro_list.push(item.id)
                })
                this.pro_listText = pro_listText.join()
                this.pro_list = this.pro_list.join()
            }

            this.isLogin(() => {})

            if (this.tabIndex == 1) {
                this.page = 1
                this.getList()
            } else {
                this.axios()
            }
        },
        methods: {
            edits(id) {
                this.tabIndex = 0
                this.editsFlag = true
                this.editsId = id

                let data = {
                    module: 'app',
                    action: 'coupon',
                    app: 'modify_page',
                    mch_id: uni.getStorageSync('shop_id'), // 店铺id
                    id
                }

                this.$req.post({
                    data
                }).then(res => {
                    let {
                        code,
                        message,
                        data
                    } = res
                    if (code == 200) {

                        this.name = data.name;
                        this.circulation = data.circulation;
                        this.money = data.money;
                        this.discount = data.discount;
                        this.z_money = data.z_money;
                        this.start_time = data.start_time;
                        this.end_time = data.end_time;
                        this.receive = data.limitCount;
                        this.Instructions = data.Instructions;
                        this.type = data.type;
                        this.limit_type = data.limit_type;

                        this.pro_list = data.product_id;
                        this.pro_listText = data.product_name;
                        this.munu_list = data.product_class_name;
                        this.munu_listText = data.product_class_name1;

                        this.type_list = []
                        this.type_index = []

                        res.data.coupon_type.filter((item, index) => {
                            this.type_list.push(item.name)
                            this.type_index.push(item.value)
                            if (data.activity_type == item.value) {
                                this.activity_type = index;
                            }
                        })

                        uni.setStorageSync('chooseClass', data.product_class_name)
                        uni.setStorageSync('chooseClassText', data.product_class_name1)
                        uni.setStorageSync('checkProListId', data.product_id)
                    } else {
                        uni.showToast({
                            title: message,
                            icon: 'none'
                        })
                    }
                })
            },
            delOk() {
                let data = {
                    module: 'app',
                    action: 'coupon',
                    app: 'del',
                    mch_id: uni.getStorageSync('shop_id'), // 店铺id
                    id: this.delId
                }

                this.$req.post({
                    data
                }).then(res => {
                    let {
                        code,
                        message
                    } = res
                    if (code == 200) {
                        this.delFlag = false

                        this.page = 1
                        this.getList()
                    }
                    uni.showToast({
                        title: message,
                        icon: 'none'
                    })

                })
            },
            delCoupon(id) {
                this.delId = id
                this.delFlag = true
            },
            changeLoginStatus() {
                if (this.tabIndex == 1) {
                    this.page = 1
                    this.getList()
                } else {
                    this.axios()
                }
            },
            saveAdd() {
                if (this.activity_type < 0) {
                    uni.showToast({
                        title: this.language.storeCoupon.couponTips[0],
                        icon: 'none'
                    })
                    return
                }

                if (!this.name) {
                    uni.showToast({
                        title: this.language.storeCoupon.couponTips[1],
                        icon: 'none'
                    })
                    return
                }

                if (!this.circulation) {
                    uni.showToast({
                        title: this.language.storeCoupon.couponTips[2],
                        icon: 'none'
                    })
                    return
                }

                if (this.type_index[this.activity_type] == 2 && !this.money) {
                    uni.showToast({
                        title: this.language.storeCoupon.couponTips[3],
                        icon: 'none'
                    })
                    return
                }

                if (this.type_index[this.activity_type] == 3 && !this.discount) {
                    uni.showToast({
                        title: this.language.storeCoupon.couponTips[4],
                        icon: 'none'
                    })
                    return
                }

                if (!this.z_money) {
                    uni.showToast({
                        title: this.language.storeCoupon.couponTips[5],
                        icon: 'none'
                    })
                    return
                }

                if (this.type == 2 && !this.pro_listText) {
                    uni.showToast({
                        title: this.language.storeCoupon.couponTips[6],
                        icon: 'none'
                    })
                    return
                }

                if (this.type == 3 && !this.munu_list) {
                    uni.showToast({
                        title: this.language.storeCoupon.couponTips[7],
                        icon: 'none'
                    })
                    return
                }

                if (!this.start_time) {
                    uni.showToast({
                        title: this.language.storeCoupon.couponTips[8],
                        icon: 'none'
                    })
                    return
                }

                if (!this.end_time) {
                    uni.showToast({
                        title: this.language.storeCoupon.couponTips[9],
                        icon: 'none'
                    })
                    return
                }

                if (!this.receive) {
                    uni.showToast({
                        title: this.language.storeCoupon.couponTips[10],
                        icon: 'none'
                    })
                    return
                }


                let activity_type = this.type_index[this.activity_type]

                let data = {
                    module: 'app',
                    action: 'coupon',
                    app: 'add',
                    mch_id: uni.getStorageSync('shop_id'), // 店铺id
                    activity_type: activity_type, // 活动类型
                    name: this.name, // 活动名称
                    circulation: this.circulation, // 发行数量
                    money: this.money, // 优惠券面值
                    discount: this.discount, // 折扣值
                    z_money: this.z_money, // 满多少
                    type: this.type, // 优惠券使用范围
                    start_time: this.start_time, // 活动开始时间
                    end_time: this.end_time, // 活动结束时间
                    limitCount: this.receive, // 领取限制
                    menu_list: this.pro_listText, // 已选项
                    class_list: this.munu_list, // 已选项
                    Instructions: this.LaiKeTuiCommon.isempty(this.Instructions) ? "" : this.Instructions, // 使用说明
                }

                if (this.editsFlag) {
                    data.app = 'modify'
                    data.id = this.editsId
                }

                this.$req.post({
                    data
                }).then(res => {
                    if (res.code == 200) {
                        this.changeTab(1)
                    }
                    uni.showToast({
                        title: res.message,
                        icon: 'none'
                    })
                })
            },
            reset() {
                this.activity_type = -1;
                this.name = '';
                this.circulation = '';
                this.money = '';
                this.discount = '';
                this.z_money = '';
                this.pro_list = '';
                this.pro_listText = '';
                this.munu_list = '';
                this.munu_listText = '';
                this.start_time = '';
                this.end_time = '';
                this.receive = '';
                this.Instructions = '';
                this.type = 1;

                uni.removeStorageSync('chooseClass')
                uni.removeStorageSync('chooseClassText')
                uni.removeStorageSync('checkProList')
            },
            axios() {
                let data = {
                    module: 'app',
                    action: 'coupon',
                    app: 'add_page',
                    mch_id: uni.getStorageSync('shop_id'), // 店铺id
                }

                this.$req.post({
                    data
                }).then(res => {
                    this.limit_type = res.data.limit_type

                    this.type_list = []
                    this.type_index = []

                    res.data.coupon_type_list.filter(item => {
                        this.type_list.push(item.name)
                        this.type_index.push(item.value)
                    })

                    if (this.limit_type == 0) {
                        this.receive = 1
                    }
                })

            },
            changeTab(index) {
                if (this.tabIndex == index) {
                    return
                }

                this.tabIndex = index
                this.editsFlag = false

                this.munu_list = ''
                this.munu_listText = ''

                this.pro_listText = ''
                this.pro_list = ''

                uni.removeStorageSync('chooseClass')
                uni.removeStorageSync('chooseClassText')
                uni.removeStorageSync('checkProList')
                uni.removeStorageSync('checkProListId')

                if (this.tabIndex == 1) {
                    this.page = 1
                    this.getList()
                } else {
                    this.reset()
                    this.axios()
                }
            },
            getList() {
                let data = {
                    module: 'app',
                    action: 'coupon',
                    app: 'mch_index',
                    mch_id: uni.getStorageSync('shop_id'), // 店铺id
                    page: this.page
                }

                this.$req.post({
                    data
                }).then(res => {
                    this.hasLoad = true

                    let {
                        code,
                        data,
                        message
                    } = res
                    if (code == 200) {
                        data.list.filter(item => {
                            item.money = Number(item.money)
                            item.z_money = Number(item.z_money)
                            item.start_time = item.start_time.substr(0, 10).replace(/-/g, '.')
                            item.end_time = item.end_time.substr(0, 10).replace(/-/g, '.')
                        })

                        if (this.page == 1) {
                            this.coupon_list = []
                        }

                        this.coupon_list.push(...data.list)

                        if (data.list.length > 0) {
                            this.loadingType = 0
                        } else {
                            this.loadingType = 2
                        }
                    } else {
                        uni.showToast({
                            title: message,
                            icon: 'none'
                        })
                    }
                })
            },
            toUrl(url) {
                uni.navigateTo({
                    url
                })
            },
            radioChange(e) {
                this.type = e.detail.value

                this.munu_list = ''
                this.munu_listText = ''

                this.pro_listText = ''
                this.pro_list = ''

                uni.removeStorageSync('chooseClass')
                uni.removeStorageSync('chooseClassText')
                uni.removeStorageSync('checkProList')
                uni.removeStorageSync('checkProListId')
            },
            bindPickerChange(e) {
                this.activity_type = Number(e.detail.value)

                console.log(this.type_list[e.detail.value])
            },
            // 营业时间-确定
            onConfirm1(e) {
                console.log(e)
                var start = e[0].replace(/undefined/g, '00');
                var end = e[1].replace(/undefined/g, '00');
                this.start_time = start + ' ' + end;
            },
            clickStarttime() {
                this.$refs.starttimePicker.show(this.start_time);
            },
            onConfirm2(e) {
                var start = e[0].replace(/undefined/g, '00');
                var end = e[1].replace(/undefined/g, '00');
                this.end_time = start + ' ' + end;
            },
            clickEndtime() {
                this.$refs.endtimePicker.show(this.end_time);
            }
        },
        components: {
            date
        }
    };
</script>

<style lang="less">
    @import url('../../static/css/myStore/coupon.less');
</style>
