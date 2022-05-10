<template>
    <div class="mpvue-picker">
        <div :class="{'pickerMask':showPicker}" @click="maskClick" catchtouchmove="true"></div>
        <div class="mpvue-picker-content " :class="{'mpvue-picker-view-show':showPicker}">
            <div class="mpvue-picker__hd" catchtouchmove="true">
                <div class="mpvue-picker__action" @click="pickerCancel">{{language.datatime.cancel}}</div>
                <div class="mpvue-picker__action" :style="{color:themeColor}" @click="pickerConfirm">{{language.datatime.confirm}}</div>
            </div>
            <div style="display: flex;justify-content: center;align-items: center;background: #fff;">
                <picker-view :value="value1" @change="bindChange1" class="mpvue-picker-view"
                             indicator-style="height: 40px;" style="flex: 1;">
                    <picker-view-column>
                        <view class="picker-item" v-for="(item,index) in years" :key="index">{{item}} {{language.datatime.year}}</view>
                    </picker-view-column>
                    <picker-view-column>
                        <view class="picker-item" v-for="(item,index) in months" :key="index">{{item}} {{language.datatime.month}}</view>
                    </picker-view-column>
                    <picker-view-column>
                        <view class="picker-item" v-for="(item,index) in days" :key="index">{{item}} {{language.datatime.days}}</view>
                    </picker-view-column>
                </picker-view>
                <picker-view :value="value2" @change="bindChange2" class="mpvue-picker-view"
                             indicator-style="height: 40px;" style="flex: 1;">
                    <picker-view-column>
                        <view class="picker-item" v-for="(item,index) in hours" :key="index">{{item}} {{language.datatime.hour}}</view>
                    </picker-view-column>
                    <picker-view-column>
                        <view class="picker-item" v-for="(item,index) in minutes" :key="index">{{item}} {{language.datatime.min}}</view>
                    </picker-view-column>
                    <picker-view-column>
                        <view class="picker-item" v-for="(item,index) in seconds" :key="index">{{item}} {{language.datatime.second}}</view>
                    </picker-view-column>
                </picker-view>
            </div>
        </div>
    </div>
</template>

