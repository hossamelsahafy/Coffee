import Image from "next/image";

const ImageSlide = ({ item }) => {
  return (
    <div className="flex justify-center items-center w-full">
      <Image
        src={item.image}
        alt="product"
        width={400}
        height={400}
        className="object-contain"
      />
    </div>
  );
};

export default ImageSlide;
