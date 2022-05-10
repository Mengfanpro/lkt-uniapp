<template>
    <view>
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <!-- #ifndef APP-PLUS -->
        <heads :title='language.service.title'></heads>
        <template v-if="kefu_url">
            <web-view :src="kefu_url" style="margin-top: 88rpx;"></web-view>
        </template>

        <!-- #endif -->

        <!-- #ifdef APP-PLUS -->
        <template v-if="kefu_url">
            <web-view :src="kefu_url"></web-view>
        </template>
        <!-- #endif -->

    </view>
</template>
<script>
    export default {
        data () {

            return {
                ttt: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/tttt.png',
                fff: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/ffff2x.png',
                hhh: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/hhhh2x.png',
                title: '在线客服',
                sendInfo: '',
                infos: '',
                pull: false,
                send_display: false,
                imgsrc: '', // 上传的·图片的地址
                show: false, // 图片放大预览
                src: '',
                kefu_url: '',
                mch_id: ''
            }
        },
        async onLoad (option) {
            if(option.mch_id) {
                this.mch_id = option.mch_id
            }
            this.setAppTitle()

            await this._geturl()
           

        },
        methods: {
            setAppTitle () {
                // #ifdef APP-PLUS
                var pageWeb = this.$mp.page.$getAppWebview()
                setTimeout(function () {
                    var web = pageWeb.children()[0]
                    web.onloaded = embedLoaded
                }, 400)

                function embedLoaded () {
                    setTimeout(() => {
                        uni.setNavigationBarTitle({
                            title: '在线客服'
                        })
                    }, 600)
                }

                // #endif
            },
            changeLoginStatus () {
                this._geturl()
            },
            async _geturl () {

                var me = this

                var data = {
                    module: 'app',
                    action: 'url',
                    app: 'geturl',
                    get: 'kefu_url'
                }
                if (this.mch_id) {
                    data.mch_id = this.mch_id
                }
                let res = await this.$req.post({
                    data
                })
                if (res.code == 200) {
                    
                    me.kefu_url = res.data.kefu_url
                } else {
                    uni.showToast({
                        title: res.data.message,
                        duration: 1500,
                        icon: 'none'
                    })
                }
            }
        },
        watch: {
            send_display () {
                this.$nextTick(() => {
                    var height = service.scrollHeight
                    service.scrollTop = height
                    console.log(height, service.scrollTop)
                })
            }
        }
    }
</script>
<style scoped lang="less">
    @import url("../../static/css/message/service.less");
</style>
