<!-- 分销中心 -->
<template>
    <div class="distribution_center">
        <heads :title="language.distribution_center.title"></heads>
        
        <!-- right-text="代理规则" :right-icon="hei_wen" @right-click="_navigator('./distribution_rule')" -->

        <!-- 已经是分销商了的 -->
        <div v-if="is_distribution == 1">
            <view class="center_top">
                
                
                <view class="c_t_c">
                    <img class="bg_img" mode="aspectFill" :src="centerBg" />
                    <view class="ctc_top">
                        <img class="myheader_img" mode="aspectFill" :src="order.headimgurl" />
                        <view class="ctx_middle">
                            <view class="mid_1">
                                <view>{{ order.user_name }}</view>
                                <view>{{ order.levelname }}</view>
                            </view>
                            <view class="mid_2">{{language.distribution_center.referrer}} {{ order.pidname }}</view>
                        </view>
                        <view class="ctc_right" @tap="_navigator(`./distribution_share?fatherId=${order.user_id}`)">
                            <img class="c_right_img" mode="aspectFill" :src="erwm" />
                            <view>{{language.distribution_center.myPromotion}}</view>
                        </view>
                    </view>

                    <div class="withdrawal-wrap" >
                        <div class="withdrawal">
                            <div class="left">
                                {{ language.distribution_center.wdyj }}
                            </div>
                            <div class="right"  @tap="supply()">
                                {{ language.distribution_center.withdrawal }}
                            </div>
                        </div>
                    </div>
                    
                </view>

                
                
                
                
                <view class="card">
                    <view class="card_top">
                        <view class="card_top_item">
                            <view>{{ order.comm1 || 0 }}</view>
                            <text>{{language.distribution_center.expect}}</text>
                        </view>
                        <view class="card_top_item">
                            <view>{{ order.comm3 || 0 }}</view>
                            <text>{{language.distribution_center.canWithdraw}}</text>
                        </view>
                        <view class="card_top_item">
                            <view>{{ order.comm2 || 0 }}</view>
                            <text>{{language.distribution_center.total}}</text>
                        </view>
                    </view>
<!--                    <view @tap="supply()">{{language.distribution_center.withdrawal}}</view>-->
                    
                </view>
               
                <view class="c_three">
                    <view class="three_one" @tap="navTo('/pagesA/distribution/fxProduct')">
                        <img class="one1" mode="aspectFill" :src="three0" />
                        <view>{{language.distribution_center.fxsc}}</view>
                    </view>
                    <view class="three_one" @tap="_navigator('./distribution_team')">
                        <img class="one1" mode="aspectFill" :src="three1" />
                        <view>{{language.distribution_center.myTeam}}</view>
                    </view>
                    <view class="three_one" @tap="_navigator('./distribution_flow')">
                        <img class="one2" mode="aspectFill" :src="three2" />
                        <view>{{language.distribution_center.commissionSubsidiary}}</view>
                    </view>
                    <view class="three_one" @tap="_navigator('./distribution_tocashFlow')">
                        <img class="one3" mode="aspectFill" :src="three3" />
                        <view>{{language.distribution_center.withdrawalSubsidiary}}</view>
                    </view>
                    <view class="three_one" @tap="_navigator('./fxRanking')">
                        <img class="one1" mode="aspectFill" :src="three5" />
                        <view>{{language.distribution_center.yjph}}</view>
                    </view>
                    <view class="three_one" @tap="_navigator('./distribution_order')">
                        <img class="one1"  :src="three6" style="width: 52rpx;height: 62rpx;"/>
                        <view>{{language.distribution_center.tgdd}}</view>
                    </view>
                    <view class="three_one" @tap="_navigator('./distribution_rule')">
                        <img class="one1" mode="aspectFill" :src="three4" />
                        <view>{{language.distribution_center.rules}}</view>
                    </view>
                </view>
            </view>
        </div>

        <!-- 还不是分销商的 -->
        <div v-else-if="is_distribution == 0">
            <view class="noSupply">
                <img class="no_img" :src="noSupply" />
                <view class="">{{language.distribution_center.noDistribution}}</view>
                <view class="beproxy" @tap="_navigator('/pagesA/distribution/fxProduct')">{{language.distribution_center.upDistribution}}</view>
            </view>
        </div>

        <div class="load yh-load" v-if="load">
            <div>
                <img :src="loadImg" />
                <p>{{language.distribution_center.load}}…</p>
            </div>
        </div>
        <maskM :content="language.distribution_center.qxtj" :display="display" @mask_value="onHande"></maskM>
    </div>
    
</template>

<script>
import { mapMutations } from 'vuex';
import maskM from "@/components/maskM";

export default {
    data() {
        return {
            fastTap: true,
            head: true, // 头部切换
            display: false,
            order: '', // 订单数据
            bindding_id: '', // 订单状态
            load: true,
            tixian_id: -1,
            wenhao2: '',
            is_distribution: null, // 是否是分销商？1是，0不是
            centerBg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/' + 'distributionBg.png',
            three0: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/' + 'fxsc.png',
            three1: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/' + 'distribution_td.png',
            three2: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/' + 'distribution_yj.png',
            three3: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/' + 'distribution_mx.png',
            three4: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/' + 'distribution_rule.png',
            three5: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/' + 'yjph.png',
            three6: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/' + 'tgdd.png',
            noSupply: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/' + 'fx_sq.png',
            loadImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/5-121204193R7.gif',
            emptyImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/empyimg92x.png',
            back1: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/fx_whiteJT.png',
            back2: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/back2x.png',
            wenhao: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/fx_wenhao.png',
            hei_wen: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/fx_heiwenhao.png',
            erwm: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/fx_erwm.png'
        };
    },
    components: {
        maskM
    },
    onShow() {
        this._axios();
    },

    methods: {
        ...mapMutations({}),
        onHande (value) {
            if (value === '取消') {
                this.display = false;
            } else {
                this.display = false;
                this.navTo('/pagesB/setUp/changePhone?withdrawalNoPhone=1')
            }
        },
        /**
         *
         * */
        supply() {
            let user_phone = uni.getStorageSync('user_phone')
            if (!user_phone) {
                this.display = true;
                return false;
            }
            
            
            if (this.tixian_id > 0) {
                uni.showToast({
                    title: this.language.distribution_center.reviewRecordTips,
                    icon: 'none',
                    duration: 1000
                });
            } else {
                uni.navigateTo({
                    url: './distribution_form?total='+this.order.comm3
                });
            }
        },
        /**
         *
         * */
        _navigator(url) {
            uni.navigateTo({
                url: url
            });
        },
        /**
         * 获取数据
         * */
        _axios() {
            let data = {
                module: 'app',
                action: 'commcenter',
                app: 'index',
                
            };

            this.$req.post({ data }).then(res => {
                if (res.code == 404) {
                    this.isLogin(()=>{})
                } else {
                    this.load = false;
                    let {
                        data: {
                            
                        }
                    } = res;
                    
                    
                    this.order = res.data;
                    this.is_distribution = res.data.is_distribution;
                    this.tixian_id = res.data.tixian_id;
                }
            });
        }
    }
};
</script>

<style scoped lang="less">
@import url('../../static/css/distribution/distribution_center.less');
</style>
