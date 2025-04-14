import { useState, useEffect } from "react";
import Table from '../Table';
import { fetchProducts } from "../../api";
import DialogWrapper from "../DialogWrapper";
import AddProductForm from "./AddProductForm";
import { useSelector } from "react-redux";
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

const ShowProducts = () => {
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
    ];

    const filteredProduct = 
      selectedTab === "Pending" 
      ? products.filter((product) => product.status == "Pending")
      : products.filter((product) => product.status === "Approved")
    

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

  if (loading) return <p className="text-gray-900">Loading products...</p>;

  return (
    <div className="min-h-screen p-6">
        {/* Add Task Button */}
        <div className="flex justify-center md:justify-end p-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="py-3 px-6 text-white bg-red-700 hover:to-red-800 rounded-lg transition-all"
          >
            + Add Product
          </button>
        </div>
        <h2 className="text-2xl font-bold text-center md:text-start mb-4">Products</h2>
       
        <div className="text-white">
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
            />
        </div>
        <AddProductForm open={isModalOpen} setOpen={setIsModalOpen} title="Add New Product" onSubmit={handleAdd} />
        
       
     
      {/* Add Task Modal
      <AddCategory open={isModalOpen} setOpen={setIsModalOpen} onSubmit={addNewCategory} category={selectedCategory} /> */}

    </div>
  );
         
 
};



export default ShowProducts