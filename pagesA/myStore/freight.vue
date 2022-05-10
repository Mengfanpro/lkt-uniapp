<template>
    <view class="container">
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <heads :title="language.freight.title"></heads>
        
        <toload v-if="!loadFlag"></toload>
        <view v-else class="content">
            
            <view class="list" v-for="item,index of list" :key="index">
                <view class="list_left">
                    <view>
                        <view class="icon" v-if="item.is_default == 1">{{language.freight.default1}}</view>
                        <view class="text">
                            {{item.name}}
                        </view>
                    </view>
                    
                    <text>{{item.is_use == 1?language.freight.beUsed:language.freight.unused}}</text>
                </view>
                
                <view class="list_right">
                    <view v-if="item.is_default != 1" @tap="setDefault(item.id)">{{language.freight_add.setDefault}}</view>
                    
                    <view v-if="item.is_use == 1" @tap="toUrl('/pagesA/myStore/freight_add?type=see&id='+item.id)">{{language.freight.see}}</view>
                    <view v-else @tap="toUrl('/pagesA/myStore/freight_add?type=edit&id='+item.id)">{{language.freight.edit}}</view>
                    
                </view>
                
            </view>
            
            <uni-load-more v-if='list.length>16' :loadingType="loadingType"></uni-load-more>
            
            <view class="noList" v-if='list.length == 0'>
                <image :src="noFreight"></image>
                <text>{{language.freight.noFreight}}</text>
                <view class="addfreight" @tap="toUrl('/pagesA/myStore/freight_add?type=add')">{{language.freight.add}}</view>
            </view>
        </view>
        
        <view v-if="list.length>0" class="container_bottomBtn" @tap="toUrl('/pagesA/myStore/freight_add?type=add')">{{language.freight.add}}</view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            loadFlag: false,
            title: '运费设置',
            shop_id: '',
            page: 1,
            list: [],
            loadingType: 0,
            noFreight: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/noFreight.png'
        };
    },
    onShow() {
        this.shop_id = uni.getStorageSync('shop_id') ? uni.getStorageSync('shop_id') : this.$store.state.shop_id;
        this.page = 1
        this.axios()
    },
    onReachBottom() {
        if(this.loadingType!=0){
            return
        }
        this.loadingType = 1
        this.page++
        this.axios()
    },
    methods: {
        setDefault(id){
            let data = {
                module: 'app',
                action: 'mch',
                m: 'set_default',
                shop_id: this.shop_id, // 店铺ID
                id: id // 运费id
            }
            
            this.$req.post({data}).then(res=>{
                uni.showToast({
                    title: res.message,
                    icon: 'none'
                })
                if(res.code == 200){
                    uni.pageScrollTo({
                        scrollTop: 0,
                        duration: 10
                    })
                    
                    this.page = 1
                    this.axios()
                }
            })
        },
        changeLoginStatus(){
			this.page = 1
			this.axios()
		},
        toUrl(url){
            uni.navigateTo({
                url
            })
        },
        axios(){
            let data = {
                module:'app',
                action:'mch',
                m:'freight_list',
                shop_id:this.shop_id, // 店铺ID
                page:this.page, // 加载次数
                pagesize: '20' // 每页显示多少条
            }
            
            this.$req.post({data}).then(res=>{
                let { code, message, data } = res
                if(code == 200){
                    if(this.page == 1){
                        this.list = []
                    }
                    this.list.push(...data.list)
                    
                    if(data.list.length>0){
                        this.loadingType = 0
                    }else{
                        this.loadingType = 2
                    }
                }else{
                    uni.showToast({
                        title: message,
                        icon: 'none'
                    })
                }
                
                this.loadFlag = true
            })
        }
    }
};
</script>

<style scoped lang="less">
@import url('../../static/css/myStore/freight.less');
</style>
