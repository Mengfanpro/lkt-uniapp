<template>
    <div class="container">
        <lktauthorize ref="lktAuthorizeComp" v-on:pChangeLoginStatus="changeLoginStatus"></lktauthorize>
        <heads :title="title" :returnR="backUrl"></heads>
        <div class="load" v-if="load">
            <div>
                <img :src="loadImg" />
                <p>{{language.mystore_order.Loading}}</p>
            </div>
        </div>
        <div v-else class="relative">
            <div class="order_zt">
                <p v-if="list.status == 0">{{language.storeMyOrder.obligation}}</p>
                <p v-else-if="list.status == 1 && list.self_lifting == '0'">{{language.storeMyOrder.waitSend}}</p>
                <p v-else-if="list.status == 2 && list.self_lifting == '0'">{{language.storeMyOrder.waitReceiving}}</p>
                <p v-else-if="list.status == 2 && list.self_lifting == '1'">{{language.storeMyOrder.waitSend}}</p>
                <p v-else-if="list.status == 5">{{language.storeMyOrder.done}}</p>
                <p v-else-if="list.status == 7">{{language.storeMyOrder.orderClosed}}</p>
                
                <div class="order_wl">
                    <div class="orderTitle">
                        <div>{{language.mystore_order.order}}：{{ list.sNo }}</div>
                        <div class="copy_btn" @tap="onCopy()">{{language.mystore_order.copy}}</div>
                    </div>
                </div>
                <p class="order_p">{{language.mystore_order.order_time}}：{{ list.add_time }}</p>
            </div>
            <ul class="order_xx" v-if="diplay">
                <li class="border_bottom">
                    <img :src="buyhead" />
                    <p>{{language.mystore_order.Buyer}}：{{ list.user_name }}</p>
                </li>
                <li>
                    <img :src="buyadd" />
                    <p>
                        {{ list.name }}&nbsp;&emsp;{{ list.mobile }}
                        <br />
                        <span class="font_24 color_888">{{list.sheng}}{{list.shi}}{{list.xian}}{{ list.address }}</span>
                    </p>
                </li>
            </ul>
            <ul class="order_xx" v-else>
                <li class="border_bottom">
                    <img :src="buyhead" />
                    <p>{{language.mystore_order.Buyer}}：{{ list.user_name }}</p>
                </li>
                <li class="border_bottom">
                    <img :src="addressImg" />
                    <div class="edit_add">
                        <span class="fl">{{language.mystore_order.username}}</span>
                        <input type="text" name="name" v-model="list.name" />
                    </div>
                </li>
                <li class="border_bottom">
                    <div class="edit_add pl_56">
                        <span class="fl">{{language.mystore_order.phone}}</span>
                        <input type="text" name="name" v-model="list.mobile" />
                    </div>
                </li>
                <li class="border_bottom" @click="showMulLinkageThreePicker()">
                    <div class="edit_add pl_56 ">
                        <span class="fl">{{language.mystore_order.address}}</span>
                        <input type="text" disabled='true'  
                               :placeholder="language.mystore_order.address_placeholder" placeholder-style="color:#B8B8B8"
                               @focus="hideKeyboard()"
                               v-model="city_all"
                        />
                    </div>
                    <img :src="jiantou" class="jiantou" />
                </li>
                <li class="">
                    <div class="edit_add pl_56">
                        <span class="fl">{{language.mystore_order.addressinfo}}</span>
                        <input type="text" name="name" v-model="list.address" style="width: auto;" />
                    </div>
                </li>
                <li class="border_bottom">
