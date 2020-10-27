import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import PauseIcon from '@material-ui/icons/Pause';
import StopIcon from '@material-ui/icons/Stop';
import Tooltip from '@material-ui/core/Tooltip';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core';

import Viewer from "./Viewer";

import {
  enableMicrophone, disableMicrophone, startAudioCapture, stopAudioCapture,
  downloadAudioCapture, pauseAudioCapture, getAudioCaptureBlob
} from "../audio_capture";
import {
  startScreenCapture, stopScreenCapture, enableScreenCap, disableScreenCap,
  downloadScreenCapture, pauseScreenCapture, getCaptureBlob
} from "../capture";
import { projectName, uploadBlob } from "../azure_upload";

// const logArray = Array(<></>);

const GlobalCss = withStyles({
  '@global': {
    '.MuiAccordionDetails-root': {
      display: 'block'
    },
  },
})(() => null);

export default class Home extends React.Component<{}, {
  recording: boolean,
  recorded: boolean,
  disabled: any,
  filename: string,
  project: string,
  edited: boolean
}> {
  constructor(props: any) {
    super(props);
    this.state = {
      recording: false,
      recorded: false,
      disabled: { enable: false, start: true, pause: true, end: true, complete: true, upload: true, download: true },
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
    enableMicrophone();
    enableScreenCap();
    this.setState({ recording: true, disabled: { enable: true, start: false, pause: true, end: true, complete:true, upload: true, download: true } });
  }

  startRecording() {
    startAudioCapture();
    startScreenCapture();
    this.setState({ disabled: { enable: true, start: true, pause: false, end: false, complete:true, upload: true, download: true } });
  }

  pauseRecording() {
    pauseAudioCapture();
    pauseScreenCapture();
    this.setState({ disabled: { enable: true, start: false, pause: true, end: false, complete:true, upload: true, download: true } });
  }

  endRecording() {
    stopAudioCapture();
    stopScreenCapture();
    disableMicrophone();
    disableScreenCap();

    this.setState({ disabled: { enable: false, start: true, pause: true, end: true, complete: false, upload: false, download: false } });

  }

  completeRecording() {
    this.upload();
    this.setState({ recording: false, recorded: true })
  }

  completeEditing() {
    this.setState({ edited: true })
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
    }

  }

  render() {
    return (
      <div className="App">
        <Accordion defaultExpanded={true} expanded={!this.state.recorded}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>1. Record</Typography>
          </AccordionSummary>
          <GlobalCss />
          <AccordionDetails>
            <div>
            <Button variant="contained" color="primary" id="enableRecording" disabled={!this.state.disabled.complete} onClick={() => this.enableRecording()}>Enable Recording</Button>
            </div>
            <br />
            <div>
              <ButtonGroup variant="contained" color="primary">
                <Button id="start" disabled={this.state.disabled.start} onClick={() => this.startRecording()}><Tooltip title="Start Recording" aria-label="Start Recording" arrow><FiberManualRecordIcon /></Tooltip></Button>
                <Button id="pause" disabled={this.state.disabled.pause} onClick={() => this.pauseRecording()}><Tooltip title="Pause Recording" aria-label="Pause Recording" arrow><PauseIcon /></Tooltip></Button>
                <Button id="endRecording" disabled={this.state.disabled.end} onClick={() => this.endRecording()}><Tooltip title="Stop Recording" aria-label="Stop Recording" arrow><StopIcon /></Tooltip></Button>
              </ButtonGroup>
            </div>
            <br />
            <Link to={"/viewer/" + this.state.project}>{this.state.project}</Link>
            <br />
            <div>
              <Button variant="contained" color="primary" id="finishRecording" disabled={this.state.disabled.complete} onClick={() => this.completeRecording()}>Finished Recording</Button>
              </div>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={this.state.recorded && !this.state.edited}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>2. Edit</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Viewer />
            <Button variant="contained" color="primary" id="completeEditing" onClick={() => this.completeEditing()}>Finished Editing</Button>
          </AccordionDetails>
        </Accordion>



        {/* <video controls muted id="video" autoPlay></video>
      <br></br> */}

        <Accordion expanded={this.state.edited}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>3. Upload</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <TextField label="Name your file" onChange={(evt) => { this.setState({ filename: evt.target.value }) }} />
              </div>
              <br/>
              <div>
              <Button variant="contained" color="primary" id="download" onClick={() => this.download()}>Download to Disk</Button>
              <Button variant="contained" color="primary" id="upload">Upload to YouTube</Button>
            </div>
          </AccordionDetails>
        </Accordion>
      </div >
    );
  }
}