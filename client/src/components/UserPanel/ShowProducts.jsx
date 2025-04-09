import { useState, useEffect } from "react";
import Table from '../Table';
import { fetchProducts } from "../../api";

// / Define table columns
const columns = [
  { key: "name", label: "Name" },
  { key: "brand", label: "Brand" }
  
];

const ShowProducts = () => {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([])

  useEffect(() => {
      const getProducts = async () => {
        const data = await fetchProducts();
        console.log("Products:", data)
        setProducts(data);
        setLoading(false)
      };
      getProducts();
    
    }, []);

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
    <div className="p-6">
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
        <div className="bg-gray-100 text-white p-6">
          <Table
              columns={columns}
              data={products.map((product) => ({ id: product.id, name: product.name, brand: product.brand }))}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
        </div>
     
      {/* Add Task Modal
      <AddCategory open={isModalOpen} setOpen={setIsModalOpen} onSubmit={addNewCategory} category={selectedCategory} /> */}

    </div>
  );
         
 
};



export default ShowProducts