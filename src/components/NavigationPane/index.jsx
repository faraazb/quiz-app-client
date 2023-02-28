import { Button, Col, Progress, Row, Modal, Typography, message } from "antd";
import { CheckCircleFilled, ExclamationCircleFilled } from "@ant-design/icons";
import { red, green } from "@ant-design/colors";
import { useNavigate } from "react-router-dom";
import {
    TakeQuizContext,
    TakeQuizHandlerContext,
} from "../../contexts/TakeQuizContext";
import { useEffect, useState } from "react";
import { saveSubmission } from "../../api";
import "./index.css";
const { Title } = Typography;

const NavigationPane = (props) => {
    const { quizId } = props;
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const { quiz } = TakeQuizContext();
    const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [responseError, setResponseError] = useState();
    const [submissionResponse, setSubmissionResponse] = useState(null);
    const { questionIds, currentQuestion, questionsStatus } = quiz;
    const { navigateQuestion, getQuestionStatusCount } =
        TakeQuizHandlerContext();
    const { attempted, unattempted, skipped } = getQuestionStatusCount();
    useEffect(() => {
        if (submissionResponse) {
            const { submission_id } = submissionResponse;
            if (submission_id)
                navigate(`/quiz/${quizId}/submissions/${submission_id}`, {
                    replace: false,
                });
        }
    }, [submissionResponse]);
    useEffect(() => {
        if (responseError) {
            messageApi.open({
                type: "error",
                content: responseError,
            });
        }
    }, [responseError]);
    const submitQuizResponse = () => {
        setIsSubmitting(true);
        let { username, questions } = quiz;
        const submitQuestions = [];
        Object.keys(questions).forEach((quest) => {
            submitQuestions.push({
                _id: quest,
                selectedOptions: questions[quest].selectedOptions,
            });
        });
        const submissionObject = { username, questions: submitQuestions };
        const getResponse = async () => {
            try {
                const response = await saveSubmission(quizId, submissionObject);
                setSubmissionResponse(response);
            } catch (err) {
                const { code, message } = err;
                if (code === "ERR_NETWORK") {
                    setResponseError(new String(message));
                } else {
                    const {
                        data: { message },
                        status,
                    } = err.response;
                    setResponseError(
                        new String(
                            status + " " + message + "Quiz not submitted"
                        )
                    );
                }
            } finally {
                setIsSubmitting(false);
                setIsSubmitConfirmOpen(false);
            }
        };
        getResponse();
    };
    const getPercentage = (current, total) => {
        return (current / total) * 100;
    };
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
                onOk={submitQuizResponse}
                cancelButtonProps={{ disabled: isSubmitting }}
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

    const getNavButtons = () => {
        const buttonsArray = [];
        for (let i = 0; i < questionIds.length; i++) {
            let buttonColor = "gray-bg";
            if (i === currentQuestion) {
                buttonColor = "blue-bg";
            } else if (questionsStatus[questionIds[i]] === "skipped") {
                buttonColor = "yellow-bg";
            } else if (questionsStatus[questionIds[i]] === "attempted") {
                buttonColor = "green-bg";
            }
            buttonsArray.push(
                <Col key={questionIds[i]}>
                    <Button
                        className={buttonColor}
                        onClick={() => navigateQuestion(i)}
                    >
                        {i + 1}
                    </Button>
                </Col>
            );
        }
        return buttonsArray;
    };
    return (
        <div className="navigation-container">
            {contextHolder}
            <div className="progress">
                <div className="progress-bar-container">
                    <Progress
                        strokeLinecap="butt"
                        percent={getPercentage(
                            attempted,
                            attempted + skipped + unattempted
                        )}
                        showInfo={false}
                        status="active"
                        strokeColor={{ from: "#108ee9", to: "#87d068" }}
                    />
                </div>
                <div className="progress-stats-container">
                    <div className="title">
                        Progress ( {attempted}/{questionIds.length})
                    </div>
                    <div className="sub-text green">{attempted} attempted</div>
                    <div className="sub-text gray">
                        {unattempted} unattempted
                    </div>
                    <div className="sub-text yellow">{skipped} skipped</div>
                </div>
            </div>
            <div className="navigation">
                <Row justify="space-evenly" gutter={[16, 16]}>
                    {getNavButtons()}
                </Row>
            </div>
            <div className="bottom-bar">
                <Button
                    type="primary"
                    onClick={() => {
                        setIsSubmitConfirmOpen(true);
                    }}
                >
                    Submit
                </Button>
            </div>
            {getSubmitConfirmModal()}
        </div>
    );
};

export default NavigationPane;
