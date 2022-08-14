import Link from "next/link";
import { useRouter } from "next/router";
import { Container, Nav, Navbar } from "react-bootstrap";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import profile from "../public/images/profile1.png";
import logo from "../public/images/logo-social1.png";

function Header() {
  const router = useRouter();
  const currentRoute = router.pathname;
  const { data: session } = useSession();

  function jsx_rightSection() {
    if (session === undefined) {
      return (
        <Navbar.Text className="text-light text-center fs-3">
          Loading user...
        </Navbar.Text>
      );
    }

    if (session === null) {
      return (
        <Nav>
          <Link href="/login" passHref>
            <Nav.Link
              className={currentRoute === "/login" && "active"}
              onClick={() => signIn()}
            >
              Login
            </Nav.Link>
          </Link>

          <Link href="/register" passHref>
            <Nav.Link className={currentRoute === "/register" && "active"}>
              Register
            </Nav.Link>
          </Link>

          <Link href="/game-list" passHref>
            <Nav.Link className={currentRoute === "/game-list" && "active"}>
              All Games
            </Nav.Link>
          </Link>
        </Nav>
      );
    }

    return (
      <Nav>
        <Link href="/game-list" passHref>
          <Nav.Link className={currentRoute === "/game-list" && "active"}>
            All Games
          </Nav.Link>
        </Link>

        <Link href="/my-profile" passHref>
          <Nav.Link>{session.user.username}</Nav.Link>
        </Link>
        <Image src={profile} alt="profile" />

        <Nav.Link onClick={() => signOut()}>Logout</Nav.Link>
      </Nav>
    );
  }

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="dark"
      variant="dark"
      fixed="top"
      className="opacity-50"
    >
      <Container>
        <Link href="/" passHref>
          <Navbar.Brand
            style={{ width: "11rem" }}
            className={currentRoute === "/" && "active"}
          >
            <Image src={logo} alt="logo" />
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse
          id="responsive-navbar-nav"
          className="justify-content-end fs-3"
        >
          <Nav>{jsx_rightSection()}</Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
