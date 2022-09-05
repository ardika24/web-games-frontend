import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { unstable_getServerSession } from "next-auth";
import { Button } from "react-bootstrap";
import cn from "classnames";
import dayjs from "dayjs";
import { authOptions } from "./api/auth/[...nextauth]";
import style from "../styles/MyProfile.module.css";

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  return {
    props: session,
  };
}

export default function MyProfile(session) {
  return (
    <>
      <Head>
        <title>Your Profile</title>
      </Head>
      <div className={cn(style.container, "container-fluid")}>
        <div className="row pt-5">
          <div className="col-lg-5">
            <div className="left text-light">
              <p className="text-center">Here&apos;s your profile.</p>
              <p className="text-center">
                You can edit by clicking the &quot;Edit&quot; button.
              </p>
              <Image
                width="500em"
                height="550em"
                src="/images/cartoon.png"
                alt="cartoon"
                className="img-fluid"
              />
            </div>
          </div>
          <div className="col-lg text-light">
            <div className={style.right}>
              <div className="container p-4">
                <h2 className="text-center">YOUR PROFILE</h2>
                <br />
                <Image
                  width="100em"
                  height="100em"
                  src={session.user.profile_pic ?? "/images/profile-pic.jpg"}
                  alt="profile-pic"
                  className="img-fluid rounded-circle border border-dark"
                  priority
                />
                <div>
                  <h5>Email:</h5>
                  <p>{session.user.email}</p>
                  <h5>Username:</h5>
                  <p>{session.user.username}</p>
                  <h5>Total Score:</h5>
                  <p>{session.user.total_score}</p>
                  <h5>Bio:</h5>
                  <p>{session.user.bio}</p>
                  <h5>Social Media:</h5>
                  <p>{session.user.social_media_url}</p>
                  <h5>City:</h5>
                  <p>{session.user.city}</p>
                  <h5>Joined At:</h5>
                  <p>{dayjs(session.user.createdAt).format("MMM D, YYYY")}</p>
                </div>
                <div className="row justify-content-center mt-3">
                  <Link href="/edit-profile" passHref>
                    <Button type="button" className={style.loginButton}>
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
