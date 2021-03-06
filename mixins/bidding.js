export default {
    data () {
      return {
          bind_id: '', //ç«æååid
          jp_address: '',
          jp_imgurl: '',
          jp_name: '',
      }  
    },
    methods: {
        getJPPayOrderInfo () {
            return {
                module: 'app',
                action: 'order',
                app: 'payment',
                address_id: this.address_id,
                type: 'JP',
                auction_id: this.bind_id,
                coupon_id: this.coupon_id,
                remarks: this.remarks,
            }
        },
        getJPWalletPayData (postData) {
            return {
                ...postData
            }
        }
    }
}
