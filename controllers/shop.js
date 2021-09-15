const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err=>{
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err=>{
      console.log(err);
    });
};

exports.getProduct = (req, res, next)=>{
  const productID = req.params.productID;
  Product.findByPk(productID)
    .then(product=>{
      res.render('shop/product-detail', {
        product:product,
        path: '/products', 
        pageTitle: product.title
      });
    })
    .catch(err=>{
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then(cart=>{
      return cart.getProducts();
    })
    .then(products=>{
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products : products 
      });
    })
    .catch(err=>console.log(err));
};

exports.postCart = (req, res, next) => {
  const productID= req.body.productID;
  let fetchedCart;
  req.user.getCart()
    .then(cart=>{
      fetchedCart=cart;
      return cart.getProducts({where:{id:productID}});
    })
    .then(products=>{
      let product;
      if(products.length>0){
        product=products[0];
      }
      let updatedQty=1;
      if(product){
        let oldQty=product.cartItem.quantity;
        updatedQty=oldQty+1;
        return fetchedCart.addProduct(product, {through:{quantity:updatedQty}});
      }
      return Product.findByPk(productID)
                .then(product=>{
                  return fetchedCart.addProduct(product, {through : {quantity:updatedQty}});
                })
                .catch(err=>console.log(err));
    })
    .then(result=>{
      res.redirect('/cart');
    })
    .catch(err=>console.log(err));
};

exports.cartDeleteItem = (req, res, next)=>{
  const prodID = req.body.productID;
  req.user.getCart()
    .then(cart=>{
      return cart.getProducts({where: {id:prodID}});
    })
    .then(products=>{
      let product=products[0];
      return product.cartItem.destroy();
    })
    .then(result=>{
      res.redirect('/cart');
    })
    .catch(err=>console.log(err));
};

exports.postOrder = (req, res, next)=>{
  let fetchedCart;
  req.user
      .getCart()
      .then(cart=>{
        fetchedCart=cart;
        return cart.getProducts();
      })
      .then(products=>{
        req.user.createOrder()
          .then(order=>{
            order.addProducts(products.map(product=>{
              product.orderItem={quantity:product.cartItem.quantity};
              return product;
            }))
          })
      })
      .then(result=>{
        fetchedCart.setProducts(null);
        res.redirect('/cart');
      })
      .catch(err=>console.log(err));
}
exports.getOrders = (req, res, next) => {
  req.user.getOrders({include:['products']})
    .then(orders=>{
      console.log(orders);
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders:orders
      });
    })
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
