import htmlParser from '../../../common/html-parser.js'

export function LaiKeTui_axios(me) {
    var data = {
        module: 'app',
        action: 'product',
        app: 'index',
        pro_id: me.integral ? me.goodsId : me.pro_id,
    }
    if (me.bargain) {
        data.type = 'KJ'
        data.attr_id = me.attr_id
        data.bargain_id = me.bargain_id
    } else if (me.seckill) {
        if (me.b_type == '1') {
            data.type = 'PM'    
        } else {
            data.type = 'MS'
        }
        
        
        data.navType = me.navType
        data.id = me.id
    } else if (me.isDistribution) {
        data.id = me.fx_id
        data.type = 'FX'
    } else if(me.integral) {
        data.type = 'IN'
        data.id = me.pro_id
        data.integralNum = me.integral
    }
    
    
    me.$req.post({data}).then(res => {
        if(res.code != 200) {
            uni.showToast({
                title:res.message 
            })
            setTimeout(function() {
                uni.switchTab({
                    url: '/pages/tabBar/home'
                })
            },300)
            
        }
        console.log(res)
        // uni.hideLoading()
        if (res && res.data) {
            me.login_status = res.data.login_status
        }
        me.load = false
        if (res.code == 200) {
            let {
                data: {
                    collection_id,
                    pro,
                    access_id,
                    comments,
                    commentsTotal,
                    commodity_type,
                    attrList,
                    skuBeanList,
                    qj_price,
                    type,
                    logo,
                    active,
                    is_grade,
                    shop_list,
                    coupon_str,
                    attribute_list
                }
            } = res
		
            me.ys_price = qj_price
            if (me.bargain) {
                me.cs_price = res.data.cs_price
                me.cs_num = res.data.cs_num
                me.cs_yprice = res.data.cs_yprice
                
                let bargain_list = res.data.bargain_info[0]
                
                if(data.type!="KJ"){
                    me.leftTime = bargain_list.leftTime
                    me.isbegin = bargain_list.isbegin
                    me.hasorder = bargain_list.hasorder
                    let bstatus = 3
                    if (bargain_list.status == 0) {
                        bstatus = 4
                    } else if (bargain_list.status == 1) {
                        bstatus = 0
                    } else if (bargain_list.status == 2) {
                        bstatus = 1
                    } else if (bargain_list.status == 3) {
                        bstatus = 2
                    }
                    if (bargain_list.leftTime <= 0) {
                        bstatus = 3
                    }
                    me.brStatus = bstatus
                    me.sNo_id = bargain_list.sNo_id
                    console.log(bargain_list);
                    console.log('sss'+bstatus);
                }
                
                
                if (me.leftTime) {
                    me.SetTimeData();
                }
            }
            me.countdown = pro.remainingTime
            me.commentsTotal = commentsTotal;
            me.commodity_type = commodity_type;
            me.price = qj_price
            me.attrList = attrList
            me.collection = type
            me.coupon_str = coupon_str?"":coupon_str;
            if (data.type == 'MS' || data.type== 'PM') {
                me._remain_time(pro)
            } else {
                pro.vip_price = Number(pro.vip_price).toFixed(2)
                pro.vip_yprice = Number(pro.vip_yprice).toFixed(2)
                me.pro = pro
                pro.content = pro.content.replace(/src/g,
                    'style=\'width:100%!important;height: auto!important;\' src').replace(
                    /<table/g, `<table style="width:100%!important;"`)
                pro.content = htmlParser(pro.content)
            }
            
            me.is_grade = is_grade
            me.active = active
            me.$store.state.access_id = access_id
            uni.setStorageSync('access_id', access_id)
            
            me.status = pro.status
            me.collection_id = collection_id
            me.shop_list = shop_list
            if (comments) {
                me.comments = comments
            } else {
                me.comments = ''
            }
            var url = uni.getStorageSync('h5_url')
            me.shareHref = url + 'pages/index/share?pages=goodsDetailed&productId=' + me.pro_id + '&isfx=true' + '&fatherId=' + pro.user_id
            me.shareHref2 = '/pages/goods/goodsDetailed?productId=' + me.pro_id
            me.shareHref = url + 'pages/index/share?pages=goodsDetailed&productId=' + me.pro_id +
                '&isfx=true&fatherId=' + pro.user_id
            me.shareHref2 = '/pages/goods/goodsDetailed?productId=' + me.pro_id + '&isfx=true&fatherId=' + pro.user_id
			me.shareHref3 = url + 'pagesB/seckill/seckill_detail?is_share=true&pro_id=' + me.pro_id + '&navType=1&id=' + me.id
				
            me.sharehrefTitle = me.pro.name
            me.shareImg = me.imgurl
            
            if (me.is_goods) {
                
                if (me.isDistribution) {
                    me.share.isDistribution = true
                    me.share.shareHref = url + 'pages/index/share?pages=goodsDetailed&productId=' + me.pro_id + '&isfx=true&isDistribution=true&fatherId=' + me.pro.user_id + '&fx_id=' + me.fx_id;
                    me.share.shareHref2 = '/pages/goods/goodsDetailed?productId=' + me.pro_id + '&isDistribution=true&isfx=true&fatherId=' + me.pro.user_id + '&fx_id=' + me.fx_id;
                } else {
                    me.share.shareHref = url + 'pages/index/share?pages=goodsDetailed&productId=' + me.pro_id +
                        '&isfx=true&fatherId=' + pro.user_id
                    me.share.shareHref2 = '/pages/goods/goodsDetailed?productId=' + me.pro_id + '&isfx=true&fatherId=' + pro.user_id
                }
                me.share.sharehrefTitle = me.pro.name
                me.share.shareImg = me.imgurl
                me.share = Object.assign({}, me.share)
            }
            
            me.shareContent = me.pro.name
            me.coupon_status = res.data.coupon_status
            
            me.$refs.attrModal.imgurl = pro.img_arr[0]
            me.$refs.attrModal.num = pro.num
            me.$refs.attrModal.price = qj_price
            me.$refs.attrModal.skuBeanList = attribute_list
            me.$refs.attrModal.initData()
            
            me.$refs.attrModal.pro2 = pro

            me.loadFlag = true
        } else {
            uni.showToast({
                title: res.message,
                duration: 1500,
                icon: 'none'
            })
        }
    }).catch((err)=>{
        console.log(err)
        me.load = false
    })
}

