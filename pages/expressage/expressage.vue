<template>
    <div>
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <heads :title='language.expressage.title' :returnR="returnR"></heads>

        <!-- 头 -->
        <div class='expressage_name'>
            <div>
                <p>{{language.expressage.logistics_company}}：<span>{{name}}</span></p>
                <p>{{language.expressage.order}}：<span>{{courier_num}}</span>
                </p>
            </div>
            <div class='copy' type="button" @tap="onCopy()">{{language.expressage.copy}}</div>
        </div>
        <input id='courier_num' class="courier_num_opacity" type="text" v-model="courier_num">

        <!-- 线 -->
        <div class="lines"></div>
        <!-- 物流信息 -->
        <ul v-if='expressage.length>0'>
            <template v-if='expressage.length'>
                <li v-for="(item,index) in expressage" :key="index">
                    <div class='expressage_right'>
                        <p>{{item.context}}<span class="expressage_phone"></span></p>
                        <p class='expressage_time'>
                            <span>{{item.ftime}}</span>
                        </p>
                    </div>
                    <div class='expressage_left'>
                        <div class='expressage_yuan'></div>
                        <div class='expressage__xian' ref='expressage__xian'></div>
                    </div>
                </li>
            </template>
            <li v-if='!expressage.length'>
                <div class='expressage_right'>
                </div>
                <div class='expressage_left'>
                    <div class='expressage_yuan'></div>
                    <div class='expressage__xian' ref='expressage__xian'></div>
                </div>
            </li>
        </ul>
        <div class='zwwl' v-if="!expressage.length">
            <img :src="zwwl" style='width: 200rpx;height: 227rpx;margin-bottom: 20rpx;'>
            {{language.expressage.logistics_tips}}~
        </div>
    </div>
</template>

<script>

    import { copyText } from '@/common/util.js'

    export default {
        data () {
            return {
                title: '物流信息',
                sNo: '',
                arr: new Array(5),
                
                courier_num: '', //快递单号
                name: '', //快递公司
                expressage: '', //物流信息
                source: '', //跳转来源
                msg: '', //提示文字
                zwwl: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/zwwl.png',
                
                returnR: 12
            }
        },
        onLoad (option) {
            this.sNo = option.sNo
            if (option.list) {
                let data = JSON.parse(option.list)
                this.courier_num = data.courier_num
                this.name = data.kuaidi_name
                this.expressage = data.list || []
                if (this.expressage.length == 0) {
                    this.msg = '暂无物流信息'
                }
            }
        },
        onShow () {
            this.isLogin(()=>{
            	this._axios()
            })
        },
        methods: {
            changeLoginStatus () {
                this._axios()
            },
            /**
             * 复制
             * @return { undefined }
             * */
            onCopy () {

                // #ifndef H5
                uni.setClipboardData({
                    data: this.courier_num,
                    success: function (res) {
                        uni.showToast({
                            title: this.language.expressage.copy_success,
                            icon: 'none',
                            duration: 1500
                        })
                    }
                })
                // #endif

                // #ifdef H5
                copyText('#courier_num input', this.courier_num)
                // #endif
            },
            onError (e) {
                uni.showToast({
                    title: this.language.expressage.no_copy,
                    duration: 1000,
                    icon: 'none'
                })
            },
            /**
             * 加载数据
             * @return { undefined }
             * */
            async _axios () {
                uni.showLoading({
                    title: this.language.showLoading.loading
                })

                let data = {
                    module: 'app',
                    action: 'order',
                    app: 'logistics',
                    id: this.sNo,
                    o_source: 1,
                    type: '',
                }

                if (this.source == 1) {
                    data.type = 'pond'
                }

                let res = await this.$req.post({data})
                try {
                    let { code, message } = res;
                    console.log(data)
                    uni.hideLoading()
                    if (code == 200) {
                        this.courier_num = res.data.list[0].courier_num
                        this.name = res.data.list[0].kuaidi_name
                        this.expressage = res.data.list[0].list || []
                        if (this.expressage.length == 0) {
                            this.msg = this.language.expressage.Not_yet
                        }
                    } else {
                        uni.showToast({
                            title: message,
                            duration: 1500,
                            icon: 'none'
                        })
                    }
                } catch (e) {
                    uni.showToast({
                        title: this.language.expressage.loading_fail,
                        duration: 2000,
                        icon: 'none'
                    })
                }
            }
        }
    }
</script>

<style scoped lang="less">
    @import url("../../static/css/expressage/expressage.less");
</style>
