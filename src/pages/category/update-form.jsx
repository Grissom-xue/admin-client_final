import React, {Component} from 'react';
import {
    Form,
    Input
} from 'antd';
import PropTypes from 'prop-types'


const Item = Form.Item

class UpdateForm extends Component {
    // 对接收的数据进行数据校验
    static propTypes = {
        categoryName : PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }
    componentWillMount() {
        this.props.setForm(this.props.form)
    }

    render() {
        const {getFieldDecorator} = this.props.form
        const {categoryName} = this.props
        return (
            <Form>
                <Item>
                    {
                        getFieldDecorator('categoryName',{
                            initialValue: '',
                            rules:[
                                {
                                    required: true,
                                    message: '请输入分类列表名字'
                                }
                            ]
                        })(
                            // 要从input框中获取输入的值
                            <Input placeholder={categoryName}/>
                        )
                    }
                </Item>
            </Form>
        );
    }
}

export default Form.create()(UpdateForm)