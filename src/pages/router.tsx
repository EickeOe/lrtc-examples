import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

const Login = lazy(() => import('@/pages/Login/Login'))
const Meeting = lazy(() => import('@/pages/Meeting/Meeting'))

export default function AppRouter() {
  return (
    <Router>
      <Suspense fallback={''}>
        <Switch>
          <Route path="/meeting" exact component={Meeting} />
          <Route path="/login" exact component={Login} />
          <Route path="*">
            <Redirect to="/login" />
          </Route>
        </Switch>
      </Suspense>
    </Router>
  )
}
