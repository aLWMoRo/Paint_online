import Canvas from './components/Canvas';
import SettingBar from './components/SettingBar';
import Toolbar from './components/Toolbar';
import './styles/app.scss';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

const App = () =>
{
  return (
    <BrowserRouter>
      <div className="app">
      <Routes>
        <Route path="/:id" element={[<Toolbar key={Date.now()} />, <SettingBar key={Date.now()+1} />, <Canvas key={Date.now()+2} />]}/>
        <Route path="/" element={<Navigate to={`/f${(+new Date()).toString(16)}`} replace={true} />} />
      </Routes>
     </div> 
    </BrowserRouter>
  );
}

export default App;
