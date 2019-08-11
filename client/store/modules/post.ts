/* ACTION TYPES */
const GET_POSTS = 'GET_POSTS';
const GET_POSTS_SUCCESS = 'GET_POSTS_SUCCESS';
const GET_POSTS_FAIL = 'GET_POSTS_FAIL';

/* ACTION CREATORS */
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const mockData = [
  {
    id: 0,
    img: 'static/images/mock-image1.jpg',
    title: 'Sed ut perspiciatis unde omnis iste natus error sit',
    author: 'Seongwoon Hong',
    username: 'shong91',
    comments: 15,
  },
  {
    id: 1,
    img: 'static/images/mock-image2.jpg',
    title: 'Pudding Dessert Jelly Fruitcake Tart Wfer Candy Chocolate',
    author: 'Seongwoon Hong',
    username: 'shong91',
    comments: 5,
  },
  {
    id: 2,
    img: null,
    title: 'adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem',
    author: 'Seongwoon Hong',
    username: 'shong91',
    comments: 5,
  },
  {
    id: 3,
    img: null,
    title: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?',
    author: 'Seongwoon Hong',
    username: 'shong91',
    comments: 6,
  },
  {
    id: 4,
    img: 'static/images/mock-image2.jpg',
    title: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur',
    author: 'Seongwoon Hong',
    username: 'shong91',
    comments: 0,
  },
  {
    id: 5,
    img: 'static/images/mock-image3.jpg',
    title: 'Sed ut perspiciatis unde omnis iste natus error sit',
    author: 'Seongwoon Hong',
    username: 'shong91',
    comments: 7,
  },
  {
    id: 6,
    img: 'static/images/mock-image5.jpg',
    title: 'Sed ut perspiciatis unde omnis iste natus error sit',
    author: 'Seongwoon Hong',
    username: 'shong91',
    comments: 21,
  },
  {
    id: 7,
    img: 'static/images/mock-image2.jpg',
    title: 'Sed ut perspiciatis unde omnis iste natus error sit',
    author: 'Seongwoon Hong',
    username: 'shong91',
    comments: 2,
  },
  {
    id: 8,
    img: 'static/images/mock-image5.jpg',
    title: 'Sed ut perspiciatis unde omnis iste natus error sit',
    author: 'Seongwoon Hong',
    username: 'shong91',
    comments: 1,
  },
  {
    id: 9,
    img: 'static/images/mock-image4.jpg',
    title: 'Sed ut perspiciatis unde omnis iste natus error sit',
    author: 'Seongwoon Hong',
    username: 'shong91',
    comments: 2,
  }
];

export const getPosts = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: GET_POSTS });
      await sleep(4000);

      return dispatch({
        type: GET_POSTS_SUCCESS,
        payload: mockData,
      })
    } catch (e) {
      dispatch({
        type: GET_POSTS_FAIL
      })
      console.log(e);
      throw new Error(e);
    }
  }
};

const initialState = {
  isLoading: false,
  posts: [],
}
/* REDUCER */
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_POSTS:
      return {
        ...state,
        isLoading: true,
      }
    case GET_POSTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        posts: action.payload,
      }
    case GET_POSTS_FAIL:
      return {
        ...state,
        isLoading: false,
      }
    default:
      return state;
  }
};
