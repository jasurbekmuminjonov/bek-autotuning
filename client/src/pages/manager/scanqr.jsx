import React, { useEffect, useRef, useState } from "react";
import scangif from "../../assets/scangif.gif";
import { useCreateDavomatMutation } from "../../context/services/davomat.service";
import successImg from "../../assets/success.png";
import failImg from "../../assets/fail.png";
import { Modal } from "antd";
import moment from "moment-timezone";
import { Html5Qrcode } from "html5-qrcode";

const Scanqr = () => {
  const [createDavomat] = useCreateDavomatMutation();
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("Davomat olindi");
  const qrRef = useRef(null);

  useEffect(() => {
    const qrCodeScanner = new Html5Qrcode("qr-reader");

    Html5Qrcode.getCameras().then((devices) => {
      if (devices && devices.length) {
        const cameraId = devices[0].id;

        qrCodeScanner
          .start(
            cameraId,
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
            },
            async (decodedText) => {
              try {
                const userId = decodedText.trim();
                if (!userId || userId.length < 10) {
                  throw new Error("QR kod noto‘g‘ri yoki to‘liq emas.");
                }

                const res = await createDavomat({
                  user_id: userId,
                  date: moment().tz("Asia/Tashkent").format(),
                }).unwrap();

                // Javobga qarab yozuvni o‘zgartirish
                if (res?.status === "kelgan") {
                  setSuccessText("Kelish vaqti belgilandi");
                } else if (res?.status === "ketgan") {
                  setSuccessText("Ketish vaqti belgilandi");
                } else {
                  setSuccessText("Davomat olindi");
                }

                setSuccess(true);
                setTimeout(() => {
                  setSuccess(false);
                }, 1500);
              } catch (error) {
                console.error(error);
                setFail(true);
                setErrorText(
                  error?.data?.message || error.message || "Noma'lum xatolik"
                );
                setTimeout(() => {
                  setFail(false);
                  setErrorText("");
                }, 2000);
              }
            },
            (errorMessage) => {
              console.warn("Skanerlash xatosi:", errorMessage);
            }
          )
          .catch((err) => {
            console.error("Kamerani ishga tushirib bo‘lmadi", err);
          });

        qrRef.current = qrCodeScanner;
      }
    });

    return () => {
      if (qrRef.current) {
        qrRef.current.stop().then(() => {
          qrRef.current.clear();
        });
      }
    };
  }, []);

  return (
    <div
      style={{ background: "#f9f7f1", minHeight: "100vh" }}
      className="scanqr_container"
    >
      {/* Muvaffaqiyatli modal */}
      <Modal
        title={successText}
        footer={[]}
        open={success}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img src={successImg} alt="Success" />
      </Modal>

      {/* Xatolik modal */}
      <Modal
        title="Davomatni saqlashda xatolik"
        footer={[]}
        open={fail}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img src={failImg} alt="Fail" />
        <p style={{ textAlign: "center", fontSize: "22px" }}>{errorText}</p>
      </Modal>

      {/* Kamera va skan gif */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "20px",
        }}
      >
        <p style={{ fontSize: "18px", marginBottom: "10px" }}>
          Kamerani yo'naltiring va QR kodni o'qing:
        </p>
        <div id="qr-reader" style={{ width: "300px" }}></div>
        <img
          src={scangif}
          alt="scan gif"
          style={{ marginTop: "20px", width: "100px" }}
        />
      </div>
    </div>
  );
};

export default Scanqr;
