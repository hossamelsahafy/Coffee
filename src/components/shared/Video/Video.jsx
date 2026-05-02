import React from 'react'

const Video = ({ src, linear, rounded }) => {
  return (
    <div>
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className={`absolute inset-0 w-full h-full object-cover ${rounded ? 'rounded-lg ' : ''}`}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={
          linear
            ? {
                background: `
            linear-gradient(358.82deg, #040404 0.95%, rgba(106, 89, 61, 0) 83.76%),
            linear-gradient(71.98deg, #262626 -1.41%, rgba(106, 89, 61, 0) 30.34%)
          `,
              }
            : undefined
        }
      />
    </div>
  )
}

export default Video
