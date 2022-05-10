<template>
    <div>
        <toload v-if="!guiderImg"></toload>
        <div v-else class="relative">
            <div class="guiderBtn" @tap="countDown(true)">
                <span class="time">{{ time }}</span>
                {{language.index.In}}
            </div>
            <swiper class="swiper" circular="false" :autoplay="autoplay" indicator-dots="true" interval="1000" @change="changeAutoplay">
                <swiper-item v-for="(item, index) in guiderImg" :key="index"><image class="image" :src="item.image"></image></swiper-item>
            </swiper>
        </div>
    </div>
</template>

<script>
import { getLaiketuiNoRegisterLoginInfo } from '../../common/laiketuiNoRegisterLogin.js';

export default {
    data() {
        return {
            title: 'Hello',
            guiderImg: [],
            time: 3,
            timer: '',
            timeStatu: false,
            autoplay: true,
            num: 1,
            clear: '',
            option: '',
            a_type:''
        };
    },
    onLoad(option,query) {
        // #ifdef MP-WEIXIN
        if(option.scene) {
            console.log(option.scene)
            let data = {
                m: 'getCodeParameter',
                action: 'getcode',
                module: 'app',
                key: option.scene
            };
            
            this.$req.post({ data }).then(res => {
                console.log(res)
                if(!res.data.parameter) {
                    uni.showToast({
                        title: '分享链接已失效',
                        icon: 'none'
                    });
                    uni.switchTab({
                        url: '/pages/tabBar/home'
                    });
                } else {
                    uni.redirectTo({
                        url: `/pages/index/share?${res.data.parameter}`
                    });
                }
            });
            return
        }
        // #endif
        this.option = option;
        if(option.a_type){
            this.a_type = option.a_type
        }
        this._geturl().then(() => {
            this.getImg();
            uni.getSystemInfo({
                success: (res) => {
                    this.$store.state.data_height = res.statusBarHeight;
                }
            });
        });
        this.clear = setInterval(this.countDown, 1000);
    },
    onShow() {
        this.timeStatu = false;
        this.autoplay = true;
        this.time = 3;
    },
    methods: {
        changeAutoplay(e) {
            if (e.detail.current <= this.num) {
                this.autoplay = false;
            } else {
                this.num = e.detail.current;
                this.autoplay = true;
            }
        },
        getImg: function() {
            let data = {
                app: 'guided_graph',
                action: 'index',
                module: 'app',
                // #ifdef MP-WEIXIN || MP-ALIPAY
                guideType: 1,
                // #endif
                // #ifndef MP-WEIXIN
                guideType: 2
                // #endif
            };
            
            
            this.$req.post({data}).then(res=>{
                 this.guiderImg = res.list;
            })
        },
        // 倒计时
        countDown() {
            if (this.time-- == 1) {
                let param = ''
                if(this.a_type == 1){
                    param = 'a_type=1'
                }else{
                    param = ''
                }
                
                this.timeStatu = true;
                clearInterval(this.clear);
                uni.setStorageSync('isfx', true);
                var isfx = uni.getStorageSync('isfx');
                
                if (this.option.pages == 'goodsDetailed') {
                    if (this.option.fatherId != '' || this.option.fatherId) {
                        // uni.setStorageSync('pages', 'goodsDetailed');
                        // uni.setStorageSync('productId', this.option.productId);
                        // uni.setStorageSync('fatherId', this.option.fatherId);
                        if (this.option.isDistribution) {
                            uni.redirectTo({
                                url: '/pages/goods/goodsDetailed?productId=' + this.option.productId + '&isDistribution=true&isfx=true&fatherId=' + this.option.fatherId + '&fx_id=' + this.option.fx_id
                            });
                        } else {
                            uni.redirectTo({
                                url: '/pages/goods/goodsDetailed?productId=' + this.option.productId + '&isfx=true&fatherId=' + this.option.fatherId
                            });    
                        }
                        
                        
                        
                        return false;
                    }
                    // uni.setStorageSync('pages', 'goodsDetailed');
                    // uni.setStorageSync('productId', this.option.productId);

                    uni.redirectTo({
                        url: '/pages/goods/goodsDetailed?productId=' + this.option.productId + '&isfx=true'
                    });
                    
                    return false;
                } else if (this.option.pages == 'groupDetailed') {
                    uni.setStorageSync('pages', 'groupDetailed');
                    uni.setStorageSync('activity_no', this.option.activity_no);
                    uni.setStorageSync('pro_id', this.option.pro_id);

                    uni.switchTab({
                        url: '/pages/tabBar/home?pages=groupDetailed&pro_id=' + this.option.pro_id + '&activity_no=' + this.option.activity_no + '&isfx=true&' + param
                    });
                    
                    return false;
                } else if (this.option.pages == 'group_end') {
                    uni.setStorageSync('pages', 'group_end');
                    uni.setStorageSync('sNo', this.option.sNo);
                    uni.setStorageSync('friend', true);

                    uni.switchTab({
                        url: '/pages/tabBar/home?pages=group_end&sNo=' + this.option.sNo + '&friend=true&isfx=true&' + param
                    });
                    
                    return false;
                }
                
            }
        },
        _geturl: function() {
            return new Promise((resolve, reject) => {
                var data = {
                    module: 'app',
                    action: 'url',
                    app: 'geturl',
                    get: 'mini_url,H5,endurl'
                };
                
                this.$req.post({data}).then(res=>{
					
					let store_type;
					// #ifdef APP-PLUS
					store_type = 2
					// #endif
					// #ifdef MP-ALIPAY
					store_type = 3
					// #endif
					// #ifdef MP-BAIDU
					store_type = 5
					// #endif
					// #ifdef MP-TOUTIAO
					store_type = 4
					// #endif
					// #ifdef MP-WEIXIN
					store_type = 1
					// #endif
					// #ifdef H5
					store_type = 7
					// #endif
					
                    // if (res.code == 200) {
                    //     this.$store.state.url = res.data.mini_url;
                    //     this.$store.state.h5_url = res.data.H5;
                    //     this.$store.state.endurl = res.data.endurl;
                    // } else {
                        this.$store.state.url = this.LaiKeTuiCommon.LKT_API_URL;
                        this.$store.state.h5_url = this.LaiKeTuiCommon.LKT_H5_DEFURL;
                        this.$store.state.endurl = this.LaiKeTuiCommon.LKT_ENDURL;
                    // }
                    
                    //#ifdef MP-WEIXIN
                    let extConfig = uni.getExtConfigSync? uni.getExtConfigSync(): {}
                    if (extConfig.url) {
                        this.$store.state.url = extConfig.url;
                    }
                    this.$store.state.url = this.$store.state.url + '&store_type='+store_type;
                    //获取是否免密码登录开关
                    if (!uni.getStorageSync('needRegister')) {
                        getLaiketuiNoRegisterLoginInfo(1);
                    }
                    //#endif
					
                    this.$store.state.url = this.$store.state.url + '&store_type='+store_type;
                    
                    uni.setStorageSync('url', this.$store.state.url);
                    uni.setStorageSync('h5_url', this.$store.state.h5_url);
                    uni.setStorageSync('endurl', this.$store.state.endurl);
                    resolve(this);
                })
            });
        }
    }
};
</script>

<style lang="less">
@import url('../../static/css/index/index.less');
</style>
