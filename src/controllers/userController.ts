import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { NextFunction, Request, Response } from 'express'
import User  from '../model/user'
import roles, { Action } from '../roles'



async function hashPassword(password:string) {
 return await bcrypt.hash(password, 8);
}

async function validatePassword(plainPassword:string, hashedPassword:string) {
 return await bcrypt.compare(plainPassword, hashedPassword);
}

export const signup = async (req:Request, res:Response, next:NextFunction) => {
 try {
  const { username,email, password, role } = req.body
  const hashedPassword = await hashPassword(password);
  const newUser = new User({ email,username, password: hashedPassword, role: role || "basic" });
  const accessToken = jwt.sign({ userId: newUser._id }, process.env.ACCESS_TOKEN_SECRET, {
   expiresIn: "1d"
  });
  await newUser.save();
  res.json({
   data: newUser,
   accessToken
  })
 } catch (error) {
  next(error)
 }
}

export const login = async (req:Request, res:Response, next:NextFunction) => {
    try {
     const { email, password } = req.body;
     const user = await User.findOne({ email });
     if (!user) return next(new Error('Email does not exist'));
     const validPassword = await validatePassword(password, user.password);
     if (!validPassword) return next(new Error('Password is not correct'))
     const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_EXPIRATION, {
      expiresIn: "1d"
     });
     await User.findByIdAndUpdate(user._id, { accessToken })
     res.status(200).json({
      data: { email: user.email, role: user.role, auth:true },
      accessToken
     })
    } catch (error) {
     next(error);
    }
   }

   export const getUsers = async (req:Request, res:Response) => {
    const users = await User.find({});
    res.status(200).json({
     data: users
    });
   }
   
   export const getUser = async (req:Request, res:Response, next:NextFunction) => {
    try {
     const userId = req.params.userId;
     const user = await User.findById(userId);
     if (!user) return next(new Error('User does not exist'));
      res.status(200).json({
      data: user
     });
    } catch (error) {
     next(error)
    }
   }
   
   export const updateUser = async (req:Request, res:Response, next:NextFunction) => {
    try {
     const update = req.body
     const userId = req.params.userId;
     await User.findByIdAndUpdate(userId, update);
     const user = await User.findById(userId)
     res.status(200).json({
      data: user,
      message: 'User has been updated'
     });
    } catch (error) {
     next(error)
    }
   }
   
   export const deleteUser = async (req:Request, res:Response, next:NextFunction) => {
    try {
     const userId = req.params.userId;
     await User.findByIdAndDelete(userId);
     res.status(200).json({
      data: null,
      message: 'User has been deleted'
     });
    } catch (error) {
     next(error)
    }
   }

   export const grantAccess = function(action:Action, resource:string) {
    return async (req:Request, res:Response, next:NextFunction) => {
     try {
      const permission = roles.can(req.body.role as string)[action](resource);
      if (!permission.granted) {
       return res.status(401).json({
        error: "You don't have enough permission to perform this action"
       });
      }
      next()
     } catch (error) {
      next(error)
     }
    }
   }
   
   export const allowIfLoggedin = async (req:Request, res:Response, next:NextFunction) => {
    try {
     const user = res.locals.loggedInUser;
     if (!user)
      return res.status(401).json({
       error: "You need to be logged in to access this route"
      });
      req.body = user;
      next();
     } catch (error) {
      next(error);
     }
   }