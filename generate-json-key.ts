import jwt from "jsonwebtoken";

const payload = { 
    scopes: []
 };
const secretKey = "VERY_SECRET";

const token = jwt.sign(payload, secretKey);
console.log("JWT Token:", token);
