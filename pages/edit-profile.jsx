import { Button, Form, Col, Row } from "react-bootstrap";
import style from "../styles/EditProfile.module.css";
import { useState } from "react";
import cn from "classnames";
import Image from "next/image";
import Head from "next/head";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { useRouter } from "next/router";
import swal from "sweetalert";
import apiFetch from "../utils/apiFetch";

export async function getServerSideProps({ req, res }) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const user = session.user;
  return {
    props: { user },
  };
}

export default function EditProfile({ user }) {
  const router = useRouter();
  const [username, setUsername] = useState(user.username);
  const [socmed, setSocMed] = useState(user.social_media_url ?? "");
  const [city, setCity] = useState(user.city ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);

    const response = await apiFetch(`/api/v1/user/${user.id}`, {
      method: "PUT",
      body: JSON.stringify({
        username,
        social_media_url: socmed,
        city,
        bio,
      }),
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: user.accessToken,
      }),
    });

    if (response.ok) {
      swal("Good job!", "Updated Success", "success", {
        buttons: {
          OK: {
            value: "OK",
          },
        },
      }).then((value) => {
        switch (value) {
          case "OK":
            router.push("/my-profile").then(() => router.reload());
            break;
        }
      });
      setLoading(false);
    } else {
      const data = await response.json();
      setLoading(false);
      if (data && data.error) {
        if (data.error.name === "SequelizeUniqueConstraintError") {
          swal("Username already taken! Please choose another one", {
            icon: "warning",
            buttons: true,
          });
        }
      }
    }
  }

  return (
    <>
      <Head>
        <title>Edit Your Profile</title>
      </Head>
      <div className={cn(style.container, "container-fluid")}>
        <div className="row pt-5">
          <div className="col-lg-5">
            <div className="left text-light">
              <br />
              <br />
              <h4 className="text-center">
                Describe Yourself, make a better profile!
              </h4>
              <Image
                width="500em"
                height="550em"
                src="/images/cartoon.png"
                alt="cartoon"
                className="img-fluid"
                priority
              />
            </div>
          </div>
          <div className="col-lg text-light">
            <div className={style.right}>
              <div className="container p-4">
                <h2 className="text-center">EDIT PROFILE</h2>
                <br />
                <Row className="row justify-content-center">
                  <Form onSubmit={onSubmit} className={style.form}>
                    <Form.Group as={Col} md="7" controlId="username">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder={`${user.username}  is your current username`}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="7"
                      controlId="social_media_url"
                      className="mt-3"
                    >
                      <Form.Label>Social Media</Form.Label>
                      <Form.Control
                        type="text"
                        onChange={(e) => setSocMed(e.target.value)}
                        value={socmed}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="7"
                      controlId="city"
                      className="mt-3"
                    >
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        style={{ textTransform: "capitalize" }}
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="7"
                      controlId="bio"
                      className="mt-3"
                    >
                      <Form.Label>Bio</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a bio.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <div className="row justify-content-center mt-4">
                      <Button type="submit" className={style.loginButton}>
                        {loading ? "Loading..." : "Update"}
                      </Button>
                    </div>
                  </Form>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
