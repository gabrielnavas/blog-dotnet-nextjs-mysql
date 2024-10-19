'use client'

import { User } from "@/services/models";
import { signin } from "@/services/signin";
import React, { useCallback, useEffect } from "react";

export type AuthContextType = {
  user: User | null
  token: string | null
  isAuth: boolean
  isLoading: boolean
  handleSignIn: (email: string, password: string) => Promise<void>
  handleSignOut: () => void
  setIsLoading: (isLoading: boolean) => void
}

const inititalData = {
  isAuth: false,
  user: null,
  token: null,
  isLoading: false
} as AuthContextType

export const AuthContext = React.createContext<AuthContextType | null>(null)

type Props = {
  children: React.ReactNode
}

export const AuthProvider: React.FC<Props> = ({ children }) => {

  const [data, setData] = React.useState<AuthContextType>(inititalData)

  // const {handleSignOut: handleSignOutPost} = useContext(FeedContext) as FeedContextType

  useEffect(() => {
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")
    if (token && user) {
      setData(prev => ({
        ...prev,
        token,
        user: JSON.parse(user),
        isAuth: true
      }))
    } else {
      setData(prev => ({
        ...prev,
        token: '',
      }))
    }
  }, [])

  const setIsLoading = useCallback((isLoading: boolean) => {
    setData(prev => ({
      ...prev,
      isLoading,
    }))
  }, [])

  const handleSignIn = useCallback(async (email: string, password: string): Promise<void> => {
    const result = await signin({
      email, password
    })
    if (result.error) {
      throw new Error(result.message || 'Algo Aconteceu!')
    } else {
      if (result.data !== undefined) {
        const token = result.data.token as string
        const user = result.data.user as User
        setData(prev => ({ ...prev, token, user, isAuth: true }))
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
      } else {
        throw new Error('Ocorreu um problema na autenticação!')
      }
    }
  }, [])

  const handleSignOut = useCallback(() => {
    localStorage.clear()
    setData(({ ...inititalData }))
    // handleSignOutPost()
  }, [])

  return (
    <AuthContext.Provider value={{
      user: data.user,
      token: data.token,
      isLoading: data.isLoading,
      isAuth: data.isAuth,
      handleSignIn,
      handleSignOut,
      setIsLoading,
    }}>
      {children}
    </AuthContext.Provider>
  )
} 