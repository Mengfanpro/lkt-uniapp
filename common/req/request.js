import Vue from 'vue'
import laiketuiCommon from "@/components/laiketuiCommon";
import zh_EN from '@/common/zh_EN.js'
import zh_CN from '@/common/zh_CN.js'

let toast;


function log(msg, data, type = 'log') {
	if(uni.getStorageSync('language') == 'en'){
		toast = zh_EN.toasts.request
	}else{
		toast = zh_CN.toasts.request
	}
	
    

    // #ifdef MP-WEIXIN
    console[type](msg, data)
    // #endif
    // #ifndef MP-WEIXIN
    if (!laiketuiCommon.IS_DEBUG) return false
    console[type](msg, data)
    // #endif
    
    // if (type === 'error') {
    //     uni.showToast({
    //         title: toast.error,
    //         icon: 'none'
    //     })
    // }
    
}

class Request {
    constructor() {
        this.URI = uni.getStorageSync('url') || ''
    }

    request(Parma) {
        log('当前请求参数', Parma)
        return new Promise((resolve, reject) => {
            // 请求拦截
            if (typeof this.request.use === 'function') {
                this.request.use(Parma)
            }

            uni.request({
                url: uni.getStorageSync('url') || Vue.prototype.LaiKeTuiCommon.LKT_API_URL,
                method: Parma.method || 'GET',
                data: {
                    access_id: Vue.prototype.$store.state.access_id || uni.getStorageSync('access_id') || uni.getStorageSync('laiketuiAccessId'),
                    language: uni.getStorageSync('language') || '',
                    ...Parma.data
                } || {},
                header: Parma.header || {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: (res) => {
                    if (this.response(res)) {
                        log('请求成功', res.data)
                        resolve(res.data)
                    } else {
                        log('接口报错', res.data, 'error')    
                    }
                },
                fail: (err) => {
                    // TODO:错误处理
                    log('接口报错', err, 'error')
                    reject(err)
                }
            })
        })
    }

    uploadimg(filePath, extData) {
        return new Promise((resolve, reject) => {
            let data = {
                module: 'app',
                action: 'mch',
                m: 'uploadImgs',
                shop_id: uni.getStorageSync('shop_id') || '',
            }

            data = {...data, ...extData }

            let access_id = Vue.prototype.$store.state.access_id || uni.getStorageSync('access_id')
            if (access_id) {
                data.access_id = access_id;
            }

            uni.uploadFile({
                url: uni.getStorageSync('url'),
                filePath: filePath,
                timeout: 100000,
                name: 'image',
                // #ifdef MP-ALIPAY
                fileType: 'image',
                // #endif
                formData: data,
                success: (res) => {
                    let Data = JSON.parse(res.data)
                    if (Data.code == 200) {
                        resolve(Data)
                    } else {
                        reject(Data)
                    }
                }
            })

        })
    }

    response(res) {
        return true;
        let {
            statusCode
        } = res

		// console.log(res.data)
        
        if (typeof res.data !== 'object') {
            
            console.log('如果不是支付接口，可能请求出错了')
            console.log(res)
            // return false
        }
        
        // 响应拦截
        if (typeof this.response.use === 'function') {
            this.response.use(res)
        }


        
        
        if (statusCode === 200) {
            return true
        }
        
        return false
    }

}

export default Request
