import { Button } from "@mui/material";
import { Dispatch, SetStateAction, useCallback, useEffect, useRef } from "react";
import Webcam from "react-webcam";

interface props {
  setDatosImagen: (datos:string) => void
}

const App = ({setDatosImagen}:props) => {
  const webcam = (useRef<Webcam>(null)) as any;

  

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

  const capture = useCallback(
    () => {
      const imageSrc = webcam.current.getScreenshot();
      setDatosImagen(imageSrc)
      console.log(imageSrc)
    },
    [webcam],
  )
  

  

  return (
    <div className="App">
      <header className="header">
        <div className="title">face mask App</div>
      </header>
      <Webcam
        audio={false}
        ref={webcam}
        screenshotFormat="image/jpeg"
        style={{
          position: "absolute",
          margin: "auto",
          textAlign: "center",
          top: 100,
          left: 0,
          right: 0,
        
        }}width={300}
        height={300}
        
      />
      <Button onClick={capture}>
        Capturar
      </Button>
    </div>
  );
}

export default App;