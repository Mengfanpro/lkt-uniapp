<template>
    <div class='box'>
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <!-- #ifndef MP -->
        <div style='height: 88rpx;'>
            <heads :title='language.detailed.title'></heads>
        </div>
        <!-- #endif -->
        <div style='position: relative;' :style="{top:halfWidth}" class='detailed-content' v-for="(item,index) in list"
             :key="index">
            <p class='title'>{{item.title}}</p>
            <p class='time'>{{item.time | dateFormat}}</p>
            <p class='border'></p>
            <text decode="true" class="text">{{item.content}}</text>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                title: '系统信息',
                
                list: '',
                id: '',
            }
        },
        onLoad (option) {
            var me = this
            this.id = option.id
        },
        onShow () {
            var me = this
            this.isLogin(()=>{
            	me.getDetailedMesageData()
            })
        },
        methods: {
            changeLoginStatus () {
                this.getDetailedMesageData()
            },
            /**
             * 获取消息详情
             * */
            getDetailedMesageData () {
                var me = this
                var data = {
                    id: this.id,
                    type: 2,
                    module: 'app',
                    action: 'message',
                    app: 'oneindex'
                }
                this.$req.post({data}).then(res => {
                    if (res.code == 200) {
                        me.list = res.data.message
                    } else {
                        uni.showToast({
                            title: res.data.message,
                            duration: 1500,
                            icon: 'none'
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped lang="less">
    @import url("../../static/css/message/detailedMesage.less");
</style>
