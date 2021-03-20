import React, { useEffect, useState } from "react"
import _ from 'lodash'
import styles from './style.module.css'
import { getStorageByKey, STORAGE_TYPES } from "../../utils/localStorageHelper"
import zfbImg from '../../assets/icons/zfb.png'
import classnames from 'classnames'
import Api from "../../lib/api"
import { Toast, ActivityIndicator, Button } from "antd-mobile"
import history from "../../utils/history-helper"

export const withdrawalPage = () => {
    const [seletedTag, setSelectedTag] = useState<number>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const userInfo = getStorageByKey("userInfo", STORAGE_TYPES.OBJECT);
    const ali_account = _.get(userInfo, 'ali_account');
    const withdrawal_amount: number = _.get(userInfo, "withdrawal_amount");
    useEffect(() => {
        document.title = '提现';
    })

    const onSubmit = () => {
        if (!_.isNumber(seletedTag)) {
            Toast.fail("请选择提现金额");
            return;
        }
        setIsSubmitting(true);
        Api.post("/wechat/withdraw-balance", { amount: seletedTag, type: 2 })
            .then(({ data }) => {
                console.log("res==", data)
                if (_.get(data, 'code') === 0) {
                    Toast.success("提现成功", 1, () => {
                        history.push("withdrawalHistroy")
                    })
                } else {
                    Toast.fail(_.get(data, 'msg') || "提现失败")
                }

            }).catch(error => {
                console.log("error==", error)
            }).finally(() => {
                setIsSubmitting(false)
            })
    }

    const onClickTag = (tag: number) => () => {
        if (withdrawal_amount >= tag) {
            setSelectedTag(tag)
        } else {
            Toast.info("提现金额大于可提现金额")
        }
    }

    const renderTags = () => {
        return _.map([1, 2, 5, 10], item => {
            return <div key={item} onClick={onClickTag(item)}
                className={classnames(styles.tag, seletedTag === item && styles.selected)}>
                {item}元</div>
        })
    }

    return <div className={styles.withdrawal}>
        <div className={styles.cardContainer}>
            <div className={styles.top}>
                <span className={styles.cardTitle}>可提现金额（元）</span>
                <div onClick={() => { history.push("withdrawalHistroy") }}>提现记录</div>
            </div>
            <p className={styles.money}>{_.get(userInfo, 'withdrawal_amount') || 0}</p>
        </div>
        <div className={styles.cardContainer}>
            <p className={styles.cardTitle}>提现方式</p>
            <div className={styles.applyContent}>
                <div className={classnames(styles.zfb, styles.selected)}>
                    <img src={zfbImg} />
                    <span>支付宝</span>
                </div>
            </div>
            <div className={styles.bottomTip}>
                <div>
                    <span>支付宝账号：</span>
                    <span className={styles.account}>{ali_account || "未绑定"}</span>
                </div>
                <span className={styles.accountBtn}>{ali_account ? "更改" : "绑定账号"}</span>
            </div>
        </div>
        <div className={classnames(styles.cardContainer, styles.tagContent)}>
            <p className={styles.moneyTitle}>提现金额</p>
            <div className={styles.tagBox}>{renderTags()}</div>
        </div>
        <div className={styles.fixedBox}>
            <Button onClick={_.debounce(onSubmit, 200)} disabled={withdrawal_amount < 1} className={styles.withdrawalBtn}>提现</Button>
        </div>
        <ActivityIndicator animating={isSubmitting} text="正在提现中..." />
    </div>
}