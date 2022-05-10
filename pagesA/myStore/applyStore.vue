<template>
    <div>
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <heads :title="language.applyStore.title"></heads>
        <div class="relative">
            <div class="contentBox">
                <div class="formDiv">
                    <div class="formList">
                        <div class="leftText1">
                            <span class="must">*</span>
                            <span class="font_28">{{language.applyStore.shopName}}</span>
                        </div>
                        <div class="rightInput1">
                            <input
                                :placeholder-style="placeStyle"
                                type="text"
                                v-model="storeName"
                                maxlength="14"
                                :placeholder="storeNamePH"
                                @focus="_changePH1('storeName')"
                                @blur="_changePH('storeName')"
                            />
                        </div>
                    </div>
                    <div v-if="warnTextStatus" class="warningText">
                        <img :src="warnImg" class="warnImg" />
                        {{language.applyStore.nameExisting}}
                    </div>
                </div>
                <div class="formDiv textarea">
                    <div class="formList">
                        <div class="leftText1">
                            <span class="must">*</span>
                            <span class="font_28">{{language.applyStore.information}}</span>
                        </div>
                        <div class="rightInput1">
                            <!-- <input
                                :placeholder-style="placeStyle"
                                type="textarea"
                                v-model="storeTitle"
                                maxlength="50"
                                :placeholder="storeTitlePH"
                                @focus="_changePH1('storeTitle')"
                                @blur="_changePH('storeTitle')"
                            /> -->
                            <textarea v-model="storeTitle" placeholder-style="color:#b8b8b8;font-size:28rpx;" maxlength="50" :placeholder="storeTitlePH" style="height: 160rpx;word-break: break-all;margin-top:120rpx;font-size: 28rpx;" @focus="_changePH1('storeTitle')" @blur="_changePH('storeTitle')" />
                        </div>
                    </div>
                </div>
                <div class="formDiv border_0">
                    <div class="formList">
                        <div class="leftText1">
                            <span class="must">*</span>
                            <span class="font_28">{{language.applyStore.business}}</span>
                        </div>
                        <div class="rightInput1">
                            <input
                                :placeholder-style="placeStyle"
                                type="text"
                                v-model="sellRange"
                                maxlength="50"
                                :placeholder="sellRangePH"
                                @focus="_changePH1('sellRange')"
                                @blur="_changePH('sellRange')"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div class="hr"></div>
            <div class="contentBox">
                <div class="formDiv">
                    <div class="formList">
                        <div class="leftText1">
                            <span class="must">*</span>
                            <span class="font_28">{{language.applyStore.username}}</span>
                        </div>
                        <div class="rightInput1">
                            <input
                                maxlength="20"
                                :placeholder-style="placeStyle"
                                type="text"
                                :placeholder="userNamePH"
                                @focus="_changePH1('userName')"
                                @blur="_changePH('userName')"
                                v-model="userName"
                            />
                        </div>
                    </div>
                </div>
                <div class="formDiv">
                    <div class="formList">
                        <div class="leftText1">
                            <span class="must">*</span>
                            <span class="font_28">{{language.applyStore.IDnumber}}</span>
                        </div>
                        <div class="rightInput1">
                            <input
                                :placeholder-style="placeStyle"
                                type="idcard"
                                maxlength="18"
                                :placeholder="userIDPH"
                                @focus="_changePH1('userID')"
                                @blur="_changePH('userID')"
                                v-model="userID"
                            />
                        </div>
                    </div>
                </div>
                <div class="formDiv">
                    <div class="formList">
                        <div class="leftText1">
                            <span class="must">*</span>
                            <span class="font_28">{{language.applyStore.tel}}</span>
                        </div>
                        <div class="rightInput1">
                            <input
                                maxlength="11"
                                :placeholder-style="placeStyle"
                                type="number"
                                :placeholder="userPhonePH"
                                @focus="_changePH1('userPhone')"
                                @blur="_changePH('userPhone')"
                                v-model="userPhone"
                            />
                        </div>
                    </div>
                </div>
                
                <!-- <div class="formDiv border_0">
                    <div class="formList">
                        <div class="leftText1">
                            <span class="must">*</span>
                            <span class="font_28">{{language.applyStore.address}}</span>
                        </div>
                        <div class="rightInput1 addressC" @tap="modifyAddress">
                            <input
                                :placeholder-style="placeStyle"
                                maxlength="18"
                                :placeholder="userAddPH"
                                :value="userAdd?(userAdd+' '+address):''"
                            />
                            <div class="jiantouDiv">
                                <img :src="jiantou" alt="" />
                            </div>
                        </div>
                    </div>
                </div> -->
                <div class="content_row">
                    <div class="content_row_left"><span class="must">*</span>{{language.storeModifyAdress.area}}</div>
                    
                    <div class="content_row_right" @click="showMulLinkageThreePicker()">
                        <input type="text" disabled='true' @focus="hideKeyboard()" :placeholder="language.storeModifyAdress.areaplacehold" v-model="city_all"
                               placeholder-style="color:#B8B8B8;margin-left:8rpx" style="flex: 1;margin-left: 70rpx;font-size: 28rpx"/>
                        <div class="jiantouDiv">
                            <img :src="jiantou" alt="" />
                        </div>
                    </div>
                </div>
                
                <div class="content_row">
                    <div class="content_row_left"><span class="must">*</span>{{language.storeModifyAdress.address}}</div>
                    
                    <div class="content_row_right">
                        <input v-model="address" type="text" :placeholder="language.storeModifyAdress.addressPlacehold" style="flex: 1;margin-left: 70rpx;font-size: 28rpx" placeholder-style="color:#B8B8B8;margin-left:10rpx">
                    </div>
                </div>
            </div>
            <div class="hr"></div>
            <div class="contentBox">
                <div class="formDiv">
                    <div class="formList">
                        <div class="leftText1"><span class="font_28">{{language.applyStore.nature}}</span></div>
                        <div class="rightInput1">
                            <view class="ri_outer" @tap="_changeType(0)">
                                <img class="quan_img" :src="storeType == 0 ? quan_hei : quan_hui" />
                                <span>{{language.applyStore.personal}}</span>
                            </view>
                            <view class="ri_outer" @tap="_changeType(1)">
                                <img class="quan_img" :src="storeType == 1 ? quan_hei : quan_hui" />
                                <span>{{language.applyStore.enterprise}}</span>
                            </view>
                        </div>
                    </div>
                </div>
                <div class="formDiv" style="border-bottom: 0;">
                    <div class="formList" style="padding-bottom: 20rpx;">
                        <div class="leftText1 permit"><span class="font_28">{{language.applyStore.license}}</span></div>
                        <div class="rightInput1 permitDiv">
                            <div class="upLoadPic" @tap="upLoadImg()">
                                <!-- 当上传了图片 -->
                                <img v-if="upImg" :src="delImg" class="closeImg" @tap.stop="_delImg()" />
                                <!-- 没有上传图片 -->
                                <div v-if="!upImg" class="tc">
                                    <img class="img" :src="addImg" alt="" />
                                    <div class="text">{{language.applyStore.upload}}</div>
                                </div>
                                <img class="img1" v-else :src="upImg" />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="protocol">
                        <div @tap="_agreement()">
                            <!-- #ifndef MP-ALIPAY -->
                            <img :src="agreement ? agreement_t : agreement_f" style="width:26rpx;height:26rpx;margin-right: 10rpx;" />
                            <!-- #endif -->
                            <!-- #ifdef MP-ALIPAY -->
                            <img v-if="agreement" :src="agreement_t" style="width:26rpx;height:26rpx;margin-right: 10rpx;" />
                            <img v-if="!agreement" :src="agreement_f" style="width:26rpx;height:26rpx;margin-right: 10rpx;" />
                            <!-- #endif -->
                            {{language.applyStore.read}}
                        </div>
                        <!-- <div @tap="_lookXY()">《{{language.applyStore.agreement}}》</div> -->
                        <div @tap="_lookXY()">《{{name}}》</div>
                    </div>
                    
                    <div class="submitBtn" @tap="_submit()">{{language.applyStore.submit}}</div>
                    
                </div>
            </div>
        </div>
        <mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
                           @onConfirm="onConfirm"></mpvue-city-picker>
    </div>
