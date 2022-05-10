<template>
  <toload :load="load">
      <view class="distribution_order">

          <div class="top">
              <heads  title="推广订单"></heads>
              <div style="height: 100rpx;">
                  <div class='allgoods_s home_navigation'>
                      <div class='home_input'>
                          <img class='searchImg' :src="serchimg" alt="">
                          <input type="text" v-model="search" :placeholder="language.distribution_order.search" id='input' :placeholder-style="placeStyle"
                                 name="sourch"/>
                      </div>
                      <div class="search_btn" @tap='_searchB'>{{language.search2.searchRes.search_button}}</div>
                  </div>
              </div>
              <div style="height: 86rpx">
                  <div class="order-top">
                      <div class="order">
                          {{ language.distribution_order.ddsl }}：{{ total }}
                      </div>
                      <div class="line">

                      </div>
                      <div class="yeji">
                          {{ language.distribution_order.tdyj }}：{{allamount}}
                      </div>
                  </div>
              </div>

          </div>
          <div class="top-height">

          </div>
          <div class="list">
              <div class="list-item" v-for="(item, index) of list">
                  <div class="top">
                      <div class="title">{{ item.user_name }}</div>
                      <div class="level">{{ item.grade }}</div>
                  </div>
                  <div class="goods">
                      <image class="left" :src="item.img"></image>
                      <div class="right">
                          <div class="title">
                              {{ item.p_name }}
                          </div>
                          <div class="num">
                              x{{item.num}}
                          </div>
                          <div class="bottom">
                              <div class="left">
                                  {{ item.size }}
                              </div>
                              <div class="right">
                                  ￥ {{item.z_price}}
                              </div>

                          </div>
                      </div>
                  </div>
                  <div class="line"></div>
                  <div class="order_info">
                      <div>{{ language.distribution_order.ddbh }}：{{ item.sNo }}</div>
                      <div>{{ language.distribution_order.gmsj }}：{{ item.add_time }}</div>
                  </div>
              </div>

          </div>
          <uni-load-more v-if="list.length > 10" :loadingType="loadingType"></uni-load-more>

          <!-- 没有记录的情况 -->
          <div class='empty_play' v-if='!list.length&&load'>
              <img :src="emptyImg"/>
              <p class="yh-emp">{{language.distribution_tocashFlow.noFlow}}</p>
          </div>
      </view>
  </toload>
</template>

<script>
export default {
  name: "distribution_order",
    data () {
      return {
          serchimg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/searchNew.png',
          placeStyle: 'color:#999999',
          bgColor: [
              {
                  item: '#FFFFFF'
              },
              {
                  item: '#FFFFFF'
              }
          ],
          page: 1,
          list: [],
          search: '',
          loadingType: 0,
          total: 0,
          load: false,
          allamount: '0.00',
          emptyImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/' + 'fx_tixNo.png',
      }
    },
    onReachBottom() {
        if (this.loadingType != 0) {
            return;
        }
        this.loadingType = 1;
        this.page ++;
        this._axios()
    },
    onLoad () {
      this._axios()
    },
    methods: {
        _axios () {
            let data = {
                module: 'app',
                action: 'commcenter',
                app: 'promote_order',
                page: this.page,
                search: this.search
            };
            this.$req.post({data}).then(res => {
                let {
                    data: {
                        list,
                        total,
                        allamount
                    }
                } = res;
                
                this.list = this.list.concat(list)
                this.total = total;
                this.allamount = allamount
                this.load = true;
                
                if (list.length < 10) {
                    this.loadingType = 2
                } else {
                    this.loadingType = 0
                }
                
                // this.loadingType = this.list.length ? 0 : 2;
            })
        },
        _searchB(){
            this.page = 1
            this.list = [];
            this.loadingType = [];
            this.load = false;
            uni.pageScrollTo({
                duration:0,
                scrollTop:0
            })
            this._axios()
        },
    }
}
</script>

<style lang="less" scoped>
@import url("../../static/css/distribution/distribution_order.less");
</style>
