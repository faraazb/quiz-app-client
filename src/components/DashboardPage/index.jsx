import "./dashboardPage.css";
import { Card, Col, Row } from 'antd';
import { Button } from 'antd';
const DashboardPage = () => {
    return  (
        <div className='dashboard'>
            <Button type="primary" href="#" shape='round'>Create Quiz</Button>
            <hr />
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
                </Col><Col>
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
    )
}
export default DashboardPage;