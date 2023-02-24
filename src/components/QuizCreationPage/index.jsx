import { React, useState, useEffect } from 'react';
import { Button, Form, Input, InputNumber } from 'antd';
import { Tabs } from 'antd';
import { GetQuizContext, GetQuizHandlerContext } from '../../contexts/CreateQuizContexts';
import Question from "../Question";

import './index.css'

const QuizCreationPage = () => {
    const { quiz } = GetQuizContext()
    const { handleAddQuestion, handleQuizTitle, handleQuizDescription, handleQuizSettings } = GetQuizHandlerContext()
    const [settings, setSettings] = useState(quiz.settings);
    const [title, setTitle] = useState([]);
    const [description, setDescription] = useState([])
    useEffect(() => {
        handleQuizSettings(settings);
    }, [settings]);
    console.log("Quiz", quiz);
    useEffect(() => {
        handleQuizTitle(title)
    }, [title]);
    useEffect(() => {
        handleQuizDescription(description)
    }, [description]);
    const handleSave = (event) => {
        event.preventDefault();
        const {
            target: { },
        } = event;
        console.log("saved", title);
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
                            name="description"
                            rules={[{
                                required: true,
                                message: 'Please enter the valid Quiz description!',
                            }]}>
                            <Input
                                size='large'
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
                        <Button className='submit' type="primary" htmlType='submit'>
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