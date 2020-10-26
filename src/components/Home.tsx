import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import PauseIcon from '@material-ui/icons/Pause';
import StopIcon from '@material-ui/icons/Stop';
import Tooltip from '@material-ui/core/Tooltip';

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

export default class Home extends React.Component<{}, {
  recorded: boolean,
  disabled: any,
  filename: string,
  project: string,
  edited: boolean
  }> {
  constructor(props: any) {
    super(props);
    this.state = {
      recorded: false,
      disabled: { enable: false, start: true, pause: true, end: true, upload: true, download: true },
      filename: "recording",
      project: "",
      edited: false
    };
  }

  //setDisabled({enable:false,start:true,pause:true,end:true,upload:true,download:true});

  download() {
    downloadScreenCapture(this.state.filename);
    downloadAudioCapture(this.state.filename);
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

  enableRecording() {
    projectName().then((name) => {
      this.setState({ project: name });
    }).catch((err) => { console.warn(err) });
    // enableMicrophone();
    // enableScreenCap();
    this.setState({ disabled: { enable: true, start: false, pause: true, end: true, upload: true, download: true } });
    console.log(this.state);
  }

  startRecording() {
    startAudioCapture();
    startScreenCapture();
    this.setState({ disabled: { enable: true, start: true, pause: false, end: false, upload: true, download: true } });
  }

  pauseRecording() {
    pauseAudioCapture();
    pauseScreenCapture();
    this.setState({ disabled: { enable: true, start: false, pause: true, end: false, upload: true, download: true } });
  }

  endRecording() {
    stopAudioCapture();
    stopScreenCapture();
    disableMicrophone();
    disableScreenCap();

    this.setState({ disabled: { enable: false, start: true, pause: true, end: true, upload: false, download: false } });
    this.upload();
  }

  upload() {

    if (this.state.project) {
      console.info("Calling upload()");
      let ablob: Blob = getAudioCaptureBlob();
      uploadBlob(ablob, this.state.project, "ogg", true).then((m) => {
        console.warn("Upload message", m);
      });
      let vblob: Blob = getCaptureBlob();
      uploadBlob(vblob, this.state.project, "webm", false).then((m) => {
        console.warn("Upload message", m);
      });
      this.setState({ recorded: true });
    }

  }

  render() {

    let viewer = this.state.recorded ? <Viewer /> : null
    let upload = this.state.edited ? <div>
    <TextField label="Name your file" onChange={(evt) => { this.setState({ filename: evt.target.value }) }} />
    <Button variant="contained" color="primary" id="download" onClick={() => this.download()}>Download</Button>
  </div> : null

    return (
      <div className="App">
        <br /><br />
        <div>
          <Button variant="contained" color="primary" id="enableRecording" disabled={this.state.disabled.enable} onClick={() => this.enableRecording()}>Enable Recording</Button>
        </div>
        <br />
        <div>
          <ButtonGroup variant="contained" color="primary">
            <Button id="start" disabled={this.state.disabled.start} onClick={() => this.startRecording()}><Tooltip title="Start Recording" aria-label="Start Recording" arrow><FiberManualRecordIcon /></Tooltip></Button>
            <Button id="pause" disabled={this.state.disabled.pause} onClick={() => this.pauseRecording()}><Tooltip title="Pause Recording" aria-label="Pause Recording" arrow><PauseIcon /></Tooltip></Button>
            <Button id="endRecording" disabled={this.state.disabled.end} onClick={() => this.endRecording()}><Tooltip title="End Recording" aria-label="End Recording" arrow><StopIcon /></Tooltip></Button>
          </ButtonGroup>
        </div>


        <Link to={"/viewer/" + this.state.project}>{this.state.project}</Link>


        {/* <video controls muted id="video" autoPlay></video>
      <br></br> */}

        {viewer}

        {upload}

      </div >
    );
  }
}