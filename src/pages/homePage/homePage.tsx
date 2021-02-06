import React, { useState, useEffect } from 'react'
import { TabBar, Carousel, Toast, ActivityIndicator } from 'antd-mobile';
import _ from 'lodash'
import qs from 'qs'
import classnames from 'classnames'
import styles from './homePage.module.css'
import Api from '../../lib/api';
import meituanBanner from '../../assets/images/mt_bannerjpg.jpg'
import elmBanner from '../../assets/images/elm_banner.png'

const homePage = () => {
	const [selectedTab, setSelectTab] = useState<string>('meituan');
	const [userInfo, setUserInfo] = useState();
	const [eleInfo, setEleInfo] = useState();
	const [mtInfo, setMtInfo] = useState();
	const [loading, setIsLoading] = useState(false);
	const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true });
	const token = _.get(queryParams, 'token');

	useEffect(() => {
		if (_.isEmpty(token)) {
			Api.get('/wechat/login').then((res: any) => {
				if (_.get(res, 'data.code') === 0) {
					const url = _.get(res, 'data.data.url');
					if (!_.isEmpty(url)) {
						window.location.href = url
					}
				}
			}).catch((error: any) => {
				Toast.fail('登录失败')
				console.log("=====no error", error)
			})
			// window.open('http://api.wm.yuejuwenhua.com/wechat/index')
		} else {
			///wechat/index?token=035c94156320d656250e32aef241febf
			Api.get(`/wechat/login?token=${token}`).then((res: any) => {
				if (_.get(res, 'data.code') === 0) {
					const data = _.get(res, 'data.data.info')
					setUserInfo(data || {})
					getActivityInfo(1);
				}
			}).catch((error: any) => {
				Toast.fail('获取信息失败')
				console.log("error===", error)
			})
		}
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
		//2 饿了么
		setIsLoading(true)
		Api.post('/wechat/getActivityInfo', {
			type, token: '8dae0bbb4f2819b5bf169bf6babce304'
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
						{/* {!_.isEmpty(eleInfo) && <>
							<a href={_.get(eleInfo, 'click_url')} className={classnames(styles.meiBtn, styles.eleBtn)} type="primary">领红包点外卖</a>
							<a href={_.get(eleInfo, 'e_short_link')} className={classnames(styles.meiBtn, styles.eleBtn)}>分享链接赚钱</a>
							<a href={_.get(eleInfo, 'e_qrcode_url')} className={classnames(styles.meiBtn, styles.eleBtn)}>分享海报赚钱</a>
						</>} */}
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
					<div className={styles.meiContent}>
						{renderBanner()}
						<div className={styles.contentBox}>
							<img className={styles.meiBg} src={meituanBanner} alt='' />
							<div className={styles.getBox}>
								<p>美团外卖天天领券</p>
								{!_.isEmpty(mtInfo) && <a href={_.get(mtInfo, 'click_url')}>立即领取</a>}
							</div>
						</div>
						{!_.isEmpty(mtInfo) && <img className={styles.qrCode} src={_.get(mtInfo, 'wx_mini_qrcode_url')} />}
						{/* {!_.isEmpty(mtInfo) && <>
							<a href={_.get(mtInfo, 'click_url')} className={styles.meiBtn} type="primary">领红包点外卖</a>
							<a href={_.get(mtInfo, 'm_short_link')} className={styles.meiBtn}>分享链接赚钱</a>
							<a href={_.get(mtInfo, 'm_qrcode_url')} className={styles.meiBtn}>分享海报赚钱</a>
						</>
						} */}
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