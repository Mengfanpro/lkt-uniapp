<template>
    <view class="bankCardDetail" :style="{backgroundColor: color}">
        <heads :bgColor="bgColor" :title="' '"></heads>
        <div class="container">
            <div class="bankInfo">
                <div class="bankName">
                    {{bankName}}
                </div>
                <div class="cardNum">
                    **** **** **** {{ cardNum }}
                </div>
            </div>

            <div class="btn edit" v-if="storeType === 'store'" @click="navTo('/pagesB/myWallet/bankCardAdd?type=store&is_edit=1&id='+ id)" :style="{color: color}">
                {{ language.bankCardDetail.bj }}
            </div>
            <div class="btn" @click="jiebang">
                {{ language.bankCardDetail.jcbd }}    
            </div>
            
            
        </div>
        <maskM :content="language.bankCardDetail.qrjb" :display="display" @mask_value="onHande"></maskM>

        
    </view>
</template>

<script>
import maskM from "@/components/maskM";

/**
 * 太忙了不做国际化了
 */
export default {
    name: "bankCardDetail",
    data() {
        return {
            bankName: '',
            cardNum: '',
            id: '',
            color: '',
            display: false,
            storeType: '',
            type: 1, // 1绿色，2红色
        }
    },
    components: {
        maskM
    },
    computed: {
        bgColor () {
            if (this.type === 1) {
                this.color = '#005F5F'
                return [
                    {
                        item: '#005F5F'
                    },
                    {
                        item: '#005F5F'
                    }
                ]
            }
            this.color = '#AD4E4C'
            return [
                {
                    item: '#AD4E4C'
                },
                {
                    item: '#AD4E4C'
                }
            ]
        }
    },
    onLoad(option) {
        this.bankName = option.bankName
        this.cardNum = option.cardNum
        this.id = option.id
        this.type = Number.parseInt(option.type) || 1
        this.storeType = option.storeType
    },
    methods: {
        jiebang () {
            this.display = true;  
        },
        onHande (value) {
            if (value === '取消') {
                this.display = false;
            } else {
                this.display = false;
                
                
                let data = {}
                if (this.storeType === 'store') {
                    data = {
                        module: 'app',
                        action: 'MchBank',
                        app: 'delBank',
                        id: this.id
                    }
                } else {
                    data = {
                        module: 'app',
                        action: 'user',
                        app: 'del_bank',
                        id: this.id
                    }
                }
                
                this.$req.post({data}).then( res => {
                    if (res.code == 200) {
                        uni.showToast({
                            title: res.message,
                            icon: 'none'
                        })
                        setTimeout(() => {
                            this.navBack()
                        }, 1500)
                    } else {
                        uni.showToast({
                            title: res.message,
                            icon: 'none'
                        })
                    }
                })
            }
        }
    }
}
</script>

<style lang="less" scoped>
.bankCardDetail {
    height: 100vh;
    .bankInfo {
        text-align: center;
        padding-top: 100rpx;
        position: relative;
        .bankName {
            font-size: 36rpx;
            font-family: PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
            height: 36rpx;
            display: flex;
            justify-content: center;
            margin-bottom: 29rpx;
        }
        .cardNum {

            font-size: 28rpx;
            font-family: PingFang SC;
            font-weight: 500;
            color: #A7A7A7;
        }
        
    }
    .btn {
        width: 690rpx;
        height: 90rpx;
        background: #FFFFFF;
        border-radius: 10rpx;
        position: absolute;
        bottom: 80rpx;
        left: calc((100vw - 690rpx) / 2);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #333;
        font-size: 30rpx;
        &.edit {
            bottom: 200rpx;
        }
        &:nth-child(3) {
            background: none;
            color: white;
            border: 2rpx solid #E3F1FF;
        }
    }
}
</style>
