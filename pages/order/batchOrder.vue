<template>
    <div>
        <toload :load="load">
            <!-- #ifndef MP -->
            <heads :title="language.order.batchOrder.title" :returnR="13" :order_id="orde_id"></heads>
            <!-- #endif -->
            <ul class="order_goods" :style="{ top: halfWidth }">
                <li class="order_two" v-for="(item, index) in order" :key="index" >
                    <img class="quan_img" :src="display_img[index] ? quan_hei : quan_hui" @tap="_checkedOne(item, index)" />
                    <img class="order_two_img" :src="item.imgurl" />
                    <div style="margin-right: 40rpx;width: 58%;" @tap="navTo( '/pages/goods/goodsDetailed?pro_id=' + item.p_id)">
                        <p class="order_space">{{ item.p_name }}</p>
                    </div>
                    <div>
                        <p>￥{{ Number(item.p_price).toFixed(2) }}</p>
                        <p class="color_two">x{{ item.num }}</p>
                    </div>
                </li>
            </ul>
            <div class="batch_bottom">
                <div class="bottom_left">
                    <img class="quan_img" :src="selectAll ? quan_hei : quan_hui" @tap="_selectAll" />
                    <span>{{language.order.batchOrder.Select_all}}</span>
                </div>
                <div class="batch_bottom_q" @tap="_button">{{language.order.batchOrder.determine}}</div>
            </div>
        </toload>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title: '选择商品列表',
            orde_id: '',
            order: '',
            load: false,
            quan_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/xuanzehui2x.png',
            quan_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/xuanzehei2x.png',
            display_img: [], //圆圈的选中状态
            selectArray: [], //存储选中商品
            selectAll: false, //全选状态
            fastTap: true,
            rType: false
        };
    },
    onLoad(option) {
        this.orde_id = option.orde_id;
        this.rType = option.rType;
        this._axios();
    },
    methods: {
        //单选
        _checkedOne(item, indexli) {
            var cum = this.selectArray.findIndex(items=>items.id == item.id);
         
            // 如果是有的话 点击就是取消
            //判断点击的传入的值是否存在数组中，如果没有添加，如果有删除，同时设定选中状态（第一次点击添加进数组，第二次点击从数组中删除）
            if (cum < 0) {
                this.selectArray.push(item);
                this.$set(this.display_img, indexli, true);
            } else {
                this.selectArray.splice(cum, 1);
                this.$set(this.display_img, indexli, false);
            }
            console.log(this.selectArray)
            //根据产品选状态，设定全选状态
            if (this.selectArray.length == this.order.length) {
                this.selectAll = true;
            } else {
                this.selectAll = false;
            }
        },
        //全选
        _selectAll() {
            //根据全选状态，设定商品选中状态
            this.selectAll = !this.selectAll;
            var img = this.$refs.img;
            //根据全选状态，设定商品选中状态
            if (this.selectAll) {
                for (var i = 0; i < this.order.length; i++) {
                    this.$set(this.selectArray, i, this.order[i]);
                    this.$set(this.display_img, i, true);
                }
            } else {
                this.selectArray = [];
                for (var i = 0; i < this.order.length; i++) {
                    this.$set(this.display_img, i, false);
                }
            }
        },
        _button() {
            if (!this.fastTap) {
                return;
            }
            this.fastTap = false;
            let order_details_id = [];
            for (let i = 0; i < this.selectArray.length; i++) {
                let id = this.selectArray[i].id;
                order_details_id.push(id);
            }
            console.log(order_details_id)
            if (this.selectArray.length) {
                uni.navigateTo({
                    url: '/pagesA/returnGoods/returnGoods?order_details_id=' + order_details_id + '&order_anking=2&rType=' + this.rType + '&isbatch=true',
                    success: () => {
                        this.fastTap = true;
                    }
                });
            } else {
                this.fastTap = true;
                uni.showToast({
                    title: this.language.batchOrder.Tips,
                    duration: 1000,
                    icon: 'none'
                });
            }
        },
        _axios() {
            var data = {
                
                order_id: this.orde_id,
                module: 'app',
                action: 'order',
                app: 'order_details'
            };

            this.$req.post({ data }).then(res => {
                if (res.code == 200) {
                    let {
                        data: { list }
                    } = res;
                    var order = [];
                    for (let i = 0; i < list.length; i++) {
                        if (( list[i].r_status == 2 || list[i].r_status == 1) && list[i].s_type != 1) {
                            order.push(list[i]);
                        }
                    }
                    this.order = order;
                    this.load = true
                    
                } else {
                    uni.showToast({
                        title: res.message,
                        duration: 1500,
                        icon: 'none'
                    });
                    this.load = true
                }
            });
        }
    }
};
</script>

<style scoped lang="less">
@import url('../../static/css/order/batchOrder.less');
</style>
