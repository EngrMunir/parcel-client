import Swal from "sweetalert2";
import {
  useChangeUserRoleMutation,
  useGetUsersQuery,
} from "../../../redux/features/user/userApi";

const AllUsers = () => {
  const { data: users = {}, isLoading } = useGetUsersQuery(undefined);
  const [changeUserRole] = useChangeUserRoleMutation();

  const filteredUsers = users.data?.filter(
    (user) => user.role === "CUSTOMER"
  ) || [];

  const handleRoleChange = (userId: string, newRole: string) => {
    const info = { id: userId, role: newRole };

    Swal.fire({
      title: `Are you sure you want to make this user ${newRole}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, change role`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await changeUserRole(info).unwrap();
          if (res?.modifiedCount > 0 || res?.success) {
            Swal.fire("Success!", "User role updated", "success");
          }
        } catch (error) {
          Swal.fire("Error!", "Something went wrong", "error");
        }
      }
    });
  };

  if (isLoading) return <p className="text-center py-6">Loading users...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        👥 All Customers ({filteredUsers.length})
      </h2>
      <div className="overflow-x-auto shadow-md rounded-lg bg-white">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <select
                    defaultValue={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="select select-sm select-bordered"
                  >
                    <option value="CUSTOMER">CUSTOMER</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="AGENT">AGENT</option>
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
