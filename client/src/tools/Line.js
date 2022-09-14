import Tool from "./Tool";

export default class Line extends Tool
{
    constructor(canvas, socket, id)
    {
        super(canvas, socket, id);
        this.listen();
        this.name = 'Line';
    }

    listen()
    {
        this.canvas.onmouseup = this.mouseDownHandler.bind(this);
        this.canvas.onmousedown = this.mouseUpHandler.bind(this);
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
                type: 'line',
                x: this.startX,
                y: this.startY,
                width: this.width,
                height: this.height,
                color: this.ctx.fillStyle,
                lineWidth: this.ctx.lineWidth
            }
        }));
    }

    mouseDownHandler(e)
    {
        this.mouseDown = true;
        this.currentX = e.pageX - e.target.offsetLeft;
        this.currentY = e.pageY - e.target.offsetTop;
        this.ctx.beginPath();
        this.ctx.moveTo(this.currentX, this.currentY);
        this.saved = this.canvas.toDataURL();
    }

    mouseMoveHandler(e)
    {
        if (this.mouseDown)
        {
            this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop);
        }
    }

    draw(x, y, color, lineWidth)
    {
        const img = new Image();
        img.src = this.saved;
        img.onload = async function ()
        {
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath();

            this.ctx.moveTo(this.currentX, this.currentY);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }.bind(this);
    }

    static staticDraw(ctx, x, y, color, lineWidth)
    {
        ctx.fillStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.lineTo(x, y);
        ctx.fill();
        ctx.stroke();
    }
}