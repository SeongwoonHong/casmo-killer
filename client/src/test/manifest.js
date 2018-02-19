// components added to the manifest can be accessed in browser via /test/{componentName}

export default {
  // Button: {
  //   components: require('../components/Button/Button'),
  //   props: {
  //   }
  // },
  // RichTextEditor: {
  //   components: require('../components/RichTextEditor/RichTextEditor'),
  //   props: {}
  // },
  // ReplyOnReply: {
  //   components: require('../components/ReplyOnReply/ReplyOnReply'),
  //   props: {
  //     author: 'author',
  //     content: 'content'
  //   }
  // },
  // Tags: {
  //   components: require('../components/Tags/Tags'),
  //   props: {}
  // }
  Article: {
    component: require('../containers/Article'),
    props: {
    }
  },
  TextButton: {
    components: require('../components/Button/TextButton/TextButton'),
    props: {
      children: 'TEST'
    }
  },
  IconButton: {
    components: require('../components/Button/IconButton/IconButton'),
    props: {
      src: '../funny.jpg'
    }
  },
  ArticleNew: {
    components: require('../containers/ArticleNew'),
    props: {
    }
  },
  CommunityAll: {
    components: require('../containers/CommunityAll'),
    props: {}
  },
  BoardList: {
    components: require('../components/BoardList/BoardList'),
    props: {}
  },
  Articles: {
    components: require('../containers/Articles'),
    props: { }
  },
  Quote: {
    components: require('../components/Quote/Quote'),
    props: {
      author: 'seong1',
      quote: 'HAHAHAHAHAHA THIS IS A TEST',
      isCloseButton: true
    }
  }
};
