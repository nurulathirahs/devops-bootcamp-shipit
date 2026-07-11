import { ship } from './config.js';
import { createScene } from './scene.js';
import './style.css';

const app = document.getElementById('app');
document.title = `${ship.shipName} — Ship`;

const stage = document.createElement('div');
stage.className = 'stage';
app.append(stage);
createScene(stage, ship);
