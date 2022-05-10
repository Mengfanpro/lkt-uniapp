export function LaiKeTui_axios(me) {
    let data = {
        module: 'app',
        action: 'mch',
        m: 'order_details',
        shop_id: me.shop_id,
        sNo: me.order_id,
    }
    me.$req.post({data}).then(res => {
        let { code, data, message } = res;
        me.load = false
        if (code == 200) {
            data.list.coupon_price = Number(data.list.coupon_price).toFixed(2)
            data.list.preferential_amount = Number(data.list.preferential_amount).toFixed(2)
            me.list = data.list
            me.city_all = data.list.sheng + '-' + data.list.shi + '-' + data.list.xian
        } else {
            uni.showToast({
                title: message,
                duration: 1500,
                icon: 'none'
            })
        }
    })
}

export function LaiKeTui_showFhDiv(me) {
    me.fhDiv = true
    let data = {
        shop_id: me.shop_id,
        module: 'app',
        action: 'mch',
        m: 'into_send',
    }
    me.$req.post({data}).then(res => {
        let { code, data, message } = res;
        if (code == 200) {
            var list = []
            me.kuaidiList = data.list
            for (var key in data.list) {
                list.push(data.list[key].kuaidi_name)
            }
            me.pickerValueArray = list
        } else {
            uni.showToast({
                title: message,
                duration: 1500,
                icon: 'none'
            })
        }
    })
}

export function LaiKeTui_ok(me) {
    setTimeout(function() {
            me.title = me.language.order.order.title
			
            me.diplay = true
            var orderDetail = {
                address: me.list.address,
                mobile: me.list.mobile,
                name: me.list.name,
                z_price: me.list.z_price,
                area: me.city_all,
                remarks: me.list.remarks
            }
            var data = {
                module: 'app',
                action: 'mch',
                m: 'up_order',
                sNo: me.order_id,
                shop_id: me.shop_id,
                
                orderDetail: JSON.stringify(orderDetail)
            }
            me.$req.post({data}).then(res => {
                let { code, data, message } = res;
                uni.showToast({
                    title: message,
                    duration: 1500,
                    icon: 'none'
                })
                
                if (code == 200) {
                    me._axios()
                }
            })
    }, 500)
}

export function LaiKeTui_send(me) {
    if (!me.fastTap) {
        return
    }
    me.fastTap = false
    
    let data = {
        shop_id: me.shop_id,
        module: 'app',
        action: 'mch',
        m: 'send',
        sNo: me.order_id,
        express_id: me.express_id,
        courier_num: me.courier_num,
        orderList_id: '',
    }
    me.$req.post({data}).then(res => {
        let { code, data, message } = res;
        if (code == 200) {
            uni.showToast({
                title: me.language.toasts.order.send,
                duration: 1500,
                icon: 'none'
            })
            setTimeout(function() {
                me._axios()
                me.fhDiv = false
                me.fhRadios = false
                me.fastTap = true
            }, 1500)
        } else {
            uni.showToast({
                title: message,
                duration: 1500,
                icon: 'none'
            })
            me.fastTap = true
        }
    })
}

export function QRs(me, rew) {
    var data = {
        module: 'app',
        action: 'mch',
        m: 'sweep_extraction_code',
        
        shop_id: me.shop_id,
        extraction_code: rew.result
    }
    me.$req.post({data}).then(res => {
        let { code, data, message } = res;
        uni.hideLoading()
        if (code == 200) {
            me.order_id = data.order_id
            me.p_price = data.p_price
            me.sNo = data.sNo
            uni.showToast({
                title: message,
                duration: 1500,
                icon: 'none'
            })
            // 成功后跳转 QRsuccess页面
            uni.redirectTo({
                url: 'QRsuccess?p_price=' + me.p_price + '&sNo=' + me.sNo + '&order_id=' + me.order_id
            })
        } else {
            uni.showToast({
                title: message,
                duration: 1500,
                icon: 'none'
            })
        }
    })
    me.$req.post({data}).then(res => {
        let { code, data, message } = res;
        uni.hideLoading()
        if (code == 200) {
            me.order_id = data.order_id
            me.p_price = data.p_price
            me.sNo = data.sNo
            uni.showToast({
                title: message,
                duration: 1500,
                icon: 'none'
            })
            // 成功后跳转 QRsuccess页面
            uni.redirectTo({
                url: 'QRsuccess?p_price=' + me.p_price + '&sNo=' + me.sNo + '&order_id=' + me.order_id
            })
        } else {
            uni.showToast({
                title: message,
                duration: 1500,
                icon: 'none'
            })
        }
    })
}
