import React, {Component} from 'react';
import {
    Form,
    Select,
    Input
} from 'antd';
import PropTypes from "prop-types";


const Item = Form.Item
const Option = Select.Option

class AddForm extends Component {
    static propTypes = {
        categories: PropTypes.array.isRequired,//一级分类的数据
        parentId: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }

    componentWillMount() {
        this.props.setForm(this.props.form)
    }
    render() {
        const {getFieldDecorator} = this.props.form
        const {categories,parentId} = this.props
        return (
            <Form>
                <Item>
                    {/*initialValue:parentId 当进入一级分类的时候parentId 为0*/}
                    {
                        getFieldDecorator('parentId',{
                            initialValue:parentId
                        })(
                            <Select>
                                <Option value='0'>一级分类</Option>
                                {
                                    categories.map((categoryObj) => {
                                        return (
                                            <Option value={categoryObj._id}>{categoryObj.name}</Option>
                                        )
                                    })
                                }
                            </Select>
                        )
                    }
                </Item>
                <Item>
                    {
                        getFieldDecorator('categoryName',{
                            initialValue: ''
                        })(
                            <Input placeholder='请输入分类名称'/>
                        )
                    }
                </Item>

            </Form>
        );
    }
}

export default Form.create()(AddForm)