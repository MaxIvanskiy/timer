const linkZones = 'http://worldtimeapi.org/api/timezone/';

const requestAjax = (link, callBack) => {
    fetch(link)
        .then(r => r.json())
        .then(d => {
            callBack(d);
        })
}

const addZones = zones => {
    const select = document.querySelector('#timeZoneSelect');
    const options = zones.map(zone => `<option value="${ zone }">${ zone }</option>`).join('');
    select.innerHTML = options;

    select.addEventListener('input', onSelect);
}

const onSelect = zone => {
    loadTime(zone.target.value);
}
const loadTime = zone => {
    const zoneLink = `${ linkZones }${ zone }`;
    requestAjax(zoneLink, displayTime);
}

const displayTime = zone => {
    const timeWrapper = document.querySelector('.selectedTime');
    const time = zone.datetime;
    const regDateTime = /.*T(\d{2}:\d{2}):\d{2}\..*/;
    const cleanTime = time.replace(regDateTime, '$1');
    const result = `<h2>${ zone.timezone }: <span>${ cleanTime }</span></h2>`;
    timeWrapper.insertAdjacentHTML("afterbegin", result);

    setMemo(zone.timezone);
}

const setMemo = zone => {
    const zones = new Set(JSON.parse(localStorage.getItem('timezones') ?? '[]'));
    zones.add(zone);
    localStorage.setItem('timezones', JSON.stringify([...zones]));
}

const startApp = () => {
    requestAjax(linkZones, addZones);
}

(() => {
    const zones = JSON.parse(localStorage.getItem('timezones') ?? '[]');
    zones.forEach(loadTime);
    startApp();
})();