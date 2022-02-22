import type { LocalStream, RemoteStream } from 'livhub'
import { SwitcherOutlined } from '@ant-design/icons'
import { useCallback, useEffect, useRef } from 'react'
import './index.less'

interface Props {
  streamList: LocalStream[] | RemoteStream[]
}

export default function VideoView({ streamList }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (streamList.length === 0) {
      return
    }
    streamList.map((stream: any) => stream?.setRender(ref.current as HTMLDivElement))
    ref.current?.firstElementChild?.classList.add('active')

    return () => {
      streamList.map((stream: any) => stream?.removeRender())
    }
  }, [streamList])

  const onSwitchVideo = useCallback((e) => {
    e.stopPropagation()
    const v1 = ref.current?.firstElementChild
    const v2 = ref.current?.lastElementChild
    v1?.classList.toggle('active')
    v2?.classList.toggle('active')
    console.log(ref.current?.childNodes)
  }, [])
  return (
    <div className="videoView">
      {2 > 1 && (
        <div onClick={onSwitchVideo} className="switchVideoBtn">
          <SwitcherOutlined />
        </div>
      )}

      <div ref={ref} className="videoWrap">
        {/* <video></video>
        <video></video> */}
      </div>
    </div>
  )
}
