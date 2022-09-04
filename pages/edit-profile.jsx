import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { unstable_getServerSession } from "next-auth";
import { useState } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import cn from "classnames";
import swal from "sweetalert";
import { authOptions } from "./api/auth/[...nextauth]";
import apiFetch from "../utils/apiFetch";
import style from "../styles/EditProfile.module.css";
import { signUpload } from "../utils/cloudinary.server";

export async function getServerSideProps({ req, res }) {
  const session = await unstable_getServerSession(req, res, authOptions);
  const cloudinarySign = signUpload();

  const user = session.user;
  return {
    props: { user, cloudinarySign },
  };
}

export default function EditProfile({ user, cloudinarySign }) {
  const router = useRouter();
  const [username, setUsername] = useState(user.username);
  const [socmed, setSocMed] = useState(user.social_media_url ?? "");
  const [city, setCity] = useState(user.city ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState();
  const [cloudinaryData, setCloudinaryData] = useState();

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

  function handleOnChange(changeEvent) {
    if (!changeEvent.target.files[0]) {
      setImageSrc(undefined);
      setCloudinaryData(undefined);
      return;
    }

    const reader = new FileReader();

    reader.onload = function (onLoadEvent) {
      setImageSrc(onLoadEvent.target.result);
      setCloudinaryData(undefined);
    };

    reader.readAsDataURL(changeEvent.target.files[0]);
  }

  async function onSubmitPic(event) {
    event.preventDefault();

    if (loading) return;

    const form = event.currentTarget;
    const fileInput = Array.from(form.elements).find(
      ({ name }) => name === "formFile"
    );

    // If developer forgot to create the file input or file input with the name declared above
    if (!fileInput) {
      throw new Error(
        "The file input is not found. Make sure you define it on your Form"
      );
    }

    // If no files to submit then just return
    if (fileInput.files.length < 1) {
      return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);
    formData.append("api_key", cloudinarySign.apiKey);
    formData.append("timestamp", cloudinarySign.timestamp);
    formData.append("signature", cloudinarySign.signature);
    formData.append("folder", "my-first-folder");

    setLoading(true);

    const url = `https://api.cloudinary.com/v1_1/${cloudinarySign.cloudName}/auto/upload`;
    const uploadResponse = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const uploadData = await uploadResponse.json();
    setImageSrc(uploadData.secure_url);
    setCloudinaryData(uploadData);
    // console.log(uploadData.url);

    const response = await apiFetch(`/api/v1/user/${user.id}`, {
      method: "PUT",
      body: JSON.stringify({
        profile_pic: uploadData.secure_url,
      }),
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: user.accessToken,
      }),
    });

    if (response.ok && uploadData) {
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
                  <Image
                    width="100em"
                    height="100em"
                    src={user.profile_pic ?? "/images/profile-pic.jpg"}
                    alt="cartoon"
                    className="img-fluid rounded-circle border border-dark"
                    role="button"
                    priority
                  />
                  <Form
                    onChange={handleOnChange}
                    onSubmit={onSubmitPic}
                    className={style.form}
                  >
                    <Form.Group
                      as={Col}
                      md="7"
                      controlId="formFile"
                      className="mt-3"
                    >
                      <Form.Label>Add Profile Picture</Form.Label>
                      <Form.Control
                        name="formFile"
                        type="file"
                        accept="image/*"
                      />
                    </Form.Group>
                    {imageSrc && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageSrc}
                        alt="Image Upload Result"
                        width="50%"
                        className="mt-3"
                      />
                    )}
                    <div className="row justify-content-center mt-4">
                      {imageSrc && !cloudinaryData && (
                        <Button
                          variant="primary"
                          type="submit"
                          disabled={loading}
                          className={style.loginButton}
                        >
                          {loading ? "Loading..." : "Submit"}
                        </Button>
                      )}
                    </div>
                  </Form>
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
