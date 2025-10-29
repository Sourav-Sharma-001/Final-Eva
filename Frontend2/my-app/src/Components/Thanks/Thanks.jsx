import React, { useEffect, useState } from "react";
import "./Thanks.css";

export default function Thanks() {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const timer =
      count > 0 &&
      setInterval(() => {
        setCount((prev) => prev - 1);
      }, 1000);

    return () => clearInterval(timer);
  }, [count]);

  useEffect(() => {
    if (count === 0) {
      // redirect or perform any action
      console.log("Redirecting...");
    }
  }, [count]);

  return (
    <div className="thanks-wrapper">
      <div className="thanks-content">
        <h1>Thanks For Ordering</h1>
        <div className="checkmark">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="3rem"
            height="3rem"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="redirect">Redirecting in {count}</p>
      </div>
    </div>
  );
}
