import React, { useState } from 'react';
import * as Tone from 'tone'
import logo from './logo.svg';
import './App.css';

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






class Square extends React.Component {
  render() {
    return (
      <button
        className="square"
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}

class SequencerSquare extends React.Component {
  render() {
    return (
      <button
        className={this.props.value ? 'Blacksquare' : 'square'}
        //className="square"
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}


class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: [null, null, null, null, null, null, null, null]
      //squares: Array(8).fill(null),
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = 'P';
    this.setState({ squares: squares });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const status = 'Sequencer';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
          {this.renderSquare(6)}
          {this.renderSquare(7)}
        </div>
      </div>
    );
  }
}





class MyComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
      squares: [false, false]
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.setState({ active: !this.state.active });
  }
  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = !this.state.squares[i];
    this.setState({ squares: squares });
  }
  renderSquare(i) {
    return (
      <SequencerSquare
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }
  render() {
    return (
      <div>
        <div className={this.state.active ? 'Blacksquare' : null}
          onClick={this.handleChange} >
          <p>2nd sequencer test</p>
        </div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}

        </div>
      </div>
    );
  }
}


export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sequencer: [1, 2, 3, 4],
    };
  }

  handleEvent = (event) => {
    if (event.type === "mousedown") {
      Tone.Transport.start()
    } else {
      osc.stop();
      Tone.Transport.stop()
    }
  }


  playSequence() {
    // create two monophonic synths
    const synthA = new Tone.FMSynth().toDestination();
    const synthB = new Tone.AMSynth().toDestination();
    //play a note every quarter-note
    const loopA = new Tone.Loop(time => {
      synthA.triggerAttackRelease("C2", "16n", time);
    }, "4n").start(0);
    //play another note every off quarter-note, by starting it "8n"
    const loopB = new Tone.Loop(time => {
      synthB.triggerAttackRelease("C4", "4n", time);
    }, "2n").start(0);
    // the loops start when the Transport is started
    Tone.Transport.start()
    // ramp up to 800 bpm over 10 seconds


  }



  playloop(sequencer) {
    const synth = new Tone.Synth().toDestination();
    const now = Tone.now()
    for (let i = 0; i < sequencer.length; i++) {
      if (sequencer[i] == 1) {
        console.log("triggered")
        synth.triggerAttackRelease("C4", "8n", now)
      }
      if (sequencer[i] == 2) {
        console.log("triggered")
        synth.triggerAttackRelease("C4", "8n", now + 0.5)
      } else {
        console.log("nothing")
      }

    }
  }


  render() {
    return (
      <div className="game">
        <div id='wrapper'>
          <button id='button' onClick={playsynth}>click me</button>
          <button id='button' onClick={() => this.playloop(this.state.sequencer)}>looper test</button>
          <button id='button' onClick={() => this.playSequence()}>Sequence Test</button>
          <button className="button" onMouseDown={this.handleEvent} onMouseUp={this.handleEvent} >Osc</button>
        </div>
        <div className="game-board">
          <Board />
          <MyComponent />
        </div>

      </div>
    );
  }
}

