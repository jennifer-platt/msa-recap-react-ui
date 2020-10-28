import React from "react";
import { useParams } from "react-router-dom";
// import Button from '@material-ui/core/Button'

// See https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/Adding_captions_and_subtitles_to_HTML5_video
// 
function Viewer(props:any) {

  let { slug } = useParams();

  let project = props.project;

  // let data = {
  //   "Insights": {
  //     "FileName": project + ".ogg_insights.json"
  //   },
  //   "Transcript": {
  //     "FileName": project + ".vtt"
  //   }
  // };

  // async function createTranscript(): Promise<string> {
  //   console.info("fetching",JSON.stringify(data));
  //   let response = await fetch('/api/HttpJsonTranscript', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(data),
  //   });
  //   if (!response.ok) {
  //     throw new Error('Unable to create transcript');
  //   }
  //   return await response.text();
  // }

  return (
    <div className="viewer">
      <div className="container">
        <br/>
            <p>
              {slug}
            </p>
            <p>
        </p>
            <p>
              <video controls id="video" preload="metadata" crossOrigin="*" autoPlay>
                <source src={"https://msarecap.blob.core.windows.net/recordings/" + project + ".webm"}
                  type="video/webm" />
                {/* <track label="English" kind="subtitles" srcLang="en" src={"https://msarecap.blob.core.windows.net/recordings/" + project + ".vtt"} default>
                </track> */}

              </video>
            </p>
            {/* <Button variant="contained" color="primary" id="transcript" onClick={createTranscript}>Create transcript</Button> */}
          </div>
        </div>
  );
}

export default Viewer;