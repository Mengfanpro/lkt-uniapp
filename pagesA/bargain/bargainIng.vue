<template>
    <div class="page">
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <div class="is-status"></div>
        <heads :title="language.bargainIng.title"></heads>
        <toload :load="!load">
            <div class="bargainRule" @tap="_ruleDiv(true)">
                <img :src="barExp" alt="" />
                <span>{{language.bargainIng.rules}}</span>
            </div>

            <div class="bargainContent">
                <div v-if="friend && islogin" class="allCenter yh-allCenter">
                    <img :src="headimgurl" class="yh-allCenter-img" />

                    <div class="yh-allCenter-div">
                        <div class="yh-allCenter-div-name">{{ user_name }}:</div>
                        <div class="yh-allCenter-div-text">{{language.bargainIng.helpMe}}</div>
                    </div>
                </div>
                <div class="brDiv" @tap="goGoods(list.goods_id, list.attr_id, list.status, list.selforder_no, list.leftTime, list.bargain_id, list.selfhasorder,list.selfstatus)">
                    <div class="leftBrDiv"><img :src="list.img" alt="" /></div>
                    <div class="rightBrDiv">
                        <div class="proTitle">{{ list.title }}</div>

                        <div class="group_num">
                            <span v-if="list.day">
                                <span class="g_n_num dayNum">{{ list.day }}</span>
                                <span class="yh-day">{{language.bargainIng.days}}</span>
                            </span>

                            <text class="g_n_num">{{ list.hour }}</text>
                            <text class="g_n_dian">:</text>
                            <text class="g_n_num">{{ list.mniuate }}</text>
                            <text class="g_n_dian">:</text>
                            <text class="g_n_num yh-g-n-num">{{ list.second }}</text>
                            <span v-if="list.leftTime > 0" class="gray">{{language.bargainIng.finish}}</span>
                        </div>

                        <div class="brNum" v-if="list.leftTime < 0 && list.original_price != 0">
                            <div class="proPrice"><span class="yh-proPrice">{{language.bargainIng.timeout}}</span></div>
                        </div>
                        <div class="brNum" v-else>
                            <div class="proPrice">
                                {{language.bargainIng.afterBargaining}}
                                <span class="yh-jh-proPrice">¥{{ list.min_price }}</span>
                                {{language.bargainIng.yuan}}
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="list.original_price > 0" class="yh-original-price">
                    {{language.bargainIng.moneyArr[0]}}
                    <span class="red">{{ list.success_money }}</span>
                    {{language.bargainIng.moneyArr[1]}}
                    <span class="red">{{ list.original_price }}</span>
                    {{language.bargainIng.moneyArr[2]}}
                </div>

                <div v-else class="yh-original-price">
                    <text v-if="friend">{{language.bargainIng.friendSuccess}}</text>
                    <text v-else>{{language.bargainIng.success}}</text>
                </div>

                <div class="allCenter yh-allCenters">
                    <div :style="{ width: width1 }" class="yh-allCenters-wid"></div>
                    <div class="yh-allCenters-abs"></div>
                </div>
                
                <div class="kj_allCenter">
                    <span>{{language.vipClub.original}}：¥{{list.price}}</span>
                    <span>{{language.bargainIng.min_price}}：<font>¥{{list.min_price}}</font></span>
                </div>
                
                
                <!-- #ifdef MP-ALIPAY || MP-TOUTIAO  || MP-BAIDU -->
                <button open-type="share" style="border: none;height: auto;" @tap="_shareDiv(true)" v-if="friendOver && list.original_price != 0" class="shareBtn copyy">
                    {{language.bargainIng.friendShare}}
                </button>
                <!-- #endif -->

                <!-- #ifndef MP-ALIPAY || MP-TOUTIAO  || MP-BAIDU -->
                <div v-if="friendOver && list.original_price != 0" :data-clipboard-text="shareHref" data-clipboard-action="copy" class="shareBtn copyy" @tap="_shareDiv(true)">
                    {{language.bargainIng.friendShare}}
                </div>
                <!-- #endif -->

                <div v-else-if="friend && friendOver && list.original_price == 0" class="shareBtn">{{language.bargainIng.friendSuccess}}</div>
                <!-- #ifdef MP-ALIPAY || MP-TOUTIAO || MP-BAIDU -->
                <button
                    open-type="share"
                    style="border: none;height: auto;"
                    @tap="_shareDiv(true)"
                    v-else-if="list.leftTime > 0 && !friend && list.original_price != 0"
                    class="shareBtn copyy"
                >
                    {{language.bargainIng.share}}
                </button>
                <!-- #endif -->
                <!-- #ifndef MP-ALIPAY || MP-TOUTIAO || MP-BAIDU -->
                <div
                    v-else-if="list.leftTime > 0 && !friend && list.original_price != 0"
                    :data-clipboard-text="shareHref"
                    data-clipboard-action="copy"
                    class="shareBtn copyy"
                    @tap="_shareDiv(true)"
                >
                    {{language.bargainIng.share}}
                </div>
                <!-- #endif -->
                <div v-else-if="!friend && list.original_price == 0 && !list.hasorder && !order_id" class="shareBtn" @tap="goPay()">{{language.bargainIng.toPay}}</div>
                <div v-else-if="!friend && list.original_price == 0 && list.gopay == 1" class="shareBtn" @tap="go_order()">{{language.bargainIng.obligation}}</div>
                <div v-else-if="!friend && list.original_price == 0 && list.status == 2" class="shareBtn" @tap="go_order()">{{language.bargainIng.orderDetails}}</div>
                <div v-else-if="list.leftTime <= 0" class="shareBtn white">{{language.bargainIng.finished}}</div>
                <div v-else-if="list.leftTime > 0 && friend && list.original_price != 0" class="shareBtn" @tap="_helpBar()">{{language.bargainIng.helpFriend}}</div><!-- 帮好友砍 -->
                <div v-else-if="list.status == -1 && friend" class="shareBtn" @tap="goBr()">{{language.bargainIng.seeMore}}</div>
                <button
                    class="shareBtn white"
                    v-if="list.stock_num > 0 && friend"
                    @tap="goGoods(list.goods_id, list.attr_id, list.status, list.selforder_no, list.leftTime, list.bargain_id, list.selfhasorder,list.selfstatus)"
                >
                    {{language.bargainIng.meToo}}
                </button>
                <div class="bargainList">
                    <div class="allCenter brListTitle">{{language.bargainIng.bargainFor}}</div>
                    <ul v-if="helpListStatus">
                        <template v-for="(item, index) in help_list">
                            <li class="helpList" :key="index" v-if="help_num > 0">
                                <div class="helper allCenter">
                                    <img :src="item.headimgurl" />
                                    <span>{{ item.user_name }}</span>
                                </div>
                                <div class="helpBrPrice">
                                    {{language.bargainIng.cutDown}}
                                    <span style="color: #FF7D00;">{{ item.bargain_money }}</span>
                                    {{language.bargainIng.yuan}}
                                </div>
                            </li>
                        </template>
                    </ul>
                    <div v-if="helpListStatus" class="upDownList" @tap="_helpList(false)">
                        {{language.bargainIng.packUp}}
                        <img :src="upList" />
                    </div>
                    <div v-if="!helpListStatus" class="upDownList" @tap="_helpList(true)">
                        {{language.bargainIng.unfold}}
                        <img :src="upList" style="transform: rotate(180deg)" />
                    </div>
                </div>
            </div>
            
            <div class="mask" v-if="cogDiv && brPrice">
                <div class="maskContent">
                    <img v-if="celebrate" :src="celebrate" class="cogImg" />
                    <div class="maskText1" v-if="!friend">
                        {{language.bargainIng.beCutDown}}
                        <span style="color: #FF7D00;font-weight:bold;">{{ brPrice }}{{language.bargainIng.yuan}}</span>
                    </div>
                    <div class="maskText1" v-else>
                        {{language.bargainIng.cutFriend}}
                        <span style="color: #FF7D00;font-weight:bold;">{{ brPrice }}{{language.bargainIng.yuan}}</span>
                    </div>
                    <div class="maskText2" v-if="!friend" >{{language.bargainIng.shareFriend}}</div>
                   <!-- @tap="hideMask()" -->
                    <div class="maskBtn allCenter" :data-clipboard-text="shareHref" data-clipboard-action="copy"  @tap="_shareDiv(true,1)" >{{language.bargainIng.iSee}}</div>
                </div>
            </div>

            <!-- 分享弹框 -->
            <div class="mask h5-mask" @tap="_closeAllMask" v-if="shareH5Mask">
                <!-- 邀请链接的弹框 -->
                <div class="shareMask" @tap.stop>

                    <div class="sharepyq">
                        <div class="shareIcon" @tap="copyLink">
                            <img class="h5-img" :src="copy_link"/>
                            <!-- 二维码分享 -->
                            <p>{{ language.goods.goodsDet.Copy_link }}</p>
                        </div>
                        <div class="shareIcon" @tap="showSaveEWM()">
                            <img class="h5-img" :src="erm_img"/>
                            <!-- 二维码分享 -->
                            <p>{{ language.goods.goodsDet.QR }}</p>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                </div>
            </div>

            <div class="mask" v-if="shareDiv && hbStatus">
                <div class="shareEwm" v-if="hbStatus">
                    <img :src="ewm" class="imgEwm" />
                    <img :src="close" class="close" @tap="_closeAllMask" />
                    <view class="saveEWMBtn" @tap="saveImg()">
                        <!-- #ifdef H5 -->
                        {{ language.goods.goodsDet.hold_picture }}
                        <!-- #endif -->
                        <!-- #ifndef H5 -->
                        <img :src="saves" class="saves"/>
                        {{ language.goods.goodsDet.Save_picture }}
                        <!-- #endif -->
                    </view>
                </div>
            </div>

            <div class="mask" @tap="_shareDiv(false)" v-if="shareDiv && !hbStatus">
                <div class="allCenter yh-allCentermask">
                    <!-- #ifdef MP-WEIXIN -->
                    <div class="shareIcon" style="position: relative;padding-right:20%;">
                        <button class="share_btn" open-type="share">
                            <img :src="wx_img" />
                            <p style="margin-top: -26rpx;">{{language.bargainIng.weChatFriends}}</p>
                        </button>
                    </div>
                    <!-- #endif -->

                    <div style="width: 25%;text-align: center;" v-for="(item, index1) in shareWay" :key="index1" @tap="_invite(item.type)">
                        <div><img :src="item.imgUrl" alt="" style="width: 80rpx;height: 80rpx;" /></div>

                        <span style="font-size: 24rpx;color: #666666;">{{ item.name }}</span>
                    </div>
                </div>
            </div>

            <div class="mask" v-if="ruleDiv">
                <div class="maskContent">
                    <div style="height: 365px;overflow: auto;"><rich-text :nodes="details" style="font-size: 14px;"></rich-text></div>

                    <view class="closeDiv" @tap="_ruleDiv(false)">{{language.bargainIng.iKown}}</view>
                </div>
            </div>

            <div class="isLoseEfficacy" v-if="loseEfficacy"><img :src="loseEfficacyImg" /></div>
            <div class="isLoseEfficacy" v-else-if="list.status == -1"><img :src="loseImg" /></div>
            <input type="text" id="shareHref" :value="shareHref" />
        </toload>
    </div>
