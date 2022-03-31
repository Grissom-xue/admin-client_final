import React, {Component} from 'react';
import {
    Card ,
    Button,
    Icon,
    Table
} from 'antd';

export default class Category extends Component {
    render() {
        const title = '总分类'
        const extra =(
            <Button type='primary'>
                <Icon type='plus'/>
                <span>添加商品</span>
            </Button>
        )
        return (
            <Card title={title} extra={extra} style={{ width: '100%' }}>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
            </Card>
        );
    }
}