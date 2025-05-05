import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchCategories, fetchSubCategories, fetchSubSubCategories } from "../../api";
import Table from "../../components/Table";
import Tabs from "../../components/Tabs";

// / Define table columns
const columns = [
  { key: "image", label: "Image" },
  { key: "name", label: "Name" },
  
];

const Categories = () => {
  const { user } = useSelector((state) => state.auth);
  console.log("User:", user)
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [subsubcategories, setSubsubcategories] = useState([])
  const [selectedTab, setSelectedTab] = useState("Categories");


  useEffect(() => {
      const getCategories = async () => {
        const data = await fetchCategories();
        console.log("Categories:", data)
        setCategories(data);
        setLoading(false)
      };
      getCategories();
    
    }, [user]);

useEffect(() => {
    if (categories.length > 0) {
        const getSubcategories = async () => {
        const data = await fetchSubCategories();
        console.log("Fetched Data: ", data)
        setSubcategories(data);
        console.log("SubCategories: ",subcategories)
        };
        getSubcategories();
    }
    }, [categories]);


    useEffect(() => {
    if (subcategories.length > 0) {
        const getSubSubcategories = async () => {
        const data = await fetchSubSubCategories();
        console.log("Fetched sub_subcategories Data: ", data)
        setSubsubcategories(data);
        console.log("SubSubCategories: ",subsubcategories)
        };
        getSubSubcategories();
    }
    }, [subcategories]);

    const tabOptions = [
      { value: "Categories", label: "Categories" },
      { value: "Subcategories", label: "Subcategories" },
    ];


    let filteredData = [];

    if (selectedTab === "Categories") {
    filteredData = categories;
    } else if (selectedTab === "Subcategories") {
    filteredData = subcategories;
    }
   
    
    

  const handleAdd = (data) => {
    console.log("Product Added:", data);
    // axios.post("/api/products", productData)...
  };

  // Edit Category
  const handleEdit = (data) => {
    console.log("Editing Category:", data);
  
  };


  // Delete Category
  const handleDelete = (data) => {
    console.log("Deleting Product:", data);
  
  };

  if (loading) return <p className="text-gray-900">Loading categories...</p>;

  return (
    <div className="min-h-screen p-2">
        {/* Add Categories Button */}
        <div className="flex justify-between items-center p-3 mt-4 md:px-12">
          <h2 className="text-2xl font-bold">Categories</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="py-2 px-4 text-white bg-red-700 hover:bg-red-800 rounded-lg transition-all"
          >
            + Add Categories
          </button>
        </div>
       
        <div className="">
        <Tabs
          tabs={tabOptions}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
        />
          <Table
              columns={columns}
              data={filteredData.map((data) => ({ id: data.id, image: data.image, name: data.name }))}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
        </div>
        {/* <AddProductForm open={isModalOpen} setOpen={setIsModalOpen} title="Add New Product" onSubmit={handleAdd} /> */}
        

    </div>
  );
         
 
};



export default Categories