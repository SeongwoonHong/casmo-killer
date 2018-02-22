// 하다가 나중에 데이터 다 제대로 받고하면 그때 할게요 귀찮네요 갑자기 ㅠㅠ..ㅋㅋㅋ
// import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
// import TimeAgo from 'react-timeago';
// import krStrings from 'react-timeago/lib/language-strings/ko';
// import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
// import './AuthorPanel.scss';
//
// const formatter = buildFormatter(krStrings);
//
// class AuthorPanel extends Component {
//   render() {
//     const { avatar, _id, displayName } = this.props.author;
//     return (
//       <div className="author-panel">
//         <img src={avatar} alt="" className="circle avatar-circle" />
//         <div className="header-info">
//           <div className="writer">
//             <div className="user-btn">
//               <Link
//                 to={`/user/info/${_id}`}
//                 >
//                 {displayName}
//               </Link>
//             </div>
//           </div>
//           <div className="created">
//             Created : <TimeAgo date={activePost.date} formatter={formatter} />
//             { activePost.updated.length > 0 && <span> (edited)</span>}
//           </div>
//         </div>
//       </div>
//     );
//   }
// }
// AuthorPanel.defaultProps = {
//   author: {
//     avatar: 'https://res.cloudinary.com/duk5vdxcc/image/upload/c_fill,h_100,w_100/v1516672455/5a6695c692f53405fa3c2990.png',
//     _id: '_id',
//     displayName: 'displayName'
//   }
// };
//
// AuthorPanel.propTypes = {
//   author: PropTypes.object
// };
// export default AuthorPanel;
