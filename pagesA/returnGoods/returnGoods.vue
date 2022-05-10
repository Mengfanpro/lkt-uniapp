<template>
    <div>
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <!-- #ifndef MP -->
        <heads :title="language.returnGoods.title" :returnR="12"></heads>
        <!-- #endif -->

        <ul class="order_goods">
            <li class="order_two" v-for="(item, index) in order" :key="index">
                <img :src="item.image" />
                <div class="yh-order-two-div">
                    <p class="p_name">{{ item.p_name }}</p>
                    <p class="color_one">{{ item.size }}</p>
                </div>
                <div>
                    <p>￥{{ Number(item.p_price).toFixed(2) }}</p>
                    <p class="color_two">x{{ item.num }}</p>
                </div>
            </li>
        </ul>

        <!-- 线 -->
        <div class="yh-line"></div>

        <ul>
            <li
                class="return_pay" v-if="refund_only_status && orderType!='MS' && orderType!='FX' && orderType!=='IN'"
                @tap="_uni_navigateTo('refund?refund_type=2&order_details_id=' + order_details_id + '&order_anking=' + order_anking + '&rType=' + rType+'&isbatch='+isbatch)"
            >
                <div class="return_right">
                    <div>
                        <img class="return_right_img" :src="tuikuan_img" />
                        <span>{{language.returnGoods.only}}</span>
                    </div>
                    <p>{{language.returnGoods.Tips[0]}}</p>
                </div>
                <img class="arrow" :src="jiantouhei_img" />
            </li>
            <li class="return_pay" v-if="return_refund_status  && orderType!='MS' && orderType!='PM' && orderType!='FX' && orderType!=='IN'" @tap="_uni_navigateTo('refund?refund_type=1&order_details_id=' + order_details_id + '&rType=' + rType+'&isbatch='+isbatch)">
                <div class="return_right">
                    <div>
                        <img class="return_right_img" :src="tuihuo_img" />
                        <span>{{language.returnGoods.Return_refund}}</span>
                    </div>
                    <p>{{language.returnGoods.Tips[1]}}</p>
                </div>
                <img class="arrow" :src="jiantouhei_img" />
            </li>
            <!-- 换货 -->
            <li
                class="return_pay"
                v-if="exchange_goods_status"
                @tap="_uni_navigateTo('refund?refund_type=3&order_details_id=' + order_details_id + '&order_anking=' + order_anking + '&r_status=' + r_status + '&rType=' + rType+'&isbatch='+isbatch)"
            >
                <div class="return_right">
                    <div>
                        <img class="return_right_img" :src="tuikuan_img" />
                        <span>{{language.returnGoods.exchange}}</span>
                    </div>
                    <p>{{language.returnGoods.Tips[2]}}</p>
                </div>
                <img class="arrow" :src="jiantouhei_img" />
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title: '请选择售后类型',
            order_details_id: '',
            tuihuo_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/tuihuo2x.png',
            jiantouhei_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jiantouhei2x.png',
            tuikuan_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/tuikuan2x.png',
            
            order: '',
            order_anking: '', // 批量申请还是单个申请
            rType: false,
            status: '',
            self_lifting: '',
            r_status: '',
            refund_only_status:false,
            return_refund_status:false,
            exchange_goods_status:false,
            isbatch: false,
            orderType:''
        };
    },
    onLoad(option) {
        this.isLogin(()=>{})
        console.log(option)
        this.order_details_id = option.order_details_id;
        this.order_anking = option.order_anking;
        this.r_status = option.r_status;
        
        if(option.isbatch == 'true'){
            this.isbatch = true
        }
        this._axios();

        this.rType = option.rType;
        if (this.r_status == '3') {
            this.rType = 3;
        }
    },
    methods: {
        /**
         *
         * */
        changeLoginStatus() {
            this._axios();
        },
        /**
         *
         * */
        _uni_navigateTo(url) {
            uni.redirectTo({
                url
            });
        },
        /**
         * @description 加载数据
         * */
        _axios() {
            var data = {
                module: 'app',
                action: 'order',
                app: 'return_method',
                order_details_id: this.order_details_id
            };

            this.$req.post({ data }).then(res => {
                if (res.code == 200) {
                    let { data } = res;
                    this.order = data.list;
                    this.self_lifting = data.self_lifting;
                    this.status = data.status;
                    this.refund_only_status = data.refund_only_status;
                    this.return_refund_status = data.return_refund_status;
                    this.exchange_goods_status = data.exchange_goods_status;
                    this.orderType = data.orderType
                } else {
                    uni.showToast({
                        title: res.message,
                        duration: 1500,
                        icon: 'none'
                    });
                }
            });
        }
    }
};
</script>

<style scoped lang="less">
@import url('../../static/css/returnGoods/returnGoods.less');
</style>
