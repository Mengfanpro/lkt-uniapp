<template>
    <div class="container">
        <lktauthorize ref="lktAuthorizeComp"></lktauthorize>
        <heads :title="language.expressageb.title"></heads>
        <div class="wl_content" v-for="(item, index) in list.list" :key="index" @tap="_goEx(index)">
            <div class="wx_title">
                <img class="wl_img" :src="wl_img" />
                {{item.shop_type == 1 ? language.expressageb.logistics:language.expressageb.logistics1}}：{{ item.courier_num }}
            </div>
            <scroll-view class="scroll_view" scroll-x>
                <div class="scroll_view_data">
                    <div v-for="(items, indx) in item.pro_list" :key="indx">
                        <span class="scroll_view_num" v-if="items.num > 1">{{ items.num }}</span>
                        <img class="img" :src="items.img" />
                    </div>
                </div>
            </scroll-view>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title: '查看物流',
            
            wl_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/wuliu2x.png',
            list: [],
            sNo: ''
        };
    },
    onLoad(option) {
        if (option.sNo) {
            this.sNo = option.sNo
            let sNo = option.sNo;
            let data = {
                module: 'app',
                action: 'order',
                app: 'logistics',
                id: sNo,
                o_source: option.o_source || 1,
                type: ''
            };

            if (this.source == 1) {
                data.type = 'pond';
            }

            this.$req
                .post({ data })
                .then(res => {
                    let { code, message, data } = res;
                    uni.hideLoading();
                    if (code == 200) {
                        this.list = data;
                    } else {
                        uni.showToast({
                            title: message,
                            duration: 1500,
                            icon: 'none'
                        });
                    }
                })
                .catch(error => {
                    uni.showToast({
                        title: this.language.expressageb.Loading,
                        duration: 2000,
                        icon: 'none'
                    });
                });
        }
    },
    methods: {
        _goEx(index) {
            let data = this.list.list[index];
            console.log(data)
            uni.navigateTo({
                url: '/pages/expressage/expressage?list=' + JSON.stringify(data) + '&sNo=' +  this.sNo
            });
        }
    }
};
</script>

<style scoped>
.container {
    min-height: 100vh;
    background: #f6f6f6;
}

.wl_content {
    display: flex;
    flex-direction: column;
    /* height: 90rpx; */
    padding: 30rpx;
    background: #ffffff;
    margin-bottom: 20rpx;
}

.wl_img {
    width: 31rpx;
    height: 31rpx;
    margin-right: 14rpx;
}

.wx_title {
    display: flex;
    align-items: center;
    font-size: 28rpx;
    line-height: 28rpx;
    color: #020202;
}

.scroll_view {
    flex: 1;
}

.scroll_view_data {
    display: flex;
    padding-top: 32rpx;
}

.scroll_view_data > div {
    position: relative;
    width: 120rpx;
    height: 120rpx;
    margin-right: 30rpx;
    border: 1px solid #e6e6e6;
}

.scroll_view_data .img {
    width: 100%;
    height: 100%;
}

.scroll_view_num {
    position: absolute;
    border-radius: 50%;
    border: 1px solid #ff3333;
    font-size: 22rpx;
    color: #ff3333;
    width: 30rpx;
    height: 30rpx;
    line-height: 30rpx;
    text-align: center;
    right: -13rpx;
    top: -13rpx;
    background: #ffffff;
}
</style>
