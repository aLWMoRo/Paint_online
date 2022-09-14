import toolState from '../store/toolState';
import '../styles/toolbar.scss';

const SettingBar = () =>
{
  return (
    <div className="setting-bar">
      <label htmlFor="line-width">Тольщина линии</label>
      <input id="line-width" className="setting-bar_input" type="number" defaultValue={1} min={1} max={50} onChange={e => toolState.setLineWidth(e.target.value)} />
      <label htmlFor="stroke-color">Цвет обводки</label>
      <input id="stroke-color" className="setting-bar_input" type="color" onChange={e => toolState.setStrokeColor(e.target.value)} />
    </div>
  );
}

export default SettingBar;