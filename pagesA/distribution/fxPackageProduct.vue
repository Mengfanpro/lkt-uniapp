<template>
    <div class="conten" @tap="removeMask">
        <div ref="box" class="conten">
            <heads title="礼包商品"></heads>
            <!-- 有商品的时候显示 -->

            <div style="height: 104rpx;">
                <div class='allgoods_s home_navigation'>
                    <div class='home_input'>
                        <img class='searchImg' :src="serchimg" alt="">
                        <input type="text" v-model="searchtxt" :placeholder="language.fxPackageProduct.search_placeholder" id='input' :placeholder-style="placeStyle"
                               name="sourch"/>
                    </div>
                    <div class="search_btn" @tap='_searchB'>{{language.search2.searchRes.search_button}}</div>
                </div>
            </div>

            <div style="height: 100rpx;background: #fff;margin-bottom: 20rpx;">
                <view class="content">

                    <!-- #ifdef MP -->
                    <ul class='order_header'>
                        <li class='header_li' :class="{header_border:status_id==item.id}" v-for='(item,index) in header'
                            :key='item.id'
                            @tap="_header_index(item.id)">{{item.levelname}}
                        </li>
                    </ul>
                    <!-- #endif -->

                    <!-- #ifndef MP -->
                    <ul class='order_header yh-order_header'>
                        <li class='header_li' :class="{header_border:status_id==item.id}" v-for='(item,index) in header'
                            :key='item.id'
                            @tap="_header_index(item.id)">{{item.levelname}}
                        </li>
                    </ul>
                    <!-- #endif -->

                </view>
            </div>
            <div class="skeleton" v-if="!load">
                <ul class="allgoods relative">
                    <li class="allgoods_li" v-for="(item, index) in 4" :key="index">
                        <div class="proImgBox">
                            <img class="skeleton-rect" src="" />
                        </div>
                        <p class="allgoods_name skeleton-rect" style="margin-bottom: 4px;">{{language.goods.goods.Trade_name}}</p>
                        <p class="allgoods_subtitle skeleton-rect" style="width: 120px;">{{language.goods.goods.subtitle}}</p>
                        <div class="skeleton-rect">
                            <span class="price"></span>
                            <span class="sales">{{language.goods.goods.sales_volume}}：10</span>
                            <!-- 购物图标 -->
                            <img class="img"  src="shopImg" />
                        </div>
                    </li>
                </ul>
            </div>
            <div v-else>
                <template v-if="order.length > 0">
                    <div class="goods-list" :style="{gridTemplateRows: gridNum}">
                        <div class="goods-list-item"  v-for="(item, index) in order" :key="index" @tap="_goods(item.id, item.p_id)">
                            <image :src="item.imgurl">

                            </image>
                            <p class="goods-title">
                                {{item.product_title}}
                            </p>

                            <view class="price-wrap">
                                <span class="fuhao">￥</span>
                                <span class="price">{{item.price}}</span>
                            </view>
                            <view class="fx_price">
                                <text>{{language.fxPackageProduct.share_make}} {{ item.fx_price }}</text>
                            </view>
                        </div>
                    </div>
                    
                    <uni-load-more v-if="pro_list.length > 10" :loadingType="loadingType" style="background-color: #f8f8f8;"></uni-load-more>
                </template>

                <!-- 无商品的时候显示 -->
                <div v-if="!pro_list.length && load" class="relative">
                    <div class="search_no">
                        <div class="font_14"><img class="img" :src="noImg" /></div>
                        <span class="span" style="font-size: 28rpx;">{{language.goods.goods.not}}！</span>
                    </div>
                </div>
            </div>
        </div>
        <!--  遮罩：点击购物小图标弹出  -->
        <skus ref="attrModal" @confirm="_confirm"></skus>

        <skeleton :animation="true" :loading="!load" bgColor="#FFF"></skeleton>
    </div>
</template>

<script>
import { mapMutations } from 'vuex';
import skus from '../../components/skus.vue';

