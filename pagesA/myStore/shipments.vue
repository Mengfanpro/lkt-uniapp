<template>
    <view class="container">
        <lktauthorize ref="lktAuthorizeComp"></lktauthorize>
        <heads :title="title"></heads>
        <template v-if="type == 1">
            <view class="list">
                <view class="list_li" v-for="(item, index) in list.list" :key="index" v-if="item.r_status == 1" @tap="_choose(item)">
                    <image v-if="item.chooseMe" class="xuanze" :src="xuanze"></image>
                    <view class="xuanze_i" v-else></view>
                    <image class="image" :src="item.imgurl"></image>
                    <view class="right">
                        <view class="view">{{ item.p_name }}</view>
                        <view class="text">{{ item.size }}</view>
                    </view>
                </view>
            </view>
            <view class="bottom">
                <view @tap="_chooseQ">
                    <image v-if="quanxuan" class="xuanze" :src="xuanze"></image>
                    <view class="xuanze_i" v-else></view>
                    {{ language.shipments.Select_all }}
                </view>
                <view @tap="_shipments">{{ language.shipments.deliver }}</view>
            </view>
        </template>
        <template v-else>
            <view class="_ul">
                <view class="_li">
                    <text>{{ language.shipments.express[0] }}</text>
                    <input @tap="showSinglePicker" type="text" disabled :placeholder="language.shipments.express[1]" v-model="company" />
                    <image @tap="showSinglePicker" class="jiantou" :src="jiantou"></image>
                </view>
                <view class="_li">
                    <text>{{ language.shipments.express[2] }}</text>
                    <input type="text" :placeholder="language.shipments.express[3]" v-model="courier_num" />
                </view>
            </view>
            <view class="bottom_ship" @tap="_shipments1" v-if="pageType != 1">{{ language.shipments.determine }}</view>
            <view class="bottom_ship" @tap="_shipments2" v-else>{{ language.shipments.determine }}</view>
            <mpvue-picker
                v-if="show"
                :themeColor="themeColor"
                ref="mpvuePicker"
                :mode="mode"
                :deepLength="deepLength"
                :pickerValueDefault="pickerValueDefault"
                @onConfirm="onConfirm"
                :pickerValueArray="pickerValueArray"
            ></mpvue-picker>
        </template>
    </view>
</template>

<script>
import mpvuePicker from '../../components/mpvuePicker.vue';

