<template>
    <div class="conten" @tap="removeMask">
        <div ref="box" class="conten">
            <heads title="分销商品"></heads>
            <!-- 有商品的时候显示 -->

            <div style="height: 104rpx;margin-bottom: 1rpx">
                <div class='allgoods_s home_navigation'>
                    <div class='home_input'>
                        <img class='searchImg' :src="serchimg" alt="">
                        <input type="text" v-model="searchtxt" :placeholder="language.fxProduct.search_placeholder" id='input' :placeholder-style="placeStyle"
                               name="sourch"/>
                    </div>
                    <div class="search_btn" @tap='_searchB'>{{language.search2.searchRes.search_button}}</div>
                </div>
            </div>

            <div style="height: 100rpx">
                <scroll-view
                    class="class"
                    scroll-x="true"
                >
                    <view
                        class="class-item"
                        :class="{ 'class-item-active': key === classOneKey }"
                        v-for="(item, key) of class_list"
                        :key="item.id"
                        @click="classOneClick(key)"
                    >
                        <div style="display:flex;align-items:center;height: 100%;">
                            <text :style="{width: item.width}">{{ item.name }}</text>
                        </div>
                    </view>
                </scroll-view>
            </div>

            <div style="height: 90rpx;">
                <div class='topFilter'>
                    <!--                    <div :class='{"active":searchType == ""}' @tap="clickType('')">{{language.search2.searchRes.TopButton[0]}}</div>-->
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
                </div>
                <div class="filterMask" v-if="filterMaskFlag" @touchmove.stop.prevent></div>
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
                <template v-if="pro_list.length > 0">
                    <div class="goods-list" :style="{gridTemplateRows: gridNum}">
                        <div class="goods-list-item"  v-for="(item, index) in pro_list" :key="index" @click="_goods(item.id, item.p_id)">
                            <image :src="item.imgurl">

                            </image>
                            <p class="goods-title">
                                {{item.product_title}}
                            </p>

                            <view class="price-wrap">
                                <span class="fuhao">￥</span>
                                <span class="price">{{ item.price }}</span>
                            </view>

                            <view class="fx_price">
                                <text>{{language.fxProduct.share_make}} {{ item.fx_price }}</text>
                            </view>
                        </div>
                    </div>
                    <uni-load-more v-if="pro_list.length > 10" :loadingType="loadingType" style="background-color: #f8f8f8;"></uni-load-more>
                </template>

                <!-- 无商品的时候显示 -->
                <div v-if="load && !pro_list.length" class="relative">
                    <div class="search_no">
                        <div class="font_14"><img class="img" :src="noImg" /></div>
                        <span class="span" style="font-size: 28rpx;">{{language.goods.goods.not}}！</span>
                    </div>
                </div>
            </div>
        </div>
        <!--  遮罩：点击购物小图标弹出  -->
        <skeleton :animation="true" :loading="!load" bgColor="#FFF"></skeleton>
    </div>
</template>

<script>
import { mapMutations } from 'vuex';

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
            class_list: [
                {
                    name: '全部分类',
                    width: '152rpx',
                    id: '',
                }
            ]
        };
    },
    computed: {
        gridNum () {
            console.log(this.pro_list);
            console.log('repeat(' + Math.ceil(this.pro_list.length / 2) + ', 510rpx)');
            return 'repeat(' + Math.ceil(this.pro_list.length / 2) + ', 510rpx)';
        },
    },
    components: {  },
    onLoad(option) {
        this.title = option.name;

        this.shop_id = option.shop_id;
        this.getclass();
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
        classOneClick (key) {
            this.classOneKey = key;
            this.page = 1;
            this.pro_list = [];
            this._axios();
            
        },
        _searchB(){
            this.page = 1
            uni.pageScrollTo({
                duration:0,
                scrollTop:0
            })
            this.pro_list = [];
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
            this.pro_list = [];
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
        clickType(type){
            if((type == 'volume' || type == 'price') && this.searchType == type){
                this.sorting = this.sorting=='asc'?'desc':'asc'
            }else{
                this.sorting = 'asc'
            }
            this.searchType = type

            this.page = 1
            this.pro_list = [];
            this._axios();
        },
        getclass () {
            let data = {
                module: 'app',
                action: 'commproduct',
                app: 'getclass',
            };
            this.$req.post({data}).then(res => {
                let {
                    data: {
                        product_class
                    }
                } = res;
                
                product_class.map(item => {
                    
                    let width = '152rpx';
                    if (item.name.length == 2) {
                        width = '116rpx'
                    } else if (item.name.length == 3) {
                        width = '121rpx'
                    }
                    
                    this.class_list.push({
                        id: item.id,
                        name:item.name,
                        width
                    })
                })
            })
        },
        _axios() {
            let query_criteria = {
                brand_id: this.brand_id1,
                min_price: this.min_price1,
                max_price: this.max_price1
            }

            let data = {
                cid: this.class_list[this.classOneKey].id,
                pro: '',
                product_title: this.searchtxt,
                sort_key: this.searchType,
                queue: JSON.stringify(query_criteria),
                module: 'app',
                action: 'commproduct',
                app: 'listdetail',
                distributor_id: this.status_id,
                // pageStart: 10,
                start: this.page,
                
                // pageNo: this.page
            };

            if(this.searchType == 'volume' || this.searchType == 'price'){
                data.queue = this.sorting === 'desc' ? 1: 2
            }

            if (this.shop_id) {
                data.shop_id = this.shop_id;
            }
            this.$req.post({data}).then(res=>{
                if (res.code == 200) {
                    this.load = true
                    let {
                        data: {
                            pro
                        }
                    } = res;
                    this.pro_list = this.pro_list.concat(pro?pro:[]);
                    this.is_grade = res.grade==0?false:true;
                    if (this.pro_list.length==0) {
                        this.loadingType = 2;
                        this.hasGoods = -1
                    } else {
                        this.hasGoods = 1
                        this.loadingType = 0;
                    }
                } else {
                    this.load = true
                    uni.showToast({
                        title: res.message,
                        duration: 1500,
                        icon: 'none'
                    });
                }
            })
        },
        /*   跳转商品详情页    */
        _goods (id, p_id) {
            this.pro_id(id);
            uni.navigateTo({
                url: '/pages/goods/goodsDetailed?isDistribution=true&toback=true&pro_id='+p_id + '&fx_id=' + id
            });
        },
        ...mapMutations({
            pro_id: 'SET_PRO_ID',
            cindex: 'SET_CINDEX'
        })
    },
};
</script>

<style scoped lang="less">
@import url('../../static/css/home/fxProduct.less');
</style>
