import React from 'react';
import { LeftOutlined } from '@ant-design/icons';
import { history } from 'umi';
import './index.less';

interface BackButtonProps {
  to: string;
  text?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ to, text = '返回上一页' }) => {
  return (
    <div
      className="back-button"
      onClick={() => history.push(to)}
    >
      <LeftOutlined className="back-icon" />
      <span>{text}</span>
    </div>
  );
};

export default BackButton;
