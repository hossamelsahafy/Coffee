import React from "react";
import Footer from "./Footer";
import GetAllData from "@/actions/GetAllData";
const FooterData = async ({ locale }) => {
  const data = await GetAllData("globals/footer", true);
  const footer = data?.footer;
  const leftImage =
    footer.leftImageSource === "Url"
      ? footer.leftImageUrl
      : footer.leftImageUpload?.url;
  const rightImage =
    footer.rightImageSource === "Url"
      ? footer.rightImageUrl
      : footer.rightImageUpload?.url;
  const title = locale === "en" ? footer.title : footer.titleAr;
  const websiteName =
    locale === "en" ? footer.websiteName : footer.websiteNameAr;
  const span = locale === "en" ? footer.span : footer.spanAr;
  const des = locale === "en" ? footer.des : footer.desAr;
  const faceBookLink = footer.faceBookLink;
  const instgramLink = footer.instgramLink;
  const whatsappLink = footer.whatsappLink;
  const xLink = footer.xLink;

  return (
    <div>
      <Footer
        locale={locale}
        leftSideImage={leftImage}
        websiteName={websiteName}
        title={title}
        span={span}
        des={des}
        FaceBookLink={faceBookLink}
        InstgramLink={instgramLink}
        WhatsappLink={whatsappLink}
        XLink={xLink}
        RightSideImage={rightImage}
      />
    </div>
  );
};

export default FooterData;
