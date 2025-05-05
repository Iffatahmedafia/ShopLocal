import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { fetchBrands, updateBrandStatus } from "../../api";
import Table from "../../components/Table";



// / Define table columns
const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "province", label: "Province" },
  { key: "store_address", label: "Store Address" },
  { key: "website_link", label: "Website" },
  { key: "supershop_store", label: "Supershops" },
  { key: "category_id", label: "Supershops" },
  { key: "status", label: "Status" },
 
  
];

const BrandList = () => {
  const { user } = useSelector((state) => state.auth);
  console.log("User:", user)
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [brands, setBrands] = useState([])
  const [selectedTab, setSelectedTab] = useState("Pending");


  useEffect(() => {
      const getBrands = async () => {
        const data = await fetchBrands();
        console.log("Brands", data)
        setBrands(data);
        setLoading(false)
      };
      getBrands();
    }, []);

  const handleAdminAction = async (brand, newStatus) => {
    console.log("Approving or Declining brand")
    try {
      const response =await updateBrandStatus(brand.id, newStatus);
      console.log("Response", response)
      if (response.status==200) {
        toast.success("Brand status update successfully!");
        // update local state if needed
        setBrands((prev) =>
          prev.map((b) => (b.id === brand.id ? { ...b, status: newStatus } : b))
        );
      }
    } catch (err) {
      console.error(`Failed to update brand status to ${newStatus}:`, err);
    }
  };
  

    // Add Brand
  const handleAdd = (brand) => {
    console.log("Brand Added:", brand);
  };

  // Edit Brand
  const handleEdit = (brand) => {
    console.log("Editing Brand:", brand);
  
  };

  // Delete Brand
  const handleDelete = (brand) => {
    console.log("Deleting Brand:", brand);
  
  };

  if (loading) return <p className="text-gray-900 mt-6">Loading brands...</p>;

  return (
    <div className="min-h-screen p-2">
        {/* Add Brand Button */}
        <div className="flex justify-between items-center p-3 mt-4 md:px-12">
          <h2 className="text-2xl font-bold">Brands</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="py-2 px-4 text-white bg-red-700 hover:bg-red-800 rounded-lg transition-all"
          >
            + Add Brand
          </button>
        </div>
       {brands.length> 0 ? (
        <div className="">
          <Table
              columns={columns}
              data={brands.map((brand) => ({ id: brand.id, name: brand.name, email: brand.email, phone: brand.phone, province: brand.province, store_address: brand.store_address, website_link: brand.website_link, status: brand.status }))}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isAdmin={user?.is_admin}
              onAdminAction={handleAdminAction}
            />
        </div>
        ):(
        <p className="text-center text-gray-500">No brands yet.</p>
        )}
        {/* <AddProductForm open={isModalOpen} setOpen={setIsModalOpen} title="Add New Product" onSubmit={handleAdd} /> */}
        
       
     
      {/* Add Task Modal
      <AddCategory open={isModalOpen} setOpen={setIsModalOpen} onSubmit={addNewCategory} category={selectedCategory} /> */}

    </div>
  );
         
 
};



export default BrandList