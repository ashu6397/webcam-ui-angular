import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebcamService {

  constructor(private httpClient: HttpClient) {
    this.initWebcamRecording();
  }
  initWebcamRecording() {
    this.setupWebcamCapture();
  }
  postDataToServer(chunks: any) {
    const webcamData = new Blob(chunks, { type: "video/webm" });
    const formData = new FormData();
    formData.append('data', webcamData);
    return this.httpClient.post("http://localhost:8080/upload", formData);
  }

  private streamRecorder: MediaRecorder;
  private navigator: Navigator = Navigator.prototype;
  private mediaDevices: any = navigator.mediaDevices;
  private chunks: any[] = [];
  private mediaEvent = (event: BlobEvent) => {
    this.chunks.push(event.data);
    console.log("Data available");
    this.postDataToServer(this.chunks).subscribe(() => {
      this.chunks = [];
    }, console.error);
  };
  dataSendInterval: NodeJS.Timer;
  webcamStream: any;


  async setupWebcamCapture() {
    console.log(this.navigator)
    if (this.mediaDevices.getUserMedia) {
      const stream = await this.mediaDevices.getUserMedia({ audio: true, video: true });
      const options = { mimeType: 'video/webm;codecs=vp9', bitsPerSecond: 100000 };
      this.webcamStream = stream;
      this.streamRecorder = new MediaRecorder(stream, options);
      this.streamRecorder.ondataavailable = this.mediaEvent;
      this.startRecording();
    } else {
      alert('Webcam/Microphone failed');
    }

  }
  onVideoFail(e) {
    console.log('webcam fail!', e);
  }

  startRecording() {
    this.streamRecorder.start();
    console.log('Recording started');
    this.dataSendInterval = setInterval(() => {
      this.streamRecorder.requestData();
    }, 5000);
  }

  stopRecording() {
    this.streamRecorder.stop();
    clearInterval(this.dataSendInterval);
    console.log('Recording stopped');
  }
}
