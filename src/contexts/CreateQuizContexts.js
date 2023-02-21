import { createContext, useReducer } from "react";
import uniqid from "uniqid";

const quizContext = createContext(null);
const quizFunctionsContext = createContext(null);
const initialQuizState = {
    title: "",
    description: "",
    settings: { defaultPoints: 0 },
    questions: [],
};
const ACTIONS = {
    ADDQUESTION: "addQuestion",
};

const quizReducer = (quiz, action) => {
    switch (action.type) {
        case ACTIONS.ADDQUESTION:
            quiz.questions.push(action.question);
            return { ...quiz };
    }
};

const QuizState = (props) => {
    const [quiz, dispatch] = useReducer(quizReducer, initialQuizState);
    const handleAddQuestion = () => {
        const questionId = uniqid();
        const question = {
            id: questionId,
            title: "",
            points: quiz.defaultPoints,
            options: [],
        };
        dispatch({ type: ACTIONS.ADDQUESTION, question: question });
    };
    return (
        <quizContext.Provider value={{ quiz }}>
            <quizFunctionsContext.Provider value={{ handleAddQuestion }}>
                {props.children}
            </quizFunctionsContext.Provider>
        </quizContext.Provider>
    );
};

export { quizContext, quizFunctionsContext, QuizState };
