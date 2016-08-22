#!/usr/bin/env osascript

on run pos
	tell application "iTunes"
		set player position to pos
		play
	end tell
end run