<!--                    <p v-if="list.status != 0">{{language.mystore_order.Order_notes}}：</p> <input v-if="list.status != 0" name="remarks" type="text" v-model="list.remarks">
 -->                    <!-- <p v-if="list.status == 0">{{language.mystore_order.Order_notes}}：{{ list.remarks }}</p> -->
                </li>
                <!-- <div class="hr"></div> -->
            </ul>
            <li class="line" style="height: 20rpx;width: 765rpx;background-color: #f6f6f6;margin-left: -15rpx;"></li>
            <ul class="order_goods">
                <li v-for="(item, index) in list.list" :key="index">
                    <div class="order_two">
                        <img :src="item.pic" />
                        <div class="order_two_div1">
                            <p class="order_p_name">{{ item.p_name }}</p>
                            <p class="color_one">{{ item.size }}</p>
                        </div>
                        <div class="order_two_div2">
                            <p>
                                ￥{{ item.p_price.toFixed(2) }}
                                <span v-if="list.allow > 0">
                                    +
                                    <img class="integral-img" :src="integral_hei" />
                                    {{ list.allow }}
                                </span>
                            </p>
                            <p class="color_two">x{{ item.num }}</p>
                        </div>
                    </div>
                </li>
                <li class="order_last ml_30">
                    <div class="order_color">
                        <p>{{language.mystore_order.Total}}</p>
                        <p v-if="list.status == 0 && (list.otype == 'pt' || list.otype == 'PP')">
                            ￥{{ list.spz_price.toFixed(2) }}
                            <span v-if="list.allow > 0">
                                +
                                <img class="integral-img" :src="integral_hui" />
                                {{ list.allow }}
                            </span>
                        </p>
                        <p v-else>
                            ￥{{ list.spz_price.toFixed(2) }}
                            <span v-if="list.allow > 0">
                                +
                                <img class="integral-img" :src="integral_hui" />
                                {{ list.allow }}
                            </span>
                        </p>
                    </div>
                    <template v-if="list.otype == 'GM' || list.otype == ''">
                        <div class="order_color" v-if="list.coupon_price>0">
                            <p>{{language.mystore_order.amount[0]}}</p>
                            <p>
                                ￥{{ list.coupon_price.toFixed(2) }}
                            </p>
                        </div>
                        <div class="order_color" v-if="list.discount_type">
                            <p>{{list.discount_type}}{{language.mystore_order.amount[1]}}</p>
                            <p>
                                ￥{{ list.preferential_amount.toFixed(2) }}
                            </p>
                        </div>
                        <div class="order_color" v-if="list.grade_rate > 0 && list.grade_rate < 1">
                            <p>{{language.mystore_order.amount[2]}}</p>
                            <p>￥{{ list.grade_rate_amount.toFixed(2) }}</p>
                        </div>
                    </template>
                    <template v-else>
                        <div class="order_color" v-if="list.coupon_money != 0 && list.coupon_money != '0.00'">
                            <p>{{language.mystore_order.amount[3]}}</p>
                            <p>
                                ￥{{ list.coupon_money.toFixed(2) }}
                                <span>{{ list.coupon_name }}</span>
                            </p>
                        </div>
                        <div class="order_color" v-if="list.comm_discount < 1 && list.comm_discount > 0">
                            <p>{{language.mystore_order.amount[4]}}</p>
                            <p>{{ list.comm_discount * 10 }}{{language.mystore_order.fracture}}</p>
                        </div>
                        <div class="order_color" v-if="list.grade_rate > 0 && list.grade_rate < 1">
                            <p>{{language.mystore_order.amount[5]}}</p>
                            <p>{{ list.grade_rate * 10 }}{{language.mystore_order.fracture}}</p>
                        </div>
                        <div class="order_color" v-if="list.reduce_money != 0 && list.reduce_money != '0.00'">
                            <p>{{language.mystore_order.amount[6]}}</p>
                            <p>￥{{ list.reduce_money.toFixed(2) }}</p>
                        </div>
                    </template>
                    <div class="order_color">
                        <p>{{language.mystore_order.freight}}</p>
                        <p>￥{{ list.z_freight.toFixed(2) }}</p>
                    </div>
                    <div class="order_color">
                        <p>{{language.mystore_order.Order_notes}}</p>
                        <p style="max-width:520rpx;">{{ list.remarks }}</p>
                    </div>
                    <div class="order_z_price">
                        <p>{{language.mystore_order.Order_total}}</p>
                        <div v-if="!diplay && list.status == 0" class="edit_money" style="border: none;width: auto;">
                            <font class="fl pl_30">￥</font>
                            {{list.z_price.toFixed(2)}}
                            <span v-if="list.allow > 0">
                                +
                                <img class="integral-img" :src="integral_hei" />
                                {{ list.allow }}
                            </span>
                        </div>
                        <p v-else>
                            ￥{{ list.z_price.toFixed(2) }}
                            <span v-if="list.allow > 0">
                                +
                                <img class="integral-img" :src="integral_hei" />
                                {{ list.allow }}
                            </span>
                        </p>
                    </div>
                </li>
                <!-- <li class="line" style="height: 20rpx;width: 750rpx;background-color: #f6f6f6;margin-left: 0rpx;"></li> -->
                <li class="order_pay">
                    <p>{{language.mystore_order.Paid_in}}</p>
                    <div v-if="!diplay && list.status == 0" class="edit_money">
                        <font class="fl pl_30">￥</font>
                        <input class="digit2" v-model="list.z_price" type="digit" />
                    </div>
                    <p class="z_price" v-else>
                        ￥{{ list.z_price.toFixed(2) }}
                        <span v-if="list.allow > 0">
                            +
                            <img class="integral-img" :src="integral_hong" />
                            {{ list.allow }}
                        </span>
                    </p>
                </li>
            </ul>
            <div v-if="!diplay" style="height: 98rpx;"></div>
        </div>
        <div class="h_98" v-if="diplay">
            <div class="order_foot" v-if="((list.status == 0 && list.order_status) || list.status == 1 || list.status == 2) && list.self_lifting == '0'">
                <div v-if="list.status != 2 && list.sale_type != 2" class="order_button mr_20" @tap="_edit()">{{language.mystore_order.edit}}</div>
                <div v-if="list.status == 2" class="order_button" @tap="_seeWL(list.sNo)">{{language.mystore_order.View_Logistics}}</div>
                <div v-if="list.status == 1 && list.sale_type != 2" class="order_button" @tap="_showFhDiv(list)">{{language.mystore_order.deliver}}</div>
            </div>
            <div class="order_foot" v-if="list.self_lifting == '1' && list.status == 2">
                <!-- #ifdef H5 -->
                <div class="order_button" @tap="QRx">{{language.mystore_order.QR}}</div>
                <!-- #endif -->
                
                <!-- #ifndef H5 -->
                <div class="order_button mr_10" @tap="QRx">{{language.mystore_order.QR}}</div>
                <div class="order_button" @tap="QRs">{{language.mystore_order.QRs}}</div>
                <!-- #endif -->
            </div>
        </div>
        <div class="edit_btn" v-if="!diplay && okBtn" @tap="_ok()"><span class="span">{{language.mystore_order.complete}}</span></div>
        <div class="mask" v-if="fhDiv">
            <div class="fhDiv">
                <div class="fhDivTitle">
                    <span class="span">{{language.mystore_order.Tips[0]}}</span>
                    <img class="img" @tap="_closeFhDiv()" :src="guanbi" />
                </div>
                <div class="formList">
                    <div class="leftText1"><span>{{language.mystore_order.express[0]}}</span></div>
                    <div class="rightInput1" @tap="showSinglePicker()">
                        <input type="text" disabled="true" :placeholder-style="placeStyle" v-model="proClass" :placeholder="language.mystore_order.Tips[1]" />
                        <div class="jiantouDiv" ><img :src="jiantou" alt="" /></div>
                    </div>
                </div>
                <div class="formList">
                    <div class="leftText1"><span>{{language.mystore_order.express[1]}}</span></div>
                    <div class="rightInput1"><input type="number" :placeholder-style="placeStyle" v-model="courier_num" :placeholder="language.mystore_order.Tips[2]" /></div>
                </div>
                <div class="fhSubmit" @tap="_send()">{{language.mystore_order.Submit}}</div>
            </div>
        </div>
        
        <mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
                           @onConfirm="onConfirm"></mpvue-city-picker>
        <mpvue-picker
            v-if="show"
            :themeColor="themeColor"
            ref="mpvuePicker"
            :mode="mode"
            :deepLength="deepLength"
            :pickerValueDefault="pickerValueDefault"
            @onConfirm="onConfirm2"
            :pickerValueArray="pickerValueArray"
        ></mpvue-picker>
    </div>
