import { DatePicker, Form, Input, Modal, TimePicker, message } from 'antd'
import { bookingAdd } from '../../api/booking'
import type { MeetingRoomTableType } from './MeetingRoomList'

interface CreateBookingModalProps {
  open: boolean
  handleClose: () => void
  meetingRoom: MeetingRoomTableType
}

export interface CreateBooking {
  meetingRoomId: number
  rangeStartDate: Date
  rangeStartTime: Date
  rangeEndDate: Date
  rangeEndTime: Date
  note: string
}
export function CreateBookingModal(props: CreateBookingModalProps) {
  const [form] = Form.useForm()
  const handleOk = () => {
    form.validateFields().then(async (values: CreateBooking) => {
      values.meetingRoomId = props.meetingRoom.id
      const res = await bookingAdd(values)
      if (res.status === 201 || res.status === 200) {
        message.success('创建成功')
        form.resetFields()
        props.handleClose()
      }
      else {
        message.error(res.data.data)
      }
    })
  }

  return (
    <div>
      <Modal title="预定会议室" open={props.open} onOk={handleOk} onCancel={props.handleClose}>
        <div className="pt-4">
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            form={form}
          >
            <Form.Item
              label="会议室名称"
            >
              {props.meetingRoom.name}
            </Form.Item>
            <Form.Item
              label="预定开始日期"
              name="rangeStartDate"
              rules={[
                { required: true, message: '请输入预定开始日期!' },
              ]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              label="预定开始时间"
              name="rangeStartTime"
              rules={[
                { required: true, message: '请输入预定开始日期!' },
              ]}
            >
              <TimePicker />
            </Form.Item>
            <Form.Item
              label="预定结束日期"
              name="rangeEndDate"
              rules={[
                { required: true, message: '请输入预定结束日期!' },
              ]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              label="预定结束时间"
              name="rangeEndTime"
              rules={[
                { required: true, message: '请输入预定结束日期!' },
              ]}
            >
              <TimePicker />
            </Form.Item>
            <Form.Item
              label="备注"
              name="note"
            >
              <Input />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  )
}
