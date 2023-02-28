import { createContext, useContext, useReducer } from "react";
import uniqid from "uniqid";

const quizContext = createContext(null);
const quizHandlerContext = createContext(null);
const initialQuizState = {
    _id: null,
    title: "",
    description: "",
    settings: { defaultPoints: 0 },
    questions: [],
};

const ACTIONS = {
    SETQUIZ: "setQuiz",
    SETQUIZTITLE: "setQuizTitle",
    SETQUIZDESC: "setQuizDesc",
    SETQUIZSETTINGS: "setQuizSettings",
    ADDQUESTION: "addQuestion",
    DELETEQUESTION: "deleteQuestion",
    UPDATEQUESTION: "updateQuestion",
    ADDOPTION: "addOption",
    DELETEOPTION: "deleteOption",
    UPDATEOPTION: "updateOption",
};

const GetQuizContext = () => {
    return useContext(quizContext);
};
const GetQuizHandlerContext = () => {
    return useContext(quizHandlerContext);
};
const quizReducer = (quiz, action) => {
    let result, question;
    const newQuiz = structuredClone(quiz);
    switch (action.type) {
        case ACTIONS.SETQUIZ: {
            let { _id, title, description, settings, questions } = action.quiz;
            newQuiz._id = _id;
            newQuiz.title = title;
            newQuiz.description = description;
            newQuiz.settings = settings;
            newQuiz.questions = questions.map((question) => {
                if (settings.defaultPoints === question.points)
                    question.isPointDefault = true;
                else question.isPointDefault = false;
                return question;
            });
            return newQuiz;
        }
        case ACTIONS.SETQUIZTITLE: {
            newQuiz.title = action.title;
            return newQuiz;
        }
        case ACTIONS.SETQUIZDESC: {
            newQuiz.description = action.description;
            return newQuiz;
        }
        case ACTIONS.SETQUIZSETTINGS: {
            Object.keys(action.updateObject).forEach((key) => {
                newQuiz.settings[key] = action.updateObject[key];
            });
            newQuiz.questions.forEach((question) => {
                if (question.isPointDefault) {
                    question.points = newQuiz.settings.defaultPoints;
                }
            });
            return newQuiz;
        }
        case ACTIONS.ADDQUESTION: {
            newQuiz.questions.push(action.question);
            return newQuiz;
        }
        case ACTIONS.DELETEQUESTION: {
            newQuiz.questions = newQuiz.questions.filter(
                (question) => question._id !== action.questionId
            );
            return newQuiz;
        }
        case ACTIONS.UPDATEQUESTION: {
            question = newQuiz.questions.find(
                (question) => question._id === action.question._id
            );
            if (!question) return newQuiz;
            let { text, isPointDefault, points } = action.question;
            question.text = text;
            question.isPointDefault = isPointDefault;
            question.points = points;
            return newQuiz;
        }
        case ACTIONS.ADDOPTION: {
            question = newQuiz.questions.find(
                (question) => question._id === action.questionId
            );
            if (!question) return newQuiz;
            question.options.push(action.option);
            return newQuiz;
        }
        case ACTIONS.DELETEOPTION: {
            result = newQuiz.questions.find(
                (question) => question._id === action.questionId
            );
            if (!result) return newQuiz;
            if (result.options.length === 2) {
                return newQuiz;
            }
            result.options = result.options.filter(
                (option) => option._id !== action.optionId
            );
            return newQuiz;
        }
        case ACTIONS.UPDATEOPTION: {
            question = newQuiz.questions.find(
                (question) => question._id === action.questionId
            );
            if (!question) return newQuiz;
            result = question.options.findIndex(
                (option) => option._id === action.updateObject._id
            );
            if (result === -1) return newQuiz;
            const option = structuredClone(question.options[result]);
            Object.keys(action.updateObject).forEach((key) => {
                if (key !== "_id") option[key] = action.updateObject[key];
            });
            question.options[result] = option;
            return newQuiz;
        }
        default: {
            return newQuiz;
        }
    }
};

const QuizProvider = (props) => {
    const [quiz, dispatch] = useReducer(quizReducer, initialQuizState);
    const handleSetQuiz = (newQuiz) => {
        dispatch({ type: ACTIONS.SETQUIZ, quiz: newQuiz });
    };
    const handleQuizTitle = (title) => {
        dispatch({ type: ACTIONS.SETQUIZTITLE, title });
    };
    const handleQuizDescription = (description) => {
        dispatch({ type: ACTIONS.SETQUIZDESC, description });
    };
    const handleQuizSettings = (updateObject) => {
        dispatch({ type: ACTIONS.SETQUIZSETTINGS, updateObject });
    };
    const handleAddQuestion = () => {
        const questionId = uniqid();
        const question = {
            _id: questionId,
            text: "",
            points: quiz.settings.defaultPoints,
            isPointDefault: true,
            options: [],
        };
        dispatch({ type: ACTIONS.ADDQUESTION, question: question });
        handleAddOption(questionId);
        handleAddOption(questionId);
    };
    const handleDeleteQuestion = (questionId) => {
        dispatch({
            type: ACTIONS.DELETEQUESTION,
            questionId: questionId,
        });
    };
    const handleUpdateQuestion = (question) => {
        dispatch({
            type: ACTIONS.UPDATEQUESTION,
            question,
        });
    };
    const handleAddOption = (questionId) => {
        const option = {
            _id: uniqid(),
            isCorrect: false,
            text: "",
        };
        dispatch({
            type: ACTIONS.ADDOPTION,
            questionId,
            option,
        });
    };
    const handleDeleteOption = (questionId, optionId) => {
        dispatch({
            type: ACTIONS.DELETEOPTION,
            questionId,
            optionId,
        });
    };
    const handleUpdateOption = (questionId, updateObject) => {
        dispatch({
            type: ACTIONS.UPDATEOPTION,
            questionId,
            updateObject,
        });
    };
    return (
        <quizContext.Provider value={{ quiz }}>
            <quizHandlerContext.Provider
                value={{
                    handleSetQuiz,
                    handleQuizTitle,
                    handleQuizDescription,
                    handleQuizSettings,
                    handleAddQuestion,
                    handleDeleteQuestion,
                    handleUpdateQuestion,
                    handleAddOption,
                    handleDeleteOption,
                    handleUpdateOption,
                }}
            >
                {props.children}
            </quizHandlerContext.Provider>
        </quizContext.Provider>
    );
};

export { GetQuizContext, GetQuizHandlerContext, QuizProvider };
