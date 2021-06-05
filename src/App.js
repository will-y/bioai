import './App.css';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Page from "./content/Page";
import CA from "./content/ca-1d/CA";
import GameOfLife from "./content/game-of-life/GameOfLife";
import Maze from "./content/maze/Maze";
import Boids from "./content/boids/Boids";


function App() {

  const pages = [
    {name: "Home", path: "/"},
    {name: "1D Cellular Automata", path: "/ca-1d"},
    {name: "Game of Life", path: "/game-of-life"},
    {name: "Maze-Solver", path: "/maze"},
    {name: "L System", path: "/l-system"},
    {name: "Biods", path: "/biods"}
  ]

  return (
      <div className="container">
        <Router>
          <Switch>
            <Route path="/ca-1d">
              <Page pages={pages}>
                <CA />
              </Page>
            </Route>
            <Route path="/game-of-life">
              <Page pages={pages}>
                <GameOfLife />
              </Page>
            </Route>
            <Route path="/maze">
              <Page pages={pages}>
                <Maze />
              </Page>
            </Route>
            <Route path="/l-system">
              <Page pages={pages}>
                <p>L System</p>
              </Page>
            </Route>
            <Route path="/biods">
              <Page pages={pages}>
                <Boids />
              </Page>
            </Route>
            <Route path="/">
              <Page pages={pages}>
                <p>Home</p>
              </Page>
            </Route>
          </Switch>
        </Router>
      </div>
  );
}

export default App;
