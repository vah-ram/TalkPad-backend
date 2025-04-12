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
    const { myId,contact } = req.body;

    try {
        const user = await User.findOne({ _id: myId });

        const isExist = user.contacts.some((item) => {
            return item._id.toString() === contact._id.toString()
        })

        if(!isExist) {
            user.contacts.push(contact); 
            await user.save(); 
        };

        return user.contacts
    } catch(err) {
        next(err)
    }
};

export const getContacts = async (req, res, next) => {
    const { myId } = req.body;

    try {
      const user = await User.findOne({ _id: myId });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json(user.contacts); 
    } catch (err) {
      next(err);
    }
  };
  

  export const deleteContacts = async (req, res, next) => {
    const { myId, contactId } = req.body;

    try {
      const result = await User.findByIdAndUpdate(
        myId,
        {
            $pull: {
                contacts: { _id: contactId },
            },
        },
        { new: true }
      );

      res.status(200).json({ message: 'Contact deleted successfully', result });
    } catch (err) {
      next(err);
    }
  };
  