export const navigator = {
    async to (url, checkLogin = false, me) {
        if (checkLogin) {
            me.$refs.lktAuthorizeComp.handleAfterAuth(me, '/pages/login/login?landing_code=1', function () {
                uni.navigateTo({
                    url,
                    success () {
                        return Promise.resolve()
                    }
                })
            })
        } else {
            uni.navigateTo({
                url,
                success () {
                    return Promise.resolve()
                }
            })    
        }
    },
    back () {
        if (getCurrentPages().length > 1) {
            uni.navigateBack({
                delta: 1
            })
        } else {
            navigator.toHome()
            
        }
    },
    switchTab (url) {
        uni.switchTab({
            url
        })
    },
    toHome () {
        uni.switchTab({
            url: '/pages/tabBar/home'
        })
    }
}
