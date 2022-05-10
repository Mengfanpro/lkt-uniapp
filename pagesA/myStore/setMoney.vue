<template>
    <view class="container">
        <lktauthorize ref="lktAuthorizeComp"></lktauthorize>
        <heads :title="title"></heads>
        <view class="content">
            <view class="money">
                <view class="money_title">收款金额</view>
                <view class="money_bottom">
                    <view>￥</view>
                    <input type="number" v-model="money" placeholder="输入收款金额" placeholder-style="color: #B8B8B8;">
                </view>
            </view>
            <view class="remark">
                <image :src="edit"></image>
                <input v-model="remark" type="text" placeholder="添加备注" placeholder-style="color: #B8B8B8;">
            </view>
        </view>
        <view class="btn" :style="{opacity: haveClick?'':'0.4'}" @tap="submit">确认</view>
    </view>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
    data() {
        return {
            title: '设置金额',
            edit: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/mch/edit.png',
            money: '',
            remark: '',
        };
    },
    computed: {
        haveClick(){
            let flag = false;
            if(this.money){
                flag = true;
            }
            return flag
        }
    },
    onShow() {
        
    },
    methods: {
        ...mapMutations({
            setMoney: 'setMoney'
        }),
        submit(){
            this.setMoney({
                money: this.money,
                remark: this.remark,
            })
            uni.navigateBack({
                delta: 1
            })
        }
    }
};
</script>

<style scoped lang="less">
@import url('../../static/css/myStore/setMoney.less');
</style>
