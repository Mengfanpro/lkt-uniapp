<template>
    <div class='box'>
        <!-- #ifndef MP-ALIPAY -->
        <heads :title="language.collection.title"></heads>
        <!-- #endif -->
        
        <div class='bg_F6' v-if="!navActive && collection1.length">
            <p v-if='collection.length&&navType == 1' class='manege' @tap='_state' :class="{'active':!collection1.length}">{{state}}</p>
            <p v-if='!loadFlag || (collection.length&&navType == 2)' class='manege' @tap='_state' :class="{'active':!collection.length}">{{state}}</p>
        </div>
        <div class='bg_F6' v-else>
            <p v-if='collection1.length&&navType == 1' class='manege' @tap='_state' :class="{'active':!collection1.length}">{{state}}</p>
            <p v-if='collection1.length&&navType == 2' class='manege' @tap='_state' :class="{'active':!collection.length}">{{state}}</p>
        </div>
        
        <view class="twins">
            <view class="nav_twin" :class='{"nav_twin_hover": navActive}' @tap="changeNav(true,1)">
                {{language.collection.commodity_collection}}
                <view class="nav_line" v-if="navActive"></view>
            </view>
            <view v-if='mch_status' class="nav_twin" :class='{"nav_twin_hover": !navActive}' @tap="changeNav(false,2)">
                {{language.collection.shop_collection}}
                <view class="nav_line" v-if="!navActive"></view>
            </view>
        </view>

        <template v-if="loadFlag">
            <!--收藏商品展示模块-->
            <view class="" v-if="navActive==true" style="flex: 1;overflow: scroll;">
                <ul v-if='collection1.length'>

                    <li v-for='(item,index) in collection1' :key="item.p_id" class="list_li">
                        
                        <div class="list_imgBox" @tap="_checkedOne(item, index)" v-if='statevalue'>
                            <img class='quan_img list_img' :src="display_img1[index] ? quan_hei:quan_hui"/>
                        </div>
                        
                        <div class="logoBox">
                            <img :src="item.imgurl" @tap="_goods(item.p_id,item.recycle,item.isPreGood)"/>
                            
                            <div v-if="item.recycle == 1">{{language.collection.isDel}}</div>
                        </div>
                        
                        <view :class="statevalue ? 'sc_right_X':'sc_right_Y' " @tap="_goods(item.p_id,item.recycle,item.isPreGood)">
                            <div class='describe' :class='{left:statevalue}'>
                                 <span class="preSale_tag" v-if="item.isPreGood" >{{language.goods.goods.presale}}</span>
                                 <span>{{item.product_title}}</span>
                            </div>
                            <view class="dp_css">
                                {{language.collection.shop}}：{{item.mch_name}}
                            </view>
                            <div class='collection_button' v-if="!is_grade">
                                <span class="span_b1">￥{{ item.vip_yprice.toFixed(2) }}</span>
                              <!--  <span class="span_b2 vip_price">{{ language.shoppingCart.vipPrice }} {{item.vip_price.toFixed(2)}}</span> -->
                                <div @tap.stop="_find(item.p_id)">{{language.collection.be_similar}}</div>
                            </div>
                            <div class='collection_button' v-else>
                                <span class="span_b1">￥{{item.vip_price.toFixed(2)}}</span>
                                <span class="span_b2">￥{{ item.vip_yprice.toFixed(2) }}</span>
                                <div @tap.stop="_find(item.p_id)">{{language.collection.be_similar}}</div>
                            </div>
                        </view>
                    </li>
                    <li style="height: 98rpx;"></li>
                </ul>
                <div class='noFindDiv' v-else>
                    <div>
                        <img :src='noCol' class='noFindImg'/>
                    </div>
                    <p class='noFindText'>{{language.collection.commodity_Tips}}</p>
                </div>
            </view>

            <!--收藏店铺展示模块-->
            <view class="" v-else>
                <ul v-if='collection.length'>
                    <li class="list_li" v-for='(item,index) in collection' :key="index" @tap="navTo('/pagesA/store/store?shop_id=' + item.mch_id)">
                        <div class="list_imgBox" @tap.stop="_checkedOne(item, index)" v-if='statevalue'>
                            <img class='quan_img list_img1' :src="display_img[index] ? quan_hei:quan_hui"/>
                        </div>
                        <img class="dp_img" :src="item.img"></img>
                        <view class="dp_con">
                            <view class="dp_con1">
                                {{item.mch_name}}
                            </view>
                            <view class="dp_con2">
                                {{item.collection_num}}{{language.collection.people_collection}}
                            </view>
                        </view>
                        <image class="dp_right" :src="toImage"></image>
                    </li>
                </ul>
                <div class='noFindDiv' v-else>
                    <div>
                        <img :src='noCol' class='noFindImg'/>
                    </div>
                    <p class='noFindText'>{{language.collection.shop_Tips}}</p>
                </div>
            </view>


            <!--点击管理后显示的全选和删除模块-->
            <div class='del' v-if='statevalue&&navType==1'>
                <div class='del_sele' @tap="_selectAll">
                    <img class='quan_img' :src="selectAll1 ? quan_hei : quan_hui"/>
                    <span>{{language.collection.Select_all}}</span>
                </div>
                <div class='del_div' @tap="_delete">{{language.collection.Cancel_collection}}</div>
            </div>
            <div class='del' v-else-if='statevalue'>
                <div class='del_sele' @tap="_selectAll">
                    <img class='quan_img' :src="selectAll ? quan_hei : quan_hui"/>
                    <span>{{language.collection.Select_all}}</span>
                </div>
                <div class='del_div' @tap="_delete">{{language.collection.Cancel_collection}}</div>
            </div>
        </template>
    </div>
