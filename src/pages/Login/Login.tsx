import { useQuery } from '@/hooks/useQuery'
import { Button, Checkbox, Form, Input, Select } from 'antd'
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
    if (query.channelId && query.userId && query.role) {
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
          initialValues={{ remember: true, role: 0 }}
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
          <Form.Item label="角色" name="role" rules={[{ required: true, message: '请选择角色!' }]}>
            <Select
              options={[
                {
                  label: '拉流',
                  value: 0
                },
                // {
                //   label: '推流',
                //   value: 1
                // },
                {
                  label: '推拉流',
                  value: 2
                }
              ]}
            />
          </Form.Item>

          {/* <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
            <Checkbox>记住我</Checkbox>
          </Form.Item> */}

          <Form.Item style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit">
              开始会议
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
