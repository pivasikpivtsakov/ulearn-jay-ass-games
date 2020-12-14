"use strict";

// объект с размерами полей
const SIZE = {
    small: { width: 3, height: 2 },
    medium: { width: 4, height: 2 },
    big: { width: 4, height: 3 }
};

// модель для картинки
class Picture {
    constructor(item, pictureGuid) {
        this.item = item
        this.opened = false
        this.paired = false
        this.pictureGuid = pictureGuid
    }

    open() {
        this.opened = true
        if (this.item.classList.contains('hide')) {
            this.item.classList.remove('hide')
        }
        this.item.classList.add('show')
    }

    close() {
        this.opened = false
        if (this.item.classList.contains('show')) {
            this.item.classList.remove('show')
        }
        this.item.classList.add('hide')
    }

    openThenClose() {
        this.opened = false
        if (this.item.classList.contains('hide')) {
            this.item.classList.remove('hide')
        }
        this.item.classList.add('show')
        setTimeout(() => {
            if (this.item.classList.contains('show')) {
                this.item.classList.remove('show')
            }
            this.item.classList.add('hide')
        }, 500);
    }

    samePicture = (picture) => picture.pictureGuid === this.pictureGuid
}

// массив ссылок на картинки
let pictureLinks = [
    'res\\200089200354_372636.jpg',
    'res\\200102200272_283372.jpg',
    'res\\200108900338_291997.jpg',
    'res\\200108900793_291690.jpg',
    'res\\200109000934_288788.jpg',
    'res\\200158700830_141402.jpg',
];

// вернет случайное число от 0 до мax
const getRandom = (max) => Math.floor(Math.random() * Math.floor(max));

// вернет перемешенный массив картинок, каждая встречается 2 раза
const mixImgs = (pictures, size) => {
    let pairsArray = [];

    // в массиве будут лежать цифры, которые показывает, сколько раз повторялась картинка (1, 2, либо undefined)
    let qtyArr = [];

    // этот цикл для массива
    for (let i = 0; i < size.width * size.height; i++) {

        // если в массиве qtyArr под текущим индексом находится 2, то цикл начинается сначала, пока не выберет картинку, которая повторялась 1 раз или нисколько
        while (true) {

            let index = getRandom((size.width * size.height) / 2);
            if (!pairsArray[i]) {

                if (!qtyArr[index])
                    qtyArr[index] = 1;
                else if (qtyArr[index] >= 2)
                    continue;
                else
                    qtyArr[index]++;

                pairsArray[i] = pictures[index];
                break;
            }
        }
    }
    return pairsArray;
};

// банально создаем поле, возвращаем массив моделей клеток
let createField = (picturesArr, size) => {
    let container = document.querySelector('.container');

    let row = document.createElement('div');
    row.className = 'row';

    let item = document.createElement('div');
    item.className = 'item';

    let content = document.createElement('div');
    content.className = 'item_show';

    let img = document.createElement('img');
    img.className = 'item_img';

    let pictures = [];

    for (let i = 0; i < size.height; i++) {
        let currentRow = row.cloneNode();
        for (let j = 0; j < size.width; j++) {
            let pictureIndex = i * size.width + j

            let currentImg = img.cloneNode();
            currentImg.src = picturesArr[pictureIndex];

            let currentContent = content.cloneNode();
            currentContent.append(currentImg);

            let currentItem = item.cloneNode();
            currentItem.append(currentContent);

            currentRow.append(currentItem);

            let picture = new Picture(currentItem, picturesArr[pictureIndex]);
            pictures.push(picture);
        }
        container.append(currentRow);
    }
    return pictures;
}

const createEnterNameField = (clicksMade) => {
    let mainColumn = document.querySelector('.main-column')
    let leaderboardColumn = document.querySelector('.leaderboard-column')
    let nameInput = document.createElement('input')
    mainColumn.append(nameInput)
    let submit = document.createElement('button')
    submit.className = 'game-btn'
    submit.innerHTML = 'Добавить'
    submit.onclick = (e) => {
        let leaderboardEntry = document.createElement('p')
        leaderboardEntry.innerHTML = `${nameInput.value}: ${clicksMade}`
        leaderboardColumn.append(leaderboardEntry)
        nameInput.remove()
        submit.remove()
    }
    mainColumn.append(submit)
}

