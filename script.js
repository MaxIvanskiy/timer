const linkZones = 'http://worldtimeapi.org/api/timezone/';

const requestAjax = (link, callBack) => {
    fetch(link)
        .then(r => r.json())
        .then(d => {
            callBack(d);
        })
}

const addZones = zones => {
    const select = document.querySelector('#select-timezone');
    const options = zones.map(zone => `<option value="${ zone }">${ zone }</option>`).join('');
    select.innerHTML = options;

    select.addEventListener('input', onSelect);
}

const onSelect = zone => {
    loadTime(zone.target.value);
}
const loadTime = (zone) => {
    const zoneLink = `${ linkZones }${ zone }`;
    requestAjax(zoneLink, displayTime);
}

const displayTime = zone => {
    const zoneTitle = document.querySelector('.zone-title');
    const zoneTime = document.querySelector('.zone-time');
    const zoneInfo = document.querySelector('.zone-info');

    const timeZone = zone.timezone;
    const regZone = /.*\/(.*)/;
    const cleanZone = timeZone.replace(regZone, '$1');

    const week = zone.week_number;
    const dyaOfYear = zone.day_of_year;
    const time = zone.datetime;

    const regDateDate = /(\d{4}-\d{2}-\d{2}).*/;
    const cleanDate = time.replace(regDateDate, '$1');

    const regDateTime = /.*T(\d{2}:\d{2}:\d{2})\..*/;
    const cleanTime = time.replace(regDateTime, '$1');

    let day = zone.day_of_week;
    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    for(let i = 1; i <= days.length; i += 1){
        if(i == day){
            day = days[i-1];
        }
    }

    zoneTitle.innerHTML = `${ cleanZone } time`;
    zoneTime.innerHTML = cleanTime;
    zoneInfo.innerHTML = `<p>${ cleanDate }, ${ day }, week ${ week }</p>`
}


const addButtons = zones => {
    const popularZones = document.querySelector('.popular-zones');
    for(let i = 0; i < zones.length; i += 1){
        const zone = zones[i];
        const regZone = /.*\/(.*)/;
        const city = zone.replace(regZone, '$1');
        popularZones.insertAdjacentHTML('beforeEnd', `<li class="zone-btn" data-zone="${ zone }">${ city }<span>time</span></li>`);
    }

    const buttons = document.getElementsByClassName('zone-btn');
    
    for(let i = 0; i < buttons.length; i += 1){
        buttons[i].addEventListener('click', getButtonData);
    };    
}

function getButtonData(){
    const buttonZone = this.getAttribute("data-zone");
    loadTime(buttonZone);
}

const startApp = () => {
    requestAjax(linkZones, addZones);
}

(() => {
    startApp();
    loadTime('Europe/Kiev');

    const buttonsZones = ["America/Los_Angeles","America/New_York","Europe/London","Europe/Paris","Europe/Kiev","Asia/Tokyo"]
    addButtons(buttonsZones);    
})();