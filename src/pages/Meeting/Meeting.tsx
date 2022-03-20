import { useQuery } from '@/hooks/useQuery'
import { useHistory } from 'react-router-dom'
import './index.less'
import AudioBtn from './components/AudioBtn/AudioBtn'
import { Button } from 'antd'
import VideoBtn from './components/VideoBtn'
import ScreenBtn from './components/ScreenBtn'
import UserList from './components/UserList/UserList'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useSetRecoilState, useRecoilValue, useRecoilState } from 'recoil'
import { livhubState, localStreamState, localStreamStateState, userListState, userState } from './recoil'
import MainView from './components/MainView/MainView'
import createUseContext from '@/hooks/createUseContext'
import Livhub, { LocalStream } from 'livhub'
export const [Provider, useContext] = createUseContext<{
  localStream: LocalStream
}>({ localStream: null as any })

export default function Meeting() {
  const setUserList = useSetRecoilState(userListState)
  const setLocalStreamState = useSetRecoilState(localStreamStateState)
  const livhub: Livhub = useRecoilValue(livhubState) as Livhub
  const query = useQuery()
  const [user, setUser] = useRecoilState(userState)
  useEffect(() => {
    setUser({
      id: query.userId,
      role: '',
      streamList: []
    })
  }, [query])
  const history = useHistory()
  if (!(query.channelId && query.userId)) {
    history.push('/login')
  }

  useEffect(() => {
    livhub.setOptions({
      user: {
        id: query.userId
      },
      channel: {
        id: query.channelId
      }
    } as any)
  }, [])

  const localStreamRef = useRef(Livhub.createLocalStream({ video: true, audio: true }))

  useEffect(() => {
    const sync = async () => {}
    sync()
  }, [])
  const onClose = () => {
    livhub.leave()
  }

  useEffect(() => {
    const init = async () => {
      await livhub.initialize() // 初始化SDK
      livhub.on('userChange', ({ data }) => {
        // 事件
        if (data.state === 'join') {
          setUserList((list) => [...list, data.user] as any)
        } else if (data.state === 'leave') {
          setUserList((list) => list.filter((u1) => u1?.id !== data.user.id))
        }
      })
      livhub.on('streamChange', ({ data }) => {
        // 事件
        if (data.state === 'publish') {
          setUserList((list) => {
            const next = list.map((user) => {
              let nUser = { ...user } as any
              if (user?.id === data.user.id) {
                nUser = JSON.parse(JSON.stringify(user))
                if (!nUser.streamList) {
                  nUser.streamList = []
                }
                nUser.streamList.push(data.stream)
              }
              return nUser
            })
            return next
          })
        } else if (data.state === 'unpublish') {
          setUserList((list) =>
            list.map((user) => {
              let nUser: typeof user = user
              if (user?.id === data.user.id) {
                const nUser = JSON.parse(JSON.stringify(user))
                if (!nUser.streamList) {
                  nUser.streamList = []
                }
                nUser.streamList = nUser.streamList.filter((stream: any) => stream.id !== data.stream.id)
              }
              return nUser
            })
          )
        }
      })
      // TODO:
      livhub.on('broadcast', (e) => {
        console.log('broadcast', e)
      })
      livhub.on('error', (e) => {
        console.log(e)
      })
      await livhub.join() // 进入channel
      livhub.broadcast({
        // 广播消息
        asda: 12312
      })
      const userList = await livhub.getUserList() // 获取当前频道用户列表

      await localStreamRef.current.initialize() // localStream初始化
      setLocalStreamState((p) => ({
        ...p,
        currentCamera: localStreamRef.current.getVideoTrack()?.getSettings().deviceId as string,
        currentMicroPhone: localStreamRef.current.getAudioTrack()?.getSettings().deviceId as string
      }))
      livhub.publish(localStreamRef.current) // 推送localStream
      setUserList(userList)

      localStreamRef.current.on('audioChange', ({ data }) => {
        // localStream监听事件
        setLocalStreamState((p) => ({ ...p, audio: data.enabled }))
      })
      localStreamRef.current.on('videoChange', ({ data }) => {
        setLocalStreamState((p) => ({ ...p, video: data.enabled }))
      })
    }
    init()
    // const localStream = Livhub.createLocalStream()
    // const screenStream = Livhub.createLocalStream({ screen: true })
    // await localStream.initialize()
    return () => {
      // onClose()
    }
  }, [])

  const localScreenStreamRef = useRef<LocalStream>(null as any as LocalStream)

  const localAction = useRef({
    muteAudio: localStreamRef.current.muteAudio,
    muteVideo: localStreamRef.current.muteVideo,
    unmuteAudio: localStreamRef.current.unmuteAudio,
    unmuteVideo: localStreamRef.current.unmuteVideo,
    shareScreen: async () => {
      localScreenStreamRef.current = Livhub.createLocalStream({ screen: true })
      await localScreenStreamRef.current.initialize()
      livhub.publish(localScreenStreamRef.current, 'desktop')
      setLocalStreamState((p) => ({ ...p, screen: true }))
    }
  })

  const pValue = useMemo(() => ({ localStream: localStreamRef.current }), [])

  return (
    <div className="meeting">
      <Provider value={pValue}>
        <div className="header"></div>
        <div className="content" style={{ display: 'flex' }}>
          <div className="left" style={{ flex: 1 }}>
            <MainView />
          </div>
          <div className="right">
            <UserList />
          </div>
        </div>
        <div className="footer">
          <div className="toolbar">
            <div style={{ display: 'flex' }}>
              <AudioBtn actionRef={localAction} />
              <VideoBtn actionRef={localAction} />
              <ScreenBtn actionRef={localAction} />
            </div>
            <div>
              <Button danger onClick={onClose}>
                结束会议
              </Button>
            </div>
          </div>
        </div>
      </Provider>
    </div>
  )
}
