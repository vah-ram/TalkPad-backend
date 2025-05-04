import User from '../models/signModel.js';
import { Group } from '../models/groupModel.js';
import bcrypt from 'bcrypt';
import nodemailer from "nodemailer";

export const register = async( req,res,next ) => {
    try {

        const { username,email,password } = req.body;
        
        const isUsername = await User.findOne({ username });
            if(isUsername) {
                 return res.json({msg: "Username is already used!", status: false});
            };
        const isEmail = await User.findOne({ email });
            if(isEmail) {
                return res.json({msg: "Email is already used!", status: false});
            };
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        delete user.password;
        return res.json({ status: true, user })
    } catch (err) {
        next(err)
    };
};

export const login = async( req,res,next ) => {
    try {
        const { username,password } = req.body;

        const user = await User.findOne({ username });
            if(!user) {
                 res.json({msg: "Incorrect username or password!", status: false });
            };
        const isPasswordValid = await bcrypt.compare( password, user.password )
            if(!isPasswordValid) {
                res.json({msg: "Incorrect username or password!", status: false });
            };
        delete user.password;
        return await res.json({status: true, user})
    } catch (err) {
        next(err)
    };
};

export const getAllUsers = async( req,res,next ) => {
    const { username } = req.query;

    try {
        const users = await User.find({
            username: { $regex: `^${username}`, $options: "i" }
        });

        const groups = await Group.find({
            username: { $regex: `^${username}`, $options: "i" }
        });
    
        return res.json({
            users,
            groups
        });
    } catch(err) {
        next(err)
    }
};

export const addContacts = async( req,res,next ) => {
    const { myId, contactId } = req.body;

    try {
        
        const user = await User.findById( myId );
        const contact = await User.findById( contactId );

        const group = await Group.findById( contactId );

        if(contact) {
            if (!user.contacts.includes(contactId)) {
                user.contacts.push(contactId);
                await user.save()
            }
    
            if (!contact.contacts.includes(myId)) {
                contact.contacts.push(myId);
                await contact.save()
            }
        }

        if(group) {
            if (!group.members.includes( myId )) {
                group.members.push(myId),
                await group.save();
            }

            if (!user.contacts.includes( contactId )) {
                user.contacts.push(contactId),
                await user.save()
            }
        }
    } catch(err) {
        next(err)
    }
};

export const getContacts = async (req, res, next) => {
    const { myId } = req.params;

    try {
      const user = await User.findById(myId).populate("contacts", "username email avatarImg type");
     
      const groups = await Group.find({ members: myId }).select("username members avatarImg type")

      return res.json({
        contacts: user.contacts,
        groups: groups
      }); 
    } catch (err) {
      next(err);
    }
  };

  export const deleteContacts = async (req, res, next) => {
    const { myId, contactId } = req.body;

    try {
      const user = await User.findById(myId);
      const group = await Group.findById(contactId);

      if(user) {
        user.contacts.pull(contactId);
        await user.save()
      };

      if(group.admin.toString() === myId.toString()) {
        await Group.findByIdAndDelete(group._id)
        group.members.pull(myId);
        await group.save();
      }else if(group) {
            group.members.pull(myId);
            await group.save();
        };

    } catch (err) {
      next(err);
    }
  };
  
  export const getAvatarUrl = async (req, res, next) => {
    const { myId } = req.query;

    try {
      const user = await User.findById(myId);

      if(user) {
        return res.json(user.avatarImg)
      };

    } catch (err) {
      next(err);
    }
  };