</template>

<script>
    import {
        mapMutations
    } from 'vuex'

    export default {
        data () {
            return {
                noCol: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/noCol.png',
                toImage: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jiantou2x.png',
                collection: [], //收藏商品数据
                collection1: [], //收藏商品数据
                state: '编辑', //管理与完成的切换
                statevalue: false, //管理与完成的状态值
                selectvalue: '', //单选的状态值
                selectvalue1: '', //单选的状态值
                selectAll: '', //全选的状态值
                selectAll1: '', //全选的状态值
                selectArray: [], //单选数据存储
                selectArray1: [], //单选数据存储
                deletecolle: {}, //删除商品
                grade: 0,
                quan_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/xuanzehui2x.png',
                quan_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/xuanzehei2x.png',
                display_img: [], //圆圈的选中状态
                display_img1: [], //圆圈的选中状态
                flag: true,
                fastTap: true,
                navActive: true,
                navType: 1,
                is_grade:false,

                loadFlag: false,
                mch_status: false
            }
        },
        onLoad () {
           
            this.navType = 1
        },
        onShow () {
            this.state = this.language.collection.edit
            this._axios()
        },
        computed: {
            // is_grade () {
            //     console.log(this.grade);
            //     return this.grade > 0;
            // }
        },
        methods: {
            _goStore (shop_id) {
                uni.navigateTo({
                    url: '/pagesA/store/store?shop_id=' + shop_id.mch_id
                })
            },
            _find (id) {
                this.pro_id(id)
                uni.navigateTo({
                    url: 'discover?pro_id=' + id
                })
            },
            _back () {
                this.flag = false
                uni.navigateBack({
                    delta: 1
                })
            },
            _state () {
			    if (!this.loadFlag) return false;
                if (this.collection1.length || this.collection.length) {
                    this.selectAll = ''
                    this.selectAll1 = ''
                    this.statevalue = !this.statevalue
                    if (this.statevalue) {
                        this.state = this.language.collection.complete
                    } else {
                        this.state = this.language.collection.edit
                    }
                } else {
                    this.statevalue = !this.statevalue
                    if (this.statevalue) {
                        this.state = this.language.collection.complete
                    } else {
                        this.state = this.language.collection.edit
                    }
                }
            },
            _axios () {
                var data = {
                    module: 'app',
                    action: 'addFavorites',
                    app: 'collection',
                    
                    type: this.navType
                }
                
                this.$req.post({data}).then(res=>{
                    this.loadFlag = true
                    
                    if (res.code == 200) {
                        if (this.navType == 1) {
                            this.collection1 = res.data.list
                            this.mch_status = res.data.mch_status
                            console.log(this.mch_status)
                            console.log('=')
                            // if (res.grade) {
                            //     this.grade = Number.parseInt(res.data.grade) 
                            // } else {
                            //     this.grade = 0
                            // }
                            
                            this.is_grade = res.data.isGrade
                            
                        } else {
                            try {
                                if (Array.isArray(res.data)) {
                                    this.collection = res.data;    
                                } else {
                                    this.collection = res.data.list    
                                }
                                
                            } catch (e) {
                                console.log(e)
                                this.collection = [];
                            }
                        }
                    } else {
                        this.collection = ''
                        uni.showToast({
                            title: res.message,
                            duration: 1500,
                            icon: 'none'
                        })
                    }
                })
                
            },

            // 点击切换导航条
            changeNav (flag, type) {
                this.statevalue = false
                this.state = '编辑'
                this.navActive = flag
                this.navType = type
                this.loadFlag = false
                this._axios()
            },

            //单选
            _checkedOne (item, indexli) {
                if (this.navType == 1) {
                    var cum = this.selectArray1.findIndex(items=>item.id==items.id)
                    //判断点击的传入的值是否存在数组中，如果没有添加，如果有删除，同时设定选中状态（第一次点击添加进数组，第二次点击从数组中删除）
                    if (this.statevalue) {
                        var img = this.$refs.img
                        if (cum < 0) {
                            this.selectArray1.push(item)
                            this.$set(this.display_img1, indexli, true)
                        } else {
                            this.selectArray1.splice(cum, 1)
                            this.$set(this.display_img1, indexli, false)
                        }
                        //根据产品选状态，设定全选状态
                        if (this.selectArray1.length == this.collection1.length) {
                            this.selectAll1 = true
                        } else {
                            this.selectAll1 = false
                        }
                    }
                } else {
                    var cum = this.selectArray.findIndex(items=>item.id==items.id)
                    //判断点击的传入的值是否存在数组中，如果没有添加，如果有删除，同时设定选中状态（第一次点击添加进数组，第二次点击从数组中删除）
                    if (this.statevalue) {
                        var img = this.$refs.img
                        if (cum < 0) {
                            this.selectArray.push(item)
                            this.$set(this.display_img, indexli, true)
                        } else {
                            this.selectArray.splice(cum, 1)
                            this.$set(this.display_img, indexli, false)
                        }
                        //根据产品选状态，设定全选状态
                        if (this.selectArray.length == this.collection.length) {
                            this.selectAll = true
                        } else {
                            this.selectAll = false
                        }
                    }
                }
            },
            _selectHandle (obj) {
                obj.selectAll1 = !obj.selectAll1
                var img = this.$refs.img
                //根据全选状态，设定商品选中状态
                if (obj.selectAll1) {
                    for (var i = 0; i < obj.collection1.length; i++) {
                        this.$set(obj.selectArray1, i, obj.collection1[i])
                        this.$set(obj.display_img1, i, true)
                    }
                } else {
                    obj.selectArray1 = []
                    for (var i = 0; i < obj.collection1.length; i++) {
                        this.$set(obj.display_img1, i, false)
                    }
                }
                return obj
            },
            //全选
            _selectAll () {
                if (this.navType == 1) {
                    var obj = {
                        selectAll1: this.selectAll1,
                        display_img1: this.display_img1,
                        selectArray1: this.selectArray1,
                        collection1: this.collection1
                    }

                    obj = this._selectHandle(obj)
                    this.selectAll1 = obj.selectAll1

                } else {
                    var obj = {
                        selectAll1: this.selectAll,
                        display_img1: this.display_img,
                        selectArray1: this.selectArray,
                        collection1: this.collection
                    }
                    obj = this._selectHandle(obj)
                    this.selectAll = obj.selectAll1
                }

            },
            //删除
            _delete () {
                if (!this.fastTap) {
                    return
                }
                this.fastTap = false
                if (this.selectArray1.length || this.selectArray.length) {
                    this.deletecolle.collection = ''
                    this.deletecolle.access_id = this.access_id
                    if (this.navType == 1) {
                        this.selectArray1.forEach((item, index)=>{
                            this.deletecolle.collection += item.id + ','
                        })
                    } else {
                        this.selectArray.forEach((item, index)=>{
                            this.deletecolle.collection += item.id + ','
                        })
                    }
                    
                    this.deletecolle.module = 'app'
                    this.deletecolle.action = 'addFavorites'
                    this.deletecolle.app = 'removeFavorites'

                    var data = this.deletecolle
                    
                    this.$req.post({data}).then(res=>{
                        this.fastTap = true
                        var s1 = []
                        var s = []
                        if (res.code == 200) {
                        
                            var itemIds = this.deletecolle.collection
                            for (var x in itemIds) {
                        
                                if (this.navType == 1) {
                                    this.selectArray1.forEach(function (item, index) {
                                        if (itemIds[x] != item.id) {
                                            s1.push(item)
                                        }
                                    })
                                    this.selectArray1 = s1
                                } else {
                                    this.selectArray.forEach(function (item, index) {
                                        if (itemIds[x] != item.id) {
                                            s.push(item)
                                        }
                                    })
                                    this.selectArray = s
                                }
                            }
                            this.display_img1 = []
                            for (var i = 0; i < this.collection1.length; i++) {
                                this.display_img1.push(false)
                            }
                            this.display_img = []
                            for (var i = 0; i < this.collection.length; i++) {
                                this.display_img.push(false)
                            }
                            var tips = '';
                            if(this.language.collection.edit=="编辑"){
                                 tips = res.message
                            }else{
                                 tips= this.language.collection.Cancelled_successfully
                            }
                            uni.showToast({
                                title: tips,
                                duration: 1500,
                                icon: 'none',
                                success: ()=>{
                                    setTimeout(()=>{
                                        this.loadFlag = false
                                        this.collection = []
                                        this.collection1 = []
                                        this._axios()
                                        this.selectArray1 = []
                                        this.statevalue = !this.statevalue
                                        this.state = this.language.collection.edit
                                    }, 1500)
                                }
                            })
                        
                        } else {
                            uni.showToast({
                                title: res.message,
                                duration: 1500,
                                icon: 'none'
                            })
                        }
                        for (var i = 0; i < this.display_img.length; i++) {
                            this.$set(this.display_img1, i, false)
                        }
                    }).catch(error=>{
                        this.fastTap = true
                    })
                    
                } else {
                    this.fastTap = true
                    uni.showToast({
                        title: this.language.collection.commodity_delete,
                        duration: 1000,
                        icon: 'none'
                    })
                }
            },
            _goods (id, recycle,isPreGood) {
                if(recycle == 1){
                    return
                }
                this.pro_id(id)
                if(isPreGood){
                    uni.navigateTo({
                        //url: '/pagesC/preSale/goodsDetailed',
                        url: '/pagesC/webView/preSale?id=' + id
                    })
                }else{
                    uni.navigateTo({
                        url: '../goods/goodsDetailed'
                    })
                }
               
            },
            ...mapMutations({
                pro_id: 'SET_PRO_ID'
            }),
        },
        components: {}

    }
</script>

<style lang="less" scoped>
    @import url("../../static/css/collection/collection.less");
</style>
