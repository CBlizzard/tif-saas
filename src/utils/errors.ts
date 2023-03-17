interface ErrorMessage {
  code: string;
  param?: string;
}

export const createErrMessage = ({ code, param }: ErrorMessage) => {
  let message: string = "";

  switch (code) {
    case "INVALID_INPUT":
      if (param === "name") {
        message = "Name should be at least 2 characters.";
      }
      if (param === "password") {
        message = "Password should be at least 2 characters.";
      }
      if (param === "email") {
        message = "Please provide a valid email address.";
      }
      break;
    case "RESOURCE_EXISTS":
      if (param === "email") {
        message = "User with this email already exists.";
        break;
      }
      message = "User is already added in the community.";
      break;
    case "INVALID_CREDENTIALS":
      message = "The credentials you provided are invalid.";
      break;
    case "NOT_SIGNEDIN":
      message = "You need to sign in to proceed.";
      break;
    case "RESOURCE_NOT_FOUND":
      if (param === "community") {
        message = "Community not found.";
      }
      if (param === "role") {
        message = "Role not found.";
      }
      if (param === "user") {
        message = "User not found.";
      }
      if (param === "member") {
        message = "Member not found.";
      }
      break;
    case "NOT_ALLOWED_ACCESS":
      message = "You are not authorized to perform this action.";
      break;
    case "INPUT_ERROR":
      message = "Please fill all the fields.";
      break;
    default:
      message = "Something went wrong.";
      break;
  }

  return {
    ...(param && { param }),
    message,
    code,
  };
};
