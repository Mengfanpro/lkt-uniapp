let toast;
import zh_EN from '@/common/zh_EN.js'
import zh_CN from '@/common/zh_CN.js'

//用户名验证
export function onblur(value, display) {
	if(uni.getStorageSync('language') == 'en'){
		toast = zh_EN.toasts.landing
	}else{
		toast = zh_CN.toasts.landing
	}
	
    var re = /^\w{6,20}$/g
    var rez = re.test(value)
    if (rez == true) {
        uni.showToast({
            title: toast[0],
            duration: 1000,
            icon: 'none'
        })
        return
    }
    if (value == '') {
        display.style.display = 'block'
        display.innerHTML = toast[1]
        uni.showToast({
            title: toast[1],
            duration: 1000,
            icon: 'none'
        })
    } else {
        display.style.display = 'block'
        value = ''
    }
}

//密码验证
export function pass(value, display, a) {
	if(uni.getStorageSync('language') == 'en'){
		toast = zh_EN.toasts.landing
	}else{
		toast = zh_CN.toasts.landing
	}
	
    var re = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
    var rez = re.test(value)
    if (rez == true) {
        return
    }
    if (value == '') {
        uni.showToast({
            title: toast[2],
            duration: 1000,
            icon: 'none'
        })
    } else {
        uni.showToast({
            title: toast[3],
            duration: 1000,
            icon: 'none'
        })
    }
}

//确认密码验证
export function confirmpass(value1, value2) {
	if(uni.getStorageSync('language') == 'en'){
		toast = zh_EN.toasts.landing
	}else{
		toast = zh_CN.toasts.landing
	}
	
    if (value1 == '') {
        uni.showToast({
            title: toast[4],
            duration: 1000,
            icon: 'none'
        })
        return false
    }

    if (value2 == '') {
        uni.showToast({
            title: toast[5],
            duration: 1000,
            icon: 'none'
        })
        return false
    }

    if (value1 != value2) {
        uni.showToast({
            title: toast[6],
            duration: 1000,
            icon: 'none'
        })
        return false
    }

    return 1
}

//验证手机号码
export function telephone(value) {
	if(uni.getStorageSync('language') == 'en'){
		toast = zh_EN.toasts.landing
	}else{
		toast = zh_CN.toasts.landing
	}
	
    var re = /^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/
    var wrResult = re.test(value)
    if (wrResult && value.length == 11) {
        return 1
    } else if (value == '') {
        return 2
    } else {
        uni.showToast({
            title: toast[7],
            duration: 1000,
            icon: 'none'
        })
        return 3
    }
}

//一分钟倒计时
export function time(timer, count) {
    const TIME_COUNT = 60
    if (!timer) {
        count = TIME_COUNT
        timer = setInterval(() => {
            if (count > 0 && count <= TIME_COUNT) {
                count--
            } else {
                clearInterval(timer)
                timer = null
            }
        }, 1000)
    }
}

//清空内容
export function empty(value) {
    value = ''
}
