import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Typography } from "@mui/material";
import Navbar from "../components/navbar";
import { BET_TYPE_PAPER, BET_TYPE_ROCK, BET_TYPE_SCISSORS } from "../config";

function Home() {
  const navigate = useNavigate();

  const [playHistory, setPlayHistory] = useState(tempPlayHistory);

  return (
    <>
      <Navbar />
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: { xs: "60px", sm: "80px", md: "150px" },
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "20px", sm: "42px", md: "64px" },
            lineHeight: { xs: "36px", sm: "58px", md: "77px" },
            fontWeight: "700",
            color: "black",
            textAlign: "center",
            marginTop: { xs: "36px", sm: "42px", md: "90px" },
          }}
        >
          ROCK PAPER SCISSORS
          <br />
          YOUR WAY TO RICHES!
        </Typography>
        <Button
          sx={{
            width: { xs: "160px", sm: "240px", md: "275px" },
            height: { xs: "42px", sm: "64px", md: "75px" },
            borderRadius: "20px",
            background: "#FFC700",
            fontSize: { xs: "16px", sm: "28px", md: "36px" },
            fontWeight: "700",
            color: "black",
            marginTop: { xs: "15px", sm: "20px", md: "30px" },
            "&:hover": {
              background: "#FFC700",
            },
          }}
          onClick={() => {
            navigate("/play");
          }}
        >
          Play
        </Button>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: { xs: "30px", sm: "50px", md: "80px" },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "16px", sm: "24px", md: "28px" },
              fontWeight: "400",
              color: "black",
            }}
          >
            RECENT PLAYS
          </Typography>
          <Box
            sx={{
              width: "100%",
              maxWidth: "750px",
              background: "#F5F5F5",
              padding: { xs: "0 10px", sm: "10px 25px", md: "20px 40px" },
              borderRadius: "10px",
              marginTop: "10px",
            }}
          >
            {playHistory?.length > 0 &&
              playHistory.map((item) => (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    margin: "20px 0",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      "& .MuiTypography-root": {
                        fontSize: { xs: "11px", sm: "12px", md: "18px" },
                        fontWeight: "400",
                        marginRight: "10px",
                        textTransform: "uppercase",
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#FFC700",
                      }}
                    >
                      {item.playerId}
                    </Typography>
                    <Typography
                      sx={{
                        display: { xs: "none", sm: "flex" },
                        color: "black",
                      }}
                    >
                      PLAYED {item.betType} FOR
                    </Typography>
                    <Typography
                      sx={{
                        display: { xs: "flex", sm: "none" },
                        color: "black",
                      }}
                    >
                      {item.betType}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#FFC700",
                      }}
                    >
                      {item.betAmount} SOL
                    </Typography>
                    <Typography
                      sx={{
                        display: { xs: "none", sm: "flex" },
                        color: "black",
                      }}
                    >
                      AND
                    </Typography>
                    <Typography
                      sx={{
                        color: item.isWin ? "#1CC700" : "#FF0000",
                      }}
                    >
                      {item.isWin ? "WON" : "LOST"}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      display: { xs: "none", sm: "flex" },
                      fontWeight: "400",
                      fontSize: { xs: "10px", sm: "12px", md: "16px" },
                      color: "black",
                      marginLeft: "20px",
                    }}
                  >
                    35 seconds ago
                  </Typography>
                  <Typography
                    sx={{
                      display: { xs: "flex", sm: "none" },
                      fontWeight: "400",
                      fontSize: { xs: "10px", sm: "12px", md: "16px" },
                      color: "black",
                      marginLeft: "20px",
                    }}
                  >
                    35s
                  </Typography>
                </Box>
              ))}
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default Home;

const tempPlayHistory = [
  {
    playerId: "0xMERT",
    betType: BET_TYPE_ROCK,
    betAmount: 0.25,
    isWin: true,
  },
  {
    playerId: "0xMBEK",
    betType: BET_TYPE_PAPER,
    betAmount: 0.5,
    isWin: true,
  },
  {
    playerId: "0xCLOK",
    betType: BET_TYPE_SCISSORS,
    betAmount: 0.75,
    isWin: false,
  },
  {
    playerId: "0xALKE",
    betType: BET_TYPE_ROCK,
    betAmount: 1.0,
    isWin: true,
  },
];
