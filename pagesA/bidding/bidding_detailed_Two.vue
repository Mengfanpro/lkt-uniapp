<template>
    <div class="yh-bidding">

        <!-- #ifndef MP -->
        <heads :title="language.bidding_detailed.title" :right-text="language.bidding_detailed.rules" @right-click="navTo('../bidding/bidding_rule')"></heads>
        <!-- #endif -->

        <!-- #ifdef MP-->
        <view class="wei_gz yh-wei-gz"><view class="" @tap='navTo("../bidding/bidding_rule")'>{{language.bidding_detailed.rules}}</view></view>
        <!-- #endif -->

        <!-- 轮播图 -->
        <div class="swiper_detail" v-if='have_jp&&!load'>
            <swiper class="swiper_swiper">
                <swiper-item>
                    <img :src="order.imgurl"/>
                </swiper-item>
            </swiper>
            <view class="swiper_icon">
                1/1
            </view>
            <!-- mark（1-继续竞拍 2-已结束，不是得主  3.已结束，是得主未付款 4.已结束，是得主已付款） -->
            <div class="swiper_end" v-if="from_mark!=1 && (!is_invalid)">
                <img :src="list_end"/>
            </div>
            <div class="swiper_end" v-if="is_invalid">
                <img :src="is_invalid"/>
            </div>

            <!-- <div class="gd_header">
                <img :src="fx_img" class="gd_share"  @tap="showShareMask"/>
            </div> -->
        </div>

        <!-- 内容 -->
        <div class="bid_content" v-if='have_jp&&!load'>
            <div class="bid_t">
                <img :src="list_time"/>{{form_type==0?language.bidding_detailed.noAction:
                form_type==1?language.bidding_detailed.ongoing:(from_mark==1?language.bidding_detailed.ongoing:(from_mark==2?language.bidding_detailed.finished:(from_mark==3?language.bidding_detailed.obligation:(from_mark==4?language.bidding_detailed.done:''))))}}
                <!-- <span class="bid_time" v-if="bind_st==1">距结束<span>00</span>时<span>10</span>分<span>36</span>秒</span> -->
                <div class="bid_time" v-if="from_mark!=0 && from_mark != 1">
                    <span></span>
                </div>

                <div class="bid_time" v-else>
                    <!-- form_type=0即将开拍 -->
                    <span v-if="from_mark==0">{{language.bidding_detailed.fromStart}}</span>
                    <span v-else>{{language.bidding_detailed.fromEnd}}</span>

                    <span>{{overtime.day}}</span>{{language.bidding_detailed.days}}
                    <span>{{overtime.hour}}</span>：
                    <span>{{overtime.minute}}</span>：
                    <span>{{overtime.second}}</span>
                </div>
            </div>


            <div class="bid_up">
                <div class="titile_outer">
                    <div class="bid_title">{{order.title}}</div>

                    <!-- #ifdef MP-ALIPAY || MP-TOUTIAO || MP-BAIDU -->
                    <button id="copyy" :data-clipboard-text='share.shareHref' v-if="from_mark == 0 || from_mark == 1"
                            open-type="share" class="yh-copyy">
                        <div class="bid_right">
                            <img :src="jp_share">
                            <div>{{language.bidding_detailed.share}}</div>
                        </div>
                    </button>
                    <!-- #endif -->

                    <!-- #ifndef MP-ALIPAY || MP-TOUTIAO || MP-BAIDU -->
                    <div class="bid_right" @tap="showShareMask" id="copyy" :data-clipboard-text='share.shareHref'
                         v-if="from_mark == 0 || from_mark == 1">
                        <img :src="jp_share">
                        <div>{{language.bidding_detailed.share}}</div>
                    </div>
                    <!-- #endif -->
                </div>

                <div class="bid_bigin">
                    <span :class="bid_money==true?'bid_bigin_l bid_color':'bid_bigin_l'">
                        <span class="after">{{language.bidding_detailed.startingPrice}}</span>
                        ¥{{order.price}}
                    </span>
                    <span class="bid_bigin_r">
                        <span class="after">{{language.bidding_detailed.LatestPrice}}</span>
                        ¥{{order.current_price}}
                    </span>
                </div>
                <div class="bid_number">
                    <span class="bid_number_l">{{language.bidding_detailed.marketPrice}}<span>¥{{order.market_price}}</span></span>
                    <span class="bid_number_r">{{language.bidding_detailed.participation}}<span>{{order.pepole}}</span>{{language.bidding_detailed.people}}</span>
                </div>
            </div>

            <div class="bid_div">
                <div class="bid_dynamic">{{language.bidding_detailed.dynamic}}</div>
                <div class="list_height"></div>
            </div>
            
            
            <div class="bid_div" v-if="(from_mark==2||from_mark==4||from_mark==3)&&threeRecords.length">
                <div class="list_height"></div>
                <div class="bid_dynamic gongxi-wrap">
                    <div class="gongxi">
                        <text>{{language.bidding_detailed.congratulations}}</text>
                        <text class="yellow">{{ host_user }}</text>
                        <text>{{language.bidding_detailed.getGoods}}</text>
                    </div>
                </div>
                <div class="list_height"></div>
            </div>
            
            
            <div class="bid_div" v-else-if="from_mark==5">
                <div class="list_height"></div>
                <div class="bid_dynamic">{{language.bidding_detailed.lostAuction}}</div>
                <div class="list_height"></div>
            </div>
            <div class="bid_div">
                <div class="bid_record" @tap="_bid_record()">
                    <span>{{language.bidding_detailed.record}}</span>
                    <span >丨{{bid_num}} {{language.bidding_detailed.strip}}</span>
                    <img :src="list_right"/>
                </div>
                <view class="three_record">
                    <view class="three_record_item" v-for="(item, index) in threeRecords" :class="{three_record_item_win : item.win}">
                        <view class="three_font user_name_long" >{{ item.user_name }}</view>
                        <view class="three_font">{{ item.grade }}</view>
                        <view class="three_font">{{ item.add_time }}</view>
                        <view class="three_font" style="width: 18%;">{{ item.price }}</view>
                    </view>
                </view>
                <div class="list_height"></div>
            </div>

            <div class="bid_div yh-bid-div">
                <view class="jp_cate">
                    <view>{{language.bidding_detailed.auctionType}}</view>
                    <view style="white-space: nowrap;">{{language.bidding_detailed.commonBidding}}</view>
                </view>
                <view class="jp_cate">
                    <view>{{language.bidding_detailed.startingPrice}}</view>
                    <view>¥{{order.price}}</view>
                </view>
                <view class="jp_cate">
                    <view>{{language.bidding_detailed.securityFund}}</view>
                    <view>¥{{order.promise}}</view>
                </view>
                <view class="jp_cate">
                    <view>{{language.bidding_detailed.bidIncrement}}</view>
                    <view>¥{{order.add_price}}</view>
                </view>
                <view class="jp_cate">
                    <view>{{language.bidding_detailed.startTime}}</view>
                    <view>{{startTime}}</view>
                </view>
                <view class="jp_cate">
                    <view>{{language.bidding_detailed.endTime}}</view>
                    <view>{{endTime}}</view>
                </view>
            </div>
            <div style="height: 10rpx;"></div>
            <div class="list_height"></div>

            <div class="bid_div">
                <div class="bid_describe">{{language.bidding_detailed.process}}</div>
                <img class="bid_liucheng_ing" mode="aspectFill" :src="jp_liucheng">
                <div style="height: 30rpx;"></div>
                <div class="list_height"></div>
            </div>

            <div v-if='shop_list.shop_id' style='height: 228rpx;'>
                <div class='store store1'>
                    <div class='store1Div'>
                        <!-- :class="{ bargainLogo:bargain }" -->
                        <img :src='shop_list.shop_logo'>
                        <div>{{shop_list.shop_name}}</div>
                    </div>
                    <div class="store_right">
                        <div class='goStore store1Div' @tap='navTo("../../pagesA/store/store?shop_id="+shop_list.shop_id)'>{{language.bidding_detailed.intoShop}}</div>
                    </div>

                </div>
                <div class='store store2' style='justify-content: space-around;'>
                    <div class='store2Div'>
                        <p>{{shop_list.quantity_on_sale}}</p>
                        <div>{{language.bidding_detailed.sellingGoods}}</div>
                        <div class="shuxian"></div>
                    </div>
                    <div class='store2Div'>
                        <p>{{shop_list.quantity_sold}}</p>
                        <div>{{language.bidding_detailed.soldOut}}</div>
                        <div class="shuxian"></div>
                    </div>
                    <div class='store2Div'>
                        <p>{{shop_list.collection_num}}</p>
                        <div>{{language.bidding_detailed.followers}}</div>
                    </div>
                </div>
            </div>


            <div class="bid_div">
                <div class="bid_describe">{{language.bidding_detailed.described}}<br/>
                    <p style="font-size: 13px;">{{language.bidding_detailed.specification}}{{order.attr}}</p>
                </div>
                <div class="bid_describe_content" v-if='order.content' style="margin-bottom: 110rpx;">
                    <!-- <wxParse :content="order.content"></wxParse> -->
                    <rich-text class="richtext" :nodes="order.content"></rich-text>
                </div>
                <div class="bid_describe_content" v-else style="margin-bottom: 110rpx;">

                </div>
            </div>

        </div>


        <!-- 尾部 -->
        <div class="bid_footer" v-if='have_jp&&!load'>
            <div class="bid_l">
                <div class="bid_footer_l">
                    <div class="bid_auto">
                        <div class="bid_word"><span>{{language.bidding_detailed.securityFund}}</span></div>
                        <div class="bid_prict"><span>¥{{order.promise}}</span></div>
                    </div>
                </div>
                <div class="bid_footer_r">
                    <div class="bid_auto">
                        <div class="bid_word"><span>{{language.bidding_detailed.bidIncrement}}</span></div>
                        <div class="bid_prict"><span>¥{{order.add_price}} {{language.bidding_detailed.time}}</span></div>
                    </div>
                </div>
            </div>


            <div @tap="_state(2,order.current_price,order.add_price)"
                 :class="(from_mark==1 && time_end != 1)?'detail_btn_hei':'detail_btn_gray'">
                <span v-if="from_mark==1 && canbidding==0">{{language.bidding_detailed.offer}}</span>
                <span v-else-if="from_mark==2||from_mark==3||from_mark==4||from_mark==5||time_end==1">{{language.bidding_detailed.offer}}</span>
                <span v-else>{{canbidding}} {{language.bidding_detailed.afterContinue}}</span>
            </div>
            <!-- form_type(0-即将开拍，1-正在热拍，其他就是我的竞拍) -->
            <!-- from_mark（1-继续竞拍 2-已结束，不是得主  3.已结束，是得主未付款 4.已结束，是得主已付款） -->
        </div>

        <div class='empty_play' v-if='!have_jp&&!load'>
            <img :src="emptyImg"/>
            <p>{{language.bidding_detailed.nopro}}</p>
            <p class="empty_p">{{language.bidding_detailed.canBuy}}</p>
            <div @tap="navToHome()">{{language.bidding_detailed.goHome}}</div>
        </div>
        <div class='load' v-if='load'>
            <div>
                <img :src="loadImg"/>
                <p>{{language.bidding_detailed.load}}…</p>
            </div>
        </div>

        <!-- 提示去付款的弹框 -->

        <div class="bid_pup" v-if="showEndFlag">
            <div class="bid_pup_flex">
                <div class="bid_pup_auto">
                    <div class="end_tishi">{{language.bidding_detailed.prompt}}</div>
                    <div class="end_content">
                        <div>{{language.bidding_detailed.auctionEnd}}</div>
                        <div>{{language.bidding_detailed.toPayText}}</div>
                    </div>
                    <div @tap="closeEndFlag('leave')" class="end_btn yh-end-btn1">{{language.bidding_detailed.cancel}}</div>
                    <div @tap="closeEndFlag('go')" class="end_btn yh-end-btn2">{{language.bidding_detailed.confirm}}</div>
                </div>
            </div>
        </div>

        <!-- 弹窗 -->
        <div class="bid_pup" v-if="bid_pup" @touchmove.stop.prevent="stopTap">
            <div class="bid_pup_flex">
                <div class="bid_pup_auto">
                    <!-- <div class="bid_pup_title">{{(bind_st==0||bind_st==1)&&state==1?'支付保证金':'竞拍出价'}}</div> -->
                    <div class="bid_pup_title">{{form_type==1?language.bidding_detailed.rentDeposit:language.bidding_detailed.auctionBid}}</div>
                    <!-- 支付保证金的 -->
                    <div class="bid_pup_word" v-if="form_type==1">
                        <div class="bid_pup_money">{{language.bidding_detailed.securityFund}} ¥{{order.promise}}</div>
                        <div class="bid_pup_xuan">{{language.bidding_detailed.paymentStyle}}</div>
                        <ul class="bid_li">
                            <li @tap="_li(1,order.promise)">
                                <img :src="list_wx" class="bid_li_img1"/>
                                {{language.bidding_detailed.weChat}}
                                <img :src="list_hui" v-if="wx_flag" class="bid_li_img2"/>
                                <img :src="list_xuan" v-if="!wx_flag" class="bid_li_img2"/>
                            </li>
                            <li @tap="_li(2,order.promise)">
                                <img :src="list_zfb" class="bid_li_img1"/>
                                {{language.bidding_detailed.yue}}
                                <img :src="list_hui" v-if="ye_flag" class="bid_li_img2"/>
                                <img :src="list_xuan" v-if="!ye_flag" class="bid_li_img2"/>
                            </li>
                        </ul>
                    </div>
                    <!-- 出价的 -->
                    <div class="bid_pup_word" v-else>
                        <div class="bid_ju">
                            <div class="bid_ju_d"></div>
                            <input type="number" name="money" v-model="bid_value" style="color: #242424;">
                        </div>
                        <div class="bid_text">{{language.bidding_detailed.noLessThan}} {{low_price}} {{language.bidding_detailed.yuan}}</div>
                    </div>
                    <div class="bid_pup_btn">
                        <div class="bid_pup_l" @tap="bid_pup=false">{{language.bidding_detailed.cancel}}</div>
                        <div class="bid_pup_r" @tap="_click()">{{language.bidding_detailed.confirm}}</div>
                    </div>
                </div>
            </div>
        </div>

        <!--余额支付密码框-->
        <div class='payment_pass' v-if="pay_display">
            <div class='payment_c'>
                <p>{{language.bidding_detailed.inputPwsd}}</p>
                <div class="xian_d">
                    <input ref="pwd" :focus="focus" type='password' :maxlength="digits.length" v-model="msg"
                           class="yh-xian-d-input"/>

                    <ul class="pwd-wrap" @tap="focust">
                        <li v-for="(item,key) in digits" :key='key'>
                            <span v-if="msgLength > key" class="spanm"><input class="masd" type="number" v-model="key"
                                                                              pattern="\d*"/></span>
                        </li>
                    </ul>

                </div>
                <div class="payment_tt">
                    <div class='cancel' @tap="_cancel">{{language.bidding_detailed.cancel}}</div>
                    <div class='confirm' @tap="_confirm">{{language.bidding_detailed.confirm}}</div>
                </div>
            </div>
        </div>
        <!--没有设置支付密码提示框-->
        <div class='payment_pass' v-if="password_display">
            <div class='payment_c'>
                <div class='payment_ww'>{{language.bidding_detailed.toSetupPwsd}}</div>
                <div class="payment_tt payment_boo" @tap="_password_status">
                    {{language.bidding_detailed.toSetup}}
                </div>
            </div>
        </div>
        
        <share ref="share" :share="share" :pro_id="order.product_id" type="JP">

        </share>
    </div>
