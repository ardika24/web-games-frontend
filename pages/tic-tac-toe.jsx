import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import style from "../styles/GameDetailTTT.module.css";
import { Row, Col, Button, Table, Card } from "react-bootstrap";
import cn from "classnames";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export async function getServerSideProps({ req, res }) {
  const session = await unstable_getServerSession(req, res, authOptions);
  const response = await fetch(
    "http://localhost:4000/api/v1/games/high-score",
    {
      headers: { Authorization: session.user.accessToken },
    }
  );

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

export default function GameDetailTTT({ boards }) {
  return (
    <div>
      <Head>
        <title>Game Detail TTT</title>
      </Head>
      <section className={style.rps}>
        <Row>
          <Col>
            <Card className="bg-dark text-white">
              <Image
                src="/images/tictactoe.png"
                alt="rps"
                width="900em"
                height="450em"
              />
              <Card.ImgOverlay className="d-flex align-items-end justify-content-end">
                <Card.Title>
                  <Link href="/tic-tac-toe/play" passHref>
                    <Button
                      type="button"
                      variant="primary"
                      style={{ width: "13rem" }}
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
                This is a game in which two players alternately put Xs and Os in
                compartments of a figure formed by two vertical lines crossing
                two horizontal lines and each tries to get a row of three Xs or
                three Os before the opponent does.
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
                              {board.username}
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
