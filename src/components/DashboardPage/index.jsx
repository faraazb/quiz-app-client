import "./dashboardPage.css";
import Header from "../Header/Header";
import React from 'react';
import { Card, Col, Row } from 'antd';
import { Button } from 'antd';
const DashboardPage = () => {
    return  (
        <div>
            <Header />
            <div className='body'>
                <Button type="primary" href="#" shape='round'>Create Quiz</Button>
                <hr />
                <div className='quizContainer'>
                    <Row gutter={[10,10]} justify="center">
                        <Col>
                            <Card size="small" title="Quiz Title" style={{ width: 200, height: 100 }}>
                                <p>15 Submissions</p>
                            </Card>
                        </Col>
                        <Col>
                            <Card size="small" title="Quiz Title" style={{ width: 200, height: 100 }}>
                                <p>15 Submissions</p>
                            </Card>
                        </Col>
                        <Col>
                            <Card size="small" title="Quiz Title" style={{ width: 200, height: 100 }}>
                                <p>15 Submissions</p>
                            </Card>
                        </Col>
                        <Col>
                            <Card size="small" title="Quiz Title" style={{ width: 200, height: 100 }}>
                                <p>15 Submissions</p>
                            </Card>
                        </Col>
                        <Col>
                            <Card size="small" title="Quiz Title" style={{ width: 200, height: 100 }}>
                                <p>15 Submissions</p>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}
export default DashboardPage;