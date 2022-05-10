<template>
    <div class="order_ii goodsDetail" >
        <view class="onReachBottomBg"></view>
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus" v-on:cancle="cancle"></lktauthorize>
        <div ref="box" id="boxs" class="relative" @touchmove="setHead">
            <template v-if="bargain">
                <heads :title="language.goods.goodsDet.Commodity_details" :is_kj="is_kj" :rightText="language.goods.goodsDet.rule" @right-click="_goRule"></heads>
            </template>
            <template v-else>
                <heads :title="language.goods.goodsDet.Commodity_details"></heads>
                <!-- :class="{ gd_headerplus: headerplus }" -->
                <div class="gd_header"  :style="{ top: halfWidth }">
                    <!-- #ifdef MP-ALIPAY || MP-TOUTIAO || MP-BAIDU -->
                    <button @tap="showShareMask" v-if="!isDistribution || ( isDistribution &&  pro.canbuy)" id="copyy copyy1" :data-clipboard-text="share.shareHref" class="gd_card gd_card-bto" open-type="share"><img :src="fx_img" /></button>
                    <!-- #endif -->
                    <!-- #ifndef MP-ALIPAY || MP-TOUTIAO || MP-BAIDU -->
                    <img v-if="!bargain &&  (!isDistribution || ( isDistribution &&  pro.canbuy > 0))" :src="fx_img" class="gd_card"  @tap="showShareMask" />
                    <!-- #endif -->

                    <img v-if="isDistribution == false && active != 6" :src="gw_img" class="gd_share" @tap="navSwitchTab('/pages/tabBar/shoppingCart')" />
                    <div class="cartnum" v-if="isDistribution == false && allCartNum && active != 6">{{ allCartNum }}</div>
                </div>
            </template>
            
            <div class="skeleton">
                <!-- 有数据 -->
                <div v-if="loadFlag">
                    <!--  轮播图   -->
                    <div class="relative">
                        <div class="kanjiaNull" v-if="(bargain && leftTime <= 0) || brStatus == -1"><img :src="list_end" mode="" /></div>
                        <swiper class="swiper" @change="swiperChange">
                            <swiper-item v-for="img in pro.img_arr" :key="img.id"><img class="swipe" :src="img" /></swiper-item>
                        </swiper>
                        <div class="swiperIndex">{{ swiperIndex }}/{{ pro.img_arr && pro.img_arr.length }}</div>
                    </div>
                    <!-- 非砍价商品价格和名称 -->
                    <div class="goods_name" v-if="!bargain">
                        <template v-if="active == 1 && !isDistribution">
                            <p class="goods_price" >
                                <span class="span">￥</span>
                                {{ pro.vip_yprice }}                          
                            </p>
                        </template>
                        <template v-else>
                            <p class="goods_price">
                                <span class="span">￥</span>
                                {{ pro.is_distribution && pro.is_distribution == 1 ? pro.vip_yprice : pro.price }}                    
                            </p>
                        </template>
                        <p class="goods_proName">{{ pro.name }}</p>
                        <div class="volume">
                            <span>{{language.goods.goodsDet.sales}}{{ pro.volume }}</span>
                            <span>{{language.goods.goodsDet.freight}}：{{ pro.yunfei }}</span>
                        </div>
                    </div>
                    <!-- 砍价商品价格和名称 -->
                    <div class="goods_name goods_bargain_name" v-else>
                        <p class="goods_price">
                            {{ cs_num }}{{language.goods.goodsDet.Bargaining_success}}
                            <span class="cs_yprice">{{ cs_yprice }}</span>
                            <span class="cs_price">{{ cs_price }}</span>
                        </p>
                        <p>{{ pro.name }}</p>
                    </div>
                    <div class="hr" v-if="isDistribution == false && !bargain && active != 6 && coupon_status == true && coupon_str.length>0"></div>
                    <div class="coupon" @tap="getCoupon()" v-if="isDistribution == false && !bargain && active != 6 && coupon_status == true && coupon_str.length>0">
                        <span>{{language.goods.goodsDet.Collect_coupons}}</span>
                        <div>
                            <div v-for="(item, index) in coupon_str" :key="index" class="coupon_data" :style="'background-image:url(' + coupon_img + ')'">{{ item }}</div>
                        </div>
                        <img class="arrow" :src="you_img" />
                    </div>
                    <div class="hr"></div>
                    <!-- 非砍价商品选择商品规格 -->
