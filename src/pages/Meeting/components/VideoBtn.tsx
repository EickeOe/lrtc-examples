import { Button, Dropdown, Menu } from 'antd'
import { VideoCameraOutlined, VideoCameraAddOutlined, DownOutlined, CheckOutlined } from '@ant-design/icons'
import { MutableRefObject } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { localStreamStateState } from '../recoil'
import { useAsync } from 'react-use'
import Livhub from 'livhub'
import { useContext } from '../Meeting'
interface Props {
  actionRef: MutableRefObject<{
    muteAudio: Function
    muteVideo: Function
    unmuteAudio: Function
    unmuteVideo: Function
    shareScreen: Function
  }>
}
export default function VideoBtn({ actionRef }: Props) {
  const { localStream } = useContext()
  const [localStreamState, setLocalStreamState] = useRecoilState(localStreamStateState)

  const { value: cameras = [] } = useAsync(async () => {
    return await Livhub.getCameras()
  }, [])
  return (
    <div style={{ display: 'flex', alignItems: 'center', width: 120, justifyContent: 'center' }}>
      <Button
        type="link"
        style={{ height: 'auto', paddingRight: 0 }}
        onClick={() => {
          if (localStreamState.video) {
            actionRef.current.muteVideo()
          } else {
            actionRef.current.unmuteVideo()
          }
        }}
      >
        <div>{localStreamState.video ? <VideoCameraOutlined /> : <VideoCameraAddOutlined />}</div>
        <div>{localStreamState.video ? '停止视频' : '开启视频'}</div>
      </Button>
      <Dropdown
        overlay={
          <Menu>
            <Menu.ItemGroup title="选择麦克风">
              {cameras.map((camera) => {
                return (
                  <Menu.Item
                    key={camera.deviceId}
                    icon={
                      localStreamState.currentCamera === camera.deviceId ? (
                        <CheckOutlined className="highlight" style={{ color: '#40a9ff' }} />
                      ) : (
                        <CheckOutlined style={{ color: 'transparent' }} />
                      )
                    }
                    onClick={async () => {
                      if (localStreamState.currentCamera === camera.deviceId) {
                        return
                      }
                      await localStream.switchDevice({ deviceId: camera.deviceId, type: 'audio' })
                      setLocalStreamState((p) => ({
                        ...p,
                        currentCamera: localStream.getVideoTrack()?.getSettings().deviceId as string
                      }))
                    }}
                  >
                    {camera.label}
                  </Menu.Item>
                )
              })}
            </Menu.ItemGroup>
            <Menu.Item key="3">视频选项</Menu.Item>
          </Menu>
        }
        arrow
        trigger={['click']}
      >
        <Button type="link" icon={<DownOutlined />} />
      </Dropdown>
    </div>
  )
}
