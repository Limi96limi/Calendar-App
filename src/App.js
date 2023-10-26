import { BrowserRouter } from "react-router-dom";
import { QueryParamsCalendarController } from "./QueryParamsCalendarController";
import "./App.css";
import axios from "axios";

function App() {
  axios
    .get(
      "https://api.github.com/repos/testing-library/react-testing-library/commits"
    )
    .then((response) => {
      console.log(response.data);
    });
  return (
    <BrowserRouter>
      <QueryParamsCalendarController />
    </BrowserRouter>
  );
}

export default App;