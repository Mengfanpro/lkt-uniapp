import htmlParser from '@/common/html-parser.js';
// 进入上传商品页面
export function LaiKeTui_axios(me) {
    let data = {
        action: 'mch',
        module: 'app',
        m: 'upload_merchandise_page',
        shop_id: me.shop_id,
    }

    me.$req.post({
        data
    }).then(res => {
        setTimeout(function() {
            me.loadFlag = true
        }, 300)

        let {
            code,
            data,
            message
        } = res

        if (code == 200) {
            me.res = data
            me.proFreightPickerArray = []
            for (var i = 0; i < data.freight_list.length; i++) {
                me.proFreightPickerArray.push(data.freight_list[i].name)

                if (data.freight_list[i].is_default == 1) {
                    me.freightSet = data.freight_list[i].name
                    me.freightSetId = data.freight_list[i].id
                }
            }
            if (data.distributors) {
                for (var i = 0; i < data.distributors.length; i++) {
                    me.proDistributorsPickerArray.push(data.distributors[i].name)
                }
            }
            me.show_adr = data.show_adr
            me.proUnitPickerArray = data.unit

            me.s_type = data.s_type
            me.plugin_list = data.plugin_list

            let plugin_list = {
                active: []
            }
            data.plugin_list.active.filter(item => {
                if (item.name == '正价') {
                    item.status = true
                    plugin_list.active.push(item)
                }
            })
            me.plugin_list = plugin_list

        } else {
            uni.showToast({
                title: message,
                duration: 1500,
                icon: 'none'
            })
        }
    })

}

// 进入编辑商品页面
export function LaiKeTui_editor(me) {
    let data = {
        module: 'app',
        action: 'mch',
        m: 'modify',
        shop_id: me.shop_id,
        p_id: me.p_id,
    }
    me.$req.post({
        data
    }).then(res => {
        me.pageStatus = 1

        let {
            code,
            data,
            message
        } = res

        me.res = data

        if (res.code == 200) {
            // me.tabKey = data.isVirtual
            me.frames_status = data.status

            me.proClass = data.product_class_list1
            me.chooseClass = data.product_class_list1

            if (Array.isArray(data.product_class_list1)) {
                let proI = data.product_class_list1.length - 1
                me.proClassId = data.product_class_list1[proI].cid
            } else {
                me.proClassId = data.product_class_list1.cid
            }

            me.res = data
            me.proBrand = data.brand_class_list1
            me.proBrandId = data.brand_class_list1.brand_id // 品牌ID
            me.proName = data.list.product_title
            me.vstName = data.list.subtitle
            me.keyWord = data.list.keyword
            me.proWegiht = data.list.weight
            me.proCode = data.list.scan
            me.showImg = data.imgurls
            me.cover_map = data.cover_map

            me.showImgOld = [...data.imgurls]
            me.$store.state.attr_group = data.attr
            me.$store.state.attr_arr = data.attrList
            let chooseAttr = ''
            for (let i = 0; i < data.attr.length; i++) {
                chooseAttr += ',' + data.attr[i].attr_group_name
            }
            chooseAttr = chooseAttr.replace(',', '')
            uni.setStorageSync('upload_attr_group', data.attr)
            uni.setStorageSync('upload_attr_arr', data.attrList)
            uni.setStorageSync('upload_chooseAttr', chooseAttr)
            me.attr_group = data.attr
            me.attr_arr = data.attrList
            me.show_adr = data.show_adr
            me.s_type = data.s_type
            me.plugin_list = data.plugin_list
            me.freightSet = data.freight_list1
            me.freightSetId = data.freight_list1.id
            me.distributorsSet = data.distributors1
            me.distributorsSetId = data.distributors1.id
            me.content = data.content
            me.type_status = data.type_status

            if (data.content != '') {
                let richList = htmlParser(data.content)
                me.richList = []
                parseRich(me, richList)

                me.$store.state.goodsDetail = JSON.parse(JSON.stringify(me.richList))
            } else {
                me.$store.state.goodsDetail = []
            }

            if (me.distributorsSetId != 0) {
                me.show_adrStatus = false
                me.distributorsStatus = true
            }
            me.costM = Number(data.initial.cbj)
            me.oldM = data.initial.yj
            me.vshop = data.initial.volume
            me.sellM = Number(data.initial.sj)
            me.stock = data.initial.kucun
            me.unit = data.initial.unit
            me.stockWarn = data.initial.stockWarn

            if (data.initial.length > 1) {
                me.costM = Number(data.initial.cbj)
                me.oldM = data.initial.yj
                me.vshop = data.initial.volume
                me.sellM = Number(data.initial.sj)
                me.stock = data.initial.kucun
                me.unit = data.initial.unit
                me.stockWarn = data.initial.stockWarn
            }

            me.s_typeStr = []
            for (var i = 0; i < data.s_type.length; i++) {
                if (data.s_type[i].status) {
                    me.s_typeStr.push(data.s_type[i].value)
                }
            }
            for (var i = 0; i < data.show_adr.length; i++) {
                if (data.show_adr[i].status) {
                    me.active.push(i)
                }
            }
            for (var i = 0; i < data.plugin_list.active.length; i++) {
                if (data.plugin_list.active[i].status) {
                    me.active.push(data.plugin_list.active[i].value)
                }
                if (data.plugin_list.active[0].status == false) {
                    me.show_adrStatus = false
                }
            }

            me.res.brand_class_list = data.list.brand_list

            if (data.brand_list) {
                for (var i = 0; i < data.brand_list.length; i++) {
                    me.proBrandPickerArray.push(data.brand_list[i].brand_name)
                }
            }

            if (data.freight_list) {
                me.proFreightPickerArray = []
                for (var i = 0; i < data.freight_list.length; i++) {
                    me.proFreightPickerArray.push(data.freight_list[i].name)
                }
            }

            if (data.distributors) {
                for (var i = 0; i < data.distributors.length; i++) {
                    me.proDistributorsPickerArray.push(data.distributors[i].name)
                }
            }

            me.proUnitPickerArray = data.unit
            if (data.list.is_hexiao == 0) {
                me.downLineStatus = false
            } else if (data.list.is_hexiao == 1) {
                me.downLineStatus = true
            }
            me.downLineAdd = data.list.hxaddress

            setTimeout(function() {
                me.loadFlag = true
            }, 300)
        } else {
            uni.showToast({
                title: message,
                duration: 1500,
                icon: 'none'
            })
        }
    })
}