// 分享
export function LaiKeTuiInvite(type, me) {
    if (!me.access_id) {
        uni.navigateTo({
            url: '../../login/login'
        })
        return
    } else {
        if (type == '二维码分享') {
            me.showSaveEWM('app')
            return
        }
        if (type == '朋友圈') {
            uni.share({
                provider: 'weixin',
                scene: 'WXSenceTimeline',
                type: 0,
                href: me.shareHref,
                title: me.sharehrefTitle,
                summary: me.shareContent,
                imageUrl: me.shareImg || me.pro.img_arr[0],
                success: function(res) {
                    me.fastTap = true
                    uni.showToast({
                        title: me.language.toasts.goodsDetailed.shareOk,
                        icon: 'none'
                    })
                },
                fail: function(err) {
                    me.fastTap = true
                    uni.showToast({
                        title: me.language.toasts.goodsDetailed.shareFail,
                        icon: 'none'
                    })
                }
            })
        } else if (type == '微信') {
            let shareContent =  me.shareContent
            if (me.is_shop) {
                shareContent = `我在${me.sharehrefTitle}发现了一件不错的商品，快来看看吧。`;
            }

            console.log(111);

            console.log(shareContent)
            
            uni.share({
                provider: 'weixin',
                scene: 'WXSceneSession',
                type: 0,
                href: me.shareHref,
                title: me.sharehrefTitle,
                summary: shareContent,
                imageUrl: me.shareImg || me.pro.img_arr[0],
                success: function(res) {
                    me.fastTap = true
                    uni.showToast({
                        title: me.language.toasts.goodsDetailed.shareOk,
                        icon: 'none'
                    })
                },
                fail: function(err) {
                    me.fastTap = true
                    uni.showToast({
                        title: me.language.toasts.goodsDetailed.shareFail,
                        icon: 'none'
                    })
                }
            })
        }
    }
}

