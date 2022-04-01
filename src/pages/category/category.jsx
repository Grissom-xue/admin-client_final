import React, {Component} from 'react';
import {
    Card,
    Button,
    Icon,
    Table, message, Modal
} from 'antd';
import LinkButton from "../../conponents/link-button/link-button";
import {reqAddCategory,reqUpdateCategory,reqCategories} from "../../api";
import AddForm from "./add-form";
import UpdateForm from "./update-form";


export default class Category extends Component {
    state = {
        loading:false,// 是否正在获取数据中
        categories: [],
        subCategories:[],
        parentId: '0',
        parentName:[],
        showStatus: 0 //控制确认框是否显示  0都不显示 1显示添加  2显示更新
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
                //render 方法中的category 包含了当前一整行的数据内容
                render: (category) => ( //返回需要显示的界面标签
                    <span>
                        <LinkButton onClick={() => {
                            this.showUpdateCategoryModal(category)
                        }}>修改分类</LinkButton>
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
    // 获取一级分类列表
    getCategory = async (parentId) => {
        // 在接口发起请求之前保持loading的状态
        this.setState({loading:true})
        // 获取parentID，根据parentID去请求一级和二级的分类列表. 如果传入了parentID则用自己传入的。 没有的话用state中保存的
        parentId = parentId || this.state.parentId
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
    // 显示一级分类列表
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
    // 显示二级分类列表
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
    // 显示新增品类的输入确认框
    showAddCategoryModal =() => {this.setState({showStatus:1})}
    // 添加新的品类
    addCategory = async () => {
        const {parentId,categoryName}= this.form.getFieldsValue()
        // 清除输入数据，不然数据有了缓存 修改一次后 修改下一次会把缓存数据带进去
        this.form.resetFields()
        // 确认框中添加数据 然后从添加的数据中获取数据
        const result = await reqAddCategory(categoryName,parentId)
        if (result.status===0){
            if (parentId===this.state.parentId){
                // 重新获取当前分类列表
                this.getCategory()
            }else if (parentId==='0'){//在二级分类列表下添加一级分类，重新获取一级分类列表，但是不需要显示一级列表
                this.getCategory('0')
            }
            // 关闭弹窗
            this.setState({showStatus:0})
        }else {

        }



    }
    // 显示输入品类的输入确认框
    showUpdateCategoryModal = (category) => {
        // category中传入了整行的数据包括 name,id 将该值放到this全局中去方便其他方法取用
        this.category = category
        this.setState({showStatus:2})
    }
    // 更新品类的信息
    updateCategory =  () => {
        // 进行表单验证
        this.form.validateFields(async (err,values) => {
            if (!err){
                // 获取原始的categoryID 与新的categoryName
                const id = this.category._id
                // name的值要从UpdateForm组件的input中获取。 因为是从高UpdateForm组件获取的 我们可以从该组件的this.form对象中获取
                // 所以我们要从子组件里将form对象中丢给父组件
                const name = this.form.getFieldValue('categoryName')

                // 清除输入数据，不然数据有了缓存 修改一次后 修改下一次会把缓存数据带进去
                this.form.resetFields()

                //发送请求
                const result = await reqUpdateCategory(id,name)
                console.log('result')
                console.log(result)
                if (result.status===0){
                    // 关闭弹窗
                    this.setState({showStatus:0})
                    // 重新显示列表
                    this.getCategory()
                }else {
                    message.error('更新数据失败请重试')
                }
            }else {
                message.error('表单数据校验未通过')
            }
        })



    }
    // 确认框点击取消的时候 将该确认框给隐藏掉
    handleCancel =() => {
        this.form.resetFields()
        this.setState({showStatus:0})
    }
    componentWillMount() {
        // 表格的形式只要挂在的时候处理一次就行。不要放在render里面。减少不必要的刷新
        this.initColumns()
    }
    componentDidMount() {
        this.getCategory()
    }

    render() {
        const {categories,subCategories,parentId,parentName,showStatus} = this.state
        // render 第一次进来的时候 this.category的值没有. 如果还没有则先给个空对象，下一次render的时候就会有值
        const {name} =  this.category || {}
        const title = parentId === '0'?'一级分类目录':(
            <span>
                <LinkButton onClick={this.showCategory}>一级分类列表</LinkButton>
                <Icon type='arrow-right'/>
                {parentName}
            </span>
        )
        const extra =(
            <Button type='primary' onClick={this.showAddCategoryModal}>
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
                />
                <Modal
                    title="添加分类"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm
                        categories={categories}
                        parentId={parentId}
                        setForm = {(form) => {this.form=form}}
                    />
                </Modal>
                <Modal
                    title="更新分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    {/*
                        点击更新分类之后弹出的空白输入框，应该有个默认展示之前的原本的类型名称，所以我们要给UpdateForm组件传入默认显示的值

                        render方法中我们可以获取到category对象 然后传给this.category 做全局的保存

                        从全局中获取出来将值传给UpdateForm组件

                    */}
                    <UpdateForm
                        categoryName = {name}
                        setForm = {(form) => {this.form=form}}
                    />
                </Modal>
            </Card>
        );
    }
}