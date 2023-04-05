import Livhub, { LocalStream } from 'livhub'
import { atom } from 'recoil'

export const livhubState = atom<Livhub>({
  key: 'livhubState',
  default: Livhub.create({
    appId: 'livhub',
    token: 'livhub',
    protocol: 'xxx'
  } as any),
  dangerouslyAllowMutability: true
})

export const userState = atom<userType>({
  key: 'userState',
  default: {} as userType,
  dangerouslyAllowMutability: true
})

export const userListState = atom<Partial<Unwrap<typeof Livhub.prototype.getUserList>>>({
  key: 'userListState',
  default: [],
  dangerouslyAllowMutability: true
})
export const localStreamState = atom<LocalStream>({
  key: 'localStreamState',
  default: null as any,
  dangerouslyAllowMutability: true
})

export const localStreamStateState = atom({
  key: 'localStreamStateState',
  default: {
    audio: false,
    video: false,
    screen: false,
    currentMicroPhone: null as any as string,
    // currentSpeaker: null,
    currentCamera: null as any as string
  },
  dangerouslyAllowMutability: true
})
export const localScreenStreamState = atom({
  key: 'localScreenStreamState',
  default: {
    stream: null,
    screen: false
  },
  dangerouslyAllowMutability: true
})
export const activeViewState = atom<{
  user: userType
  videoDom: HTMLElement
  parentDom: HTMLDivElement
}>({
  key: 'activeViewState',
  default: null as any,
  dangerouslyAllowMutability: true
})
