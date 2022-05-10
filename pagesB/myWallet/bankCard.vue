<template>
  <view class="bankCard">
      <heads :title="title"></heads>
      <toload :load="load" >
          <view class="list-item" v-for="(item, index) of list" :key="index" @click="toBankCardDetail(item, index)">
              <div class="default" v-if="index == 0 && type === 'store'">
                  <text>
                      默认
                  </text>
              </div>
              <text class="card-name">{{ item.Bank_name }}</text>
              <view class="bottom">
                  <view class="round-wrap">
                      <view class="round"></view>
                      <view class="round"></view>
                      <view class="round"></view>
                      <view class="round"></view>
                  </view>
                  <view class="round-wrap">
                      <view class="round"></view>
                      <view class="round"></view>
                      <view class="round"></view>
                      <view class="round"></view>
                  </view>
                  <view class="round-wrap">
                      <view class="round"></view>
                      <view class="round"></view>
                      <view class="round"></view>
                      <view class="round"></view>
                  </view>

                  <text class="num">{{ item.Bank_card_number }}</text>
              </view>
          </view>
              
      </toload>

      <view class="add list-item" v-if="load" @click="navTo('./bankCardAdd?type=' + type)">
          <image :src="gw_img"></image>
          <text>{{language.bankCard.tjyhk}}</text>
      </view>
  </view>
</template>

<script>
export default {
  name: "bankCard",
    data () {
      return {
          // title: '银行卡管理',
          title: '银行卡管理',
          list: [],
          load: false,
          type: '',
          gw_img: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/add-bank-card.png',
      }
    },
    onLoad (option) {
       this.type = option.type
    },
    onShow() {
      // this.load = false;
      this.title = this.language.bankCard.title
      this._axios();
    },
    methods: {
        _axios() {
            let data = {}
            if (this.type === 'store') {
                data = {
                    module: 'app',
                    action: 'MchBank',
                    app: 'bankList',
                }
            } else {
                data = {
                    module: 'app',
                    action: 'user',
                    app: 'bank_list',
                }
            }
            
            this.$req.post({data}).then(res => {
                try {
                    if (this.type === 'store') {
                        res.data=res.data.list
                    }
                    this.list = res.data
                } catch (e) {
                    console.log(e);
                }
                setTimeout(() => {
                    this.load = true;
                }, 300)
            })
        },
        toBankCardDetail (item, index) {
            let params = {
                bankName: item.Bank_name,
                cardNum: item.Bank_card_number,
                id: item.id,
                storeType: this.type,
                type: index % 2 === 0 ? 1 : 2, // 1绿色，2红色
            }
            let params_str = Object.keys(params).map(key => key + "=" + params[key]).join("&");
            this.navTo(`./bankCardDetail?${params_str}`);
        }
    },
}
</script>

<style lang="less" scoped>
.bankCard {
    padding-top: 30rpx;
    height: 100vh;
    background: #f6f6f6;
    .list-item {
        width: 690rpx;
        height: 140rpx;
        border-radius: 10rpx;
        margin: 0 auto;
        margin-bottom: 20rpx;
        padding: 30rpx;
        box-sizing: border-box;
        position: relative;
        overflow: hidden;
        .default {
            position: absolute;
            top: 0;
            right: 0;
            width: 56rpx;
            height: 28rpx;
            background: #FF7D00;
            border-bottom-left-radius: 10rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            text {
                transform: scale(0.83);
                font-size: 24rpx;
                font-family: PingFang SC;
                font-weight: 500;
                color: #FFFFFF;
            }
            
        }
        &:first-child {
            //margin-top: 30rpx;
        }
        &:nth-child(odd){
            background: #005F5F;
        }
        &:nth-child(even){
            background: #AD4E4C;
        }
        
        &.add {
            padding: 0;
            background: #FFF;
            display: flex;
            align-items: center;
            flex-direction: row;
            
            image {
                width: 39rpx;
                height: 39rpx;
                display: block;
                margin-left: 30rpx;
                margin-right: 20rpx;
            }
            
            text {
                font-size: 30rpx;
                font-family: PingFang SC;
                font-weight: 500;
                color: #333333;
            }
        }
        
        .card-name {
            font-size: 28rpx;
            font-family: PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
            line-height: 26rpx;
            height: 26rpx;
            display: flex;
            margin-bottom: 23rpx;
        }
        
        .bottom {
            height: 40rpx;
            display: flex;
            align-items: center;
            .round-wrap {
                display: flex;
                align-items: center;
                margin-right: 59rpx;
                .round {
                    height: 10rpx;
                    width: 10rpx;
                    border-radius: 50%;
                    background: #FFF;
                    margin-right: 10rpx;
                }
            }
            text {
                display: block;
                align-items: center;
                font-size: 40rpx;
                font-family: PingFang SC;
                font-weight: 500;
                color: #FFFFFF;
                
                &.num {

                    font-size: 40rpx;
                }
            }
        }
    }
}

</style>