export default {
    data() {
        return {
            is_grade: false,
            fastTap: true,
            shopImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/allgoods_shopImg.png',
            closed: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/guanbi2x.png',
            noImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/noFind.png',
            title: '', //页面标题
            cid: '', //分类id
            loadingType: 0,
            page: 1, //分页码
            pro_list: [],
            jian_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jian2x.png',
            jian_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jianhui2x.png',
            jia_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jia+2x.png',
            jia_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/add+2x.png',
            attribute_id: '',
            attrList: '',
            skuBeanList: '',
            mask_display: false,
            ys_price: '', //规格初始价格
            num: '', //规格数量
            price: '', //规格价格
            imgurl: '', //规格图片
            scan_d: '', //收藏id
            pro: '', //商品信息
            load_next: true, //是否能继续下滑加载
            haveSkuBean: '', //选择规则属性
            numb: 1, //规格选择的数量
            load: false,
            proid: '',
            msg: '',
            shop_id: '',

            highKeys: {},
            skuName: 'SkuID',
            skuName1: 'Price',
            skuName2: 'Pic',
            skuName3: 'Stock',
            spliter: ',',
            list: [],
            result: {},

            filter: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/filter.png',
            filter_h: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/filter_h.png',
            sortingBottom: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/sortingBottom.png',
            sortingBottomh: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/sortingBottomh.png',
            sortingTop: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/sortingTop.png',
            sortingToph: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/sortingToph.png',
            jiantouBottom: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jiantouBottom.png',
            jiantouTop: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jiantouTop.png',
            serchimg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/searchNew.png',
            placeStyle: 'color:#999999',
            header: [
            ],
            searchtxt: '',

            searchType: 'volume',
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
            classOneKey: 0,
            order: [],
            status_id: '',
        };
    },
    computed: {
        gridNum () {
            console.log(this.pro_list);
            console.log('repeat(' + Math.ceil(this.pro_list.length / 2) + ', 510rpx)');
            return 'repeat(' + Math.ceil(this.pro_list.length / 2) + ', 510rpx)';
        },
    },
    components: { skus },
    onLoad(option) {
        this.cid = option.cid;
        this.title = option.name;

        this.shop_id = option.shop_id;

        this._axios();
    },
    // 下拉加载
    onReachBottom: function() {
        if (this.loadingType != 0) {
            return
        }
        this.loadingType = 1;
        this.page++;
        this._axios()
    },
    methods: {
        /**
         *
         * */
        ...mapMutations({
            pro_id: 'SET_PRO_ID',
        }),
        /**
         *
         * */
        _header_index (id) {
            this.status_id = id
            this.page = 1
            this.loadingType = 0
            this.order = [];
            this.pro_list = [];
            this._axios()
        },
        classOneClick (key) {
            this.classOneKey = key;
        },
        _searchB(){
            this.page = 1
            this.order = [];
            this.pro_list = [];
            this.load = false;
            uni.pageScrollTo({
                duration:0,
                scrollTop:0
            })
            this._axios()
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
        
        _axios() {
            let query_criteria = {
                brand_id: this.brand_id1,
                min_price: this.min_price1,
                max_price: this.max_price1
            }

            let data = {
                cid: this.cid,
                pro: '',
                product_title: this.searchtxt,
                sort_criteria: this.searchType,
                query_criteria: JSON.stringify(query_criteria),
                module: 'app',
                action: 'commproduct',
                app: 'getstart',
                distributor_id: this.status_id,
                page: this.page,
            };

            if(this.searchType == 'volume' || this.searchType == 'price'){
                data.sort = this.sorting
            }

            if (this.shop_id) {
                data.shop_id = this.shop_id;
            }
            this.$req.post({data}).then(res=>{
                if (res.code == '200') {
                    this.load = false
                    
                    let {
                        data: {
                            pro,
                            level
                        }
                    } = res;
                    if(pro){
                        pro.filter(item=>{
                            item.vip_price = Number(item.vip_price).toFixed(2)
                            item.vip_yprice = Number(item.vip_yprice).toFixed(2)
                        })
                    }
                    this.header = [
                        {
                            id: '',
                            levelname: '全部'
                        }
                    ]
                    this.order = this.order.concat(pro?pro:[]);
                    this.pro_list =  this.order;

                    this.header = this.header.concat(level);
                    
                    if (this.order.length==0) {
                        this.hasGoods = -1
                        this.loadingType = 2;
                    } else {
                        this.hasGoods = 1
                        this.loadingType = 0;
                    }
                    this.load = true;
                } else {
                    uni.showToast({
                        title: res.message,
                        duration: 1500,
                        icon: 'none'
                    });
                }
            })
        },
        /**
         * 跳转商品详情页
         * */
        _goods (id, p_id) {
            console.log('id+' + id)
            this.pro_id(id)
            uni.navigateTo({
                url: '/pages/goods/goodsDetailed?isDistribution=true&toback=true&pro_id='+p_id + '&fx_id=' + id
            })
        },
        // 点击购物图标
        shopping_j(id) {
            if (!this.fastTap) {
                return;
            }
            this.fastTap = false;
            this.proid = id;
            var data = {
                module: 'app',
                action: 'product',
                app: 'index',
                pro_id: id
            };

            this.$req.post({data}).then(res=>{
                this.fastTap = true;
                if (res.code == 200) {
                    let {
                        data: { collection_id, pro, comments, attrList, skuBeanList, qj_price, type, attribute_list }
                    } = res;

                    this.ys_price = qj_price
                    this.attrList = attrList

                    this.$refs.attrModal.imgurl = pro.img_arr[0]
                    this.$refs.attrModal.num = pro.num
                    this.$refs.attrModal.price = qj_price
                    this.$refs.attrModal.skuBeanList = attribute_list
                    this.$refs.attrModal.initData()
                    this.$refs.attrModal._mask_display()

                    this.collection = type
                } else {
                    uni.showToast({
                        title: res.message,
                        duration: 1500,
                        icon: 'none'
                    });
                }
            }).catch(error=>{
                this.fastTap = true;
            })
        },
        //打开遮罩层
        _mask_display() {
            this.mask_display = true;
            if (!this.haveSkuBean) {
                for (var i = 0; i < this.attrList.length; i++) {
                    var attr = this.attrList[i].attr;
                    if (attr.length == 1) {
                        this.showState(0, i);
                    }
                }
            }
        },
        //关闭遮罩层
        _mask_false() {
            // 关闭弹窗让购买数量重新设为默认
            this.numb = 1;
            this.mask_display = false;
            if (!this.haveSkuBean) {
                for (var i = 0; i < this.attrList.length; i++) {
                    var attr = this.attrList[i].attr;
                    if (attr.length == 1) {
                        this.showState(0, i);
                    }
                }
            }
        },
        //点击遮罩层的关闭按钮
        _mask_f() {
            this.haveSkuBean = '';
            this._mask_false();
            this.mask_display = false;
        },
        //确认
        _confirm(sku) {
            Object.assign(this.$data,sku)

            if (Boolean(this.haveSkuBean)) {
                if (this.num == 0) {
                    uni.showToast({
                        title: this.language.goods.goods.Insufficient_stock,
                        duration: 1000,
                        icon: 'none'
                    });
                } else if (this.num != 0) {
                    this._shopping();
                }
            } else {
                if (this.num == 0) {
                    uni.showToast({
                        title: this.language.goods.goods.Insufficient_stock,
                        duration: 1000,
                        icon: 'none'
                    });
                } else {
                    uni.showToast({
                        title: this.language.goods.goods.Tips,
                        duration: 1000,
                        icon: 'none'
                    });
                }
            }
        },
        //加入购物车
        _shopping() {
            if (this.haveSkuBean) {
                var data = {
                    module: 'app',
                    action: 'product',
                    app: 'add_cart',
                    pro_id: this.proid,
                    attribute_id: this.haveSkuBean.cid,
                    num: this.numb,
                    type: 'addcart'
                };
                if (this.access_id) {
                    data.access_id = this.access_id;
                } else {
                    data.access_id = '';
                }
                if (this.$store.state.nCart) {
                    data.cart_id = this.$store.state.nCart;
                } else {
                    data.cart_id = '';
                }

                this.$req.post({data}).then(res=>{
                    let {
                        code, data, message
                    } = res;
                    if (code == 200) {
                        uni.showToast({
                            title: this.language.goods.goods.add_success,
                            duration: 1000,
                            icon: 'none'
                        });

                        this.haveSkuBean = ''
                        this.$refs.attrModal._mask_f()
                    } else {
                        uni.showToast({
                            title: message,
                            duration: 1500,
                            icon: 'none'
                        });
                    }
                    if (data && data.cart_id) {
                        if (!this.in_array(data.cart_id, this.$store.state.nCart)) {
                            this.$store.state.nCart.push(data.cart_id);
                        }
                    }
                })

            } else {
                this._mask_display();
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
        ...mapMutations({
            pro_id: 'SET_PRO_ID',
            cindex: 'SET_CINDEX'
        })
    },
};
</script>

<style scoped lang="less">
@import url('../../static/css/home/fxPackageProduct.less');
</style>
