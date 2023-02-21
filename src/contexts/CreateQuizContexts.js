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
    ADDQUESTION: "addQuestion",
    DELETEQUESTION: "deleteQuestion",
    UPDATEQUESTION: "updateQuestion",
    ADDOPTION: "addOption",
    DELETEOPTION: "deleteOption",
};

const GetQuizContext = () => {
    return useContext(quizContext);
};
const GetQuizHandlerContext = () => {
    return useContext(quizHandlerContext);
};

const quizReducer = (quiz, action) => {
    switch (action.type) {
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
            const question = quiz.questions.find(
                (question) => question.id === action.questionId
            );
            if (!question) return quiz;
            question.options.push(action.option);
            return { ...quiz };
        case ACTIONS.DELETEOPTION:
            let result = quiz.questions.find(
                (question) => question.id === action.questionId
            );
            if (!result) return quiz;
            result.options = result.options.filter(
                (option) => option.id !== action.optionId
            );
            return { ...quiz };
        default:
            return quiz;
    }
};

const QuizProvider = (props) => {
    const [quiz, dispatch] = useReducer(quizReducer, initialQuizState);
    const handleAddQuestion = () => {
        const questionId = uniqid();
        const question = {
            id: questionId,
            title: "",
            points: quiz.settings.defaultPoints,
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
            question: question,
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
            questionId: questionId,
            option: option,
        });
    };
    const handleDeleteOption = (questionId, optionId) => {
        dispatch({
            type: ACTIONS.DELETEOPTION,
            questionId: questionId,
            optionId: optionId,
        });
    };
    return (
        <quizContext.Provider value={{ quiz }}>
            <quizHandlerContext.Provider
                value={{
                    handleAddQuestion,
                    handleDeleteQuestion,
                    handleUpdateQuestion,
                    handleAddOption,
                    handleDeleteOption,
                }}
            >
                {props.children}
            </quizHandlerContext.Provider>
        </quizContext.Provider>
    );
};

export { GetQuizContext, GetQuizHandlerContext, QuizProvider };
