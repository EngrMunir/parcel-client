import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Error from "../Pages/Error/Error";

export const router = createBrowserRouter([
    {
      path: "/",
      element: <Main></Main>,
      errorElement:<Error></Error>,
      children:[
        {
            path:'/',
            element:<Login></Login>
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
  