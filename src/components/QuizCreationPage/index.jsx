import { React, useState } from 'react';
import { Button, Form, Input } from 'antd';
import uniqid from "uniqid";
import Question from "../Question";

import './index.css'

const QuizCreationPage = () => {
    const [questionsList, setQuestionsList] = useState([]);
    const addQuestionOnClickHandler = (event) => {
        const questionId = uniqid();
        const question = (
            <div key={questionId}>
                <Question
                    defaultPoint={1}
                    parentKey={questionId}
                    removeOnClickHandler={removeQuestionOnClickHandler} />
            </div>
        );
        setQuestionsList(questionsList.concat(question));
    };
    const removeQuestionOnClickHandler = (event, key) => {
        setQuestionsList((questionsList) => {
            return questionsList.filter((question) => question.key !== key)
        });
    };
    return (
        <div className='quizCreationPage'>
            <Form id='form'>
                <Form.Item
                    name="title"
                    rules={[{
                        required: true,
                        message: 'Please enter the valid Quiz title!',
                    }]}><h2>Title</h2>
                    <Input />
                </Form.Item>
                <Form.Item
                    name="description"
                    rules={[{
                        required: true,
                        message: 'Please enter the valid Quiz description!',
                    }]}><h2>Description</h2>
                    <Input />
                </Form.Item>
            </Form>
            <div>
                <div className='button'>{questionsList}</div>
                <Button type="primary" htmlType='submit' onClick={addQuestionOnClickHandler}>
                    Add Question
                </Button>
            </div>
        </div>
    )
}

export default QuizCreationPage;