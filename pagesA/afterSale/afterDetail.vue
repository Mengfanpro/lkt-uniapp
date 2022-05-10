<template>
    <div ref='box'>
        <heads :title="language.afterDetail.title"></heads>

        <div class='allgoods_s home_navigation flex yh-allgoods_s'>

            <div class="font-white status-box yh-font-white">
                {{
                    info.type == '0'?language.afterDetail.type_list[0]:
                    info.type == '1'?'退换中':
                    info.type == '3'?language.afterDetail.type_list[1]:
                    info.type == '2' ?language.afterDetail.type_list[2]:
                    info.type == '5' || info.type == '10'?language.afterDetail.type_list[3]:
                    (info.type == '4' || info.type == '9' || info.type == '12')&&info.re_type!='3' ?language.afterDetail.type_list[4]:
                    info.type == '11' || info.re_type=='3' ?language.afterDetail.type_list[5]:
                    (info.type == '8' && info.r_content == language.afterDetail.receiving)?language.afterDetail.type_list[5]:
                    (info.type == '8' && info.r_content != language.afterDetail.receiving)?language.afterDetail.type_list[2]:
                    ''
                }}
            </div>

            <div class="font-white tips-box yh-tips-box">
                {{
                    info.type == '0'?language.afterDetail.typeDisc_list[0]:
                    info.type == '1'?language.afterDetail.typeDisc_list[1]:
                    info.type == '2' || info.type == '5'?language.afterDetail.typeDisc_list[7]+info.r_content:
                    info.type == '3'?language.afterDetail.typeDisc_list[2]:
                    info.type == '4' || info.type == '9'?language.afterDetail.typeDisc_list[3]:
                    info.type == '11'?language.afterDetail.typeDisc_list[4]:
                    info.type == '12'?language.afterDetail.typeDisc_list[5]:
                    (info.type == '8' && info.r_content == language.afterDetail.receiving)  ?language.afterDetail.typeDisc_list[6]:
                    ((info.type == '8' || info.type == '10') && info.r_content != language.afterDetail.receiving )  ? language.afterDetail.typeDisc_list[7]+info.r_content:
                    ''
                }}
            </div>


        </div>

        <!-- <div class="yh-line" v-if="info.type != '11' && info.type != '12'"></div> -->


        <!-- <div class="block-title yh-block-title" v-if="info.type != '11' && info.type != '12'">
            <span>{{language.afterDetail.record}}</span>

            <div class="yh-block-title-div">
                <img class="yh-block-title-img" :src="gdInnerImg">
            </div>
        </div> -->

        <div class="rt-address-box" v-if="info.type == '11'||info.type == '12'">
            <div class="yh-line"></div>
            <div class="block-title">{{language.afterDetail.merchants_logistics}}</div>
            <div class="flex address-row">
                <div>{{language.afterDetail.courier_name}}：</div>
                <div>{{return_info.express}}</div>
            </div>
            <div class="flex address-row">
                <div>{{language.afterDetail.courier_number}}：</div>
                <div>{{return_info.express_num}}</div>
            </div>
            <div class="flex address-row">
                <div>{{language.afterDetail.return_date}}：</div>
                <div>{{return_info.add_data  | dateFormat}}</div>
            </div>
        </div>

        <div class="rt-address-box"
             v-if="(info.type == '11' && info.type != '0' && info.type != '1') || info.type == '12' || info.type == '5' || info.type == '3'">
            <div class="yh-line"></div>
            <div class="block-title">{{language.afterDetail.buyer_logistics}}</div>
            <div class="flex address-row">
                <div>{{language.afterDetail.courier_name}}：</div>
                <div>{{send_info.express}}</div>
            </div>
            <div class="flex address-row">
                <div>{{language.afterDetail.courier_number}}：</div>
                <div>{{send_info.express_num}}</div>
            </div>
            <div class="flex address-row">
                <div>{{language.afterDetail.contact}}：</div>
                <div>{{send_info.name}}</div>
            </div>
            <div class="flex address-row">
                <div>{{language.afterDetail.contact_phone}}：</div>
                <div>{{send_info.tel}}</div>
            </div>
            <div class="flex address-row">
                <div>{{language.afterDetail.return_date1}}：</div>
                <div>{{send_info.add_data  | dateFormat}}</div>
            </div>
        </div>

        <div class="rt-address-box"
             v-if="info.type== '1' || info.type== '3' ||info.type== '5' ||info.type== '11' ||info.type== '12'">
            <div class="yh-line"></div>
            <div class="block-title" v-if="record.length > 0 && info.type == '11'"><span>{{language.afterDetail.merchants_logistics}}</span> <img
                :src="fxBottomImg"
                alt=""></div>
            <div class="block-title" v-if="record.length > 0 && info.type == '11'"><span>{{language.afterDetail.buyer_logistics}}</span> <img
                :src="fxBottomImg"
                alt=""></div>
            <div class="block-title">{{language.afterDetail.after_address}}</div>
            <div class="flex address-row">
                <div>{{language.afterDetail.return_address}}：</div>
                <div>{{address}}</div>
            </div>
            <div class="flex address-row">
                <div>{{language.afterDetail.contact}}：</div>
                <div>{{name}}</div>
            </div>
            <div class="flex address-row">
                <div>{{language.afterDetail.contact_phone1}}：</div>
                <div>{{phone}}</div>
            </div>
        </div>

        <div class="rt-product-box">
            <div class="yh-line"></div>
            <div class="block-title yh-block-title">
                <span>{{language.afterDetail.after_information}}</span>
                <!-- <div @tap="_edit_after()" v-if="info.type==2" class="yh-type">重新编辑</div> -->
            </div>
            <div class="flex address-row">
                <div>{{language.afterDetail.product_name}}：</div>
                <div class="yh-p_name">{{info.p_name}}</div>
            </div>
            <div class="flex address-row">
                <div>{{language.afterDetail.order_no}}：</div>
                <div>{{info.r_sNo}}</div>
            </div>
            <div class="flex address-row">
                <div>{{language.afterDetail.apply_time}}：</div>
                <div>{{info.re_time}}</div>
            </div>
            <div class="flex address-row">
                <div>{{language.afterDetail.after_type}}：</div>
                <div>{{info.re_type==1?language.afterDetail.after_typeList[0]:info.re_type==3?language.afterDetail.after_typeList[1]:language.afterDetail.after_typeList[2]}}</div>
            </div>
            <div class="flex address-row h_auto">
                <div>{{language.afterDetail.apply_reason}}：</div>
                <div class='yx_right'>{{info.content}}</div>
            </div>
            <div class="flex address-row h_auto" v-if="info.re_photo&&info.re_photo.length > 0">
                <div>{{language.afterDetail.upload_documents}}：</div>
                <div class="flex">
                    <div class="re_photo" v-for="(items,index) in info.re_photo" :key='index'>
                        <img :src="items" alt="">
                    </div>
                </div>
            </div>
            <div class="flex address-row" v-if="info.re_type != 3">
                <div>{{language.afterDetail.amount}}：</div>
                <div>￥{{info.p_price}}</div>
            </div>
        </div>

    </div>
