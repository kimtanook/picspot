const Dropdown = (props: any) => {
  return <article>{props.visibility && props.children}</article>;
};

export default Dropdown;
