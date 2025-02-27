/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const Recorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);

  const handleCopyToClipboard = () => {
    if (transcription) {
      navigator.clipboard.writeText(transcription);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleClearTranscription = () => {
    setTranscription("");
  };

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

  const handleStartRecording = async () => {
    setIsRecording(true);
    setTranscription("");
    startVisualization();

    try {
      await axios.post("http://127.0.0.1:5000/record");
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const handleStopRecording = async () => {
    try {
      await axios.post("http://127.0.0.1:5000/stop");

      stopVisualization();
      setIsRecording(false);
      setIsLoading(true);

      const response = await axios.post("http://127.0.0.1:5000/transcribe", {
        file_name: "recordings/input.wav",
      });

      setTranscription(response.data.transcription);
    } catch (error) {
      console.error("Error stopping recording:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="main-content flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-md w-2/3 mx-auto mt-20">
      <p className="bg-green-400" > <strong>Nepali Speech-to-Text Converter</strong></p>
      <canvas ref={canvasRef} width={600} height={300} className="border border-gray-300 mb-4 mt-5" />

      <div className="buttons flex space-x-4 mb-4">
        <button
          onClick={handleStartRecording}
          className={`px-4 py-2 rounded text-white ${
            isRecording ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500"
          }`}
          disabled={isRecording}
        >
          {isRecording ? "Recording..." : "Start Recording"}
        </button>
        {transcription ? (
          <button
            onClick={handleClearTranscription}
            className="px-4 py-2 rounded bg-gray-500 text-white"
          >
            Clear
          </button>
        ) : (
          <button
            onClick={handleStopRecording}
            className={`px-4 py-2 rounded text-white ${
              isRecording ? "bg-red-500" : "bg-gray-500 cursor-not-allowed"
            }`}
            disabled={!isRecording}
          >
            Stop
          </button>
        )}
      </div>

      <div className="transcription bg-white p-4 rounded-lg shadow-md w-full relative">
        <h3 className="text-lg font-bold mb-2">Live Transcription:</h3>
        {isLoading ? (
          <p className="text-gray-500">Processing transcription...</p>
        ) : (
          <p className="text-gray-700">{transcription || "Listening..."}</p>
        )}

        {transcription && (
          <button
            onClick={handleCopyToClipboard}
            className="absolute top-3 right-3 bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Recorder;
