const mongoose = require("mongoose");

/*
from https://github.com/HackerNews/API

Field	     Description

id	         The item's unique id.
deleted	     true if the item is deleted.
type	     The type of item. One of "job", "story", "comment", "poll", or "pollopt".
by	         The username of the item's author.
time	     Creation date of the item, in Unix Time.
text	     The comment, story or poll text. HTML.
dead	     true if the item is dead.
parent	     The comment's parent: either another comment or the relevant story.
poll	     The pollopt's associated poll.
kids	     The ids of the item's comments, in ranked display order.
url	         The URL of the story.
score	     The story's score, or the votes for a pollopt.
title	     The title of the story, poll or job. HTML.
parts	     A list of related pollopts, in display order.
descendants	 In the case of stories or polls, the total comment count.
*/
const storySchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    by: {
      type: String,
    },
    time: {
      type: Number,
      required: true,
    },
    text: {
      type: String,
      trim: true,
    },
    dead: {
      type: Boolean,
      default: false,
    },
    kids: [
      {
        type: Number,
      },
    ],
    url: {
      type: String,
      trim: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      trim: true,
    },
    descendants: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Story = new mongoose.model("Story", storySchema);

module.exports = Story;
