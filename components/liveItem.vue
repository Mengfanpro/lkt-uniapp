<template>
    <view class="liveItem">
        <view class="box" v-for="item in liveList" :key="item.roomid">
            <view class="imgBox" @tap="toRoom(item)">
                <img :src="item.cover_img" alt="" />
                <view class="tips">
                    <view v-if="item.live_status == 101" class="red">
                        <image :src="live" />
                        <text>{{language.liveItem.live}}</text>
                    </view>
                    <view v-else-if="item.live_status == 102" class="black"><text>{{language.liveItem.notBegun}}</text></view>
                    <view v-else-if="item.live_status == 103" class="blue">
                        <image :src="replay" />
                        <text>{{language.liveItem.playback}}</text>
                    </view>
                </view>
                <view class="imgfooter">
                    <view class="left">
                        <text>{{ item.anchor_name }}</text>
                    </view>
                </view>
            </view>
            <view class="under">
                <view>{{ item.name }}</view>
            </view>
        </view>
    </view>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
    data() {
        return {
            live: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/live.png',
            replay: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/replay.png'
        };
    },
    props: ['liveList', 'temp'],
    created() {
        this.setLang();
    },
    methods: {
        toRoom(item) {
            if (item.live_status == 102) {
                uni.showToast({
                    title: this.language.liveItem.liveNotStarted,
                    icon: 'none'
                });
                return;
            }
            uni.navigateTo({
                url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${item.roomid}`
            });
        },
        ...mapMutations({ replayGoods: 'SET_REPLAY_GOODS' })
    }
};
</script>

<style lang="less" scoped>
.liveItem {
    width: 95%;
    margin: 10rpx auto;
    display: grid;
    grid-column-gap: 20rpx;
    grid-template-columns: 1fr 1fr;
    font-size: 24rpx;
}

.box {
    border-radius: 20rpx 20rpx 0 0;
    box-shadow: 0px 0px 15px 2px #eee;
    margin-bottom: 20rpx;

    .imgBox {
        img {
            width: 340rpx;
            height: 440rpx;
            border-radius: 20rpx 20rpx 0 0;
        }

        position: relative;

        .tips {
            position: absolute;
            top: 16rpx;
            left: 10rpx;
            font-size: 24rpx;
            color: #fff;

            view {
                padding: 8rpx 10rpx;
                border-radius: 20rpx;

                image {
                    width: 32rpx;
                    height: 32rpx;
                    margin-right: 5rpx;
                    vertical-align: middle;
                }
            }
        }

        .imgfooter {
            width: 94%;
            position: absolute;
            bottom: 0;
            font-size: 24rpx;
            padding: 10rpx;
            color: #fff;
            background-image: linear-gradient(to top, #333, transparent);
        }
    }

    .under {
        margin: 10rpx;
        padding: 10rpx 0 0 0;
    }
}

.red {
    background-image: linear-gradient(to right, #ff7272, #ff4444);
}

.blue {
    background-image: linear-gradient(to right, #50b6f4, #4b9af3);
}

.black {
    background-image: linear-gradient(to right, #ffa03a, #ffbd42);
}
</style>
