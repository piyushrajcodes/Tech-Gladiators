import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Quiz.css';

const Quiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/quizzes');
        setQuizzes(res.data);
      } catch (error) {
        console.error("Failed to fetch quizzes", error);
      }
    };
    fetchQuizzes();
  }, []);

  const handleStartQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
  };

  const handleAnswerSelect = (answer) => {
    if (!isAnswered) {
      setSelectedAnswer(answer);
    }
  };

  const handleNextQuestion = () => {
    setIsAnswered(true);
    if (selectedAnswer === currentQuiz.questions[currentQuestionIndex].correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const handleRestartQuiz = () => {
    setCurrentQuiz(null);
  };

  const getOptionClassName = (option) => {
    if (!isAnswered) {
      return selectedAnswer === option ? 'selected' : '';
    }
    if (option === currentQuiz.questions[currentQuestionIndex].correctAnswer) {
      return 'correct';
    }
    if (option === selectedAnswer) {
      return 'wrong';
    }
    return '';
  };

  if (showResult) {
    const percentage = ((score / currentQuiz.questions.length) * 100).toFixed(2);
    // TODO: Replace with actual points and rewards logic from backend
    const points = score * 10;
    let rewards = 'No new rewards.';
    if (percentage == 100) {
      rewards = 'You won the Health Champion Badge!';
    } else if (percentage >= 75) {
      rewards = 'You won the Health Enthusiast Badge!';
    }

    return (
      <div className="quiz-container quiz-result">
        <h3>Quiz Completed!</h3>
        <p>Your Score: {score} / {currentQuiz.questions.length}</p>
        <p>Percentage: {percentage}%</p>
        <p>Points Earned: {points}</p>
        <p>Rewards: {rewards}</p>
        <button onClick={handleRestartQuiz}>Try Another Quiz</button>
      </div>
    );
  }

  if (!currentQuiz) {
    return (
      <div className="quiz-container">
        <h2>Quizzes</h2>
        <ul className="quiz-start">
          {quizzes.map((quiz) => (
            <li key={quiz._id}>
              {/* {quiz.title} */}
              <button onClick={() => handleStartQuiz(quiz)}>{quiz.title} Quiz</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const currentQuestion = currentQuiz.questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <h2>{currentQuiz.title}</h2>
      <div className="question-container">
        <p>{currentQuestionIndex + 1}. {currentQuestion.question}</p>
        <div className="options-container">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={getOptionClassName(option)}
              disabled={isAnswered}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="quiz-navigation">
        <button onClick={handleNextQuestion} disabled={!selectedAnswer || isAnswered}>
          {isAnswered ? 'Next' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default Quiz;
