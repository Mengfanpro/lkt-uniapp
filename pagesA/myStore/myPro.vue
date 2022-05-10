<template>
    <div style="min-height: 100vh;width: 100vw;overflow: hidden;" :style="{backgroundColor: list.length == 0?'#ffffff':'#F6F6F6'}">
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <heads :title="language.myPro.title"></heads>
        <div class="relative">
            <div class="topTabBar">
                <div class="width_50" @tap="changeTabBar(true)"><div :class="{ active: topTabBar }">{{language.myPro.tabList[0]}}</div></div>
                <div class="width_50" @tap="changeTabBar(false)"><div :class="{ active: !topTabBar }">{{language.myPro.tabList[1]}}</div></div>
            </div>

            <template v-if="loadFlag">
                <ul class="goodsList" v-if="topTabBar">
                    <template v-if="list.length > 0">
                        <li class="proList" v-for="(item, index) in list" :key="index">
                            <div class="proListUp">
                                <div class="proListUpLeft"><img :src="item.imgurl" /></div>
                                <div class="proListUpRight">
                                    <div class="proTitle">{{ item.product_title }}</div>
                                    <div class="proSellData" @tap="_checkDetail(item.id)">
                                        <div class="sellMoney font_24">￥{{ item.price.toFixed(2) }}</div>
                                        <div class="font_24" :class="{ redColor:item.num < item.stockWarn }">{{language.myPro.kucun}}{{ item.num }}</div>
                                        <div class="font_24">{{language.myPro.volume}}{{ item.volume }}</div>
                                    </div>
                                    <div class="proStatus" v-if="item.status == 2">{{language.myPro.beenOn}}</div>
                                    <div class="proStatus" v-if="item.status == 3">{{language.myPro.shelves}}</div>
                                    <div class="proStatus" v-if="item.status == 1">{{language.myPro.notOn}}</div>
                                </div>
                            </div>
                            <div class="proListDown">
                                <div class="proBtn" v-if="item.status != 2" @tap="_delPro(item.id)">{{language.myPro.delPro}}</div>
                                <div class="proBtn" @tap="_addStock(item.id)">{{language.myPro.stock}}</div>
                                <div class="proBtn" v-if="item.status == 2" @tap="_upDownPro(item.status, item.id)">{{language.myPro.downPro}}</div>
                                <div class="proBtn" v-else @tap="_upDownPro(item.status, item.id)">{{language.myPro.upPro}}</div>
                                <div class="proBtn" v-if="item.status != 2" @tap="_reEditor(item.id)">{{language.myPro.edit}}</div>
                            </div>
                        </li>
                    </template>
                    <li class="proList proList_no" v-if="list.length == 0">
                        <img :src="noPro" alt="">
                        <p>{{language.myPro.noGoods}}</p>
                        <div @tap="toAddPro">{{language.myPro.toAdd}}</div>
                    </li>
                    <uni-load-more v-if="list.length > 10" :loadingType="loadingType"></uni-load-more>
                </ul>
                <ul v-else>
                    <template v-if="list.length > 0">
                        <li class="proList" v-for="(item, index) in list" :key="index">
                            <div class="proListUp">
                                <div class="proListUpLeft"><img :src="item.imgurl" /></div>
                                <div class="proListUpRight" @tap="_checkDetail(item.id)">
                                    <div class="proTitle">{{ item.product_title }}</div>
                                    <div class="proSellData">
                                        <div class="sellMoney font_24">￥{{ item.price.toFixed(2) }}</div>
                                        <div class="font_24">{{language.myPro.kucun}}{{ item.num }}</div>
                                    </div>
                                    <div class="proStatus" v-if="item.mch_status == 1">{{language.myPro.inReview}}</div>
                                    <div class="proStatus" v-else-if="item.mch_status == 2">{{language.myPro.approve}}</div>
                                    <div class="proStatus" v-else-if="item.mch_status == 3">
                                        {{language.myPro.failAudit}}
                                        <text>：{{ item.refuse_reasons }}</text>
                                    </div>
                                    <div class="proStatus" v-else>{{language.myPro.noAudit}}</div>
                                </div>
                            </div>
                            <div class="proListDown">
                                <div class="proBtn" @tap="_delPro(item.id)" v-if="item.mch_status == 3 || item.mch_status == 4">{{language.myPro.delPro}}</div>
                                <div class="proBtn" @tap="_reEditor(item.id)" v-if="item.mch_status == 3 || item.mch_status == 4">{{language.myPro.edit}}</div>
                                <div class="proBtn" @tap="_checkStatus(item.id)" v-if="item.mch_status == 1">{{language.myPro.cancelAudit}}</div>
                                <div class="proBtn" @tap="_checkStatus(item.id)" v-if="item.mch_status == 4">{{language.myPro.submitAudit}}</div>
                            </div>
                        </li>
                    </template>
                    <li class="proList proList_no" v-if="list.length == 0">
                        <img :src="noPro" alt="">
                        <p>{{language.myPro.noGoods}}</p>
                        <div @tap="toAddPro">{{language.myPro.toAdd}}</div>
                    </li>
                    <uni-load-more v-if="list.length > 10" :loadingType="loadingType"></uni-load-more>
                </ul>
            </template>
        </div>
        <div class="mask" v-if="mask_display1">
            <div class="mask_cont">
                <p>{{language.myPro.addStockDisc}}</p>
                <input type="number" v-model="addStockNum" :placeholder="language.myPro.addStockDisc" :placeholder-style="placeStyle" />
                <div class="mask_button">
                    <div class="mask_button_left" @tap="_cancel()">{{language.myPro.cancel}}</div>
                    <div @tap="_confirm()">{{language.myPro.confirm}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            addStockNum: '',
            mask_display1: false,
            title: '我的商品',
            
            topTabBar: true,
            testImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/yhqBg.png',
            noPro: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/noPro.png',
            fastTap: true,
            shop_id: '',
            list: [],
            page: 1,
            pro_id: '',
            type: 1,
            placeStyle: 'color:#b8b8b8;font-size:28upx',
            loadFlag: false,
            
            up1: false,
            up2: false
        };
    },
    onLoad(option) {
        this.shop_id = uni.getStorageSync('shop_id') ? uni.getStorageSync('shop_id') : this.$store.state.shop_id;
        
        this.up1 = uni.getStorageSync('_up1')
        this.up2 = uni.getStorageSync('_up2')
    },
    onShow() {
        this.isLogin(()=>{})

        this._axios();
    },
    onReachBottom: function() {
        this.page += 1;
        var data = {
            module: 'app',
            action: 'mch',
            m: 'my_merchandise_load',
            
            shop_id: this.shop_id,
            page: this.page
        };
        if (this.topTabBar) {
            //判断获取哪种商品
            data.type = 1;
        } else {
            data.type = 2;
        }

        if (this.list.length > 0) {
            this.$req.post({ data }).then(res => {
                let { code, data, message } = res;
                
                if (code == 200) {
                    if (data.list.length > 0) {
                        this.list = this.list.concat(data.list);
                        this.loadingType = 0;
                    } else {
                        this.loadingType = 2;
                    }
                } else {
                    uni.showToast({
                        title: message,
                        duration: 1500,
                        icon: 'none'
                    });
                }
            });
        }
    },
    methods: {
        toAddPro(){
            if(this.up1){
                uni.navigateTo({
                    url: '/pagesA/myStore/choose_shopping'
                })
            }else if(this.up2){
                uni.navigateTo({
                    url: '/pagesA/myStore/uploadPro'
                })
            }
        },
        changeLoginStatus() {
            this._axios();
        },
        _cancel() {
            this.mask_display1 = false;
            this.addStockNum = '';
        },
        _checkStatus(id) {
            if (!this.fastTap) {
                return;
            }
            this.fastTap = false;

            this.$req
                .post({
                    data: {
                        
                        module: 'app',
                        action: 'mch',
                        m: 'submit_audit',
                        shop_id: this.shop_id,
                        p_id: id
                    }
                })
                .then(res => {
                    let { code, data, message } = res
                    if (code == 200) {
                        uni.showToast({
                            title: this.language.myPro.success,
                            duration: 1500,
                            icon: 'none'
                        });
                        setTimeout(() => {
                            this.fastTap = true;
                            this._axios();
                        }, 1500);
                    } else {
                        uni.showToast({
                            title: message,
                            duration: 1500,
                            icon: 'none'
                        });
                        this.fastTap = true;
                    }
                })
                .catch(error => {
                    this.fastTap = true;
                });
        },
        _reEditor(p_id) {
            uni.navigateTo({
                url: '/pagesA/myStore/uploadPro?pageStatus=editor&p_id=' + p_id
            });
        },
        _addStock(id) {
            uni.navigateTo({
                url: 'addStock?p_id=' + id
            });
        },
        _upDownPro(type, id) {
            if (!this.fastTap) {
                return;
            }
            this.fastTap = false;

            this.$req
                .post({
                    data: {
                        
                        module: 'app',
                        action: 'mch',
                        m: 'my_merchandise_status',
                        shop_id: this.shop_id,
                        status: type,
                        p_id: id
                    }
                })
                .then(res => {
                    let { code, data, message } = res;
                    
                    uni.showToast({
                        title: message,
                        duration: 1500,
                        icon: 'none'
                    });
                    
                    if (code == 200) {
                        setTimeout(() => {
                            this.fastTap = true;
                            this._axios();
                        }, 1500);
                    } else {
                        this.fastTap = true;
                    }
                })
                .catch(error => {
                    this.fastTap = true;
                });
        },
        _delPro(id) {
            
            uni.showModal({
                title: this.language.showModal.hint,
                content: this.language.showModal.delPro,
				confirmText: this.language.showModal.confirm,
				cancelText: this.language.showModal.cancel,
                success:(e)=>{
                    if(e.confirm){
                        if (!this.fastTap) {
                            return;
                        }
                        this.fastTap = false;
                        
                        this.$req
                            .post({
                                data: {
                                    
                                    module: 'app',
                                    action: 'mch',
                                    m: 'del_my_merchandise',
                                    shop_id: this.shop_id,
                                    p_id: id
                                }
                            })
                            .then(res => {
                                let { code, data, message } = res;
                                if (code == 200) {
                                    uni.showToast({
                                        title: this.language.myPro.delSuccess,
                                        duration: 1500,
                                        icon: 'none'
                                    });
                                    setTimeout(() => {
                                        this.fastTap = true;
                                        this._axios();
                                    }, 1500);
                                } else {
                                    uni.showToast({
                                        title: message,
                                        duration: 1500,
                                        icon: 'none'
                                    });
                                    this.fastTap = true;
                                }
                            })
                            .catch(error => {
                                this.fastTap = true;
                            });
                    }
                }
            })
            
        },
        _checkDetail(id) {
            uni.navigateTo({
                url: '/pagesA/myStore/uploadPro?pageStatus=see&p_id=' + id
            });
        },
        changeTabBar(type) {
            if (type) {
                this.topTabBar = true;
            } else {
                this.topTabBar = false;
            }
            this.list = [];
            this.loadingType = 0;
            this.page = 1;
            this.loadFlag = false;
            this._axios();
        },
        _axios() {
            uni.showLoading({
                title: this.language.toload.loading
            });
            if (this.topTabBar) {
                //判断获取哪种商品
                this.type = 1;
            } else {
                this.type = 2;
            }

            this.$req
                .post({
                    data: {
                        module: 'app',
                        action: 'mch',
                        m: 'my_merchandise',
                        
                        shop_id: this.shop_id,
                        type: this.type
                    }
                })
                .then(res => {
                    let { code, data, message } = res
                    this.loadFlag = true;
                    uni.hideLoading();
                    if (code == 200) {
                        this.list = data.list;
                    } else {
                        uni.showToast({
                            title: message,
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
@import url('../../static/css/myStore/myPro.less');
</style>