function parseRich(me, richList, style) {
    for (let i = 0; i < richList.length; i++) {
        if (richList[i].children) {

            if (richList[i].name == 'strong' || richList[i].name == 'em') {
                let style1 = ''
                if (richList[i].name == 'em') {
                    style1 = 'font-style: italic;'
                }

                if (richList[i].name == 'strong') {
                    style1 = 'font-weight: bold;'
                }

                if (style) {
                    style += style1
                } else {
                    style = style1
                }

                parseRich(me, richList[i].children, style)
            } else {
                parseRich(me, richList[i].children)
            }

        } else {

            if (richList[i].name == 'img') {
                richList[i].name = 'image'
            }

            if (richList[i].name && richList[i].name != 'p' && richList[i].name != 'div' && richList[i].name !=
                'span') {
                if (richList[i].attrs) {
                    me.richList.push({
                        tagType: richList[i].name,
                        value: richList[i].attrs.src,
                        style: richList[i].attrs.style
                    })
                }
            }

            if (richList[i].name == 'p' || richList[i].name == 'div' || richList[i].name == 'span' || richList[i]
                .type == 'text' || richList[i].text) {

                me.richList.push({
                    tagType: 'p',
                    value: richList[i].text,
                    style: style
                })
            }

        }

    }

}

// 查看商品详情
export function LaiKeTui_see(me) {
    let data = {
        module: 'app',
        action: 'mch',
        m: 'modify',
        shop_id: me.shop_id,
        p_id: me.p_id
    }

    if (me.status == 'seePro') {
        data.m = 'see'
    }

    me.$req.post({
        data
    }).then(res => {
        let {
            code,
            data,
            message
        } = res

        if (code == 200) {
            me.showContent = true

            me.proClass = data.product_class_list1
            me.chooseClass = data.product_class_list1
            me.proClassId = data.product_class_list1.cid

            if (data.product_class_list1.length > 1) {
                me.proClassId = data.product_class_list1[1].cid
            }

            me.proBrand = data.brand_class_list1
            me.proBrandId = data.brand_class_list1.brand_id
            me.unit = data.initial.unit
            me.proName = data.list.product_title
            me.vstName = data.list.subtitle
            me.keyWord = data.list.keyword
            me.proWegiht = parseInt(data.list.weight) + 'g'
            me.proCode = data.list.scan
            me.showImg = data.imgurls
            me.cover_map = data.cover_map
            me.showImgOld = data.imgurls
            me.$store.state.attr_group = data.attr
            me.$store.state.attr_arr = data.attrList
            me.attr_group = data.attr
            me.attr_arr = data.attrList
            me.freightSet = data.freight_list1
            me.s_type = data.s_type
            me.plugin_list = data.plugin_list
            me.freightSetId = data.freight_list1.id
            me.show_adr = data.show_adr

            me.s_typeShow = ''
            for (var i in data.s_type) {
                if (data.s_type[i].status) {
                    me.s_typeStr.push(data.s_type[i].value)
                    me.s_typeShow += ',' + data.s_type[i].name
                }
            }
            for (var i in data.plugin_list.active) {
                if (data.plugin_list.active[i].status) {
                    me.active.push(data.plugin_list.active[i].value)
                }
            }

            me.show_adrShow = ''
            for (var i in me.show_adr) {
                me.show_adrShow += ',' + data.show_adr[i].name
            }

            me.s_typeShow = me.s_typeShow.replace(',', '')
            me.show_adrShow = me.show_adrShow.replace(',', '')

            if (data.list.is_hexiao == 0) {
                me.downLineStatus = false
            } else if (data.list.is_hexiao == 1) {
                me.downLineStatus = true
            }
            me.downLineAdd = data.list.hxaddress
            me.content = data.content
            if (data.richList) {
                me.richList = JSON.parse(data.richList)
                me.$store.state.goodsDetail = JSON.parse(data.richList)
            } else {
                me.richList = []
                me.$store.state.goodsDetail = []
            }
            if (me.content != '') {
                me.content = me.content.replace(new RegExp('<image', 'gm'), '<img').replace(new RegExp(
                    '</image>', 'gm'), '')
            } else {
                me.content = ' '
            }

            setTimeout(function() {
                me.loadFlag = true
            }, 300)
        } else {
            uni.showToast({
                title: message,
                duration: 1500,
                icon: 'none'
            })
        }
    })
}

