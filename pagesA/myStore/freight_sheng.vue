<template>
    <view class="container">
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <heads :title="language.freight_sheng.title"></heads>
        
        <view class="content">
            
            <view v-if="area_list.length>0" class="list" style="color: #666666;" @tap="clickAll">
                <span :class="checkAll?'active':''">{{language.freight_sheng.checkAll}}</span>
                <image v-if="checkAll" :src="chooseImg"></image>
            </view>
            
            <view class="list" v-for="item,index of area_list" :key="index" @tap="clickMe(item)">
                <span :class="item.status?'active':''">{{item.G_CName}}</span>
                <image v-if="item.status" :src="chooseImg"></image>
            </view>
            
        </view>
        
        <view v-if="area_list.length>0" class="container_bottomBtn" @tap="saveOk">{{language.freight_sheng.save}}</view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            title: '选择省份',
            chooseImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/chooseMe.png',
			area_list: [],
            
            shop_id: '',
            freight_id: '', //已选中的省份ID
            freight_data: {}, //已排除的省份对象{"0":{"one":"5","name":"山东省,河南省"}}
            sel_city: []
        };
    },
    computed: {
        checkAll(){
            let flag = this.area_list.some(item=>item.status==false)
            return !flag
        },
        checkObj(){
            let checkName = []
            let checkId = []
            this.area_list.filter(item=>{
                if(item.status){
                    checkName.push(item.G_CName)
                    checkId.push(item.GroupID)
                }
            })
            return {
                name: checkName.join(),
                id: checkId.join()
            }
        }
    },
    onLoad(option) {
        if(option.freight_id){
            this.freight_id = option.freight_id
        }
        
        if(uni.getStorageSync('freight_data')){
            let freights = uni.getStorageSync('freight_data')
            let freight_data = {}
            let sel_city = []
            freights.filter((item,index)=>{
                freight_data[index] = {
                    "one": item.freight,
                    "name": item.freight_sheng.name
                }
                const arr = item.freight_sheng.id.split(',').map(item => {
                    return parseInt(item)
                })
                sel_city.push.apply(sel_city,arr)
            })
            this.freight_data = freight_data
            this.sel_city = sel_city
            console.log(sel_city)
        }
    },
    onShow() {
        this.shop_id = uni.getStorageSync('shop_id') ? uni.getStorageSync('shop_id') : this.$store.state.shop_id;
        
        this.axios()
    },
    methods: {
        changeLoginStatus(){
			this.axios()
		},
        saveOk(){
            if(!this.checkObj.id){
                uni.showToast({
                    title: this.language.freight_sheng.chooseTips,
                    icon: 'none'
                })
                return
            }
            uni.setStorageSync('freight_sheng',this.checkObj)
            uni.navigateBack({
                delta: 1
            })
        },
        clickAll(){
            let checkAll = !this.checkAll
            this.area_list.filter(item=>{
                item.status = checkAll
            })
        },
        clickMe(item){
            item.status = !item.status
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
                m:'get_sheng',
                shop_id:this.shop_id, // 店铺ID
                data:JSON.stringify(this.freight_data),
                sel_city: JSON.stringify(this.sel_city)
            }
            
            this.$req.post({data}).then(res=>{
                let { code, data, message } = res
                if(code == 200){
                    if(data && data.length>0){
                        let freight_id = this.freight_id.split(',')
                        data.filter(item=>{
                            item.status = false
                            
                            freight_id.filter(items=>{
                                if(items == item.GroupID){
                                    item.status = true
                                }
                            })
                        })
                    }
                    this.area_list = data
                    
                    this.area_list = this.area_list.filter(item => {
                        if(!this.sel_city.includes(item.GroupID)) {
                            return item
                        }
                    })
                }else{
                    uni.showToast({
                        title: message,
                        icon: 'none'
                    })
                }
            })
        }
    }
};
</script>

<style scoped lang="less">
    .container{
        min-height: 100vh;
        
        .content{
            padding-left: 30rpx;
            padding-bottom: 100rpx;
            
            .list{
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 80rpx;
                border-bottom: 1px solid #EDEDED;
                padding-right: 30rpx;
                font-size: 28rpx;
                color: #666666;
                
                image{
                    width:29rpx;
                    height:20rpx;
                }
                
                .active{
                    color: #020202;
                }
            }
        }
        
        &_bottomBtn{
			.solidBtn();
            display: flex;
            align-items: center;
            justify-content: center;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height:98rpx;
            font-size: 30rpx;
        }
    }
</style>
