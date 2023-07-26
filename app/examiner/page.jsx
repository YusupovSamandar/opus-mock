"use client"

import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
let socket;
export default function Examiner() {

    const [btnDisabled, setBtnDisabled] = useState(false);
    const [btnText, setBtnText] = useState("Call Candidate");
    const [currentCandidate, setCurrentCandidate] = useState(false);
    const [load, setLoad] = useState(false);
    useEffect(() => {
        if (localStorage.getItem('examiner-details')) {
            setLoad(true);
        } else {
            setLoad(false);
        }

        if (!localStorage.getItem('examiner-details')) {
            const room = prompt("Please enter your room number");
            const examinerName = prompt("Please enter your name");
            localStorage.setItem('examiner-details', JSON.stringify({ room, examinerName }));
            window.location.reload();
        }
        socket = io("http://localhost:4000");
        socket.on("connect", () => {
            socket.on("alert", (obj) => {
                if (obj) {
                    setCurrentCandidate(obj)
                } else {
                    alert("No candidates left :(");
                }
            });
        });
    }, []);

    const callCandidate = () => {
        setBtnDisabled(true);
        setBtnText("processing...");
        setTimeout(() => {
            setBtnDisabled(false);
            setBtnText("Call Candidate");
        }, 1000);
        socket.emit("candidate-called", localStorage.getItem('examiner-details'));
    }
    const reset = () => {
        localStorage.removeItem("examiner-details");
        window.location.reload();
    }
    return (
        <>
            {
                load &&
                <>
                    <div div style={{ marginTop: "35vh", textAlign: "center" }}>
                        <h1>Your current Candidate number is {currentCandidate.id}</h1>
                        <br />
                        <h2>FullName: {currentCandidate.candidate}</h2>
                    </div >
                    <Stack style={{ marginTop: "100px" }} justifyContent="center" direction="row" spacing={2}>
                        <Button variant="contained" onClick={callCandidate} disabled={btnDisabled} >{btnText}</Button>
                        <Button variant="contained" onClick={reset} >Reset My Info</Button>
                    </Stack>
                </>
            }

        </>
    )
}
