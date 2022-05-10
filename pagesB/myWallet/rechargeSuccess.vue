<template>
    <div>
        <heads :title="title"></heads>
        <div class="success_head">
            <img :src="gouhei" />
            <p class="success_title">{{ title_p }}</p>
            <p class="success_title_disc" v-if="isBankCard">{{language.rechargeSucess.Tips}}</p>
        </div>
        <div class="hr"></div>
        <ul>
            <li v-if="type">
                <p>{{ card }}</p>
                <div>
                    <span>{{ back }}</span>
                </div>
            </li>
            <li v-else v-if="isBankCard">
                <p>{{ card }}</p>
                <div>
                    <span>{{ back }}</span>
                    <span>{{language.rechargeSucess.tail}}（{{ back_number }}</span>
                </div>
            </li>
            <li>
                <p>{{ text_p }}</p>
                <p>￥{{ money }}</p>
            </li>
        </ul>
        <div class="go_shopping" @tap="_toHome()">{{language.rechargeSucess.Back_home}}</div>
        <div v-if="!store" class="look_order" @tap="_back()">{{language.rechargeSucess.Back_wallet}}</div>
        <div v-else class="look_order" @tap="_back1()">{{language.rechargeSucess.Back_shop}}</div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            gouhei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/gouhei.png',
            type: '',
            title: '',
            title_p: '',
            text_p: '',
            card: '',
            back: '',
            back_number: '',
            money: '',
            flag: true,
            store: false,
            isBankCard: false, //是否是银行卡支付
            back_type: '', // 1 从提现详情重新申请过来的
        };
    },
    onLoad(option) {
		this.setLang();
		
		this.back_type = option.back_type
		
        var str = option.id_catd;
        this.money = option.money;
        this.type = option.type;
        this.type = option._type;
        if (option._type == 'wx') {
            this.isBankCard = false;
        }

        if (this.type == undefined) {
            this.type = option._type;
        }
        if (option.mylei == 1) {
            this.title = this.language.rechargeSucess.title;
            this.title_p = this.language.rechargeSucess.title;
            this.text_p = this.language.rechargeSucess.text_p;
            if (this.type) {
                this.card = this.language.rechargeSucess.card;
                if (this.type == 'wx') {
                    this.back = this.language.rechargeSucess.back_wx;
                    this.isBankCard = false;
                } else if (this.type == 'alipay') {
                    this.back = this.language.rechargeSucess.back_ali;
                    this.isBankCard = false;
                }
            } else {
                this.card = this.language.rechargeSucess.card1;
            }
        } else {
            this.isBankCard = true;
            this.title = this.language.rechargeSucess.title1;
            this.title_p = this.language.rechargeSucess.title_p1;
            this.text_p = this.language.rechargeSucess.text_p1;
            this.card = this.language.rechargeSucess.card1;
            this.back = option.id_name;
            this.back_number = str.substr(str.length - 5);
            this.money = option.id_monsy;
        }

        //#ifdef H5
        window.document.title = this.title
        // #endif
    },
    methods: {
        _toHome() {
            uni.switchTab({
                url: '/pages/tabBar/home'
            });
        },
        _back() {
            this.flag = false;
            
            if (this.back_type == 1) {
                uni.redirectTo({
                    url: '/pagesA/myStore/myCha'
                })
            } else {
                uni.navigateBack({
                    delta: 1
                });
            }
            
            
        },
        _back1() {
            this.flag = false;
            uni.navigateBack({
                delta: 3
            });
        }
    }
};
</script>

<style scoped lang="less">
@import url('../../static/css/myWallet/rechargeSuccess.less');
</style>
