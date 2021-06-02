const sizeMap = {
  small: 5,
  medium: 10,
  large: 15,
  xlarge: 20,
};

type Props = {
  type: "row" | "column";
  size: "small" | "medium" | "large" | "xlarge";
};

const Spacer = (props: Props) => {
  if (props.type === "column") {
    return (
      <div
        style={{
          width: sizeMap[props.size],
        }}
      />
    );
  } else {
    return (
      <div
        style={{
          height: sizeMap[props.size],
        }}
      />
    );
  }
};

export default Spacer;
