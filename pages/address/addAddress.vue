<template>
    <div style='height: 100%;'>
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <heads :title='title'></heads>
        <ul class='message'>
            <li>
                <span class="leftText"><span class="must">*</span>{{language.addAddress.consignee}}</span>
                <input type="text" placeholder-style="color:#B8B8B8;font-size:14px;" :placeholder="language.addAddress.consignee_placeholder" v-model="user_name"/>
            </li>
            <li>
                <span class="leftText"><span class="must">*</span>{{language.addAddress.contactinfo}}</span>
                <input type="number" placeholder-style="color:#B8B8B8;font-size:14px;" :placeholder="language.addAddress.contactinfo_placeholder" v-model="phone"/>
            </li>
            <li class="flex" @click="showMulLinkageThreePicker()">
                <div style='display: flex;align-items: center;'>
                    <span class="leftText"><span class="must">*</span>{{language.addAddress.region}}</span>
                    <input type="text" disabled='true' @focus="hideKeyboard()" :placeholder="language.addAddress.region_placeholder" v-model="city_all"
                           placeholder-style="color:#B8B8B8;font-size:14px;"/>
                </div>
                <img class='arrow' :src="jiantou"/>
            </li>
            <li>
                <span class="leftText"><span class="must">*</span>{{language.addAddress.addressinfo}}</span>
                <input type="text" placeholder-style="color:#B8B8B8;font-size:14px;" :placeholder="language.addAddress.addressinfo_placeholder" v-model="address"/>
            </li>
            <li class="flex adddis">
                <span class="leftText"><span class="must" style="opacity: 0;">*</span>{{language.addAddress.defaultaddress}}</span>
                <img v-if="modify_default_flag" class='quan_img' :src="modify_default"/>
                <img v-else class='quan_img' :src="is_default==1 ? circle_hei : circle_hui" @click='_is_default'/>
            </li>
            <li id='setupButtomWrap'>
                <div class='setup-buttom storage' @tap="_preserve_address">{{language.addAddress.saveBtn}}</div>
            </li>
        </ul>
        <mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
                           @onConfirm="onConfirm"></mpvue-city-picker>

    </div>
</template>

