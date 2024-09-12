import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [expanded, setExpanded] = useState({}); // State to track which stories are expanded

  // Function to toggle "Read More" and "Show Less"
  const toggleExpand = (id) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [id]: !prevExpanded[id],
    }));
  };

  // Get all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/get-product");
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  // Lifecycle method to fetch data on component mount
  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout>
      <div className="row dashboard">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9 ">
          <h1 className="text-center">All Stories List</h1>
          <div className="d-flex flex-wrap">
            {products?.map((p) => {
              const isExpanded = expanded[p._id]; // Check if current story is expanded
              const description = isExpanded
                ? p.description // Full description when expanded
                : p.description.split(" ").slice(0, 100).join(" ") + "..."; // First 100 words when not expanded

              return (
                <Link
                  key={p._id}
                  to={`/dashboard/admin/product/${p.slug}`}
                  className="product-link"
                >
                  <div className="card m-2" style={{ width: "18rem" }}>
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text">{description}</p>
                      {/* Toggle between "Read More" and "Show Less" */}
                      <button
                        className="btn btn-link p-0"
                        onClick={(e) => {
                          e.preventDefault(); // Prevent link navigation on button click
                          toggleExpand(p._id);
                        }}
                      >
                        {isExpanded ? "Show Less" : "Read More"}
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
