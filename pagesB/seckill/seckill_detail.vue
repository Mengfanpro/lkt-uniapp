<template>
    <div class="order_ii">
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus" v-on:cancle="cancle"></lktauthorize>
        <div ref='box' id="boxs"  >
            <!-- #ifndef MP  -->
            <!-- <heads :title='language.seckill.details.title'></heads> -->
            <div class="heads" @click='_toSkill'>
                <div class="head-img" >
                    <img :src="back1"></image>
                </div>
            </div>
            <!-- #endif -->

            <!--  轮播图   -->
            <div class='relative'>
                <view class="yyy"></view>

                <swiper class='swiperBox' @change='weiperChange'>
                    <swiper-item v-for='img in pro.img_arr' :key='img.id'>
                        <img class="swipe swiper_img" :src="img"/>
                    </swiper-item>
                </swiper>
                <div class='swiper_index' v-if='pro.img_arr'>
                    {{swiperIndex}}/{{pro.img_arr?pro.img_arr.length:1}}
                </div>

                <view class="losebox" v-if="navType == 0">
                    <!-- <image :src="shixiao"></image> -->
                    <img :src="shixiao">
                </view> 
            </div>
           <!-- <div class='load' v-if='load' :style="{top: halfWidth}">
                <div>
                    <img class='load_img1' :src="load_img"/>
                    <p>{{language.seckill.details.Loading}}</p>
                </div>
            </div> -->

            <div class='goods_name'>
                <div class='goods_price'>
                    <view class="df aic">

                        <view class="i-money" v-if="pro.price">
                            <span>￥</span>
                            <span class="p-price">{{pro.price.toFixed(2)}}</span>
                        </view>

                        <view>
                            <view class="b-money" v-if="pro.yprice">
                                ¥{{pro.yprice.toFixed(2)}}
                            </view>

                            <view class="c-money">
                                {{language.seckill.details.limit}}{{ pro.max_num || '0' }}{{language.seckill.details.piece}}，{{language.seckill.details.Only}}{{ pro.num || '0' }}{{language.seckill.details.piece}}
                            </view>
                        </view>


                    </view>

                    <view class="time-box">
                        <view class="" style="font-size: 24rpx;">
                            {{ navType == 0?language.seckill.details.Button[0]: navType == 1?language.seckill.details.Button[1]: navType == 2?language.seckill.details.Button[2]:language.seckill.details.Button[0] }}
                        </view>

                        <view class="time-text-body">
                            <!-- <span>{{pro.count_hour}}</span>:<span>{{pro.count_min}}</span>:<span>{{pro.count_s}}</span> -->
                            <span v-if="navType == 1 || navType == 2">{{ pro.djs }}</span>
                            <span v-else>00:00:00</span>
                        </view>
                    </view>
                </div>

                <p class="pro-name">{{pro.name}}</p>
                <div class="freight">
                    <span class="freight-price" v-if="pro.freight_name">{{language.seckill.details.freight}}：{{parseInt(pro.freight).toFixed(2)}}</span>
                    <div class="shares">
                        <img :src="fx_img"  @tap="showShare" />
                        <span>分享</span>
                    </div>
                </div>
                
            </div>

            <div class='hr'></div>


            <!--            <div class='guige' @tap="_shopping1()" ref="homeHead" >-->
            <!--                <span class='color_888'>选择</span>-->
            <!--                <span class='guige_name'>{{haveSkuBean.name}}</span>-->
            <!--                <img class='arrow' :src="you_img"/>-->
            <!--            </div>-->
            <!-- <div class='hr'></div>
             <div class="group_wf"></div> -->
            <div class='user gd_user' v-if='comments.length&&!bargain' @tap="_evaluate(pro_id)">
                <p>{{language.seckill.details.User_evaluation}}（{{commentsTotal}}）</p>
                <img class='arrow' :src="you_img"/>
            </div>
            <div class="comments" v-if="commentsTotal && !bargain">
                <div class="allCenter">
                    <img class="img" :src="comments[comments.length-1].user_name !== '匿名' ? comments[comments.length-1].headimgurl : niming" />
                    <span class="span">{{ comments[comments.length-1].user_name }}</span>
                </div>
                <div class="time">{{ comments[comments.length-1].add_time }}</div>
                <div class="disc">{{ comments[comments.length-1].content }}</div>
            </div>
            <div class='user' v-if='!comments.length&&!bargain'>
                <p class='font_30'>{{language.seckill.details.No_evaluation}}</p>
            </div>
            <div class='hr'></div>
            <div v-if='shop_list.shop_id' class='storeBox'>
                <div class='store store1'>
                    <div class='store1Div'>
                        <img class="store_image" :src='shop_list.shop_logo' :class="{ bargainLogo:bargain }">
                        <div>{{shop_list.shop_name}}</div>
                    </div>
                    <div class="store_right">
                        <!-- #ifdef MP-ALIPAY || MP-TOUTIAO || MP-BAIDU -->
                        <button open-type="share" class='shareBtn' @tap='showShareMask(shop_list.shop_id)'
                                id="copyshare"
                                :data-clipboard-text='shareHref'>
                            <div class='goStore store1Div sharestore'>{{language.seckill.details.Share_shop}}</div>
                        </button>
                        <!-- #endif -->
                        <!-- #ifndef MP-ALIPAY || MP-TOUTIAO || MP-BAIDU -->
                        <div class='goStore store1Div sharestore' @tap='showShareMask(shop_list.shop_id)' id="copyshare"
                             :data-clipboard-text='shareHref'>{{language.seckill.details.Share_shop}}
                        </div>
                        <!-- #endif -->
                        <div class='goStore store1Div' @tap='_goStore(shop_list.shop_id)'>{{language.seckill.details.Shop_in}}</div>
                    </div>

                </div>
                <div class='store store2 around'>
                    <div class='store2Div'>
                        <p>{{shop_list.quantity_on_sale}}</p>
                        <div>{{language.seckill.details.sale}}</div>
                        <div class="shuxian"></div>
                    </div>
                    <div class='store2Div'>
                        <p>{{shop_list.quantity_sold}}</p>
                        <div>{{language.seckill.details.Sold}}</div>
                        <div class="shuxian"></div>
                    </div>
                    <div class='store2Div'>
                        <p>{{shop_list.collection_num}}</p>
                        <div>{{language.seckill.details.num}}</div>
                    </div>
                </div>
            </div>

            <div class='hr'></div>
            <div class='goods_d' @tap="_goods_x" id="doogi">{{language.seckill.details.details}}</div>
            <!--  商品详情    -->
            <div class='content_d' id='content_d' v-if='goods_x'>
                <wxParse v-if='pro.content&&pro.content.length>0' :content="pro.content"></wxParse>
            </div>
            <!--  规格参数   -->
            <ul class='goods_spec' v-if='goods_g'>
                <li>
                    <div class="g_div">
                        <div>{{language.seckill.details.name}}：</div>
                    </div>
                    <p>{{pro.name}}</p>
                </li>
                <li>
                    <div class="g_div">
                        <div>{{language.seckill.details.name}}：</div>
                    </div>
                    <p>{{pro.brand_name}} * {{pro.cat_name}}</p>
                </li>
                <li>
                    <div class="g_div">
                        <div>{{language.seckill.details.Commodity_number}}：</div>
                    </div>
                    <p>{{pro_id}}</p>
                </li>
                <li>
                    <div class="g_div">
                        <div>{{language.seckill.details.classification}}：</div>
                    </div>
                    <p>{{pro.cat_name}}</p>
                </li>
                <li>
                    <div class="g_div">
                        <div>{{language.seckill.details.After_sale}}：</div>
                    </div>
                    <p>{{language.seckill.details.Tips[0]}}</p>
                </li>
            </ul>
            <div class='goods_foot' v-if='!bargain'>
                <div class="mask-seckill" v-if="navType==3">商品已经卖完啦~</div>
                <div class='goods_bottom'>

                    <!-- #ifndef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO-->
                    <!-- <div class='goods_one' @tap="kf(pro_id)">
                        <image class='image' :src="kf_img"></image>
                    </div> -->
                    <!-- #endif -->

                    <!-- #ifdef MP-WEIXIN -->
                    <!-- <div class='goods_one'>
                        <button class="kf_button_css" open-type="contact">
                            <image class='image' :src="kf_img"></image>
                        </button>
                    </div> -->
                    <!-- #endif -->

                    <!-- #ifdef MP-BAIDU  -->
                    <!-- <div class='goods_one'>
                        <button class="kf_button_css" open-type="contact" bindcontact="contactCB">
                            <image class='image' :src="kf_img"></image>
                        </button>
                    </div> -->
                    <!-- #endif -->

                    <div class='w_100'>
                        <div v-if='seckill_flag && pro.buyNum !== -1' class='goods_two w_100' @tap="_buy">{{language.seckill.details.start}}</div>
                        <div v-else class='goods_two w_100 background_999'>
                            {{pro.buyNum == -1 ? language.seckill.details.start : navType==3?language.seckill.details.start : navType==2?language.seckill.details.button2[0]:navType==0?language.seckill.details.button2[1]:language.seckill.details.button2[2]}}
                        </div>
                    </div>
                </div>
            </div>
            <div class='share' v-if="g_show">
                <div>
                    <img :src="top_img"/>
                </div>
            </div>
        </div>
        <!--  遮罩      -->
        <skus ref="attrModal" :buyNum="`${pro.buyNum}`" type="MS" @confirm="confirm"/>

        <div class='mask' @tap='_shareDiv' v-if='shareDiv'>
            <div class='allCenter mask_data'>
                <div class='mask_data_div' v-for='(item,index1) in shareWay' :key='index1' @tap='_invite(item.name)'>
                    <div><img class='share_img' :src="item.imgUrl" alt=""></div>
                    <span class='share_name'>{{item.name}}</span>
                </div>
            </div>
        </div>

        <div class="mask" v-if="saveEWM">
            <div class="shareEwm" v-if="saveEWM">
                <img :src="ewmImg" class="imgEwm">
                <img :src="close" class="close" @tap="_closeAllMask">
                <view class="saveEWMBtn" @tap="_downEWM()">
                    <img :src="saves" class="saves">
                    {{language.seckill.details.Save_picture}}
                </view>
            </div>
        </div>

        <!-- 分享弹框 -->
        <div class="mask" @tap="_closeAllMask" v-if="shareMask">
            <!-- 邀请链接的弹框 -->
            <div class="shareMask" @tap.stop>
        
                <div class="sharepyq">
                    <div class="shareIcon" @tap="copyLink" v-clipboard:copy="shareHref" id="copyshare"
                        :data-clipboard-text="shareHref">
                        <img class="h5-img" :src="copy_link" />
                        <!-- 二维码分享 -->
                        <p>{{ language.goods.goodsDet.Copy_link }}</p>
                    </div>
                    <div class="shareIcon" @tap="showSaveEWM('wx')">
                        <img class="h5-img" :src="erm_img" />
                        <!-- 二维码分享 -->
                        <p>{{ language.goods.goodsDet.QR }}</p>
                    </div>
                    <div class="clearfix"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    function InitTime(endtime){
        var dd,hh,mm,ss = null;
        var time = parseInt(endtime) - new Date().getTime();
        if(time<=0){
            return '结束'
        }else{
            dd = Math.floor(time / 60 / 60 / 24);
            hh = Math.floor((time / 60 / 60) % 24);
            mm = Math.floor((time / 60) % 60);
            ss = Math.floor(time  % 60);
            var str = dd+"天"+hh+"小时"+mm+"分"+ss+"秒";
            return str;
        }
    }
    import skus from '../../components/skus'
    import wxParse from '../../components/mpvue-wxparse/src/wxParse.vue'
    import {
        mapMutations,
        mapState
    } from 'vuex'
    // #ifdef H5
    import jQuery from '../../common/jquery.js'
    import {
        copyText
    } from "@/common/util";
    // #endif
    import {
        LaiKeTui_axios,
        LaiKeTuiInvite,
        LaiKeTuiShowSaveEWM,
        LaiKeTui_collection,
        LaiKeTui_shopping,
        LaiKeTuiGetCoupon,
        LaiKeTui_buy_handle,
        LaiKeTui_confirm,
        LaiKeTui_spec,
        LaiKeTuiShowState,
        LaiKeTuiSetTimeData,
        LaiKeTuiToBr,
        LaiKeTuiShopEWM,
    } from '../../static/js/goods/goodsDetailed.js'

    export default {
        data () {
            return {
                is_seckill: true,
                clicktimes: [],
                close: '',
                saves: '',
                hour: 0,
                mniuate: 0,
                second: 0,
                day: 0,
                attr_id: '',
                bargain: false,
                shop_list: [],
                option: '',
                overflow: 'scroll',
                mask_display1: false,
                fastTap: true,
                title: '秒杀商品',
                loadImg: true,
                shop_id: '',
                bback_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/bback.png',
                fx_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + '/images/icon/share.png',
                gw_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/gw.png',
                load_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/5-121204193R7.gif',
                you_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jiantouhei2x.png',
                kf_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/kefu.png',
                top_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/kaobei2x.png',
                guan_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/guanbi2x.png',
                wx_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/wechat.png',
                jian_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jian2x.png',
                jian_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jianhui2x.png',
                jia_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jia+2x.png',
                jia_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/add+2x.png',
                xing_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/xinghei2x.png?v='+Math.random(),
                xing_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/xinghui2x.png',
                erm_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/ewmShare.png',
                erm_pyq_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/wepyq.png',
                shixiao: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/shixiao.png',
                
                copy_link: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/copy_link.png',
                attrList: '',
                mask_display: false,
                num: '', //规格数量
                price: '', //规格价格
                imgurl: '', //规格图片
                pro: {}, //商品信息
                comments: '', //评价信息
                haveSkuBean: '', //选择规则属性
                numb: 1, //规格选择的数量
                collection: '', //收藏状态
                goods_x: true,
                goods_g: false,

                g_show: false, //回顶部显示
                load: true,
                shareMask: false,
                saveEWM: false,
                shares: {},
                shareContent: '一起来用来客推吧！', //分享的内容
                shareHref: '', //分享的链接
                shareHref2: '', //转发的链接
                sharehrefTitle: '一起来用来客推吧!', //分享的链接的标题
                sharehrefDes: '一起来用来客推吧!', //分享的链接的描述
                shareImg: '', //分享的图片
                shareDiv: false,
                pic: '',
                logo: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/lktlogo.png',
                pro_id: '',
                order_no: '',
                brStatus: '',
                bargain_id: '',
                ewmImg: '', //二维码图片
                login_status: '', //0:未登录；1已登录
                sNo_id: 0, //订单id
                show_rule: false, //是否显示规则
                shareMask_H5: false,
                h5_url: '',
                isfx: '',
                shareshop: 0,
                seckill: true,
                lefttime: 0, //活动剩余时间戳
                id: 0, //设置秒杀活动商品id
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
                    {
                        name: '二维码分享',
                        imgUrl: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/ewmShare.png'
                    },
                    // #endif
                ],
                allCartNum: 0, //购物车的总商品数
                status: '2',
                is_shop: false,
                headerplus: false,
                navType: 0, //0 活动结束， 1活动进行中， 2活动即将开始
                swiperIndex: 1, //轮播下标
                seckill_flag: true, //秒杀是否已经开始,true已经开始
                pages: 'pagesB', //表明模块为pagesB
                msNum: '', //秒杀商品库存
                selectedlist: '',
                pam: {},

                highKeys: {},
                skuName: 'SkuID',
                skuName1: 'Price',
                skuName2: 'Pic',
                skuName3: 'Stock',
                spliter: ',',
                sku_list: {},
                result: {},
                b_type: 0,
                
                countdown: null,
                back1: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/back2x_w.png',
                
                commentsTotal: 0
                
            }
        },
        computed: {
            halfWidth: function () {
                var gru = uni.getStorageSync('data_height') ? uni.getStorageSync('data_height') : this.$store.state.data_height
                var heigh = parseInt(gru)
                // #ifdef MP
                heigh = 0
                // #endif
                return heigh + 'px'
            },
            ...mapState({
                _cart_num: 'cart_num'
            })
        },
        mounted() {
            setInterval( ()=> {
                    var bbb = new Date().getTime();
                    var rightTime = this.countdown - parseInt(bbb)
                    if (rightTime > 0) {
                        var d = Math.floor(rightTime/1000/60/60/24)
                        var h = Math.floor((rightTime / 1000 / 60 / 60) % 24)
                        var m = Math.floor((rightTime / 1000 / 60) % 60)
                        var s = Math.floor((rightTime / 1000) % 60)
                    }
                    if(parseInt(d)>0){
                        h = 24*d + parseInt(h)
                    }
                    if(parseInt(h)<10){
                        h="0"+h;
                    }
                    if(parseInt(m)<10){
                        m="0"+m;
                    }
                    if(parseInt(s)<10){
                        s="0"+s;
                    }
                    var times = h + ":" + m + ":" + s
                    this.$set(this.pro,'djs',times);
            }, 1000);
        },
        onLoad (option) {
            console.log(option)
            var me = this
            me.option = option
            var url = uni.getStorageSync('h5_url');
            this.shareHref = url + 'pagesA/store/store?is_share=true&shop_id=' + option.pro_id + '&isfx=true&fatherId=' +
                uni.getStorageSync('user_id');
                
            if (option.b_type == 1) {
                this.b_type = 1;
            }
            me.fastTap = true
            me.LaiKeTuiCommon.getLKTApiUrl().then(() => {
                me.isfx = option.isfx
                if (option.productId) {
                    me.pro_id = option.productId
                } else if (option.pro_id) {
                    me.pro_id = option.pro_id
                }
                me.navType = option.navType
                me.id = option.id
                if (option.navType != 1) {
                    console.log('option.navType != 1')
                    me.seckill_flag = false
                }
                me.brStatus = option.brStatus
                me.attr_id = option.attr_id
                me.order_no = option.order_no
                me.sNo_id = option.sNo_id
                me.isbegin = option.isbegin
                if (me.pro_id == '' || me.pro_id == undefined) {
                    me.pro_id = me.$store.state.pro_id
                }

                me.hasorder = option.hasorder
                uni.setStorageSync('fatherId', option.fatherId)
                me._axios()
            })
        },
        onShow () {
            var me = this
            this.allCartNum = this.$store.state.cart_num
            this.close = this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/close_bb.png'
            this.saves = this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/save.png'
            me.fastTap = true
            
            this.haveSkuBean = ''

            if (me.pro_id) {
                me._axios()
            }

            this.$nextTick(function () {
                uni.getProvider({
                    service: 'share',
                    success: function (res) {
                        console.log(res.provider)
                    }
                })
            })
        },
        //转发
        onShareAppMessage: function (res) {
            if (this.login_status == 0) {
                uni.navigateTo({
                    url: '/pages/login/login?landing_code=1'
                })
            } else {
                if (res.from === 'button') {

                }
                return {
                    title: this.sharehrefTitle,
                    path: this.shareHref2 + '&isfx=true&fatherId=' + me.pro.user_id,
                    imageUrl: this.shareImg,
                    bgImgUrl: this.shareImg,
                    success : () => {
                        this.shareHref2 = '/pages/goods/goodsDetailed?productId=' + this.pro_id
                    }
                }
            }
        },
        methods: {
            showShare(){
                this.shareMask = true
            },
            copyLink() {
                copyText('', this.shareHref3);
                uni.showToast({
                    title: this.language.goods.goodsDet.copy_success,
                    duration: 1500,
                    icon: 'none'
                });
                this.shareMask = false;
            },
            showSaveEWM(string) {
                this.shareMask = false;
                LaiKeTuiInvite(string, this);
            },
            _toSkill () {
                uni.navigateTo({
                    url: '/pagesB/seckill/seckill'
                })
            },
            /*
                 ——————sku核心算法 开始——————
             */
            powerset(arr) {
                let ps = [[]];
                for (let i = 0; i < arr.length; i++) {
                    for (let j = 0, len = ps.length; j < len; j++) {
                        ps.push(ps[j].concat(arr[i]));
                    }
                }

                return ps;
            },

            /**
             * 初始化数据
             * @return
             */
            initData() {
                this.result = {};
                this.keys = this.getAllKeys(); //arrKeys["颜色", "尺码", "型号"]

                for (let i = 0; i < this.keys.length; i++) {
                    this.highKeys[this.keys[i]] = false; //所有的都为false
                }

                this.sku_list = this.combineAttr(this.skuBeanList, this.keys);

                // this.initSeleted(this.SkuID);
                // this.initSeleted(this.Pic);
                // this.initSeleted(this.Price);
                // this.initSeleted(this.Stock);
                this.buildResult(this.sku_list.items);
                this.updateStatus(this.getSelectedItem(), true);


                // 初始筛选出库存为0的属性
                let filterObj = {}
                for(let i in this.result){
                    if((!i.includes(',')) && this.result[i].skus.Stock == 0){
                        filterObj[i] = this.result[i]
                    }
                }

                for(let i in this.sku_list.result){

                    for(let k in this.sku_list.result[i]){

                        for(let j in filterObj){
                            if(k == j){
                                this.sku_list.result[i][k].disabled = true
                            }
                        }

                    }

                }
                // 筛选结束

                this.showResult();
            },

            /**
             * 正常属性点击
             */
            handleNormalClick(key, value) {
                let list = JSON.parse(JSON.stringify(this.sku_list));

                for (let i in list.result[key]) {
                    if (i != value.name) {
                        list.result[key][i].active = false;
                    } else {
                        list.result[key][i].active = true;
                    }
                }

                this.sku_list = list;
            },

            /**
             * 无效属性点击
             */
            handleDisableClick(key, value) {
                this.sku_list.result[key][value.name]['disabled'] = false;
                // 清空高亮行的已选属性状态（因为更新的时候默认会跳过已选状态）
                for (let i in this.sku_list.result) {
                    if (i != key) {
                        for (let x in this.sku_list.result[i]) {
                            this.sku_list.result[i][x].active = false;
                        }
                    }
                }

                this.updateStatus(this.getSelectedItem());
            },

            /**
             * 高亮行
             */
            highAttributes: function() {
                for (let key in this.sku_list.result) {
                    this.highKeys[key] = true;
                    for (let attr in this.sku_list.result[key]) {
                        if (this.sku_list.result[key][attr].active === true) {
                            this.highKeys[key] = false;
                            break;
                        }
                    }
                }
            },

            /**
             * 点击事件处理
             * @param  key   点击的行
             * @param  value 点击的按钮的数据
             */
            handleActive: function(key, value) {
                if(value.disabled === true){
                    uni.showToast({
                        title: this.language.seckill.details.Tips[1],
                        icon: 'none'
                    })
                    return
                }

                if (value.active == true) {
                    return false;
                }

                this.handleNormalClick(key, value);
                if (value.disabled === true) {
                    this.handleDisableClick(key, value);
                }

                this.updateStatus(this.getSelectedItem());
                this.highAttributes();
                this.showResult();
            },

            /**
             * 计算属性
             * @param  {[type]} data [description]
             * @param  {[type]} keys [description]
             * @return {[type]}      [description]
             */
            combineAttr(data, keys) {
                let allKeys = [];
                let result = {};

                for (let i = 0; i < data.length; i++) {
                    let item = data[i];
                    let values = [];

                    for (let j = 0; j < keys.length; j++) {
                        let key = keys[j];
                        if (!result[key]) {
                            result[key] = {};
                        }

                        if (!result[key][item[key]]) {
                            result[key][item[key]] = { name: item[key], active: false, disabled: item['Stock'] > 0 ? false : true };
                        }

                        values.push(item[key]);
                    }

                    allKeys.push({
                        path: values.join(this.spliter),
                        sku: item['SkuID'],
                        price: item['Price'],
                        Pic: item['Pic'],
                        Stock: item['Stock']
                    });
                }

                return {
                    result: result,
                    items: allKeys
                };
            },

            isJSON(str) {
                if (typeof str == 'string') {
                    try {
                        var obj = JSON.parse(str);
                        return true;
                    } catch (e) {
                        console.log('error：' + str + '!!!' + e);
                        return false;
                    }
                }
            },

            /**
             * 获取所有属性
             * @return {[type]} [description]
             */
            getAllKeys() {
                let arrKeys = [];
                for (let attribute in this.skuBeanList[0]) {
                    if (!this.skuBeanList[0].hasOwnProperty(attribute)) {
                        continue;
                    }

                    if (attribute !== this.skuName && attribute !== this.skuName1 && attribute !== this.skuName2 && attribute !== this.skuName3) {
                        arrKeys.push(attribute);
                    }
                }

                if(arrKeys.length == 0){
                    arrKeys = ["undefined"]
                    this.skuBeanList[0]["undefined"] = "undefined"
                }

                return arrKeys;
            },

            getAttruites(arr) {
                let result = [];
                for (let i = 0; i < arr.length; i++) {
                    result.push(arr[i].path);
                }

                return result;
            },

            /**
             * 生成所有子集是否可选、库存状态 map
             */
            buildResult(items) {
                let allKeys = this.getAttruites(items);

                let attr = {};
                //价格 , 库存, 图片 赋值
                for (let i = 0; i < allKeys.length; i++) {
                    let curr = allKeys[i];
                    let sku = items[i].sku;
                    let Pic = items[i].Pic;
                    let price = items[i].price;
                    let Stock = items[i].Stock;
                    let values = curr.split(this.spliter);
                    let allSets = this.powerset(values);

                    // 每个组合的子集
                    for (let j = 0; j < allSets.length; j++) {
                        let set = allSets[j];
                        let key = set.join(this.spliter);
                        if (key && !this.result[key]) {
                            this.result[key] = {
                                skus: { sku, Pic, price, Stock }
                            };

                            if ((!key.includes(',') && !attr[key]) || (key.includes(',') && key.split(',').length < allKeys[i].split(',').length)) {
                                attr[key] = {
                                    skus: { sku, Pic, price, Stock }
                                };
                            }
                        }
                    }
                }

                for (let i in attr) {
                    attr[i].skus.Stock = 0;
                    for (let k in this.result) {
                        if (i != k && k.split(',').length == allKeys[0].split(',').length && k.includes(i)) {
                            attr[i].skus.Stock += Number(this.result[k].skus.Stock);
                        } else if (k.split(',').length == allKeys[0].split(',').length) {
                            let flag = [];

                            k.split(',').filter(item => {
                                i.split(',').filter(it => {
                                    if (item == it) {
                                        flag.push(true);
                                    }
                                });
                            });

                            if (flag.length == i.split(',').length) {
                                attr[i].skus.Stock += Number(this.result[k].skus.Stock);
                            }
                        }
                    }
                }

                Object.assign(this.result, attr);
            },

            /**
             * 获取选中的信息
             * @return Array
             */
            getSelectedItem() {
                let result = [];
                for (let attr in this.sku_list.result) {
                    let attributeName = '';
                    for (let attribute in this.sku_list.result[attr]) {
                        if (this.sku_list.result[attr][attribute].active === true) {
                            attributeName = attribute;
                        }
                    }

                    result.push(attributeName);
                }

                return result;
            },

            /**
             * 更新所有属性状态
             */
            updateStatus(selected, type) {
                for (let i = 0; i < this.keys.length; i++) {
                    let key = this.keys[i],
                        data = this.sku_list.result[key],
                        hasActive = !!selected[i],
                        copy = selected.slice();

                    for (let j in data) {
                        let item = data[j]['name'];
                        if (selected[i] == item) {
                            continue;
                        }

                        copy[i] = item;
                        let curr = this.trimSpliter(copy.join(this.spliter), this.spliter);

                        if (type) {
                            this.sku_list.result[key][j]['disabled'] = this.result[curr] ? false : true;
                        } else {
                            this.sku_list.result[key][j]['disabled'] = this.result[curr].skus.Stock > 0 ? false : true;
                        }
                    }
                }
            },

            trimSpliter(str, spliter) {
                let reLeft = new RegExp('^' + spliter + '+', 'g');
                let reRight = new RegExp(spliter + '+$', 'g');
                let reSpliter = new RegExp(spliter + '+', 'g');
                return str
                    .replace(reLeft, '')
                    .replace(reRight, '')
                    .replace(reSpliter, spliter);
            },

            /**
             * 初始化选中
             * @param  mixed|Int|String SkuID 需要选中的SkuID
             * @return {[type]}       [description]
             */
            initSeleted(a) {
                for (let i in this.skuBeanList) {
                    if (this.skuBeanList[i][this.skuName] == a) {
                        for (let x in this.skuBeanList[i]) {
                            if (x !== this.skuName && x !== this.skuName1 && x !== this.skuName2 && x !== this.skuName3) {
                                this.sku_list.result[x][this.skuBeanList[i][x]].active = true;
                            }
                        }
                        break;
                    }
                }
            },

            /**
             * 显示选中的信息
             * @return
             */
            showResult() {
                let result = this.getSelectedItem();
                let s = [];
                for (let i = 0; i < result.length; i++) {
                    let item = result[i];
                    if (!!item) {
                        s.push(item);
                    }
                }

                if (s.length > 0) {
                    this.num = this.result[s.join(this.spliter)].skus.Stock;
                }

                if (s.length == this.keys.length) {
                    let curr = this.result[s.join(this.spliter)];
                    if (curr) {
                        this.SkuID = curr.skus.sku;
                        this.Pic = curr.skus.Pic;
                        this.price = curr.skus.price;
                        this.Stock = curr.skus.Stock;

                        if(Number(this.numb)>Number(this.Stock)){
                            this.numb = Number(this.Stock)
                        }
                    }

                    this.haveSkuBean = {
                        name: s.join(this.spliter),
                        cid: curr.skus.sku,
                        skus: curr.skus
                    };
                } else {
                    this.haveSkuBean = '';
                }
            },

            /* 
                ——————sku核心算法 结束——————
           */

            setHead () {
                const query = uni.createSelectorQuery().in(this)
                query.select('#boxs').boundingClientRect(data => {
                    if (data.top > -20) {
                        this.headerplus = false
                    } else if (data.top < -20) {
                        this.headerplus = true
                    }
                }).exec()
            },
            //授权取消按钮
            cancle () {
                this.fastTap = true
            },
            changeLoginStatus () {
                this.login_status = 1
                this.fastTap = true

                this._axios()
            },
            copy_url () {
                this.shareMask_H5 = true
                this.h5_url = this.shareHref
            },
            copyH5Url () {
                var me = this
                jQuery('#h5_input input').select()
                document.execCommand('Copy')
            },
            lodingPay (sNo_id) {
                uni.navigateTo({
                    url: '../../pages/order/order?order_id=' + sNo_id + '&showPay=true'
                })
            },
            goPay () {
                var me = this
                var product = []
                product.push({
                    pid: this.pro_id
                })
                product.push({
                    cid: this.attr_id
                })
                product.push({
                    num: 1
                })
                product = JSON.stringify(product)
                let url = '/pagesB/seckill/seckillDetailsr?product=' + product + '&bargain=true&bargain_id=' + me.bargain_id +
                    '&order_no=' + me.order_no;
                if (this.b_type == 1) {
                    url += '&b_type=1'
                }
                uni.navigateTo({
                    url: url
                })
            },
            toBrFirst () {
                uni.navigateTo({
                    url: '/pagesA/bargain/bargain?topTabBar=true'
                })
            },
            toBr () {
                var me = this
                LaiKeTuiToBr(me)
            },
            _goStore (shop_id) {
                uni.navigateTo({
                    url: '/pagesA/store/store?shop_id=' + shop_id
                })
            },
            _loadImg () {
                this.loadImg = true
            },
            _closeAllMask () {
                this.shareMask = false
                this.saveEWM = false
                this.shareMask_H5 = false
                this.overflow = 'scroll'
            },
            _shareDiv () {
                this.shareDiv = false
            },
            _invite (type) {
                var me = this
                LaiKeTuiInvite(type, me)
            },
            _goback () {
                // #ifdef H5
                uni.navigateBack({
                    delta: 1
                })
                // #endif
                // #ifndef H5
                if (this.isfx == 'true') {
                    uni.reLaunch({
                        url: '/pages/tabBar/home'
                    })
                    return false
                } else {
                    uni.navigateBack({
                        delta: 1
                    })
                }
                // #endif
            },
            _downEWM () {
                let me = this
                uni.downloadFile({
                    url: me.ewmImg,
                    success: function (sres) {
                        console.log(sres.tempFilePath)
                        uni.saveImageToPhotosAlbum({
                            filePath: sres.tempFilePath,
                            success: function () {
                                uni.showToast({
                                    title: me.language.seckill.details.Tips[2],
                                    duration: 1500,
                                    icon: 'none'
                                })
                            },
                        })
                    },
                    fail: function () {
                        uni.showToast({
                            title: me.language.seckill.details.Tips[3],
                            duration: 1500,
                            icon: 'none'
                        })
                    },
                })
            },
            _shareApp (type) {
                var me = this
                var scene = ''
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
            },

            showShareMask (shop) {
                var me = this
                if (shop && shop > 0) {
                    me.is_shop = true
                    me.shop_id = shop
                    me.sharehrefTitle = me.shop_list.shop_name
                    me.shareImg = me.shop_list.shop_logo
                    me.shareContent = me.shop_list.shop_name
                    var url = uni.getStorageSync('h5_url')
                    me.shareHref = url + 'pagesA/store/store?is_share=true&shop_id=' + shop + '&isfx=true&fatherId=' + uni.getStorageSync('user_id');
                    me.shareHref2 = '../../pagesA/store/store?is_share=true&shop_id=' + shop + '&isfx=true&fatherId=' + uni.getStorageSync('user_id');
                } else {
                    me.is_shop = false
                    me.shareHref2 = '/pages/goods/goodsDetailed?productId=' + me.pro_id + '&isfx=true&fatherId=' + uni.getStorageSync('user_id');
                    me.sharehrefTitle = me.pro.name
                    me.shareImg = me.imgurl
                    me.shareContent = me.pro.name
                    var url = uni.getStorageSync('h5_url')
                    me.shareHref = url + 'pages/index/share?pages=goodsDetailed&productId='  + '&isfx=true&fatherId=' + uni.getStorageSync('user_id');
                }
                this.isLogin(()=>{
                    // #ifdef H5
                    var Clipboard = require('../../common/clipboard.js')
                    if (shop && shop > 0) {
                        var clipboard = new Clipboard('#copyshare')
                    } else {
                        var clipboard = new Clipboard('#copyy')
                    }
                    console.log(clipboard)
                    clipboard.on('success',() => {
                        console.log('--复制分享链接成功--'.e)
                        uni.showToast({
                            title: this.language.seckill.details.Tips[4],
                            duration: 1000,
                            icon: 'none'
                        })
                    })
                    clipboard.on('error', () => {
                        console.log('--复制分享链接失败--'.e)
                        uni.showToast({
                            title: this.language.seckill.details.Tips[5],
                            duration: 1000,
                            icon: 'none'
                        })
                        document.querySelector('.copy')
                    })
                    // #endif

                    // #ifndef H5
                    // #ifdef MP-WEIXIN
                    me.shareMask = true
                    // #endif
                    // #ifndef MP-WEIXIN
                    // #ifndef MP-ALIPAY || MP-TOUTIAO || MP-BAIDU
                    me.shareDiv = true
                    // #endif
                    // #endif
                    // #endif
                })
            },
            closeShareMask () {
                this.shareMask = false
                this.overflow = 'scroll'
            },
            showSaveEWM (string) {
                this.shareMask = false
                var me = this
                if (me.is_shop) {
                    LaiKeTuiShopEWM(string, me)
                } else {
                    LaiKeTuiShowSaveEWM(string, me)
                }
            },
            kf (pro_id) {
                var me = this
                this.isLogin(()=>{
                    uni.navigateTo({
                        url: '/pages/message/service?pid=' + pro_id
                    })
                })
            },
            _reduce () {
                if (this.numb > 1 && Boolean(this.haveSkuBean)) {
                    this.numb--
                } else {
                    if (!this.haveSkuBean) {
                        uni.showToast({
                            title: this.language.seckill.details.Tips[6],
                            duration: 1000,
                            icon: 'none'
                        })
                    } else {
                        this.numb == 1
                        uni.showToast({
                            title: this.language.seckill.details.Tips[7],
                            duration: 1000,
                            icon: 'none'
                        })
                    }
                }
            },
            _add () {
                this.num = this.pro.num
                console.log(this.num)

                if (this.numb >= (this.pro.buy_num - this.pro.purchased)) {
                    uni.showToast({
                        title: this.language.seckill.details.Tips[9] + this.pro.buy_num + this.language.seckill.details.piece,
                        duration: 1000,
                        icon: 'none'
                    })
                } else if (this.numb >= this.pro.num) {
                    uni.showToast({
                        title: this.language.seckill.details.Tips[8],
                        duration: 1000,
                        icon: 'none'
                    })
                } else if (this.numb < this.num && this.numb < this.pro.buy_num && Boolean(this.haveSkuBean)) {
                    this.numb++
                } else {
                    if (!this.haveSkuBean) {
                        uni.showToast({
                            title: this.language.seckill.details.Tips[6],
                            duration: 1000,
                            icon: 'none'
                        })
                    } else if (this.numb < (this.pro.buy_num - this.pro.purchased)) {
                        uni.showToast({
                            title: this.language.seckill.details.Tips[9] + this.pro.buy_num + this.language.seckill.details.piece,
                            duration: 1000,
                            icon: 'none'
                        })
                    } else {
                        uni.showToast({
                            title: this.language.seckill.details.Tips[10],
                            duration: 1000,
                            icon: 'none'
                        })
                    }
                }
            },
            _load_img () {
                this.load = false
            },
            _goods_x () {
                this.goods_x = true
                this.goods_g = false
            },
            _goods_g () {
                this.goods_x = false
                this.goods_g = true
            },
            ...mapMutations({
                cart_id: 'SET_CART_ID',
                order_id: 'SET_ORDER_ID',
                address_id: 'SET_ADDRESS_ID',
                pay_lx: 'SET_PAY_LX',
                cart_num: 'SET_CART_NUM'
            }),
            _evaluate (pro_id) {
                var me = this
                if (this.bargain) {
                    uni.navigateTo({
                        url: '/pages/evaluate/evaluate?bargain=true&pid=' + pro_id
                    })
                } else {
                    uni.navigateTo({
                        url: '/pages/evaluate/evaluate?pid=' + pro_id
                    })
                }
            },

            //收藏
            _collection () {
                var me = this
                LaiKeTui_collection(me)
            },
            //规格选择
            _selectG () {
                this.type = 1
                this._mask_display()
            },
            //加入购物车
            _shopping () {
                var me = this
                if (me.status == 2) {
                    LaiKeTui_shopping(me)
                } else {
                    uni.showToast({
                        title: this.language.seckill.details.Tips[11],
                        icon: 'none'
                    })
                }
            },
            _shopping1 () {
                if (this.navType == 0) {
                    uni.showToast({
                        title: this.language.seckill.details.Tips[12],
                        icon: 'none'
                    })
                    return false
                } else if (this.navType == 2) {
                    uni.showToast({
                        title:this.language.seckill.details.Tips[13],
                        icon: 'none'
                    })
                    return false
                }
                if (this.pro.buy_num <= this.pro.purchased) {
                    uni.showToast({
                        title: this.language.seckill.details.Tips[9] + this.pro.buy_num + this.language.seckill.details.piece,
                        icon: 'none'
                    })
                    return false
                }
                this.type = 1
                this.fastTap = true
                this.price = this.pro.price
                this._mask_display()
            },
            getCoupon () {
                var me = this
                LaiKeTuiGetCoupon(me)
            },
            _buy () {
                var me = this

                if (this.pro.buy_num <= this.pro.purchased) {
                    uni.showToast({
                        title: this.language.seckill.details.Tips[9] + this.pro.buy_num + this.language.seckill.details.piece,
                        icon: 'none'
                    })
                    return false
                }

                if (me.status == 2) {
                    me.price = me.pro.price
                    me.LaiKeTuiCommon.laiketuiNoDoublePress(me, me._buy_handle)
                } else {
                    uni.showToast({
                        title: this.language.seckill.details.Tips[11],
                        icon: 'none'
                    })
                }
            },
            //立即购买
            _buy_handle () {
                var me = this
                LaiKeTui_buy_handle(me)
            },
            //打开遮罩层
            _mask_display () {
                this.mask_display = true
                this.overflow = 'hidden'
            },
            //关闭遮罩层
            _mask_false () {
                this.overflow = 'scroll'
                var me = this
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
            _mask_f () {
                this.haveSkuBean = ''
                this.initData()
                this._mask_false()
                this.overflow = 'scroll'
            },
            //确认
            confirm(sku){
                Object.assign(this.$data,sku)
                this._confirm()
            },
            _confirm () {
                var me = this
                LaiKeTui_confirm(me)
            },
            _spec () {
                var me = this
                LaiKeTui_spec(me)
            },
            //选择属性
            showState (index, indx) {
                var me = this
                LaiKeTuiShowState(me, index, indx)
            },
            _axios () {
                var me = this
                LaiKeTui_axios(me)
            },
            timeout () {
                let me = this
                uni.showToast({
                    title: this.language.seckill.details.Tips[14],
                    duration: 1000,
                    icon: 'none'
                })
                setTimeout(function () {
                    me.fastTap = true
                    me.haveSkuBean = ''
                    me.login_status = 0
                    uni.navigateTo({
                        url: '../login/login'
                    })
                }, 1000)
            },
            // 轮播图下标
            weiperChange (e) {
                this.swiperIndex = e.detail.current + 1
            },
            _remain_time (item) {
                var timeStr = '' //转换后的时间字符串
                var secondTime = item.lefttime //剩余时间的秒数
                var minuteTime = '0' //剩余时间的分钟数
                var hourTime = '0' //剩余时间的小时数
                //如果秒数大于60，将秒数转换成整数
                if (secondTime > 60) {
                    //获取分钟，除以60取整数，得到整数分钟
                    minuteTime = parseInt(secondTime / 60)
                    //获取秒数，秒数取佘，得到整数秒数
                    secondTime = parseInt(secondTime % 60)
                    //如果分钟大于60，将分钟转换成小时
                    if (minuteTime > 60) {
                        //获取小时，获取分钟除以60，得到整数小时
                        hourTime = parseInt(minuteTime / 60)
                        //获取小时后取佘的分，获取分钟除以60取佘的分
                        minuteTime = parseInt(minuteTime % 60)
                    }
                }

                item.count_hour = hourTime < 10 ? ('0' + hourTime) : hourTime
                item.count_min = minuteTime < 10 ? ('0' + minuteTime) : minuteTime
                item.count_s = secondTime < 10 ? ('0' + secondTime) : secondTime
                this.pro = item
                this.msNum = this.pro.num
                this._setTime()
            },
            _setTime () {
                var me = this
                clearTimeout(me.settime)
                me.settime = setTimeout(() => {
                    if (me.pro.lefttime > 0) {
                        me.pro.lefttime--
                        me._remain_time(me.pro)
                    }
                    if (me.pro.lefttime == 0) {
                        me.navType = 0
                        me.seckill_flag = false
                        return
                    }
                    me._setTime()
                }, 1000)
            }
        },
        components: {
            wxParse,
            // #ifdef H5
            jQuery,
            // #endif
            skus,
        }
    }
</script>

<style lang="less" scoped>
    @import "../../static/css/seckill/seckill_detail.less";
</style>
