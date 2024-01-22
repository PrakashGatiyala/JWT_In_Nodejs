const router = require('express').Router();
const {check, validationResult} = require('express-validator');
const {users} = require('../db');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

router.get('/', (req, res) => {
    res.send('Auth route is working');
});
router.post("/signup", 
[ check("email", "Please provide a valid email").isEmail(), 
check("password", "Password must be at least 6 character long").isLength({ min: 6 })], 
 async (req, res) => {
    const {email, password} = req.body;
    // Validate Email and Password
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    // Check if user already exists
    const user = users.find(user => user.email === email);
    if(user){
        return res.status(400).json({errors: [{msg: "User already exists"}]});
    }
    // Hash the password
    const hashedPassword =await bcrypt.hash(password, 10);
    users.push({
        email,
        password: hashedPassword
    })
    // Create a JWT token
    const token = await JWT.sign({
        email
    }, "secretkey!23#4$32", {expiresIn: "1h"});
    res.json({token});

    // console.log(hashedPassword);
    // console.log(email, password);    
    // res.send("Email and password are valid");
});

router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    const user = users.find(user => user.email === email);
    if(!user){
        return res.status(400).json({errors: [{msg: "Invalid credentials"}]});
    }
    const isMatch=await  bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json({errors: [{msg: "Invalid credentials"}]});
    }

    const token = await JWT.sign({
        email
    }, "secretkey!23#4$32", {expiresIn: "1h"});

    res.json({token});
})

router.get("/all", (req, res) => {
    res.send(users);
});

module.exports = router;