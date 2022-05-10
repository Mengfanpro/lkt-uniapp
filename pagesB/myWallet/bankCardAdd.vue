<template>
  <view class="bankCardAdd" style="position: relative">
      <heads :title="title"></heads>
      <ul class="message">
<!--          <li><text style="height: 90rpx;font-size: 30rpx;color: #020202;line-height:88rpx;">{{language.putForward.information}}</text></li>-->
          <li class="bank_card_info"><text style="height: 90rpx;font-size: 30rpx;color: #020202;line-height:88rpx;">{{language.bankCardAdd.qtxyhxx}}</text></li>
          <li>
              <span><span class="require">*</span>{{language.putForward.cardholder}}&nbsp;&nbsp;</span>
              <input placeholder-style="color: #b8b8b8;" type="text" :placeholder="language.putForward.cardholder_placeholder" v-model="user_name" @blur="_usname()" />
          </li>
          <li>
              <span><span class="require">*</span>{{language.putForward.number}}</span>
              <input placeholder-style="color: #b8b8b8;" type="text" :placeholder="language.putForward.number_placeholder" v-model="bank_number" @input="_bank()" @blur="_bank_p" />
          </li>
          <li>
              <span><span class="require">*</span>{{language.putForward.bank}}</span>
              <input placeholder-style="color: #b8b8b8;" type="text" :placeholder="language.putForward.bank_placeholder" v-model="bank_name" @blur="_bank_p" />
          </li>
          <li>
              <span><span class="require">*</span>{{language.putForward.branch}}</span>
              <input placeholder-style="color: #b8b8b8;" type="text" :placeholder="language.putForward.branch_placeholder" v-model="branch"/>
          </li>

          <li class="default-li" v-if="type === 'store'">
              <span><span class="require">*</span>{{language.bankCardAdd.swmr}}</span>
              <img v-if="modify_default_flag" class='quan_img' style="margin-right: 28rpx;" :src="modify_default"/>
              <img v-else class='quan_img' style="margin-right: 28rpx;" :src="is_default==1 ? circle_hei : circle_hui" @click='_is_default'/>
          </li>
          
      </ul>

      <div :class="user_name.length > 0 && bank_number.length>0 && bank_name.length>0 && branch.length>0 ? 'btn':'btn1'" @tap="submit" v-if="!id">{{ language.bankCardAdd.qrtj }}</div>
      <div :class="user_name.length > 0 && bank_number.length>0 && bank_name.length>0 && branch.length>0 ? 'btn':'btn1'" @tap="edit" v-else>{{ language.bankCardAdd.qrbj }}</div>
  </view>
</template>

