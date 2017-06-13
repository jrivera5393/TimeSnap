/* jshint esversion: 6 */

import React from 'react';
import {render} from 'react-dom';
import axios from "axios";
import * as constants from "./common/constants.js";

//Pages components
import HomeApp from './components/home-app.jsx';

// Stopwatch's Components
import StopwatchManagerComponent from './components/stopwatch/stopwatch-manager.jsx';
import StopwatchComponent from './components/stopwatch/stopwatch.jsx';
import StopwatchListComponent from './components/stopwatch/stopwatch-list.jsx';

// Task's Components
import TaskManagerComponent from './components/task/task-manager.jsx';
import TaskComponent from './components/task/task.jsx';
import TaskListComponent from './components/task/task-list.jsx';