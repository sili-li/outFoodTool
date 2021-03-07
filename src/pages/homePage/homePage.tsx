import React, { useState, useEffect } from 'react'
import { TabBar, Carousel, Toast, ActivityIndicator } from 'antd-mobile';
import _ from 'lodash'
import { CopyToClipboard } from 'react-copy-to-clipboard';
// import qs from 'qs'
import classnames from 'classnames'
import styles from './homePage.module.css'
import Api from '../../lib/api';
import meituanBanner from '../../assets/images/mt_bannerjpg.jpg'
import elmBanner from '../../assets/images/elm_banner.png'
import meiTopImg from '../../assets/images/meiTop.png'

const signUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0dc05810f1191cd5&response_type=code&scope=snsapi_userinfo&state=94dab25593d3fffeb4d60934c3b0c502&connect_redirect=1#wechat_redirect"
const homePage = () => {
	const [selectedTab, setSelectTab] = useState<string>('meituan');
	const [userInfo, setUserInfo] = useState();
	const [eleInfo, setEleInfo] = useState();
	const [mtInfo, setMtInfo] = useState();
	const [token, setToken] = useState('8c713092c495478dfe8d34862386ffb3');
	const [loading, setIsLoading] = useState(false);
	// const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true });
	// const token = _.get(queryParams, 'token');

	useEffect(() => {
		Api.post('/wechat/login', {}).then((res: any) => {
			// 未授权
			if (_.get(res, 'data.code') === 1000) {
				window.location.href = `${signUrl}&redirect_uri=${location.href}`
			} else if (_.get(res, 'data.code') === 0) {
				setToken(_.get(res, 'data.data.token'))
				// const data = _.get(res, 'data.data.info')
				// setUserInfo(data || {})
				getActivityInfo(1);
			}
		}).catch((error: any) => {
			Toast.fail('授权失败')
			console.log("=====no error", error)
		})
		// window.open('http://api.wm.yuejuwenhua.com/wechat/index')
		// } else {
		// 	///wechat/index?token=035c94156320d656250e32aef241febf
		// 	Api.post(`/wechat/login?token=${token}`).then((res: any) => {
		// 		if (_.get(res, 'data.code') === 0) {
		// 			const data = _.get(res, 'data.data.info')
		// 			setUserInfo(data || {})
		// 			getActivityInfo(1);
		// 		}
		// 	}).catch((error: any) => {
		// 		Toast.fail('获取信息失败')
		// 		console.log("error===", error)
		// 	})
		// }
	}, [])

	const renderMine = () => {
		return <div className={styles.mineBg}>
			<div className={styles.imgBox}>
				<img src={_.get(userInfo, 'avatar')} />
				<span>{_.get(userInfo, 'nickname')}</span>
			</div>
			<div className={styles.cardBox}>
				<div className={styles.cardTitle}>我的返利</div>
				<div className={styles.cardContent}>
					<div className={styles.cardItem}>
						<span>当前余额(元)</span>
						<span>{_.get(userInfo, 'balance')}</span>
					</div>
					<div className={styles.cardItem}>
						<span>即将到账(元)</span>
						<span>{_.get(userInfo, 'cash_amount')}</span>
					</div>
					<div className={styles.cardItem}>
						<span>累计到账(元)</span>
						<span>{_.get(userInfo, 'commission_rate')}</span>
					</div>
				</div>
			</div>
		</div>
	}

	const renderBanner = () => {
		return <Carousel
			autoplay={true}
			infinite
		>
			<a
				key='meituan'
				href="/"
				style={{ display: 'inline-block', width: '100%', height: 'auto' }}
			>
				<img
					src={meituanBanner}
					alt=""
					style={{ width: '100%', verticalAlign: 'top' }}
				/>
			</a>
			<a
				key='ele'
				href="/"
				style={{ display: 'inline-block', width: '100%', height: 'auto' }}
			>
				<img
					src={elmBanner}
					alt=""
					style={{ width: '100%', verticalAlign: 'top' }}
				/>
			</a>
		</Carousel>
	}

	const renderIcon = (styleName: any) => {
		return <div className={classnames(styles.tabIcon, styleName)}></div>
	}

	const getSelectedColor = () => {
		switch (selectedTab) {
			case 'ele':
				return '#33A3F4'
			case 'meituan':
				return '#FFC300'
			default:
				return '#f40'
		}
	}

	const getActivityInfo = (type: number) => {
		//1 美团
		//2 饿了么'8dae0bbb4f2819b5bf169bf6babce304'
		setIsLoading(true)
		if (type === 3) {
			Api.post('/wechat/get-user-info', {
			}, {
				headers: {
					token
				}
			}).then((res: any) => {
				if (_.get(res, 'data.code') === 0) {
					const data = _.get(res, 'data.data.user_info')
					setUserInfo(data || {})
					getActivityInfo(1);
				}
			}).finally(() => {
				setIsLoading(false)
			})
		} else {
			Api.post('/wechat/get-activity-info', {
				type
			}, {
				headers: {
					token
				}
			}).then((res: any) => {
				if (_.get(res, 'data.code') === 0) {
					const data = _.get(res, 'data.data')
					if (type == 1) {
						setMtInfo(data)
					} else {
						setEleInfo(data)
					}
				}
			}).catch(() => {
				Toast.fail('获取活动失败')
			}).finally(() => {
				setIsLoading(false)
			})
		}
	}

	return (
		<div style={{ position: 'fixed', height: '100%', width: '100%', top: 0 }}>
			<TabBar
				unselectedTintColor="#949494"
				tintColor={getSelectedColor()}
				barTintColor="white"
			>
				<TabBar.Item
					title="饿了么"
					key="ele"
					icon={renderIcon(styles.eleIcon)}
					selectedIcon={renderIcon(styles.eleSelected)}
					selected={selectedTab === 'ele'}
					onPress={() => {
						setSelectTab('ele')
						_.isEmpty(eleInfo) && getActivityInfo(2);
					}}
					data-seed="logId"
				>
					<div className={styles.meiContent}>
						{renderBanner()}
						<div className={styles.contentBox}>
							<img className={styles.meiBg} src={elmBanner} alt='' />
							<div className={styles.getBox}>
								<p>饿了么天天领券</p>
								{!_.isEmpty(eleInfo) && <a href={_.get(eleInfo, 'click_url')}>立即领取</a>}
							</div>
						</div>
						{!_.isEmpty(eleInfo) && <img className={styles.qrCode} src={_.get(eleInfo, 'wx_mini_qrcode_url')} />}
					</div>
				</TabBar.Item>
				<TabBar.Item
					icon={renderIcon(styles.meituanIcon)}
					selectedIcon={renderIcon(styles.meituanSelected)}
					title="美团领券"
					key="meituan"
					selected={selectedTab === 'meituan'}
					onPress={() => {
						setSelectTab('meituan');
						_.isEmpty(mtInfo) && getActivityInfo(1)
					}}
					data-seed="logId1"
				>
					<div className={classnames(styles.meiContent, styles.meiContainer)}>
						<img className={styles.topImg} src={meiTopImg} />
						<div className={styles.cardContainer}>
							<div className={styles.stepBox}>
								<div><span></span><i>先领券</i></div>
								<div><span></span><i>再下单</i></div>
								<div><span></span><i>拿返利</i></div>
							</div>
							<div className={styles.splitBox}>
								................................................................................................
							</div>
							<div className={styles.qrcodeBox}>
								{!_.isEmpty(mtInfo) && <img className={styles.qrCode} src={_.get(mtInfo, 'wx_mini_qrcode_url')} />}
							</div>
							<a className={styles.getTicketBtn} href={_.get(mtInfo, 'click_url')}>领红包点外卖</a>
						</div>
						<div className={styles.btnBox}>
							<a href={_.get(mtInfo, 'short_url')}>分享赚钱</a>
							<CopyToClipboard text={`【美团外卖福利红包】每日限时抢，最高可得66元！\n${_.get(mtInfo, 'short_url')}`}
								onCopy={() => Toast.info("复制成功")}
							>
								<div className={styles.copyBtn}>复制文案</div>
							</CopyToClipboard>
						</div>
						<div className={styles.tipsBox}>
							<h3>返利注意事项：</h3>
							<p>1.美团外卖，必须使用带<i>【专享】</i>标记的优惠券才有返利；</p>
							<p>2.领券后在红包有效期内下单均有返利；</p>
							<p>3.美团绑定的手机号，需与领券登录的手机号一致；</p>
							<p>4.无论美团新老用户，每个手机号每天可领一次，红包金额随机发放；</p>
						</div>
					</div>
				</TabBar.Item>
				<TabBar.Item
					icon={renderIcon(styles.mineIcon)}
					selectedIcon={renderIcon(styles.mineSelected)}
					title="个人中心"
					key="mine"
					dot
					selected={selectedTab === 'mine'}
					onPress={() => {
						setSelectTab('mine')
						getActivityInfo(3)
					}}
				>
					{renderMine()}
				</TabBar.Item>

			</TabBar>
			<ActivityIndicator
				toast
				text="加载中..."
				animating={loading}
			/>
		</div >
	);
}

export default homePage;