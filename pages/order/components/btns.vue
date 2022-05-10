<template>
    <view>
        <div v-if="isExtract" class="last_right">
            <!-- 自提订单 -->
            <template v-if="self_lifting == 1">
                <div v-if="qxdd" class="last_right_leftBtn" @click="onQxddClick">{{language.order.myorder.cancel_order}}</div>
                <div v-if="ljfk" @click="onLjfkClick">{{language.order.myorder.payment}}</div>
                <div v-if="cktqm"  @click="onCktqmClick">{{language.order.myorder.Extraction[1]}}</div>
                <div v-if="tqm" @click="onCktqmClick">{{language.order.myorder.Extraction[0]}}</div>
            </template>
            <!-- 非自提订单 -->
            <template v-else>
                <div v-if="plsqsh" class="last_right_leftBtn" @click="onPlsqshClick">{{language.order.order.button2[0]}}</div>
                <div v-if="scdd" class="last_right_leftBtn" @click="onScddClick">{{language.order.order.leftText[1]}}</div>
                <div v-if="qxdd" class="last_right_leftBtn" @click="onQxddClick">{{language.order.order.leftText[0]}}</div>
                <div v-if="ckwl && otype!='VI'" class="last_right_leftBtn" @click="onCkwlClick">{{language.order.order.leftText[2]}}</div>

                <div v-if="txfh" :class="{ a1: delivery_status == 1 }" @click="onTxfhClick">{{language.order.order.button2[3]}}</div>
                <div v-if="ljfk" @click="onLjfkClick">{{language.order.order.rightText[0]}}</div>
                <div v-if="zcgm" @click="onZcgmClick">{{language.order.order.rightText[4]}}</div>
                <div v-if="qrsh" @click="onQrshClick">{{language.order.order.rightText[2]}}</div>
            </template>

        </div>
        <view v-else class="last_right">

            <!-- <div v-if="(otype=='pt' || otype=='PP') && status==7" @click="onScddClick">{{language.order.order.leftText[1]}}</div> -->
            <div v-if="(otype=='pt' || otype=='PP') && status==7" @click="zcgm_s">{{language.order.order.rightText[4]}}</div>
            <div v-if="ptxq" class="last_right_leftBtn" @click="onPtxqClick">{{language.order.myorder.Group_details}}</div>
            <div v-if="scdd" class="last_right_leftBtn" @click="onScddClick">{{language.order.myorder.delete_order}}</div>
            <div v-if="ckwl && otype!='VI'" class="last_right_leftBtn" @click="onCkwlClick">{{language.order.myorder.View_Logistics}}</div>

            <div v-if="txfh" :class="{ a1: delivery_status == 1 }" @click="onTxfhClick">{{language.order.order.button2[3]}}</div>
            <div v-if="qrsh" @click="onQrshClick">{{language.order.order.rightText[2]}}</div>
            <div v-if="yqhy" @click="onYqhyClick">{{language.order.myorder.Invite_friends}}</div>
        </view>
    </view>
</template>

