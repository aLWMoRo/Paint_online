import Tool from "./Tool";
import '../styles/toolbar.scss';

export default class Eraser extends Tool
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
                type: 'eraser',
                x: this.startX,
                y: this.startY,
                width: this.width,
                height: this.height,
                lineWidth: this.ctx.lineWidth
            }
        }));
    }
    mouseDownHandler(e)
    {
        this.mouseDown = true;
        this.ctx.beginPath();
    }
    mouseMoveHandler(e)
    {
        if (this.mouseDown)
        {
            this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop);
        }
    }

    draw(x, y, lineWidth)
    {
        this.ctx.lineWidth = lineWidth;
        this.ctx.strokeStyle = "white";
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }
}