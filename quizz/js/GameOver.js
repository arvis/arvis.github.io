import React, {Component} from 'react';

class GameOver extends Component {


  render() {
    return (
      <main role="main" className="container">
        <div className="">
          <h2>Game Over</h2>
          <h3>Correct answers {this.props.correctAnswers} </h3>
        </div>
      </main>
    );
  }
}

export default GameOver;