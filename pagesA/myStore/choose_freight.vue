<template>
    <view class="container">
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <heads :title="language.choose_freight.title"></heads>
        
        <view class="list">
            <view class="list_left">{{language.choose_freight.freight}}</view>
            <view class="list_right">
                <picker mode="selector" :range="freightArr" @change="changeF">
                    <view v-if="freightIndex < 0">{{language.choose_freight.freightPH}}</view>
                    <view v-else>{{freightArr[freightIndex]}}</view>
                </picker>
                <image :src="jiantou" mode=""></image>
            </view>
        </view>
        
        <view class="bottom" @tap="add">
            {{language.delModel.confirm}}
        </view>
    </view>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
    data() {
        return {
            shop_id: '',
            pro_id: '',
            urlString: '',
            freight_list: [],
            freightArr: [],
            freightIndex: -1,
            jiantou: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jiantou2x.png'
        };
    },
    onLoad(option) {
        this.shop_id = option.shop_id;
        this.pro_id = option.pro_id;
        this.urlString = '?up1=' + option.up1 + '&up2=' + option.up2;
    },
    onShow() {
        this.isLogin(()=>{})
        this.axios();
    },
    methods: {
        ...mapMutations({ setchooseProFlag: 'setchooseProFlag' }),
        changeF(e){
            this.freightIndex = e.detail.value;
        },
        changeLoginStatus(){
            this.axios();
        },
        axios(){
            let data = {
                action: 'mch',
                module: 'app',
                m: 'upload_merchandise_page',
                shop_id: this.shop_id
            }
            this.$req.post({data}).then(res=>{
                let { code, data, message } = res;
                if(code == 200){
                    this.freightArr = [];
                    data.freight_list.filter(item=>{
                        this.freightArr.push(item.name)
                    })
                    this.freight_list = data.freight_list;
                    
                }else{
                    uni.showToast({
                        title: message,
                        icon: 'none'
                    })
                }
            })
        },
        add() {
            if(this.freightIndex < 0){
                uni.showToast({
                    title: this.language.choose_freight.freightPH,
                    icon: 'none'
                })
                return
            }
            var data = {
                module: 'app',
                action: 'mch',
                m: 'add_goods',
                shop_id: this.shop_id,
                pro_id: this.pro_id,
                freight_id: this.freight_list[this.freightIndex].id
            };
            
            this.$req.post({data}).then(res=>{
                if (res.code == 200) {
                    uni.showToast({
                        title: this.language.choose_shopping.addSuc,
                        duration: 1500,
                        icon: 'none'
                    });
                    setTimeout(() => {
                        this.setchooseProFlag(true)
                        uni.redirectTo({
                            url: '/pagesA/myStore/myPro' + this.urlString
                        });
                    }, 1500);
                } else {
                    uni.showToast({
                        title: res.message,
                        duration: 1500,
                        icon: 'none'
                    });
                    return;
                }
            })
        }
    },
};
</script>

<style scoped lang="less">
    .container{
        min-height: 100vh;
        background-color: #F6F6F6;
        
        .list{
            display: flex;
            align-items: center;
            height: 90rpx;
            background: #FFFFFF;
            margin-top: 20rpx;
            padding: 0 30rpx;
            
            &_left{
                width: 170rpx;
                font-size: 28rpx;
                color: #020202;
                line-height: 28rpx;

            }
            
            &_right{
                flex: 1;
                overflow: hidden;
                display: flex;
                align-items: center;
                
                picker{
                    flex: 1;
                }
                
                view{
                    font-size: 28rpx;
                    color: #666666;
                    line-height: 28rpx;
                }
                
                image{
                    width: 15rpx;
                    height: 27rpx;
                    margin-left: auto;
                }
                
            }
            
        }
        
        .bottom{
            position: fixed;
            left: 0;
            bottom: 0;
            right: 0;
            height: 98rpx;
            background: #014343;
            .center();
            font-size: 30rpx;
            color: #FFFEFE;
        }
        
    }
</style>
