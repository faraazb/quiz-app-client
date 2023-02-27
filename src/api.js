import axios from "axios";

const API_BASE_URL = "http://localhost:5000/";

const api = axios.create({
    baseURL: API_BASE_URL,
});

async function getSubmissions(quizId) {
    try {
        const response = await api.get(`quizzes/${quizId}/submissions`);
        if (response.data.data) {
            return response.data.data;
        } else {
            throw new Error("Failed to get submissions");
        }
    } catch (err) {
        throw err;
    }
}
async function saveSubmission(quizId, submmission) {
    try {
        const response = await api.post(
            `quizzes/${quizId}/submissions`,
            submmission
        );
        console.log("Res", response);
        if (response.data.data) return response.data.data;
        else throw new Error("Failed to get submissions");
    } catch (err) {
        throw err;
    }
}

export { getSubmissions, saveSubmission };
