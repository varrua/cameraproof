"use client"
import React, { useEffect, useState, useRef, useCallback } from "react";
import * as cv  from "@techstark/opencv-js";

//import { useOpenCv } from "opencv-react";
//import {cv} from 'opencv.js';
import { createWorker } from "tesseract.js";
import { Button } from "@mui/material";
import Webcam from "react-webcam";
//import * as cv from "@techstark/opencv-js"



export async function detectText(image:any) {
    // Crear un trabajador de tesseract.js
    //const worker =  await createWorker();
    const worker = await createWorker('eng')
    
  


   /*  Tesseract.recognize(
        image,
        'spa+spa',
        { logger: m => console.log(m) }
        ).then(({ data: { text } }) => {
        console.log(text);
        return text
        }
    ) */
    



    const { data: { text } } = await worker.recognize(image);
    await worker.terminate();

    //console.log('texto',text)
  
    //Devolver el texto reconocido
   return text;
  }


function OpenCVVideoProcessing() {
  //const { cv, loaded: cvLoaded } = useOpenCv();
  const [isReady, setIsReady] = useState(false);
  const videoRef = useRef<any>(null);
  const webcam = (useRef<Webcam>(null) as any);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef2 = useRef<HTMLCanvasElement>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [texto, setTexto] = useState('');


  /* useEffect(() => {
    // Load OpenCV.js
       console.log('aa',cv?.onRuntimeInitialized)
      if(!cv?.onRuntimeInitialized) return
      cv.onRuntimeInitialized = () => {
        console.log("OpenCV is ready");
        setIsReady(true);
        startVideo();
      };
      console.log("OpenCV is ready",cv);
  }, [cv]);  */
  useEffect(() => {
      
      /* const initializeOpenCV = async () => {
        await cv.onRuntimeInitialized();
        setIsReady(true);
        startVideo();
      }; */
      console.log(cv)
      //initializeOpenCV();
      /* setTimeout(() => {
        setIsReady(true);
        startVideo();
      }, 2000); */
    return () => {
      // Limpiar si es necesario
    };
  }, []);

  
  



 



  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch((err) => {
        console.error("Error accessing the camera: ", err);
      });
  };

  const processVideoCus = () => {
    if (!isReady || !videoRef.current || !canvasRef.current) {
      return;
    }
    let video = videoRef.current;
    let canvas = videoRef.current;
    let context = canvas.getContext("2d") as CanvasRenderingContext2D;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    let src = cv.imread(canvas);
    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
    
  }

  const processVideo3 = async () => {
    setTimeout(async() => {
      
    
    if (!isReady || !videoRef.current || !canvasRef.current) {
      return;
    }

    let video = videoRef.current;
    let canvas = canvasRef.current;
    let context = canvas.getContext("2d") as CanvasRenderingContext2D;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convertir el canvas a una imagen OpenCV
    let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    let src = cv.matFromImageData(imageData);

    // Aplicar preprocesamiento de imagen con OpenCV
    
    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
    cv.threshold(src, src, 127, 255, cv.THRESH_BINARY);

    // Realizar la detección de texto
    const text = await detectText(src);

    // Mostrar el texto en la consola
    console.log(text);
    //Convert canvas to data URL
    const imageDataURL = canvas.toDataURL("image/png");
    setProcessedImage(imageDataURL);
    // Liberar memoria
    src.delete();

    // Continuar procesando frames
   // requestAnimationFrame(processVideo);
  }, 500);
};









