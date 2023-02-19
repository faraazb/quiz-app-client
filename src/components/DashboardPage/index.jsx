import "./dashboardPage.css";
import { Card, Col, Row } from 'antd';
import axios from "axios";
import { Button } from 'antd';
import { useEffect, useState } from "react";
// import { Question } from "../../../../quiz-app-server/src/models";
const DashboardPage = () => {
    const [quizzes, setQuizzes] = useState(null);
    const getQuizzes = async () => {
        try{
            const quizzes = await axios.get("http://localhost:5000/quizzes/");
            setQuizzes(quizzes);
            console.log(quizzes.data.data);
        }
        catch(err)  {
            // console.log(err);
        }
    };
    useEffect(() => {
        getQuizzes();
    }, []);
    return  (
        <div className='dashboard'>
            <Button type="primary" href="#" shape='round'>Create Quiz</Button>
            <hr />
            <Row gutter={[10,10]} justify="center">
                {quizzes !== null && quizzes.data.data.map((quiz) => {
                    return (
                            <Col key = {quiz.id}>
                                <Card size="small" title={quiz.title} style={{ width: 200, height: 100 }}>
                                    <p>{quiz.submissionsCount} Submissions</p>
                                </Card>
                            </Col>
                    )
                })}
            </Row>
        </div>
    )
}
export default DashboardPage;