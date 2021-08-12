const validateRegisterInput = (
  username: string,
  email: string,
  password: string,
  confirmPassword: string
): any => {
  const err: any = {};
  if (username.trim() === "") {
    err.username = "Username must not be empty";
  }
  if (email.trim() === "") {
    err.email = "Email must not be empty";
  } else {
    const regEx = /^/;
    if (!email.match(regEx)) {
      err.email = "Invalid email format";
    }
  }
  if (password === "") {
    err.password = "Password must not be empty";
  } else if (password !== confirmPassword) {
    err.confirmPassword = "Passwords must match";
  }

  return {
    err,
    valid: Object.keys(err).length < 1,
  };
};
const validateLoginInput = (username: string, password: string) => {
  const err: any = {};
  if (username.trim() === "") {
    err.username = "Username must not be empty";
  }
  if (password === "") {
    err.password = "Password must not be empty";
  }
  return {
    err,
    valid: Object.keys(err).length < 1,
  };
};
export { validateRegisterInput, validateLoginInput };