</template>

<script>
import mpvueCityPicker from '../../components/mpvue-citypicker/mpvueCityPicker.vue'
import provinceData from '../../components/mpvue-citypicker/city-data/province.js'
import cityData from '../../components/mpvue-citypicker/city-data/city.js'
import areaData from '../../components/mpvue-citypicker/city-data/area.js'

export default {
    data() {
        return {
            upImg1: '',
            goOn: false,
            licence: '',
            storeType: 0,
            warnTextStatus: false,
            upImg: '',
            name:'',
            title: '申请开店',
            fastTap: true,
            storeName: '',
            storeNamePH: '请填写店铺名称',
            storeNamePH1: '请填写店铺名称',
            storeTitle: '',
            storeTitlePH: '请填写店铺简介信息（50字以内）',
            storeTitlePH1: '请填写店铺简介信息（50字以内）',
            userName: '',
            userNamePH: '请填写真实姓名',
            userNamePH1: '请填写真实姓名',
            userID: '',
            userIDPH: '请填写身份证号',
            userIDPH1: '请填写身份证号',
            userPhone: '',
            userPhonePH: '请填写联系电话',
            userPhonePH1: '请填写联系电话',
            userAdd: '',
            address: '',
            userAddPH: '请填写联系地址',
            userAddPH1: '请填写联系地址',
            sellRange: '',
            sellRangePH: '请填写店铺经营范围',
            sellRangePH1: '请填写店铺经营范围',
            agreement: false,
            warnImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/warnIng.png',
            addImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/tianjiadizhi2x.png',
            agreement_t: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/landing_gou3x.png',
            agreement_f: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/landing_wei2x.png',
            delImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/delete2x.png',
            storeNameStatus: false,
            storeTitleStatus: false,
            userNameStatus: false,
            userIDStatus: false,
            userPhoneStatus: false,
            userAddStatus: false,
            compStatus: false,
            sellRangeStatus: false,
            quan_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/xuanzehui2x.png',
            quan_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/xuanzehei2x.png',
            placeStyle: 'color:#b8b8b8;font-size:28rpx;',
            
            jiantou: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jiantou2x.png',
            
            city_all: '',
            
            themeColor: '#007AFF',
            cityPickerValueDefault: [0, 0, 1],
            shop_id: '',
            
            pageType: '', //是否是从申请店铺进入
        };
    },
    components:{ mpvueCityPicker },
    onLoad(option) {
        this.goOn = option.goOn;
        this.axios()
        this.city_all = localStorage.getItem('citys')
    },
    onShow() {
        if(uni.getStorageSync('applyCity')){
            this.userAdd = uni.getStorageSync('applyCity')
            this.address = uni.getStorageSync('applyAddress')
            uni.removeStorageSync('applyCity')
            uni.removeStorageSync('applyAddress')
        }
        
        this.storeNamePH = this.language.applyStore.shopNamePlaceholder
        this.storeNamePH1 = this.language.applyStore.shopNamePlaceholder
        
        this.storeTitlePH = this.language.applyStore.informationPlaceholder
        this.storeTitlePH1 = this.language.applyStore.informationPlaceholder
        
        this.sellRangePH = this.language.applyStore.businessPlaceholder
        this.sellRangePH1 = this.language.applyStore.businessPlaceholder
        
        this.userNamePH = this.language.applyStore.usernamePlaceholder
        this.userNamePH1 = this.language.applyStore.usernamePlaceholder
        
        this.userIDPH = this.language.applyStore.IDnumberPlaceholder
        this.userIDPH1 = this.language.applyStore.IDnumberPlaceholder
        
        this.userPhonePH = this.language.applyStore.telPlaceholder
        this.userPhonePH1 = this.language.applyStore.telPlaceholder
        
        this.userAddPH = this.language.applyStore.addressPlaceholder
        this.userAddPH1 = this.language.applyStore.addressPlaceholder
        this.axios()
    },
    watch:{
      userID(){
          this.checkIdcard(this.userID)
      }
    },
    mounted() {
        this.isLogin(()=>{
			
			this.shop_id = uni.getStorageSync('shop_id') ? uni.getStorageSync('shop_id') : this.$store.state.shop_id;
			
			if (this.goOn) {
			    this.$req
			        .post({
			            data: {
			                module: 'app',
			                action: 'mch',
			                m: 'continue_apply',
			                
			                shop_id: this.shop_id
			            }
			        })
			        .then(res => {
			            var data = res.data.list;
			            this.storeName = data.name;
			            this.storeTitle = data.shop_information;
			            this.sellRange = data.shop_range;
			            this.userName = data.realname;
			            this.userID = data.id_number;
			            this.userPhone = data.tel;
			            this.userAdd = data.sheng +'-'+ data.shi +'-'+ data.xian;
			            this.address = data.address;
			            this.storeType = data.shop_nature;
			            this.agreement = true;
			            this.upImg = data.business_license;
			            this.upImg1 = data.business_license;
			            this.storeNameStatus = true;
			            this.storeTitleStatus = true;
			            this.userNameStatus = true;
			            this.userIDStatus = true;
			            this.userPhoneStatus = true;
			            this.userAddStatus = true;
			        });
			}
		})
    },
    methods: {
        hideKeyboard () {
            uni.hideKeyboard()
        },
        showMulLinkageThreePicker () {
            this.$refs.mpvueCityPicker.show()
        },
        onConfirm (e) {
            this.city_all = e.label
        },
        modifyAddress(){
            uni.navigateTo({
                url: '/pagesA/myStore/modifyAdress?pageType=apply&shop_id='+this.shop_id + '&userAdd='+this.userAdd+'&address='+this.address
            })
        },
        changeLoginStatus() {
            
        },
        _delImg() {
            this.upImg = '';
        },
        // 上传图片
        upLoadImg() {
            if (!this.fastTap) {
                return;
            }
            this.fastTap = false;
            if (this.upImg) {
                this.fastTap = true;
                uni.previewImage({
                    urls: this.upImg,
                    success: function() {}
                });
            } else {
                this.fastTap = true;
                uni.chooseImage({
                    count: 1,
                    success: async  res => {
                        let imageInfo = await uni.getImageInfo({
                            src: res.tempFilePaths[0]
                        })
                        this.upImg = imageInfo[1].path
                    },
                    error: function() {}
                });
            }
        },
        
        _submit() {
            var me = this;
            if (!this.fastTap) {
                return;
            }
            
            // #ifdef APP-PLUS || HS
            uni.setStorage('citys',this.city_all)
            // #endif
            
            // #ifdef MP-WEIXIN
            wx.setStorageSync('citys',this.city_all)
            // #endif
            
            this.userAddStatus = this.city_all&&this.address
            this.userAdd = this.city_all

            this.fastTap = false;
            let flag =
                this.storeNameStatus &&
                this.storeTitleStatus &&
                this.userNameStatus &&
                this.userIDStatus &&
                this.userPhoneStatus &&
                this.userAddStatus &&
                this.agreement &&
                this.sellRange;
                
            if (flag) {
               console.log(flag)
                if (this.upImg && this.upImg != this.upImg1) {
                    let data = {
                        module: 'app',
                        action: 'mch',
                        m: 'apply',
                        app:'apply',
                        name: me.storeName,
                        shop_information: me.storeTitle,
                        shop_range: me.sellRange,
                        realname: me.userName,
                        ID_number: me.userID,
                        tel: me.userPhone,
                        city_all: me.userAdd,
                        address: me.address,
                        shop_nature: me.storeType
                    }
                    me.$req.upLoad(me.upImg,data).then((res)=>{
                        me.fastTap = true;
                        if (res.code == 200) {
                            uni.redirectTo({
                                url: '/pagesA/myStore/applySuc'
                            });
                        } else {
                            me.fastTap = true;
                            uni.showToast({
                                title: res.message,
                                duration: 1500,
                                icon: 'none'
                            });
                        }
                    })
                } else {
                    let data = {
                        module: 'app',
                        action: 'mch',
                        app: 'apply',
                        name: me.storeName,
                        shop_information: me.storeTitle,
                        shop_range: me.sellRange,
                        realname: me.userName,
                        ID_number: me.userID,
                        tel: me.userPhone,
                        city_all: me.userAdd,
                        address: me.address,
                        shop_nature: me.storeType
                    }
                    me.$req.post({data}).then(res => {
                        me.fastTap = true;
                        if (res.code == 200) {
                            uni.redirectTo({
                                url: '../myStore/applySuc'
                            });
                        } else {
                            me.fastTap = true;
                            uni.showToast({
                                title: res.message,
                                duration: 1500,
                                icon: 'none'
                            });
                        }
                    }).catch(()=>{
                        me.fastTap = true;
                    })
                }
            } else if (!this.agreement) {
                this.fastTap = true;
                uni.showToast({
                    title: this.language.applyStore.agreementFail,
                    icon: 'none'
                });
            } else {
                this.fastTap = true;
                var res = '';
                if (!this.storeNameStatus) {
                    res = this.language.applyStore.shopNameFail;
                } else if (!this.storeTitleStatus) {
                    res = this.language.applyStore.informationFail;
                } else if (!this.userNameStatus) {
                    res = this.language.applyStore.usernameFail;
                } else if (!this.userIDStatus) {
                    res = this.language.applyStore.IDFail;
                } else if (!this.userPhoneStatus) {
                    res = this.language.applyStore.telFail;
                } else if (!this.userAddStatus) {
                    res = this.language.applyStore.addressFail;
                } else if (!this.agreement) {
                    res = this.language.applyStore.agreementFail;
                } else if (!this.sellRange) {
                    res = this.language.applyStore.businessFail;
                }
                uni.showToast({
                    title: res,
                    icon: 'none',
                    duration: 1500
                });
            }
        },
        _agreement() {
            this.agreement = !this.agreement;
        },
        _lookXY() {
            uni.navigateTo({
                url: './applyAgreement'
            });
        },
        _changeType: function(num) {
            this.storeType = num;
        },
        // 离开事件
        _changePH(type) {
            var me = this;
            if (type == 'storeName') {
                this.storeNamePH = this.storeNamePH1;
                if (this.storeName.length == 0) {
                    this.storeNameStatus = false;
                } else if (this.storeName.length > 0) {
                    let data = {
                        module: 'app',
                        action: 'mch',
                        m: 'verify_store_name',
                        name: me.storeName
                    }
                    me.$req.post({data}).then(res => {
                        if (res.code == 200) {
                            me.storeNameStatus = true;
                            me.warnTextStatus = false;
                        } else {
                            uni.showToast({
                                title: res.message,
                                duration: 1500,
                                icon: 'none'
                            });
                            me.storeNameStatus = false;
                            me.warnTextStatus = true;
                        }
                    })
                }
            } else if (type == 'storeTitle') {
                this.storeTitlePH = this.storeTitlePH1;
                if (this.storeTitle.length == 0) {
                    this.storeTitleStatus = false;
                } else if (this.storeTitle.length > 0) {
                    this.storeTitleStatus = true;
                }
            } else if (type == 'userName') {
                this.userNamePH = this.userNamePH1;
                if (this.userName.length == 0) {
                    this.userNameStatus = false;
                } else if (this.userName.length > 1) {
                    this.userNameStatus = true;
                }
            } else if (type == 'userID') {
                this.userIDPH = this.userIDPH1;
                if (this.userID.length == 0) {
                    this.userIDStatus = false;
                } else if (this.userID.length < 18) {
                    uni.showToast({
                        title: this.language.applyStore.IDFail1,
                        duration: 1500,
                        icon: 'none'
                    });
                    this.userIDStatus = false;
                } else if (this.userID.length == 18) {
                    this.userIDStatus = true;
                }
            } else if (type == 'userPhone') {
                this.userPhonePH = this.userPhonePH1;
                if (this.userPhone.length == 0) {
                    this.userPhoneStatus = false;
                } else if (this.userPhone.length < 11) {
                    uni.showToast({
                        title: this.language.applyStore.telFail1,
                        duration: 1500,
                        icon: 'none'
                    });
                    this.userPhoneStatus = false;
                } else if (this.userPhone.length == 11) {
                    this.userPhoneStatus = true;
                }
            } else if (type == 'userAdd') {
                this.userAddPH = this.userAddPH1;
                if (this.userAdd.length == 0) {
                    this.userAddStatus = false;
                } else if (this.userAdd.length > 0) {
                    this.userAddStatus = true;
                }
            } else if (type == 'sellRange') {
                this.sellRangePH = this.sellRangePH1;
                if (this.sellRange.length == 0) {
                    this.sellRangeStatus = false;
                } else if (this.sellRange.length > 0) {
                    this.sellRangeStatus = true;
                }
            }
        },
        // 获取焦点
        _changePH1(type) {
            if (type == 'storeName') {
                // 店铺名称
                this.storeNamePH = '';
            } else if (type == 'storeTitle') {
                // 店铺信息
                this.storeTitlePH = '';
            } else if (type == 'userName') {
                // 用户姓名
                this.userNamePH = '';
            } else if (type == 'userID') {
                // 身份证号
                this.userIDPH = '';
            } else if (type == 'userPhone') {
                // 联系电话
                this.userPhonePH = '';
            } else if (type == 'userAdd') {
                // 联系地址
                this.userAddPH = '';
            } else if (type == 'sellRange') {
                // 经营范围
                this.sellRangePH = '';
            }
        },
        
        axios(){
            let data = {
                module:'app',
                action:'mch',
                m:'agreement'
            }
            
            this.$req.post({data}).then(res=>{
                let { code, message, data } = res
                
                if(code == 200){
                    this.name = data.name
                }else{
                    uni.showToast({
                        title: message,
                        icon: 'none'
                    })
                }
                
                this.loadFlag = true
            })
        },
        checkIdcard(idCard) { 
            idCard = this.trim(idCard);//去掉字符串头尾空格          
            console.dir(idCard)           
            if (idCard.length == 15) {   
                return this.isValidityBrithBy15IdCard(idCard);       //进行15位身份证的验证    
            } else if (idCard.length == 18) {  
                var a_idCard = idCard.split("");                // 得到身份证数组   
                if(this.isValidityBrithBy18IdCard(idCard) && this.isTrueValidateCodeBy18IdCard(a_idCard)){   //进行18位身份证的基本验证和第18位的验证
                    uni.showToast({
                        title: this.language.applyStore.IDFail1,
                        duration: 1500,
                        icon: 'none'
                    });
                    this.userIDStatus = false;
                    return true;   
                }else {   
                    return false;   
                }   
            } else {   
                return false;   
            }   
        } ,
        /**  
         * 判断身份证号码为18位时最后的验证位是否正确  
         * @param a_idCard 身份证号码数组  
         * @return  
         */  
        isTrueValidateCodeBy18IdCard(a_idCard) {  
            var sum = 0;                             // 声明加权求和变量   
            if (a_idCard[17].toLowerCase() == 'x') {   
                a_idCard[17] = 10;                    // 将最后位为x的验证码替换为10方便后续操作   
            }   
            for ( var i = 0; i < 17; i++) {   
                sum += Wi[i] * a_idCard[i];            // 加权求和   
            }   
            valCodePosition = sum % 11;                // 得到验证码所位置   
            if (a_idCard[17] == ValideCode[valCodePosition]) {   
                return true;   
            } else {   
                return false;   
            }   
        },
        /**  
          * 验证18位数身份证号码中的生日是否是有效生日  
          * @param idCard 18位书身份证字符串  
          * @return  
          */  
        isValidityBrithBy18IdCard(idCard18){   
            var year =  idCard18.substring(6,10);   
            var month = idCard18.substring(10,12);   
            var day = idCard18.substring(12,14);   
            var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));   
            // 这里用getFullYear()获取年份，避免千年虫问题   
            if(temp_date.getFullYear()!=parseFloat(year)   
                  ||temp_date.getMonth()!=parseFloat(month)-1   
                  ||temp_date.getDate()!=parseFloat(day)){  
                      uni.showToast({
                          title: this.language.applyStore.IDFail1,
                          duration: 1500,
                          icon: 'none'
                      });
                    return false;   
            }else{   
                return true;   
            }   
          }, 
          /**  
           * 验证15位数身份证号码中的生日是否是有效生日  
           * @param idCard15 15位书身份证字符串  
           * @return  
           */  
          isValidityBrithBy15IdCard(idCard15){   
              var year =  idCard15.substring(7,9);   
              var month = idCard15.substring(10,12);   
              var day = idCard15.substring(12,14);   
              var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));   
              // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法   
              if(temp_date.getYear()!=parseFloat(year)   
                      ||temp_date.getMonth()!=parseFloat(month)-1   
                      ||temp_date.getDate()!=parseFloat(day)){   
                         uni.showToast({
                             title: this.language.applyStore.IDFail1,
                             duration: 1500,
                             icon: 'none'
                         });
                        return false;   
                }else{   
                    return true;   
                }   
          }   ,
        //去掉字符串头尾空格   
        trim(str) {   
            return str.replace(/(^\s*)|(\s*$)/g, "");   
        }
    }
};
</script>