// 
export function LaiKeTuiShowSaveEWM(string, me) {
    // #ifdef APP-PLUS
    string = 'app'
    // #endif
    // #ifdef MP-ALIPAY
    string = 'ali'
    // #endif
    // #ifdef MP-WEIXIN
    string = 'wx'
    // #endif
    // #ifdef MP-TOUTIAO
    string = 'tt'
    // #endif
    var data = {
        module: 'app',
        action: 'getcode',
        m: 'share',
        proId: me.pro_id,
        href: me.shareHref,
    }
    if (me.is_jifen) {
        data.share_type = 2
    }
    me.$req.post({data}).then(res => {
        if (res.code == 200) {
            me.ewmImg = me.LaiKeTuiCommon.LKT_ROOT_URL + res.data.imgUrl
            // me.ewmImg = me.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + res.data.imgUrl
            console.dir(me.ewmImg)
            me.saveEWM = true
        } else if (res.code == 404) {
            me.$refs.lktAuthorizeComp.handleAfterAuth(me, '../login/login')
        } else {
            uni.showToast({
                title: res.message,
                duration: 1500,
                icon: 'none'
            })
        }
    })
}

//分享店铺二维码
export function LaiKeTuiShopEWM(string, me) {

    var data = {
        module: 'app',
        action: 'getcode',
        m: 'share_shop',
        shop_id: me.shop_id,
    }
    me.$req.post({data}).then(res => {
        if (res.code == 200) {
            me.ewmImg = me.LaiKeTuiCommon.LKT_ROOT_URL + res.data.imgUrl
            me.saveEWM = true
        } else if (res.code == 404) {
            me.$refs.lktAuthorizeComp.handleAfterAuth(me, '../login/login')
        } else {
            uni.showToast({
                title: res.message,
                duration: 1500,
                icon: 'none'
            })
        }
    })
}

// 收藏
export function LaiKeTui_collection(me) {
    if (!me.fastTap) {
        return
    }

    var data = {
        module: 'app',
        action: 'addFavorites',
    }

    if (me.is_jifen) {
        data.type = 2
    }

    me.fastTap = false
    setTimeout(function() {
        me.fastTap = true
    }, 1000)

    me.$refs.lktAuthorizeComp.handleAfterAuth(me, '../login/login', function() {
        if (me.collection) {
            data.app = 'removeFavorites'
            data.collection = []
            data.collection.push(me.collection_id)
            me.$req.post({data}).then(res => {
                me.fastTap = true
                if (res.code == 200) {
                    me.collection = false
                    uni.showToast({
                        title: res.message,
                        duration: 1000,
                        icon: 'none'
                    })
                } else {
                    uni.showToast({
                        title: res.message,
                        duration: 1000,
                        icon: 'none'
                    })
                }
            })
        } else {
            data.app = 'index'
            data.pro_id = me.pro_id
            me.$req.post({data}).then(res => {
                if (res.code == 200) {
                    me.collection = true
                    me.collection_id = res.data.collection_id
                    uni.showToast({
                        title: me.language.toasts.goodsDetailed.szOk,
                        duration: 1000,
                        icon: 'none'
                    })
                } else {
                    uni.showToast({
                        title: res.message,
                        duration: 1000,
                        icon: 'none'
                    })
                }
            })
        }
    })
}

// 加入购物车
export function LaiKeTui_shopping(me) {
    me.type = 2
    if (!me.fastTap) {
        return
    }
    me.fastTap = false
    if (me.haveSkuBean) {
        var data = {
            module: 'app',
            action: 'product',
            app: 'add_cart',
            pro_id: me.pro_id,
            attribute_id: me.haveSkuBean.cid,
            num: me.numb,
            type: 'addcart'
        }
        me.$req.post({data}).then(res => {
            me.fastTap = true
            let {
                code,
                data,
                message
            } = res
            if (code == 200) {
                uni.showToast({
                    title: me.language.toasts.goodsDetailed.addOk,
                    duration: 1000,
                    icon: 'none'
                })
                me.haveSkuBean = ''
                me.cart_num(me.numb + me._cart_num)
                me.allCartNum = me._cart_num
                me.$refs.attrModal._mask_false()
            } else {
                uni.showToast({
                    title: message,
                    duration: 1500,
                    icon: 'none'
                })
            }
            if (data.cart_id) {
                if (!in_array(data.cart_id, me.$store.state.nCart)) {
                    me.$store.state.nCart.push(data.cart_id)
                }
            }
        })
    } else {
        me.fastTap = true
        me._mask_display()
    }
}

