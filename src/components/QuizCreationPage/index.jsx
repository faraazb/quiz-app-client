import { React, useState, useEffect } from 'react';
import { Button, Form, Input, InputNumber, Modal } from 'antd';
import { Tabs } from 'antd';
import axios from 'axios';
import { GetQuizContext, GetQuizHandlerContext } from '../../contexts/CreateQuizContexts';
import Question from "../Question";

import './index.css'
const url = "http://localhost:5000/quizzes"
const QuizCreationPage = () => {
    const { quiz } = GetQuizContext()
    const { handleAddQuestion, handleQuizTitle, handleQuizDescription, handleQuizSettings } = GetQuizHandlerContext()
    const [settings, setSettings] = useState(quiz.settings);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("")

    useEffect(() => {
        handleQuizSettings(settings);
    }, [settings]);
    useEffect(() => {
        handleQuizTitle(title)
    }, [title]);
    useEffect(() => {
        handleQuizDescription(description)
    }, [description]);

    const validate = () => {
        if (quiz.title === "") {
            Modal.error({
                title: 'Title !!!',
                content: 'Quiz title is required',
            });
            return true
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
            let optionText = question.options.filter((optTxt) => {
                return optTxt.text
            })
            if (optionText.length === 0) {
                Modal.error({
                    title: 'Option text !!!',
                    content: 'Enter option text',
                });
                return false
            }
            if (correctOptions.length === 0) {
                Modal.error({
                    title: 'Correct option !!!',
                    content: 'Select at least 1 correct option',
                });
                return false
            }
            return true
            Modal.success({
                content: 'Saved the quiz',
            });
        }
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
        const response = await axios.post(url, quizCopy);  
    };
    return (
        <div className='quizCreationPage'>
            <Tabs defaultActiveKey='questions'>
                <Tabs.TabPane tab='Questions' key='questions'>
                    <Form id='form'>
                        <h2>Title</h2>
                        <Form.Item
                            name="title"
                            rules={[{
                                required: true,
                                message: 'Please enter the valid Quiz title!',
                            }]}>
                            <Input
                                className='title'
                                autoFocus
                                value={title}
                                onChange={(t) => {
                                    setTitle(t.target.value)
                                }} />
                        </Form.Item>
                        <h2>Description</h2>
                        <Form.Item
                            name="description">
                            <Input
                                className='description'
                                size="large"
                                value={description}
                                onChange={(d) => {
                                    setDescription(d.target.value)
                                }} />
                        </Form.Item>
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
                        <Button className='submit' type="primary" htmlType='submit' onClick={handleSave}>
                            Save
                        </Button>
                    </Form>
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