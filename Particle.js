class Particle{
    constructor({context, particle, width,height, size, force}){
        this.context = context
        this.noise = (Math.random() * 3.14 * 0.05)
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.originalX = particle.x
        this.originalY = particle.y
        this.color = particle.color
        this.size = size
        this.force = force
        this.vX = 0
        this.vY = 0
    }
    update(){
        const dX = this.force.x - this.x
        const dY = this.force.y - this.y
        const distanceFromForce = Math.pow(dX,2) + Math.pow(dY,2)
        if(distanceFromForce < this.force.radius){
            const angle = Math.atan2(dY,dX)
            const forceSize = -this.force.radius / distanceFromForce
            this.vX = forceSize * Math.cos(angle)
            this.vY = forceSize * Math.sin(angle)
        }
        this.vX *= this.noise * 2
        this.vY *= this.noise * 2
        this.x += (this.originalX - this.x) * this.noise + this.vX
        this.y += (this.originalY - this.y) * this.noise + this.vY
    }
    draw(){
        this.context.fillStyle = this.color;
        this.context.fillRect(this.x,this.y,this.size,this.size)
    }
}

export default Particle