let currentSize = undefined

function start(size) {
    currentSize = size
    let images = mixImgs(pictureLinks, size);
    let pictures = createField(images, size);
    let pairedCount = 0;
    let winCount = size.width * size.height;
    /**
     * @type Picture
     */
    let pairPic = null;
    let clicksMade = 0;
    let clicksMadeP = document.querySelector('#clicks-made-p');

    for (let i = 0; i < pictures.length; i++) {
        let pic = pictures[i];
        pic.item.addEventListener('click', (e) => {
            if (pic.opened) {
                if (!pic.paired) {
                    // игрок передумал подбирать пару к этой карточке, отмена
                    pairPic = null;
                    pic.close();
                } else {
                    // если paired, то ниче не делаем
                }
            } else {
                // открываем карточку
                if (pairPic === null) {
                    // если это первая карточка в паре
                    pairPic = pic;
                    pic.open();
                    clicksMade++;
                } else {
                    // если вторая, проверяем на одинаковость картинки
                    if (pairPic.samePicture(pic)) {
                        // ауе, отмечаем карточки как собранные
                        pic.open();
                        clicksMade++;
                        pairedCount += 2;
                        pic.paired = true;
                        pairPic.paired = true;
                    } else {
                        // картинки разные, закрываем карточки
                        pic.openThenClose();
                        clicksMade++;
                        let pairPicRef = pairPic;
                        setTimeout(() => {
                            pairPicRef.close();
                        }, 500);
                    }
                    pairPic = null;
                }
            }
            if (pairedCount === winCount) {
                setTimeout(() => alert('Победа'), 500)
                createEnterNameField(clicksMade)
            }
            clicksMadeP.innerHTML = `Сделано открытий: ${clicksMade}`;
        });
    }
}

const clearField = () => {
    let container = document.querySelector('.container');
    while (container.firstChild) {
        container.removeChild(container.lastChild)
    }
}

document.querySelector('#easy-game-btn').onclick = () => {
    clearField()
    start(SIZE.small)
}

document.querySelector('#medium-game-btn').onclick = () => {
    clearField()
    start(SIZE.medium)
}

document.querySelector('#hard-game-btn').onclick = () => {
    clearField()
    start(SIZE.big)
}

document.querySelector('#unsplash-pics-btn').onclick = () => {
    pictureLinks = [
        'https://images.unsplash.com/photo-1607714724990-8f5495b75883?crop=entropy&cs=srgb&fm=jpg&ixid=MXwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHw&ixlib=rb-1.2.1&q=85',
        'https://images.unsplash.com/photo-1605256108216-7e4a97ac9d93?crop=entropy&cs=srgb&fm=jpg&ixid=MXwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHw&ixlib=rb-1.2.1&q=85',
        'https://images.unsplash.com/photo-1605894646636-bab3db312b65?crop=entropy&cs=srgb&fm=jpg&ixid=MXwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHw&ixlib=rb-1.2.1&q=85',
        'https://images.unsplash.com/photo-1605839406808-a6043334fa32?crop=entropy&cs=srgb&fm=jpg&ixid=MXwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHw&ixlib=rb-1.2.1&q=85',
        'https://images.unsplash.com/photo-1606065258119-27297317b812?crop=entropy&cs=srgb&fm=jpg&ixid=MXwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHw&ixlib=rb-1.2.1&q=85',
        'https://images.unsplash.com/photo-1607002944680-233705405df0?crop=entropy&cs=srgb&fm=jpg&ixid=MXwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHw&ixlib=rb-1.2.1&q=85',
    ]
    clearField()
    start(currentSize)
}

document.querySelector('#friends-pics-btn').onclick = () => {
    pictureLinks = [
        'res\\200089200354_372636.jpg',
        'res\\200102200272_283372.jpg',
        'res\\200108900338_291997.jpg',
        'res\\200108900793_291690.jpg',
        'res\\200109000934_288788.jpg',
        'res\\200158700830_141402.jpg',
    ]
    clearField()
    start(currentSize)
}

start(SIZE.big);