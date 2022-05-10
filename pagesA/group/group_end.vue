<template>
    <div :style='{"overflow":overflow}'>
        <div>

            <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>

            <heads v-if='friend' :title='language.group_end.title' returnR='6'></heads>
            <heads v-else :title='language.group_end.title'></heads>

            <ul class="group" v-if="groupmsg.ptstatus!=2">
                <li @tap="_navigateTo('groupDetailed?pro_id=' + groupmsg.ptgoods_id + '&activity_no=' + groupmsg.activity_no + '&platform_activities_id=' + groupmsg.platform_activities_id,'todetail')">
                    <img :src="groupmsg.img">
                    <div class="group_div">
                        <div class="group_title list_break2">{{groupmsg.p_name}}</div>
                        <div class="group_people">{{groupmsg.groupman}}{{language.group_end.peopleGroup}}</div>
                        <div class="group_num">{{language.group_end.haveGroup}}{{groupmsg.sum}}{{language.group_end.unit}}</div>
                        <div class="group_money list_break1"><span>￥{{price}}</span><span>￥{{groupmsg.price}}</span>
                        </div>
                    </div>
                </li>
            </ul>

            <div class="group_end yh-group-end" v-if="groupmsg.ptstatus==1 && groupmsg.leftTime > 1">{{language.group_end.less}}<span>{{groupmsg.groupman-groupmsg.ptnumber}}</span>{{language.group_end.peopleSuccse}}<span>{{timeStr}}</span>{{language.group_end.endAfter}}
            </div>

            <!-- groupmsg.ptstatus==2：拼团成功 -->
            <div class="group_end gsuccess yh-gsuccess" v-else-if="groupmsg.ptstatus==2">
                <img class="class_gou_img" :src="success_gou_img">
                <view class="success_word">
                    {{language.group_end.groupSuccess}}
                </view>
            </div>

            <div class="group_end gfail yh-gfail" v-else-if="groupmsg.ptstatus==10||groupmsg.ptstatus==11">
                {{language.group_end.groupFail}}
            </div>

            <div :class="[groupMember.length>4?'can_roll':'']">

                <ul class="group_u" :class="[groupMember.length>4?'flex_start':'']">
                    <li v-for="(item,keys) in groupMember" :key="keys">
                        <img style="width: 40px;height: 40px;" :class="item.headimgurl?'active':''" :src="item.headimgurl" v-if="item.headimgurl" mode="" />
                        <img v-else style="width: 40px;height: 40px;" :src="v3pro_pt" mode="" />
                        <!-- <img :class="item.headimgurl?'active':''" :src="item.headimgurl"> -->
                        <div class="group_u_name" v-if="keys==0"><span>{{language.group_end.captain}}</span></div>
                        <!-- <img src="http://v3pro.houjiemeishi.com/images/icon1/v3pro_pt.png" mode="" /> -->
                        <!-- <view class="wenhao_css" v-if="item.headimgurl"></view> -->
                        <!-- <img v-else src="http://v3pro.houjiemeishi.com/images/icon1/v3pro_pt.png" mode="" /> -->
                       <!-- <view class="wenhao_css yh-wenhao-css" v-else>
                            ？
                        </view> -->

                    </li>
                </ul>

            </div>
            <!-- #ifdef MP-WEIXIN -->
            <button class="wxshareIcon" v-if="groupmsg.isSelf&&groupmsg.ptstatus==1" @tap="showShareMask">
                {{language.group_end.inviteFriends}}
            </button>
            <!-- #endif -->

            <!-- #ifdef MP-ALIPAY || MP-TOUTIAO  || MP-BAIDU -->
            <button class="wxshareIcon" open-type="share" v-if="groupmsg.isSelf&&groupmsg.ptstatus==1">{{language.group_end.inviteFriends}}</button>
            <!-- #endif -->

            <!-- #ifndef MP-WEIXIN || MP-ALIPAY || MP-TOUTIAO  || MP-BAIDU -->
            <div class="group_btns" v-if="groupmsg.isSelf&&groupmsg.ptstatus==1&&groupmsg.leftTime>0"
                 @tap="showShareMask" 
                 :data-clipboard-text='shareHref'><span>{{language.group_end.inviteFriends}}</span></div>
            <!-- #endif -->

            <!-- 拼团成功 -->
            <view class="yh-ptcg" v-if="groupmsg.ptstatus == 2">

                <view class="yh-line"></view>

                <div class="group_wf_t yh-group-wf-t" @tap="_toDetail()">
                    <div class="pro_name">

                        <text class="yh-p-title">{{language.group_end.productName}}</text>
                        <text class="yh-p-name">{{groupmsg.p_name}}</text>

                    </div>

                    <div class="group_gz"></div>
                    <img class='arrow' :src="you_img"/>
                </div>
                <div class="group_wf_t yh-group-wf-y">
                    <div class="pro_name">
                        <text class="yh-p-title">{{language.group_end.amount}}</text>
                        <text class="yh-p-name">{{price}}</text>
                    </div>
                </div>

            </view>

            <div class="group_btns yh-group-btns-q"
                 v-if="(groupmsg.isSelf&&(groupmsg.ptstatus==2||groupmsg.ptstatus==3)) || groupmsg.ptstatus == 2 || is_end"
                 @tap="_toDetail()"><span>{{is_end?language.group_end.groupAgain:language.group_end.groupAgain1}}</span></div>

           <!-- <div class="group_btns yh-group-btns-w" v-if="groupmsg.isSelf&&groupmsg.ptstatus==2"
                 @tap="_toOrderDetail()"><span class="outBtn">{{language.group_end.checkOrder}}</span></div> -->

            <div class="group_btns" v-if="!groupmsg.isSelf && groupmsg.ptstatus!=2 && groupmsg.leftTime > 0"
                 @tap="_buy"><span>{{language.group_end.tuxedo}}</span></div>

            <div class="group_peo" v-if="groupmsg.isSelf&&groupmsg.ptstatus==3&&groupList.length">

                <div class="group_people_t yh-group-people-t">{{language.group_end.joinAnother}}</div>

                <ul>
                    <li v-for="(item,index) in groupList" :key='index'>
                        <div class="group_peo_l">
                            <img :src="item.headimgurl">
                            <div class="group_l_r">
                                <p>{{item.user_name}}</p>
                                <p>{{item.groupman}}{{language.group_end.peopleGroup}}</p>
                            </div>
                        </div>
                        <div class="group_peo_r">
                            <div class="group_r_l">
                                <p>{{language.group_end.less}}<span>{{item.groupman-item.ptnumber}}</span>{{language.group_end.peopleGroups}}</p>
                                <p>{{language.group_end.remaining}}<span>{{item.leftTimeStr}}</span></p>
                            </div>

                            <div class="yh-ct-title" @tap="_gocantuan(item.sNo)"><span
                                style='color: #FFF9ED;'>{{language.group_end.goTuxedo}}</span></div>
                        </div>
                        <div style="clear: both;"></div>
                    </li>
                </ul>

            </div>

            <div class="group_wf" v-if="groupmsg.ptstatus!=2">

                <div class="group_wf_t yh-group-wf-r">
                    <div class="yh-pt-ptwf">{{language.group_end.groupPlay}}</div>

                    <div class="group_gz" @tap="showrule()">
                        <span class="yh-pt-ptgz">{{language.group_end.rules}}</span>
                    </div>

                    <img class='arrow' :src="gdOuterImg"/>
                </div>

                <ul>
                    <li :style="list_bg1">
                        <view class="buzhou_num">1</view>
                        <p>{{language.group_end.clickOpen}}</p>
                        <p>{{language.group_end.orTuxedo}}</p>
                        <img class='arrow' :src="you_img"/>
                    </li>
                    <li :style="list_bg2">
                        <view class="buzhou_num">2</view>
                        <p>{{language.group_end.invitation}}</p>
                        <p>{{language.group_end.friendInGroup}}</p>
                        <img class='arrow' :src="you_img"/>
                    </li>
                    <li :style="list_bg3">
                        <view class="buzhou_num">3</view>
                        <p>{{language.group_end.achieve}}</p>
                        <p>{{language.group_end.spellGroup}}</p>
                        <img class='arrow' :src="you_img"/>
                    </li>
                    <li :style="list_bg4">
                        <view class="buzhou_num">4</view>
                        <p>{{language.group_end.group_success}}</p>
                        <p>{{language.group_end.waitDelivery}}</p>
                    </li>
                </ul>
            </div>

            <!--  遮罩      -->
            <div class='mask' v-if='mask_display'>
                <div class="mask_d" :class='mask_display1?"goodAnimate1":(mask_display?"goodAnimate":"")'>
                    <div class='mask_guige'>
                        <div class='mask_one'>
                            <div>
                                <img class="shangp" :src="imgurl"/>
                            </div>
                            <div class='mask_pric'>
                                <p class='red'>￥<span> {{price}}</span></p>
                                <p style="font-size: 12px;color: rgb(153, 153, 153);">{{language.group_end.inventory}}{{num}}</p>
                            </div>
                            <img class="cha" :src="guan_img" @tap="_mask_f()"/>
                        </div>
                        <div class="mask_over">
                            <div class='mask_two' v-for='(item,indx) in attrList' :key='indx'>
                                <p>{{item.attrName}}</p>
                                <ul v-if="num==0">
                                    <li v-for='(items,index) in item.attr' :key='index' @tap='showState(index,indx)'>
                                        {{items.attributeValue}}
                                    </li>
                                </ul>
                                <ul v-else>
                                    <li v-for='(items,index) in item.attr' :key='index'
                                        :class="[items.enable ? (items.select ? 'orange':'select') : 'back']"
                                        @tap='showState(index,indx)'>{{items.attributeValue}}
                                    </li>
                                </ul>
                            </div>
                            <div class='mask_two'>
                                <p>{{language.group_end.spellGroup}}</p>
                                <ul>
                                    <li class="orange">{{groupmsg.groupman}} {{language.group_end.peopleGroup}}</li>
                                </ul>
                            </div>
                            <div class='mask_num'>
                                <p>{{language.group_end.quantity}}</p>
                                <div class='numb'>
                                    <img :src="numb==1?jian_hui:jian_hei" @tap="_reduce"/>
                                    <i>{{numb}}</i>
                                    <img :src='numb<num?jia_hei:jia_hui' @tap="_add"/>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div style="height: 98rpx;">
                        <div class='mask_quren' @tap="_confirm">{{language.group_end.confirm}}</div>
                    </div>
                </div>
            </div>

            <!-- 分享弹框 -->
            <div class="mask" @tap="_closeAllMask" v-if="shareH5Mask">
                <!-- 邀请链接的弹框 -->
                <div class="shareMask" @tap.stop>

                    <div class="sharepyq">
                        <div class="shareIcon" @tap="copyLink">
                            <img class="h5-img" :src="copy_link"/>
                            <!-- 二维码分享 -->
                            <p>{{ language.goods.goodsDet.Copy_link }}</p>
                        </div>
                        <div class="shareIcon" @tap="showSaveEWM('wx')">
                            <img class="h5-img" :src="erm_img"/>
                            <!-- 二维码分享 -->
                            <p>{{ language.goods.goodsDet.QR }}</p>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                </div>
            </div>

            <div class="mask yh-mask" v-if="shareMask" @tap="_closeAllMask">
                <div class="shareMask yh-shareMask" v-if="saveEWM" @tap.stop>

                    <img :src="guan_img" class='cha yh-cha' @tap="closeShareMask()">

                    <div class="right yh-right">
                        <image :src="ewmImg" class="yh-ewmImg" mode="aspectFit" />
                    </div>

                    <div class="clearfix"></div>

                    <button type="button" class="saveEWMBtn yh-saveEWMBtn-q" @tap="_downEWM()">
                        <!-- #ifdef H5 -->
                        {{ language.goods.goodsDet.hold_picture }}
                        <!-- #endif -->
                        <!-- #ifndef H5 -->
                        <img :src="saves" class="saves"/>
                        {{ language.goods.goodsDet.Save_picture }}
                        <!-- #endif -->
                    </button>
                </div>

                <div class="allCenter yh-allCenter" v-else="saveEWM" @tap.stop>
                    <!-- <div style="width: 58%;margin: 0 auto;display: flex;"> -->

                    <!-- #ifdef APP-PLUS-->
                    <div class="shareIcon" @tap="_showPerson()">
                        <img :src="wx_img"/>
                        <p>{{language.group_end.weChat}}</p>
                    </div>

                    <div class="shareIcon" @tap="_shareShow()">
                        <img :src="wx_person"/>
                        <p>{{language.group_end.weChatMoments}}</p>
                    </div>

                    <div class="shareIcon" @tap="showSaveEWM('app')">
                        <img :src="wx_ewmfxt"/>
                        <p>{{language.group_end.qrCode}}</p>
                    </div>
                    <!-- #endif -->

                    <!-- #ifdef MP-WEIXIN -->
                    <div class="shareIcon yh-shareIcon">
                        <button class="share_btn" open-type="share">
                            <img :src="wx_img"/>
                            <p style='margin-top: -38rpx;margin-bottom: 0 !important;'>{{language.group_end.weChatFriends}}</p>
                        </button>
                    </div>
                    <!-- <div class="shareIcon" @tap="_shareShow()">
                        <img :src="wx_person" />
                        <p>朋友圈</p>
                    </div> -->
                    <div class="shareIcon" @tap="showSaveEWM('wx')">
                        <img :src="wx_ewmfxt"/>
                        <p style="margin-bottom: 0 !important;">{{language.group_end.qrCode}}</p>
                    </div>
                    <!-- #endif -->

                    <!-- #ifdef MP-ALIPAY -->
                    <div class="shareIcon yh-shareIcon">
                        <button class="share_btn" open-type="share" style="border: none;">
                            <img :src="wx_img"/>
                            <p style='margin-top: -56rpx;'>{{language.group_end.weChatFriends}}</p>
                        </button>
                    </div>
                    <div class="shareIcon" @tap="showSaveEWM('ali')">
                        <img :src="wx_ewmfxt"/>
                        <p style="margin-bottom: 0;">{{language.group_end.qrCode}}</p>
                    </div>
                    <!-- #endif -->
                    <div class="clearfix"></div>
                    <!-- </div> -->
                </div>
            </div>

        </div>

        <div class="isLoseEfficacy" v-if="!isshow">
            <img :src="loseEfficacyImg" alt="">
        </div>

        <div class="isload load yh-s-load" v-if="isload">
            <div>
                <img :src="loadImg"/>
                <p>{{language.group_end.load}}…</p>
            </div>
        </div>

        <!-- #ifdef MP-ALIPAY -->
        <view id="rule-box" v-if="show_rule" class="yh-rule">
            <view class='content_d yh-rule-content' id='content_d'>
                <div class="yh-rule-div">{{language.group_end.rules}}</div>
                <scroll-view scroll-y class="yh-rule-s">
                    <!-- <wxParse v-if="rule != ''" :content="rule"></wxParse> -->
                    <rich-text class="richtext" :nodes="contentNodes" style="font-size: 14px;"></rich-text>

                </scroll-view>
                <view @tap="closerule()" class="yh-closerule">{{language.group_end.iSee}}</view>
            </view>
        </view>
        <!-- #endif -->

        <!-- #ifndef MP-ALIPAY -->
        <div id="rule-box" v-if="show_rule" class="yh-show-rule">
            <div class='content_d yh-show-rule-content' id='content_d'>
                <div class="yh-show-rule-ptgz">{{language.group_end.rules}}</div>
                <scroll-view scroll-y class="yh-show-rule-div">
                    <wxParse v-if="rule != ''" :content="rule"></wxParse>
                </scroll-view>
                <div @tap="closerule()" class="yh-show-rule-closerule">{{language.group_end.iSee}}</div>
            </div>
        </div>
        <!-- #endif -->

    </div>
