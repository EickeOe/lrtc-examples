import { createContext, useContext, Provider } from 'react'

export default function createUseContext<T>(defaultCurrent: T): [Provider<T>, () => T] {
  const Context = createContext<T>(defaultCurrent)
  function useToContext() {
    return useContext<T>(Context)
  }
  return [Context.Provider, useToContext]
}
