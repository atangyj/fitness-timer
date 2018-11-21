import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const defaultSetting = {
  session_length: 25,
  break_length: 5
};



function SessionSetting(props){
  return(
    <div className="container-session">
      <div id="session-label">Session Length</div>
      <i className="material-icons" onClick={props.pressIncrement}>add</i>
      <span id="session-length">{props.session_length}</span>
      <i className="material-icons" onClick={props.pressDecrement}>remove</i>
    </div>
  )
}

function BreakSetting(props){
  return(
    <div className="container-break">
      <div id="break-label">Break Length</div>
      <i className="material-icons" onClick={props.pressIncrement}>add</i>
      <span id="break-length">{props.break_length}</span>
      <i className="material-icons" onClick={props.pressDecrement}>remove</i>
    </div>
  )
}

function TimerDisplay(props){
  return(
    <div className="time-display">
      <div id="time-label">{props.isSession? "Session":"Break"}</div>
      <span id="time-left">{props.time_left}</span>
    </div>
  )
}

function PlayControl(props){
  return <i className="material-icons play" onClick={props.onClick}>{props.isPause?"play_circle_outline":"stop"}</i>;
}

function ResetControl(props){
  return <i className="material-icons reset" onClick={props.onClick}>replay</i>;
}


class Counter extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      session_length: defaultSetting.session_length,
      break_length: defaultSetting.break_length,
      isSession: true,
      isPause: true,
      time_left: defaultSetting.session_length * 60,
      input: null,
    };
    this.renderMinSec = this.renderMinSec.bind(this);
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    this.countdown = this.countdown.bind(this);
    this.pause = this.pause.bind(this);
    this.reset = this.reset.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  renderMinSec(){
    let min = Math.floor(this.state.time_left / 60);
    let second = this.state.time_left % 60;
    min = min < 10 ? '0'+ min : min;
    second = Math.floor(second / 10)? second : '0' + second % 10;
    return `${min}:${second}`;
  }

  handleInput(e){
    this.setState({input: e.target.value});
  }

  increment(session_break){
    if(this.state.isPause){
      if(session_break==="session"){
        if(this.state.session_length <60){
          this.setState({
            session_length: this.state.session_length + 1,
            time_left: this.state.isSession? this.state.session_length*60 + 60: this.state.time_left
          })
        }

      } else {
        if(this.state.break_length < 60){
          this.setState({
            break_length: this.state.break_length + 1,
            time_left: this.state.isSession? this.state.time_left: this.state.break_length*60 + 60
          })
        }
      }
    }

  }

  decrement(session_break){
    if(this.state.isPause){
      if(session_break==="session"){
        if(this.state.session_length > 1){
          this.setState({
            session_length: this.state.session_length - 1,
            time_left: this.state.isSession? this.state.session_length*60 - 60: this.state.time_left
          })
        }

      } else {
        if(this.state.break_length > 1){
          this.setState({
            break_length: this.state.break_length - 1,
            time_left: this.state.isSession? this.state.time_left: this.state.break_length*60 - 60
          })
        }
      }
    }
  }


  countdown(){
    this.setState({isPause: false});
    let id = setInterval(timer.bind(this), 1000);
    function timer(){
      if(this.state.isPause){
        clearInterval(id);

      } else if(this.state.time_left === 0) {
        if(this.state.isSession){
          this.setState({
            time_left: this.state.break_length * 60,
            isSession: false
          });
        } else {
          this.setState({
            time_left: this.state.session_length * 60,
            isSession: true
            });
        }
      } else {
        this.setState({time_left: this.state.time_left - 1});
      }
    }
  }

  pause(){
    this.setState({isPause: true});
  }

  reset(){
    this.setState({
      session_length: defaultSetting.session_length,
      break_length: defaultSetting.break_length,
      time_left: defaultSetting.session_length * 60
    })
  }


  render(){
    return(
      <div className="container">

        <input type="text" placeholder="What's your goal?" onChange={this.handleInput}/>

        <div className="container-display">
            <TimerDisplay time_left={this.renderMinSec()} isSession={this.state.isSession}/>
        </div>

        <div className="container-control">
            <PlayControl isPause={this.state.isPause} onClick={this.state.isPause?this.countdown:this.pause}/>
            <ResetControl onClick={this.reset}/>
        </div>

        <div className="container-settings">
          <SessionSetting session_length={this.state.session_length} pressIncrement={()=>this.increment('session')} pressDecrement={()=>this.decrement('session')}/>
          <BreakSetting break_length={this.state.break_length} pressIncrement={()=>this.increment('break')} pressDecrement={()=>this.decrement('break')} />
        </div>
      </div>
    )
  }
}

class App extends React.Component {
  render(){
    return(
      <div>
        <h1>WORKOUT POMODORO</h1>
        <div className="container-outer">
          <Counter />
          <Counter />
          <Counter />
          <Counter />
        </div>
      </div>
    )
  }
}


ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
