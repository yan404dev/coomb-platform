interface BubbleTailProps {
  isUser: boolean;
}

export function BubbleTail({ isUser }: BubbleTailProps) {
  if (isUser) {
    return (
      <span className="absolute bottom-0 -right-[2px] h-[13px] w-[8px]">
        <svg
          width="12"
          height="15"
          viewBox="0 0 12 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.1614 14.1304C7.44173 10.1227 6.28753 6.66791 6.05038 2.11758C6.02292 1.59068 5.28874 1.42252 5.05279 1.89443L0.183314 11.6334C0.0767245 11.8466 0.134722 12.1064 0.32866 12.245C3.46666 14.4867 7.80603 14.9142 10.7934 14.9865C11.2387 14.9973 11.4644 14.4569 11.1614 14.1304Z"
            fill="url(#userGradient)"
          />
          <defs>
            <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
          </defs>
        </svg>
      </span>
    );
  }

  return (
    <span
      className="absolute bottom-0 -left-[2px] h-[13px] w-[8px]"
      style={{ transform: "scaleX(-1)" }}
    >
      <svg
        width="12"
        height="15"
        viewBox="0 0 12 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.1614 14.1304C7.44173 10.1227 6.28753 6.66791 6.05038 2.11758C6.02292 1.59068 5.28874 1.42252 5.05279 1.89443L0.183314 11.6334C0.0767245 11.8466 0.134722 12.1064 0.32866 12.245C3.46666 14.4867 7.80603 14.9142 10.7934 14.9865C11.2387 14.9973 11.4644 14.4569 11.1614 14.1304Z"
          fill="#e2e8f0"
        />
      </svg>
    </span>
  );
}
