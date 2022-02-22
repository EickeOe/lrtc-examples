import { List } from 'antd'
import { useState } from 'react'
import { userListState } from '../../recoil'
import User from '../User/User'
import './index.less'
import { useRecoilValue } from 'recoil'

export default function UserList() {
  const list = useRecoilValue(userListState)
  // console.log(list)
  return (
    <div className="userList">
      <div style={{ padding: 12, fontSize: 18, fontWeight: 'bold' }}>会议成员</div>
      <List>
        {list.map((user) => (
          <User key={user?.id} user={user as any} />
        ))}
      </List>
    </div>
  )
}
