import { useEffect, useState } from "react";

const useInfiniteScroll = (callback) => {
    // 데이터를 갖고 올 수 있는 상태인지 여부
    // true일 때 새로운 데이터 가지고 옴
    const [isFetching, setIsFetching] = useState(false);

    const handleScroll = () => {
        const scrollTop =
            (document.documentElement && document.documentElement.scrollTop) ||
            document.body.scrollTop;
        const scrollHeight =
            (document.documentElement && document.documentElement.scrollHeight) ||
            document.body.scrollHeight;
        const clientHeight =
            document.documentElement.clientHeight || window.innerHeight;
        const scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

        if (scrolledToBottom && !isFetching) {
            setIsFetching(true);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (!isFetching)
            return;

        callback()
            .then(() => setIsFetching(false));
    }, [isFetching]);

    return [isFetching, setIsFetching];

};

export default useInfiniteScroll;