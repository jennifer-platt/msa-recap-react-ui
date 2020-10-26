import React from "react";
import { useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { Button } from "@material-ui/core";
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import PauseIcon from '@material-ui/icons/Pause';
import StopIcon from '@material-ui/icons/Stop';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Tooltip from '@material-ui/core/Tooltip';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import Viewer from "./Viewer";

import {
  disableMicrophone, startAudioCapture, stopAudioCapture,
  downloadAudioCapture, pauseAudioCapture, getAudioCaptureBlob
} from "../audio_capture";
import {
  startScreenCapture, stopScreenCapture, disableScreenCap,
  downloadScreenCapture, pauseScreenCapture, getCaptureBlob
} from "../capture";
import { projectName, uploadBlob } from "../azure_upload";

// const logArray = Array(<></>);

function Home() {

  const [disabled, setDisabled] = useState({ enable: false, start: true, pause: true, end: true, upload: true, download: true });

  const [filename, setFilename] = useState("recording");

  const [project, setProject] = useState('');


  //setDisabled({enable:false,start:true,pause:true,end:true,upload:true,download:true});

  function download() {
    downloadScreenCapture(filename);
    downloadAudioCapture(filename);
  }

  /*
  const [log, setLog] = useState(<></>);


  let updateLog = (cl: string, msg: string) => {
    logArray.push(<span className={cl}>{msg}<br></br></span>);
    setLog(<>{[...logArray]}</>);
  }

  console.log = (msg: any) => updateLog("info", msg);
  console.error = (msg: any) => updateLog("error", msg);
  console.warn = (msg: any) => updateLog("warn", msg);
  console.info = (msg: any) => updateLog("info", msg);
  */

  /*
  enum recordingStateEnum {
    disabled,
    enabled,
    recording,
    paused,
    stopped,
    downloading
  };

  let recordingState: recordingStateEnum = recordingStateEnum.disabled;

  function setRecordingState(state: recordingStateEnum) {

    recordingState = state;

    switch (state) {
      case recordingStateEnum.disabled:
        break;
      case recordingStateEnum.enabled:
        break;
      case recordingStateEnum.recording:
        break;
      case recordingStateEnum.paused:
        break;
      case recordingStateEnum.stopped:
        break;
      case recordingStateEnum.downloading:
        break;
    }
  }
  */

  let enableRecording = () => {
    projectName().then((name) => {
      setProject(name);
    }).catch((err) => { console.warn(err) });
    // enableMicrophone();
    // enableScreenCap();
    setDisabled({ enable: true, start: false, pause: true, end: true, upload: true, download: true });
  }

  let startRecording = () => {
    startAudioCapture();
    startScreenCapture();
    setDisabled({ enable: true, start: true, pause: false, end: false, upload: true, download: true });
  }

  let pauseRecording = () => {
    pauseAudioCapture();
    pauseScreenCapture();
    setDisabled({ enable: true, start: false, pause: true, end: false, upload: true, download: true });
  }

  function endRecording() {
    stopAudioCapture();
    stopScreenCapture();
    disableMicrophone();
    disableScreenCap();
    setDisabled({ enable: false, start: true, pause: true, end: true, upload: false, download: false });
    upload();
  }

  function upload() {

    if (project) {
      console.info("Calling upload()");
      let ablob: Blob = getAudioCaptureBlob();
      uploadBlob(ablob, project, "ogg", true).then((m) => {
        console.warn("Upload message", m);
      });
      let vblob: Blob = getCaptureBlob();
      uploadBlob(vblob, project, "webm", false).then((m) => {
        console.warn("Upload message", m);
      });
    }

  }

  return (
    <div className="App">
      <br /><br />
      <p>
        <Button variant="contained" color="primary" id="enableRecording" disabled={disabled.enable} onClick={enableRecording}>Enable Recording</Button>
      </p>
      <p>
        <ButtonGroup variant="contained" color="primary">
          <Button id="start" disabled={disabled.start} onClick={startRecording}><Tooltip title="Start Recording" aria-label="Start Recording" arrow><FiberManualRecordIcon /></Tooltip></Button>
          <Button id="pause" disabled={disabled.pause} onClick={pauseRecording}><Tooltip title="Pause Recording" aria-label="Pause Recording" arrow><PauseIcon /></Tooltip></Button>
          <Button id="endRecording" disabled={disabled.end} onClick={endRecording}><Tooltip title="End Recording" aria-label="End Recording" arrow><StopIcon /></Tooltip></Button>
        </ButtonGroup>
      </p>

      <p>
        <Link to={"/viewer/" + project}>{project}</Link>
      </p>

      {/* <video controls muted id="video" autoPlay></video>
      <br></br> */}

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          Edit
        </AccordionSummary>
        <AccordionDetails>
          <Viewer />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          Upload/Download
        </AccordionSummary>
        <AccordionDetails>
          <p>
            <TextField label="Name your file" onChange={(evt) => { setFilename(evt.target.value) }} />
            <Button variant="contained" color="primary" id="download" onClick={download}>Download</Button>
          </p>
        </AccordionDetails>
      </Accordion>
    </div >
  );
}

export default withRouter(Home);