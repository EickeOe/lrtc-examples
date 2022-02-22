# livhub

livhub 是 livhub Web SDK 的主入口，通过 livhub 方法可以创建一个实时音视频通信的 livhub 对象和本地音视频流对象。

## 使用场景

## API

### Livhub

#### static VERSION

- static VERSION: string
  Livhub 版本号

#### static create()

#### static createLocalStream()

#### static createRemoteStream()

#### static getCameras()

#### static getMicrophones()

#### static getSpeakers()

#### setOptions()

#### initialize()

#### createRemoteStream()

#### join()

#### leave()

#### isChannel()

#### sendBroadcastMessage()

#### publish()

#### unpublish()

#### checkSystemRequirements()

#### getUserList()

### Stream

#### getTracks()

#### addTrack()

#### removeTrack()

#### getAudioTrack()

#### getVideoTrack()

#### setRender()

#### handleVideoEvent()

#### close()

#### muteAudio()

#### muteVideo()

#### unmuteAudio()

#### unmuteVideo()

#### getId()

#### setAudioOutput()

#### setAudioVolume()

#### getAudioLevel()

#### hasAudio()

#### hasVideo()

#### getVideoFrame()

### LocalStream

#### initialize()

#### shareScreen()

#### switchDevice()

### RemoteStream

#### initialize()
