import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import StarRating from "@/components/StarRating";

export default function ProductSlider({ products = [] }) {
  if (!products.length) return null;

  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        className="pb-12"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <SliderCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

function SliderCard({ product }) {
  const discountedPrice = product.price
    ? (
        product.price -
        (product.price * (product.discountPercentage || 0)) / 100
      ).toFixed(2)
    : null;

  return (
    <Link href={`/products/${product.id}`} className="block group">
      <div className="card">
        <div className="relative overflow-hidden aspect-[4/3] bg-dark-700">
          <Image
            src={product.thumbnail || product.images?.[0] || "https://placehold.co/400x300/12121a/f97316?text=Product"}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {product.discountPercentage > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
              -{Math.round(product.discountPercentage)}%
            </div>
          )}
        </div>
        <div className="p-4 space-y-2">
          {product.category && (
            <span className="badge-category text-xs">{product.category}</span>
          )}
          <h3 className="text-white text-sm font-semibold line-clamp-2 group-hover:text-primary-300 transition-colors">
            {product.title}
          </h3>
          {product.rating && <StarRating rating={product.rating} size={12} />}
          <div className="flex items-center gap-2">
            <span className="text-primary-400 font-bold">
              ${discountedPrice || product.price}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-white/30 text-xs line-through">
                ${product.price}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
