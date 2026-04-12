import { useEffect, useState } from 'react';

// ✅ Create NEW object every time
const createEmptyQuestion = () => ({
  questionText: '',
  options: ['', '', '', ''],
  correctAnswer: 0
});

function QuizForm({ initialData, onSubmit, submitText = 'Save Quiz' }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    questions: [createEmptyQuestion()]
  });

  // ✅ Load initial data (edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        questions:
          initialData.questions?.map((q) => ({
            questionText: q.questionText || '',
            options: [...(q.options || ['', '', '', ''])], // 🔥 clone array
            correctAnswer: Number(q.correctAnswer || 0)
          })) || [createEmptyQuestion()]
      });
    }
  }, [initialData]);

  // ✅ Handle title & description
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle question text / correct answer
  const handleQuestionChange = (index, field, value) => {
    const updated = [...formData.questions];
    updated[index] = { ...updated[index], [field]: value }; // 🔥 clone object
    setFormData((prev) => ({ ...prev, questions: updated }));
  };

  // ✅ Handle options safely
  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...formData.questions];

    const updatedOptions = [...updated[qIndex].options]; // 🔥 clone array
    updatedOptions[optIndex] = value;

    updated[qIndex] = { ...updated[qIndex], options: updatedOptions };

    setFormData((prev) => ({ ...prev, questions: updated }));
  };

  // ✅ Add new question
  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, createEmptyQuestion()]
    }));
  };

  // ✅ Remove question
  const removeQuestion = (index) => {
    if (formData.questions.length === 1) return;

    const updated = formData.questions.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, questions: updated }));
  };

  // ✅ Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      questions: formData.questions.map((q) => ({
        questionText: q.questionText.trim(),
        options: q.options.map((opt) => opt.trim()),
        correctAnswer: Number(q.correctAnswer)
      }))
    };

    onSubmit(payload);
  };

  return (
    <form className="form card" onSubmit={handleSubmit}>
      <div className="card-body">
        <h2 className="form-title">Quiz Details</h2>

        {/* Title */}
        <div className="form-group">
          <label>Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter quiz title"
            required
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter quiz description"
            rows="3"
            required
          />
        </div>

        {/* Questions */}
        <div className="question-list">
          {formData.questions.map((question, qIndex) => (
            <div className="question-box" key={qIndex}>
              <div className="question-header">
                <h3>Question {qIndex + 1}</h3>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => removeQuestion(qIndex)}
                >
                  Remove
                </button>
              </div>

              {/* Question Text */}
              <div className="form-group">
                <label>Question Text</label>
                <input
                  value={question.questionText}
                  onChange={(e) =>
                    handleQuestionChange(qIndex, 'questionText', e.target.value)
                  }
                  placeholder="Enter question"
                  required
                />
              </div>

              {/* Options */}
              {question.options.map((option, optIndex) => (
                <div className="form-group" key={optIndex}>
                  <label>Option {optIndex + 1}</label>
                  <input
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(qIndex, optIndex, e.target.value)
                    }
                    placeholder={`Enter option ${optIndex + 1}`}
                    required
                  />
                </div>
              ))}

              {/* Correct Answer */}
              <div className="form-group">
                <label>Correct Answer</label>
                <select
                  value={question.correctAnswer}
                  onChange={(e) =>
                    handleQuestionChange(
                      qIndex,
                      'correctAnswer',
                      Number(e.target.value)
                    )
                  }
                >
                  <option value={0}>Option 1</option>
                  <option value={1}>Option 2</option>
                  <option value={2}>Option 3</option>
                  <option value={3}>Option 4</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={addQuestion}>
            + Add Question
          </button>
          <button type="submit" className="btn btn-primary">
            {submitText}
          </button>
        </div>
      </div>
    </form>
  );
}

export default QuizForm;