<script>
export default {
  name: "bankCardAdd",
    data () {
      return {
          user_name: '',
          bank_name: '',
          branch: '',
          bank_number: '',
          type: '',
          circle_hui: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/xuanzehui2x.png', //图片地址
          circle_hei: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/xuanzehei2x.png', //图片地址
          modify_default: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/modify_default.png', //图片地址
          fastTap: false,
          modify_default_flag: false,
          is_default: 0,
          id: 0,
          title: '添加银行卡'
      }
    },
    onLoad(option) {
      this.type = option.type;
      this.title = this.language.bankCardAdd.tj
      if (option.id) {
          this.id = option.id;
          this._axios();
          this.title = this.language.bankCardAdd.bj
      }
    },
    methods: {
        async _axios () {
            let data  = {
                module: 'app',
                action: 'MchBank',
                app: 'bankPage',
                id: this.id
            }
            let {
                data: {
                    bank:[
                        {
                            cardholder,
                            bank_name,
                            bank_card_number,
                            is_default,
                            branch
                        }
                    ]
                }
            } = await this.$req.post({data})
            this.user_name = cardholder
            this.bank_name = bank_name
            this.bank_number = bank_card_number
            this.is_default = is_default
            this.branch = branch
            
            if (this.is_default == 1) {
                this.modify_default_flag = true
            }
        },
        // 默认卡
        _is_default () {
            if (this.is_default === 1) {
                this.is_default = 0
            } else {
                this.is_default = 1
            }
        },
        //持卡人验证
        _usname() {
            var name = /^[\u4e00-\u9fa5]{2,8}$/;
            if (!name.test(this.user_name)) {
                this.user_name = '';
                uni.showToast({
                    title: this.language.putForward.nameTip,
                    duration: 1000,
                    icon: 'none'
                });
            }
        },
        // 银行卡号输入完毕
        _bank_p() {
            var patt = /^[1-9]{1}\d{15}|\d{18}$/;

            if (this.bank_number.indexOf('*') > -1) {
                return false;
            }

            if (!patt.test(Number.parseInt(this.bank_number))) {
                uni.showToast({
                    title: this.language.putForward.bankpTips[0],
                    duration: 1000,
                    icon: 'none'
                });
            } else {
                var data = {
                    module: 'app',
                    action: 'user',
                    app: 'Verification',
                    Bank_name: this.bank_name,
                    Bank_card_number: this.bank_number
                };

                this.$req.post({ data }).then(res => {
                    let { code, message } = res;

                    if (code != 200) {
                        this.bank_number = '';
                        uni.showToast({
                            title: this.language.putForward.bankpTips[1],
                            duration: 1000,
                            icon: 'none'
                        });
                    } else {
                        this.bank_name = res.data.Bank_name;
                    }
                });
            }
        },
        //银行卡匹配
        _bank() {
            var pattern = /^([1-9]{1})(\d{5})$/;
            if (pattern.test(this.bank_number)) {
                var data = {
                    module: 'app',
                    action: 'user',
                    app: 'Verification',
                    Bank_name: this.bank_name,
                    Bank_card_number: this.bank_number
                };

                this.$req.post({ data }).then(res => {
                    let { code, message } = res;

                    if (code != 200) {
                        this.bank_number = '';
                        uni.showToast({
                            title: this.language.putForward.bankTip,
                            duration: 1000,
                            icon: 'none'
                        });
                    } else {
                        this.bank_name = res.data.Bank_name;
                    }
                });
            }
            if (this.bank_number == '') {
                this.bank_name = '';
            }
        },
        edit () {
            if (this.fastTap) return false;
            if (!this.user_name || !this.bank_name || !this.branch || !this.bank_number) {
                uni.showToast({
                    title: '请填写完整信息',
                    icon: 'none'
                })
                return false;
            }
            this.fastTap = true;
            let data = {
                Cardholder: this.user_name,
                Bank_name: this.bank_name,
                branch: this.branch,
                Bank_card_number: this.bank_number,
                app: 'editBank',
                action: 'MchBank',
                module: 'app',
                is_default: this.is_default,
                id: this.id
            }
            this.$req.post({
                data: data
            }).then(res => {
                if (res.code === 200) {
                    uni.showToast({
                        title: res.message,
                        icon: 'none'
                    })
                    setTimeout(() => {
                        this.navBack();
                    }, 1500)
                } else {
                    uni.showToast({
                        title: res.message,
                        icon: 'none'
                    })
                }

                this.fastTap = false;
                console.log(res);
            })
        },
      submit () {
          if (this.fastTap) return false;
          
          if (!this.user_name || !this.bank_name || !this.branch || !this.bank_number) {
              uni.showToast({
                  title: '请填写完整信息',
                  icon: 'none'
              })
              return false;
          }

          this.fastTap = true;
          let data = {};
          
          if (this.type === 'store') {
              data = {
                  Cardholder: this.user_name,
                  Bank_name: this.bank_name,
                  branch: this.branch,
                  Bank_card_number: this.bank_number,
                  app: 'addBank',
                  action: 'MchBank',
                  module: 'app',
                  is_default: this.is_default
              }
          } else {
              data = {
                  Cardholder: this.user_name,
                  Bank_name: this.bank_name,
                  branch: this.branch,
                  Bank_card_number: this.bank_number,
                  app: 'add_bank',
                  action: 'user',
                  module: 'app'
              }
          }
          
          
          this.$req.post({
              data: data
          }).then(res => {
              if (res.code == 200) {
                  uni.showToast({
                      title: res.message,
                      icon: 'none'
                  })
                  setTimeout(() => {
                      this.navBack();
                  }, 1500)
              } else {
                  uni.showToast({
                      title: res.message,
                      icon: 'none'
                  })
              }
              
              this.fastTap = false;
              console.log(res);
          })
      }
    }
}
</script>

<style lang="less" scoped>
page {
    background: #f6f6f6;
}
.message {
    font-size: 28rpx;
    color: #020202;
    background-color: #fff;
    position: relative;
}

.message li {
    padding-left: 30rpx;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    
    &.default-li {
        display: flex;
        justify-content: space-between;
    }
}

.bank_card_info {
    margin: 0 !important;
}

li span {
    width: 160rpx;
    display: flex;
    height: 90rpx;
    align-items: center;
    justify-content: flex-start;
    font-size: 28rpx;
    color: #020202;
    white-space: nowrap;
    &.require {
        color: red;
        width: auto;
        margin-right: 2rpx;
    }
}

.message input {
    border: none;
    padding: 0 20rpx;
    flex: 1;
    font-size: 28rpx;
}

.bankCardAdd {
    height: 100vh;
}

.btn {
    width: 690rpx;
    height: 90rpx;
    border-radius: 10rpx;
    position: absolute;
    bottom: 80rpx;
    .solidBtn();
    left: calc((100% - 690rpx) / 2);
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30rpx;
}

.btn1 {
    width: 690rpx;
    height: 90rpx;
    border-radius: 10rpx;
    position: absolute;
    bottom: 80rpx;
    .solidBtn();
    left: calc((100% - 690rpx) / 2);
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30rpx;
    background-color: #99b4b4;
}

</style>
