import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
    const [triviaQuestion, setTriviaQuestion] = useState(null);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [currentPoints, setCurrentPoints] = useState(0);
    const [allPossibleAnswers, setAllPossibleAnswers] = useState([]);
    const [loading, setLoading] = useState(false);

    function combineAllAnswers(incorrectAnswers, correctAnswer) {
        const allAnswers = [...incorrectAnswers, correctAnswer];
        allAnswers.sort(() => Math.random() - 0.5);
        setAllPossibleAnswers(allAnswers);
    }

    async function getTriviaData() {
        setLoading(true);
        try {
            const resp = await axios.get("https://opentdb.com/api.php?amount=1");
            const questionData = resp.data.results[0];
            setTriviaQuestion(questionData);
            setCorrectAnswer(questionData.correct_answer);
            combineAllAnswers(questionData.incorrect_answers, questionData.correct_answer);
        } catch (error) {
            console.error("Error fetching trivia data:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getTriviaData();
    }, []);

    function verifyAnswer(selectedAnswer) {
        if (selectedAnswer === correctAnswer) {
            setCurrentPoints((prevPoints) => prevPoints + 1);
        } else {
            setCurrentPoints((prevPoints) => prevPoints - 1);
        }
        getTriviaData();
    }

    function decodeHTML(html) {
        const textArea = document.createElement("textarea");
        textArea.innerHTML = html;
        return textArea.value;
    }

    return (
        <div className="App">
            <header className="App-header">
                {loading ? (
                    <div>Trivia Question Loading...</div>
                ) : (
                    <div>
                        <div>Current Points: {currentPoints}</div>
                        <br />
                        {triviaQuestion && (
                            <div>
                                <div>{decodeHTML(triviaQuestion.question)}</div>
                                <br />
                                <div>
                                    {allPossibleAnswers.map((answer, index) => (
                                        <div key={index}>
                                            <button onClick={() => verifyAnswer(answer)}>
                                                {decodeHTML(answer)}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </header>
        </div>
    );
}

export default App;