</template>

<script>
    import {mapMutations} from 'vuex'
    import wxParse from '../../components/mpvue-wxparse/src/wxParse.vue'
    import htmlParser from '../../common/html-parser.js'
    import {
        lkt_changeTimeStyle,
        lkt_dateformat,
    } from '../../static/js/bidding/bidding.js'
    // #ifdef H5
    import jQuery from '../../common/jquery.js';
    // #endif
    import share from "@/components/share";
    export default {
        data () {
            return {
                close: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/close_bb.png',
                saves: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/save.png',
                fastTap: true,
                loadImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/5-121204193R7.gif',
                emptyImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/empyimg92x.png',
                back1: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/back2x.png',
                fx_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/fx.png',
                wx_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/wechat.png',
                wx_person: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/wechat.png',
                erm_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/ewmIcon.png',
                list_wx: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/wechat.png',
                list_zfb: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jp_yue.png',
                list_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/xuanzehui2x.png',
                list_xuan: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/xuanzehei2x.png',
                list_time: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/naz.png',
                list_right: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jiantouhei2x.png',
                list_end: uni.getStorageSync('endurl') + 'images/icon/bidding_finish.png',
                jp_share: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jp_share.png',
                jp_liucheng: uni.getStorageSync('endurl') + 'images/icon/jp_liucheng.png',
                jp_invalid: uni.getStorageSync('endurl') + 'images/icon/jp_invalid.png', //失效图
                erm_pyq_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/fdc.png',
                copy_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/copyIcon.png',
                cat: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + '/images/2019041632x.png',
                logo: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/lktlogo.png',
                stop: '', //倒计时定时器
                stop2: '', //出价倒计时定时器
                stop3: '', //轮循定时器
                is_invalid: false, //fasle-未失效 true-已失效
                head: true, //头部切换
                status_i: false,
                bid_pup: false,
                bid_money: false,
                wx_flag: false,
                shareMask_H5: false,
                h5_url: '',
                ye_flag: true,
                load: true,
                access_id: '',
                order: '', //订单数据
                res_ove: '', //所有出价记录
                res_ove2: '',
                res_my: '', //我的出价记录
                bindding_id: '', //订单id
                head_ids: '', //判断从哪个跳过来的
                bind_st: '', //状态值，（0未开始，进行中，2待付款，3我的订单）
                bind_pro: '', //是否出过保障金（0为否，1为是）
                state: '',
                money: '', //余额
                passwd_status: '',
                digits: ['', '', '', '', '', ''], //input框位数控制,这里可以配置多少个“输入框”
                msg: '',
                msgLength: 0,
                bid_value: '',
                money_s: '', //最低出价
                pay_display: false, //支付密码框显示
                password_status: '', //判定是否已经设置支付密码
                password_display: false, //前往设置支付密码提示框
                focus: true,
                sNos: '',
                titles: '',
                totals: '',
                shareMask: false,
                saveEWM: false,
                shares: {},
                shareContent: '一起来用来客推吧！', //分享的内容
                shareHref: '', //分享的链接
                sharehrefTitle: '一起来用来客推吧1', //分享的链接的标题
                sharehrefDes: '一起来用来客推吧2', //分享的链接的描述
                pic: '',
                ewmImg: '',
                startTime: '00月00日',
                endTime: '00月00日',
                shop_list: {},
                form_type: -1, //1:从即将开拍和正在热拍的页面跳转过来的
                from_mark: 0, //from_mark代表竞拍的mark状态值(从我的竞拍页面过来的)
                overtime: {
                    day: 0,
                    hour: 0,
                    minute: 0,
                    second: 0
                },
                canbidding: 0,
                formMy_old: 0, //=1的时候，代表从我的竞拍页面进来的，并且结束时间也过去了
                bid_num: 0, //竞拍记录的条数
                low_pepole: 0, //最低竞拍人数
                pepole: 0, //目前已有的人数
                threeRecords: [], //最新的三条竞拍记录
                host_user: '', //得主的姓名或者号码
                from_detail_one: -1, //判断从哪个页面跳转过来的？1：交押金页面过来的，其他：从我的竞拍页面过来的
                showEndFlag: false, //是否显示本次竞拍结束的弹框？false:不显示；true:显示
                is_user: '', //是否登录[0-未登录，1-登录]
                clickFlag: false,
                isfx: '', //是否为分享过来的页面
                bid_str: '', //竞拍地址栏json参数---字符串
                have_jp: true, //是否查询到竞拍商品
                from_my: '', //是否从我的竞拍进入 1-是
                time_end: '', //时间上是否已结束 1-是
                low_price: '', //最低出价
                share: {
                    is_shop: false, // 是否是店铺分享
                    shop_id: 1, // 店铺分享id
                    sharehrefTitle: '', // 分享标题
                    shareImg: '', // 分享图片
                    ewmImg: '', // 保存的海报
                    shareContent: '', // 分享内容
                    shareHref: '', // H5 分享地址
                    shareHref2: '', // 小程序分享页面路径
                    shareMask: false, // 微信小程序下的显示分享判断
                    saveEWM: false, // 显示海报
                    isDistribution: false, // 是否是分销商品
                }
            }
        },
        components: {
            wxParse,
            share
        },
        onLoad (options) {
            this.setLang();
            this.shareContent = this.language.showModal.shareContent

            this.isfx = options.isfx
            this.form_type = options.type
            this.from_mark = options.mark
            this.from_detail_one = options.detail_one
            this.from_my = options.from_my
            this.bindding_id = this.$store.state.bindding_num
            this.bind_st = this.$store.state.bind_status
            this.bind_pro = this.$store.state.bind_promise
            this.head_ids = this.$store.state.head_id
            this.access_id = uni.getStorageSync('access_id') ? uni.getStorageSync('access_id') : this.$store.state.access_id
            // clearTimeout(this.stop2)
            this.canbidding = 0
            // clearTimeout(this.stop)
            // this._axios()
        },
        onUnload () {
            clearTimeout(this.stop2)
            clearTimeout(this.stop)
            clearTimeout(this.stop3)
        },
        watch: {
            msg (curVal) {
                this.msgLength = curVal.length
            },
            coupon_name: function () {
                this.changeValue()
            },
            canbidding: function (newValue, oldValue) {
                if (newValue <= 0) {
                    clearTimeout(this.stop2)
                    this.canbidding = 0
                    this.stop2 = ''
                }
            },
            value: function (newValue, oldValue) {
                this.changeValue()
            },
            price1: function (newValue, oldValue) {
                var me = this
                this.$nextTick(function () {
                    me.price1 = me.products_total + me.freight - me.coupon_name - me.reduce_money - me.value
                    me.price1 = Number(me.price1).toFixed(2)
                })
            },
        },
        onShow () {
            this.bindding_id = this.$store.state.bindding_num
            this.bind_st = this.$store.state.bind_status
            this.bind_pro = this.$store.state.bind_promise
            this.head_ids = this.$store.state.head_id
            this.access_id = uni.getStorageSync('access_id') ? uni.getStorageSync('access_id') : this.$store.state.access_id
            let bid = {
                bindding_id:this.bindding_id,
                type: 1,
                isfx: true
            }


            this.bid_str = JSON.stringify(bid)
            this.shareHref = uni.getStorageSync('h5_url') + 'pagesA/bidding/bidding_detailed?bid=' + encodeURIComponent(this.bid_str) + '&isfx=true&fatherId=' + uni.getStorageSync('user_id')
            this.h5_url = this.shareHref

            // window.history.pushState('state', 'document.title','pagesA/bidding/bidding_detailed?biddingId=' + this.bindding_id+'&type=1&isfx=true');静态设置分享路径不刷新页面

            clearTimeout(this.stop2)
            clearTimeout(this.stop)
            this.canbidding = 0
            this._axios()

        },
        /**
         * 转发
         * */
        onShareAppMessage: function (res) {
            this.share.shareMask = false
            return {
                title: this.share.sharehrefTitle,
                path: this.share.shareHref2,
                imageUrl: this.share.shareImg,
                bgImgUrl: this.share.shareImg
            };
        },
        methods: {
            ...mapMutations({
                bind_promise: 'SET_BIND_PPOMISE',
                pay_lx: 'SET_PAY_LX',
            }),
            /**
             * 加载数据
             * */
            _axios () {
                var me = this

                var data = {
                    module: 'app',
                    action: 'auction',
                    id: this.bindding_id,
                    isfx: this.isfx
                }

                //从交押金页面过来的
                if (this.from_detail_one == 1) {
                    data.m = 'detail'
                }
                //非交押金页面过来
                else {
                    //mark=1:detail;mark=1:end_detail;
                    if (this.from_mark == 1) {
                        data.m = 'detail'
                    } else {
                        data.m = 'end_detail'
                    }
                }

                me.$req.post({data}).then(res => {
                    res = Object.assign(res, res.data)
                    if (res.code == 109) {
                        me.have_jp = false
                    }
                    me.load = false
                    if (me.isfx && res.res[0]) {
                        me.from_mark = res.res[0].mark
                        if (res.res[0].is_show != 1 || res.res[0].recycle == 1) {
                            me.is_invalid = true
                        }
                    }
                    if (me.from_mark == 3) { //提示去付款
                        me.showEndFlag = true
                    }
                    if (res.res[0]) {
                        var content = res.res[0].content.replace(/src/g,
                            'style=\'width:100%!important;height: auto!important;\' src').replace(
                            /<table/g, `<table style="width:100%!important;"`)

                        res.res[0].content = htmlParser(content)
                        me.order = res.res[0]
                    }
                    me.shop_list = res.shop_list
                    me.changeTimeStyle()
                    me.state = res.type
                    me.money = res.money
                    me.host_user = res.host_user
                    me.bid_num = res.bid_num
                    me.low_price = Number(Number(me.order.current_price) + Number(me.order.add_price)).toFixed(2)
                    me.passwd_status = res.password_status
                    me.res_ove2 = me.res_ove = res.res_bid
                    me.res_my = res.res_my

                    me.low_pepole = res.res[0].low_pepole
                    me.pepole = res.res[0].pepole

                    var canbidding = res.res[0].wait_time
                    if (canbidding && canbidding != 0) {
                        // canbidding = new Date(res.res[0].wait_time.replace(/-/g, '/')).getTime();
                        me.countDownn(canbidding)
                    }
                    if (res.res_bid.length > 0) {
                        for (var i in res.res_bid) {
                            res.res_bid[i]['win'] = false
                            if (i == 0) {
                                // res.res_bid[i].grade = me.language.bidding_detailed.lingxian;

                                if (this.from_mark == 2 || this.from_mark == 4 ) {
                                    res.res_bid[i].grade = me.language.bidding_detailed.lingxian;
                                    res.res_bid[i]['win'] = true
                                } else {
                                    res.res_bid[i].grade = me.language.bidding_detailed.lingxian;
                                }
                                
                            } else {
                                res.res_bid[i].grade = me.language.bidding_detailed.chuju;
                            }
                        }
                    }

                    
                    
                    me.threeRecords = res.res_bid
                    me.is_user = res.is_user
                    //不改变时间格式
                    me.startTime = res.res[0].starttime
                    me.startTime = me.startTime.substring(0, 10)
                    me.endTime = res.res[0].endtime
                    me.endTime = me.endTime.substring(0, 10)

                    var start_second = res.res[0].start_second //据开始的秒数
                    var end_second = res.res[0].end_second //据结束的秒数
                    //即将开拍
                    if (me.form_type == 0) {
                        //距离开始时间
                        me.countDown(start_second)
                    } else {
                        //距离结束时间
                        me.countDown(end_second)
                    }
                    //竞拍中-轮循
                    if (me.from_mark == 1) {
                        me.loop()
                    } else {
                        clearTimeout(me.stop3)
                    }
                })
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
                uni.navigateTo({
                    url: './bidding_my'
                })
            },
            /**
             *
             * */
            _goStore (shop_id) {
                uni.navigateTo({
                    url: '../../pagesA/store/store?shop_id=' + shop_id
                })
            },
            copy_url() {
                this.shareMask_H5 = true;
                this.h5_url = this.shareHref;
            },
            copyH5Url() {
                jQuery('#h5_input input').select();
                document.execCommand('Copy');
            },
            /**
             *
             * */
            _closeAllMask () {
                this.shareMask = false
                this.saveEWM = false
            },
            /**
             *
             * */
            _downEWM () {
                let me = this;
                uni.downloadFile({
                    url: this.ewmImg,
                    success(res) {
                        let filePath = res.tempFilePath;
                        uni.saveImageToPhotosAlbum({
                            filePath: filePath,
                            success () {
                                uni.showToast({
                                    title: me.language.bidding_detailed.saveImgOk,
                                    duration: 1500,
                                    icon: 'none'
                                });
                                me.shareMask = false;
                                me.saveEWM = false;
                            },
                            fail: function() {
                                uni.showToast({
                                    title: me.language.bidding_detailed.saveImgFail,
                                    duration: 1500,
                                    icon: 'none'
                                });
                            }
                        });
                    },
                    fail: function() {
                        uni.showToast({
                            title: me.language.bidding_detailed.saveImgFail,
                            duration: 1500,
                            icon: 'none'
                        });
                    }
                });
            },
            /**
             * 弹框提示按钮处理
             * */
            closeEndFlag (flag) {
                var me = this
                if (flag == 'go') { //去付款
                    me.showEndFlag = false
                    this.pay_lx('jp')
                    uni.navigateTo({
                        url: '/pagesA/bidding/bidding_order'
                    })
                    return false
                } else { //停留详情页
                    me.showEndFlag = false
                }
            },
            /**
             *
             * */
            _shareApp (type) {
                var me = this
                var scene = ''
                var url = this.$store.state.url
                url = url.split('index')[0]
                var shareUrl = uni.getStorageSync('h5_url') + 'pagesA/bidding/bidding_detailed?bid=' + encodeURIComponent(this.bid_str)
                if (type == 1) {
                    //App分享到 微信朋友圈
                    scene = 'WXSenceTimeline'
                } else if (type == 2) {
                    //App分享到 微信好友
                    scene = 'WXSceneSession'
                }
                uni.share({
                    title: this.order.title,
                    summary: me.shareContent,
                    provider: 'weixin',
                    scene,
                    type: 0,
                    href: shareUrl,
                    imageUrl: this.order.imgurl,
                    success: function (res) {
                        console.log('success:' + JSON.stringify(res))
                    },
                    fail: function (err) {
                        console.log('fail:' + JSON.stringify(err))
                    }
                })
            },
            getGoodsDetailParams () {
                this.share.is_shop = false;
                this.share.shareHref = uni.getStorageSync('h5_url') + 'pagesA/bidding/bidding_detailed?bid=' + encodeURIComponent(this.bid_str)
                this.share.shareHref2 = '/pagesA/bidding/bidding_detailed?bid=' + this.bid_str
                this.share.shareImg = this.order.imgurl;
                this.share.sharehrefTitle = this.order.title;
                this.share.shareContent = this.language.showModal.shareContent;
                this.share = Object.assign({}, this.share)
            },

            /**
             *
             * */
            showShareMask() {
                this.getGoodsDetailParams();
                this.$refs.share.showShareMask();
            },
            /**
             *
             * */
            closeShareMask () {
                this.shareMask = false
            },
            /**
             *
             * */
            saveImg () {
                var me = this
                uni.saveImageToPhotosAlbum({
                    filePath: me.ewmImg,
                    success: function () {
                        uni.showToast({
                            title: me.language.bidding_detailed.saveImgOk,
                            duration: 1500,
                            icon: 'none'
                        })
                    }
                })
            },
            /**
             *
             * */
            showSaveEWM (string) {
                lkt_showSaveEWM(string, this)
            },
            /**
             * 复制链接
             * */
            copyUrl () {
                var me = this
                var url = this.$store.state.url
                url = url.split('index')[0]

                var shareUrl = uni.getStorageSync('h5_url') + 'pagesA/bidding/bidding_detailed?bid=' + encodeURIComponent(this.bid_str)
                var a = getCurrentPages()
                uni.setClipboardData({
                    data: shareUrl,
                    success: function () {
                        // me.$store.state.isMe = true
                        uni.showToast({
                            title: me.language.bidding_detailed.copyOk,
                            duration: 1500,
                            icon: 'none'
                        })
                    }
                })
            },
            /**
             * 设置密码跳转
             * */
            _password_status () {
                uni.navigateTo({
                    url: '/pagesB/setUp/payment'
                })
                this.password_display = false
            },
            /**
             *
             * */
            focust () {
                this.focus = true
            },
            /**
             *
             * */
            _navigateTo (status, id) {
                if (status == 0) {
                    uni.navigateTo({
                        url: 'order?order_id=' + id + '&showPay=true',
                    })
                } else {
                    uni.navigateTo({
                        url: 'order?order_id=' + id,
                    })
                }
                this.flag = false
            },
            /**
             *
             * */
            _back () {
                this.flag = false

                if (this.isfx == 'true') {
                    uni.switchTab({
                        url: '../../pages/tabBar/home'
                    })
                    return false

                } else {
                    if (this.from_detail_one == 1) {
                        uni.redirectTo({
                            url: '../../pagesA/bidding/bidding'
                        })
                    } else {
                        uni.navigateBack({
                            delta: 1
                        })
                    }

                }
            },
            /**
             * 弹窗
             * */
            _state (state, num, num1) {
                if (this.canbidding > 0) {
                    return
                }

                if (this.is_user == 0) {
                    uni.showToast({
                        title: this.language.laiketuiCommon.noLogin,
                        icon: 'none',
                        duration: 1500
                    })
                    setTimeout(function () {
                        uni.navigateTo({
                            url: '../../pages/login/login?landing_code=1'
                        })
                    }, 1000)
                    return
                } else if (this.is_user == 1) {
                    console.log('from_mark')
                    console.log(this.from_mark)

                    if (this.from_mark == 1) {
                        var promise = parseFloat(num)
                        var money = parseFloat(num1)
                        this.money_s = promise + money
                        this.money_s = this.money_s.toFixed(2)
                        console.log('money_s=' + this.money_s)
                        this.bid_pup = true
                    }
                }
            },
            /**
             * 选择支付确定
             * */
            _click () {
                var me = this
                //去支付保证金
                if (me.form_type == 1) {
                    // if (me.bind_st == 1 && me.state == 1) {
                    if (me.wx_flag == true && me.ye_flag == false) {
                        if (me.passwd_status == 1) {
                            me.bid_pup = false
                            me.pay_display = true
                        } else {
                            me.bid_pup = false
                            me.password_display = true
                        }
                    } else {
                        var data = {
                            module: 'app',
                            action: 'auction',
                            m: 'go_pay',
                            password: this.msg,
                            id: this.bindding_id,
                            access_id: this.access_id,
                            type: 'wx'
                        }
                        uni.request({
                            data,
                            url: uni.getStorageSync('url'),
                            header: {
                                'content-type': 'application/x-www-form-urlencoded'
                            },
                            method: 'POST',
                            success: (res) => {
                                me.sNos = res.data.sNo
                                me.titles = res.data.title
                                me.totals = res.data.total
                                me.bid_pup = false
                                // #ifdef MP-WEIXIN
                                me.weixinPay()
                                // #endif
                                //#ifndef MP-WEIXIN
                                me.pay_wx()
                                // #endif
                            },
                            error: function (err) {
                                console.log(err)
                            }
                        })
                        // }
                    }
                }
                //去出价
                else {
                    var bid_value = parseFloat(me.bid_value)

                    var money_s = parseFloat(me.money_s)
                    let should_pay = Number((Number(me.order.current_price) + Number(me.order.add_price)).toFixed(2))
                    if (bid_value < should_pay) {
                        uni.showToast({
                            title: me.language.bidding_detailed.moneySmill,
                            duration: 1000,
                            icon: 'none'
                        })
                        return false
                    }
                    if (isNaN(bid_value)) {
                        uni.showToast({
                            title: me.language.bidding_detailed.amountTips,
                            duration: 1000,
                            icon: 'none'
                        })
                    } else {
                        var data = {
                            module: 'app',
                            action: 'auction',
                            m: 'bid',
                            price: bid_value,
                            id: this.bindding_id,
                            access_id: this.access_id
                        }
                        
                        me.$req.post({data}).then(res => {
                            if (res.code == 200) {
                                uni.showToast({
                                    title: me.language.bidding_detailed.premiumOk,
                                    duration: 1000,
                                    icon: 'none'
                                })
                                clearTimeout(me.stop)

                                me._axios()
                                me.bid_pup = false
                                me.bind_promise(1)
                                me.bid_value = ''
                            } else {
                                uni.showToast({
                                    title: me.language.bidding_detailed.premiumFail + res.message,
                                    duration: 1000,
                                    icon: 'none'
                                })
                            }    
                        })
                        
                    }
                }

            },
            /**
             * 跳转出价记录表
             * */
            _bid_record () {
                uni.navigateTo({
                    url: 'bidding_record?bindding_id=' + this.bindding_id,
                })
            },
            /**
             * 转换开始,结束时间的格式
             * */
            changeTimeStyle () {
                lkt_changeTimeStyle(this)
            },
            /**
             * 轮循
             * */
            async loop () {
                let that = this
                //请求更新数据
                let data = {
                    module: 'app',
                    action: 'auction',
                    id: this.bindding_id,
                    access_id: this.access_id,
                    isfx: this.isfx,
                    m: 'timeRequest'
                }

                let res = await this.$req.post({data})
                res = Object.assign(res, res.data)
                if (res.code == 200) {
                    this.bid_num = res.bid_num
                    this.order.current_price = Number(res.max_price).toFixed(2)
                    this.low_price = Number(Number(res.max_price) + Number(this.order.add_price)).toFixed(2)
                    this.order.pepole = res.pepole
                    if (res.res_bid) {



                        for (var i in res.res_bid) {
                            res.res_bid[i]['win'] = false
                            if (i == 0) {

                                if (this.from_mark == 2 || this.from_mark == 4 ) {
                                    res.res_bid[i].grade = that.language.bidding_detailed.lingxian;
                                    res.res_bid[i]['win'] = true
                                } else {
                                    res.res_bid[i].grade = that.language.bidding_detailed.lingxian;
                                }
                                

                            } else {
                                res.res_bid[i].grade = that.language.bidding_detailed.chuju;
                            }
                        }
                    }
                    this.res_bid = res.res_bid
                    this.threeRecords = this.res_bid
                }

                //竞拍中-循环请求
                clearTimeout(this.stop3)
                this.stop3 = setTimeout( () => {

                    if (this.from_mark == 1) {
                        this.loop()
                    } else {
                        clearTimeout(this.stop3)
                    }
                }, 5000)

            },
            /**
             * 倒计时
             * */
            countDown (endtime) {
                var that = this
                //主要是考虑从我的竞拍过来的（结束时间也已经过去了）
                that.dateformat(endtime)
                clearTimeout(that.stop)
                that.stop = setTimeout(function () {
                    if (endtime > 0) {
                        endtime--
                        that.countDown(endtime)
                    } else {
                        if (that.from_mark == 1) {
                            that.time_end = 1
                            that.form_type = 2
                            that.from_mark = 2
                        }
                        that.formMy_old = 1
                        that.overtime.day = 0
                        that.overtime.hour = 0
                        that.overtime.minute = 0
                        that.overtime.second = 0
                        clearTimeout(that.stop)
                    }
                }, 1000)

            },
            /**
             * 倒计时
             * */
            countDownn (endtime) {
                var me = this
                var e = ''
                clearTimeout(me.stop2)
                if (endtime > 0) {
                    endtime--
                    me.canbidding = endtime
                    me.stop2 = setTimeout(function () {
                        me.countDownn(endtime)
                    }, 1000)
                } else {
                    clearTimeout(me.stop2)
                    me.canbidding = 0
                }
            },
            /**
             * 时间格式化输出，如11:03 25:19 每1s都会调用一次
             * */
            dateformat (micro_second) {
                this.overtime = lkt_dateformat(micro_second, this)
            },
            /**
             * 阻止冒泡，阻止弹窗出现后还能上下移动页面
             * */
            stopTap () {

            }
        }
    }
</script>

<style scoped lang="less">
    @import url("../../static/css/bidding/bidding_detailed_Two.less");
</style>
