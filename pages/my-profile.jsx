import style from "../styles/MyProfile.module.css";
import { Button } from "react-bootstrap";
import cn from "classnames";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function MyProfile() {
  const { data: session } = useSession();
  return (
    <div className={cn(style.container, "container-fluid")}>
      <div className="row pt-5">
        <div className="col-lg-5">
          <div className="left text-light">
            <p className="text-center">Here's your profile.</p>
            <p className="text-center">
              You can edit by clicking the "Edit" button.
            </p>
            <Image
              src="/images/cartoon.png"
              alt="cartoon"
              className="img-fluid"
              width={560}
              height={460}
            />
          </div>
        </div>
        <div className="col-lg text-light">
          <div className={style.right}>
            <div className="container p-4">
              <h2 className="text-center">YOUR PROFILE</h2>
              <br />
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
                <p>{new Date(session.user.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="row justify-content-center mt-3">
                <Button
                  href="/edit-profile"
                  type="button"
                  className={style.loginButton}
                >
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
