<!-- 佣金提现的form表单 -->
<template>
    <div class='box'>
        <div class="yh-title">
            <heads :title='language.distribution_form.title'></heads>
        </div>

        <ul class="message" :style="{ top:halfWidth }">

            <li style="border: none;height: 300rpx;align-items: baseline;">
                <view style="margin-top: 49rpx;width: 100%;">
                    <text style="color: #020202;font-size: 28rpx;">{{language.distribution_form.withdrawalAmount}}</text>

                    <view class="" style="display: flex;margin-top: 49rpx;height: 35rpx;align-items: center;">
                        <text style="font-size: 48rpx;color: #020202;">¥</text>
                        <input placeholder-style="color: #b8b8b8;" type="number" :placeholder="pshd" v-model="put_mon" @blur="_money" id="put_mon" placeholder-class="put_mons" />
                        <text @tap="_put()" style="text-align: end;margin-left: 30rpx;">{{language.distribution_form.allWithdrawal}}</text>
                    </view>

                    <view
                        style="height: 70rpx;margin-top: 60rpx;align-items: center;border-top: 2rpx solid #E6E6E6;border-top: 1px solid rgb(230, 230, 230);display: flex;color: #999999;font-size: 22rpx;"
                    >
                        <image :src="warnIng" style="width: 24rpx;height: 24rpx;margin-right: 9rpx;"></image>
                        {{language.distribution_form.minimum}}¥{{min_amount}}{{language.distribution_form.maximum}}¥{{max_amount}}{{language.distribution_form.withdrawalFee}}{{cash_charge}}%
                    </view>
                </view>
            </li>

<!--            <li>-->
<!--                <view class="li_title">{{language.distribution_form.cardInformation}}</view>-->
<!--            </li>-->
            
            <li class="gap"></li>
            
            <li class="add-bank-li" @click="navTo('/pagesB/myWallet/bankCardAdd')" v-if="!bank_information.length">
                <span class="left_text">{{ language.distribution_form.bankcard }}</span>
                <span class="placeholder">
                    {{ language.distribution_form.qcybr }}
                </span>
                <img :src="jiantou" alt="" />
            </li>
            <li class="add-bank-li" @click="chooseClassFlagChange" v-if="bank_information.length">
                <span class="left_text">{{ language.distribution_form.bankcard }}</span>
                <span class="placeholder" style="color: #333">
<!--                    建设银行  尾号(3123)-->
                    {{ bankText}}
                </span>
                <img :src="jiantou" alt="" />
            </li>

            <li v-if="bank_information.length" style="height: 90rpx">
                <span class="left_text">{{language.distribution_form.tel}}&nbsp;&nbsp;</span>
                <input type="number" :placeholder="language.distribution_form.telPlaceholder" v-model="phone" disabled="true" readonly="readonly" style="color: #999"/>
            </li>
            
            <li v-if="bank_information.length" class="flex yh-flex" style='height: 90rpx'>
                <span class="left_text">{{language.distribution_form.telcode}}&nbsp;&nbsp;</span>
                <input placeholder-style="color: #b8b8b8;" class='input' :class='{marginleft:display}' type="number"
                       :placeholder="language.distribution_form.telcodePlaceholder"
                       v-model="input_code">
                <span class='color yh-color' v-if='display' @tap="_verif">{{language.distribution_form.getcode}}</span>
                <span class='active yh-active' v-if='!display'>
                    <template v-if="languageType == ''">
                        {{count}}s {{language.distribution_form.countdown}}
                    </template>
					<template v-else>
					    {{language.distribution_form.countdown}} {{count}}s
					</template>
				</span>
            </li>

        </ul>

        <div v-if="chooseClassFlag" ref="proClassPicker" class="mask" style="z-index: 999;" @touchmove.stop.prevent>
            <div>
                <p class="mask_title">
                    {{language.distribution_form.xzdz}}
                    <img class="closeImg" :src="closeImg" @tap="_closeClass" />
                </p>
<!--                <scroll-view scroll-x class="chooseValueBox">-->
<!--                    <div class="flex">-->
<!--                        <p class="chooseValue" v-for="(item, index) in chooseClass" :key="index">-->
<!--                            <image v-if="index != 0" class="fenge" :src="jiantou" mode=""></image>-->
<!--                            <text class="span" @tap="del_Class(item, index)">{{ item.pname }}</text>-->
<!--                        </p>-->
<!--                    </div>-->
<!--                </scroll-view>-->
                <scroll-view scroll-y class="chooseBox">
                    <ul>
                        <li :class="{ active1: active1 == index }" v-for="(item, index) in arrClass" :key="index" :value="item.id" @tap="_chooseClass(item, index)" style="display: flex;">
                            {{ item.Bank_card_number }}
                            <img class="img" v-if="active1 == index" :src="chooseImg" />
                        </li>
                    </ul>
                </scroll-view>
                <div class="new" @click="navTo('/pagesB/myWallet/bankCardAdd')">{{ language.distribution_form.syxk }}</div>
                <view class="chooseBtn" @tap="_chooseBtn">{{language.delModel.confirm}}</view>
            </div>
        </div>
        
        <div class='setup-buttom' @tap="_sumber" :style='{top:halfWidth1}'>{{language.distribution_form.complete}}</div>

    </div>
