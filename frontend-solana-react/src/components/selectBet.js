import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import {
  BET_TYPE_PAPER,
  BET_TYPE_ROCK,
  BET_TYPE_SCISSORS,
  SUPPORTED_TOKEN_INFO,
} from "../config";

const supportedTokenInfo = SUPPORTED_TOKEN_INFO;
export default function SelectBet({ resetBetPrice, resetBetType }) {
  const [selectedTokenIndex, setSelectedTokenIndex] = useState(0);
  const [selectedBetPrice, setSelectedBetPrice] = useState(0);
  const [selectedBetType, setSelectedBetType] = useState("");

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          marginTop: { xs: "30px", sm: "40px", md: "50px" },
        }}
      >
        <Box
          sx={{
            maxWidth: "calc(100vw - 20px)",
            height: { xs: "54px", md: "64px" },
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            background: "#FFC700",
            borderRadius: "10px",
            padding: "4px 6px",
            overflow: "auto",
            "& .MuiButton-root": {
              borderRadius: "15px",
              fontWeight: "600",
              fontSize: { xs: "14px", sm: "18px", md: "25px" },
              color: "black",
              "&:hover": {
                background: "white",
              },
            },
          }}
        >
          {supportedTokenInfo?.length > 0 &&
            supportedTokenInfo[selectedTokenIndex]?.betPrices?.length > 0 &&
            supportedTokenInfo[selectedTokenIndex]?.betPrices.map(
              (item, index) => (
                <Button
                  sx={{
                    background:
                      selectedBetPrice === item ? "white" : "transparent",
                  }}
                  onClick={() => {
                    setSelectedBetPrice(item);
                    resetBetPrice(item);
                  }}
                >
                  {item}
                </Button>
              )
            )}
        </Box>
        <Select
          sx={{
            width: "150px",
            height: { xs: "42px", sm: "64px" },
            background: "#FFC700",
            borderRadius: { xs: "20px", sm: "10px" },
            marginLeft: "15px",
            marginTop: { xs: "10px", sm: "20px", md: "0" },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "0",
            },
            "& .MuiSelect-select": {
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            },
          }}
          value={selectedTokenIndex}
          onChange={(e) => {
            setSelectedTokenIndex(e.target.value);
            setSelectedBetPrice(0);
          }}
        >
          {supportedTokenInfo?.length > 0 &&
            supportedTokenInfo.map((item) => (
              <MenuItem
                value={item.index}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <img
                  alt=""
                  src={item.logo}
                  style={{
                    width: "28px",
                    marginLeft: "5px",
                  }}
                />
                <Typography
                  sx={{
                    marginLeft: "10px",
                    fontWeight: "600",
                    fontSize: { xs: "16px", sm: "25px" },
                    color: "#000000",
                  }}
                >
                  {item.symbol}
                </Typography>
              </MenuItem>
            ))}
        </Select>
      </Box>
      <Box
        sx={{
          position: "relative",
          width: { xs: "200px", sm: "320px", md: "360px" },
          aspectRatio: "1.154701",
          background: "url(images/polygon.png)",
          backgroundSize: "cover",
          marginTop: { xs: "60px", sm: "70px", md: "80px" },
        }}
      >
        <IconButton
          sx={{
            position: "absolute",
            width:
              selectedBetType === BET_TYPE_ROCK
                ? { xs: "120px", sm: "170px", md: "200px" }
                : { xs: "100px", sm: "150px", md: "165px" },
            border: selectedBetType === BET_TYPE_ROCK ? "5px solid gray" : "0",
            aspectRatio: "1",
            left: "0",
            top: "0",
            transform: "translate(-30%, -30%)",
            background: "url(images/rock.png)",
            backgroundSize: "cover",
          }}
          onClick={() => {
            setSelectedBetType(BET_TYPE_ROCK);
            resetBetType(BET_TYPE_ROCK);
          }}
        />
        <IconButton
          sx={{
            position: "absolute",
            width:
              selectedBetType === BET_TYPE_PAPER
                ? { xs: "120px", sm: "170px", md: "200px" }
                : { xs: "100px", sm: "150px", md: "165px" },
            border: selectedBetType === BET_TYPE_PAPER ? "5px solid gray" : "0",
            aspectRatio: "1",
            left: "50%",
            bottom: "0",
            transform: "translate(-50%, 20%)",
            background: "url(images/paper.png)",
            backgroundSize: "cover",
          }}
          onClick={() => {
            setSelectedBetType(BET_TYPE_PAPER);
            resetBetType(BET_TYPE_PAPER);
          }}
        />
        <IconButton
          sx={{
            position: "absolute",
            width:
              selectedBetType === BET_TYPE_SCISSORS
                ? { xs: "120px", sm: "170px", md: "200px" }
                : { xs: "100px", sm: "150px", md: "165px" },
            border:
              selectedBetType === BET_TYPE_SCISSORS ? "5px solid gray" : "0",
            aspectRatio: "1",
            right: "0",
            top: "0",
            transform: "translate(30%, -30%)",
            background: "url(images/scissors.png)",
            backgroundSize: "cover",
          }}
          onClick={() => {
            setSelectedBetType(BET_TYPE_SCISSORS);
            resetBetType(BET_TYPE_SCISSORS);
          }}
        />
      </Box>
    </>
  );
}