// 获取分类
export function LaiKeTui_showProClass(me) {
    let data = {
        action: 'mch',
        module: 'app',
        m: 'get_class',
        shop_id: me.shop_id,
        class_str: me.proClassId,
        brand_str: me.proBrandId,
    }
    me.$req.post({
        data
    }).then(res => {
        let {
            code,
            data,
            message
        } = res

        if (code == 200) {
            me.chooseClassFlag = true

            me.chooseClass = me.chooseClass.filter(item => {
                return item.pname != "请选择"
            })

            if (me.chooseClass.length == 0) {
                me.chooseClass.push({
                    pname: me.language.uploadPro.choice
                })
            } else {

                if (data.list.class_list && data.list.class_list[0]) {

                    let flag = data.list.class_list[0].some(item => {
                        return me.chooseClass[me.chooseClass.length - 1].pname == item.pname
                    })

                    if (!flag) {
                        me.chooseClass.push({
                            pname: me.language.uploadPro.choice
                        })
                    }

                }

            }

            if (data.list.class_list.length != 0) {
                if (data.list.class_list[0] && me.chooseClass[0].pname == me.language.uploadPro.choice) {
                    data.list.class_list[0].filter(item => {
                        item.status = false
                    })
                }
                me.arrClass = data.list.class_list[0]
            }

            me.res.brand_class_list = data.list.brand_list
            me.proBrandPickerArray = []
            for (var i = 0; i < data.list.brand_list.length; i++) {
                me.proBrandPickerArray.push(data.list.brand_list[i].brand_name)
            }
        } else {
            uni.showToast({
                title: message,
                duration: 1500,
                icon: 'none'
            })
        }
    })
}

