import React, { useState } from "react";
import { Button, Container } from "@mui/material";
import { toast } from "react-toastify";

import { useWallet } from "@solana/wallet-adapter-react";
import { coinFlip, isInitialized } from "../contract/helpers";

import Navbar from "../components/navbar";
import SelectBet from "../components/selectBet";
import CheckBet from "../components/checkBet";

function Play() {
  const [isBetState, setIsBetState] = useState(true);
  const [currentBetPrice, setCurrentBetPrice] = useState(0);
  const [currentBetType, setCurrentBetType] = useState("");
  const [lastResult, setLastResult] = useState(3);
  const provider = useWallet();

  const resetBetPrice = (value) => {
    setCurrentBetPrice(value);
  };

  const resetBetType = (value) => {
    setCurrentBetType(value);
  };

  const onClickPlayButton = async () => {
    console.log("currentBet ======================> ", currentBetPrice, currentBetType);
    if (currentBetPrice <= 0) {
      toast.warning("Please select bet price.");
      return;
    }
    if (currentBetType === "") {
      toast.warning("Please select rock, paper or scissors .");
      return;
    }

    let is_initialized = await isInitialized(provider);
    if (!is_initialized) {
      toast.warning("The program is not initialized yet.");
      return;
    }

    
    try {
      const gameResult = await coinFlip(provider, currentBetPrice, currentBetType);
      console.log("result =====================> ", gameResult);
      if(gameResult != null)
      {
        setLastResult(gameResult);
        setIsBetState(false);
      }
    } catch (error) {
      console.log(error);
      toast.warn("Network error.");
      return;
    }
    
  };

  const onClickPlayAgainButton = () => {
    setCurrentBetPrice(0);
    setCurrentBetType("");
    setIsBetState(true);
    setLastResult(3);
  };

  return (
    <>
      <Navbar />
      <Container
        sx={{
          paddingTop: { xs: "60px", sm: "80px", md: "150px" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {isBetState ? (
          <SelectBet
            resetBetPrice={resetBetPrice}
            resetBetType={resetBetType}
          />
        ) : (
          <CheckBet
            selectedBetType={currentBetType}
            onClickPlayAgainButton={onClickPlayAgainButton}
            lastResult={lastResult}
          />
        )}
        {isBetState && (
          <Button
            sx={{
              width: { xs: "160px", sm: "240px", md: "275px" },
              height: { xs: "42px", sm: "64px", md: "75px" },
              borderRadius: "20px",
              background: "#FFC700",
              fontSize: { xs: "16px", sm: "28px", md: "36px" },
              fontWeight: "700",
              color: "black",
              textTransform: "none",
              marginTop: "60px",
              "&:hover": {
                background: "#FFC700",
              },
            }}
            onClick={onClickPlayButton}
          >
            Play
          </Button>
        )}
      </Container>
    </>
  );
}

export default Play;
