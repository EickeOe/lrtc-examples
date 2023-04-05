import { useQuery } from '@/hooks/useQuery'
import { useHistory } from 'react-router-dom'
import './index.less'
import AudioBtn from './components/AudioBtn/AudioBtn'
import { Button, message, Modal } from 'antd'
import VideoBtn from './components/VideoBtn'
import ScreenBtn from './components/ScreenBtn'
import UserList from './components/UserList/UserList'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSetRecoilState, useRecoilValue, useRecoilState } from 'recoil'
import { livhubState, localStreamState, localStreamStateState, userListState, userState } from './recoil'
import MainView from './components/MainView/MainView'
import createUseContext from '@/hooks/createUseContext'
import Livhub, { ERROR_CODE, LocalStream, RemoteStream } from 'livhub'
import { getNextState } from '@/hooks/getNextState'
import { useMedia } from 'react-use'
import MobileUserList from './components/MobileUserList/MobileUserList'
import { useUpdater } from '@/hooks/useUpdater'
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
      role: query.role,
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

  const [localStreamRef, setLocalStreamRef] = useState<LocalStream>()

  const tempFn = (fn: any) => {
    return async () => {
      if (!localStreamRef) {
        Modal.confirm({
          title: '提示',
          content: '您现在还没有推流，确定推流吗？',
          onOk: async () => {
            setTimeout(localStreamInit)
          }
        })
      }
    }
  }
  const localAction = useRef({
    muteAudio: tempFn(localStreamRef?.muteAudio),
    muteVideo: tempFn(localStreamRef?.muteVideo),
    unmuteAudio: tempFn(localStreamRef?.unmuteAudio),
    unmuteVideo: tempFn(localStreamRef?.unmuteVideo),
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
  const setLocalStreamStateState = useSetRecoilState(localStreamStateState)
  const localStreamInit = async () => {
    const ls = Livhub.createLocalStream({ video: true, audio: true })

    if (ls) {
      await ls.initialize() // localStream初始化
      setLocalStreamRef(ls)
      setLocalStreamState((p) => ({
        ...p,
        currentCamera: ls.getVideoTrack()?.getSettings().deviceId as string,
        currentMicroPhone: ls.getAudioTrack()?.getSettings().deviceId as string
      }))

      setUser((u) => {
        return {
          ...u,
          streamList: [...u.streamList, ls]
        }
      })
      livhub.publish(ls as LocalStream) // 推送localStream
      ls.on('audioChange', ({ mute }) => {
        // localStream监听事件
        setLocalStreamState((p) => ({ ...p, audio: !mute }))
      })
      ls.on('videoChange', ({ mute }) => {
        setLocalStreamState((p) => ({ ...p, video: !mute }))
      })
      setLocalStreamStateState((p) => {
        return { ...p, audio: true, video: true }
      })
      localAction.current = {
        muteAudio: ls.muteAudio as any,
        muteVideo: ls.muteVideo as any,
        unmuteAudio: ls.unmuteAudio as any,
        unmuteVideo: ls.unmuteVideo,
        shareScreen: async () => {
          // 创建共享屏幕视频流
          localScreenStreamRef.current = Livhub.createLocalStream({ screen: true })
          // 初始化
          await localScreenStreamRef.current.initialize()

          setUser((u) => {
            return {
              ...u,
              streamList: [...u.streamList, localScreenStreamRef.current]
            }
          })
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
      }
    }
  }

  useEffect(() => {
    const sync = async () => {}
    sync()
  }, [])
  const onClose = () => {
    livhub.leave()
    history.replace('/login')
  }

  useEffect(() => {
    const init = async () => {
      await livhub.initialize() // 初始化SDK
      livhub.on('userChange', async ({ data }) => {
        const nextUser = await getNextState(setUser)
        // 事件
        if (data.state === 'join') {
          if (data.user.id === nextUser.id) {
            message.error('您已被踢下线！')
            history.replace('/login')
          }
        } else if (data.state === 'leave') {
          if (data.user.id === nextUser.id) {
            message.error('您已被踢下线！')
            history.replace('/login')
          }
        }

        // 直接从接口重新请求userList,不再从事件中处理userList
        // const userList = await livhub.getUserList()
        // console.log(userList)
        // setUserList(userList)

        // 事件
        if (data.state === 'join') {
          if (data.user.streamList?.length > 0) {
            data.user.streamList = await Promise.all(
              data.user.streamList.map(async (stream) => await livhub.createRemoteStream(stream.id))
            )
            setUserList((list) => [...list, data.user] as any)
          }
        } else if (data.state === 'leave') {
          setUserList((list) => list.filter((u1) => u1?.id !== data.user.id))
        }
      })
      livhub.on('streamChange', async ({ data }) => {
        // 事件
        if (data.state === 'publish') {
          const list = await getNextState(setUserList)
          const next = await Promise.all(
            list.map(async (user) => {
              let nUser = user as any
              if (user?.id === data.user.id) {
                if (!nUser.streamList) {
                  nUser.streamList = []
                }
                const stream = await livhub.createRemoteStream(data.stream.id)

                nUser.streamList = [...nUser.streamList, stream]

                return nUser
              }
              return user
            })
          )
          if (!next.some((u) => u.id === data.user.id)) {
            next.push({
              ...data.user,
              streamList: [await livhub.createRemoteStream(data.stream.id)]
            })
          }

          setUserList(next)
        } else if (data.state === 'unpublish') {
          setUserList((list) =>
            list.map((user) => {
              let nUser: typeof user = user!
              if (user?.id === data.user.id) {
                if (!nUser.streamList) {
                  nUser.streamList = []
                }
                nUser.streamList = nUser.streamList.filter(
                  (stream: RemoteStream & any) => stream?.getId() !== data.stream.id
                )
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
      if (Number(query.role) > 0) {
        localStreamInit()
      }
      const userList = await livhub.getUserList() // 获取当前频道用户列表

      setUserList(
        await Promise.all(
          userList.map(async (user) => {
            user.streamList = await Promise.all(
              user.streamList.map(async (stream) => {
                try {
                  return await livhub.createRemoteStream(stream.id)
                } catch (e) {
                  return undefined
                }
              }) as any
            ).then((ls) => ls.filter(Boolean))
            return user
          })
        ).then((ls) => ls.filter((user) => user.streamList?.length > 0))
      )
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

  const isMobile = useMedia('(max-width: 768px)')
  return (
    <div className="meeting">
      <Provider value={{ localStream: localStreamRef } as any}>
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
              <AudioBtn actionRef={localAction as any} />
              <VideoBtn actionRef={localAction as any} />
              {!isMobile && <ScreenBtn actionRef={localAction as any} />}
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
