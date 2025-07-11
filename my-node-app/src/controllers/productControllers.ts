// import { Express } from "express";
// import { Request, Response, RequestHandler } from "express";
// import Product from "../models/productModel";
// interface IProduct {
//   name: string;
//   price: number;
//   category: string;
//   inStock: string;
// }
// //Create a new product
// export const createProduct: RequestHandler = async (
//     req: Request, 
//     res: Response
// ) => {
//   try {
//     //Get request body
//     const productData :  IProduct = req.body;

//     //Create product
//     const newProduct = await Product.create(productData);

//     //return created product
//     res.status(201).json(newProduct);
//   } catch (error:any) {
//     console.error("Error creating product:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// //Get all products
// export const getAllProducts: RequestHandler = async (
//     req: Request,
//     res: Response
// ) => {
//     try {
//         const { category, instock } = req.query;

//         const query: any = {};

//         if (category) {
//             query.category = category;
//         }

//         if (instock !== undefined) {
//             query.inStock = instock === 'true';
//         }

//         const Products = await Product.find(query);

//         res.status(200).json(Products);
//     } catch (error) {
//         console.error("Error fetching products:", error);
//         res.status(500).json({ message: "Internal Server error" });
//     }
// };

// //Get product by id
// export const getProductById: RequestHandler = async (
//     req: Request,
//     res: Response
// ) => {
//     try {
//         const { id, instock } = req.query;

//         const query: any = {};

//         if (typeof id === 'string' && id.trim() !== '') {
//             query.category = id;
//         }

//         if (instock !== undefined) {
//             query.inStock = instock === 'true';
//         }

//         const Products = await Product.find(query);

//         res.status(200).json(Products);
//     } catch (error) {
//         console.error("Error fetching products:", error);
//         res.status(500).json({ message: "Internal Server error" });
//     }
// };

