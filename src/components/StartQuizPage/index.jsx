import React from 'react';
import { Button, Form, Input } from 'antd';

import  './index.css';

const StartQuizPage = () => {
    return (
        <div className="startQuizPage" >
            <Form id='form'>
                <Form.Item
                    name="username"
                    rules={[{
                        required: true,
                        message: 'Please enter a valid username!',
                        pattern: '^[a-zA-Z._]+$'
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

export default StartQuizPage;