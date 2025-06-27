// __mocks__/next/image.tsx
import React from "react";

const MockImage = (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    return <img {...props} />;
};

export default MockImage;
