import { VideoCameraOutlined } from '@ant-design/icons'
import { useEffect, useRef } from 'react'
import { useAsync, useMedia } from 'react-use'
import { useRecoilState, useRecoilValue } from 'recoil'
import { useContext } from '../../Meeting'
import { activeViewState, livhubState, userState } from '../../recoil'
import VideoView from '../VideoView/VideoView'

interface Props {
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
}

export default function MobileUser({ user }: Props) {
  const contextValue = useContext()
  const currentUser = useRecoilValue(userState)
  const [activeUser, setActiveUser] = useRecoilState(activeViewState)
  const livhub = useRecoilValue(livhubState)
  const domRef = useRef<HTMLDivElement>(null)

  const isMobile = useMedia('(max-width: 768px)')
  const { value: streamList = [] } = useAsync(async () => {
    if (!isMobile) {
      return []
    }

    if (currentUser.id === user.id) {
      return [contextValue.localStream]
    }
    return await Promise.all(user.streamList.map(async (stream) => await livhub.createRemoteStream(stream.id)))
  }, [currentUser, user, isMobile])

  useEffect(() => {
    // 默认播放本地流
    if (currentUser.id === user.id) {
      setActiveUser({
        user: user as any,
        videoDom: domRef.current as HTMLDivElement,
        parentDom: domRef.current?.parentElement as HTMLDivElement
      })
    }
  }, [currentUser])

  return (
    <div
      style={{
        width: '100%',
        paddingLeft: 12,
        paddingRight: 12,
        display: 'flex',
        justifyContent: 'space-between'
      }}
      onClick={() => {
        if (activeUser?.user?.id === user.id) {
          return
        }
        setActiveUser({
          user: user as any,
          videoDom: domRef.current as HTMLDivElement,
          parentDom: domRef.current?.parentElement as HTMLDivElement
        })
      }}
    >
      <span style={{ display: 'flex', gap: 4 }}>
        {user?.id}
        {currentUser.id === user?.id && <span>(我)</span>}
      </span>
      <span>
        {!!(streamList?.length && streamList?.length > 0) && (
          <VideoCameraOutlined
            style={{
              color: activeUser?.user?.id === user?.id ? '#1890ff' : ''
            }}
          />
        )}
        <div style={{ width: 0, height: 0, overflow: 'hidden', position: 'relative' }}>
          <div ref={domRef} style={{ width: '100%', height: '100%' }}>
            <div
              className="videoWrap"
              style={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                zIndex: 1
              }}
            >
              <VideoView streamList={streamList} />
            </div>
          </div>
        </div>
      </span>
    </div>
  )
}
