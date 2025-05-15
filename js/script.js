let currentSong = new Audio();
let songs;
let currFolder;

function formatTime(seconds) {

    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }

    // Round down to the nearest whole second
    const roundedSeconds = Math.floor(seconds);

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(roundedSeconds / 60);
    const remainingSeconds = roundedSeconds % 60;

    // Pad with leading zeros if needed
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return the formatted time
    return `${paddedMinutes}:${paddedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/`);
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            // Correctly extract the song name
            songs.push(decodeURIComponent(element.href.split(`/${folder}/`)[1]));
        }
    }

    // Show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];

    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML += `<li>
            <img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${String(song).replaceAll("%20", " ").replace(',', '').replace('.mp3', '')}</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div>
        </li>`;
    }

    // Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            let trackName = e.querySelector(".info").firstElementChild.innerHTML.trim();
            playMusic(trackName + ".mp3"); // Ensure the .mp3 extension is added back when playing
        });
    });

    return songs;


}

const playMusic = (track, pause = false) => {
    if (!track) return; // Exit if no track is provided

    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {
        currentSong.play().catch(error => {
            console.error("Error playing the song:", error);
        });

        play.src = "img/pause.svg";
    } else {
        play.src = "img/play.svg";  // Show play icon when stopped
    }

    // Update the song info only if a track is provided
    document.querySelector(".songinfo").innerHTML = track ? track.replace('.mp3', '') : "";
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};


async function displayAlbums() {
    let a = await fetch(`/songs/`);
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            // Getting metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`);
            let response = await a.json();

            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                                fill="#000000">
                                <path
                                    d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                    stroke="#000000" stroke-width="1.5" stroke-linejoin="round" fill="#000000" />
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }
    }

    // Load the playlist whenever a card is clicked (i.e., when changing folders)
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0]);
            // Automatically play the first song of the new folder
        });
    });
}

async function main() {
    // Set the initial volume to 70%
    currentSong.volume = 0.6;

    // Update the volume slider to match the initial volume
    document.querySelector(".range").getElementsByTagName("input")[0].value = 60;

    // Get the list of all the songs
    await getSongs("songs/hero");
    playMusic(songs[0], true)

    // Displaying all the albums on the page
    displayAlbums()

    // Attach an event listner to play, next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })

    // Add an event listener to seebar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"

        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    // Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%"
    })

    // Adding event listner for previous and next
    previous.addEventListener("click", () => {
        console.log("Previous clicked");
        let currentFileName = decodeURIComponent(currentSong.src.split("/").pop());

        // Find the index in the songs array
        let index = songs.indexOf(currentFileName);

        if (index !== -1 && index > 0) {
            playMusic(songs[index - 1]);
        }
    });

    next.addEventListener("click", () => {
        console.log("Next clicked");
        let currentFileName = decodeURIComponent(currentSong.src.split("/").pop());

        let index = songs.indexOf(currentFileName);

        if (index !== -1 && index < songs.length - 1) {
            playMusic(songs[index + 1]);
        }
    });


    // Adding an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume > 0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("volume.svg", "mute.svg");
        }
    })

    // Adding event listener to mute the track
    let previousVolume = currentSong.volume; // Store the initial volume

    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            // Save the current volume before muting
            previousVolume = currentSong.volume;
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0; // Mute the sound
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0; // Update the volume slider
        } else if (e.target.src.includes("mute.svg")) {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = previousVolume; // Restore the previous volume
            document.querySelector(".range").getElementsByTagName("input")[0].value = previousVolume * 100; // Update the slider to the previous value
        }
    });

}

main();