import React from "react";
// import { useParams } from "react-router-dom";

// See https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/Adding_captions_and_subtitles_to_HTML5_video
// 
function Viewer() {

  // let { slug } = useParams();

  let project = 'recording';

  let data = {
    "Insights": {
      "FileName": project + ".ogg_insights.json"
    },
    "Transcript": {
      "FileName": project + ".vtt"
    }
  };

  async function createTranscript(): Promise<string> {
    console.info("fetching",JSON.stringify(data));
    let response = await fetch('/api/HttpJsonTranscript', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Unable to create transcript');
    }
    return await response.text();
  }

  return (
    <div className="about">
      <div className="container">
        <div className="row align-items-center my-5">
          <div className="col-lg-9">
            <p>
              {/* {slug} */}
            </p>
            <p>
        <button id="transcript" onClick={createTranscript}>Create transcript</button>
        </p>
            <p>
              <video controls id="video" preload="metadata" crossOrigin="*" autoPlay>
                <source src={"https://msarecap.blob.core.windows.net" + project + ".webm"}
                  type="video/webm" />
                <track label="English" kind="subtitles" srcLang="en" src={"https://msarecap.blob.core.windows.net" + project + ".vtt"} default>
                </track>

              </video>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Viewer;