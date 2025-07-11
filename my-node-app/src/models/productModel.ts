// import mongoose from "mongoose";

// interface IProduct  {
//   name: string;
//   price: number;
//   category: string;
//   inStock: string;
// }



// //Define schema for product
// const productSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
//   category: {
//     type: String,
//     required: true,
//   },
//   inStock: {
//     type: String,
//     required: true,
//   },
  
// });

// //Create model for product
// const Product = mongoose.model<IProduct>("Product", productSchema);
// export default Product;