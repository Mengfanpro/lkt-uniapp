<template>
    <div class="order_ii">
        <heads :title="language.allGoods.title" :returnFlag="true"></heads>
        <div class="order_container skeleton">
            <div class="allgoods_b">
                <!-- 左边的列表 -->
                <ul class="allgoods_left" ref="allgoods_left" v-if="load">
                    <li v-for="(item, index) in centre_title" :class="{ color: title_index == index }" :key="index" class="allgoods_l" @tap="_title(index)">
                        <div>{{ item.cate_name }}</div>
                        <div :class="{ isborder: title_index == index }"></div>
                    </li>
                </ul>
                <ul class="allgoods_left" ref="allgoods_left" v-else>
                    <li  class="allgoods_l" v-for="(item, index) of 5" :key="index">
                        <div class="skeleton-rect" style="width: 100%;height: 26px">{{item}}</div>
                    </li>
                    
                </ul>
                <!-- 右边的详细分类 -->
                <div class="allgoods_right" v-if="load">
                    <div style="background-color: #FFFFFF;height: 100%;overflow-y: auto;border-radius: 8rpx;">
                        <ul class="allgoods_u" v-if="centre_list.length > 0">
                            <li @tap="_goods(items.child_id, items.name)" v-for="(items, index) in centre_list" :key="index">
                                <image style="width: 120rpx;height: 120rpx;" lazy-load="true" :src="items.picture" />
                                <p>{{ items.name }}</p>
                            </li>
                        </ul>
                        <div v-else>
                            <div><img class="noFindImg" style="margin-top: 100px;" :src="noOrder" /></div>
                            <span class="noFindText" style="font-size: 26rpx;">{{language.allGoods.no_goods}}</span>
                        </div>
                    </div>
                </div>
                <div class="allgoods_right" v-else>
                    <ul class="allgoods_u">
                        <li style="display:flex;flex-direction: column;justify-content:center;align-items:center;" v-for="(item, index) of 6" :key="index">
                            <div style="width: 60px;height: 60px;" class="skeleton-circle"></div>
                            
                            <p class="skeleton-rect" style="width: 50px;margin-top: 20px;">{{item}}</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    
        <skeleton :loading="!load" :animation="true" bgColor="#FFF"></skeleton>
    </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
    data() {
        return {
            loadGif: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/loading.gif',
            noOrder: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/fenlei.png',
            title_index: 0, //商品导航切换
            centre_title: '', //左侧分类标题
            centre_list: '', //右侧详细分类
            cid: '', //分类id
            load: false,
            cc: 0, //导航下标
            skeleton_left: [
                
            ],
            Width:false
        };
    },
    computed: {
        h5Height: function() {
            var height = 100;
            // #ifndef H5
            height = 0;
            // #endif
            return uni.upx2px(height) + 'px';
        },
        ...mapState({
            _cart_num: 'cart_num'
        })
    },
    onPullDownRefresh(){
        this.LaiKeTuiCommon.getUrlFirst(this._axios);
        this.storag = uni.getStorageSync('history');
    },
    onLoad() {
        this.LaiKeTuiCommon.getUrlFirst(this._axios);
       
    },
    onShow() {
        this.getCart();
        
        this.cc = this.$store.state.cindex;
        this.storag = uni.getStorageSync('history');
    },
    methods: {
        getCart(){
            var data = {
                module: 'app',
                action: 'cart',
                app: 'index',
                cart_id: '',
                page: 1
            }
            
            this.$req.post({ data }).then(res => {
                let { code, 
                data: {
                    data, list, mch_list, login_status, grade
                }
                , message } = res
                
                if (code == 200) {
                    if(data){
                        if (data && data.length) {
                            var allnum = 0
                            for (var i = 0; i < data.length; i++) {
                                allnum += Number(data[i].num)
                            }
                            this.cart_num(allnum)
                        } else if (data.length == 0) {
                            this.cart_num(0)
                        }
                    }
                    
            		//添加，移除tabbar购物车小点提醒
            		if (this._cart_num) {
            		    var cart_num_str = String(this._cart_num)
            		
            		    // #ifdef MP-WEIXIN
            		    uni.setTabBarBadge({
            		        index: 2,
            		        text: cart_num_str
            		    })
            		    // #endif
            		
            		    // #ifndef MP-WEIXIN
            		    uni.setTabBarBadge({
            		        index: 2,
            		        text: cart_num_str
            		    })
            		    // #endif
            		
            		} else {
            		    // #ifdef MP-WEIXIN
            		    uni.removeTabBarBadge({
            		        index: 2
            		    })
            		    // #endif
            		
            		    // #ifndef MP-WEIXIN
            		    uni.removeTabBarBadge({
            		        index: 2
            		    })
            		    // #endif
            		}
                } else {
                    // #ifdef MP-WEIXIN
                    uni.removeTabBarBadge({
                        index: 2
                    })
                    // #endif
                                		
                    // #ifndef MP-WEIXIN
                    uni.removeTabBarBadge({
                        index: 2
                    })
                    // #endif
                }
            })
        },
        _axios() {
            var data = {
                module: 'app',
                action: 'search',
                app: 'index'
            };
            
            this.$req.post({data}).then(res=>{
                let {
                    data
                } = res;
                this.centre_title = data;
                this.centre_list = data[0];
                this.cc = this.$store.state.cindex;
                this._title(this.cc);
                this.load = true;
                
                uni.stopPullDownRefresh()
            })
            
        },
        /*   商品导航切换    */
        _title(index) {
            this.title_index = index;
            this.centre_list = this.centre_title[index].children;
            this.cindex(index);
        },
        /*   跳转商品展示页面    */
        _goods(id, name) {
            uni.navigateTo({
                url: '/pages/goods/goods?cid=' + id + '&name=' + name
            });
        },
        ...mapMutations({
            cindex: 'SET_CINDEX',
            cart_num: 'SET_CART_NUM'
        })
    }
};
</script>

<style scoped lang="less">
@import url('../../static/css/tabBar/allGoods.less');
</style>
