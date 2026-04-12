import mongoose from 'mongoose';
const answerSchema = new mongoose.Schema(
    {
        questionIndex:{
            type:Number,
            required: true
        },
        selectedAnswer: {
            type: Number,
            default: null
        },
        isCorrect:{
            type: Boolean,
            required: true
        }
    },
    {_id: false}
);
const resultSchema = new mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        quizId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quiz',
            required: true
        },
        score:{
            type: Number,
            required: true
        },
        totalQuestion:{
            type: Number,
            required: true
        },
        correctCount:{
            type: Number,
            required: true
        },
        wrongCount:{
            type:Number,
            required: true
        },
        answers: {
            type: [answerSchema],
            default: []
        }
    },
    { timestamps: true }
);

const Result = mongoose.model('Result', resultSchema)

export default Result;