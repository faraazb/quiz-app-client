import { React, useState, useEffect } from 'react';
import { Button, Input, InputNumber, Tabs, Modal } from 'antd';
import axios from 'axios';
import { GetQuizContext, GetQuizHandlerContext } from '../../contexts/CreateQuizContexts';
import Question from "../Question";
import { useParams } from 'react-router';
import { Link } from "react-router-dom";

import './index.css'

const { TextArea } = Input;

const QuizCreationPage = () => {
    const { quiz } = GetQuizContext()
    const { handleSetQuiz, handleAddQuestion, handleQuizTitle, handleQuizDescription, handleQuizSettings } = GetQuizHandlerContext()
    const [settings, setSettings] = useState(quiz.settings);
    const [title, setTitle] = useState(quiz.title);
    const [description, setDescription] = useState(quiz.description);
    console.log(quiz)
    const { id } = useParams();

    const getCreatedQuiz = async () => {
        try {
            const createdQuiz = await axios.get(`http://localhost:5000/quizzes/${id}`);
            handleSetQuiz(createdQuiz.data.data[0]);
        }
        catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        getCreatedQuiz();
    }, []);
    useEffect(() => {
        handleQuizSettings(settings);
    }, [settings]);
    useEffect(() => {
        handleQuizTitle(title)
    }, [title]);
    useEffect(() => {
        handleQuizDescription(description)
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
                title: 'Title !!!',
                content: 'Quiz title is required',
            });
            return false
        }
        for (let i = 0; i < quiz.questions.length; i++) {
            const question = quiz.questions[i];
            if (question.text === "") {
                Modal.error({
                    title: 'Question title !!!',
                    content: 'Question title required',
                });
                return false;
            }
            let correctOptions = question.options.filter((option) => {
                return option.isCorrect
            })
            if (correctOptions.length === 0) {
                Modal.error({
                    title: 'Correct option !!!',
                    content: 'Select at least 1 correct option',
                });
                return false
            }
            question.options.filter((optTxt) => {
                if (optTxt.text === "") {
                    Modal.error({
                        title: 'Option text !!!',
                        content: 'Enter option text',
                    });
                    return false
                }
            })
            question.options = question.options.map((opt) => {
                const { text, isCorrect } = opt;
                return { text, isCorrect };
            })
        }
        return true;
    }
    const handleSave = async (event) => {
        const isValid = validate();
        if (!isValid) return;
        const quizCopy = structuredClone(quiz);
        quizCopy.questions.forEach((question) => {
            let correctOptions = question.options.filter((option) => {
                return option.isCorrect
            })
            question.type = correctOptions.length > 1 ? "multiple_ans" : "single_ans";
        })
        const response = await axios.put(`http://localhost:5000/quizzes/${id}`, quizCopy);
        if (response) {
            Modal.success({
                content: "Quiz saved Successfully"
            })
        }
        else {
            console.log("response", response)
        }
    };
    return (
        <div className='quizCreationPage'>
            <Tabs defaultActiveKey='questions'>
                <Tabs.TabPane tab='Questions' key='questions'>
                    <div id='form'>
                        <div>
                            <h2>Title</h2>
                            <TextArea
                                className="title"
                                allowClear={true}
                                autoSize
                                autoFocus
                                onChange={setTitle}
                                value={quiz.title}
                            />
                        </div>
                        <div>
                            <h2>Description</h2>
                            <TextArea
                                className="description"
                                allowClear={true}
                                autoFocus
                                onChange={setDescription}
                                value={quiz.description}
                            />
                        </div>
                        <div style={{ margin: "5%" }}>
                            <div>
                                {quiz.questions.map((question, index) => {
                                    return (
                                        <div key={question.id}>
                                            <Question
                                                title={`Question ${index + 1}`}
                                                defaultPoints={quiz.settings.defaultPoints}
                                                data={question}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <Button type='primary' onClick={handleAddQuestion}>
                            Add Question
                        </Button>
                        <Button className='save' type="primary" htmlType='submit' onClick={handleSave}>
                            Save
                        </Button>
                        <Link to="/dashboard">
                            <Button className='submit' type="primary" htmlType='submit'>
                                Submit
                            </Button>
                        </Link>
                    </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab='Settings' key='settings'>
                    <div>
                        Default Points:
                        <InputNumber
                            type="number"
                            min={0}
                            value={settings.defaultPoints}
                            onChange={(point) => {
                                setSettings((olderSettings) => {
                                    const newSettings = structuredClone(olderSettings)
                                    newSettings.defaultPoints = point;
                                    return newSettings;
                                })
                            }}
                        />
                    </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab='Preview' tabKey='preview'></Tabs.TabPane>
            </Tabs>
        </div>
    )
}

export default QuizCreationPage;