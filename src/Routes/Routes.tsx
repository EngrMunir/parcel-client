import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Error from "../Pages/Error/Error";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import PrivateRoute from "./PrivateRoute";

export const router = createBrowserRouter([
    {
      path: "/",
      element: <Main></Main>,
      errorElement:<Error></Error>,
      children:[
        {
            path:'/',
            element:<Home></Home>
        },
        {
            path:'/login',
            element:<Login></Login>
        },
        {
            path:'/register',
            element:<Register></Register>
        },       
      ]
    },
    {
      path:'/dashboard',
      element:<PrivateRoute><Dashboard></Dashboard></PrivateRoute>,
      children:[
        // Customer
        {
          path:'bookParcel',
          element:<BookAParcel></BookAParcel>
        },
        {
          path:'myParcels',
          element:<MyParcels></MyParcels>
        },
        // agent routes
        {
          path:'myDeliveryList',
          element:<MyDeliveryList></MyDeliveryList>
        },

        // admin routes
        {
          path:'allUser',
          element:<AllUsers></AllUsers>
        },
        {
          path:'allParcels',
          element:<AllParcels></AllParcels>
        },
      ]
    }
  ]);
  