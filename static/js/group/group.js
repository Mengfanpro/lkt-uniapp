export async  function _axios2(me) {
    let data = {
        module: 'app',
        action: 'pthd_groupbuy',
        page: me.page,
        m: 'grouphome',
        navType: me.navType
    }

    let res = await me.$req.post({data})
    res = res.data
    try {
        if (res.list && res.list.length) {
            res.list.map(item => item.a_type = 1)
            return  res.list;
        } else {
            return []
        }
    } catch (e) {
        console.error(e);
        return [];
    }
    console.log(res);
}

/**
 * 加载数据
 * @param me
 */
export function _axios (me) {
    let data = {
        module: 'app',
        action: 'groupbuy',
        page: me.page,
        m: 'grouphome',
        navType: me.navType
    }
    
    me.$req.post({data}).then(async res => {
        if (typeof (res) === 'string') {
            res = {
                data: {
                    list: [],
                },
                code: 200
            }
        }
        
        if (res.code == 404) {
            me.$refs.lktAuthorizeComp.handleAfterAuth(me, '../../pages/login/login?landing_code=1')
        }
        res = res.data
        let newList = await _axios2(me)
        if (!res.list || res.length) {
            res.list = [];
        }
        console.log(res);
        res.list = res.list.concat(newList);
        if (res.list.length) {
            if (me.navType == 2) {
                me.setTimeData(res.list)
            } else {
                let {
                    pro
                } = res
                me.list.push(...res.list)
            }
            if (res.list.length > 9) {
                me.loadingType2 = 0
            } else {
                me.loadingType2 = 2
            }
        } else {
            me.loadingType2 = 2
            me.msg = res.code
        }
        if (me.list.length === 0) {
            me.empty = true
        }
        me.load = true
    })
    
}

function timing (groupList, me) {
    for (var i = 0; i < groupList.length; i++) {

        var t = --groupList[i].leftTime

        if (t < 0) {
            continue
        }

        if (t == 0) {
            let action = 'groupbuy'
            if (groupList[i].a_type) {
                action = 'pthd_groupbuy';
            }
            
            let data = {
                module: 'app',
                action: action,
                m: 'set_status',
                id: groupList[i].id
            }
            
            me.$req.post({data}).then(res => {
                if (res.status == 1) {
                    me.list = []
                    me.loadingType2 = 0
                    me.page = 1
                    me._axios()
                }
            })
        }

        var d = Math.floor(parseInt(t) / 86400)
        var h = Math.floor((t / 3600) - (d * 24))
        var m = Math.floor((t - h * 60 * 60 - d * 24 * 60 * 60) / 60)
        var s = t % 60

        if (h < 10) h = '0' + h
        if (m < 10) m = '0' + m
        if (s < 10) s = '0' + s
        if (d < 10) d = '0' + d
        if (d == 0) d = '00'

        groupList[i].hour = h
        groupList[i].mniuate = m
        groupList[i].second = s
        groupList[i].day = d
        if (groupList[i].day == 0) {
            groupList[i].day = '00'
        }

        if (groupList[i].leftTime <= 0) {
            groupList[i].hour = '00'
            groupList[i].mniuate = '00'
            groupList[i].second = '00'
            groupList[i].day = '00'
        }
    }
}

/**
 * 倒计时
 * @param {Object} data
 * @param {Object} that
 */
export function setTimeData (data, that) {
    var me = that
    me.list.push(...data)

    timing(me.list, me)

    clearInterval(me.timeI)
    me.timeI = setInterval(function () {
        timing(me.list, me)
    }, 1000)

    setTimeout(function () {
        me.list = me.list
    }, 0)
}
