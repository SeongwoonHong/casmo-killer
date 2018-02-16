import Home from '../components-temp/Home';
import CommunityWrapper from '../components-temp/Community';
import Restaurants from '../components-temp/Restaurants';
import QnA from '../components-temp/QnA';
import Info from '../components-temp/Info';
import User from '../components-temp/User';

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
    children: [
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
    ]
  },
  {
    name: '맛집',
    path: '/restaurants',
    icon: 'free_breakfast',
    main: Restaurants,
    children: [
      {
        name: '오늘의 맛집',
        path: '/trending'
      },
      {
        name: '랭킹',
        path: '/rank'
      }
    ]
  },
  {
    name: 'Q&A',
    path: '/qna',
    icon: 'forum',
    main: QnA,
    children: [
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
    ]
  },
  {
    name: '정보',
    path: '/info',
    icon: 'event',
    main: Info,
    children: [
      {
        name: '인기상승',
        path: '/whatever'
      },
      {
        name: '아무거나',
        path: '/whatevery'
      }
    ]
  },
  {
    name: 'User',
    path: '/user',
    main: User
  },
  {
    name: '게시글 목록',
    path: '/articles',
    main: CommunityWrapper
  },
  {
    name: '게시글',
    path: '/article',
    main: CommunityWrapper
  }
];
