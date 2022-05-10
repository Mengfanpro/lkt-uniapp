<template>
    <div>
        <lktauthorize ref="lktAuthorizeComp"></lktauthorize>
        <!-- #ifndef MP -->
        <heads :title="language.QRcode.title"></heads>
        <!-- #endif -->

        <!-- #ifdef MP-WEIXIN -->
        <camera class="camera" mode="scanCode" @scancode="QRcode"></camera>
        <cover-view class="QR-bottom" @tap="_navigateTo('../myStore/QRdraw')">
            <cover-image class="QR-img" :src="QR_img" alt=""></cover-image>
            <cover-view class="QR-view">{{language.QRcode.input[0]}}</cover-view>
        </cover-view>
        <!-- #endif -->
        <!-- #ifndef MP-WEIXIN -->
        <!-- #ifndef H5 -->
        <button class="QRcode-s" @tap="QRs">{{language.QRcode.input[1]}}</button>
        <!-- #endif -->
        <button class="QRcode-x" @tap="_navigateTo('../myStore/QRdraw')">{{language.QRcode.input[0]}}</button>
        <!-- #endif -->
    </div>
</template>

<script>
export default {
    data() {
        return {
            title: '扫一扫',
            shop_id: '',
            order_id: '',
            p_price: '',
            sNo: '',
            QR_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/store_input.png',
            QR_flag: true
        };
    },
    onLoad(option) {
        if (option.shop_id) {
            this.shop_id = option.shop_id;
        } else {
            this.shop_id = this.$store.state.shop_id;
        }
        
    },
    onShow() {},
    methods: {
        _navigateTo(url) {
            uni.navigateTo({
                url
            });
        },
        QRcode(res) {
            if (!this.QR_flag) {
                return;
            }
            this.QR_flag = false;
            const me = this;
            // 小程序扫码
            // 成功后跳转 QRsuccess页面
            uni.showLoading({
                title: this.language.QRcode.Tips[0]
            });
            var data = {
                module: 'app',
                action: 'mch',
                m: 'sweep_extraction_code',
                
                shop_id: me.shop_id,
                extraction_code: res.detail.result
            };
            this.$req.post({data}).then(res => {
                uni.hideLoading();
                if (res.code == 200) {
                    me.order_id = res.data.order_id;
                    me.p_price = res.data.p_price;
                    me.sNo = res.data.sNo;
                    setTimeout(() => {
                        uni.showToast({
                            title: res.message,
                            duration: 1500,
                            icon: 'none'
                        });
                    }, 100);
                    // 成功后跳转 QRsuccess页面
                    setTimeout(() => {
                        uni.redirectTo({
                            url: 'QRsuccess?p_price=' + me.p_price + '&sNo=' + me.sNo + '&order_id=' + me.order_id
                        });
                    }, 1000);
                } else {
                    this.QR_flag = true;
                    setTimeout(() => {
                        uni.showToast({
                            title: res.message,
                            duration: 1500,
                            icon: 'none'
                        });
                    }, 100);
                }  
            })
        },
        // 小程序以外扫码
        QRs() {
            var me = this;
            // #ifndef H5
            uni.scanCode({
                success: function(rew) {
                    uni.showLoading({
                        title: this.language.QRcode.Tips[0]
                    });
                    var data = {
                        module: 'app',
                        action: 'mch',
                        m: 'sweep_extraction_code',
                        
                        shop_id: me.shop_id,
                        extraction_code: rew.result
                    };
                    this.$req.post({data}).then(res => {
                        uni.hideLoading();
                        if (res.code == 200) {
                            me.order_id = res.data.order_id;
                            me.p_price = res.data.p_price;
                            me.sNo = res.data.sNo;
                            setTimeout(() => {
                                uni.showToast({
                                    title: res.message,
                                    duration: 1500,
                                    icon: 'none'
                                });
                            }, 100);
                            // 成功后跳转 QRsuccess页面
                            setTimeout(() => {
                                uni.redirectTo({
                                    url: 'QRsuccess?p_price=' + me.p_price + '&sNo=' + me.sNo + '&order_id=' + me.order_id
                                });
                            }, 1000);
                        } else {
                            setTimeout(() => {
                                uni.showToast({
                                    title: res.message,
                                    duration: 1500,
                                    icon: 'none'
                                });
                            }, 100);
                        }
                    })
                }
            });
            // #endif

            // #ifdef H5
            uni.showToast({
                icon: 'none',
                title: this.language.QRcode.Tips[1]
            });
            // #endif
        }
    }
};
</script>

<style scoped lang="less">
@import url('../../static/css/myStore/QRcode.less');
</style>
