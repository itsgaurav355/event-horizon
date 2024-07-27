import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { auth, fireDB } from "../firebase/firbaseConfig";
import { doc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { eventFormData } from "../context/EventFormData";
import { useContext, useEffect, useState } from "react";
import { redirectPaymentGateway } from "../../services/razorpayService";
import { useAuthState } from "react-firebase-hooks/auth";
import { addDoc, collection } from "firebase/firestore";
import CryptoJS from "crypto-js";

export const themeJson = {
  backgroundImage: "",
  backgroundImageFit: "cover",
  backgroundImageAttachment: "scroll",
  backgroundOpacity: 1,
  themeName: "sharp",
  colorPalette: "light",
  isPanelless: false,
  cssVariables: {
    "--sjs-general-backcolor": "rgba(255, 255, 255, 1)",
    "--sjs-general-backcolor-dark": "rgba(228, 228, 228, 1)",
    "--sjs-general-backcolor-dim": "#ffffff",
    "--sjs-general-backcolor-dim-light": "rgba(238, 238, 238, 1)",
    "--sjs-general-backcolor-dim-dark": "rgba(220, 220, 220, 1)",
    "--sjs-general-forecolor": "rgba(0, 0, 0, 0.91)",
    "--sjs-general-forecolor-light": "rgba(0, 0, 0, 0.6)",
    "--sjs-general-dim-forecolor": "rgba(0, 0, 0, 0.91)",
    "--sjs-general-dim-forecolor-light": "rgba(0, 0, 0, 0.6)",
    "--sjs-primary-backcolor": "rgba(103, 58, 176, 1)",
    "--sjs-primary-backcolor-light": "rgba(103, 58, 176, 0.1)",
    "--sjs-primary-backcolor-dark": "rgba(69, 24, 142, 1)",
    "--sjs-primary-forecolor": "rgba(255, 255, 255, 1)",
    "--sjs-primary-forecolor-light": "rgba(255, 255, 255, 0.25)",
    "--sjs-base-unit": "8px",
    "--sjs-corner-radius": "4px",
    "--sjs-secondary-backcolor": "rgba(255, 152, 20, 1)",
    "--sjs-secondary-backcolor-light": "rgba(255, 152, 20, 0.1)",
    "--sjs-secondary-backcolor-semi-light": "rgba(255, 152, 20, 0.25)",
    "--sjs-secondary-forecolor": "rgba(255, 255, 255, 1)",
    "--sjs-secondary-forecolor-light": "rgba(255, 255, 255, 0.25)",
    "--sjs-shadow-small": "0px 0px 0px 1px rgba(0, 0, 0, 0.2)",
    "--sjs-shadow-small-reset": "0px 0px 0px 0px rgba(0, 0, 0, 0.2)",
    "--sjs-shadow-medium": "0px 2px 6px 0px rgba(0, 0, 0, 0.1)",
    "--sjs-shadow-large": "0px 8px 16px 0px rgba(0, 0, 0, 0.1)",
    "--sjs-shadow-inner": "0px 0px 0px 1px rgba(0, 0, 0, 0.25)",
    "--sjs-shadow-inner-reset": "0px 0px 0px 0px rgba(0, 0, 0, 0.25)",
    "--sjs-border-light": "rgba(0, 0, 0, 0.25)",
    "--sjs-border-default": "rgba(0, 0, 0, 0.25)",
    "--sjs-border-inside": "rgba(0, 0, 0, 0.16)",
    "--sjs-special-red": "rgba(229, 10, 62, 1)",
    "--sjs-special-red-light": "rgba(229, 10, 62, 0.1)",
    "--sjs-special-red-forecolor": "rgba(255, 255, 255, 1)",
    "--sjs-special-green": "rgba(25, 179, 148, 1)",
    "--sjs-special-green-light": "rgba(25, 179, 148, 0.1)",
    "--sjs-special-green-forecolor": "rgba(255, 255, 255, 1)",
    "--sjs-special-blue": "rgba(67, 127, 217, 1)",
    "--sjs-special-blue-light": "rgba(67, 127, 217, 0.1)",
    "--sjs-special-blue-forecolor": "rgba(255, 255, 255, 1)",
    "--sjs-special-yellow": "rgba(255, 152, 20, 1)",
    "--sjs-special-yellow-light": "rgba(255, 152, 20, 0.1)",
    "--sjs-special-yellow-forecolor": "rgba(255, 255, 255, 1)",
    "--sjs-article-font-xx-large-textDecoration": "none",
    "--sjs-article-font-xx-large-fontWeight": "700",
    "--sjs-article-font-xx-large-fontStyle": "normal",
    "--sjs-article-font-xx-large-fontStretch": "normal",
    "--sjs-article-font-xx-large-letterSpacing": "0",
    "--sjs-article-font-xx-large-lineHeight": "64px",
    "--sjs-article-font-xx-large-paragraphIndent": "0px",
    "--sjs-article-font-xx-large-textCase": "none",
    "--sjs-article-font-x-large-textDecoration": "none",
    "--sjs-article-font-x-large-fontWeight": "700",
    "--sjs-article-font-x-large-fontStyle": "normal",
    "--sjs-article-font-x-large-fontStretch": "normal",
    "--sjs-article-font-x-large-letterSpacing": "0",
    "--sjs-article-font-x-large-lineHeight": "56px",
    "--sjs-article-font-x-large-paragraphIndent": "0px",
    "--sjs-article-font-x-large-textCase": "none",
    "--sjs-article-font-large-textDecoration": "none",
    "--sjs-article-font-large-fontWeight": "700",
    "--sjs-article-font-large-fontStyle": "normal",
    "--sjs-article-font-large-fontStretch": "normal",
    "--sjs-article-font-large-letterSpacing": "0",
    "--sjs-article-font-large-lineHeight": "40px",
    "--sjs-article-font-large-paragraphIndent": "0px",
    "--sjs-article-font-large-textCase": "none",
    "--sjs-article-font-medium-textDecoration": "none",
    "--sjs-article-font-medium-fontWeight": "700",
    "--sjs-article-font-medium-fontStyle": "normal",
    "--sjs-article-font-medium-fontStretch": "normal",
    "--sjs-article-font-medium-letterSpacing": "0",
    "--sjs-article-font-medium-lineHeight": "32px",
    "--sjs-article-font-medium-paragraphIndent": "0px",
    "--sjs-article-font-medium-textCase": "none",
    "--sjs-article-font-default-textDecoration": "none",
    "--sjs-article-font-default-fontWeight": "400",
    "--sjs-article-font-default-fontStyle": "normal",
    "--sjs-article-font-default-fontStretch": "normal",
    "--sjs-article-font-default-letterSpacing": "0",
    "--sjs-article-font-default-lineHeight": "28px",
    "--sjs-article-font-default-paragraphIndent": "0px",
    "--sjs-article-font-default-textCase": "none",
  },
};

function CustomForm() {
  const param = useParams();
  const [user, user_loading] = useAuthState(auth);

  const navigate = useNavigate();
  const { setFormData } = useContext(eventFormData);
  const [data, loading] = useDocumentData(doc(fireDB, "events", param.eventid));
  const [uid, setUid] = useState(" ");
  const [feildvalues] = useDocumentData(doc(fireDB, "users", uid));

  useEffect(() => {
    if (user) {
      setUid(user.uid);
    }
  }, [user]);

  if (!loading) {
    const survey = new Model(data.form);
    survey.data = feildvalues;
    survey.applyTheme(themeJson);
    survey.completedHtml = "";
    survey.onComplete.add((sender) => {
      console.log(sender.data);
      setFormData(sender.data);
      if (Number(data.price) > 0) {
        redirectPaymentGateway(
          Number(data.price * (sender.data.no_of_members || 1)),
          data.event_name,
          user.uid,
          param.eventid,
          data.event_image,
          data.college + "|" + data.venue,
          data.date,
          data.time.start + " - " + data.time.end,
          sender.data
        );
        setTimeout(() => {
          navigate("/payments&regestrations");
        }, 3000);
      } else {
        const register = async () => {
          const IST = new Date().toLocaleString("en-US", {
            timeZone: "Asia/Kolkata",
          });

          const ISTDate = new Date(IST);
          const formattedDate = ISTDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
          await addDoc(
            collection(fireDB, "users", uid, "paymentsandRegistrations"),
            {
              event_name: data.event_name,
              status: "success",
              amount: data.price,
              day: formattedDate,
            }
          );
          await addDoc(collection(fireDB, "users", uid, "passes"), {
            user: user.uid,
            event_image: data.event_image,
            event_name: data.event_name,
            event_date: data.date,
            event_time: data.time.start + " - " + data.time.end,
            event_venue: data.college + " | " + data.venue,
            qrcode: CryptoJS.SHA256(
              JSON.stringify({
                amount: data.price,
                user: uid,
                event_image: data.event_image,
                event_name: data.event_name,
                event_date: data.date,
                event_time: data.time.start + " - " + data.time.end,
                event_venue: data.college + " | " + data.venue,
              })
            ).toString(),
          });
          await addDoc(
            collection(fireDB, "events", param.eventid, "generatedPasses"),
            {
              user: uid,
              qrcode: CryptoJS.SHA256(
                JSON.stringify({
                  amount: data.price,
                  user: uid,
                  event_image: data.event_image,
                  event_name: data.event_name,
                  event_date: data.date,
                  event_time: data.time.start + " - " + data.time.end,
                  event_venue: data.college + " | " + data.venue,
                })
              ).toString(),
            }
          );
          await addDoc(
            collection(fireDB, "events", param.eventid, "registration"),
            {
              ...sender.data,
              price: data.price,
            }
          );
        };
        register();
        navigate("/payments&regestrations");
      }
    });

    return <Survey model={survey} />;
  }
}

export default CustomForm;
