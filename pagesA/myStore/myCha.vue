<template>
    <div class="container">
        <heads :title="language.storeMyCha.title"></heads>
        <toload :load="load">
            <div class="relative">
                <div class="p_30">
                    <div class="moneyDiv" @tap="navTo('/pagesA/myStore/records')">
                        <div>
                            <div class="money">{{ account_money ? account_money : '0.00' }}</div>
                            <div>{{ language.storeMyCha.money }}</div>
                        </div>
                    </div>
                    <div class="btnDiv" @tap="_toCha()">
                        <div>
                            <img class="img" :src="tixian" />
                            <div>{{language.storeMyCha.tixian}}</div>
                        </div>
                        <div><img class="jiantou" :src="jiantou" /></div>
                    </div>


                    <div class="btnDiv" @tap="_toDetail()">
                        <div>
                            <img class="img" :src="mingxi" />
                            <div>{{language.storeMyCha.minxi}}</div>
                        </div>
                        <div><img class="jiantou" :src="jiantou" /></div>
                    </div>

                    <div class="explain" v-if="illustrate">
                        <div>{{language.storeMyCha.instructions}}</div>
                        <div><rich-text :nodes="illustrate"></rich-text></div>
                    </div>
                </div>
            </div>
        </toload>
    </div>
</template>

<script>
import htmlParser from '@/common/html-parser.js';

export default {
    data() {
        return {
            title: '我的提现',
            load: false,
            mingxi: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/mingxi.png',
            tixian: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/tixian.png',
            jiantou: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jiantou2x.png',
            shop_id: '',
            account_money: 0.0,
            all_money: 0.0,
            integral_money: 0,
            illustrate: ''
        };
    },
    onShow() {
        this.shop_id = uni.getStorageSync('shop_id') ? uni.getStorageSync('shop_id') : this.$store.state.shop_id;
        this._axios();
    },
    methods: {
        _axios() {
            this.$req
                .post({
                    data: {
                        module: 'app',
                        action: 'mch',
                        m: 'my_wallet',
                        shop_id: this.shop_id
                    }
                })
                .then(res => {
                    this.load = true;
                    if (res.code == 200) {
                        this.account_money = res.data.account_money;
                        this.integral_money = res.data.integral_money;
                        this.all_money = res.data.all_money;
                        this.illustrate = htmlParser(res.data.illustrate);
                    } else {
                        uni.showToast({
                            title: res.message,
                            duration: 1500,
                            icon: 'none'
                        });
                    }
                    this.load = true;
                });
        },
        _toCha() {
            uni.navigateTo({
                url: '/pagesB/myWallet/putForward?type=store'
            });
        },
        _toDetail() {
            uni.navigateTo({
                url: './myFinance'
            });
        }
    }
};
</script>

<style scoped lang="less">
@import url('../../static/css/myStore/myCha.less');
</style>
