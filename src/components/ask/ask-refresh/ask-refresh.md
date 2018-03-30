## ask-refresh

使用该组件会在组件内部创建一个滚动区域，支持弹性滚动，使用特定的参数会触发上拉和下拉操作
`<ask-refresh>
	content........
</ask-refresh>`
这样就会创建一个弹性滚动区域

## ask-refresh 使用说明
### 默认不触发上拉下拉，保持顶部

### 模式mode
1、默认模式
`<ask-refresh :mode="0"></ask-refresh>`
2、仅触发下拉操作
`<ask-refresh :mode="1"></ask-refresh>`
3、仅触发上拉操作
`<ask-refresh :mode="2"></ask-refresh>`
4、触发上拉、下拉
`<ask-refresh :mode="3"></ask-refresh>`

### 滑动到底部

`<ask-refresh :slideBottom="true" :slideRef="slideRef"></ask-refresh>`
`/*定义slideRef，并赋初始值为'START'*/`
`methods->
	initMessage(){
		this.slideRef = 'ON'; 				//异步加载请求中
		const chatServer = new Chat();
		chatServer.message().then(r=>{
			this.message = r.data.list;
			this.slideRef = 'OVER';			//异步加载请完成
			setTimeout(() => { 				//全部操作加载完成之后恢复默认值
				this.slideRef = 'START';
			}, 0)
		})
	}`

### 上拉函数

`<ask-refresh @upward="upward" :upwardRef="upwardRef"></ask-refresh>`
`/*定义upwardRef，并赋初始值为'START'*/`
`methods->
	upward(){
		console.log('upward')
		this.upwardRef = 'ON';				//异步加载请求中
		setTimeout(() => {
			console.log('upwardOver')
			this.upwardRef = 'OVER';		//异步加载请完成
			setTimeout(() => {				//全部操作加载完成之后恢复默认值
				this.upwardRef = 'START';
			}, 0)
		}, 3000);
	}`
	
### 下拉函数

`<ask-refresh @down="down" :downRef="downRef"></ask-refresh>`
`/*定义downRef，并赋初始值为'START'*/`
`methods->
	down(){
		console.log('down')
		this.downRef = 'ON';				//异步加载请求中
		setTimeout(() => {
			console.log('downOver')
			this.downRef = 'OVER';			//异步加载请完成
			setTimeout(() => {				//全部操作加载完成之后恢复默认值
				this.downRef = 'START';
			}, 0)
		}, 3000);
	}`

###参数注释
`{
	@upward:"",						//上拉到临界值时触发的上拉函数
	@down:"",						//下拉到临界值时触发的下拉函数
	mode: 0,						//默认0，可选取值1|2|3,0->不触发上拉下拉函数,1->仅开启下拉，2->仅开启上拉,3->上拉下拉开启
	downRef: null,					//默认null，null不会使用这个值，START->开始,ON->进行中,OVER->完成(下拉tip执行的状态)
	upwardRef: null,				//默认null，null不会使用这个值，START->开始,ON->进行中,OVER->完成(上拉tip执行的状态)
	slideRef: null,					//默认null，null不会使用这个值，START->开始,ON->进行中,OVER->完成(模块内容加载的状态)
	slideBottom: false,				//默认false，模块是否滑动到底部，true->是,false->否
}`

**如果设置了上拉和下拉操作，分别拥有 upwardTip && downTip 设置交互完成之后的提示语**

**@upward和upwardRef组合使用，如果不传upwardRef，则在默认2s之后隐藏tip**

**@down和downRef组合使用，如果不传downRef，则在默认2s之后隐藏tip**

**slideBottom和slideRef组合使用，如果slideBottom为true则必传slideRef，不传递slideRef的话异步加载的数据，不能正常滑动到底**