const MyDispatcher = new Dispatcher();

const MyStore = new Store({
    events: []
});

MyDispatcher.register(function (payload) {
    switch (payload.name) {
        case 'init':
            MyStore.events = payload.events;
            MyStore.trigger('update');
            break;
        case 'new-item': 
            MyStore.events.unshift(payload.event);
            MyStore.trigger('update');
            break;
        case 'delete-item': 
            MyStore.events.forEach( (event, i) => {
                if (event.id == payload.id) {
                    MyStore.events.splice(i, 1);
                }
            })
            MyStore.trigger('update');
            break;
    }
});

function closeCard(id) {
    MyDispatcher.dispatch({
        name: 'delete-item',
        id: id
    });
}

let last_Id = 100; // Счетчик ID карточек для добавления

fetch('/lastID')
    .then( res => {
        return res.json();
    })
    .then( res => {
        last_Id = res.id;
    });

function addSimpleCard() {
    MyDispatcher.dispatch({
        name: 'new-item',
        event: {
            "id": last_Id++,
            "type": "info",
            "title": `Карточка #${last_Id-1}`,
            "source": "Оконный сенсор",
            "time": "12:34, Давно",
            "description": "Ура! Карточка добавлена!",
            "icon": "battery",
            "size": "s"
        }
    });
}

function getMusicNode(data) {
    if (!data || !data.track) return '';
    
    return `
        <div class="music">
            <div class="music__play">
            <div class="music__cover">
                <img src="${data.albumcover}" alt="Музыка">
            </div>
            <div class="music__name">${data.artist} - ${data.track.name}</div>
            <div class="music__track">
                <input type="range" min="0" max="100" value="25">
                <div class="music__time">${data.track.length}</div>
            </div>
            </div>
            <div class="music__action">
                <div>
                    <img class="prev" src="images/icons/Prev.svg" alt="">
                    <img class="next" src="images/icons/Prev.svg" alt="">
                </div>
                <div class="music__volume">
                    <input type="range" oninput="changeVolume(this.value)" min="0" max="100" value="80">
                    <div class="music__value">${data.volume}%</div>
                </div>
            </div>
        </div>`
};

function getTempNode(data) {
    if (!data || !data.temperature) return '';

    return `<div class="status">
        <div class="status__item">
            <div class="status__name">Температура:</div>
            <div class="status__value">${data.temperature} C</div>
        </div>
        <div class="status__item">
            <div class="status__name">Влажность:</div>
            <div class="status__value">${data.humidity}%</div>
        </div>
    </div>`
};

function getDescNode(data) {
    if (!data.description) return '';
    
    return `<div class="card__text">${data.description}</div>`
}

function getImageNode(data) {
    if (data && data.image) return `<img class="large-picture" src="${data.image}" alt="">`
    
    return '';
}

function getActionsNode(data) {
    if (data && data.buttons)
        return `<div class="button-panel">
            <button class="button button_size_m button_type_agree">Да</button>
            <button class="button button_size_m">Нет</button>
        </div>`

    return '';
}

function _renderEvents() {
    const events = MyStore.events;
    
    let innerHtml = '';
    events.forEach(event => {
        innerHtml += `<div class="card card_size_${event.size} card_type_${event.type}">
            <div class="card__close" onclick="closeCard(${event.id})">
              <img src="images/icons/cross${(event.type == 'critical')?'-white':''}.svg" alt="">
            </div>
            <div class="card__open">
              <img src="images/icons/next.svg" alt="">
            </div>
              <div class="card__head">
                <div class="card__title">
                  <div class="card__icon">
                    <img src="images/icons/${event.icon}.svg" alt="${event.icon}">
                  </div>
                  <div class="card__name">${event.title}</div>
                </div>
                <div class="card__info">
                  <div class="card__device">${event.source}</div>
                  <div class="card__date">${event.time}</div>
                </div>
              </div>
              <div class="card__body">
                  ${getDescNode(event)}
                  <div class="card__opitonal">
                    ${getImageNode(event.data)}
                    ${getMusicNode(event.data)}
                    ${getTempNode(event.data)}
                    ${getActionsNode(event.data)}
                  </div>
              </div>
          </div>`
    });

    const list = document.querySelector('.events__list');
    list.innerHTML = innerHtml;
}

function _saveStore() {    
    fetch('/api/events', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({events: MyStore.events}) 
    });
}

window.onload = function () {
    
    fetch('/api/events')
        .then( res => {
            return res.json();
        })
        .then( events => {
            MyDispatcher.dispatch({
                name: 'init',
                events: events
            })
        });
    
    MyStore.bind('update', this._renderEvents); // Контроллер рендера
    MyStore.bind('update', this._saveStore); // сохранение на сервер стора
}