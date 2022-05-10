<template>
    <div class="container">
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <heads :title="language.storeModifyAdress.title"></heads>
        
        <div class="content">
            
            <div class="content_row">
                <div class="content_row_left">{{language.storeModifyAdress.area}}</div>
                
                <div class="content_row_right" @click="showMulLinkageThreePicker()">
                    <input type="text" disabled='true' @focus="hideKeyboard()" :placeholder="language.storeModifyAdress.areaplacehold" v-model="city_all"
                           placeholder-style="color:#B8B8B8" style="flex: 1;margin-left: 60rpx;font-size: 28rpx"/>
                    <div class="jiantouDiv">
                        <img :src="jiantou" alt="" />
                    </div>
                </div>
            </div>
            
            <div class="content_row">
                <div class="content_row_left">{{language.storeModifyAdress.address}}</div>
                
                <div class="content_row_right">
                    <input v-model="address" type="text" :placeholder="language.storeModifyAdress.addressPlacehold" style="flex: 1;margin-left: 60rpx;font-size: 28rpx" placeholder-style="color:#B8B8B8">
                </div>
            </div>
            
        </div>
        
        <div class="bottomBtn">
            <div @tap="saveOk">{{language.storeModifyAdress.save}}</div>
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
            title: '修改联系地址',
            
            jiantou: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jiantou2x.png',
            city_all: '',
            address: '',
            
            themeColor: '#007AFF',
            cityPickerValueDefault: [0, 0, 1],
            shop_id: '',
            
            pageType: '', //是否是从申请店铺进入
        };
    },
    onLoad(option) {
        this.shop_id = option.shop_id
        this.city_all = option.userAdd
        this.address = option.address
        this.pageType = option.pageType
        
        if(this.city_all){
            this.$nextTick(()=>{
                var arr = this.city_all.split('-')
                
                provinceData.some((item,index)=>{
                    if(item.label == arr[0]){
                        arr[0] = index
                    }
                })
                
                cityData[arr[0]].some((item,index)=>{
                    if(item.label == arr[1]){
                        arr[1] = index
                    }
                })
                
                areaData[arr[0]][arr[1]].some((item,index)=>{
                    if(item.label == arr[2]){
                        arr[2] = index
                    }
                })
                
                this.cityPickerValueDefault = arr
            })
        }
    },
    methods: {
		changeLoginStatus(){
			
		},
        hideKeyboard () {
            uni.hideKeyboard()
        },
        showMulLinkageThreePicker () {
            this.$refs.mpvueCityPicker.show()
        },
        onConfirm (e) {
            this.city_all = e.label
        },
        
        saveOk(){
            if(this.pageType == 'apply'){
                if(!this.city_all){
                    uni.showToast({
                        title: this.language.storeModifyAdress.areaplacehold
                    })
                    return
                }
                if(!this.address){
                    uni.showToast({
                        title: this.language.storeModifyAdress.addressPlacehold
                    })
                    return
                }
                uni.setStorageSync('applyCity',this.city_all)
                uni.setStorageSync('applyAddress',this.address)
                uni.navigateBack({
                    delta: 1
                })
                return
            }
            if(this.address == ''){
                uni.showToast({
                    title: '请输入完整的地址！',
                    duration: 1500,
                    icon: 'none'
                });
                return
            }
            // this.city_all   所在地区
            // this.address   详细地址
            console.log(this.city_all)
            console.log(this.address)
            let data = {
                module: 'app',
                action: 'mch',
                m: 'set_shop',
                shop_id: this.shop_id,
                city_all: this.city_all,
                address: this.address,
            }
            
            this.$req.post({data}).then(res=>{
                if (res.code == 200) {
                    uni.showToast({
                        title: this.language.storeModifyAdress.succse,
                        duration: 1500,
                        icon: 'none'
                    });
                    setTimeout(() => {
                        uni.navigateBack({
                            delta: 1
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
        }
    },
    components:{ mpvueCityPicker }
};
</script>

<style lang="less">
@import url('../../static/css/myStore/storeSetup.less');
</style>
