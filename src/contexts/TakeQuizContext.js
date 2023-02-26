import { createContext, useContext, useReducer } from "react";

const Context = createContext();
const DispatchContext = createContext();

const QUE_STATUS = {
    ATTEMPTED: "attempted",
    UNATTEMPTED: "unattempted",
    SKIPPED: "skipped",
};

const initialState = {
    started: false,
    username: null,
    questionIds: [],
    questionsStatus: {},
    questions: {},
    currentQuestion: 0,
};

const TakeQuizContext = () => {
    return useContext(Context);
};

const TakeQuizHandlerContext = () => {
    return useContext(DispatchContext);
};

const ACTION = {
    UPDATE_USERNAME: "takeQuiz/updateUsername",
    START_QUIZ: "takeQuiz/startQuiz",
    UPDATE_QUESTIONIDS: "takeQuiz/updateQuestionIds",
    ADD_QUESTION: "takeQuiz/addQuestion",
    SELECT_OPTION: "takeQuiz/selectOption",
    DESELECT_OPTION: "takeQuiz/deselectOption",
    UPDATE_SELECTED_OPTIONS: "takeQuiz/updateSelectedOptions",
    NEXT_QUESTION: "takeQuiz/nextQuestion",
    PREV_QUESTION: "takeQuiz/prevQuestion",
    NAV_QUESTION: "takeQuiz/navigateQuestion",
};

function getQuestionByIndex(state, index) {
    return state.questions[state.questionIds[index]];
}

const reducer = (state, action) => {
    const nextState = structuredClone(state);
    switch (action.type) {
        case ACTION.UPDATE_USERNAME: {
            const { username } = action.payload;
            nextState.username = username;
            return nextState;
        }
        case ACTION.START_QUIZ: {
            nextState.started = true;
            return nextState;
        }
        case ACTION.UPDATE_QUESTIONIDS: {
            const { questionIds } = action.payload;
            nextState.questionIds = questionIds;
            return nextState;
        }
        case ACTION.ADD_QUESTION: {
            const {
                question: { _id, text, type, options, points },
            } = action.payload;
            nextState.questions[_id] = {
                _id,
                text,
                type,
                options,
                points,
                selectedOptions: [],
            };
            nextState.questionsStatus[_id] = QUE_STATUS.UNATTEMPTED;
            return nextState;
        }
        case ACTION.NEXT_QUESTION: {
            if (
                nextState.currentQuestion ===
                nextState.questionIds.length - 1
            ) {
                return nextState;
            }
            const toBePrevQuestion = getQuestionByIndex(
                nextState,
                nextState.currentQuestion
            );
            if (toBePrevQuestion.selectedOptions.length === 0) {
                nextState.questionsStatus[toBePrevQuestion._id] =
                    QUE_STATUS.SKIPPED;
            }
            nextState.currentQuestion += 1;
            return nextState;
        }
        case ACTION.PREV_QUESTION: {
            if (nextState.currentQuestion === 0) {
                return nextState;
            }
            const toBePrevQuestion = getQuestionByIndex(
                nextState,
                nextState.currentQuestion
            );
            if (toBePrevQuestion.selectedOptions.length === 0) {
                nextState.questionsStatus[toBePrevQuestion._id] =
                    QUE_STATUS.SKIPPED;
            }
            nextState.currentQuestion -= 1;
            return nextState;
        }
        case ACTION.NAV_QUESTION: {
            const { index } = action.payload;
            if (index < 0 || index >= nextState.questionIds.length) {
                return nextState;
            }
            const toBePrevQuestion = getQuestionByIndex(
                nextState,
                nextState.currentQuestion
            );
            if (toBePrevQuestion.selectedOptions.length === 0) {
                nextState.questionsStatus[toBePrevQuestion._id] =
                    QUE_STATUS.SKIPPED;
            }
            nextState.currentQuestion = index;
            return nextState;
        }
        case ACTION.SELECT_OPTION: {
            const { questionId, optionId } = action.payload;
            if (
                nextState.questions[questionId].options.find(
                    (opt) => opt._id === optionId
                ) &&
                !nextState.questions[questionId].selectedOptions.includes(
                    optionId
                )
            ) {
                nextState.questions[questionId].selectedOptions.push(optionId);
                if (
                    nextState.questions[questionId].selectedOptions.length === 1
                ) {
                    nextState.questionsStatus[questionId] =
                        QUE_STATUS.ATTEMPTED;
                }
                return nextState;
            }
            return nextState;
        }
        case ACTION.DESELECT_OPTION: {
            const { questionId, optionId } = action.payload;
            const index =
                nextState.questions[questionId].selectedOptions.indexOf(
                    optionId
                );
            nextState.questions[questionId].selectedOptions.splice(index, 1);
            if (nextState.questions[questionId].selectedOptions.length === 0) {
                nextState.questionsStatus[questionId] = QUE_STATUS.SKIPPED;
            }
            return nextState;
        }
        case ACTION.UPDATE_SELECTED_OPTIONS: {
            const { questionId, optionsIds } = action.payload;
            nextState.questions[questionId].selectedOptions = optionsIds;
            if (optionsIds.length > 0) {
                nextState.questionsStatus[questionId] = QUE_STATUS.ATTEMPTED;
            } else {
                nextState.questionsStatus[questionId] = QUE_STATUS.SKIPPED;
            }
            return nextState;
        }
    }
};

