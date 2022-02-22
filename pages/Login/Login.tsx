import { useQuery } from '@/hooks/useQuery'
import { Button, Checkbox, Form, Input } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import './index.less'

export default function Login() {
  const [form] = useForm()
  const history = useHistory()
  const onFinish = (values: { channelId: string; userId: string }) => {
    history.push(`/meeting?${new URLSearchParams(values as any).toString()}`)
  }
  const query = useQuery()
  useEffect(() => {
    if (query.channelId && query.userId) {
      form.setFieldsValue(query)
    }
  }, [])
  return (
    <div className="login">
      <div className="formWrap">
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            label="channelId"
            name="channelId"
            rules={[{ required: true, message: 'Please input your channelId!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="userId" name="userId" rules={[{ required: true, message: 'Please input your userId!' }]}>
            <Input />
          </Form.Item>

          {/* <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
            <Checkbox>记住我</Checkbox>
          </Form.Item> */}

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              开始会议
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
