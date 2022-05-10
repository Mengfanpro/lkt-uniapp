import htmlParser from '../../../common/html-parser.js'

export function _axios (me) {
    let action = 'groupbuy';
    if (me.a_type) {
        action = 'pthd_groupbuy'
    }
    
    var data = {
        module: 'app',
        action:action,
        m: 'getgoodsdetail',
        pro_id: me.pro_id,
        activity_no: me.activity_no,
        platform_activities_id: me.platform_activities_id
    }
    me.$req.post({data}).then(res => {
        res = res.data
        me.islogin = res.islogin
        me.pro_status = res.product_status
        // me.price = res.kai_min_price
        // me.price2 = res.kai_min_price
        me.price = res.kai_price
        me.price2 = res.kai_min_price
        me.attrList = me.attrList2 = res.attrList
        me.control = res.control
        me.shop_list = res.shop_list
        if (res.isshow == 1) {
            me.isshow = true
        } else {
            me.isshow = false
        }
        me.data_ = res
        me.skuBeanList = res.skuBeanList
        me.det = res.detail
        me.imgurl = res.detail.image
        me.mno_ = res.detail.market_price
        console.log('me.mno____________________________________1')
        console.log(me.mno_)
        me.collection_id = res.collection_id
        me.images = res.detail.images
        me.detail = res.detail
        // me.contentNodes =  htmlParser(me.detail.rule);
        
        if (me.a_type == 1) {
            me.detail.rule = '';
        }
        
        me.content = '<div style=\'padding-left:8px;padding-right:8px;\'>' + me.detail.rule.replace(new RegExp('<view',
            'gm'), '<p').replace(new RegExp('</view>', 'gm'), '</p>') + '</div>'
        var htmlString = me.content.replace(/\\/g, '').replace(/<img/g, '<img style="display:none;"')
        htmlString = htmlString.replace('<div style=\'padding-left:8px;padding-right:8px;\'>',
            '<div style="padding: 0 15px;">')
        console.log(htmlString)
        me.contentNodes = htmlParser(htmlString)
        me.groupList = res.groupList
        me.comments = res.comments
        me.group_level = res.detail.group_level
        me.can_min_price = res.min_price
        me.can_min_man = res.min_man
        me.user_can_can_num = res.user_can_can_num
        me.user_can_open_num = res.user_can_open_num
        me.user_can_can = res.user_can_can
        me.user_can_open = res.user_can_open
        me.again_can = res.again_can
        me.again_open = res.again_open
        me.load = false
        
        console.log(me.comments)
        clearInterval(me.clear)
        me.setTimeData(me.groupList)
        

        
        console.log('noshow')
        console.log(me.isshow)
        if (!me.isshow) {
            me.goods_two = 'goods_two_dsb'
            console.log('noshow')
        }
        
        var lefttime = res.control.lefttime * 1000 //距活动结束
        var righttime = res.control.righttime * 1000 //距活动开始
        
        clearTimeout(me.stop)
        if (Number(res.product_status) == 4) {
            //距离开始时间            
            me.countDown(righttime)
        } else {
            //距离结束时间
            me.countDown(lefttime)
        }
        
        me.attr__ = me.attr_ = res.attrList[0].attr
        me.attr_list = res.attrList
        
        me._reattr()
        
        console.log('bili')
        console.log(me.bili)
        
        me._spec()
    }).catch((err)=>{
        console.error(err)
        me.load = false
    })
}

export function getPic (that) {
    var me = that
    var data = {
        module: 'app',
        action: 'getcode',
        app: 'index',
        pid: me.pro_id,
        m: 'product_share',
        scene: 'productId',
        path: '../tabBar/home',
        type: 3,
        proType: 'pingtuan',
        store_type: 2
    }
    me.$req.post({data}).then(res => {
        console.log('获取图片')
        console.log(res)
        if (res.code == 200) {
            me.ewmImg = res.url
        }
    })
}

