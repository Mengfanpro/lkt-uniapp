<template>
    <view>
        <heads title="授权用户手机号码" :returnFlag="true" :bgColor="bgColor" titleColor="#020202"></heads>
        <view class="auth">
            <image src="../../static/img/laike.png" mode=""></image>
            <view class="auth_qx">来客推申请获得以下权限：</view>
            <view class="auth_phone">获取您的手机号码</view>
            <button type="default" open-type="getPhoneNumber"  @getphonenumber="getPhoneNumber">微信手机号一键绑定</button>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                bgColor: [
                    {
                        item: '#ffffff'
                    },
                    {
                        item: '#ffffff'
                    }
                ],
            }
        },
        methods: {
            async getPhoneNumber(e) {
                if (!e.detail.encryptedData) {
                    return false;
                }
                
                let session_key = uni.getStorageSync('userinfo').session_key
                
                let {
                    data:mobile
                } = await this.$req.post({
                    data: {
                        session_key: session_key,
                        encryptedData: e.detail.encryptedData,
                        iv: e.detail.iv,
                        app: 'getWxInfo',
                        action: 'login',
                        module: 'app'
                    }
                });
                if(mobile.phoneNumber) {
                    uni.setStorage({
                        key: 'phoneNumbers',
                        data: mobile.phoneNumber
                    });
                    setTimeout(() => {
                        uni.switchTab({
                            url:'/pages/tabBar/my'
                        })
                    },1000)
                }
                console.log(e);
            }
        }
    }
</script>

<style lang="less" scoped>
    .auth {
        display: flex;
        align-items: center;
        flex-direction: column;
        image {
            margin: 230rpx auto 0;
            width: 120rpx;
            height: 120rpx;
            border-radius: 50%;
        }
        .auth_qx {
            padding-top: 76rpx;
            font-size: 32rpx;
            font-weight: 500;
            color: #171717;
        }
        .auth_phone {
            padding-top: 24rpx;
            font-size: 28rpx;
            font-weight: 500;
            color: #999999;
        }
        button {
            margin-top: 84rpx;
            width: 590rpx;
            height: 80rpx;
            background: #04C160;
            border-radius: 8rpx;
            font-size: 30rpx;
            font-weight: 500;
            color: #FFFFFF;
            line-height: 80rpx;
        }
        button::after {
            border: 0;
        }
    }
</style>
