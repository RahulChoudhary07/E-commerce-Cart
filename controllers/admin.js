const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editMode: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  Product.create({
    title:title,
    imageUrl:imageUrl,
    price:price,
    description:description
  })
  .then(result=>{
    console.log("PRODUCT CREATED");
    res.redirect('/admin/products');
  })
  .catch(err=>{
    console.log(err);
  });
  
};

exports.getEditProduct= (req, res, next)=>{
  const prodID=req.params.productID;
  const editMode = req.query.edit;
  if(!editMode){
    res.redirect('/');
  }
  else{
    Product.findByPk(prodID)
      .then(product=>{
        res.render('admin/edit-product', {
          product : product,
          pageTitle: 'Edit Product',
          path:'/admin/edit-product',
          editMode: editMode
        });
      })
      .catch(err=>{
        console.log(err);
      });
  }
  
};

exports.postEditProduct = (req, res, next)=>{
  const prodID= req.body.productID;
  const updatedTitle= req.body.title;
  const updatedImageUrl= req.body.imageUrl;
  const updatedPrice= req.body.price;
  const updatedDescription= req.body.description;
  Product.findByPk(prodID)
    .then(product=>{
      product.title=updatedTitle;
      product.price=updatedPrice;
      product.imageUrl=updatedImageUrl;
      product.description=updatedDescription;
      return product.save();
    })
    .then(result=>{
      console.log("PRODUCT UPDATED");
      res.redirect('/admin/products');
    })
    .catch(err=>{
      console.log(err);
    })
  
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err=>{
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next)=>{
  const prodID= req.body.productID;
  Product.findByPk(prodID)
    .then(product=>{
      return product.destroy();
    })
    .then(result=>{
      console.log("PRODUCT DELETED");
      res.redirect('/admin/products');
    })
    .catch(err=>{
      console.log(err);
    })
};