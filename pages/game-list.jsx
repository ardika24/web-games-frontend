import { Carousel, Button, Col, Row, Card } from "react-bootstrap";
import Link from "next/link";
import style from "../styles/GameList.module.css";
import { useEffect } from "react";
import Image from "next/image";
import Head from "next/head";

export default function GameList() {
  return (
    <>
      <Head>
        <title>Game List</title>
      </Head>
      <div className={style.home}>
        <div className="container-fluid pt-5 text-center">
          <br />
          <br />
          <h1 className="text-light text-center">Game Recommendations</h1>
          <br />
          <div className="row pt-3">
            <div className="col-lg">
              <Row xs={1} md={2} className="g-4">
                {Array.from({ length: 4 }).map((_, idx) => {
                  return (
                    <Col key={idx}>
                      <Card className="bg-dark text-white">
                        <Card.Img
                          src={`/images/game${idx + 1}.jpg`}
                          alt="Card image"
                        />
                        <Card.ImgOverlay className="d-flex align-items-center justify-content-center shadow-lg">
                          <Card.Title>
                            <Link href="/rock-paper-scissor" passHref>
                              <Button type="button" className="opacity-75">
                                Play Now!
                              </Button>
                            </Link>
                          </Card.Title>
                        </Card.ImgOverlay>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </div>
            <div className="col-lg-4">
              <Carousel variant="dark" className="shadow-lg m-3">
                <Carousel.Item>
                  <Image
                    width="400em"
                    height="220em"
                    className="d-block w-100"
                    src="/images/rockpaperscissor.jpg"
                    alt="First slide"
                  />
                  <Carousel.Caption className="text-dark fs-4">
                    <Link href="/rock-paper-scissor" passHref>
                      <Button type="button">Play Now!</Button>
                    </Link>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <Image
                    width="400em"
                    height="220em"
                    className="d-block w-100"
                    src="/images/tictactoe.png"
                    alt="Second slide"
                  />

                  <Carousel.Caption>
                    <Link href="/tic-tac-toe" passHref>
                      <Button type="button">Play Now!</Button>
                    </Link>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
            </div>
            <div className="col-lg">
              <Row xs={1} md={2} className="g-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <Col key={idx}>
                    <Card className="bg-dark text-white">
                      <Card.Img
                        src={`/images/game${idx + 1}.jpg`}
                        alt="Card image"
                      />
                      <Card.ImgOverlay className="d-flex align-items-center justify-content-center shadow-lg">
                        <Card.Title>
                          <Link href="/tic-tac-toe" passHref>
                            <Button type="button" className="opacity-75">
                              Play Now!
                            </Button>
                          </Link>
                        </Card.Title>
                      </Card.ImgOverlay>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        </div>

        <div className="container-fluid text-center">
          <br />
          <br />
          <h1 className="text-light text-center">New Games</h1>
          <br />
          <div className="row pt-3">
            <div className="col-lg">
              <Row xs={1} md={2} className="g-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <Col key={idx}>
                    <Card className="bg-dark text-white">
                      <Card.Img
                        src={`/images/game${idx + 1}.jpg`}
                        alt="Card image"
                      />
                      <Card.ImgOverlay className="d-flex align-items-center justify-content-center shadow-lg">
                        <Card.Title>
                          <Link href="/rock-paper-scissor" passHref>
                            <Button type="button" className="opacity-75">
                              Play Now!
                            </Button>
                          </Link>
                        </Card.Title>
                      </Card.ImgOverlay>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
            <div className="col-lg-4">
              <Carousel variant="dark" className="shadow-lg m-3">
                <Carousel.Item>
                  <Image
                    width="400em"
                    height="220em"
                    className="d-block w-100"
                    src="/images/rockpaperscissor.jpg"
                    alt="First slide"
                  />
                  <Carousel.Caption className="text-dark fs-4">
                    <Link href="/rock-paper-scissor" passHref>
                      <Button type="button">Play Now!</Button>
                    </Link>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <Image
                    width="400em"
                    height="220em"
                    className="d-block w-100"
                    src="/images/tictactoe.png"
                    alt="Second slide"
                  />

                  <Carousel.Caption>
                    <Link href="/tic-tac-toe" passHref>
                      <Button type="button">Play Now!</Button>
                    </Link>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
            </div>
            <div className="col-lg">
              <Row xs={1} md={2} className="g-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <Col key={idx}>
                    <Card className="bg-dark text-white">
                      <Card.Img
                        src={`/images/game${idx + 1}.jpg`}
                        alt="Card image"
                      />
                      <Card.ImgOverlay className="d-flex align-items-center justify-content-center shadow-lg">
                        <Card.Title>
                          <Link href="/tic-tac-toe" passHref>
                            <Button type="button" className="opacity-75">
                              Play Now!
                            </Button>
                          </Link>
                        </Card.Title>
                      </Card.ImgOverlay>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
