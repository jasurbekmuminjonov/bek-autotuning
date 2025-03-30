import React, { useState } from 'react';
import scangif from '../../assets/scangif.gif'
import { useCreateDavomatMutation } from '../../context/services/davomat.service';
import successImg from '../../assets/success.png'
import failImg from '../../assets/fail.png'
import { Modal } from "antd";
import moment from "moment-timezone"


const Scanqr = () => {
    const [createDavomat] = useCreateDavomatMutation()
    const [success, setSuccess] = useState(false)
    const [fail, setFail] = useState(false)
    const [errorText, setErrorText] = useState("")
    console.log(errorText);

    return (
        <div style={{ background: "#f9f7f1" }} className='scanqr_container'>
            <Modal title="Davomat saqlandi" footer={[]} open={success} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={successImg} alt="" />
            </Modal>
            <Modal title="Davomatni saqlashda xatolik" footer={[]} open={fail} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={failImg} alt="" />
                <p style={{ textAlign: "center", fontSize: "25px" }}>{errorText}</p>
            </Modal>
            <form autoComplete='off' onSubmit={async (e) => {
                e.preventDefault();
                const userId = e.target[0].value;

                try {
                    await createDavomat({ user_id: userId, date: moment().tz("Asia/Tashkent").format() }).unwrap();
                    setSuccess(true);
                    e.target[0].value = "";

                    setTimeout(() => {
                        setSuccess(false);
                        e.target[0].focus();
                    }, 1000);
                } catch (error) {
                    console.error(error);

                    setFail(true);
                    setErrorText(error?.data?.message || "Noma'lum xatolik");

                    setTimeout(() => {
                        setFail(false);
                        setErrorText("");
                        e.target[0].value = "";
                        e.target[0].focus();
                    }, 1000);
                }
            }} className="scan_form">

                <input autoFocus type="text" placeholder='Qr kodni skaner qiling' />
                <img src={scangif} alt="" />
            </form>
        </div>
    );
};


export default Scanqr;