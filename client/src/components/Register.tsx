const Register = () => {
  return (
    <div id="register">
      <form className="registerForm">
        <h2 style={{ textAlign: "left", width: "100%" }}>Register</h2>
        <div className="grid-container">
          <div>Username</div>
          <input type="text" placeholder="Username" />
          <div>Email</div>
          <input type="text" placeholder="Email" />
          <div>First Name</div>
          <input type="text" placeholder="First Name" />
          <div>Last Name</div>
          <input type="text" placeholder="Last Name" />
          <div>Password</div>
          <input type="text" placeholder="Password" />
          <div>Confirm Password</div>
          <input type="text" placeholder="Confirm Password" />
        </div>
        <button>Register</button>
      </form>
    </div>
  );
};

export default Register;