<!--                    <div v-if="!bargain" class="guige" @tap="_shopping1()" ref="homeHead">-->
<!--                        <span>{{ haveSkuBean == '' ? '选择商品规格' : haveSkuBean.name }}</span>-->
<!--                        <img class="arrow" :src="you_img" />-->
<!--                    </div>-->
                    <!-- <div v-if="!bargain" class="hr"></div> -->
                    <div class="user gd_user" v-if="commentsTotal && !bargain" @tap="_evaluate(pro_id)">
                        <p>{{language.goods.goodsDet.User_evaluation}}（{{ commentsTotal }}）</p>
                        <img class="arrow" :src="you_img" />
                    </div>
                    <div class="comments" v-if="commentsTotal && !bargain">
                        <div class="allCenter">
                            <img class="img" :src="comments[comments.length-1].user_name !== '匿名' ? comments[comments.length-1].headimgurl : niming" />
                            <span class="span">{{ comments[comments.length-1].user_name }}</span>
                        </div>
                        <div class="time">{{ comments[comments.length-1].add_time }}</div>
                        <div class="disc">{{ comments[comments.length-1].content }}</div>
                    </div>
                    <div class="user" v-if="!commentsTotal && !bargain"><p style="font-size: 30rpx;">{{language.goods.goodsDet.No_evaluation}}</p></div>
                    <!-- 砍价页面显示 -->
                    <div v-if="bargain">
                        <div v-if="comments.length > 0" class="user gd_user" @tap="_evaluate(pro_id)">
                            <p>{{language.goods.goodsDet.sheets}}（{{ comments.length }}）</p>
                            <img class="arrow" :src="you_img" />
                        </div>
                        <div v-else class="user gd_user">
                            <p>{{language.goods.goodsDet.sheets}}（0）</p>
                            <img class="arrow" :src="you_img" />
                        </div>
                        <template v-if="comments.length">
                            <div class="comments" v-for="(item, index) in comments" :key="index">
                                <div class="allCenter">
                                    <img class="img" :src="item.headimgurl ? item.headimgurl : niming" />
                                    <span class="span">{{ item.user_name }}</span>
                                </div>
                                <div class="time">{{ item.add_time }}</div>
                                <div class="disc">{{ item.content }}</div>
                            </div>
                        </template>
                        <div class="user" v-if="comments.length <= 0"><p class="font_30">{{language.goods.goodsDet.No_evaluation}}</p></div>
                    </div>
                    <div class="hr"></div>
                    <div class="shop_list" v-if="shop_list.shop_id">
                        <div class="store store1">
                            <div class="store1Div">
                                <img :src="shop_list.shop_logo" :class="{ bargainLogo: bargain }" />
                                <div>{{ shop_list.shop_name }}</div>
                            </div>
                            <div class="store_right">
                                <!-- #ifdef MP-ALIPAY || MP-TOUTIAO || MP-BAIDU -->
                                <button class="share_btn" open-type="share" @tap="showShareMask(shop_list.shop_id)" id="copyshare" :data-clipboard-text="share.shareHref">
                                    <div class="goStore store1Div sharestore">{{language.goods.goodsDet.share_shop}}</div>
                                </button>
                                <!-- #endif -->
                                <!-- #ifndef MP-ALIPAY || MP-TOUTIAO || MP-BAIDU -->
                                <div
                                    class="goStore store1Div sharestore"
                                    v-clipboard:copy="share.shareHref"
                                    @tap="showShareMask(shop_list.shop_id)"
                                    id="copyshare"
                                    :data-clipboard-text="share.shareHref"
                                >
                                    {{language.goods.goodsDet.share_shop}}
                                </div>
                                <!-- #endif -->
                                <div class="goStore store1Div" @tap="_goStore(shop_list.shop_id)">{{language.goods.goodsDet.Shop_in}}</div>
                            </div>
                        </div>
                        <div class="store store2">
                            <div class="store2Div">
                                <p>{{ shop_list.quantity_on_sale }}</p>
                                <div>{{language.goods.goodsDet.Goods_sale}}</div>
                                <div class="shuxian"></div>
                            </div>
                            <div class="store2Div">
                                <p>{{ shop_list.quantity_sold }}</p>
                                <div>{{language.goods.goodsDet.Sold}}</div>
                                <div class="shuxian"></div>
                            </div>
                            <div class="store2Div">
                                <p>{{ shop_list.collection_num }}</p>
                                <div>{{language.goods.goodsDet.follow}}</div>
                            </div>
                        </div>
                    </div>

                    <div class="hr"></div>
                    <div class="goods_d" @tap="_goods_x" id="doogi">{{language.goods.goodsDet.Commodity_details}}</div>
                    <!--  商品详情    -->
                    <div class="content_d safe-area-inset-bottom" id="content_d" v-if="goods_x">
                        <rich-text class="richtext" :nodes="pro.content"></rich-text>
                    </div>
                    <!--  规格参数   -->
                    <ul class="goods_spec" v-if="goods_g">
                        <li>
                            <div class="g_div"><div>{{language.goods.goodsDet.Trade_name}}：</div></div>
                            <p>{{ pro.name }}</p>
                        </li>
                        <li>
                            <!-- <div class="g_div"><div>品&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;牌：</div></div> -->
                            <div class="g_div"><div>{{language.goods.goodsDet.brand}}：</div></div>
                            <p>{{ pro.brand_name }} * {{ pro.cat_name }}</p>
                        </li>
                        <li>
                            <div class="g_div"><div>{{language.goods.goodsDet.Commodity_number}}：</div></div>
                            <p>{{ pro_id }}</p>
                        </li>
                        <li>
                            <div class="g_div"><div>{{language.goods.goodsDet.classification}}：</div></div>
                            <p>{{ pro.cat_name }}</p>
                        </li>
                        <li>
                            <div class="g_div"><div>{{language.goods.goodsDet.After_sale}}：</div></div>
                            <p>{{language.goods.goodsDet.qianshou}}</p>
                        </li>
                    </ul>

                    <div class="goods_foot" v-if="!bargain">
                        <view class="footer-hint" v-if="shop_list.is_open == 2">{{language.goods.goodsDet.close}}</view>
                        <view class="footer-hint" v-else-if="pro.recycle == '1'">{{language.goods.goodsDet.commodity_delete}}~</view>
                        <view class="footer-hint" v-else-if="pro.status == '3'">{{language.goods.goodsDet.shelf}}~</view>
                        <view class="footer-hint" v-else-if="pro.num == 0">{{language.goods.goodsDet.soldOut}}~</view>

                        <div class="goods_bottom safe-area-inset-bottom" :class="{ goods_bottoms: pro.status == '3' }">
                            <!-- #ifdef MP-WEIXIN -->
                            <div class="goods_one ml_25">
                                <button class="kf_button_css center" style="background: none;padding: 0;height: 100%;" type="primary" open-type="contact">
                                    <img :src="kf_img" />
                                    <p>{{language.goods.goodsDet.customer_service}}</p>
                                </button>
                            </div>
                            <!-- #endif -->

                            <!-- #ifdef MP-BAIDU -->
                            <div class="goods_one ml_25">
                                <button class="center" open-type="contact" bindcontact="contactCB" style="background:none;padding:0px;height: 100%;">
                                    <img :src="kf_img" />
                                    <p>{{language.goods.goodsDet.customer_service}}</p>
                                </button>
                            </div>
                            <!-- #endif -->
                            <div class="goods_one center" @tap="Back_Tabbar">
                                <img :src="Back_home" />
                                <p>{{language.tabBar[0]}}</p>
                            </div>
                            <!-- #ifndef MP-WEIXIN || MP-TOUTIAO || MP-BAIDU -->
                            <div class="goods_one center" @tap="kf(pro_id)">
                                <img :src="kf_img" />
                                <p>{{language.goods.goodsDet.customer_service}}</p>
                            </div>
                            <!-- #endif -->

                            <div class="goods_one center" @tap="_collection">
                                <img :src="collection ? xing_hei : xing_hui" />
                                <p v-if="collection">{{language.goods.goodsDet.Collected}}</p>
                                <p v-else>{{language.goods.goodsDet.Collection}}</p>
                            </div>

                            <template v-if="pro.status == '3' || pro.recycle == '1' || shop_list.is_open == 2 || pro.num == 0">
                                <div v-if="(pro.is_distribution == '1' || active == '6') && pro.num != 0"><div class="goods_two _buy" style="color: #333333;">{{language.goods.goodsDet.Buy_now}}</div></div>
                                <div v-else-if="(pro.is_distribution == '1' || active == '6') && pro.num == 0" ><div class="goods_two _buy" style="color: white;background: #9a9a9a">{{language.goods.goodsDet.Buy_now}}</div></div>
                                <div v-else-if="pro.is_distribution == '0' && active != '6'">
                                    <div class="goods_two" style="background-color: #B8B8B8;width: 225rpx;">{{language.goods.goodsDet.add_cart}}</div>
                                    <div class="goods_two _buy1" style="background-color: #9A9A9A;width: 225rpx;">{{language.goods.goodsDet.Buy_now}}</div>
                                </div>
                            </template>
                            <template v-else>
                                <div v-if="pro.is_distribution == '0' && active == '6'"><div class="goods_two _buy" @tap="_buy">{{language.goods.goodsDet.Buy_now}}</div></div>
                                <div v-if="pro.is_distribution == '1'"><div class="goods_two fx" @tap="fxGoodsShareMake" > <image class="share_make" :src="share_make"></image> <text>{{language.goods.goodsDet.share_make}}</text> </div></div>
                                <div v-if="pro.is_distribution == '1'"><div class="goods_two _buy1" @tap="_buy">{{language.goods.goodsDet.Buy_now}}</div></div>
                                <div v-if="pro.is_distribution == '0' && active != '6'">
                                    <div class="goods_two" @tap="_shopping" style="width: 225rpx;">{{language.goods.goodsDet.add_cart}}</div>
                                    <div class="goods_two _buy1" @tap="_buy" style="width: 225rpx;">{{language.goods.goodsDet.Buy_now}}</div>
                                </div>
                            </template>
                        </div>
                    </div>
                    <div class="goods_foot" :style="{ height: height }" v-else>
                        <!-- <div class="goods_bottom goods_bottom_time" v-if="leftTime > 0">
                            {{language.goods.goodsDet.end}}：
                            <span v-if="day != 0">{{ day }}{{language.goods.goodsDet.day}}</span>
                            <span v-else>0{{language.goods.goodsDet.day}}</span>
                            <span v-if="hour != 0">{{ hour }}{{language.goods.goodsDet.Time}}</span>
                            <span v-else>00{{language.goods.goodsDet.Time}}</span>
                            <span v-if="mniuate != 0">{{ mniuate }}{{language.goods.goodsDet.branch}}</span>
                            <span v-else>00{{language.goods.goodsDet.branch}}</span>
                            <span v-if="second != 0">{{ second }}{{language.goods.goodsDet.second}}</span>
                            <span v-else>00{{language.goods.goodsDet.second}}</span>
                        </div> -->
                        <div class="goods_bottom bt_0">
                            <div class="goods_two goods_two_gd" @tap="navTo('/pagesA/bargain/bargain?topTabBar=true')">{{language.goods.goodsDet.More_bargains}}</div>
                           
                            <div v-if="leftTime <= 0 || brStatus == -1" class="goods_two btn-gray">{{language.goods.goodsDet.Bargain_now}}</div>
                            <div v-else-if="brStatus == 4 && isbegin == 1" class="goods_two btn-black" @tap="toBr()">{{language.goods.goodsDet.Bargain_now}}</div>
                            <div v-else-if="brStatus == 0 && leftTime > 0 && isbegin == 1" class="goods_two btn-black" @tap="toBr()">{{language.goods.goodsDet.Continue_bargain}}</div><!--@tap="toBr()" 继续砍价 -->
                            <div v-else-if="leftTime < 0 && isbegin == 1" class="goods_two btn-black">{{language.goods.goodsDet.Finished}}</div>
                            <div v-else-if="leftTime > 0 && isbegin != 1" class="goods_two btn-black">{{language.goods.goodsDet.Not_started}}</div>
                            <div v-else-if="brStatus == 1 && hasorder == 0 && isbegin == 1" :class="{gray:brStatus == 1 && hasorder == 0 && isbegin == 1}" class="goods_two btn-black" >{{language.goods.goodsDet.Bargain_now}}</div><!-- 去付款 -->
                           <!-- @tap="goPay()" -->
                           
                            <div
                                v-else-if="brStatus == 1 && hasorder == 1 && isbegin == 1 || brStatus == 1 && isbegin == 1"
                                class="goods_two btn-black"
                                :class="{gray:brStatus == 1 && hasorder == 1 && isbegin == 1 || brStatus == 1 && isbegin == 1}"
                                
                            >
                           <!-- @tap="navTo('/pages/order/order?order_id=' + sNo_id + '&showPay=true')" -->
                               {{language.goods.goodsDet.Bargain_now}}<!-- 待付款 -->
                            </div>
                            <div v-else-if="brStatus == 2 && isbegin == 1" :class="{gray:brStatus == 2 && isbegin == 1}" class="goods_two btn-black">{{language.goods.goodsDet.Bargain_now}}</div><!-- 已付款 -->
                            <div v-else-if="brStatus == 3 || leftTime < 0" :class="{gray:brStatus == 3 || leftTime < 0}" class="goods_two btn-black">{{language.goods.goodsDet.Bargain_now}}</div><!-- 砍价失败 -->
                        </div>
                    </div>
                    <div class="share" v-if="g_show">
                        <div><img :src="top_img" /></div>
                    </div>
                </div>

                <!-- 没数据 -->
                <div v-else>
                    <!--  轮播图   -->
                    <div class="relative">
                        <swiper class="swiper">
                            <swiper-item><img class="swipe skeleton-rect" src="" /></swiper-item>
                        </swiper>
                    </div>
                    <!-- 非砍价商品价格和名称 -->
                    <div class="goods_name" v-if="!bargain">
                        <p style="width: 80px;" class="goods_price skeleton-rect">
                            <span class="span">￥</span>
                            {{ mockPro.price }}
                        </p>
                        <p style="padding-bottom: 0;margin-bottom: 9px;height: 21px;" class="goods_proName skeleton-rect">{{ mockPro.name }}</p>
                        <div class="volume">
                            <span class="skeleton-rect">{{language.goods.goodsDet.Freight_rules}}：{{ mockPro.yunfei }}</span>
                            <span class="skeleton-rect">{{language.goods.goodsDet.sales_volume}}{{ mockPro.volume }}</span>
                        </div>
                    </div>
                    <!-- 砍价商品价格和名称 -->
                    <div class="goods_name goods_bargain_name skeleton-rect" v-else>
                        <p class="goods_price skeleton-rect">
                            xxxx{{language.goods.goodsDet.completed}}
                            <span class="cs_yprice skeleton-rect">xxxxx</span>
                            <span class="cs_price skeleton-rect">xxxx</span>
                        </p>
                        <p class="">{{ mockPro.name }}</p>
                    </div>
                    <div class="hr" v-if="isDistribution == false"></div>
                    <div class="coupon skeleton-rect" @tap="getCoupon()" v-if="isDistribution == false && !bargain && active != 6 && coupon_status == true">
                        <span class="">{{language.goods.goodsDet.Collect_coupons}}</span>
                    </div>
                    <div class="hr"></div>
                    <!-- 非砍价商品选择商品规格 -->
                    <div v-if="!bargain" class="guige skeleton-rect" @tap="_shopping1()" ref="homeHead">
                        <span>{{ haveSkuBean == '' ? '选择商品规格' : haveSkuBean.name }}</span>
                        <img class="arrow" :src="you_img" />
                    </div>
                    <div v-if="!bargain" class="hr"></div>
                    <div class="user gd_user skeleton-rect" v-if="comments.length && !bargain" @tap="_evaluate(pro_id)">
                        <p>{{language.goods.goodsDet.User_evaluation}}（{{ comments.length }}）</p>
                        <img class="arrow" :src="you_img" />
                    </div>
                    <div class="comments skeleton-rect" v-if="comments.length && !bargain">
                        <div class="allCenter">
                            <img class="img skeleton-circle" />
                            <span class="span skeleton-rect">xxxx</span>
                        </div>
                        <div class="time skeleton-rect">xxxx-xx-xx</div>
                        <div class="disc skeleton-rect">xxxxxxxxxxxxxxxxxxxxx</div>
                    </div>
                    <div class="user skeleton-rect"><p style="font-size: 30rpx;">{{language.goods.goodsDet.No_evaluation}}</p></div>
                    <!-- 砍价页面显示 -->
                    <div>
                        <div class="user gd_user" @tap="_evaluate(pro_id)">
                            <p class="skeleton-rect">{{language.goods.goodsDet.sheets}}（{{ comments.length }}）</p>
                            <img class="arrow" :src="you_img" />
                        </div>
                        <div class="user gd_user skeleton-rect">
                            <p>{{language.goods.goodsDet.sheets}}（0）</p>
                            <img class="arrow" :src="you_img" />
                        </div>
                        <template>
                            <div class="comments">
                                <div class="allCenter">
                                    <img class="img skeleton-circle" />
                                    <span class="span skeleton-rect">xxxxx</span>
                                </div>
                                <div class="time skeleton-rect">xxxx-xx-xx</div>
                                <div class="disc skeleton-rect">xxxxxxxxxxxxxx</div>
                            </div>
                        </template>
                        <div class="user skeleton-rect" v-if="comments.length <= 0"><p class="font_30">{{language.goods.goodsDet.No_evaluation}}</p></div>
                    </div>
                </div>
            </div>
        </div>
        
