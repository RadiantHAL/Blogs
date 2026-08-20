export type RegisterForm ={
    username:string;
    email:string;
    password:string;
    ConfimPassword:string;
}
export type LoginForm = {
  identifier: string;
  password: string;
};
export type User = {
  id: string;
  username: string;
  email: string;
};
export type AuthResponse = {
  message: string;
  user: User;
};