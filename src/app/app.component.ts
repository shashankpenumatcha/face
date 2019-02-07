import { Component, AfterViewInit } from '@angular/core';
import * as faceapi from 'face-api.js'; 


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'face';

  constructor(){
    
  }

  ngAfterViewInit(){
    this.run();
  }


  async run() {
    if (!this.isFaceDetectionModelLoaded()) {

      await this.getCurrentFaceDetectionNet().load('/models')
      console.log('a');
      console.log(this.getCurrentFaceDetectionNet());
    }
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} })
    const videoEl:any = document.getElementById('inputVideo');
    videoEl.srcObject = stream
  }


  resizeCanvasAndResults(dimensions, canvas, results) {
    console.log(canvas);
    const { width, height } = dimensions instanceof HTMLVideoElement
      ? faceapi.getMediaDimensions(dimensions)
      : dimensions
    canvas.width = width
    canvas.height = height
  
    // resize detections (and landmarks) in case displayed image is smaller than
    // original size
    return faceapi.resizeResults(results, { width, height })
  }
  
  drawDetections(dimensions, canvas, detections) {
    console.log(canvas);
    const resizedDetections = this.resizeCanvasAndResults(dimensions, canvas, detections)
    faceapi.drawDetection(canvas, resizedDetections);
  }

  getCurrentFaceDetectionNet() {
    return faceapi.nets.tinyFaceDetector
  }

  isFaceDetectionModelLoaded() {
    return !!this.getCurrentFaceDetectionNet().params
  }


  getFaceDetectorOptions() {
    return new faceapi.TinyFaceDetectorOptions({ inputSize:128, scoreThreshold:0.3 })
  }

  async onPlay() {

    const videoEl:any = document.getElementById('inputVideo');
    if(videoEl.paused || videoEl.ended || !this.isFaceDetectionModelLoaded())
      return setTimeout(() => this.onPlay())
    const options = this.getFaceDetectorOptions();
    const result = await faceapi.detectSingleFace(videoEl, options)
    console.log(result);
    if (result) {
     
      this.drawDetections(videoEl, document.getElementById('overlay'), [result])
    }else{
      const canvas:any =document.getElementById('overlay');
      const context = canvas.getContext('2d');
      
      context.clearRect(0, 0, canvas.width, canvas.height);
    }

    setTimeout(() => this.onPlay())
  }

  

}

