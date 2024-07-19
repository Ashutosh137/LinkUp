const convertTime = (date: Date): string => {
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const messagedate = new Date(date)
    const dateInSeconds = Math.floor(messagedate.getTime() / 1000);
    const differenceInSeconds = currentTimeInSeconds - dateInSeconds;

    if (differenceInSeconds < 10) {
        return "Just now";
    } else if (differenceInSeconds < 60) {
        return `${differenceInSeconds} sec${differenceInSeconds > 1 ? "s" : ""}`;
    } else if (differenceInSeconds < 3600) {
        const minutes = Math.floor(differenceInSeconds / 60);
        return `${minutes} min${minutes > 1 ? "s" : ""}`;
    } else if (differenceInSeconds < 86400) {
        const hours = Math.floor(differenceInSeconds / 3600);
        return `${hours} hr${hours > 1 ? "s" : ""}`;
    } else {
        const dateObject = new Date(dateInSeconds * 1000);
        return dateObject.toLocaleString("en-US", {
            day: "numeric",
            month: "short",
        });
    }
};

export default convertTime;
