import React from "react";
import {
  Footer,
  FooterBrand,
  FooterCopyright,
  FooterDivider,
  FooterIcon,
  FooterLink,
  FooterLinkGroup,
  FooterTitle,
} from "flowbite-react";
import logo from '../assets/logo.png'
import { BsFacebook, BsInstagram, BsTwitter } from "react-icons/bs";

//This Component Was named F_ooter to avoid confusion with the Footer tag used in it
export default function F_ooter() {
  return (
    <Footer container>
      <div className="w-full">
        <div className="w-full flex md:flex-row flex-col justify-between md:gap-32">
          <div>
            <FooterBrand
              href={logo}
              src={logo}
              alt="QmsApp Logo"
              name="QmsApp"
            />
          </div>
          <div className="w-full">
            <div className="w-full ">
              <FooterTitle />
              <div className="w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3109.511189172022!2d-7.674896784695606!3d33.57312224193484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda671e2f7c6f6f1%3A0x21c80b3cf86b3a45!2sTechnopark!5e0!3m2!1sen!2sus!4v1653815103666!5m2!1sen!2sus"
                  width="100%"
                  height="300"
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
        <FooterDivider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <FooterCopyright href="#" by="QmsApp" year={2024} />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <FooterIcon href="#" icon={BsFacebook} />
            <FooterIcon href="#" icon={BsInstagram} />
            <FooterIcon href="#" icon={BsTwitter} />
          </div>
        </div>
      </div>
    </Footer>
  );
}