</template>

<script>
    import {
        telephone
    } from '../../common/landing.js'
    import {
        mapMutations
    } from 'vuex'
    import {
        lkt_money,
        lkt_bank,
        lkt_bank_p,
        lkt_getcode,
        lkt_time,
        lkt_submit
    } from '../../static/js/distribution/distribution_center.js'
    import {LaiKeTui_chooseImg} from "@/static/js/myStore/uploadPro";

    export default {
        data () {
            return {
                type: '',
                title: '佣金提现',
                put_mon: '', 								// 提现金额
                bank_number: '',
                bank_name: '',
                user_name: '',
                branch: '', 								// 支行
                phone: '',
                input_code: '',
                chooseClassFlag: false,
                chooseClass: [], 
                display: true,
                count: '',
                timer: '',
                chooseImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/chooseMeh.png',
                code: '',
                one_code: '', 							// 手机号码格式正确返回值
                max_amount: '', 						// 提现的最大金额
                min_amount: '', 						// 提现的最小金额
                bank_information: [], 			// 用户银行卡历史信息
                mobile: '',
                oldPhone: '',
                closeImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/close2x.png',
                allComplete: false,
                fastTap: true,
                shop_id: '',
                cash_charge: 0, 						// 手续费
                warnIng: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/warnIng.png',
                jiantou: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jiantou2x.png',
                pshd: '',
                text: '',
                active1: 0,
                arrClass: [], //现在分类的数据 {id:'',name:'美妆护肤'}
                total: 0,  //可提现金额
            }
        },
        onLoad (option) {
            this.total = option.total?option.total:0
            this.type = option.type
            this.phone = uni.getStorageSync('user_phone')
        },
        onShow(){
            this.pshd = this.language.distribution_form.withdrawal_placeholder + this.total + this.language.distribution_form.yuan;
            this.shop_id = uni.getStorageSync('shop_id') ? uni.getStorageSync('shop_id') : this.$store.state.shop_id
            if (this.access_id) {
                this.chooseClassFlag = false
                this._axios()
            }
        },
        computed: {
            halfWidth1: function () {
                var gru = uni.getStorageSync('data_height') ? uni.getStorageSync('data_height') : this.$store.state.data_height
                var heigh = parseInt(gru)
                var he = heigh * 2

                // #ifdef APP-PLUS
                he = 70 + heigh * 2
                // #endif

                // #ifndef APP-PLUS
                he = 70
                // #endif

                return uni.upx2px(he) + 'px'
            },
        },
        methods: {
            _chooseBtn () {
                this.chooseClassFlag = false
                this.bankText = this.arrClass[this.active1].Bank_card_number
            },
            //选中类名
            _chooseClass(item, index) {
                this.active1 = index
                
                
            },
            // 删除类名
            del_Class(item, index) {
                if(item.pname == "请选择" && !item.cid){
                    return
                }

                this.chooseClass = this.chooseClass.splice(0, index);

                if (this.chooseClass.length == 0) {
                    this.proClassId = 0;
                } else {
                    this.proClassId = this.chooseClass[this.chooseClass.length - 1].cid;
                }

                if(typeof this.proBrand == 'string'){
                    this.proBrand = ''
                }else{
                    this.proBrand.brand_name = ''
                }
                this.proBrandId = ''

                this.showProClass();
            },
            // 选择图片
            _chooseImg(num) {
                LaiKeTui_chooseImg(this, num);
            },
            // 关闭类名选择
            _closeClass() {
                this.chooseClassFlag = false;

                this.chooseClass = this.chooseClass.filter(item=>{
                    return item.pname != "请选择"
                })
            },
            /**
             *
             * */
            _axios () {
                let data = {
                    module: 'app',
                    action: 'commcenter',
                    app: 'into_withdrawals',
                }
                this.$req.post({ data }).then(res => {

                    if (res.code == 200) {
                        let {
                            data: {
                                bank_information,
                                max_amount,
                                min_amount,
                                mobile,
                                cash_charge
                            }
                        } = res

                        this.max_amount = max_amount
                        this.min_amount = min_amount
                        this.cash_charge = cash_charge * 100
                        this.bank_information = bank_information
                        this.arrClass = bank_information;
                        if (this.arrClass.length) {
                            this.bankText = this.arrClass[0].Bank_card_number
                        }
                        // this.arrClass = bank_information.map(item => {
                        //     item.status = false
                        //     return item;
                        // })
                        //
                        // if (this.arrClass.length) {
                        //     this.arrClass[0].status = true
                        // }

                        console.log(this.arrClass);


                        this.mobile = mobile
                        // this.bank_number = this.bank_information.Bank_card_number ? this.bank_information.Bank_card_number : ''
                        // this.bank_name = this.bank_information.Bank_name ? this.bank_information.Bank_name : ''
                        // this.branch = this.bank_information.branch ? this.bank_information.branch : ''
                        // this.user_name = this.bank_information.Cardholder ? this.bank_information.Cardholder : ''
                        this.phone = this.mobile ? this.mobile : ''
                        if(this.phone == ''){
                            uni.showModal({
                                title: this.language.showModal.hint1,
                                content: this.language.showModal.noTel,
								confirmText: this.language.showModal.confirm,
								cancelText: this.language.showModal.cancel,
                                showCancel: false,
                                success: function (res) {
                                    if (res.confirm) {
                                        uni.navigateTo({
                                            url: '../../pagesB/setUp/changePhone?withdrawalNoPhone=true'
                                        })
                                    } 
                                }
                            })
                        }

                    } else {

                        uni.showToast({
                            title: res.message,
                            duration: 1500,
                            icon: 'none'
                        })

                    }
                })
            },
            /**
             * 全部提现
             * */
            _put () {
                var mon = Number(this.max_amount)
                var monr = Number(this.put_mon)
                var monrys = Number(this.min_amount)
                if (mon < monrys) {
                    uni.showToast({
                        title: this.language.distribution_form.withdrawalTips,
                        duration: 1000,
                        icon: 'none'
                    })
                } else {
                    this.put_mon = mon.toFixed(2)
                }
            },
            /**
             * 金额格式判断
             * */
            _money () {
                lkt_money(this)
            },
            /**
             * 银行卡匹配
             * */
            _bank () {
                lkt_bank(this)
            },
            /**
             *
             * */
            _bank_p () {
                lkt_bank_p(this)
            },
            /**
             * 持卡人验证
             * */
            _usname () {
                var name = /^[\u4e00-\u9fa5]{2,8}$/
                if (!name.test(this.user_name)) {
                    this.user_name = ''
                    uni.showToast({
                        title: this.language.distribution_form.nameTips,
                        duration: 1000,
                        icon: 'none'
                    })
                }
            },
            /**
             * 验证码发送1分钟倒计时
             * */
            _verif () {
                lkt_getcode(this)
            },
            /**
             * 1分钟倒计时
             * */
            _time () {
                lkt_time(this)
            },
            /**
             * 手机号码正则验证
             * */
            _telephone (value) {
                this.one_code = telephone(value)
            },
            chooseClassFlagChange() {
                this.chooseClassFlag = true;  
            },
            /**
             * 提交
             * */
            _sumber () {
                if (!this.fastTap) {
                    return
                }
                
                this.fastTap = false
                console.log(this.put_mon, this.bank_number, this.user_name, this.one_code == 1, this.input_code.length == 6, this.bank_name)
                if (this.put_mon) {
                    var data = {
                        module: 'app',
                        action: 'commcenter',
                        app: 'withdrawals',
                        amoney: this.put_mon,//提现金额
                        mobile: this.phone,//手机号码
                        code: this.input_code,//验证码
                        bank_id: this.arrClass[this.active1].id
                    }
                    this.$req.post({data}).then(res => {
                        let {
                            data: {
                                withdraw_id
                            },
                            code,
                            message
                        } = res;
                        
                        if (code == 200) {
                            uni.showToast({
                                title: this.language.toasts.distribution_center.lkt_submit[0],
                                duration: 1000,
                                icon: 'none'
                            })
                            setTimeout(() => {
                                this.fastTap = true
                                uni.navigateTo({
                                    url: './distribution_result?txId=' + withdraw_id
                                })
                            } , 1000)

                        } else {
                            uni.showToast({
                                title: res.message,
                                duration: 1000,
                                icon: 'none'
                            })
                            this.fastTap = true
                            
                        }
                    }).catch(()=>{
                        this.fastTap = true
                        uni.showToast({
                            title: '一天只允许提现一次',
                            duration: 1000,
                            icon: 'none'
                        })
                    })
                } else if (this.one_code != 1) {
                    uni.showToast({
                        title: this.language.toasts.distribution_center.lkt_submit[1],
                        duration: 1000,
                        icon: 'none'
                    })
                    this.fastTap = true
                } else {
                    setTimeout(() => {
                        uni.showToast({
                            title: this.language.toasts.distribution_center.lkt_submit[3],
                            duration: 1000,
                            icon: 'none'
                        })
                        this.fastTap = true
                    }, 1500)
                }
                // lkt_submit(this)
            }
        }
    }
</script>

<style scoped lang="less">
    @import url("../../static/css/distribution/distribution_form.less");
</style>