</template>

<script>
    import Heads from '../../components/header.vue'

    export default {
        data () {
            return {
                title: '售后详情',
                id: '', //订单id
                pid: '', //商品id
                
                address: '',
                name: '',
                phone: '',
                info: {},
                record: [], //售后记录
                send_info: [], //买家回寄信息
                return_info: [], //买家回寄信息
                gdInnerImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/gd_inner.png',
                fxBottomImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/fx_bottom.png'
            }
        },
        onLoad (option) {
            this.id = option.order_id
            this.pid = option.pid
        },
        onShow () {
            this.$nextTick(()=>{
                this._axios()
            })
        },
        methods: {
            _axios () {
                var data = {
                    module: 'app',
                    action: 'order',
                    app: 'Returndetail',
                    orderDetailId: this.id,
                    pid: this.pid,
                }
                
                this.$req.post({data}).then(res=>{
                    let {
                        data: {
                            info,
                            return_info,
                            send_info,
                            store_info,
                            record
                        }
                    } = res;
                    if (res.code == 200) {
                        this.info = info
                        this.return_info = return_info
                        this.send_info = send_info
                        this.store_info = store_info
                        this.record = record
                        this.address = this.store_info.address
                        this.name = this.store_info.name
                        this.phone = this.store_info.phone
                    } else {
                        uni.showToast({
                            title: res.message,
                            duration: 1500,
                            icon: 'none'
                        })
                    }
                })
                
            },
            /* 
                重新编辑
            */
            _edit_after () {
                uni.navigateTo({
                    url: '../../pagesA/returnGoods/refund?refund_type=3&order_details_id=' + this.id +
                        'order_anking=1&r_status=3&rType=3',
                })
            },
        },
        components: { Heads }
    }
</script>

<style scoped lang="less">
    @import url("../../static/css/afterSale/afterDetail.less");
</style>
