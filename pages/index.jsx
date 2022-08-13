import Link from "next/link";
import { Button } from "react-bootstrap";
import cn from "classnames";
import style from "../styles/LandingPage.module.css";
import Head from "next/head";

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>Play Free Online Games - Binar Games</title>
      </Head>
      <div className={style.landingPage}>
        <div className={cn(style.content, "py-4")}>
          <h1>PLAY OUR GAMES NOW AND GET NEW EXPERIENCES</h1>
          <br />
          <h1>PLEASE LOGIN TO PLAY!</h1>

          <Link href="/game-list" passHref>
            <Button variant="primary" type="button" className={style.button}>
              PLAY NOW!
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
