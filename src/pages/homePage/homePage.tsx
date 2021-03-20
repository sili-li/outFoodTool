import { ActivityIndicator, TabBar, Toast } from 'antd-mobile';
// import qs from 'qs'
import classnames from 'classnames';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import eleTopImg from '../../assets/images/e_top.png';
import meiTopImg from '../../assets/images/meiTop.png';
import qs from 'qs'
import styles from './homePage.module.css'
import Api from '../../lib/api';
import history from '../../utils/history-helper';
import { setStorage } from '../../utils/localStorageHelper';
const TAB_CONFIG = {
	MEI_TUAN: 'mt',
	ELE_M: "elm",
	MINE: "user"
}
// const signUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0dc05810f1191cd5&response_type=code&scope=snsapi_userinfo&state=94dab25593d3fffeb4d60934c3b0c502&connect_redirect=1#wechat_redirect"
const homePage = () => {
	const [selectedTab, setSelectTab] = useState<string>();
	const [userInfo, setUserInfo] = useState();
	const [eleInfo, setEleInfo] = useState();
	const [mtInfo, setMtInfo] = useState();
	const [token, setToken] = useState("13f7a5a0221f4a984ad30eeda54b3f07");
	const [loading, setIsLoading] = useState(false);

	// const state = _.get(queryParams, 'state');
	// const pid = _.get(queryParams, 'pid') || "";
	const onChangeTab = (tab: string) => {
		setSelectTab(tab)
		setStorage("tab", tab);
	}
	//待删
	localStorage.setItem('token', '13f7a5a0221f4a984ad30eeda54b3f07')
	useEffect(() => {
		const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true });
		const code = _.get(queryParams, 'code') || "";
		const tab = _.get(queryParams, 'tab') || localStorage.getItem('tab');
		onChangeTab(tab || TAB_CONFIG.MEI_TUAN);
		Api.get(`/wechat/login?code=${code}`).then((res: any) => {
			// 未授权
			if (_.get(res, 'data.code') === 1000) {
				// window.location.href = _.get(res, 'data.data.oauth_url')
			} else if (_.get(res, 'data.code') === 0) {
				setToken(_.get(res, 'data.data.token'));
				setStorage('token', _.get(res, 'data.data.token'))
				getActivityInfo(tab);
			}
		}).catch((error: any) => {
			Toast.fail('登录失败')
			console.log("=====no error", error)
		})
	}, [])

	const renderMine = () => {
		return (
			<div className={styles.mineBg}>
				<div className={styles.imgBox}>
					<img src={_.get(userInfo, 'avatar')} />
					<span>{_.get(userInfo, 'nickname')}</span>
				</div>
				<div className={styles.cardBox}>
					<div onClick={() => { history.push("withdrawal") }} className={styles.cardTitle}>
						我的返利<span>立即提现</span>
					</div>
					<div className={styles.cardContent}>
						<div className={styles.cardItem}>
							<span>当前余额(元)</span>
							<span>{_.get(userInfo, 'balance') || '-'}</span>
						</div>
						<div className={styles.cardItem}>
							<span>即将到账(元)</span>
							<span>{_.get(userInfo, 'withdrawal_amount') || '-'}</span>
						</div>
						<div className={styles.cardItem}>
							<span>累计到账(元)</span>
							<span>{_.get(userInfo, 'cash_amount') || '-'}</span>
						</div>
					</div>
				</div>
				<div className={styles.cardBox}>
					<div
						className={styles.cardTitle}
						onClick={() => history.push('order')}
					>
						我的订单<span>立即查看</span>
					</div>
				</div>
			</div>
		);
	};
	const renderIcon = (styleName: any) => {
		return <div className={classnames(styles.tabIcon, styleName)} />;
	};

	const getSelectedColor = () => {
		switch (selectedTab) {
			case TAB_CONFIG.ELE_M:
				return '#33A3F4';
			case TAB_CONFIG.MEI_TUAN:
				return '#FFC300';
			default:
				return '#f40';
		}
	};

	const getActivityInfo = (tab: string) => {
		// 1 美团
		// 2 饿了么'8dae0bbb4f2819b5bf169bf6babce304'
		setIsLoading(true);
		if (tab === TAB_CONFIG.MINE) {
			Api.post(
				'/wechat/get-user-info',
				{},
				{
					headers: {
						token,
					},
				}
			)
				.then((res: any) => {
					if (_.get(res, 'data.code') === 0) {
						const data = _.get(res, 'data.data.user_info');
						setUserInfo(data || {});
						setStorage("userInfo", JSON.stringify(data));
					}
				})
				.finally(() => {
					setIsLoading(false);
				});
		} else {
			Api.post(
				'/wechat/get-activity-info',
				{
					type: tab === TAB_CONFIG.ELE_M ? 2 : 1
				},
				{
					headers: {
						token,
					},
				}
			)
				.then((res: any) => {
					if (_.get(res, 'data.code') === 0) {
						const data = _.get(res, 'data.data');
						if (tab === TAB_CONFIG.MEI_TUAN) {
							setMtInfo(data);
						} else {
							setEleInfo(data);
						}
					}
				})
				.catch(() => {
					Toast.fail('获取活动失败');
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	};

	return (
		<div style={{ position: 'fixed', height: '100%', width: '100%', top: 0 }}>
			<TabBar
				unselectedTintColor="#949494"
				tintColor={getSelectedColor()}
				barTintColor="white"
			>
				<TabBar.Item
					title="饿了么"
					key={TAB_CONFIG.ELE_M}
					icon={renderIcon(styles.eleIcon)}
					selectedIcon={renderIcon(styles.eleSelected)}
					selected={selectedTab === TAB_CONFIG.ELE_M}
					onPress={() => {
						onChangeTab(TAB_CONFIG.ELE_M);
						_.isEmpty(eleInfo) && getActivityInfo(TAB_CONFIG.ELE_M);
					}}
					data-seed="logId"
				>
					<div
						className={classnames(
							styles.meiContent,
							styles.meiContainer,
							styles.eleContainer
						)}
					>
						<img className={styles.topImg} src={eleTopImg} />
						<div className={styles.cardContainer}>
							<div className={styles.stepBox}>
								<div>
									<span />
									<i>先领券</i>
								</div>
								<div>
									<span className={styles.step2} />
									<i>再下单</i>
								</div>
								<div>
									<span className={styles.step3} />
									<i>拿返利</i>
								</div>
							</div>
							<div className={styles.splitBox}>
								.....................................................................................................................
              </div>
							<div className={styles.qrcodeBox}>
								{!_.isEmpty(eleInfo) && (
									<img
										className={styles.qrCode}
										src={_.get(eleInfo, 'wx_mini_qrcode_url')}
									/>
								)}
							</div>
							<a
								className={styles.getTicketBtn}
								href={_.get(eleInfo, 'click_url')}
							>
								领红包点外卖
              </a>
						</div>
						<div className={styles.btnBox}>
							<a href={_.get(eleInfo, 'short_url')}>分享赚钱</a>
							<CopyToClipboard
								text={`饿了么官方发大招了✌️ \n新出一个加餐红包😘\n多一份选择多省点钱🌹\n说不定运气好还可以白嫖🐮\n${_.get(
									eleInfo,
									'short_url'
								)}`}
								onCopy={() => Toast.info('复制成功')}
							>
								<div className={styles.copyBtn}>复制文案</div>
							</CopyToClipboard>
						</div>
						<div className={styles.tipsBox}>
							<h3>返利注意事项：</h3>
							<p>1.领券下单均有返利，返利按照订单实际支付金额为准；</p>
							<p>
								2.必须使用从本页获得的红包码领券，领券后使用红包下单才有返利；
              </p>
							<p>3.领券后在红包有效期内下单均有返利；</p>
							<p>
								4.无论饿了么新老用户，每个手机号每天可领一次，红包金额随机发放；
              </p>
						</div>
					</div>
				</TabBar.Item>
				<TabBar.Item
					icon={renderIcon(styles.meituanIcon)}
					selectedIcon={renderIcon(styles.meituanSelected)}
					title="美团领券"
					key={TAB_CONFIG.MEI_TUAN}
					selected={selectedTab === TAB_CONFIG.MEI_TUAN}
					onPress={() => {
						onChangeTab(TAB_CONFIG.MEI_TUAN);
						_.isEmpty(mtInfo) && getActivityInfo(TAB_CONFIG.MEI_TUAN);
					}}
					data-seed="logId1"
				>
					<div className={classnames(styles.meiContent, styles.meiContainer)}>
						<img className={styles.topImg} src={meiTopImg} />
						<div className={styles.cardContainer}>
							<div className={styles.stepBox}>
								<div>
									<span />
									<i>先领券</i>
								</div>
								<div>
									<span className={styles.step2} />
									<i>再下单</i>
								</div>
								<div>
									<span className={styles.step3} />
									<i>拿返利</i>
								</div>
							</div>
							<div className={styles.splitBox}>
								.......................................................................................................................
              </div>
							<div className={styles.qrcodeBox}>
								{!_.isEmpty(mtInfo) && (
									<img
										className={styles.qrCode}
										src={_.get(mtInfo, 'wx_mini_qrcode_url')}
									/>
								)}
							</div>
							<a
								className={styles.getTicketBtn}
								href={_.get(mtInfo, 'click_url')}
							>
								领红包点外卖
              </a>
						</div>
						<div className={styles.btnBox}>
							<a href={_.get(mtInfo, 'short_url')}>分享赚钱</a>
							<CopyToClipboard
								text={`【美团外卖福利红包】每日限时抢，最高可得66元！\n${_.get(
									mtInfo,
									'short_url'
								)}`}
								onCopy={() => Toast.info('复制成功')}
							>
								<div className={styles.copyBtn}>复制文案</div>
							</CopyToClipboard>
						</div>
						<div className={styles.tipsBox}>
							<h3>返利注意事项：</h3>
							<p>
								1.美团外卖，必须使用带<i>【专享】</i>标记的优惠券才有返利；
              </p>
							<p>2.领券后在红包有效期内下单均有返利；</p>
							<p>3.美团绑定的手机号，需与领券登录的手机号一致；</p>
							<p>
								4.无论美团新老用户，每个手机号每天可领一次，红包金额随机发放；
              </p>
						</div>
					</div>
				</TabBar.Item>
				<TabBar.Item
					icon={renderIcon(styles.mineIcon)}
					selectedIcon={renderIcon(styles.mineSelected)}
					title="个人中心"
					key={TAB_CONFIG.MINE}
					dot={true}
					selected={selectedTab === TAB_CONFIG.MINE}
					onPress={() => {
						onChangeTab(TAB_CONFIG.MINE);
						getActivityInfo(TAB_CONFIG.MINE);
					}}
				>
					{renderMine()}
				</TabBar.Item>
			</TabBar>
			<ActivityIndicator toast={true} text="加载中..." animating={loading} />
		</div>
	);
};

export default homePage;
