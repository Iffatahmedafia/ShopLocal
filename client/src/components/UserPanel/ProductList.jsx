import { useState, useEffect } from "react";
import Table from '../Table';
import { fetchProducts, updateProductStatus } from "../../api";
import DialogWrapper from "../DialogWrapper";
import AddProductForm from "./AddProductForm";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import Tabs from "../Tabs";

// / Define table columns
const columns = [
  { key: "image", label: "Image" },
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
  { key: "brand", label: "Brand" },
  { key: "price", label: "Price" },
  { key: "retail_store", label: "Store/Supermarkets" },
  { key: "online_store", label: "Website" },
  { key: "status", label: "Status" },
 
  
];

const ProductList = () => {
  const { user } = useSelector((state) => state.auth);
  console.log("User:", user)
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([])
  const [selectedTab, setSelectedTab] = useState("Pending");


  useEffect(() => {
      const getProducts = async () => {
        const data = await fetchProducts();
        console.log("Products:", data)
        let filtered = data;
        if (user.is_brand) {
          filtered = data.filter(
            (product) => product.user === user.id
          );
        }
        setProducts(filtered);
        setLoading(false)
      };
      getProducts();
    
    }, [user]);

    const tabOptions = [
      { value: "Pending", label: "Pending" },
      { value: "Approved", label: "Approved" },
      { value: "Declined", label: "Rejected" },
    ];

    const filteredProduct = products.filter((product) => {
      if (selectedTab === "Pending") {
        return product.status === "Pending";
      } else if (selectedTab === "Approved") {
        return product.status === "Approved";
      } else if (selectedTab === "Declined" || selectedTab === "Rejected") {
        return product.status === "Declined" || product.status === "Rejected";
      } else {
        return true; // fallback: show all
      }
    });

const handleAdminAction = async (product, newStatus) => {
    console.log("Approving or Declining product")
    try {
      const response =await updateProductStatus(product.id, newStatus);
      console.log("Response", response)
      if (response.status==200) {
        toast.success("Product status updated successfully!");
        // update local state if needed
        setBrands((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, status: newStatus } : p))
        );
      }
    } catch (err) {
      console.error(`Failed to update product status to ${newStatus}:`, err);
    }
  };
    

  const handleAdd = (product) => {
    console.log("Product Added:", product);
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

  if (loading) return <p className="text-gray-900 mt-6">Loading products...</p>;

  return (
    <div className="p-2">
        {/* Add Task Button */}
        <div className="flex justify-center md:justify-end p-3 mt-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="py-3 px-6 text-white bg-red-700 hover:to-red-800 rounded-lg transition-all"
          >
            + Add Product
          </button>
        </div>
        <div className="md:ml-12">
          <h2 className="text-2xl font-bold text-center md:text-start mb-4">Products</h2>
        </div>
        {products.length> 0 ? (
        <div className="">
        <Tabs
          tabs={tabOptions}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
        />
          <Table
              columns={columns}
              data={filteredProduct.map((product) => ({ id: product.id, image: product.image, name: product.name, brand: product.brand, description: product.description, price: product.price, retail_store: product.retail_store, online_store: product.online_store, status: product.status }))}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isAdmin = {user?.is_admin}
              onAdminAction={handleAdminAction}
            />
        </div>
        ):(
        <p className="text-center text-gray-500">No brands yet.</p>
      )}
        <AddProductForm open={isModalOpen} setOpen={setIsModalOpen} title="Add New Product" onSubmit={handleAdd} />
        
       
     
      {/* Add Task Modal
      <AddCategory open={isModalOpen} setOpen={setIsModalOpen} onSubmit={addNewCategory} category={selectedCategory} /> */}

    </div>
  );
         
 
};



export default ProductList