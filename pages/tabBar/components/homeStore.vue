<template>
    <view class="mch" v-if="r_mch.length" :style="{background: `linear-gradient(90deg,${bgColor[0].item} 0%,${bgColor[1].item} 100%)`, marginTop: mbConfig + 'rpx',}">
        <view class="home_title">
            <view :style="{color: txtColor}">{{title}}</view>
            <image :src="titleBg"></image>
        </view>

        <scroll-view scroll-x="true" class="mch_content" v-if="!opensetting">
            <div style="display:flex;">
                <view class="mch_content_item" v-for="(item, index) of r_mch" :key="index" @tap="$emit('toUrl', '/pagesB/home/mchList')" :style="{marginRight: lrConfig + 'rpx'}">
                    <image :src="item.logo" lazy-load="true" mode=""></image>
                    <view>{{ item.name }}</view>
                    <text>{{item.distance}}km</text>
                </view>
            </div>
        </scroll-view>
        <view v-else>
            <!-- #ifdef MP -->
            <button class="openSetting" type="primary" open-type="openSetting" @tap="$emit('openSetting')">{{language.home.access_to_locate}}</button>
            <!-- #endif -->
            <!-- #ifndef MP -->
            <view class="locationDisc">{{language.home.please_open_locate}}</view>
            <!-- #endif -->
        </view>
    </view>
</template>

<script>
    export default {
        name: "homeStore",
        props: {
            dataConfig: {
                type: Object,
                default: () => {}
            },
            opensetting: {
                type: Boolean
            },
        },
        watch: {
            dataConfig () {
                this.r_mch = this.dataConfig.list.splice(0, this.numberConfig)
                this.bgColor = this.dataConfig.bgColor.color
                this.numberConfig = this.dataConfig.numberConfig.val
                this.title = this.dataConfig.titleConfig.value
                this.txtColor = this.dataConfig.titleTxtColor.color[0].item
                this.titleBg = this.dataConfig.imgConfig.url
                this.lrConfig =  this.dataConfig.lrConfig.val
                this.mbConfig = this.dataConfig.mbConfig.val
            }
        },
        data () {
            return {
                home_title_bg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/home_title_bg.png',
                r_mch: this.dataConfig.list,
                numberConfig:this.dataConfig.numberConfig.val,
                bgColor: [
                    {
                        item: '#FFFFFF'
                    },
                    {
                        item: '#FFFFFF'
                    }
                ],
                title:this.dataConfig.titleConfig.value,
                txtColor:this.dataConfig.titleTxtColor.color[0].item,
                titleBg:this.dataConfig.imgConfig.url,
                lrConfig: this.dataConfig.lrConfig.val,
                mbConfig:this.dataConfig.mbConfig.val,
            }
        },
        created() {
            this.setLang();
        },
        mounted() {
            this.r_mch = this.dataConfig.list.splice(0, this.numberConfig)
            this.bgColor = this.dataConfig.bgColor.color
        },
    }
</script>

<style scoped lang="less">
    .mch {
        padding-top: 10rpx;
        padding-bottom: 10rpx;
    }
    .home_title {
        position: relative;
        z-index: 10;
        margin: 0rpx 30rpx 0;
    }

    .home_title>view {
        font-size: 34rpx;
        line-height: 34rpx;
        color: #014343;
        font-weight: bold;
    }

    .home_title>image {
        position: absolute;
        width: 111rpx;
        height: 19rpx;
        top: 20rpx;
        left: 24rpx;
        z-index: -1;
    }
    
    .mch_content{
        /*display: flex;*/
        margin: 30rpx;
        width: 688rpx;
    }

    .mch_content_item{
        display: flex;
        flex-direction: column;
        width:216rpx;
        height:316rpx;
        background:rgba(255,255,255,1);
        border-radius:10rpx;
        margin-right: 20rpx;
    }

    .mch_content_item>image{
        width:216rpx;
        height:216rpx;
        border-radius:10rpx 10rpx 0rpx 0rpx;
    }

    .mch_content_item>view{
        font-size: 24rpx;
        line-height: 24rpx;
        color: #000000;
        margin: 20rpx 14rpx 18rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .mch_content_item>text{
        color: #999999;
        font-size: 24rpx;
        line-height: 20rpx;
        margin: 0 14rpx;
    }
</style>
