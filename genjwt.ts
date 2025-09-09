import jwt from "jsonwebtoken";

import { JWT_SECRET } from "./env";

const payload = {};

const token = jwt.sign(payload, JWT_SECRET);

console.log(JSON.stringify({ Authorization: `Bearer ${token}` }));
