// buttons
const favBtn = document.querySelector(".fav-btn"),
    heartIcon = document.querySelector(".heart-icon"),
    playBtn = document.querySelector(".play-btn"),
    listBtn = document.querySelector(".list-btn"),
    musicList = document.querySelector(".music-list"),
    forwardBtn = document.querySelector(".forwardBtn"),
    backwardBtn = document.querySelector(".backwardBtn"),
    currentMusicTime = document.querySelector(".current-time"),
    endTime = document.querySelector(".end-time"),
    volumeBtn = document.querySelector(".volume"),
    bgMusic = document.querySelector(".bg-music"),
    currentMusicTitle = document.querySelector(".music-description .title"),
    currentMusicArtist = document.querySelector(".music-description .artist"),
    timeline = document.querySelector(".timeline"),
    nextMusicBtn = document.querySelector(".skip-next"),
    prevMusicBtn = document.querySelector(".skip-previous"),
    isListEmpty = false


let copyData;
let IdCurrentMusic;
let currentMusic = document.createElement("audio")
currentMusic.className = "current-music"
bgMusic.appendChild(currentMusic)

let isPaused = false,
    isMute = false

const pop = [
    { transform: 'scale(1)' },
    { transform: 'scale(1.2)' },
    { transform: 'scale(1)' }
]

const popTiming = {
    duration: 200,
}

// fill music list with musics
fetch('link here')
    /*
    -link could be json file link that contains object for every music
    -and the object contains keys like that : 
    [
        {
            "id": "1",
            "title": "mysuc title",
            "artist": "music artist",
            "isFavorite": false,
            "url": "music link"
        },
    ]
    */
    .then(response => response.json())
    .then(data => {
        copyData = data

        let title,
            artist;

        for (let i = 0; i < data.length; i++) {

            if (data[i].title.length > 20) {
                title = data[i].title.split('')
                title.length = 14
                title = title.join('')
                title += '...'
            } else {
                title = data[i].title
            }

            if (data[i].artist.length > 20) {
                artist = data[i].artist
                artist.length = 16
                artist += '...'
            } else {
                artist = data[i].artist
            }

            let musicItem = document.createElement('div')
            musicItem.classList.add("music-item")
            musicItem.id = i + 1

            let musicImg = document.createElement('div')
            musicImg.classList.add("music-img")
            musicImg.innerHTML = '<i class="fas fa-headphones"></i>'

            let musicText = document.createElement('div')
            musicText.classList.add("music-text")
            musicText.innerHTML = `<h4>${title}</h4>
                                    <p>${artist}</p>`

            let favMusic = document.createElement('div')
            favMusic.classList.add("fav-music")
            favMusic.innerHTML = `<span id="icon" class="material-symbols-outlined fav-music-btn">favorite</span>`

            musicItem.appendChild(musicImg)
            musicItem.appendChild(musicText)
            musicItem.appendChild(favMusic)

            musicList.appendChild(musicItem)
        }

        let musicItems = Array.from(musicList.children)

        // to select which music to listen & to make a music favorite
        musicItems.forEach(musicItem => {
            // let data = copyData
            musicItem.addEventListener("click", (event) => {
                if (event.target.classList.contains('fav-music-btn')) {
                    event.target.animate(pop, popTiming)
                    event.target.classList.toggle('active')
                } else {
                    selectMusic(data, musicItem, musicItems)
                }
            })
        })

        nextMusicBtn.onclick = (event) => {
            toNextOrPreviousMusic(data, musicItems, event)
        }

        prevMusicBtn.onclick = (event) => {
            toNextOrPreviousMusic(data, musicItems, event)
        }
    })
    .catch(error => {
        document.querySelector('.empty').style.display = 'block'
        throw new Error('list is empty or something else is wrong')
    });

// to make a music favorite
favBtn.onclick = () => {
    favBtn.classList.toggle("active")
    heartIcon.animate(pop, popTiming)
    heartIcon.classList.toggle("active")
};

// to display music list
listBtn.onclick = () => {
    favBtn.classList.toggle("hide");
    musicList.classList.toggle("open");
}

// to play a music
playBtn.onclick = () => {
    if (currentMusic.currentSrc !== '') {
        if (currentMusic.paused) {
            currentMusic.play()
            playBtn.textContent = "pause"

        } else {
            currentMusic.pause()
            playBtn.textContent = "play_arrow"
        }
    }
}

