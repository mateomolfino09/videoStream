import connectDB from '../../../config/connectDB';
import User from '../../../models/userModel';

connectDB();

export async function getUserFromBack(email) {
  try {
    const user = await User.findOne({ email: email }).lean().exec();

    if (!user) return null;
    user.password = undefined;
    return JSON.parse(JSON.stringify(user));
  } catch (err) {
    console.log(err);
  }
}