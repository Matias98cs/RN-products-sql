import { Link, LinkProps } from "expo-router";
import { useThemeColor } from "../hooks/useThemeColor";

interface Props extends LinkProps {}

const ThemedLink = ({ style, ...rest }: Props) => {
  const secundaryColor = useThemeColor({}, "secundary");
  return (
    <Link
      style={[
        {
          color: secundaryColor,
        },
        style,
      ]}
      {...rest}
    />
  );
};

export default ThemedLink;
