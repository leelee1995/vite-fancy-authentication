import { useState, useEffect } from "react";

const Countdown = ({ timestamp }) => {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const calculateTime = () => {
            const now = new Date().getTime();
            const target = new Date(timestamp).getTime();
            const differenceInSeconds = Math.max(
                0,
                Math.floor((target - now) / 1000)
            );
            setSeconds(differenceInSeconds);
        };

        calculateTime();

        const timer = setInterval(calculateTime, 1000);

        return () => clearInterval(timer);
    }, [timestamp]);

    const days = Math.floor(seconds / (3600 * 24));
    const hrs = Math.floor((seconds % (3600 * 24)) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return (
        <div className="flex gap-5 text-center auto-cols-max">
            <div className="flex flex-col p-2 bg-neutral rounded-box">
                <span className="countdown font-mono text-5xl">
                    <span style={{ "--value": days }}>{days}</span>
                </span>
                days
            </div>
            <div className="flex flex-col p-2 bg-neutral rounded-box">
                <span className="countdown font-mono text-5xl">
                    <span style={{ "--value": hrs }}>{hrs}</span>
                </span>
                hours
            </div>
            <div className="flex flex-col p-2 bg-neutral rounded-box">
                <span className="countdown font-mono text-5xl">
                    <span style={{ "--value": mins }}>{mins}</span>
                </span>
                min
            </div>
            <div className="flex flex-col p-2 bg-neutral rounded-box">
                <span className="countdown font-mono text-5xl">
                    <span style={{ "--value": secs }}>{secs}</span>
                </span>
                sec
            </div>
        </div>
    );
};

export default Countdown;