export default {
    data() {
        return {
            title: '选择商品',

            list: '',
            xuanze: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/xuanzehei2x.png',
            jiantou: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jiantou2x.png',
            quanxuan: false,

            courier_num: '', //快递单号
            company: '', //快递公司
            orderList_id: '',
            sNo: '',
            shop_id: '',
            kuaidiList: [],
            express_id: '', //快递公司ID

            show: false,
            themeColor: '#007AFF',
            mode: '',
            deepLength: 1,
            pickerValueDefault: [0],
            pickerValueArray: [],
            id: '',

            type: 1,
            pageType: '',
            
            order_details_id: ''
        };
    },
    computed: {},
    onLoad(option) {
        this.shop_id = uni.getStorageSync('shop_id') ? uni.getStorageSync('shop_id') : this.$store.state.shop_id;
        this.id = option.id;

        if (option.type == 1) {
            this.type = 2;
            this.pageType = 1;
            this.sNo = option.id;
            this.order_details_id = option.order_details_id
        } else {
            this._axios();
        }
    },
    onShow() {
        this.title = this.language.shipments.title;

        if (this.pageType == 1) {
            this.title = this.language.shipments.title2;
            this.getKuaidi()
        }
    },
    methods: {
        // 售后回寄商品
        _shipments2(){
            if(!this.express_id){
                uni.showToast({
                    title: '请选择快递公司',
                    icon: 'none'
                })
                return
            }
            if(!this.courier_num){
                uni.showToast({
                    title: '请输入快递单号',
                    icon: 'none'
                })
                return
            }
           var data = {
               shop_id: this.shop_id,
               module: 'app',
               action: 'mch',
               m: 'examine',
               sNo: this.sNo,
               id: this.order_details_id,
               express_id: this.express_id, // 快递ID
               courier_num: this.courier_num, // 快递单号
               r_type: 11
           };
           
           uni.showLoading({
               title: '请稍后...',
               mask: true
           })
           this.$req.post({data}).then(res=>{
               uni.hideLoading()
               uni.showToast({
                   title: res.message,
                   icon: 'none'
               })
               if(res.code == 200){
                   setTimeout(()=>{
                       uni.navigateBack({
                           delta: 1
                       })
                   },1000)
               }
           })
           
        },
        getKuaidi(){
            let data = {
                shop_id: this.shop_id,
                module: 'app',
                action: 'mch',
                m: 'into_send'
            };
            
            this.$req.post({data}).then(res => {
                uni.hideLoading();
                if (res.code == 200) {
                    var list = [];
                    this.kuaidiList = res.data.list;
                    for (var key in res.data.list) {
                        list.push(res.data.list[key].kuaidi_name);
                    }
                    this.pickerValueArray = list;
                } else if (res.code == 404) {
                    uni.showToast({
                        title: res.message,
                        duration: 1500,
                        icon: 'none'
                    });
                    setTimeout(function() {
                        uni.navigateTo({
                            url: '/pages/login/login?landing_code=1'
                        });
                    }, 1500);
                } else {
                    uni.showToast({
                        title: res.message,
                        duration: 1500,
                        icon: 'none'
                    });
                }
            });
        },
        async _axios() {
            let data = {
                module: 'app',
                action: 'mch',
                m: 'deliver_show',
                id: this.id,
                shop_id: this.shop_id
            };
            let res = await this.$req.post({ data });
            if (!res.data.goods.length) {
                uni.showToast({
                    title: this.language.shipments.Tips[0],
                    icon: 'none'
                });
                setTimeout(() => {
                    uni.navigateBack();
                }, 1500);
                return false;
            }
            this.list = {
                list: res.data.goods,
                sNo: this.id
            };
        },
        _choose(item) {
            this.$set(item, 'chooseMe', !item.chooseMe);
            let list = this.list.list;
            let flag = true;
            for (let i = 0; i < list.length; i++) {
                if (!list[i].chooseMe) {
                    flag = false;
                    break;
                }
            }
            this.quanxuan = flag;
        },
        _chooseQ() {
            this.quanxuan = !this.quanxuan;
            let list = this.list.list;
            for (let i = 0; i < list.length; i++) {
                this.$set(list[i], 'chooseMe', this.quanxuan);
            }
        },
        _shipments() {
            this.orderList_id = [];
            var dd = this.list.list;
            for (let i = 0; i < dd.length; i++) {
                if (dd[i].chooseMe && dd[i].r_status == 1) {
                    this.orderList_id.push(dd[i].id);
                }
            }
            this.sNo = this.list.sNo;
            if (this.orderList_id.length == 0) {
                uni.showToast({
                    title: this.language.shipments.Tips[1],
                    duration: 1500,
                    icon: 'none'
                });
                return;
            }
            uni.showLoading({
                title: this.language.shipments.Tips[2]
            });

            this.$req
                .post({
                    data: {
                        shop_id: this.shop_id,
                        module: 'app',
                        action: 'mch',
                        m: 'into_send'
                    }
                })
                .then(res => {
                    uni.hideLoading();
                    if (res.code == 200) {
                        var list = [];
                        this.kuaidiList = res.data.list;
                        for (var key in res.data.list) {
                            list.push(res.data.list[key].kuaidi_name);
                        }
                        this.pickerValueArray = list;
                        this.type = 2;
                        this.title = this.language.shipments.title2;
                    } else if (res.code == 404) {
                        uni.showToast({
                            title: res.message,
                            duration: 1500,
                            icon: 'none'
                        });
                        setTimeout(function() {
                            uni.navigateTo({
                                url: '/pages/login/login?landing_code=1'
                            });
                        }, 1500);
                    } else {
                        uni.showToast({
                            title: res.message,
                            duration: 1500,
                            icon: 'none'
                        });
                    }
                });
        },
        _shipments1() {
            var data = {
                shop_id: this.shop_id,
                module: 'app',
                action: 'mch',
                m: 'send',
                sNo: this.sNo,
                express_id: this.express_id,
                courier_num: this.courier_num,
                orderList_id: this.orderList_id.join(',')
            };
            this.$req.post({ data }).then(res => {
                if (res.code == 200) {
                    uni.showToast({
                        title: this.language.shipments.Tips[3],
                        duration: 1500,
                        icon: 'none'
                    });
                    setTimeout(function() {
                        uni.navigateBack({
                            delta: 1
                        });
                    }, 1500);
                } else if (res.code == 404) {
                    uni.showToast({
                        title: res.message,
                        duration: 1500,
                        icon: 'none'
                    });
                    setTimeout(function() {
                        uni.navigateTo({
                            url: '/pages/login/login?landing_code=1'
                        });
                    }, 1500);
                } else {
                    uni.showToast({
                        title: res.message,
                        duration: 1500,
                        icon: 'none'
                    });
                }
            });
        },
        // 选择快递公司
        showSinglePicker() {
            this.show = true;
            this.mode = 'selector';
            this.deepLength = 1;
            this.pickerValueDefault = [0];
            this.$refs.mpvuePicker.show();
        },
        onConfirm(e) {
            this.company = e.label;
            this.show = false;
            this.express_id = this.kuaidiList[e.index[0]].id;
        }
    },
    components: {
        mpvuePicker
    }
};
</script>

