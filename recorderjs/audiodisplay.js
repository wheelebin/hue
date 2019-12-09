const get = async ({ url, body, method }) => await fetch(url, { body: JSON.stringify(body), method }).then(res => res.json())
const _lights = () => localStorage.getItem('lights').split(',')

let _temperature = 0
let _color = 0

const getLights = async id => {
  const url = `http://${localStorage.getItem('internalipaddress')}/api/${localStorage.getItem('api_key')}/lights/${id}/`
  const method = 'GET'
  const result = await get({ url, method })
  return Promise.resolve(result)
}

const setLights = async ({ id, temperature, color }) => {
  if (temperature - _temperature > 0.05 || temperature - _temperature < -0.05) {
    const url = `http://${localStorage.getItem('internalipaddress')}/api/${localStorage.getItem('api_key')}/lights/${id}/state`
    const body = { 'on': true, 'sat': 254, 'bri': Math.floor(200 * temperature), "hue": color }
    const method = 'PUT'
    get({ url, body, method })
  }
}

Array.prototype.move = function (from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
};

const spin = color_array => {
  setInterval(() => {
    color_array.move(2, 0)
    color_array.forEach((color, i) => {
      const id = i+1
      setLights({ id, temperature: 0.3, color })
    })
  }, 10000);
}

function drawBuffer(data) {
  let temperature = 0;

  for (let i = 0; i < data.length; i++) {
    if (temperature < data[i]) {
      temperature = data[i];
    }
  }

  let color = 0

  if (temperature > 0.5 || _color + Math.floor(_color * temperature) < 1500) {
    color = _color + Math.floor(_color * temperature)
  }

  if (temperature < 0.5 || _color + Math.floor(_color * temperature) > 65535) {
    color = _color - Math.floor(_color * temperature)
  }

  if (color < 1000 || color > 65535) {
    color = Math.floor(temperature * 65535)
  }
  
  // _lights().forEach(id => {
  //   setLights({ id, temperature, color })
  // })

  setLights({ id: 1, temperature, color: 65000-color })
  setLights({ id: 2, temperature, color: 65000-color })
  setLights({ id: 3, temperature, color: 48000-color })  
  _color = color
  _temperature = temperature
}


const getInternalIp = async () => {
  const url = 'https://discovery.meethue.com/'
  const [res] = await get({ url, method: 'GET' })
  const { internalipaddress } = res  
  localStorage.setItem('internalipaddress', internalipaddress)
  return Promise.resolve()
}

const validateAgainstHue = async () => {
  const url = `http://${localStorage.getItem('internalipaddress')}/api/`
  const response = await get({ url, body: {"devicetype":"my_hue_app#1337"}, method: 'POST'})
  localStorage.setItem('api_key', response)
}

const setupLights = async () => {
  const url = `http://${localStorage.getItem('internalipaddress')}/api/${localStorage.getItem('api_key')}/lights/`
  const method = 'GET'
  const result = await get({ url, method })
  localStorage.setItem('lights', Object.keys(result))
}

const startLoading = () => {
  
}

const stopLoading = () => {

}

const connect = async () => {
  startLoading()
  // await getInternalIp()
  // await validateAgainstHue()
  await setupLights()
  stopLoading()
}

const _red = temp => 24000 * temp + 40000
const _green = temp => 24000 * temp + 20000
const _blue = temp => 24000 * temp








// function changeLights(data) {
//   const array1 = []
//   const array2 = []
//   const array3 = []

//   for (let i = 0; i < data.length; i++) {
//     if(i < 20) {
//       data[i].magnitude && array1.push(data[i].magnitude)
//     }
    
//     else if(i < 40) {
//       data[i].magnitude && array2.push(data[i].magnitude)
//     }

//     else if(i < 61) {
//       data[i].magnitude && array3.push(data[i].magnitude)
//     }
//   }

//   const sum = arr => arr.reduce((a, b) => a + b, 0)
//   const sum1 = sum(array1)
//   const sum2 = sum(array2)
//   const sum3 = sum(array3)

//   const { red, blue, green } = data.reduce((acc, cur) => {
//     acc[cur.color] ? acc[cur.color] = acc[cur.color] + cur.magnitude : acc[cur.color] = cur.magnitude
//     return acc
//   }, {})

//   const r = (red / 1600 * 255)
//   const b = (blue / 1600 * 255)
//   const g = (green / 1600 * 255)
//   const [h, s, l] = rgbToHsl({ r, g, b })
//   const color = Math.random() * 65535
//   const brightness = l/100

// }

// const rgbToHsl = ({ r, g, b }) => {
//   r /= 255, g /= 255, b /= 255;
//   var max = Math.max(r, g, b), min = Math.min(r, g, b);
//   var h, s, l = (max + min) / 2;

//   if (max == min) {
//     h = s = 0; // achromatic
//   } else {
//     var d = max - min;
//     s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
//     switch (max) {
//       case r: h = (g - b) / d + (g < b ? 6 : 0); break;
//       case g: h = (b - r) / d + 2; break;
//       case b: h = (r - g) / d + 4; break;
//     }
//     h /= 6;
//   }

//   return [Math.floor(h * 360), Math.floor(s * 100), Math.floor(l * 100)];
// }