export function _money (ss, indet, that) {
    var me = that
    me.num_peo = indet
    me.groupzk = ss
    console.log('money')
    console.log(ss)
    var moneys = me.mno_
    console.log('moneys')
    console.log(moneys)
    var prices = ''
    var i = ss.split('~')
    var j = i[1]
    prices = (j * moneys) / 100
    prices = prices.toFixed(2)
    me.price = prices
    console.log('me.price222')
    console.log(me.price)
}

export function setTimeData (data, that) {
    var me = that
    var groupList = data
    me.clear = setInterval(function () {
        for (var i = 0; i < groupList.length; i++) {
            var t = --groupList[i].leftTime
            var h = Math.floor(t / 60 / 60)
            var m = Math.floor((t - h * 60 * 60) / 60)
            var s = t % 60
            if (h < 10) h = '0' + h
            if (m < 10) m = '0' + m
            if (s < 10) s = '0' + s
            groupList[i].leftTimeStr = h + ':' + m + ':' + s
            if (groupList[i].leftTime <= 0) {
                groupList[i].leftTimeStr = '00:00:00'
                groupList.splice(i, 1)
            }
        }
        me.groupList = groupList
    }, 1000)
}

//倒计时
export function countDown (endtime, that) {
    var me = that

    me.dateformat(endtime)
    clearTimeout(me.stop)
    me.stop = setTimeout(function () {
        endtime = endtime - 1000
        me.countDown(endtime)
    }, 1000)

    if (endtime == 0) {
        me.overtime.day = '00'
        me.overtime.hour = '00'
        me.overtime.minute = '00'
        me.overtime.second = '00'
        clearTimeout(me.stop)
        if (pro_status != 1) {
            me._axios()
        }
    }
}

// 时间格式化输出，如11:03 25:19 每1s都会调用一次
export function dateformat (micro_second, that) {
    var me = that
    // 总秒数
    var second = Math.floor(micro_second / 1000)
    // 天数
    var day = Math.floor(second / 3600 / 24)
    if (day == 0) day = '0' + day
    if (day.toString().length == 1) day = '0' + day

    // 小时
    var hr = Math.floor(second / 3600 % 24)
    var hrStr = hr.toString()
    if (hrStr.length == 1) hrStr = '0' + hrStr

    // 分钟
    var min = Math.floor(second / 60 % 60)
    var minStr = min.toString()
    if (minStr.length == 1) minStr = '0' + minStr

    // 秒
    var sec = Math.floor(second % 60)
    var secStr = sec.toString()
    if (secStr.length == 1) secStr = '0' + secStr

    me.overtime.day = day
    me.overtime.hour = hrStr
    me.overtime.minute = minStr
    me.overtime.second = secStr
}

export function _invite (type, that) {
    var me = that
    console.log('_invite')
    if (!me.access_id) {
        console.log('login111')
        uni.navigateTo({
            url: '../../login/login?landing_code=1'
        })
        return
    } else {
        var name = me.detail.pro_name
        var img = me.images[0]
        if (type == '朋友圈') {
            uni.share({
                provider: 'weixin',
                scene: 'WXSenceTimeline',
                type: 0,
                href: me.shareHref,
                title: name,
                summary: me.shareContent,
                imageUrl: img,
                success: function (res) {
                    me.fastTap = true
                    uni.showToast({
                        title: me.language.toasts.groupDetailed.shareOk,
                        icon: 'none'
                    })
                },
                fail: function (err) {
                    me.fastTap = true
                    uni.showToast({
                        title: me.language.toasts.groupDetailed.shareFail,
                        icon: 'none'
                    })
                    console.log('fail:' + JSON.stringify(err))
                }
            })
        } else if (type == '微信') {
            uni.share({
                provider: 'weixin',
                scene: 'WXSceneSession',
                type: 0,
                href: me.shareHref,
                title: name,
                summary: me.shareContent,
                imageUrl: img,
                success: function (res) {
                    me.fastTap = true
                    uni.showToast({
                        title: me.language.toasts.groupDetailed.shareOk,
                        icon: 'none'
                    })
                },
                fail: function (err) {
                    me.fastTap = true
                    uni.showToast({
                        title: me.language.toasts.groupDetailed.shareFail,
                        icon: 'none'
                    })
                    console.log('fail:' + JSON.stringify(err))
                }
            })
        } else if (type == '二维码') {
            me.showSaveEWM('app')
            return
        }
    }
}

