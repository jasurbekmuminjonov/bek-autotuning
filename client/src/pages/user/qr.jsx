import React from 'react';

const Qr = () => {
    const userId = localStorage.getItem('user_id');
    return (
        <div className='qr_container'>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${userId}`} alt={userId} />
            <p>Ehtimoliy vaziyatlar uchun screenshot qilib olishni maslahat beramiz</p>
        </div>
    );
};


export default Qr;