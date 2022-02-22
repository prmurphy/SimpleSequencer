import React, { useState } from 'react';
import * as Tone from 'tone'
import logo from './logo.svg';
import './App.css';
import { setLogger } from 'tone/build/esm/core/util/Debug';

const synthA = new Tone.FMSynth().toDestination();
const synth = new Tone.Synth().toDestination();

const osc = new Tone.Oscillator({
  type: "square",
  frequency: 440,
  volume: -16
}).toDestination();

function playsynth() {
  synth.triggerAttackRelease("C2", "8n");
  Tone.Transport.start()
}



class SequencerSquare extends React.Component {
  render() {
    return (
      <button
        className={this.props.value ? 'square black' : 'square'}
        //className="square"
        onClick={() => this.props.onClick()}
      >
      </button>
    );
  }
}
class VisualizerSquare extends React.Component {
  render() {
    let button = "test";
    if (this.props.beat == this.props.value) {
      console.log(this.props.beat)
      button = <button
        className='visualizerActive'
      ></button>
    }
    else {
      button = <button
        className='Visualizer'
      ></button>
    }
    return (
      button
    );
  }
}

//moving swaures array up to sequencer
class MyComponent extends React.Component {
  renderSquare(i) {
    return (
      <SequencerSquare
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  renderVisualizerSquare(i) {
    return (
      <VisualizerSquare
        beat={this.props.beat}
        value={this.props.sequencer[i]}
        activeVisulaizer={this.props.activeVisulaizer}
        onClick={() => this.props.onClick(i)}
        sequencer={this.props.sequencer[i]}
      />
    );
  }
  render() {
    return (
      <div>
        <div>
          <h>Simple Sequencer</h>
        </div>
        <div class="container">

          {this.renderVisualizerSquare(0)}
          {this.renderVisualizerSquare(1)}
          {this.renderVisualizerSquare(2)}
          {this.renderVisualizerSquare(3)}


          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
            {this.renderSquare(3)}
          </div>
        </div>

      </div >
    );
  }
}


export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      beat: 0,
      sequencer: [1, 2, 3, 4],
      squares: [false, false, false, false],
      a: false,
      MyArray: ["G2", ["E4", "D4", "E4"], "G4", ["A4", "G4"]],
      SequencerOn: false,
      synthA: new Tone.Synth().toDestination(),
      myArray: ["C4", "C4"],
      startStop:"start"

    };
    this.handleChange = this.handleChange.bind(this);

  }
  handleChange(event) {
    this.setState({ active: !this.state.active });
  }

  changeNote(event) {
    console.log("event triggered");
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = !this.state.squares[i];
    this.setState({ squares: squares });
  }

  changeSequencerOnOff(myArray) {
    if (this.state.startStop == "start"){
      this.setState((state) => {
        this.state.startStop="stop"        
        return {state: state}
      });
    }

    else{
      this.setState((state) => {
        this.state.startStop="start"
        return {state: state}
      });
    }
    const sequencerOnOff = !this.state.SequencerOn;
    this.setState({ SequencerOn: sequencerOnOff })
    this.playloop()
  }

  playloop() {
    
    let myArray = ["G4"]
    const synth = new Tone.Synth().toDestination();   
    if (this.state.squares[0] == false){
      myArray[0] = 0
    } else {
      myArray[0] = "C4"
    }
    
    if (this.state.squares[1] == false){
      myArray[1] = 0
    } else {
      myArray[1] = "C4"
    }

    if (this.state.squares[2] == false){
      myArray[2] = 0
    } else {
      myArray[2] = "G4"
    }

    if (this.state.squares[3] == false){
      myArray[3] = 0
    } else {
      myArray[3] = "G4"
    }

    if (this.state.SequencerOn == false) {
      
      const seq = new Tone.Sequence((time, note) => {
        if (this.state.beat < 4){
        this.state.beat = this.state.beat + 1
        } else{
          this.state.beat = 1
        }
        this.setState((state) => {          
          return {state: state}
        });

        console.log(this.state.beat)
        console.log("tick")
        synth.triggerAttackRelease(note, 0.1, time);      
      }, myArray).start(0);
      
      console.log(myArray)
      Tone.Transport.start();
    } else {
      Tone.Transport.stop()
      Tone.Transport.cancel()
      this.state.beat = 0
      this.setState((state) => {
        // Important: read `state` instead of `this.state` when updating.
      return {state: state}
      });
    }
  }

  render() {
    return (
      <div className="game">
        <div id='wrapper'>
          <button id='button' onClick={() => this.changeSequencerOnOff()}>{this.state.startStop}</button>
        </div>
        <div className="game-board">
          <MyComponent
            activeVisulaizer={this.state.activeVisulaizer}
            squares={this.state.squares}
            onClick={(i) => this.handleClick(i)}
            beat={this.state.beat}
            sequencer={this.state.sequencer}
          />
          <div>
            <p>Note: you must stop/then start the sequencer to hear your changes</p>
          </div>
        </div>

      </div>
    );
  }
}

