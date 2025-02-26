import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import {  prisma } from '../index';
import { v4 as uuid } from 'uuid';
import { google } from 'googleapis';

export const Signup = async (req:Request, res:Response) => {
    const { Email, Password, ConfirmPassword, Name } = req.body;
    console.log(req.body);
    if (!Email || !Password || !ConfirmPassword || !Name) {
        console.log(!Email || !Password || !ConfirmPassword || !Name)
        return res.status(400).json({ message: 'Invalid Inputs' });
    }

    if (Password !== ConfirmPassword) {
        return res.status(400).json({ message: "Password doesn't match" });
    }

    try {
        const existingUser = await prisma.user.findFirst(
            {
                where: {
                    email: Email
                }
            }
        );
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const userId = uuid();
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'JWT Secret is not defined' });
        }
        const jwt_token = jwt.sign({ _id: userId, email: Email }, process.env.JWT_SECRET);
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(Password, salt, async function (err, hash) {
                if (err) {
                    return res.status(500).json({ message: 'Error hashing password' });
                }
                const register_user = await prisma.user.create({
                    data: {
                        id: userId,
                        email : Email,
                        password: hash,
                        name: Name,
                        jwtToken : jwt_token,
                    
                    },select:{
                        id :true,
                        name :true,jwtToken :true
                    }
                });
                return res.status(200) .cookie('token', jwt_token, {
                    httpOnly: true,
                    secure: false, 
                    sameSite: 'lax', 
                    expires: new Date(Date.now() + 60 * 60 * 1000),
                }).json({ message: 'User Registered and Logged in', user: register_user });
            });
            if (err) {
                return res.status(500).json({ message: 'Error hashing password' });
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong', error: error });
    }
};

export const Signin = async ( req:Request, res:Response) => {
    const { Email, Password } = req.body;
    console.log(Email);
    console.log(Password);
    if (!Email || !Password) {
        return res.status(400).json({ message: 'Invalid Inputs' });
    }

    try {
        const user = await prisma.user.findFirst(
            {
                where: {
                    email: Email
                },select:{
                    id :true,
                    email:true,jwtToken :true,
                    password: true
                }
            },
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(Password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'JWT Secret is not defined' });
        }

        let jwtToken = user.jwtToken;
        if (!jwtToken) {
            jwtToken = jwt.sign(
                { _id: user.id, email: user.email },
                process.env.JWT_SECRET
            );

            const updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: { jwtToken },
            });

            if (!updatedUser) {
                return res.status(500).json({ message: 'Failed to update user token' });
            }
        }

        const { password, ...userData } = user;
        console.log (jwtToken);
        return res
            .status(200)
            .cookie('token', jwtToken, {
                httpOnly: true,
                secure: false, 
                sameSite: 'lax', 
                expires: new Date(Date.now() + 60 * 60 * 1000),
            })
            .json({ message: 'User Logged In', user: userData });
    } catch (error) {
        console.error('Error during signin:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
  
  export async function Update(req :Request, res:Response) {
    const { access_token,refresh_token,expiry_date  } = req.body;
    try {
       
      const {_id}= req.user;
     
      const upd=await prisma.user.update({
        where: { id:_id },
        data: {
          accessToken: access_token,
          refreshToken: refresh_token,
          tokenExpiry: expiry_date ? new Date(expiry_date* 1000) : null
        },
      });
      console.log(upd);
      if (!upd) {
        return res.status(500).json({ message: 'Failed to update user token' });
      }
      return res.status(200).json({ message: 'User Authenticated' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error handling OAuth callback.');
    }
  }
    
  export async function checkAndRefreshToken( req :Request, res:Response) {
    try {
        
        const {userId}= req.params;
        
        const user = await prisma.user.findUnique({
            where: { id:userId },
        });
        
        if (!user || !user.accessToken || !user.refreshToken) {
            return res.status(400).send('User does not have valid tokens.');
        }
        
        const currentDate = new Date().getTime();
        const tokenExpiryDate = user.tokenExpiry ? new Date(user.tokenExpiry).getTime() : 0;
        if (currentDate >= tokenExpiryDate - 5 * 60 * 1000) {
            const {message,success,accessToken}= await refreshToken({userId:userId, refreshToken: user.refreshToken, userEmail:user.email });
            if(!success){
                return res.status(400).json({message,success:false});
            }
            return res.json({success:true,message,accessToken});
        } else {
            return res.json({message:"Access Token is valid",success:true,accessToken:user.accessToken});
        }
    } catch (error) {
           return res.status(500).send('Error handling refresh token.');
    }
  }
  
interface RefreshTokenParams {
    userId: string;
    refreshToken: string;
    userEmail: string;
}

export async function refreshToken({userId, refreshToken, userEmail}: RefreshTokenParams) {
    try {
        const oAuth2Client = new google.auth.OAuth2(
            {clientId:process.env.GOOGLE_CLIENT_ID,clientSecret:process.env.GOOGLE_CLIENT_SECRET,redirectUri:process.env.GOOGLE_REDIRECT_URI}
        );
        
        oAuth2Client.setCredentials({
            refresh_token: refreshToken,
        });
        const { credentials:tokens } = await oAuth2Client.refreshAccessToken();
        console.log(tokens)
       const res= await prisma.user.update({
            where: { id: userId },
            data: {
                accessToken: tokens.access_token,
                tokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
                refreshToken : tokens.refresh_token
            },
        });
        if (!res) {
            return {
                message: "Unable to store the new access token",
                success:false,
            }
        }
        return {
            message: "Access token refreshed successfully",
            success: true,
            accessToken : tokens.access_token,
        }

    } catch (err) {
        console.error(err);
        return {
            message: "Error refreshing token",
            success: false,
        }
    }
}
export async function getUser(req:Request, res:Response) {
    const {_id}= req.user;
    const user = await prisma.user.findUnique(
        {
            where:{id:_id},select :{
                id : true,
                email : true,
                jwtToken :true  
            }
    });
    if (!user) return;
    return res.status(201).json(user);
}

//get access token 