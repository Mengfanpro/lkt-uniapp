<template>
    <div class="container">
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <heads :title="language.storeSetup.title"></heads>
        
        <div class="content">
            <div class="content_row">
                <div class="content_row_left">{{language.storeSetup.setUp}}</div>
                
                <div class="content_row_right">
                    <image class="head_img" :src="storeImg" @tap="_changeImg()" mode="aspectFill"></image>
                    <div class="jiantouDiv" @tap="_changeImg()">
                        <img :src="jiantou" alt="" />
                    </div>
                </div>
            </div>
            
            <div class="content_row">
                <div class="content_row_left">{{language.storeSetup.shopName}}</div>
                
                <div class="content_row_right"  @tap="showEditor(4)">
                    {{storeName}}
                    <div class="jiantouDiv">
                        <img :src="jiantou" alt="" />
                    </div>
                </div>
                <!-- <div class="content_row_right">
                    {{storeName}}
                </div> -->
            </div>
            
            <div class="content_row">
                <div class="content_row_left">{{language.storeSetup.storeTitle}}</div>
                
                <div class="content_row_right" @tap="showEditor(1)">
                    <p>{{ storeTitle }}</p>
                    <div class="jiantouDiv">
                        <img :src="jiantou" alt="" />
                    </div>
                </div>
            </div>
            
            <div class="content_row">
                <div class="content_row_left">{{language.storeSetup.storeRange}}</div>
                
                <div class="content_row_right" @tap="showEditor(2)">
                    <p>{{ storeRange }}</p>
                    <div class="jiantouDiv">
                        <img :src="jiantou" alt="" />
                    </div>
                </div>
            </div>
            
            <div class="content_row" style="border-bottom: 0;">
                <div class="content_row_left">{{language.storeSetup.status}}</div>
                
                <div class="content_row_right">
                    <picker :value="businessIndex" @change="bindPickerChange" :range="language.storeSetup.businessArr">
                        <view style="color: #999999;">{{language.storeSetup.businessArr[businessIndex]}}</view>
                    </picker>
                    <div class="jiantouDiv">
                        <img :src="jiantou" alt="" />
                    </div>
                </div>
            </div>
            
            <!-- <div class="content_row" style="border-bottom: 0;">
                <div class="content_row_left">门店营业时间</div>
                
                <div class="content_row_right" @tap="openDatetimePicker">
                    <p v-if="!time_all">请选择营业时间</p>
                    <p v-else>{{time_all}}</p>
                    <div class="jiantouDiv">
                        <img :src="jiantou" alt="" />
                    </div>
                </div>
            </div> -->
            
            <div style="height: 20rpx;background-color: #F6F6F6;"></div>
            
            <div class="content_row">
                <div class="content_row_left">{{language.storeSetup.userName}}</div>
                
                <div class="content_row_right">
                    {{userName}}
                </div>
            </div>
            
            <div class="content_row">
                <div class="content_row_left">{{language.storeSetup.userID}}</div>
                
                <div class="content_row_right">
                    {{userID}}
                </div>
            </div>
            
            <div class="content_row">
                <div class="content_row_left">{{language.storeSetup.userPhone}}</div>
                
                <div class="content_row_right" @tap="showEditor(3)">
                    <p>{{userPhone}}</p>
                    <div class="jiantouDiv">
                        <img :src="jiantou" alt="" />
                    </div>
                </div>
            </div>
            
            <div class="content_row">
                <div class="content_row_left">{{language.storeSetup.userAdd}}</div>
                
                <div class="content_row_right" @tap="modifyAddress">
                    <div style="text-align: right;">
                        <p style="color: #999999;">{{userAdd}}</p>
                        <span style="color: #999999;">{{address}}</span>
                    </div>
                    <div class="jiantouDiv">
                        <img :src="jiantou" alt="" />
                    </div>
                </div>
            </div>
            
        </div>
        
        <div class="bottomBtn">
            <div @tap="cancellation(1)">{{language.storeSetup.cancellation}}</div>
        </div>
        
        <div class="mask" v-if="mask_display1">
            <div class="mask_cont">
                <p>{{language.storeSetup.Tips[0]}}</p>
                <div style="position: relative;">
                    <textarea v-model="new_title" maxlength="50" :placeholder="language.storeSetup.Tips[1]" />
                    
                    <span class="textLeng">{{new_title.length}}</span>
                </div>
                <div class="mask_button">
                    <div class="mask_button_left" @tap="_cancel(1)">{{language.storeSetup.cancel}}</div>
                    <div @tap="_confirm(1)">{{language.storeSetup.confirm}}</div>
                </div>
            </div>
        </div>
        
        <div class="mask" v-if="mask_display2">
            <div class="mask_cont">
                <p>{{language.storeSetup.Tips[2]}}</p>
                <div style="position: relative;">
                    <textarea v-model="new_range" maxlength="50" :placeholder="language.storeSetup.Tips[3]" />
                    
                    <span class="textLeng">{{new_range.length}}</span>
                </div>
                <div class="mask_button">
                    <div class="mask_button_left" @tap="_cancel(2)">{{language.storeSetup.cancel}}</div>
                    <div @tap="_confirm(2)">{{language.storeSetup.confirm}}</div>
                </div>
            </div>
        </div>
        
        
        <div class="mask" v-if="mask_display3">
            <div class="mask_cont">
                <p>{{language.storeSetup.Tips[4]}}</p>
                <input type="text" v-model="new_phone" />
                <div class="mask_button">
                    <div class="mask_button_left" @tap="_cancel(3)">{{language.storeSetup.cancel}}</div>
                    <div @tap="_confirm(3)">{{language.storeSetup.confirm}}</div>
                </div>
            </div>
        </div>
        
        <div class="mask" v-if="mask_display4">
            <div class="mask_cont">
                <p>{{language.storeSetup.Tips[15]}}</p>
                <input type="text" v-model="new_phone" />
                <div class="mask_button">
                    <div class="mask_button_left" @tap="_cancel(4)">{{language.storeSetup.cancel}}</div>
                    <div @tap="_confirm(4)">{{language.storeSetup.confirm}}</div>
                </div>
            </div>
        </div>
        
        
        <div class="mask" v-if="cancellationFlag">
            <div class="cancellationContent">
                <div class="cancellationContent_text" v-if="languageType == '' && cashable_money != '0.00'" style="padding: 0 40rpx;text-align: left;">
                    {{language.storeSetup.Tips[12]}},
                    {{language.storeSetup.Tips[13]}},
                    {{language.storeSetup.Tips[14]}}？
                </div>
                <div class="cancellationContent_text" v-if="languageType == '' && cashable_money == '0.00'">
                    {{language.storeSetup.Tips[5]}}<br>
                    {{language.storeSetup.Tips[6]}}，<br>
                    {{language.storeSetup.Tips[7]}}？
                </div>
                <div class="cancellationContent_text" v-if="languageType == 'en' && cashable_money != '0.00'" style="padding: 0 40rpx;text-align: left;">
                    {{language.storeSetup.Tips[12]}},
                    {{language.storeSetup.Tips[13]}},
                    {{language.storeSetup.Tips[14]}}？
                </div>
                <div class="cancellationContent_text" v-if="languageType == 'en' && cashable_money == '0.00'">
                    {{language.storeSetup.Tips[5]}}<br>
                    {{language.storeSetup.Tips[6]}}，<br>
                    {{language.storeSetup.Tips[7]}}？
                </div>
                <!-- <div class="cancellationContent_text" v-if="languageType == 'en'" style="padding: 0 40rpx;text-align: left;">
                    {{language.storeSetup.Tips[5]}}
                    {{language.storeSetup.Tips[6]}},
                    {{language.storeSetup.Tips[7]}}?
                </div>
                <div class="cancellationContent_text" v-else>
                    {{language.storeSetup.Tips[5]}}<br>
                    {{language.storeSetup.Tips[6]}}，<br>
                    {{language.storeSetup.Tips[7]}}？
                </div> -->
                
                <div class="cancellationContent_btn">
                    <div @tap="cancellationFlag = false">{{language.storeSetup.cancel}}</div>
                    <div @tap="cancellation">{{language.storeSetup.confirm}}</div>
                </div>
            </div>
        </div>
        
        <!-- 时间选择 -->
        <time-picker ref="timePicker" :themeColor="themeColor" :urseTime="time_ys" @onConfirm="onConfirm1"></time-picker>
    </div>
