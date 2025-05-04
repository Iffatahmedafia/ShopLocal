import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { fetchProducts } from "../../api";
import Table from "../../components/Table";
import DeleteModal from "../../components/DeleteModal";


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

const Trash = () => {
  const { user } = useSelector((state) => state.auth);
  console.log("User:", user)
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  


  useEffect(() => {
      const getProducts = async () => {
        const data = await fetchProducts();
        console.log("Products:", data)
        let filtered = data;
        if (user.is_brand) {
          filtered = data.filter(
            (product) => product.user === user.id && product.is_trashed === true
          );
        }
        setProducts(filtered);
        setLoading(false)
      };
      getProducts();
    
    }, [user]);


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
    


  // Edit Product
  const handleEdit = (product) => {
    console.log("Editing Product:", product);
    setIsModalOpen(true)
    setTitle("Edit Product")
    setType("edit")
    setSelectedProduct(product)
  
  };


  // Delete Product
  const handleDelete = (product) => {
    console.log("Deleting Product:", product);
    setIsDeleteModalOpen(true);
    setTitle("Delete Product")
    setType("delete")
    setSelectedProduct(product);  
  
  };

  const deleteAllClick = () => {
    setType("deleteAll");
    setTitle("Delete All Tasks")
    setMsg("Do you want to permenantly delete all items?");
    setOpenDialog(true);
    setIsDeleteModalOpen(true);
  };

  const restoreAllClick = () => {
    console.log("Restoring All Tasks")
    setTitle("Restore All Tasks")
    setType("restoreAll");
    setMsg("Do you want to restore all items in the trash?");
    setOpenDialog(true);
    setIsDeleteModalOpen(true);
  };

  const deleteClick = (task) => {
    console.log("Deleting Task:", task);
    setTitle("Delete Task")
    setType("delete");
    setMsg(`Do you want to delete the task "${task.title}" in the trash?`);
    setSelectedTask(task);
    setActionType("delete")
    setIsDeleteModalOpen(true);
    
  };

  const restoreClick = (task) => {
    console.log("Restoring Task:", task);
    setTitle("Restore Task")
    // Open a modal or form for restoring
    setType("restore");
    setMsg(`Do you want to restore the task "${task.title}" in the trash?`);
    setSelectedTask(task);
    setActionType("restore")
    setIsDeleteModalOpen(true);
      
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
        <div className="md:ml-12 mt-12">
          <h2 className="text-2xl font-bold text-center md:text-start mb-4"> Trashed Products</h2>
        </div>
        {products.length> 0 ? (
        <div className="">
          <Table
              columns={columns}
              data={products.map((product) => ({ id: product.id, image: product.image, name: product.name, brand: product.brand_id, description: product.description, price: product.price, category:product.category, subcategory: product.subcategory, sub_subcategory:product.sub_subcategory, retail_store: product.retail_store, supershop_store: product.supershop_store, online_store: product.online_store, tags: (product.tags || []).join(', '), status: product.status }))}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isAdmin = {user?.is_admin}
              onAdminAction={handleAdminAction}
            />
        </div>
        ):(
        <p className="text-center text-gray-500">No trashed products yet.</p>
      )}
        
        
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



export default Trash