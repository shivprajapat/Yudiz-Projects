import React from 'react'
import Link from 'next/link'
import style from "./style.module.scss";
import { Wrapper, Description } from '@/shared/components'

const About = () => {
    const { about } = style;
    return (
        <Wrapper Orange>
            <section className={`banner-padding ${about}`}>
                <Description title='About JOJO'>
                    <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using &apos;Content here, content here&apos;, making it look like readable English. Many desktop publishing packages and web page editors now.It is a long established fact.</p>
                    <p><span>Seamless video playback:</span>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using &apos;Content here, content here&apos;, making it look like readable English. Many desktop publishing packages and web page editors now.It is a long established fact.</p>
                    <p><span>Smart Search:</span>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using &apos;Content here, content here&apos;, making it look like readable English. .</p>
                    <p><span>Friendly User Interface:</span> It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using &apos;Content here, content here&apos;, making it look like readable English. </p>
                    <p><span>Hot Content Catalog:</span> Lorem ipsum dolor sit amet consectetur. Various accumsan ante donec metus felis at facilisi egestas. Semper tortor accumsan venenatis et facilisi. Lobortis maecenas enim netus sed. Viverra suscipit posuere commodo sit in sit. Bibendum adipiscing adipiscing sed sem massa egestas. Habitant feugiat enim venenatis euismod eget sed scelerisque nibh. Ut arcu duis sed sed. Consequat tempus congue risus bibendum sit feugiat. Massa feugiat justo morbi et elit iaculis magna commodo fringilla. Aenean eu sagittis justo etiam tellus auctor nunc. Luctus pellentesque nam aliquam in nibh elit ultricies augue. Arcu feugiat lorem nec gravida massa viverra. Laoreet pretium pharetra blandit tellus sed. Nunc morbi gravida adipiscing lorem sit nunc. Vulputate sit tortor in..</p>
                </Description>

                <Description title='Support'>
                    <p>If you have any queries, suggestion, or operational/ technical issues, please reach out to us at <Link href="/support@jojo.com">support@jojo.com</Link></p>
                </Description>
            </section>
        </Wrapper>
    )
}
export default About