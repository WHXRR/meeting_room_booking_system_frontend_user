import type { FormProps } from 'antd'
import { Button, Form, Input, message } from 'antd'
import { login } from '../../api/login'

interface LoginUser {
  username: string
  password: string
}

const onFinish: FormProps<LoginUser>['onFinish'] = async (values) => {
  const res = await login(values.username, values.password)
  if ([200, 201].includes(res.status)) {
    message.success('登录成功')
  }
  else {
    message.error(res.data.data || '登录失败')
  }
}

export function Login() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-center font-bold text-2xl">会议室预定系统</h1>
      <div className="mt-4 w-full max-w-[600px]">
        <Form
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          style={{ maxWidth: 600 }}
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
              <Button type="link" className="p-0">创建账号</Button>
              <Button type="link" className="p-0">忘记密码</Button>
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
