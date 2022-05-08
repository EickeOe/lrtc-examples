import { useQuery } from '@/hooks/useQuery'
import { useHistory } from 'react-router-dom'
import './index.less'
import AudioBtn from './components/AudioBtn/AudioBtn'
import { Button, message } from 'antd'
import VideoBtn from './components/VideoBtn'
import ScreenBtn from './components/ScreenBtn'
import UserList from './components/UserList/UserList'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useSetRecoilState, useRecoilValue, useRecoilState } from 'recoil'
import { livhubState, localStreamState, localStreamStateState, userListState, userState } from './recoil'
import MainView from './components/MainView/MainView'
import createUseContext from '@/hooks/createUseContext'
import Livhub, { ERROR_CODE, LocalStream } from 'livhub'
import { getNextState } from '@/hooks/getNextState'
import { useMedia } from 'react-use'
import MobileUserList from './components/MobileUserList/MobileUserList'
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
      livhub.on('userChange', async ({ data }) => {
        const nextUser = await getNextState(setUser)
        // 事件
        // if (data.state === 'join') {
        //   if (data.user.id === nextUser.id) {
        //     message.error('您已被踢下线！')
        //     history.replace('/login')
        //   }
        // } else if (data.state === 'leave') {
        //   if (data.user.id === nextUser.id) {
        //     message.error('您已被踢下线！')
        //     history.replace('/login')
        //   }
        // }

        // 直接从接口重新请求userList,不再从事件中处理userList
        const userList = await livhub.getUserList()
        setUserList(userList)
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
      // livhub.on('error', (e) => {
      //   // 异地登录
      //   if (e.code === ERROR_CODE.USER_REMOTE_SIGN_IN) {
      //     message.error('您的账号已在异地登录！')
      //     history.replace('/login')
      //   }
      // })
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

      localStreamRef.current.on('audioChange', ({ mute }) => {
        // localStream监听事件
        setLocalStreamState((p) => ({ ...p, audio: !mute }))
      })
      localStreamRef.current.on('videoChange', ({ mute }) => {
        setLocalStreamState((p) => ({ ...p, video: !mute }))
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
      // 创建共享屏幕视频流
      localScreenStreamRef.current = Livhub.createLocalStream({ screen: true })
      // 初始化
      await localScreenStreamRef.current.initialize()
      // 渲染到dom节点
      // localScreenStreamRef.current.setRender(document.body)
      // 监听videoChange事件
      localScreenStreamRef.current.on('videoChange', ({ stop }) => {
        // 当video 被停止后，删除渲染
        if (stop) {
          localScreenStreamRef.current.removeRender()
          // 取消发布已经发布的屏幕共享本地流
          livhub.unpublish(localScreenStreamRef.current)
        }
      })
      livhub.publish(localScreenStreamRef.current, 'desktop')
      setLocalStreamState((p) => ({ ...p, screen: true }))
    }
  })

  const pValue = useMemo(() => ({ localStream: localStreamRef.current }), [])

  const isMobile = useMedia('(max-width: 768px)')
  return (
    <div className="meeting">
      <Provider value={pValue}>
        <div className="header">
          <div>livhub demo - channel: {query.channelId}</div>
        </div>
        <div className="content">
          <div className="left">
            <MainView />
          </div>
          <div className="right">{isMobile ? <MobileUserList /> : <UserList />}</div>
        </div>
        <div className="footer">
          <div className="toolbar">
            <div style={{ display: 'flex' }}>
              <AudioBtn actionRef={localAction} />
              <VideoBtn actionRef={localAction} />
              {!isMobile && <ScreenBtn actionRef={localAction} />}
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
