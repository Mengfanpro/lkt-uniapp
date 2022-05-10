<template>
    <div :style="'display:flex;padding-top:88rpx;height:'+BoxHeight">
        <!-- #ifndef MP-ALIPAY -->
        <div class='head' :class="{'head_w':ishead_w == '1', 'border':border == true}" :style="{background: `linear-gradient(90deg,${bgColor[0].item} 0%,${bgColor[1].item} 100%)`}">
            <div :class="{'white':!navWhite}" :style="{height: halfWidth, background: `linear-gradient(90deg,${bgColor[0].item} 0%,${bgColor[1].item} 100%)`}"></div>
            <div class='header'>
                
                <!-- <div class="header-left" @tap='_back1' v-if="titleColor">
                    
                    <img  :src="BackWhite">
                </div> -->
                <div class="header-left" @tap='_back1' v-if="flag&&(!returnFlag)">
                    <img v-if="ishead_w == '1'" :src="back1">
                    <img v-else :src="back">
                </div>
                <img :src="bback" @tap='_back1' v-if="(!flag) && (!returnFlag)" class="header_img">
                <p class="header-title" :style="{color:titleColor}" :class="{'title_w':ishead_w == '1'}">{{title}}</p>
                <div class="header-right" :class="{header_kj:is_kj}" :style="{'margin-top':headerRightMarginTop}" v-if="rightText" @click="$emit('right-click')">
                    <div class="content">
                        <img :src="rightIcon" v-if="rightIcon" alt="">
                        <p>{{rightText}}</p>    
                    </div>
                </div>
                
            </div>
        </div>
        <!-- #endif -->
    </div>
</template>

<script>

    export default {
        data () {
            return {
                flag: true,
                bback: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/bback.png',
                back: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/back2x_w.png',
                back1: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/back2x_w.png',
                BackWhite: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/BackWhite.png',
                
            }
        },
        computed: {
            BoxHeight () {
                var gru = uni.getStorageSync('data_height') ? uni.getStorageSync('data_height') : this.$store.state.data_height
                // #ifdef MP-TOUTIAO
                // const info = uni.getSystemInfoSync()
                // if(info.platform != 'ios'){
                // 	gru=0
                // }
                // #endif
                let height = 0
                // #ifndef MP-ALIPAY
                var heigh = parseInt(gru) + uni.upx2px(88)
                height = heigh && heigh > 0 ? heigh : uni.upx2px(88)
                // #endif

                // #ifdef MP
                heigh += 44
                // #endif
                
                // #ifdef APP-PLUS
                heigh += 44
                // #endif
                
                return height + 'px'
            },
            headerRightMarginTop () {
                // #ifdef MP
                return 0
                // #endif
                // #ifndef MP
                return this.halfWidth
                // #endif
            }
        },
        // props: [
        //     'title', 'returnR', 'navWhite', 'returnFlag', 'border', 'ishead_w', 'rightText', 'rightIcon','bgColor'
        // ],
        props: {
            title:{},
            returnR: {
                type: [String,Number],
                default: ''
            },
			isMs: {
				type: String,
				default: ''
			},
            types: {
                type: String,
                default: ''
            },
            navWhite: {},
            returnFlag: {
                type: Boolean,
                default: false
            },
            border:{},
            ishead_w: {
                type: [String,Number],
                default: ''
            },
            rightText: {
                type: String,
                default: ''
            },
            is_kj: {
                type: Boolean,
                default: false
            },
            rightIcon: {},
            bgColor: {
                type: [Array, Object],
                default: () => [
                    {
                        item: '#014343'
                    },
                    {
                        item: '#014343'
                    }
                ]
            },
            titleColor: {
                type: String,
                default: ''
            },
            
            order_type: {
                type: String,
                default: ''
            },
            order_id: {
                type: [String,Number],
                default: ''
            },
            
            shopping: {
                type: Boolean,
                default: false
            }
        },

        methods: {
            _back1 () {
                this.flag = false
                if(this.returnR == 'no'){
                    this.$emit('returnC')
                    this.flag = true
                    return
                }
                
                switch (Number.parseInt(this.returnR)) {
                    case 1:
                        // uni.navigateBack({
                        //     delta: 2
                        // })
                        setTimeout(() => {
                            uni.navigateBack({
                                delta: 1
                            })
                        },200)
                        break
                    case 2:
                        uni.switchTab({
                            url: '/pages/tabBar/shoppingCart'
                        })
                        break
                    case 3:
                        uni.redirectTo({
                            url: '/pages/login/login.vue'
                        })
                        break
                    case 4:
                        setTimeout(() => {
                            uni.navigateBack({
                                delta: 3
                            })
                        },200)
                        break
                    case 5:						
						switch (this.isMs) {
						    case 'IN':
						        uni.redirectTo({
						            url: '/pagesB/integral/exchange'
						        })
						        break
						    case 'MS':
						        uni.redirectTo({
						            url: '/pagesB/seckill/seckill_my'
						        })
						        break
                            case 'XQ':
                                uni.redirectTo({
                                    url: '/pages/order/myOrder'
                                })
                                break
							default: 
								uni.redirectTo({
								    url: '/pages/order/myOrder'
								})
						}
						break
                    case 6:
                        uni.switchTab({
                            url: '/pages/tabBar/home'
                        })
                        if(this.shopping) {
                            location.reload()
                        }
                        break
                    case 7:
                        uni.switchTab({
                            url: '/pages/tabBar/my'
                        })
                        break
                    case 8:
                        uni.switchTab({
                            url: '/pages/tabBar/my'
                        })
                        break
                    case 9:
                        uni.redirectTo({
                            url: '/pagesA/myStore/myStore'
                        })
                        break
                    case 10:
                        uni.redirectTo({
                            url: '/pagesA/distribution/distribution_center'
                        })
                        break
                    case 11:
                        switch (this.types) {
                            case 'IN':
                                uni.redirectTo({
                                    url: '/pagesB/integral/exchange?order_type=' + this.order_type
                                })
                                break
                            case 'MS':
                                uni.redirectTo({
                                    url: '/pagesB/seckill/seckill_my?order_type=' + this.order_type
                                })
                                break
                        }
                        break
                    case 12:
                        setTimeout(() => {
                            uni.navigateBack({
                                delta: 1,
                            })
                        },200)
                        break
                    case 13:
                        uni.redirectTo({
                            url: '/pages/order/order?order_id=' + this.order_id
                        })
                        break
                    default:
                        if (getCurrentPages().length > 1) {
                            console.log(getCurrentPages())
                            setTimeout(() => {
                                uni.navigateBack({
                                    delta: 1,
                                })
                            },200)
                        } else {
                            uni.switchTab({
                                url: '/pages/tabBar/home'
                            })
                        }
                }
                this.flag = true
            }
        }

    }
