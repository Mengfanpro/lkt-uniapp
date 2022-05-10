<template>
    <div>
        <div class='relative'>
            <heads :title='language.vip.title'></heads>
            <!-- #ifndef MP -->
            <div id='copyshare' @tap="saveImg" :style="'top: '+top+'px'">{{language.vip.preservation}}</div>
            <!-- #endif -->
        </div>
        <!-- #ifdef MP-WEIXIN -->
        <div id='copyshare1' @tap="saveImg">{{language.vip.preservation}}</div>
        <!-- #endif -->
        <div class="canvas">
            <img :src="canvas">
        </div>
    </div>
</template>

<script>
    import Heads from '../../components/header.vue'

    export default {
        data () {
            return {
                title: '会员分享', //页面标题
                canvas: '',
                top: '0',
                saveImgFlag: true
            }
        },
        components: {
            Heads
        },
        onLoad () {
            //微信小程序中自定义标题
            //#ifdef MP-WEIXIN
            uni.setNavigationBarTitle({
                title: this.language.vip.title
            })
            // #endif

            // #ifdef APP-PLUS
            var that = this
            uni.getSystemInfo({
                success (res) {
                    that.top = res.statusBarHeight
                }
            })
            // #endif
        },
        onShow () {
            // uni.setNavigationBarTitle({
            //     title: this.language.vip.title
            // })
            this._axios()
        },
        methods: {
            _axios () {
                var me = this
                var store_type
                // #ifdef APP-PLUS
                store_type = 2
                // #endif
                // #ifdef MP-WEIXIN
                store_type = 1
                // #endif
                var data = {
                    
                    module: 'app',
                    action: 'recharge',
                    app: 'share',
                    store_type: store_type
                }
                this.$req.post({data}).then(res => {
                    if (res.code == 200) {
                        me.canvas = res.data.imgUrl
                    }
                })
            },
            saveImg () {
                if (this.saveImgFlag) {
                    this.saveImgFlag = false
                    var me = this
                    uni.downloadFile({
                        url: me.canvas,
                        success(res) {
                            let filePath = res.tempFilePath;
                            uni.saveImageToPhotosAlbum({
                                filePath: filePath,
                                success () {
                                    uni.showToast({
                                        icon: 'none',
                                        title: me.language.vip.Saved_successfully
                                    })
                                },
                                complete: function () {
                                    me.saveImgFlag = true
                                }
                            });
                        }
                    });
                    
                }
            }
        }
    }
</script>

<style scoped lang="less">
    @import url("../../static/css/vip/vip_share.less");
</style>