// 获取优惠券
export function LaiKeTuiGetCoupon(me) {
    me.couponMask = true
    var data = {
        module: 'app',
        action: 'coupon',
        app: 'pro_coupon',
        pro_id: me.pro_id,
    }
    me.$req.post({data}).then(res => {
        if (res.code == 200) {
            res.data.list.filter(item=>{
                item.limit = item.limit.replace('满','满 ￥').replace('可用',' 可用')
                item.money = Number(item.money)
                item.discount = Number(item.discount)
            })
            
            me.coupon_list = res.data.list
        } else {
            uni.showToast({
                title: res.message,
                duration: 1500,
                icon: 'none'
            })
        }
        me.fastTap = true
    })
}

// 领取优惠券
export function LaiKeTui_receive(me, id) {
    if (!me.fastTap) {
        return
    }
    me.fastTap = false
    if (!me.access_id) {
        me.$refs.lktAuthorizeComp.handleAfterAuth(me, '../login/login?landing_code=coupon')
        return
    }
    var data = {
        module: 'app',
        action: 'coupon',
        app: 'receive',
        id: id
    }
    me.$req.post({data}).then(res => {
        let code = res.code
        if (code == 200) {
            uni.showToast({
                title: me.language.toasts.goodsDetailed.lqOk,
                duration: 1500,
                icon: 'none'
            })
            setTimeout(function() {
                me.getCoupon()
            }, 1500)
        } else {
            uni.showToast({
                title: res.message,
                duration: 1500,
                icon: 'none'
            })
            setTimeout(function() {
                me.getCoupon()
            }, 1500)
        }
    }).catch((err)=>{
        me.fastTap = true
    })
}

// 立即购买
export function LaiKeTui_buy_handle(me) {
    if (me.fastTap) {
        me.fastTap = false
        me.type = 3
        me.$refs.lktAuthorizeComp.handleAfterAuth(me, '../../pages/login/login?landing_code=1', function() {
            //正常登录未超时
            if (me.haveSkuBean) {
                var product = []
                product.push({
                    pid: me.integral ? me.goodsId : me.pro_id
                })
                product.push({
                    cid: me.haveSkuBean.cid
                })

                product.push({
                    num: me.numb
                })
                
               
                if(!me.integral) {
                    product.push({
                        sec_id: me.option.id
                    })
                }
                
                console.log('product',product)

                product = JSON.stringify(product)
                let data = {
                    module: 'app',
                    action: 'product',
                    app: 'immediately_cart',
                    product,
                }
                me.$req.post({data}).then(res => {
                    me.clicktimes = []
                    if (res.code == 200) {
                        let url = '../pay/orderDetailsr?product=' + product +
                            '&isDistribution=' + me.isDistribution +
                            '&canshu=true&returnR=0&commodity_type='+me.commodity_type
                        if (me.pages == 'pagesB') {
                            
                            if (me.b_type == 1) {
                                url = '/pagesB/seckill/seckillDetailsr?product=' + product + '&isDistribution=' +
                                    me.isDistribution +
                                    '&canshu=true&returnR=0&b_type=1'    
                            } else {
                                url = '/pagesB/seckill/seckillDetailsr?product=' + product + '&isDistribution=' +
                                    me.isDistribution +
                                    '&canshu=true&returnR=0'
                            }
                            
                            
                        }
                        
                        if(me.integral) {
                            url = '/pagesB/integral/integral_order?product=' + product + '&id=' + me.pro_id
                        }
                        me.$refs.attrModal._mask_f()
                        uni.navigateTo({
                            url: url
                        })
                        me.fastTap = true
                    } else {
                        uni.showToast({
                            title: res.message,
                            duration: 1500,
                            icon: 'none'
                        })
                        setTimeout(function() {
                            me._axios()
                            me.fastTap = true
                        }, 1500)
                    }
                })
            } else {
                me.$refs.attrModal._mask_display()
                me.fastTap = true
                
                if(me.is_seckill){
                    // 以下为初始化选中
                    if(!me.$refs.attrModal.haveSkuBean){
                        let sku_list = me.$refs.attrModal.sku_list
                        for(let i in sku_list.items){
                            if(i == 0 && Number(sku_list.items[i].Stock)>0){
                                me.$refs.attrModal.haveSkuBean = {
                                    name: sku_list.items[i].path,
                                    cid: sku_list.items[i].sku,
                                    skus: sku_list.items[i]
                                };
                            }
                        }
                        
                        let selectName = me.$refs.attrModal.haveSkuBean.name.split(',')
                        
                        for(let i in sku_list.result){
                            
                            for(let k in sku_list.result[i]){
                                
                                let flag = selectName.some(item=>item==k)
                                
                                if(flag){
                                    me.$refs.attrModal.handleActive(i, sku_list.result[i][k])
                                }
                                
                            }
                            
                        }
                    }
                }
                
            }
        })
    }
}

