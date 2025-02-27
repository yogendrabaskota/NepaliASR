import pyaudio
import wave
import threading

# Global variables for recording control
recording = False
audio_stream = None
audio_frames = []
p = pyaudio.PyAudio()


def record_audio(file_name="recordings/input.wav", sample_rate=16000):
    """
    Start recording audio and save it to a file when stopped.
    """
    global recording, audio_stream, audio_frames
    recording = True
    chunk = 1024  # Record in chunks of 1024 samples
    format = pyaudio.paInt16  # 16-bit resolution
    channels = 1  # Mono audio

    print("Recording started...")

    # Open an audio stream
    audio_stream = p.open(format=format, channels=channels, rate=sample_rate,
                          input=True, frames_per_buffer=chunk)
    
    audio_frames = []

    while recording:
        data = audio_stream.read(chunk)
        audio_frames.append(data)

    print("Recording stopped.")

    # Stop and close the stream
    audio_stream.stop_stream()
    audio_stream.close()

    # Save the recorded audio to a WAV file
    with wave.open(file_name, 'wb') as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(p.get_sample_size(format))
        wf.setframerate(sample_rate)
        wf.writeframes(b''.join(audio_frames))


def stop_recording():
    """
    Stop the recording process.
    """
    global recording
    recording = False  # This will break the recording loop
