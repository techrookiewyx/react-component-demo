import React from 'react';
import './index.less';

export default function ComponentDemo(props: any) {
  const { title } = props;
  return (
    <div>
      {title && <h3 className="wyx-title">{title}</h3>}
      Demo1
    </div>
  );
}
