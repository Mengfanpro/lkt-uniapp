<template>
    <view class="container">
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <view class="mack" v-if="isMack" @tap="removeMask"></view>
        <Heads :title="language.choose_shopping.title"></Heads>
        <!-- select start -->
        <view class="select">
            <view class="content" :class="{ hover: showItemList1 }" @click="handleItemClick1">
                <view class="item" v-if="product_class == ''">{{ language.choose_shopping.classify }}</view>
                <view class="item" v-else>{{ product_class }}</view>
            </view>
            <view class="content" :class="{ hover: showItemList2 }" @click="handleItemClick2">
                <view class="item" v-if="product_class1 == ''">{{ language.choose_shopping.subclass }}</view>
                <view class="item" v-else>{{ product_class1 }}</view>
            </view>
            <view class="content" :class="{ hover: showItemList3 }" @click="handleItemClick3">
                <view class="item" v-if="brand_class == ''">{{ language.choose_shopping.brand }}</view>
                <view class="item" v-else>{{ brand_class }}</view>
            </view>
            <view class="content" :class="{ hover: showGengduo }" @click="handleMoreClick">
                <view class="item">{{ language.choose_shopping.more }}</view>
            </view>
            <!-- item-list start -->
            <view class="item-list" v-if="showItemList1">
                <view
                    :class="{ active: isActive && product_class_id == item.cid }"
                    class="category"
                    v-for="(item, index) of product_class_list"
                    :key="item.cid"
                    @click="handleClassNameClick1(item.cid)"
                >
                    {{ item.pname }}
                </view>
            </view>
            <!-- item-list end -->
            <!-- item-list start -->
            <view class="item-list" v-if="showItemList2">
                <view
                    :class="{ active: product_class_id1 == item.cid }"
                    class="category"
                    v-for="item of product_class_list1"
                    :key="item.cid"
                    @click="handleClassNameClick2(item.cid)"
                >
                    {{ item.pname }}
                </view>
            </view>
            <!-- item-list end -->
            <!-- item-list start -->
            <view class="item-list" v-if="showItemList3">
                <view
                    :class="{ active: brand_id == item.brand_id }"
                    class="category"
                    v-for="item of brand_class_list"
                    :key="item.brand_id"
                    @click="handleClassNameClick3(item.brand_id)"
                >
                    {{ item.brand_name }}
                </view>
            </view>
            <!-- item-list end -->

            <!-- 点击更多的时候显示 start-->
            <view class="more" v-if="showGengduo">
                <view class="input-content">
                    <view class="product_name">{{ language.choose_shopping.productName }}</view>
                    <input
                        type="text"
                        :placeholder="language.choose_shopping.productNamePlaceholder"
                        class="moreinput"
                        placeholder-style="font-size:24rpx; color: #b8b8b8;"
                        v-model="proName1"
                    />
                </view>
                <view class="more_btn">
                    <button type="warn" class="cancel" @tap="cancel()">{{ language.choose_shopping.reset }}</button>
                    <button type="warn" class="end" @tap="check()">{{ language.choose_shopping.confirm }}</button>
                </view>
            </view>
            <!-- end -->
        </view>
        <!-- select end -->

        <!-- main start -->
        <view class="main" v-if="list.length > 0">
            <view class="main-item" v-for="(item, index) of list" :key="item.id" @tap.stop="_checkedOne(item.id, index)">
                <image class="focus" :src="display_img[index] ? quan_hei : quan_hui"></image>
                <image :src="item.imgurl" mode="" class="product-img"></image>
                <view class="main-content" @tap.stop="toGoods(item.id)">
                    <view class="content-title">{{ item.product_title }}</view>
                    <view class="money">
                        <span>￥{{ item.price.toFixed(2) }}</span>
                        {{language.choose_shopping.kucun}}{{item.num}}
                    </view>
                </view>
            </view>
            <uni-load-more v-if="list.length > 10" :loadingType="loadingType"></uni-load-more>
        </view>
        <view class="main" v-if="is_empty" style="text-align: center;background: transparent;">
            <div><img class="noFindImg" style="margin-top: 100px;width: 218rpx;height: 248rpx;" :src="noOrder" /></div>
            <span class="noFindText">{{ language.choose_shopping.nopro }}</span>
        </view>
        <!-- main end -->

        <!-- bottom start -->
        <view class="bottom">
            <view class="left">
                <view class="quanxuan">
                    <image :src="selectAll ? quan_hei : quan_hui" mode="" class="quanxuan-icon" @click="_selectAll"></image>
                    <text @click="_selectAll">{{ language.choose_shopping.checkAll }}</text>
                </view>
                <view class="yixuan">
                    {{ language.choose_shopping.selected }}
                    <text class="number" style="margin: 0 6rpx;">{{ pro_id.length }}</text>
                    {{ language.choose_shopping.items }}
                </view>
            </view>
            <view class="right" @click="add()">{{ language.choose_shopping.add }}</view>
        </view>
        <!-- bottom end -->
        
        <view class="maskN" @touchmove.stop.prevent v-if="noFreightFlag">
            <view>
                <view class="text">{{language.choose_shopping.nofreight}}</view>
                <view class="maskBottom">
                    <view @tap="cancelFreight">{{language.choose_shopping.cancel}}</view>
                    <view @tap="confirmFreight">{{language.choose_shopping.confirm}}</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import Heads from '../../components/header.vue';
