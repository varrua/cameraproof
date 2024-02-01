import { useEffect, useRef } from "react";
import Webcam from "react-webcam";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import MediaPipeFaceMesh  from "@tensorflow-models/face-landmarks-detection/dist/types"

const App = () => {
  const webcam = useRef<Webcam>(null);

  const runFaceDetect = async () => {
    const model = await (faceLandmarksDetection as any).load(
      (faceLandmarksDetection as any).SupportedPackages.mediapipeFacemesh
    );
  /*
     Please check your library version.
     The new version is a bit different from the previous.
     You should write as followings in the new one.
     You will see more information from https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection.
     const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
      const detectorConfig = {
        runtime: 'mediapipe', // or 'tfjs'
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
      }
      const detector = await faceLandmarksDetection.createDetector(model, detectorConfig);
    */
    detect(model);
  };

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

  useEffect(() => {
    runFaceDetect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webcam.current?.video?.readyState])

  return (
    <div className="App">
      <header className="header">
        <div className="title">face mask App</div>
      </header>
      {/* <Webcam
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
      /> */}
    </div>
  );
}

export default App;