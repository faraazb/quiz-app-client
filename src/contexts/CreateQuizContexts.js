import { createContext, useContext, useReducer } from "react";
import uniqid from "uniqid";

const quizContext = createContext(null);
const quizHandlerContext = createContext(null);
const initialQuizState = {
    title: "",
    description: "",
    settings: { defaultPoints: 0 },
    questions: [],
};
const ACTIONS = {
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
    switch (action.type) {
        case ACTIONS.SETQUIZTITLE:
            quiz.title = action.title;
            return { ...quiz };
        case ACTIONS.SETQUIZDESC:
            quiz.description = action.description;
            return { ...quiz };
        case ACTIONS.SETQUIZSETTINGS:
            quiz.settings = action.settings;
            quiz.questions.forEach((question) => {
                if (question.isPointDefault) {
                    question.points = quiz.settings.defaultPoints;
                }
            });
            return { ...quiz };
        case ACTIONS.ADDQUESTION:
            quiz.questions.push(action.question);
            return { ...quiz };
        case ACTIONS.DELETEQUESTION:
            quiz.questions = quiz.questions.filter(
                (question) => question.id !== action.questionId
            );
            return { ...quiz };
        case ACTIONS.UPDATEQUESTION:
            const index = quiz.questions.findIndex(
                (question) => question.id === action.question.id
            );
            if (index === -1) return quiz;
            quiz.questions[index] = action.question;
            return { ...quiz };
        case ACTIONS.ADDOPTION:
            question = quiz.questions.find(
                (question) => question.id === action.questionId
            );
            if (!question) return quiz;
            question.options.push(action.option);
            return { ...quiz };
        case ACTIONS.DELETEOPTION:
            result = quiz.questions.find(
                (question) => question.id === action.questionId
            );
            if (!result) return quiz;
            result.options = result.options.filter(
                (option) => option.id !== action.optionId
            );
            return { ...quiz };
        case ACTIONS.UPDATEOPTION:
            question = quiz.questions.find(
                (question) => question.id === action.questionId
            );
            if (!question) return quiz;
            result = question.options.findIndex(
                (option) => option.id === action.option.id
            );
            if (result === -1) return quiz;
            question.options[result] = action.option;
            return { ...quiz };
        default:
            return quiz;
    }
};

const QuizProvider = (props) => {
    const [quiz, dispatch] = useReducer(quizReducer, initialQuizState);
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