</template>

<script>
    import wxParse from '../../components/mpvue-wxparse/src/wxParse.vue'
    import htmlParser from '../../common/html-parser.js'
    // #ifdef H5
    import Clipboard from '../../common/clipboard';
    import {copyText} from "@/common/util";
    // #endif

    export default {
        data () {
            return {
                gdOuterImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/gd_outer.png',
                overflow: 'scroll',
                mask_display1: false,
                fastTap: true,
                list_bg1: '',
                list_bg2: '',
                list_bg3: '',
                list_bg4: '',
                is_end: false,//拼团是否结束 true 结束 false 未结束
                title: '一起拼团',
                
                ptcode: '', //拼团号
                img: '',
                attr__: '',
                isload: '',
                login: '', //是否登录
                data_: '',
                saves: '',
                groupmsg: '',
                attrList: '',
                skuBeanList: '',
                groupList: '',
                load: true,
                timeStr: '',
                groupMember: [],
                shareMask: false,
                saveEWM: false,
                shares: {},
                show_rule: false,//是否显示规则
                rule: '',
                shareContent: '一起来用来客推吧！', //分享的内容
                shareHref: '', //分享的链接
                sharehrefTitle: '一起来用来客推吧1', //分享的链接的标题
                sharehrefDes: '一起来用来客推吧2', //分享的链接的描述
                ewmImg: '',
                mask_display: false,
                num: '', //规格数量
                price: '', //规格价格
                imgurl: '', //规格图片
                numb: 1, //规格选择的数量
                haveSkuBean: '', //选择规则属性
                goodscode: '',
                head: true, //头部切换
                clickFlag: false,
                loseEfficacyImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/loseEfficacy2x.png',
                isshow: true,
                returnR: '',
                otype: '',
                status_pt:'',
                friend: false,
                a_type: '',
                isonload: 0,
                user_can_open: '',
                user_can_can: '',
                group_again_by: '',//是否开启再次参团
                inter: '',//倒计时对象
                activity_no: '',//拼团活动编号
                list_bg_pic: 'background-image: url(' + this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/bj.png)',
                success_gou_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/xuanzehei2x.png',
                shopImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/shopping_l2x.png',
                you_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jiantou2x.png',
                noImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/icon-no.png',
                guan_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/guanbi2x.png',
                jian_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jian2x.png',
                jian_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jianhui2x.png',
                loadImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/loading.gif',
                jia_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jia+2x.png',
                jia_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/add+2x.png',
                wx_person: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/fdc.png',
                wx_ewmfxt: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/ewmShare.png',
                wx_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/wechat.png',
                erm_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/ewmShare.png',
                back1: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/back2x.png',
                copy_link: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/copy_link.png',
                v3pro_pt: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/v3pro_pt.png',
                shareH5Mask: false,
            }
        },
        onLoad (option) {
            if (option.a_type == 1) {
                this.a_type = 1;
            }
            
            var me = this
            me.LaiKeTuiCommon.getLKTApiUrl().then(function () {
                me.mask_display = false
                me.returnR = option.returnR
                me.otype = option.otype
                me.sNo = option.sNo
                me.friend = option.friend
                me.activity_no = option.activity_no
                me.status_pt = option.status
                me._axios()
            })
            

        },
        onShow () {
            var me = this

            me.mask_display = false
            me.isload = true

            if (me.isonload == 0) {
                me.isonload = 1
            } else {
                
                me._axios()
            }
        },
        /**
         * 转发
         * */
        onShareAppMessage: function (res) {

            if (res.from === 'button') {

            }
            
            let url = ''
            if(this.a_type==1){
                url = '/pagesA/group/group_end?sNo=' + this.sNo + '&activity_no=' + me.activity_no + '&friend=true&isfx=true&cc=1&a_type=1'
            }else{
                url = '/pagesA/group/group_end?sNo=' + this.sNo + '&activity_no=' + me.activity_no + '&friend=true&isfx=true&cc=1'
            }
            
            return {
                title: this.groupmsg.p_name,
                path: url,
                imageUrl: this.groupmsg.img
            }
        },
        methods: {
            /**
             *
             * */
            changeLoginStatus () {
                this._axios()
            },
            /**
             * 自定义页面跳转方法
             * */
            gotoHomePage () {
                var me = this
                if (me.clickFlag) {
                    return
                } else {
                    me.clickFlag = true
                }
                let url = ''
                if(me.a_type==1){
                    url = './groupDetailed?pro_id=' + me.groupmsg.ptgoods_id + '&activity_no=' + this.activity_no + '&a_type=1'
                }else{
                    url = './groupDetailed?pro_id=' + me.groupmsg.ptgoods_id + '&activity_no=' + this.activity_no
                }
                uni.navigateTo({
                    url: url
                })
            },
            /**
             * 取数据
             * */
            _axios () {
                var me = this
                
                let action = 'groupbuy';
                if (this.a_type) {
                    action = 'pthd_groupbuy'
                }
                
                var data = {
                    module: 'app',
                    action: action,
                    m: 'cangroup',
                    oid: this.sNo,
                    
                }
                if(me.status_pt == 1 || me.status_pt == 2 || me.status_pt == 5 || me.status_pt==7){
                    data.m = 'group_success_detail'
                }else{
                    data.m = "group_other_detail"
                }
                this.$req.post({data}).then(res => {
                    if (res.code == 404) {
                        this.isLogin(()=>{})
                        return
                    }
                    res = res.data
                    me.attrList = res.attrList
                    me.skuBeanList = res.skuBeanList
                    me.groupList = res.groupList
                    me.groupmsg = res.groupmsg
                    if (me.groupmsg.activity_no) {
                        me.activity_no = me.groupmsg.activity_no
                    }
                    
                    me.user_can_can = res.user_can_can
                    me.user_can_open = res.user_can_open
                    me.group_again_by = res.group_again_by
                    me.rule = res.rule

                    me.content = '<div style=\'padding-left:8px;padding-right:8px;\'>' + me.rule.replace(new RegExp('<view', 'gm'), '<p').replace(new RegExp('</view>', 'gm'), '</p>') + '</div>'
                    var htmlString = me.content.replace(/\\/g, '').replace(/<img/g, '<img style="display:none;"')
                    htmlString = htmlString.replace('<div style=\'padding-left:8px;padding-right:8px;\'>', '<div style="padding: 0 15px;">')

                    console.log(htmlString)
                    me.contentNodes = htmlParser(htmlString)
                    console.log()
                    console.log(me.groupmsg.leftTime)
                    if (Number(me.groupmsg.leftTime) > 0) {
                        console.log('>0')
                        me.is_end = false
                    } else {
                        me.is_end = true
                    }

                    console.log('====================is_end')
                    console.log(me.is_end)

                    me.imgurl = me.groupmsg.img
                    me.num = me.groupmsg.p_num
                    me.login = res.islogin
                    console.log('login')
                    console.log(me.login)
                    me.ptcode = res.ptcode
                    me.goodscode = res.goodscode
                    var pricee = me.groupmsg.price
                    for (var i = 0; i < me.attrList[0].attr.length; i++) {
                        console.log('2222---')
                        console.log(me.attrList[0].attr[i].enable)
                        if (me.attrList[0].attr[i].enable && me.attrList[0].attr[i].select) {
                            pricee = me.attrList[0].attr[i].price
                        }
                    }
                    me.price = me._money(pricee, me.groupmsg.zekou)
                    console.log('price')
                    console.log(me.price)
                    me.load = false
                    console.log('返回的结果')
                    console.log(res)
                    console.log(me.goodscode)
                    me.orderNo = res.groupmsg.id
                    me.orderStatus = res.groupmsg.status
                    if (res.isshow == 1) {
                        me.isshow = true
                    } else {
                        me.isshow = false
                    }
                    console.log('show')
                    console.log(me.isshow)
                    //me.loseEfficacyImg = res.loseEfficacyImg
                    if (me.groupList.length) {
                        me.setTimeList(me.groupList)
                    }

                    clearInterval(me.inter)
                    me.setTimeData(me.groupmsg.leftTime)
                    var groupMember = []
                    for (var i = me.groupmsg.groupman - 1; i >= 0; i--) {
                        if (res.groupMember[i]) {
                            groupMember[i] = res.groupMember[i]
                        } else {
                            groupMember[i] = {}
                        }
                    }
                    me.groupMember = groupMember
                    me._spec()
                    me.attr__ = me.attr_ = res.attrList[0].attr
                    me.data_ = res
                    me.isload = false
                    me.price = res.pay_price
                    
                    if(!me.groupmsg.isSelf && me.groupmsg.ptstatus!=2 && me.groupmsg.leftTime > 0){
                        me.price = res.min_price
                    } 
                    
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
                            } else {
                                me.market_price = me.market_price2 = me.attr_[i].price
                            }
                        }
                    }

                    if(me.a_type==1){
                        me.shareHref = uni.getStorageSync('h5_url') + 'pagesA/group/group_end?sNo=' + me.sNo + '&activity_no=' + me.activity_no + '&friend=true&isfx=true&cc=1&a_type=1' + '&isfx=true&fatherId=' + uni.getStorageSync('user_id')
                    }else{
                        me.shareHref = uni.getStorageSync('h5_url') + 'pagesA/group/group_end?sNo=' + me.sNo + '&activity_no=' + me.activity_no + '&friend=true&isfx=true&cc=1' + '&isfx=true&fatherId=' + uni.getStorageSync('user_id')
                    }
                })
            },
            /**
             *
             * */
            _money (prices, zekou) {
                prices = (zekou * prices) / 100
                return prices.toFixed(2)
            },
            /**
             *
             * */
            setTimeData (time) {
                var me = this
                console.log(time)

                me.inter = setInterval(function () {
                    if (time <= 0) {
                        clearInterval(me.inter)
                        me.timeStr = '00:00:00'
                        return false
                    }
                    var t = --time
                    var h = Math.floor(t / 60 / 60)
                    var m = Math.floor((t - h * 60 * 60) / 60)
                    var s = t % 60
                    if (h < 10) h = '0' + h
                    if (m < 10) m = '0' + m
                    if (s < 10) s = '0' + s
                    me.timeStr = h + ':' + m + ':' + s
                }, 1000)

            },
            /**
             *
             * */
            setTimeList (data) {
                var self = this
                var groupList = data
                setInterval(function () {
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
                        }
                    }

                    self.groupList = groupList
                }, 1000)
            },
            /**
             *
             * */
            _downEWM () {
                // #ifdef H5
                return false
                // #endif
                let me = this
                console.log('需要保存到本地的图片地址：' + me.ewmImg_url)
                uni.downloadFile({
                    url: me.ewmImg_url,
                    success: function (sres) {
                        console.log(sres.tempFilePath)
                        // #ifdef MP-ALIPAY
                        my.saveImage({
                            url: sres.tempFilePath,
                            success: () => {
                                uni.showToast({
                                    title: me.language.group_end.saveImgOk,
                                    duration: 1500,
                                    icon: 'none'
                                })
                            },
                        })
                        return false
                        // #endif
                        uni.saveImageToPhotosAlbum({
                            filePath: sres.tempFilePath,
                            success: function () {
                                uni.showToast({
                                    title: me.language.group_end.saveImgOk,
                                    duration: 1500,
                                    icon: 'none'
                                })
                            },
                            fail: function () {
                                uni.showToast({
                                    title: me.language.group_end.saveImgFail,
                                    duration: 1500,
                                    icon: 'none'
                                })
                            },
                        })
                    },
                    fail: function () {
                        uni.showToast({
                            title: me.language.group_end.saveImgFail,
                            duration: 1500,
                            icon: 'none'
                        })
                    },
                })
            },
            /**
             * 分享到微信朋友圈
             * */
            _shareShow () {
                let me = this
                let groupmsg = me.groupmsg

                let href = uni.getStorageSync('h5_url') + 'pagesA/group/group_end?sNo=' + me.sNo +
                    '&activity_no=' + me.activity_no + '&friend=true&isfx=true&cc=2'
                
                if (this.a_type == 1) {
                    href += '&a_type=1'
                }
                
                uni.share({
                    provider: 'weixin',
                    scene: 'WXSenceTimeline',
                    type: 0,
                    href: href,
                    title: groupmsg.p_name,
                    summary: '',
                    imageUrl: groupmsg.img,
                    success: function (res) {
                        console.log('success:' + JSON.stringify(res))
                    },
                    fail: function (err) {
                        console.log('fail:' + JSON.stringify(err))
                    }
                })
            },
            /**
             * 分享给微信好友
             * */
            _showPerson () {

                let me = this
                let groupmsg = me.groupmsg
                let pram = ''
                if(this.a_type==1){
                    pram = 'a_type=1'
                }else{
                    pram = ''
                }
                
                uni.share({
                    provider: 'weixin',
                    scene: 'WXSceneSession',
                    type: 0,
                    href: uni.getStorageSync('h5_url') + 'pagesA/group/group_end?sNo=' + me.sNo +
                        '&activity_no=' + me.activity_no + '&friend=true&isfx=true&cc=3&'+pram,
                    title: groupmsg.p_name,
                    summary: '',
                    imageUrl: groupmsg.img,
                    success: function (res) {
                        console.log('success:' + JSON.stringify(res))
                    },
                    fail: function (err) {
                        console.log('fail:' + JSON.stringify(err))
                    }
                })
            },
            /**
             *
             * */
            showShareMask () {
                var me = this
                console.log('__________activity_no')
                console.log(me.activity_no)
                // #ifdef H5
				if(this.a_type==1){
					 this.shareHref = uni.getStorageSync('h5_url') + 'pagesA/group/group_end?sNo=' + me.sNo + '&activity_no=' + me.activity_no + '&friend=true&isfx=true&cc=1&a_type=1' + '&isfx=true&fatherId=' + uni.getStorageSync('user_id')
				}else{
					 this.shareHref = uni.getStorageSync('h5_url') + 'pagesA/group/group_end?sNo=' + me.sNo + '&activity_no=' + me.activity_no + '&friend=true&isfx=true&cc=1' + '&isfx=true&fatherId=' + uni.getStorageSync('user_id')
				}
               
                // #endif
                
				this.isLogin(()=>{
					// #ifdef H5
                    this.shareH5Mask = true
					// #endif
					// -sel H5
					// #ifndef H5
					me.shareMask = true
					// #endif
				})
            },
            /**
             *
             * */
            closeShareMask () {
                this.saveEWM = false
                this.shareMask = false
                this.overflow = 'scroll'
            },
            /**
             *
             * */
            _closeAllMask () {
                this.shareMask = false
                this.saveEWM = false
                this.overflow = 'scroll'
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
            /**
             *
             * */
            showSaveEWM (string) {
                var me = this
                this.shareH5Mask = false
                
                
                var data = {
                    module: 'app',
                    action: 'getcode',
                    m: 'share',
                    proId: this.groupmsg.ptgoods_id,
                    type: 'pt_end',
                    sNo: me.sNo,
                    activity_no: me.activity_no || me.groupmsg.activity_no,
                    friend: 'true',
                    
                }
                
                if(me.a_type==1){
                    data.type = 'pp_end'
                }
                
                this.$req.post({data}).then(res => {
                    if (res.code == 200) {
                        me.ewmImg = uni.getStorageSync('endurl') + res.data.imgUrl

                        me.ewmImg_url = uni.getStorageSync('endurl') + res.data.imgUrl
                        console.log('me.ewmImg_url')
                        console.log(me.ewmImg_url)
                        me.saveEWM = true
                        me.shareMask = true

                        console.log('err4')

                    } else if (res.code == 404) {
                        this.isLogin(()=>{})
                    } else {
                        uni.showToast({
                            title: res.message,
                            duration: 1500,
                            icon: 'none'
                        })
                        console.log('err6')

                    }
                })

            },
            /**
             *
             * */
            _navigateTo (url, type = '') {
                if (type == 'todetail') {
                    console.log('todetail============if')
                    console.log(type)
                    uni.navigateTo({
                        url: url
                    })
                } else {
                    console.log('else==============')
                    // #ifdef H5
                    uni.reLaunch({
                        url: '/pages/tabBar/home'
                    })
                    return false
                    // #endif
                    if (this.friend == 'true') {
                        console.log('back_home')
                        uni.reLaunch({
                            url: '/pages/tabBar/home'
                        })
                    } else if ((Number)(this.returnR) == 1) {
                        console.log('back_1')
                        uni.navigateBack({
                            delta: 1
                        })
                        return false
                    } else if ((Number)(this.returnR) == 2) {
                        console.log('back_2')
                        uni.navigateBack({
                            delta: 2
                        })
                        return false
                    } else {
                        uni.reLaunch({
                            url: '/pagesA/group/group'
                        })
                        return false
                    }

                }
            },
            /**
             * 跳到产品详情页面
             * */
            _toDetail () {
                // if (this.is_end) {

                    uni.navigateTo({
                        url: '/pagesA/group/group',
                    })

                   // return false
                // }
                // uni.navigateTo({
                //     url: '../group/groupDetailed?pro_id=' + this.groupmsg.ptgoods_id + '&activity_no=' + this.activity_no,
                // })
            },
            /**
             * 跳到订单详情页面
             * */
            _toOrderDetail () {
                // item.status,item.id,item.otype
                // orderStatus
                let pram = ''
                if(this.a_type==1){
                    pram = 'a_type=1'
                }else{
                    pram = ''
                }
                
                uni.navigateTo({
                    url: '../../pages/order/order?order_id=' + this.orderNo + '&returnR=1' + '&group=1&'+pram,
                })
            },
            /**
             *
             * */
            _reduce () {
                if (this.numb > 1 && Boolean(this.haveSkuBean)) {
                    this.numb--
                } else {
                    this.numb == 1
                    uni.showToast({
                        title: this.language.group_end.noReduce,
                        duration: 1000,
                        icon: 'none'
                    })
                }
            },
            /**
             *
             * */
            _add () {
                if (!Boolean(this.haveSkuBean)) {
                    uni.showToast({
                        title: this.language.group_end.selectAllTips,
                        duration: 1000,
                        icon: 'none'
                    })
                    return
                }
                // 如果是拼团购买，则还要判断是否勾选了拼团人数
                if (this.type == 3 && this.num_peo == '') {
                    uni.showToast({
                        title: this.language.group_end.selectAllTips1,
                        duration: 1000,
                        icon: 'none'
                    })
                    return
                }
                if (this.num <= this.numb) {
                    uni.showToast({
                        title: this.language.group_end.noStock,
                        duration: 1000,
                        icon: 'none'
                    })
                    return
                }
                this.numb++
            },
            /**
             *
             * */
            showrule () {
                this.show_rule = true
            },
            /**
             *
             * */
            closerule () {
                this.show_rule = false
            },
            /**
             * 开团
             * */
            _buy () {
                var me = this
                me.fastTap = false
                
                this.isLogin(()=>{
					if (me.goodscode.g_status == 1) {
					    uni.showToast({
					        title: this.language.group_end.nostart,
					        duration: 1000,
					        icon: 'none'
					    })
					    return false
					} else if (me.goodscode.g_status == 3) {
					    uni.showToast({
					        title: this.language.group_end.activityOver,
					        duration: 1000,
					        icon: 'none'
					    })
					    return false
					} else if (!me.group_again_by) {
					    uni.showToast({
					        title: this.language.group_end.noAgain,
					        duration: 1000,
					        icon: 'none'
					    })
					    return false
					} else if (!me.user_can_can) {
					    uni.showToast({
					        title: this.language.group_end.upperLimit,
					        duration: 1000,
					        icon: 'none'
					    })
					    return false
					}
					me._mask_display()
					me.fastTap = true
				})
            },
            /**
             *
             * */
            _gocantuan (sNo) {
                let pram = ''
                if(this.a_type==1){
                    pram = 'a_type=1'
                }else{
                    pram = ''
                }
                
                uni.navigateTo({
                    url: '../group/group_end?sNo=' + sNo + '&' + pram
                })
            },
            /**
             * 规格选择
             * */
            _selectG () {
                this.type = 1
                this._mask_display()
            },
            /**
             * 打开遮罩层
             * */
            _mask_display () {
                this.mask_display = true
                this.overflow = 'hidden'
            },
            /**
             * 关闭遮罩层
             * */
            _mask_false () {
                var me = this
                this.haveSkuBean = ''
                //this.mask_display = false
                this.overflow = 'scroll'
                this.mask_display1 = true
                setTimeout(function () {
                    me.mask_display = false
                    me.mask_display1 = false
                }, 500)
                for (var i = 0; i < this.attrList.length; i++) {
                    for (var b = 0; b < this.attrList[i].attr.length; b++) {
                        this.attrList[i].attr[b].select = false
                    }
                }
            },
            /**
             *
             * */
            _mask_f () {
                this.haveSkuBean = ''
                this._mask_false()
                this.overflow = 'scroll'
            },
            /**
             * 确认
             * */
            _confirm () {
                var me = this

                if (Boolean(this.haveSkuBean)) {
                    if (this.num == 0) {
                        uni.showToast({
                            title: this.language.group_end.noStock,
                            duration: 1000,
                            icon: 'none'
                        })
                    } else if (this.num != 0) {
                        var product = {}
                        product['pid'] = this.groupmsg.ptgoods_id
                        product['cid'] = this.haveSkuBean.cid
                        product['num'] = this.numb
                        product['groupnum'] = this.groupmsg.groupman
                        product['ptcode'] = this.ptcode
                        product['price'] = this.price
                        product['price'] = this.price
                        product['activity_no'] = this.activity_no
                        product['frompage'] = 'cantuan'

                        product = JSON.stringify(product)
                        
                        let pram = ''
                        if(me.a_type==1){
                            pram = 'a_type=1'
                        }else{
                            pram = ''
                        }
                        
                        uni.navigateTo({
                            url: '../group/payfor?product=' + product + '&returnR=1&'+pram
                        })
                        me.fastTap = true
                    }

                } else if (this.haveSkuBean == '') {
                    uni.showToast({
                        title: this.language.group_end.selectAllTips,
                        duration: 1000,
                        icon: 'none'
                    })
                } else {
                    if (this.num == 0) {
                        uni.showToast({
                            title: this.language.group_end.noStock,
                            duration: 1000,
                            icon: 'none'
                        })
                    } else {
                        uni.showToast({
                            title: this.language.group_end.selectAllTips,
                            duration: 1000,
                            icon: 'none'
                        })
                    }
                }

            },
            /**
             *
             * */
            _spec () {

                var attrListIn = this.attrList
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
                    var skuBeanListIn = this.skuBeanList
                    for (var z = 0; z < skuBeanListIn.length; z++) {
                        var ism = true
                        var skuBean = skuBeanListIn[z]
                        for (var j = 0; j < attrsOtherSelect.length; j++) {
                            var enable = false
                            for (var k = 0; k < skuBean.attributes.length; k++) {
                                var goodAttrBean = skuBean.attributes[k]
                                if (attrsOtherSelect[j].attributeId == goodAttrBean.attributeId &&
                                    attrsOtherSelect[j].id == goodAttrBean.attributeValId) {
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
                this.attrList = attrListIn,
                    this.skuBeanList = skuBeanListIn
            },
            /**
             * 选择属性
             * */
            showState (index, indx) {
                var listItem = this.attrList

                var items = listItem[indx]
                var item = items.attr[index]
                if (!item.enable) {
                    return
                }
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
                
                var canGetInfoLog = ''

                var skuBeanList = this.skuBeanList

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


                for (var iox = 0; iox < canGetInfo.length; iox++) {
                    canGetInfoLog += canGetInfo[iox].attributeValue + ' '
                }

                if (haveSkuBean.length != 0) {
                    var gkprice = haveSkuBean[0].price
                    gkprice = this._money(gkprice, this.groupmsg.zekou)
                    this.num = haveSkuBean[0].count
                    this.price = gkprice
                    this.imgurl = haveSkuBean[0].imgurl
                    this.haveSkuBean = haveSkuBean[0]
                } else {
                    console.log(2)
                    this.num = 1
                    this.price = this.groupmsg.price
                    this.haveSkuBean = ''
                }

                // 重新赋值
                this.attrList = listItem

                // 重新sku运算
                this._spec()
            },
        },
        components: {
            wxParse,
        }
    }
</script>

<style scoped lang="less">
    @import url("../../static/css/group/group_end.less");
</style>
