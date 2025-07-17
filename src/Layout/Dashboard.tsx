import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAxiosPublic from '../hook/useAxiosPublic';
import useAuth from '../hook/useAuth';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';


const Dashboard = () => {
    const axiosPublic=useAxiosPublic();
    const {user, loading }=useAuth();
    const navigate = useNavigate();
    
    console.log('user user',user?.email);

    const {data:loggedUser=[]}=useQuery({
        queryKey:['email'],
        enabled:!loading,
        queryFn: async()=>{
            const res = await axiosPublic.get(`/userByEmail/${user.email}`)
            console.log(res.data)
            return res.data[0];
        }
    })

    // console.log(loggedUser?.role)

    const role = loggedUser?.role;

    useEffect(() => {
        if (role === 'admin') {
            navigate('/dashboard/statistics');
        } else if (role === 'deliveryMen') {
            navigate('/dashboard/myDeliveryList');
        } else if (role === 'user') {
            navigate('/dashboard/myProfile');
        }
    }, [role, navigate]);

    if(loading){
        return <p>Loading....</p>
    }
    return (
        <div className='flex  flex-col md:flex-row lg:flex-row items-center	md:items-start lg:items-start min-h-screen'>
            {/* sidebar */}
            <div className='w-64 min-h-full bg-orange-400'>
                <ul className='menu p-4'>
                    {
                        role =='CUSTOMER' &&
                        (
                            <>
                                <li><NavLink to="/dashboard/bookParcel">Book a parcel</NavLink></li>
                                <li><NavLink to="/dashboard/myParcels">My Parcels</NavLink></li>
                            </>
                        )
                    }
                    {
                        role ==='AGENT' &&
                        (
                            <>
                                <li><NavLink to="/dashboard/myDeliveryList">My Delivery List</NavLink></li>
                            </>
                        )
                    }
                    {
                        role ==='ADMIN'&&
                        (
                            <>
                                <li><NavLink to="/dashboard/allParcels">All Parcels</NavLink></li>
                                <li><NavLink to="/dashboard/allUser">All Users</NavLink></li>   
                            </>
                        )
                    }
                    <div className="divider"></div>
                    <li><Link to="/">Home</Link></li>
                </ul>
            </div>
            <div className='flex-1 p-8'>
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default Dashboard;