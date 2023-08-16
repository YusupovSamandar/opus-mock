import React, { useState } from 'react';
import { CSVLink } from 'react-csv';
import axios from 'axios';
import Button from '@mui/material/Button';

require('dotenv').config();

const apiURL = process.env.NEXT_PUBLIC_API_URL;

const DownloadButton = () => {
    const [jsonData, setJsonData] = useState(null);

    const fetchData = async () => {
        const { data: { complete } } = await axios.get(`${apiURL}/all`);
        setJsonData(complete);
    };

    // Convert JSON to CSV format
    const convertToCsv = () => {
        if (jsonData) {
            // Convert JSON to CSV format
            const csvData = [
                ["id", 'Examiner', 'Candidate', "room"], // CSV header
                ...jsonData.map(item => [item.id, item.candidate, item.examiner, item.room])
            ];

            return (
                <CSVLink data={csvData} filename={"results.csv"}>
                    Download CSV
                </CSVLink>
            );
        }
    };

    return (
        <div>
            <Button variant="contained" onClick={fetchData}>download CSV</Button>
            {convertToCsv()}
        </div>
    );
}

export default DownloadButton;
