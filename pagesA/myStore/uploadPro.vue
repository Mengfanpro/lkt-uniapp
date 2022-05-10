<template>
    <div class="container uploadPro">
        <lktauthorize ref="lktAuthorizeComp"></lktauthorize>
        <heads class="zindex99" :title="title"></heads>
        <div class="relative">
            <div v-if="pageStatus == 2" class="seeTitle">{{language.uploadPro.info}}</div>
            <div class="pl_30">
                <div :class="[pageStatus == 2 ? 'formDiv1' : 'formDiv']">
                    <div :class="[pageStatus == 2 ? 'formList2' : 'formList']">
                        <div :class="[pageStatus == 2 ? 'leftText2' : 'leftText1']">
                            <span class="must" v-if="pageStatus != 2">*</span>
                            <span>{{language.uploadPro.Product}}</span>
                        </div>
                        <div v-if="pageStatus == 2" class="rightInput2">
                            <div class="proName">{{ proName }}</div>
                        </div>
                        <div v-else class="rightInput1">
                            <input v-if="pageStatus == 0" type="text" v-model="proName" :placeholder-style="placeStyle" maxlength="20" :placeholder="language.uploadPro.Product_placeholder[0]" />
                            <input v-if="pageStatus == 1" type="text" v-model="proName" :placeholder-style="placeStyle" maxlength="20" :placeholder="language.uploadPro.Product_placeholder[0]" />
                        </div>
                    </div>
                </div>
                <div :class="[pageStatus == 2 ? 'formDiv1' : 'formDiv']">
                    <div class="formList" :class="[pageStatus == 2 ? 'formList2' : 'formList']">
                        <div :class="[pageStatus == 2 ? 'leftText2' : 'leftText1']"><span>{{language.uploadPro.Product_Vice}}</span></div>
                        <div :class="[pageStatus == 2 ? 'rightInput2' : 'rightInput1']">
                            <input v-if="pageStatus == 0" type="text" v-model="vstName" :placeholder-style="placeStyle" maxlength="14" :placeholder="language.uploadPro.Product_placeholder[1]" />
                            <input
                                v-else-if="pageStatus == 1"
                                type="text"
                                v-model="vstName"
                                :placeholder-style="placeStyle"
                                maxlength="14"
                                :placeholder="language.uploadPro.Product_placeholder[1]"
                            />
                            <input v-else-if="pageStatus == 2" disabled="true" type="text" v-model="vstName" />
                        </div>
                    </div>
                </div>
                <div :class="[pageStatus == 2 ? 'formDiv1' : 'formDiv']">
                    <div :class="[pageStatus == 2 ? 'formList2' : 'formList']">
                        <div :class="[pageStatus == 2 ? 'leftText2' : 'leftText1']">
                            <span class="must" v-if="pageStatus != 2">*</span>
                            <span>{{language.uploadPro.keyword}}</span>
                        </div>
                        <div :class="[pageStatus == 2 ? 'rightInput2' : 'rightInput1']">
                            <input type="text" v-if="pageStatus == 0" v-model="keyWord" :placeholder-style="placeStyle" maxlength="14" :placeholder="language.uploadPro.keywordPH" />
                            <input type="text" v-if="pageStatus == 1" v-model="keyWord" :placeholder-style="placeStyle" maxlength="14" :placeholder="language.uploadPro.keywordPH" />
                            <input type="text" v-if="pageStatus == 2" v-model="keyWord" disabled="true" />
                        </div>
                    </div>
                </div>
                <!-- <div :class="[pageStatus == 2 ? 'formDiv1' : 'formDiv']">
                    <div :class="[pageStatus == 2 ? 'formList2' : 'formList']">
                        <div :class="[pageStatus == 2 ? 'leftText2' : 'leftText1']">
                            <span class="must" v-if="pageStatus != 2">*</span>
                            <span>{{language.uploadPro.weight}}</span>
                        </div>
                        <div :class="[pageStatus == 2 ? 'rightInput2' : 'rightInput1']">
                            <input
                                type="number"
                                v-if="pageStatus == 0"
                                v-model="proWegiht"
                                :placeholder-style="placeStyle"
                                maxlength="14"
                                :placeholder="language.uploadPro.Product_placeholder[2]"
                            />
                            <input
                                type="number"
                                v-if="pageStatus == 1"
                                v-model="proWegiht"
                                :placeholder-style="placeStyle"
                                maxlength="14"
                                :placeholder="language.uploadPro.Product_placeholder[2]"
                            />
                            <input type="text" v-if="pageStatus == 2" disabled="true" v-model="proWegiht" :placeholder-style="placeStyle" maxlength="14" />
                        </div>
                    </div>
                </div> -->
                <div :class="[pageStatus == 2 ? 'formDiv1' : 'formDiv']">
                    <div :class="[pageStatus == 2 ? 'formList2' : 'formList']">
                        <div :class="[pageStatus == 2 ? 'leftText2' : 'leftText1']"><span>{{language.uploadPro.code}}</span></div>
                        <div :class="[pageStatus == 2 ? 'rightInput2' : 'rightInput1']">
                            <input type="text" v-if="pageStatus == 0" v-model="proCode" :placeholder-style="placeStyle" :placeholder="language.uploadPro.Product_placeholder[3]" />
                            <input type="text" v-if="pageStatus == 1" v-model="proCode" :placeholder-style="placeStyle" :placeholder="language.uploadPro.Product_placeholder[3]" />
                            <input type="text" v-if="pageStatus == 2" v-model="proCode" disabled="true" :placeholder-style="placeStyle" />
                        </div>
                    </div>
                </div>
                <!-- pageStatus:'',[0-上传，1-编辑，2-查看] -->
                <div :class="[pageStatus == 2 ? 'formDiv1' : 'formDiv']">
                    <div :class="[pageStatus == 2 ? 'formList2' : 'formList']">
                        <div :class="[pageStatus == 2 ? 'leftText2' : 'leftText1']">
                            <span class="must" v-if="pageStatus != 2">*</span>
                            <span>{{language.uploadPro.category}}</span>
                        </div>
                        <div :class="[pageStatus == 2 ? 'rightInput2' : 'rightInput1']" @tap="showProClass()">
                            <input v-if="chooseClass.length == 0" disabled="true" type="text" :placeholder-style="placeStyle" :placeholder="language.uploadPro.Product_placeholder[4]" />
                            <input
                                v-else
                                type="text"
                                disabled="true"
                                :placeholder-style="placeStyle"
                                v-model="chooseClass[chooseClass.length - 1].pname"
                                :placeholder="language.uploadPro.Product_placeholder[4]"
                            />
                            <div v-if="pageStatus != 2" class="jiantouDiv"><img :src="jiantou" alt="" /></div>
                        </div>
                    </div>
                </div>

                <div :class="[pageStatus == 2 ? 'formDiv1' : 'formDiv']" @tap="showProBrand()">
                    <div :class="[pageStatus == 2 ? 'formList2' : 'formList']">
                        <div :class="[pageStatus == 2 ? 'leftText2' : 'leftText1']">
                            <span class="must" v-if="pageStatus != 2">*</span>
                            <span>{{language.uploadPro.brand}}</span>
                        </div>
                        <div :class="[pageStatus == 2 ? 'rightInput2' : 'rightInput1']">
                            <input type="text" v-if="pageStatus == 0" disabled="true" :placeholder-style="placeStyle" v-model="proBrand" :placeholder="language.uploadPro.Product_placeholder[5]" />
                            <input type="text" v-if="pageStatus == 1" disabled="true" :placeholder-style="placeStyle" v-model="proBrand.brand_name" :placeholder="language.uploadPro.Product_placeholder[5]" />
                            <input type="text" v-if="pageStatus == 2" disabled="true" :placeholder-style="placeStyle" v-model="proBrand.brand_name" />
                            <div v-if="pageStatus != 2" class="jiantouDiv"><img :src="jiantou" alt="" /></div>
                        </div>
                    </div>
                </div>
                <div :class="[pageStatus == 2 ? 'formDiv1' : 'formDiv']" :style="pageStatus == 2 ? 'margin-top: 16rpx;' : ''">
                    <div :class="[pageStatus == 2 ? 'formList2' : 'formList1']">
                        <div :class="[pageStatus == 2 ? 'leftText2' : 'leftText']" :style="pageStatus == 2 ? 'height: 30rpx;' : ''">
                            <span class="must" v-if="pageStatus != 2">*</span>
                            <span>{{language.uploadPro.cover}}</span>
                        </div>
                        <div class="rightInput">
                            <div class="upImg1" v-if="cover_map">
                                <img class="wh_100" :src="cover_map" alt="" />
                                <img :src="delImg" @tap="_delImg2()" class="delImg" v-if="pageStatus != 2"/>
                            </div>
                            <div  class="upImg" @tap="_chooseImg2()" v-else>
                                <img :src="textIcon" style="width: 40rpx;height: 34rpx;" alt="" />
                            </div>
                            <div class="jianyi" v-if="pageStatus != 2">{{language.uploadPro.Tips[4]}}</div>
                        </div>
                    </div>
                </div>
                <div :class="[pageStatus == 2 ? 'formDiv1' : 'formDiv']" :style="pageStatus == 2 ? 'margin-top: 16rpx;' : ''">
                    <div :class="[pageStatus == 2 ? 'formList2' : 'formList1']">
                        <div :class="[pageStatus == 2 ? 'leftText2' : 'leftText']" :style="pageStatus == 2 ? 'height: 30rpx;' : ''">
                            <span class="must" v-if="pageStatus != 2">*</span>
                            <span>{{language.uploadPro.Exhibition}}</span>
                        </div>
                        <div class="rightInput" v-if="pageStatus != 2">
                            <div class="upImg1" v-for="(item, index) in showImg" :key="index">
                                <img class="wh_100" :src="item" alt="" />
                                <img :src="delImg" @tap="_delImg(index)" class="delImg" />
                                <div v-if="index != 0" class="setMainImg" @tap="_setMain(index)">{{language.uploadPro.set_graph}}</div>
                                <div v-else class="mainImg">{{language.uploadPro.graph}}</div>
                            </div>
                            <div v-if="showImg.length != 5" class="upImg" @tap="_chooseImg(showImg.length)">
                                <img :src="textIcon" style="width: 40rpx;height: 34rpx;" alt="" />
                                <div class="max_5">{{language.uploadPro.Tips[0]}}</div>
                            </div>
                            <div class="jianyi">{{language.uploadPro.Tips[1]}}</div>
                        </div>
                        <div class="rightInput" v-else>
                            <div class="upImg1" v-for="(item, index) in showImg" :key="index">
                                <img class="wh_100" :src="item" alt="" />
                                <div v-if="index == 0" class="mainImg">{{language.uploadPro.graph}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="hr"></div>
            <div class="pl_30">
                <div class="formDiv" v-if="pageStatus != 2">
                    <div class="formList">
                        <div class="leftText1">
                            <span class="must">*</span>
                            <span>{{language.uploadPro.price[0]}}</span>
                        </div>
                        <div class="rightInput1"><input type="digit" v-model="costM" :placeholder="language.uploadPro.price_placeholder[0]" @input="_cbj" :placeholder-style="placeStyle" /></div>
                    </div>
                </div>
                <div class="formDiv" v-if="pageStatus != 2">
                    <div class="formList">
                        <div class="leftText1">
                            <span class="must">*</span>
                            <span>{{language.uploadPro.price[1]}}</span>
                        </div>
                        <div class="rightInput1"><input type="digit" v-model="oldM" :placeholder="language.uploadPro.price_placeholder[1]" @input="_yj" :placeholder-style="placeStyle" /></div>
                    </div>
                </div>
                <div class="formDiv" v-if="pageStatus != 2">
                    <div class="formList">
                        <div class="leftText1">
                            <span class="must">*</span>
                            <span>{{language.uploadPro.price[2]}}</span>
                        </div>
                        <div class="rightInput1"><input type="digit" v-model="sellM" :placeholder="language.uploadPro.price_placeholder[2]" @input="_sj" :placeholder-style="placeStyle" /></div>
                    </div>
                </div>
                <div class="formDiv" v-if="pageStatus != 2">
                    <div class="formList">
                        <div class="leftText1">
                            <span class="must">*</span>
                            <span>{{language.uploadPro.inventory}}</span>
                        </div>
                        <div class="rightInput1"><input type="number" v-model="stock" :placeholder="language.uploadPro.price_placeholder[3]" @input="_kc" :placeholder-style="placeStyle" /></div>
                    </div>
                </div>
                <div class="formDiv" v-if="pageStatus != 2">
                    <div class="formList">
                        <div class="leftText1">
                            <span class="must">*</span>
                            <span>{{language.uploadPro.price[4]}}</span>
                        </div>
                        <div class="rightInput1"><input type="number" v-model="stockWarn" :placeholder="language.uploadPro.price_placeholder[4]" @input="_kcyj" :placeholder-style="placeStyle" /></div>
                    </div>
                </div>
                <div class="formDiv" v-if="pageStatus != 2">
                    <div class="formList">
                        <div class="leftText1">
                            <span class="must">*</span>
                            <span>{{language.uploadPro.price[5]}}</span>
                        </div>
                        <div class="rightInput1" @tap="showProUnit()">
                            <input disabled="t rue" v-if="pageStatus == 0" v-model="unit" :placeholder="language.uploadPro.price_placeholder[5]" :placeholder-style="placeStyle" />
                            <input disabled="true" v-if="pageStatus == 1" v-model="unit" :placeholder-style="placeStyle" />
                            <input disabled="true" v-if="pageStatus == 2" v-model="unit" />
                            <div v-if="pageStatus != 2" class="jiantouDiv"><img :src="jiantou" alt="" /></div>
                        </div>
                    </div>
                </div>
                <div class="formDiv" v-if="pageStatus != 2">
                    <div class="formList">
                        <div class="leftText1"><span class="must">*</span><span>{{language.uploadPro.price[6]}}</span></div>
                        <div v-if="pageStatus != 2" class="rightInput1" @tap="_setAttr()">
                            <input disabled="true" v-model="setProt" :placeholder="attr_group.length < 1 ? language.uploadPro.price_placeholder[6]:''" :placeholder-style="placeStyle" />
                            <div class="jiantouDiv"><img :src="jiantou" alt="" /></div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="pageStatus == 2" class="seeTitle">{{language.uploadPro.attributes}}</div>
            <template v-if="pageStatus != 2">
                <template v-for="(item, index) in attr_group">
                    <div class="formDiv" :key="index" style="margin-left: 30rpx;" v-if="item.attr_list.length > 0">
                        <div class="formList">
                            <div class="leftText1">
                                <span>{{ item.attr_group_name }}</span>
                            </div>
                            <div class="rightInput1" style="flex-wrap: wrap;height: auto;min-height: 90rpx;padding: 20rpx 20rpx 20rpx 0;">
                                <span class="attrSpan" v-for="(items, indx) in item.attr_list" :key="indx">
                                    <span v-if="indx > 0">，</span>
                                    {{ items.attr_name }}
                                </span>
                            </div>
                        </div>
                    </div>
                </template>
            </template>
            <div class="attrList table" :style="{ width: tableList }" v-if="attr_group.length > 0 && pageStatus == 2">
                <div class="attrListHead tr">
                    <div class="list2 th" v-for="(item, index) in attr_group" :key="index">{{ item.attr_group_name }}</div>
                    <div class="list1 th">{{language.uploadPro.price[0]}}</div>
                    <div class="list1 th">{{language.uploadPro.price[1]}}</div>
                    <div class="list1 th">{{language.uploadPro.price[2]}}</div>
                    <div class="list1 th">{{language.uploadPro.price[3]}}</div>
                    <div class="list1 th">{{language.setAttr.price[4]}}</div>
                </div>
                <div class="attrListBody">
                    <div class="tr" v-for="(items, index) in attr_arr" :key="index">
                        <div class="list2  aa td" v-for="(item, index1) in items.attr_list" :key="index1">
                            <span class="a1">{{ item.attr_name }}</span>
                        </div>
                        <div class="list1 td">{{ items.cbj }}</div>
                        <div class="list1 td">{{ items.yj }}</div>
                        <div class="list1 td">{{ items.sj }}</div>
                        <div class="list1 td">{{ items.kucun }}</div>
                        <div class="list1 td">
                            <img :src="items.img" style="width: 60rpx;height: 60rpx;">
                        </div>
                    </div>
                </div>
            </div>
            <div class="hr"></div>
            <div v-if="pageStatus == 2" class="seeTitle">{{language.uploadPro.set_up[0]}}</div>
            <div class="pl_30">
                <div :class="[pageStatus == 2 ? 'formDiv1' : 'formDiv']" @tap="showProFreight()">
                    <div :class="[pageStatus == 2 ? 'formList2' : 'formList']">
                        <div :class="[pageStatus == 2 ? 'leftText2' : 'leftText1']">
                            <span class="must" v-if="pageStatus != 2">*</span>
                            <span>{{language.uploadPro.freight}}</span>
                        </div>
                        <div class="rightInput1" :style="pageStatus == 2 ? 'height: auto;' : ''">
                            <input type="text" disabled="true" v-if="pageStatus == 0 && proFreightPickerArray.length>0" v-model="freightSet" :placeholder="language.uploadPro.set_placeholder[0]" :placeholder-style="placeStyle" />
                            <input type="text" disabled="true" v-if="pageStatus == 1" v-model="freightSet.name" :placeholder="language.uploadPro.set_placeholder[0]" :placeholder-style="placeStyle" />
                            <input type="text" disabled="true" v-if="pageStatus == 2" v-model="freightSet.name" class="font_28" />
                            
                            <input type="text" disabled="true" v-if="pageStatus == 0 && proFreightPickerArray.length==0" :value="language.uploadPro.addFreight" :placeholder="language.uploadPro.set_placeholder[0]" :placeholder-style="placeStyle" style="text-align: right; padding-right: 70rpx;"/>
                            <div v-if="pageStatus != 2" class="jiantouDiv"><img :src="jiantou" alt="" /></div>
                        </div>
                    </div>
                </div>

                <div :class="[pageStatus == 2 ? 'formDiv1' : 'formDiv']">
                    <div :class="[pageStatus == 2 ? 'formList2' : 'formList']">
                        <div :class="[pageStatus == 2 ? 'leftText2' : 'leftText1']"><span>{{language.uploadPro.set_up[2]}}</span></div>
                        <div v-if="pageStatus != 2" class="rightInput1 boxChoose">
                            <div class="boxChooseDiv" v-for="(item, index) in s_type" :class="{ active: item.status }" :key="index" @tap="_chooseSType(index)">{{ item.name }}</div>
                        </div>
                        <div v-else class="rightInput1 boxChoose h_auto">
                            <div class="font_28" >
                                {{s_typeShow}}
                            </div>
                        </div>
                    </div>
                </div>
                <div :class="[pageStatus == 2 ? 'formDiv1' : 'formDiv']">
                    <div :class="[pageStatus == 2 ? 'formList2' : 'formList']">
                        <div :class="[pageStatus == 2 ? 'leftText2' : 'leftText1']">
                            <span class="must" v-if="pageStatus != 2">*</span>
                            <span>{{language.uploadPro.set_up[3]}}</span>
                        </div>
                        <div v-if="pageStatus == 0" class="rightInput1 boxChoose scroll">
                            <div v-for="(item, index) in plugin_list.active" :key="index">
                                <div class="boxChooseDiv" @tap="_changeActive(index)" :class="{ active: item.status }" v-if="type_status == 0">{{ item.name }}</div>
                                <div class="boxChooseDiv" :class="{ active: item.status }" v-else>{{ item.name }}</div>
                            </div>
                        </div>
                        <div v-else class="rightInput1 boxChoose h_auto scroll">
                            <div v-for="(item, index) in plugin_list.active" :key="index">
                                <div class="font_28" v-if="item.status">{{ item.name }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div :class="[pageStatus == 2 ? 'formDiv1' : 'formDiv']" v-if="show_adrStatus">
                    <div :class="[pageStatus == 2 ? 'formList2' : 'formList']">
                        <div :class="[pageStatus == 2 ? 'leftText2' : 'leftText1']"><span>{{language.uploadPro.show_adr}}</span></div>
                        <div v-if="pageStatus != 2" class="rightInput1 boxChoose">
                            <div class="boxChooseDiv" v-for="(item, index) in show_adr" :class="{ active: item.status }" :key="index" @tap="_chooseShowAdr(index)">
                                {{ item.name }}
                            </div>
                        </div>
                        <div v-else class="rightInput1 boxChoose h_auto">
                            <div class="font_28">{{ show_adrShow }}</div>
                        </div>
                    </div>
                </div>
                <div :class="[pageStatus == 2 ? 'formDiv1' : 'formDiv']" v-if="distributorsStatus">
                    <div :class="[pageStatus == 2 ? 'formList2' : 'formList']">
                        <div :class="[pageStatus == 2 ? 'leftText2' : 'leftText1']">
                            <span class="must" v-if="pageStatus != 2">*</span>
                            <span>{{language.uploadPro.set_up[5]}}</span>
                        </div>
                        <div class="rightInput1" @tap="showProDistributors()">
                            <input
                                type="text"
                                disabled="true"
                                v-if="pageStatus == 0"
                                v-model="distributorsSet"
                                :placeholder="language.uploadPro.set_placeholder[2]"
                                :placeholder-style="placeStyle"
                            />
                            <input
                                type="text"
                                disabled="true"
                                v-if="pageStatus == 1"
                                v-model="distributorsSet.name"
                                :placeholder="language.uploadPro.set_placeholder[2]"
                                :placeholder-style="placeStyle"
                            />
                            <input class="font_30" type="text" disabled="true" v-if="pageStatus == 2" v-model="distributorsSet.name" />
                            <div v-if="pageStatus != 2" class="jiantouDiv"><img :src="jiantou" alt="" /></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="hr"></div>
            <div v-if="pageStatus == 2" class="seeTitle">{{language.uploadPro.Details[0]}}</div>
            <div v-if="pageStatus == 2"><wxParse v-if="showContent" :content="content"></wxParse></div>
            <div class="pl_30">
                <div v-if="pageStatus != 2" class="formDiv border_bottom_0">
                    <div :class="[pageStatus == 2 ? 'formList2' : 'formList']">
                        <div :class="[pageStatus == 2 ? 'leftText2' : 'leftText1']">
                            <span>{{language.uploadPro.Details[1]}}</span>
                        </div>
                        <div v-if="pageStatus != 2" class="rightInput1" @tap="_toGoodDetail()">
                            <input type="text" disabled="true" :placeholder-style="placeStyle" />
                            <div class="jiantouDiv"><img :src="jiantou" alt="" /></div>
                        </div>
                        <div v-else class="rightInput1"></div>
                    </div>
                </div>
            </div>
            <div class="hr"></div>

            <div v-if="pageStatus == 0" class="submitDiv">
                <div class="submitBtn div1" @tap="_Check('no')">{{language.uploadPro.Details[2]}}</div>
                <div class="submitBtn div2" @tap="_Check('yes')">{{language.uploadPro.Details[3]}}</div>
            </div>
            <div v-else-if="pageStatus == 1" class="submitDiv">
                <div class="submitBtn div1" @tap="_Check('no')">{{language.uploadPro.Details[2]}}</div>
                <div class="submitBtn div2" @tap="_Check('yes')">{{language.uploadPro.Details[3]}}</div>
            </div>
            <div v-else @tap="back()" class="submitDiv"><div class="submitBtn div3">{{language.uploadPro.Back}}</div></div>
            
            <!-- chooseClassFlag -->
            <div v-if="chooseClassFlag" ref="proClassPicker" class="mask" style="z-index: 999;" @touchmove.stop.prevent>
                <div>
                    <p class="mask_title">
                        {{language.uploadPro.Tips[2]}}
                        <img class="closeImg" :src="closeImg" @tap="_closeClass" />
                    </p>
                    <scroll-view scroll-x class="chooseValueBox">
                        <div class="flex">
                            <p class="chooseValue" v-for="(item, index) in chooseClass" :key="index">
                                <image v-if="index != 0" class="fenge" :src="jiantou" mode=""></image>
                                <text class="span" @tap="del_Class(item, index)">{{ item.pname }}</text>
                            </p>
                        </div>
                    </scroll-view>
                    <scroll-view scroll-y class="chooseBox">
                        <ul>
                            <li :class="{ active1: item.status }" v-for="(item, index) in arrClass" :key="index" :value="item.cid" @tap="_chooseClass(item, index)" style="display: flex;">
                                {{ item.pname }}
                                <img class="img" v-if="item.status" :src="chooseImg" />
                            </li>
                        </ul>
                    </scroll-view>
                    <view class="chooseBtn" @tap="_chooseBtn">{{language.delModel.confirm}}</view>
                </div>
            </div>

            <mpvue-picker
                v-if="proBrandShow"
                :themeColor="themeColor"
                ref="proBrandPicker"
                :mode="mode"
                :deepLength="deepLength"
                :pickerValueDefault="proBrandPickerDefault"
                @onConfirm="onConfirmProBrand"
                :pickerValueArray="proBrandPickerArray"
            ></mpvue-picker>
            <mpvue-picker
                v-if="proFreightShow"
                :themeColor="themeColor"
                ref="proFreightPicker"
                :mode="mode"
                :deepLength="deepLength"
                :pickerValueDefault="proFreightPickerDefault"
                @onConfirm="onConfirmProFreight"
                :pickerValueArray="proFreightPickerArray"
            ></mpvue-picker>
            <mpvue-picker
                v-if="proDistributorsShow"
                :themeColor="themeColor"
                ref="proDistributorsPicker"
                :mode="mode"
                :deepLength="deepLength"
                :pickerValueDefault="proDistributorsPickerDefault"
                @onConfirm="onConfirmProDistributors"
                :pickerValueArray="proDistributorsPickerArray"
            ></mpvue-picker>
            <mpvue-picker
                v-if="proUnitShow"
                :themeColor="themeColor"
                ref="proUnitPicker"
                :mode="mode"
                :deepLength="deepLength"
                :pickerValueDefault="proUnitPickerDefault"
                @onConfirm="onConfirmProUnit"
                :pickerValueArray="proUnitPickerArray"
            ></mpvue-picker>
        </div>
    </div>
</template>

<script>
    import mpvuePicker from '../../components/mpvuePicker.vue';
    import wxParse from '../../components/mpvue-wxparse/src/wxParse.vue';
    import {
        LaiKeTui_axios,
        LaiKeTui_cbj,
        LaiKeTui_changeActive,
        LaiKeTui_Check,
        LaiKeTui_chooseImg,
        LaiKeTui_chooseImg2,
        LaiKeTui_chooseShowAdr,
        LaiKeTui_chooseSType,
        LaiKeTui_delImg,
        LaiKeTui_delImg2,
        LaiKeTui_editor,
        LaiKeTui_kc,
        LaiKeTui_kcyj,
        LaiKeTui_onConfirmProBrand,
        LaiKeTui_onConfirmProClass,
        LaiKeTui_onConfirmProDistributors,
        LaiKeTui_onConfirmProFreight,
        LaiKeTui_request,
        LaiKeTui_see,
        LaiKeTui_setAttr,
        LaiKeTui_setMain,
        LaiKeTui_showProBrand,
        LaiKeTui_showProClass,
        LaiKeTui_showProDistributors,
        LaiKeTui_showProFreight,
        LaiKeTui_showProUnit,
        LaiKeTui_sj,
        LaiKeTui_yj
    } from '../../static/js/myStore/uploadPro.js';
    
    export default {
    data() {
        return {
            title: '上传商品',
            access_id: '',
            textIcon: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/hhhh2x.png',
            delImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/delImg.png',
            jiantou: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jiantou2x.png',
            closeImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/close2x.png',
            chooseImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/chooseMeh.png',
            shop_id: '',
            status: '',
            p_id: '',
            pageStatus: '', //[0-上传，1-编辑，2-查看]
            widthArr: [],
            tableWidth: 0,
            upImgNum: [5, 4, 3, 2, 1],
            themeColor: '#007AFF',
            mode: '',
            deepLength: 1,
            res: [],
            proName: '',
            vstName: '',
            keyWord: '',
            proWegiht: '',
            proCode: '',
            proClass: '',
            proClassId: '',
            proClassShow: false,
            proClassPickerArray: [],
            proClassPickerDefault: [],
            proClassSmall: '',
            proClassSmallId: '',
            proClassSmallShow: false,
            proClassSmallPickerArray: [],
            proClassSmallPickerDefault: [],
            proBrand: '',
            proBrandId: '0',
            proBrandShow: false,
            proBrandPickerArray: [],
            proBrandPickerDefault: [],
            showImg: [],
            showImgOld: '', //原图 --用于对照
            showImgNewAdd: [],
            initial: '',
            costM: '',
            oldM: '',
            sellM: '',
            stock: '',
            stockWarn: '',
            unit: '',
            setProt: '',
            proUnitShow: false,
            proUnitPickerArray: [],
            proUnitPickerDefault: [],

            freightSet: '',
            freightSetId: '',
            proFreightShow: false,
            proFreightPickerArray: [],
            proFreightPickerDefault: [],
            s_type: '',
            s_typeShow: '',
            plugin_list: [],
            active: [],

            show_adrStatus: true,
            show_adr: '',
            show_adrShow: '',
            distributorsStatus: false,
            distributorsSet: '',
            distributorsSetId: '',
            proDistributorsShow: false,
            proDistributorsPickerArray: [],
            proDistributorsPickerDefault: [],
            downLineStatus: false,
            downLineAdd: '',
            showContent: false, //是否显示商品详情
            content: '', ///商品详情

            frames_status: '',
            display_position: '',
            //以下为不必要数据
            fxStatus: '',
            s_typeStr: [],
            fastTap: true,
            secondClass: [], //二级类名数组
            haveChildrenClass: 1, //是否有副类[1-有，-1-没有]

            type_status: '', // 商品类型状态
            check_Flag: true, //限制提交按钮只能点一次
            placeStyle: 'color:#b8b8b8;font-size:28upx',

            chooseClassFlag: false,
            arrClass: [], //现在分类的数据 {id:'',name:'美妆护肤'}
            chooseClass: [], //选中的分类  {id:'',name:'美妆护肤'}

            attr_group: [], //设置属性的表格标题
            attr_arr: [], //设置属性的表格数据

            richList: '', //商品详情
            platform1: 'android', //平台

            loadFlag: false, //已经加载完，用来规避监听事件改编属性表格
            cover_map: '', // 封面图
        };
    },
    watch: {
        costM(val) {
            if (this.attr_arr && this.attr_arr.length > 0 && this.loadFlag) {
                this.attr_arr.filter(item => {
                    item.cbj = val;
                });

                uni.setStorageSync('upload_attr_arr', this.attr_arr);
            }
        },
        oldM(val) {
            if (this.attr_arr && this.attr_arr.length > 0 && this.loadFlag) {
                this.attr_arr.filter(item => {
                    item.yj = val;
                });

                uni.setStorageSync('upload_attr_arr', this.attr_arr);
            }
        },
        sellM(val) {
            if (this.attr_arr && this.attr_arr.length > 0 && this.loadFlag) {
                this.attr_arr.filter(item => {
                    item.sj = val;
                });

                uni.setStorageSync('upload_attr_arr', this.attr_arr);
            }
        }
    },
    onLoad(option) {
        this.platform1 = uni.getSystemInfoSync().platform;
        
        this.status = option.pageStatus;
        if (option.p_id) {
            this.p_id = option.p_id;
        }
        
        this.shop_id = uni.getStorageSync('shop_id') ? uni.getStorageSync('shop_id') : this.$store.state.shop_id;
        this.access_id = uni.getStorageSync('access_id') ? uni.getStorageSync('access_id') : this.$store.state.access_id;
		
		this.isLogin(()=>{
			this.showContent = false;
			
			if (!this.status) {
			    this.pageStatus = 0;
			    LaiKeTui_axios(this);
			} else if (this.status == 'editor') {
			    this.pageStatus = 1;
			    LaiKeTui_editor(this);
			} else if (this.status == 'see' || this.status == 'seePro') {
			    this.pageStatus = 2;
			    LaiKeTui_see(this);
			}
		})
    },
    onShow() {
		if (!this.status) {
			this.title = this.language.uploadPro.title
		    uni.setNavigationBarTitle({
		        title: this.language.uploadPro.title
		    })
		} else if (this.status == 'editor') {
		    this.title = this.language.uploadPro.title1;
		    uni.setNavigationBarTitle({
		        title: this.language.uploadPro.title1
		    })
		} else if (this.status == 'see' || this.status == 'seePro') {
		    this.title = this.language.uploadPro.title2;
		    uni.setNavigationBarTitle({
		        title: this.language.uploadPro.title2
		    })
		}
        
        this.isLogin(()=>{})
		
        if(this.pageStatus == 0 &&this.proFreightPickerArray.length == 0 && this.loadFlag){
            this.getFreight()
        }
        
        this.platform1 = uni.getSystemInfoSync().platform;
        if (this.pageStatus != 2) {
            if (uni.getStorageSync('upload_attr_group')) {
                this.attr_group = uni.getStorageSync('upload_attr_group');
                this.attr_arr = uni.getStorageSync('upload_attr_arr');
            }
        }
        this.tableWidth = this.$store.state.tableWidth;

        if (this.$store.state.detaiFlag) {
            this.richList = this.$store.state.goodsDetail;
            this.$store.state.detaiFlag = undefined;
        }
    },
    onUnload() {
        uni.removeStorageSync('upload_attr_group');
        uni.removeStorageSync('upload_attr_arr');
        uni.removeStorageSync('upload_chooseAttr');
		
        uni.removeStorageSync('upload_attrDataList');
        uni.removeStorageSync('upload_addAttrStr');
        uni.removeStorageSync('upload_addAttrObj');
    },
    beforeDestroy() {
        this.$store.state.goodsDetail = [];
        this.fastTap = true;

        this.$req
            .post({
                data: {
                    module: 'app',
                    action: 'mch',
                    m: 'del',
                    
                    shop_id: this.shop_id
                }
            })
            .then(res => {});
    },

    methods: {
        getFreight(){
            let data = {
                action: 'mch',
                module: 'app',
                m: 'upload_merchandise_page',
                shop_id: this.shop_id,
            }
            
            this.$req.post({data}).then(res=>{
                let { code, data, message } = res
                
                if(code == 200 ){
                    this.proFreightPickerArray = []
                    if(typeof data.freight_list == 'object'){
                        for(let i in data.freight_list){
                            this.proFreightPickerArray.push(data.freight_list[i].name)
                            
                            if(data.freight_list[i].is_default == 1){
                                this.freightSet = data.freight_list[i].name
                                this.freightSetId = data.freight_list[i].id
                            }
                        }
                        if(!this.freightSetId && data.freight_list.length) {
                            this.freightSet = data.freight_list[0].name
                            this.freightSetId = data.freight_list[0].id
                        }
                        return
                    }
                    for (var i = 0; i < data.freight_list.length; i++) {
                        this.proFreightPickerArray.push(data.freight_list[i].name)
                        
                        if(data.freight_list[i].is_default == 1){
                            this.freightSet = data.freight_list[i].name
                            this.freightSetId = data.freight_list[i].id
                        }
                    }
                }else{
                    uni.showToast({
                        title: message,
                        duration: 1500,
                        icon: 'none'
                    })
                }
            })
        },
        // 返回
        back() {
            uni.navigateBack({
                delta: 1
            });
        },
        // 获取分类
        showProClass() {
			if(this.pageStatus != 2){
				LaiKeTui_showProClass(this);
			}
        },
        //选中类名
        _chooseClass(item, index) {
            
            for (let i = 0; i < this.arrClass.length; i++) {
                if(index != i){
                    this.arrClass[i].status = false
                }
            }
            
            item.status = !item.status
            
            // LaiKeTui_onConfirmProClass(this, item);
        },
        _chooseBtn(){
            let arrClass = this.arrClass.filter(item=>{
                return item.status
            })
            
            if(arrClass.length == 0){
                uni.showToast({
                    title: this.language.uploadPro.classToast,
                    icon: 'none'
                })
                return
            }
            
            let item = arrClass[0]
            
            if(typeof this.proBrand == 'string'){
                this.proBrand = ''
            }else{
                this.proBrand.brand_name = ''
            }
            this.proBrandId = ''
            
            let data = {
                action: 'mch',
                module: 'app',
                m: 'choice_class',
                shop_id: this.shop_id,
                cid: item.cid,
                brand_str: this.proBrandId,
            }
            
            this.$req.post({data}).then(res => {
                let { code, data, message } = res
                
                if (code == 200) {
                    var chooseClass_num = this.chooseClass.length - 1
                    this.proClassId = item.cid
                    this.proClass = item.pname
                
                    this.chooseClass[chooseClass_num] = item
                    if (data.list.class_list.length == 0) {
                        this.chooseClassFlag = false
                    } else {
                        this.arrClass = data.list.class_list[0]
                        this.chooseClass.push({
                            pname: this.language.uploadPro.choice
                        })
                    }
                    
                    this.proBrandPickerArray = []
                    this.res.brand_class_list = data.list.brand_list
                    var proBrandId = this.proBrandId
                    this.proBrand = ''
                    this.proBrandId = '0'
                    
                    for (var i = 0; i < data.list.brand_list.length; i++) {
                        if (proBrandId == data.list.brand_list[i].brand_id) {
                            console.log(data.list.brand_list[i].brand_id)
                            this.proBrandId = data.list.brand_list[i].brand_id
                            this.proBrand = data.list.brand_list[i].brand_name
                        }
                        this.proBrandPickerArray.push(data.list.brand_list[i].brand_name)
                    }
                
                } else {
                    uni.showToast({
                        title: message,
                        duration: 1500,
                        icon: 'none'
                    })
                }
            })
        },
        // 删除类名
        del_Class(item, index) {
			if(item.pname == "请选择" && !item.cid){
                return
            }
            
            this.chooseClass = this.chooseClass.splice(0, index);
            
            if (this.chooseClass.length == 0) {
                this.proClassId = 0;
            } else {
                this.proClassId = this.chooseClass[this.chooseClass.length - 1].cid;
            }
            
            if(typeof this.proBrand == 'string'){
                this.proBrand = ''
            }else{
                this.proBrand.brand_name = ''
            }
            this.proBrandId = ''
            
            this.showProClass();
        },
        // 选择品牌
        showProBrand() {
            if(this.pageStatus == 2){
                return
            }
            if (!this.proClassId) {
                return uni.showToast({
                    icon: 'none',
                    title: this.language.uploadPro.Tips[3]
                });
            }
            LaiKeTui_showProBrand(this);
        },
        // 点击品牌
        onConfirmProBrand(e) {
            LaiKeTui_onConfirmProBrand(this, e);
        },
        // 删除图片
        _delImg(index) {
            LaiKeTui_delImg(this, index);
        },
        // 删除图片
        _delImg2() {
            LaiKeTui_delImg2(this);
        },
        // 设为主图
        _setMain(index) {
            LaiKeTui_setMain(this, index);
        },
        // 选择封面图片
        _chooseImg2() {
            LaiKeTui_chooseImg2(this);
        },
        // 选择图片
        _chooseImg(num) {
            LaiKeTui_chooseImg(this, num);
        },
        // 成本价
        _cbj(e) {
            LaiKeTui_cbj(this, e);
        },
        // 原价
        _yj(e) {
            LaiKeTui_yj(this, e);
        },
        // 售价
        _sj(e) {
            LaiKeTui_sj(this, e);
        },
        // 库存
        _kc(e) {
            LaiKeTui_kc(this, e);
        },
        // 库存预警
        _kcyj(e) {
            LaiKeTui_kcyj(this, e);
        },
        // 选择单位
        onConfirmProUnit(e) {
            this.unit = e.label;
            this.show = false;
        },
        // 显示单位
        showProUnit() {
            LaiKeTui_showProUnit(this);
        },
        // 设置属性
        _setAttr() {
            LaiKeTui_setAttr(this);
        },
        // 运费
        showProFreight() {
            if (this.pageStatus != 2) {
                if(this.proFreightPickerArray.length == 0){
                    uni.navigateTo({
                        url: '/pagesA/myStore/freight'
                    })
                    return
                }
                LaiKeTui_showProFreight(this);
            }
        },
        // 点击运费
        onConfirmProFreight(e) {
            LaiKeTui_onConfirmProFreight(this, e);
        },
        // 显示标签
        _chooseSType(index) {
            LaiKeTui_chooseSType(this, index);
        },
        // 支持活动
        _changeActive(num) {
            LaiKeTui_changeActive(this, num);
        },
        // 显示位置
        _chooseShowAdr(index) {
            LaiKeTui_chooseShowAdr(this, index);
        },
        // 等级绑定
        showProDistributors() {
            LaiKeTui_showProDistributors(this);
        },
        // 点击分销等级
        onConfirmProDistributors(e) {
            LaiKeTui_onConfirmProDistributors(this, e);
        },
        _downLineStatus: function(e) {
            this.downLineStatus = e.target.value;
        },
        // 商品详情
        _toGoodDetail() {
            uni.navigateTo({
                url: '../myStore/goodsDetail'
            });
        },
        // 提交
        _Check(type) {
            if (this.check_Flag) {
                this.check_Flag = false;
                LaiKeTui_Check(this, type);
            }
        },
        async _request(type) {
            LaiKeTui_request(this, type);
        },
        /**
         * 获取
         */
        getGoodsDetailsContext() {
            let myGoodsInfo = this.$store.state.goodsDetail;
            let htmlStr = '';
            for (var x in myGoodsInfo) {
                let elementHtmlInfo = myGoodsInfo[x];
                let tagType = elementHtmlInfo.tagType;
                let style = elementHtmlInfo.style;
                let htmlText = elementHtmlInfo.value;
                switch (tagType) {
                    case 'p':
                    case 'P':
                        htmlStr += '<' + tagType + ' style="' + style + '">' + htmlText + '</' + tagType + '>';
                        break;
                    case 'image':
                        htmlStr += '<img style="' + style + '" src="' + htmlText + '" />';
                        break;
                }
            }

            return htmlStr;
        },

        _fxStatus: function(e) {
            this.fxStatus = e.target.value;
        },

        // 关闭类名选择
        _closeClass() {
            this.chooseClassFlag = false;
            
            this.chooseClass = this.chooseClass.filter(item=>{
                return item.pname != "请选择"
            })
        }
    },
    computed: {
        widthArr1: function() {
            return this.widthArr;
        },
        tableList: function() {
            if (this.attr_group.length == 0) {
                var width = 750;
                return uni.upx2px(width) + 'px';
            } else {
                var width = this.tableWidth * 2 + 130 * 5;
                return uni.upx2px(width) + 'px';
            }
        }
    },
    components: {
        mpvuePicker,
        wxParse
    }
};
</script>

<style lang="less">
@import url('../../static/css/myStore/uploadPro.less');
</style>
