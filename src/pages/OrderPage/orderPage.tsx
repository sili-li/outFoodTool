import { ActivityIndicator, Tabs, Toast } from 'antd-mobile';
import classnames from 'classnames';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import emptyImg from '../../assets/images/empty.png';
import Api from '../../lib/api';
// import history from '../../utils/history-helper';
import styles from './style.module.css';
import { formatTime } from '../../utils/formatHelper';
import history from '../../utils/history-helper';

const tabs = [
    { title: '全部', key: '0' },
    { title: '即将到账', key: '1' },
    { title: '已到账', key: '3' },
    { title: '失效订单', key: '2' },
];
const OrderPage = () => {
    const [orderData, setOrderData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = '订单中心';
        getOrder(0);
    }, []);

    const getOrder = (status: number) => {
        setLoading(true);
        Api.post('/wechat/get-order-list', { page: 1, limit: 100, status })
            .then((res: any) => {
                if (_.get(res, 'data.code') === 0) {
                    setOrderData(_.get(res, 'data.data.items'));
                }
            })
            .catch(() => {
                Toast.fail('加载失败');
            })
            .finally(() => {
                setLoading(false);
            });
    };
    // 订单状态：1即将到账，2订单失效，100系统结算
    const getOrderStatus = (status: any, time?: boolean) => {
        status = _.toString(status);
        switch (status) {
            case '1':
                return '即将到账';
            case '2':
                return '订单失效';
            case '100':
                return time ? "到账时间" : '已到账';
            default:
                return ' ';
        }
    };

    const renderItems = () => {
        return _.map(orderData, (item) => {
            return (
                <div onClick={() => history.push(`orderDetail?id=${_.get(item, 'id')}`)} className={styles.itemContianer} key={_.get(item, 'id')}>
                    <div className={styles.itemCard}>
                        <div
                            className={classnames(
                                styles.itemType,
                                _.get(item, 'platform_type') === 2 && styles.eleType
                            )}
                        />
                        <div className={styles.rightItem}>
                            <div className={styles.title}>
                                {' '}
                【{_.get(item, 'platform_type') === 1 ? '美团' : '饿了么'}】
                {_.get(item, 'sms_title')}
                            </div>
                            <div className={styles.subInfo}>
                                实付金额：{_.get(item, 'direct')}
                            </div>
                            <div className={styles.subInfo}>
                                下单时间：
                                {formatTime(_.get(item, 'order_time'))}
                            </div>

                            <div className={styles.subInfo}>
                                订单编号：{_.get(item, 'order_sn')}
                            </div>
                        </div>
                    </div>
                    <div className={styles.bottom}>
                        <div className={styles.left}>
                            <span>{getOrderStatus(_.get(item, 'status'))}：</span>
                            <span className={styles.money}>{_.get(item, 'use_earn')}</span>
                            {_.get(item, 'status') !== 1 && <div>
                                {getOrderStatus(_.get(item, 'status'), true)}：
                                {formatTime(_.get(item, 'update_time'))}

                            </div>
                            }
                        </div>
                        <div
                            className={styles.orderDetail}

                        >
                            {/* 订单详情 */}
                            {/* <span /> */}
                        </div>
                    </div>
                </div>
            );
        });
    };

    const renderTabs = () => {
        if (!loading && _.isEmpty(orderData)) {
            return (
                <div className={styles.empty}>
                    <img src={emptyImg} />
                    <p>暂无数据</p>
                </div>
            );
        } else {
            return renderItems();
        }
    };

    return (
        <div className={styles.orderContainer}>
            <Tabs
                tabs={tabs}
                initialPage={0}
                tabBarActiveTextColor="#ff4301"
                onChange={(tab, index) => {
                    getOrder(_.toNumber(tab.key));
                }}
            >
                <div key="0">{renderTabs()}</div>
                <div key="1">{renderTabs()}</div>
                <div key="3">{renderTabs()}</div>
                <div key="2">{renderTabs()}</div>
            </Tabs>
            <ActivityIndicator toast={true} text="加载中..." animating={loading} />
        </div>
    );
};

export default OrderPage;
