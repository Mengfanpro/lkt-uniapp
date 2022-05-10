<template>
    <div class="container" :style="{background: success && topTabBar != 2?'':'#ffffff'}" @tap="removeMask">
        <!--头部模块-->
        <heads :title='language.search2.searchRes.title'></heads>
        <div style="height: 88rpx;">
            <div class='allgoods_s home_navigation'>
                <div class='home_input'>
                    <img class='searchImg' :src="serchimg" alt="">
                    <input type="text" v-model="searchtxt" :placeholder="language.search2.searchRes.search_placeholder" id='input' :placeholder-style="placeStyle"
                           name="sourch"/>
                    <image v-show="searchtxt.length > 0" @click="cleardata" class="cancel" :src="sc_icon" mode=""></image>
                </div>
                <div class="search_btn" @tap='_searchB'>{{language.search2.searchRes.search_button}}</div>
            </div>
        </div>

        <!-- 导航切换栏 -->
        <div style="height: 90rpx;" >
            <div class='topTabBar'>
                <div :class='{"active":topTabBar == 0}' @tap="_search(0)">{{language.search2.searchRes.TabBar[0]}}</div>
                <div :class='{"active":topTabBar == 1}' @tap="_search(1)">{{language.search2.searchRes.TabBar[1]}}</div>
                <div v-if='mch_status' :class='{"active":topTabBar == 2}' @tap="_search(2)">{{language.search2.searchRes.TabBar[2]}}</div>
            </div>
        </div>
        <div style="height: 90rpx;" v-if='topTabBar != 2'>
            <div class='topFilter'>
                <div :class='{"active":searchType == ""}' @tap="clickType('')">{{language.search2.searchRes.TopButton[0]}}</div>
                <div :class='{"active":searchType == "volume"}' @tap="clickType('volume')">
                    {{language.search2.searchRes.TopButton[1]}}
                    <div class="sortingImgBox">
                        <img :src="searchType=='volume'&&sorting=='asc'?sortingToph:sortingTop">
                        <img :src="searchType=='volume'&&sorting=='desc'?sortingBottomh:sortingBottom">
                    </div>
                </div>
                <div :class='{"active":searchType == "price"}' @tap="clickType('price')">
                    {{language.search2.searchRes.TopButton[2]}}
                    <div class="sortingImgBox">
                        <img :src="searchType=='price'&&sorting=='asc'?sortingToph:sortingTop">
                        <img :src="searchType=='price'&&sorting=='desc'?sortingBottomh:sortingBottom">
                    </div>
                </div>
                <div :class='{"active":searchType == "comment_num"}' @tap="clickType('comment_num')">{{language.search2.searchRes.TopButton[5]}}</div>
                <div @tap.stop="shaixuanClick" :class='{"active":filterMaskFlag || brand_id || min_price1 || max_price1}'>
                    {{language.search2.searchRes.TopButton[3]}}
                    <img :src="filterMaskFlag || brand_id || min_price1 || max_price1?filter_h:filter">
                </div>
                
                <div class="filterMaskDiv" v-if="filterMaskFlag" @touchmove.stop.prevent @tap.stop>
                    <div v-if="brand_list.length>0">
                        <div class="filterTitle" @tap="pinpaiClick">
                            {{language.search2.searchRes.TopButton[4]}}
                            <img :src="pinpaiFlag?jiantouTop:jiantouBottom" alt="">
                        </div>
                        <scroll-view v-if="pinpaiFlag" class="filterScroll" :scroll-y="true">
                            <div class="filterScrollItem">
                                <div :class="{active: brand_id == item.brand_id}" v-for="item,index of brand_list" :key="index" @tap="changeBrand(item)">{{item.brand_name}}</div>
                            </div>
                        </scroll-view>
                    </div>
                    
                    <div>
                        <div class="filterTitle">{{language.search2.searchRes.section}}</div>
                        <div class="pricerBox">
                            <input v-model="min_price" type="number" :placeholder="language.search2.searchRes.min" placeholder-style="display: flex; justify-content: center;color: #B8B8B8;">
                            <span>-</span>
                            <input v-model="max_price" type="number" :placeholder="language.search2.searchRes.max" placeholder-style="display: flex; justify-content: center;color: #B8B8B8;"/>
                        </div>
                    </div>
                    
                    <div class="filterBottom">
                        <div @tap="reset">{{language.search2.searchRes.Reset}}</div>
                        <div @tap="filterOk">{{language.search2.searchRes.determine}}</div>
                    </div>
                </div>
            </div>
            <div class="filterMask" v-if="filterMaskFlag" @touchmove.stop.prevent></div>
        </div>

        <!--搜索商品后商品展示模块-->
        <ul class='home-hot margin-top' id="margin-top" v-if="topTabBar!=2">
            <li v-if='!success'>
                <div class='empty_play'>
                    <img :src="no_search"/>
                    <p>{{language.search2.searchRes.Tips[0]}}“{{searchtxt}}”{{language.search2.searchRes.Tips[1]}}<br>{{language.search2.searchRes.Tips[2]}}~</p>
                </div>
            </li>
            <li v-else>
                <div class='allgoods_prev'></div>
                <ul class='allgoods'>
                    <li class="allgoods_li" v-for='(items,index) in searchgoods' :key='index' @tap="_goods(items.id)">
                        <img :src="items.imgurl"/>
                        <div v-if="items.status == 3"
                             style="width: 120rpx; height: 120rpx; border-radius: 50%; background-color: rgba(0, 0, 0, 0.6); position: absolute; top: 120rpx; left: 50%; transform: translateX(-50%); color: rgb(255, 255, 255); font-size: 13px; line-height: 60px; justify-content: center;">
                            {{language.search2.searchRes.shelf}}
                        </div>
                        <div v-else-if="items.num == 0 || items.num == '0'"
                             style="width: 120rpx; height: 120rpx; border-radius: 50%; background-color: rgba(0, 0, 0, 0.6); position: absolute; top: 120rpx; left: 50%; transform: translateX(-50%); color: rgb(255, 255, 255); font-size: 13px; line-height: 60px; justify-content: center;">
                            {{language.search2.searchRes.Sold_out}}
                        </div>
                        <p class="allgoods_title">{{items.product_title}}</p>
                        <p class='allgoods_p'>{{items.subtitle}}</p>
                        <div style="align-items: flex-end;">                           
                            <div class="allgoods_price" >
                                <span class='red'><span style="font-size: 24rpx;">￥</span>{{items.vip_yprice}}</span>
                                <p class="vip_price" v-if="hasGrade">{{language.search2.searchRes.member}}￥{{items.vip_price}}</p>
                                <div class="goods_shopBox">
                                    <img :src="items.logo" alt="">
                                    {{items.mch_name}}
                                </div>
                            </div>
                            <!-- <span class='volume'>销量：{{items.volume}}</span> -->
                            <div @tap.stop="shopping_j(items.id)" v-if="items.is_open == 1" style='display: flex;'>
                                <img :src="shoppingImg" style="width: 58rpx;height: 58rpx;margin-right: 20rpx;margin-bottom: 8rpx;">
                            </div>
                            <div v-else style='display: flex;'>
                                <img :src="shoppingImgGray" style="width: 58rpx;height: 58rpx;margin-right: 20rpx;margin-bottom: 8rpx;">
                            </div>
                        </div>
                    </li>
                </ul>

                <uni-load-more :loadingType="loadingType" v-if="searchgoods.length>9"></uni-load-more>
            </li>
        </ul>
        <div v-else>
            <ul class="shoping" v-if='success'>
                <li v-for="(item, index) in searchgoods" :key="index">
                    <div class="box">
                        <img :src="item.logo"/>
                    </div>
                    <div class="shop-prop">
                        <view class="shop-content">
                            <div class="shop-title">{{item.name}}</div>
                            <button class="baguette" @tap="_goStore(item.id)">{{language.search2.searchRes.store}}</button>
                        </view>
                        <view class="shop-count">
                            <view>
                                <p class="sum">{{item.quantity_on_sale}}</p>
                                <p class="sum-name">{{language.search2.searchRes.sale}}</p>
                            </view>
                            <view>
                                <p class="sum">{{item.quantity_sold}}</p>
                                <p class="sum-name">{{language.search2.searchRes.Sold}}</p>
                            </view>
                            <view>
                                <p class="sum">{{item.follow}}</p>
                                <p class="sum-name">{{language.search2.searchRes.num}}</p>
                            </view>
                        </view>
                    </div>
                </li>
            </ul>
            <uni-load-more :loadingType="loadingType" v-if="searchgoods.length>9"></uni-load-more>
            <ul class='home-hot margin-top' id="margin-top">
                <li v-if='!success'>
                    <div class='empty_play'>
                        <img :src="no_search"/>
                        <p>{{language.search2.searchRes.Tips[0]}}“{{searchtxt}}”{{language.search2.searchRes.Tips[1]}}<br>{{language.search2.searchRes.Tips[2]}}~</p>
                    </div>
                </li>
            </ul>
        </div>
        <div slot="bottom" class="mint-loadmore-bottom">
            <span v-if="bottomStatus === 'pull'">{{bottomPullText}}</span>
            <span v-if="bottomStatus === 'drop'">{{bottomDropText}}</span>
        </div>
        <div class="goods_like_bottom" v-if='loading'>
            <div class='goods_like_hr'></div>
            <span>{{language.search2.searchRes.Tips[3]}}</span>
            <div class='goods_like_hr'></div>
        </div>
        

        <skus ref="attrModal" @confirm="_confirm"></skus>
    </div>
