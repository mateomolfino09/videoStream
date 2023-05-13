import connectDB from '../../../config/connectDB';
import Classes from '../../../models/classModel';
import Courses from '../../../models/courseModel';
import Question from '../../../models/questionModel';
import Users from '../../../models/userModel';
import bcrypt from 'bcryptjs';

connectDB();

const createAnswer = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const { answer, questionId, userId } = req.body;

      //Existe?
      let question = await Question.findOne({ id: questionId });
      let user = await Users.findOne({ id: userId });

      const answerObj = {
        answer: answer,
        answerAdmin: user,
        answeredAt: Date.now()
      };

      !question.answers ? (question.answers = []) : null;
      question.answers.push(answerObj);

      question.hasAnswer = true;

      console.log(question.answers, question);

      await question.save();

      res.status(200).json({
        message: 'Pregunta enviada correctamente',
        question: question
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

export default createAnswer;