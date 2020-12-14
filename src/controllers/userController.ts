import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { NextFunction, Request, Response } from 'express'
import User from '../model/user'
import roles, { Action } from '../roles'
import { formatErrors, formatServerError, translateMongooseValidationError } from '../util/errors'

async function hashPassword(password: string) {
    return await bcrypt.hash(password, 8);
}

async function validatePassword(plainPassword: string, hashedPassword: string) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

export const signup = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { username, email, password, role } = req.body;
        const hashedPassword = await hashPassword(password);
        const newUser = await User.create({
            email,
            username,
            password: hashedPassword,
            role: role || 'basic',
            elo: 0,
            language: 'fr' // TODO Auto language,
        });
        const accessToken = jwt.sign({ userId: newUser.id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1d'
        });
        await newUser.save();
        return res.send({ id: newUser.id, accessToken });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).send(formatErrors(...translateMongooseValidationError(err)));
        }
        return res.status(500).send(formatServerError());
    }
}

export const login = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }, { password: 1});
        if (user == null) {
            return res.status(404).send(formatErrors({ error: 'not_found', error_description: 'User not found' }));
        }
        if (!await validatePassword(password, user.password)) {
            return res.status(403).send(formatErrors({ error: 'forbidden', error_description: 'Incorrect password' }));
        }
        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRATION, 10)
        });
        return res.status(200).send({ id: user.id, accessToken })
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).send(formatErrors(...translateMongooseValidationError(err)));
        }
        return res.status(500).send(formatServerError());
    }
}

export const userInfo = async (req: Request, res: Response): Promise<Response> => {
    try {
        const token = req.headers['x-access-token'] as string;
        const tokenData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as { userId: string };
        const user = await User.findById(tokenData.userId);
        if (user == null) {
            return res.status(404).send(formatErrors({ error: 'not_found', error_description: 'User not found' }));
        }
        return res.status(200).send({ user });
    } catch (err) {
        return res.status(500).send(formatServerError());
    }
}

export const getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
        return res.status(200).send({ users: await User.find() });
    } catch (err) {
        return res.status(500).send(formatServerError());
    }
}

export const getUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user = await User.findById(req.params.userId);
        if (user == null) {
            return res.status(404).send(formatErrors({ error: 'not_found', error_description: 'User not found' }));
        }
        return res.status(200).send({ user });
    } catch (err) {
        return res.status(500).send(formatServerError());
    }
}

export const updateUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, req.body);
        res.status(200).send({ user });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).send(formatErrors(...translateMongooseValidationError(err)));
        }
        return res.status(500).send(formatServerError());
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(204).send();
    } catch (err) {
        return res.status(500).send(formatServerError());
    }
}

export const grantAccess = function (action: Action, resource: string) {
    return async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const permission = roles.can(req.body.role as string)[action](resource);
            if (!permission.granted) {
                return res.status(401).send(formatErrors({ error: 'forbidden', error_description: 'You don\'t have enough permission to perform this action' }));
            }
            return next();
        } catch (err) {
            return next(err);
        }
    }
}

export const allowIfLoggedin = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const user = res.locals.loggedInUser;
        if (user == null) {
            return res.status(401).send(formatErrors({ error: 'forbidden', error_description: 'You need to be logged in to access this route' }));
        }
        req.body = user;
        return next();
    } catch (error) {
        return next(error);
    }
}
