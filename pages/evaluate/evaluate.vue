<template>
    <div class='evaluate'>
        <div ref='evaluate_all'>
            <heads :title='language.evaluate.evaluate.title'></heads>
            <div>
                <ul class='evaluate-classify'>
                    <li class='evaluate-classify_li' @tap="_comment('全部')" :class='allevaluat1?"active":""'>
                        <div>
                            <span>{{language.evaluate.evaluate.whole}} </span>
                        </div>
                    </li>
                    <li class='evaluate-classify_li' @tap="_comment('好评')" :class='allevaluat2?"active":""'
                        v-if="comments_hao">
                        <div>
                            <span>{{language.evaluate.evaluate.Favorable_comments}} </span>
                            <span>({{comments_hao}})</span>
                        </div>
                    </li>
                    <li class='evaluate-classify_li' @tap="_comment('中评')" :class='allevaluat3?"active":""'
                        v-if="comments_zhong">
                        <div>
                            <span>{{language.evaluate.evaluate.Medium_evaluation}} </span>
                            <span>({{comments_zhong}})</span>
                        </div>
                    </li>
                    <li class='evaluate-classify_li' @tap="_comment('差评')" :class='allevaluat4?"active":""'
                        v-if="comments_cha">
                        <div>
                            <span>{{language.evaluate.evaluate.negative_comment}} </span>
                            <span>({{comments_cha}})</span>
                        </div>
                    </li>
                    <li class='evaluate-classify_li' @tap="_comment('有图')" :class='allevaluat5?"active":""'
                        v-if="comments_image">
                        <div>
                            <span>{{language.evaluate.evaluate.yes_img}} </span>
                            <span>({{comments_image}})</span>
                        </div>
                    </li>
                </ul>
            </div>
            <ul class='evaluate-content' ref='evaluate_content'>
                <li v-for='(item,index) in allevaluat' :key='item.id'>
                    <div class='content-user'>
                        <div class='content_n'>
                            <img v-if="item.user_name==null" :src="logo" class="ev_img">
                            <img v-else :src="item.anonymous==0?(item.headimgurl==''?imgurl:item.headimgurl):imgurl"
                                 class="ev_img">
                            <span class='user-name'>{{item.anonymous==1 || item.user_name=='' || item.user_name== 'null' || item.user_name== null ?language.evaluate.evaluate.anonymous:item.user_name}}</span>
                            <div class='starall'>
                                <img v-for='(star,starindex) in stars[index]'
                                     :src="stars[index][starindex] ? starOnImg: starOffImg"/>
                            </div>
                        </div>
                    </div>
                    <div style="font-size: 20rpx;color: #9D9D9D;">
                        {{item.add_time}}
                        <span style="margin-left: 16rpx;">{{language.evaluate.evaluate.Specifications}}：{{item.attribute_str}}</span>
                    </div>
                    <div style="margin-top: 20rpx;">
                        <p>{{item.content}}</p>
                        <div class='content_img'>
                            <image class='img' v-for='(img,imgindex) in item.images' :key='imgindex' :src='img.url'
                                 @click="_bigimg(img.url,index,imgindex,'')" mode="aspectFit"/>
                        </div>
                        <!-- 商家回复 -->
                        <div v-if='item.replyAdmin' class="huifu">{{language.evaluate.evaluate.business_huifu}}: 
                            <p :class="{'Open_p':spanIndex.indexOf(index)>-1}" @click="Close(index)">{{item.replyAdmin}}</p>
                             <!-- :class="{'disnone':spanIndex.indexOf(index)>-1}" -->
                            <span class="Open" v-if="item.replyAdmin.length > 40 && spanIndex.indexOf(index) != 0 && spanIndex.indexOf(index) != 1" @click="Open(index)">{{language.evaluate.evaluate.unfold}}</span>
                            <span class="Open" v-if="spanIndex.indexOf(index) != -1" @click="Open(index)">{{language.evaluate.evaluate.reunfold}}</span>
                        </div>
                    </div>
                    <div v-if='item.review && item.review!== "undefined"'>
                        <div class='review_title'>
                            <p style="color: #FF7D00;">{{language.evaluate.evaluate.add_comments}}</p>
                            <div class='review_title' style="font-size: 20rpx;color: rgb(157, 157, 157);margin: 0;">
                                {{item.review_time}}
                            </div>
                        </div>
                        <p>{{item.review == 'undefined' ? '':item.review}}</p>
                        <div class='content_img'>
                            <image class='img' v-for='(re_img,img_index) in item.review_images'
                                 :key='imgindex' :src='re_img.url'
                                 @click="_bigimg(re_img.url,index,img_index,'next')" mode="aspectFit"/>
                        </div>
                    </div>
                </li>
            </ul>
