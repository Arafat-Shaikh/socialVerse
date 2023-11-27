import { formatDistanceToNow } from "date-fns";

const useFormatDate = () => {
  function formatDate(createdAt) {
    let formattedDate = formatDistanceToNow(new Date(createdAt)).split(" ");

    if (formattedDate.includes("less")) {
      return "now";
    } else {
      formattedDate = formattedDate.filter((word) => word !== "about");
      formattedDate = formattedDate[0] + formattedDate[1][0];
      return formattedDate;
    }
  }
  return { formatDate };
};

export default useFormatDate;
