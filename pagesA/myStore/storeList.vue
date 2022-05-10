<template>
    <div class="store-container" :style="shop_css">
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <heads :title="title"></heads>
        <toload :load="loadFlag">
            <div class="store-item" v-for="(item, index) in shop_list" :key="index" @tap="choseStore(item)">
                <div class="store-item-top">
                    <p>{{ item.name }}</p>
                    
                    <template v-if="!isStore">
                        <span v-if="user_status == 1 && item.is_default == 1">{{language.freight.default1}}</span>
                        
                        <div v-if="user_status == 1" @tap="edit(item.id)">
                            <img :src="storeEdit" alt="">
                            {{language.storeList.edit}}
                        </div>
                        <div v-else @tap="choose(item.id)">
                            <image :src="item.checked ? quan_hei : quan_hui" mode="" class="quanxuan-icon"></image>
                        </div>
                    </template>
                    
                </div>

                <p class="store-item-disc">{{language.storeList.address}}：{{ item.sheng }}{{ item.shi }}{{ item.xian }}{{ item.address }}</p>

                <div class="store-item-bottom">
                    <span>{{language.storeList.Business_Hours}} {{ item.business_hours }}</span>
                    <span>{{language.storeList.phone}} {{ item.mobile }}</span>
                </div>
            </div>

            <div v-if="user_status == 1 && shop_list.length == 0" class="add-store">
                <div @tap="_navigateTo('../myStore/addStore')">
                    <img :src="add_1img" />
                    <span>{{language.storeList.Add_stores}}</span>
                </div>
            </div>

            <!-- <div style="height: 120rpx;"></div> -->
            <div v-if="user_status == 1 && shop_list.length > 0" class="storeList-bottom">
                <button @tap="_navigateTo('../myStore/addStore')">{{language.storeList.Add_stores}}</button>
            </div>
        </toload>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                user_status: '', //用户等级，商户还是买家,1是卖家 否则是买家
                returnR: '',
                back: '',
                title: '门店管理',

                list: false,
                shop_id: '',
                selectorSrcIndex: 0, //选中的地址下标
                selectorSrcFlag: false, //点击编辑或删除进入多选
                shop_list: [],
                shop_css: '',
                add_1img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/add_1.png',
                storeEdit: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/storeEdit.png',
                quan_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/xuanzehui2x.png',
                quan_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/xuanzehei2x.png',
                shop_address_id: '',
                loadFlag: false,

                store_id: '',
                isStore: '', //是否是从店铺主页跳转
            };
        },
        onLoad(option) {
            if (option.shop_id) {
                this.shop_id = option.shop_id;
            } else {
                this.shop_id = this.$store.state.shop_id;
            }
            
            if (option.shop_address_id) {
                this.shop_address_id = option.shop_address_id;
            }

            this.user_status = option.status_class;

            if(option.isStore){
                this.isStore = option.isStore
            }
        },
        onShow() {
            if(this.isStore){
                this.title = this.language.storeList.title2
            }else{
                this.title = this.language.storeList.title
            }
            this.$nextTick(() => {

                if (!this.list) {
                    uni.showLoading({
                        title: this.language.storeList.Tips[0],
                        mask: true
                    });
                }
                this._axios();
            });
        },
        methods: {
            changeRadio(e){
                this.store_id = e.detail.value
            },
            changeLoginStatus() {
                this._axios();
            },
            _navigateTo(url) {
                uni.navigateTo({
                    url
                });
            },
            _axios() {
                if(this.user_status == '')
                {
                    var data = {
                        module: 'app',
                        action: 'mch',
                        m: 'my_store',
                        shop_id: this.shop_id
                    };
                }
                else
                {
                    var data = {
                        module: 'app',
                        action: 'mch',
                        m: 'see_my_store',
                        shop_id: this.shop_id
                    };
                }

                this.$req.post({ data }).then(res => {
                    uni.hideLoading();
                    if (res.code == 200) {
                        if (this.user_status != 1) {
                            res.data.list.map(item => {
                                item.checked = item.id == this.shop_address_id
                                return item;
                            })
                        }
                        this.shop_list = res.data.list;
                        if (this.shop_list) {
                            this.shop_css = 'min-height:100vh';
                        }
                    } else {
                        uni.showToast({
                            title: res.message,
                            duration: 1500,
                            icon: 'none'
                        });
                    }

                    this.loadFlag = true;
                });
            },
            choseStore(e) {
                if (this.user_status != 1) {
                    return false;
                }


                if(this.store_id == e.id){
                    this.store_id = ''
                }else{
                    this.store_id = e.id
                }
            },
            choose (id) {
                this.shop_address_id = id;
                uni.setStorageSync('shop_address_id', id)
                this.shop_list.map(item => {
                    item.checked = item.id == this.shop_address_id
                    return item;
                })
                
                uni.navigateBack({
                    delta: 1
                })
            },
            // 编辑
            edit(id) {
                this._navigateTo('../myStore/addStore?edit=true&id='+id);
            },
            // 删除
            del(e) {
                if(!this.store_id){
                    uni.showToast({
                        title: this.language.storeList.Tips[1],
                        icon: 'none'
                    })
                    return
                }

                uni.showLoading({
                    title: this.language.storeList.Tips[0],
                    mask: true
                });
                var data = {
                    module: 'app',
                    action: 'mch',
                    m: 'del_store',
                    id: this.store_id,
                    shop_id: this.shop_id
                };
                // 隐藏做门店编辑，做完解除
                this.$req.post({ data }).then(res => {
                    uni.hideLoading();
                    uni.showToast({
                        title: res.message,
                        duration: 1500,
                        icon: 'none'
                    });
                    this.store_id = ''
                    this._axios();
                });
            }
        }
    };
</script>

<style scoped lang="less">
    @import url('../../static/css/myStore/storeList.less');
</style>