// 确认
export function LaiKeTui_confirm(me) {
    console.log(me)
    console.log(me.num)
    console.log(me.haveSkuBean)
    console.log(me.type)
    if (Boolean(me.haveSkuBean)) {
        if (me.num == 0) {
            uni.showToast({
                title: me.language.toasts.goodsDetailed.kucun,
                duration: 1000,
                icon: 'none'
            })
        } else if (me.num != 0) {
            if (me.type == 1) {
                me.$refs.attrModal._mask_false()
                me.pay_lx('pt')
            } else if (me.type == 2) {
                me._shopping()
                me.pay_lx('pt')
            } else if (me.type == 3) {
                me._buy()
                me.pay_lx('pt')
            }
        }
    } else {
        if (me.num == 0) {
            uni.showToast({
                title: me.language.toasts.goodsDetailed.kucun,
                duration: 1000,
                icon: 'none'
            })
        } else {
            uni.showToast({
                title: me.language.toasts.goodsDetailed.choose,
                duration: 1000,
                icon: 'none'
            })
        }
    }
}


export function in_array(stringToSearch, arrayToSearch) {
    for (let s = 0; s < arrayToSearch.length; s++) {
        let thisEntry = arrayToSearch[s].toString()
        if (thisEntry == stringToSearch) {
            return true
        }
    }
    return false
}

export function LaiKeTuiSetTimeData(me) {
    var data = me.leftTime
    setInterval(function() {
        var t = --data
        var d = Math.floor(t / 60 / 60 / 24)
        var h = Math.floor((t / 3600) - (d * 24))
        var m = Math.floor((t - h * 60 * 60 - d * 24 * 60 * 60) / 60)
        var s = t % 60
        if (h < 10) h = '0' + h
        if (m < 10) m = '0' + m
        if (s < 10) s = '0' + s
        me.hour = h
        me.mniuate = m
        me.second = s
        me.day = d
        if (me.leftTime <= 0) {
            me.hour = 0
            me.mniuate = 0
            me.second = 0
            me.day = 0
        }
    }, 1000)
}

export function LaiKeTuiToBr(me) {
    var data = {
        module: 'app',
        action: 'login',
        app: 'token',
    }
    me.$req.post({data}).then(res => {
        if (res.code == 404 || res.data.login_status == 0) {
            me.$refs.lktAuthorizeComp.handleAfterAuth(me, '../../pages/login/login?landing_code=1')
        } else {
            var bstatus = 0
            if (me.brStatus == 0) {
                bstatus = 1
            } else if (me.brStatus == 1) {
                bstatus = 2
            } else if (me.brStatus == 2) {
                bstatus = 3
            } else if (me.brStatus == 3) {
                bstatus = -1
            }
            uni.redirectTo({
                url: '../../pagesA/bargain/bargainIng?proId=' + me.pro_id + '&attr_id=' + me.attr_id +
                    '&order_no=' + me.order_no +
                    '&brStatus=' + bstatus + '&bargain_id=' + me.bargain_id
            })
        }
    })
}
