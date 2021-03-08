import classnames from "classnames";
import _ from "lodash";
import React from "react";
import styles from "./style.module.css";

const OrderDetailPage = (props: any) => {
  const data = props.location.state.state;
  return (
    <div className={styles.detailPage}>
      <div className={styles.pageTitle}>订单详情</div>
      <div className={classnames(styles.itemBox, styles.imgBox)}>
        <div
          className={classnames(
            styles.itemType,
            _.get(data, "platform_type") === 2 && styles.eleType
          )}
        />
        <div className={styles.title}>{_.get(data, "sms_title")}</div>
      </div>
      <div className={styles.itemBox}>
        <span>订单号</span>
        <span>{_.get(data, "order_sn")}</span>
      </div>
      <div className={styles.itemBox}>
        <span>商城</span>
        <span> {_.get(data, "platform_type") === 1 ? "美团" : "饿了么"}</span>
      </div>
      <div className={styles.itemBox}>
        <span>成交额</span>
        <span>{_.get(data, "direct")}元</span>
      </div>
    </div>
  );
};
export default OrderDetailPage;
