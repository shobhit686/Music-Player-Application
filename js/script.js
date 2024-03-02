let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder + "/"
    console.log(currFolder)
    let a = await fetch(`http://127.0.0.1:3000/Spotify-clone/${folder}`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    return songs;
}

const playMusic = (track, pause=false)=>{
    currentSong.src = `http://127.0.0.1:3000/Spotify-clone/${currFolder}` + track;
    console.log(currentSong.src)
    if(!pause){
        currentSong.play()
        play.src = "assets/images/pause.svg"
    }
    document.querySelector(".song-info").innerHTML = decodeURI(track)
    document.querySelector(".song-duration").innerHTML = "00:00/00:00"
}

async function main() {
    songs = await getSongs("songs/ncs");
    playMusic(songs[0], true)
    console.log(songs);

    let songUL = document.querySelector(".song-list").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
        <img class="invert" src="assets/images/music.svg" alt="music icon">
        <div class="info">
            <div> ${song.replaceAll("%20", " ")}</div>
            <div> Artist </div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img class="invert" src="assets/images/play.svg" alt="play btn">
        </div>
    </li>`;
    }
    console.log(songUL)

    let audio = new Audio(songs[0]);

    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML.trim())
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    });

    //Attach event listener to play, pause, prev and next from buttons
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "assets/images/pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "assets/images/play.svg"
        }
    })

    //Timeupdate listener
    currentSong.addEventListener("timeupdate", ()=>{
  
        document.querySelector(".song-duration").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%";
    })

    //Seekbar control listener
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = (currentSong.duration*percent)/100
    })

    //Listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = 0;
    })
    
    //Listener for close button
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-120%";
    })

    //Listener for prev button
    previous.addEventListener("click", ()=>{
        let index = songs.indexOf(currentSong.src.split("/ncs/").slice(-1)[0])
        if((index-1)>=0)
            playMusic(songs[index-1])
    })

    //Listener for next button
    next.addEventListener("click", ()=>{
        let index = songs.indexOf(currentSong.src.split("/ncs/").slice(-1)[0])
        if((index+1)< songs.length)
            playMusic(songs[index+1])
    })
}

main()