import Head from "next/head";
import Image from "next/image";
import { Button } from "react-bootstrap";
import style from "../styles/HomePage.module.css";
import hello from "../public/images/hello1.png";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";
import Link from "next/link";
import { useSession } from "next-auth/react";

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}

function HomePage() {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>{`${session.user.username} Lets start play some games - Binar Games`}</title>
      </Head>
      <div className={style.home}>
        <div className="container-fluid">
          <div className="row pt-5">
            <div className="col-lg text-center text-dark">
              <div className={style.text}>
                <h1>Hello there {session.user.username}!</h1>
                <br />
                <h3>Welcome to the Games, where you can play</h3>
                <h3>many games on the list.</h3>
                <br />
                <h3>Increase your points by playing the game and</h3>
                <h3>be the no. 1 gamer on the leaderboard.</h3>
                <br />
                <h3>You can edit your profile in the top right.</h3>
                <br />
                <h3>Go on now, play some games!</h3>
              </div>

              <div className="row justify-content-center mt-4">
                <Link href="/game-list" passHref>
                  <Button type="button" className={style.loginButton}>
                    Play!
                  </Button>
                </Link>
              </div>
            </div>
            <div className="col-lg-4 order-first d-flex  justify-content-center">
              <div className="right" style={{ width: "25em" }}>
                <Image src={hello} alt="hello" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
