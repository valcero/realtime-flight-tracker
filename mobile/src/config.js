import { Platform } from "react-native";

const getDefaultServerUrl = () => {
  if (Platform.OS === "android") {
    return "http://10.0.2.2:3000";
  }
  return "http://localhost:3000";
};

const SERVER_URL = getDefaultServerUrl();

export { SERVER_URL };
