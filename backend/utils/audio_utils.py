import pyaudio
import wave

def record_audio(file_name="recordings/input.wav", duration=5, sample_rate=16000):
    chunk = 1024  # Record in chunks of 1024 samples
    format = pyaudio.paInt16  # 16-bit resolution
    channels = 1  # Mono audio
    rate = sample_rate

    p = pyaudio.PyAudio()
    print("Recording...")

    stream = p.open(format=format, channels=channels, rate=rate,
                    input=True, frames_per_buffer=chunk)

    frames = []
    for _ in range(0, int(rate / chunk * duration)):
        data = stream.read(chunk)
        frames.append(data)

    print("Recording finished.")

    stream.stop_stream()
    stream.close()
    p.terminate()

    # Save as a WAV file
    with wave.open(file_name, 'wb') as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(p.get_sample_size(format))
        wf.setframerate(rate)
        wf.writeframes(b''.join(frames))

    return file_name