<!--            <uni-load-more v-if="allevaluat.length > 10" :loadingType="loadingType"></uni-load-more>-->
        </div>
        <div class='bigimg' v-if='isBigimg' id='bigimg'>
            <div class='bigimg_i'>
                <img :src="fff" @click="_smallimg"/>
            </div>
        </div>
        
    </div>

</template>

<script>
    import Heads from '../../components/header.vue'

    export default {
        data () {
            return {
                bargain: false,
                fff: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/ffff3x.png',
                title: '评价',
                pid: '',
                loadingType: 0,
                evaluat: '',//存储全部评价数据
                praise: [],//存储好评数据
                review: [],//存储中评数据
                negativeComment: [],//存储差评数据
                reply: '',//商家回复
                img: [],//存储有图片的数据
                allevaluat: '',//存储全部评价数据
                allevaluat1: true,
                allevaluat2: false,
                allevaluat3: false,
                allevaluat4: false,
                allevaluat5: false,
                isBigimg: false,//放大图片状态
                src: '',//放大图片路径
                comments_cha: '',
                comments_hao: '',
                comments_image: '',
                comments_total: '',
                comments_zhong: '',
                type: 0,
                starOffImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/xing12x.png',
                starOnImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/xing22x.png',
                stars: [],
                page: 1, //加载页面
                allLoaded: false,
                autoFill: false, //若为真，loadmore 会自动检测并撑满其容器
                bottomStatus: '',
                bottomPullText: '上拉加载更多...',
                bottomDropText: '释放更新...',
                loading: false,
                all_img: [],
                logo: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/lktlogo.png',
                defaultIndex: 0,
                imgurl: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/landing_logo2x.png',  //图片
                spanIndex:[]
            }
        },
        /**
         * 上拉触底事件处理
         * */
        async onReachBottom() {
            if (this.allLoaded) {
                return;
            }

            var me = this
            var data = {
                module: 'app',
                action: 'product',
                app: 'load_getcomment',
                pid: this.pid,
                type: this.type,
                page: me.page,
            }
            if (this.bargain) {
                data.bargain = true
            }
            let res = await this.$req.post({data})
            if (res.code == 200) {
                let { comments_cha, comments_hao, comments_image, comments_total, comments_zhong, data } = res
                // me.comments_cha = comments_cha
                // me.comments_hao = comments_hao
                // me.comments_image = comments_image
                // me.comments_total = comments_total
                // me.comments_zhong = comments_zhong

                if (data && data.length > 0) {
                    data.filter(item => {
                        item.add_time = item.add_time.substr(0, 10)
                        item.review_time = item.review_time.substr(0, 10)
                    })
                }

                if (me.type == 0) {
                    me.evaluat = data
                    me.allevaluat = me.allevaluat.concat(data)
                } else if (me.type == 1) {
                    me.praise = data
                    me.allevaluat = me.allevaluat.concat(data)
                } else if (me.type == 2) {
                    me.review = data
                    me.allevaluat = me.allevaluat.concat(data)
                } else if (me.type == 3) {
                    me.negativeComment = data
                    me.allevaluat = me.allevaluat.concat(data)
                } else if (me.type == 4) {
                    me.img = data
                    me.allevaluat = me.allevaluat.concat(data)
                }
                if (data.length < 10) {
                    me.allLoaded = true
                } else {
                    me.allLoaded = false
                }

                data = me.allevaluat
                var arr = []
                for (var k = 0; k < data.length; k++) {
                    var tempArr = []
                    for (var i = 0; i < 5; i++) {
                        tempArr.push(false)
                    }
                    me.$set(me.stars, k, tempArr)
                    var CommentType = data[k].CommentType
                    for (var f = 0; f < CommentType; f++) {
                        me.$set(me.stars[k], f, true)
                    }
                    if (data[k].images && data[k].review_images) {
                        var images = data[k].images.concat(data[k].review_images)

                        for (var s = 0; s < images.length; s++) {
                            arr.push(images[s].url)
                        }
                    } else if (data[k].images || data[k].review_images) {
                        var images = data[k].images ? data[k].images : data[k].review_images

                        for (var s = 0; s < images.length; s++) {
                            arr.push(images[s].url)
                        }
                    }
                }

                for (var t = 0; t < arr.length; t++) {
                    me.$set(me.all_img, t, arr[t])
                }
                me.page ++;
            } else {
                uni.showToast({
                    title: res.message,
                    duration: 1500,
                    icon: 'none'
                })
            }
        },
        onLoad (option) {
            this.pid = option.pid
            this.bargain = option.bargain
            
            this._axios()
        },
        methods: {
            //放大图片
            _bigimg (url, index, index1, type) {
                var me = this
                var img = []
                if (type == 'next') {
                    for (var i = 0; i < me.allevaluat[index].review_images.length; i++) {
                        img.push(me.allevaluat[index].review_images[i].url)
                    }
                } else {
                    for (var i = 0; i < me.allevaluat[index].images.length; i++) {
                        img.push(me.allevaluat[index].images[i].url)
                    }
                }
                uni.previewImage({
                    current: img[index1],
                    urls: img
                })
            },
            //缩小图片
            _smallimg () {
                this.isBigimg = !this.isBigimg
            },
            //点击显示相应的评论
            _comment (sel) {
                this.page = 1
                if (sel == '好评') {
                    this.type = 1
                    this.allevaluat1 = false
                    this.allevaluat2 = true
                    this.allevaluat3 = false
                    this.allevaluat4 = false
                    this.allevaluat5 = false
                } else if (sel == '中评') {
                    this.type = 2
                    this.allevaluat1 = false
                    this.allevaluat2 = false
                    this.allevaluat3 = true
                    this.allevaluat4 = false
                    this.allevaluat5 = false
                } else if (sel == '差评') {
                    this.type = 3
                    this.allevaluat1 = false
                    this.allevaluat2 = false
                    this.allevaluat3 = false
                    this.allevaluat4 = true
                    this.allevaluat5 = false
                } else if (sel == '有图') {
                    this.type = 4
                    this.allevaluat1 = false
                    this.allevaluat2 = false
                    this.allevaluat3 = false
                    this.allevaluat4 = false
                    this.allevaluat5 = true
                } else if (sel == '全部') {
                    this.type = 0
                    this.allevaluat1 = true
                    this.allevaluat2 = false
                    this.allevaluat3 = false
                    this.allevaluat4 = false
                    this.allevaluat5 = false
                }
                this._axios()
            },
            //请求数据
            async _axios () {
                var me = this
                var data = {
                    module: 'app',
                    action: 'product',
                    app: 'getcomment',
                    pid: this.pid,
                    page: me.page,
                    type: this.type
                }
                if (this.bargain) {
                    data.bargain = true
                }
                let res = await this.$req.post({data})
                if (res.code == 200) {
                    let { data:{ comments_cha, comments_hao, comments_image, comments_total, comments_zhong, data } } = res
                    me.comments_cha = comments_cha
                    me.comments_hao = comments_hao
                    me.comments_image = comments_image
                    me.comments_total = comments_total
                    me.comments_zhong = comments_zhong

                    if (data && data.length > 0) {
                        data.filter(item => {
                            item.add_time = item.add_time.substr(0, 10)
                            item.review_time = item.review_time.substr(0, 10)
                        })
                    }
                    
                    if (me.type == 0) {
                        me.evaluat = data
                        me.allevaluat = me.evaluat
                    } else if (me.type == 1) {
                        me.praise = data
                        me.allevaluat = me.praise
                    } else if (me.type == 2) {
                        me.review = data
                        me.allevaluat = me.review
                    } else if (me.type == 3) {
                        me.negativeComment = data
                        me.allevaluat = me.negativeComment
                    } else if (me.type == 4) {
                        me.img = data
                        me.allevaluat = me.img
                    }
                    if (data.length < 10) {
                        me.allLoaded = true
                    } else {
                        me.allLoaded = false
                    }
                    
                    var arr = []
                    for (var k = 0; k < data.length; k++) {
                        var tempArr = []
                        for (var i = 0; i < 5; i++) {
                            tempArr.push(false)
                        }
                        me.$set(me.stars, k, tempArr)
                        var CommentType = data[k].CommentType
                        for (var f = 0; f < CommentType; f++) {
                            me.$set(me.stars[k], f, true)
                        }
                        if (data[k].images && data[k].review_images) {
                            var images = data[k].images.concat(data[k].review_images)

                            for (var s = 0; s < images.length; s++) {
                                arr.push(images[s].url)
                            }
                        } else if (data[k].images || data[k].review_images) {
                            var images = data[k].images ? data[k].images : data[k].review_images

                            for (var s = 0; s < images.length; s++) {
                                arr.push(images[s].url)
                            }
                        }
                    }
                    for (var t = 0; t < arr.length; t++) {
                        me.$set(me.all_img, t, arr[t])
                    }
                } else {
                    uni.showToast({
                        title: res.message,
                        duration: 1500,
                        icon: 'none'
                    })
                }
            },
            Open(index){
                let arrIndex = this.spanIndex.indexOf(index);
                // console.log(arrIndex);
                
                if(arrIndex>-1){
                    this.spanIndex.splice(arrIndex,1);
                }else{
                    this.spanIndex.push(index);
                }
            },
            Close(index){
                let arrIndex = this.spanIndex.indexOf(index);
                // console.log(arrIndex);
                
                if(arrIndex>-1){
                    this.spanIndex.splice(arrIndex,1);
                }else{
                    this.spanIndex.push(index);
                }
            }
        },
        components: {
            Heads,
        }
    }
</script>

<style scoped lang="less">
    @import url("../../static/css/evaluate/evaluate.less");
</style>
