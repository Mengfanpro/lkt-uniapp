<template>
    <div style='min-height: 100vh;'>
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <!-- #ifndef MP -->
        <div class='header_box' :style='{paddingTop:halfWidth}'>
            <div class='header'>
				<span @tap='_back1()'>
					<img :src="back">
				</span>
                <p>{{language.addStock.title}}</p>
            </div>
        </div>
        <!-- #endif -->
        <div class='load' v-if='load'>
            <div>
                <img :src="loadGif"/>
                <p>{{language.addStock.load}}…</p>
            </div>
        </div>
        <div v-else class='relative' :style="{marginTop:halfWidth}">
            <div class='attrList table' :style='{width:tableList}'>
                <div class='attrListHead tr'>
                    <div class='list2 th' v-for='(item,index) in attr' :key='index'>
                        {{item.attrName[0]}}
                    </div>
                    <div class='list1 th'>{{language.addStock.inventory}}</div>
                    <div class='list1 th'>{{language.addStock.warning}}</div>
                    <div class='list1 th'>{{language.addStock.addInventory}}</div>
                </div>
                <div class='attrListBody tr' v-for='(item,index) in attrList' :key="index">
                    <div v-if='item.length>1' class='tr attrListTr1'>
                        <div class='list2  aa td' v-for='(items,indexs) in item' :key='indexs'>
                            <span>{{item[indexs].value}}</span>
                        </div>
                        <div class='list1 td bcd' :class='{"redColor":item[0].stock<item[0].stockWarn}'>
                            {{item[0].stock}}
                        </div>
                        <div class='list1 td'>{{item[0].stockWarn}}</div>
                        <div class='list1 td'><input @input='checkNum($event,item[0],index)' type="number"
                                                     v-model="item[0].addStockNum"></div>
                    </div>
                    <div v-else class='tr'>
                        <div class='list2  td bb'>
                            <span>{{item.value}}</span>
                        </div>
                        <div class='list1 td asd' :class='{"redColor":item.stock<item.stockWarn}'>{{item.stock}}</div>
                        <div class='list1 td'>{{item.stockWarn}}</div>
                        <div class='list1 td'><input @input='checkNum($event,item,index)' type="number"
                                                     v-model="item.addStockNum"></div>
                    </div>
                </div>
            </div>
            <div class='subBtn' @tap='_sub()'>{{language.addStock.save}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                back: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/back2x_w.png',
                addStockNum: '',
                title: '库存管理',
                
                loadGif: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/loading.gif',
                load: false,
                shop_id: '',
                p_id: '',
                attr: '',
                attrList: '',
                fastTap: true,
            }
        },
        onLoad (option) {
            this.p_id = option.p_id
            this.isLogin(()=>{
				
				this.shop_id = uni.getStorageSync('shop_id') ? uni.getStorageSync('shop_id') : this.$store.state.shop_id
				this._axios()
			})
        },
        onShow() {
            uni.setNavigationBarTitle({
                title: this.language.addStock.title
            })
        },
        methods: {
            changeLoginStatus () {
                this._axios()
            },
            _back1 () {
                var showModal = false
                if (this.attrList[0].length > 1) {
                    for (let i = 0; i < this.attrList.length; i++) {
                        if (this.attrList[i][0].addStockNum != 0) {
                            showModal = true
                        }
                    }
                } else {
                    for (let i = 0; i < this.attrList.length; i++) {
                        if (this.attrList[i].addStockNum != 0) {
                            showModal = true
                        }
                    }
                }
                
                if (!showModal) {
                    uni.navigateBack({
                        delta: 1
                    })
                } else {
                    uni.showModal({
                        title: this.language.showModal.hint,
                        content: this.language.showModal.submit,
						confirmText: this.language.showModal.confirm,
						cancelText: this.language.showModal.cancel,
                        success: (res) => {
                            if (res.confirm) {
                                this._sub()
                            } else {
                                uni.navigateBack({
                                    delta: 1
                                })
                            }
                        }
                    })
                }
            },
            checkNum (e, attr, index) {
                if (Number(e.target.value < 0)) {
                    if (Math.abs(e.target.value) >= attr.stock) {
                        uni.showToast({
                            title: this.language.addStock.tips[0],
                            duration: 1500,
                            icon: 'none'
                        })
                        attr.addStockNum = 0
                    }
                }
            },
            _sub () {
                if (!this.fastTap) {
                    return
                }
                this.fastTap = false
                var changeNum = []
                if (this.attrList[0].length > 1) {
                    for (var i = 0; i < this.attrList.length; i++) {
                        changeNum.push(this.attrList[i][0].addStockNum)
                    }
                } else {
                    for (var i = 0; i < this.attrList.length; i++) {
                        changeNum.push(this.attrList[i].addStockNum)
                    }
                }

                changeNum = changeNum.join(',')
                // const attributeInfos = [
                //     {
                //         id:this.shop_id,
                //         pid:this.p_id,
                //         num:changeNum
                //     }
                // ]
                this.$req.post({
                    data: {
                        
                        shop_id: this.shop_id,
                        module: 'app',
                        action: 'mch',
                        // p_id: this.p_id,
                        m: 'up_stock',
                        number: changeNum,
                        attributeInfo: JSON.stringify([
                            {
                                id:this.attrList[0].cid,
                                pid:this.p_id,
                                num:changeNum
                            } 
                        ])
                    }
                }).then(res=>{
                    let { code, data, message } = res;
                    this.fastTap = true
                    if (code == 200) {
                        uni.showToast({
                            title: this.language.addStock.tips[1],
                            duration: 1500,
                            icon: 'none'
                        })
                        setTimeout(function () {
                            uni.navigateBack({
                                delta: 1
                            })
                        }, 1500)
                    } else {
                        uni.showToast({
                            title: message,
                            duration: 1500,
                            icon: 'none'
                        })
                    }
                }).catch(error=>{
                    this.fastTap = true
                })
            },
            _axios () {
                this.$req.post({
                    data: {
                        
                        shop_id: this.shop_id,
                        module: 'app',
                        action: 'mch',
                        p_id: this.p_id,
                        m: 'up_stock_page',
                    }
                }).then(res=>{
                    let { code, data, message } = res;
                    if (code == 200) {
                        this.attr = data.attr
                        this.attrList = data.attrList
                    } else {
                        uni.showToast({
                            title: message,
                            icon: 'none',
                            duration: 1500
                        })
                    }
                })
            }
        },
        computed: {
            tableList: function () {
                if (this.attr.length == 0) {
                    var width = 750
                    return uni.upx2px(width) + 'px'
                } else {
                    var width = this.tableWidth * 2 + 130 * 5
                    return uni.upx2px(width) + 'px'
                }
            },
            halfWidth: function () {
                var gru = uni.getStorageSync('data_height') ? uni.getStorageSync('data_height') : this.$store.state.data_height
                var heigh = parseInt(gru)
                var he = heigh * 2
                return uni.upx2px(he) + 'px'
            }
        },
    }
</script>

<style lang="less">
    @import url("../../static/css/myStore/addStock.less");
</style>
