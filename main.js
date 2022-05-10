import Vue from 'vue'
import App from './App'
import store from './store'
import laiketuiComm from './components/laiketuiCommon.vue'
import laiketuiWeixinAuth from './components/laiketuiauth/mpweixin/mpweixin.vue'
import laiketuiAlipayAuth from './components/laiketuiauth/mpalipay/mpali.vue'
import laiketuiTTAuth from './components/laiketuiauth/mptt/mptt.vue'
import laiketuiBDAuth from './components/laiketuiauth/mpbaidu/mpbaidu.vue'

import lktauthorize from './components/lktauthorize.vue'
import laikepay from './components/laikepay.vue'
import load from './components/toload.vue'
import heads from './components/header.vue'
import uniLoadMore from './components/uni-load-more.vue'
import skeleton from '@/components/skeleton'

import req from './common/req/main.js'
import { navigator } from './common/navigate'
import {
    getStatusBarHeight,
    guid
} from './common/util'

// #ifdef H5
var jweixin = require('jweixin-module')
Vue.prototype.$jweixin = jweixin
import {
    jssdk_share
} from '@/common/util.js'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)
import vconsole from 'vconsole';
if (laiketuiComm.IS_DEBUG) {
    Vue.prototype.$vconsole = new vconsole() // 使用vconsole    
}


// #endif

Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$store = store
Vue.prototype.LaiKeTuiCommon = laiketuiComm
Vue.prototype.laikepay = laikepay
Vue.prototype.LaiketuiWeixinAuth = laiketuiWeixinAuth
Vue.component('lktauthorize', lktauthorize)
Vue.component('toload', load)
Vue.component('heads', heads)
Vue.component('uniLoadMore', uniLoadMore)
Vue.component('skeleton', skeleton)
Vue.prototype.LaiketuiAliAuth = laiketuiAlipayAuth
Vue.prototype.LaiketuiTTAuth = laiketuiTTAuth
Vue.prototype.LaiketuiBDAuth = laiketuiBDAuth
Vue.prototype.$req = req

let statusBarHeight = getStatusBarHeight()

import zh_CN from './common/zh_CN.js'
import zh_EN from './common/zh_EN.js'

Vue.filter('dateFormat',function  (val) {
  if (val === null || val === '') {
    return '暂无时间';
  }
  const d = new Date(val); // val 为表格内取到的后台时间
  const month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
  const day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
  const hours = d.getHours() < 10 ? `0${d.getHours()}` : d.getHours();
  const min = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();
  const sec = d.getSeconds() < 10 ? `0${d.getSeconds()}` : d.getSeconds();
  const times = `${d.getFullYear()}-${month}-${day} ${hours}:${min}:${sec}`;
  return times;
})

Vue.mixin({
    data(){
        return {
            access_id: Vue.prototype.$store.state.access_id || uni.getStorageSync('access_id'),
            language: zh_CN,
            languageType: "",
            hasGrade: ''
        }
    },
    created () {
        this.setLang();
        
        // #ifdef H5
        window.onbeforeunload = function () {
            window.scrollTo(0, 0);
        }
        // #endif
        
        this.hasGrade = uni.getStorageSync('hasGrade')
        
    },
    onLoad: function(option) {
        if (option.fatherId) {
            uni.setStorageSync('fatherId', option.fatherId);
            if (option.isfx) {
                laiketuiComm.bindPID(option.isfx, option.fatherId)    
            }
        }
        
        // #ifdef H5
        jssdk_share(this, option)
        // #endif
    },
    onShow() {
        this.setLang();
    },
    computed: {
        halfWidth () {
            return `${statusBarHeight}px`
        }
    },
    methods: {
        setLang(){
            if(uni.getStorageSync('language') == 'en'){
                this.language = zh_EN
            }else{
                this.language = zh_CN
            }
            this.languageType = uni.getStorageSync('language')
            
            let tabArr = this.language.tabBar
            for(let i in tabArr){
                uni.setTabBarItem({
                  index: Number(i),
                  text: tabArr[i],
                })
            }
        },
        // 检测登录
        isLogin(callback){
            this.$nextTick(() => {
                this.$refs.lktAuthorizeComp.handleAfterAuth(this, '/pages/login/login?landing_code=1', function() {
                    callback && callback()
                });
            })
        },
        guid () {
            return guid();
        },
        navTo (url, checkLogin = false, me = null) {
            return navigator.to(url, checkLogin, me)
        },
        navToHome () {
            return navigator.toHome()
        },
        navBack () {
            return navigator.back()
        },
        navSwitchTab (url) {
            return navigator.switchTab(url)
        }
    }
})

const app = new Vue({
    ...App,
    store
})
app.$mount()
