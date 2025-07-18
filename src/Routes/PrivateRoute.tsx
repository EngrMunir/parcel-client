import { Navigate, useLocation } from 'react-router-dom';
import {  type ReactNode } from 'react';
import { useAppSelector } from '../redux/features/hook';
import { selectCurrentUser } from '../redux/features/auth/authSlice';

interface PrivateRouteProps {
  children: ReactNode;
}
const PrivateRoute = ({children}: PrivateRouteProps) => {
    const location = useLocation();
    const user = useAppSelector(selectCurrentUser);
    
    if(user){
        return children;
    }
    return <Navigate state={{from: location}} to="/login"></Navigate>
};

export default PrivateRoute;