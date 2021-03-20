import React from 'react'
import styles from './style.module.css'
import { useEffect, useState } from 'react';
import Api from '../../lib/api';
import _ from "lodash"
import { Toast, ActivityIndicator } from 'antd-mobile';
import { formatToDate } from '../../utils/formatHelper';

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
        3: "取消"
    }

    return <div className={styles.historyPage}>
        {_.map(historyData, item => {
            return <div className={styles.itemList} key={item.create_time}>
                <span>{_.get(STATUS, item.status) || "-"}</span>
                <span>{item.amount}元</span>
                <span className={styles.time}>{formatToDate(item.create_time)}</span>
            </div>
        })}
        <ActivityIndicator animating={loading} text="正在提现中..." />

    </div>
}