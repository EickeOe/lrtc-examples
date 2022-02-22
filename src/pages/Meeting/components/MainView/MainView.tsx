import { useEffect, useRef } from 'react'
import { useRecoilValue, useRecoilState } from 'recoil'
import { activeViewState, livhubState, localStreamState, userState } from '../../recoil'
export default function MainView() {
  const divRef = useRef<HTMLDivElement>(null as any)
  const [activeUser, setActiveUser] = useRecoilState(activeViewState)
  useEffect(() => {
    if (activeUser) {
      divRef.current.appendChild(activeUser.videoDom)
    }
    return () => {
      if (activeUser) {
        activeUser.parentDom.appendChild(activeUser.videoDom)
      }
    }
  }, [activeUser])
  return <div ref={divRef} id="mainView" style={{ height: '100%', width: '100%', position: 'relative' }}></div>
}