import uniLoadMore from '@/components/uni-load-more.vue';
export default {
    data() {
        return {
            noOrder: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/fenlei.png',
            title: '自选商品',
            loadingType: 0,
            page: 1,
            item_icon: '',
            showItemList: false, //true: 显示商品品种  false: 不显示
            showGengduo: false, //是否显示更多
            display_img: [], //圆圈的选中状态
            quan_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/xuanzehui2x.png',
            quan_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/xuanzehei2x.png',
            selectArray: [], //存储选中商品
            goods: 0, //初始化页面的商品数量
            gou_icon: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/gouhei.png',
            category_: false,
            category: 'category',
            showItemList1: false, //true: 显示商品一级分类  false: 不显示
            showItemList2: false, //true: 显示商品二级分类  false: 不显示
            showItemList3: false, //true: 显示商品品牌  false: 不显示
            product_class_list: [],
            product_class_list1: [],
            brand_class_list: [],
            selectAll: false, //全选状态
            //商品集合
            list: [],
            product_class: '',
            product_class1: '',
            brand_class: '',
            product_class_id: '',
            product_class_id1: '',
            brand_id: '',
            proName: '',
            proName1: '',
            secondClass: [],
            manage_pay: '添加',
            pro_id: [],
            isActive: false,
            isMack: false,

            urlString: '',
            freight_status: false,
            noFreightFlag: false,
            
            is_empty: false
        };
    },
    onLoad(option) {
        this.isLogin(() => {
            this.access_id = uni.getStorageSync('access_id') ? uni.getStorageSync('access_id') : this.$store.state.access_id;
            this.shop_id = uni.getStorageSync('shop_id') ? uni.getStorageSync('shop_id') : this.$store.state.shop_id;
        });

        this.urlString = '&up1=' + option.up1 + '&up2=' + option.up2;
    },
    onShow() {
        if(this.$store.state.chooseProFlag){
            this.selectArray = [];
            this.display_img = [];
            this.pro_id = [];
            this.selectAll = false;
            this.$store.state.chooseProFlag = false
        }
        
        this.isLogin(() => {
            this.access_id = uni.getStorageSync('access_id') ? uni.getStorageSync('access_id') : this.$store.state.access_id;
            this.page = 1;
            this.loadingType = 0;
            this._axios();
        });

        // this._axios()
    },
    components: {
        Heads,
        uniLoadMore
    },
    // watch:{
    //     product_class() {
    //         // this.brand_class = ''
    //         console.log(this.brand_class)
    //     }
    // },
    methods: {
        removeMask(){
            this.showItemList1 = false;
            this.showItemList2 = false;
            this.showItemList3 = false;
            this.showGengduo = false;
            this.isMack = false;
        },
        confirmFreight(){
            this.noFreightFlag = false
            uni.navigateTo({
                url: '/pagesA/myStore/freight'
            })
        },
        cancelFreight(){
            this.noFreightFlag = false
        },
        changeLoginStatus() {
            this.access_id = uni.getStorageSync('access_id') ? uni.getStorageSync('access_id') : this.$store.state.access_id;
        },
        _axios() {
            uni.showLoading({
                title: this.language.showLoading.loading
            });
            let data = {
                module: 'app',
                action: 'mch',
                m: 'add_goods_page',
                access_id: this.access_id,
                shop_id: this.shop_id
            }
            
            this.$req.post({data}).then(res=>{
                if (res.code == 200) {
                    this.product_class_list = res.data.product_class_list;
                    this.brand_class_list = res.data.brand_class_list;
                    this.list = res.data.list;
                    this.freight_status = res.data.freight_status
                    if(res.data.list.length > 0) {
                        this.is_empty = false
                    } else {
                        this.is_empty = true
                    }
                    uni.hideLoading();
                }
            })
        },
        //点击显示分类列表
        handleItemClick() {
            //this.showGengduo = false
            this.showItemList = !this.showItemList;
        },
        // 点击显示一级分类列表
        handleItemClick1() {
            this.showItemList1 = !this.showItemList1;
            this.showItemList2 = false;
            this.showItemList3 = false;
            this.showGengduo = false;
            this.isMack = true;
            this.isMackClick();
        },
        // 点击显示二级分类列表
        handleItemClick2() {
            //判断如果你没有点击分类的话这里就不会显示（会有一个提示）
            if (this.product_class_list1.length === 0) {
                uni.showToast({
                    title: this.language.choose_shopping.beforeClass,
                    duration: 2000,
                    icon: 'none'
                });
                return;
            }

            this.showItemList1 = false;
            this.showItemList2 = !this.showItemList2;
            this.showItemList3 = false;
            this.showGengduo = false;
            this.isMack = true;
            this.isMackClick();
        },
        // 点击显示品牌列表
        handleItemClick3() {
            if (this.product_class_list1.length === 0) {
                uni.showToast({
                    title: this.language.choose_shopping.beforeClass,
                    duration: 2000,
                    icon: 'none'
                });
                return;
            }
            
            this.showItemList1 = false;
            this.showItemList2 = false;
            this.showItemList3 = !this.showItemList3;
            this.showGengduo = false;
            this.isMack = true;
            this.isMackClick();
        },
        // 更多
        handleMoreClick() {
            this.showGengduo = !this.showGengduo;
            this.showItemList3 = false;
            this.showItemList2 = false;
            this.showItemList1 = false;
            this.isMack = true;
            this.proName1 = this.proName;
            this.isMackClick();
        },
        // 取消
        cancel() {
            this.proName1 = ''
            // this.showGengduo = !this.showGengduo;
            // this.isMack = false;
        },
        // 确定
        check() {
            this.proName = this.proName1
            this.showGengduo = !this.showGengduo;
            this.goods_query();
            this.isMack = false;
        },
        //判断是否显示遮照层
        isMackClick() {
            if (this.showItemList1 === false && this.showItemList2 === false && this.showItemList3 === false && this.showGengduo === false) {
                this.isMack = false;
            }
        },
        // 选择一级分类
        handleClassNameClick1(e) {
            this.isActive = true;
            this.showItemList1 = !this.showItemList1;
            
            this.brand_class = ''
            this.brand_id = ''
            
            if(this.product_class_id == e){
                this.product_class_id = ''
                this.product_class = ''
                
                this.product_class_list1 = [];
                this.product_class1 = '';
                this.product_class_id1 = '';
                this.secondClass = []
            }else{
                this.product_class_id = e;
                for (var i in this.product_class_list) {
                    if (this.product_class_list[i].cid == e) {
                        this.product_class = this.product_class_list[i].pname;
                        this.secondClass = this.product_class_list[i].res;
                    }
                }
                this.product_class_list1 = [];
                this.product_class1 = '';
                this.product_class_id1 = '';
                for (var j in this.secondClass) {
                    this.product_class_list1.push(this.secondClass[j]);
                }
            }
            
            
            this.goods_query();
            this.isMack = false;
        },
        // 选择二级分类
        handleClassNameClick2(e) {
            this.showItemList2 = !this.showItemList2;
            
            if(this.product_class_id1 == e){
                this.product_class_id1 = ''
                this.product_class1 = ''
            }else{
                this.product_class_id1 = e;
                for (var i in this.product_class_list1) {
                    if (this.product_class_list1[i].cid == e) {
                        this.product_class1 = this.product_class_list1[i].pname;
                    }
                }
            }
            
            this.goods_query();
            this.isMack = false;
        },
        // 选择品牌
        handleClassNameClick3(e) {
            this.showItemList3 = !this.showItemList3;
            
            if(this.brand_id == e){
                this.brand_id = ''
                this.brand_class = ''
            }else{
                this.brand_id = e;
                for (var i in this.brand_class_list) {
                    if (this.brand_class_list[i].brand_id == e) {
                        this.brand_class = this.brand_class_list[i].brand_name;
                    }
                }
            }
            
            this.goods_query();
            this.isMack = false;
        },
        // 商品查询
        goods_query() {
            this.page = 1;
            var data = {
                module: 'app',
                action: 'mch',
                m: 'goods_query',
                access_id: this.access_id,
                shop_id: this.shop_id,
                product_class_id: this.product_class_id,
                product_class_id1: this.product_class_id1,
                brand_id: this.brand_id,
                proName: this.proName
            };
            
            this.$req.post({data}).then(res=>{
                if(res.code == 200){
                    this.list = res.data.list;
                }
            })
        },
        toGoods(id){
            uni.navigateTo({
                url: '/pagesA/myStore/uploadPro?pageStatus=seePro&p_id='+id
            })
        },
        //单选
        _checkedOne(item, indexli) {
            var cum = -1;
            var i = 0;
            console.log(indexli)
            console.log(this.selectArray[indexli])
            //新增循环查找数据
            for (i; i < this.selectArray.length; i++) {
                if (this.selectArray[i] == item){
                    cum = 1;
                    break
                } else {
                    cum = -1;
                }
            }
            // 如果是有的话 点击就是取消
            // 判断点击的传入的值是否存在数组中，如果没有添加，如果有删除，同时设定选中状态（第一次点击添加进数组，第二次点击从数组中删除）
            if (cum < 0 && !this.selectAll) {
                // 点击新增
                this.selectArray.push(item);
                this.$set(this.display_img, indexli, true);
                this.pro_id.push(item);
            } else {
                // 点击取消
                let delI = this.selectArray.findIndex(items => {
                    return items == item;
                });
                this.selectArray.splice(delI, 1);
                this.$set(this.display_img, indexli, false);
                for (var k in this.pro_id) {
                    if (this.pro_id[k] == item) {
                        this.pro_id.splice(k, 1);
                    }
                }
            }
            //根据产品选状态，设定全选状态
            if (this.selectArray.length == this.list.length) {
                this.selectAll = true;
            } else {
                this.selectAll = false;
            }
        },
        //全选
        _selectAll() {
            this.selectAll = !this.selectAll;
            if (this.selectAll) {
                for (var i = 0; i < this.list.length; i++) {
                    this.$set(this.selectArray, i, this.list[i]);
                    this.$set(this.display_img, i, true);
                    
                    this.pro_id.push(this.list[i].id);
                }
                //去重
                this.pro_id=Array.from(new Set(this.pro_id));
            } else {
                this.selectArray = [];
                for (var i = 0; i < this.list.length; i++) {
                    this.$set(this.display_img, i, false);
                }
                this.pro_id = [];
            }
        },
        add() {
            if (this.pro_id.length == 0) {
                uni.showToast({
                    title: this.language.choose_shopping.pleaseChoose,
                    duration: 1500,
                    icon: 'none'
                });
            } else {
                
                if(!this.freight_status){
                    this.noFreightFlag = true
                    return
                }
                
				uni.navigateTo({
					url: 'choose_freight?shop_id=' + this.shop_id + '&pro_id=' + this.pro_id.join(',') + this.urlString
				})
				
            }
        }
    },
    onReachBottom: function() {
        if (this.loadingType != 0) {
            return;
        }
        this.loadingType = 1;
        var data = {
            module: 'app',
            action: 'mch',
            m: 'add_goods_page_load',
            access_id: this.access_id,
            shop_id: this.shop_id,
            product_class_id: this.product_class_id,
            product_class_id1: this.product_class_id1,
            brand_id: this.brand_id,
            proName: this.proName,
            page: ++this.page
        };
        
        this.$req.post({data}).then(res=>{
            let {
                code,
                data: { list }
            } = res;
            
            if(code == 200){
                if (list.length > 0) {
                    this.list = this.list.concat(list);
                    this.loadingType = 0;
                    //如果还有数据则重置全选状态
                    this.selectAll = false;
                } else {
                    this.loadingType = 2;
                }
            }
        })
    }
};
</script>

