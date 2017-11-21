import React from 'react';
import { Link } from 'react-router-dom';
import './BreadCrumbs.scss';

function renderList(list) {
  return list.map((data) => {
    return (
      <Link to={data.url} key={data.url} className="breadcrumb">{data.name}</Link>
    );
  });
}
function getBreadCrumbs(url) {

  const targets = url.split('/').filter(Boolean);
  targets.unshift('');

  return targets.map((crumb, i, arr) => {
    let p = arr.slice(0, i + 1).join('/');
    if (i === 0) p = '/';

    crumb = (i === 0) ? 'HOME' : crumb;
    return {
      name: crumb.toUpperCase(),
      url: p
    };
  });
}

export default ({ url }) => {
  return (
    <div className="breadCrumbs">
      <nav className="clean">
        <div className="nav-wrapper">
          <div className="link_list col s12">
            {renderList(getBreadCrumbs(url))}
          </div>
        </div>
      </nav>
    </div>
  );
};
