import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import style from "../../styles/GameDetailRPS.module.css";
import { Row, Col, Button, Table, Card } from "react-bootstrap";
import cn from "classnames";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { useSelector, useDispatch } from "react-redux";
import { playedTrue, rpsSelector } from "../../store/slices/rpsPlayed";
import apiFetch from "../../utils/apiFetch";

export async function getServerSideProps({ req, res }) {
  const session = await unstable_getServerSession(req, res, authOptions);
  const response = await apiFetch("/api/v1/games/high-score", {
    headers: { Authorization: session.user.accessToken },
  });

  if (response.status === 404) {
    return {
      notFound: true,
    };
  }

  const boards = await response.json();

  return {
    props: {
      boards,
    },
  };
}

export default function GameDetailRPS({ boards }) {
  const dispatch = useDispatch();
  const { rpsPlayed } = useSelector(rpsSelector);
  return (
    <div>
      <Head>
        <title>Rock Paper Scissor</title>
      </Head>
      <section className={style.rps}>
        <Row>
          <Col>
            <Card className="bg-dark text-white">
              {rpsPlayed && <h2>*ever played before</h2>}
              <Image
                src="/images/rockpaperscissor.jpg"
                alt="rps"
                width="900em"
                height="450em"
              />
              <Card.ImgOverlay className="d-flex align-items-end justify-content-end">
                <Card.Title>
                  <Link href="/rock-paper-scissor/play" passHref>
                    <Button
                      type="button"
                      variant="primary"
                      style={{ width: "13rem" }}
                      onClick={() => dispatch(playedTrue())}
                    >
                      PLAY
                    </Button>
                  </Link>
                </Card.Title>
              </Card.ImgOverlay>
            </Card>
          </Col>
        </Row>
      </section>

      <section>
        <div className="row pt-5 justify-content-center mh-100">
          <div className="col-lg-5">
            <div className="left text-light">
              <h2 className="text-center">GAME DESCRIPTION:</h2>
              <br />
              <h3 className="text-center">
                Rock-paper-scissors is a hand game usually played by two people,
                in this case you will play against the COM, where players
                simultaneously form one of three shapes with an outstretched
                hand. The &quot;rock&quot; beats scissors, the
                &quot;scissors&quot; beat paper and the &quot;paper&quot; beats
                rock; if both players throw the same shape, the game is tied.
              </h3>
            </div>
          </div>
          <div className="col-lg-6 text-light">
            <div className={cn(style.right, "rounded overflow-auto")}>
              <div className="container p-5">
                <h2 className="text-center">LEADERBOARD:</h2>
                <br />
                <div>
                  <Table borderless responsive="sm">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Username</th>
                        <th>Score</th>
                      </tr>
                    </thead>

                    {boards.data.map((board, index) => (
                      <tbody key={board.id}>
                        <tr>
                          <td>{index + 1}</td>
                          <td>
                            <Link href={`/user/${board.id}`}>
                              <a>{board.username}</a>
                            </Link>
                          </td>
                          <td>{board.total_score}</td>
                        </tr>
                      </tbody>
                    ))}
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