// 选择分类
export function LaiKeTui_onConfirmProClass(me, item) {
    let data = {
        action: 'mch',
        module: 'app',
        m: 'choice_class',
        shop_id: me.shop_id,
        cid: item.cid,
        brand_str: me.proBrandId,
    }
    me.$req.post({
        data
    }).then(res => {
        let {
            code,
            data,
            message
        } = res

        if (code == 200) {
            var chooseClass_num = me.chooseClass.length - 1
            me.proClassId = item.cid
            me.proClass = item.pname

            if (me.chooseClass[chooseClass_num].pname == me.language.uploadPro.choice) {
                me.chooseClass[chooseClass_num] = item
                if (data.list.class_list.length == 0) {
                    me.chooseClassFlag = false
                } else {
                    me.arrClass = data.list.class_list[0]
                    me.chooseClass.push({
                        pname: me.language.uploadPro.choice
                    })
                }
            }
            me.proBrandPickerArray = []
            me.res.brand_class_list = data.list.brand_list
            var proBrandId = me.proBrandId
            me.proBrand = ''
            me.proBrandId = '0'
            console.log(data.list.brand_list)
            console.log(proBrandId)
            for (var i = 0; i < data.list.brand_list.length; i++) {
                if (proBrandId == data.list.brand_list[i].brand_id) {
                    console.log(data.list.brand_list[i].brand_id)
                    me.proBrandId = data.list.brand_list[i].brand_id
                    me.proBrand = data.list.brand_list[i].brand_name
                }
                me.proBrandPickerArray.push(data.list.brand_list[i].brand_name)
            }

        } else {
            uni.showToast({
                title: message,
                duration: 1500,
                icon: 'none'
            })
        }
    })

}

// 选择品牌
export function LaiKeTui_showProBrand(me) {
    me.proBrandShow = true
    me.mode = 'selector'
    me.deepLength = 1
    me.proBrandPickerDefault = [0]
    var timing
    setTimeout(() => {
        timing = me.$refs.proBrandPicker
    }, 10)
    setTimeout(() => {
        timing.show()
    }, 100)
}

// 点击品牌
export function LaiKeTui_onConfirmProBrand(me, e) {
    console.log(me.pageStatus)
    console.log(e.label)
    if (me.pageStatus == 1) {
        console.log(me.proBrand)
        me.proBrand = {
            brand_name: e.label
        }
    } else {
        me.proBrand = e.label
    }
    console.log(me.proBrand)
    me.show = false
    if (me.res.brand_class_list[e.index[0]]) {
        me.proBrandId = me.res.brand_class_list[e.index[0]].brand_id
    }

}

// 删除图片
export function LaiKeTui_delImg(me, index) {
    if (in_array(me.showImg[index], me.showImgNewAdd)) {
        var a1 = me.showImgNewAdd.indexOf(me.showImg[index])
        me.showImgNewAdd.splice(a1, 1)
    }
    if (in_array(me.showImg[index], me.showImgOld)) {
        var a1 = me.showImgOld.indexOf(me.showImg[index])
        me.showImgOld.splice(a1, 1)
    }
    me.showImg.splice(index, 1)
}

// 删除封面图片
export function LaiKeTui_delImg2(me) {
    me.cover_map = '';
}

// 设为主图
export function LaiKeTui_setMain(me, index) {
    var img = me.showImg[index]
    me.showImg.splice(index, 1)
    me.showImg.unshift(img)
    //将新图上传为主图
    if (index >= me.showImgOld.length) {
        var index1 = index - me.showImgOld.length
        var img1 = me.showImgNewAdd[index1]
        me.showImgNewAdd.splice(index1, 1)
        me.showImgNewAdd.unshift(img1)
    }
}

// 选择图片
export function LaiKeTui_chooseImg(me, num) {
    var count = me.upImgNum[num]
    uni.chooseImage({
        count,
        success: async (res) => {
            let list = []
            if (me.pageStatus == 1) {
                list = await getImageList(res.tempFilePaths, me)
                me.showImgNewAdd = me.showImgNewAdd.concat(list)
            } else {
                list = await getImageList(res.tempFilePaths, me)
            }
            me.showImg = me.showImg.concat(list)
        }
    })
}

// 选择图片
export function LaiKeTui_chooseImg2(me) {
    uni.chooseImage({
        count: 1,
        success: async (res) => {
            let list = await getImageList(res.tempFilePaths, me)
            me.cover_map = list[0]
        }
    })
}

export async function getImageList(tempFilePaths, me) {
    let list = tempFilePaths
    uni.showLoading({
        title: me.language.showLoading.upLoading,
        mask: true
    })
    for (let key of list.keys()) {
        let res = await me.$req.upLoad(list[key])
        list[key] = res.data
    }
    uni.hideLoading()
    return Promise.resolve(list);
}

