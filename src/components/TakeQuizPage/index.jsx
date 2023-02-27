import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Checkbox, Radio, Modal, Typography, Skeleton } from "antd";
import { CheckCircleFilled, ExclamationCircleFilled } from "@ant-design/icons";
import { red, green } from "@ant-design/colors";
import axios from "axios";
import {
    TakeQuizContext,
    TakeQuizHandlerContext,
} from "../../contexts/TakeQuizContext";
import StartQuizPage from "../StartQuizPage";
import NavigationPane from "../NavigationPane";
import "./index.css";

const { Title, Paragraph, Text } = Typography;

const TakeQuizPage = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const { quiz } = TakeQuizContext();
    const { started, questionIds, currentQuestion, questionsStatus } = quiz;
    const {
        startQuiz,
        updateQuestionIds,
        addQuestion,
        nextQuestion,
        prevQuestion,
        getQuestionStatusCount,
        getAnswered,
    } = TakeQuizHandlerContext();
    const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // show warning of losing progress when user tries to refresh
    useEffect(() => {
        const unloadCallback = (event) => {
            event.preventDefault();
            event.returnValue = "";
            return "";
        };

        window.addEventListener("beforeunload", unloadCallback);
        return () => window.removeEventListener("beforeunload", unloadCallback);
    }, []);

    // Fetch all questionIds when quiz starts
    useEffect(() => {
        (async function () {
            if (started) {
                const response = await axios.get(
                    `http://localhost:5000/quizzes/${quizId}/questions`
                );
                updateQuestionIds(
                    response.data.data.map((question) => question.id)
                );
            }
        })();
    }, [started]);

    const isCurrentQuestionFetched = questionsStatus.hasOwnProperty(
        questionIds[currentQuestion]
    );

    // fetch question when questionIds or currentQuestion changes
    // and the question is not already fetched
    // this does run for the first question because when the quiz is
    // started questionIds changes
    useEffect(() => {
        (async function () {
            if (questionIds.length > 0 && !isCurrentQuestionFetched) {
                const response = await axios.get(
                    `http://localhost:5000/questions/${questionIds[currentQuestion]}`
                );
                addQuestion(response.data.data[0]);
            }
        })();
    }, [questionIds, currentQuestion]);

    const getSubmitConfirmModal = () => {
        const { attempted, unattempted, skipped } = getQuestionStatusCount();
        let icon = (
            <CheckCircleFilled
                style={{ fontSize: "28px", color: green.primary }}
            />
        );
        let message = "You have attempted all the questions.";
        if (attempted !== questionIds.length) {
            icon = (
                <ExclamationCircleFilled
                    style={{ fontSize: "28px", color: red.primary }}
                />
            );
            if (unattempted !== 0 && skipped !== 0) {
                message = `You have ${unattempted} unattempted and ${skipped} skipped questions.`;
            } else if (unattempted !== 0) {
                message = `You have ${unattempted} unattempted questions.`;
            } else if (skipped !== 0) {
                message = `You have ${skipped} skipped questions.`;
            }
        }
        return (
            <Modal
                open={isSubmitConfirmOpen}
                closable={false}
                maskClosable={false}
                width={450}
                cancelButtonProps={{ disabled: isSubmitting }}
                onOk={submit}
                onCancel={() => setIsSubmitConfirmOpen(false)}
                confirmLoading={isSubmitting}
            >
                <div className="submit-confirm-modal">
                    <div>{icon}</div>
                    <div>
                        <Title level={5}>Do you want to submit the quiz?</Title>
                        <p>{message}</p>
                    </div>
                </div>
            </Modal>
        );
    };

    const submit = () => {
        setIsSubmitting(true);
        console.log(getAnswered());
        // the submit request
        setTimeout(() => {
            setIsSubmitting(false);
            navigate("/submissions/someId");
        }, 2000);
    };

    // if quiz has started, show the current question
    if (started) {
        return (
            <section id="take-quiz">
                <div id="quiz-question">
                    {isCurrentQuestionFetched ? (
                        <div className="question-container">
                            <Question />
                            <div className="question-actions">
                                <Button
                                    className="previous"
                                    disabled={currentQuestion === 0}
                                    onClick={prevQuestion}
                                >
                                    &laquo; Previous
                                </Button>
                                <Button
                                    className="next"
                                    disabled={
                                        currentQuestion ===
                                        questionIds.length - 1
                                    }
                                    onClick={nextQuestion}
                                >
                                    Next &raquo;
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div id="quiz-question-loading">
                            <Skeleton.Input active block />
                            <Skeleton active />
                        </div>
                    )}
                </div>
                <div id="quiz-navigation">
                    <NavigationPane quizId={quizId} />
                </div>
                {getSubmitConfirmModal()}
            </section>
        );
    } else {
        return <StartQuizPage startQuiz={startQuiz} />;
    }
};

const RadioOptions = () => {
    const { updateSelectedOptions, getCurrentQuestion } =
        TakeQuizHandlerContext();
    const { _id: questionId, options } = getCurrentQuestion();
    const {
        quiz: {
            questions: { [questionId]: question },
        },
    } = TakeQuizContext();

    // updateSelectedOption takes an array and directly sets it as selectedOptions
    const setSelectedOption = (event) => {
        updateSelectedOptions(questionId, [event.target.value]);
    };

    return (
        <Radio.Group
            onChange={setSelectedOption}
            value={
                question.selectedOptions.length > 0
                    ? question.selectedOptions[0]
                    : ""
            }
        >
            <div className="question-options">
                {options &&
                    options.map(({ _id, text }) => {
                        return (
                            <Radio key={_id} value={_id}>
                                <div className="question-option-text">
                                    {text}
                                </div>
                            </Radio>
                        );
                    })}
            </div>
        </Radio.Group>
    );
};

const CheckboxOptions = () => {
    const { updateOption, getCurrentQuestion } = TakeQuizHandlerContext();
    const { _id: questionId, options } = getCurrentQuestion();
    const {
        quiz: {
            questions: { [questionId]: question },
        },
    } = TakeQuizContext();

    // here we update the status for individual option
    return (
        <div className="question-options">
            {options.map(({ _id, text }) => {
                return (
                    <Checkbox
                        key={_id}
                        value={true}
                        checked={question.selectedOptions.includes(_id)}
                        onChange={(e) =>
                            updateOption(questionId, _id, e.target.checked)
                        }
                    >
                        <div className="question-option-text">{text}</div>
                    </Checkbox>
                );
            })}
        </div>
    );
};

const Question = () => {
    const { getCurrentQuestion } = TakeQuizHandlerContext();
    const { _id, type, text, points } = getCurrentQuestion();

    const Options = type === "single_ans" ? RadioOptions : CheckboxOptions;

    const message =
        type === "single_ans"
            ? "This question has a single answer"
            : "This question can have multiple answers";

    return (
        <div className="take-quiz-question">
            <div className="question-title">
                <Title level={2}>{text}</Title>
                <Text className="question-points" strong>
                    {points} {points > 1 ? "points" : "point"}
                </Text>
                <Paragraph className="multi-single">({message})</Paragraph>
            </div>
            <div className="question-options-container">
                <Options />
            </div>
        </div>
    );
};

export default TakeQuizPage;
