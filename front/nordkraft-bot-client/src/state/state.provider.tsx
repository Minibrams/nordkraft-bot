import { ReactNode } from "react";
import { AuthProvider } from "./auth/auth.state.provider";

type StateProviderProps = {
    children: ReactNode
}

export const StateProvider = (props: StateProviderProps) => {
    return (
        <AuthProvider>
            { props.children }
        </AuthProvider>
    )
}