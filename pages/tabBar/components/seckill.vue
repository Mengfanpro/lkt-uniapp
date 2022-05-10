<template>
    <div class="seckill-wrap" :style="{background: `linear-gradient(90deg,${bgColor[0].item} 0%,${bgColor[1].item} 100%)`, marginTop: mbConfig + 'rpx'}">
        <!-- 限时秒杀 -->
        <view class="seckill" v-if="spikeList.length > 0">
            <view class="seckill_top">
                <image class="seckill_top_title" lazy-load="true" :src="imgUrl" mode=""></image>

                <view class="seckill_top_time" :style="{color: countDownColor}">
                    <view :style="{background: countDownColor}">{{ time.hours || '00' }}</view>
                    :
                    <view :style="{background: countDownColor}">{{ time.minutes || '00' }}</view>
                    :
                    <view :style="{background: countDownColor}">{{ time.seconds || '00' }}</view>
                </view>

                <view class="more" @tap="toUrl('/pagesB/seckill/seckill')">
                    {{language.home.more}}
                    <image :src="jiantou" lazy-load="true"></image>
                </view>
            </view>

            <scroll-view scroll-x="true" class="seckill_content">

                
                <view class="seckill_content_view">
                    <view
                        class="seckill_content_item"
                        v-for="(item, index) of spikeList"
                        :key="index"
                        @tap="toUrl('/pagesB/seckill/seckill_detail?pro_id=' + item.pro_id + '&navType=' + item.type + '&id=' + item.id)"
                        :style="{marginRight: lrConfig+ 'rpx'}"
                    >
                        <image :src="item.imgurl || ''" lazy-load="true" mode=""></image>
                        <view class="seckill_content_item_p">{{ item.product_title || item.pro_id }}</view>
                        <view class="seckill_content_item_bottom">
                            <view class="seckill_price" :style="{color: themeColor}">
                                ￥{{ item.seconds_price || 0 }}
                                <text>￥{{ item.price || 0 }}</text>
                            </view>

                            <image class="seckill_btn" :src="seckill_btn"></image>
                        </view>
                    </view>
                </view>
            </scroll-view>
        </view>
        <!-- 限时秒杀结束 -->
    </div>
    
</template>

<script>
    import {getTimeDiff} from "@/common/util";
	export default {
		name: 'seckill',
		props: {
			dataConfig: {
				type: Object,
				default: () => {}
			}
		},
        watch: {
            dataConfig () {
                this.countDownColor =  this.dataConfig.countDownColor.color[0].item
                this.themeColor =  this.dataConfig.themeColor.color[0].item
                this.numberConfig =  this.dataConfig.numberConfig.val
                this.lrConfig = this.dataConfig.lrConfig.val
                this.mbConfig = this.dataConfig.mbConfig.val
                this.seckill_btn =  this.dataConfig.seckillBtnImgConfig.url
                this.imgUrl =  this.dataConfig.imgConfig.url
                this.spikeList = this.dataConfig.list.splice(0, this.numberConfig)
                this.bgColor = this.dataConfig.bgColor.color
                this.setCountDown(this.dataConfig.current_time);
            }  
        },
		data() {
			return {
				spikeList: this.dataConfig.list,
				countDownColor: this.dataConfig.countDownColor.color[0].item,
				themeColor: this.dataConfig.themeColor.color[0].item,
				numberConfig: this.dataConfig.numberConfig.val,
				lrConfig:this.dataConfig.lrConfig.val,
				mbConfig:this.dataConfig.mbConfig.val,
                time: {
                    hours: '00',
                    minutes: '00',
                    seconds: '00'
                },
                Intervalid: '',
                bgColor: [
                    {
                        item: '#cfe6e6'
                    },
                    {
                        item: '#cfe6e6'
                    }
                ],
                home_seckillTitle: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/home_seckillTitle.png',
                jiantou: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jiantou2x.png',
                seckill_btn: this.dataConfig.seckillBtnImgConfig.url,
                imgUrl: this.dataConfig.imgConfig.url
			};
		},
		created() {},
		mounted() {
            this.spikeList = this.dataConfig.list.splice(0, this.numberConfig)
            this.bgColor = this.dataConfig.bgColor.color
            this.setCountDown(this.dataConfig.current_time);
		},
		methods: {
            /**
             * 倒计时
             * */
            setCountDown(item) {
                clearInterval(this.Intervalid);

                let year = new Date().getFullYear();
                let month = new Date().getMonth() + 1;
                let dates = new Date().getDate();
                let endtime = '';

                if (item.type == 2) {
                    endtime = `${year}-${month}-${dates} ${item.starttime}`;
                } else {
                    endtime = `${year}-${month}-${dates} ${item.endtime}`;
                }

                this.timeFun(endtime, item);

                this.Intervalid = setInterval(() => {
                    this.timeFun(endtime, item);
                }, 1000);
            },
            timeFun(endtime, item) {
                let result = getTimeDiff(endtime);

                this.time.hours = result.hours;
                this.time.minutes = result.minutes;

                if (result.seconds<0 || result.hours<0 || result.minutes<0) {
                    this.$emit('refresh')
                    return;
                }
                this.time.seconds = result.seconds;
            },
            toUrl(url) {
                if (url.includes('tabBar')) {
                    uni.showTabBar({
                        url
                    });
                } else {
                    uni.navigateTo({
                        url
                    });
                }
            },
            
		}
	}
</script>

<style lang="less">
    .seckill-wrap {
        height: 464rpx;
        display: flex;
        align-items: center;
    }
    .seckill {
        width: 690rpx;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0rpx 2rpx 32rpx 0rpx rgba(0, 0, 0, 0.1);
        border-radius: 16rpx;
        margin: 0rpx auto;
        padding: 10rpx 24rpx;
        box-sizing: border-box;

        .seckill_top {
            display: flex;
            align-items: flex-end;
        }

        .seckill_top_title {
            width: 206rpx;
            height: 49rpx;
            margin-right: 12rpx;
        }

        .seckill_top_time {
            display: flex;
            align-items: center;
            font-size: 24rpx;
        }

        .seckill_top_time>view {
            width: 34rpx;
            height: 34rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #ffffff;
            border-radius: 4rpx;
            margin: 0 4rpx;
            
        }

        .more {
            display: flex;
            align-items: center;
            color: #999999;
            font-size: 26rpx;
            margin-left: auto;
            height: 36rpx;
        }

        .more image {
            width: 12rpx;
            height: 22rpx;
            margin-left: 12rpx;
        }

        .seckill_content {
            margin-top: 20rpx;
        }

        .seckill_content_view {
            display: flex;
        }

        .seckill_content_item {
            display: flex;
            flex-direction: column;
            width: 260rpx;
        }

        .seckill_content_item>image {
            width: 260rpx;
            height: 260rpx;
            background: rgba(247, 248, 249, 1);
            border-radius: 10rpx;
        }

        .seckill_content_item_p {
            font-size: 26rpx;
            line-height: 26rpx;
            color: #020202;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-top: 20rpx;
        }

        .seckill_content_item_bottom {
            display: flex;
            align-items: center;
            margin-top: 14rpx;
        }

        .seckill_price {
            font-size: 24rpx;
            font-weight: bold;
        }

        .seckill_price text {
            color: #999999;
            text-decoration: line-through;
            margin-left: 8rpx;
        }

        .seckill_btn {
            width: 50rpx;
            height: 38rpx;
            margin-left: auto;
        }
    }
</style>