<style scoped lang="less">
page {
    background: #FFFFFF;
}
.container {
    position: relative;
    width: 100vw;
}
.select {
    position: fixed;
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100vw;
    height: 100rpx;
    border-top: 1rpx solid #eeeeee;
    border-bottom: 1rpx solid #e6e6e6;
    background-color: #ffffff;
    z-index: 10000;
}
.select .content {
    position: relative;
    color: #666666;
}
.select .content::after {
    content: '';
    position: absolute;
    top: -8rpx;
    bottom: 0;
    right: -20rpx;
    margin: auto;
    display: inline-block;
    width: 10rpx;
    height: 10rpx;
    border-left: 2rpx solid #999999;
    border-bottom: 2rpx solid #999999;
    border-right: 2rpx solid transparent;
    border-top: 2rpx solid transparent;
    transform: rotate(-45deg);
}
.select .content.hover {
    color: @tabColor;
}
.select .content.hover::after {
    // border-left: 2rpx solid @tabColor;
    // border-bottom: 2rpx solid @tabColor;
    border-right: 2rpx solid @tabColor;
    border-top: 2rpx solid @tabColor;
    border-left: none;
    border-bottom: none;
    top: 1px;
}
.select .item {
    max-width: 110rpx;
    white-space: nowrap;
    overflow: hidden;
    font-size: 28rpx;
    text-overflow: ellipsis;
}
.item-icon {
    width: 10rpx;
    height: 10rpx;
}
.item-list {
    position: absolute;
    top: 100rpx;
    width: 750rpx;
    height: 320rpx;
    padding-left: 100rpx;
    border-top: 2rpx solid #e6e6e6;
    background: #ffffff;
    z-index: 10000;
    overflow-y: scroll;
    font-size: 24rpx;
}
.item-list .category {
    float: left;
    width: 300rpx;
    height: 80rpx;
    line-height: 80rpx;

    color: #666666;
}
.item-list .category:hover {
    background-color: #eeeeee;
}
.isActive {
    background-color: #eeeeee;
}

