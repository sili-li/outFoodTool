import React, { useState, useEffect } from 'react'
import { TabBar } from 'antd-mobile';
import meituanBg from '../../assets/images/meituanBg.png'
import _ from 'lodash'
import qs from 'qs'
import styles from './homePage.module.css'
import Api from '../../lib/api';

const homePage = () => {
	const [selectedTab, setSelectTab] = useState<string>('meituan');
	const [userInfo, setUserInfo] = useState();
	const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true });
	const token = _.get(queryParams, 'token');

	useEffect(() => {
		if (_.isEmpty(token)) {
			Api.get('/wechat/index').then((res: any) => {
				//
				console.log("====", res)
			}).catch((error: any) => {
				console.log("=====no error", error)
			})
			// window.open('http://api.wm.yuejuwenhua.com/wechat/index')
		} else {
			///wechat/index?token=035c94156320d656250e32aef241febf
			Api.get(`/wechat/index?token=${token}`).then((res: any) => {
				console.log("res==", res)
				if (_.get(res, 'data.code') === 0) {
					const data = _.get(res, 'data.data.info')
					setUserInfo(data || {})
				}
			}).catch((error: any) => {
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


	return (
		<div style={{ position: 'fixed', height: '100%', width: '100%', top: 0 }}>
			<TabBar
				unselectedTintColor="#949494"
				tintColor="#33A3F4"
				barTintColor="white"
			>
				<TabBar.Item
					title="饿了么"
					key="ele"
					icon={
						<div style={{
							width: '22px',
							height: '22px',
							background: 'url(https://gw.alipayobjects.com/zos/rmsportal/BTSsmHkPsQSPTktcXyTV.svg) center center /  21px 21px no-repeat'
						}}
						/>
					}
					selectedIcon={
						<div style={{
							width: '22px',
							height: '22px',
							background: 'url(https://gw.alipayobjects.com/zos/rmsportal/ekLecvKBnRazVLXbWOnE.svg) center center /  21px 21px no-repeat'
						}}
						/>
					}
					selected={selectedTab === 'ele'}
					onPress={() => {
						setSelectTab('ele')
					}}
					data-seed="logId"
				>
					<div>饿了吗</div>
				</TabBar.Item>
				<TabBar.Item

					icon={
						<div style={{
							width: '22px',
							height: '22px',
							background: 'url(https://gw.alipayobjects.com/zos/rmsportal/BTSsmHkPsQSPTktcXyTV.svg) center center /  21px 21px no-repeat'
						}}
						/>
					}
					selectedIcon={
						<div style={{
							width: '22px',
							height: '22px',
							background: 'url(https://gw.alipayobjects.com/zos/rmsportal/ekLecvKBnRazVLXbWOnE.svg) center center /  21px 21px no-repeat'
						}}
						/>
					}
					title="美团"
					key="meituan"
					selected={selectedTab === 'meituan'}
					onPress={() => {
						setSelectTab('meituan')
					}}
					data-seed="logId1"
				>
					<div className={styles.meiContent}>
						<img className={styles.meiBg} src={meituanBg} alt='' />
						<a href={_.get(userInfo, 'url')} className={styles.meiBtn} type="primary">领红包点外卖</a>
						<a href={_.get(userInfo, 'short_link')} className={styles.meiBtn}>分享链接赚钱</a>
						<a href={_.get(userInfo, 'qrcode_url')} className={styles.meiBtn}>分享海报赚钱</a>
					</div>
				</TabBar.Item>
				<TabBar.Item
					icon={
						<div style={{
							width: '22px',
							height: '22px',
							background: 'url(https://zos.alipayobjects.com/rmsportal/psUFoAMjkCcjqtUCNPxB.svg) center center /  21px 21px no-repeat'
						}}
						/>
					}
					selectedIcon={
						<div style={{
							width: '22px',
							height: '22px',
							background: 'url(https://zos.alipayobjects.com/rmsportal/IIRLrXXrFAhXVdhMWgUI.svg) center center /  21px 21px no-repeat'
						}}
						/>
					}
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
		</div>
	);
}

export default homePage;