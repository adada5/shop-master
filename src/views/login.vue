<template>
  <div class="container">
    <div class="box">
      <div class="pic">
        <img src="../assets/logo.png" alt="">
      </div>
     
      <el-form ref="form" :model="form" :rules="loginFormRules" class="form"> 
        <el-form-item prop="username">
          <el-input v-model="form.username" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" prefix-icon="el-icon-lock" show-password></el-input>
        </el-form-item>

        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
			  </el-form-item>
      </el-form>
      
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      form:{
        username: 'admin',
				password: '123456'
      },
      loginFormRules: {
					username: [
						{required: true, message: '请输入用户名', trigger: 'blur'},
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
					],
					password: [
						{required: true, message: '请输入密码', trigger: 'blur'},
            { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
					]
			}
    }
  },
  methods:{
    resetLoginForm() {
				this.$refs.form.resetFields();
		},
    login(){
      this.$refs.form.validate(async valid => {
        if(!valid) return;
        const {data: res} = await this.$http.post("login",this.form);
        if(res.meta.status !== 200)return this.$message.error("err");
        this.$message.success("yes")
        window.sessionStorage.setItem('token',res.data.token)
        this.$router.push("home")
      })
    }
  }

} 
</script>

<style lang='less' scoped>
  .container{
    height: 100%;
		background-color: #2b4b6b;
  }
  .box{
    width: 450px;
		height: 300px;
    position:absolute;
    background-color: #fff;
		border-radius: 3px;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    .pic{
      height: 130px;
			width: 130px;
			border: 1px solid #eee;
			border-radius: 50%;
			padding: 10px;
			box-shadow: 0 0 10px #ddd;
			position: absolute;
			left: 50%;
			transform: translate(-50%, -50%);
			background-color: #fff;
      img{
        width: 100%;
				height: 100%;
				border-radius: 50%;
				background-color: #eee;
      }
    }
  }
  .form {
		position: absolute;
		bottom: 0;
		width: 100%;
		padding: 0 20px;
		box-sizing: border-box;
	}
  .btns {
		display: flex;
		justify-content: flex-end;
	}

</style>