<template>
    <div>
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>

        <!-- #ifndef MP -->
        <heads :title="language.refund.title" :returnR="returnR"></heads>
        <!-- #endif -->

        <!--  提交申请    -->
        <div v-if="!return_suess" style="position: relative;overflow: hidden;">
            <ul class="order_goods">
                <li class="order_two" v-for="(item, index) in order" :key="index">
                    <img :src="item.image" />
                    <div class="order_two_div">
                        <p class="p_name">{{ item.p_name }}</p>
                        <p class="color_one">{{ item.size }}</p>
                    </div>
                    <div>
                        <p>￥{{ Number(item.p_price).toFixed(2)}}</p>
                        <p class="color_two">x{{ item.num }}</p>
                    </div>
                </li>
            </ul>

            <div class="yh-line"></div>

            <ul class="refund_pay">
                <li>
                    <div class="right_d">
                        <div class="right_d_div">
                            <span class="leftText">
                                <span>售后类型</span>
                                ：
                            </span>
                            <p v-if="refund_type==1">{{language.returnGoods.Return_refund}}</p>
                            <p v-if="refund_type==2">{{language.returnGoods.only}}</p>
                            <p v-if="refund_type==3">{{language.returnGoods.exchange}}</p>
                            <!-- <span class='refund_color font_red'>￥{{refund_price}}</span> -->
                        </div>
                       
                    </div>
                </li>
                <li v-if="r_status != 3 && refund_type != 3">
                    <div class="right_d">
                        <div class="right_d_div">
                            <span class="leftText">
                                <span>{{language.refund.amount}}</span>
                                ：
                            </span>
                            <p class="refund_color font_red">￥</p>
                            <!-- <span class='refund_color font_red'>￥{{refund_price}}</span> -->
                            <input class="refund_color font_red" type="number" v-model="refund_price_" @blur="refund_price_rule" />
                        </div>
                        <div>
                            <span class="refund_color yh-refund_color">{{language.refund.most}}￥{{ refund_price }}</span>
                        </div>
                    </div>
                </li>

                <li v-if="r_status == 3" style="display: flex;justify-content: start;">
                    <span class="leftText">
                        <span>{{language.refund.type}}</span>
                        ：
                    </span>
                    <span>{{language.refund.Return}}</span>
                </li>

                <li :style="{ 'align-items': 'flex-start'}">
                    <span class="leftText">
                        <span>{{ r_status != 3 ? (   refund_type != 3  ? language.refund.r_status[0] : language.refund.r_status[1] ) : language.refund.r_status[1] }}</span>
                        ：
                    </span>
                    <textarea style="margin-left: 0;word-break: break-all" class="input_text" rows="4" maxlength="200" :placeholder="language.refund.input_placeholder" placeholder-style="color:#b8b8b8" v-model="content" @keydown="_text" />
                </li>

                <li class="evaluat_ul evaluat_imgBox">
                    <span class="yh-evaluat_ul leftText">
                        <span>{{language.refund.upload}}</span>
                        ：
                    </span>

                    <div class="evaluat_li" v-for="(img, index) in src" :key="index">
                        <img class="evaluat_img" :src="img" @touchstart="_touchstart(index)" @touchend="_touchend" />
                        <img class="img_dele" :src="delete_img" @tap="_delete(index)" />
                    </div>

                    <div class="uploadphoto" @tap="choiceImg(src.length)" v-if="src.length < 3 ? true : false">
                        <img class="xiangji" :src="xiangji_img" />
                        <p class="p">{{language.refund.most}}</p>
                        <p class="p">{{language.refund.Upload3}}</p>
                    </div>
                </li>
            </ul>
            <div class="yh-return_suess-div"></div>
            <div class="bottom" @tap="_button" :style="dsb ? 'opcity: 0.4' : ''">{{language.refund.Submit}}</div>
        </div>
        <!--   申请成功   -->
        <div class="return_end" v-if="return_suess" style="position: relative;overflow: hidden;">
            <div class="pic"><img :src="gouhei_img" /></div>

            <p class="end_one">{{ refund_type != 3 ? language.refund.r_status[2] : language.refund.r_status[3] }}{{language.refund.Tips[0]}}</p>

            <p class="end_two">{{language.refund.Tips[1]}}</p>

            <div class="yh-return-end-div"></div>

            <div class="return_message">{{ refund_type != 3 ? language.refund.r_status[4] : language.refund.r_status[5] }}</div>

            <ul class="end_msg_ul">
                <li class="end_message">
                    <div class="end_lef">{{language.refund.Trade_name}}：</div>
                    <div class="flex1">{{ order_end.product_title[0] }}</div>
                </li>

                <li class="end_message">
                    <div class="end_lef">{{language.refund.order_number}}：</div>
                    <div class="flex1">{{ order_end.sNo }}</div>
                </li>

                <li class="end_message">
                    <div class="end_lef">{{language.refund.apply}}：</div>
                    <div class="flex1">{{ order_end.time }}</div>
                </li>

                <li class="end_message">
                    <div class="end_lef">{{language.refund.amount_type}}：</div>
                    <div class="flex1">{{ refund_type == 3 ? language.refund.refund_type[0] : refund_type == 2 ? language.refund.refund_type[1] : language.refund.refund_type[2] }}</div>
                </li>

                <li class="end_message" v-if="refund_type !== '3'">
                    <div class="end_lef">{{language.refund.amount}}：</div>
                    <div class="flex1">￥{{ refund_price_ }}</div>
