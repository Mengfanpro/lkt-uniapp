<template>
    <div class='us-all'>

        <div class="yh-title">
            <heads :title='language.distribution_rule.title'></heads>
        </div>

        <div v-if='content' class="logo" :style="{top:halfWidth}">
            <rich-text class="richtext yh-richtext" :nodes="content"></rich-text>
        </div>

    </div>
</template>

<script>
    import htmlParser from '@/common/html-parser.js'

    export default {
        data () {
            return {
                title: '代理规则',
                log: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/15306155488.png',
                content: '',
                
            }
        },
        onLoad () {
            
            uni.showLoading({
                title: this.language.showLoading.loading
            })
            let data = {
                module: 'app',
                action: 'commcenter',
                app: 'index',

            }
            
            this.$req.post({data}).then(res => {
                uni.hideLoading()
                console.log('规则')
                console.log(res)
                console.log(res.data.content)
                if (res.code === '200') {
                    this.content = htmlParser(res.data.content)
                } else {
                    uni.showToast({
                        title: res.message,
                        duration: 1500,
                        icon: 'none'
                    })
                }
            })
            

        }
    }
</script>

<style scoped lang="less">
    @import url("../../static/css/distribution/distribution_rule.less");
</style>
