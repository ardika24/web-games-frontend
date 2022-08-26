import Head from "next/head";
import Image from "next/image";
import { unstable_getServerSession } from "next-auth";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import cn from "classnames";
import { authOptions } from "../../api/auth/[...nextauth]";
import {
  roundSelector,
  setRound,
  resetRound,
  outputWin,
  outputLose,
  outputDraw,
  resetOutput,
} from "../../../store/slices/round";
import {
  pointsSelector,
  addPoints,
  resetPoints,
} from "../../../store/slices/points";
import apiFetch from "../../../utils/apiFetch";
import style from "../../../styles/RockPaperScissor.module.css";
import { Button } from "react-bootstrap";

export async function getServerSideProps({ req, res }) {
  const session = await unstable_getServerSession(req, res, authOptions);

  const user = session.user;
  return {
    props: { user },
  };
}

export default function RockPaperScissor({ user }) {
  const { round, output } = useSelector(roundSelector);
  const { points } = useSelector(pointsSelector);
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
        dispatch(addPoints());
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
        const response = await apiFetch(`/api/v1/user/${user.id}`, {
          method: "PUT",
          body: JSON.stringify({
            total_score: 10,
          }),
          headers: new Headers({
            "Content-Type": "application/json; charset=UTF-8",
            Authorization: user.accessToken,
          }),
        });

        if (response.ok) {
          alert("You got 10 points");
        }
      }
    }
    addScore();
  }, [user.id, dispatch, user.accessToken, scoreCount.current]);

  function roundReset() {
    dispatch(resetRound());
    dispatch(resetOutput());
    dispatch(resetPoints());
  }

  function jsx_result() {
    if (output) {
      return (
        <div>
          <h3>
            Round {round - 1} result: {output}
          </h3>
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

  return (
    <>
      <Head>
        <title>Play! | Rock Paper Scissor</title>
      </Head>
      <div>
        {/* {point && jsx_alert()} */}
        <div className="row text-light text-center pt-5 mt-5 justify-content-center">
          {/* <h3>Your total score: {!score ? user.total_score : score}</h3> */}
          {jsx_result()}
          <h5>
            You&apos;ve got {points} points in {round - 1} rounds
          </h5>
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
            <Button onClick={() => roundReset()}>Reset Round</Button>
          </div>
        </div>

        <div className="row align-items-center">
          <div className="col">
            <div
              className={cn(
                style.box,
                choice === "rock" && style.rotate,
                "row justify-content-center p-3"
              )}
            >
              <Image
                className={style.image}
                width="120rem"
                height="100rem"
                onClick={handleURockClick}
                src="/images/userRock.png"
                alt="user"
              />
            </div>
            <div
              className={cn(
                style.box,
                choice === "paper" && style.rotate,
                "row justify-content-center p-3"
              )}
            >
              <Image
                className={style.image}
                width="90rem"
                height="120rem"
                onClick={handleUPaperClick}
                src="/images/userPaper.png"
                alt="user"
              />
            </div>
            <div
              className={cn(
                style.box,
                choice === "scissor" && style.rotate,
                "row justify-content-center p-3"
              )}
            >
              <Image
                className={style.image}
                width="120rem"
                height="120rem"
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
            <div
              className={cn(
                style.box,
                botChoice === "rock" && style.botRotate,
                "row justify-content-center p-3"
              )}
            >
              <Image
                width="120rem"
                height="100rem"
                src="/images/comRock.png"
                alt="com"
              />
            </div>
            <div
              className={cn(
                style.box,
                botChoice === "paper" && style.botRotate,
                "row justify-content-center p-3"
              )}
            >
              <Image
                width="90rem"
                height="120rem"
                src="/images/comPaper.png"
                alt="com"
              />
            </div>
            <div
              className={cn(
                style.box,
                botChoice === "scissor" && style.botRotate,
                "row justify-content-center p-3"
              )}
            >
              <Image
                width="120rem"
                height="120rem"
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
