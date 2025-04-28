import { Group } from '../models/groupModel.js';
import User from '../models/signModel.js';

export const addGroup = async ( req,res,next ) => {
    try {
        const { username, admin } = req.body;

        const isExist = await Group.findOne({ username });
        const user = await User.findById(admin);

        if(!isExist) {
            const group = await Group.create({
                username: username,
                admin: admin,
                members: [admin],
            });

            if(user) {
                user.contacts.push(group._id),
                await user.save()
            }

            return res.json({ status: true });
        }else {
            return res.json({ status: false, message: "Group name is already exists!" });
        }

    } catch(err) {
        next(err)
    }
}

