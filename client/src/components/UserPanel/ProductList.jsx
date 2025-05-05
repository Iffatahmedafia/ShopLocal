import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

import { fetchProducts, updateProductStatus, deleteProduct } from "../../api";
import Table from '../Table';
import Tabs from "../Tabs";
import AddProductForm from "./AddProductForm";
import DeleteModal from "../DeleteModal";


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
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedTab, setSelectedTab] = useState("Pending");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);


  useEffect(() => {
      const getProducts = async () => {
        const data = await fetchProducts();
        console.log("Products:", data)
        let filtered = data;
        if (user.is_brand) {
          filtered = data.filter(
            (product) => product.user === user.id && product.is_trashed === false
          );
        }
        setProducts(filtered);
        setLoading(false)
      };
      getProducts();
    
    }, [user]);

    const tabOptions = [
      { value: "Pending", label: "Pending", icon: <FaClock size={18} /> },
      { value: "Approved", label: "Approved", icon: <FaCheckCircle size={18} /> },
      { value: "Rejected", label: "Rejected", icon: <FaTimesCircle size={18} />  },
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
      const response = await updateProductStatus(product.id, newStatus);
      console.log("Response", response)
      if (response.status==200) {
        toast.success("Product status updated successfully!");
        // update local state if needed
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, status: newStatus } : p))
        );
      }
    } catch (err) {
      console.error(`Failed to update product status to ${newStatus}:`, err);
    }
  };
    

  const handleAddOrEditProduct = (product) => {
    if (product.id) {
      // If editing, update product in state
      setProducts((prevProducts) => prevProducts.map((p) => (p.id === product.id ? product : p)));
    } else {
      // If adding, append new product
      setProducts((prevProducts) => [...prevProducts, product]);
    }
  };


  const handleAdd = () => {
    console.log("Product Added");
    setIsModalOpen(true)
    setTitle("Add Product")
    setType("add")
    setSelectedProduct(null)
    // axios.post("/api/products", productData)...
  };

  // Edit Category
  const handleEdit = (product) => {
    console.log("Editing Product:", product);
    setIsModalOpen(true)
    setTitle("Edit Product")
    setType("edit")
    setSelectedProduct(product)
  
  };


  // Delete Category
  const handleDelete = (product) => {
    console.log("Deleting Product:", product);
    setIsDeleteModalOpen(true);
    setTitle("Delete Product")
    setType("delete")
    setSelectedProduct(product);
    
  
  };

  // Confirm delete action
  const confirmDelete = async () => {
    console.log("Confirm Delete Product:", selectedProduct)
    if (selectedProduct) {
      try {
        const response = await deleteProduct(selectedProduct.id);
        console.log("Response", response)
        if (response.status==200) {
        toast.success("Product deleted successfully!");
        // Remove product from state
        setProducts((prevProducts) => prevProducts.filter((p) => p.id !== selectedProduct.id));
        }
      } catch (err) {
        console.error('Error deleting product:', err);
      } finally {
        setIsDeleteModalOpen(false);
        setSelectedProduct(null);
      }
    }
  };

  if (loading) return <p className="text-gray-900 mt-6">Loading products...</p>;

  return (
    <div className="p-2">
        {/* Add Product Button */}
        <div className="flex justify-between items-center p-3 mt-4 md:px-12">
          <h2 className="text-2xl font-bold">Products</h2>
          <button
            onClick={handleAdd}
            className="py-2 px-4 text-white bg-red-700 hover:bg-red-800 rounded-lg transition-all"
          >
            + Add Product
          </button>
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
              data={filteredProduct.map((product) => ({ id: product.id, image: product.image, name: product.name, brand: product.brand_id, description: product.description, price: product.price, category:product.category, subcategory: product.subcategory, sub_subcategory:product.sub_subcategory, retail_store: product.retail_store, supershop_store: product.supershop_store, online_store: product.online_store, tags: (product.tags || []).join(', '), status: product.status }))}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isAdmin = {user?.is_admin}
              onAdminAction={handleAdminAction}
            />
        </div>
        ):(
        <p className="text-center text-gray-500">No products yet.</p>
      )}
        
         {/* Add/Edit Modal */}
        <AddProductForm open={isModalOpen} setOpen={setIsModalOpen} title={title} type={type} productData={selectedProduct} onSubmit={handleAddOrEditProduct} />
        
        {/* Delete Modal */}
        <DeleteModal 
          isOpen={isDeleteModalOpen} 
          onClose={() => setIsDeleteModalOpen(false)} 
          onConfirm={confirmDelete}
          title={title}
          type={type}
          message={`Are you sure you want to delete "${selectedProduct?.name}"?`}
        />

    </div>
  );
         
 
};



export default ProductList