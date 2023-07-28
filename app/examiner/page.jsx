"use client"

import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import axios from 'axios';
let socket;
export default function Examiner() {

    const [btnDisabled, setBtnDisabled] = useState(false);
    const [btnText, setBtnText] = useState("Call Candidate");
    const [currentCandidate, setCurrentCandidate] = useState(false);
    const [load, setLoad] = useState(false);
    const [selfInfo, setSelfInfo] = useState({});
    useEffect(() => {
        if (localStorage.getItem('examiner-details')) {
            setLoad(true);
            setSelfInfo(JSON.parse(localStorage.getItem('examiner-details')))
        } else {
            setLoad(false);
        }

        if (!localStorage.getItem('examiner-details')) {
            let room = prompt("Please enter your room number");
            let examinerName = prompt("Please enter your name");
            while (!room || !examinerName || room.length === 0 || examinerName.length === 0) {
                room = prompt("Please enter your room number");
                examinerName = prompt("Please enter your name");
            }
            localStorage.setItem('examiner-details', JSON.stringify({ room, examinerName }));
            (async function () {
                await axios.post("http://localhost:4000/examiners", { examinerName });
                window.location.reload();
            })()
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
    const reset = async () => {
        await axios.delete("http://localhost:4000/examiners", { data: { name: JSON.parse(localStorage.getItem('examiner-details')).examinerName } });
        localStorage.removeItem("examiner-details");
        window.location.reload();
    }
    const resetRoom = async () => {
        const newRoom = prompt("enter your updated room number");
        localStorage.setItem('examiner-details', JSON.stringify({ ...selfInfo, room: newRoom }));
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
                        <Button variant="contained" color="success" onClick={callCandidate} disabled={btnDisabled} >{btnText}</Button>
                    </Stack>
                    <div div style={{ textAlign: "center", marginTop: "30px" }}>
                        <h1>Your Name is {selfInfo.examinerName}</h1>
                        <br />
                        <h2>room: {selfInfo.room}</h2>
                    </div >
                    <Stack style={{ marginTop: "30px" }} justifyContent="center" direction="row" spacing={2}>
                        <Button variant="contained" onClick={reset} >Reset All</Button>
                        <Button variant="contained" onClick={resetRoom} >Reset room</Button>
                    </Stack>

                </>
            }

        </>
    )
}