export function _gocantuan (sNo, that) {
    let me = that
    console.log('login222')
    me.$refs.lktAuthorizeComp.handleAfterAuth(me, '../../pages/login/login?landing_code=1', function () {
        if (me.pro_status == 3) {
            uni.showToast({
                title: me.language.toasts.groupDetailed.gocantuan[0],
                duration: 1000,
                icon: 'none'
            })
            return false
        } else if (!me.user_can_can) {
            uni.showToast({
                title: me.language.toasts.groupDetailed.gocantuan[1] + me.user_can_can_num + me.language.toasts.groupDetailed.gocantuan[2],
                duration: 1000,
                icon: 'none'
            })
            return false

        } else if (!me.again_can) {
            uni.showToast({
                title: me.language.toasts.groupDetailed.gocantuan[3],
                duration: 1000,
                icon: 'none'
            })
            return false

        } else {
            if (me.a_type) {
                uni.navigateTo({
                    url: 'group_end?activity_no=' + me.activity_no + '&sNo=' + sNo + '&returnR=1&a_type=1'
                })    
            } else {
                uni.navigateTo({
                    url: 'group_end?activity_no=' + me.activity_no + '&sNo=' + sNo + '&returnR=1'
                })
            }
            
        }
    })
}

export function _downEWM (that) {
    // #ifdef H5
    return false
    // #endif
    let me = that
    console.log('需要保存到本地的图片地址：' + me.ewmImg_url)
    // getImageInfo
    uni.downloadFile({
        url: me.ewmImg_url,
        success: function (sres) {
            console.log(sres.tempFilePath)
            uni.saveImageToPhotosAlbum({
                filePath: sres.tempFilePath,
                success: function () {
                    uni.showToast({
                        title: me.language.toasts.groupDetailed.downEWM[0],
                        duration: 1500,
                        icon: 'none'
                    })
                },
                fail: function () {
                    uni.showToast({
                        title: me.language.toasts.groupDetailed.downEWM[1],
                        duration: 1500,
                        icon: 'none'
                    })
                },
            })
        },
        fail: function (e) {
            console.log(e)
            uni.showToast({
                title: me.language.toasts.groupDetailed.downEWM[1],
                duration: 1500,
                icon: 'none'
            })
        },
    })

}

export function _shareApp (type, that) {
    var me = that
    var scene = ''
    console.log('me.ewmImg=' + me.ewmImg)
    if (type == 1) {
        //App分享到 微信朋友圈
        scene = 'WXSenceTimeline'
    } else if (type == 2) {
        //App分享到 微信好友
        scene = 'WXSceneSession'
    }
    uni.share({
        provider: 'weixin',
        scene: scene,
        type: 2,
        imageUrl: me.ewmImg,
        success: function (res) {
            console.log('success:' + JSON.stringify(res))
        },
        fail: function (err) {
            console.log('fail:' + JSON.stringify(err))
        }
    })
}

export function showShareMask (that) {

}

export function showSaveEWM (string, that) {
    var me = that
    let shareType = 'pt';
    if (me.a_type == 1) {
        shareType = 'pp'
    }
    var data = {
        module: 'app',
        action: 'getcode',
        m: 'share',
        proId: me.pro_id,
        activity_no: me.activity_no,
        type: shareType,
    }
    me.$req.post({data}).then(res => {
        if (res.code == 200) {
            me.ewmImg = uni.getStorageSync('endurl') + res.data.imgUrl
            me.ewmImg_url = uni.getStorageSync('endurl') + res.data.imgUrl
            me.saveEWM = true
            me.shareMask = true
        } else if (res.code == 404) {
            console.log('login333')
            me.$refs.lktAuthorizeComp.handleAfterAuth(me, '../../pages/login/login?landing_code=1')
        } else {
            uni.showToast({
                title: res.message,
                duration: 1500,
                icon: 'none'
            })
        }
        console.log('=======')
        console.log(me.shareMask)
        console.log(me.saveEWM)
        console.log(res)
    })
}

