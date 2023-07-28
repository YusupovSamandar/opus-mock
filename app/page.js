"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ringSound from './eventually.mp3';

let socket;
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
export default function Home() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [nextCandidates, setNextCandidates] = useState([]);

  async function fetchDT() {
    const { data: resp } = await axios.get("http://localhost:4000/all");
    setData(resp);
  }
  const playMusic = () => {
    // Replace 'your-music-file.mp3' with the path to your music file
    const audio = new Audio(ringSound);
    audio.play();
  };
  useEffect(() => {
    const removeFirstItem = () => {
      setNextCandidates((prevItems) => prevItems.slice(1));
      setOpen(false);
    };
    console.log(nextCandidates)

    // Check if there are items to display and start the timer
    if (nextCandidates.length > 0) {
      setOpen(true);
      playMusic();
      const timer = setTimeout(removeFirstItem, 5000);

      // Clean up the timer when the component unmounts or when the displayedItems change
      return () => clearTimeout(timer);
    }
  }, [nextCandidates]);

  useEffect(() => {
    socket = io("http://localhost:4000");
    fetchDT()
    socket.on("connect", () => {
      socket.on("update-candidates", (resData) => {
        setData(resData);
      });
      socket.on("ring", (nextCandidate, caller) => {
        setNextCandidates((prevItems) => [...prevItems, { ...nextCandidate, ...caller }]);
      });
    });
  }, []);

  return (
    <main className="flex p-4">

      <div className='pending-section'>
        <div className='section-title flex'>
          Pending Candidates <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>

        </div>
        {data.pending &&
          data.pending.map((cand, indx) => (
            <div key={indx} className='each-queue flex'>
              <div>{cand.candidate}</div>
              <div>#{cand.id}</div>
            </div>
          ))
        }
      </div>
      <div className='ready-section'>
        <div className='section-title flex'>
          Called Candidates <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-10 h-10">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
          </svg>

        </div>

        {data && data.complete &&
          data.complete.reverse().map((cand, indx) => (
            <div key={indx} className='each-queue flex'>
              <div>#{cand.id}</div>
              <div>room: {cand.room}</div>
            </div>
          ))
        }
      </div>

      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h3" component="h1">
            <h1 style={{ textAlign: "center", color: "#6528F7", fontSize: "4.5rem" }}>Candidate № {nextCandidates[0] && nextCandidates[0].id}</h1>
            <br />
            <h1 style={{ textAlign: "center", color: "#322653" }}>{nextCandidates[0] && nextCandidates[0].candidate}, please go to room №{nextCandidates[0] && nextCandidates[0].room} <br />
              Your examiner is: {nextCandidates[0] && nextCandidates[0].examinerName}</h1><br />
            <h2 style={{ color: "#C51605", textAlign: "center", fontSize: "2rem" }}>Good Luck!</h2>
          </Typography>
        </Box>
      </Modal>
    </main>
  )
}



