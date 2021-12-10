import { createContext, ReactNode, useContext, useState } from "react"
import { storeState } from "../state"

const LOCAL_STORAGE_KEY = 'auth.state'

type AuthState = {
    username?: string
    password?: string
}

type AuthContextProps = {
    state: AuthState
    changeUsername: (username: string) => void
    changePassword: (password: string) => void
}

type AuthProviderProps = {
    children: ReactNode
}

const initState = {}
const storedRawState = localStorage.getItem(LOCAL_STORAGE_KEY)
const storedState = storedRawState ? JSON.parse(storedRawState) : initState

const AuthContext = createContext<AuthContextProps>({
    state: storedState,
    changeUsername: () => {},
    changePassword: () => {}
})

export const AuthProvider = (props: AuthProviderProps) => {
    const [state, setState] = useState<AuthState>(storedState)
    const store = (state: AuthState) => storeState(state, LOCAL_STORAGE_KEY)
    const update = (updated: AuthState) => {
        setState(updated)
        store(updated)
    }

    const changeUsername = (username?: string) => update({ ...state, username })
    const changePassword = (password?: string) => update({ ...state, password })

    return (
        <AuthContext.Provider
            value={{
                state: state,
                changeUsername,
                changePassword
            }}
        >
            { props.children }
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
