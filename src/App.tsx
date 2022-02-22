import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import AppRouter from '@/pages/router'
import './styles/index.less'
import 'antd/dist/antd.css'
import { RecoilRoot } from 'recoil'
export default function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <RecoilRoot>
        <AppRouter />
      </RecoilRoot>
    </ConfigProvider>
  )
}