<!--        苹果底部黑条适配-->
        <div class="goods-detailed-safe-area-inset-bottom">
            
        </div>
        
        <skeleton :animation="true" :loading="true" v-if="!loadFlag" bgColor="#FFF"></skeleton>
        
        
        <img class="zhiding" :src="zhiding" @tap="_zhiding" />

        <!-- 领取优惠券 -->
        <div class="mask" v-if="couponMask">
            <div class="couponMask">
                <div class="couponWapper">
                    <div class="title">
                        <div style="font-weight: bold;">{{language.goods.goodsDet.Collect_coupons}}</div>
                        <img style="-webkit-touch-callout: default;" class="cha" :src="guan_img" @tap="closeCouponMask" />
                    </div>
                    <div class="couponList" v-if="coupon_list && coupon_list.length > 0">
                        <div class="couponItem" v-for="(item, index) in coupon_list" :key="index">
                            <div class="rightPart">
                                <div class="limit">{{ item.name }}</div>
                                <span class="money" v-if="item.activity_type == 1">{{language.goods.goodsDet.free_shipping}}</span>
                                <span class="money" v-if="item.activity_type != 1">
                                    <span class="font_32" v-if="item.money > 0">￥</span>
                                    {{ item.money > 0 ? item.money : item.discount }}
                                    <span class="font_32" v-if="item.money <= 0">{{language.goods.goodsDet.fracture}}</span>
                                </span>
                                <span class="payLine">{{ item.limit }}</span>
                            </div>

                            <div class="splitLine"></div>

                            <div class="leftPart">
                                <button class="toReceive" v-if="item.point == '立即领取'" @tap="_receive(index, item.id)">{{ language.goods.goodsDet.lingqu }}</button>
                                <button class="toReceive clicks" v-else-if="item.point == '可用商品'">{{language.goods.goodsDet.Received}}</button>
                                <img style="-webkit-touch-callout: default;" class="img" alt="" v-if="item.point == '可用商品'" :src="coupon_on" />
                            </div>
                        </div>
                    </div>

                    <div v-else class="no_coupon">
                        <img :src="no_coupon" alt="" />
                        <p>{{language.goods.goodsDet.coupons}}~</p>
                    </div>
                </div>
            </div>
        </div>
        <ruleModal v-model="isShow" @click="_toGradeUse" :title="language.goods.goodsDet.Usage_rules" :details="bargain_content" />
        
        <skus ref="attrModal" :stock="language.goods.goodsDet.stock" :nums="language.goods.goodsDet.number" :confirm="language.goods.goodsDet.confirm" @confirm="_confirm"></skus>
        
        <share ref="share" :share="share" :pro="pro" :pro_id="pro_id" :fx_id="fx_id" :type="shareType">
            
        </share>
        
    </div>
