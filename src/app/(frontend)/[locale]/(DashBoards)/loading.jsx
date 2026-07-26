import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <Image
        src="/assets/coffeLoading.gif"
        alt="loading"
        width={100}
        height={100}
        unoptimized
      />
    </div>
  );
}
