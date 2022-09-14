import Tool from "./Tool";

export default class Circle extends Tool
{
    constructor(canvas, socket, id)
    {
        super(canvas, socket, id);
        this.listen();
    }

    listen()
    {
        this.canvas.onmouseup = this.mouseUpHandler.bind(this);
        this.canvas.onmousedown = this.mouseDownHandler.bind(this);
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
    }

    mouseUpHandler(e)
    {
        this.mouseDown = false;
        this.socket.send(JSON.stringify(
        {
            method: 'draw',
            id: this.id,
            figure:
            {
                type: 'circle',
                x: this.startX,
                y: this.startY,
                width: this.width,
                height: this.height,
                color: this.ctx.fillStyle,
                border: this.ctx.strokeStyle,
                lineWidth: this.ctx.lineWidth
            }
        }));
    }
    mouseDownHandler(e)
    {
        this.mouseDown = true;
        this.ctx.beginPath();
        this.startX = e.pageX - e.target.offsetLeft;
        this.startY = e.pageY - e.target.offsetTop;
        this.saved = this.canvas.toDataURL();
    }
    mouseMoveHandler(e)
    {
        if (this.mouseDown)
        {
            let currentX = e.pageX - e.target.offsetLeft;
            let radius = currentX - this.startX;
            let startAngle = 0;
            let endAngle = 2 * Math.PI;
            let anticlockwise = true;
            this.draw(this.startX, this.startY, radius, startAngle, endAngle, anticlockwise);
        }
    }

    draw(x, y, r, sA, eA, a)
    {
        const img = new Image();
        img.src = this.saved;
        img.onload = async () =>
        {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            this.ctx.beginPath();

            this.ctx.arc(x, y, r, sA, eA, a);
            this.ctx.fill();
            this.ctx.stroke();
        }
    }

    static staticDraw(ctx, x, y, r, sA, eA, a, w, h, color, border, lineWidth)
    {
        ctx.fillStyle = color;
        ctx.strokeStyle = border;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.arc(x, y, w, h, r, sA, eA, a);
        ctx.fill();
        ctx.stroke();
    }
}