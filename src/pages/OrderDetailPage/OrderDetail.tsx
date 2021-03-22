import classnames from 'classnames';
import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import styles from './style.module.css';
import Api from '../../lib/api';
import qs from 'qs'
import history from '../../utils/history-helper';
import { ActivityIndicator } from 'antd-mobile';

const OrderDetailPage = () => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = "订单详情";
        const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true });
        setLoading(true)
        Api.post('/wechat/order-detail', { order_id: _.get(queryParams, 'id') })
            .then(({ data }) => {
                console.log('===data', data)
                setData(_.get(data, 'data.items') || {});
            }).catch(error => {
                console.log("===error", error)
            }).finally(() => {
                setLoading(false)
            })
    }, [])

    return (
        <div className={styles.detailPage}>
            <div className={styles.pageTitle}>订单详情</div>
            <div className={classnames(styles.itemBox, styles.imgBox)}>
                <div
                    className={classnames(
                        styles.itemType,
                        _.get(data, 'platform_type') === 2 && styles.eleType
                    )}
                />
                <div className={styles.title}>{_.get(data, 'sms_title')}</div>
            </div>
            <div className={styles.itemBox}>
                <span>订单号</span>
                <span>{_.get(data, 'order_sn')}</span>
            </div>
            <div className={styles.itemBox}>
                <span>商城</span>
                <span> {_.get(data, 'platform_type') === 1 ? '美团' : '饿了么'}</span>
            </div>
            <div className={styles.itemBox}>
                <span>成交额</span>
                <span>{_.get(data, 'direct')}元</span>
            </div>
            <div className={classnames(styles.itemBox, styles.btnBox)}>
                <p><span className={styles.amount}>{_.get(data, 'use_earn')}</span>元</p>
                <div onClick={() => history.push('withdrawal')}>立即提现</div>
            </div>
            <ActivityIndicator toast animating={loading} text="正在提现中..." />

        </div>
    );
};
export default OrderDetailPage;
