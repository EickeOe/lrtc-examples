import { Button, Dropdown, Menu } from 'antd'
import { AudioOutlined, DownOutlined, AudioMutedOutlined, CheckOutlined } from '@ant-design/icons'
import { MutableRefObject, useEffect, useMemo } from 'react'
import { localStreamStateState } from '../../recoil'
import { useRecoilState, useRecoilValue } from 'recoil'
import { useContext } from '../../Meeting'
import Livhub from 'livhub'
import { useAsync } from 'react-use'
import './index.less'
interface Props {
  actionRef: MutableRefObject<{
    muteAudio: Function
    muteVideo: Function
    unmuteAudio: Function
    unmuteVideo: Function
    shareScreen: Function
  }>
}
export default function AudioBtn({ actionRef }: Props) {
  const { localStream } = useContext()
  const [localStreamState, setLocalStreamState] = useRecoilState(localStreamStateState)

  const { value: speakers = [] } = useAsync(async () => {
    return await Livhub.getSpeakers()
  }, [])
  const { value: microphones = [] } = useAsync(async () => {
    return await Livhub.getMicrophones()
  }, [])

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Button
        type="link"
        style={{ height: 'auto', paddingRight: 0 }}
        onClick={() => {
          if (localStreamState.audio) {
            actionRef.current.muteAudio()
          } else {
            actionRef.current.unmuteAudio()
          }
        }}
      >
        <div style={{ fontSize: 20 }}>{localStreamState.audio ? <AudioOutlined /> : <AudioMutedOutlined />}</div>
        <div>{localStreamState.audio ? '静音' : '取消静音'}</div>
      </Button>
      <Dropdown
        overlay={
          <Menu>
            <Menu.ItemGroup title="选择扬声器">
              {speakers.map((speaker) => {
                return (
                  <Menu.Item
                    key={speaker.deviceId}
                    icon={
                      localStreamState.currentMicroPhone === speaker.deviceId ? (
                        <CheckOutlined className="highlight" style={{ color: '#40a9ff' }} />
                      ) : (
                        <CheckOutlined style={{ color: 'transparent' }} />
                      )
                    }
                    onClick={async () => {
                      // console.log(await Livhub.getSpeakers())
                    }}
                  >
                    {speaker.label}
                  </Menu.Item>
                )
              })}
            </Menu.ItemGroup>
            <Menu.ItemGroup title="选择麦克风">
              {microphones.map((microphone) => {
                return (
                  <Menu.Item
                    key={microphone.deviceId}
                    icon={
                      localStreamState.currentMicroPhone === microphone.deviceId ? (
                        <CheckOutlined className="highlight" style={{ color: '#40a9ff' }} />
                      ) : (
                        <CheckOutlined style={{ color: 'transparent' }} />
                      )
                    }
                    onClick={async () => {
                      if (localStreamState.currentMicroPhone === microphone.deviceId) {
                        return
                      }
                      await localStream.switchDevice({ deviceId: microphone.deviceId, type: 'audio' })
                      setLocalStreamState((p) => ({
                        ...p,
                        currentMicroPhone: localStream.getAudioTrack()?.getSettings().deviceId as string
                      }))
                    }}
                  >
                    {microphone.label}
                  </Menu.Item>
                )
              })}
            </Menu.ItemGroup>
            <Menu.Item key="3">音频选项</Menu.Item>
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