const TakeQuizProvider = ({ children }) => {
    const [quiz, dispatch] = useReducer(reducer, initialState);

    const startQuiz = (username) => {
        dispatch({ type: ACTION.UPDATE_USERNAME, payload: { username } });
        dispatch({ type: ACTION.START_QUIZ });
    };

    const updateQuestionIds = (questionIds) => {
        dispatch({ type: ACTION.UPDATE_QUESTIONIDS, payload: { questionIds } });
    };

    const addQuestion = (question) => {
        dispatch({ type: ACTION.ADD_QUESTION, payload: { question } });
    };

    const nextQuestion = () => {
        if (quiz.currentQuestion !== quiz.questionIds.length - 1) {
            dispatch({
                type: ACTION.NAV_QUESTION,
                payload: { index: quiz.currentQuestion + 1 },
            });
        }
    };

    const prevQuestion = () => {
        if (quiz.currentQuestion !== 0) {
            dispatch({
                type: ACTION.NAV_QUESTION,
                payload: { index: quiz.currentQuestion - 1 },
            });
        }
    };

    const navigateQuestion = (index) => {
        dispatch({ type: ACTION.NAV_QUESTION, payload: { index } });
    };

    // update a single option's selected status
    const updateOption = (questionId, optionId, select) => {
        if (select) {
            dispatch({
                type: ACTION.SELECT_OPTION,
                payload: { questionId, optionId },
            });
        } else {
            dispatch({
                type: ACTION.DESELECT_OPTION,
                payload: { questionId, optionId },
            });
        }
    };

    // directly assign to selectedOptions array
    const updateSelectedOptions = (questionId, optionsIds) => {
        dispatch({
            type: ACTION.UPDATE_SELECTED_OPTIONS,
            payload: { questionId, optionsIds },
        });
    };

    // update the entire selectedOptions array to [] empty array
    const clearSelectedOptions = (questionId) => {
        dispatch({
            type: ACTION.UPDATE_SELECTED_OPTIONS,
            payload: { questionId, optionIds: [] },
        });
    };

    // helper function to get current question and
    // avoid playing with  indices
    const getCurrentQuestion = () => {
        const { questions, questionIds, currentQuestion } = quiz;
        return questions[questionIds[currentQuestion]];
    };

    // function to get counts of questions grouped by status
    const getQuestionStatusCount = () => {
        let statusCount = { attempted: 0, unattempted: 0, skipped: 0 };
        Object.values(quiz.questionsStatus).forEach((status) => {
            statusCount[status] += 1;
        });
        // hack for unattempted
        statusCount["unattempted"] =
            quiz.questionIds.length -
            statusCount["attempted"] -
            statusCount["skipped"];
        return statusCount;
    };

    // helper to get a API compatible object for sending a request
    const getAnswered = () => {
        const { questions, questionsStatus } = quiz;
        let answeredQuestions = Object.values(questions).filter(
            (question) => questionsStatus[question._id] === "attempted"
        );
        return answeredQuestions.map(({ _id, selectedOptions }) => ({
            question: _id,
            selectedOptions,
        }));
    };

    return (
        <Context.Provider value={{ quiz }}>
            <DispatchContext.Provider
                value={{
                    startQuiz,
                    updateQuestionIds,
                    addQuestion,
                    nextQuestion,
                    prevQuestion,
                    navigateQuestion,
                    updateOption,
                    updateSelectedOptions,
                    clearSelectedOptions,
                    getCurrentQuestion,
                    getQuestionStatusCount,
                    getAnswered,
                }}
            >
                {children}
            </DispatchContext.Provider>
        </Context.Provider>
    );
};

export { TakeQuizProvider, TakeQuizContext, TakeQuizHandlerContext };