</template>

<script>
import mpvuePicker from '../../components/mpvuePicker.vue';

import {
    LaiKeTui_axios,
    LaiKeTui_showFhDiv,
    LaiKeTui_ok,
    LaiKeTui_send,
} from '../../static/js/myStore/order.js';

import { copyText } from '@/common/util.js';
import mpvueCityPicker from "../../components/mpvue-citypicker/mpvueCityPicker";

export default {
    data() {
        return {
            orderList_id: '',
            express_id: '',
            imgurl: '',
            closeImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/guanbi2x.png',
            mask_display: false,
            proClass: '',
            
            shop_id: '',
            p_id: '',
            integral_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/integral_hui.png',
            integral_hong: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/integral.png',
            integral_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/integral_hei.png',
            back1: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/back2x.png',
            guanbi: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/guanbi2x.png',
            jianX: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/jianX.png',
            jiantou: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jiantou2x.png',
            goodsimg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/yhqBg.png',
            buyadd: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/address2x.png',
            buyhead: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/buyhead2x.png',
            loadImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/5-121204193R7.gif',
            addressImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/address2x.png',
            title: '订单详情',
            order_id: '',
            load: true,
            diplay: true,
            fhDiv: false,
            list: '',
            attrList: '',
            skuBeanList: '',
            haveSkuBean: '',
            okBtn: true,
            sNo: '',
            courier_num: '',
            kuaidiList: '',
            themeColor: '#007AFF',
            mode: '',
            deepLength: 1,
            pickerValueDefault: [0],
            pickerValueArray: [],
            show: false,
            backUrl: 'myOrder',
            finishBlur: false, //是否完成bulr计算
            fastTap: true,
            placeStyle: 'color:#b8b8b8;font-size:28upx',
            
            price: '',
            num: '',
            highKeys: {},
            skuName: 'SkuID',
            skuName1: 'Price',
            skuName2: 'Pic',
            skuName3: 'Stock',
            spliter: ',',
            sku_list: {},
            result: {},
            cityPickerValueDefault: [0, 0, 1],
            city_all:'',
            editor:''
        };
    },
    onLoad(option) {
        if (option.editor == 1) {
            this.editor = option.editor;
        }
		
		this.order_id = option.order_id;
		
		if (option.editor == 1) {
		    this.diplay = false;
		} else {
		    this.diplay = true;
		}
    },
    onShow() {
        if(this.editor==1){
            this.title=this.language.mystore_order.Tips[5]
        }else{
            this.title=this.language.mystore_order.title
        }
		
		this.isLogin(()=>{
			this.shop_id = uni.getStorageSync('shop_id') ? uni.getStorageSync('shop_id') : this.$store.state.shop_id;
			this._axios();
		})
    },
    methods: {
		changeLoginStatus(){
			this._axios();
		},
        showMulLinkageThreePicker () {
            this.$refs.mpvueCityPicker.show()
        },
        hideKeyboard () {
            uni.hideKeyboard()
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
             this.finishBlur = true
             
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
                     title: this.language.mystore_order.Tips[3],
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
                 this.imgurl = this.result[s.join(this.spliter)].skus.Pic
             }
        
             if (s.length == this.keys.length) {
                 let curr = this.result[s.join(this.spliter)];
                 if (curr) {
                     this.SkuID = curr.skus.sku;
                     this.Pic = curr.skus.Pic;
                     this.price = curr.skus.price;
                     this.Stock = curr.skus.Stock;
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
        
        _axios() {
            LaiKeTui_axios(this);
        },
        // 复制
        onCopy: function() {
            // #ifdef H5
            copyText('', this.list.sNo);
            // #endif

            // #ifndef H5
            uni.setClipboardData({
                data: this.list.sNo,
                success: function(res) {
                    uni.showToast({
                        title: this.language.mystore_order.Tips[4],
                        duration: 1500,
                        icon: 'none'
                    });
                }
            });
            // #endif
        },
        // 改变完成
        changeFinish(type) {
            if ('f' == type) {
                this.finishBlur = true;
                return;
            }
            this.finishBlur = false;
        },
        // 运费改变
        changeFreight(e) {
            this.list.z_freight = e.detail.value;
            this.finishBlur = true;
        },
        // 编辑订单
        _edit() {
            this.title = this.language.mystore_order.Tips[5]
            this.diplay = false;
        },
        // 查看物流
        _seeWL(sNo) {
            let data = {
                module: 'app',
                action: 'order',
                app: 'logistics',
                id: sNo,
                o_source: 1,
                type: ''
            };

            if (this.source == 1) {
                data.type = 'pond';
            }

            this.$req.post({ data }).then(res => {
                let { code, message, data } = res;
                uni.hideLoading();
                if (code == 200) {
                    if (data.length > 1) {
                        uni.navigateTo({
                            url: '/pagesB/expressage/expressage?sNo=' + sNo
                        });
                    } else {
                        uni.navigateTo({
                            url: '/pages/expressage/expressage?list=' + JSON.stringify(data[0]) + '&sNo=' + sNo
                        });
                    }
                } else {
                    uni.showToast({
                        title: message,
                        duration: 1500,
                        icon: 'none'
                    });
                }
            });
        },
        // 发货
        _showFhDiv(items) {
            uni.navigateTo({
                url: '/pagesA/myStore/shipments?id=' + items.sNo
            });
            // LaiKeTui_showFhDiv(this);
        },
        // 完成
        _ok() {
            LaiKeTui_ok(this);
        },
        // 关闭物流信息
        _closeFhDiv() {
            this.fhDiv = false;
        },
        // 显示物流公司
        showSinglePicker() {
            this.show = true;
            this.mode = 'selector';
            this.deepLength = 1;
            this.pickerValueDefault = [0];
            this.$refs.mpvuePicker.show();
        },
        // 发货
        _send() {
            LaiKeTui_send(this);
        },

        onConfirm(e) {
            console.log(e)
            this.city_all = e.label
            let arr = e.label.split('-')
            console.log(arr)
            // this.proClass = e.label;
            // this.show = false;
            // this.express_id = this.kuaidiList[e.index[0]].id;
        },
        onConfirm2(e) {
            this.proClass = e.label;
            this.show = false;
            this.express_id = this.kuaidiList[e.index[0]].id;
        },

        _mask_false() {
            this.mask_display = false;
            this.okBtn = true;
        },
        // 跳转至手动输入验证码页面
        QRx() {
            uni.navigateTo({
                url: '/pagesA/myStore/QRdraw'
            });
        },
        // 自提扫码
        QRs() {
            // #ifndef H5
            uni.scanCode({
                success: rew => {
                    uni.showLoading({
                        title: this.language.mystore_order.Tips[6],
                    });
                    QRs(this, rew);
                }
            });
            // #endif
            // #ifdef H5
            uni.showToast({
                icon: 'none',
                title: this.language.mystore_order.Tips[7],
            });
            // #endif
        }
    },
    components: {
        mpvuePicker,
        mpvueCityPicker,
    }
};
</script>

<style lang="less">
@import url('../../static/css/myStore/order.less');
</style>
