"use client";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';


import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
let socket;
export default function Examiner() {
    useEffect(() => {
        socket = io("http://localhost:4000");
        socket.on("connect", () => {
            socket.on("inform", (number) => {
                alert("this candidate Id is " + number);
            });
        });
    }, []);

    const [inputVal, setInputval] = useState("");
    const [buttonTx, setButtonTx] = useState("Add Candidate");

    const addCandidate = () => {
        setButtonTx("Processing...");
        if (inputVal.length > 0) {
            socket.emit("add-candidate", { name: inputVal });
            setInputval("");
        } else {
            alert("please enter name");
        }
        setTimeout(() => {
            setButtonTx("Add Candidate");
        }, 1000);
    }

    return (
        <>
            <Stack style={{ marginTop: "100px" }} justifyContent="center" direction="row" spacing={2}>
                <TextField id="outlined-basic" label="Fullname" onChange={(e) => { setInputval(e.target.value) }} value={inputVal} variant="outlined" />
                <Button variant="contained" onClick={addCandidate} disabled={buttonTx === "Processing..."}>{buttonTx}</Button>
            </Stack>

        </>
    )
}
