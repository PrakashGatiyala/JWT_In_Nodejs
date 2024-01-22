const JWT = require('jsonwebtoken');
module.exports = async (req, res, next) => {
    const token = req.header('x-auth-token');
    if(!token){
        return res.status(400).json({errors: [{msg: "No token, authorization denied"}]});
    }
    try {
        const user = await JWT.verify(token, "secretkey!23#4$32");
        req.user=user;
        next();

    } catch (error) {
        return res.status(400).json({errors: [{msg: "Invalid token"}]});
    }
}