/* 遮罩 */
/* .mask{
		position: absolute;
		top: 420rpx;
		width: 750rpx;
		height: 500rpx;
		background: #7F7F7F;
		opacity: .5;
		z-index: 10;
	} */

/* main */
.main {
    position: relative;
    width: 750rpx;
    /* height: 1000rpx; */
    margin-top: 102rpx;
    padding-bottom: 100rpx;
}

.main-item {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 180rpx;
    border-bottom: 1px solid #e6e6e6;
    background-color: #ffffff;
}
.main-item .focus {
    width: 34rpx;
    height: 34rpx;
}
.main-item .product-img {
    width: 120rpx;
    height: 120rpx;
}
.main-item .main-content {
    width: 478rpx;
    height: 120rpx;
}
.main-content .content-title {
    font-size: 26rpx;
    color: #020202;
}

.main-content .money {
    padding-top: 10rpx;
    color: #999999;
    font-size: 24rpx;
}
.money span {
    padding-right: 30rpx;
    color: @priceColor;
}

/* bottom */
.bottom {
    position: fixed;
    bottom: 0;
    display: flex;
    width: 750rpx;
    height: 98rpx;
    border-top: 1px solid #e6e6e6;
    z-index: 333;
}
.bottom .left {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 510rpx;
    height: 100%;
    box-sizing: border-box;
    padding: 0 40rpx 0 20rpx;
    background-color: #ffffff;
}
.bottom .right {
    width: 240rpx;
    height: 100%;
    padding-top: 30rpx;
    color: #fff;
    border-radius: 0;
    font-size: 30rpx;
    text-align: center;
    background: @btnBackground;
}
.quanxuan .quanxuan-icon {
    width: 34rpx;
    height: 34rpx;
    vertical-align: middle;
}
.quanxuan text {
    font-size: 28rpx;
    padding-left: 10rpx;
    vertical-align: middle;
}
.yixuan {
    font-size: 28rpx;
    color: #666666;
}
.number {
    color: @priceColor;
    font-weight: 600;
}

