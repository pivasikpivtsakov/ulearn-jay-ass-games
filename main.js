"use strict";

// объект с размерами полей
const SIZE = {
    small: { width: 3, hight: 2 },
    medium: { width: 4, hight: 2 },
    big: { width: 4, hight: 3 }
};

// массив ссылок на картинки
const pictures = [
    'https://images.unsplash.com/photo-1607714724990-8f5495b75883?crop=entropy&cs=srgb&fm=jpg&ixid=MXwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHw&ixlib=rb-1.2.1&q=85',
    'https://images.unsplash.com/photo-1605256108216-7e4a97ac9d93?crop=entropy&cs=srgb&fm=jpg&ixid=MXwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHw&ixlib=rb-1.2.1&q=85',
    'https://images.unsplash.com/photo-1605894646636-bab3db312b65?crop=entropy&cs=srgb&fm=jpg&ixid=MXwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHw&ixlib=rb-1.2.1&q=85',
    'https://images.unsplash.com/photo-1605839406808-a6043334fa32?crop=entropy&cs=srgb&fm=jpg&ixid=MXwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHw&ixlib=rb-1.2.1&q=85',
    'https://images.unsplash.com/photo-1606065258119-27297317b812?crop=entropy&cs=srgb&fm=jpg&ixid=MXwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHw&ixlib=rb-1.2.1&q=85',
    'https://images.unsplash.com/photo-1607002944680-233705405df0?crop=entropy&cs=srgb&fm=jpg&ixid=MXwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHw&ixlib=rb-1.2.1&q=85',
];

// гвернет случайное число от 0 до мax
const getRandom = (max) => Math.floor(Math.random() * Math.floor(max));

// вернет перемешенный массив картинок, каждая встречается 2 раза
const mixImgs = (pictures, size) => {
    let pairsArray = [];

    // в массиве будут лежать цифры, которые показывает, сколько раз повторялась картинка (1, 2, либо undefined)
    let qtyArr = [];

    // этот цикл для массива
    for (let i = 0; i < size.width * size.hight; i++) {

        // если в массиве qtyArr под текущим индексом находится 2, то цикл начинается сначала, пока не выберет картинку, которая повторялась 1 раз или нисколько
        while (true) {

            let index = getRandom((size.width * size.hight) / 2);
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

// банально создаем поле, 
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

    let items = [];

    for (let i = 0; i < size.hight; i++) {
        let currentRow = row.cloneNode();
        for (let j = 0; j < size.width; j++) {
            let currentImg = img.cloneNode();
            currentImg.src = picturesArr[i * size.width + j];

            let currentContent = content.cloneNode();
            currentContent.append(currentImg);

            let currentItem = item.cloneNode();
            currentItem.append(currentContent);

            currentRow.append(currentItem);
            items.push(currentItem);
        }
        container.append(currentRow);
    }
    return items;
}

let start = () => {
    let size = SIZE.big;
    let images = mixImgs(pictures, size)
    let items = createField(images, size);

    for (let i = 0; i < items.length; i++) {
        items[i].addEventListener('click', (e) => {
            items[i].classList.toggle('show');
        })
    }
}

start();