const processImage = async (img:any) => {
  if (!isReady || !videoRef.current || !canvasRef2.current) {
    return;
  }
  /* let video = videoRef.current;
  const canvas = canvasRef2.current
  let context = canvas.getContext("2d") as CanvasRenderingContext2D;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const img = cv.imread(canvas);

  // to gray scale
  */
 const imgGray = new cv.Mat(); 
  cv.cvtColor(img, imgGray, cv.COLOR_BGR2GRAY);
  let dst = new cv.Mat();

  // Aplicar la umbralización adaptativa
  cv.adaptiveThreshold(imgGray, dst, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 11, 2);
  const edges = new cv.Mat();
  cv.Canny(imgGray, edges, 100, 100);
  cv.imshow(img, imgGray);

  /* // detect edges using Canny
  const edges = new cv.Mat();
  cv.Canny(imgGray, edges, 100, 100);
  cv.imshow(canvasRef2.current, edges); */

  // Convert canvas to data URL
  const can = img as any
  const imageDataURL = can.toDataURL("image/jpg");
  /* processImage(imageDataURL) */
  setProcessedImage(imageDataURL);

 const a = await detectText(imageDataURL)
  console.log(a)


  // need to release them manually
  img.delete();
  imgGray.delete();
  //edges.delete();
  //requestAnimationFrame(processVideo);
}

  const processVideo = async () => {
    if (!isReady || !videoRef.current || !canvasRef.current) {
      return;
    }

    let video = videoRef.current;
    let canvas = canvasRef.current;
    //let context = canvas.getContext("2d");
    let context = canvas.getContext("2d") as CanvasRenderingContext2D;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

   
    
    
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    let src = cv.imread(canvas);
    processImage(canvas)
    let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
    cv.Canny(src, src, 50, 100, 3, false);
    cv.threshold(src, src, 127, 255, cv.THRESH_BINARY);
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(
      src,
      contours,
      hierarchy,
      cv.RETR_EXTERNAL,
      cv.CHAIN_APPROX_SIMPLE
    );

    // Draw contours
    for (let i = 0; i < contours.size(); ++i) {
      let cnt = contours.get(i);
      let tmp = new cv.Mat();
      cv.approxPolyDP(cnt, tmp, 3, true);
      if (tmp.total() === 4) {
        let cntArea = cv.contourArea(cnt, false);
        if (cntArea > 100) {
          let color = new cv.Scalar(255, 0, 0, 255);
          cv.drawContours(dst, contours, i, color, 1, cv.LINE_8, hierarchy, 0);
        }
      }
      cnt.delete();
      tmp.delete();
    }

    
 
     

    cv.imshow(canvas, dst);
    src.delete();
    dst.delete();
    contours.delete();
    hierarchy.delete();

    

    /* const a =  await detectText(processVideo)
    console.log(a) */
    // Continue processing frames
    //requestAnimationFrame(processVideo);
  };


  const capturePhoto = async() => {

    if (!canvasRef.current) {
      return;
    }
    
    const webcamElement = webcam.current.video;
    console.log(webcamElement)
    const canvasElement = canvasRef.current;
  
    canvasElement.width = webcamElement.videoWidth;
    canvasElement.height = webcamElement.videoHeight;
  
    const ctx = canvasElement.getContext('2d') as CanvasRenderingContext2D;
    ctx.drawImage(webcamElement, 0, 0, canvasElement.width, canvasElement.height);
  
    const img = cv.imread(canvasElement);
    const imgGray = new cv.Mat();



// Agrandar la imagen
const scale_factor = 2; // Cambiar según sea necesario
const new_height = img.rows * scale_factor;
const new_width = img.cols * scale_factor;
const resized_img = new cv.Mat(new_height, new_width, img.type());
cv.resize(img, resized_img, new cv.Size(new_width, new_height));


    cv.cvtColor(img, imgGray, cv.COLOR_BGR2GRAY);
   
  
    // Aplicar la umbralización adaptativa
    //cv.Canny(imgGray, imgGray, 100, 100);
    //cv.adaptiveThreshold(imgGray, imgGray, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 11, 2);
    //cv.adaptiveThreshold(imgGray, imgGray, 255, cv.ADAPTIVE_THRESH_MEAN_C, cv.THRESH_BINARY, 11, 2);
    //cv.threshold(imgGray, imgGray, 127, 255, cv.THRESH_BINARY);



    cv.imshow(canvasElement, imgGray);





            

           

            const can = canvasElement
           let  imagen = can.toDataURL('image/jpeg')
           setProcessedImage(imagen)
           const a = await detectText(imagen)
           setTexto(a)
           console.log(a)


           


   
    /* const imageData = new Uint8ClampedArray(imgGray.data);
    const imageDataArray = Array.from(imageData);
  
    // Convertir la imagen procesada a base64
    const base64Image = `data:image/jpeg;base64,${btoa(String.fromCharCode.apply(null, imageDataArray))}`;
    setProcessedImage(base64Image);
  */
    // Liberar memoria
    img.delete();
    imgGray.delete(); 
  };

  const processVideo2 = () => {
    if (!isReady || !videoRef.current || !canvasRef.current) {
      return;
    }

    let video = videoRef.current;
    let canvas = canvasRef.current;
    let context = canvas.getContext("2d") as CanvasRenderingContext2D;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    let src = cv.imread(canvas);
    let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
    cv.Canny(src, src, 50, 100, 3, false);
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(
      src,
      contours,
      hierarchy,
      cv.RETR_EXTERNAL,
      cv.CHAIN_APPROX_SIMPLE
    );

    // Draw contours
    for (let i = 0; i < contours.size(); ++i) {
      let cnt = contours.get(i);
      let tmp = new cv.Mat();
      cv.approxPolyDP(cnt, tmp, 3, true);
      if (tmp.total() === 4) {
        let cntArea = cv.contourArea(cnt, false);
        if (cntArea > 100) {
          let color = new cv.Scalar(255, 0, 0, 255);
          cv.drawContours(dst, contours, i, color, 1, cv.LINE_8, hierarchy, 0);
        }
      }
      cnt.delete();
      tmp.delete();
    }

    cv.imshow(canvas, dst);

    // Convert canvas to data URL
    const imageDataURL = canvas.toDataURL("image/png");
    setProcessedImage(imageDataURL);

    const a = detectText(imageDataURL)
    console.log(a)

    src.delete();
    dst.delete();
    contours.delete();
    hierarchy.delete();

    // Continue processing frames
    //requestAnimationFrame(processVideo);
  };

  // Start processing video when the component mounts and OpenCV is ready
  useEffect(() => {
    if (isReady) {
      /* setTimeout(() => {
        requestAnimationFrame(processVideo3)
      }, 500); */
      //requestAnimationFrame(processVideo);
    }
  }, [isReady]);

 /*  const capturarFoto = useCallback(
    () => {
      if(webcam.current){
        const imageSrc = webcam.current.getScreenshot();
        capturePhoto()
        //setProcessedImage(imageSrc);
        
      }
    },
    [webcam],
  ) */
  

  return (

      <div>
        <h2>OpenCV.js Video Processing in React</h2>
        <p>{texto}</p>
        {/* <video ref={videoRef} height={500} width={500} style={{ display: "" }} onLoadedData={processImage}></video> */}
        <canvas  ref={canvasRef}></canvas>
        {/* <canvas ref={canvasRef2} style={{background:'white'}}/> */}
        <Webcam
          ref={webcam}
          audio={false}
          screenshotFormat={'image/jpeg'}
          videoConstraints={{
            facingMode: 'environment'
          }}
        />
        <Button style={{background:'blue'}} onClick={()=>capturePhoto()}>Capturar</Button>
         {processedImage && (
        <img src={processedImage} alt="Processed Image" style={{ width: "100%" }} />
      )} 

      </div>
  );
}

export default OpenCVVideoProcessing;
