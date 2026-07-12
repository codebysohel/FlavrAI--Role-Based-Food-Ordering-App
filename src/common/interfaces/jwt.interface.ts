export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  country: string;
}

export interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    role: string;
    country: string;
  };
}
