import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import krStrings from 'react-timeago/lib/language-strings/ko';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import './Board.scss';

const formatter = buildFormatter(krStrings);

class Board extends Component {
  render() {
    const {
      title, description, managerInfo, date, statsFirst, statsSecond, toURL, boardIcon, page, selected, id, mobile
    } = this.props;
    const boardIconView = (
      <div className="dataItem__icon">
        <span className="board__iconBackground">
          <img className="board__icon" src="/chat.svg" alt="chat icon" />
        </span>
      </div>
    );
    const closeAndRedirect = (
      <span
        onClick={async () => {
          await this.props.closeUserInfoModal();
          this.props.history.push(toURL);
        }}
        role="presentation"
        className="close-redirect"
        onKeyDown={() => {}}
      >
        {title}
      </span>
    );
    return (
      <div className="dataItem">
        { boardIcon === 'true' && !mobile ? boardIconView : ''}
        <div className="dataItem__main">
          <h4 className="dataItem__title">
            {
              this.props.closeAndRedirect ?
                closeAndRedirect
                :
                <Link
                  to={{
                    pathname: toURL,
                    state: { page, selected, boardOId: id }
                  }}
                >
                  {title}
                </Link>
            }
          </h4>
          {
            !mobile &&
            <div className="dataItem__description">
              <p>
                {description}
              </p>
            </div>
          }
        </div>
        <div className="dataItem__stats">
          <dl>
            <dt className="dataItem__firstStats">
              {statsFirst}
            </dt>
            <dd className="dataItem__secondStats">
              {statsSecond}
            </dd>
          </dl>
        </div>
        <div className="dataItem__manager">
          {
            !mobile &&
            <div>
              <Link
                to={{
                  pathname: `/user/info/${managerInfo[3]}`,
                  state: { userName: managerInfo[2], avatar: managerInfo[1] }
                  }}
              >
                <img className="dataItem__managerAvatar" src={managerInfo[1] || '/no-avatar.svg'} alt="manager avatar" />
              </Link>
            </div>
          }
          <div className="dataItem__managerInfo">
            <div>{managerInfo[0]}</div>
            <div>
              <Link
                to={{
                  pathname: `/user/info/${managerInfo[3]}`,
                  state: { userName: managerInfo[2], avatar: managerInfo[1] }
                  }}
              >
                {managerInfo[2]}
              </Link>
            </div>
            <div className="dataItem__managerDate"><TimeAgo date={date} formatter={formatter} /></div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Board);
