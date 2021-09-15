const express=require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app=express();

app.set('view engine', 'ejs');


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorControllers = require('./controllers/error');
const sequelize=require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');



app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname + '/public'));

app.use((req, res, next)=>{
    User.findByPk(1)
        .then(user=>{
            req.user=user;
            next();
        })
        .catch(err=>{
            console.log(err);
        })
})

app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(errorControllers.get404);

Product.belongsTo(User, {constraints:true, onDelete:"CASCADE"});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsToMany(Product, {through:CartItem});
Product.belongsToMany(Cart, {through:CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem});

sequelize.sync()
    .then(result=>{
        return User.findByPk(1);
    })
    .then(user=>{
        if(!user){
            return User.create({name:'test', email:'test@test.com'});
        }
        return user;
         
    })
    .then(user=>{
        return Cart.findByPk(1)
                        .then(cart=>{
                            if(!cart){
                                return user.createCart();
                            }
                            return cart;
                        })
    })
    
    .then(cart=>{
        // console.log(cart);
        app.listen(4000);
    })
    .catch(err=>{
        console.log(err);
    });

  