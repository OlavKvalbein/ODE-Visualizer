const {PI, sin, cos, sqrt, cbrt, exp, floor} = Math
const TAU = 2*PI

const canvas = document.querySelector("canvas")
canvas.width = innerWidth
canvas.height = innerHeight
const ctx = canvas.getContext("2d")
ctx.globalAlpha = 0.5

// const a = 1.5; const b = 0.5
// const f = (t, r) => (a*r.x - (r.x)**3 - b, r.y)
function f(t, x, y) {
    return {x: -y, y: x*sin(t)}
    // return {x: sin(x*t*PI), y: y*sin(2*PI*t)}
}
const domain = {xmin: -5, xmax: 10, ymin: -10, ymax: 10}
const grid = {w: 70, h: 50} // grid of particles

const padding = 20
const len = {x: domain.xmax - domain.xmin, y: domain.ymax - domain.ymin}
const step = {x: len.x/(grid.w-1), y: len.y/(grid.h-1)}
const scale = {x: (canvas.width-2*padding)/len.x, y: (canvas.height-2*padding)/len.y} // pad the domain

const xs = Array(grid.h)
const ys = Array(grid.h)
for (let i = 0; i < grid.h; i++) {
    xs[i] = Array(grid.w)
    ys[i] = Array(grid.w)
    for (let j = 0; j < grid.w; j++) {
        xs[i][j] = x_0(j)
        ys[i][j] = y_0(i)
    }
}

let t = 0; let t_prev = 0; let dt = 0

function get_color(i, j) {
    // const r = 150
    // const u = TAU*i/(grid.h - 1)
    // const v = TAU*(1 - j/(grid.w - 1))
    // return `rgb(${r*sin(u)*cos(v)}, ${r*sin(u)*sin(v)}, ${r*cos(u)})`

    const u = floor(255*i/(grid.h-1))
    const v = floor(255*(1-j/(grid.w-1)))
    return `rgb(${u}, ${v}, 130)`
}

function x_0(j) {
    return domain.xmin + j*step.x
}

function y_0(i) {
    return domain.ymin + i*step.y
}

function screen_coords(x, y) {
    return {
        x: (x - domain.xmin) * scale.x + padding,
        y: (y + domain.ymax) * scale.y + padding
    }
}

const bg_color = "rgb(20, 24, 48)"
document.body.style.backgroundColor = bg_color
ctx.fillStyle = "rgba(0, 0, 0, 0.08)"
ctx.lineWidth = 4
ctx.lineCap = "round"
function anim(t_m) {
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    t_prev = t
    t = t_m == undefined ? 0 : t_m*0.001;
    dt = t-t_prev
    
    for (let i = 0; i < grid.h; i++) {
        for (let j = 0; j < grid.w; j++) {
            let x = xs[i][j]
            let y = ys[i][j]
            
            ctx.beginPath()
            ctx.strokeStyle = get_color(i, j)
            if (x > domain.xmax || x < domain.xmin ||
                y > domain.ymax || y < domain.ymin) {
                // console.log("out of domain", x, y)
                xs[i][j] = x_0(j)
                ys[i][j] = y_0(i)
                
                const s = screen_coords(xs[i][j], ys[i][j])
                ctx.moveTo(s.x, s.y)
                ctx.lineTo(s.x, s.y)
                ctx.stroke()
                continue
            }
    
            const s_0 = screen_coords(x, y)
            ctx.moveTo(s_0.x, s_0.y)
    
            const v = f(t, x, y)
            x += v.x*dt
            y += v.y*dt
            const s = screen_coords(x, y)
            ctx.lineTo(s.x, s.y)
            ctx.stroke()
            xs[i][j] = x
            ys[i][j] = y
        }
    }
        
    requestAnimationFrame(anim)
}

anim()