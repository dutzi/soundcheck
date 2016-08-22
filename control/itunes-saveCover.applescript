#!/usr/bin/env osascript

on run path
	tell application "iTunes"
		if player state is playing then

			tell artwork 1 of current track
				set artData to raw data
			end tell

			-- (((path to home folder) as text) & "Documents:soundcheck:currentPlayingCover.png")
			set deskFile to open for access file path with write permission
			set eof deskFile to 0
			write artData to deskFile
			close access deskFile

		end if

	end tell
end run
