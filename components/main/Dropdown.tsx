import React from 'react';

const Dropdown = (props: {
  visibility: any;
  children:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined;
}) => {
  return (
    <article
      className={`${
        props.visibility ? 'slide-fade-in-dropdown' : 'slide-fade-out-dropdown'
      }`}
    >
      {props.visibility && props.children}
    </article>
  );
};

export default Dropdown;
