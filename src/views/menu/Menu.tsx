import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { HistoryOutlined, LaptopOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import { useEffect } from 'react'

type MenuItem = Required<MenuProps>['items'][number]
const items: MenuItem[] = [
  {
    key: '/meeting_room_list',
    label: '会议室列表',
    icon: <LaptopOutlined />,
  },
  {
    key: '/meeting_history',
    label: '预定历史',
    icon: <HistoryOutlined />,
  },
]

export function MeetingMenu() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/meeting_room_list')
    }
  }, [])

  function getSelectedKeys() {
    if (location.pathname === '/') {
      return ['/meeting_room_list']
    }
    else {
      return [location.pathname]
    }
  }
  const onClick: MenuProps['onClick'] = (e) => {
    navigate(e.key)
  }
  return (
    <div className="flex h-full">
      <div>
        <Menu
          onClick={onClick}
          style={{ width: 256 }}
          defaultSelectedKeys={getSelectedKeys()}
          items={items}
          className="h-full"
        />
      </div>
      <div className="p-4 flex-1 overflow-hidden overflow-y-auto">
        <Outlet />
      </div>
    </div>
  )
}
