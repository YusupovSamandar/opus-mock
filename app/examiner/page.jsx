"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
// mui
import { io } from 'socket.io-client';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import LabTabs from "./../components/swtichTabs";
import CandidatesTable from "./../components/table";
require('dotenv').config();
const apiURL = process.env.NEXT_PUBLIC_API_URL;


export default function Examiner() {

    const [btnDisabled, setBtnDisabled] = useState(false);
    const [btnText, setBtnText] = useState("Call Candidate");
    const [currentCandidate, setCurrentCandidate] = useState(false);
    const [load, setLoad] = useState(false);
    const [selfInfo, setSelfInfo] = useState({});
    const [socket, setSocket] = useState(null);


    const [myAllCandidates, setMyAllCandidates] = useState({});

    const updateExaminerDT = (examinerN) => {
        let myDetails = JSON.parse(localStorage.getItem('examiner-details'));
        if (examinerN && examinerN === myDetails.examinerName) {
            (async function () {
                const { data: thisExData } = await axios.get(`${apiURL}/all/${myDetails.examinerName}`);
                setMyAllCandidates(thisExData);
            })()
        }
    }

    const skipHandler = (cndID) => {
        if (cndID) {
            alert(`candidate number ${cndID} is skipped`);
            setCurrentCandidate(false);
        }
    }

    const alertHandler = (obj) => {
        if (obj) {
            setCurrentCandidate(obj)
        } else {
            alert("No candidates left :(");
        }
    }

    useEffect(() => {
        if (localStorage.getItem('examiner-details')) {
            const thisExaminerDetails = JSON.parse(localStorage.getItem('examiner-details'));
            setLoad(true);
            setSelfInfo(thisExaminerDetails);
            (async function () {
                const { data: thisExData } = await axios.get(`${apiURL}/all/${thisExaminerDetails.examinerName}`);
                setMyAllCandidates(thisExData);
            })()
        } else {
            setLoad(false);
        }

        const newSocket = io(apiURL);
        setSocket(newSocket);
        if (!localStorage.getItem('examiner-details')) {
            let room = prompt("Please enter your room number").trim();
            let examinerName = prompt("Please enter your name").trim();
            while (!room || !examinerName || room.length === 0 || examinerName.length === 0) {
                room = prompt("Please enter your room number");
                examinerName = prompt("Please enter your name");
            }
            localStorage.setItem('examiner-details', JSON.stringify({ room, examinerName }));
            (async function () {
                await axios.post(`${apiURL}/examiners`, { examinerName });
                window.location.reload();
            })()
        }

        newSocket.on("connect", () => {
            newSocket.on("alert", alertHandler);

            newSocket.on("skipped", skipHandler);

            newSocket.on("update-data-for-examiner", updateExaminerDT);

        });

        return () => {
            newSocket.off("alert", alertHandler)
            newSocket.off("skipped", skipHandler)
            newSocket.off("update-data-for-examiner", updateExaminerDT)
            newSocket.disconnect();
        };
    }, []);

    const callCandidate = () => {
        setBtnDisabled(true);
        setBtnText("processing...");
        setTimeout(() => {
            setBtnDisabled(false);
            setBtnText("Call Candidate");
        }, 1000);
        socket.emit("candidate-called", localStorage.getItem('examiner-details'));
        setCurrentCandidate(false);
    }
    const reset = async () => {
        await axios.delete(`${apiURL}/examiners`, { data: { name: JSON.parse(localStorage.getItem('examiner-details')).examinerName } });
        localStorage.removeItem("examiner-details");
        window.location.reload();
    }
    const resetRoom = async () => {
        const newRoom = prompt("enter your updated room number");
        localStorage.setItem('examiner-details', JSON.stringify({ ...selfInfo, room: newRoom }));
        window.location.reload();
    }

    const skipCandidate = () => {
        setBtnDisabled(true);
        if (currentCandidate) {
            socket.emit("skip-candidate", currentCandidate);
        }
        setTimeout(() => {
            setBtnDisabled(false);
        }, 1000);
    }

    const MainPage = () => {
        return (
            <>
                {
                    load &&
                    <>
                        <div div style={{ marginTop: "15vh", textAlign: "center" }}>
                            <Typography variant="h5" gutterBottom>
                                Your current Candidate number is {currentCandidate.id}
                            </Typography>

                            <br />
                            <Typography variant="h5" gutterBottom>
                                FullName: {currentCandidate.candidate}
                            </Typography>
                        </div >
                        <Stack style={{ marginTop: "100px" }} justifyContent="center" direction="row" spacing={2}>
                            <Button variant="contained" color="success" onClick={callCandidate} disabled={btnDisabled} >{btnText}</Button>
                            <Button style={{ backgroundColor: !btnDisabled && "red" }} variant="contained" onClick={skipCandidate} disabled={btnDisabled} >{"cancel candidate"}</Button>
                        </Stack>
                        <Typography variant="h5" gutterBottom style={{ textAlign: "center", marginTop: "30px" }}>
                            <p>Your Name is: {selfInfo.examinerName}</p>
                            <br />
                            <p>room: {selfInfo.room}</p>
                        </Typography >
                        <Stack style={{ marginTop: "30px" }} justifyContent="center" direction="row" spacing={2}>
                            <Button variant="contained" onClick={reset} >Reset All</Button>
                            <Button variant="contained" onClick={resetRoom} >Reset room</Button>
                        </Stack>

                    </>
                }

            </>
        )
    }

    const MyPendingCandidatesPage = () => {
        return (
            <>
                <CandidatesTable content={myAllCandidates.pending} />
            </>
        );
    }
    const MyCompleteCandidatesPage = () => {
        return (
            <>
                <CandidatesTable content={myAllCandidates.complete} />
            </>
        );
    }


    return (
        <LabTabs
            mainPage={MainPage()}
            pendingCandidatePage={MyPendingCandidatesPage()}
            completeCandidatePage={MyCompleteCandidatesPage()}
            pendingCandidatePageLabel={myAllCandidates.pending && myAllCandidates.pending.length}
            completeCandidatePageLabel={myAllCandidates.complete && myAllCandidates.complete.length}
        />
    );
}
