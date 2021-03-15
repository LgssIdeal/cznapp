import React from 'react';

const Logo = (props) => {
  return (
    <img
      alt="Logo"
      src="/static/logo.png"
      width="10%"
      height="10%"
      {...props}
    />
  );
};

export default Logo;
