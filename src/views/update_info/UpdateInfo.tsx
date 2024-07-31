import { Button, Form, Input, Upload, message } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import type { UploadProps } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { getUserInfo, updateUserInfo, updateUserInfoCaptcha } from '../../api/userInfo'

export interface UpdateUserInfo {
  headPic: string
  nickName: string
  captcha: string
}

export function UpdateInfo() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>()

  useEffect(() => {
    async function query() {
      const res = await getUserInfo()
      const { data } = res.data
      if (res.status === 200 || res.status === 201) {
        form.setFieldValue('headPic', data.headPic)
        form.setFieldValue('nickName', data.nickName)
        setImageUrl(data.headPic)
      }
    }
    query()
  }, [])
  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      setLoading(false)
      setImageUrl(`http://localhost:3000/${info.file.response.data}`)
      form.setFieldValue('headPic', `http://localhost:3000/${info.file.response.data}`)
      message.success('上传成功')
    }
  }

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  )

  const getCaptcha = useCallback(async () => {
    const res = await updateUserInfoCaptcha()
    if ([200, 201].includes(res.status)) {
      message.success(res.data.data)
    }
    else {
      message.error(res.data.data)
    }
  }, [])

  const onFinish = useCallback(async (values: UpdateUserInfo) => {
    const res = await updateUserInfo(values)
    const { data } = res.data
    if ([200, 201].includes(res.status)) {
      message.success(data)
    }
    else {
      message.error(data || '登录失败')
    }
  }, [])

  return (
    <div className="max-w-[500px] mx-auto mt-10">
      <Form
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        form={form}
        autoComplete="off"
      >
        <Form.Item<UpdateUserInfo>
          label=" "
          colon={false}
          name="headPic"
        >
          <div className="flex justify-center">
            <Upload
              name="file"
              listType="picture-circle"
              className="avatar-uploader"
              showUploadList={false}
              action="http://localhost:3000/user/upload"
              onChange={handleChange}
            >
              {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} className="rounded-full" /> : uploadButton}
            </Upload>
          </div>
        </Form.Item>
        <Form.Item<UpdateUserInfo>
          label="昵称"
          name="nickName"
          rules={[{ required: true, message: '请输入昵称!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<UpdateUserInfo> label="验证码">
          <div className="flex justify-between">
            <Form.Item<UpdateUserInfo>
              name="captcha"
              noStyle
              rules={[{ required: true, message: '请输入验证码!' }]}
            >
              <Input />
            </Form.Item>
            <Button className="ml-2" type="primary" onClick={getCaptcha}>获取验证码</Button>
          </div>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
          <Button type="primary" htmlType="submit" className="w-full">
            确认
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
