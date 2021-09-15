const express=require('express');
const router=express.Router();

const shopControllers = require('../controllers/shop');

router.get('/', shopControllers.getIndex);
router.get('/products', shopControllers.getProducts);
router.get('/product/:productID', shopControllers.getProduct);
router.get('/cart', shopControllers.getCart);
router.post('/cart', shopControllers.postCart);
router.post('/cart-delete-item', shopControllers.cartDeleteItem);
router.get('/orders', shopControllers.getOrders);
router.post('/create-order', shopControllers.postOrder);
router.get('/checkout', shopControllers.getCheckout);

module.exports = router;