// 成本价
export function LaiKeTui_cbj(me, e) {
    if (me.status == 'editor') {
        for (var i = 0; i < me.attr_arr.length; i++) {
            me.attr_arr[i].cbj = e.detail.value
        }
    }
}

// 原价
export function LaiKeTui_yj(me, e) {
    if (me.status == 'editor') {
        for (var i = 0; i < me.attr_arr.length; i++) {
            me.attr_arr[i].yj = e.detail.value
        }
    }
}

// 虚拟销量
export function LaiKeTui_volume(me, e) {
    if (me.status == 'editor') {
        for (var i = 0; i < me.attr_arr.length; i++) {
            me.attr_arr[i].volume = e.detail.value
        }
    }
}

// 售价
export function LaiKeTui_sj(me, e) {
    if (me.status == 'editor') {
        for (var i = 0; i < me.attr_arr.length; i++) {
            me.attr_arr[i].sj = e.detail.value
        }
    }
}

// 库存
export function LaiKeTui_kc(me, e) {
    if (me.status == 'editor') {
        for (var i = 0; i < me.attr_arr.length; i++) {
            me.attr_arr[i].kucun = e.detail.value
        }
    }
}

// 库存预警
export function LaiKeTui_kcyj(me, e) {
    if (me.status == 'editor') {
        for (var i = 0; i < me.attrList.length; i++) {
            me.attrList[i].stockWarn = e.detail.value
        }
    }
}

// 显示单位
export function LaiKeTui_showProUnit(me) {
    me.proUnitShow = true
    me.mode = 'selector'
    me.deepLength = 1
    me.proUnitPickerDefault = [0]
    var timing
    setTimeout(() => {
        timing = me.$refs.proUnitPicker
    }, 10)
    setTimeout(() => {
        timing.show()
    }, 100)
}

// 设置属性
export function LaiKeTui_setAttr(me) {
    // pageStatus:'',//[0-上传，1-编辑，2-查看]
    if (me.pageStatus == 0) {
        if (me.costM && me.oldM && me.sellM && me.stock && me.stockWarn) {
            uni.navigateTo({
                url: '../myStore/setAttr?costM=' + me.costM + '&oldM=' + me.oldM + '&sellM=' + me.sellM +
                    '&stock=' + me.stock + '&stockWarn=' + me.stockWarn + '&unit=' + me.unit + '&pageStatus=' +
                    me.pageStatus
            })
        } else {
            uni.showToast({
                title: me.language.toasts.uploadPro.setAttr,
                duration: 1500,
                icon: 'none'
            })
        }
    } else {
        uni.navigateTo({
            url: '../myStore/setAttr?costM=' + me.costM + '&oldM=' + me.oldM + '&sellM=' + me.sellM +
                '&stock=' +
                me.stock + '&stockWarn=' + me.stockWarn + '&unit=' + me.unit + '&pageStatus=' + me.pageStatus +
                '&frames_status=' + me.frames_status
        })
    }
}

// 运费
export function LaiKeTui_showProFreight(me) {
    me.proFreightShow = true
    me.mode = 'selector'
    me.deepLength = 1
    me.proFreightPickerDefault = [0]
    me.$refs.proFreightPicker.show()
}

// 点击运费
export function LaiKeTui_onConfirmProFreight(me, e) {
    if (me.pageStatus == 1) {
        me.freightSet.name = e.label
    } else {
        me.freightSet = e.label
    }
    me.show = false
    me.freightSetId = me.res.freight_list[e.index[0]].id
}

// 显示标签
export function LaiKeTui_chooseSType(me, index) {
    me.s_typeStr = []
    me.s_type[index].status = !me.s_type[index].status
    for (var i in me.s_type) {
        var a = me.s_type[i].status
        if (a) {
            me.s_typeStr.push(i)
        }
    }
}

