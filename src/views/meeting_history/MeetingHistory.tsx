import { Button, Col, DatePicker, Form, Input, Popconfirm, Row, Table, TimePicker, message } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import type { TableProps } from 'antd'
import type { MeetingRoomTableType } from '../meeting_room_list/MeetingRoomList'
import { getBookingList, unbind } from '../../api/booking'

export interface SearchBooking {
  username: string
  meetingRoomName: string
  meetingRoomPosition: string
  rangeStartDate: Date
  rangeStartTime: Date
  rangeEndDate: Date
  rangeEndTime: Date
}
interface BookingSearchResult {
  id: number
  startTime: string
  endTime: string
  status: string
  note: string
  createTime: string
  updateTime: string
  room: MeetingRoomTableType
}

export function MeetingHistory() {
  const [form] = Form.useForm()
  const [number, setNumber] = useState(0)
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [data, setData] = useState([])

  function getUserInfo() {
    const userInfoStr = localStorage.getItem('user_info')

    if (userInfoStr) {
      return JSON.parse(userInfoStr)
    }
  }

  const onFinish = useCallback(async (searchBooking: SearchBooking) => {
    const res = await getBookingList(
      {
        ...searchBooking,
        username: getUserInfo()?.username,
      },
      pageNo,
      pageSize,
    )
    const { data } = res.data
    if (res.status === 201 || res.status === 200) {
      setData(data.bookings.map((item: BookingSearchResult) => {
        return {
          key: item.id,
          ...item,
        }
      }))
    }
    else {
      message.error(data || '系统繁忙，请稍后再试')
    }
  }, [])

  useEffect(() => {
    onFinish({
      username: getUserInfo()?.username,
      meetingRoomName: form.getFieldValue('meetingRoomName'),
      meetingRoomPosition: form.getFieldValue('meetingRoomPosition'),
      rangeStartDate: form.getFieldValue('rangeStartDate'),
      rangeStartTime: form.getFieldValue('rangeStartTime'),
      rangeEndDate: form.getFieldValue('rangeEndDate'),
      rangeEndTime: form.getFieldValue('rangeEndTime'),
    })
  }, [pageNo, pageSize, number])

  const reset = () => {
    form.resetFields()
    setNumber(Math.random())
  }

  async function changeStatus(id: number) {
    const res = await unbind(id)
    if (res.status === 201 || res.status === 200) {
      message.success('状态更新成功')
      setNumber(Math.random())
    }
    else {
      message.error(res.data.data)
    }
  }

  const columns: TableProps<BookingSearchResult>['columns'] = useMemo(() => [
    {
      title: '会议室名称',
      dataIndex: 'room',
      render(_, record) {
        return record.room.name
      },
    },
    {
      title: '会议室位置',
      dataIndex: 'room',
      render(_, record) {
        return record.room.location
      },
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      render(_, record) {
        return dayjs(new Date(record.startTime)).format('YYYY-MM-DD HH:mm:ss')
      },
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      render(_, record) {
        return dayjs(new Date(record.endTime)).format('YYYY-MM-DD HH:mm:ss')
      },
    },
    {
      title: '审批状态',
      dataIndex: 'status',
      onFilter: (value, record) => record.status.startsWith(value as string),
      filters: [
        {
          text: '审批通过',
          value: '审批通过',
        },
        {
          text: '审批驳回',
          value: '审批驳回',
        },
        {
          text: '申请中',
          value: '申请中',
        },
        {
          text: '已解除',
          value: '已解除',
        },
      ],
    },
    {
      title: '预定时间',
      dataIndex: 'createTime',
      render(_, record) {
        return dayjs(new Date(record.createTime)).format('YYYY-MM-DD hh:mm:ss')
      },
    },
    {
      title: '备注',
      dataIndex: 'note',
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '操作',
      render: (_, record) => (
        record.status === '申请中'
          ? (
              <div>
                <Popconfirm
                  title="解除申请"
                  description="确认解除吗？"
                  onConfirm={() => changeStatus(record.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <a href="#" className="text-blue-500">解除预定</a>
                </Popconfirm>
              </div>
            )
          : null
      ),
    },
  ], [])

  const changePage = (pageNo: number, pageSize: number) => {
    setPageNo(pageNo)
    setPageSize(pageSize)
  }

  return (
    <div>
      <Form
        name="basic"
        layout="inline"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        form={form}
      >
        <Row gutter={[0, 12]}>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item<SearchBooking>
              label="会议室名称"
              name="meetingRoomName"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item<SearchBooking>
              label="会议室位置"
              name="meetingRoomPosition"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item label="预定开始日期" name="rangeStartDate">
              <DatePicker className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item label="预定开始时间" name="rangeStartTime">
              <TimePicker className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item label="预定结束日期" name="rangeEndDate">
              <DatePicker className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item label="预定结束时间" name="rangeEndTime">
              <TimePicker className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Row>
              <Form.Item>
                <Button type="primary" htmlType="submit">搜索</Button>
              </Form.Item>
              <Form.Item>
                <Button onClick={reset}>重置</Button>
              </Form.Item>
            </Row>
          </Col>
        </Row>
      </Form>
      <div className="pt-4">
        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            current: pageNo,
            pageSize,
            onChange: changePage,
          }}
        />
      </div>
    </div>
  )
}