<!--                    <div class="flex1">￥{{ order_end.refund_amount }}</div>-->
                </li>

                <li class="end_message">
                    <div class="end_lef">{{language.refund.explain}}：</div>
                    <div class="flex1">{{ content }}</div>
                </li>
                <li class="end_message">
                    <div class="end_lef">{{language.refund.upload}}：</div>

                    <div class="evaluat_li" v-for="(img, index) in src" :key="index">
                        <img class="evaluat_img" :src="img" @touchstart="_touchstart(index)" @touchend="_touchend" />
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title: '申请售后',
            delete_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/delete2x.png',
            xiangji_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/xiangji2x.png',
            gouhei_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/gouhei.png',
            refund_type: '', // 区分退款方式1退货退款，2仅退款， 3换货
            order_details_id: '',
            
            order: '',
            returnR: '',
            money: '',
            content: '',
            src: [],
            srcLength: [3, 2, 1, 0],
            requestTime: '',
            requestTime1: 0,
            img_index: -1,
            return_suess: false,
            order_end: '',
            src_img: [],
            return_r: 1,
            refund_price: '',
            refund_price_: '',
            order_anking: '',
            fastTap: true,
            rType: false,
            can_sbm: true, // 能否提交
            r_status: '', // 商品当前状态
            dsb: false, //禁用按钮颜色
        };
    },
    watch: {
        src(newValue, oldValue) {
            this.requestTime = this.src.length;
        }
    },
    onLoad(option) {
        this.isLogin(()=>{})

        this.refund_type = option.refund_type;
        this.order_details_id = option.order_details_id;
        this.order_anking = option.order_anking;
        
        this.r_status = option.r_status;
        if (this.r_status) {
            this.returnR = 1;
        }
        
        if(option.isbatch == 'true'){
            this.returnR = 4;
        }

        this._axios();
        this.rType = option.rType;
        
    },
    methods: {
        /**
         *
         * */
        changeLoginStatus() {
            this._axios();
        },
        /**
         *
         * */
        async _button() {
            if (this.can_sbm) {
                this.dsb = true;
                this.can_sbm = false;
                setTimeout(() => {
                    this.dsb = false;
                    this.can_sbm = true;
                }, 10000);
            } else {
                return false;
            }

            if (!this.fastTap) {
                return;
            }

            this.fastTap = false;

            if (this.content && this.rType && this.src.length == 0) {
                var data = {
                    
                    module: 'app',
                    action: 'order',
                    app: 'ReturnData',
                    order_details_id: this.order_details_id,
                    refund_amount: this.refund_price,
                    explain: this.content,
                    type: this.refund_type,
                    refund_apply_money: this.refund_price_
                };

                this.$req
                    .post({ data })
                    .then(res => {
                        let { code, message } = res;
                        this.dsb = false;
                        this.can_sbm = true;

                        if (code == 200 && res.data) {
                            this.return_suess = true;
                            this.return_r = 4;
                            this.order_end = res.data;
                            this.fastTap = true;

                            uni.showToast({
                                title: this.language.refund.Tips[2],
                                icon: 'none',
                                duration: 1000
                            });
                        } else {
                            uni.showToast({
                                title: message,
                                duration: 1500,
                                icon: 'none'
                            });
                        }

                        this.fastTap = true;
                        uni.hideLoading();
                    })
                    .catch(error => {
                        console.error(error);
                        this.dsb = false;
                        this.can_sbm = true;
                        this.fastTap = true;
                        uni.hideLoading();
                        uni.showToast({
                            title: this.language.refund.Tips[3],
                            icon: 'none',
                            duration: 1000
                        });
                    });
            } else if (this.content && this.src.length > 0) {
                for (var i = 0; i < this.src.length; i++) {
                    var data = {
                        
                        module: 'app',
                        action: 'order',
                        app: 'ReturnData',
                        order_details_id: this.order_details_id,
                        refund_amount: this.refund_price,
                        explain: encodeURI(this.content),
                        type: this.refund_type,
                        access_id: this.access_id,
                        upload_z_num: this.src.length,
                        upload_num: i,
                        refund_apply_money: this.refund_price_
                    };
                    //判断上次上传结果成功了才能执行下一次方法
                    data = await this._upload(i, data);

                    if (i + 1 == this.src.length) {
                        uni.hideLoading();
                    }
                }
            } else {
                this.fastTap = true;

                if (!this.content) {
                    uni.showToast({
                        title: this.language.refund.Tips[4],
                        duration: 1000,
                        icon: 'none'
                    });
                } else if (this.src.length == 0 && !this.rType) {
                    uni.showToast({
                        title: this.language.refund.Tips[5],
                        duration: 1000,
                        icon: 'none'
                    });
                }

                this.dsb = false;
                this.can_sbm = true;
                return false;
            }
        },
        /**
         *
         * */
        _upload(i, data) {
            var me = this;
            return new Promise(res1 => {
                uni.uploadFile({
                    url: uni.getStorageSync('url'),
                    filePath: me.src[i],

                    // #ifdef MP-ALIPAY
                    fileType: 'image',
                    // #endif

                    name: 'file',
                    formData: data,
                    success: function(res) {
                        var res2 = JSON.parse(res.data);
                        console.log(res2);
                        me.fastTap = true;
                        if (res2.code == 200) {
                            i++;

                            if (i == me.src.length) {
                                me.return_suess = true;
                                me.return_r = 4;
                                me.order_end = res2.data;

                                me.fastTap = true;

                                uni.showToast({
                                    title: me.language.refund.Tips[2],
                                    duration: 1500,
                                    icon: 'none'
                                });
                            }
                        } else {
                            uni.showToast({
                                title: res2.message,
                                duration: 1500,
                                icon: 'none'
                            });
                            return;
                        }

                        res1(res2);
                    },
                    error: function() {
                        me.fastTap = true;
                    }
                });
            });
        },
        /**
         *
         * */
        _text() {
            if (this.content.length == 200) {
                uni.showToast({
                    title: this.language.refund.Tips[6],
                    duration: 1000,
                    icon: 'none'
                });
            }
        },
        /**
         *
         * */
        _axios() {
            var data = {
                module: 'app',
                action: 'order',
                app: 'return_method',
                order_details_id: this.order_details_id
            };

            this.$req.post({ data }).then(res => {
                if (res.code == 200) {
                    let {
                        data: { list, refund_price }
                    } = res;
                    this.order = list;
                    this.refund_price_ = this.refund_price = Number(refund_price).toFixed(2);
                } else {
                    uni.showToast({
                        title: res.message,
                        duration: 1500,
                        icon: 'none'
                    });
                }
            });
        },
        /**
         * 上传图片
         * */
        choiceImg(length) {
            var count = this.srcLength[length];
            uni.chooseImage({
                count: count,
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 从相册选择
                success: res => {
                    
                    res.tempFilePaths.filter(item=>{
                        uni.getImageInfo({
                            src: item,
                            success:  (image) => {
                                this.src = this.src.concat([image.path])
                            }
                        });
                    })
                    
                }
            });
        },
        /**
         * 长按
         * */
        _touchstart(index) {
            this.timeout = setTimeout(e => {
                this.img_index = index;
            }, 800); // 长按时间超过800ms，则执行传入的方法
        },
        /**
         *
         * */
        _touchend() {
            clearTimeout(this.timeout); //长按时间少于800ms，不会执行传入的方法
        },
        /**
         * 删除图片
         * */
        _delete(index) {
            if (this.src.length > 0) {
                this.src.splice(index, 1);
                this.img_index = -1;
            } else {
                return;
            }
        },
        /**
         *
         * */
        refund_price_rule() {
            if (this.refund_price_ > this.refund_price) {
                this.refund_price_ = Number(this.refund_price).toFixed(2);
            } else if (this.refund_price_ == '' || this.refund_price_ < 0) {
                this.refund_price_ = Number(this.refund_price).toFixed(2);
            }
        }
    }
};
</script>

<style scoped lang="less">
@import url('../../static/css/returnGoods/refund.less');
</style>
