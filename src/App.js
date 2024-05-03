import { useEffect, useReducer } from "react";
import Header from "./Header.js";
import Main from "./Main.js";
import Loader from "./Loader.js";
import Error from "./Error.js";
import StartScreen from "./StartScreen.js";

export default function App() {
  const initialState = {
    question: [],
    // loading , ready ,failed,
    status: "loading",
  };

  function reducer(state, action) {
    switch (action.type) {
      case "dataReceived":
        return { ...state, question: action.payload, status: "ready" };

      case "dataFailed":
        return {
          ...state,
          status: "failed",
        };

      default:
        throw new Error("action unknown");
    }
  }

  useEffect(function () {
    fetch("http://localhost:8000/")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((error) => {
        dispatch({ type: "dataFailed" });
      });
  }, []);

  const [{ question, status }, dispatch] = useReducer(reducer, initialState);
  const numQuestions = question.length;

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "failed" && <Error />}
        {status === "ready" && <StartScreen numQuestions={numQuestions} />}
      </Main>
    </div>
  );
}