</template>

<script>
    import {mapMutations} from 'vuex'
    import skus from '../../components/skus.vue';
    import heads from '@/components/header.vue'
    import uniLoadMore from '@/components/uni-load-more.vue'

    export default {
        data () {
            return {
                title: '搜索结果',
                back_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/back2x.png',
                empic_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/spnull2x.png',
                serchimg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/searchNew.png',
                shoppingImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/allgoods_shopImg.png',
                shoppingImgGray: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/shopping_cart_gray.png',
                filter: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/filter.png',
                filter_h: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/filter_h.png',
                sortingBottom: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/sortingBottom.png',
                sortingBottomh: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/sortingBottomh.png',
                sortingTop: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/sortingTop.png',
                sortingToph: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/sortingToph.png',
                jiantouBottom: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jiantouBottom.png',
                jiantouTop: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jiantouTop.png',
                no_search: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/no_search.png',
                sc_icon: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL+'images/icon1/delete2x.png',
                host: '',
                searchtxt: '',
                storag: '', //	接收历史记录的值
                prompt: '', //	接收输入提示的值
                searchgoods: '', //接收搜索后商品返回的数据
                success: true, //搜索商品是否有数据返回
                s_type: '', //判断从那个页面进入
                page: 1, //加载页面
                allLoaded: false,
                autoFill: false, //若为真，loadmore 会自动检测并撑满其容器
                bottomStatus: '',
                bottomPullText: '上拉加载更多...',
                bottomDropText: '释放更新...',
                loading: false,
                topTabBar: 0, // 0|1，商品|店铺
                placeStyle: 'color:#999999',

                loadingType: 0,

                mask_display1: false,
                attribute_id: '',
                attrList: '',
                skuBeanList: '',
                num: '', //规格数量
                price: '', //规格价格
                imgurl: '', //规格图片
                haveSkuBean: '', //选择规则属性
                shopping_id: '', //单个商品购物车id
                closeImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/guanbi2x.png',
                jian_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jianhui2x.png',
                jian_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jian2x.png',
                jia_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jia+2x.png',
                jia_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/add+2x.png',
                fastTap: true,
                proid: '',
                numb: 1,
                
                highKeys: {},
                skuName: 'SkuID',
                skuName1: 'Price',
                skuName2: 'Pic',
                skuName3: 'Stock',
                spliter: ',',
                list: {},
                result: {},
                
                searchType: '',
                filterMaskFlag: false,
                
                pinpaiFlag: false,
                sorting: 'asc', //  desc：降序，  asc：升序
                brand_list: [],
                brand_id: '',
                min_price: '', //最低价
                max_price: '',
                brand_id1: '',
                min_price1: '', //最低价
                max_price1: '',
                mch_status:false
            }
        },
        onReachBottom () {
            if (this.loadingType != 0) {
                return
            }
            this.loadingType = 1

            this.page++

            let query_criteria = {
                brand_id: this.brand_id1,
                min_price: this.min_price1,
                max_price: this.max_price1
            }
            var data = {
                module: 'app',
                action: 'search',
                app: 'search',
                num: this.page,
                type: this.topTabBar,
                keyword: this.searchtxt,
                sort_criteria: this.searchType,
                query_criteria: JSON.stringify(query_criteria)
            }
            
            if(this.searchType == 'volume' || this.searchType == 'price'){
                data.sort = this.sorting
            }
            
            this.$req.post({ data }).then(res => {
                let { code, message } = res
                if (code == 200) {
                    let data = res.data.list
                    
                    if(this.topTabBar == 0){
                        data.filter(item=>{
                            item.vip_price = Number(item.vip_price).toFixed(2)
                            item.vip_yprice = Number(item.vip_yprice).toFixed(2)
                        })
                    }
                    
                    this.searchgoods.push(...data)

                    if (data.length > 9) {
                        this.loadingType = 0
                    } else {
                        this.loadingType = 2
                    }
                } else {
                    this.loadingType = 0
                    uni.showToast({
                        title: message,
                        duration: 1500,
                        icon: 'none'
                    })
                }
            })
        },
        onLoad (option) {
            this.searchtxt = option.searchtxt
            this.topTabBar = parseInt(option.topTabBar)
            this.s_type = this.$store.state.type
            this.$nextTick(() => {
                this._axios()
            })

        },
        components: {
            heads, uniLoadMore, skus
        },
        computed: {
            halfWidth: function () {
                var gru = uni.getStorageSync('data_height') ? uni.getStorageSync('data_height') : this.$store.state.data_height
                var heigh = parseInt(gru)
                // #ifdef MP
                heigh = 0
                // #endif
                return heigh + 'px'
            }
        },
        methods: {
            cleardata(){
                this.searchtxt = ''  
            },
            changeBrand(item){
                this.brand_id = item.brand_id
            },
            removeMask(){
                this.filterMaskFlag = false
                
                this.min_price = this.min_price1
                this.max_price = this.max_price1
                this.brand_id = this.brand_id1
            },
            reset(){
                this.min_price = ''
                this.max_price = ''
                this.brand_id = ''
            },
            filterOk(){
                this.min_price1 = this.min_price
                this.max_price1 = this.max_price
                this.brand_id1 = this.brand_id
                
                this.page = 1
                this._axios()
                this.filterMaskFlag = false
            },
            shaixuanClick(){
                this.filterMaskFlag = !this.filterMaskFlag
                
                if(!this.filterMaskFlag){
                    this.min_price = this.min_price1
                    this.max_price = this.max_price1
                    this.brand_id = this.brand_id1
                }
            },
            pinpaiClick(){
                this.pinpaiFlag = !this.pinpaiFlag
            },
            clickType(type){
                if((type == 'volume' || type == 'price') && this.searchType == type){
                    this.sorting = this.sorting=='asc'?'desc':'asc'
                }else{
                    this.sorting = 'asc'
                }
                this.searchType = type
                
                this.page = 1
                this._axios();
            },
            _searchB(){
                this.page = 1
                
                uni.pageScrollTo({
        　　　　　　duration:0,
        　　　　　　scrollTop:0
        　　　　})
                this._axios()
            },
            // 点击确定购买之后，如果库存不为零。则运行
            _shopping (id) {
                var me = this
                if (this.haveSkuBean) {
                    var data = {
                        module: 'app',
                        action: 'product',
                        app: 'add_cart',
                        pro_id: this.proid,
                        attribute_id: this.haveSkuBean.cid,
                        num: this.numb,
                        type: 'addcart',
                        access_id: this.$store.state.access_id
                    }

                    uni.request({
                        data,
                        url: uni.getStorageSync('url'),
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        method: 'POST',
                        success: (res) => {
                            // if(res.data.code==404){
                            //   request(me)
                            //   return
                            // }
                            console.log(res)
                            let {
                                data: {
                                    code,
                                    data,
                                    message
                                }
                            } = res
                            console.log(code, message)
                            if (code == 200) {
                                uni.showToast({
                                    title: this.language.search2.searchRes.Tips[4],
                                    duration: 1000,
                                    icon: 'none'
                                })
                                me.access_id = data.access_id
                                me.$store.state.access_id = data.access_id

                                this.fastTap = true
                                me.haveSkuBean = ''
                                me.$refs.attrModal._mask_f()
                            } else {
                                console.log(message)
                                this.fastTap = true
                            }
                        },
                        error: function (err) {
                            console.log(err)
                            this.fastTap = true
                        }
                    })
                } else {
                    console.log(me.haveSkuBean)
                    this._mask_display()
                    this.fastTap = true
                }
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
                            title: this.language.search2.searchRes.Tips[5],
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
                            title: this.language.search2.searchRes.Tips[5],
                            duration: 1000,
                            icon: 'none'
                        })
                        this.fastTap = true
                    } else {
                        uni.showToast({
                            title: this.language.search2.searchRes.Tips[6],
                            duration: 1000,
                            icon: 'none'
                        })
                        this.fastTap = true
                    }
                }
                console.log(this.haveSkuBean)
            },
            // 为你推荐商品右下角的小购物车图标
            shopping_j (id) {
                var me = this
                console.log(this.fastTap)
                if (!this.fastTap) {
                    return
                }
                this.fastTap = false
                this.proid = id
                var data = {
                    module: 'app',
                    action: 'product',
                    app: 'index',
                    pro_id: id,
                }
                uni.request({
                    data,
                    url: uni.getStorageSync('url'),
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    method: 'POST',
                    success: (res) => {
                        // if(res.data.code==404){
                        //   request(me)
                        //   return
                        // }
                        me.fastTap = true
                        console.log(res)
                        let {
                            data: {
                                data: {
                                    collection_id,
                                    pro,
                                    comments,
                                    attrList,
                                    skuBeanList,
                                    attribute_list,
                                    qj_price,
                                    type
                                }
                            }
                        } = res
                        me.ys_price = qj_price
                        // me.goods=
                        me.attrList = attrList
                      
                       me.$refs.attrModal.imgurl = pro.img_arr[0]
                       me.$refs.attrModal.num = pro.num
                       me.$refs.attrModal.price = qj_price
                       me.$refs.attrModal.skuBeanList = attribute_list
                       me.$refs.attrModal.initData()
                       me.$refs.attrModal._mask_display()
                       
                        me.collection = type
                    },
                    error: function (err) {
                        console.log(err)
                        me.fastTap = true
                    }
                })

            },
            // 点击搜索框返回搜索页面
            handleinput () {
                uni.hideKeyboard()
                uni.navigateBack({
                    delta: 1
                })
            },
            // 点击搜索图标回到进入搜索功能的页面
            _goBack () {
                uni.navigateBack({
                    delta: 2
                })
            },
            // 点击去逛逛回到商城首页
            _home () {
                uni.switchTab({
                    url: '../../pages/tabBar/home'
                })
            },
            _axios () {
                if(this.page == 1){
                    uni.pageScrollTo({ 　　　　　　
            　　　　　　duration: 0,//过渡时间必须为0，否则运行到手机会报错
            　　　　　　scrollTop: 0 //滚动到实际距离是元素距离顶部的距离减去最外层盒子的滚动距离（如res.top - data.top）
            　　　　})
                }
                
                var me = this
                let query_criteria = {
                    brand_id: this.brand_id1,
                    min_price: this.min_price1,
                    max_price: this.max_price1
                }
                var data = {
                    module: 'app',
                    action: 'search',
                    app: 'search',
                    num: this.page,
                    type: this.topTabBar,
                    keyword: this.searchtxt,
                    sort_criteria: this.searchType,
                    query_criteria: JSON.stringify(query_criteria)
                }
                
                if(this.searchType == 'volume' || this.searchType == 'price'){
                    data.sort = this.sorting
                }
                
                if (this.searchtxt != '') { //搜索框不为空
                    this.$req.post({data}).then(res => {
                        if (res.code == 200) {
                            if(this.brand_list.length == 0){
                                this.brand_list = res.data.brand_class_list
                            }
                            
                            var data = res.data.list
                            this.mch_status = res.data.mch_status
                            console.log(this.mch_status)
                            if (data.length) {
                                if(this.topTabBar == 0){
                                    data.filter(item=>{
                                        item.vip_price = Number(item.vip_price).toFixed(2)
                                        item.vip_yprice = Number(item.vip_yprice).toFixed(2)
                                    })
                                }
                                
                                me.searchgoods = data
                                me.success = true
                                if (me.searchgoods.length < 10) {
                                    me.allLoaded = true
                                } else {
                                    me.allLoaded = false
                                }

                                if (data.length > 9) {
                                    me.loadingType = 0
                                } else {
                                    me.loadingType = 2
                                }
                            } else {
                                me.searchgoods = '未找到相关宝贝'
                                me.success = false
                            }
                        } else {
                            me.success = false
                            uni.showToast({
                                title: res.message,
                                duration: 1500,
                                icon: 'none'
                            })
                        }
                    })
                }
            },
            // 点击导航切换商品/店铺
            _search (type) {
                this.searchgoods = ''
                this.topTabBar = type
                this.success = true
                this.page = 1
                this._axios()
            },
            // 进店
            _goStore (shop_id) {
                uni.navigateTo({
                    url: '../../pagesA/store/store?shop_id=' + shop_id
                })
            },
            // 下拉加载
            loadBottom () {
                var me = this
                var data = {
                    module: 'app',
                    action: 'search',
                    app: 'search',
                    page: this.page
                }
                if (this.searchgoods.length > 0) {
                    uni.request({
                        data,
                        url: uni.getStorageSync('url'),
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        method: 'POST',
                        success: (res) => {
                            if (res.data.code == 200) {
                                console.log(res)
                                let {
                                    data: {
                                        data
                                    }
                                } = res
                                me.page += 1
                                if (data.length < 10 && data.length > 0) {
                                    me.searchgoods = me.searchgoods.concat(data)
                                } else {
                                    me.allLoaded = true
                                    me.loading = true
                                }
                                me.$refs.loadmore.onBottomLoaded()
                            } else {
                                uni.showToast({
                                    title: res.data.message,
                                    duration: 1500,
                                    icon: 'none'
                                })
                            }
                        },
                        error: function (err) {
                            console.log(err)
                        },
                    })
                }
            },
            handleBottomChange (status) {
                this.bottomStatus = status
            },
            /*   跳转商品详情页    */
            _goods (id) {
                this.pro_id(id)
                uni.navigateTo({
                    url: '/pages/goods/goodsDetailed?toback=true&pro_id='+id
                })
            },
            ...mapMutations({
                pro_id: 'SET_PRO_ID',
                type: 'SET_TYPE',
                scroll_t: 'SET_SCROLL_T'
            }),
        },
        beforeDestroy () {
            this.type('')
        },
        // 			beforeRouteLeave(to, from, next){
        //   				let position = document.documentElement.scrollTop || document.body.scrollTop
        //   				this.scroll_t(position) //离开路由时把位置存起来
        //   				next()
        // 			},
        updated () {
            this.$nextTick(function () {
                let position = this.$store.state.scroll_t //返回页面取出来
            })
        }
    }
