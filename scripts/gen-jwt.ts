import jwt from "jsonwebtoken";
import { JWT_SECRET } from "~env";

const secretKey = JWT_SECRET;

const payload = {
  scope: ["admin"],
};

const token = jwt.sign(payload, secretKey);
console.log(token);
console.log(JSON.stringify({ Authorization: `Bearer ${token}` }));
