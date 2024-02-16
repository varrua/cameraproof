import { Button } from "@mui/material";
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { OEM, createWorker } from "tesseract.js";

interface props {
  setDatosImagen: (datos:string) => void
}

const App = ({setDatosImagen}:props) => {
  const webcam = (useRef<Webcam>(null)) as any;

  const [texto, settexto] = useState('')

  

  const detect = async (model:any) => {
    if (webcam.current) {
      const webcamCurrent = webcam.current;
      // go next step only when the video is completely uploaded.
      if(webcamCurrent){
          if(webcamCurrent.video){
            if ( webcamCurrent.video.readyState === 4) {
              const video = webcamCurrent.video;
              const predictions = await model.estimateFaces({
                input: video,
              });
              if (predictions.length) {
                console.log(predictions);
              }
            }
          }
      }
      
    };
  };

  async function detectText(image:any) {
    // Crear un trabajador de tesseract.js
    //const worker =  await createWorker();
    const worker = await createWorker('spa',1)

    const { data: { text } } = await worker.recognize(image);
    await worker.terminate();
    settexto(text)
    console.log('texto',text)
  
    // Devolver el texto reconocido
    return text;
  }

  const capture = useCallback(
    () => {
      const imageSrc = webcam.current.getScreenshot();
      setDatosImagen(imageSrc)
      detectText(imageSrc)
      console.log(imageSrc)
    },
    [webcam],
  )
  

  

  return (
    <div >
      <header >
        <div className="title">face mask App</div>
      </header>
      <Webcam
        audio={false}
        ref={webcam}
        screenshotQuality={1}
        imageSmoothing={false}
        screenshotFormat="image/jpeg"
        videoConstraints={{
           facingMode: 'environment',
          
          
        }}
        // style={{
        //   position: "absolute",
        //   margin: "auto",
        //   textAlign: "center",
        //   top: 100,
        //   left: 0,
        //   right: 0,
        
        // }}
        width={300}
        height={300}
        
      />
      <p>{texto}</p>
      <Button onClick={capture}>
        Capturar
      </Button>
    </div>
  );
}

export default App;