<template>
	<view class="blankPage"  :style="{height: heightConfig + 'rpx', backgroundColor: bgColor}">
		
	</view>
</template>

<script>
	export default {
		name: 'blankPage',
		props: {
			dataConfig: {
				type: Object,
				default: () => {}
			}
		},
        watch: {
            dataConfig () {
                this.bgColor = this.dataConfig.bgColor.color[0].item;  
                this.heightConfig = this.dataConfig.heightConfig.val;  
            }  
        },
		data() {
			return {
				bgColor:this.dataConfig.bgColor.color[0].item,
				heightConfig:this.dataConfig.heightConfig.val
			};
		},
		created() {},
		methods: {
			
		}
	}
</script>

<style lang="less">
	
</style>
