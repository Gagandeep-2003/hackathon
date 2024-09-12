import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductDetailsStyles.css";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [username, setUsername] = useState("");
  const [expanded, setExpanded] = useState(false);

  // Initial product details and comments
  useEffect(() => {
    if (params?.slug) {
      getProduct();
      loadComments();
    }
  }, [params?.slug]);

  // Get product details
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  // Get similar products
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  // Load comments from local storage
  const loadComments = () => {
    const storedComments = JSON.parse(localStorage.getItem(`comments_${params.slug}`)) || [];
    setComments(storedComments);
  };

  // Save comments to local storage
  const saveComments = (updatedComments) => {
    localStorage.setItem(`comments_${params.slug}`, JSON.stringify(updatedComments));
  };

  // Handle adding a new comment
  const handleAddComment = () => {
    if (newComment.trim() && username.trim()) {
      const newCommentData = {
        text: newComment,
        username: username,
        timestamp: new Date().toLocaleString(), // Store current date and time
      };
      const updatedComments = [...comments, newCommentData];
      setComments(updatedComments);
      saveComments(updatedComments);
      setNewComment(""); // Clear input field
      setUsername(""); // Clear username field
    }
  };

  return (
    <Layout>
      <div className="row container product-details">
        <div className="col-md-6">
          <img
            src={`/api/v1/product/product-photo/${product._id}`}
            className="card-img-top"
            alt={product.name}
            height="300"
            width={"350px"}
          />
        </div>
        <div className="col-md-6 product-details-info">
          <h1 className="text-center">Story Details</h1>
          <hr />
          <h6>Name : {product.name}</h6>
          <h6>
            <b>Story :</b>
            {product.description ? 
              (product.description.length > 200 ? 
                (expanded ? product.description : product.description.substring(0, 200) + '...') 
                : product.description)
              : "No description available."}
          </h6>
          {!expanded && product.description && product.description.length > 200 && (
            <button onClick={() => setExpanded(true)} className="btn btn-link">
              Read More
            </button>
          )}
          {expanded && (
            <button onClick={() => setExpanded(false)} className="btn btn-link">
              Show Less
            </button>
          )}
          <h6>
            Price : 
            {product?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </h6>
          <h6>Category : {product?.category?.name}</h6>
          <button className="btn btn-secondary ms-1">ADD TO CART</button>
        </div>
      </div>
      <hr />
      <div className="container comments-section">
        <h4>Comments</h4>
        <div className="comments-list">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="comment">
                <p><strong>{comment.username}</strong>  <em>{comment.timestamp}</em></p>
                <p>{comment.text}</p>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
        <div className="add-comment">
          <input
            type="text"
            placeholder="Your Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          /><br/><br/>
          <textarea
            rows="3"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          /><br/>
          <button onClick={handleAddComment} className="btn btn-primary">
            Submit Comment
          </button>
        </div>
      </div>
      <hr />
      <div className="row container similar-products">
        <h4>Similar Products ➡️</h4>
        {relatedProducts.length < 1 && (
          <p className="text-center">No Similar Products found</p>
        )}
        <div className="d-flex flex-wrap">
          {relatedProducts?.map((p) => (
            <div className="card m-2" key={p._id}>
              <img
                src={`/api/v1/product/product-photo/${p._id}`}
                className="card-img-top"
                alt={p.name}
              />
              <div className="card-body">
                <div className="card-name-price">
                  <h5 className="card-title">{p.name}</h5>
                  <h5 className="card-title card-price">
                    {p.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </h5>
                </div>
                <p className="card-text ">
                  {p.description.substring(0, 60)}...
                </p>
                <div className="card-name-price">
                  <button
                    className="btn btn-info ms-1"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    More Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
