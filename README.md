# shri-flux

### Запуск

Node.js – v10.12.0


```
$ git clone https://github.com/dalv96/shri-flux.git
$ cd shri-flux
$ npm i
$ npm start
```

Страничка будет доступна на http://localhost:8000/

### Суть то в чём?

* Карточки можно удалять. Для этого нужно нажать на крестик.

* Карточки можно добавлять. В шапке сайта есть пункт "Добавить карточку".

* Все изменения сохраняются в Store, а Store сохраняется на сервере до его перезапуска.

### Описание API разработанного фрейморка Hue.js (Хью джэ-эс)

Чтобы начать пользоваться Hue.js нужно подключить библиотеку:

```html
    <script src="js/hue.js"></script>
```
Создать диспетчера:

```js
  const MyDispatcher = new Dispatcher();
```

Создать хранилище:

```js
  const MyStore = new Store();
```

С помощью диспетчера объявим наши FLUX-события и коллбеки которые они будут вызывать: 

```js
  MyDispatcher.register(function (payload) {
    switch (payload.name) {
        case 'some-event':
            MyStore.events.push(payload.event);
            MyStore.trigger('update'); // Говорим, что наш Store обновился
            break;
    }
});
```

Добавим обработчик изменения Store:

```js
  MyStore.bind('update', this._renderEvents);
```

Ну и реагировать на пользовательские действия будет диспетчер:

```js
  MyDispatcher.dispatch({
      name: 'some-event',
      event: event
  });
```
