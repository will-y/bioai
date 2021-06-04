import './App.css';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Page from "./content/Page";


function App() {

  const pages = [
    {name: "Home", path: "/"},
    {name: "Cellular Automata", path: "/ca"},
    {name: "L System", path: "/l-system"},
    {name: "Biods", path: "/biods"}
  ]

  return (
      <div className="container">
        <Router>
          <Switch>
            <Route path="/ca">
              <Page pages={pages}>
                <p>ca</p>
              </Page>

            </Route>
            <Route path="/l-system">
              <Page pages={pages}>
                <p>L System</p>
              </Page>
            </Route>
            <Route path="/biods">
              <Page pages={pages}>
                <p>Biods</p>
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
