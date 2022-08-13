import { getCsrfToken } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import style from "../styles/Login.module.css";
import cn from "classnames";
import Image from "next/image";
import { Form, Button, Alert } from "react-bootstrap";
import stick from "../public/images/stick.png";

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}

export default function Login({ csrfToken }) {
  const router = useRouter();
  const { error } = router.query;

  return (
    <div className={style.container}>
      <Head>
        <title>Login to your account - Binar Games</title>
      </Head>
      <div className="row pt-3 justify-content-center">
        <div
          className={cn(
            style.loginForm,
            "col-lg-6 col-sm-5 px-sm-3 d-flex flex-column justify-content-center"
          )}
        >
          <h2 className="fs-3 text-center text-light">LOG IN TO CONTINUE</h2>

          {error && error === "CredentialsSignin" && (
            <Alert variant="danger">Invalid username or password!</Alert>
          )}

          <Form
            method="post"
            action="/api/auth/callback/credentials"
            className="d-grid"
          >
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Enter username"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                required
              />
            </Form.Group>
            <Button type="submit" className={style.loginButton}>
              Login
            </Button>
          </Form>
          <div className="stick d-flex justify-content-center">
            <Image src={stick} alt="stick" />
          </div>
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/register" passHref className="text-light text-center">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