</script>

<style scoped lang="less">
    .border {
        border-bottom: none!important;
    }

    .head {
        position: fixed;
        left: 0;
        top: 0;
        background-color: @titleBackground;
        width: 100%;
        z-index: 998;
        
        // border-bottom: 1px solid #eee;

        &.head_w {
            background: transparent;
            border-bottom: 0;
        }

        
        .white {
            background: #FFFFFF;
        }

        .header {
            color: @titleColor;
            border: none;

            .header_img {
                top: 46rpx !important;
                left: 10rpx !important;
                width: 64rpx !important;
                height: 64rpx !important;
            }

            &-title {
                text-align: center;
                width: 100%;
                height: 100%;
                line-height: 88rpx;
                color: @titleColor;
                font-size: 36rpx;

                &.title_w {
                    color: #FFFFFF !important;
                }
            }

            &-left {
                height: 88rpx;
                width: 160rpx;
                position: absolute;
                z-index: 9999;

                img {
                    position: absolute;
                    top: 26rpx;
                    left: 20rpx;
                    width: 24rpx;
                    height: 36rpx;
                }
            }
            
            &-right {
               position: absolute;
               
               /*  #ifndef MP  */
               top: 0;
               /*  #endif  */
               
               /*  #ifdef MP  */
               background: #F6f6f6;
               /*  #endif  */
               
               line-height: 44px;
               color: #020202;
               font-size: 16px;
               display: flex;
               height: 88rpx;
               align-items: center;
               flex-direction: row-reverse;
               width: 100%;
               padding-right: 24rpx;
                img {
                    width: 30rpx;
                    height: 30rpx;
                    margin-right: 10rpx;
                }
                .content {
                    display: flex;
                    height: 100%;
                    align-items: center;
                    /*  #ifndef MP  */
                    color: @titleColor;
                    /*  #endif  */
                    /*  #ifdef MP  */
                    color: #020202;
                    /*  #endif  */
                    
                }
            }
            &_kj{
                /* #ifdef MP */
                background: rgba(0,0,0,.6);
                color: #FFFFFF;
                border-radius: 30rpx 0px 0px 30rpx;
                width: 148rpx;
                height: 60rpx;
                right: 0;
                margin-top: 30rpx!important;
                padding-right: 0;
                /* #endif */
               
                .content{
                    /* #ifdef MP */
                    color:#FFFFFF
                    /* #endif */
                }
            }
        }
    }
    
</style>
