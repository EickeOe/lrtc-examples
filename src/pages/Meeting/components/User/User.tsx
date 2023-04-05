import { List } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import './index.less'
import VideoView from '../VideoView/VideoView'
import { useRecoilValue, useRecoilState } from 'recoil'
import { activeViewState, livhubState, localStreamState, userState } from '../../recoil'
import { memo, useEffect, useMemo, useRef } from 'react'
import { useAsync, useMedia } from 'react-use'
import { useContext } from '../../Meeting'
import { RemoteStream } from 'livhub'

export default memo(function User({
  user
}: {
  user: {
    role: string
    id: string
    streamList: RemoteStream[]
  }
}) {
  const contextValue = useContext()

  const currentUser = useRecoilValue(userState)
  const [activeUser, setActiveUser] = useRecoilState(activeViewState)

  const domRef = useRef<HTMLDivElement>(null)
  const streamList = useMemo(() => {
    if (currentUser.id === user?.id) {
      if (contextValue.localStream) {
        return currentUser.streamList || []
      }
      return []
    }

    return user.streamList || []
  }, [currentUser.streamList?.length, contextValue, user])
  const click = () => {
    if (streamList.length === 0) {
      return
    }
    if (activeUser?.user?.id === user.id) {
      return
    }
    setActiveUser({
      user: user as any,
      videoDom: domRef.current as HTMLDivElement,
      parentDom: domRef.current?.parentElement as HTMLDivElement
    })
  }

  // const isMobile = useMedia('(max-width: 768px)')

  // const { value: streamList = [] } = useAsync(async () => {
  //   if (isMobile) {
  //     return []
  //   }

  //   if (currentUser.id === user.id) {
  //     return [contextValue.localStream]
  //   }
  //   return await Promise.all(user.streamList.map(async (stream) => await livhub.createRemoteStream(stream.id)))
  // }, [currentUser, user, isMobile, contextValue.localStream])

  return (
    <List.Item className="userItem" onClick={click}>
      <div ref={domRef} style={{ height: '100%', width: '100%' }}>
        {streamList.length > 0 && (
          <div className="videoWrap" style={{ height: '100%', width: '100%' }}>
            <VideoView streamList={streamList} />
          </div>
        )}

        <div className="userIconWrap">
          <div className="userIcon">{user.id?.[0]}</div>
        </div>
      </div>

      <div className="userId">{user.id}</div>
    </List.Item>
  )
})
