/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const Recorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);

  // Visualization logic
  const drawVisualizer = () => {
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = "black";
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = "purple";
      canvasCtx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  const startVisualization = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 2048;

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;

    drawVisualizer();
  };

  const stopVisualization = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const handleRecordAndTranscribe = async () => {
    setIsRecording(true);
    setTranscription(""); // Clear previous transcription
    startVisualization(); // Start real-time visualization
    try {
      // Start recording
      await axios.post("http://127.0.0.1:5000/record", { duration: 30 });
      alert("Recording finished.");

      // Stop visualization
      stopVisualization();

      // Start transcription immediately after recording
      setIsLoading(true);
      const response = await axios.post("http://127.0.0.1:5000/transcribe", {
        file_name: "recordings/input.wav",
      });
      setTranscription(response.data.transcription);
    } catch (error) {
      console.error("Error during recording or transcription:", error);
    } finally {
      setIsRecording(false);
      setIsLoading(false);
      stopVisualization(); // Ensure visualization is stopped
    }
  };

  const clearTranscription = () => {
    setTranscription("");
  };

  return (
    <div className="main-content flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-md w-2/3 mx-auto mt-10">
      <div className="language-selector mb-4">
        <label htmlFor="language" className="text-lg font-medium">
          Choose Language:
        </label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="ml-2 p-2 border border-gray-300 rounded"
        >
          {/* <option value="en-US">English (US)</option> */}
          <option value="ne-NP">Nepali</option>
        </select>
      </div>
      <canvas
        ref={canvasRef}
        width={500}
        height={150}
        className="border border-gray-300 mb-4"
      />
      <div className="buttons flex space-x-4 mb-4">
        <button
          onClick={handleRecordAndTranscribe}
          className={`px-4 py-2 rounded ${
            isRecording ? "bg-gray-500" : "bg-blue-500 text-white"
          }`}
          disabled={isRecording || isLoading}
        >
          {isRecording ? "Recording..." : "Start Recording"}
        </button>
        <button
          onClick={clearTranscription}
          className="px-4 py-2 rounded bg-red-500 text-white"
        >
          Clear Text
        </button>
      </div>
      <div className="transcription bg-white p-4 rounded-lg shadow-md w-full">
        <h3 className="text-lg font-bold mb-2">Live Transcription:</h3>
        {isLoading ? (
          <p className="text-gray-500">Processing transcription...</p>
        ) : (
          <p className="text-gray-700">{transcription || "Listening..."}</p>
        )}
      </div>
    </div>
  );
};

export default Recorder;
