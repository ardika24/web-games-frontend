import Head from "next/head";
import style from "../../styles/UserProfile.module.css";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import dayjs from "dayjs";

export async function getServerSideProps({ req, res, params }) {
  const session = await unstable_getServerSession(req, res, authOptions);
  const response = await fetch(
    `http://localhost:4000/api/v1/user/${params.id}`,
    {
      headers: { Authorization: session.user.accessToken },
    }
  );

  if (response.status === 404) {
    return {
      notFound: true,
    };
  }

  const profile = await response.json();

  return {
    props: {
      profile,
    },
  };
}

export default function UserProfile({ profile }) {
  return (
    <>
      <Head>
        <title>{`${profile.username} Profile Information - Binar Games`}</title>
      </Head>
      <div className={style.content}>
        <div className="row justify-content-center">
          <div className="col-lg-6 col-sm-7 px-sm-3 d-flex flex-column justify-content-center text-light">
            <div className={style.right}>
              <div className="container p-5">
                <h2 className="text-center">
                  {profile.username}&apos;s profile
                </h2>
                <br />
                <div>
                  <h5>Username:</h5>
                  <p>{profile.username}</p>
                  <h5>Total Score:</h5>
                  <p>{profile.total_score}</p>
                  <h5>Bio:</h5>
                  <p>{profile.bio}</p>
                  <h5>Social Media:</h5>
                  <p>{profile.social_media_url}</p>
                  <h5>City:</h5>
                  <p>{profile.city}</p>
                  <h5>Joined At:</h5>
                  <p>{dayjs(profile.createdAt).format("MMM D, YYYY")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
