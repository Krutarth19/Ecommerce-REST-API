const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product");

// router.get("/", (req, res, next) => {
//     Order.find({}, { __v: 0 })
//     .populate('product','name:1')
//         .exec()
//         .then(doc => {
//             res.status(200).json({
//                 count: doc.length,
//                 orders: doc.map(doc => {
//                     return {
//                         _id: doc._id,
//                         product: doc.productId,
//                         quantity: doc.quantity,
//                         request: {
//                             type: "GET",
//                             url: "http://localhost:3000/orders/" + doc._id
//                         }
//                     }
//                 })
//             });
//         })
//         .catch(err => {
//             res.status(500).json({
//                 error: err
//             });
//         })
// });

router.get("/", (req, res, next) => {
    Order.find({}, { __v: 0 })
        .populate('product')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: {
                            _id: doc.product._id,
                            name: doc.product.name,
                            price: doc.product.price
                        },
                        quantity: doc.quantity,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/orders/" + doc._id
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});





// router.post("/", (req, res, next) => {
//     Product.findById(req.body.productId)
//         .then(product => {
//             if (!product) {
//                 return res.status(404).json({
//                     message: "Product not found"
//                 });
//             }
//             const order = new Order({
//                 _id: new mongoose.Types.ObjectId(),
//                 quantity: req.body.quantity,
//                 product: req.body.productId
//             });

//             return order.save();
//         })
//         .then(result => {
//             console.log(result);
//             res.status(201).json({
//                 message: "Order stored",
//                 createdOrder: {
//                     _id: result._id,
//                     product: result.product,
//                     quantity: result.quantity,
//                     request: {
//                         type: "GET",
//                         url: "http://localhost:3000/orders/" + result._id
//                     }
//                 },
//             });
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// });

router.post("/", (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save();
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Order stored",
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: "GET",
                    url: "http://localhost:3000/orders/" + result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

// router.get("/:orderId", (req, res, next) => {

//     Order.findById(req.params.orderId)
//         .exec()
//         .then(order => {
//             if(!order){
//                 res.status(404).json({
//                     message:"Order Not Found"
//                 });
//             }
//             res.status(200).json({
//                 order: order,
//                 request: {
//                     type: "GET",
//                     url: "http://localhost:3000/orders"
//                 }
//             });
//         })
//         .catch(err => {
//             res.status(500).json({
//                 error: err
//             });
//         });
// });

router.get("/:orderId", (req, res, next) => {
    Order.findById(req.params.orderId)
        .populate("product")
        .exec()
        .then((order) => {
            if (!order) {
                return res.status(404).json({
                    message: "Order Not Found",
                });
            }
            res.status(200).json({
                order: {
                    _id: order._id,
                    quantity: order.quantity,
                    product: {
                        _id: order.product._id,
                        name: order.product.name,
                        price: order.product.price,
                    },
                },
                request: {
                    type: "GET",
                    url: "http://localhost:3000/orders",
                },
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
});


router.delete("/:orderId", (req, res, next) => {
    Order.findByIdAndDelete(req.params.orderId)
        .exec()
        .then(order => {
            res.status(200).json({
                message: "Product Deleted",
                request: {
                    url: "http://localhost:3000/orders",
                    type: "POST",
                    body: { productId: "ID", quantity: "Number" }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})




module.exports = router;