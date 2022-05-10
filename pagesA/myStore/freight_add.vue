<template>
    <view class="container">
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <heads :title="title"></heads>

        <view class="container_row">
            <view class="container_row_left">{{language.freight_add.name}}</view>
            <view class="container_row_right">
                <input :disabled="type=='see'" v-model="formData.name" type="text"
                    :placeholder="language.freight_add.name_placeholder" placeholder-style="color:#b8b8b8" maxlength="20">
            </view>
        </view>

        <view class="container_row">
            <view class="container_row_left">{{language.freight_add.rules}}</view>
            <view v-if="type != 'see'" class="container_row_right" @tap="toUrl('/pagesA/myStore/freight_rules')">
                {{language.freight_add.addRule}}
                <image class="jiantou" :src="jiantou"></image>
            </view>
        </view>

        <view v-for="item,index of formData.rules" :key="index" class="container_row"
            style="padding: 30rpx 30rpx 30rpx 0;box-sizing: border-box;">
            <view class="container_row_left" style="flex: 1;" @tap="click_bottom(item)">{{item.freight}}
                {{language.freight_add.freight}}</view>
            <view class="container_row_right" style="flex: 0;padding-left: 20rpx;">
                <template v-if="type != 'see'">
                    <image class="shanchudizhi" :src="freight_del" @tap="click_del(index)"></image>
                    <view class="imgHr"></view>
                </template>
                <image class="freight_bottom" :src="item.status?freight_top:freight_bottom" @tap="click_bottom(item)">
                </image>
            </view>

            <view class="container_row_bottom" v-if="item.status">
                {{item.freight_sheng.name}}
            </view>
        </view>

        <view class="container_row" v-if="type == 'add'">
            <view class="container_row_left">{{language.freight_add.setDefault}}</view>
            <view class="container_row_right" @tap="_default">
                <image class="xuanze" :src="formData.is_default?xuanzehei:xuanzehui"></image>
            </view>
        </view>

        <view class="container_bottomBtn" v-if="type != 'see'" @tap="saveOk">{{language.freight_add.save}}</view>
        <view class="container_bottomBtn btn1" v-if="type == 'edit'" @tap="delC">{{language.freight_add.del}}</view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                title: '添加模板',
                type: '',
                jiantou: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jiantou.png',
                xuanzehei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/xuanzehei2x.png',
                xuanzehui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/xuanzehui2x.png',
                shanchudizhi: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/shanchudizhi2x.png',
                freight_top: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/freight_top.png',
                freight_bottom: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/freight_bottom.png',
                freight_del: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/freight_del.png',

                formData: {
                    name: '',
                    rules: [],
                    is_default: false
                },
                shop_id: '',
                freight_id: '',
                clickFlag: true
            };
        },
        onLoad(option) {
            uni.removeStorageSync('freight_rules')

            this.type = option.type

            if (option.id) {
                this.freight_id = option.id
            }

        },
        onShow() {
            if (this.type == 'add') {
                this.title = this.language.freight_add.title
            } else if (this.type == 'edit') {
                this.title = this.language.freight_add.title1
            } else if (this.type == 'see') {
                this.title = this.language.freight_add.title2
            }

            uni.setNavigationBarTitle({
                title: this.title
            })

            this.shop_id = uni.getStorageSync('shop_id') ? uni.getStorageSync('shop_id') : this.$store.state.shop_id;

            if (uni.getStorageSync('freight_rules')) {
                let rule = uni.getStorageSync('freight_rules')
                let flag = this.formData.rules.some(item => item.freight_sheng.id == rule.freight_sheng.id)
                let rules = JSON.parse(JSON.stringify(this.formData.rules))
                if (!flag) {
                    rules.push(rule)
                }
                rules.filter(item => {
                    item.status = false
                })
                console.log(rules)
                this.formData.rules = rules
                uni.removeStorageSync('freight_rules')
            } else if (this.freight_id) {
                console.log('+++')
                this.axios()
            }
        },
        methods: {
            changeLoginStatus() {
                if (this.freight_id) {
                    this.axios()
                }
            },
            axios() {
                let data = {
                    module: 'app',
                    action: 'mch',
                    m: 'freight_modify_show',
                    shop_id: this.shop_id, // 店铺ID
                    id: this.freight_id, // 运费id
                }
                this.$req.post({
                    data
                }).then(res => {
                    let {
                        code,
                        data,
                        message
                    } = res
                    if (code == 200) {
                        this.formData.name = data.name
                        let rules = []
                        let freights = data.list || data.freight
                        freights.filter((item, index) => {
                            rules.push({
                                freight: item.freight,
                                freight_sheng: {
                                    name: item.name,
                                    id: data.sel_city_arr[index]
                                },
                                status: false
                            })
                        })

                        if (this.formData.rules.length == 0) {
                            this.formData.rules = rules
                        }

                        console.log(this.formData)
                        this.formData.is_default = data.is_default == 1 ? true : false
                    } else {
                        uni.showToast({
                            title: message,
                            icon: 'none'
                        })
                    }
                })
            },
            delC() {

                uni.showModal({
                    title: this.language.freight_add.Tips,
                    content: this.language.freight_add.TipsText,
                    confirmText: this.language.showModal.confirm,
                    cancelText: this.language.showModal.cancel,
                    success: (e) => {
                        if (e.confirm) {
                            if (!this.clickFlag) {
                                return
                            }
                            this.clickFlag = false
                            let data = {
                                module: 'app',
                                action: 'mch',
                                m: 'freight_del',
                                shop_id: this.shop_id, // 店铺ID
                                id: this.freight_id
                            }

                            this.$req.post({
                                data
                            }).then(res => {
                                let {
                                    code,
                                    message
                                } = res

                                uni.showToast({
                                    title: message,
                                    icon: 'none'
                                })

                                if (code == 200) {
                                    setTimeout(() => {
                                        uni.navigateBack({
                                            delta: 1
                                        })
                                    }, 1000)
                                } else {
                                    this.clickFlag = true
                                }
                            }).catch(error => {
                                this.clickFlag = true
                            })
                        }

                    }
                })


            },
            checkval(str) {
                var reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
                if (reg.test(str)) {
                    return true
                } else {
                    return false
                }
            },
            saveOk() {
                if (!this.formData.name) {
                    uni.showToast({
                        title: this.language.freight_add.nameTips,
                        icon: "none"
                    })
                    return
                }

                if (!this.checkval(this.formData.name)) {
                    uni.showToast({
                        title: this.language.freight_add.hasSpecial,
                        icon: "none"
                    })
                    return
                }

                if (this.formData.rules.length == 0) {
                    uni.showToast({
                        title: this.language.freight_add.ruleTips,
                        icon: "none"
                    })
                    return
                }
                let freightList = []
                this.formData.rules.filter((item, index) => {
                    let hidden_freight = {}
                    hidden_freight = {
                        "one": item.freight,
                        "name": item.freight_sheng.name,
                        "freight": item.freight
                    }
                    freightList.push(hidden_freight)
                })

                let data = {
                    module: 'app',
                    action: 'mch',
                    m: 'freight_add',
                    shop_id: this.shop_id, // 店铺ID
                    name: this.formData.name, // 规则名称
                    hidden_freight: JSON.stringify(freightList), // 运费信息
                    is_default: this.formData.is_default ? 1 : 0
                }

                if (this.type == 'edit') {
                    data.m = 'freight_modify'
                    data.id = this.freight_id
                }

                if (!this.clickFlag) {
                    return
                }
                this.clickFlag = false
                this.$req.post({
                    data
                }).then(res => {
                    let {
                        code,
                        message
                    } = res

                    uni.showToast({
                        title: message,
                        icon: 'none'
                    })

                    if (code == 200) {
                        setTimeout(() => {
                            uni.navigateBack({
                                delta: 1
                            })
                        }, 1000)
                    } else {
                        this.clickFlag = true
                    }
                }).catch(error => {
                    this.clickFlag = true
                })
            },
            click_del(index) {
                this.formData.rules.splice(index, 1)
            },
            click_bottom(item) {
                item.status = !item.status
            },
            _default() {
                if (this.type != 'see') {
                    this.formData.is_default = !this.formData.is_default
                }

            },
            toUrl(url) {
                let freights = this.formData.rules
                let freight_data = {}
                let sel_city = []

                freights.filter((item, index) => {
                    freight_data[index] = {
                        "one": item.freight,
                        "name": item.freight_sheng.name
                    }

                    sel_city.push(item.freight_sheng.id)
                })
                console.log(sel_city)
                var len = 0
                const city = sel_city
                if(city) {
                    city.filter(item => {
                        len += item.split(',').length
                    })
                }
                if(len == 34) {
                    uni.showToast({
                        title: '所有省份均已设置运费规则',
                        icon: 'none'
                    })
                } else {
                    
                    let data = {
                        module: 'app',
                        action: 'mch',
                        m: 'get_sheng',
                        shop_id: this.shop_id, // 店铺ID
                        data: JSON.stringify(freight_data),
                        sel_city: JSON.stringify(sel_city)
                    }

                    this.$req.post({
                        data
                    }).then(res => {
                        if (res.code == 200) {
                            uni.setStorageSync('freight_data', this.formData.rules)
                            uni.navigateTo({
                                url
                            })
                        } else {
                            uni.showToast({
                                title: res.message,
                                icon: 'none'
                            })
                        }
                    })
                }
            }
        }
    };
</script>

<style scoped lang="less">
    @import url('../../static/css/myStore/freight_add.less');
</style>
