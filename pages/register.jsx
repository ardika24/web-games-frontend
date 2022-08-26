import Head from "next/head";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import cn from "classnames";
import swal from "sweetalert";
import apiFetch from "../utils/apiFetch";
import style from "../styles/Register.module.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);

    const response = await apiFetch("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email,
        username,
        password,
      }),
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
      }),
    });

    if (response.ok) {
      swal("Good job!", "Register Success", "success", {
        buttons: "Done",
      }).then(() => {
        signIn("credentials", {
          email,
          username,
          password,
          callbackUrl: "/home",
        });
      });

      setLoading(false);
    } else {
      const data = await response.json();

      setLoading(false);

      if (data && data.error) {
        if (data.error.code === "auth/user-exist") {
          if (confirm("Username or email already exist, want to login?")) {
            signIn(undefined, { callbackUrl: "/login" });
          }
        }
      }
    }
  }

  return (
    <>
      <Head>
        <title>Create your account - Binar Games</title>
      </Head>

      <div className={style.container}>
        <div className="row pt-3 justify-content-center">
          <div
            className={cn(
              style.regForm,
              "col-lg-6 col-sm-5 px-sm-3 d-flex flex-column justify-content-center"
            )}
          >
            <h2 className="fs-3 text-center text-light">
              REGISTER FOR YOUR ACCOUNT
            </h2>
            <Form className="d-grid" onSubmit={onSubmit}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <p className={style.p1}>
                By clicking the register button, I&apos;m 16 years of age or
                older and accept the Cloud Terms of Service and acknowledge the
                Privacy Policy.
              </p>
              <Button type="submit" className={style.regButton}>
                {loading ? "Loading..." : "Register"}
              </Button>
            </Form>
            <p className={style.p2}>
              *if success, you&apos;ll be redirected to the Log in page
            </p>
            <p>
              Already have an account?{" "}
              <Link href="/login">
                <a className="text-light text-center">Log in here</a>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
