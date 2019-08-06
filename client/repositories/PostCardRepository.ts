import axios from 'axios';
import PostCardModel from 'models/PostCard';

const mockData = [
  {
    id: 0,
    img: 'static/images/mock-image1.jpg',
    title: 'Sed ut perspiciatis unde omnis iste natus error sit',
    author: 'Seongwoon Hong',
    comments: 15,
  },
  {
    id: 1,
    img: 'static/images/mock-image2.jpg',
    title: 'Pudding Dessert Jelly Fruitcake Tart Wfer Candy Chocolate',
    author: 'Seongwoon Hong',
    comments: 5,
  },
  {
    id: 2,
    img: null,
    title: 'adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem',
    author: 'Seongwoon Hong',
    comments: 5,
  },
  {
    id: 3,
    img: null,
    title: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?',
    author: 'Seongwoon Hong',
    comments: 6,
  },
  {
    id: 4,
    img: 'static/images/mock-image2.jpg',
    title: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur',
    author: 'Seongwoon Hong',
    comments: 0,
  },
  {
    id: 5,
    img: 'static/images/mock-image3.jpg',
    title: 'Sed ut perspiciatis unde omnis iste natus error sit',
    author: 'Seongwoon Hong',
    comments: 7,
  },
  {
    id: 6,
    img: 'static/images/mock-image5.jpg',
    title: 'Sed ut perspiciatis unde omnis iste natus error sit',
    author: 'Seongwoon Hong',
    comments: 21,
  },
  {
    id: 7,
    img: 'static/images/mock-image2.jpg',
    title: 'Sed ut perspiciatis unde omnis iste natus error sit',
    author: 'Seongwoon Hong',
    comments: 2,
  },
  {
    id: 8,
    img: 'static/images/mock-image5.jpg',
    title: 'Sed ut perspiciatis unde omnis iste natus error sit',
    author: 'Seongwoon Hong',
    comments: 1,
  },
  {
    id: 9,
    img: 'static/images/mock-image4.jpg',
    title: 'Sed ut perspiciatis unde omnis iste natus error sit',
    author: 'Seongwoon Hong',
    comments: 2,
  }
];

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

class PostCardRepository {
  URL: string = 'api/something/something';
  
  async getPostCards() {
    await sleep(4000); 

    return mockData;
  }
}

export default new PostCardRepository();