<script>
    import { mapMutations } from 'vuex'
    import mpvueCityPicker from '../../components/mpvue-citypicker/mpvueCityPicker.vue'
    import {
        telephone
    } from '../../common/landing.js'

    export default {
        data () {
            return {
                addNum: '',
                jiantou: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jiantou2x.png',
                fastTap: true,
                title: '编辑地址',
                selected: '1', //组件的默认值
                cilck_index: -1, //选择省市的 index
                city_z: false, //显示隐藏状态
                city_addre: {}, //选择完省市区后存的信息
                province: '', //省
                city: '', //市
                area: '', //区
                
                GroupID: '', //省id
                Group_name: '', //省名称
                city_id: '', //市id
                city_name: '', //城市名称
                area_name: '', //区名称
                area_id: '', //区id
                user_name: '', //用户名
                phone: '', //电话号码
                address: '', //详细地址
                state_addre: '', //判断从添加地址(1)还是编辑地址(2)
                addr_id: '', //地址id
                city_all: '', //最终选择省市区的值
                is_default: 0, //是否默认地址
                circle_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/xuanzehui2x.png', //图片地址
                circle_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/xuanzehei2x.png', //图片地址
                modify_default: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/modify_default.png', //图片地址
                modify_default_flag: false,
                g_name: '省份',
                c_name: '城市',
                a_name: '地区',
                themeColor: '#007AFF',
                cityPickerValueDefault: [0, 0, 1],
                pickerText: '',
            }
        },
        onLoad (option) {
            this.addNum = option.addNum
            this.state_addre = option.state_addre
            this.addr_id = option.addr_id
            
           if (this.state_addre == 2) {
               this._axios()
           }

        },
        onShow () {
            if (this.state_addre == 2) {
                this.title = this.language.addAddress.title1
            } else {
                this.title = this.language.addAddress.title
            }
            
            this.isLogin()
        },
        methods: {
            changeLoginStatus () {
                this.login_status = 1
                this._axios()
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
            ...mapMutations({
                address_id: 'SET_ADDRESS_ID'
            }),
            _axios () {
                var me = this
                var data = {
                    module: 'app',
                    action: 'address',
                    app: 'up_addsindex',
                    
                    addr_id: this.addr_id
                }
                this.$req.post({data}).then(res => {
                    me.fastTap = true
                    if (res.code == 200) {
                        console.log(res)
                        let { data: { address: { address, name, tel, is_default, address_xq }, city_id, county, province }  } = res
                        me.user_name = name
                        me.phone = tel
                        me.address = address
                        me.city_all = province + '-' + city_id + '-' + county
                        me.is_default = is_default
                        
                        if(me.state_addre == 2&&is_default == 1){
                            me.modify_default_flag = true
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
            //默认地址
            _is_default () {
                if (this.is_default === 1) {
                    this.is_default = 0
                } else {
                    this.is_default = 1
                }
            },
            //保存
            _preserve_address () {
                var me = this
                if (!this.fastTap) {
                    return
                }
                this.fastTap = false
                if (this.user_name && this.phone && this.city_all && this.address) {
                    let reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
                    if(!reg.test(this.user_name)){
                        this.fastTap = true
                        uni.showToast({
                            title: me.language.addAddress.Receiving_verification,
                            icon: 'none'
                        })
                        return
                    }
                    
                    if(telephone(this.phone) == 3){
                        this.fastTap = true
                        return
                    }
                    
                    var data = {
                        module: 'app',
                        action: 'address',
                        
                        user_name: this.user_name,
                        mobile: this.phone,
                        place: this.city_all,
                        is_default: this.is_default,
                        address: this.address
                    }
                    console.log(data)
                    if (this.state_addre == 2) {
                        data.app = 'up_adds'
                        data.addr_id = this.addr_id
                        this.$req.post({data}).then(res => {
                            let { code, message } = res
                            if (code == 200) {
                                uni.showToast({
                                    title: me.language.addAddress.modify_success,
                                    duration: 1500,
                                    icon: 'none'
                                })
                                if (me.is_default == 1) {
                                    me.$store.state.address_id_def = me.addr_id
                                }
                                uni.setStorageSync('lkt_address_id_def', me.addr_id)
                                setTimeout(function () {
                                    uni.navigateBack({
                                        delta: 1
                                    })
                                    me.fastTap = true
                                }, 1500)
                            } else {
                                me.fastTap = true
                                uni.showToast({
                                    title: message,
                                    duration: 1500,
                                    icon: 'none'
                                })
                            }    
                        })
                        
                    } else if (this.state_addre == 1) {
						
                        data.app = 'SaveAddress'
                        this.$req.post({data}).then(res => {
                            let { address_id, code, message } = res
                            if (code == 200) {
                                if (me.addNum == 0) {
                                    me.$store.state.address_id_def = address_id
                                } else if (data.is_default == 1) {
									//
                                    //me.$store.state.address_id_def = address_id
                                    // 告诉上一页，选择了默认地址
                                    uni.setStorageSync('address_default', 1)
                                }
                                //uni.setStorageSync('lkt_address_id_def', address_id)
                                uni.showToast({
                                    title: me.language.addAddress.add_success,
                                    duration: 1500,
                                    icon: 'none'
                                })
                                setTimeout(function () {
                                    var pages = getCurrentPages();
                                    var prevPage = pages[pages.length - 2];  //上一个页面
                                    prevPage._data.address_id =  ''
                                    uni.navigateBack({
                                        delta: 1,
                                        // success: function() {
                                        //     setTimeout(function() {
                                        //         beforePage.$vm.refreshRequest(); // 执行前一个页面的刷新
                                        //     },1600)
                                            
                                        // }
                                    })
                                    me.fastTap = true
                                }, 1500)
                            } else {
                                me.fastTap = true
                                uni.showToast({
                                    title: message,
                                    duration: 1500,
                                    icon: 'none'
                                })
                            }
                        })
                        
                    }
                } else {
                    this.fastTap = true
                    uni.showToast({
                        title: me.language.addAddress.complete_info,
                        duration: 1000,
                        icon: 'none'
                    })
                }
            },
        },
        components: {
            mpvueCityPicker,
        }
    }
</script>
<style scoped lang="less">
    @import url("../../static/css/address/addAddress.less");
</style>
