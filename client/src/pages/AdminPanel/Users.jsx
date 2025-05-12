import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { fetchProducts, fetchUsers } from "../../api";
import AddProductForm from "../../components/UserPanel/AddProductForm";
import Table from "../../components/Table";
import Tabs from "../../components/Tabs";

// / Define table columns
const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "is_admin", label: "Admin" },
  { key: "is_brand", label: "Brand" }
 
 
  
];

const Users = () => {
  const { user } = useSelector((state) => state.auth);
  console.log("User:", user)
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([])
  

  useEffect(() => {
    const getUsers = async () => {
      const data = await fetchUsers();
      console.log("Users data:", data)
      setUsers(data);
      setLoading(false)
    };
    getUsers();
  
  }, [user]);


   
  const handleAdd = (productData) => {
    console.log("Product Added:", productData);
    // axios.post("/api/products", productData)...
  };

  // Edit Category
  const handleEdit = (product) => {
    console.log("Editing Category:", product);
  
  };


  // Delete Category
  const handleDelete = (product) => {
    console.log("Deleting Product:", product);
  
  };

  if (loading) return <p className="text-gray-900 mt-6">Loading users...</p>;

  return (
    <div className="min-h-screen p-2">
        {/* Add Task Button */}
        <div className="flex justify-between items-center p-3 mt-4 md:px-12">
          <h2 className="text-2xl font-bold">Users</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="py-2 px-4 text-white bg-red-700 hover:bg-red-800 rounded-lg transition-all"
          >
            + Add User
          </button>
        </div>
       
        <div className="">
        
          <Table
              columns={columns}
              data={users.map((user) => ({ id: user.id, name: user.name, email: user.email, is_admin: user.is_admin? "Yes": "No", is_brand: user.is_brand? "Yes": "No" }))}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
        </div>
       
       
     
      {/* Add Task Modal
      <AddCategory open={isModalOpen} setOpen={setIsModalOpen} onSubmit={addNewCategory} category={selectedCategory} /> */}

    </div>
  );
         
 
};



export default Users