</template>

<script>
import timePicker from '../../components/time-picker.vue';
    
export default {
    data() {
        return {
            title: '店铺设置',
            storeImg: '',
            storeName: '',
            storeTitle: '',
            storeRange: '',
            userName: '',
            userID: '',
            userPhone: '',
            userAdd: '',
            new_title: '',
            new_range: '',
            new_phone: '',
            
            shop_id: '',
            jiantou: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jiantou2x.png',
            textImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/yhqBg.png',
            mask_display1: false,
            mask_display2: false,
            mask_display3: false,
            mask_display4: false,
            
            businessIndex: 1,
            address: '',
            cancellationFlag: false,
            platform1: 'android', //平台
            themeColor: '#007AFF',
            time_all: '', //时间段
            time_ys: '', // 原始时间
            cashable_money:'' // 可提现金额
        };
    },
    components: { timePicker },
    onShow(){
        this.platform1 = uni.getSystemInfoSync().platform;
        
        this.isLogin(()=>{
        	this.shop_id = uni.getStorageSync('shop_id') ? uni.getStorageSync('shop_id') : this.$store.state.shop_id;
        	this._axios();
        })
    },
    methods: {
        // 点击营业时间
        openDatetimePicker() {
            this.$refs.timePicker.show(this.time_ys);
        },
        // 营业时间-确定
        onConfirm1(e) {
            var start = e[0].replace(/undefined/g, '00');
            var end = e[1].replace(/undefined/g, '00');
            this.time_all = start + '~' + end;
            this.time_ys = this.time_all;
        },
        /* 
            店铺注销
        */
        cancellation(type){
            if(type == 1){
                this.cancellationFlag = true
                return
            }
            
            let data = {
                module: 'app',
                action: 'mch',
                m: 'cancellation_shop',
                shop_id: this.shop_id
            }
            
            this.$req.post({data}).then(res=>{
                this.cancellationFlag = false
                
                if (res.code == 200) {
                    uni.showToast({
                        title: this.language.storeSetup.Tips[8],
                        duration: 1500,
                        icon: 'none'
                    });
                    setTimeout(() => {
                        wx.switchTab({
                            url: '/pages/tabBar/my'
                        })
                    }, 1500);
                } else {
                    uni.showToast({
                        title: res.message,
                        duration: 1500,
                        icon: 'none'
                    });
                }
            })
        },
        modifyAddress(){
            uni.navigateTo({
                url: '/pagesA/myStore/modifyAdress?shop_id='+this.shop_id + '&userAdd='+this.userAdd+'&address='+this.address
            })
        },
        bindPickerChange(e){
            console.log('===')
            this.businessIndex = e.detail.value
            if(this.businessIndex == 0){
                var is_open = 2;
            }else{
                var is_open = 1;
            }
            console.log(this.businessIndex)
            this.$req.post({
                data: {
                    module: 'app',
                    action: 'mch',
                    m: 'set_shop',
                    shop_id: this.shop_id,
                    is_open: is_open
                }
            })
            .then(res => {
                if (res.code == 200) {
                    uni.showToast({
                        title: this.language.storeSetup.Tips[8],
                        duration: 1500,
                        icon: 'none'
                    });
                    setTimeout(() => {
                        this._axios();
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
        changeLoginStatus() {
            this._axios();
        },
        plusXing(str, frontLen, endLen) {
            var len = str.length - frontLen - endLen;
            var xing = '';
            for (var i = 0; i < len; i++) {
                xing += '*';
            }
            return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
        },
        _changeImg() {
            var me = this;
            uni.chooseImage({
                count: 1,
                success: function(res) {
                
                    uni.uploadFile({
                        url: uni.getStorageSync('url'),
                        filePath: res.tempFilePaths[0],
                        name: 'file',
                        formData: {
                            access_id: me.access_id,
                            shop_id: me.shop_id,
                            module: 'app',
                            m: 'set_shop',
                            action: 'mch'
                        },
                        success: function(uploadFileRes) {
                            var data = uploadFileRes.data;
                            var json = {}
                            // #ifndef H5
                            if (me.platform1 == 'android') {
                                let str = data.replace('\r\n/g', '').replace(/\n/g, '').replace(/\r/g, '').replace(
                                    /\\/g, '')
                                var retData = str.split(',')
                                json.code = retData[0].split(':')[1]
                            } else {
                                json = JSON.parse(data)
                            }
                            // #endif
                            
                            // #ifdef H5
                            json = JSON.parse(data)
                            // #endif
                            
                            if (json.code == 200) {
                                uni.showToast({
                                    title: me.language.storeSetup.Tips[8],
                                    icon: 'none'
                                });
                                setTimeout(function() {
                                    me._axios();
                                }, 1000);
                            } else {
                                uni.showToast({
                                    title: me.language.storeSetup.Tips[9],
                                    duration: 1500,
                                    icon: 'none'
                                });
                            }
                        }
                    });
                }
            });
        },
        showEditor(type) {
            if (type == 1) {
                this.new_title = this.storeTitle
                this.mask_display1 = true;
            } else if (type == 2) {
                this.new_range = this.storeRange
                this.mask_display2 = true;
            } else if (type == 3) {
                this.mask_display3 = true;
            } else if (type == 4) {
                this.mask_display4 = true;
            }
        },
        _confirm(type) {
            if (type == 1) {
                this.mask_display1 = false;
                if (this.new_title) {
                    this.$req
                        .post({
                            data: {
                                module: 'app',
                                action: 'mch',
                                m: 'set_shop',
                                
                                shop_id: this.shop_id,
                                shop_information: this.new_title
                            }
                        })
                        .then(res => {
                            if (res.code == 200) {
                                uni.showToast({
                                    title: this.language.storeSetup.Tips[8],
                                    duration: 1500,
                                    icon: 'none'
                                });
                                setTimeout(() => {
                                    this._axios();
                                }, 1500);
                            } else {
                                uni.showToast({
                                    title: res.message,
                                    duration: 1500,
                                    icon: 'none'
                                });
                            }
                        });
                } else {
                    uni.showToast({
                        title: this.language.storeSetup.Tips[10],
                        duration: 1500,
                        icon: 'none'
                    });
                }
            } else if (type == 2) {
                this.mask_display2 = false;
                if (this.new_range) {
                    this.$req
                        .post({
                            data: {
                                module: 'app',
                                action: 'mch',
                                m: 'set_shop',
                                
                                shop_id: this.shop_id,
                                shop_range: this.new_range
                            }
                        })
                        .then(res => {
                            if (res.code == 200) {
                                uni.showToast({
                                    title: this.language.storeSetup.Tips[8],
                                    duration: 1500,
                                    icon: 'none'
                                });
                                setTimeout(() => {
                                    this._axios();
                                }, 1500);
                            } else {
                                uni.showToast({
                                    title: res.message,
                                    duration: 1500,
                                    icon: 'none'
                                });
                            }
                        });
                } else {
                    uni.showToast({
                        title: this.language.storeSetup.Tips[10],
                        duration: 1500,
                        icon: 'none'
                    });
                }
            } else if (type == 3) {
                this.mask_display3 = false;
                if (this.new_phone.length == 11) {
                    this.$req
                        .post({
                            data: {
                                module: 'app',
                                action: 'mch',
                                m: 'set_shop',
                                
                                shop_id: this.shop_id,
                                tel: this.new_phone
                            }
                        })
                        .then(res => {
                            if (res.code == 200) {
                                uni.showToast({
                                    title: this.language.storeSetup.Tips[8],
                                    duration: 1500,
                                    icon: 'none'
                                });
                                setTimeout(() => {
                                    this._axios();
                                }, 1500);
                            } else {
                                uni.showToast({
                                    title: res.message,
                                    duration: 1500,
                                    icon: 'none'
                                });
                            }
                        });
                } else {
                    uni.showToast({
                        title: this.language.storeSetup.Tips[11],
                        duration: 1500,
                        icon: 'none'
                    });
                }
            } else if (type == 4) {
                console.log(this.new_phone)
                if (this.new_phone) {
                    this.mask_display4 = false;
                    this.$req
                        .post({
                            data: {
                                module: 'app',
                                action: 'mch',
                                m: 'set_shop',
                                
                                shop_id: this.shop_id,
                                name: this.new_phone
                            }
                        })
                        .then(res => {
                            if (res.code == 200) {
                                uni.showToast({
                                    title: this.language.storeSetup.Tips[8],
                                    duration: 1500,
                                    icon: 'none'
                                });
                                setTimeout(() => {
                                    this._axios();
                                }, 1500);
                            } else {
                                uni.showToast({
                                    title: res.message,
                                    duration: 1500,
                                    icon: 'none'
                                });
                            }
                        });
                } else {
                    uni.showToast({
                        title: '请输入店铺名称',
                        duration: 1500,
                        icon: 'none'
                    });
                }
            }
        },
        _cancel(type) {
            if (type == 1) {
                this.mask_display1 = false;
            } else if (type == 2) {
                this.mask_display2 = false;
            } else if (type == 3) {
                this.mask_display3 = false;
            } else if (type == 4) {
                this.mask_display4 = false;
            }
        },
        _axios() {
            this.$req
                .post({
                    data: {
                        module: 'app',
                        action: 'mch',
                        m: 'into_set_shop',
                        
                        shop_id: this.shop_id
                    }
                })
                .then(res => {
                    if (res.code == 200) {
                        var data = res.data.list[0];
                        this.storeImg = data.logo;
                        this.storeName = data.name;
                        this.storeRange = data.shop_range;
                        this.storeTitle = data.shop_information;
                        this.userName = data.realname;
                        this.userID = data.ID_number.replace(/^(\d{8})\d{6}(\d+)/, '$1******$2');
                        this.userPhone = data.tel.replace(/^(\d{3})\d{4}(\d+)/, '$1****$2');
                        this.userAdd = data.sheng + '-' + data.shi + '-' + data.xian;
                        this.address = data.address;
                        this.cashable_money = data.cashable_money;
                        
                        if(data.is_open == 1){
                            this.businessIndex = 1;
                        }else{
                            this.businessIndex = 0;
                        }
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

<style lang="less">
@import url('../../static/css/myStore/storeSetup.less');
</style>
