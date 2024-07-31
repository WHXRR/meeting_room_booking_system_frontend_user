import { Button, Form, Input, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useCallback } from 'react'
import { login } from '../../api/login'

interface LoginUser {
  username: string
  password: string
}

export function Login() {
  const navigate = useNavigate()

  const onFinish = useCallback(async (values: LoginUser) => {
    const res = await login(values.username, values.password)
    const { data } = res.data
    if ([200, 201].includes(res.status)) {
      message.success('登录成功')
      localStorage.setItem('access_token', data.accessToken)
      localStorage.setItem('refresh_token', data.refreshToken)
      localStorage.setItem('user_info', JSON.stringify(data.userInfo))
      setTimeout(() => {
        navigate('/')
      }, 1000)
    }
    else {
      message.error(data || '登录失败')
    }
  }, [])
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-center font-bold text-2xl">会议室预定系统</h1>
      <div className="mt-4 w-full max-w-[400px]">
        <Form
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<LoginUser>
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<LoginUser>
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            valuePropName="checked"
            wrapperCol={{ offset: 4, span: 20 }}
          >
            <div className="flex justify-between">
              <Button type="link" className="p-0" onClick={() => navigate('/register')}>创建账号</Button>
              <Button type="link" className="p-0" onClick={() => navigate('/update_password')}>忘记密码</Button>
            </div>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
            <Button type="primary" htmlType="submit" className="w-full">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
