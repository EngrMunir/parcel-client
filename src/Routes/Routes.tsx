import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Error from "../Pages/Error/Error";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../Layout/Dashboard";
import AllUsers from "../Pages/Dashboard/AllUser/AllUsers";
import AllParcels from "../Pages/Dashboard/AllParcels/AllParcels";
import MyDeliveryList from "../Pages/Dashboard/MyDeliveryList/MyDeliveryList";
import BookAParcel from "../Pages/Dashboard/BookParcel/BookParcel";
import CustomerParcels from "../Pages/Dashboard/CustomerParcels/CustomerParcels";
import ParcelTracking from "../Pages/Dashboard/ParcelTracking/ParcelTracking";
import DashboardAnalytics from "../Pages/Dashboard/Analytics/DashboardAnalytics";

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
          path:'customerParcels',
          element:<CustomerParcels></CustomerParcels>
        },
        {
           path: 'customer/tracking/:parcelId',
            element: <ParcelTracking />,
        },
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
        {
          path: "analytics",
          element: <DashboardAnalytics />
        }

      ]
    }
  ]);