<template>
    <view class="container">
        <heads :title="language.mchList.title"></heads>
        
       <view class="content">
           <view class="list" v-for="item,index of list" :key="index">
               <view class="list_left">
                   <image :src="item.logo" mode=""></image>
                   <view v-if="item.is_open == 2">{{language.mchList.Closed}}</view>
               </view>
               <view class="list_right">
                   <view class="list_right_top">
                       <view class="list_right_top_title">{{item.name}}</view>
                       <view class="list_right_top_btn" @tap="toUrl('/pagesA/store/store?shop_id=' + item.shop_id)">{{language.mchList.store}}</view>
                   </view>
                   <view class="list_right_bottom">
                       <view>
                           <view>{{item.quantity_on_sale}}</view>
                           <text>{{language.mchList.sale}}</text>
                       </view>
                       <view>
                           <view>{{item.quantity_sold}}</view>
                           <text>{{language.mchList.Sold}}</text>
                       </view>
                       <view>
                           <view>{{item.collection_num}}</view>
                           <text>{{language.mchList.collectors}}</text>
                       </view>
                   </view>
               </view>
           </view>
          
       </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            title: '优选店铺',
            page: 1,
            loadingType: 0,
            list: [],
        };
    },
    onLoad(option) {
        this.page = 1
        this.axios()
    },
    onShow(){
        // this.page = 1
        // setTimeout(()=>{
        //     this.axios()
        // },1000)
    },
    methods: {
        toUrl(url){
            uni.navigateTo({
                url
            })
        },
        axios(){
            let data = {
                module:'app',
                action:'index',
                app:'recommend_stores',
                longitude: uni.getStorageSync('longitude'), // 经度
                latitude:uni.getStorageSync('latitude'), // 纬度
                page: this.page, // 页面
            }
            
            this.$req.post({data}).then(res=>{
                let {  data } = res
                if(res.code == 200){
                    if(this.page == 1){
                        this.list = []
                    }
                    console.log('====')
                    console.log(data)
                    this.list.push(...data.list)
                    
                    if(data.list.length>0){
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
@import url('../../static/css/home/mchList.less');
</style>
