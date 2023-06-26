import { Notification } from "../types";

const Notify = (notification: Notification) => {
  if (!notification || !notification.message) {
    return null;
  }
  return (
    <p className="notification" style={notification.style}>
      {notification.message}
    </p>
  );
};

export default Notify;
