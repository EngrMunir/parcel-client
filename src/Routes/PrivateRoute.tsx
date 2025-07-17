import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../Providers/AuthProviders';
import {  type ReactNode } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
}
const PrivateRoute = ({children}: PrivateRouteProps) => {
    const location = useLocation();
    const auth = useContext(AuthContext);
    if (!auth) {
        return <div>Loading...</div>;
    }
    const { user, loading } = auth;
    

    if(loading){
        return <progress className='progress w-56'></progress>
    }
    if(user){
        return children;
    }
    return <Navigate state={{from: location}} to="/login"></Navigate>
};

export default PrivateRoute;