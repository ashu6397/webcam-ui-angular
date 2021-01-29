import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WebcamService } from './webcam-service.service';

@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.css']
})
export class WebcamComponent implements OnInit {

  private streamRecorder: MediaRecorder;
  private navigator: Navigator = Navigator.prototype;
  private mediaDevices: any = navigator.mediaDevices;
  private videoSource: MediaStream;
  private chunks: any[] = [];
  private mediaEvent = (event: BlobEvent) => {
    this.chunks.push(event.data);
    console.log("Data available");
    /* this.webcamService.postDataToServer(this.chunks).subscribe(() => {
      this.chunks = [];
    }, console.error);*/
  };
  @ViewChild('videoPlayer', { static: false })
  videoPlayer: ElementRef;
  dataSendInterval: NodeJS.Timer;
  webcamStream: any;

  constructor() { }

  ngOnInit() {
    console.log(this.navigator)
    this.mediaDevices.getUserMedia({ audio: true, video: true }).then((stream: MediaStream) => {
      const options = { mimeType: 'video/webm;codecs=vp9', bitsPerSecond: 100000 };
      this.videoPlayer.nativeElement.muted = true;
      this.webcamStream = stream;
      this.videoPlayer.nativeElement.srcObject = stream;
      this.streamRecorder = new MediaRecorder(stream, options);
      this.streamRecorder.ondataavailable = this.mediaEvent;
    }).catch((error) => {
      this.onVideoFail(error);
    });

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
