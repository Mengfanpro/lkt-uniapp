<template>
    <view class="skeleton containerBg">
        <view class="onReachBottomBg" v-if="!is_diy && load"></view>
        <view class="onReachBottomBg" v-if="is_diy && load" :style="{background: `linear-gradient(90deg,${onReachBottomBg[0].item} 0%,${onReachBottomBg[1].item} 100%)`}"></view>
        
        
        <!--   首页diy-->
        <view v-if="is_diy && load" class="diy" :style="{background: `linear-gradient(90deg,${bgColor[0].item} 0%,${bgColor[1].item} 100%)`}">
            <lktauthorize ref="lktAuthorizeComp"></lktauthorize>
            <block v-for="(item,index) in styleConfig" :key='index'>
                <blankPage v-if='item.name=="blankPage"' :dataConfig="item"></blankPage>
                <combination v-if='item.name=="combination"' :dataConfig="item" @toUrl="toUrl"></combination>
                <guide v-if='item.name=="guide"' :dataConfig="item"></guide>
                <headerSerch v-if='item.name=="headerSerch"' :dataConfig="item" @toUrl="toUrl" :region="region"></headerSerch>
                <homeAdv v-if='item.name=="homeAdv"' :dataConfig="item" @toUrl="toUrl"></homeAdv>
                <homeStore v-if='item.name=="homeStore"' :dataConfig="item" @toUrl="toUrl"></homeStore>
                <homeVideo v-if='item.name=="homeVideo"' :dataConfig="item"></homeVideo>
                <menus v-if='item.name=="menus"' :dataConfig="item" @toUrl="toUrl"></menus>
                <richText v-if='item.name=="richText"' :dataConfig="item" @toUrl="toUrl"></richText>
                <seckill v-if='item.name=="seckill"' :dataConfig="item" @refresh="_axios" @toUrl="toUrl"></seckill>
                
                <reduction v-if="item.name == 'reduction'" :dataConfig="item" @toUrl="toUrl"></reduction>
                
                <swiperBg v-if='item.name=="swiperBg"' :dataConfig="item" @toUrl="toUrl"></swiperBg>
                <swiperPicture v-if='item.name=="swiperPicture"' :dataConfig="item" @toUrl="toUrl"></swiperPicture>
                <tabNav v-if='item.name=="tabNav"' :dataConfig="item"  :page="page" :is_grade="is_grade" @loadingType="onHandleLoadingType" @changePage="changePage" @toUrl="toUrl"></tabNav>
            </block>
            
        </view>
              
        
        <!-- 普通的首页-->
        <view v-if="!is_diy && load" class="container">
            <lktauthorize ref="lktAuthorizeComp"></lktauthorize>

            <view class="container_top">
                <!-- #ifndef MP -->
                <view class="data_h" :style="{ height: halfWidth }"><view class="data_h_h" :style="{ height: halfWidth }"></view></view>
                <!-- #endif -->
                <!-- #ifdef MP -->
                <heads :title="language.home.title" :border="true" :returnFlag="true"  ishead_w="1"></heads>
                <!-- #endif -->
                <view style="height: 88rpx;">
                    <view class="container_top_item">
                        <view class="container_top_item_left" @tap="toArea" style="white-space: nowrap;">
                            {{region.district?region.district:'岳麓区'}}
                            <image :src="jianX_h" lazy-load="true"></image>
                        </view>

                        <view class="container_top_item_center" @tap="toUrl('/pagesA/search/search')">
                            <image :src="search2x" lazy-load="true"></image>
                            {{language.home.search_placeholder}}
                        </view>

                        <view class="container_top_item_right" @tap="_navigateTo('/pages/message/systemMesage')">
                            <image :src="xiaoxi2x" lazy-load="true"></image>
                            <view v-if="xxnum">{{ xxnum }}</view>
                        </view>
                    </view>
                </view>
            </view>

            <view class="swiperBox">
                <swiper class="swiper" autoplay="true" interval="3000" circular="true" @change="changeBanner">
                    <swiper-item v-for="(item, index) in banner" :key="index">
                        <image class="swiper_image" :src="item.image" @tap="toUrl(item.url)"></image>
                    </swiper-item>
                </swiper>

                <view class="swiper_dots"><view :class="{ active: dotIndex == index }" v-for="(item, index) in banner" :key="index"></view></view>
            </view>

            <view class="nav">
                <template v-for="(item, index) of nav_list">
                    <view  class="nav_item" :key="index" @tap="navClick(item)" >
                        <image :src="item.appimg" lazy-load="true"></image>
                        <p>{{ item.name }}</p>
                    </view>
                </template>
            </view>

            <view class="content">
                <view class="content_top" style="margin-bottom: 38rpx;" v-if="language.home.more == 'more'">
                    <image :src="home_xp" lazy-load="true" @tap="navClick({ url: '/pagesB/home/proList?type=1', status: true })"></image>
                    <image :src="home_hw" lazy-load="true" @tap="navClick({ url: '/pagesB/home/proList?type=2', status: true })"></image>
                </view>

                <view class="content_top" style="margin-bottom: 38rpx;" v-else>
                    <image :src="home_xp" lazy-load="true" @tap="navClick({ url: '/pagesB/home/proList?type=1', status: true })"></image>
                    <image :src="home_hw" lazy-load="true" @tap="navClick({ url: '/pagesB/home/proList?type=2', status: true })"></image>
                </view>
                
                    
                <div v-for="(marketItem, marketIndex) of Marketing_list" :key="marketIndex">
                    
                    <swiper v-if="marketItem.activity_type == 1 && marketItem.plug_type == 10 " :indicator-dots="true" indicator-color="rgba(1, 67, 67, 0.5)" indicator-active-color="#FF7D00" circular="true" :autoplay="true" :interval="5000" :duration="1000" style="height: 180rpx;width: 690rpx;margin: 40rpx auto;">
                        <swiper-item v-for="item,index of marketItem.list" :key="index">
                            <image style="width: 690rpx;height: 180rpx;border-radius: 16rpx;" :src="item.image" lazy-load="true" @tap="toUrl('/pagesB/home/substration?title='+item.title+'&id='+item.id)"></image>
                        </swiper-item>
                    </swiper>
                    
                    <template v-if="marketItem.activity_type == 1 && marketItem.plug_type == 2 ">
                        <!-- 超值拼团
                        <view class="group" v-if="marketItem.list.length > 0">
                            <view class="home_title">
                                <view>{{marketItem.name}}</view>
                                <image :src="home_title_bg"></image>
                            </view>

                            <scroll-view scroll-x="true" class="group_content">
                                <view class="seckill_content_view" style="padding: 0 30rpx;">
                                    <view
                                        class="group_content_item"
                                        v-for="(item, index) of marketItem.list"
                                        :key="index"
                                        @tap="
                                toUrl('/pagesA/group/group')
                            "
                                    >
                                        <image :src="item.imgurl" lazy-load="true" mode=""></image>
                                        <view>
                                            <view class="group_content_item_title">{{ item.pro_name }}</view>
                                            <view class="group_content_item_disc">
                                                <image :src="group_icon" lazy-load="true" mode=""></image>
                                                {{ item.sum }}{{language.home.group_people}}
                                            </view>
                                            <view class="group_content_item_price">
                                                <text>{{ item.groupnum }}{{language.home.Spell_people}}</text>
                                                ￥{{ item.kaiprice }}
                                            </view>
                                            <text class="group_content_item_yprice">￥{{ item.market_price }}</text>
                                        </view>
                                    </view>
                                    <view style="min-width: 6rpx"></view>
                                </view>
                            </scroll-view>
                        </view>
                        <!-- 超值拼团结束 -->
                    </template>

                    <template v-if="marketItem.activity_type == 1 && marketItem.plug_type == 8 ">
                        <!-- 限时秒杀 -->
                        <view class="seckill" v-if="marketItem.list.pro_list && marketItem.list.pro_list.length > 0">
                            <view class="seckill_top">
                                <image class="seckill_top_title" lazy-load="true" :src="home_seckillTitle" mode=""></image>

                                <view class="seckill_top_time">
                                    <view>{{ time.hours || '00' }}</view>
                                    :
                                    <view>{{ time.minutes || '00' }}</view>
                                    :
                                    <view>{{ time.seconds || '00' }}</view>
                                </view>

                                <view class="more" @tap="_navigateTo('/pagesB/seckill/seckill')">
                                    {{language.home.more}}
                                    <image :src="jiantou" lazy-load="true"></image>
                                </view>
                            </view>

                            <scroll-view scroll-x="true" class="seckill_content">
                                <view class="seckill_content_view">
                                    <view
                                        class="seckill_content_item"
                                        v-for="(item, index) of marketItem.list.pro_list"
                                        :key="index"
                                        @tap="toUrl('/pagesB/seckill/seckill_detail?pro_id=' + item.pro_id + '&navType=' + item.type + '&id=' + item.id)"
                                    >
                                        <image :src="item.imgurl || ''" lazy-load="true" mode=""></image>
                                        <view class="seckill_content_item_p">{{ item.product_title || item.pro_id }}</view>
                                        <view class="seckill_content_item_bottom">
                                            <view class="seckill_price">
                                                ￥{{ item.seconds_price || 0 }}
                                                <text>￥{{ item.price || 0 }}</text>
                                            </view>

                                            <image class="seckill_btn" :src="seckill_btn"></image>
                                        </view>
                                    </view>
                                </view>
                            </scroll-view>
                        </view>
                        <!-- 限时秒杀结束 -->
                    </template>
                    <template v-if="marketItem.activity_type == 0">
                        <!-- 营销活动 -->
                        <view class="group" v-if="marketItem.list.length > 0">
                            <view class="home_title">
                                <view>{{marketItem.name}}</view>
                                <image :src="home_title_bg"></image>
                            </view>

                            <scroll-view scroll-x="true" class="group_content">
                                <view class="seckill_content_view" style="padding: 0 30rpx;">
                                    <view
                                        class="group_content_item"
                                        v-for="(item, index) of marketItem.list"
                                        :key="index"
                                        @tap="
                                _goods(item.id)
                            "
                                    >
                                        <image :src="item.imgurl" lazy-load="true" mode=""></image>
                                        <view>
                                            <view class="group_content_item_title">{{ item.product_title }}</view>

                                            <div class="goods_mun">                                             
                                                <div class="allgoods_price" >
                                                    <view class='red'>
                                                        <text class="currency">￥</text>
                                                        <text class="vip_price">{{item.yprice}}</text>
                                                        <text class="sales">{{language.home.sales}} {{ item.volume }} {{language.home.piece}}</text>
                                                    </view>                                               
                                                </div>


                                            </div>
                                        </view>
                                    </view>
                                    <view style="min-width: 6rpx"></view>
                                </view>
                            </scroll-view>
                        </view>
                        <!-- 营销活动结束 -->
                    </template>
                    <template v-if="marketItem.activity_type == 1 && marketItem.plug_type == 3">
                        <!-- 砍价 -->
                        <view class="group" v-if="marketItem.list.length > 0">
                            <view class="home_title">
                                <view>{{marketItem.name}}</view>
                                <image :src="home_title_bg"></image>
                            </view>

                            <scroll-view scroll-x="true" class="group_content">
                                <view class="seckill_content_view" style="padding: 0 30rpx;">
                                    <view
                                        class="group_content_item"
                                        v-for="(item, index) of marketItem.list"
                                        :key="index"
                                        @tap="
                                toUrl('/pagesA/bargain/bargain?topTabBar=true&needLogin=1')
                            "
                                    >
                                        <image :src="item.img" lazy-load="true" mode=""></image>
                                        <view>
                                            <view class="group_content_item_title">{{ item.title }}</view>

                                            <div class="goods_mun">
                                                <div class="allgoods_price" v-if="is_grade">
                                                    <view class='red'>
                                                        <text class="currency">￥</text>
                                                        <text class="vip_price">{{item.min_price}}</text>
                                                    </view>
                                                    <p style="text-decoration: line-through;">￥{{item.price}}</p>
                                                </div>
                                                <div class="allgoods_price" v-else>
                                                    <view class='red'>
                                                        <text class="currency">￥</text>
                                                        <text class="vip_price">{{item.min_price}}</text>
                                                        
                                                    </view>
                                                    <p style="text-decoration: line-through;">￥{{item.price}}</p>
                                                </div>


                                            </div>
                                        </view>
                                    </view>
                                    <view style="min-width: 6rpx"></view>
                                </view>
                            </scroll-view>
                        </view>
                        <!-- 砍价结束 -->
                    </template>
                    <template v-if="marketItem.activity_type == 1 && marketItem.plug_type == 4">
                        <!-- 竞拍 -->
                        <view class="group" v-if="marketItem.list.length > 0">
                            <view class="home_title">
                                <view>{{marketItem.name}}</view>
                                <image :src="home_title_bg"></image>
                            </view>

                            <scroll-view scroll-x="true" class="group_content">
                                <view class="seckill_content_view" style="padding: 0 30rpx;">
                                    <view
                                        class="group_content_item"
                                        v-for="(item, index) of marketItem.list"
                                        :key="index"
                                        @tap="
                                toUrl('/pagesA/bidding/bidding')
                            "
                                    >
                                        <image :src="item.imgurl" lazy-load="true" mode=""></image>
                                        <view>
                                            <view class="group_content_item_title">{{ item.title }}</view>

                                            <div class="goods_mun">
                                                <div class="allgoods_price">
                                                    <view class='red'>
                                                        <text class="upset-price">起拍价</text>
                                                        <text class="currency">￥</text>
                                                        <text class="vip_price">{{item.price}}</text>
                                                    </view>
                                                </div>

                                            </div>
                                        </view>
                                    </view>
                                    <view style="min-width: 6rpx"></view>
                                </view>
                            </scroll-view>
                        </view>
                        <!-- 竞拍结束 -->
                    </template>
                    <template v-if="marketItem.activity_type == 1 && marketItem.plug_type == 7">
                        <!-- 积分商城 -->
                        <view class="group" v-if="marketItem.list.length > 0">
                            <view class="home_title">
                                <view>{{marketItem.name}}</view>
                                <image :src="home_title_bg"></image>
                            </view>

                            <scroll-view scroll-x="true" class="group_content">
                                <view class="seckill_content_view" style="padding: 0 30rpx;">
                                    <view
                                        class="group_content_item"
                                        v-for="(item, index) of marketItem.list"
                                        :key="index"
                                        @tap="
                                toUrl('/pagesB/integral/integral?toBack=true&needLogin=1')
                            "
                                    >
                                        <image :src="item.imgurl" lazy-load="true" mode=""></image>
                                        <view>
                                            <view class="group_content_item_title">{{ item.product_title }}</view>

                                            <div class="goods_mun">
                                                <div class="allgoods_price">
                                                    <span class="pro_price" v-if="item.money>0 && item.integral>0">
                                                        ￥{{ item.money + ' + ' }}
                                                        <img :src="integral_img" style="margin-right: 8rpx;">
                                                        {{ item.integral }}
                                                    </span>
                    
                                                                        <span class="pro_price" v-else>
                                                        <img :src="integral_img" style="margin-right: 8rpx;">
                                                        {{item.integral}}
                                                    </span>
                                                </div>

                                            </div>
                                        </view>
                                    </view>
                                    <view style="min-width: 6rpx"></view>
                                </view>
                            </scroll-view>
                        </view>
                        <!-- 积分商城结束 -->
                    </template>
                </div>
                
                <div class="package" v-if="fxBg">
                    <image :src="fxBg" @click="navTo('/pagesA/distribution/fxPackageProduct')">
                        
                    </image>
                </div>
                
                <view class="fx-goods" v-if="distribution_list && distribution_list.length">
                    <view class="top">
                        <view class="home_title">
                            <view>分销商品</view>
                            <image :src="home_title_bg"></image>
                        </view>

                        <view class="more" @click="navTo('/pagesA/distribution/fxProduct')">
                            {{language.home.more}}
                            <image :src="jiantou" lazy-load="true"></image>
                        </view>
                    </view>
                    <div class="goods-wrap">
                        <div class="goods-item" v-for="(item, index) of distribution_list" :key="index" @click="_fx_goods(item.id, item.p_id)">
                            <image class="goods" :src="item.imgurl">
                                
                            </image>
                            <text class="goods-name">{{ item.product_title }}</text>
                            <view class="price-wrap">
                                <span class="fuhao">￥</span>
                                <span class="price">{{ item.price }}</span>
                            </view>
                            <view class="fx_price">
                                <text>{{language.home.share_make}} {{item.fx_price}}</text>
                            </view>
                        </div>
                    </div>
                    
                </view>
               

                <!-- 优选店铺 -->
                <view class="mch" v-if="r_mch && r_mch.length > 0">
                    <view class="home_title">
                        <view>{{language.home.shop}}</view>
                        <image :src="home_title_bg"></image>
                    </view>

                    <view class="mch_content" v-if="!opensetting">
                        <view class="mch_content_item" v-for="(item, index) of r_mch" :key="index" @tap="toUrl('/pagesB/home/mchList')">
                            <image :src="item.logo" lazy-load="true" mode=""></image>
                            <view>{{ item.name }}</view>
                            <text>{{item.distance}}km</text>
                        </view>
                    </view>
                    <view v-else>
                        <!-- #ifdef MP -->
                        <button class="openSetting" type="primary" open-type="openSetting" @tap="openSetting">{{language.home.access_to_locate}}</button>
                        <!-- #endif -->
                        <!-- #ifndef MP -->
                        <view class="locationDisc">{{language.home.please_open_locate}}</view>
                        <!-- #endif -->
                    </view>
                </view>
                <!-- 优选店铺结束 -->

                <!-- 广告位 -->
                <!-- <image class="home_gg" :src="home_gg" lazy-load="true" @tap="toUrl('/pagesB/integral/integral?toBack=true&needLogin=1')"></image> -->
                
                <swiper v-if="subtraction_list && subtraction_list.length>0" :indicator-dots="true" indicator-color="rgba(1, 67, 67, 0.5)" indicator-active-color="#FF7D00" circular="true" :autoplay="true" :interval="5000" :duration="1000" style="height: 180rpx;width: 690rpx;margin: 40rpx auto;">
                    <swiper-item v-for="item,index of subtraction_list" :key="index">
                        <image style="width: 690rpx;height: 180rpx;border-radius: 16rpx;" :src="item.image" lazy-load="true" @tap="toUrl('/pagesB/home/substration?title='+item.title+'&id='+item.id)"></image>
                    </swiper-item>
                </swiper>
                <!-- 广告位结束 -->

                <!-- 各分类推荐商品 -->
                <view class="goodsBox">
                    <scroll-view scroll-x="true" class="goods_title">
                        <view class="seckill_content_view" style="padding-bottom: 16rpx;">
                            <view @tap="changeBottom(index)" class="goods_title_item" :class="{ active: index == bottomIndex }" v-for="(item, index) of bottom_list" :key="index">
                                <view>{{ item.pname }}</view>
                                <text>{{ item.english_name }}</text>
                            </view>
                        </view>
                    </scroll-view>

                    <div class="goods_ul goods_ul-waterfall" v-if="show">

                        <div class="goods_ul_left">
                            <template v-if="listLeft.length>0">
                                <div class="goods_like goods_ul_left_li" v-for="(item, index) in listLeft" :key="index" @tap="_goods(item.id)">
                                    <div class="goods_like_img relative" style="margin: 0 auto 10rpx">
                                        <image  lazy-load :src="item.cover_map || item.imgurl" data-name="0" mode="widthFix" width="100%" @load="onImageLoad($event, 'goods_ul_left_li' + index )"/>
                                        <div v-if="item.status == 3" class="dowmPro" >
                                            {{language.store.shelf}}
                                        </div>
										<div v-else-if="item.contNum == 0" class="dowmPro" >
										    <!-- 已售罄 -->
                                            {{language.shoppingCart.soldOut}}
										</div>
                                    </div>
                                    <view :id="'goods_ul_left_li' + index">
                                        <p class="overtitle">{{ item.product_title || item.name }}</p>
                                        <view class="goods_content_item_icon">
                                            <view v-for="(item_1, index_1) in item.s_type_list" :key="index_1">{{item_1.name}}</view>
                                        </view>
                                       <!-- <view class="goods_content_item_icon">
                                            <view v-if="item.rx">{{language.home.hot}}</view>
                                            <view v-if="item.tj" style="color: #FE9331;border-color: #FE9331;">{{language.home.recommend}}</view>
                                            <view v-if="item.xp" style="color: #42B4B3;border-color: #42B4B3;">{{language.home.New_products}}</view>
                                        </view> -->
                                        <!-- <p class="overflowText">{{ item.subtitle }}</p> -->
                                        <div class="goods_mun">                                         
                                            <div class="allgoods_price" >
                                                <view class='red'>
                                                    <text class="currency">￥</text>
                                                    <text class="vip_price">{{item.vip_yprice}}</text>
                                                    <text class="sales">{{language.home.sales}} {{ item.volume }} {{language.home.piece}}</text>
                                                </view>                                              
                                            </div>
                                        </div>
                                        
                                        <div class="goods_shopBox">
                                            <img :src="item.logo" alt="">
                                            {{item.mch_name}}
                                        </div>
                                        
                                    </view>
                                    <view class="discover" @tap.stop="toUrl( '/pages/collection/discover?pro_id=' + item.id)">{{language.home.Look}}</view>
                                </div>
                            </template>
                        </div>
                        <div class="goods_ul_right">
                            <template v-if="listRight.length>0">
                                <div class="goods_like goods_ul_right_li" v-for="(item, index) in listRight" :key="index" @tap="_goods(item.id)">
                                    <div class="goods_like_img relative" style="margin: 0 auto 10rpx">
                                        <image  lazy-load :src="item.cover_map || item.imgurl" data-name="1" mode="widthFix" width="100%" @load="onImageLoad($event, 'goods_ul_right_li' + index)"/>

                                        <div v-if="item.status == 3" class="dowmPro" >
                                            {{language.store.shelf}}
                                        </div>
                                        <div v-else-if="item.contNum == 0" class="dowmPro" >
                                            <!-- 已售罄 -->
                                            {{language.shoppingCart.soldOut}}
                                        </div>
                                    </div>
                                    <view :id="'goods_ul_right_li' + index">
                                        <p class="overtitle">{{ item.product_title || item.name }}</p>
                                        <view class="goods_content_item_icon">
                                            <view v-for="(item_1, index_1) in item.s_type_list" :key="index_1">{{item_1.name}}</view>
                                            <!-- <view v-if="item.rx">{{language.home.hot}}</view>
                                            <view v-if="item.tj" style="color: #FE9331;border-color: #FE9331;">{{language.home.recommend}}</view>
                                            <view v-if="item.xp" style="color: #42B4B3;border-color: #42B4B3;">{{language.home.New_products}}</view> -->
                                        </view>
                                        <!-- <p class="overflowText">{{ item.subtitle }}</p> -->
                                        <div class="goods_mun">                                         
                                            <div class="allgoods_price" >
                                                <view class='red'>
                                                    <text class="currency">￥</text>
                                                    <text class="vip_price">{{item.vip_yprice}}</text>
                                                    <text class="sales">{{language.home.sales}} {{ item.volume }} {{language.home.piece}}</text>
                                                </view>                                           
                                            </div>
                                        </div>
                                        
                                        <div class="goods_shopBox">
                                            <img :src="item.logo" alt="">
                                            {{item.mch_name}}
                                        </div>
                                    </view>
                                    <view class="discover" @tap.stop="toUrl('/pages/collection/discover?pro_id=' + item.id)">{{language.home.Look}}</view>


                                </div>
                            </template>
                        </div>
                    </div>
                </view>
    
                <uni-load-more :loadingType="loadingType"></uni-load-more>
                <!-- 各分类推荐商品结束 -->
            </view>
        </view>
        <!-- APP更新 -->
        <div class="mask" v-if="widgetinfoo">
            <div class="mask_all">
                <img :src="upbg" class="mask_bg" />
                <img :src="close" class="mask_close" @tap="close_mask()" />
                <b class="mask_titel">{{ newapp.version }}{{language.home.Tips[2]}}</b>
                <div class="mask_content"><wxParse :content="newapp.note"></wxParse></div>
                <div class="mask_text"><div class="mask_btn" @tap="update()">{{language.home.Tips[1]}}</div></div>
            </div>
        </div>

        <!-- 提醒签到  -->
        <div class="mask" v-if="is_sign" @touchmove.stop.prevent>
            <div class="signMask">
                <img class="home_sign" :src="home_sign" alt="" />

                <div class="sign_content">
                    {{language.home.Tips[3]}}
                    <br />
                    {{language.home.Tips[4]}}
                    <span>{{language.home.Tips[5]}}</span>
                </div>

                <div class="btn" @tap="_navigateTo('/pagesA/shop/sign')">{{language.home.Tips[6]}}</div>

                <img class="cha" :src="cha" alt="" @tap="closeSign" />
            </div>
        </div>

        <!-- 提醒用户去设置打开定位  -->
        <div v-if="opensetting2" class="opensetting" @touchmove.stop>
            <div class="y_cont" style="padding: 0; height: auto; bottom: auto; top: 50%; transform: translateY(-50%);">
                <p class="con" style="padding: 54rpx;">{{language.home.position_user}}</p>
                <div class="y_btn"><button type="primary" @tap="opensetting2 = false">{{language.home.got}}</button></div>
            </div>
        </div>

        <!-- 拒绝授权之后再次提醒授权的弹窗 -->
        <div  class="opensetting" @touchmove.stop v-if="opensetting1">
            <div class="y_cont" style="padding: 0; height: auto; bottom: auto; top: 50%; transform: translateY(-50%);">
                <p class="con" style="padding: 109rpx 0 92rpx;line-height: 28rpx;">{{language.home.Tips[0]}}</p>
                <div class="y_btn1">
                    <button type="primary" @tap="opensetting1 = false">{{language.home.cancel}}</button>
                    <button type="primary" open-type="openSetting" @tap="openSetting" style="color: #020202;">{{language.home.confirm}}</button>
                </div>
            </div>
        </div>