</template>

<script>
    import heads from '../../components/header.vue';
    import skus from '../../components/skus.vue';
    import wxParse from '../../components/mpvue-wxparse/src/wxParse.vue';
    import {mapMutations, mapState} from 'vuex';
    import {mockPro} from '@/mock/goodsDetailed/goodsDetailed.js';
    import {
        LaiKeTui_axios,
        LaiKeTui_buy_handle,
        LaiKeTui_collection,
        LaiKeTui_confirm,
        LaiKeTui_receive,
        LaiKeTui_shopping,
        LaiKeTui_spec,
        LaiKeTuiGetCoupon,
        LaiKeTuiInvite,
        LaiKeTuiSetTimeData,
        LaiKeTuiShopEWM,
        LaiKeTuiShowSaveEWM,
        LaiKeTuiShowState,
        LaiKeTuiToBr
    } from '../../static/js/goods/goodsDetailed.js';
    import ruleModal from '@/components/ruleModal.vue';
    import toload from '../../components/toload.vue';
    import htmlParser from '@/common/html-parser.js';
    import share from "@/components/share";

    export default {
    data() {
        return {
            mockPro,
            back1: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/back2x_w.png',
            niming: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/landing_logo2x.png', //图片
            zhiding: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/zhiding.png', //置顶
            coupon_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/coupon_detail.png',
            guan_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/guanbi2x.png',
            close: '',
            saves: '',
            cs_yprice: '',
            cs_price: '',
            cs_num: '',
            hour: 0,
            mniuate: 0,
            second: 0,
            day: 0,
            leftTime: '',
            attr_id: '',
            shareType: '',
            bargain: false,
            bargain_rule: '', //砍价规则
            bargain_content: '', //砍价规则
            isShow: '',
            shop_list: [],
            option: '',
            overflow: 'scroll',
            
            fastTap: true,
            axios_complete: false, //是否已加载完初始数据
            title: '商品详情',
            is_goods: true,
            shop_id: '',
            bback_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/bback.png',
            fx_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/fx.png',
            gw_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/gw.png',
            
            you_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jiantouhei2x.png',
            kf_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/kefu2x.png',
            top_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/kaobei2x.png',
            
            wx_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/wechat.png',
            
            xing_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/xinghei2x.png?v='+Math.random(),
            xing_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/xinghui2x.png',
            erm_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/ewmShare.png',
            erm_pyq_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/wepyq.png',
            coupon_on: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/coupon_on.png',
            no_coupon: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/noFind.png',
            share_make: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/share_make.png',
            attribute_id: '',
            attrList: '',
            
            ys_price: '', //规格初始价格
            
            collection_id: null, //收藏id
            pro: {}, //商品信息
            comments: '', //评价信息
            commentsTotal:0,//总评论数
			commodity_type: '', // 1是虚拟商品
            Back_home: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/Back_home.png',
            collection: false, //收藏状态
            type: '', //判断进入规格选择是从立即购买1、加入购物车2、规格选择进入3
            goods_x: true,
            goods_g: false,

            g_show: false, //回顶部显示
            imgurls: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/landing_logo.png', //图片
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
            logo: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/lktlogo.png',
            list_end: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jp_end.png',
            pro_id: '',
            order_no: '',
            brStatus: '',
            bargain_id: '',
            isDistribution: false, //是否是分销商品？true是，false不是
            ewmImg: '', //二维码图片
            login_status: 0, //0:未登录；1已登录
            active: '', //活动类型
            hasorder: 0, //是否是待付款 0|1(待付款)
            sNo_id: 0, //订单id
            isbegin: 1, //是否是已开始的砍价商品 0（否）|1（是）
            shareMask_H5: false,
            h5_url: '',
            isfx: '',
            shareshop: 0,
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
                }
                // #endif
            ],
            couponMask: false,
            coupon_list: [],
            clicktimes: [], //记录点击buy按钮时的时间
            allCartNum: 0, //购物车的总商品数
            status: '2',
            is_shop: false,
            headerplus: false,
            coupon_status: false,
            coupon_str: [], //显示的优惠券图标
            swiperIndex: 1, //轮播图下标

            loadFlag: false,
            fx_id: '', // 分销id
            
            num: '', //规格数量
            numb: '', 
            haveSkuBean: '', //选择规则属性
            is_kj:false,
            
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
                
                mch_id: ''
            }
        };
    },
    computed: {
        halfWidth: function() {
            var gru = uni.getStorageSync('data_height') ? uni.getStorageSync('data_height') : this.$store.state.data_height;
            var heigh = (parseInt(gru) + 44) * 2;
            heigh = uni.upx2px(heigh)
            return heigh + 'px';
        },
        height: function() {
            if (this.leftTime > 0) {
                return uni.upx2px((750 * 79) / 375) + 'px';
            }
        },
        ...mapState({
            _cart_num: 'cart_num'
        })
    },
    beforeCreate() {
        // #ifdef H5
        window.scrollTo(0, 0);
        window.onbeforeunload = function () {
            window.scrollTo(0, 0);
        }
        // #endif
    },
    onLoad(option) {
        this.setLang();
        this.shareContent = this.language.showModal.shareContent
        this.sharehrefTitle = this.language.showModal.shareContent
        this.sharehrefDes = this.language.showModal.shareContent
        
        this.option = option;
        this.fastTap = true;
        
        this.leftTime = option.leftTime;

        this.isfx = option.isfx;
        if (option.productId) {
            this.pro_id = option.productId;
        } else if (option.pro_id) {
            this.pro_id = option.pro_id;
        }
        this.bargain_id = option.bargain_id;
        
        if (option.fx_id) {
            this.fx_id = option.fx_id;    
        }
        
        if (option.mch_id) {
            this.mch_id = option.mch_id;    
        }
        
        
        this.bargain = option.bargain;
        this.brStatus = option.brStatus;
        console.log(this.brStatus);
        this.attr_id = option.attr_id;
        this.order_no = option.order_no;
        this.sNo_id = option.sNo_id;
        this.isbegin = option.isbegin;
        if (this.bargain) {
            this.is_kj = true
            this.LaiKeTuiSetBargainRuleData();
        }

        if (this.pro_id == '' || this.pro_id == undefined) {
            this.pro_id = this.$store.state.pro_id;
        }

        if (option.isDistribution) {
            this.isDistribution = option.isDistribution;
            this.shareType = 'FX'
        }
        
        this.hasorder = option.hasorder;
        console.log(this.hasorder);
        if(option.fatherId) {
             uni.setStorageSync('fatherId', option.fatherId);
        }
        
    },
    onReady() {
    	this.getElementHeight('.swiper-item2')
    },
    onShow(option) {
        this.allCartNum = this.$store.state.cart_num;
        this.close = this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/close_bb.png';
        this.saves = this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/save.png';
        this.fastTap = true;
		
		this.haveSkuBean = ''

        let p = new Promise((resolve, reject) => {
            this.LaiKeTuiCommon.getLKTApiUrl().then(function() {
                resolve(1231);
            });
        });

        p.then(() => {
            this._axios();

            this.$nextTick(function() {
                uni.getProvider({
                    service: 'share',
                    success: function(res) {
                        console.log(res.provider);
                    }
                });
            });
        });

        this.couponMask = false;
    },
    //转发
    onShareAppMessage: function(res) {
        this.share.shareMask = false
        return {
            title: this.share.sharehrefTitle,
            path: this.share.shareHref2 + '&isfx=true&fatherId=' + uni.getStorageSync('userinfo').user.user_id,
            imageUrl: this.share.shareImg,
            bgImgUrl: this.share.shareImg
        };
    },
    methods: {
        getElementHeight(element) {
        	setTimeout(()=>{
        		let query = uni.createSelectorQuery().in(this);
        		query.select(element).boundingClientRect();
        		query.exec((res) => {
        			if (!res) {
                        //如果没获取到，再调一次
                        this.getElementHeight();
        			}else {
                        if(res[0]){
                            this.swiperHeight = res[0].height;
                        }
        			}
        		})
        	},20)
        },
        SetTimeData() {
            LaiKeTuiSetTimeData(this);
        },
        swiperChange(e) {
            this.swiperIndex = e.detail.current + 1;
        },
        _zhiding() {
            uni.pageScrollTo({
                scrollTop: 0,
                duration: 300
            });
        },
        setHead() {
            const query = uni.createSelectorQuery().in(this);
            query.select('#boxs').boundingClientRect(data => {
                    if (data.top > -20) {
                        this.headerplus = false;
                    } else if (data.top < -20) {
                        this.headerplus = true;
                    }
                })
                .exec();
        },
        //授权取消按钮
        cancle() {
            this.fastTap = true;
        },
        changeLoginStatus() {
            this.login_status = 1;
            this.fastTap = true;

            this._axios();
        },
        copy_url() {
            this.shareMask_H5 = true;
            this.h5_url = this.shareHref;
        },
        goPay() {
            
            if (!this.bargain_id) {
                let product = [];
                product.push({
                    pid: this.pro_id
                });
                product.push({
                    cid: this.attr_id
                });
                product.push({
                    num: 1
                });
                product = JSON.stringify(product);
                uni.navigateTo({
                    url: '/pages/pay/orderDetailsr?product=' + product + '&bargain=true&bargain_id=' + this.bargain_id + '&order_no=' + this.order_no + '&returnR=2'
                });    
            } else {
                let product = []
                product.push({
                    pid: this.pro_id
                })
                product.push({
                    cid: this.attr_id
                })
                product.push({
                    num: 1
                })
                product.push({
                    bargain: true
                })
                product.push({
                    bargain_id: this.bargain_id
                })
                product.push({
                    order_no: this.order_no
                })
                product = JSON.stringify(product)

                //#ifdef H5
                var storage = window.localStorage
                storage.product = product
                storage.bargain = true
                storage.bargain_id = this.bargain_id
                storage.order_no = this.order_no
                uni.setStorageSync('bargain', true)
                // #endif
                uni.navigateTo({
                    url: '/pagesA/bargain/bargainDetailsr?product=' + product + '&bargain=true&bargain_id=' + this.bargain_id + '&order_no=' + this.order_no + '&returnR=2'
                });    
            }
            
        },
        toBr() {
            if (this.pro.num < 1) {
                uni.showToast({
                    title: this.language.goods.goodsDet.stock2,
                    icon: 'none',
                    duration: 1500
                });
                return;
            }
            LaiKeTuiToBr(this);
        },
        _goStore(shop_id) {
            uni.navigateTo({
                url: '/pagesA/store/store?shop_id=' + shop_id
            });
        },
        
        _closeAllMask() {
            this.shareMask = false;
            this.saveEWM = false;
            this.shareMask_H5 = false;
            this.overflow = 'scroll';
        },
        _shareDiv() {
            this.shareDiv = false;
        },
        _invite(type) {
            LaiKeTuiInvite(type, this);
        },
        _goRule() {
            this._toGradeUse(true);
        },
        _goback() {
            if (this.option.toback == 'true') {
                uni.navigateBack({
                    delta: 1
                });
                return;
            }
            // #ifdef H5
            uni.reLaunch({
                url: '/pages/tabBar/home'
            });
            // #endif
            // #ifndef H5
            if (this.isfx == 'true') {
                uni.reLaunch({
                    url: '/pages/tabBar/home'
                });
                return false;
            } else {
                uni.navigateBack({
                    delta: 1
                });
            }
            // #endif
        },
        _downEWM() {
            let me = this;
            uni.downloadFile({
                url: this.ewmImg,
                success(res) {
                    let filePath = res.tempFilePath;
                    uni.saveImageToPhotosAlbum({
                        filePath: filePath,
                        success () {
                            uni.showToast({
                                title: me.language.goods.goodsDet.Save_success,
                                duration: 1500,
                                icon: 'none'
                            });
                            me.shareMask = false;
                            me.saveEWM = false;
                        },
                        fail: function() {
                            uni.showToast({
                                title: me.language.goods.goodsDet.fail_success,
                                duration: 1500,
                                icon: 'none'
                            });
                        }
                    });
                },
                fail: function() {
                    uni.showToast({
                        title: me.language.goods.goodsDet.fail_success,
                        duration: 1500,
                        icon: 'none'
                    });
                }
            });
        },
        getGoodsDetailParams (shop = 0) {
            if (shop && shop > 0) {
                this.share.is_shop = true;
                this.share.shop_id = shop;
                this.share.sharehrefTitle = this.shop_list.shop_name;
                this.share.shareImg = this.shop_list.shop_logo;
                this.share.shareContent = this.shop_list.shop_name;
                var url = uni.getStorageSync('h5_url');
                this.share.shareHref = url + 'pagesA/store/store?is_share=true&shop_id=' + shop + '&isfx=true&fatherId=' + uni.getStorageSync('user_id');
                this.share.shareHref2 = '/pagesA/store/store?is_share=true&shop_id=' + shop + '&isfx=true&fatherId=' + uni.getStorageSync('user_id');
                this.share = Object.assign({}, this.share)
            } else {
                this.share.is_shop = false;
                this.share.shareHref2 = '/pages/goods/goodsDetailed?productId=' + this.pro_id + '&isfx=true';
                this.share.sharehrefTitle = this.pro.name;
                this.share.shareImg = this.imgurl || this.pro.img_arr[this.swiperIndex -1];
                this.share.shareContent = this.pro.name;
                var url = uni.getStorageSync('h5_url');
                if (this.isDistribution) {
                    this.share.isDistribution = true;
                    this.share.shareHref = url + 'pages/index/share?pages=goodsDetailed&productId=' + this.pro_id + '&isfx=true&isDistribution=true&fatherId=' + this.pro.user_id + '&fx_id=' + this.fx_id;
                    this.share.shareHref2 = '/pages/goods/goodsDetailed?productId=' + this.pro_id + '&isDistribution=true&isfx=true&fatherId=' + this.pro.user_id + '&fx_id=' + this.fx_id;
                } else {
                    this.share.shareHref = url + 'pages/index/share?pages=goodsDetailed&productId=' + this.pro_id + '&isfx=true&fatherId=' + this.pro.user_id;
                    this.share.shareHref2 = '/pages/goods/goodsDetailed?productId=' + this.pro_id + '&isfx=true&fatherId=' + this.pro.user_id;
                }
                
                
                
                this.share = Object.assign({}, this.share)
            }
        },
        showShareMask(shop) {
            if (this.login_status === 1) {
                this.getGoodsDetailParams(shop);
                this.$refs.share.showShareMask();
            } else {
                this.isLogin(() => {
                    this.getGoodsDetailParams(shop);
                    this.$refs.share.showShareMask();
                })    
            }
        },
        closeShareMask() {
            this.shareMask = false;
            this.overflow = 'scroll';
        },
        showSaveEWM(string) {
            if (this.is_shop) {
                LaiKeTuiShopEWM(string, this);
            } else {
                LaiKeTuiShowSaveEWM(string, this);
            }
        },
        kf(pro_id) {
            this.isLogin(() => {
                uni.navigateTo({
                    url: '/pages/message/service?mch_id=' + this.mch_id
                });
            });
        },
        _load_img() {
            this.load = false;
        },
        _goods_x() {
            this.goods_x = true;
            this.goods_g = false;
        },
        _goods_g() {
            this.goods_x = false;
            this.goods_g = true;
        },
        ...mapMutations({
            cart_id: 'SET_CART_ID',
            order_id: 'SET_ORDER_ID',
            address_id: 'SET_ADDRESS_ID',
            pay_lx: 'SET_PAY_LX',
            cart_num: 'SET_CART_NUM'
        }),
        _evaluate(pro_id) {
            if (this.bargain) {
                uni.navigateTo({
                    url: '/pages/evaluate/evaluate?bargain=true&pid=' + pro_id
                });
            } else {
                uni.navigateTo({
                    url: '/pages/evaluate/evaluate?pid=' + pro_id
                });
            }
        },

        //收藏
        _collection() {
            LaiKeTui_collection(this);
        },
        //规格选择
        _selectG() {
            this.type = 1;
            this._mask_display();
        },
        //加入购物车
        _shopping() {
            if (this.status == 2) {
                LaiKeTui_shopping(this);
            } else {
                uni.showToast({
                    title: this.language.goods.goodsDet.shelf2,
                    icon: 'none'
                });
            }
        },
        _shopping1() {
            this.type = 1;
            this.fastTap = true;
            this._mask_display();
        },
        getCoupon() {
            LaiKeTuiGetCoupon(this);
        },
        _receive(index, id) {
            this.isLogin(() => {
                LaiKeTui_receive(this, id);
            });
        },
        closeCouponMask() {
            this.couponMask = false;
        },
        fxGoodsShareMake () {
            if (this.login_status === 1) {
                this.getGoodsDetailParams('');
                this.$refs.share.LaiKeTuiShowSaveEWM('')
            } else {
                this.isLogin(() => {
                    this.getGoodsDetailParams('');
                    this.$refs.share.LaiKeTuiShowSaveEWM('')
                })
            }
        },
        _buy() {
            
            
            if (!this.axios_complete) {
                return false;
            }
            
            let canbuy = false;
            
            if (this.active == 5) {
                canbuy = true;
            }
                
            
            if (this.status == 2) {
                if (this.pro.canbuy == 1 || canbuy) {
                    this.LaiKeTuiCommon.laiketuiNoDoublePress(this, this._buy_handle);
                } else {
                    if (this.active == 5) {
                        // uni.showToast({
                        //     title: this.language.goods.goodsDet.Membership_level,
                        //     icon: 'none'
                        // });
                    } else {
                        uni.showToast({
                            title: this.language.goods.goodsDet.distribution,
                            icon: 'none'
                        });
                    }
                }
            } else {
                uni.showToast({
                    title: this.language.goods.goodsDet.shelf2,
                    icon: 'none'
                });
            }
            // if (this.active == 6) {
            //     if (this.is_grade == 0 && this.login_status == 1) {
            //         uni.showToast({
            //             icon: 'none',
            //             title: this.language.goods.goodsDet.no_vip
            //         });
            //     }

            //     return;
            // }
        },
        //立即购买
        _buy_handle() {
            LaiKeTui_buy_handle(this);
        },
        //打开遮罩层
        _mask_display() {
            this.$refs.attrModal._mask_display()
        },
        
        //确认
        _confirm(sku) {
            Object.assign(this.$data,sku)
            LaiKeTui_confirm(this);
        },
        _spec() {
            LaiKeTui_spec(this);
        },
        //选择属性
        showState(index, indx) {
            LaiKeTuiShowState(this, index, indx);
        },
        _axios() {
            LaiKeTui_axios(this);
            this.axios_complete = true;
        },
        _toGradeUse(is) {
            if (is) {
                if(!this.bargain_rule){
                    this.bargain_content = ''
                }else{
                    this.bargain_content = htmlParser(this.bargain_rule);
                }
                
                this.isShow = !this.isShow;
            } else {
                this.isShow = !this.isShow;
            }
        },
        /**
         * 设置砍价规则
         * @param me
         * @constructor
         */
        LaiKeTuiSetBargainRuleData() {
            let data = {
                m: 'getRule',
                action: 'bargain',
                module: 'app'
            };

            this.$req.post({ data }).then(res => {
                this.bargain_rule = res.data.rule;
            });
        },
        Back_Tabbar(){
            uni.switchTab({
                url: '/pages/tabBar/home'
            });
        }
    },
    components: {
        heads,
        wxParse,
        toload,
        ruleModal,
        skus,
        share
    }
};
</script>

<style lang="less" scoped>
@import url('../../static/css/goods/goodsDetailed.less');
.gray{
  background: #9A9A9A;
  color: white;
}
</style>
