const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    default: "User",
  },
  plans: {
    type: Array,
    required: true,
    default: [
      {
        id_destination: String,
        transportIds: Array,
        accommudationIds: Array,
        todoListId: String,
      },
    ],
  },
});

module.exports = Contact = mongoose.model("user", UserSchema);