<script>
    import {mapMutations, mapState} from "vuex";

    export default {
        name: "btns",
        props: {
            status: {required: true}, // 订单状态, 0 未付款， 1，未发货， 2待收货 ，5 已完成 7订单关闭 ,9 拼团中
            isExtract: {required: true}, // 拼单订单为false
            self_lifting: {required: true}, // 是否自提订单，自提为1，否则为0
            sale_type: {required: true}, // 0 没有售后， 1部分商品售后， 2 全部进入了售后
            delivery_status: {required: true}, // 1 已经提醒发货了
            orde_id: {required: true}, // 订单id
            sNo: {required: true}, // 订单编号
            otype: {required: true}, // 订单类型  GM 正价 ,KJ 砍价， JP 竞拍， MS 秒杀, pt 拼团, integral 积分商城， FX 分销, PP 平台活动管理的拼团
            form: {required: false}, // order 从订单详情来的 
            goodsNum: {required: false}, // 商品数量，非必传，订单详情需要传
            isOrderDel: {required: false}, // 商品数量，非必传，订单详情需要传
        },
        data () {
            return {
                fastTap: true, // 防止重复点击
            }
        },
        components: {

        },
        computed: {
            ...mapState({
                status_id: state => state.status
            }),
            // 邀请好友
            yqhy () {
                if (this.self_lifting == 1) return false;
                if (this.status != 9) return false;
                if (this.form != 'order') return false;
                return true;
            },
            // 批量申请售后
            plsqsh () {
                if (this.self_lifting == 1) return false;
                if (this.status != 2 &&  this.status != 1) return false;
                if (this.sale_type == 2) return false;
                if (this.form !== 'order') return false
                if (this.goodsNum <= 1) return false;
                return true;
            },
            // 拼团详情
            ptxq () {
                if (this.status != 1) return false;
                return  true;
            },
            // 提取码
            tqm () {
                if (this.self_lifting == 0) return false;
                if (this.status != 5) return false;
                if (this.sale_type != 0) return false;
                return true;
            },
            // 查看提取码
            cktqm () {
                if (this.self_lifting == 0) return false;
                if (this.status != 2) return false;
                if (this.sale_type != 0) return false;
                return true;
            },
            // 确认收货
            qrsh () {
                if (this.self_lifting == 1) return false;
                if (this.status != 2) return false;
                if (this.sale_type != 0) return false;
                return true;
            },
            // 再次购买
            zcgm () {
                if (this.self_lifting == 1) return false;
                if (this.status != 7) return false;
                if(this.status == 7 && this.otype == 'MS') return false;
                if(this.status == 7 && this.otype == 'IN') return false
                return true;
            },
            // 取消订单
            qxdd () {
                if (this.status != 0) return false;
                if (this.otype == 'JP') return false;
                return true;
            },
            // 删除订单
            scdd () {
                if(this.isOrderDel) {
                    console.log(123)
                    return true
                } else {
                    console.log(456)
                    return false
                }
                // if (this.self_lifting == 1) return false;
                // if (this.status_id == 4) {
                //     return true;
                // }
                // if (this.status == 5) return true
                // if(this.otype == 'MS' && this.status == 5) return true
                // if (this.isExtract) {
                //     if (this.status != 7) return false;
                // } else {
                //     if (this.status != 5) return false;
                // }



                // return true;
            },
            // 查看物流
            ckwl () {
                if (this.self_lifting == 1) return false;
                if (this.status != 2 && this.status !=3 && this.status != 5) return false;
                return true;
            },
            // 提醒发货
            txfh () {
                if (this.self_lifting == 1) return false;
                if (this.status != 1) return false;
                return true;
            },
            // 立即付款
            ljfk () {
                if (this.status != 0) return false;
                return true;
            }
        },
        created() {

        },
        methods: {
            ...mapMutations(['SET_ORDER_ID', 'SET_ADDRESS_ID', 'SET_CART_ID']),
            // 邀请好友
            onYqhyClick () {
                if (this.otype == 'pp') {
                    this.navTo('/pagesA/group/group_end?sNo=' + this.sNo + '&returnR=1&a_type=1')    
                } else {
                    this.navTo('/pagesA/group/group_end?sNo=' + this.sNo + '&returnR=1')
                }
                
                
            },
            // 拼团详情
            onPtxqClick () {
                if (this.otype == 'pp') {
                    this.navTo('/pagesA/group/group_end?sNo=' + this.sNo + '&returnR=1&a_type=1')
                } else {
                    this.navTo('/pagesA/group/group_end?sNo=' + this.sNo + '&returnR=1')
                }
            },
            // 取消订单
            onQxddClick  () {
                if (!this.fastTap) return false;
                this.fastTap = false;
                let data = {
                    module: 'app',
                    action: 'order',
                    order_id: this.orde_id,
                    app: 'removeOrder'
                };

                uni.showModal({
                    title: this.language.order.myorder.prompt1,
                    content: this.language.order.myorder.sure1,
					confirmText: this.language.order.myorder.confirm,
					cancelText: this.language.order.myorder.cancel,
                    success: res => {
                        if (res.confirm) {
                            this.$req.post({data}).then(res => {
                                this.fastTap = true;
                                let { code, message } = res;

                                if (code == 200) {
                                    uni.showToast({
                                        title: this.language.order.orderSearch.Tips2[0],
                                        duration: 1000,
                                        icon: 'none'
                                    });
                                }
                                this.$emit('refresh')
                            });
                        } else if (res.cancel) {
                            this.fastTap = true;
                        }
                    }
                });
            },
            // 确认收货
            onQrshClick () {
                if (!this.fastTap) return false;
                this.fastTap = false;
                uni.showModal({
                    title: this.language.order.myorder.prompt2,
                    content: this.language.order.myorder.Tips2,
					confirmText: this.language.order.myorder.confirm,
					cancelText: this.language.order.myorder.cancel,
                    success: res => {
                        if (res.confirm) {
                            let data = {
                                module: 'app',
                                action: 'order',
                                app: 'ok_Order',
                                order_id: this.orde_id,
                            };

                            this.$req.post({data}).then(res => {
                                let { code, message } = res;
                                if (code == 200) {
                                    uni.showToast({
                                        title: this.language.order.orderSearch.Tips2[4],
                                        duration: 1000,
                                        icon: 'none'
                                    });
                                    setTimeout(() => {
                                        this.$emit('refresh')
                                    }, 1000);
                                } else {
                                    uni.showToast({
                                        title: res.message,
                                        duration: 1500,
                                        icon: 'none'
                                    });
                                }
                                this.fastTap = true;
                            });
                        } else if (res.cancel) {
                            this.fastTap = true;
                        }
                    }
                });
            },
            /**
             * 验证订单是否关闭
             * @returns {Promise<void>}
             * @private
             */
            async _check_order_status () {
                let postData = {
                    module: 'app',
                    action: 'order',
                    app: 'order_details',
                    order_id: this.orde_id
                }
                let {
                    data: {
                        status
                    }
                } = await this.$req.post({data: postData})
                status = Number.parseInt(status)
                if((status == 7 || status == 6)) {
                    return Promise.reject(this.language.order.myorder.order_gb)
                }
                return  Promise.resolve()
            },
            // 再次购买
            onZcgmClick () {
                if (!this.fastTap) return false;
                this.fastTap = false;
                let commodity_type = this.otype == 'VI'?1:0;
                var data = {
                    module: 'app',
                    action: 'order ',
                    app: 'buy_again',
                    id: this.orde_id,
                    commodity_type: commodity_type
                };

                this.$req.post({ data }).then(res => {
                    let { data: {cart_id}, code, message } = res;
                    this.fastTap = true;
                    if (code == 200) {
                        this.SET_CART_ID(cart_id)
                        this.SET_ORDER_ID('')
                        this.SET_ADDRESS_ID('')
                        let url = '/pages/pay/orderDetailsr?buy_again=true&cart_id=' + cart_id+'&commodity_type='+commodity_type
                        if (this.otype === 'FX') {
                            url = '/pages/pay/orderDetailsr?buy_again=true&cart_id=' + cart_id + '&isDistribution=true&commodity_type='+commodity_type
                        }
                        uni.navigateTo({
                            url: url
                        });
                    } else {
                        uni.showToast({
                            title: message,
                            duration: 1500,
                            icon: 'none'
                        });
                    }
                })
            },
            onPlsqshClick () {
                uni.navigateTo({
                    url: '/pages/order/batchOrder?orde_id=' + this.orde_id
                });
            },
            zcgm_s(){
                uni.navigateTo({
                    url: '/pagesA/group/group'
                });
            },
            // 删除订单
            onScddClick () {
                if (!this.fastTap) return false;
                this.fastTap = false;
                uni.showModal({
                    title: this.language.order.myorder.prompt,
                    content: this.language.order.myorder.sure,
					confirmText: this.language.order.myorder.confirm,
					cancelText: this.language.order.myorder.cancel,
                    success: res => {
                        if (res.confirm) {
                            /*发送请求*/
                            let data = {
                                module: 'app',
                                action: 'order',
                                order_id: this.orde_id,
                                app: 'del_order'
                            };

                            this.$req.post({ data }).then(res => {
                                this.fastTap = true;
                                let { code, message } = res;
                                if (code == 200) {
                                    uni.showToast({
                                        title: this.language.order.myorder.delete_success,
                                        duration: 1000,
                                        icon: 'none'
                                    });

                                    if (this.form === 'order') {
                                        setTimeout(() => {
                                            uni.navigateBack();
                                        }, 1000)
                                    } else {
                                        this.$emit('refresh')
                                    }


                                } else {
                                    uni.showToast({
                                        title: message,
                                        duration: 1000,
                                        icon: 'none'
                                    });
                                }
                            });
                        } else if (res.cancel) {
                            this.fastTap = true;
                        }
                    }
                });
            },
            // 查看物流
            onCkwlClick () {
                if (!this.fastTap) return false;
                this.fastTap = false;
                let data = {
                    module: 'app',
                    action: 'order',
                    app: 'logistics',
                    id: this.sNo,
                    o_source: 1,
                    type: ''
                };

                if (this.source == 1) {
                    data.type = 'pond';
                }

                this.$req.post({ data }).then(res => {
                    this.fastTap = true;
                    if (res.code == 200) {
                        let data = res.data;
                        if (data.list.length > 1) {
                            uni.navigateTo({
                                url: '/pagesB/expressage/expressage?sNo=' + this.sNo
                            });
                        } else {
                            uni.navigateTo({
                                url: '/pages/expressage/expressage?list=' + JSON.stringify(data.list[0]) + '&sNo=' + this.sNo
                            });
                        }
                    } else {
                        uni.showToast({
                            title: res.message,
                            duration: 1500,
                            icon: 'none'
                        });
                    }
                })
            },
            // 查看提取码
            onCktqmClick () {
                if (!this.fastTap) return false;
                this.fastTap = false;
                let data = {
                    module: 'app',
                    app: 'see_extraction_code',
                    action: 'order',
                    order_id: this.orde_id,

                };
                this.$req.post({data}).then(res => {
                    this.fastTap = true;
                    uni.$emit('receiving_check_show')
                    
                    let { code, data, message } = res;

                    if (code == 200) {
                        uni.$emit('receiving_check_emit', data)
                    } else {
                        uni.showToast({
                            title: message,
                            duration: 1500,
                            icon: 'none'
                        });
                    }
                }).catch(error=>{
                    this.fastTap = true;
                });
            },
            // 立即付款
            async onLjfkClick () {
                if (!this.fastTap) return false;
                this.fastTap = false;

                try {
                    this._check_order_status()
                } catch (e) {
                    uni.showToast({
                        title: e,
                        icon: 'none'
                    })
                    this.fastTap = true;

                    this.$emit('refresh')
                    return false

                }

                this.SET_ORDER_ID(this.orde_id)
                this.SET_ADDRESS_ID('')
                let path = '/pages/order/order_payment?order_id=' + this.orde_id + '&showPay=true&ordertype='+ this.otype + '&type=XQ';

                // #ifdef H5
                path += '&_store=h5';
                // #endif
                this.fastTap = true;
                this.navTo(path)
            },
            // 提醒发货
            onTxfhClick () {
                if (!this.fastTap) return false;
                if (this.delivery_status == 1) return false;
                this.fastTap = false;
                let data = {
                    module: 'app',
                    order_id: this.orde_id,
                    app: 'delivery_delivery',
                    action: 'order'
                };

                this.$req.post({ data }).then(res => {
                    if (res.code == 200) {
                        uni.showToast({
                            title: this.language.order.myorder.deliver_goods2,
                            duration: 1000,
                            icon: 'none'
                        });
                        this.$emit('refresh')
                    } else {
                        uni.showToast({
                            title: res.message,
                            duration: 1500,
                            icon: 'none'
                        });
                    }
                    this.fastTap = true;
                });
            }
        }
    }
</script>

<style scoped lang="less">
    .last_right div{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 142rpx;
        height: 50rpx;
        font-size: 24rpx;
        color: @btnBackground;
        border: 1px solid @btnBackground;
        border-radius: 8rpx;
        box-sizing: border-box;


        &:last-child {
            border: none;
            background-color: @btnBackground;
            color: @lightColor;
            margin-left: 20rpx;

            &.a1 {
                background-color: #a9a9a9 !important;
            }
        }

        &.last_right_leftBtn {
            border: 1px solid #999999;
            background-color: transparent;
            border: 1px solid @btnBackground;
            color: @btnBackground;
			margin-left: 24rpx;
        }
    }
</style>
