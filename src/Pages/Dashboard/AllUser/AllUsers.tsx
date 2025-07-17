import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hook/useAxiosSecure';
import Swal from 'sweetalert2';

const AllUsers = () => {
    const axiosSecure = useAxiosSecure();

    const { data: users=[], isLoading, refetch }= useQuery({
        queryKey:['user'],
        queryFn: async ()=>{
            const res = await axiosSecure.get('/users');
            console.log(res.data)
            return res.data;
        }
    })

    if(isLoading){
        return <p>Loading....</p>
    }

    const filteredUsers = users.filter(user => user.role ==='user')

    const handleRole=(userId, newRole)=>{
      const info={
        id: userId,
        role: newRole
      }
      Swal.fire({
        title: `Are you sure to make ${newRole}?`,
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `Yes, make ${newRole}!`
      }).then((result) => {
        if (result.isConfirmed) {
         axiosSecure.patch('/users',info)
         .then(res =>{
          if(res.data.modifiedCount>0){
            Swal.fire({
              title: "Congrats",
              text: `Role changed to ${newRole} successfully`,
              icon: "success"
            });
            refetch();
          }
         })
        }
      });
    }
    return (
        <div>
            <h2>All Users:{filteredUsers.length}</h2>
            <div className="overflow-x-auto">
              <table className="table">
                {/* head */}
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone Number</th>
                    <th>Number of Parcel Booked</th>
                    <th>Total Spent of Amount</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    filteredUsers.map(user=>(<tr key={user._id}>
                      <th>{user.name}</th>
                      <td>{user.phoneNumber}</td>
                      <td>0</td>
                      <td>Blue</td>
                      <td>
                        <select defaultValue={user.role} onChange={(e)=>handleRole(user._id, e.target.value)}>
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          <option value="deliveryMen">Delivery Men</option>
                        </select>
                      </td>
                    </tr>))
                  }
                      
                </tbody>
              </table>
            </div>
        </div>
    );
};

export default AllUsers;