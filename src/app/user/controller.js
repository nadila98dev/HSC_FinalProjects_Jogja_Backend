const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const validator = require("validator");

module.exports = {
  getAllUser: async (req, res) => {
    try {
      const { limit , pageNumber, keyword  } = req.query;

      const skip = (pageNumber - 1) * limit;
      const take = Number(limit);

      const totalUsers = await prisma.user.count();
      const totalPages = Math.ceil(totalUsers / limit);

      const userLength = await prisma.user.findMany({
        where:{
         OR: [
          {
            email:{
              contains: keyword
            },
          },
          {
            name: {
              contains: keyword
            }
          }
         ]
        }
      });

      const resUserLength = userLength.length

      const user = await prisma.user.findMany({
        skip,
        take,
        where:{
         OR: [
          {
            email:{
              contains: keyword
            },
          },
          {
            name: {
              contains: keyword
            }
          }
         ]
        }
      });

      return res.status(200).json({
        success: true,
        data: user,
        totalPages,
        currentPage: parseInt(pageNumber),
        currentItems: resUserLength
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message ?? "Internal Server Error",
      });
    }
  },
  getOneUser: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await prisma.user.findFirst({
        where: {
          id,
        },
      });

      return res.status(200).json({
        error: false,
        data: user,
      });
    } catch (err) {
      return res.status(500).json({
        error: true,
        message: err.message ?? "Internal Server Error",
      });
    }
  },
  create: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!email || !name || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Field has been requeired",
        });
      }

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (user) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: failed,
          message: "Duplicate Email",
        });
      }

      const isEmail = validator.isEmail(email);
      if (!isEmail) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: failed,
          message: "Invalid Email",
        });
      }

      const isPassword = validator.isStrongPassword(password);
      if (!isPassword) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: failed,
          message: "Password Not Strong",
        });
      }

      const hashPassword = bcrypt.hashSync(password, 10);

      const result = await prisma.user.create({
        data: {
          name,
          email,
          password: hashPassword,
          role: "ADMIN",
        },
      });

      if (!result) {
        BadRequest(res, "Failed Created Users");
      } else {
        return res.status(StatusCodes.CREATED).json({
          success: true,
          data: result,
        });
      }
    } catch (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: (err.code = "P2002" ? "Internal Server Error" : err),
      });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;

      const checkUser = await prisma.user.findUnique({
        where: { id },
      });

      if (!checkUser) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: 'User Not Found'
        })
      }

      let hashPassword;
      if (password) {
        hashPassword = bcrypt.hashSync(password, 10);
      }

      const result = await prisma.user.update({
        where: {
          id,
        },
        data: {
          name,
          email,
          password: hashPassword,
        },
      });

        return res.status(StatusCodes.OK).json({
          error: false,
          data: result,
        });
      
    } catch (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: false,
        message: (err.code = "P2002" ? "Duplicate Users" : err),
      });
    }
  },
  destroy: async (req, res) => {
    try {
      const { id } = req.params;

      const checkUser = await prisma.user.findUnique({
        where: { id },
      });
      if (!checkUser) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "User Not Found",
        });
      }

      await prisma.user.delete({
        where: {
          id: id,
        },
      });

      return res.status(StatusCodes.OK).json({
        success: true,
        message: "Deleted Succesfully",
      });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  },
};
