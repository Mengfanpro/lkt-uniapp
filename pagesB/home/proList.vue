<template>
    <view class="container" :style="list.length > 0 ? 'background-color: #F6f6f6;':''">
       <heads :title="title"></heads>
       <toload v-if="load"></toload>
       <view class="" v-if="list.length > 0 && !load">
           <view class="content">
                <view class="list" v-for="item,index of list" :key="index" @tap="toUrl('/pages/goods/goodsDetailed?toback=true&pro_id='+item.id)">
                    <view class="list_imageBox">
                        <image :src="item.imgurl" lazy-load="true"></image>
                        <view v-if="item.status == 3">{{language.proList.shelf}}</view>
                    </view>
                    
                    <view class="list_title">{{item.name}}</view>
                    <!-- <view class="list_subTitle">vivo S6 5G 前置3200万超清夜景自拍 4500mAh大电池 双模5G全网通手机</view> -->
                    <view class="list_bottom">
                        <div class="allgoods_li_priceBox">
                            <div>
                                <span>￥</span>
                                {{ item.vip_yprice }}
                            </div>
                           
                        </div>                      
                        <img :src="shopImg" class="allgoods_shopImg" @tap.stop="shopping_j(item.id)"/>
                    </view>
                </view>
           </view>
           
            
            <uni-load-more v-if="list.length>8" :loadingType="loadingType"></uni-load-more>
            
            <skus ref="attrModal" @confirm="_confirm"></skus>
            
       </view>
                
        <view class="nodata" v-else>
             <image :src="noPro" mode="aspectFit"></image>
             <p>{{language.mchList.nodata}}</p>
        </view>
    </view>
</template>

<script>
import skus from '../../components/skus.vue';
    
export default {
    data() {
        return {
            is_grade: false,
            title: '',
            list: [],
            page: 1,
            loadingType: 0,
            load:true,
            fastTap: true,
            proid: '',
            
            shopImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/allgoods_shopImg.png',
            noPro: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/noPro.png',
            haveSkuBean: '',
            num: '',
            numb: '',
			pageType: ''
        };
    },
    components: { skus },
    onLoad(option) {
        this.pageType = option.type
    },
    onShow() {
		if(this.pageType == 1){
			this.title = this.language.proList.title1
		}else if(this.pageType == 2){
			this.title = this.language.proList.title2
		}
		
        this.page = 1
        this.axios()
    },
    // 下拉加载
    onReachBottom: function() {
        if(this.loadingType != 0){
            return
        }
        this.loadingType = 1
        
        this.page++
        this.axios()
    },
    methods: {
        _confirm(sku){
            Object.assign(this.$data,sku)
            console.log(this.haveSkuBean)
            
            if (!this.fastTap) {
                return
            }
            this.fastTap = false
            if (Boolean(this.haveSkuBean)) {
                if (this.num == 0) {
                    uni.showToast({
                        title: this.language.proList.Tips[0],
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
                        title: this.language.proList.Tips[0],
                        duration: 1000,
                        icon: 'none'
                    })
                    this.fastTap = true
                } else {
                    uni.showToast({
                        title: this.language.proList.Tips[1],
                        duration: 1000,
                        icon: 'none'
                    })
                    this.fastTap = true
                }
            }
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
                                title: this.language.proList.Tips[2],
                                icon: 'none'
                            })
        
                            this.$store.state.access_id = data.access_id
                            
                            this.haveSkuBean = ''
                            this.$refs.attrModal._mask_f()
                            this.fastTap = true
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
        shopping_j (id) {
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
                    
                    this.$refs.attrModal.imgurl = pro.img_arr[0]
                    this.$refs.attrModal.num = pro.num
                    this.$refs.attrModal.price = qj_price
                    this.$refs.attrModal.skuBeanList = attribute_list
                    this.$refs.attrModal.initData()
                    this.$refs.attrModal._mask_display()
                })
                .catch(error => {
                    this.fastTap = true
                })
        },
        toUrl(url){
            uni.navigateTo({
                url
            })
        },
        axios(){
            let data = {
                module:'app',
                action:'index',
                page:this.page, // 页面
            }
            
            if(this.pageType == 1){
                data.app = 'new_arrival'
            }else if(this.pageType == 2){
                data.app = 'recommend'
            }
            
            this.$req.post({data}).then(res=>{
                let { list, grade, isGrade } = res.data
                if(res.code == 200){
                    // this.is_grade = grade==0?false:true;
                    this.is_grade = isGrade
                    setTimeout(()=>{
                        this.load = false
                    },500)
                    
                    if(this.page == 1){
                        this.list = []
                    }
                    
                    if(list){
                        list.filter(item=>{
                            item.vip_yprice = Number(item.vip_yprice).toFixed(2)
                            item.vip_price = Number(item.vip_price).toFixed(2)
                        })
                    }
                    
                    this.list.push(...list)
                    
                    if(list.length>0){
                        this.loadingType = 0
                    }else{
                        this.loadingType = 2
                    }
                }else{
                    uni.showToast({
                        title: res.message,
                        icon: 'none'
                    })
                }
            })
        }
    },
};
</script>

<style lang="less">
@import url('../../static/css/home/proList.less');
</style>
