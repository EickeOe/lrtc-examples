import { Button, Dropdown, Menu } from 'antd'
import { DesktopOutlined, DownOutlined } from '@ant-design/icons'
import { MutableRefObject } from 'react'
import { useRecoilValue } from 'recoil'
import { localScreenStreamState, localStreamStateState } from '../recoil'
interface Props {
  actionRef: MutableRefObject<{
    muteAudio: Function
    muteVideo: Function
    unmuteAudio: Function
    unmuteVideo: Function
    shareScreen: Function
  }>
}
export default function ScreenBtn({ actionRef }: Props) {
  const localScreenStream = useRecoilValue(localScreenStreamState)
  return (
    <div style={{ display: 'flex', alignItems: 'center', width: 120, justifyContent: 'center' }}>
      <Button
        type="link"
        style={{ height: 'auto', paddingRight: 0 }}
        onClick={() => {
          if (localScreenStream.screen) {
            // actionRef.current.muteAudio()
          } else {
            actionRef.current.shareScreen()
          }
        }}
      >
        <div style={{ fontSize: 20 }}>{localScreenStream.screen ? <DesktopOutlined /> : <DesktopOutlined />}</div>
        <div>{localScreenStream.screen ? '停止分享' : '分享屏幕'}</div>
      </Button>
      {/* <Dropdown
        overlay={
          <Menu>
            <Menu.Item key="1">Clicking me will not close the menu.</Menu.Item>
            <Menu.Item key="2">Clicking me will not close the menu also.</Menu.Item>
            <Menu.Item key="3">Clicking me will close the menu.</Menu.Item>
          </Menu>
        }
        arrow
        trigger={['click']}
      >
        <Button type="link" icon={<DownOutlined />} />
      </Dropdown> */}
    </div>
  )
}
