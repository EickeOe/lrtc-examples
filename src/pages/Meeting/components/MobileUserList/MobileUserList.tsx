import { PlayCircleOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { List } from 'antd'
import { useRecoilState, useRecoilValue } from 'recoil'
import { activeViewState, userListState, userState } from '../../recoil'
import './MobileUserList.less'
import MobileUser from './MobleUser'

export default function MobileUserList() {
  const currentUser = useRecoilValue(userState)
  const list = useRecoilValue(userListState)

  const [activeUser, setActiveUser] = useRecoilState(activeViewState)
  return (
    <>
      <div
        style={{
          padding: 12,
          fontSize: 18,
          fontWeight: 'bold',
          position: 'sticky',
          zIndex: 1,
          top: 0,
          background: '#fff'
        }}
      >
        会议成员
      </div>
      <List>
        {list.map((user) => (
          <List.Item key={user?.id}>
            <MobileUser user={user as any} />
          </List.Item>
        ))}
      </List>
    </>
  )
}
