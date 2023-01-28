import './index.css'
import Particle from './Particle' 
const canvas = document.getElementById('app')
const ctx = canvas.getContext('2d')

const createParticleByCavnas = ({context,pixelDensity,width,height}) => {
  const result = []
  const { data } = context.getImageData(0,0,width,height)
  for(let y = 0; y < height; y += pixelDensity){
    for(let x = 0; x < width; x += pixelDensity) {
      const index = (x + (y * width)) * 4
      if(data[index + 3] > 0){
        const particle = {
          color : `rgba(${data[index]},${data[index + 1]},${data[index + 2]},${data[index + 3]})`,
          x,
          y
        }
        result.push(particle)
      }
    }
  }
  return result
}

const getGradientColor = ({context,width}) => {
  const gradientColor = context.createLinearGradient(0,0,width,0)
  gradientColor.addColorStop(0,"purple")
  gradientColor.addColorStop(1,"orange")
  return gradientColor
}

const drawTextAtCenter = ({context,width, text}) => {
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.font = `${width/5}px roboto`
  context.fillText(text,canvas.width / 2, canvas.height / 2)
}
const useForce = () => {
  const force = {
    x : 0,
    y : 0,
    radius : 0
  }
  const updateFoce = ({x,y,radius}) => {
    force.x = x
    force.y = y
    force.radius = radius
  }
  return [force, updateFoce]
}
const main = () => {
  const size = 3;
  canvas.width = window.innerWidth
  canvas.height =  window.innerHeight
  ctx.fillStyle = getGradientColor({context : ctx, width : canvas.width})
  drawTextAtCenter({context : ctx, width : canvas.width, text : 'alajillo'})
  const pixelsArray = createParticleByCavnas({
    context : ctx,
    width : canvas.width, 
    height : canvas.height,
    pixelDensity : 5
  })
  const [force,updateForce] = useForce()
  const particles = pixelsArray.map(
    particle => new Particle({
      context : ctx, 
      particle, 
      width : canvas.width, 
      height : canvas.height,
      size : size,
      force
    })
  )
  window.addEventListener('touchstart', () => {
    updateForce({...force,radius : canvas.width * 100000})
  })
  window.addEventListener('touchmove',(e) => {
    const {clientX, clientY} = e.changedTouches[0]
    updateForce({...force, x : parseInt(clientX),y :parseInt(clientY)})
  })
  window.addEventListener('touchend',() => {
    updateForce({...force, radius : 0})
  })
  window.addEventListener('mousemove',(e) => {
    const {x,y} = e
    updateForce({x,y, radius : canvas.width * 100000})
  })
  const animate = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height)
      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })
    requestAnimationFrame(animate)
  }
  animate()
}

window.addEventListener('load',()=> {
  main()
})