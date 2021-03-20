import React, { useState, useEffect } from 'react'
import styles from './style.module.css'
import Api from '../../lib/api'
import { Toast, InputItem, ActivityIndicator } from 'antd-mobile'
import _ from 'lodash'
import { getStorageByKey, STORAGE_TYPES } from '../../utils/localStorageHelper'

export const AccoutInfoPage = () => {
    const [account, setAccount] = useState<string>("");
    const [name, setAame] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [phone, setPhone] = useState<string>();

    useEffect(() => {
        document.title = '提现信息';
        const userInfo = getStorageByKey("userInfo", STORAGE_TYPES.OBJECT);
        const ali_account = _.get(userInfo, 'ali_account');
        setAccount(ali_account);
        setAame(_.get(userInfo, 'ali_user_name'))
        setPhone(_.get(userInfo, 'phone'))
    }, [])

    const submitData = () => {
        if (_.isEmpty(account) || _.isEmpty(name)) {
            Toast.info("请填写支付宝账号和姓名");
            return;
        }
        setIsSubmitting(true);
        Api.post("/wechat/user-info-save", {
            ali_account: account,
            ali_user_name: name,
            phone: phone
        })
            .then(({ data }) => {
                console.log('===data', data);
                if (data.code === 0) {
                    Toast.success("修改成功")
                } else {
                    Toast.fail(data.msg || "修改失败")
                }
            }).catch(error => {
                console.log("===error", error);
            }).finally(() => {
                setIsSubmitting(false)
            })
    }

    return <div className={styles.accountPage}>
        <div className={styles.tip}>为了避免影响提现，支付宝和支付宝姓名要一致</div>
        <div className={styles.mainContent}>
            <div>
                <p>您的支付宝账号</p>
                <InputItem className={styles.input} value={account} onChange={val => setAccount(val)} placeholder="请输入您的支付宝账号" />
            </div>
            <div>
                <p>支付宝姓名</p>
                <InputItem className={styles.input} value={name} onChange={val => setAame(val)} placeholder="请输入真实姓名" />
            </div>
            <div>
                <p>手机号</p>
                <InputItem className={styles.input} value={phone} onChange={val => setPhone(val)} placeholder="请输入手机号" />
            </div>
        </div>
        <div className={styles.fixedBox}>
            <div onClick={_.debounce(submitData, 200)}>保存</div>
        </div>
        <ActivityIndicator toast animating={isSubmitting} text="正在提现中..." />

    </div>
}