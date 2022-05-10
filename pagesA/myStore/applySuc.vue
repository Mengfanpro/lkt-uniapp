<template>
    <div>
        <heads :title='language.applySuc.title' returnR='7'></heads>
        <div class='relative'>
            <div class='noFindDiv'>
                <div class='noFindDiv_top'>
                    <img class='noFindImg' :src="sucImg"/>
                </div>
                <div class='noFindTitle'>{{language.applySuc.submittedSuccse}}</div>
                <span class='noFindText'> {{language.applySuc.waitReview}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                back: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/back2x.png',
                
                title: '申请结果',
                fastTap: true,
                sucImg: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/gouhei.png',
            }
        }
    }
</script>

<style lang="less">
    @import url("../../static/css/myStore/applySuc.less");
</style>
