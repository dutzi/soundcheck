require('colors')
var itunes = require('./control/index.js')
var prompt = require('prompt')
var q = require('q')
var jsonfile = require('jsonfile')
var exists = require('fs-exists-sync')

prompt.message = ''
prompt.delimiter = ''

var BEEP = 'Soundcheck Beep'

var data, filename

function saveData() {
	jsonfile.writeFileSync(filename, data, { spaces: 4 })
}

function play({ songName, position, duration }) {
	var deferred = q.defer()
	var gotScore, timeout

	if (songName !== BEEP) {
		setTimeout(() => {
			var filename = songName
				.replace(/'/g, '')
				.replace(/ /g, '-');

			itunes.saveCover(`Users:dutzi:Documents:soundcheck:covers:${filename}.png`);
		}, 1000);
	}

	function onPlaybackComplete() {
		clearTimeout(timeout)

		if (songName === BEEP) {
			deferred.resolve()
		} else {
			play({
				songName: BEEP,
				duration: 3,
				noBeep: true,
			}).then(() => {
				gotScore.promise.then(() => {
					deferred.resolve()
				})
			})
		}
	}

	if (songName !== BEEP) {
		console.log(`\nPlaying "${songName}"`.bold + ` (${duration}s)`.grey)

		gotScore = q.defer()

		prompt.get({
			name: 'score',
			message: 'Describe:'
		}, function (err, result) {
			gotScore.resolve()
			didGetScore = true

			data.results.push({
				songName: songName,
				score: result.score
			})
			saveData()
		})
	}

	itunes.search(songName, function (results) {
		itunes.play(results[0].id)

		if (position) {
			setTimeout(() => {
				itunes.seek(position)
			}, 10)
		}

		if (duration) {
			timeout = setTimeout(onPlaybackComplete, duration * 1000)
		}
	})

	return deferred.promise
}

function startPlaying() {
	itunes.stop()

	return play({
		songName: 'You\'re Everything',
		position: 24,
		// duration: 36,
		duration: 4,
	}).then(play.bind(this, {
		songName: 'Michael, Michael, Michael',
		position: 0,
		duration: 15,
	})).then(play.bind(this, {
		songName: 'Robot Rock , Oh Yeah',
		position: 130,
		duration: 30,
	})).then(play.bind(this, {
		songName: 'Hey, That\'s No Way to Say Goodbye',
		position: 0,
		duration: 30,
	})).then(play.bind(this, {
		songName: 'The Game of Love',
		position: 0,
		duration: 30,
	})).then(play.bind(this, {
		songName: 'Dancing With Tears In My Eyes',
		position: 0,
		duration: 30,
	})).then(play.bind(this, {
		songName: 'Sir Duke',
		position: 0,
		duration: 30,
	})).then(play.bind(this, {
		songName: 'אהבה חדשה',
		position: 0,
		duration: 30,
	}))
}

function gotModelName(model) {
	filename = (() => {
		var num = 0
		while (exists(`./data/data${num}.json`)) {
			num++
		}
		return `./data/data${num}.json`
	})()

	data = {
		model: model,
		results: []
	}

	startPlaying().then(() => {
		console.log('Results:')
		console.log(JSON.stringify(data, true, 4))
	})
}

gotModelName('model')
// prompt.get({
// 	name: 'model',
// 	message: 'Enter Model Name:'
// }, function (err, result) {
// 	gotModelName(result.model)
// })