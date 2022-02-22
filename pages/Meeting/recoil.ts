import Livhub, { LocalStream } from 'livhub'
import { atom } from 'recoil'

export const livhubState = atom<Livhub>({
  key: 'livhubState',
  default: Livhub.create({
    appId: 'livhub',
    token: 'livhub',
    protocol: 'xxx'
  } as any)
})

export const userState = atom<userType>({
  key: 'userState',
  default: {} as userType
})

export const userListState = atom<Partial<Unwrap<typeof Livhub.prototype.getUserList>>>({
  key: 'userListState',
  default: []
})
export const localStreamState = atom<LocalStream>({
  key: 'localStreamState',
  default: null as any
})

export const localStreamStateState = atom({
  key: 'localStreamStateState',
  default: {
    audio: true,
    video: true,
    screen: false,
    currentMicroPhone: null as any as string,
    // currentSpeaker: null,
    currentCamera: null as any as string
  }
})
export const localScreenStreamState = atom({
  key: 'localScreenStreamState',
  default: {
    stream: null,
    screen: false
  }
})
export const activeViewState = atom<{
  user: userType
  videoDom: HTMLElement
  parentDom: HTMLDivElement
}>({
  key: 'activeViewState',
  default: null as any
})
