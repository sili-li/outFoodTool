import { DatePicker, List } from 'antd-mobile';
import React from 'react';

const ExamplePage = () => {
  return (
    <div>
      hello world!
      <DatePicker
        mode="date"
        title="请选择"
        maxDate={new Date(2018, 11, 3, 22, 0)}
        minDate={new Date(2015, 7, 6, 8, 30)}
      >
        <List.Item arrow="horizontal">datePicker</List.Item>
      </DatePicker>
    </div>
  );
};

export default ExamplePage;
