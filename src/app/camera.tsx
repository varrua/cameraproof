import { useEffect, useRef } from "react";
import Webcam from "react-webcam";


const App = () => {
  const webcam = useRef<Webcam>(null);

  

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

  

  return (
    <div className="App">
      <header className="header">
        <div className="title">face mask App</div>
      </header>
      <Webcam
        audio={false}
        ref={webcam}
        style={{
          position: "absolute",
          margin: "auto",
          textAlign: "center",
          top: 100,
          left: 0,
          right: 0,
        }}
      />
    </div>
  );
}

export default App;