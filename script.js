const canvasEl = document.querySelector('canvas')

// Add contexto do canvas

const canvasCtx = canvasEl.getContext('2d');

 // espesura da linha
 const lineWidth = 15 

 //MARGIN
 const gapX = 10

//  IDENTIFICADOR DO MOUSE
const mouse = {
    x: 0 ,
    y: 0 
    }


 //ORIANTAÇÃO A OBJETOS
 //um objeto com características proprias que dentro dela chama funções que estão fora ou dentro dela.
 
 //CAMPO NO FORMATO OBJETO
 const field = {
    w: window.innerWidth,
    h: window.innerHeight,
    draw: function () {
        // COR CAMPO + CAMPO
    canvasCtx.fillStyle = '#286047'

    // 0, 0 é o momento, na tela, onde inicia a imagem
    canvasCtx.fillRect(0, 0, this.w, this.h)
    },
 }

// LINHA CENTRAL
const line = {
    w: 15,
    h: field.h,
    draw: function() {
        const x = field.w / 2 - this.w / 2 ;
        const y = 0 ;
        const w = this.w;
        const h = this.h
    
        canvasCtx.fillStyle = '#FFFFFF'
        canvasCtx.fillRect(x,y, w, h )
    }
}

//RAQUETE ESQUERDA - HUMANO
const leftPaddle = {
    x: gapX,
    y: 0,
    w: line.w,
    h: 200,
        // OUTRO MÉTODO INTERNO QUE NÃO NECESSARIAMENTE ESTÁ LIGADO AO MÉTODO '  ball._move '
        _move:function () {this.y = mouse.y - this.h / 2},

    draw: function() {
        canvasCtx.fillStyle = '#FFFFFF'
        canvasCtx.fillRect(this.x, this.y, this.w, this.h)
 
        this._move()
    },
}
//RAQUETE DIREITA - COMPUTADOR
const rightPaddle = {
    x: field.w - line.w - gapX,
    y: 0,
    w: line.w,
    h: 200,
    speed: 1,
        // MÉTODO INTERNO
        _move: function() {
            this.y = ball.y
        },

    speedUp: function(){
        this.speed += this.speed/2;
    }
    ,
    draw: function() {
        canvasCtx.fillStyle = '#FFFFFF'
        canvasCtx.fillRect(this.x, this.y, this.w, this.h)

        this._move()
    }

}

// BOLA
const ball = {
    x: 100,
    y: 0 ,
    r: 20, 
    speed: 5,

    directionX: 1,
    directionY: 1,
        // FUNÇÃO INTERNA QUE CALCULARÁ A POSIÇÃO DA BOLA INVERTERÁ OS VALORES
        _calcPosition: function() {

            // POSIÇÕES VERTICAIS
            if (
                (this.y > field.h - this.r && this.directionY > 0 ) ||
                 (this.y - this.r <= 0  && this.directionY < 0 )
                ) {
                this._reverseY()
            }

            // POSIÇÕES HORIZONTAIS (descontando padding, raquete e raio)
            if (this.x > field.w - this.r - rightPaddle.w - gapX){
                //VERIFICA SE A POSIÇÃO DA REQUETE SE ENCONTRA TOCANDO NO RAIO DA BOLA
                if (
                    //parte superior da raquete
                    this.y + this.r > rightPaddle.y &&
                    //parte inferior da raquete
                    this.y - this.r < rightPaddle.y + rightPaddle.h ){
                        this._reverseX()
                    } else {
                        //VERIFICA SE O HUMANO FEZ O PONTO
                        score.increaseHuman()
                        this._pointUp()
                    }
            }
            // VERIFICA SE O COMPUTADOR FEZ O PONTO (X < 0)
            if (this.x  <  this.r + leftPaddle.w + gapX) {
                if (this.y + this.r > leftPaddle.y &&
                    this.y - this.r < leftPaddle.y + leftPaddle.h) {
                        this._reverseX()
                    }
                    else {
                        score.increaseComputer()
                        this._pointUp()
                    }
            }
        },
        _startDirection: function() {
            console.log(Math.floor((Math.random()* -1.50) +1.5))
        },
        _reverseX: function() {
            this.directionX *= -1
        },
        _reverseY: function() {
            this.directionY *= -1
        },

        //REINICIAR APÓS CADA PONTO
        _pointUp: function() {
            this.x = field.w / 2;
            this.y = field.h / 2
            this._speedUp(),
            rightPaddle.speedUp()
        },

            // FUNÇÃO INTERNA PARA AUMENTAR A VELOCIDADE DA BOLA
            
            _speedUp: function() {
                this.speed += 2
                if (score.computer == 10 || score.human == 10) {
                    this.speed = 5
                    score.human = 0
                    score.computer = 0
                }
            },
            
        // método interno - funções internas começa com " _ " como convenção
        _move: function(){
            this.x += this.directionX * this.speed
            this.y += this.directionY * this.speed
        } ,
    draw: function() {
        canvasCtx.fillStyle = '#FFFFFF'
        canvasCtx.beginPath()
        canvasCtx.arc(this.x, this.y, this.r, 0, 2 *Math.PI, false)
        canvasCtx.fill()

        
        this._move()
        this._calcPosition()
    }
}

// PLACAR
const score = {
    human: 0,
    computer: 0,
    increaseHuman: function () {
        this.human ++
        
    },
    increaseComputer: function () {
        this.computer  ++
        
    },
    draw: function() {
        canvasCtx.font = 'bold 72px arial';
    canvasCtx.textAlign = 'center'
    canvasCtx.textBaseline = 'top'
    canvasCtx.fillStyle = '#01341D'
    canvasCtx.fillText(`Human ${this.human}`, field.w  / 4, 50)
    canvasCtx.fillText(`Computer ${this.computer}`, field.w  / 4 + field.w / 2 , 50)
    }
}

// FUNÇÕES

// SETUP - area onde tudo vai acontecer
function setup() {
    canvasEl.width = canvasCtx.width = field.w;
    canvasEl.height = canvasCtx.height = field.h;
}

// CANVAS
function draw() {
    field.draw()
    line.draw()
    rightPaddle.draw()
    leftPaddle.draw()
    score.draw()
    ball.draw()
    ball._move()

    
}

// setup()
// draw()




window.animateFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrase ||
        window.msRequestAnimationFrase||
        function (callback) {
            return window.setTimeout(callback, 1000/60)
        }
    )
})()

function main() {
    animateFrame(main) 
    draw()
}
setup()
main()

canvasEl.addEventListener('mousemove', function(e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY

})

// window.setInterval(draw, 1000/60)