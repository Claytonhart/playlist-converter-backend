const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Playlist Model
const Playlist = require("../../models/Playlist");
// Load User Model
const User = require("../../models/User");

// Validation
const validatePlaylistInput = require("../../validation/playlist");

// @route   GET api/playlists/test
// @desc    Tests playlists route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Playlists Works" }));

// @route   GET api/playlists
// @desc    Get playlists
// @access  Public
router.get("/", (req, res) => {
  // Find all playlists, sort by most recent, then return the list
  Playlist.find()
    .sort({ date: -1 })
    .then(playlists => res.json(playlists))
    .catch(err =>
      res.status(404).json({ noplaylistsfound: "No playlists found" })
    );
});

// @route   POST api/playlists
// @desc    Create playlist
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePlaylistInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    const newPlaylist = new Playlist({
      name: req.body.name,
      platform: req.body.platform,
      url: req.body.url,
      user: req.user.id
    });

    newPlaylist.save().then(playlist => res.json(playlist));
  }
);

// @route   GET api/playlists/user
// @desc    Get playlists by currently logged in user
// @access  Private
router.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Find all playlists from a user
    Playlist.find({ user: req.user })
      .then(playlist => res.json(playlist))
      .catch(err =>
        res.status(404).json({ noplaylistfound: "This user has no playlists" })
      );
  }
);

// @route   DELETE api/playlists/:id
// @desc    Delete playlist by id
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Profile.findOne({ user: req.user.id }).then(profile => {
    Playlist.findById(req.params.id)
      .then(playlist => {
        // Check for playlist owner
        if (playlist.user.toString() !== req.user.id) {
          return res.status(401).json({ notauthorized: "User not authorized" });
        }

        // Delete
        playlist.remove().then(() => res.json({ success: true }));
      })
      .catch(err =>
        res.status(404).json({ playlistnotfound: "No playlist found" })
      );
    // });
  }
);

module.exports = router;
