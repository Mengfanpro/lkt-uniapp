<template>
    <div>
        <heads :title="language.myWallet.title"></heads>
        <div class="wallet_account_box">
            <div class="position">
                <div class="wallet_account" :style="{backgroundImage: 'url('+myWalletBg+')'}">
                    <p class="wallet_ct">{{ user_money | 0 }}</p>
                    <p class="wallet_xt">{{language.myWallet.money}}（{{ unit }}）</p>
                    <div class="wallet_r">
                        <div class="wallet_border" @tap="navTo('recharge?cide=1')">
                            <img :src="qbcz" />
                            <span>{{language.myWallet.recharge}}</span>
                        </div>
                        <div @tap="_tixian()">
                            <img :src="qbtx" />
                            <span>{{language.myWallet.withdrawal}}</span>
                        </div>
                    </div>
                </div>
                <p class="wallet_my">{{language.myWallet.walletDetails}}</p>
            </div>
        </div>
        <ul class="overflow" ref="wallet" v-if="list.length>0">
            <li class="wallet_mx" v-for="(item, index) in list" :key="index">
                <div>
                    <p class="wallet_value">{{ type[item.type].value }}</p>
                    <p class="wallet_size">{{ item.add_date }}</p>
                </div>
                <p :class="item.type== 1 ||item.type== 2 || item.type == 14 ||item.type== 13 ||item.type== 19 ||item.type== 20 ||item.type== 5 ||item.type== 22 ||item.type== 23 ||item.type== 27 ||item.type== 30 ? 'wallet_zhi':'hei'">
                    <span
                        v-text="
                            item.type == 1 ||
                            item.type == 5 ||
                            item.type == 13 ||
                            item.type == 14 ||
                            item.type == 19 ||
                            item.type == 20 ||
                            item.type == 22 ||
                            item.type == 23 ||
                            item.type == 27 ||
                            item.type == 30
                                ? '+'
                                : '-'
                        "
                    ></span>
                    {{ item.money }}
                </p>
            </li>
        </ul>
        <div class="nodata" v-else>
            <img class="wsj_img" :src="wushuju"/>
            <p>{{ language.myFinance.noList }}</p>
        </div>
        
        <uni-load-more v-if="list.length > 10" :loadingType="loadingType"></uni-load-more>

        <maskM :content="language.myWallet.qxtj" :display="display" @mask_value="onHandle"></maskM>
    </div>
</template>

<script>
import maskM from "@/components/maskM";
export default {
    data() {
        return {
            qbkp: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/qbkp.jpg',
            qbcz: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/qianbaochongzhi.png',
            qbtx: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/qianbaotixian.png',
            myWalletBg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/myWalletBg.png',
            wushuju: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/wuzhangdan.png',
            title: '我的钱包',
            
            list: '', //全部记录
            user_money: '',
            page: 2, //加载页面
            allLoaded: false,
            autoFill: false, //若为真，loadmore 会自动检测并撑满其容器
            bottomStatus: '',
            bottomPullText: '上拉加载更多...',
            bottomDropText: '释放更新...',
            loading: false,
            starts: '',
            unit: '元',
            type: [
                { 0: '0' },
                { value: '充值' },
                { value: '申请提现' },
                { value: '分享' },
                { value: '余额消费' },
                { value: '退款' },
                { value: '红包提现' },
                { value: '佣金' },
                { value: '管理佣金' },
                { value: '待定' },
                { value: '消费金' },
                { value: '系统扣款' },
                { value: '给好友转余额' },
                { value: '转入余额' },
                { value: '系统充值' },
                { value: '系统充积分' },
                { value: '系统充消费金' },
                { value: '系统扣积分' },
                { value: '系统扣消费金' },
                { value: '消费金解封' },
                { value: '抽奖中奖' },
                { value: '提现成功' },
                { value: '提现失败' },
                { value: '取消订单' },
                { value: '分享获取红包' },
                { value: '未知' },
                { value: '上交竞拍押金' },
                { value: '退竞拍押金' },
                { value: '售后（仅退款）' },
                { value: '售后（退货退款）' },
                { value: '会员返现' }
            ],
            loadingType: 0,
            display: false,
        };
    },
    onShow () {
        this.loadingType = 0;
        this.list = [];
        this.page = 2;
        this._axios();
    },
    components: {
        maskM
    },
    onReachBottom() {
        if (this.loadingType != 0) {
            return;
        }
        this.loadingType = 1;
        var data = {
            module: 'app',
            action: 'user',
            app: 'wallet_detailed',
            page: this.page,
            pagesize:10
        };
        console.dir(this.page)
        this.$req.post({ data }).then(res => {
            let { code, data: {list} } = res;
            this.page += 1
            if (list && list.length > 0) {
                this.list = this.list.concat(list);
                console.dir(this.list)
                this.loadingType = 0;
            } else {
                this.loadingType = 2;
            }
        });
    },
    methods: {
        onHandle (value) {
            if (value === '取消') {
                this.display = false;
            } else {
                this.display = false;
                this.navTo('/pagesB/setUp/changePhone?withdrawalNoPhone=1')
            }
        },
        handleBottomChange(status) {
            this.bottomStatus = status;
        },
        _axios() {
            let data = {
                module: 'app',
                action: 'user',
                app: 'details'
            };
            this.$req.post({ data }).then(res => {
                if (res.code == 200) {
                    let { data: {unit, user_money, list} } = res;
                    this.list = list;
                    this.user_money = user_money;
                    this.starts = status;
                    this.unit = unit;
                } else {
                    uni.showToast({
                        title: res.message,
                        duration: 1500,
                        icon: 'none'
                    });
                }
            });
        },
        _tixian() {
            if (this.starts == 0) {
                let user_phone = uni.getStorageSync('user_phone')
                if (!user_phone) {
                    this.display = true;
                    return false;
                }
                
                
                uni.navigateTo({ url: 'putForward' });
            } else if (this.starts == 1) {
                uni.showToast({
                    title: this.language.myWallet.haswithdrawal,
                    duration: 1000,
                    icon: 'none'
                });
            }
        }
    }
};
</script>

<style scoped lang="less">
@import url('../../static/css/myWallet/myWallet.less');
</style>
