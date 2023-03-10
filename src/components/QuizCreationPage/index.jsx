import { React, useState, useEffect } from "react";
import {
    Button,
    Input,
    InputNumber,
    Tabs,
    Modal,
    Radio,
    Checkbox,
    Typography,
} from "antd";
import {
    GetQuizContext,
    GetQuizHandlerContext,
} from "../../contexts/CreateQuizContexts";
import Question from "../Question";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { getQuizzesByIdApi, putQuizzesByIdApi } from "../../api";
import "./index.css";

const { TextArea } = Input;
const { Title, Paragraph, Text } = Typography;

const QuizCreationPage = () => {
    const { quiz } = GetQuizContext();
    const {
        handleSetQuiz,
        handleAddQuestion,
        handleQuizTitle,
        handleQuizDescription,
        handleQuizSettings,
    } = GetQuizHandlerContext();
    const [title, setTitle] = useState(quiz.title);
    const [description, setDescription] = useState(quiz.description);
    
    const { id } = useParams();

    const getCreatedQuiz = async () => {
        try {
            const createdQuiz = await getQuizzesByIdApi(id);
            handleSetQuiz(createdQuiz.data.data[0]);
        }
        catch (err) {
            Modal.error({
                title: 'Could not fetch the quiz data !!!',
            });
        }
    };
    useEffect(() => {
        getCreatedQuiz();
    }, []);
    useEffect(() => {
        handleQuizTitle(title);
    }, [title]);
    useEffect(() => {
        handleQuizDescription(description);
    }, [description]);

    useEffect(() => {
        const unloadCallback = (event) => {
            event.preventDefault();
            event.returnValue = "";
            return "";
        };
        window.addEventListener("beforeunload", unloadCallback);
        return () => window.removeEventListener("beforeunload", unloadCallback);
    }, []);

    const validate = () => {
        if (quiz.title === "") {
            Modal.error({
                title: "Title !!!",
                content: "Quiz title is required",
            });
            return false;
        }
        for (let i = 0; i < quiz.questions.length; i++) {
            const question = quiz.questions[i];
            if (question.text === "") {
                Modal.error({
                    title: "Question title !!!",
                    content: "Question title required",
                });
                return false;
            }
            let correctOptions = question.options.filter((option) => {
                return option.isCorrect;
            });
            if (correctOptions.length === 0) {
                Modal.error({
                    title: "Correct option !!!",
                    content: "Select at least 1 correct option",
                });
                return false;
            }
            question.options.filter((optTxt) => {
                if (optTxt.text === "") {
                    Modal.error({
                        title: "Option text !!!",
                        content: "Enter option text",
                    });
                    return false;
                }
            });
            question.options = question.options.map((opt) => {
                const { text, isCorrect } = opt;
                return { text, isCorrect };
            });
        }
        return true;
    };
    const handleSave = async (event) => {
        const isValid = validate();
        if (!isValid) return;
        const quizCopy = structuredClone(quiz);
        quizCopy.questions.forEach((question) => {
            let correctOptions = question.options.filter((option) => {
                return option.isCorrect;
            });
            question.type =
                correctOptions.length > 1 ? "multiple_ans" : "single_ans";
        });
        const response = await putQuizzesByIdApi(id, quizCopy);
        if (response) {
            Modal.success({
                content: "Quiz saved Successfully"
            })
        }
        else {
            Modal.error({
                title: 'Could not save the quiz !!!',
            });
        }
    };
    return (
        <div className="quizCreationPage">
            <Tabs defaultActiveKey="questions">
                <Tabs.TabPane tab="Questions" key="questions">
                    <div id="form">
                        <div>
                            <h2>Title</h2>
                            <TextArea
                                className="title"
                                allowClear={true}
                                autoSize
                                autoFocus
                                onChange={(t) => {
                                    setTitle(t.target.value);
                                }}
                                value={quiz.title}
                            />
                        </div>
                        <div>
                            <h2>Description</h2>
                            <TextArea
                                className="description"
                                allowClear={true}
                                autoFocus
                                onChange={(d) => {
                                    setDescription(d.target.value);
                                }}
                                value={quiz.description}
                            />
                        </div>
                        <div style={{ margin: "5%" }}>
                            <div>
                                {quiz.questions.map((question, index) => {
                                    return (
                                        <div key={question._id}>
                                            <Question
                                                title={`Question ${index + 1}`}
                                                defaultPoints={
                                                    quiz.settings.defaultPoints
                                                }
                                                data={question}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <Button type="primary" onClick={handleAddQuestion}>
                            Add Question
                        </Button>
                        <Button
                            className="save"
                            type="primary"
                            htmlType="submit"
                            onClick={handleSave}
                        >
                            Save
                        </Button>
                        <Link to="/dashboard">
                            <Button
                                className="submit"
                                type="primary"
                                htmlType="submit"
                            >
                                Submit
                            </Button>
                        </Link>
                    </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Settings" key="settings">
                    <div>
                        Default Points:
                        <InputNumber
                            type="number"
                            min={0}
                            value={quiz.settings.defaultPoints}
                            onChange={(point) => {
                                handleQuizSettings({ defaultPoints: point });
                            }}
                        />
                    </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Preview" tabKey="preview">
                    <div>
                        <h2>Title: {quiz.title}</h2>
                        <p>Description: {quiz.description}</p>
                        {quiz.questions.map((question, index) => {
                            return (
                                <div key={question._id}>
                                    <Question2
                                        key={question._id}
                                        question={question}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
};
const Question2 = ({ question }) => {
    const { _id, text, points, options } = question;
    let correctOptions = options.filter((option) => {
        return option.isCorrect;
    });
    const type = correctOptions.length > 1 ? "multiple_ans" : "single_ans";
    const Option = type === "single_ans" ? Radio : Checkbox;
    
    const message =
        type === "single_ans"
            ? "This question has a single answer"
            : "This question can have multiple answers";

    return (
        <div className="preview-quiz-question">
            <div className="question-title">
                <Title level={2}>{text === "" ? "Empty Question" : text}</Title>
                <Text className="question-points" strong>
                    {points} {points > 1 ? "points" : "point"}
                </Text>
                <Paragraph>({message})</Paragraph>
            </div>
            <div className="question-options-container">
                {options.map((option) => {
                    return <Option key={option._id}>{option.text} </Option>;
                })}
            </div>
        </div>
    );
};
export default QuizCreationPage;
