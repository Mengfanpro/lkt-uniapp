<template>
    <view class="receivingAddress">
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <!-- 标题 -->
        <heads :title='language.receivingAddress.title'></heads>
        <!-- 添加新地址 -->
        <view class="addBox" @tap="navTo('/pages/address/addAddress?state_addre=1')">
            <view>+</view>
            {{language.bidding_address.add}}
        </view>
        
        <view class="hr"></view>
        
        <template v-for="item,index of address">
            <view class="list" :key="index" @tap="choose(item.id)">
                <view class="list_left">
                    <view class="list_left_top">
                        {{item.name}} 
                        <view>{{item.tel}}</view>
                    </view>
                    <view class="list_left_bottom">
                        <!-- 默认 -->
                        <view v-if="item.is_default == 1">{{language.bidding_address.isDefault}}</view>
                        <text>{{item.address_xq}}</text>
                    </view>
                </view>
                <image :src="addre_id == item.id?circle_hei:circle_hui" mode=""></image>
            </view>
            <view class="hr" :key="item.id"></view>
        </template>
        
        <view class="positionBtn">
            <!-- 确认 -->
            <button @tap="saveOk">{{language.bidding_address.ok}}</button>
        </view>
        
    </view>
</template>

<script>
    import {mapMutations} from 'vuex'
    import lkdelModel from '@/components/delModel.vue'

    export default {
        data () {
            return {
                title: '选择收货地址',
                fastTap: true,
                manage: '', //管理状态
                del: '', //删除编辑状态
                del_index: -1, //删除地址的index
                state_manage: '', //判断从个人中心页面进(1)，还是订单页面进(2) , 还是从竞拍详情进，3
                
                address: '', //接受后台返回地址
                circle_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/xuanzehui2x.png',
                circle_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/xuanzehei2x.png',
                order_id: '',
                re_img: '',
                addre_id: '', //地址id
                address_m: '管理',
                flag: true,
                lkdelModel: false,
                delobj: {},
                text: '',
                load: false,
            }
        },
        onLoad (option) {
            
        },
        onShow () {
            this.title = this.language.bidding_address.title
            this._axios() 
        },
        components: {
            lkdelModel
        },
        methods: {
            saveOk(){
                uni.setStorageSync('chooseAddress', this.addre_id)
                uni.navigateBack({
                    delta: 1
                })
            },
            choose(id){
                this.addre_id = id
            },
            changeLoginStatus () {
                this._axios()
            },
            //点击管理切换状态
            _manage () {
                this.del = !this.del
                if (this.del) {
                    this.address_m = this.language.receivingAddress.complete
                } else {
                    this.address_m = this.language.receivingAddress.management
                }
            },
            delAddress (addr_id, index) {

                this.delobj = {
                    addr_id,
                    index
                }
                console.log(this.language.receivingAddress.confirm_delete);
                if (this.address[index].is_default == 1) {
                    this.text = this.language.receivingAddress.confirm_delete
                } else {
                    this.text = ''
                }

                this.lkdelModel = true
            },
            // 删除地址
            _delAddress () {

                let {
                    addr_id,
                    index
                } = this.delobj

                if (!this.fastTap) {
                    return
                }

                this.fastTap = false
                var me = this

                var data = {
                    module: 'app',
                    action: 'address',
                    app: 'del_adds',
                    
                    addr_id: addr_id
                }


                this.$req.post({data}).then(res => {
                    me.fastTap = true

                    let {
                        code
                    } = res
                    if (code === 200) {
                        if (this.address.length === 1) {
                            me.$store.state.address_id_def = ''
                        } else if (this.address[index].is_default === 1) {
                            me.$store.state.address_id_def = ''
                            console.log('设置lkt_address_id_def为空')
                            uni.setStorageSync('lkt_address_id_def', '')
                        }
                        uni.showToast({
                            title: me.language.receivingAddress.delete_success,
                            icon: 'none',
                            duration: 1000
                        })
                        me._axios()
                    } else {
                        uni.showToast({
                            title: res.message,
                            duration: 1500,
                            icon: 'none'
                        })
                    }
                }).catch((e) => { me.fastTap = true })
                
                
                this.lkdelModel = false
            },
            //设置默认地址
            async _default (address_id, index) {
                if (!this.fastTap) {
                    return
                }
                this.fastTap = false
                var me = this
                var data = {
                    module: 'app',
                    action: 'address',
                    app: 'set_default',
                    addr_id: address_id
                }
                
                try {
                    let {code, message} = await this.$req.post({data})
                    if (code === 200) {
                        for (let i = 0; i < me.address.length; i++) {
                            me.address[i].is_default = 0
                        }
                        me.address[index].is_default = 1
                        me.$store.state.address_id_def = me.address[index].id
                    } else {
                        uni.showToast({
                            title: message,
                            duration: 1500,
                            icon: 'none'
                        })
                    }
                    me.fastTap = true
                } catch (e) {
                    me.fastTap = true
                }
            },
            async _axios () {
                var me = this
                var data = {
                    module: 'app',
                    action: 'address',
                    app: 'index',
                    
                }
                
                let res = await this.$req.post({data})
                this.load = true;
                
                if (res.code == 200) {
                    let adds = res.data.adds || []
                    me.address = adds
                    // 如果创建的新地址选择了默认
                    if (!this.addre_id || uni.getStorageSync('address_default')) {
                        for (let i = 0; i < adds.length; i++) {
                            if (adds[i].is_default == 1) {
                                me.addre_id = adds[i].id
                                break
                            }
                        }
                        uni.removeStorageSync('address_default')
                    }
                } else {
                    me.address = ''
                }

                if (adds.length > 0 && me.$store.state.address_id_def == '') {
                    if (me.$store.state.address_id_def == '') {
                        for (var k in adds) {
                            if (adds[k].is_default == 1) {
                                me.$store.state.address_id_def = adds[k].id
                                uni.setStorageSync('lkt_address_id_def', adds[k].id)
                                me.$store.state.address_id = adds[k].id
                            }
                        }
                    } else {
                        me.$store.state.address_id_def = me.$store.state.address_id_def
                        uni.setStorageSync('lkt_address_id_def', me.$store.state.address_id_def)
                    }
                }
            },
            ...mapMutations({
                address_id: 'SET_ADDRESS_ID'
            })
        },
    }
</script>
<style scoped lang="less">
    @import url("../../static/css/bidding/bidding_address.less");
</style>