// 支持活动
export function LaiKeTui_changeActive(me, num) {
    if (me.type_status == 1) {
        uni.showToast({
            title: me.language.toasts.uploadPro.changeActive[0],
            duration: 1500,
            icon: 'none'
        })
    } else if (me.type_status == 2) {
        uni.showToast({
            title: me.language.toasts.uploadPro.changeActive[1],
            duration: 1500,
            icon: 'none'
        })
    } else {
        var a = 0
        me.plugin_list.active[num].status = !me.plugin_list.active[num].status
        me.active = me.plugin_list.active[num].value
        for (var i = 0; i < me.plugin_list.active.length; i++) {
            me.plugin_list.active[i].status = false
        }
        me.plugin_list.active[num].status = true
        if (me.plugin_list.active[num].value == 1) {
            me.show_adrStatus = true
            me.distributorsStatus = false
        } else if (me.plugin_list.active[num].value == 5) {
            me.show_adrStatus = false
            me.distributorsStatus = true
        } else {
            me.show_adrStatus = false
            me.distributorsStatus = false
        }
    }
}

// 显示位置
export function LaiKeTui_chooseShowAdr(me, index) {
    me.display_position = []
    me.show_adr[index].status = !me.show_adr[index].status
    for (var i in me.show_adr) {
        var a = me.show_adr[i].status
        if (a) {
            me.display_position.push(i)
        }
    }
}

// 等级绑定
export function LaiKeTui_showProDistributors(me) {
    me.proDistributorsShow = true
    me.mode = 'selector'
    me.deepLength = 1
    me.proDistributorsPickerDefault = [0]
    me.$refs.proDistributorsPicker.show()
}

// 点击分销等级
export function LaiKeTui_onConfirmProDistributors(me, e) {
    if (me.pageStatus == 1) {
        me.distributorsSet.name = e.label
    } else {
        me.distributorsSet = e.label
    }
    me.show = false
    me.distributorsSetId = me.res.distributors[e.index[0]].id
}

// 提交
export function LaiKeTui_Check(me, type) {
    if (!me.fastTap) {
        return
    }
    // 初始值
    me.initial = 'cbj=' + me.costM + ',yj=' + me.oldM + ',sj=' + me.sellM + ',kucun=' + me.stock + ',unit=' + me.unit +
        ',stockWarn=' + me.stockWarn
    me.fastTap = false

    // if (me.proName && me.keyWord && me.proWegiht && me.proClass && me.proBrand && me.unit && me.freightSet && me.showImg
    //     .length > 0 && me.attr_arr.length > 0 && me.cover_map) {

    let noEmpty = me.proName && me.keyWord && me.proClass && me.proBrand && me.unit && me.freightSet && me.showImg
        .length > 0 && me.attr_arr.length > 0 && me.cover_map;

    if (me.tabKey == 1) {
        noEmpty = me.proName && me.keyWord && me.proClass && me.proBrand && me.unit && me.showImg.length > 0 && me
            .attr_arr.length > 0 && me.cover_map;
    }

    if (noEmpty) {
        if (Number(me.costM) > Number(me.sellM)) {
            me.fastTap = true
            me.check_Flag = true
            uni.showToast({
                title: me.language.toasts.uploadPro.cbjFail,
                icon: 'none'
            })
            return
        }

        if (me.downLineStatus) {
            if (me.downLineAdd) {
                me._request(type)
            } else {
                me.fastTap = true
                me.check_Flag = true
                uni.showToast({
                    title: me.language.toasts.uploadPro.check[0],
                    duration: 1500,
                    icon: 'none'
                })
            }
        } else {
            me._request(type)
        }
    } else {
        uni.showToast({
            title: me.language.toasts.uploadPro.check[1],
            duration: 1500,
            icon: 'none'
        })
        me.fastTap = true
        me.check_Flag = true
    }
}

