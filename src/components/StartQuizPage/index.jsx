import React from 'react';
import { Button, Form, Input } from 'antd';

import  './index.css';

const QuizStart = () => {
    return (
        <div className="quizStart" >
            <Form id='form'>
                <Form.Item
                    name="username"
                    rules={[{
                        required: true,
                        message: 'Please enter your username!',
                        pattern: '^[a-zA-Z]+( [a-zA-Z]+)?$'
                    }]}>
                    <Input placeholder='username' />
                </Form.Item>

                <Form.Item className='button'>
                    <Button type="primary" htmlType="submit" /*href={quiz}*/>
                        Start Quiz
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
};

export default QuizStart;