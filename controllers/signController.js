import User from '../models/signModel.js';
import bcrypt from 'bcrypt';


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
    
        return res.json(users)
    } catch(err) {
        next(err)
    }
};


export const addContacts = async( req,res,next ) => {
    const { myId,contactId } = req.body;

    try {
        
        const user = await User.findById( myId );

        if (!user.contacts.includes(contactId)) {
            user.contacts.push(contactId);
            await user.save()
        } else {
            res.status(404).json('The contact is already in contacts!')
        }
    } catch(err) {
        console.log(err)
    }
};

export const getContacts = async (req, res, next) => {
    const { myId } = req.params;

    try {
      const user = await User.findById(myId).populate("contacts", "username email avatarImg");
     
      return res.json(user.contacts); 
    } catch (err) {
      next(err);
    }
  };

  export const deleteContacts = async (req, res, next) => {
    const { myId, contactId } = req.body;

    try {
      const user = await User.findById(myId);

      if(user) {
        user.contacts.pull(contactId);
        await user.save()
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