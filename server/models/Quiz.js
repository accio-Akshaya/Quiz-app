import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
    {
        questionText: {
            type: String,
            required: true,
            trim: true
        },
        options:{
            type: [String],
            validate: {
                validator: function (value){
                    return Array.isArray(value) && value.length === 4 && value.every((item)=>item?.trim());
                },
                message:'Each question must have exactly 4 non-empty options'
            },
            required: true
        },
        correctAnswer:{
            type: Number,
            required: true,
            min: 0,
            max: 3
        }
    },
    {_id:false}
);

const quizSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required:true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User',
            required: true
        },
        questions: {
            type: [questionSchema],
            validate:{
                validator: function(value){
                    return Array.isArray(value) && value.length > 0;
                },
                message:'Quiz must contain at least one question'
            }
        }
    },
    { timestamps: true }
);

const Quiz = mongoose.model('Quiz',quizSchema);

export default Quiz;