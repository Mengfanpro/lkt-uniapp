<!-- 扫码分享 -->
<template>
    <div>

        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <!-- #ifndef H5 -->
        <heads :title="language.distribution_share.title" :right-text="language.distribution_share.save" @right-click="_saveImg"></heads>
        <!-- #endif -->

        <!-- #ifdef H5 -->
        <heads :title="language.distribution_share.title"></heads>
        <!-- #endif -->
        
        <div class="top-bg" >
            
        </div>

        <div class="yh-ewm" :style="{top: top}">
            <img v-if="ewmImg" class="yh-ewmImg" :src="ewmImg" @longpress='shibieImg()'>
        </div>

    </div>
</template>

<script>
    import {mapMutations} from 'vuex'

    import {lkt_getimg, lkt_saveimg} from '../../static/js/distribution/distribution_center.js'

    export default {
        data () {
            return {
                fastTap: true,
                loadImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/5-121204193R7.gif',
                emptyImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/empyimg92x.png',
                back1: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/back2x.png',
                head: true, 								// 头部切换
                
                order: '', 									// 订单数据 
                bindding_id: '', 						// 订单状态
                load: true,
                ewmImg: '',
                user_id: '',
                fatherId: ''
            }
        },
        computed: {
            top () {
                let height = 0;
                var gru = uni.getStorageSync('data_height') ? uni.getStorageSync('data_height') : this.$store.state.data_height
                height += gru
                height += uni.upx2px(88)
                // #ifdef MP
                height += uni.upx2px(88)
                
                // #endif


                return height + 'px'
            }  
        },
        onLoad (option) {
            if(option.fatherId) {
                this.fatherId = option.fatherId
            }
            let me = this
            this.isLogin(()=>{
				me.bindding_id = me.$store.state.bindding_num
				
				if (me.access_id) {
				    me._axios()
				}
			})

        },
        onShow () {
            this.bindding_id = this.$store.state.bindding_num
            
            // this._axios()
        },
        methods: {
            ...mapMutations({}),
            /**
             *
             * */
            changeLoginStatus () {
                this._axios()
            },
            /**
             *
             * */
            _saveImg () {
                lkt_saveimg(this)
            },
            /**
             *
             * */
            shibieImg () {

            },
            /**
             *
             * */
            _axios () {
                var me = this   
                uni.showLoading({
                    title: this.language.showLoading.waiting
                })
                me._shareImg()
            },
            /**
             *
             * */
            _shareImg () {
                lkt_getimg(this)
            },
        }
    }
</script>

<style scoped lang="less">
    @import url("../../static/css/distribution/distribution_share.less");
</style>
