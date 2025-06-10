import HomePage from '@/components/pages/HomePage';
import TodayPage from '@/components/pages/TodayPage';
import TasksPage from '@/components/pages/TasksPage';
import MeetingsPage from '@/components/pages/MeetingsPage';
import TeamPage from '@/components/pages/TeamPage';
import NotFoundPage from '@/components/pages/NotFoundPage';
import LoginPage from '@/components/pages/LoginPage';
import SignUpPage from '@/components/pages/SignUpPage';
export const routes = {
  home: {
    id: 'home',
    label: 'Today',
    path: '/',
    icon: 'Calendar',
component: HomePage
  },
  today: {
    id: 'today',
    label: 'Today',
    path: '/today',
    icon: 'Calendar',
component: TodayPage
  },
  tasks: {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
component: TasksPage
  },
  meetings: {
    id: 'meetings',
    label: 'Meetings',
    path: '/meetings',
    icon: 'Video',
component: MeetingsPage
  },
  team: {
    id: 'team',
    label: 'Team',
    path: '/team',
    icon: 'Users',
component: TeamPage
  },
notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '/404',
    component: NotFoundPage
  },
  login: {
    id: 'login',
    label: 'Login',
    path: '/login',
    component: LoginPage
  },
  signup: {
    id: 'signup',
    label: 'Sign Up',
    path: '/signup',
    component: SignUpPage
  }
};

export const routeArray = Object.values(routes);