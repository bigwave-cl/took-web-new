import index from '@/views/lottery/lottery';
import lotteryMain from '@/views/lottery/lottery-main/lottery-main';
import lotteryCode from '@/views/lottery/lottery-code/lottery-code';
import lotteryDetail from '@/views/lottery/lottery-detail/lottery-detail';

export default {
	path: '/lottery',
	component: index,
	children: [{
			path: '',
			name: 'lotteryHome',
			component: lotteryMain,
			meta: { title: '兑奖中心' }
		},
		{
			path: 'code',
			name: 'lotteryCode',
			component: lotteryCode,
			meta: { title: '我的兑奖号' }
		},
		{
			path: 'detail',
			name: 'lotteryDetail',
			component: lotteryDetail,
			meta: { title: '奖项详情' }
		}
	]
}
