import './index.css'
import Particle from './Particle' 
import test from './assets/test.jpg'
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
  gradientColor.addColorStop(0,"blue")
  gradientColor.addColorStop(1,"red")
  return gradientColor
}

const drawTextAtCenter = ({context,width, height, start}) => {
	const image = new Image();
	image.src = test;
	image.onload = () => {
		context.drawImage(image, 0,0, width, height)
		start()
	}
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
  const size = 7;
  const pixelDensity = 7;
  canvas.width = window.innerWidth
  canvas.height =  window.innerHeight
  ctx.fillStyle = getGradientColor({context : ctx, width : canvas.width})
  const start = () => {
	const pixelsArray = createParticleByCavnas({
		context : ctx,
		width : canvas.width, 
		height : canvas.height,
		pixelDensity
	  })
	  const [force,updateForce] = useForce()
	  const particles = pixelsArray.map(
		particle => new Particle({
		  context : ctx, 
		  particle, 
		  width : canvas.width, 
		  height : canvas.height,
		  size,
		  force
		})
	  )
	  window.addEventListener('touchstart', () => {
		updateForce({...force,radius : canvas.width * 100})
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
		updateForce({x,y, radius : canvas.width * 100})
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
  drawTextAtCenter({context : ctx, width : canvas.width, height : canvas.height, start })
}

window.addEventListener('load',()=> {
  main()
})