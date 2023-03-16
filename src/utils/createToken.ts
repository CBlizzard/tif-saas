import jwt from "jsonwebtoken";

interface Token {
  id: string;
  email: string;
}

export const createToken = ({ id, email }: Token) => {
  return jwt.sign({ id, email }, process.env.SECRET_STRING!, {
    expiresIn: "1d",
  });
};
