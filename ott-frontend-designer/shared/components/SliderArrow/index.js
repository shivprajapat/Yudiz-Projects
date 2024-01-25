import { iconArrowLeft, iconArrowRight } from "@/assets/images";
import Image from "next/image";

const SliderPrevArrow = ({ handleClick, isMoved }) => {
    return (
        <button className="prev-btn" onClick={() => handleClick("left")} style={{ display: !isMoved && "none" }}>
            <Image src={iconArrowLeft} alt="iconArrowLeft" /></button>
    )
}
const SliderNextArrow = ({ handleClick }) => {
    return (
        <button className="next-btn" onClick={() => handleClick("right")}><Image src={iconArrowRight} alt="iconArrowRight" /></button>
    )
}

export { SliderPrevArrow, SliderNextArrow }