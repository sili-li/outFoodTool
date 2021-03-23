import React from 'react'
import styles from './style.module.css'
import { useEffect, useState } from 'react';
import Api from '../../lib/api';
import _ from "lodash"
import { Toast, ActivityIndicator } from 'antd-mobile';
import { formatToDate } from '../../utils/formatHelper';
import emptyImg from '../../assets/images/empty.png';
import classnames from 'classnames'

export const WithdrawalHistoryPage = () => {
    const [loading, setLoading] = useState(false);
    const [historyData, setHistoryData] = useState<any[]>([])

    useEffect(() => {
        document.title = '提现记录';
        getData();
    }, [])

    const getData = () => {
        setLoading(true);
        Api.post("/wechat/get-withdraw-log", {})
            .then(({ data }) => {
                if (data.code === 0 && data.data) {
                    setHistoryData(_.get(data, 'data.items') || []);
                } else {
                    Toast.fail(data.msg || "获取提现记录失败")
                }
            }).catch(error => {
                console.log("===error", error)
            }).finally(() => {
                setLoading(false)
            })
    }

    const STATUS = {
        1: "已到账",
        2: "待审核",
        3: "取消返还"
    }

    const renderContent = () => {
        if (!loading && _.isEmpty(historyData)) {
            return (
                <div className={styles.empty}>
                    <img src={emptyImg} />
                    <p>暂无数据</p>
                </div>
            );
        } else {
            return _.map(historyData, item => {
                return <div className={styles.itemList} key={item.create_time}>
                    <div >
                        <span className={classnames(
                            item.status === 3 && styles.color3,
                            item.status === 1 && styles.color1,
                            item.status === 2 && styles.color2)}>
                            {_.get(STATUS, item.status) || "-"}<br />
                        </span>
                        <span>{item.amount}元</span>
                        <span className={styles.time}>{formatToDate(item.create_time)}</span>
                    </div>
                    {item.status === 3 && <span className={styles.msg}>{item.msg}</span>}
                </div>
            })
        }
    }

    return <div className={styles.historyPage}>
        {renderContent()}
        <ActivityIndicator toast animating={loading} text="正在提现中..." />
    </div>
}