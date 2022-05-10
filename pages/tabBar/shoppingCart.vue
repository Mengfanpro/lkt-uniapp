<template>
    <div class="order_ii cart-order-li" ref="cart">
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        
        <!-- #ifdef MP -->
        <heads :title="language.shoppingCart.title" :border="true" :returnFlag="true"  ishead_w="1"></heads>
        <!-- #endif -->

        <!-- #ifndef MP -->
        <div :style="{ height: halfWidth }" class="data_h">
            <div :style="{ height: halfWidth }" class="data_h_h"></div>
        </div>
        <!-- #endif -->

        <div style="position: relative;">
            <!-- #ifndef MP -->
            <div class="page_title">
                <div :style="{ top: halfWidth }" class="header">
                    <span class="span">{{language.shoppingCart.title}}</span>
                    <div @tap="_manage" v-if="goods.length && manage_text == '编辑'">{{language.shoppingCart.topRight1}}</div>
                    <div @tap="_manage" v-else-if="goods.length && manage_text != '编辑'">{{language.shoppingCart.topRight2}}</div>
                </div>
            </div>
            <!-- #endif -->
            <!-- 目前无虚拟商品逻辑
            <div class="tabs">
                <div :class="{active: commodity_type == 0}" @tap="changeTab(0)">{{language.shoppingCart.rgoods}}</div>
                <div :class="{active: commodity_type == 1}" @tap="changeTab(1)">{{language.shoppingCart.vgoods}}</div>
            </div>
            -->
            <div class="hr"></div>
            
            <!-- #ifdef MP -->
            <div @tap="_manage" class="statusDiv" v-if="goods.length && manage_text == '编辑'">{{ language.shoppingCart.topRight1 }}</div>
            <div @tap="_manage" class="statusDiv" v-else-if="goods.length && manage_text != '编辑'">{{ language.shoppingCart.topRight2 }}</div>
            <!-- #endif -->

            <view class="skeleton cart-wrap " :style="{paddingBottom: paddingBottom}" style="margin-top: -22rpx;">
                <div class="loginDiv" v-if="!access_id1 && !nrlflag">
                    <div class="loginText skeleton-rect">{{language.shoppingCart.unLoginText}}</div>
                    <div @tap="toLogin()" class="loginBtn skeleton-circle">{{language.shoppingCart.unLoginBtn}}</div>
                </div>


                <!--  有商品时显示   -->
                <ul class="goods" v-if="goods.length && load">
                    <!-- 店铺名称 -->
                    <div :key="index1" v-for="(item1, index1) in mch_list">
                        <!-- 店铺之间分割线 -->
                        <div class="hr" v-if="index1 > 0"></div>
                        <div :key="'a' + item1.index1" class="shop-name">
                            <image :src="display_img1[index1] ? quan_hei : quan_hui" @tap="_selectAllStore(item1, index1)"
                                   class="img1"></image>
                            <image :src="store" class="img2"></image>

                            <p @tap="toStore(item1.id)">{{ item1.name }}</p>
                            <span @tap="toStore(item1.id)"><image :src="jiantou2x" class="img3"></image></span>
                        </div>
                        <view class="line">
                            <view class="line-gray"></view>
                        </view>

                        <template v-for="(item, index) in goods">
                            <li :key="index" v-if="item1.id === item.mch_id">
                                <img v-if="item.stock>0" :src="display_img[index] ? quan_hei : quan_hui" @tap="_checkedOne(item, index, item1, index1)"
                                     class="store_img1"/>
                                <img id="gray_img" v-else :src="display_img[index] ? quan_hei : quan_hui" @tap="_checkedOne(item, index, item1, index1)" class="store_img1" :class="[manage ? 'active' : '']"  style="border-radius: 50%;"/>

                                <div class="store_img"><img :src="item.imgurl" @tap="_goodsDetailed(item.pid)"
                                                            class="goods_img"/></div>

                                <div class="goods_right">
                                    <div>
                                        <p @tap="_goodsDetailed(item.pid)" class="good_name">{{ item.pro_name }}</p>
                                        <div @tap="_mask_display(item.stock, item.price, item.imgurl, item.id, item.attribute_id, item.num)"
                                             class="goodDetail">
                                            <div :key="index5" v-for="(item5, index5) in item.skuBeanList">{{ item5.name
                                                }}
                                            </div>
                                            <img :src="jianX" class="img_X"/>
                                        </div>
                                    </div>

                                    <div class="goods_bottom" v-if="item.stock>0">
                                        <p class="black">
                                            <span class="price">￥</span>
                                            <span class="price1">{{ item.price.toFixed(2) }}</span>
                                        </p>
                                        <div class="goods_mun">
                                            <span class="border-right"><img :src="item.num == 1 ? jian_hui : jian_hei"
                                                                            @tap="_reduce(index, item.id)"/></span>
                                            <!-- <span class="show_num" v-if="item.num == 1">{{item.num}}</span> -->
                                            <input ref="inputs" type="text" @blur="noEmptyandzero(item,index)" @input="changeNumb(item,index)" min="1" max="200"  v-model.trim="item.num" style="width: 80rpx;min-width: 80rpx;text-align: center;color: #020202;font-size: 28rpx;">

                                            <span class="border-left"><img :src="item.num >= 1 ? jia_hei : jia_hui"
                                                                           @tap="_add(index, item.stock, item.id)"/></span>
                                        </div>
                                    </div>
                                    
                                    <div class="goods_bottom noStock" v-else>
                                        {{language.shoppingCart.noStockDisc}}
                                    </div>
                                </div>

                                <view class="line line-top">
                                    <view class="line-gray"></view>
                                </view>
                            </li>
                        </template>
                    </div>
                </ul>
                
                <!--  失效商品   -->
                <ul class="goods" v-if="noStockList.length && load">
                    <!-- 店铺名称 -->
                    <div>
                        <!-- 店铺之间分割线 -->
                        <div class="hr"></div>
                        <div class="shop-name">
                            <div class="noStockTitle">
                                {{language.shoppingCart.failureGood}}
                                ({{noStockList.length}})
                            </div>
                            <p class="noStockClear" @tap="clearNoStock">{{language.shoppingCart.clearFailure}}</p>
                        </div>
                        <view class="line">
                            <view class="line-gray"></view>
                        </view>
                
                        <template v-for="(item, index) in noStockList">
                            <li :key="index" @tap="_goodsDetailed(item.pid)">
                                <div class="failureIcon">{{language.shoppingCart.failure}}</div>
                                
                                <div class="store_img" style="margin-left: 0;"><img :src="item.imgurl" class="goods_img"/></div>
                
                                <div class="goods_right">
                                    <div>
                                        <p class="good_name" style="color: #999999;">{{ item.pro_name }}</p>
                                        <div class="goodDetail" style="padding: 0;background-color: transparent;width: auto;">
                                            <div :key="index5" v-for="(item5, index5) in item.skuBeanList" style="width: 300rpx;">{{ item5.name
                                                }}
                                            </div>
                                        </div>
                                    </div>
                
                                    <div class="goods_bottom noStock" style="color: #020202;">
                                        {{ item.stock == 0 ? language.shoppingCart.soldOut1 : language.shoppingCart.proDown }}
                                    </div>
                                </div>
                
                                <view class="line line-top">
                                    <view class="line-gray"></view>
                                </view>
                            </li>
                        </template>
                    </div>
                </ul>


                <div :style="{ marginBottom: h5Height }" class="bottom" v-if="goods.length && load">
                    <div @tap="_selectAll" class="bottom_left">
                        <img :src="selectAll ? quan_hei : quan_hui" class="quan_img"/>
                        <span>{{ language.shoppingCart.checkAll }}</span>
                    </div>
                    <div class="bottom_right">
                    <span class="span" v-if="manage">
                        {{ language.shoppingCart.combined }}
                        <span class="red" style="font-size: 34rpx;font-weight: bold;line-height: 28rpx;display: inline-block;">
                            <span style="display: inline-block;font-size: 26rpx;line-height: 22rpx;">￥</span>
                            {{ total }}
                        </span>
                    </span>
                        <div @tap="_delete">
                            <template v-if="manage_text == '编辑'">{{ language.shoppingCart.settlement }}</template>
                            <template v-else>{{ language.shoppingCart.delBtn }}</template>

                            <span v-if="manage_text == '编辑'">({{ count }})</span>
                        </div>
                    </div>
                </div>
                
                
                <!--  没有商品时显示   -->
                <div class="empty skeleton-rect" v-if="noStockList.length==0 && !goods.length">
                    <img :src="kong"/>
                    <p>{{language.shoppingCart.noShop}}</p>
                    <div @tap="toHome()" class="toHomeBtn">{{language.shoppingCart.noShopBtn}}</div>
                </div>


                <div v-if="list.length > 0" class="discover_tj skeleton-rect" style="padding-top: 36rpx;">
                    <div class="discover_left skeleton-rect"><i></i></div>
                    <p class="">{{language.shoppingCart.recommend}}</p>
                    <div class="discover_right skeleton-rect"><i></i></div>
                </div>
                
                <template v-if="load">
                    <ul class="allgoods">
                        <li :key="index" @tap="_goods(items.id)" class="allgoods_li" v-for="(items, index) in list"
                            v-if="load">
                            <div class="proImgBox">
                                <img :src="items.imgurl" class="allgoods_li_img"/>
                                <div class="dowmPro" v-if="items.status == 3">
                                    {{ language.shoppingCart.takeDown }}
                                </div>
                                <div class="dowmPro" v-else-if="items.num == '0' || items.num == 0">
                                    {{ language.shoppingCart.soldOut }}
                                </div>
                            </div>
                            <p class="allgoods_li_title">{{ items.product_title }}</p>
                            <p class="allgoods_li_subtitle">{{ items.subtitle }}</p>
                            
                            <div class="allgoods_bottom">                              
                                <div class="allgoods_li_priceBox" >
                                    <div>
                                        <span>￥</span>
                                        {{items.vip_yprice}}
                                    </div>                                 
                                    <div class="goods_shopBox">
                                        <img :src="items.logo" alt="">
                                        {{items.mch_name}}
                                    </div>
                                </div>
                                <img :src="shopImg" class="allgoods_shopImg" @tap.stop="shopping_j(items.id, items)"/>
                            </div>
                        </li>
                    </ul>
                    <uni-load-more v-if="list.length>8" :loadingType="loadingType" style="background-color: #F0F6F6;" :style="{ paddingBottom: h5Height }"></uni-load-more>
                </template>
                
                <ul class="allgoods" v-else>
                    <li :key="index" class="allgoods_li" v-for="(item,index) of 4">
                        <div class="proImgBox skeleton-rect">
                            <img :src="shopImg" class="allgoods_li_img"/>
                        </div>


                        <p class="allgoods_li_title skeleton-rect" style="width: 100px;margin-top: 1px;">标题</p>
                        <p class="allgoods_li_subtitle skeleton-rect" style="width: 60px;margin-top: 1px;">子标题</p>
                        <div>
                            <span class="allgoods_price skeleton-rect" style="width: 100px;">
                                <span class="allgoods_price_money">￥</span>
                                <span class="allgoods_price_data">{{item}}</span>
                            </span>

                            <img :src="shopImg" class="allgoods_shopImg skeleton-fillet"/>
                        </div>

                    </li>
                </ul>

                
                <div class='delmask' v-if='display' @touchmove.stop.prevent>
                    <div class="delmask_content">
                          <p>{{ language.shoppingCart.delDisc }}</p>
                        <div>
                            <div class='cancel' @click="_mask_value('取消')">{{ language.shoppingCart.cancel }}</div>
                            <div class='confirm' @click="_mask_value('确认')">{{ language.shoppingCart.confirm }}</div>
                        </div>
                    </div>
                </div>
                
                <div class='delmask1' v-if='display1' @touchmove.stop.prevent>
                    <div class="delmask_content">
                        <p>确认删除失效商品吗？</p>
                        <div>
                            <div class='cancel' @click="_mask_value1('取消')">{{ language.shoppingCart.cancel }}</div>
                            <div class='confirm' @click="_mask_value1('确认')">{{ language.shoppingCart.confirm }}</div>
                        </div>
                    </div>
                </div>

                <!--  黑条   -->
                <div class="safe-area-inset-bottom"></div>
            </view>

        </div>

        <skeleton :animation="true" :loading="!load" bgColor="#FFF"></skeleton>
        <skus ref="attrModal" @confirm="_confirm"></skus>
        <skus ref="attrModal1" @confirm="_confirm11" :noNumb="true"></skus>
    </div>
