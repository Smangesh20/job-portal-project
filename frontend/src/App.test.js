import { render, screen } from "@testing-library/react";

jest.mock("./component/Signup", () => () => <div>Signup</div>);
jest.mock("./component/recruiter/Profile", () => () => <div>Recruiter Profile</div>);

import App from "./App";
import { NotificationProvider } from "./lib/NotificationContext";

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("renders app shell and welcome route", () => {
    render(
      <NotificationProvider>
        <App />
      </NotificationProvider>
    );

    expect(screen.getByText(/^job portal$/i)).toBeInTheDocument();
    expect(screen.getByText(/^welcome to job portal$/i)).toBeInTheDocument();
  });
});
