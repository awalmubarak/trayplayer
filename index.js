const {ipcRenderer} = require('electron')
const $ = require('jquery')
const mm = require('music-metadata')
let filesData = {title:[], artist:[], path:[]}
let currentIndex = 0
let playing = false;
let audioPlayer = $('audio').get(0)

function playPrevious(){
    currentIndex--
    if(currentIndex<0)currentIndex = filesData.title.length - 0;
    playSong(currentIndex)
}

function play(){
    if(playing){
        audioPlayer.pause()
    }else{
        audioPlayer.play()
    }
    playing = !playing
    updatePlayButton()
}

function playNext(){
    currentIndex++
    if(currentIndex>=filesData.title.length)currentIndex = 0;
    playSong(currentIndex)
}

function clearPlaylist(){

}

function chooseMusic(){
    $('input').click()
}

function musicSelected(){
   let files = $('input').get(0).files
   console.log(files);
    for (let i = 0; i < files.length; i++) {
        const {path} = files[i];
        mm.parseFile(path, {native:true})
        .then(metadata=>{
            filesData.path[i]=path
            filesData.title[i]=metadata.common.title
            filesData.artist[i]=metadata.common.artist

            let songRow = 
            `<tr ondblclick="playSong(${i})">
                <td>${metadata.common.title}</td>
                <td>${metadata.common.artist}</td>
                <td>${secondsToTime(metadata.format.duration)}</td>
            </tr>`

            $('#table-body').append(songRow)
        }).catch(err=>{
            console.log(err)
        });
    }

    audioPlayer.src = filesData.path[0]

}

function playSong(index){
    currentIndex = index
    audioPlayer.src= filesData.path[currentIndex]
    audioPlayer.load()
    audioPlayer.play()
    status = true
    $('h4').text(filesData.title[currentIndex])
    playing = true
    updatePlayButton()
    ipcRenderer.send('playing', filesData.title[currentIndex])
}

function updatePlayButton(){
    let playIcon = $('#play-button span')
    if(playing){
        playIcon.removeClass('icon-play')
        playIcon.addClass('icon-pause')
    }else{
        playIcon.removeClass('icon-pause')
        playIcon.addClass('icon-play')
    }
}


function secondsToTime(t) {
    return padZero(parseInt((t / (60)) % 60)) + ":" + 
           padZero(parseInt((t) % 60));
  }
function padZero(v) {
return (v < 10) ? "0" + v : v;
}