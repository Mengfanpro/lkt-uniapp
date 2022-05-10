<template>
    <div class="container">
        <heads :title="language.tixian.title"></heads>
        
        <toload :load="load">
        </toload>
        <template v-if="load">
            <view class="zprice">-￥{{list.money}}</view>
            <view class="status" :class="{red: status == 0}">{{status==0?language.tixian.Tips[0]:status==1?language.tixian.Tips[1]:language.tixian.Tips[2]}}</view>

            <view class="list">
                <view>{{language.tixian.money}}</view>
                <text>￥{{list.money}}</text>
            </view>
            <view class="list">
                <view>{{language.tixian.s_charge}}</view>
                <text>￥{{list.s_charge}}</text>
            </view>
            <view class="list">
                <view>{{language.tixian.Bank_card}}</view>
                <text>{{list.Bank_name}} ({{list.Bank_card_number}})</text>
            </view>
            <view class="list">
                <view>{{language.tixian.add_date}}</view>
                <text>{{list.add_date}}</text>
            </view>
            <view class="list" v-if="status == 2">
                <view>{{language.tixian.refuse}}</view>
                <text>{{list.refuse}}</text>
            </view>
            <view class="list" v-if="status != 0">
                <view>{{language.tixian.examine_date}}</view>
                <text>{{list.examine_date}}</text>
            </view>

            <view class="btnBox">
                <template v-if="status == 2">
                    <view class="background" @tap="_reapply()">{{language.tixian.Reapply}}</view>
                    <view class="border" @tap="_del()">{{language.tixian.deletes}}</view>
                </template>
            </view>
        </template>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title: '提现详情',
            status: 0, // 0是审核中 1是已完成  2是审核失败
            shop_id: '',
            id: '',
            load: false,
            list: [],
        };
    },
    onLoad(option) {
        this.id = option.id
        this.shop_id = uni.getStorageSync('shop_id') ? uni.getStorageSync('shop_id') : this.$store.state.shop_id;
        this._axios();
    },
    methods: {
		changeLoginStatus(){
			this._axios();
		},
        _axios() {
            this.$req.post({
                data: {
                    shop_id: this.shop_id,
                    module: 'app',
                    action: 'mch',
                    m: 'Withdrawal_details',
                    id: this.id
                }
            })
            .then(res => {
                if (res.code == 200) {
                    this.list = res.data.list;
                    this.status = res.data.list.status
                } else {
                    uni.showToast({
                        title: res.message,
                        duration: 1500,
                        icon: 'none'
                    });
                }
                this.load = true
            });
        },
        _del() {
            uni.showLoading({
                title: this.language.tixian.Tips[3],
                mask: true
            });
            this.$req.post({
                data: {
                    shop_id: this.shop_id,
                    module: 'app',
                    action: 'mch',
                    m: 'del_Withdrawal_details',
                    id: this.id
                }
            })
            .then(res => {
                uni.hideLoading();
                if (res.code == 200) {
                    uni.showToast({
                        title: res.message,
                        duration: 1500,
                        icon: 'none'
                    });
                    setTimeout(() => {
                        uni.navigateBack()
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
        _reapply(){
            uni.navigateTo({
                url: '/pagesB/myWallet/putForward?type=store&id='+this.id + '&back_type=1'
            });
        }
    },
};
</script>

<style lang="less">
@import url('../../static/css/myStore/tixianDetail.less');
</style>
