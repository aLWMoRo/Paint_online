import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import '../styles/canvas.scss';
import Brush from '../tools/Brush';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useParams } from 'react-router-dom';
import Rect from '../tools/Rect';
import axios from 'axios';
import Circle from '../tools/Circle';
import Line from '../tools/Line';
import Eraser from '../tools/Eraser';

const Canvas = observer(() =>
{

  const canvasRef = useRef();
  const usernameRef = useRef();
  const [modal, setModal] = useState(true);
  const params = useParams();

  // console.log(params);

  useEffect(() =>
  {
    if (canvasState.username)
    {
      const socket = new WebSocket(`ws://localhost:8080/`);
      canvasState.setSocket(socket);
      canvasState.setSessionid(params.id);
      toolState.setTool(new Brush(canvasRef.current, socket, params.id));
      socket.onopen = () =>
      {
        console.log('Подключение установленно');
        socket.send(JSON.stringify(
          {
            id: params.id,
            username: canvasState.username,
            method: 'connection'
          }))
      }
      socket.onmessage = (event) =>
      {
        let msg = JSON.parse(event.data);
        // console.log(msg);
        switch (msg.method)
        {
          case 'connection':
            console.log(`Пользователь ${msg.username} подключился`);
            break;
          case 'draw':
            drawHandler(msg);
            break; 
        }
      }
    }
  }, [canvasState.username]);

  useEffect(() =>
  {
    // console.log(canvasRef.current)
    let ctx = canvasRef.current.getContext('2d');
    canvasState.setCanvas(canvasRef.current);
    axios.get(`http://localhost:8080/image?id=${params.id}`)
      .then(response =>
        {
          const img = new Image();
          img.src = response.data;
          img.onload = async () =>
          {
              ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
              ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
          }
        })
  }, [])

  const mouseDownHandler = () =>
  {
    canvasState.pushToUndo(canvasRef.current.toDataURL());
    axios.post(`http://localhost:8080/image?id=${params.id}`, {img: canvasRef.current.toDataURL()})
      .then(response => console.log(response.status));
  }

  const connectionHandler = () =>
  {
    canvasState.setUsername(usernameRef.current.value);
    setModal(false);
  }
  const drawHandler = (msg) =>
  {
    const figure = msg.figure;
    const ctx = canvasRef.current.getContext('2d');
    console.log(figure)
    switch (figure.type)
    {
      case 'brush':
        Brush.draw(ctx, figure.x, figure.y, figure.color, figure.lineWidth);
        break;
      case 'rect':
        Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color, figure.border, figure.lineWidth);
        break;
      case 'circle':
        Circle.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color, figure.border, figure.lineWidth);
        break;
      case 'eraser':
        Eraser.draw(ctx, figure.x, figure.y, figure.lineWidth);
        break;
      case 'line':
        Line.staticDraw(ctx, figure.x, figure.y, figure.color, figure.lineWidth);
        break;
      case 'finish':
        ctx.beginPath();
        break;
    }
  }

  return (
    <div className="canvas">
      <Modal show={modal} onHide={() => {}}>
        <Modal.Header closeButton>
          <Modal.Title>Введите ваше имя</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" ref={usernameRef} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => connectionHandler()}>
            Войти
          </Button>
        </Modal.Footer>
      </Modal>
      <canvas onMouseDown={() => mouseDownHandler()} ref={canvasRef} width={800} height={600} />
    </div>
  );
});

export default Canvas;