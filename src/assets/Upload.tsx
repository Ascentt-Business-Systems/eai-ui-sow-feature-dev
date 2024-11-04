import { useTheme } from "@mui/material";
const Upload = (props: any) => {
  const theme = useTheme();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      height={props.height ?? 24}
      width={props.width ?? 24}
      fill={props.color ?? theme.palette.text.primary}
      {...props}
    >
      <path d="M4 19H20V12H22V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V12H4V19ZM13 9V16H11V9H6L12 3L18 9H13Z" />
    </svg>
  );
};
export default Upload;
