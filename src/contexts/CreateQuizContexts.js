import { createContext, useContext, useReducer } from "react";
import uniqid from "uniqid";

const quizContext = createContext(null);
const quizHandlerContext = createContext(null);
const initialQuizState = {
    id: null,
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
        case ACTIONS.SETQUIZ:
            const { _id, title, description, settings, questions } =
                action.quiz;
            newQuiz.id = _id;
            newQuiz.title = title;
            newQuiz.description = description;
            newQuiz.settings = settings;
            newQuiz.questions = questions.map((question) => {
                question.isPointDefault = false;
                return question;
            });
            return newQuiz;
        case ACTIONS.SETQUIZTITLE:
            newQuiz.title = action.title;
            return newQuiz;
        case ACTIONS.SETQUIZDESC:
            newQuiz.description = action.description;
            return newQuiz;
        case ACTIONS.SETQUIZSETTINGS:
            newQuiz.settings = action.settings;
            newQuiz.questions.forEach((question) => {
                if (question.isPointDefault) {
                    question.points = quiz.settings.defaultPoints;
                }
            });
            return newQuiz;
        case ACTIONS.ADDQUESTION:
            newQuiz.questions.push(action.question);
            return newQuiz;
        case ACTIONS.DELETEQUESTION:
            newQuiz.questions = quiz.questions.filter(
                (question) => question.id !== action.questionId
            );
            return newQuiz;
        case ACTIONS.UPDATEQUESTION:
            const index = newQuiz.questions.findIndex(
                (question) => question.id === action.question.id
            );
            if (index === -1) return newQuiz;
            newQuiz.questions[index] = action.question;
            return newQuiz;
        case ACTIONS.ADDOPTION:
            question = newQuiz.questions.find(
                (question) => question.id === action.questionId
            );
            if (!question) return newQuiz;
            question.options.push(action.option);
            return newQuiz;
        case ACTIONS.DELETEOPTION:
            result = newQuiz.questions.find(
                (question) => question.id === action.questionId
            );
            if (!result) return newQuiz;
            result.options = result.options.filter(
                (option) => option.id !== action.optionId
            );
            return newQuiz;
        case ACTIONS.UPDATEOPTION:
            question = newQuiz.questions.find(
                (question) => question.id === action.questionId
            );
            if (!question) return newQuiz;
            result = question.options.findIndex(
                (option) => option.id === action.option.id
            );
            if (result === -1) return newQuiz;
            question.options[result] = action.option;
            return newQuiz;
        default:
            return newQuiz;
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
    const handleQuizSettings = (settings) => {
        dispatch({ type: ACTIONS.SETQUIZSETTINGS, settings });
    };
    const handleAddQuestion = () => {
        const questionId = uniqid();
        const question = {
            id: questionId,
            title: "",
            points: quiz.settings.defaultPoints,
            isPointDefault: true,
            options: [],
        };
        dispatch({ type: ACTIONS.ADDQUESTION, question: question });
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
            id: uniqid(),
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
    const handleUpdateOption = (questionId, option) => {
        dispatch({
            type: ACTIONS.UPDATEOPTION,
            questionId,
            option,
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
