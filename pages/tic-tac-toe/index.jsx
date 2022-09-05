import Head from "next/head";
import Link from "next/link";
import {
  FacebookShareButton,
  FacebookIcon,
  RedditShareButton,
  RedditIcon,
  TelegramShareButton,
  TelegramIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "next-share";
import { unstable_getServerSession } from "next-auth";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player/youtube";
import { useSelector, useDispatch } from "react-redux";
import { Button, Table, Stack } from "react-bootstrap";
import cn from "classnames";
import { authOptions } from "../api/auth/[...nextauth]";
import { addPlayedGames, rpsSelector } from "../../store/slices/playedGames";
import apiFetch from "../../utils/apiFetch";
import style from "../../styles/GameDetailTTT.module.css";

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

export default function GameDetailTTT({ boards }) {
  const { games } = useSelector(rpsSelector);
  const tic = games.find((e) => e.title === "tictactoe");
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
        <title>Game Detail TTT</title>
      </Head>
      <section className={style.tictactoe}>
        <div className={style.video}>
          {tic && <h2 className="text-light">*ever played before</h2>}
          {isMounted && (
            <ReactPlayer
              url="https://www.youtube.com/watch?v=3qzcAMShotQ"
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

          <Link href="/tic-tac-toe/play" passHref>
            <Button
              type="button"
              variant="primary"
              style={{ width: "13rem" }}
              onClick={() => dispatch(addPlayedGames("tictactoe"))}
              className="mt-3"
            >
              PLAY THIS GAME
            </Button>
          </Link>

          <div className={style.social}>
            <RedditShareButton
              style={{ marginRight: "1em" }}
              url={"https://ch11-web-frontend.vercel.app/"}
              title={"Play Free Online Games - Binar Games."}
            >
              <RedditIcon size={32} round />
            </RedditShareButton>
            <FacebookShareButton
              style={{ marginRight: "1em" }}
              url={"https://ch11-web-frontend.vercel.app/"}
              quote={"Play Free Online Games - Binar Games."}
              hashtag={"#BinarGames"}
            >
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton
              style={{ marginRight: "1em" }}
              url={"https://ch11-web-frontend.vercel.app/"}
              title={"Play Free Online Games - Binar Games."}
            >
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            <TelegramShareButton
              style={{ marginRight: "1em" }}
              url={"https://ch11-web-frontend.vercel.app/"}
              title={"Play Free Online Games - Binar Games."}
            >
              <TelegramIcon size={32} round />
            </TelegramShareButton>
            <WhatsappShareButton
              style={{ marginRight: "1em" }}
              url={"https://ch11-web-frontend.vercel.app/"}
              title={"Play Free Online Games - Binar Games."}
              separator=":: "
            >
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
          </div>
        </div>
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