export function _reduce (that) {
    var me = that
    console.log('_reduce')
    if (!Boolean(me.haveSkuBean)) {
        uni.showToast({
            title: me.language.toasts.groupDetailed.reduce[0],
            duration: 1000,
            icon: 'none'
        })
        return
    }
    // 如果是拼团购买，则还要判断是否勾选了拼团人数
    if (me.type == 3 && me.num_peo == '') {
        uni.showToast({
            title: me.language.toasts.groupDetailed.reduce[1],
            duration: 1000,
            icon: 'none'
        })
        return
    }
    if (me.numb > 1 && Boolean(me.haveSkuBean)) {
        me.numb--
    } else {
        me.numb == 1
        uni.showToast({
            title: me.language.toasts.groupDetailed.reduce[2],
            duration: 1000,
            icon: 'none'
        })
    }
}

export function _buy (that) {
    var me = that
    me.type = 3
    me.numb = 1
    me.isshopping = false
    me.price = me.type == 3 ? me.detail.kaiprice : me.det.market_price
    if (!me.fastTap) {
        return
    }
    me.fastTap = false
    me.LaiKeTuiCommon.lktDelaySetVal(me)
    if (me.pro_status == 3) {
        uni.showToast({
            title: me.language.toasts.groupDetailed.buy[0],
            duration: 1000,
            icon: 'none'
        })
    } else {
        console.log('login444')
        me.$refs.lktAuthorizeComp.handleAfterAuth(me, '../../pages/login/login?landing_code=1', function () {
            if (me.detail.g_status == 1) {
                uni.showToast({
                    title: me.language.toasts.groupDetailed.buy[1],
                    duration: 1000,
                    icon: 'none'
                })
                return false
            } else if (me.detail.g_status == 3) {
                uni.showToast({
                    title: me.language.toasts.groupDetailed.buy[0],
                    duration: 1000,
                    icon: 'none'
                })
                return false
            } else if (!me.user_can_open) {
                uni.showToast({
                    title: me.language.toasts.groupDetailed.buy[2] + me.user_can_open_num + me.language.toasts.groupDetailed.buy[3],
                    duration: 1000,
                    icon: 'none'
                })
                return false
            } else if (!me.again_open) {
                uni.showToast({
                    title: me.language.toasts.groupDetailed.buy[4],
                    duration: 1000,
                    icon: 'none'
                })
                return false

            }
            me._reattr()
            
            me._mask_display()
        })
    }

}

//确认
export function _confirm (that) {
    var me = that
    if (Boolean(me.haveSkuBean)) {
        if (me.num == 0) {
            uni.showToast({
                title: me.language.toasts.groupDetailed.confirm[0],
                duration: 1000,
                icon: 'none'
            })
        } else if (me) {
            if (me.type == 1) {
                me._mask_false()
            } else if (me.type == 2) {
                var product = []
                product.push({
                    pid: me.pro_id
                })
                product.push({
                    cid: me.haveSkuBean.cid
                })
                product.push({
                    num: me.numb
                })
                product.push({
                    activity_no: me.activity_no
                })
                product = JSON.stringify(product)
                console.log('跳1')
                
                let url = '../../pages/pay/orderDetailsr?product=' + product + '&returnR=2'
                if (me.a_type == 1) {
                    url += '&a_type=1'
                }
                uni.navigateTo({
                    url: url
                })
                me.fastTap = true
                me.overflow = 'scroll'
                me.mask_display = false
                me.mask_display1 = false
            } else if (me.type == 3) {
                var product = {}
                product['pid'] = me.pro_id
                product['cid'] = me.haveSkuBean.cid
                product['num'] = me.numb
                product['groupnum'] = me.num_peo
                product['price'] = me.price
                product['frompage'] = 'kaituan'
                product['activity_no'] = me.activity_no
                product['platform_activities_id'] = me.platform_activities_id
                product = JSON.stringify(product)

                if (me.num_peo == '') {
                    uni.showToast({
                        title: me.language.toasts.groupDetailed.confirm[1],
                        duration: 1000,
                        icon: 'none'
                    })
                } else {
                    console.log('跳2')

                    let url = '../group/payfor?product=' + product + '&returnR=1'
                    if (me.a_type == 1) {
                        url += '&a_type=1'
                    }
                    uni.navigateTo({
                        url: url
                    })
           

                    me.fastTap = true
                    me.overflow = 'scroll'
                    me.mask_display = false
                    me.mask_display1 = false
                }
            }
        }

    } else {
        if (me.num == 0) {
            uni.showToast({
                title: me.language.toasts.groupDetailed.confirm[0],
                duration: 1000,
                icon: 'none'
            })
        } else {
            uni.showToast({
                title: me.language.toasts.groupDetailed.confirm[2],
                duration: 1000,
                icon: 'none'
            })
        }
    }
    console.log('拼团')
    console.log(me.haveSkuBean)
    console.log(me.haveSkuBean.name)
}

