import connectDB from '../../../../config/connectDB';
import Courses from '../../../../models/courseModel';
import Users from '../../../../models/userModel';

connectDB();

const likeCourse = async (req, res) => {
  const { courseId, userId } = req.body;
  try {
    if (req.method === 'PUT') {
      const course = await Courses.findOne({ id: courseId });

      const dbUser = await Users.findOne({ _id: userId.valueOf() });

      course.likes++;

      await course.save();

      const index = dbUser.courses.findIndex((element) => {
        return element.course.valueOf() === course._id.valueOf();
      });

      dbUser.courses[index].like = true;

      await dbUser.save();

      return res.status(200).send({ message: 'Le has dado like a este curso' });
    } else {
      return res.status(401).json({ error: 'Algo salio mal' });
    }
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: 'Algo salio mal' });
  }
};

export default likeCourse;