.active {
    color: @tabColor !important;
}

.mack {
    position: fixed;
    width: 750rpx;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
}

.more {
    position: absolute;
    top: 102rpx;
    width: 100vw;
    background-color: #ffffff;
    z-index: 1000;
    box-sizing: border-box;
}
.input-content {
    display: flex;
    flex-direction: column;
    padding: 0 30rpx;
    box-sizing: border-box;
    border-bottom: 1px solid #e6e6e6;
}
.more .product_name {
    padding: 27rpx 0 20rpx 0;
    color: #666666;
    font-size: 26rpx;
}
.more .more_btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 720rpx;
    height: 120rpx;
    margin-left: 50%;
    transform: translateX(-50%);
    // border-top: 1px solid #e6e6e6;
}
.more_btn button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 330rpx;
    height: 80rpx;
    line-height: 0;
    border-radius: 8rpx;
    font-size: 28rpx;
}
.more_btn .cancel {
    .outBtn();
}
.more_btn .cancel::after {
    border: none;
}
.more_btn .end {
    .solidBtn();
}
.more_btn .end:after {
    border: 0;
}
.moreinput {
    height: 70rpx;
    border: 1px solid #e6e6e6;
    width: 100%;
    border-radius: 6rpx;
    font-size: 28rpx;
    padding-left: 20rpx;
    box-sizing: border-box;
    color: #020202;
    margin-bottom: 40rpx;
}

.maskN{
    .center();
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background-color: rgba(0,0,0,0.6);
    z-index: 99999;
    
    >view{
        width: 550rpx;
        min-height: 125px;
        background: #FFFFFF;
        border-radius: 23rpx;
        
        .text{
            font-size: 30rpx;
            color: #333333;
            width: 100%;
            height: 90px;
            line-height: 90px;
            text-align: center;
        }
        
        .maskBottom{
            display: flex;
            height: 47px;
            border-top: 1px solid #EEEEEE;
            box-sizing: border-box;
            
            >view{
                .center();
                flex: 1;
                font-size: 34rpx;
                color: #020202;
            }
            
            >view:first-child{
                color: #999999;
                border-right: 1px solid #EEEEEE;
            }
        }
        
    }
    
}
</style>
