import { List } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import './index.less'
import VideoView from '../VideoView/VideoView'
import { useRecoilValue, useRecoilState } from 'recoil'
import { activeViewState, livhubState, localStreamState, userState } from '../../recoil'
import { useRef } from 'react'
import { useAsync } from 'react-use'
import { useContext } from '../../Meeting'

export default function User({
  user
}: {
  user: {
    role: string
    id: string
    streamList: {
      audioCodec: string
      hasAudio: boolean
      hasVideo: boolean
      id: string
      type: string
      videoCodec: string
    }[]
  }
}) {
  const contextValue = useContext()

  const currentUser = useRecoilValue(userState)
  const [activeUser, setActiveUser] = useRecoilState(activeViewState)
  const livhub = useRecoilValue(livhubState)

  const domRef = useRef<HTMLDivElement>(null)
  const click = () => {
    if (activeUser?.user?.id === user.id) {
      return
    }
    setActiveUser({
      user: user as any,
      videoDom: domRef.current as HTMLDivElement,
      parentDom: domRef.current?.parentElement as HTMLDivElement
    })
  }

  const { value: streamList = [] } = useAsync(async () => {
    if (currentUser.id === user.id) {
      return [contextValue.localStream]
    }
    return await Promise.all(user.streamList.map(async (stream) => await livhub.createRemoteStream(stream.id)))
  }, [currentUser, user])
  return (
    <List.Item className="userItem" onClick={click}>
      <div ref={domRef} style={{ height: '100%', width: '100%' }}>
        <div className="videoWrap" style={{ height: '100%', width: '100%' }}>
          <VideoView streamList={streamList} />
        </div>

        <div className="userIconWrap">
          <div className="userIcon">{user.id[0]}</div>
        </div>
      </div>

      <div className="userId">{user.id}</div>
    </List.Item>
  )
}
