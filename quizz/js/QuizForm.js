import React, {Component} from 'react';

class QuizForm extends Component {


  render() {
    if (this.props.data.type === "images") {
      return (
        <main role="main" className="container">
          <div className="jumbotron">
            <h2>Images question {this.props.data.title}</h2>
            <h4>Time left: {this.props.timeLeft}</h4>

            {this.props.variants.map((item, i) =>
              <span key={i}>
                  <img src={item.src} className="img-fluid rounded mx-auto Image-question" alt="..." key={i}
                       value={item.value}
                       onClick={() => this.props.handleAnswerClick(i)}/>

                </span>
            )}
          </div>
        </main>
      );

    } else {
      return (
        <main role="main" className="container">
          <div className="">
            <h2>{this.props.data.title}</h2>
            <h4>Time left: {this.props.timeLeft}</h4>

            <form>
              {this.props.variants.map((item, i) =>
                <div className="quiz-Item" key={i}>
                  <button type="button" key={i} value={item.value}
                          onClick={() => this.props.handleAnswerClick(i)}
                          className={
                            item.answered ? 'btn btn-block ' + item.answered : 'btn btn-block btn-info'

                          }>{item.title} {item.answered}</button>
                </div>
              )}
            </form>
          </div>
        </main>
      );
    }
  }
}

export default QuizForm;