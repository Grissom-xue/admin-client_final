import React, {Component} from 'react';
import {
    Card,
    Button,
    Icon,
    Table, message
} from 'antd';
import LinkButton from "../../conponents/link-button/link-button";
import {reqAddCategory,reqUpdateCategory,reqCategories} from "../../api";


export default class Category extends Component {
    state = {
        loading:false,// 是否正在获取数据中
        categories: [],
        subCategories:[],
        parentId: '0',
        parentName:[]
    }
    updateCategory = () => {
        console.log('修改分类')
    }
    showSubCategory =(category) => {
        /**
         * 1. 因为需要请求二级分类列表，此时需要获得当前行的分类的_id 将此ID设置到parentID中去
         * 2. 然后因为在二级分类列表中要显示出来父类的title值，所以title也要拿到
         * 3. 调用getCategory()方法发起请求,然后返回数据subCategories
         * 4. 将table中的数据datasource属性 更改为subCategories
         *
         * render方法中自带了参数，这个将一行封装成一个对象category
         */

        // 这里有个坑 setState 是一个异步设置状态
        this.setState({
            parentId:category._id,
            parentName:category.name
        },() => {
            //状态更新且重新render后执行
            this.getCategory()
        } )


    }
    showCategory = () => {
        this.setState({
            parentId:"0",
            parentName:[],
            subCategories:[]
        },() => {
            //状态更新且重新render后执行
            this.getCategory()
        } )
    }
    // 初始化表格的列
    initColumns = () => {
        this.columns = [
            {
                title: '类别',
                dataIndex: 'name', // 指定需要显示的标签的属性名
                key: 'name',
            },
            {
                title: '操作',
                width: 300,
                render: (category) => ( //返回需要显示的界面标签
                    <span>
                        <LinkButton onClick={this.updateCategory}>修改分类</LinkButton>
                        {/*
                            如何向事件回调函数传递参数：
                            1. 先定义一个匿名函数
                            2. 在匿名函数的方法体里 调用回调函数并传递值
                        */}
                        {
                            this.state.parentId === "0" ? <LinkButton onClick={() => this.showSubCategory(category)}>查看子分类</LinkButton> : null
                        }
                    </span>
                )
            },
        ];
    }
    getCategory = async () => {
        // 在接口发起请求之前保持loading的状态
        this.setState({loading:true})
        // 获取parentID，根据parentID去请求一级和二级的分类列表
        const {parentId}= this.state
        const result = await reqCategories(parentId)
        if (result.status === 0){
            const categories = result.data
            /**
             * 1. 先判断是一级分类列表还是二级分类列表，根据不同的分类列表做不同处理
             * 2. 将返回的分类列表装到state中指定的属性中去
             * 3. 因为数据已经返回成，此时将loading的状态设置为false 取消loading的状态
             */
            if (parentId === '0'){
                this.setState({loading:false,categories})
            }else {
                this.setState({loading:false,subCategories:categories})
            }
        }else {
            message.error('获取分类列表失败！！！')
        }
    }
    addCategory = async () => {
        // await reqAddCategory()
        // 应该需要一个弹窗来填数据 获取弹窗中的数据 再进行添加商品
    }
    componentWillMount() {
        // 表格的形式只要挂在的时候处理一次就行。不要放在render里面。减少不必要的刷新
        this.initColumns()
    }
    componentDidMount() {
        this.getCategory()
    }

    render() {
        const {categories,subCategories,parentId,parentName} = this.state
        const title = parentId === '0'?'一级分类目录':(
            <span>
                <LinkButton onClick={this.showCategory}>一级分类列表</LinkButton>
                <Icon type='arrow-right'/>
                二级分类列表
            </span>
        )
        const extra =(
            <Button type='primary' onClick={this.addCategory}>
                <Icon type='plus'/>
                <span>添加商品</span>
            </Button>)
        return (
            <Card title={title} extra={extra} style={{ width: '100%' }}>
                <Table
                    dataSource={parentId === "0" ? categories:subCategories}
                    columns={this.columns}
                    bordered={true}
                    rowKey='_id'
                    loading={this.state.loading}
                    pagination={{
                        defaultPageSize: 5 ,
                        showQuickJumper: true
                    }}
                />;
            </Card>
        );
    }
}