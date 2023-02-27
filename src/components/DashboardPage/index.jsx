import "./dashboardPage.css";
import { Card, Col, Row, Form, Input, Modal, Button, message } from 'antd';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CopyOutlined, EditOutlined } from '@ant-design/icons';
const { Meta } = Card;
const QuizCreateForm = ({ open, onCreate, onCancel }) => {
    const [form] = Form.useForm();
    return (
        <Modal
            open={open}
            title="Create a new Quiz"
            okText="Create"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        form.resetFields();
                        onCreate(values);
                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
            >
                <Form.Item
                    name="title"
                    label="Title"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the title of quiz!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="Description">
                    <Input.TextArea />
                </Form.Item>
            </Form>
        </Modal>
    );
};
const DashboardPage = () => {
    const [quizzes, setQuizzes] = useState(null);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const onCreate = async (values) => {
        // console.log('Received values of form: ', values);
        const response = await axios.post('http://localhost:5000/quizzes', values);
        // console.log(response.data.data.id);
        navigate(`/quiz/${response.data.data.id}/edit`, { replace: true });
        setOpen(false);
    };
    const getQuizzes = async () => {
        try {
            const quizzes = await axios.get("http://localhost:5000/quizzes/");
            setQuizzes(quizzes);
            // console.log(quizzes.data.data);
        }
        catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        getQuizzes();
    }, []);
    const [messageApi, contextHolder] = message.useMessage();
    return (
        <div className='dashboard'>
            <Button type="primary" shape='round' onClick={() => {
                setOpen(true);
            }}>Create Quiz</Button>
            <QuizCreateForm
                open={open}
                onCreate={onCreate}
                onCancel={() => {
                    setOpen(false);
                }}
            />
            <hr />
            <Row gutter={[10, 10]} justify="center">
                {quizzes !== null && quizzes.data.data.map((quiz) => {
                    return (
                        <Col key={quiz.id}>

                            <Card size="small"
                                className="card"
                                style={{ width: 250 }}
                                actions={[
                                    <CopyOutlined key="copy" onClick={() => {
                                        navigator.clipboard.writeText(`http://localhost:3000/quiz/${quiz.id}`);
                                        messageApi.open({
                                            type: 'success',
                                            content: 'Quiz Link Copied',
                                        });
                                    }} />,
                                    <Link to={`/quiz/${quiz.id}/edit`}>
                                        <EditOutlined key="edit" />
                                    </Link>
                                ]}
                            >
                                {contextHolder}
                                <Link to={`/quiz/${quiz.id}/submissions`}>
                                    <Meta
                                        title={quiz.title}
                                        description={`${quiz.submissionsCount} Submissions`}
                                    />
                                </Link>
                            </Card>
                        </Col>
                    )
                })}
            </Row>
        </div>
    )
}
export default DashboardPage;