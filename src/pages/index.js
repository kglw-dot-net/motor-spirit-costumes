import * as React from 'react'
// import {reactive} from 'https://esm.sh/@arrow-js/core';

import costumeTemplateSrc from '../images/motor-spirit-costume-template.jpg'
import costumeLogoSrc from '../images/motor-spirit-costume-logo.png'

import './index.scss'

const cWidth = 1033;
const cHeight = 1280;

let uploadedImage;
global.uploadedImage = uploadedImage;

function _(domId) {
  return document.getElementById(domId)
}

function val(domId) {
  return _(domId).value.trim();
}

function newImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function click() {
  let costumeName = val('costumeName');
  const canvas = _('canvas');
  canvas.width = cWidth;
  canvas.height = cHeight;
  const ctx = canvas.getContext('2d');
  // const templateImage = new Image();
  // templateImage.src = costumeTemplateSrc;
  // await templateImage.onload();
  const templateImage = await newImage(costumeTemplateSrc);
  ctx.drawImage(templateImage, 0, 0, cWidth, cHeight);
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.textAlign = 'center';
  ctx.font = `${cHeight/20}px Arial`;
  // if (ctx.measureText(costumeName).width > cWidth/2) {
  //   costumeName = costumeName.replace(' ', '\n')
  // } // TODO way to linebreak?
  ctx.fillText(costumeName, 290, 440);
  ctx.strokeText(costumeName, 290, 440);
  ctx.textAlign = 'left';
  ctx.font = `${cHeight/30}px Arial`;
  ctx.fillText('Includes:', 150, 650);
  if (val('component1')) ctx.fillText(`– ${val('component1')}`, 150, 700);
  if (val('component2')) ctx.fillText(`– ${val('component2')}`, 150, 750);
  if (val('component3')) ctx.fillText(`– ${val('component3')}`, 150, 800);
  if (val('component4')) ctx.fillText(`– ${val('component4')}`, 150, 850);
  const maskPoints = {
    NW: [685, 175],        NE: [905, 180],
    Wmidpoint: [325, 650], Wradius: 700,
    SW: [680, 1150],       SE: [930, 1160],
  }
  const maskWidth = Math.max(maskPoints.NE[0], maskPoints.SE[0]) - maskPoints.Wmidpoint[0]; // 505
  const maskHeight = Math.max(maskPoints.SE[1], maskPoints.SW[1]) - Math.min(maskPoints.NE[1], maskPoints.NW[1]);
  ctx.beginPath();
  ctx.moveTo(...maskPoints.NW);
  ctx.lineTo(...maskPoints.NE);
  ctx.lineTo(...maskPoints.SE);
  ctx.lineTo(...maskPoints.SW);
  ctx.arcTo(...maskPoints.Wmidpoint, ...maskPoints.NW, maskPoints.Wradius);
  ctx.closePath();
  ctx.clip();
  // global.console.log({maskWidth, maskHeight}, ' ... uploadedImage w h:', uploadedImage.width, 'x', uploadedImage.height)
  const multiplier = maskHeight / uploadedImage.height;
  const newImageWidth = Math.floor(uploadedImage.width * multiplier);
  const newImageHeight = maskHeight;
  uploadedImage.width = newImageWidth;
  uploadedImage.height = newImageHeight;
  // global.console.log('new...', uploadedImage.width, uploadedImage.height);
  ctx.drawImage(uploadedImage,
    // sx, sy, sWidth, sHeight,
    maskPoints.Wmidpoint[0] - (uploadedImage.width / 2) + (maskWidth / 2),
    maskPoints.NW[1], // ... NW[1] - (uploadedImage.height/2) + (maskHeight/2)
    newImageWidth,
    newImageHeight
  );
  // 425, 175 ... mask spans from x=425 to x=930... midpoint 677.5...
  // global.console.log( maskPoints.Wmidpoint[0] - (uploadedImage.width / 2) + (maskWidth / 2), maskPoints.NW[1]) // ... NW[1] - (uploadedImage.height/2) + (maskHeight/2)

}

function fileOnChange({target: uploadTarget}) {
  const [file] = uploadTarget.files
  if (file?.type.match('image.*')) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = ({target: readerTarget}) => {
      if (readerTarget.readyState == FileReader.DONE) {
        uploadedImage = new Image();
        uploadedImage.src = readerTarget.result;
        _('button').classList = ['ready'];
        _('button').innerText = 'okay meme it';
      }
    }
  } else alert('got to be an image!');
}

const IndexPage = () => {
  return (
    <main>
      <h1>
        <img src={costumeLogoSrc} style={{height:'3em',verticalAlign:'middle'}} alt="'Motor Spirit Costumes' logo (parody of Spirit Halloween's logo) by @billabongvalley@Instagram" />
        Gizz Costume Generator
      </h1>
      <canvas id="canvas"/>
      <div id="form">
        <label>What's the costume?
          <input id="costumeName" name="costumeName" />
        </label>
        <p>What's it come with?</p>
        <ul>
          <li>
            <label>component 1
              <input id="component1" name="component1" />
            </label>
          </li>
          <li>
            <label>component 2
              <input id="component2" name="component2" />
            </label>
          </li>
          <li>
            <label>component 3
              <input id="component3" name="component3" />
            </label>
          </li>
          <li>
            <label>component 4
              <input id="component4" name="component4" />
            </label>
          </li>
        </ul>
        <label>Pick a photo for the costume...
          <input type="file" id="image" onChange={fileOnChange} />
        </label>
        <button id="button" onClick={click}>Add image first</button>
      </div>
      <h6>brought to you by <a href="https://www.instagram.com/p/CzEZKcDvEn2" target="_blank">@billabongvalleybootleg</a> and <a href="https://kglw.net/?src=costume-generator&campaign=footerlink" target="_blank">KGLW.net</a>!</h6>
    </main>
  )
}

export default IndexPage

export const Head = () => <title>KGLW.net presents Motor Spirit Costumes</title>
