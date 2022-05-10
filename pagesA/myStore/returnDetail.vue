<template>
    <div class="container">
        <heads :title="title"></heads>
        
        <view class="container_top">
            <image :src="goods_list.img" mode=""></image>
            
            <view class="container_top_center">
                <view>{{goods_list.p_name}}</view>
                <text>{{goods_list.size}}</text>
            </view>
            
            <view class="container_top_right" v-if="goods_list.p_price">
                <view>￥{{ goods_list.p_price.toFixed(2) }}</view>
                <text>x{{ goods_list.num }}</text>
            </view>
        </view>
        
        <view style="height: 20rpx;background-color: #F6F6F6;"></view>
        
        <view class="content">
            <!-- 退货信息 -->
            <view class="content_title">{{language.returnDetail.returnInfo}}</view>
            <view class="content_item">
                <view class="content_item_left">
                    <!-- 订单号： -->
                    {{language.returnDetail.orderNumber}}
                </view>
                <view class="content_item_right">
                    {{return_info.r_sNo}}
                </view>
            </view>
            <view class="content_item">
                <view class="content_item_left">
                    <!-- 申请时间： -->
                    {{language.returnDetail.appliTime}}
                </view>
                <view class="content_item_right">
                    {{return_info.re_time}}
                </view>
            </view>
            <view class="content_item">
                <view class="content_item_left">
                    <!-- 退货类型： -->
                    {{language.returnDetail.returnType}}
                </view>
                <view class="content_item_right">
                    {{return_info.re_type == 1?language.returnDetail.returnList[0]:return_info.re_type == 2?language.returnDetail.returnList[1]:return_info.re_type == 3?language.returnDetail.returnList[2]:''}}
                </view>
            </view>
            <view class="content_item" v-if="return_info.re_type != 3">
                <view class="content_item_left">
                    <!-- 退款金额： -->
                    {{language.returnDetail.refund}}
                </view>
                <view class="content_item_right" v-if="return_info.re_apply_money">
                    ￥{{return_info.re_apply_money.toFixed(2)}}
                </view>
            </view>
            <view class="content_item">
                <view class="content_item_left">
                    <!-- 申请原因： -->
                    {{language.returnDetail.reasons}}
                </view>
                <view class="content_item_right">
                    {{return_info.content}}
                </view>
            </view>
            <view class="content_item" style="align-items: flex-start;">
                <view class="content_item_left">
                    <!-- 上传凭证： -->
                    {{language.returnDetail.credentials}}
                </view>
                <view class="content_item_right">
                    <image v-for="item,index of return_info.re_photo" :key="index" :src="item" @tap="seeImg(item)"></image>
                </view>
            </view>
        </view>
        
        <view v-if="return_info.type != 0" style="height: 20rpx;background-color: #F6F6F6;"></view>
        
        <view class="content" v-if="return_info.type != 0">
            <view class="content_title">
                <!-- 审核记录 -->
                {{language.returnDetail.records}}
            </view>
            <view class="content_item">
                <view class="content_item_left">
                    <!-- 审核结果： -->
                    {{language.returnDetail.auditResult}}
                </view>
                <view class="content_item_right">
                    {{return_info.auditType}}
                </view>
            </view>
            <view class="content_item" v-if="return_info.audit_time">
                <view class="content_item_left">
                    <!-- 审核时间： -->
                    {{language.returnDetail.reviewTime}}
                </view>
                <view class="content_item_right">
                    {{return_info.audit_time}}
                </view>
            </view>
            <view class="content_item" v-if="return_info.r_content">
                <view class="content_item_left">
                    <!-- 拒绝原因： -->
                    {{language.returnDetail.refusalReasons}}
                </view>
                <view class="content_item_right">
                    {{return_info.r_content}}
                </view>
            </view>
            <view class="content_item" v-if="return_info.re_type != 3 && (return_info.type == 4 || return_info.type == 9)">
                <view class="content_item_left">
                    <!-- 退款金额： -->
                    {{language.returnDetail.refundAmount}}
                </view>
                <view class="content_item_right">
                    {{return_info.real_money}}
                </view>
            </view>
            
            <view class="content_item" v-if="send_info.express">
                <view class="content_item_left">
                    <!-- 回寄物流： -->
                    {{language.returnDetail.returnLogistics}}
                </view>
                <view class="content_item_right">
                    {{send_info.express_num}}（{{send_info.express}}）
                </view>
            </view>
            <view class="content_item" v-if="send_info.express">
                <view class="content_item_left">
                    <!-- 回寄时间： -->
                    {{language.returnDetail.returnTime}}
                </view>
                <view class="content_item_right">
                    {{send_info.add_data}}
                </view>
            </view>
            
            <view class="content_item" v-if="send_info1.express">
                <view class="content_item_left">
                    <!-- 退换物流： -->
                    {{language.returnDetail.returnLogistics1}}
                </view>
                <view class="content_item_right">
                    {{send_info1.express_num}}（{{send_info1.express}}）
                </view>
            </view>
            <view class="content_item" v-if="send_info1.express">
                <view class="content_item_left">
                    <!-- 退换时间： -->
                    {{language.returnDetail.returnTime1}}
                </view>
                <view class="content_item_right">
                    {{send_info1.add_data}}
                </view>
            </view>
            
        </view>
        
        <view class="auditBtn" v-if="isAudit">
            <view>
                <button @tap="auditCancel">{{language.returnDetail.reject}}</button>
                <button @tap="auditOk">{{language.returnDetail.pass}}</button>
            </view>
        </view>
        
        <view class="sendMask" v-if="sendFlag" @touchmove.stop.prevent>
            <view>
                <view class="sendTips">
                    <!-- 确定用户寄回的商品没问题， -->
                    {{language.returnDetail.sendTips[0]}}
                    <br>
                    <!-- 并给用户寄回换货商品？ -->
                    {{language.returnDetail.sendTips[1]}}
                </view>
                
                <view class="sendBtn">
                    <button @tap="sendCancel">{{language.returnDetail.cancel}}</button>
                    <button @tap="sendOk">{{language.returnDetail.toSend}}</button>
                </view>
            </view>
        </view>
        
        <view class="sendMask" v-if="auditFlag" @touchmove.stop.prevent>
            <view>
                <view class="sendTips">
                    <!-- 确定要通过该用户的申请， -->
                    {{language.returnDetail.passTips[0]}}
                    <br>
                    <!-- 并让用户寄回？ -->
                    {{language.returnDetail.passTips[1]}}
                </view>
                
                <view class="sendBtn">
                    <button @tap="auditFail">{{language.returnDetail.cancel}}</button>
                    <button @tap="auditConfirm">{{language.returnDetail.confirm}}</button>
                </view>
            </view>
        </view>
        
        <view class="sendMask" v-if="reasonFlag" @touchmove.stop.prevent>
            <view>
                <view class="reason">
                    <view>
                        <!-- 请填写拒绝理由 -->
                        {{language.returnDetail.jujueTips}}
                    </view>
                    <input v-model="reasonText" type="text" :placeholder="language.returnDetail.jujuePlace">
                </view>
                
                <view class="sendBtn">
                    <button @tap="reasonFail">{{language.returnDetail.cancel}}</button>
                    <button @tap="reasonConfirm">{{language.returnDetail.confirm}}</button>
                </view>
            </view>
        </view>
        
        <view class="sendMask" v-if="moneyFlag" @touchmove.stop.prevent>
            <view style="height: 362rpx;">
                <view class="returnMoney">
                    <view class="returnMoneyTitle">
                        <!-- 请填写退款金额 -->
                        {{language.returnDetail.refuldTitle}}
                    </view>
                    <view class="returnMoneyIpt">
                        ￥
                        <input @input="moneyChange" v-model="moneyText" type="number" :placeholder="language.returnDetail.refuldPlace">
                    </view>
                    <view class="returnMoneyDisc">
                        <image :src="warnIng" mode=""></image>
                        {{language.returnDetail.moneyTips[0]}}￥{{return_info.re_apply_money}}{{language.returnDetail.moneyTips[1]}}
                    </view>
                </view>
                
                <view class="sendBtn">
                    <button @tap="moneyFail">{{language.returnDetail.cancel}}</button>
                    <button @tap="moneyConfirm">{{language.returnDetail.confirm}}</button>
                </view>
            </view>
        </view>
        
    </div>