<!--        骨架屏组件-->
        <view class="container skeleton">
            <view v-if="!load">
                <view class="container_top">
                    <!-- #ifndef MP -->
                    <view class="data_h skeleton-rect" ><view class="data_h_h"></view></view>
                    <!-- #endif -->
                    <!-- #ifdef MP -->
                    <heads class="skeleton-rect" :title="language.home.title" :border="true" :returnFlag="true"  ishead_w="1"></heads>
                    <!-- #endif -->
                    <view style="height: 88rpx;">
                        <view class="container_top_item">
                            <view class="container_top_item_left skeleton-rect"  style="white-space: nowrap;width: 120rpx;height: 68rpx">

                            </view>

                            <view class="container_top_item_center skeleton-fillet">

                            </view>

                            <view class="container_top_item_right skeleton-circle" >
                                <image src="" lazy-load="true"></image>
                            </view>
                        </view>
                    </view>
                </view>

                <view class="swiperBox skeleton-fillet" style="height: 320rpx;width: 710rpx;margin: 0 auto;"></view>
                <view class="nav">
                    <template v-for="item in 10">
                        <view class="nav_item" >
                            <image src="" class="skeleton-circle" lazy-load="true" style="width: 60rpx;height: 60rpx;"></image>
                            <span class="skeleton-rect">骨架屏</span>
                        </view>
                    </template>
                </view>

                <view class="content_top">
                    <image class="skeleton-rect" src="" lazy-load="true" ></image>
                    <image class="skeleton-rect" src="" lazy-load="true"></image>
                </view>

                <div class="seckill skeleton-rect">

                </div>
            </view>
            <skeleton :loading="!load" :animation="true" bgColor="#FFF"></skeleton>
        </view>
        
        
        <image class="zhiding" :src="zhiding" @tap="_zhiding"></image>
        
    </view>
    
