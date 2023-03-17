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
      if (param === "community") {
        message = "Community with this name already exists.";
        break;
      }
      if (param === undefined) {
        message = "User is already added in the community.";
        break;
      }
    case "INVALID_CREDENTIALS":
      message = "The credentials you provided are invalid.";
      break;
    case "NOT_SIGNEDIN":
      message = "You need to sign in to proceed.";
      break;
    case "RESOURCE_NOT_FOUND":
      if (param === "community") {
        message = "Community not found.";
        break;
      }
      if (param === "role") {
        message = "Role not found.";
        break;
      }
      if (param === "user") {
        message = "User not found.";
        break;
      }
      if (param === undefined || param === null) {
        message = "Member not found.";
        break;
      }
    case "NOT_ALLOWED_ACCESS":
      message = "You are not authorized to perform this action.";
      break;
    case "INPUT_ERROR":
      message = "Please fill all the fields.";
      break;
    case "WEAK_INPUT":
      message = "Please use strong password.";
      break;
    default:
      message = "Something went wrong.";
      break;
  }

  if (param) return { param, message, code };
  return { message, code };
};
