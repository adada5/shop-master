<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <!-- 搜索框区域 -->
      <el-row :gutter="10">
				<el-col :span="6">
					<el-input placeholder="请输入内容"  :clearable="true" v-model="queryInfo.query" @clear="getUserList">
						<el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
					</el-input>
				</el-col>
				<el-col :span="6">
					<el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
				</el-col>
			</el-row>

      <!-- 用户列表区域 -->
      <el-table
        :data="userList"
        style="width: 100%"
        :border="true"
        stripe>
        <el-table-column label="序号" type="index" width="50"></el-table-column>
				<el-table-column label="姓名" prop="username"></el-table-column>
				<el-table-column label="邮箱" prop="email"></el-table-column>
				<el-table-column label="电话" prop="mobile"></el-table-column>
				<el-table-column label="角色" prop="role_name"></el-table-column>

        <el-table-column label="状态">
					<template v-slot="scope">
						<el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
					</template>
				</el-table-column>

        <el-table-column label="操作" width="200">
					<template v-slot="scope">
						<!--修改按钮-->
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
						<!--删除按钮-->
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
						<!--分配角色按钮-->
						<el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
							<el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRoleDialog(scope.row)"></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
      </el-table>
    </el-card>

    <!-- 分页区域 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"	:page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" :total="total" layout="total, sizes, prev, pager, next, jumper" background>
		</el-pagination>

    <!--添加用户的对话框-->
		<el-dialog title="添加用户" width="50%" :visible.sync="addDialogVisible" @close="addDialogClosed">
			<!--内容主体-->
			<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
				<el-form-item label="用户名" prop="username">
					<el-input v-model="addForm.username"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="addForm.password"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="addForm.email"></el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="mobile">
					<el-input v-model="addForm.mobile"></el-input>
				</el-form-item>
			</el-form>
			<!--底部-->
			<span slot="footer">
				<el-button @click="addDialogVisible=false">取 消</el-button>
				<el-button type="primary" @click="addUser">确 定</el-button>
			</span>
		</el-dialog>

    <!--修改用户的对话框-->
		<el-dialog title="修改用户" width="50%" :visible.sync="editDialogVisible" :close-on-click-modal="false" @close="editDialogClosed">
			<!--内容主体-->
			<el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
				<el-form-item label="用户名" prop="username">
					<el-input v-model="editForm.username" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="editForm.email"></el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="mobile">
					<el-input v-model="editForm.mobile"></el-input>
				</el-form-item>
			</el-form>
			<!--底部-->
			<span slot="footer">
				<el-button @click="editDialogVisible=false">取 消</el-button>
				<el-button type="primary" @click="editUserInfo">确 定</el-button>
			</span>
		</el-dialog>

		<!--分配角色的对话框-->
		<el-dialog title="分配角色" width="50%" :visible.sync="setRoleDialogVisible" :close-on-click-modal="false" @close="setRoleDialogClosed">
			<!--内容主体-->
			<div>
				<p>当前的用户：{{ userInfo.username }}</p>
				<p>当前的角色：{{ userInfo.role_name }}</p>
				<p>分配新角色：
					<el-select v-model="selectRoleId" placeholder="请选择">
						<el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
					</el-select>
				</p>
			</div>
			<!--底部-->
			<span slot="footer">
				<el-button @click="setRoleDialogVisible=false">取 消</el-button>
				<el-button type="primary" @click="saveRoleInfo">确 定</el-button>
			</span>
		</el-dialog>

  </div>
</template>

