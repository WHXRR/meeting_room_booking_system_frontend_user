import { Link, Outlet } from 'react-router-dom'
import { UserOutlined } from '@ant-design/icons'

export function Index() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-[#f0f0f0]">
        <h1 className="font-bold text-xl">会议室预定系统</h1>
        <Link to="/update_info">
          <UserOutlined style={{ fontSize: '24px' }} className="cursor-pointer" />
        </Link>
      </div>
      <div className="flex-1 overflow-hidden overflow-y-auto p-4">
        <Outlet />
      </div>
    </div>
  )
}
