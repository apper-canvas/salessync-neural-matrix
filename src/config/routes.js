import Home from '../pages/Home';
import Today from '../pages/Today';
import Tasks from '../pages/Tasks';
import Meetings from '../pages/Meetings';
import Team from '../pages/Team';
import NotFound from '../pages/NotFound';

export const routes = {
  home: {
    id: 'home',
    label: 'Today',
    path: '/',
    icon: 'Calendar',
    component: Home
  },
  today: {
    id: 'today',
    label: 'Today',
    path: '/today',
    icon: 'Calendar',
    component: Today
  },
  tasks: {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
    component: Tasks
  },
  meetings: {
    id: 'meetings',
    label: 'Meetings',
    path: '/meetings',
    icon: 'Video',
    component: Meetings
  },
  team: {
    id: 'team',
    label: 'Team',
    path: '/team',
    icon: 'Users',
    component: Team
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '/404',
    component: NotFound
  }
};

export const routeArray = Object.values(routes);