export function _reattr (that) {
    
    var me = that
    for (var i = 0; i < me.attr_.length; i++) {
        console.log('me.attr')
        console.log(me.attr_)
        console.log(me.attr__)
        if (me.attr_[i].select && me.attr_[i].enable) {
            
            console.log(me.data_)
            me.num = me.attr_[i].count
            me.haveSkuBean = me.data_.skuBeanList[i]
            console.log('me.haveSkuBean')
            console.log(me.haveSkuBean)
            if (me.isshopping) {
                me.market_price = me.market_price2 = me.attr_[i].price
                
                console.log('me.isshopping')
            } else {
                me.market_price = me.market_price2 = me.attr_[i].price
                
                //me.price = me.data_.kai_min_price
                me.price = me.data_.kai_price
                console.log('me.isshopping_else')
            }
        }
    }
    me.num_peo = me.data_.kai_min_man
    me.bili = me.data_.detail.group_level[me.num_peo]
    
    me.market_price2 = me.attr_[0].price
}

export function _spec (that) {
    var me = that
    var attrListIn = me.attrList
    for (var i = 0; i < attrListIn.length; i++) {
        var attrListBig = attrListIn[i]
        //当前类别之外的选择列表
        var attrsOtherSelect = []
        for (var j = 0; j < attrListIn.length; j++) {
            var attrListSmall = attrListIn[j]
            if (attrListSmall.id != attrListBig.id) {
                for (var k = 0; k < attrListSmall.attr.length; k++) {
                    var attrListSmallAttr = attrListSmall.attr[k]
                    if (attrListSmallAttr.enable && attrListSmallAttr.select) {
                        //可选并且已经选择的属性
                        attrsOtherSelect.push(attrListSmallAttr)
                    }
                }
            }
        }
        var enableIds = []
        var skuBeanListIn = me.skuBeanList
        for (var z = 0; z < skuBeanListIn.length; z++) {
            var ism = true
            var skuBean = skuBeanListIn[z]
            for (var j = 0; j < attrsOtherSelect.length; j++) {
                var enable = false
                for (var k = 0; k < skuBean.attributes.length; k++) {
                    var goodAttrBean = skuBean.attributes[k]
                    if (attrsOtherSelect[j].attributeId == goodAttrBean.attributeId &&
                        attrsOtherSelect[j].id == goodAttrBean.attributeValId) {
                        /*console.log(attrsOtherSelect[j].attributeId, goodAttrBean.attributeId, attrsOtherSelect[j].id, goodAttrBean.attributeValId)*/
                        enable = true
                        break
                    }
                }
                ism = enable && ism
            }

            if (ism) {
                for (var o = 0; o < skuBean.attributes.length; o++) {
                    var goodAttrBean = skuBean.attributes[o]
                    if (attrListBig.id == goodAttrBean.attributeId) {
                        enableIds.push(goodAttrBean.attributeValId)
                    }
                }
            }
        }
        var integers = enableIds
        for (var s = 0; s < attrListBig.attr.length; s++) {
            var attrItem = attrListBig.attr[s]
            attrItem.enable = integers.indexOf(attrItem.id) != -1
        }
    }
    // 重新赋值
    me.attrList = attrListIn,
        me.skuBeanList = skuBeanListIn
}

