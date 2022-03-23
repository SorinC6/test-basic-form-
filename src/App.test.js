import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

// beforeEach(() => {
//   console.log("CALLED BEFORE");
// });
// afterEach(() => {});
// beforeAll(() => {});
// beforeEach(() => {});

const typeIntoForm = ({ email, password, confirmPassword }) => {
  const emailInputElement = screen.getByLabelText("Email address");
  const passwordInputElement = screen.getByLabelText("Password");
  const confirmPasswordInputElement =
    screen.getByLabelText(/confirm passowrd/i);
  if (email) {
    userEvent.type(emailInputElement, email);
  }
  if (password) {
    userEvent.type(passwordInputElement, password);
  }
  if (confirmPassword) {
    userEvent.type(confirmPasswordInputElement, confirmPassword);
  }

  return {
    emailInputElement,
    passwordInputElement,
    confirmPasswordInputElement,
  };
};

const clickOnSubmitButton = () => {
  const submitBtnElement = screen.getByRole("button", { name: /submit/i });
  userEvent.click(submitBtnElement);
};

describe("APP component tests", () => {
  test("Inputs should be initially empty", () => {
    render(<App />);
    // const emailInputElement = screen.getByRole("textbox");
    const emailInputElement = screen.getByLabelText("Email address");
    const passwordInputElement = screen.getByLabelText("Password");
    const confirmPasswordInputElement =
      screen.getByLabelText(/confirm passowrd/i);

    expect(emailInputElement.value).toBe("");
    expect(passwordInputElement.value).toBe("");
    expect(confirmPasswordInputElement.value).toBe("");
  });

  test("should be able to type an email", () => {
    render(<App />);
    const { emailInputElement } = typeIntoForm({ email: "selena@gmail.com" });
    expect(emailInputElement.value).toBe("selena@gmail.com");
  });

  test("should be able to type a password", () => {
    render(<App />);
    const { passwordInputElement } = typeIntoForm({
      password: "password example",
    });

    expect(passwordInputElement.value).toBe("password example");
  });

  test("should be able to type confirm password", () => {
    render(<App />);
    const { confirmPasswordInputElement } = typeIntoForm({
      confirmPassword: "password example",
    });

    expect(confirmPasswordInputElement.value).toBe("password example");
  });

  test("should show email error message on invalid email", () => {
    render(<App />);

    expect(
      screen.queryByText(/the email you input is invalid/i)
    ).not.toBeInTheDocument();

    typeIntoForm({ email: "selenagmail.com" });

    clickOnSubmitButton();

    expect(
      screen.getByText(/the email you input is invalid/i)
    ).toBeInTheDocument();
  });

  test("should show passord error if password is less then 5 characters", () => {
    render(<App />);

    typeIntoForm({ email: "selena@gmail.com" });

    expect(
      screen.queryByText(
        /the password you enter should contain 5 or more characters/i
      )
    ).not.toBeInTheDocument();

    typeIntoForm({ password: "123" });
    clickOnSubmitButton();

    expect(
      screen.getByText(
        /the password you enter should contain 5 or more characters/i
      )
    ).toBeInTheDocument();
  });

  test("should show conform password error if passwords don't match", () => {
    render(<App />);

    const confirmedPasswordErrorElement = screen.queryByText(
      /passwords don't match. Try again/i
    );

    typeIntoForm({ email: "selena@gmail.com", password: "123456" });

    expect(confirmedPasswordErrorElement).not.toBeInTheDocument();

    typeIntoForm({ confirmPassword: "1234567" });

    clickOnSubmitButton();

    expect(
      screen.getByText(/passwords don't match. Try again/i)
    ).toBeInTheDocument();
  });

  test("should show no error message if all inputs are valid", () => {
    render(<App />);

    typeIntoForm({
      email: "selena@gmail.com",
      password: "123456",
      confirmPassword: "123456",
    });

    clickOnSubmitButton();

    expect(
      screen.queryByText(/the email you input is invalid/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/passwords don't match. Try again/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        /the password you enter should contain 5 or more characters/i
      )
    ).not.toBeInTheDocument();
  });
});