<style scoped lang="less">
.container {
    min-height: 100vh;
    background-color: #f4f4f4;
    padding-bottom: 98rpx;
    box-sizing: border-box;
}

.list {
    background-color: #ffffff;
}

.list_li {
    display: flex;
    align-items: center;
    height: 180rpx;
    margin-left: 30rpx;
    padding: 30rpx 30rpx 30rpx 0;
    box-sizing: border-box;
}

.list .list_li:not(:last-child) {
    border-bottom: 1px solid #e6e6e6;
}

.list_li .image {
    width: 120rpx;
    height: 120rpx;
    margin-right: 20rpx;
}

.xuanze,
.xuanze_i {
    width: 34rpx;
    height: 34rpx;
    border-radius: 34rpx;
    margin-right: 30rpx;
}

.xuanze_i {
    box-sizing: border-box;
    border: 1px solid #b8b8b8;
}

.list_li .right {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.list_li .right .view {
    color: #020202;
    font-size: 24rpx;
    line-height: 28rpx;
    margin-bottom: 20rpx;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
}

.list_li .right .text {
    display: inline-block;
    color: #999999;
    font-size: 22rpx;
    line-height: 22rpx;
}

.bottom {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 98rpx;
}

.bottom .xuanze,
.bottom .xuanze_i {
    margin-right: 12rpx;
}

.bottom > view:first-child {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 0 30rpx;
    background: #ffffff;
}

.bottom > view:last-child {
    .solidBtn();
    width: 240rpx;
    height: 100%;
    font-size: 30rpx;
    line-height: 98rpx;
    text-align: center;
}

.jiantou {
    width: 15rpx;
    height: 27rpx;
}

._ul {
    background-color: #ffffff;
    padding-left: 30rpx;
}

._li {
    display: flex;
    align-items: center;
    height: 90rpx;
    padding-right: 30rpx;
    box-sizing: border-box;
}

._ul > ._li:not(:last-child) {
    border-bottom: 1px solid #e6e6e6;
}

._li text {
    color: #020202;
    font-size: 28rpx;
}

._li input {
    flex: 1;
    padding-left: 60rpx;
    font-size: 28rpx;
}

.bottom_ship {
    .solidBtn();
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 98rpx;
    line-height: 98rpx;
    text-align: center;
    font-size: 30rpx;
}
</style>
