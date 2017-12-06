import React from 'react';

import Home from '../components/Home';
import CommunityWrapper from '../components/Community/index';
import Restaurants from '../components/Restaurants';
import QnA from '../components/QnA';
import Info from '../components/Info';

import SubMenu from '../components/Navigations/MainMenu/SubMenu/SubMenu';
import Login from '../components/Login/Login';
import Register from '../components/Register/Register';

const CommunityRoutes = [
  {
    name: '자유게시판',
    path: '/free'
  },
  {
    name: '나의 커뮤니티',
    path: '/mycommunity'
  },
  {
    name: '즐겨찾기',
    path: '/favourites'
  },
  {
    name: '커뮤니티 All',
    path: '/communityAll'
  }
];

const RestaurantsRoutes = [
  {
    name: '오늘의 맛집',
    path: '/trending'
  },
  {
    name: '랭킹',
    path: '/rank'
  }
];

const QnARoutes = [
  {
    name: '최신질문',
    path: '/recent'
  },
  {
    name: '내 질문',
    path: '/myquestions'
  },
  {
    name: '내 답변',
    path: '/myanswers'
  }
];

const InfoRoutes = [
  {
    name: '인기상승',
    path: '/whatever'
  },
  {
    name: '아무거나',
    path: '/whatevery'
  }
];

export const MainMenuRoutes = [
  {
    path: '/',
    exact: true,
    main: Home
  },
  {
    name: '커뮤니티',
    path: '/community',
    icon: 'group',
    main: CommunityWrapper,
    subMenu: ({ match }) => {
      return (
        <SubMenu
          match={ match }
          title="커뮤니티"
          items={ CommunityRoutes }
        />
      );
    }
  },
  {
    name: '맛집',
    path: '/restaurants',
    icon: 'free_breakfast',
    main: Restaurants,
    subMenu: ({ match }) => {
      return (
        <SubMenu
          match={ match }
          title="맛집"
          items={ RestaurantsRoutes }
        />
      );
    }
  },
  {
    name: 'Q&A',
    path: '/qna',
    icon: 'forum',
    main: QnA,
    subMenu: ({ match }) => {
      return (
        <SubMenu
          match={ match }
          title="Q&A"
          items={ QnARoutes }
        />
      );
    }
  },
  {
    name: '정보',
    path: '/info',
    icon: 'event',
    main: Info,
    subMenu: ({ match }) => {
      return (
        <SubMenu
          match={ match }
          title="정보"
          items={ InfoRoutes }
        />
      );
    }
  },
  {
    path: '/login',
    main: Login
  },
  {
    path: '/register',
    main: Register
  }
];