<style lang="less" scoped>
@import url('../../static/css/myStore/applyStore.less');
.content_row{
    display: flex;
    align-items: center;
    padding-right: 30rpx;
    margin-left: 10rpx;
    border-bottom: 1px solid #EEEEEE;
}

.content_row_left{
    font-size: 28rpx;
    color: #020202;
    line-height: 36rpx;
}

.content_row_right{
    flex: 1;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 20rpx 0;
    font-size: 28rpx;
    min-height: 90rpx;
}

.content_row_right>p{
    max-width: 450rpx;
    text-align: right;
    font-size: 28rpx;
    color: #999999;
    line-height: 32rpx;
    word-break: break-all;
}

.head_img{
    width: 90rpx;
    height: 90rpx;
    border-radius: 50%;
}

.jiantouDiv{
    display: flex;
    width: 15rpx;
    height: 27rpx;
    margin-left: 20rpx;
}
.jiantouDiv img{
    width: 100%;
    height: 100%;
}

.bottomBtn{
    height:98rpx;
}

.bottomBtn>div{
    .solidBtn();
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height:98rpx;
    line-height: 98rpx;
    text-align: center;
    font-size: 30rpx;
}


.mask {
    height: 100vh;
    width: 100%;
    background-color: rgba(000, 000, 000, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 34;
    display: flex;
    justify-content: center;
    align-items: center;
}

.mask_cont {
    text-align: center;
    font-size: 30rpx;
    color: #020202;
    background-color: #fff;
    border-radius: 23rpx;
}

.mask_cont>p {
    margin: 38rpx 0;
    font-size: 34rpx;
    font-weight: bold;
}

.mask_cont>input {
    width: 500rpx;
    padding-left: 20rpx;
    height: 66rpx;
    border-radius: 10rpx;
    margin: 0 40rpx 30rpx 40rpx;
    border: 1px solid #b8b8b8;
}

.mask_button {
    border-top: 1px solid #eee;
    // padding: 10rpx 0;
    // height: 98rpx;
}

.mask_button>div {
    float: left;
    width: 50%;
    height: 84rpx;
    color: #020202;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30rpx;
}

.mask_button:after {
    display: block;
    content: "";
    clear: both;
}

.mask_button_left {
    border-right: 1px solid #eee;
    color: #9D9D9D !important;
}

.mask_cont textarea{
    width:480rpx;
    height:150rpx;
    background:rgba(255,255,255,1);
    border:1px solid rgba(221,221,221,1);
    border-radius:6rpx;
    margin: 0 35rpx 40rpx;
    text-align: left;
    padding: 20rpx;
    box-sizing: border-box;
    font-size: 28rpx;
}


.textLeng{
    position: absolute;right: 40rpx;bottom: 2rpx;
    font-size: 28rpx;
    line-height: 28rpx;
    color: #B8B8B8;
}

.cancellationContent{
    width:550rpx;
    min-height:280rpx;
    background:rgba(255,255,255,1);
    border-radius:23rpx;
}

.cancellationContent_text{
    margin: 62rpx auto 56rpx;
    text-align: center;
    line-height: 36.5rpx;
    font-size: 28rpx;
    color: #020202;
}

.cancellationContent_btn{
    display: flex;
    align-items: center;
    height: 94rpx;
    border-top: 1px solid #EEEEEE;
    box-sizing: border-box;
}

.cancellationContent_btn>div{
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 34rpx;
    color: #999999;
}

.cancellationContent_btn>div:last-child{
    color: #020202;
    border-left: 1px solid #EEEEEE;
}

.contentBox .textarea{
    height: 160rpx;
}

</style>