</template>

<script>
    import headerSerch from './components/headerSerch';
    import blankPage from './components/blankPage';
    import combination from './components/combination';
    import guide from './components/guide';
    import menus from './components/menus';
    import richText from './components/richText';
    import seckill from './components/seckill';
    import reduction from './components/reduction';
    import swiperBg from './components/swiperBg';
    import tabNav from './components/tabNav';
    import homeAdv from './components/homeAdv';
    import homeStore from './components/homeStore';
    import HomeVideo from "@/pages/tabBar/components/homeVideo";
    import SwiperPicture from "@/pages/tabBar/components/swiperPicture";
    // #ifdef APP-PLUS
    import wxParse from '../../components/mpvue-wxparse/src/wxParse.vue';
    // #endif
    
    
    import { getTimeDiff } from '@/common/util.js';
    import { mapMutations, mapState } from 'vuex';

    export default {
        data() {
            return {
                is_grade: false,
                isShow_dialog_Pre:false,
                myPopup:0,
                isClick: true,
                jianX_h: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jianX_h.png',
                search2x: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/home_search.png',
                xiaoxi2x: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/xiaoxi172x.png',
                jiantou: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jiantou2x.png',
                home_xp: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/home_xp.png',
                home_hw: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/home_hw.png',
                home_seckillTitle: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/home_seckillTitle.png',
                seckill_btn: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/seckill_btn.png',
                home_title_bg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/home_title_bg.png',
                group_icon: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/group_icon.png',
                home_gg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/home_gg.png',
                upbg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/upbg1.png',
                integral_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/integral.png',
                grounds:this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/home_remind.png',   
                home_sign: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + '/images/icon1/home_sign.png',
                cha: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + '/images/icon1/close_y.png',
                zhiding: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/zhiding.png',
                diongClose:this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/home_remind3.png', 
                
                banner: [],
                dotIndex: 0, //轮播图下标
                yulan: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + '/images/icon1/yulan.gif', //加载动画
                nav_list: [
                ],
                bottom_list: [],
                fxBg: '',
                xxnum: '',
                bottomIndex: 0,
                r_mch: [],
                region: {
                    district: '岳麓区'
                },
                Marketing_list: [],
                newapp: {},
                widgetinfoo: false,
                is_sign: false,

                opensetting: false,
                opensetting1: false,
                opensetting2: false,
                go_group_list: [],

                Intervalid: '',
                time: {
                    hours: '00',
                    minutes: '00',
                    seconds: '00'
                },
                loadingType: 0,
                page: 1,
                class_pro: [],
                class_cid: '',

                longitude: '112.951227',
                latitude: '28.227965',
                is_diy: false,
                bgColor: [
                    {
                        item: '#FFFFFF'
                    },
                    {
                        item: '#FFFFFF'
                    }
                ],
                onReachBottomBg: [
                    {
                        item: '#014343'
                    },
                    {
                        item: '#014343'
                    }
                ],
                styleConfig: [],
                
                tempArr: [],
                load: false,
                isRequest: false,
                listLeft: [],
                listRight: [],
                cardLeftHeight: 0,
                cardRightHeight: 0,
                handleNum: 0,
                closeDiy: false, // 通过页面参数关闭diy来方便调试
                show: true,
                distribution_list: [], // 分销商品列表
                subtraction_list: []
            };
        },
        components: {
            SwiperPicture,
            HomeVideo,
            headerSerch,
            blankPage,
            combination,
            guide,
            menus,
            richText,
            seckill,
            swiperBg,
            tabNav,
            homeAdv,
            homeStore,
            reduction,
            // #ifdef APP-PLUS
            wxParse,
            // #endif
        },
        computed: {
            halfWidth: function() {
                var gru = uni.getStorageSync('data_height') ? uni.getStorageSync('data_height') : this.$store.state.data_height;
                var heigh = parseInt(gru);

                // #ifdef MP
                heigh = 0;
                // #endif

                var he = heigh * 2;
                return uni.upx2px(he) + 'px';
            },
            ...mapState({
                _cart_num: 'cart_num'
            })
        },
        onTabItemTap(e) {
            this.LaiKeTuiCommon.closeMPAuthWin(this);
        },
        onShareAppMessage: function(res) {
            return {
                title: this.language.home.title,
                path: '/pages/tabBar/home',
                success: function(res1) {
                    console.log('转发成功');
                }
            };
        },
        onLoad(option) {
            uni.removeStorageSync('region');
            uni.removeStorageSync('signFlag');                      
            clearInterval(this.Intervalid);
            
            
            this.closeDiy = option.closeDiy

            // 有分享的属性
            if (option.isfx) {
                if (option.pages == 'goodsDetailed') {
                    if (option.fatherId != '' || option.fatherId) {
                        uni.navigateTo({
                            url: '/pages/goods/goodsDetailed?productId=' + option.productId + '&isfx=true&fatherId=' + option.fatherId
                        });
                        return false;
                    }
                    uni.navigateTo({
                        url: '/pages/goods/goodsDetailed?productId=' + option.productId + '&isfx=true'
                    });
                    return false;
                } else if (option.pages == 'groupDetailed') {
                    uni.navigateTo({
                        url: '/pagesA/group/groupDetailed?pro_id=' + option.pro_id + '&activity_no=' + this.option.activity_no + '&isfx=true'
                    });
                    return false;
                } else if (option.pages == 'group_end') {
                    uni.navigateTo({
                        url: '/pagesA/group/group_end?sNo=' + option.sNo + '&friend=true&isfx=true'
                    });
                    return false;
                }
            }

            // #ifdef APP-PLUS
            this.widgetinfo();
            // #endif
            
            this.getShow()
            uni.removeStorageSync('isHomeShow')
        },
        onUnload() {
            clearInterval(this.Intervalid);
        },
        onHide(){
            this.opensetting1 = false;
        },
        onReady() {
          uni.setNavigationBarTitle({
              title: this.language.home.title
          });  
        },
        async onShow() {
            // 待付款订单数量                      
             this.myPopup = uni.getStorageSync("myPopup")           
                  if (this.myPopup > 0 && uni.getStorageSync("login_key") == 0) {
                      this.isShow_dialog_Pre = true
                      uni.setStorageSync("login_key", 1)
                  }
                  
            this.getCart()
            
            this.is_sign = false;

            this.isClick = true;
            
            if(uni.getStorageSync('isHomeShow')){
                uni.pageScrollTo({
                    scrollTop: 0,
                    duration: 10
                })
                this.getShow()
                uni.removeStorageSync('isHomeShow')
            }

            var isfx = uni.getStorageSync('isfx');

            if(uni.getStorageSync('region')){
                let region1 = uni.getStorageSync('region')
                if(region1&&region1.district&& region1.district.length>3){
                    region1.district = region1.district.substr(0,2) + '...'
                }
                this.region = region1
            }
            
            
            if (isfx) {
                var pages = uni.getStorageSync('pages');
                if (pages == 'goodsDetailed') {
                    var fatherId = uni.getStorageSync('fatherId');
                    var productId = uni.getStorageSync('productId');
                    uni.removeStorageSync('isfx');
                    uni.removeStorageSync('pages');
                    uni.removeStorageSync('fatherId');
                    uni.removeStorageSync('productId');
                    if (fatherId != '' || fatherId) {
                        uni.navigateTo({
                            url: '/pages/goods/goodsDetailed?productId=' + productId + '&isfx=true&fatherId=' + fatherId
                        });
                        return false;
                    }
                    uni.navigateTo({
                        url: '/pages/goods/goodsDetailed?productId=' + productId + '&isfx=true'
                    });
                    return false;
                } else if (pages == 'groupDetailed') {
                    var pro_id = uni.getStorageSync('pro_id');
                    var activity_no = uni.getStorageSync('activity_no');
                    uni.removeStorageSync('pro_id');
                    uni.removeStorageSync('activity_no');
                    uni.removeStorageSync('isfx');
                    uni.removeStorageSync('pages');
                    uni.navigateTo({
                        url: '/pagesA/group/groupDetailed?pro_id=' + pro_id + '&activity_no=' + activity_no + '&isfx=true'
                    });
                    return false;
                } else if (pages == 'group_end') {
                    var sNo = uni.getStorageSync('sNo');
                    uni.removeStorageSync('sNo');
                    uni.removeStorageSync('isfx');
                    uni.removeStorageSync('pages');
                    uni.removeStorageSync('friend');
                    uni.navigateTo({
                        url: '/pagesA/group/group_end?sNo=' + sNo + '&friend=true&isfx=true'
                    });
                    return false;
                }
            }
            
        },
        onReachBottom: function() {
            this.page ++;
            if (this.is_diy) {
                if (this.loadingType != 0) {
                    return;
                }
                console.log('this.page', this.page)
                return; 
            }
            
            if (this.handleNum < this.class_pro.length) {
                return;
            }
            if (this.loadingType != 0) {
                return;
            }
            this.loadingType = 1;
            var data = {
                module: 'app',
                action: 'index',
                app: 'get_more',
                page: this.page,
                cid: this.class_cid
            };

            this.$req.post({ data }).then(res => {
                let { data } = res;
                //this.page += 1;
                if (data && data.length > 0) {

                    data.filter(item=>{
                        item.vip_price = Number(item.vip_price).toFixed(2)
                        item.vip_yprice = Number(item.vip_yprice).toFixed(2)
                    })

                    this.class_pro = this.class_pro.concat(data);
                    setTimeout(() => {
                        this.waterfall()
                    }, 1)
                    this.loadingType = 0;
                } else {
                    this.loadingType = 2;
                }
            });
        },
        onPullDownRefresh() {
            // region
            uni.removeStorageSync("region")
            this.getShow()
        },
        methods: {
            closeDialog_pro() {
                this.isShow_dialog_Pre = false
            },
            _order() {
                this.isLogin(() => {
                    this.isShow_dialog_Pre=false
                    uni.navigateTo({
                        url: '/pagesC/webView/preSale?status=1'
                    });
                })
            },
            _zhiding() {
                uni.pageScrollTo({
                    scrollTop: 0,
                    duration: 300
                });
            },
            async getShow(){
                let {
                    data
                } = await this.has_diy()
                
                this.page = 1;
                
                this.loadingType = 0;
                this.is_diy = data.has
                
                if (this.closeDiy) {
                    this.is_diy = false;
                }
                
                this.LaiKeTuiCommon.getUrlFirst(this.getLocationAuthorize);
            },
			closeSign(){
				this.is_sign = false
			},
            ...mapMutations({
                cart_num: 'SET_CART_NUM'
            }),
            async has_diy () {
                var data = {
                    module: 'app',
                    action: 'index',
                    app: 'hasDiy'
                }
                return  this.$req.post({data})

            },
            changePage (page) {
                this.page = page
            },
            onHandleLoadingType (loadingType) {
                console.log('loadingType', loadingType);
                this.loadingType = loadingType;
            },
            waterfall(){
                if(this.class_pro.length == 0){
                    return
                }
                if(this.cardLeftHeight>this.cardRightHeight){
                    let cardList = this.class_pro.splice(0,1);		//初始化图片显示
                    this.listRight.push(cardList[0]);
                }else if(this.cardLeftHeight<=this.cardRightHeight){
                    let cardList = this.class_pro.splice(0,1);		//初始化图片显示
                    this.listLeft.push(cardList[0]);
                }
            },
            getCart(){
                var data = {
                    module: 'app',
                    action: 'cart',
                    app: 'index',
                    cart_id: '',
                    page: 1
                }

                this.$req.post({ data }).then(res => {
                    let { code,
                    data: {
                        data, list, mch_list, login_status, grade
                    }
                    , message } = res

                    if (code == 200) {
                        if (data && data.length) {
                            var allnum = 0
                            for (var i = 0; i < data.length; i++) {
                                allnum += Number(data[i].num)
                            }
                            this.cart_num(allnum)
                        } else if (data.length == 0) {
                            this.cart_num(0)
                        }
                        //添加，移除tabbar购物车小点提醒
                        if (this._cart_num) {
                            var cart_num_str = String(this._cart_num)

                            // #ifdef MP-WEIXIN
                            uni.setTabBarBadge({
                                index: 2,
                                text: cart_num_str
                            })
                            // #endif

                            // #ifndef MP-WEIXIN
                            uni.setTabBarBadge({
                                index: 2,
                                text: cart_num_str
                            })
                            // #endif

                        } else {
                            // #ifdef MP-WEIXIN
                            uni.removeTabBarBadge({
                                index: 2
                            })
                            // #endif

                            // #ifndef MP-WEIXIN
                            uni.removeTabBarBadge({
                                index: 2
                            })
                            // #endif
                        }
                    } else {
                        // #ifdef MP-WEIXIN
                        uni.removeTabBarBadge({
                            index: 2
                        })
                        // #endif

                        // #ifndef MP-WEIXIN
                        uni.removeTabBarBadge({
                            index: 2
                        })
                        // #endif
                    }
                })
            },
            toArea(){
                uni.setStorageSync('region',this.region)
                this.toUrl('/pagesB/home/chooseArea')
            },
            changeBottom(index){
                if (index == this.bottomIndex) {
                    return false;
                }
                
                this.bottomIndex = index
                this.page = 1
                if (!this.is_diy) {
                    this.empty();
                }
                this.class_cid = this.bottom_list[index].cid
                this.class_pro = this.bottom_list[index].list.concat()
                this.waterfall()
                
                
                if(this.class_pro.length>0){
                    this.loadingType = 0
                }else{
                    this.loadingType = 2
                }
            },
            close_mask() {
                uni.showTabBar();
                this.widgetinfoo = false;
            },
            /* 
                获取当前地址
            */
            getLocationAuthorize() {
                console.log(4);
                // #ifdef MP
                uni.authorize({
                    scope: 'scope.userLocation',
                    success: res => {
                        uni.getLocation({
                            success: res => {
                                console.log('打开定位并同意授权了');
                                this.longitude = res.longitude
                                this.latitude = res.latitude
                                // this.opensetting = false;
                                this.opensetting1 = false;

                                if (this.is_diy) {
                                    this._diy_axios()
                                } else {
                                    this._axios()    
                                }
                                
                            },
                            fail: () => {
                                //同意授权但未开启定位
                                console.log('失败失败失败失败');
                                // this.opensetting = true;
                                this.opensetting1 = true;

                                if (this.is_diy) {
                                    this._diy_axios()
                                } else {
                                    this._axios()
                                }
                            }
                        });
                    },
                    fail: () => {
                        // 再次让用户授权
                        // this.opensetting = true;
                        this.opensetting1 = true;

                        if (this.is_diy) {
                            this._diy_axios()
                        } else {
                            this._axios()
                        }
                    }
                });
                // #endif
                // #ifdef APP
                    this.getLocation();
                // #endif
                
                // #ifdef H5
                    if (this.is_wx()) {
                        this.getLocation()
                    } else {
                        if (this.is_diy) {
                            this._diy_axios()
                        } else {
                            this._axios()
                        }        
                    }
                // #endif
                
                
            },
            getLocation () {
                uni.getLocation({
                    success: res => {
                        console.log('打开定位并同意授权了');
                        this.longitude = res.longitude
                        this.latitude = res.latitude
                        this.opensetting = false;
                        this.isRequest = true;
                        if (this.is_diy) {
                            this._diy_axios()
                        } else {
                            this._axios()
                        }
                        
                    },
                    fail: (e) => {
                        console.log(e)
                        //同意授权但未开启定位
                        console.log('失败失败失败失败');
                        // this.opensetting = true;
                        this.opensetting2 = true;

                        if (this.is_diy) {
                            this._diy_axios()
                        } else {
                            this._axios()
                        }
                        
                    },
                    complete: () => {
                        console.log('完成');
                        
                    }
                });  
            },
            is_wx () {
                let en = window.navigator.userAgent.toLowerCase()
                // 匹配en中是否含有MicroMessenger字符串
                return en.match(/MicroMessenger/i) == 'micromessenger'
            },
            /* 
                点击导航图标
            */
            navClick(item) {
                // if (!item.status) {
                //     uni.showToast({
                //         title: this.language.home.noAvailable,
                //         icon: 'none'
                //     });
                //     return;
                // }
                // #ifndef MP-WEIXIN
                if (item.name == '来客电商直播' || item.name == 'live') {
                    uni.showToast({
                        title: this.language.home.openWeChat,
                        icon: 'none'
                    });
                    return;
                }
                // #endif


                if(item.isPlugin){
                    this.isLogin(() => {
                        // if(!this.isClick){
                        //     return
                        // }
                        // this.isClick = false
                        if (item.url.includes('tabBar')) {
                            uni.switchTab({
                                url: item.url
                            });
                        } else {
                            uni.navigateTo({
                                url: item.url
                            });
                        }
                    });
                }else{
                    // if(!this.isClick){
                    //     return
                    // }
                    // this.isClick = false
                    if (item.url.includes('tabBar')) {
                        uni.switchTab({
                            url: item.url
                        });
                    } else {
                        uni.navigateTo({
                            url: item.url
                        });
                    }
                }

            },
            /* 
                轮播图切换
            */
            changeBanner(e) {
                this.dotIndex = e.detail.current;
            },
            widgetinfo() {
                var me = this; 
                plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
                    uni.request({
                        url: uni.getStorageSync('endurl') + 'widgetinfo/update.php?store_id=' + me.LaiKeTuiCommon.LKT_STORE_ID,
                        data: {
                            version: widgetInfo.version,
                            name: widgetInfo.name
                        },
                        success: result => {
                            me.newapp = result.data;
                            if (uni.getSystemInfoSync().platform === 'android') {
                                me.newapp.url = me.newapp.android_url;
                            } else {
                                me.newapp.url = me.newapp.ios_url;
                            }
                            if (me.newapp.status == 1) {
                                me.widgetinfoo = true;
                                uni.hideTabBar();
                            }
                        }
                    });
                });
            },
            update() {
                this.widgetinfoo = false;
                uni.showTabBar();
                plus.runtime.openURL(this.newapp.url, function(res) {
                    uni.showToast({
                        title: this.language.home.updateFail,
                        duration: 1000,
                        icon: 'none'
                    });
                });
            },
            async _diy_axios () {
                await this.getHasGrade()
                await this.getDiy()
                await this.getSignStatus();
                this.load = true;
            },
            empty () {
                this.listRight = [];
                this.listLeft = [];
                this.cardLeftHeight = 0;
                this.cardRightHeight = 0;
                this.handleNum = 0;
            },
            async getSignStatus () {
                let data = {
                    module: 'app',
                    action: 'diy',
                    app: 'getSignStatus'
                }
                let {
                    data: {
                        is_sign_status,
                        sign_status
                    }
                } =  await this.$req.post({data})
                if (is_sign_status === 1 && sign_status === 1 && !uni.getStorageSync('signFlag')) {
                    this.is_sign = true;
                    uni.setStorageSync('signFlag',true)
                }

            },
            async getDiy () {
                if(uni.getStorageSync('longitude')){
                    this.longitude = uni.getStorageSync('longitude')
                    this.latitude = uni.getStorageSync('latitude')
                }else{
                    uni.setStorageSync('longitude',this.longitude)
                    uni.setStorageSync('latitude',this.latitude)
                }

                if(uni.getStorageSync('region')){
                    let region1 = uni.getStorageSync('region')
                    if(region1&&region1.district.length>3){
                        region1.district = region1.district.substr(0,2) + '...'
                    }
                    this.region = region1
                }

                
                
                let data = {
                    module: 'app',
                    action: 'diy',
                    app: 'index',
                    longitude: this.longitude,
                    latitude: this.latitude
                }
                
                let res =  await this.$req.post({data})
                res = Object.assign(res, res.data)
                uni.stopPullDownRefresh()
                
                this.styleConfig = this.objToArr(res.data);
                this.objToArr(res.data).forEach((item) => {

                    if (item.name === 'homeBg') {
                        this.bgColor = item.bgColor.color
                    }
                    
                    if (item.name === 'headerSerch') {
                        this.onReachBottomBg = item.bgColor.color
                    }
                })

                if (res.grade && res.grade != 0) {
                    this.is_grade = true;    
                }
                
                
                
                let region = res.region
                if(region && region.district.length>3){
                    region.district = region.district.substr(0,2) + '...'
                }

                if(!uni.getStorageSync('region')){
                    this.region = region
                }
            },
            // 对象转数组
            objToArr(data) {
                let obj = Object.keys(data);
                let m = obj.map(key => data[key]);
                return m
            },

            async getHasGrade () {
                let data = {
                    module: 'app',
                    action: 'index',
                    app: 'get_membership_status'
                }
                let res = await this.$req.post({data})
                this.getGrade = true
                if(res.code == 200){
                    this.hasGrade = res.data.membership_status
                    uni.setStorageSync('hasGrade', this.hasGrade)
                }
            },
            async _axios() {
                await this.getHasGrade()
                if(uni.getStorageSync('longitude')){
                    this.longitude = uni.getStorageSync('longitude')
                    this.latitude = uni.getStorageSync('latitude')
                }else{
                    uni.setStorageSync('longitude',this.longitude)
                    uni.setStorageSync('latitude',this.latitude)
                }

                console.log(this.longitude);
                // 首页数据
                var data = {
                    module: 'app',
                    action: 'index',
                    app: 'index',
                    longitude: this.longitude,
                    latitude: this.latitude
                };

                if(uni.getStorageSync('region')){
                    let region1 = uni.getStorageSync('region')
                    if(region1 && region1.district && region1.district.length>3){
                        region1.district = region1.district.substr(0,2) + '...'
                    }
                    console.log(region1);
                    this.region = region1
                }

                this.$req
                    .post({
                        data,
                        xhrFields: {
                            withCredentials: true
                        }
                    })
                    .then(res => {
                        uni.stopPullDownRefresh()
                        
                        let {
                            data: { banner,  Marketing_list,list2, xxnum, r_mch, is_sign_status, sign_status, go_group_list, grade, region, login_status, nav_list }
                        } = res;

                        if (grade && grade != 0) {
                            this.is_grade = true;
                        } else {
                            this.is_grade = false;
                        }
                        
                        if(res.data.distribution_list){
                            this.distribution_list = res.data.distribution_list.list
                            this.fxBg = res.data.distribution_list.ad_image
                            this.subtraction_list = res.data.subtraction_list
                        }
                        
                        this.Marketing_list = Marketing_list;
                        
                        if( region && region.district && region.district.length>3){
                            region.district = region.district.substr(0,2) + '...'
                        }
                        
                        if(!uni.getStorageSync('region')){
                            this.region = region
                        }

                        if (is_sign_status == 1 && sign_status == 1 && !uni.getStorageSync('signFlag')) {
                            this.is_sign = true;
                            uni.setStorageSync('signFlag',true)
                        }
                        this.nav_list = nav_list

                        this.banner = banner;

                        if(list2.length>0){
                            this.class_cid = list2[this.bottomIndex].cid
                        }

                        list2.filter(item=>{
                            if(item.list){
                               item.list.filter(it=>{
                                   it.vip_price = Number(it.vip_price).toFixed(2)
                                   it.vip_yprice = Number(it.vip_yprice).toFixed(2)
                               }) 
                            }
                            

                            if(item.cid == this.class_cid){
                                this.show = false
                                if(item.list){
                                    this.class_pro = item.list.concat()
                                }
                                this.empty();
                                setTimeout(() => {
                                    this.waterfall();
                                    this.show = true
                                }, 100)
                            }
                        })

                        this.bottom_list = list2;

                        if(list2.length>0){
                            this.loadingType = 0
                        }else{
                            this.empty()
                            this.loadingType = 2
                        }

                        
                        this.xxnum = xxnum > 99 ? '99+' : Number(xxnum); //限制消息数超过99时显示99+

                        
                        this.r_mch = r_mch;
                        this.go_group_list = go_group_list ? go_group_list : [];

                        if(Marketing_list){
                            for (let item of Marketing_list.values()) {
                                if (item.activity_type == 1 && item.plug_type == 8) {
                                    if (item.list.current_time && item.list.current_time[0]) {
                                        this.setCountDown(item.list.current_time[0]);
                                    }
                                    break;
                                }
                                    
                            }
                        }
                        
                        this.load = true
                    }).catch(error=>{
                        uni.stopPullDownRefresh()
                    });
            },
            /**
             * 倒计时
             * */
            setCountDown(item) {
                clearInterval(this.Intervalid);

                let year = new Date().getFullYear();
                let month = new Date().getMonth() + 1;
                let dates = new Date().getDate();
                let endtime = '';

                if (item.type == 2) {
                    endtime = `${year}-${month}-${dates} ${item.starttime}`;
                } else {
                    endtime = `${year}-${month}-${dates} ${item.endtime}`;
                }

                this.timeFun(endtime, item);

                this.Intervalid = setInterval(() => {
                    this.timeFun(endtime, item);
                }, 1000);
            },
            timeFun(endtime, item) {
                let result = getTimeDiff(endtime);

                this.time.hours = result.hours;
                this.time.minutes = result.minutes;

                if (result.seconds<0 || result.hours<0 || result.minutes<0) {
                    clearInterval(this.Intervalid);
                    this._axios();
                    return;
                }
                this.time.seconds = result.seconds;
            },
            _navigateTo(url) {
                if (this.isClick) {
                    this.isClick = false;
                    this.isLogin(() => {
                        uni.navigateTo({
                            url: url
                        });
                    });
                    setTimeout(function() {
                        this.isClick = true;
                    }, 800);
                }
            },
            onImageLoad(e, id){
                let divWidth = 336;			//实际显示的单栏宽度，345upx
                let oImgW = e.detail.width; //图片原始宽度
                let oImgH = e.detail.height; //图片原始高度
                let rImgH = Math.round(divWidth*oImgH/oImgW * 100) / 100;	//重新计算当前载入的card的高度

                const query = uni.createSelectorQuery().in(this);

                let height = 0;

                query.select('#' + id).boundingClientRect(data => {
                    height = data.height;
                }).exec();

                rImgH = rImgH + (height * 2);

                if(e.target.dataset.name == 0){
                    this.cardLeftHeight += rImgH
                }else{
                    this.cardRightHeight += rImgH
                }

                this.waterfall()
                this.handleNum ++;
            },
            _goods(id) {
                this.$store.state.pro_id = id;
                uni.navigateTo({
                    url: '/pages/goods/goodsDetailed?toback=true&pro_id='+id
                });
            },
            _fx_goods(id, p_id) {
                this.$store.state.pro_id = id;
                uni.navigateTo({
                    url: '/pages/goods/goodsDetailed?isDistribution=true&toback=true&pro_id='+p_id + '&fx_id=' + id
                });
            },
            
            toUrl(url, is_login = false, is_sign) {
                if (this.is_diy) {
                    if (is_login) {
                        this.isLogin(() => {
                            if(is_sign){
                                this.$req.post({
                                    data: {
                                        module: 'app',
                                        action: 'sign',
                                        app: 'sign',
                                    }
                                }).then(res=>{
                                    if(res.code == 200){
                                        this.toUrl(url, false)
                                    }else{
                                        uni.showToast({
                                            title: res.message,
                                            icon: 'none'
                                        })
                                    }
                                })
                                
                                return
                            }
                            
                            this.toUrl(url, false)
                        })
                        return false
                    }
                    if (url.includes('tabBar')) {
                        uni.switchTab({
                            url
                        });
                    } else {
                        if (url.includes('http')) {
                            let query = {url}
                            uni.navigateTo({
                                url: '/pagesC/webView/webView?query=' + encodeURIComponent(JSON.stringify(query))
                            });
                        } else {
                            uni.navigateTo({
                                url
                            });
                        }

                        
                    }
                    return false;
                }
                
                if (url.includes('tabBar')) {
                    uni.switchTab({
                        url
                    });
                } else {
                    uni.navigateTo({
                        url
                    });
                }
            },
            openSetting() {
                uni.openSetting({
                    success(res) {
                        console.log(res.authSetting);
                    }
                });
                this.getLocationAuthorize();
            }
        }
    };
</script>

<style scoped lang="less">
    @import url('../../static/css/tabBar/home.less');
</style>
