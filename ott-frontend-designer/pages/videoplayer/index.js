import Image from 'next/image';
import React from 'react'
import style from "./style.module.scss";
import { iconArrowLeft } from '@/assets/images';
import { useRouter } from 'next/router';

const VideoPlayer = () => {
  const { video_player, video_player_back } = style;
  const router = useRouter();
  const handleClick = () => {
    router.push("/");
  };

  return (
    <div className={video_player}>
      <div className={`${video_player_back} d-flex align-items-center`}>
        <Image src={iconArrowLeft} alt="" onClick={handleClick} />
        <div>
          <h5>Ashram</h5>
          <p>Ashram • S1 E1</p>
        </div>
      </div>
      <video src={"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"} autoPlay loop controls muted />
    </div>
  )
}

export default VideoPlayer
VideoPlayer.getLayout = function PageLayout(page) {
  return (
    <>
      {page}
    </>
  )
}