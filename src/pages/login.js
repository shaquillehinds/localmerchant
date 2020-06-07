import Form from "../components/Form";
const Login = () => {
  return (
    <div>
      <div>
        <p>Login as</p>
      </div>
      <div>
        <span>Customer</span>
        <span>Store</span>
      </div>
      <Form />
      <div>
        <p>Sign-up as</p>
        <p>Customer</p>
        <p>or</p>
        <p>Store</p>
      </div>
    </div>
  );
};

export default Login;
