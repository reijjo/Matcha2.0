import { Notification } from "./types";

const usernameCheck = (username: string) => {
  if (username.length < 3 || username.length > 30) {
    return {
      message: "Username must be between 3 - 30 characters.",
      style: { color: "red" },
      success: false,
    } as Notification;
  }
  if (!username.match(/^[a-zA-Z0-9!._\-@#*$]+$/)) {
    return {
      message:
        "Only letters (a-z or A-Z) and special characters (!._-@#*$) allowed in username.",
      style: { color: "red" },
      success: false,
    } as Notification;
  }
  return undefined;
};

const emailCheck = (email: string) => {
  if (!email.match(/^[A-Za-z0-9_!#$%&'*+/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/gm))
    return {
      message: "Shady email address.",
      style: { color: "red" },
      success: false,
    } as Notification;

  if (email.length > 60) {
    return {
      message: `Max 60 characters on email.`,
      style: { color: "red" },
      success: false,
    } as Notification;
  }
  return undefined;
};

const firstCheck = (firstname: string) => {
  if (firstname.length < 2 || firstname.length > 15) {
    return {
      message: "2 - 15 characters in First Name.",
      style: { color: "red" },
      success: false,
    } as Notification;
  }
  if (!firstname.match(/^[a-zA-Z-]+$/)) {
    return {
      message: 'Only letters and "-" allowed in First Name.',
      style: { color: "red" },
      success: false,
    } as Notification;
  }
  return undefined;
};

const lastCheck = (lastname: string) => {
  if (lastname.length < 2 || lastname.length > 30) {
    return {
      message: "2 - 30 characters in Last Name.",
      style: { color: "red" },
      success: false,
    } as Notification;
  }
  if (!lastname.match(/^[a-zA-Z-]+$/)) {
    return {
      message: 'Only letters and "-" allowed in Last Name.',
      style: { color: "red" },
      success: false,
    } as Notification;
  }
  return undefined;
};

const ageCheck = (date: string) => {
  const age = new Date(date);
  const enuffAge = new Date();

  enuffAge.setFullYear(enuffAge.getFullYear() - 18);
  if (age > enuffAge) {
    return {
      message: "K-18 (You must be 18+ years old.)",
      style: { color: "red" },
      success: false,
    } as Notification;
  }
  return undefined;
};

const passwdCheck = (passwd: string) => {
  if (passwd.length < 8 || passwd.length > 30) {
    return {
      message: "Password length must be 8 - 30 characters.",
      style: { color: "red" },
      success: false,
    } as Notification;
  }

  if (!/\d/.test(passwd)) {
    return {
      message: "Password must contain at least one number.",
      style: { color: "red" },
      success: false,
    } as Notification;
  }

  if (!/[A-Z]/.test(passwd)) {
    return {
      message: "Password must contain at least one Uppercase letter.",
      style: { color: "red" },
      success: false,
    } as Notification;
  }

  if (!/[!._\-@#*$]/.test(passwd)) {
    return {
      message:
        "Password must contain at least one special character (!._-@#*$).",
      style: { color: "red" },
      success: false,
    } as Notification;
  }

  return undefined;
};

const checks = {
  usernameCheck,
  emailCheck,
  firstCheck,
  lastCheck,
  ageCheck,
  passwdCheck,
};

export default checks;
