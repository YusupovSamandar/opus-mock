"use client";
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import DownloadButton from "./../components/downloadButton";
import ExaminersTable from "./../components/table";
require('dotenv').config();

const apiURL = process.env.NEXT_PUBLIC_API_URL;

export default function Examiner() {
    const [socket, setSocket] = useState(null);

    const informHandler = (number) => {
        alert("this candidate Id is " + number);
    }

    const fetchExaminersDT = async () => {
        const { data: allExaminers } = await axios.get(`${apiURL}/examiners`)
        setExaminers(allExaminers);
    }

    useEffect(() => {
        let newSocket = io(apiURL);
        setSocket(newSocket);
        newSocket.on("connect", () => {
            newSocket.on("inform", informHandler);
        });
        fetchExaminersDT();
        return () => {
            newSocket.off("inform", informHandler);
            newSocket.disconnect();
        };
    }, []);

    const [candidateID, setCandidateID] = useState("");
    const [inputVal, setInputval] = useState("");
    const [examiners, setExaminers] = useState([]);
    const [chosenExaminer, setChosenExaminer] = useState("");
    const [buttonTx, setButtonTx] = useState("Add Candidate");

    const addCandidate = () => {
        setButtonTx("Processing...");
        if (candidateID.length > 0 && inputVal.length > 0 && chosenExaminer.length > 0) {
            socket.emit("add-candidate", { name: inputVal, examiner: chosenExaminer, id: candidateID });
            setInputval("");
            setChosenExaminer("");
            setCandidateID("");
            fetchExaminersDT();
        } else {
            alert("please enter name");
        }
        setTimeout(() => {
            setButtonTx("Add Candidate");
        }, 1000);
    }

    const clearAllData = async () => {
        const textPrompt = prompt("type in 'yes' to confirm");
        if (textPrompt.toLowerCase() === "yes") {
            const deletedResponse = await axios.delete(`${apiURL}/all`);
            alert(deletedResponse);
        } else {
            alert("process canceled");
        }
    }

    return (
        <>
            <Stack style={{ marginTop: "100px" }} justifyContent="center" direction="row" spacing={2}>
                <TextField id="outlined-basic" label="CandidateID" onChange={(e) => { setCandidateID(e.target.value) }} value={candidateID} variant="outlined" />
                <TextField id="outlined-basic" label="Fullname" onChange={(e) => { setInputval(e.target.value) }} value={inputVal} variant="outlined" />
                <TextField
                    id="outlined-select-currency"
                    select
                    label="Select examiner"
                    helperText="Please select their examiner"
                    onChange={(e) => {
                        setChosenExaminer(e.target.value);
                    }}
                    value={chosenExaminer}
                >
                    {examiners.map((option, ind) => (
                        <MenuItem key={ind} value={option.examinerName}>
                            {option.examinerName}
                        </MenuItem>
                    ))}
                </TextField>
                <Button variant="contained" onClick={addCandidate} disabled={buttonTx === "Processing..."}>{buttonTx}</Button>
            </Stack><br /><br />
            <div style={{ textAlign: "center" }}>
                <DownloadButton />
                <br /><br />
                <div className="container m-auto">
                    <ExaminersTable customStyle={{ width: "70%", margin: "0 auto" }} column1={"examiners"} column2={"pending candidates"} content={examiners} column1Key={"examinerName"} column2Key={"pendingNumber"} />
                </div>
                <br /><br />
                <Button variant="contained" onClick={clearAllData} disabled={buttonTx === "Processing..."}>Delete Data</Button>
            </div>


        </>
    )
}
