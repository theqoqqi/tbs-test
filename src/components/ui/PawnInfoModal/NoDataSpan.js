import React from 'react';

export default function NoDataSpan(props) {
    return <span {...props} style={{color: 'gray'}}>{props.children ?? 'Нет'}</span>;
}