</template>
<script>
    import htmlParser from '@/common/html-parser.js';
    import {copyText} from "@/common/util";


    export default {
        data() {
            return {
                cat: uni.getStorageSync('endurl') + 'images/icon/catIcon.png',
                headsimg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/back2x.png',
                close: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/close_bb.png',
                saves: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/save.png',
                wx_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/wechat.png',
                logo: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/lktlogo.png',
                ewm: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/1553677239.png',
                barExp: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/barExp.png',
                loadGif: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/loading.gif',
                brHeadImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/brHeadImg.png',
                celebrate: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/celebrate.png',
                upList: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/upList.png',
                loseEfficacyImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/loseEfficacy@2x.png',
                loseImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/kj_lose.png',
                user_name: '',
                headimgurl: '',
                bargain_id: '',
                friendOver: false,
                a: '',
                self: '',
                helpListStatus: true,
                friend: false,
                ruleDiv: false,
                list: '',
                order_no: '',
                shareH5Mask: false,
                copy_link: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/copy_link.png',
                erm_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/ewmShare.png',
                orderNo: '',
                providerList: '',
                details: [],
                shareContent: '一起来用来客推吧！', //分享的内容
                shareHref: '',
                brPrice: '',
                hbStatus: false,
                shareDiv: false,
                title: '超值砍价',

                fastTap: true,
                load: false,
                cogDiv: false,
                proId: '',
                brStatus: '',
                attr_id: '',
                help_num: 0,
                help_list: [],
                islogin: true,
                order_id: '',
                shareWay: [
                    // #ifndef MP-WEIXIN
                    {
                        name: '微信',
                        imgUrl: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/wechat.png'
                    },
                    {
                        name: '朋友圈',
                        imgUrl: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/fdc.png'
                    },
                    // #endif
                    {
                        name: '二维码分享',
                        imgUrl: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/ewmIcon.png'
                    }
                ],
                loseEfficacy: false,
                pageFlag: false,
                _setTime1: ''
            };
        },
        onShow() {

            // if (this.pageFlag) {
            //     this._axios();
            // }
            this._axios();
            let shareWay = this.language.bargainIng.shareWay
            this.shareWay.filter((item,index)=>{
                item.type = item.name
                item.name = shareWay[index]
            })
            this.shareWay = this.shareWay
        },
        async onLoad(option) {
            this.setLang();
            this.shareContent = this.language.showModal.shareContent
            
            //#ifdef MP-WEIXIN
            let extConfig = uni.getExtConfigSync? uni.getExtConfigSync(): {}
            if (extConfig.url || extConfig.kefu_url) {
                this.$store.state.kefu_url = extConfig.kefu_url;
            }

            uni.showShareMenu({
                withShareTicket: true
            });

            this.isLogin(() => {});
            // #endif

            this.friend = option.friend;
            if (this.friend) {
                // #ifndef H5
                uni.setClipboardData({
                    data: ''
                });
                // #endif
            }
            uni.getProvider({
                service: 'share',
                success: e => {
                    let data = [];
                    for (let i = 0; i < e.provider.length; i++) {
                        switch (e.provider[i]) {
                            case 'weixin':
                                data.push({
                                    name: '分享到微信好友',
                                    id: 'weixin',
                                    sort: 0
                                });
                                data.push({
                                    name: '分享到微信朋友圈',
                                    id: 'weixin',
                                    type: 'WXSenceTimeline',
                                    sort: 1
                                });
                                break;
                            case 'sinaweibo':
                                data.push({
                                    name: '分享到新浪微博',
                                    id: 'sinaweibo',
                                    sort: 2
                                });
                                break;
                            case 'qq':
                                data.push({
                                    name: '分享到QQ',
                                    id: 'qq',
                                    sort: 3
                                });
                                break;
                            default:
                                break;
                        }
                    }
                    this.providerList = data.sort((x, y) => {
                        return x.sort - y.sort;
                    });
                },
                fail: e => {
                    console.log('获取登录通道失败', e);
                    uni.showModal({
                        content: this.language.showModal.loginNo,
						confirmText: this.language.showModal.confirm,
						cancelText: this.language.showModal.cancel,
                        showCancel: false
                    });
                }
            });
            this.proId = option.proId;
            this.attr_id = option.attr_id;
            this.brStatus = option.brStatus;
            this.order_no = option.order_no;
            this.orderNo = option.order_no;
            this.bargain_id = option.bargain_id;


            // await this._axios();
            // this._axios()
        },
        /**
         * 转发
         * */
        onShareAppMessage(res) {
            if (res.from === 'button') {
            }
            return {
                title: this.list.title,
                path:
                    '/pagesA/bargain/bargainIng?proId=' +
                    this.proId +
                    '&attr_id=' +
                    this.attr_id +
                    '&order_no=' +
                    this.order_no +
                    '&brStatus=' +
                    this.brStatus +
                    '&friend=true&bargain_id=' +
                    this.bargain_id,
                imageUrl: this.list.img,
                bgImgUrl: this.list.img,
                success(res) {
                    console.log('成功', res);
                }
            };
        },
        methods: {
            showSaveEWM () {
                let data = {
                    module: 'app',
                    action: 'getcode',
                    m: 'share',
                    order_no: this.order_no,
                    proId: this.proId,

                    // #ifdef MP-WEIXIN
                    store_type: 1,
                    // #endif
                    // #ifndef MP-WEIXIN
                    store_type: 0
                    // #endif
                }
                this.$req.post({data}).then(res => {
                    this.ewm = uni.getStorageSync('endurl') + res.data.imgUrl;
                    this.hbStatus = true;
                    this.shareDiv = true;
                    this.shareH5Mask = false;
                })
            },
            copyLink () {
                copyText('', this.shareHref);
                uni.showToast({
                    title: this.language.goods.goodsDet.copy_success,
                    duration: 1500,
                    icon: 'none'
                });
                this.shareH5Mask = false;
            },
            _back1() {
                this.outtime();
            },
            timeout() {
                this.outtime();
            },
            outtime() {
                uni.showToast({
                    title: this.language.bargainIng.noLogin,
                    icon: 'none',
                    duration: 1500
                })
                setTimeout(() => {
                    uni.navigateTo({
                        url: '/pages/login/login?landing_code=1'
                    });
                }, 1000);
            },
            go_order() {
                uni.navigateTo({
                    url: '../../pages/order/order?order_id=' + this.order_id + '&showPay=true'
                });
            },
            changeLoginStatus() {
                this._axios();
            },
            _back() {
                this.flag = false;
                if (this.friend) {
                    uni.switchTab({
                        url: '../../pages/tabBar/home'
                    });
                } else {
                    uni.navigateBack({
                        delta: 1
                    });
                }
            },
            _closeAllMask() {
                this.hbStatus = false;
                this.shareDiv = false;
                this.shareH5Mask = false;
            },
            goGoods(id, attr_id, status, order_no, leftTime, bargain_id, hasorder,selfstatus) {
                console.log('=---------------self---------------' + status);
                this.$store.state.pro_id = id;
                console.log(hasorder)
                if (hasorder == 1) {
                    uni.navigateTo({
                        url:
                            '../../pages/goods/goodsDetailed?&bargain=true&isbegin=1&brStatus=' +
                            selfstatus +
                            '&attr_id=' +
                            attr_id +
                            '&order_no=' +
                            order_no +
                            '&leftTime=' +
                            leftTime +
                            '&bargain_id=' +
                            bargain_id +
                            '&hasorder=' +
                            hasorder +
                            '&sNo_id=' +
                            this.order_id +
                            '&pro_id='+ id
                    });
                } else {
                    uni.navigateTo({
                        url:
                            '/pages/goods/goodsDetailed?&bargain=true&isbegin=1&brStatus=' +
                             selfstatus +
                            '&attr_id=' +
                            attr_id +
                            '&order_no=' +
                            order_no +
                            '&leftTime=' +
                            leftTime +
                            '&bargain_id=' +
                            bargain_id +
                            '&sNo_id=' +
                            this.order_id +
                            '&pro_id='+ id
                    });
                }

                this.pageFlag = true;
            },
            goPay() {
                var product = [];
                product.push({
                    pid: this.proId
                });
                product.push({
                    cid: this.attr_id
                });
                product.push({
                    num: 1
                });
                product.push({
                    bargain: true
                });
                product.push({
                    bargain_id: this.bargain_id
                });
                product.push({
                    order_no: this.order_no
                });
                product = JSON.stringify(product);
                uni.navigateTo({
                    url: '/pagesA/bargain/bargainDetailsr?product=' + product + '&bargain=true&bargain_id=' + this.bargain_id + '&order_no=' + this.order_no
                });
            },
            goBr() {
                uni.navigateTo({
                    url: 'bargain?topTabBar=true'
                });
            },
            _helpBar() {
                if (!this.islogin) {
                    this.isLogin(()=>{})
                }
                let data = {
                    module: 'app',
                    action: 'bargain',
                    goods_id: this.proId,
                    attr_id: this.attr_id,
                    order_no: this.orderNo,
                    m: 'helpbargain'
                }
                this.$req.post({data}).then(res => {
                    if (res.code == 200) {
                        res = res.data
                        this.friendOver = true;
                        this.cogDiv = true;
                        this.brPrice = res.randprice;
                        this.list.success_money = (parseFloat(this.list.success_money) + res.randprice).toFixed(2);
                        this.list.original_price = (parseFloat(this.list.original_price) - res.randprice).toFixed(2);
                        console.log('---------sele-------');
                        console.log(res);
                        this.help_list.push({
                            bargain_money: res.randprice,
                            headimgurl: res.headimgurl,
                            user_name: res.user_name
                        });
                    } else if (res.code == 404) {
                        this.isLogin(()=>{})
                    }
                })
            },
            _helpList(type) {
                this.helpListStatus = type;
            },
            _ruleDiv(type) {
                this.ruleDiv = type;
                if (!type) return false;

                let data = {
                    m: 'getRule',
                    action: 'bargain',
                    module: 'app'
                };
                this.$req.post({data}).then(res => {
                    if(res.data.rule!=''){
                        var content =
                            "<div style='padding-left:8px;padding-right:8px;'>" +
                            res.data.rule.replace(new RegExp('<view', 'gm'), '<p').replace(new RegExp('</view>', 'gm'), '</p>') +
                            '</div>';
                        var htmlString = content.replace(/\\/g, '').replace(/<img/g, '<img style="display:none;"');
                        htmlString = htmlString.replace("<div style='padding-left:8px;padding-right:8px;'>", '<div style="padding: 0 15px;">');
                        console.log(htmlString);
                        this.details = htmlParser(htmlString);
                    }else{
                        this.details = ''
                    }
                    
                })
            },
            saveImg() {
                // #ifdef H5
                return false
                // #endif
                
                let me = this;
                uni.downloadFile({
                    url: this.ewm,
                    success(res) {
                        let filePath = res.tempFilePath;
                        uni.saveImageToPhotosAlbum({
                            filePath: filePath,
                            success () {
                                uni.showToast({
                                    title: me.language.bargainIng.saveImgOk,
                                    duration: 1500,
                                    icon: 'none'
                                });
                                me.shareDiv = false;
                                me.hbStatus = false;
                            }
                        });
                    }
                });
            },
            _shareDiv(type,type2) {
                if(type2 && type2 != undefined) {
                    this.hideMask()
                }
                var url = uni.getStorageSync('h5_url');
                this.shareHref =
                    url +
                    'pagesA/bargain/bargainIng?proId=' +
                    this.proId +
                    '&attr_id=' +
                    this.attr_id +
                    '&order_no=' +
                    this.order_no +
                    '&brStatus=' +
                    this.brStatus +
                    '&friend=true&bargain_id=' +
                    this.bargain_id + '&isfx=true&fatherId=' + uni.getStorageSync('user_id');
                    console.log(this.shareHref);
                // #ifdef MP-ALIPAY || MP-TOUTIAO || MP-BAIDU
                return;
                // #endif
                // #ifdef H5
                if (type) {
                    this.shareH5Mask = true;
                }
                // #endif

                // #ifndef H5
                this.shareDiv = type;
                // #endif
            },
            hideMask() {
                this.cogDiv = false;
            },
            _invite(type) {
                if (!this.access_id) {
                    uni.navigateTo({
                        url: '/pages/login/login?landing_code=1'
                    });
                    return;
                } else {
                    let href =
                        uni.getStorageSync('h5_url') +
                        'pagesA/bargain/bargainIng?proId=' +
                        this.proId +
                        '&attr_id=' +
                        this.attr_id +
                        '&order_no=' +
                        this.order_no +
                        '&brStatus=' +
                        this.brStatus +
                        '&friend=true&bargain_id=' +
                        this.bargain_id;
                    if (type == '二维码分享') {
                        let data = {
                            module: 'app',
                            action: 'getcode',
                            m: 'share',
                            order_no: this.order_no,
                            proId: this.proId,

                            // #ifdef MP-WEIXIN
                            store_type: 1,
                            // #endif
                            // #ifndef MP-WEIXIN
                            store_type: 0
                            // #endif
                        }
                        this.$req.post({data}).then(res => {
                            this.ewm = uni.getStorageSync('endurl') + res.data.imgUrl;
                            this.hbStatus = true;
                            this.shareDiv = true;
                        })
                    } else if (type == '朋友圈') {
                        uni.share({
                            provider: 'weixin',
                            scene: 'WXSenceTimeline',
                            type: 0,
                            href: href,
                            title: this.list.title,
                            summary: this.shareContent,
                            imageUrl: this.list.img,
                            success: () => {
                                this.fastTap = true;
                                uni.showToast({
                                    title: this.language.bargainIng.shareOk,
                                    icon: 'none'
                                });
                            },
                            fail: () => {
                                this.fastTap = true;
                                uni.showToast({
                                    title: this.language.bargainIng.shareFail,
                                    icon: 'none'
                                });
                            }
                        });
                    } else if (type == '微信') {
                        uni.share({
                            provider: 'weixin',
                            scene: 'WXSceneSession',
                            type: 0,
                            href: href,
                            title: this.list.title,
                            summary: this.shareContent,
                            imageUrl: this.list.img,
                            success: () => {
                                this.fastTap = true;
                                uni.showToast({
                                    title: this.language.bargainIng.shareOk,
                                    icon: 'none'
                                });
                            },
                            fail: () => {
                                this.fastTap = true;
                                uni.showToast({
                                    title: this.language.bargainIng.shareFail,
                                    icon: 'none'
                                });
                            }
                        });
                    } else if (type == '复制链接') {
                        // #ifndef H5
                        uni.setClipboardData({
                            data: href,
                            success: () => {
                                uni.showToast({
                                    title: '复制成功',
                                    duration: 1500,
                                    icon: 'none'
                                });
                            }
                        });
                        // #endif
                        // #ifdef H5
                        let input = $('#shareHref input');
                        input.val(href);
                        input.select();
                        document.execCommand('Copy');
                        uni.showToast({
                            title: '复制成功',
                            duration: 1500,
                            icon: 'none'
                        });
                        // #endif
                    }
                }
            },
            async _axios() {
                clearTimeout(this._setTime1);
                var data = {

                    module: 'app',
                    action: 'bargain',
                    goods_id: this.proId,
                    attr_id: this.attr_id,
                    order_no: this.order_no,
                    bargain_id: this.bargain_id
                };
                if (this.friend) {
                    data.m = 'getgoodsdetail';
                    data.isHelp = 1;
                } else if (this.brStatus == 0) {
                    data.m = 'createbargain';
                } else {
                    data.m = 'getgoodsdetail';
                }

                let res = await this.$req.post({data})
                if (res.code == 200) {
                    res = res.data
                    await this.setTimeData(res.list);
                    this.brPrice = res.bargain_money;
                    this.help_list = res.help_list;

                    this.list = res.list;

                    if (!this.list.selfstatus && this.list.selfstatus != 0) {
                        console.log('--------------ssss--------' + this.list.selfstatus);
                        this.list.selfstatus = this.list.status;
                    }

                    this.loseEfficacy = res.loseEfficacy;
                    this.bargain_id = res.list.bargain_id;
                    if (this.brStatus != 0 && res.islogin == 0) {
                        this.islogin = false;
                    }

                    this.user_name = res.help_list[0].user_name;
                    this.headimgurl = res.help_list[0].headimgurl;

                    if (res.list.sNo_id) {
                        this.order_id = res.list.sNo_id;
                    }
                    if (this.brStatus == 0) {
                        this.bargain_id = res.list.bargain_id;
                        if (res.order_no && res.order_no != 'undefined') {
                            console.log('----------o1-------' + this.order_no);
                            this.order_no = res.order_no;
                        }
                    }
                    if(res.isMyShareLink == 1){ //判断是不是砍价本人进入的链接
                        this.friend = false
                    }
                    if (res.status == 500) {
                        if (res.message) {
                            uni.showToast({
                                title: res.message,
                                icon: 'none'
                            });
                        }
                        this.cogDiv = false;
                    } else {
                        this.cogDiv = true;
                    }
                    this.self = res.self;
                    if (this.friend) {
                        if (res.status == 500) {
                            this.friendOver = true;
                            this.cogDiv = false;
                        }
                    }
                } else if (res.code == 404) {
                    this.brPrice = res.bargain_money;
                    this.help_list = res.help_list;
                    console.log('status======================404');
                    console.log(res);
                    this.list = res.list;
                    this.setTimeData(res.list);
                    this.loseEfficacy = res.loseEfficacy;
                    console.log('404end');
                    if (!res.help_list) {
                        this.islogin = false;
                        this.isLogin(()=>{})
                    } else {
                        this.self = res.help_list[0];
                        this.user_name = res.help_list[0].user_name;
                        this.headimgurl = res.help_list[0].headimgurl;
                    }
                } else {
                    uni.showToast({
                        title: res.message,
                        icon: 'none'
                    });
                }
                console.log(this.brPrice + '-----弹窗！-------' + this.cogDiv);
                this.help_num = this.help_list.length;
            },
            async setTimeData(data) {
                var self = this;
                var groupList = data;
                try {
                    groupList.leftTime;
                } catch (e) {
                    return false;
                }

                var t = groupList.leftTime - 1;
                var d = Math.floor(t / 60 / 60 / 24);
                var h = Math.floor(t / 3600 - d * 24);
                var m = Math.floor((t - h * 60 * 60 - d * 24 * 60 * 60) / 60);

                var s = t % 60;
                if (h < 10) h = '0' + h;
                if (m < 10) m = '0' + m;
                if (s < 10) s = '0' + s;

                groupList.hour = h;
                groupList.mniuate = m;
                groupList.second = s;
                groupList.day = d;

                if (groupList.leftTime <= 0) {
                    groupList.hour = '00';
                    groupList.mniuate = '00';
                    groupList.second = '00';
                    groupList.day = '';
                }

                self.list = groupList;
                clearTimeout(self._setTime1);
                self._setTime1 = setTimeout(() => {
                    try {
                        groupList.leftTime;
                    } catch (e) {
                        return false;
                    }

                    var t = --groupList.leftTime;
                    var d = Math.floor(t / 60 / 60 / 24);
                    var h = Math.floor(t / 3600 - d * 24);
                    var m = Math.floor((t - h * 60 * 60 - d * 24 * 60 * 60) / 60);

                    var s = t % 60;
                    if (h < 10) h = '0' + h;
                    if (m < 10) m = '0' + m;
                    if (s < 10) s = '0' + s;

                    groupList.hour = h;
                    groupList.mniuate = m;
                    groupList.second = s;
                    groupList.day = d;

                    if (groupList.leftTime <= 0) {
                        groupList.hour = '00';
                        groupList.mniuate = '00';
                        groupList.second = '00';
                        groupList.day = '';
                    }
                    self.list = groupList;
                    self.setTimeData(data);
                }, 1000);
            }
        },
        computed: {
            width1() {
                this.a = (this.list.success_money / this.list.free_money) * 100;
                return this.a + '%';
            }
        }
    };
</script>

<style scoped lang="less">
    @import url('../../static/css/bargain/bargainIng.less');
</style>
