import React, {Component} from 'react';


class NavBar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-4">
        <a className="navbar-brand" href="/">Quizz</a>
        <div className="collapse navbar-collapse" id="navbarCollapse">
        </div>
      </nav>
    );
  }

}

export default NavBar;
