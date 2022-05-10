<script>
import {mapMutations} from 'vuex';

export default {
    data() {
        return {
            access_id: false,
            getGrade: true,
            hasGrade: ''
        };
    },
    onLoad () {
        console.log('onLoad');
    },
    onLaunch: function(options) {

        uni.removeStorageSync('hasGrade')

        var me = this;

        uni.setStorageSync('url', me.LaiKeTuiCommon.LKT_API_URL)

        // 导航信息条高度
        uni.getSystemInfo({
            success: function(res) {
                var nate = res.statusBarHeight;
                uni.setStorageSync('data_height', nate);
                me.data_height(nate);

                if (!uni.getStorageSync('language')) {
                    if(res.language.includes('en')){
                        uni.setStorageSync('language', 'en')
                    }
                }


            }
        });

        let p = null;
        // #ifdef MP-WEIXIN
        p = me.gd();
        if (p) {
            p.then(function(request_url) {
                me.geturl(request_url);
            });
        }
        // #endif

        // #ifndef MP-WEIXIN
        var m_url = me.LaiKeTuiCommon.LKT_API_URL;
        me.geturl(m_url);
        // #endif

        // type: 1.文章海报 2.红包海报 3.商品海报 4.分销海报 5.邀请海报 6.竞拍海报
        // store_type=1小程序,=2app
        // store_id商城id
        //proType商品的类型：

        // #ifdef APP-PLUS
        var cid = me.LaiKeTuiCommon.getClientid();
        let timer = setInterval(() => {
            if (!cid || cid == null || cid == 'null') {
                cid = me.LaiKeTuiCommon.getClientid();
            } else {
                clearInterval(timer);
                timer = null;
                uni.setStorageSync('cid', cid);
            }
        }, 1000);

        const _handlePush = function(message) {
            uni.switchTab({
                url: 'pages/tabBar/my'
            });
        };
        plus.push.addEventListener(
            'click',
            function(message) {
                _handlePush();
            },
            false
        );
        plus.push.addEventListener(
            'receive',
            function(message) {
                logoutPushMsg(message);
            },
            false
        );

        //创建本地推送
        function createLocalPushMsg(content) {
            var options = { cover: false };
            plus.push.createMessage(content, 'LocalMSG', options);
        }

        //获取穿透参数
        function logoutPushMsg(msg) {
            if (msg.payload && msg.payload != 'LocalMSG') {
                if (typeof msg.payload == 'string') {
                    createLocalPushMsg(msg.content);
                } else {
                    var data = JSON.parse(msg.payload);
                    createLocalPushMsg(data.content);
                }
            }
        }

        // #endif

        let data = {
            module: 'app',
            action: 'index',
            app: 'get_membership_status'
        }
        this.$req.post({data}).then(res=>{
            this.getGrade = true
            if(res.code == 200){
                this.hasGrade = res.data.membership_status
                uni.setStorageSync('hasGrade', this.hasGrade)
            }
        })
    },
    methods: {
        //第三方授权，接口地址获取函数
        gd: function() {
            var me = this;
            let extConfig = uni.getExtConfigSync? uni.getExtConfigSync(): {}
            if (extConfig.url) {
                me.$store.state.url = extConfig.url;
            } else {
                me.$store.state.url = me.LaiKeTuiCommon.LKT_API_URL;
            }
            me.$store.state.url = me.$store.state.url + 'store_type=1';
            let request_url = me.$store.state.url;
            return Promise.resolve(request_url)
        },
        async geturl () {
            let me = this;
            let data = {
                module: 'app',
                action: 'url',
                app: 'geturl',
                get: 'mini_url,H5,endurl'
            };
            let res = await this.$req.post({data})
            let store_type;
            // #ifdef APP-PLUS
            store_type = 2
            // #endif
            // #ifdef MP-ALIPAY
            store_type = 3
            // #endif
            // #ifdef MP-BAIDU
            store_type = 5
            // #endif
            // #ifdef MP-TOUTIAO
            store_type = 4
            // #endif
            // #ifdef MP-WEIXIN
            store_type = 1
            // #endif
            // #ifdef H5
            store_type = 7
            // #endif

            // if (res.code == 200) {
            //     me.$store.state.url = res.data.mini_url;
            //     me.$store.state.h5_url = res.data.H5;
            //     me.$store.state.endurl = res.data.endurl;
            // } else {
                me.$store.state.url = me.LaiKeTuiCommon.LKT_API_URL;
                me.$store.state.h5_url = me.LaiKeTuiCommon.LKT_H5_DEFURL;
                me.$store.state.endurl = me.LaiKeTuiCommon.LKT_ENDURL;
            // }
            me.$store.state.url = me.$store.state.url + '&store_type='+store_type;
            uni.setStorageSync('url', me.$store.state.url);
            uni.setStorageSync('h5_url', me.$store.state.h5_url);
            uni.setStorageSync('endurl', me.$store.state.endurl);
        },
        ...mapMutations({
            data_height: 'SET_DATA_HEIGHT'
        })
    }
};
</script>
<style lang="less">
/*每个页面公共css */
@import './common/public.less';
@import 'static/iconfont/iconfont.css';
@import 'static/css/base.css';
/*@import 'static/css/style.scss';*/
/deep/.uni-modal {
    font-size: 15px !important;
    border-radius: 11px !important;
    .uni-modal__ft {
        .uni-modal__btn_default {
            font-size: 17px !important;
            color: #999999 !important;
        }
        .uni-modal__btn_primary {
            font-size: 17px !important;
            color: #020202 !important;
        }
    }
}
</style>