<script>
    let date = new Date()
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()

    let hours = []
    let minutes = []
    let seconds = []

    for (let i = 0; i < 24; i++) {
        if (i < 10) {
            hours.push('0' + i)
            continue
        }
        hours.push(i)
    }

    for (let i = 0; i < 60; i++) {
        if (i < 10) {
            minutes.push('0' + i)
            seconds.push('0' + i)
            continue
        }
        minutes.push(i)
        seconds.push(i)
    }
    
    const years = []
    const year = date.getFullYear()
    const months = []
    const month = date.getMonth() + 1
    const days = []
    const day = date.getDate()
    for (let i = year; i <= year+5; i++) {
        years.push(i)
    }
    for (let i = 1; i <= 12; i++) {
        if(i<10) {
            i = '0' + i
        }
        months.push(i)
    }
    for (let i = 1; i <= 31; i++) {
        if(i<10) {
            i = '0' + i
        }
        days.push(i)
    }
    
    export default {
        data () {
            return {
                hours,
                minutes,
                seconds,
                value: [hour, minute, second],
                
                value2: [],
                /* 是否显示控件 */
                showPicker: false,
                /* 选择时间段 */
                time: [years[0] + '-' + months[month - 1] + '-' + days[day - 1],hours[0] + ':' + minutes[0]+ ':' +seconds[0]],
                
                // 时间选择器
                years,
                months,
                days,
                value1: [0, month - 1, day - 1],
            }
        },
        props: ['themeColor', 'urseTime'],
        methods: {
            show (data) {
                if (data) {
                   
                    let sparr = []
                    let arr = data.split(' ')
                    
                    for (let item of arr) {
                        
                        if(item.includes(':')){
                            sparr.push(item.split(':'))
                        }else{
                            sparr.push(item.split('-'))
                        }
                        
                    }
                    
                    years.filter((item,index)=>{
                        if(item == sparr[0][0]){
                            sparr[0][0] = index
                        }
                    })
                    
                    months.filter((item,index)=>{
                        if(item == sparr[0][1]){
                            sparr[0][1] = index
                        }
                    })
                    
                    days.filter((item,index)=>{
                        if(item == sparr[0][2]){
                            sparr[0][2] = index
                        }
                    })
                    
                    sparr[1].filter((item,index)=>{
                        sparr[1][index] = Number(item)
                    })
                    
                    this.value1 = []
                    this.value2 = []
                    this.value1.push(...sparr[0])
                    this.value2.push(...sparr[1])

                    // 进来的时候，初始化选择的时间为原来的营业时间
                    this.time = arr
                }
                setTimeout(() => {
                    this.showPicker = true
                }, 0)

            },
            maskClick () {
                this.pickerCancel()
            },
            pickerCancel () {
                this.showPicker = false
            },
            pickerConfirm () {
                this.showPicker = false
                this.$emit('onConfirm', this.time)
            },
            showPickerView () {
                this.showPicker = true
            },
            bindChange1 (e) {
                const val = e.detail.value
                
                let days = []
                
                if(this.isLeapYear(this.years[val[0]]) && this.months[val[1]] == '02'){
                    for (let i = 1; i <= 29; i++) {
                        if(i<10) {
                            i = '0' + i
                        }
                        days.push(i)
                    }
                }else if(this.months[val[1]] == '02'){
                    for (let i = 1; i <= 28; i++) {
                        if(i<10) {
                            i = '0' + i
                        }
                        days.push(i)
                    }
                }else{
                    if(this.months[val[1]] == '01' || this.months[val[1]] == '03' || this.months[val[1]] == '05' || this.months[val[1]] == '07' || this.months[val[1]] == '08' || this.months[val[1]] == '10' || this.months[val[1]] == '12'){
                        for (let i = 1; i <= 31; i++) {
                            if(i<10) {
                                i = '0' + i
                            }
                            days.push(i)
                        }
                    }else{
                        for (let i = 1; i <= 30; i++) {
                            if(i<10) {
                                i = '0' + i
                            }
                            days.push(i)
                        }
                    }
                    
                }
                this.days = days
                
                this.time[0] = this.years[val[0]] + '-' + this.months[val[1]] + '-' + this.days[val[2]]
            },
            bindChange2 (e) {
                const val = e.detail.value
                this.time[1] = this.hours[val[0]] + ':' + this.minutes[val[1]] + ':' + this.minutes[val[2]]
            },
            // 求闰年
            isLeapYear(year) {
                var cond1 = year % 4 == 0;  //条件1：年份必须要能被4整除
                var cond2 = year % 100 != 0;  //条件2：年份不能是整百数
                var cond3 = year % 400 ==0;  //条件3：年份是400的倍数
                //当条件1和条件2同时成立时，就肯定是闰年，所以条件1和条件2之间为“与”的关系。
                //如果条件1和条件2不能同时成立，但如果条件3能成立，则仍然是闰年。所以条件3与前2项为“或”的关系。
                //所以得出判断闰年的表达式：
                var cond = cond1 && cond2 || cond3;
                if(cond) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        created () {
            
            this.setLang();
            
            let val = this.value1
            let days = []
            if(this.isLeapYear(this.years[val[0]]) && this.months[val[1]] == '02'){
                // 闰年二月
                for (let i = 1; i <= 29; i++) {
                    if(i<10) {
                        i = '0' + i
                    }
                    days.push(i)
                }
            }else if(this.months[val[1]] == '02'){
                // 非闰年二月
                for (let i = 1; i <= 28; i++) {
                    if(i<10) {
                        i = '0' + i
                    }
                    days.push(i)
                }
            }else{
                // 非二月
                if(this.months[val[1]] == '01' || this.months[val[1]] == '03' || this.months[val[1]] == '05' || this.months[val[1]] == '07' || this.months[val[1]] == '08' || this.months[val[1]] == '10' || this.months[val[1]] == '12'){
                    for (let i = 1; i <= 31; i++) {
                        if(i<10) {
                            i = '0' + i
                        }
                        days.push(i)
                    }
                }else{
                    for (let i = 1; i <= 30; i++) {
                        if(i<10) {
                            i = '0' + i
                        }
                        days.push(i)
                    }
                }
            }
            this.days = days
        },
        watch: {}
    }
</script>

<style scoped lang="less">
    .mpvue-picker-view {
        position: relative;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 238px;
        background-color: rgba(255, 255, 255, 1);
    }

    .picker-item {
        text-align: center;
        line-height: 40px;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 16px;
    }

    .pickerMask {
        position: fixed;
        z-index: 1000;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
    }

    .mpvue-picker-content {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        transition: all 0.3s ease;
        transform: translateY(100%);
        z-index: 3000;
    }

    .mpvue-picker-view-show {
        transform: translateY(0);
    }

    .mpvue-picker__hd {
        display: flex;
        padding: 9px 15px;
        background-color: #fff;
        position: relative;
        text-align: center;
        font-size: 17px;
    }

    .mpvue-picker__hd:after {
        content: ' ';
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        height: 1px;
        border-bottom: 1px solid #e5e5e5;
        color: #e5e5e5;
        transform-origin: 0 100%;
        transform: scaleY(0.5);
    }

    .mpvue-picker__action {
        display: block;
        flex: 1;
        color: #1aad19;
    }

    .mpvue-picker__action:first-child {
        text-align: left;
        color: #888;
    }

    .mpvue-picker__action:last-child {
        text-align: right;
    }
</style>
