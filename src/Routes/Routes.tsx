import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../Pages/Home/Home/Home";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import Error from "../Pages/Error/Error";
import Dashboard from "../Layout/Dashboard";
import AllUsers from "../Pages/Dashboard/AllUsers/AllUsers";
import BookAParcel from "../Pages/Dashboard/BookParcel/BookAParcel";
import MyParcels from "../Pages/Dashboard/MyParcels/MyParcels";
import AllParcels from "../Pages/Dashboard/AllParcels/AllParcels";
import UpdateParcel from "../Pages/Dashboard/UpdateParcel/UpdateParcel";
import Payment from "../Payment/Payment";
import MyDeliveryList from "../Pages/Dashboard/MyDeliveryList/MyDeliveryList";
import AllDeliveryMen from "../Pages/Dashboard/AllDeliveryMen/AllDeliveryMen";
import MyProfile from "../Pages/Dashboard/MyProfile/MyProfile";
import MyReviews from "../Pages/Dashboard/MyReviews/MyReviews";
import PrivateRoute from "./PrivateRoute";
import Statistics from "../Pages/Dashboard/Statistics/Statistics";
import PaymentHistory from "../Pages/Dashboard/PaymentHistory/PaymentHistory";

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
        {
          path:'/payment/:id',
          element:<Payment></Payment>
        }        
      ]
    },
    {
      path:'/dashboard',
      element:<PrivateRoute><Dashboard></Dashboard></PrivateRoute>,
      children:[
        // normal user routes
        {
          path:'bookParcel',
          element:<BookAParcel></BookAParcel>
        },
        {
          path:'myParcels',
          element:<MyParcels></MyParcels>
        },
        {
          path:'update/:id',
          element:<UpdateParcel></UpdateParcel>,
          loader:({params})=>fetch(`https://parcel-management-server-iota.vercel.app/bookParcel/${params.id}`)
        },
        {
          path:'myProfile',
          element:<MyProfile></MyProfile>
        },
        {
          path:'paymentHistory',
          element:<PaymentHistory></PaymentHistory>
        },
        // moderator routes
        {
          path:'myDeliveryList',
          element:<MyDeliveryList></MyDeliveryList>
        },
        {
          path:'myReviews',
          element:<MyReviews></MyReviews>
        }
        // admin routes
        ,{
          path:'allUser',
          element:<AllUsers></AllUsers>
        },
        {
          path:'allParcels',
          element:<AllParcels></AllParcels>
        },
        {
          path:'allDeliveryMen',
          element:<AllDeliveryMen></AllDeliveryMen>
        },
        {
          path:'statistics',
          element:<Statistics></Statistics>
        }
      ]
    }
  ]);
  