import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPassword() {
    const [userCreds, setUserCreds] = useState({
        email: "",
    });

    const [message, setMessage] = useState({
        type: "invisible-msg",
        text: "Dummy Msg"
    });

    const navigate = useNavigate();
    const loggedData = useContext(UserContext);

    console.log("logged data:", loggedData);

    function handleInput(event) {
        setUserCreds((prevState) => {
            return { ...prevState, [event.target.name]: event.target.value };
        });
    }

    function handleSubmit(event) {
        event.preventDefault();
        console.log(userCreds);

        fetch("https://galwin-7487fa6a2294.herokuapp.com/forgotpassword", {
            method: "POST",
            body: JSON.stringify(userCreds),
            headers: {
                "Content-type": "application/json"
            }
        })
        .then(response => {
            if (response.status === 404) {
                setMessage({ type: "error", text: "Email Bulunumadı" });
            } else if (response.status === 403) {
                setMessage({ type: "error", text: "Hatalı Şifre" });
            } else if (response.status === 500) {
                setMessage({ type: "error", text: "Sunucu Hatası" });
            } else {
                return response.json();
            }

            setTimeout(() => {
                setMessage({ type: "invisible-msg", text: "Dummy Msg" });
            }, 10000); // Adjusted timeout to 10 seconds

        })
        .then(data => {
            if (data && data.Status === "Success") {
                setMessage({ type: "success", text: "Şifre yenileme emaili gönderildi! Spam dosyanızı kontrol edin!" });
            }
        })
        .catch(err => {
            console.error("Request failed", err);
            setMessage({ type: "error", text: "Bir hata oluştu, lütfen tekrar deneyin." });
        });
    }

    return (
        <section className="container">
            <form className="form" onSubmit={handleSubmit}>
                <h1>Şifre Yenileme</h1>
                <input
                    className="inp"
                    type="email"
                    onChange={handleInput}
                    placeholder="Email Girin"
                    name="email"
                    value={userCreds.email}
                    required
                />
                <button className="btn">Yolla</button>
                <div className="forgotPass-p">
                    <p>Üye misiniz? <Link to="/login">Giriş Yapın</Link></p>
                    <p className={message.type}>{message.text}</p>
                </div>
            </form>
        </section>
    );
}