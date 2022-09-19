import createHttpError from "http-errors";

const isSuperAdmin = (req, res, next) => {
  if (req.user.role === "superAdmin") {
    next();
  } else {
    next(createHttpError(403, "Unauthorized!."));
  }
};
const isAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    next();
  } else {
    next(createHttpError(403, "Unauthorized!."));
  }
};

const isUser = (req, res, next) => {
  if (req.user.role === "user") {
    next();
  } else {
    next(createHttpError(403, "Unauthorized!."));
  }
};

const roleCheck = {
  isSuperAdmin: isSuperAdmin,
  isAdmin: isAdmin,
  isUser: isUser
}
export default roleCheck