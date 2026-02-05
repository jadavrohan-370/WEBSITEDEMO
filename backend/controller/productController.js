import Product from "../models/Product.js";
import Admin from "../models/Admin.js"; // Ensure Admin model is registered

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error in getAllProducts:", error); // Enhanced logging
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "createdBy",
      "name email",
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create product
export const createProduct = async (req, res) => {
  try {
    const { name, price, category, description, image, stock } = req.body || {};

    // Validation
    if (!name || !price || !category || !description || !image) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const product = new Product({
      name,
      price,
      category,
      description,
      image,
      stock: stock || 0,
      createdBy: req.user.id,
    });

    await product.save();
    await product.populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, description, image, stock } = req.body || {};

    let product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Update fields
    if (name) product.name = name;
    if (price) product.price = price;
    if (category) product.category = category;
    if (description) product.description = description;
    if (image) product.image = image;
    if (stock !== undefined) product.stock = stock;
    product.updatedAt = Date.now();

    await product.save();
    await product.populate("createdBy", "name email");

    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const products = await Product.find({ category })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
