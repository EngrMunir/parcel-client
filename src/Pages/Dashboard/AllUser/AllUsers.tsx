import Swal from "sweetalert2";
import { useChangeUserRoleMutation, useGetUsersQuery } from "../../../redux/features/user/userApi";

const AllUsers = () => {
  const { data: users = [], isLoading } = useGetUsersQuery(undefined);
  const [changeUserRole] = useChangeUserRoleMutation();

  const filteredUsers = users.filter((user) => user.role === "user");

  const handleRoleChange = (userId, newRole) => {
    const info = {
      id: userId,
      role: newRole,
    };

    Swal.fire({
      title: `Are you sure to make ${newRole}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, make ${newRole}!`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await changeUserRole(info).unwrap();
          if (res?.modifiedCount > 0) {
            Swal.fire(
              "Success!",
              `Role changed to ${newRole} successfully`,
              "success"
            );
          }
        } catch (error) {
          Swal.fire("Error!", "Something went wrong", "error");
        }
      }
    });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        All Users: {filteredUsers.length}
      </h2>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Number of Parcels Booked</th>
              <th>Total Spent</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.phoneNumber}</td>
                <td>0</td>
                <td>৳0</td>
                <td>
                  <select
                    defaultValue={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="deliveryMen">Delivery Men</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
