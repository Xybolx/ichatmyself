import axios from "axios";

export default {
  getUsers: function() {
    return axios.get("/api/users");
  },
  getPrivateMessages: function() {
    return axios.get("/api/privateMessages");
  },
  getUser: function(id) {
    return axios.get("api/users/" + id);
  },
    // Saves a user to the database
  signUp: function(userData) {
    return axios.post("/api/signup/", userData);
  },
  // Logs a user in
  logIn: function(loginData) {
    return axios.post("/api/login/", loginData);
  },
  // Logs a user out
  logOut: function(id) {
    return axios.get("/api/logout/", id);
  },
  savePrivateMessage: function(receiverData) {
    return axios.post("/api/privateMessages/", receiverData);
  }
}