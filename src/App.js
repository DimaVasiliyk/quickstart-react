import React from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
//Explore more Monday React Components here: https://style.monday.com/
import AttentionBox from "monday-ui-react-core/dist/AttentionBox.js";

const monday = mondaySdk();

class App extends React.Component {
  constructor(props) {
    super(props);
    // Default state
    this.state = {
      settings: {},
      context:{},
      name: "",
      email:{},
      value: null,

    };
    this.LoginChange = this.LoginChange.bind(this);
    this.PasswordChange = this.PasswordChange.bind(this);
  }

  LoginChange(event) {
    this.setState({value: event.target.value});
  }

  PasswordChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    console.log('Отправленное имя: ' + this.state.value);
    event.preventDefault();
  }

  componentDidMount() {
    monday.listen("settings", (res) => {
      this.setState({ settings: res.data });
      monday
        .api(
          `query ($boardIds: [Int]) { boards (ids:$boardIds) { name items(limit:1) { name column_values { title text } } } }`,
          { variables: { boardIds: this.state.settings.boardIds } }
        )
        .then((res) => {
          this.setState({ boardData: res.data });
        });
    });

    monday.listen("context", (res) => {
      this.setState({ context: res.data });
      monday
        .api(
          `query ($boardIds: [Int]) { boards (ids:$boardIds) { name items(limit:1) { name column_values { title text } } } }`,
          { variables: { boardIds: this.state.context.boardIds } }
        )
        .then((res) => {
          this.setState({ boardData: res.data });
        });
    });


    monday.api(`query { me { email } }`).then(res => {
      this.setState({ email: res.data.me.email });
    });

    monday.listen("me", (res) => {
      this.setState({ me: res.data });
      console.log(res.data);
      monday
        .api(
          `query ($meIds: [Int]) { me (ids:$meIds)  { is_guest created_at name id} {email} }`,
          { variables: { meIds: this.state.me.meIds } }
        )
        .then((res) => {
          this.setState({ meData: res.data });
        });
    });
  }

  render() {
    return (
      <div
        className="App"
        style={{ background: this.state.settings.background }}
      >
        <form onSubmit={this.handleSubmit}>
        <label>
          Имя:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
          <input type="password" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Отправить" />
      </form>
      {/* {JSON.stringify(this.state.boardData, null, 2)} */}
        <AttentionBox
          title={this.state.settings.attentionBoxTitle || "Hello monday.apps"}
          text={
            this.state.settings.attentionBoxMessage ||
            "You should be able to edit the info that appears here using the fields you've set up previously in the View settings :) "
          }
          type={this.state.settings.attentionBoxType || "success"}
        />

        <br></br>
        {JSON.stringify(this.state.email, null, 2)}
        <div>
        </div>
      </div>
    );
  }
}

export default App;