</template>

<script>
    import { mapMutations, mapState } from 'vuex'
    import skus from '../../components/skus.vue';

    export default {
        data () {
            return {
                is_grade: false,
                numb: 1,
                access_id1: false,
                nrlflag: false, //是否开启授权登录
                shopImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/allgoods_shopImg.png',
                closeImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/guanbi2x.png',
                loadGif: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/loading.gif',
                kong: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/shopping3x.png',
                jianX: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jianX.png',
                jiantou2x: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jiantou2x.png',
                store: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/store.png',
                bottom: 3,
                quan_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/xuanzehui2x.png',
                quan_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/xuanzehei2x.png',
                jian_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jianhui2x.png',
                jian_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jian2x.png',
                jia_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jia+2x.png',
                jia_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/add+2x.png',
                manage: true, //编辑、管理状态
                manage_text: '编辑',
                manage_pay: '去结算',
                content: '确认删除选中的商品吗？', //给遮罩层传值
                mask_value: '', //接收遮罩层传过来的值
                display: false, //遮罩层显示状态
                display_img1: [], //店铺圆圈的选中状态
                display_img: [], //圆圈的选中状态
                selectArray: [], //存储选中商品
                selectStore: [], //存储选中店铺
                selectStoreArray: [], //存储店铺中选中的商品
                storeArray: [], //按店铺分商品
                goods: [], //初始化页面的商品数量
                selectAll: false, //全选状态

                load: false,
                mask_display: false, //规格显示隐藏和显示
                mask_display1: false,
                attribute_id: '',
                attrList: '',
                skuBeanList: '',
                num: '', //规格数量
                price: '', //规格价格
                imgurl: '', //规格图片
                haveSkuBean: '', //选择规则属性
                shopping_id: '', //单个商品购物车id
                jia_img: [],
                list: [],
                mch_list: [],
                fastTap: true,
                
                highKeys: {},
                skuName: 'SkuID',
                skuName1: 'Price',
                skuName2: 'Pic',
                skuName3: 'Stock',
                spliter: ',',
                sku_list: {},
                result: {},
                
                tj_page: 1,
                loadingType: 0,
                
                changeAttrNum: 0,
                
                noStockList: [],
                
                commodity_type: 0,
                
                display1: false
            }
        },
        components: { skus },
        onLoad () {
            let needRegister = uni.getStorageSync('needRegister')
            // 判断是否是授权登录
            this.nrlflag = needRegister == this.LaiKeTuiCommon.LKT_NRL_TYPE.NRL
        },
        onTabItemTap (e) {
            this.LaiKeTuiCommon.closeMPAuthWin(this)
        },
        onShow () {
            this.tj_page = 1
            // #ifndef H5
            uni.showTabBar()
            // #endif
            this.display = false
            this.LaiKeTuiCommon.getUrlFirst(this._axios)

            let needRegister = uni.getStorageSync('needRegister')
            // 判断是否是授权登录
            this.nrlflag = needRegister == this.LaiKeTuiCommon.LKT_NRL_TYPE.NRL

            for (var i = 0; i < this.goods.length; i++) {
                this.display_img[i] = false
            }
            this.selectArray = []
            for (var i = 0; i < this.mch_list.length; i++) {
                this.display_img1[i] = false
            }
            this.selectStore = []

            this.manage_text = '编辑'
            this.manage_pay = '去结算'
            this.selectAll = false
            this.manage = true
            uni.setNavigationBarTitle({
                title: this.language.shoppingCart.title
            });
        },
        onReachBottom() {
            if(this.loadingType!=0){
                return
            }
            this.loadingType = 1
            this.tj_page++
            this._axios()
        },
        
        watch:{
            'goods': {
                handler(newVal,oldVal) {
                    console.log(123)
                    
                    console.log(newVal)
                    this.$nextTick(() => {
                        this.goods = newVal
                    })
                },
                deep: true,
                immediate: true
            }
        },
        
        methods: {
            changeTab(index){
                this.commodity_type = index;
                this.tj_page = 1;
                this._axios()
            },
            noEmptyandzero(item,index){
                this.$nextTick(function(){
                    let stock = item.stock;
                    let id = item.id;
                    let num = this.goods[index].num;
                    
                    if(num == "" || num == 0){
                        this.$set(item,"num",1);
                    }
                    
                    if( num != 0 && !Number(num)){
                        this.$set(item,"num",1);
                    }
                    
                    if(num < 0){
                        this.$set(item,"num",1);
                    }
                    
                    if (num != "" && this.goods[index].num < 1) {
                        this.$set(item,"num",1);
                        uni.showToast({
                            title: this.language.shoppingCart.reduceNo,
                            duration: 1000,
                            icon: 'none'
                        })
                    } else if( this.goods[index].num <= stock && this.goods[index].num >= 1 )  {
                        this.jia_img = true
                        this._munajax(num, id);
                        // 计算购物车总数量
                        this._cartAllNum()
                    } else if(this.goods[index].num > stock){
                        this.jia_img = false
                        this.$set(item,"num",stock);
                        uni.showToast({
                            title: this.language.shoppingCart.addNo,
                            duration: 1000,
                            icon: 'none'
                        })
                    }
                })
            },
            changeNumb(item,index){
                this.$nextTick(function(){
                    let stock = item.stock;
                    let id = item.id;
                    let num = this.goods[index].num;
                    
                    if(num != "" && num == 0){
                        this.$set(item,"num",0);
                        return
                    }
                    
                    if( num != 0 && !Number(num)){
                        this.$set(item,"num",'');
                        return
                    }
                    
                    if(num < 0){
                        this.$set(item,"num",'');
                        return;
                    }
                    
                    
                    if (num != "" && this.goods[index].num < 1) {
                        this.$set(item,"num",1);
                        uni.showToast({
                            title: this.language.shoppingCart.reduceNo,
                            duration: 1000,
                            icon: 'none'
                        })
                    } else if( this.goods[index].num <= stock && this.goods[index].num >= 1 )  {
                        this.jia_img = true
                        this._munajax(num, id);
                        // 计算购物车总数量
                        this._cartAllNum()
                    } else if(this.goods[index].num > stock){
                        this.jia_img = false
                        this.$set(item,"num",stock);
                        uni.showToast({
                            title: this.language.shoppingCart.addNo,
                            duration: 1000,
                            icon: 'none'
                        })
                    }
                })
            },
            clearNoStock(){
                this.display1 = true
                // let id = ''
                // this.noStockList.filter(item=>{
                //     id += ',' + item.id
                // })
                // id = id.replace(',','')
                // let data = {
                //     module: 'app',
                //     action: 'cart',
                //     app: 'delcart',
                //     cart_id: id
                // }
                // this.$req.post({data}).then(res=>{
                //     uni.showToast({
                //         title: res.message,
                //         icon: 'none'
                //     })
                    
                //     if(res.code == 200){
                //         this.tj_page = 1
                //         this._axios()
                //     }
                // })
            },
            
            toStore (id) {
                uni.navigateTo({
                    url: '/pagesA/store/store?shop_id=' + id
                })
            },
            changeLoginStatus () {
                this._axios()
            },
            // 点击确定购买之后，如果库存不为零。则运行
            _shopping (id) {
                if (this.haveSkuBean) {
                    var data = {
                        module: 'app',
                        action: 'product',
                        app: 'add_cart',
                        pro_id: this.proid,
                        attribute_id: this.haveSkuBean.cid,
                        num: this.numb,
                        type: 'addcart'
                    }

                    this.$req
                        .post({ data })
                        .then(res => {
                            let { code, data, message } = res
                            if (code == 200) {
                                uni.showToast({
                                    title: this.language.shoppingCart.addSuc,
                                    icon: 'none'
                                })

                                this.$store.state.access_id = data.access_id
                                
                                this.haveSkuBean = ''
                                this.$refs.attrModal._mask_f()
                                setTimeout(() => {
                                    this.fastTap = true
                                    this.tj_page = 1
                                    this._axios()
                                }, 500)
                            } else {
                                uni.showToast({
                                    title: message,
                                    icon: 'none'
                                })
                                this.fastTap = true
                            }
                        })
                        .catch(error => {
                            this.fastTap = true
                        })
                } else {
                    
                    this.fastTap = true
                }
            },
            // 为你推荐商品右下角的小购物车图标
            shopping_j (id, item) {
                if(item.status == 3){
                    uni.showToast({
                        title: this.language.shoppingCart.proDown,
                        icon: "none"
                    })
                    return
                }
                if(item.num == 0){
                    uni.showToast({
                        title: this.language.shoppingCart.soldOut1,
                        icon: "none"
                    })
                    return
                }
                if (!this.fastTap) {
                    return
                }
                this.fastTap = false
                this.proid = id
                var data = {
                    module: 'app',
                    action: 'product',
                    app: 'index',
                    pro_id: id
                }

                this.$req
                    .post({ data })
                    .then(res => {
                        this.fastTap = true
                        let {
                            data: { collection_id, pro, comments, attrList, skuBeanList, attribute_list, qj_price, type }
                        } = res
                        this.ys_price = qj_price
                        this.attrList = attrList
                        
                        this.$refs.attrModal.imgurl = pro.img_arr[0]
                        this.$refs.attrModal.num = pro.num
                        this.$refs.attrModal.price = qj_price
                        this.$refs.attrModal.skuBeanList = attribute_list
                        this.$refs.attrModal.initData()
                        this.$refs.attrModal._mask_display()
                        
                        this.collection = type
                    })
                    .catch(error => {
                        this.fastTap = true
                    })
            },
            // 跳转至为你推荐的商品详情
            _goods (id) {
                this.$store.commit('SET_PRO_ID', id)
                uni.navigateTo({
                    url: '/pages/goods/goodsDetailed?toback=true&pro_id='+id
                })
            },
            // 登录
            toLogin () {
                uni.navigateTo({
                    url: '/pages/login/login?landing_code=1'
                })
            },
            //打开遮罩层
            toHome () {
                uni.switchTab({
                    url: '/pages/tabBar/home'
                })
            },
            // 购物车商品中，点击规格
            _mask_display (stock, price, imgurl, id, attribute_id, num) {
                this.shopping_id = id
                this.changeAttrNum = num
                var data = {
                    module: 'app',
                    action: 'cart',
                    app: 'dj_attribute',

                    pro_id: id
                }
                if (this.access_id) {
                    data.cart_id = id
                } else {
                    data.cart_id = id
                }
                
                this.imgurl = imgurl

                this.$req.post({ data }).then(res => {
                    let { data } = res
                    this.attrList = data[0].attrList
                    
                    this.$refs.attrModal1.skuBeanList = data[0].attribute_list
                    this.$refs.attrModal1.initData(true)
                    this.$refs.attrModal1._mask_display()
                    
                    if(Number(stock) == 0){
                        this.$refs.attrModal1.imgurl = imgurl
                        this.$refs.attrModal1.price = price
                        this.$refs.attrModal1.num = stock
                    }
                    
                    // 以下为初始化选中
                    if(Number(stock) > 0){
                        let sku_list = this.$refs.attrModal1.sku_list
                        for(let i in sku_list.items){
                            if(sku_list.items[i].sku == attribute_id){
                                this.$refs.attrModal1.haveSkuBean = {
                                    name: sku_list.items[i].path,
                                    cid: attribute_id,
                                    skus: sku_list.items[i]
                                };
                            }
                        }
                        
                        let selectName = this.$refs.attrModal1.haveSkuBean.name.split(',')
                        
                        for(let i in sku_list.result){
                            
                            for(let k in sku_list.result[i]){
                                
                                let flag = selectName.some(item=>item==k)
                                
                                if(flag){
                                    this.$refs.attrModal1.handleActive(i, sku_list.result[i][k])
                                }
                                
                            }
                            
                        }
                    }
                    
                })
            },
            // 遮罩层中，点击确认按钮
            _confirm(sku){
                Object.assign(this.$data,sku)
                this._confirm1()
            },
            _confirm1 () {
                if (!this.fastTap) {
                    return
                }
                this.fastTap = false
                if (Boolean(this.haveSkuBean)) {
                    if (this.num == 0) {
                        uni.showToast({
                            title: this.language.shoppingCart.kucunTips,
                            duration: 1000,
                            icon: 'none'
                        })
                        this.fastTap = true
                    } else if (this.num != 0) {
                        this._shopping()
                    }
                } else {
                    if (this.num == 0) {
                        uni.showToast({
                            title: this.language.shoppingCart.kucunTips,
                            duration: 1000,
                            icon: 'none'
                        })
                        this.fastTap = true
                    } else {
                        uni.showToast({
                            title: this.language.shoppingCart.chooseAttrTips,
                            duration: 1000,
                            icon: 'none'
                        })
                        this.fastTap = true
                    }
                }
            },
            //确认
            _confirm11 (sku) {
                Object.assign(this.$data,sku)
                if (Boolean(this.haveSkuBean)) {
                    let Stock = this.haveSkuBean.skus.Stock
                    if(this.changeAttrNum > Stock){
                        uni.showToast({
                            title: this.language.shoppingCart.kucunTips,
                            icon: 'none'
                        })
                        return
                    }
                    
                    let data = {
                        module: 'app',
                        action: 'cart',
                        app: 'modify_attribute',
                        cart_id: this.shopping_id,
                        attribute_id: this.haveSkuBean.cid
                    }
                    this.$req.post({ data }).then(res => {
                        let { code, message } = res
                        if (code == 200) {
                            this.$refs.attrModal1._mask_false()
                            this.tj_page = 1
                            this._axios()
                        }else{
                            uni.showToast({
                                title: message,
                                icon: 'none'
                            })
                        }
                    })
                } else {
                    uni.showToast({
                        title: this.language.shoppingCart.chooseAttrTips,
                        duration: 1000,
                        icon: 'none'
                    })
                }
            },
            _axios () {
                if (!this.load) {
                    uni.showLoading({
                        title: this.language.showLoading.waiting
                    })
                }

                var data = {
                    module: 'app',
                    action: 'cart',
                    app: 'index',
                    cart_id: this.$store.state.nCart,
                    page: this.tj_page,
                    pro_type: this.commodity_type
                }
                this.$req.post({ data }).then(res => {
                    if (!this.load) {
                        uni.hideLoading()
                    }

                    let { data,data0, list, mch_list, login_status, grade, isGrade } = res.data
                    
                    // this.is_grade = grade==0?false:true;
                    this.is_grade = isGrade
                    if (login_status != 0) {
                        this.access_id1 = true
                    } else {
                        this.access_id1 = false
                    }
                    if (res.code == 200) {
						
						this.selectArray = []
						this.selectStore = []
						this.selectStoreArray = []
						this.storeArray = []
						this.selectAll = false
                        this.display_img1 = []
                        this.display_img = []
                        
                        this.noStockList = data0
						
                        if(this.tj_page == 1){
                            this.list = []
                        }
                        
                        list.filter(item=>{
                            item.vip_price = Number(item.vip_price).toFixed(2)
                            item.vip_yprice = Number(item.vip_yprice).toFixed(2)
                        })
                        this.list.push(...list)
                        
                        if(list.length>0){
                            this.loadingType = 0
                        }else{
                            this.loadingType = 2
                        }
                        
                        let newMch_list = []
                        mch_list.filter(items=>{
                            let flag = data.some((item)=>{
                                return item.mch_id == items.id
                            })
                            
                            if(flag){
                                newMch_list.push(items)
                            }
                        })
                        
                        this.goods = data
                        this.mch_list = newMch_list
                        // 计算购物车商品总数量
                        this._cartAllNum()
                        // 按店铺分商品
                        this._productDividedByStore()
                    } else {
                        this.access_id1 = false
                        this.goods = []
                    }
                    this.load = true
                })
            },
            ...mapMutations({
                cart_id: 'SET_CART_ID',
                pro_id: 'SET_PRO_ID',
                order_id: 'SET_ORDER_ID',
                address_id: 'SET_ADDRESS_ID',
                cart_num: 'SET_CART_NUM'
            }),
            //数量减少
            _reduce (index, id) {
                var num = this.goods[index].num
                if (this.goods[index].num <= 1) {
                    this.goods[index].num = 1
                    uni.showToast({
                        title: this.language.shoppingCart.reduceNo,
                        duration: 1000,
                        icon: 'none'
                    })
                    return false
                } else {
                    this.goods[index].num--
                    this._munajax(this.goods[index].num, id)
                    // 计算购物车总数量
                    this._cartAllNum()
                }
            },
            //数量增加
            _add (index, stock, id) {
                let num = this.num ? this.num : stock
                if (Number(this.goods[index].num) < Number(num)) {
                    this.goods[index].num++
                    this._munajax(this.goods[index].num, id)
                    this.jia_img = true
                    // 计算购物车总数量
                    this._cartAllNum()
                } else {
                    this.jia_img = false
                    uni.showToast({
                        title: this.language.shoppingCart.addNo,
                        duration: 1000,
                        icon: 'none'
                    })
                }
            },
            in_array (stringToSearch, arrayToSearch) {
                for (let s = 0; s < arrayToSearch.length; s++) {
                    let thisEntry = arrayToSearch[s].toString()
                    if (thisEntry == stringToSearch) {
                        return true
                    }
                }
                return false
            },
            _munajax (goods, id) {
                let arr = [{
                    num: goods,
                    cart_id: Number(id)
                }]
                let data = {
                    module: 'app',
                    action: 'cart',
                    app: 'up_cart',
                    goods: JSON.stringify(arr)
                }

                this.$req.post({ data }).then(res => {})
            },
            //编辑管理状态
            _manage () {
                //每次编辑都清空选择
                this.selectAll = false
                this.selectArray = []
                //商品
                for (var i = 0; i < this.goods.length; i++) {
                    this.$set(this.display_img, i, false)
                }
                //店铺
                this.selectStore = []
                this.selectStoreArray = []
                if (this.storeArray) {
                    for (var i = 0; i < this.storeArray.length; i++) {
                        this.$set(this.display_img1, i, false)
                    }
                }
                
                this.manage = !this.manage
                if (this.manage) {
                    this.manage_text = '编辑'
                    this.manage_pay = '去结算'
                } else {
                    this.manage_text = '完成'
                    this.manage_pay = '删除商品'
                }
                
                //重新按照店铺分一下商品,如果是编辑则把库存不足的元素也拿出来
                this._productDividedByStore()
            },
            //节奏遮罩层传值
            _mask_value (mask_value) {
                uni.showTabBar()
                this.mask_value = mask_value
                var cart_id = []
                var cart_str = ''
                for (var i = 0; i < this.selectArray.length; i++) {
                    cart_id.push(Number(this.selectArray[i].id))
                    cart_str = cart_str + Number(this.selectArray[i].id) + ','
                }
                if (mask_value == '取消') {
                    this.display = false
                } else if (this.manage_pay == '删除商品' && this.mask_value == '确认') {
                    // #ifdef MP-ALIPAY
                    cart_id = cart_str
                    // #endif

                    var data = {
                        module: 'app',
                        action: 'cart',
                        app: 'delcart',
                    }

                    // #ifdef MP-BAIDU
                    for (let i in cart_id) {
                        data[`cart_id[${i}]`] = cart_id[i]
                    }
                    // #endif

                    // #ifndef MP-BAIDU
                    data['cart_id'] = cart_id
                    // #endif

                    this.display_img1 = []

                    this.$req.post({ data }).then(res => {
                        if (res.code != 200) {
                            uni.showToast({
                                title: res.err,
                                duration: 1500,
                                icon: 'none'
                            })
                        }

                        this.manage_text = '编辑'
                        this.manage_pay = '去结算'
                        this.manage = true
                        this.selectAll = false
                        this.selectArray = []
                        for (var i = 0; i < this.goods.length; i++) {
                            this.$set(this.display_img, i, false)
                        }
                        for (var i = 0; i < cart_id.length; i++) {
                            var n = this.$store.state.nCart.indexOf(cart_id[i])
                            if (n > -1) {
                                this.$store.state.nCart.splice(n, 1)
                            }
                        }

                        this.display = false
                        this._axios()
                        // 计算购物车总数量
                        this._cartAllNum()
                    })
                }
            },
            
            _mask_value1(mask_value) {
                if(mask_value == '取消') {
                    this.display1 = false
                } else {
                    let id = ''
                    this.noStockList.filter(item=>{
                        id += ',' + item.id
                    })
                    id = id.replace(',','')
                    let data = {
                        module: 'app',
                        action: 'cart',
                        app: 'delcart',
                        cart_id: id
                    }
                    this.$req.post({data}).then(res=>{
                        uni.showToast({
                            title: res.message,
                            icon: 'none'
                        })
                        
                        if(res.code == 200){
                            this.tj_page = 1
                            this._axios()
                        }
                    })
                    this.display1 = false
                }
            },
            //删除商品
            _delete () {
                if (this.manage_pay == '删除商品' && this.selectArray.length > 0) {
                    this.display = true
                    // #ifndef H5
                    uni.hideTabBar()
                    // #endif
                } else if (this.manage_pay == '删除商品') {
                    uni.showToast({
                        title: this.language.shoppingCart.chooseDelPro,
                        duration: 1000,
                        icon: 'none'
                    })
                }

                if (this.manage_pay == '去结算' && this.selectArray.length > 0) {
                    this.isLogin(() => {
                        var cart_id = []
                        var goods = []
                        for (var i = 0; i < this.selectArray.length; i++) {
                            cart_id.push(this.selectArray[i].id)
                            goods.push({
                                num: this.selectArray[i].num,
                                cart_id: Number(this.selectArray[i].id)
                            })
                        }
                        var data = {
                            module: 'app',
                            action: 'cart',
                            app: 'up_cart',
                            goods: JSON.stringify(goods)
                        }

                        this.$req.post({ data }).then(res => {
                            if (res.code == 404) {
                                uni.showToast({
                                    title: this.language.shoppingCart.payFail,
                                    icon: 'none',
                                    duration: 1000
                                })
                                return
                            }

                            if (res.code == 200) {
                                this.$store.state.cart_id = cart_id
                                this.cart_id(cart_id)
                                this.order_id('')
                                this.address_id('')

                                // #ifdef H5
                                var storage = window.localStorage
                                storage.cart_id = cart_id
                                // #endif

                                uni.navigateTo({
                                    url: '/pages/pay/orderDetailsr?cart_id=' + cart_id + '&canshu=true&returnR=1&commodity_type='+this.commodity_type
                                })
                            } else {
                                uni.showToast({
                                    title: this.language.shoppingCart.kucunTips,
                                    icon: 'none',
                                    duration: 1000
                                })
                                setTimeout(() => {
                                    this._axios()

                                    for (var i = 0; i < this.goods.length; i++) {
                                        this.display_img[i] = false
                                    }
                                    this.selectArray = []
                                }, 1000)
                                this.selectAll = false
                            }
                        })
                    })
                } else if (this.manage_pay == '去结算') {
                    uni.showToast({
                        title: this.language.shoppingCart.choosePayPro,
                        duration: 1000,
                        icon: 'none'
                    })
                }
            },
            //单选 (goods,goods,mch,mch)
            _checkedOne (item, indexli, item1, index1) {
                //是否是编辑状态标识
                let isEdit = false

                var cum = this.selectArray.findIndex(items => {
                    return items.id == item.id
                })
                // 如果是有的话 点击就是取消
                //判断点击的传入的值是否存在数组中，如果没有添加，如果有删除，同时设定选中状态（第一次点击添加进数组，第二次点击从数组中删除）
                if (this.manage_pay == '删除商品') {
                    isEdit = true
                    if (cum < 0) {
                        // 点击新增
                        this.selectArray.push(item)
                        this.$set(this.display_img, indexli, true)
                    } else {
                        // 点击取消
                        var i = this.selectArray.findIndex(items => {
                            return items.id == item.id
                        })

                        this.selectArray.splice(i, 1)

                        this.$set(this.display_img, indexli, false)
                    }
                } else if (this.manage_pay == '去结算') {
                    if (cum < 0 && item.stock > 0) {
                        // 点击新增
                        this.selectArray.push(item)
                        this.$set(this.display_img, indexli, true)
                    } else if (cum >= 0 && item.stock > 0) {
                        // 点击取消
                        var i = this.selectArray.findIndex(items => {
                            return items.id == item.id
                        })

                        this.selectArray.splice(i, 1)

                        this.$set(this.display_img, indexli, false)
                    } else {
                        //单选库存不足
                        uni.showToast({
                            title: this.language.shoppingCart.prokucunTips,
                            duration: 1000,
                            icon: 'none'
                        })
                        return
                    }
                }
                
                let haveGoodsList = this.goods.filter(items=>{
                    if(isEdit){
                        //编辑可以勾选库存不足的商品
                        return true
                    } else {
                        return Number(items.stock) > 0
                    }
                })
                //根据产品选状态，设定全选状态
                if (this.selectArray.length>0 && this.selectArray.length == haveGoodsList.length) {
                    this.selectAll = true
                } else {
                    this.selectAll = false
                }
                //根据产品选状态，设定店铺全选状态
                // 添加或删除店铺选择数组
                if (item.mch_id == item1.id) {
                    if (!this.selectStoreArray[index1]) {
                        this.selectStoreArray[index1] = []
                    }
                    var isSlectedInStore = this.selectStoreArray[index1].findIndex(items => {
                        return items.id == item.id
                    })
                    if (isSlectedInStore < 0) {
                        this.selectStoreArray[index1].push(item)
                    } else {
                        var i = this.selectStoreArray[index1].findIndex(items => {
                            return items.id == item.id
                        })

                        this.selectStoreArray[index1].splice(i, 1)
                    }
                    var isSlected = this.selectStore.findIndex(items => { 
                        return items.id == item1.id
                    })
                    
                    if (this.selectStoreArray[index1].length == this.storeArray[index1].children.length) {
                        if (isSlected < 0) {
                            this.$set(this.display_img1, index1, true)
                            this.selectStore.push(item1)
                        }
                    } else {
                        if (isSlected >= 0) {
                            this.$set(this.display_img1, index1, false)

                            var i = this.selectStore.findIndex(items => {
                                return items.id == item1.id
                            })

                            this.selectStore.splice(i, 1)
                        }
                    }
                }
            },
            //全选
            _selectAll () {
                //可以被选中的商品下标集
                var arr = []
                
                let haveGoodsList = []
                
                for (var i = 0; i < this.goods.length; i++) {
                    if (this.goods[i].stock > 0) {
                        //存储可以被选中的商品下标
                        arr.push(i)
                        //存储当前商品信息
                        haveGoodsList.push(this.goods[i])
                    }
                }
                if (this.manage_pay == '删除商品') {
                    this.selectAll = !this.selectAll
                    if (this.selectAll) {
                        for (var i = 0; i < haveGoodsList.length; i++) {
                            this.$set(this.selectArray, i, haveGoodsList[i])
                            this.$set(this.display_img, i, true)
                        }
                        //店铺
                        if (this.mch_list) {
                            for (var i = 0; i < this.mch_list.length; i++) {
                                this.$set(this.selectStore, i, this.mch_list[i])
                                this.$set(this.display_img1, i, true)
                                if (this.storeArray.children) {
                                    if (this.storeArray[i].children) {
                                        for (var j = 0; j < this.storeArray[i].children.length; j++) {
                                            if (!this.selectStoreArray[i]) {
                                                this.selectStoreArray[i] = []
                                            }
                                            this.$set(this.selectStoreArray[i], j, this.storeArray[i].children[j])
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        this.selectArray = []
                        for (var i = 0; i < haveGoodsList.length; i++) {
                            this.$set(this.display_img, i, false)
                        }
                        //店铺
                        this.selectStore = []
                        this.selectStoreArray = []
                        if (this.storeArray) {
                            for (var i = 0; i < this.storeArray.length; i++) {
                                this.$set(this.display_img1, i, false)
                            }
                        }
                    }
                } else if (this.manage_pay == '去结算') {
                    if (arr.length > 0) {
                        this.selectAll = !this.selectAll
                        if (this.selectAll) {
                            //所有商品
                            for (var i = 0; i < haveGoodsList.length; i++) {
                                this.$set(this.selectArray, i, haveGoodsList[i])
                                this.$set(this.display_img, arr[i], true)
                            }
                            //店铺
                            if (this.mch_list) {
                                console.log('全选店铺操作1')
                                for (var i = 0; i < this.mch_list.length; i++) {
                                    this.$set(this.selectStore, i, this.mch_list[i])
                                    this.$set(this.display_img1, i, true)
                                    if (this.storeArray[i].children) {
                                        for (var j = 0; j < this.storeArray[i].children.length; j++) {
                                            if (!this.selectStoreArray[i]) {
                                                this.selectStoreArray[i] = []
                                            }
                                            this.$set(this.selectStoreArray[i], j, this.storeArray[i].children[j])
                                        }
                                    }
                                }
                            }
                        } else {
                            this.selectArray = []
                            for (var i = 0; i < haveGoodsList.length; i++) {
                                this.$set(this.display_img, i, false)
                            }
                            //店铺
                            this.selectStore = []
                            this.selectStoreArray = []
                            if (this.storeArray) {
                                for (var i = 0; i < this.storeArray.length; i++) {
                                    this.$set(this.display_img1, i, false)
                                }
                            }
                        }
                    } else {
                        uni.showToast({
                            title: this.language.shoppingCart.prokucunTips1,
                            duration: 1000,
                            icon: 'none'
                        })
                    }
                }
            },
            // 全选某店铺商品
            _selectAllStore (item, index) {
                var storeId = this.mch_list[index].id
                var isSlected = this.selectStore.findIndex(items => { return items.id == storeId })
                
                let havePro = this.goods.some(items=>{
                    return items.mch_id == storeId && Number(items.stock) > 0
                })
                
                if(!havePro){
                    return
                }
                
                // 判断此店铺是否被选中
                if (isSlected < 0) {
                    // 否 则选中店铺
                    for (var j = 0; j < this.goods.length; j++) {
                        var cum = this.selectArray.findIndex(items => { return items.id == this.goods[j].id })

                        if (storeId == this.goods[j].mch_id) {
                            console.log('添加店铺cum', cum)
                            //是否可以勾选标识
                            let isChceked = cum < 0;
                            if(isChceked){
                                //大于库存才勾选
                                isChceked = Number(this.goods[j].stock) > 0
                                //购物车编辑的时候才可以勾选,编辑可以勾选库存不足的商品
                                if(this.manage_pay == "删除商品"){
                                    isChceked = true;
                                }
                            }
                            
                            if (isChceked) {
                                //满足条件则勾选当前商品
                                this.selectArray.push(this.goods[j])
                                this.$set(this.display_img, j, true)
                                if (!this.selectStoreArray[index]) {
                                    this.selectStoreArray[index] = []
                                }
                                this.selectStoreArray[index].push(this.goods[j])
                            }
                        }
                    }
                    this.selectStore.push(item)

                    this.$set(this.display_img1, index, true)
                } else {
                    // 是 则取消店铺
                    for (var j = 0; j < this.goods.length; j++) {
                        var cum = this.selectArray.findIndex((selectItem) => selectItem.id === this.goods[j].id)

                        if (storeId == this.goods[j].mch_id) {
                            if (cum >= 0) {
                                this.selectArray.splice(cum, 1)
                                this.$set(this.display_img, j, false)
                                if (!this.selectStoreArray[index]) {
                                    this.selectStoreArray[index] = []
                                }
                                let cum2 = this.selectStoreArray[index].findIndex((selectItem) => selectItem.id === this.goods[j].id)
                                this.selectStoreArray.splice(cum2, 1)
                            }
                        }
                    }

                    let cum3 = this.selectStore.findIndex((selectItem) => selectItem.id === item.id)
                    this.selectStore.splice(cum3, 1)

                    this.$set(this.display_img1, index, false)
                }

                //根据产品选状态，设定全选状态
                let haveGoodsList = this.goods.filter(items=>{
                    return Number(items.stock) > 0
                })
                
                if (this.selectArray.length>0 && this.selectArray.length == haveGoodsList.length) {
                    this.selectAll = true
                } else {
                    this.selectAll = false
                }
            },
            // 按店铺分商品
            _productDividedByStore () {
                let haveGoodsList = this.goods.filter(items=>{
                    if(this.manage_pay == '删除商品'){
                        //编辑可以选择所有商品
                        return true
                    }
                    return Number(items.stock) > 0
                })
                
                if (this.mch_list && haveGoodsList) {
                    for (var i = 0; i < this.mch_list.length; i++) {
                        if (!this.storeArray[i]) {
                            this.storeArray[i] = []
                        }
                        this.storeArray[i].push(this.mch_list[i])

                        if (!this.storeArray[i].children) {
                            this.storeArray[i].children = []
                        }
                        for (var j = 0; j < haveGoodsList.length; j++) {
                            if (this.mch_list[i].id == haveGoodsList[j].mch_id) {
                                var storeI = this.storeArray[i].children.findIndex(it => {
                                    return it.id == haveGoodsList[j].id
                                })

                                if (storeI < 0) {
                                    this.storeArray[i].children.push(haveGoodsList[j])
                                }
                            }
                        }
                    }
                }
            },
            _goodsDetailed (pro_id) {
                this.pro_id(pro_id)

                uni.navigateTo({
                    url: '/pages/goods/goodsDetailed?toback=true&pro_id='+pro_id
                })
            },
            // 计算购物车商品总数量
            _cartAllNum () {
                var data = this.goods
                if (data && data.length) {
                    var allnum = 0
                    for (var i = 0; i < data.length; i++) {
                        allnum += Number(data[i].num)
                    }
                    this.cart_num(allnum)
                } else if (data.length == 0) {
                    this.cart_num(0)
                }
                //添加，移除tabbar购物车小点提醒
                if (this._cart_num) {
                    var cart_num_str = String(this._cart_num)

                    // #ifdef MP-WEIXIN
                    uni.setTabBarBadge({
                        index: 2,
                        text: cart_num_str
                    })
                    // #endif

                    // #ifndef MP-WEIXIN
                    uni.setTabBarBadge({
                        index: 2,
                        text: cart_num_str
                    })
                    // #endif

                } else {

                    // #ifdef MP-WEIXIN
                    uni.removeTabBarBadge({
                        index: 2
                    })
                    // #endif

                    // #ifndef MP-WEIXIN
                    uni.removeTabBarBadge({
                        index: 2
                    })
                    // #endif
                }
            }
        },
        computed: {
            count: function () {
                var count = 0
                for (var i = 0; i < this.selectArray.length; i++) {
                    console.log(Number(this.selectArray[i].num))
                    count += Number(this.selectArray[i].num)
                }
                return count
            },
            h5Height: function () {
                var height
                // #ifdef H5
                height = 100 + 'upx'
                // #endif
                // #ifndef H5
                height = 0 + 'upx'
                // #endif
                return height
            },
            paddingBottom () {
                let height = 0;
                // #ifdef H5
                if (this.goods.length) {
                    height = 200;
                } else {
                    height = 100;
                }
                // #endif
                // #ifndef H5
                height = 0
                // #endif
                return uni.upx2px(height) + 'px'
            },
            total () {
                var total = 0
                for (var i = 0; i < this.selectArray.length; i++) {
                    if (this.selectArray[i]) {
                        total += new Number(this.selectArray[i].price) * parseInt(this.selectArray[i].num)
                    }
                }
                return total.toFixed(2)
            },
            ...mapState({
                _cart_num: 'cart_num'
            })
        },
    }
</script>

<style lang="less" scoped>
    @import url('../../static/css/tabBar/shoppingCart.less');
    #gray_img.active {
        background-color: #f4f4f4;
    }
    .header .span{
        font-size: 36rpx;
    }
</style>