<script>
export default {
  data(){
    let checkEmail = (rule, value, callback) => {
				const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
				if (regEmail.test(value)) {
					return callback()
				}
				callback(new Error('请输入合法的邮箱'))
			}
		let checkMobile = (rule, value, callback) => {
			const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
			if (regMobile.test(value)) {
		  	return callback()
			}
			callback(new Error('请输入合法的手机号'))
		}
    return{
      queryInfo: {
					query: '',
					pagenum: 1,//当前的页数
					pagesize: 5//当前每页显示多少条数据
				},
      userList: [],
			total: 0,
      // 添加对话框显示
      addDialogVisible:false,
      // 添加用户的表单数据
      addForm:{
        username: '',
					password: '',
					email: '',
					mobile: ''
      },
      // 添加表单的验证
      addFormRules:{
					username: [
						{required: true, message: '请输入用户名', trigger: 'blur'},
						{min: 3, max: 10, message: '用户名长度在3~10个字符', trigger: 'blur'}
					],
					password: [
						{required: true, message: '请输入密码', trigger: 'blur'},
						{min: 6, max: 15, message: '密码长度在6~15个字符', trigger: 'blur'}
					],
					email: [
						{required: true, message: '请输入邮箱', trigger: 'blur'},
						{validator: checkEmail, trigger: 'blur'}
					],
					mobile: [
						{required: true, message: '请输入手机号', trigger: 'blur'},
						{validator: checkMobile, trigger: 'blur'}
					]
				},

      //修改用户对话框显示状态
			editDialogVisible: false,
      //修改用户的表单数据
			editForm: {
        username: '',
				password: '',
				email: '',
				mobile: ''
      },
    	//修改用户表单的验证规则对象
			editFormRules: {
					email: [
						{required: true, message: '请输入邮箱', trigger: 'blur'},
						{validator: checkEmail, trigger: 'blur'}
					],
					mobile: [
						{required: true, message: '请输入手机号', trigger: 'blur'},
						{validator: checkMobile, trigger: 'blur'}
					]
			},
			//需要被分配角色的用户信息
			userInfo: {},
			//所有角色的数据列表
			rolesList: [],
			//已选中的角色id
			selectRoleId: '',
			//分配角色对话框的显示状态
			setRoleDialogVisible: false,
    }
  },
  created() {
			this.getUserList()
	},
  methods:{
    async getUserList(){
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200){
        return this.$methods.console.error('获取用户失败');
      }
      this.userList = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    // 监听展示pagesize改变的事件
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码改变的事件
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getUserList()  
    },
    // 状态改变
    async userStateChanged(userinfo){
      const {data: res} = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`)
      if(res.meta.status !== 200){
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('err')
      }
      return this.$message.success('修改用户状态成功')
    },
    // 关闭添加对话框时重置数据
    addDialogClosed(){
      this.$refs.addFormRef.resetFields()
    },
		// 增加用户
    addUser() {
      this.$refs.addFormRef.validate( async valid => {
        if(!valid) return

        const {data:res} = await this.$http.post('users',this.addForm)

        if(res.meta.status !== 200){
          this.$message.error("添加失败")
        }
        this.$message.success('添加成功')
        this.addDialogVisible = false
        this.getUserList()

      })
    },
		// 编辑对话框关闭时重置数据
    editDialogClosed() {
			this.$refs.editFormRef.resetFields()
		},
		// 显示编辑对话框
    async showEditDialog(id) {
      const {data:res} = await this.$http.get('users/' + id)
      if(res.meta.status !== 200){
        this.$message.error('error')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
		// 编辑用户
    editUserInfo(){
      this.$refs.editFormRef.validate(async valid => {
        if(!valid) return
        const {data: res} = await this.$http.put('users/'+this.editForm.id,{
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })

        if(res.meta.status !== 200){
          return this.$message.error('更新用户失败')
        }
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('更新用户成功')
      })
    },
    //根据id删除对应的用户
		async removeUserById(id) {
			const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
				  confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch(err => err)

      if(confirmResult !== 'confirm'){
        return this.$message.info('已取消删除')
      }
      const {data:res} = await this.$http.delete('users/' + id)

      if(res.meta.status !== 200){
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      this.getUserList()
		},
		//显示分配角色对话框
		async	showSetRoleDialog(userInfo) {
				this.userInfo = userInfo
				const {data:res} = await this.$http.get('roles')
					if (res.meta.status === 200) {
						this.rolesList = res.data
					} else {
						this.$message.error(res.meta.msg)
					}
				
				this.setRoleDialogVisible = true
		},
		//分配角色对话框关闭事件
		setRoleDialogClosed() {
			this.selectRoleId = ''
			this.userInfo = {}
		},
		//确定分配角色
		async saveRoleInfo() {
			if (!this.selectRoleId) {
				return this.$message.error('请选择要分配的角色')
			}
			const { data : res } = await this.$http.put(`users/${this.userInfo.id}/role`, {rid: this.selectRoleId})
				if (res.meta.status === 200) {
					this.getUserList()
					this.setRoleDialogVisible = false
					this.$message.success(res.meta.msg)
				} else {
					this.$message.error(res.meta.msg)
				}
		}
  }
}
</script>

<style lang="less" scoped>

</style>