export function LaiKeTui_request(me, type) {
    uni.showLoading({
        title: me.language.showLoading.waiting
    })
    var active_str = ''
    var show_adr_str = ''
    var s_type = ''

    for (var j in me.show_adr) {
        if (me.show_adr[j].status) {
            show_adr_str += me.show_adr[j].value + ','
        }
    }
    for (var l in me.plugin_list.active) {
        if (me.plugin_list.active[l].status) {
            active_str = me.plugin_list.active[l].value
        }
    }
    for (var j in me.s_type) {
        if (me.s_type[j].status) {
            s_type += me.s_type[j].value + ','
        }
    }

    //商品详情
    let content = me.getGoodsDetailsContext()
    let richList = JSON.stringify(me.richList)
    //pageStatus : [0-上传，1-编辑，2-查看]
    if (me.pageStatus == 0) {
        var data = {
            shop_id: me.shop_id,
            m: 'upload_merchandise',
            cover_map: me.cover_map,
            showImg: me.showImg,
            module: 'app',
            p_id: me.p_id,
            action: 'mch',
            product_title: encodeURI(me.proName),
            subtitle: encodeURI(me.vstName),
            scan: me.proCode,
            product_class_id: me.proClassId,
            brand_id: me.proBrandId,
            keyword: encodeURI(me.keyWord),
            weight: me.proWegiht,
            attr_group: encodeURI(JSON.stringify(me.attr_group)),
            attr_arr: encodeURI(JSON.stringify(me.attr_arr)),
            freight_id: me.freightSetId,
            display_position: show_adr_str,
            s_type: s_type,
            active: active_str,
            distributor_id: me.distributorsSetId,
            is_hexiao: me.downLineStatus,
            hxaddress: me.downLineAdd,
            unit: encodeURI(me.unit),
            stockWarn: me.stockWarn,
            initial: encodeURI(me.initial),
            volume: me.LaiKeTuiCommon.isempty(me.vshop) ? 0 : me.vshop,
            content: content,
            richList: richList,
            // isVirtual: me.tabKey,
        }
        if (type == 'no') {
            data.mch_status = 4
        } else if (type == 'yes') {
            data.mch_status = 1
        }

        me.$req.post({
            data
        }).then(res => {
            if (res.code == 200) {
                uni.showToast({
                    title: me.language.toasts.uploadPro.upOk,
                    duration: 1500,
                    icon: 'none'
                })


                setTimeout(function() {
                    uni.navigateBack({
                        delta: 1
                    })
                    me.attr_group = []
                    me.attr_arr = []
                }, 1500)
            } else {
                me.fastTap = true
                me.check_Flag = true
                uni.showToast({
                    title: res.message,
                    duration: 1500,
                    icon: 'none'
                })
            }
        })
    } else if (me.pageStatus == 1) {
        var data = {
            showImgOld: me.showImgOld.join(','),
            shop_id: me.shop_id,
            m: 're_edit',
            showImg: me.showImg,
            module: 'app',
            p_id: me.p_id,
            action: 'mch',
            unit: me.unit,
            cover_map: me.cover_map,
            product_title: encodeURI(me.proName),
            subtitle: encodeURI(me.vstName),
            scan: me.proCode,
            product_class_id: me.proClassId,
            brand_id: me.proBrandId,
            keyword: encodeURI(me.keyWord),
            weight: me.proWegiht,
            attr_group: encodeURI(JSON.stringify(me.attr_group)),
            attr_arr: encodeURI(JSON.stringify(me.attr_arr)),
            freight_id: me.freightSetId,
            display_position: show_adr_str,
            s_type: s_type,
            active: active_str,
            is_hexiao: me.downLineStatus,
            hxaddress: me.downLineAdd,
            firstPage: me.showImg[0],
            distributor_id: me.distributorsSetId == null ? "" : me.distributorsSetId,
            unit: encodeURI(me.unit),
            stockWarn: me.stockWarn,
            initial: encodeURI(me.initial),
            volume: me.LaiKeTuiCommon.isempty(me.vshop) ? 0 : me.vshop,
            content: content,
            richList: richList,
            // isVirtual: me.tabKey,
        }
        if (type == 'no') {
            data.mch_status = 4
        } else if (type == 'yes') {
            data.mch_status = 1
        }

        me.$req.post({
            data
        }).then(res => {
            if (res.code == 200) {
                uni.showToast({
                    title: me.language.toasts.uploadPro.upOk,
                    duration: 1500,
                    icon: 'none'
                })

                setTimeout(function() {
                    uni.navigateBack({
                        delta: 1
                    })
                    me.attr_group = []
                    me.attr_arr = []
                }, 1500)
            } else {
                me.fastTap = true
                me.check_Flag = true
                uni.showToast({
                    title: res.message,
                    duration: 1500,
                    icon: 'none'
                })
            }
        })

    }
}

export function in_array(stringToSearch, arrayToSearch) {
    for (let s = 0; s < arrayToSearch.length; s++) {
        // let thisEntry = arrayToSearch[s].toString()
        let thisEntry = arrayToSearch[s]
        if (thisEntry == stringToSearch) {
            return true
        }
    }
    return false
}
