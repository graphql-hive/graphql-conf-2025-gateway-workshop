import jwt from "jsonwebtoken";

import { JWT_SECRET } from "./env";

const payload = {
  sub: "u2",
  scope: ["editor"],
};

const token = jwt.sign(payload, JWT_SECRET);

console.log(JSON.stringify({ Authorization: `Bearer ${token}` }));
