const jwt = require("jsonwebtoken");
require('dotenv').config()
const { UnauthorizedError, NotFoundError } = require("../error");
const db = require("../models");

class Jwtauthentication {
  static secretKey = process.env.JWT_SECRET_KEY
  constructor(id, username, isAdmin, isActive) {
    this.id = id;
    this.username = username;
    this.isAdmin = isAdmin;
    this.isActive = isActive;
  }

  static authenticate(id, username, isAdmin, isActive) {
    try {
      let payload = new Jwtauthentication(id, username, isAdmin, isActive);

      let myobj = {
        userId: payload.id,
        username: payload.username,
        isAdmin: payload.isAdmin,
      };
      let token = jwt.sign(myobj, Jwtauthentication.secretKey, {
        expiresIn: 60 * 60,
      });
      return token;
    } catch (error) {
      throw error;
    }
  }

  static verifyToken(token) {
    try {
      let payload = jwt.verify(token, Jwtauthentication.secretKey);
      return payload;
    } catch (error) {
      throw new UnauthorizedError("Invalid Token");
    }
  }

  static isCurrentUser(req, res, next) {
    try {
      const token = req.cookies.auth;
        if (!token) {
          throw new UnauthorizedError("Token Not Found");
        }
        let payload = Jwtauthentication.verifyToken(token);
        console.log(req.params.userId)
        console.log(payload)
        if(payload.userId != req.params.userId){
          throw new UnauthorizedError("User does not access");
        }
        next();
        return
    } catch (error) {
      next(error);
    }
  }

  static async isCurrentUserContactId(req, res, next) {
    try {
      const token = req.cookies.auth;
        if (!token) {
          throw new UnauthorizedError("Token Not Found");
        }
        let {userId, contactId} = req.params
        console.log(userId)
        console.log(contactId)
        let result = await db.contact.findAll({where:{id:contactId, user_id:userId}}) 
        if(result.length == 0){
          throw new NotFoundError("Contact Not Found with this user");
        }else{
        next();
        return
        }
    } catch (error) {
      next(error);
    }
  }

  static isAdmin(req, res, next) {
    try {
      console.log("isAdmin Started");
      const token = req.cookies.auth;
      if (!token) {
        throw new UnauthorizedError("Token Not Found");
      }
      let payload = Jwtauthentication.verifyToken(token);
      if (payload.isAdmin) {
        next();
        return
      } else {
        throw new UnauthorizedError("Not an Admin");
      }
    } catch (error) {
      next(error);
    }
  }
  

  static isUser(req, res, next) {
    try {
      console.log("isUser Started");
      const token = req.cookies.auth;
      if (!token) {
        throw new UnauthorizedError("Token Not Found");
      }
      let payload = Jwtauthentication.verifyToken(token);
      if (!payload.isAdmin) {
        next();
        return
      } else {
        throw new UnauthorizedError("Not an User");
      }
    } catch (error) {
      next(error);
    }
  }

  static isActive(req, res, next) {
    try {
      console.log("isActive Started");
      const token = req.cookies.auth;
      if (!token) {
        throw new UnauthorizedError("Token Not Found");
      }
      let payload = Jwtauthentication.verifyToken(token);
      if (payload.isActive) {
        next();
        return
      } else {
        throw new NotFoundError("User dosen't exist")
      }
    } catch (error) {
      next(error);
    }
  }
}
module.exports = Jwtauthentication;
