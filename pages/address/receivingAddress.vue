<template>
    <div class="receivingAddress" style="min-height: 100vh;" :style="address.length > 0 ?'background-color: #F6f6f6;':''">
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <!-- 标题 -->
        <div style='position: relative;'>
            <heads :title='language.receivingAddress.title'></heads>
            <!-- #ifndef MP -->
            <div class='manage' v-if='manage && address.length > 0' @tap="_manage">{{address_m}}</div>
            <!-- #endif -->
        </div>
        <!-- #ifdef MP -->
        <div class='manage1' v-if='manage' @tap="_manage">{{address_m}}</div>
        <!-- #endif -->
        
        <!-- 地址栏 -->
        <toload :load="load">
            <ul class='address' v-if='address.length'>
                <li v-for="(item,index) in address" :key='item.id'>
                    <div class='address_top' @tap="_state_manage(item)">
                        <div>
                            <div class='address_user'>
                                <span style="margin-right: 30upx">{{item.name}}</span>
                                <span>{{item.tel}}</span>
                            </div>
                            <div class='address_xs'>
                                <div class='address_ms' v-if='item.is_default==0?false:true'>{{language.receivingAddress.defaults}}</div>
                                <p>{{item.address_xq}}</p>
                            </div>
                        </div>
                        <img class='quan_img' v-if="re_img" :src="addre_id== item.addr_id ? circle_hei : circle_hui"/>
                    </div>
                    <div class='address_foot' v-if="del">
                        <div class="address_left" @tap="_default(item.addr_id,index)">
                            <img class='quan_img' :src="item.is_default==0 ? circle_hui : circle_hei"/>
                            <span>{{language.receivingAddress.defaultaddress}}</span>
                        </div>
                        <div class='address_right' style="display: flex;">
                            <div @tap="navTo('addAddress?state_addre=2&addr_id='+item.addr_id)">
                                <img class='quan_img' :src="edtAdd"/>
                                <span style="margin-right: 30rpx;">{{language.receivingAddress.edit}}</span>
                            </div>
                            <div @tap="delAddress(item.addr_id,index)">
                                <img class='quan_img' :src="delAdd"/>
                                <span>{{language.receivingAddress.deletes}}</span>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <!-- 当没有设置地址栏的时候，页面显示添加地图图片提示 -->
            <div class="address_wu" @tap="navTo('addAddress?state_addre=1')"  v-else>
                <img :src="add"/>
                <p>{{language.receivingAddress.add_address}}</p>
            </div>
        </toload>
        
        <!-- 底部按钮 -->
        <div class='bottom' v-if="address && address.length" @tap="navTo('addAddress?state_addre=1')">{{language.receivingAddress.addnewaddress}}</div>
        <lkdelModel :content="text" :canceltext="language.receivingAddress.cancel" :confirmtext="language.receivingAddress.confirm" v-model="lkdelModel" @on-click="_delAddress"/>
    </div>
</template>

<script>
    import {mapMutations} from 'vuex'
    import lkdelModel from '@/components/delModel.vue'

    export default {
        data () {
            return {
                title: '收货地址',
                add: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/tianjiadizhi2x.png',
                edtAdd: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/bianjidizhi2x.png',
                delAdd: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/shanchudizhi2x.png',
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
        onShow () {
            this._axios() 
            this.address_id = this.$store.state.address_id
            
            this.address_m = this.language.receivingAddress.management
        },
        onLoad (option) {
            this.order_id = this.$store.state.order_id
            
            this.state_manage = option.state_manage
            this.addre_id = option.addre_id
            uni.setStorageSync('canshu', 'false')
            if (this.state_manage == 1) {
                this.manage = true
                this.del = false
                this.re_img = true
            } else if (this.state_manage == 2) {
                this.manage = false
                this.del = true
                this.re_img = false
            }
        },
        components: {
            lkdelModel
        },
        methods: {
            changeLoginStatus () {
                this._axios()
            },
            //从订单页面进入点击调回前一页
            _state_manage (item) {
                this.addre_id = item.id
                var me = this
                me.$store.state.address_id = item.id
                uni.setStorageSync('chooseAddress', item)
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
                    if (code == 200) {
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
                    if (code == 200) {
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
                // res = res.data
                this.load = true;
                let adds = res.data.adds || []
                console.log(adds)
                if (res.code == 200) {
                    me.address = adds
                    // 如果创建的新地址选择了默认
                    if (uni.getStorageSync('address_default')) {
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
    @import url("../../static/css/address/receivingAddress.less");
</style>
