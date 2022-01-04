export default function adjustVideoGridLayout(numberOfElem: number, streams: HTMLDivElement) {

  const screenWidth = window.innerWidth;

  switch(true) {

    // sm adjustments
    case screenWidth <= 768: {
      _adjustStreamsGridUtility(numberOfElem, screenWidth, streams);
      break;
    }

    // md adjustments
    default: {
      _adjustStreamsGridUtility(numberOfElem, screenWidth, streams);
      break;
    }
  }
}

function _adjustStreamsGridUtility(numberOfElem: number, screenWidth: number, streams: HTMLDivElement) {
  let col = 2, row = 1;
  let incrementCol = false;
  for (let i = 2; ; i++) {
    const diff = col * row - numberOfElem;
    if (diff >= 0) break;
    else {
      incrementCol ? col +=1 : row += 1;
      incrementCol = !incrementCol;
    }
  }

  switch(true) {
    case screenWidth <= 768: {
      if (col > 3) col = 3;
      streams.style.gridTemplateColumns = `repeat(${col}, 1fr)`;
      break;
    }
    default: {
      streams.style.gridTemplateColumns = `repeat(${col}, 1fr)`;
      break;
    }
  }
}