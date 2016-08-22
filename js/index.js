var Main = React.createClass({
	getInitialState() {
		return {
			files: [],
			models: [],
		}
	},

	componentDidMount() {
		fetch('./data/data0.json').then(res => res.json()).then(res => {
			console.log(res);
		});
		fetch('./data').then(res => res.text()).then(res => {
			let files = res.match(/href="(.*?)"/g);
			files = files
				.map(file => file.slice(6, -1))
				.filter(file => !file.startsWith('.'));

			files.forEach(file => {
				fetch('./data/' + file).then(res => res.json()).then(res => {
					this.state.models.push(res);
					this.setState({
						models: this.state.models
					});
				});
			});

			this.setState({
				files: files
			});
		});
	},

	getFilename(songName) {
		return songName
			.replace(/'/g, '')
			.replace(/ /g, '-');
	},

	render() {
		return <div>
			{this.state.models.map((file, idx) => (
				<div className='model' key={idx}>
					<h2 className='model-name'>{file.model}</h2>
					<div className='songList'>
						{file.results.map((song, idx) => (
							<div key={idx} className='song'>
								<img src={`covers/${this.getFilename(song.songName)}.png`}/>
								<h4 className='song-name'>{song.songName}</h4>
								<p className='song-score'>{song.score}</p>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	}
})
Main

ReactDOM.render(
    <Main/>,
	document.querySelector('.mainDiv'));

