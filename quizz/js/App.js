import React, {Component} from 'react';
//import logo from './logo.svg';
import './App.css';
import NavBar from './NavBar.js';
import QuizForm from './QuizForm';
import GameOver from './GameOver';


const questionData = [
  {title: "What is the capital of Italy?", type: "radio"},
  {title: "Which city is called finance capital of Italy?", type: "radio"},
  {title: "Which province is known for its Mafia?", type: "radio"},
  {title: "Which building is located in Rome?", type: "images"},
  {title: 'Which city is called "Floating city"?', type: "radio"}
];
const questionVariants = [
  [{title: "Berlin", value: "berlin"}, {title: "Moscow", value: "moscow"}, {title: "Rome", value: "rome"}],
  [{title: "Naples", value: "naples"}, {title: "Milan", value: "milan"}, {title: "Rome", value: "rome"}],
  [{title: "Lombardy", value: "lombardy"}, {title: "Tuscany", value: "tuscany"}, {title: "Sicily", value: "sicilia"}],
  [{src: "https://cdn.pixabay.com/photo/2015/03/26/09/49/colosseum-690384_960_720.jpg", value: "col"},
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Milan_Cathedral_from_Piazza_del_Duomo.jpg/798px-Milan_Cathedral_from_Piazza_del_Duomo.jpg",
      value: "duomo"
    },
    {
      src: "https://cache-graphicslib.viator.com/graphicslib/thumbs674x446/3092/SITours/billets-coupe-file-d-me-de-florence-avec-ascension-au-d-me-de-in-florence-118479.jpg",
      value: "p"
    },
    {src: "https://www.planetware.com/photos-large/I/italy-siena-duomo-and-visitors.jpg", value: "s"},
  ],
  [{title: "Palermo", value: "palermo"}, {title: "Genoa", value: "genoa"}, {title: "Venice", value: "venice"}],
];
const correctAnswers = [2, 1, 2, 0, 2];
const headerData = {};
const timeToAnswer = 20;
const questionsTotal = 5;
const success_sound = "success2.mp3";
const error_sound = "error.wav";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionsTotal: questionsTotal,
      index: 0,
      result: Array(questionsTotal).fill(null),
      currentQuestion: questionData[0],
      questionVariants: questionVariants[0],
      questionAnswered: false,
      correctAnswers: 0,
      gameOver: false,

    };
    this.handleAnswerClick = this.handleAnswerClick.bind(this);
    this.stop = this.stop.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.countdown = this.countdown.bind(this);
    this.gameOver = this.gameOver.bind(this);

  }

  handleAnswerClick(i) {
    if (this.state.questionAnswered) {
      return;
    }
    let questionProps = this.state.questionVariants.slice();
    if (i === correctAnswers[this.state.index]) {
      questionProps[i].answered = "btn-success";
      this.setState({correctAnswers: this.state.correctAnswers + 1});
      this.playSound(success_sound);
      // this.playSound(error_sound);
    } else {
      questionProps[i].answered = "btn-danger";
      this.playSound(error_sound);
    }
    this.setState({questionAnswered: true});
    this.setState({questionVariants: questionProps});
    this.questionResult();
  }

  questionResult() {
    var t = setInterval(() => {
      this.nextQuestion();
      clearInterval(t);
    }, 500);

  }

  gameOver() {
    this.stop();
    this.setState({gameOver: true});

  }

  nextQuestion() {
    const nextIndex = this.state.index + 1;

    if (nextIndex >= this.state.questionsTotal) {
      this.gameOver();
      return;
    }
    this.setState({index: nextIndex});
    this.setState({currentQuestion: questionData[nextIndex]});
    this.setState({questionVariants: questionVariants[nextIndex]});
    this.setState({questionAnswered: false});
  }

  componentDidMount() {
    this.setState({timeLeft: timeToAnswer});
    this.countdown();
  }

  countdown() {
    this.interval = setInterval(() => {
      const remaining = this.state.timeLeft - 1;
      //TODO: refactor
      if (remaining === 0) {
        this.gameOver();
      }
      this.setState({timeLeft: remaining});
      remaining > 0 ? this.setState({timeLeft: remaining}) : this.gameOver();
    }, 1000);
  }

  playSound(source) {
    const audio = new Audio(source);
    audio.play();
  }

  stop() {
    clearInterval(this.interval);
  }

  render() {
    if (this.state.gameOver) {
      return (
        <div className="">
          <NavBar data={headerData}/>
          <GameOver correctAnswers={this.state.correctAnswers}/>
        </div>
      );
    } else {
      return (
        <div>
          <NavBar data={headerData}/>
          <QuizForm data={this.state.currentQuestion} timeLeft={this.state.timeLeft}
                    variants={this.state.questionVariants} handleAnswerClick={this.handleAnswerClick}/>
        </div>
      );
    }

  }
}

export default App;