</template>

<script>
export default {
    data() {
        return {
            title: '退货详情',
            shop_id: '',
            sNo: '',
            order_details_id: '',
            
            goods_list: {},
            return_info: {},
            send_info: {},
            send_info1: {},
            
            sendFlag: false,
            isAudit: '',
            
            auditFlag: false,
            reasonFlag: false,
            reasonText: '',
            warnIng: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/warnIng.png',
            moneyFlag: false,
            moneyText: ''
        };
    },
    onLoad(option) {
        this.shop_id = uni.getStorageSync('shop_id') ? uni.getStorageSync('shop_id') : this.$store.state.shop_id;
        this.order_details_id = option.order_details_id;
        this.sNo = option.sNo;
        this.isAudit = option.type
        this.axios()
    },
    onShow(){
        this.title = this.language.returnDetail.title
        uni.setNavigationBarTitle({
            title: this.language.returnDetail.title
        })
    },
    methods: {
        axios() {
            let data = {
                shop_id: this.shop_id,
                sNo: this.sNo,
                id: this.order_details_id,
                module: 'app',
                action: 'mch',
                m: 'Returndetail'
            };

            this.$req.post({data}).then(res => {
                let { code, data, message } = res;
                if (code == 200) {
                    this.goods_list = data.goods_list
                    
                    this.load = true;
                    
                    if(data.info.type == 0){
                        data.info.auditType = this.language.returnDetail.type_list[0]
                    }else if((data.info.type == 1 || data.info.type == 3) && data.info.re_type == 1){
                        data.info.auditType = this.language.returnDetail.type_list[1]
                    }else if(data.info.type == 4 || data.info.type == 9){
                        data.info.auditType = this.language.returnDetail.type_list[2]
                    }else if((data.info.type == 2 || data.info.type == 5 || data.info.type == 8)&&data.info.re_type != 3){
                        data.info.auditType = this.language.returnDetail.type_list[3]
                    }else if((data.info.type == 1 || data.info.type == 3 || data.info.type == 11)&&data.info.re_type == 3){
                        data.info.auditType = this.language.returnDetail.type_list[4]
                    }else if(data.info.type == 12){
                        data.info.auditType = this.language.returnDetail.type_list[5]
                    }else if((data.info.type == 5 || data.info.type == 10) && data.info.re_type == 3){
                        data.info.auditType = this.language.returnDetail.type_list[6]
                    }
                    
                    data.info.audit_time = data.audit_time
                    
                    this.return_info = data.info
                    
                    this.send_info = data.send_info
                    this.send_info1 = data.return_info
                    
                } else {
                    uni.showToast({
                        title: message,
                        duration: 1500,
                        icon: 'none'
                    });
                    this.load = true;
                }
            });
        },
        seeImg(img){
            uni.previewImage({
                urls: [img]
            })
        },
        reasonFail(){
            this.reasonFlag = false
        },
        moneyFail(){
            this.moneyFlag = false
        },
        moneyChange(e){
            if(Number(this.moneyText)>Number(this.return_info.re_apply_money)){
                setTimeout(()=>{
                    this.moneyText = Number(this.return_info.re_apply_money)
                },0)
            }
        },
        moneyConfirm(){
            if(!this.moneyText){
                uni.showToast({
                    title: this.language.storeMyOrder.refundSum1,
                    icon: 'none'
                })
                return
            }
            
            let data = {
                shop_id: this.shop_id,
                sNo: this.sNo,
                id: this.order_details_id,
                module: 'app',
                action: 'mch',
                m: 'examine',
                price: this.moneyText
            }
            
            if(this.return_info.re_type == 1){
                data.r_type = 4
            }else if(this.return_info.re_type == 2){
                data.r_type = 9
            }
            
            uni.showLoading({
                title: this.language.showLoading.waiting,
                mask: true
            })
            
            this.$req.post({data}).then(res=>{
                uni.hideLoading()
                uni.showToast({
                    title: res.message,
                    icon: 'none'
                })
                this.moneyFlag = false
                if(res.code == 200){
                    setTimeout(()=>{
                        if (getCurrentPages().length > 1) {
                            uni.navigateBack({
                                delta: 1
                            })
                        } else {
                            uni.switchTab({
                                url: '/pagesA/myStore/myOrder'
                            })
                        }
                    },1000)
                }
            })
        },
        reasonConfirm(){
            if(!this.reasonText){
                uni.showToast({
                    title: this.language.returnDetail.refusalReason,
                    icon: 'none'
                })
                return
            }
            
            let data = {
                shop_id: this.shop_id,
                sNo: this.sNo,
                id: this.order_details_id,
                module: 'app',
                action: 'mch',
                m: 'examine',
                text: this.reasonText
            }
            
            if(this.return_info.re_type == 1){
                data.r_type = 2
            }else if(this.return_info.re_type == 2){
                data.r_type = 8
            }else if(this.return_info.re_type == 3){
                data.r_type = 10
            }
            
            uni.showLoading({
                title: this.language.showLoading.waiting,
                mask: true
            })
            
            this.$req.post({data}).then(res=>{
                uni.hideLoading()
                uni.showToast({
                    title: res.message,
                    icon: 'none'
                })
                this.reasonFlag = false
                if(res.code == 200){
                    setTimeout(()=>{
                        if (getCurrentPages().length > 1) {
                            uni.navigateBack({
                                delta: 1
                            })
                        } else {
                            uni.switchTab({
                                url: '/pagesA/myStore/myOrder'
                            })
                        }
                    },1000)
                }
            })
        },
        auditCancel(){
            this.reasonFlag = true
        },
        auditFail(){
            this.auditFlag = false
        },
        auditConfirm(){
            let data = {
                shop_id: this.shop_id,
                sNo: this.sNo,
                id: this.order_details_id,
                module: 'app',
                action: 'mch',
                m: 'examine',
            }
            
            if(this.return_info.re_type == 1){
                data.r_type = 1
            }else if(this.return_info.re_type == 2){
                data.r_type = 9
            }else if(this.return_info.re_type == 3){
                data.r_type = 1
            }
            
            uni.showLoading({
                title: this.language.showLoading.waiting,
                mask: true
            })
            
            this.$req.post({data}).then(res=>{
                uni.hideLoading()
                uni.showToast({
                    title: res.message,
                    icon: 'none'
                })
                this.auditFlag = false
                if(res.code == 200){
                    setTimeout(()=>{
                        if (getCurrentPages().length > 1) {
                            uni.navigateBack({
                                delta: 1
                            })
                        } else {
                            uni.switchTab({
                                url: '/pagesA/myStore/myOrder'
                            })
                        }
                    },1000)
                }
            })
        },
        auditOk(){
            if(this.return_info.type == 3 && this.return_info.re_type == 3){
                this.sendFlag = true
                return
            }
            
            if(this.return_info.type == 0 && this.return_info.re_type == 3){
                this.auditFlag = true
                return
            }
            
            if((this.return_info.type == 0 && this.return_info.re_type == 2) || (this.return_info.type == 3 && this.return_info.re_type == 1)){
                this.moneyFlag = true
                this.moneyText = Number(this.return_info.re_apply_money)
                return
            }
            
            let data = {
                shop_id: this.shop_id,
                sNo: this.sNo,
                id: this.order_details_id,
                module: 'app',
                action: 'mch',
                m: 'examine',
            }
            
            if(this.return_info.re_type == 1){
                data.r_type = 1
            }else if(this.return_info.re_type == 2){
                data.r_type = 9
            }else if(this.return_info.re_type == 3){
                data.r_type = 1
            }
            uni.showLoading({
                title: this.language.showLoading.waiting,
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
                        if (getCurrentPages().length > 1) {
                            uni.navigateBack({
                                delta: 1
                            })
                        } else {
                            uni.switchTab({
                                url: '/pagesA/myStore/myOrder'
                            })
                        }
                    },1000)
                }
            })
            
        },
        sendCancel(){
            this.sendFlag = false
        },
        sendOk(){
            this.sendFlag = false
            uni.redirectTo({
                url: '/pagesA/myStore/shipments?type=1&id=' + this.sNo + '&order_details_id=' + this.order_details_id
            })
            
        }
    }
};
</script>

<style lang="less">
@import url('../../static/css/myStore/returnDetail.less');
</style>
