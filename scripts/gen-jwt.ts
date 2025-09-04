import jwt from "jsonwebtoken";
import { JWT_SECRET } from "~env";

const secretKey = JWT_SECRET;

const payload = {
  scopes: [],
};

console.log(jwt.sign(payload, secretKey));