</script>

<style scoped lang="less">
    @import url("../../static/css/search/searchResult.less");

    .mask {
        height: 100vh;
        width: 100%;
        background-color: rgba(000, 000, 000, 0.5);
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999;
    }

    .cha {
        width: 24rpx;
        height: 24rpx;
        position: absolute;
        top: 0;
        right: 0;
    }

    .back {
        background-color: #fff;
        height: 52rpx;
        border-radius: 8rpx;
    }

    .orange {
        background-color: #FFFFFF;
        color: @btnBackground;
        height: 52rpx;
        border: 2rpx solid @btnBackground !important;
        border-radius: 8rpx;
    }

    .select {
        color: #666666;
        height: 56rpx;
        border: 0rpx solid rgba(2, 2, 2, 1) !important;
        background: rgba(248, 248, 248, 1);
        border-radius: 8rpx;
    }

    .select > view {
        margin: 0px 30rpx;
    }

    .orange > view {
        margin: 0px 30rpx;
    }

    .mask_d {
        height: auto;
    }

    .mask_two li {
        float: left;
        width: auto;
        min-width: 60rpx;
        border: 1px solid #eee;
        margin: 24rpx 20rpx 0 0;
        padding: 0 10rpx;
    }

    .queren_div {
        height: 98rpx;
    }

    .mask_num {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 90rpx;
    }

    .mask_quren {
        position: absolute;
    }

    .goods_mun {
        color: #9D9D9D;
        padding: 0rpx;
        display: inline-block;
        width: auto;
        background-color: #F8F8F8;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-around;
    }

    .goods_mun {
        display: flex;
        align-items: center;
        border: 1px solid #DDDDDD;
        border-radius: 8rpx;
        height: 46rpx;
        width: 170rpx;
    }

    .goods_mun span {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
    }

    .goods_mun span img {
        width: 16rpx;
        height: 16rpx;
        padding: 10rpx;
        /* #ifdef MP-ALIPAY */
        background-size: 25rpx 25rpx !important;
        width: 0.1rem;
        height: 0.07rem;
        /* #endif */

    }

    .border-right {
        border-right: 1px solid #ddd !important;
    }

    .border-left {
        border-left: 1px solid #ddd !important;
    }
</style>
