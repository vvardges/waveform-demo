import React, {useEffect, useState} from 'react';
import './App.css';
import {WaveForm} from "./WaveForm";

function App() {
    /**
     * Filters the AudioBuffer retrieved from an external source
     * @param {AudioBuffer} audioBuffer the AudioBuffer from drawAudio()
     * @returns {Array} an array of floating point numbers
     */
    const filterData = audioBuffer => {
        const rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
        const samples = 300; // Number of samples we want to have in our final data set
        const blockSize = Math.floor(rawData.length / samples); // the number of samples in each subdivision
        const filteredData = [];
        for (let i = 0; i < samples; i++) {
            let blockStart = blockSize * i; // the location of the first sample in the block
            let sum = 0;
            for (let j = 0; j < blockSize; j++) {
                sum = sum + Math.abs(rawData[blockStart + j]); // find the sum of all the samples in the block
            }
            filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
        }
        return filteredData;
    };

    /**
     * Normalizes the audio data to make a cleaner illustration
     * @param {Array} filteredData the data from filterData()
     * @returns {Array} an normalized array of floating point numbers
     */
    const normalizeData = filteredData => {
        const multiplier = Math.pow(Math.max(...filteredData), -1);
        return filteredData.map(n => n * multiplier);
    }

    /**
     * Draws the audio file into a canvas element.
     * @param {Array} normalizedData The filtered array returned from filterData()
     * @returns {Array} a normalized array of data
     */
    const draw = normalizedData => {
        // set up the canvas
        const canvas = document.querySelector("canvas");
        const dpr = window.devicePixelRatio || 1;
        const padding = 20;
        canvas.width = canvas.offsetWidth * dpr;
        canvas.height = (canvas.offsetHeight + padding * 2) * dpr;
        const ctx = canvas.getContext("2d");
        ctx.scale(dpr, dpr);
        ctx.translate(0, canvas.offsetHeight / 2 + padding); // set Y = 0 to be in the middle of the canvas

        // draw the line segments
        const width = canvas.offsetWidth / normalizedData.length;
        for (let i = 0; i < normalizedData.length; i++) {
            const x = width * i;
            let height = normalizedData[i] * canvas.offsetHeight - padding;
            if (height < 0) {
                height = 0;
            } else if (height > canvas.offsetHeight / 2) {
                height = height > canvas.offsetHeight / 2;
            }
            drawLineSegment(ctx, x, height, width, (i + 1) % 2);
        }
    };

    /**
     * A utility function for drawing our line segments
     * @param {AudioContext} ctx the audio context
     * @param {number} x  the x coordinate of the beginning of the line segment
     * @param {number} height the desired height of the line segment
     * @param {number} width the desired width of the line segment
     * @param {boolean} isEven whether or not the segmented is even-numbered
     */
    const drawLineSegment = (ctx, x, height, width, isEven) => {
        ctx.lineWidth = 1; // how thick the line is
        ctx.strokeStyle = "#fff"; // what color our line is
        ctx.beginPath();
        height = isEven ? height : -height;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.arc(x + width / 2, height, width / 2, Math.PI, 0, isEven);
        ctx.lineTo(x + width, 0);
        ctx.stroke();
    };

    const theSecret = (data) => {
        const filteredData = [];
        const timePoints = [];
        for (let i = 0; i < data.length; i += Math.floor(Math.random() * 5)) {
            timePoints.push(i);
            filteredData.push(data[i]);
        }
        return {
            filteredData,
            timePoints
        };
    };

    const [data, setData] = useState([]);

    useEffect(   () => {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();

        const url = 'https://vvardges.github.io/bluedotstemeditor/assets/audio/erast/04_Erast_Harp.mp3';

        fetch(url)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                const data = normalizeData(filterData(audioBuffer));
                draw(data);

                const secretData = [];
                secretData.push(theSecret(data));
                secretData.push(theSecret(data));
                secretData.push(theSecret(data));
                setData(secretData);
            });

    }, []);


    return (
        <div className="App">
            <div className="panel">
                <canvas/>
            </div>
            {data.length > 0 && <WaveForm
                colors = {["rgb(255, 228, 190)", "rgb(240, 157, 178)", "rgb(118, 161, 196)", "rgb(110, 121, 163)"]}
                data={data}
                delta={[0, 40]}
            />}
        </div>
    );
}

export default App;
