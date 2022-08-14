import { useEffect, useRef, useState } from "react";
// import { getAccessToken } from "../store/slices/user";
import { useSelector, useDispatch } from "react-redux";
// import { userSelector } from "../store/slices/user";
import {
  roundSelector,
  setRound,
  resetRound,
  outputWin,
  outputLose,
  outputDraw,
  resetOutput,
} from "../../../store/slices/round";
import { scoreSelector, currentScore } from "../../../store/slices/score";
import { Snackbar, Alert, Button } from "@mui/material";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import Image from "next/image";
import Head from "next/head";

export async function getServerSideProps({ req, res }) {
  const session = await unstable_getServerSession(req, res, authOptions);

  const user = session.user;
  return {
    props: { user },
  };
}

export default function RockPaperScissor({ user }) {
  const { score } = useSelector(scoreSelector);
  const { round, output } = useSelector(roundSelector);
  const dispatch = useDispatch();
  const [point, setPoint] = useState(false);
  const [choice, setChoice] = useState("user");
  const [botChoice, setBotChoice] = useState("bot");

  const [result, setResult] = useState("VS");

  const winScore = useRef("");
  const scoreCount = useRef(null);

  function comChoice() {
    let com = Math.random();
    if (com < 0.34) {
      setBotChoice("rock");
    } else if (com >= 0.34 && com < 0.67) {
      setBotChoice("paper");
    } else {
      setBotChoice("scissor");
    }
  }

  useEffect(() => {
    function output() {
      if (choice === botChoice) {
        setResult("Draw!");
      }
      if (choice === "rock" && botChoice === "paper") {
        setResult("You Lose!");
      }
      if (choice === "rock" && botChoice === "scissor") {
        setResult("You Win!");
      }
      if (choice === "paper" && botChoice === "scissor") {
        setResult("You Lose!");
      }
      if (choice === "paper" && botChoice === "rock") {
        setResult("You Win!");
      }
      if (choice === "scissor" && botChoice === "rock") {
        setResult("You Lose!");
      }
      if (choice === "scissor" && botChoice === "paper") {
        setResult("You Win!");
      }
    }
    output();
  }, [botChoice, choice]);

  useEffect(() => {
    function win() {
      if (winScore.current.textContent === "You Win!") {
        scoreCount.current += 1;
        dispatch(outputWin());
      }

      if (winScore.current.textContent === "You Lose!") {
        scoreCount.current = 0;
        dispatch(outputLose());
      }
      if (winScore.current.textContent === "Draw!") {
        scoreCount.current = 0;
        dispatch(outputDraw());
      }
    }
    win();
  }, [dispatch, result]);

  useEffect(() => {
    async function addScore() {
      if (scoreCount.current >= 1) {
        const response = await fetch(
          `http://localhost:4000/api/v1/user/${user.id}`,
          {
            method: "PUT",
            body: JSON.stringify({
              total_score: 10,
            }),
            headers: new Headers({
              "Content-Type": "application/json; charset=UTF-8",
              Authorization: user.accessToken,
            }),
          }
        );

        if (response.ok) {
          dispatch(currentScore());
          setPoint(true);
          setTimeout(() => {
            setPoint(false);
          }, 2500);
        }
      }
    }
    addScore();
  }, [user.id, dispatch, user.accessToken, scoreCount.current]);

  function roundReset() {
    dispatch(resetRound());
    dispatch(resetOutput());
  }

  function jsx_result() {
    if (output === "You Win") {
      return (
        <div>
          <Snackbar
            open={true}
            autoHideDuration={1000}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          >
            <Alert icon={false} severity="info">
              Round {round - 1} result: {output}
            </Alert>
          </Snackbar>
        </div>
      );
    }

    if (output === "You Lose") {
      return (
        <div>
          <Snackbar
            open={true}
            autoHideDuration={1000}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          >
            <Alert icon={false} severity="info">
              Round {round - 1} result: {output}
            </Alert>
          </Snackbar>
        </div>
      );
    }

    if (output === "Draw") {
      return (
        <div>
          <Snackbar
            open={true}
            autoHideDuration={1000}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          >
            <Alert icon={false} severity="info">
              Round {round - 1} result: {output}
            </Alert>
          </Snackbar>
        </div>
      );
    }
  }

  const handleURockClick = () => {
    setChoice("rock");
    comChoice();
    dispatch(setRound());
    setTimeout(() => {
      setChoice("user");
      setBotChoice("bot");
      setResult("VS");
    }, 800);
  };
  const handleUPaperClick = () => {
    setChoice("paper");
    comChoice();
    dispatch(setRound());
    setTimeout(() => {
      setChoice("user");
      setBotChoice("bot");
      setResult("VS");
    }, 800);
  };
  const handleUScissorClick = () => {
    setChoice("scissor");
    comChoice();
    dispatch(setRound());
    setTimeout(() => {
      setChoice("user");
      setBotChoice("bot");
      setResult("VS");
    }, 800);
  };

  function jsx_alert() {
    return (
      <div>
        <Snackbar
          open={true}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert icon={false} severity="info">
            You&apos;ve got 10 points!
          </Alert>
        </Snackbar>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Play! | Rock Paper Scissor</title>
      </Head>
      <div>
        {jsx_result()}
        {point && jsx_alert()}
        <div className="row text-light text-center pt-5 mt-5 justify-content-center">
          <h3>Your total score: {!score ? user.total_score : score}</h3>
          <div className="col">
            <h3>{user.username}</h3>
          </div>
          <div className="col">
            <h3>COM</h3>
          </div>
        </div>

        <div className="row text-center text-light">
          <div className="col">
            <h4>
              Current Round: <span>{round}</span>
            </h4>
            <Button variant="contained" onClick={() => roundReset()}>
              Reset Round
            </Button>
          </div>
        </div>

        <div className="row align-items-center">
          <div className="col">
            <div className="row justify-content-center p-3">
              <Image
                width="120rem"
                height="100rem"
                style={{
                  cursor: "pointer",
                  transform: choice === "rock" ? "rotate(90deg)" : "",
                  transition: "300ms",
                }}
                onClick={handleURockClick}
                src="/images/userRock.png"
                alt="user"
              />
            </div>
            <div className="row justify-content-center p-3">
              <Image
                width="90rem"
                height="120rem"
                style={{
                  cursor: "pointer",
                  transform: choice === "paper" ? "rotate(90deg)" : "",
                  transition: "300ms",
                }}
                onClick={handleUPaperClick}
                src="/images/userPaper.png"
                alt="user"
              />
            </div>
            <div className="row justify-content-center p-3">
              <Image
                width="120rem"
                height="120rem"
                style={{
                  cursor: "pointer",
                  transform: choice === "scissor" ? "rotate(90deg)" : "",
                  transition: "300ms",
                }}
                onClick={handleUScissorClick}
                src="/images/userScissors.png"
                alt="user"
              />
            </div>
          </div>
          <div className="col-1">
            <h1 className="text-center text-light" ref={winScore}>
              {result}
            </h1>
          </div>
          <div className="col">
            <div className="row justify-content-center p-3">
              <Image
                width="120rem"
                height="100rem"
                style={{
                  transform: botChoice === "rock" ? "rotate(-90deg)" : "",
                  transition: "300ms",
                }}
                src="/images/comRock.png"
                alt="com"
              />
            </div>
            <div className="row justify-content-center p-3">
              <Image
                width="90rem"
                height="120rem"
                style={{
                  transform: botChoice === "paper" ? "rotate(-90deg)" : "",
                  transition: "300ms",
                }}
                src="/images/comPaper.png"
                alt="com"
              />
            </div>
            <div className="row justify-content-center p-3">
              <Image
                width="120rem"
                height="120rem"
                style={{
                  transform: botChoice === "scissor" ? "rotate(-90deg)" : "",
                  transition: "300ms",
                }}
                src="/images/comScissors.png"
                alt="com"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