// to make volume up / off
volumeBtn.onclick = () => {
    if (currentMusic.muted) {
        currentMusic.muted = false
        volumeBtn.textContent = "volume_up"
    } else {
        currentMusic.muted = true
        volumeBtn.textContent = "volume_off"
    }
}

// to move 10 seconds forward
forwardBtn.onclick = () => {
    if (currentMusic.currentTime + 10 < currentMusic.duration) {
        currentMusic.currentTime += 10
    } else {
        currentMusic.currentTime = currentMusic.duration
    }

    if (currentMusic.paused) {
        setCurrentTime()
    }

    checker()
}

// to move 10 seconds backward
backwardBtn.onclick = () => {
    if (currentMusic.currentTime - 10 > 0) {
        currentMusic.currentTime -= 10
    } else {
        currentMusic.currentTime = 0
    }

    if (currentMusic.paused) {
        setCurrentTime()
    }

    checker()
}

// to check duration and current time of music
function checker() {
    setDuration()
    setCurrentTime()
    setInterval(() => {
        if (!currentMusic.paused) {
            setCurrentTime()
        }

        if (currentMusic.ended) {
            shuffle(copyData)
        }
    }, 1000);

}

// to get a rundom number
function randomNum(limitNum) {
    return Math.floor(Math.random() * limitNum)
}

// to choose a music randomly when the last music ended
function shuffle(data) {
    let musicItems = Array.from(musicList.children)
    let randomMusic = randomNum(musicItems.length)
    let musicItem = data[randomMusic]

    musicItems.forEach(item => {
        item.classList.remove('selected')
    })
    musicItems[randomMusic].classList.add('selected')

    setMusicProperty(randomMusic, data)

    setTimeout(() => {
        checker()
        playBtn.textContent = "pause"

    }, 1000);
}

// to set current time
function setCurrentTime() {
    let timelinePlayed = document.querySelector('.played')

    let timePlayed = (currentMusic.currentTime / currentMusic.duration) * 100
    let munites = Math.floor(currentMusic.currentTime / 60)
    let seconds = Math.floor(currentMusic.currentTime % 60)

    munites = munites < 10 ? `0${munites}` : munites
    seconds = seconds < 10 ? `0${seconds}` : seconds

    currentMusicTime.textContent = `${munites}:${seconds}`

    timelinePlayed.style.width = `${timePlayed}%`
}

// to set duration
function setDuration() {
    let munites = Math.floor(currentMusic.duration / 60)
    let seconds = Math.floor(currentMusic.duration % 60)

    munites = munites < 10 ? `0${munites}` : munites
    seconds = seconds < 10 ? `0${seconds}` : seconds

    endTime.textContent = `${munites}:${seconds}`
}

// to select a music
function selectMusic(data, musicItem, musicItems) {
    musicItems.forEach(item => {
        item.classList.remove('selected')
    })
    musicItem.classList.add('selected')
    IdCurrentMusic = musicItem.id - 1
    // console.log(IdCurrentMusic)

    setMusicProperty(IdCurrentMusic, data)

    setTimeout(() => {
        checker()
        playBtn.textContent = "pause"

    }, 1000);
}

function setMusicProperty(num, data) {
    currentMusic.src = `${data[num].url}`
    currentMusic.play()
    currentMusicArtist.textContent = data[num].artist
    currentMusicTitle.textContent = data[num].title
}

function toNextOrPreviousMusic(data, musicItems, event) {
    let toNext = event.target.classList.contains('skip-next') ? true : false
    let toPrevious = event.target.classList.contains('skip-previous') ? true : false

    if (currentMusic.currentSrc !== '') {
        if (IdCurrentMusic === data.length - 1 && toNext) {
            IdCurrentMusic = 0
        } else if (IdCurrentMusic !== data.length - 1 && toNext) {
            IdCurrentMusic++
        } else if (IdCurrentMusic !== 0 && toPrevious) {
            IdCurrentMusic--
        } else {
            IdCurrentMusic = data.length - 1
        }

        musicItems.forEach(item => {
            item.classList.remove('selected')
        })

        musicItems[IdCurrentMusic].classList.add('selected')

        setMusicProperty(IdCurrentMusic, data)
        setTimeout(() => {
            checker()
            playBtn.textContent = "pause"

        }, 1000);
    }
}