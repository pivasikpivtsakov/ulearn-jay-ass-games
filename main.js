"use strict";

// объект с уровнями сложности
const LEVEL = {
    easy: 3,
    medium: 5,
    hard: 7
};

// объект с цветами
const COLORS = {
    red: 'red',
    blue: 'blue'
};

// возвращает случайное число от 0 до max
const getRandom = (max) => Math.floor(Math.random() * Math.floor(max));

// создаем последовательность, в которуй нужно нажать на шары
const generateSequence = (level) => {
    let sequence = [];
    for (let i = 0; i < level; i++) {
        sequence.push(getRandom(level));
    }
    return sequence;
};

// мигаем элементом
const blink = (item, color) => {
    let previousBackground = item.style.background
    item.style.background = color;
    setTimeout(() => {
        item.style.background = previousBackground;
    }, 200);
};

// мигаем всеми элементом
const blinkAll = (items, color) => {
    for (const item of items) {
        blink(item, color)
    }
};

// положение элемента относительно окна
const getOffset = (el) => {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
    };
}

// генерация координат элементов
const getCoordinates = (container, ctx, items) => {
    let left = getRandom(container.clientWidth)
    let top = getRandom(container.clientHeight)
    let pixel = ctx.getImageData(left, top, 1, 1)
    let pixelData = pixel.data
    if (pixelData[3] === 0) {
        return getCoordinates(container, ctx, items)
    }
    for (const ip of items) {
        if (getOffset(ip).left == 0 || getOffset(ip).top == 0) {
            continue
        }
        if (Math.abs(getOffset(ip).left - left) < 30 || Math.abs(getOffset(ip).top - top) < 30) {
            return getCoordinates(container, ctx, items)
        }
    }

    return { left: left, top: top }
}

// создаем поле и возвращаем его элементы
let createField = (level) => {
    let container = document.querySelector('.container');
    let image = new Image()
    image.crossOrigin = '*'
    let ctx = container.getContext("2d")
    image.onload = (e) => {
        ctx.drawImage(image, 0, 0)
        image.style.display = "none"
        let items = document.querySelectorAll('.item')
        for (let i = 0; i < level; i++) {
            let coordinates = getCoordinates(container, ctx, items)
            items[i].style.left = `${coordinates.left}px`
            items[i].style.top = `${coordinates.top}px`
        }
    }
    image.src = "res/new-year-tree.png"

    let items = []
    let aboveCanvas = document.querySelector('.above-canvas')
    for (let i = 0; i < level; i++) {
        let item = document.createElement('div');
        item.className = 'item';
        items.push(item)
        aboveCanvas.append(item);
    }
    return items;
};

// начинаем
let start = (level) => {
    const items = createField(level);

    let sequence = generateSequence(level);
    let currentIndex = 0;
    let currentNumber = sequence[currentIndex];
    let isWin = false;

    console.log(sequence)

    for (let i = 0; i < items.length; i++) {
        items[i].addEventListener('click', (e) => {
            if (isWin)
                return;
            console.log(currentNumber)

            if (i == currentNumber) {
                blink(items[i], COLORS.blue);
                currentNumber = sequence[++currentIndex];
                if (currentIndex == sequence.length) {
                    isWin = true;
                    blinkAll(items, COLORS.blue);
                    setTimeout(() => alert('победа'), 500);
                }
            } else {
                blink(items[i], COLORS.red);
                currentIndex = 0;
                currentNumber = sequence[0];
            }
        });
    }
}

start(LEVEL.hard);