import React, { useEffect, useState } from "react"
import _ from 'lodash'
import styles from './style.module.css'
import { setStorage } from "../../utils/localStorageHelper"
import zfbImg from '../../assets/icons/zfb.png'
import classnames from 'classnames'
import Api from "../../lib/api"
import { Toast, ActivityIndicator, Button } from "antd-mobile"
import history from "../../utils/history-helper"

interface IUserType {
    ali_account: string;
    ali_user_name: string;
    avatar: string;
    balance: string;
    cash_amount: string;
    id: number;
    nickname: string;
    phone: string;
    register_time: string;
    withdrawal_amount: number;
}

export const withdrawalPage = () => {
    const [seletedTag, setSelectedTag] = useState<number>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userInfo, setUserInfo] = useState<IUserType>();
    // const userInfo = getStorageByKey("userInfo", STORAGE_TYPES.OBJECT);
    // const ali_account = _.get(userInfo, 'ali_account');
    // const balance: number = _.get(userInfo, "balance");
    useEffect(() => {
        document.title = '提现';
        getUserInfo();
    }, [])

    const getUserInfo = () => {
        Api.post('/wechat/get-user-info', {})
            .then(({ data }) => {
                if (data.code === 0) {
                    const userData: IUserType = _.get(data, 'data.user_info') || {}
                    setUserInfo(userData)
                    setStorage("userInfo", JSON.stringify(userData));

                }
            })
    }

    const onSubmit = () => {
        if (!_.isNumber(seletedTag)) {
            Toast.fail("请选择提现金额");
            return;
        }
        if (_.isEmpty(_.get(userInfo, 'ali_account'))) {
            Toast.fail("请绑定账号");
            return;
        }
        setIsSubmitting(true);
        Api.post("/wechat/withdraw-balance", { amount: seletedTag, type: 2 })
            .then(({ data }) => {
                if (_.get(data, 'code') === 0) {
                    getUserInfo();
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

    const userBalance = () => _.toNumber(_.get(userInfo, 'balance', 0))

    const onClickTag = (tag: number) => () => {
        setSelectedTag(tag)
        if (userBalance() >= tag) {
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
            <p className={styles.money}>{userBalance() || 0}</p>
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
                    <span className={styles.account}>{_.get(userInfo, 'ali_account') || "未绑定"}</span>
                </div>
                <span onClick={() => history.push("accountInfo")} className={styles.accountBtn}>{_.get(userInfo, 'ali_account') ? "更改" : "绑定账号"}</span>
            </div>
        </div>
        <div className={classnames(styles.cardContainer, styles.tagContent)}>
            <p className={styles.moneyTitle}>提现金额</p>
            <div className={styles.tagBox}>{renderTags()}</div>
        </div>
        <div className={styles.fixedBox}>
            <Button onClick={_.debounce(onSubmit, 200)} disabled={userBalance() < 1} className={styles.withdrawalBtn}>提现</Button>
        </div>
        <ActivityIndicator toast animating={isSubmitting} text="正在提现中..." />
    </div>
}