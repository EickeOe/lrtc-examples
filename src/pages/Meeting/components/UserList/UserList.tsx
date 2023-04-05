import { List } from 'antd'
import { userListState, userState } from '../../recoil'
import User from '../User/User'
import './index.less'
import { useRecoilValue } from 'recoil'

export default function UserList() {
  const list = useRecoilValue(userListState)
  const currentUser = useRecoilValue(userState)

  return (
    <div className="userList">
      <div style={{ padding: 12, fontSize: 18, fontWeight: 'bold' }}>会议成员</div>
      <List>
        <User key={`${currentUser?.id}-${currentUser.streamList?.length}`} user={currentUser as any} />
        {list.map((user) => (
          <User key={`${user?.id}-${user?.streamList?.length}`} user={user as any} />
        ))}
      </List>
    </div>
  )
}
