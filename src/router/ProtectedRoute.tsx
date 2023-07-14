import { ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext, AppContextType } from "src/context/AppProvider";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loadUser, token } = useContext(AppContext) as AppContextType
  return (
    <>
      {(user.id) && children}
      {((!user.id && !loadUser) || !token) && <Navigate to={'/login'} />}
    </>
  )
}