//选择属性
export function showState (index, indx, that) {
    var me = that
    console.log('showState')
    console.log(index)
    console.log(indx)

    var listItem = me.attrList
    var items = listItem[indx]
    var item = items.attr[index]
    if (!item.enable) {
        return
    }
    //hg
    console.log('index' + index)
    console.log('aaaaa')
    console.log(me.attr_list[indx]['attr'][index]['count'])

    if (me.attr_list[indx]['attr'][index]['count']) {
        if (Number(me.attr_list[indx]['attr'][index]['count']) > 0) {
            me.market_price = me.attr_list[indx]['attr'][index].price
        }
    } else {
        console.log('aaaa111sssa')

    }
    console.log('aaaaa111')

    var select = !item.select
    for (var i = 0; i < items.attr.length; i++) {
        items.attr[i].select = false
    }
    item.select = select
    // 获取点击属性列表
    var canGetInfo = []
    for (var skuIndex = 0; skuIndex < listItem.length; skuIndex++) {
        for (var skuIndexIn = 0; skuIndexIn < listItem[skuIndex].attr.length; skuIndexIn++) {
            if (listItem[skuIndex].attr[skuIndexIn].enable && listItem[skuIndex].attr[skuIndexIn].select) {
                canGetInfo.push(listItem[skuIndex].attr[skuIndexIn])
            }
        }
    }

    /*console.log(canGetInfo, "目前点击的属性");*/

    var canGetInfoLog = ''

    var skuBeanList = me.skuBeanList

    var haveSkuBean = []
    // 对应库存清单扫描
    for (var skuBeanIndex = 0; skuBeanIndex < skuBeanList.length; skuBeanIndex++) {
        var iListCount = 0
        for (var skuBeanIndexIn = 0; skuBeanIndexIn < skuBeanList[skuBeanIndex].attributes.length; skuBeanIndexIn++) {
            if (canGetInfo.length == skuBeanList[skuBeanIndex].attributes.length) {
                if (skuBeanList[skuBeanIndex].attributes[skuBeanIndexIn].attributeValId == canGetInfo[skuBeanIndexIn].id) {
                    iListCount++
                }
            } else {
                canGetInfoLog = '库存清单不存在此属性' + ' '
            }
        }
        if (iListCount == skuBeanList[skuBeanIndex].attributes.length) {
            haveSkuBean.push(skuBeanList[skuBeanIndex])
        }
    }

    /*console.log(haveSkuBean, "存在于库存清单");*/

    for (var iox = 0; iox < canGetInfo.length; iox++) {
        canGetInfoLog += canGetInfo[iox].attributeValue + ' '
    }

    if (haveSkuBean.length != 0) {
        var gkprice = haveSkuBean[0].price
        if (me.type == 3 && me.num_peo != '') {
            var groupzk = me.groupzk
            if (groupzk.length > 0) {} else {
                groupzk = me.bili
            }
            console.log(groupzk)
            var i = groupzk.split('~')
            var j = i[1]
            gkprice = (j * gkprice) / 100
            console.log(gkprice)
            gkprice = gkprice.toFixed(2)
        }
        me.num = haveSkuBean[0].count
        me.price = gkprice
        console.log('me.price1')
        console.log(me.price)
        console.log('me.num_peo')
        console.log(me.num_peo)
        me.imgurl = haveSkuBean[0].imgurl
        me.haveSkuBean = haveSkuBean[0],
            console.log('me.haveSkuBean')
        console.log(me.haveSkuBean)
        me.mno_ = haveSkuBean[0].price
        console.log('me.mno____________________________________2')
        console.log(me.mno_)
    } else {
        console.log(2)
        me.num = me.det.num
        me.price = me.type == 3 ? me.detail.kaiprice : me.det.market_price
        console.log('me.price3')
        console.log(me.price)
        me.haveSkuBean = ''
        me.mno_ = me.det.market_price
        console.log('me.mno____________________________________3')
        console.log(me.mno_)
    }

    // 重新赋值
    me.attrList = listItem
    /*infoText: canGetInfoLog,*/

    // 重新sku运算
    me._spec()
}
