import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import ReactPlayer from "react-player/youtube";
import { unstable_getServerSession } from "next-auth";
import { useSelector, useDispatch } from "react-redux";
import { Button, Table, Stack } from "react-bootstrap";
import cn from "classnames";
import { authOptions } from "../api/auth/[...nextauth]";
import { addPlayedGames, rpsSelector } from "../../store/slices/playedGames";
import apiFetch from "../../utils/apiFetch";
import style from "../../styles/GameDetailRPS.module.css";

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
  const { games } = useSelector(rpsSelector);
  const rps = games.find((e) => e.title === "rps");
  const dispatch = useDispatch();
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [isMounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <div>
      <Head>
        <title>Rock Paper Scissor</title>
      </Head>
      <section className={style.rps}>
        <div className={style.video}>
          {rps && <h2 className="text-light">*ever played before</h2>}
          {isMounted && (
            <ReactPlayer
              url="https://www.youtube.com/watch?v=ND4fd6yScBM"
              playing={playing}
              muted={muted}
              volume={volume}
              onEnded={() => setPlaying(false)}
            />
          )}
          <Stack className="mt-3" gap={3} direction="horizontal">
            <Button onClick={() => setPlaying(true)}>Play</Button>
            <Button onClick={() => setPlaying(false)}>Pause</Button>
            <Button onClick={() => setVolume(volume + 0.1)}>
              Volume + 0.1
            </Button>
            <Button onClick={() => setVolume(volume - 0.1)}>
              Volume - 0.1
            </Button>
            <Button onClick={() => setMuted(true)}>Mute</Button>
            <Button onClick={() => setMuted(false)}>Unmute</Button>
          </Stack>

          <Link href="/rock-paper-scissor/play" passHref>
            <Button
              type="button"
              variant="primary"
              style={{ width: "13rem" }}
              onClick={() => dispatch(addPlayedGames("rps"))}
              className="mt-3"
            >
              PLAY THIS GAME
            </Button>
          </Link>
        </div>
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
